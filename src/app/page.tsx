import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Code, Palette, Rocket } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { placeHolderImages } from "@/lib/placeholder-images";
import Logo from "@/components/logo";

export default function Home() {
  const heroImage = placeHolderImages.find(p => p.id === 'landing-hero-1');

  const featuredProjects = [
    {
      id: "1",
      title: "E-commerce Platform Redesign",
      company: "Shopify",
      budget: 8000,
      skills: ["UI/UX", "React", "Figma"],
    },
    {
      id: "2",
      title: "Mobile App for Fitness Tracking",
      company: "Fitbit",
      budget: 12000,
      skills: ["React Native", "Firebase", "Node.js"],
    },
    {
      id: "3",
      title: "Data Visualization Dashboard",
      company: "DataBricks",
      budget: 6500,
      skills: ["D3.js", "Python", "SQL"],
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-4 lg:px-6 h-16 flex items-center bg-background border-b">
        <Link href="/" className="flex items-center justify-center">
          <Logo className="h-6 w-6 text-primary" />
          <span className="sr-only">CollabHub</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <Button variant="ghost" asChild>
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <Link href="/signup">Sign Up</Link>
          </Button>
        </nav>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none font-headline">
                    Where Great Ideas Meet Great Talent
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    CollabHub is the premier platform for companies to connect
                    with top-tier developers and designers for project-based work.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-accent-foreground">
                    <Link href="/signup">
                      Find a Project
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild>
                    <Link href="/signup">
                      Post a Job
                    </Link>
                  </Button>
                </div>
              </div>
              {heroImage &&
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={400}
                  data-ai-hint={heroImage.imageHint}
                  className="mx-auto aspect-video overflow-hidden rounded-xl object-cover sm:w-full lg:order-last lg:aspect-square"
                />
              }
            </div>
          </div>
        </section>
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">How It Works</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">A Simple, Transparent Process</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  We streamline the connection between companies and talent with a clear and fair workflow.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-start gap-12 sm:grid-cols-2 md:grid-cols-3 lg:gap-16 mt-12">
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Rocket className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">1. Post a Project</h3>
                <p className="text-sm text-muted-foreground">Companies define their project scope, budget, and needed skills.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Code className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">2. Apply & Submit</h3>
                <p className="text-sm text-muted-foreground">Talent applies, and shortlisted candidates submit their designs or code.</p>
              </div>
              <div className="grid gap-1 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground mb-4">
                  <Palette className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold font-headline">3. Select & Compensate</h3>
                <p className="text-sm text-muted-foreground">Companies choose the winner. Both winners and participants are fairly compensated.</p>
              </div>
            </div>
          </div>
        </section>
        <section id="featured-projects" className="w-full py-12 md:py-24 lg:py-32 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl font-headline">Featured Projects</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Explore some of the exciting opportunities available now on CollabHub.
                </p>
              </div>
            </div>
            <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
              {featuredProjects.map(project => (
                <Card key={project.id}>
                  <CardHeader>
                    <CardTitle>{project.title}</CardTitle>
                    <CardDescription>{project.company}</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="font-semibold">${project.budget.toLocaleString()} Budget</div>
                    <div className="flex flex-wrap gap-2">
                      {project.skills.map(skill => (
                        <div key={skill} className="text-sm px-2 py-1 bg-muted rounded-md">{skill}</div>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/login">View Project</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">&copy; 2024 CollabHub. All rights reserved.</p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Terms of Service
          </Link>
          <Link href="#" className="text-xs hover:underline underline-offset-4">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
