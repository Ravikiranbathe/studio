'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useAuth, useUser, useFirestore } from "@/firebase";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

export default function CompanyLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  React.useEffect(() => {
    if (!isUserLoading && user) {
      router.push('/company/dashboard');
    }
  }, [user, isUserLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;
    setIsLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      const userDocRef = doc(firestore, "users", firebaseUser.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().role === 'company') {
         // Login successful, useEffect will redirect.
      } else {
        await auth.signOut();
        toast({
          variant: "destructive",
          title: "Access Denied",
          description: "This is not a company account. Please log in on the developer portal.",
        });
      }
    } catch (error: any) {
      let description = "An unexpected error occurred.";
      if (error.code === 'auth/invalid-credential') {
        description = "Invalid email or password. Please try again.";
      } else {
        description = error.message;
      }
      toast({
        variant: "destructive",
        title: "Log In Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleLogin}>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Company Log In</CardTitle>
          <CardDescription>
            Access your company dashboard to manage projects and applicants.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="hr@mycompany.com" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required/>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || isUserLoading}>
              {isLoading || isUserLoading ? 'Logging in...' : 'Log in'}
          </Button>
          <div className="text-sm text-muted-foreground">
            Don't have a company account?{" "}
            <Link href="/signup" className="underline font-medium text-primary">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
