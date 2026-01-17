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
import { useState } from "react";

export default function SignupPage() {
  const [role, setRole] = useState("developer");

  return (
    <Card>
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
          <Input id="name" type="text" placeholder="John Doe" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
          <Link href="/dashboard">Sign up</Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="underline font-medium text-primary">
            Log in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
