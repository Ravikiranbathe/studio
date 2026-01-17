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

export default function CompanyLoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Company Log In</CardTitle>
        <CardDescription>
          Access your company dashboard to manage projects and applicants.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="hr@mycompany.com" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" asChild>
            <Link href="/company/dashboard">Log in</Link>
        </Button>
        <div className="text-sm text-muted-foreground">
          Don't have a company account?{" "}
          <Link href="/signup" className="underline font-medium text-primary">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  )
}
