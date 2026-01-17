
"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Building, Code } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useAuth, useFirestore, useUser } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function SignupPage() {
  const [role, setRole] = useState("developer");
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const auth = useAuth();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!isUserLoading && user) {
        // After signup and login, redirect based on role selected during signup.
        if (role === 'company') {
          router.push('/company/dashboard');
        } else {
          router.push('/dashboard');
        }
    }
  }, [user, isUserLoading, router, role]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) return;

    setIsLoading(true);
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const firebaseUser = userCredential.user;

        // Set the user's display name
        await updateProfile(firebaseUser, { displayName: name });

        // Create the user profile document in Firestore
        const userProfile: { [key: string]: any } = {
            id: firebaseUser.uid,
            role: role,
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
        };

        if (role === 'developer') {
            userProfile.skills = '';
            userProfile.portfolioUrl = '';
        }

        await setDoc(doc(firestore, "users", firebaseUser.uid), userProfile);

        toast({
            title: "Account Created!",
            description: "You've been successfully signed up.",
        });

        // The useEffect will handle the redirect.
    } catch(error: any) {
        let description = "Could not create your account.";
        if (error.code === 'auth/email-already-in-use') {
          description = "An account with this email already exists. Please log in instead.";
        } else {
          description = error.message || description;
        }
        toast({
            variant: "destructive",
            title: "Sign Up Failed",
            description: description,
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <form onSubmit={handleSignup}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Join CollabHub and start your journey.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <div
            className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${
              role === "developer" ? "border-primary bg-primary/10" : "border-border"
            }`}
            onClick={() => setRole("developer")}
          >
            <Code className="h-8 w-8 text-primary" />
            <span className="font-medium">Developer</span>
          </div>
          <div
            className={`cursor-pointer rounded-lg border-2 p-4 flex flex-col items-center justify-center gap-2 transition-all ${
              role === "company" ? "border-primary bg-primary/10" : "border-border"
            }`}
            onClick={() => setRole("company")}
          >
            <Building className="h-8 w-8 text-primary" />
            <span className="font-medium">Company</span>
          </div>
        </div>

        <RadioGroup
          defaultValue="developer"
          className="hidden"
          value={role}
          onValueChange={setRole}
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="developer" id="r1" />
            <Label htmlFor="r1">Developer</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="company" id="r2" />
            <Label htmlFor="r2">Company</Label>
          </div>
        </RadioGroup>
        <div className="grid gap-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="John Doe" value={name} onChange={e => setName(e.target.value)} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" value={email} onChange={e => setEmail(e.target.value)} required/>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" minLength={6} value={password} onChange={e => setPassword(e.target.value)} required/>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" disabled={isLoading || isUserLoading}>
          {isLoading || isUserLoading ? 'Signing up...' : 'Sign up'}
        </Button>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline font-medium text-primary">
            Log in
          </Link>
        </div>
      </CardFooter>
      </form>
    </Card>
  );
}
