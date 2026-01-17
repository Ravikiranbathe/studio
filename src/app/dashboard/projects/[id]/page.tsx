'use client'

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useFirestore, useUser, useDoc, useMemoFirebase, errorEmitter, FirestorePermissionError } from "@/firebase"
import { addDoc, collection, doc } from "firebase/firestore"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"
import { generateProposal } from "@/ai/ai-proposal-generator"

const applicationFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  resumeUrl: z.string().url({ message: "Please enter a valid URL for your resume." }),
  linkedinUrl: z.string().url({ message: "Please enter a valid LinkedIn URL." }).optional().or(z.literal('')),
  githubUrl: z.string().url({ message: "Please enter a valid GitHub URL." }).optional().or(z.literal('')),
  proposal: z.string().min(100, {
    message: "Proposal must be at least 100 characters.",
  }),
});

type ApplicationFormValues = z.infer<typeof applicationFormSchema>

export default function ProjectDetailsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isGenerating, setIsGenerating] = React.useState(false);

  const projectRef = useMemoFirebase(() => {
    if (!firestore || !params.id) return null;
    return doc(firestore, "projects", params.id);
  }, [firestore, params.id]);
  const { data: project, isLoading: projectLoading } = useDoc(projectRef);

  const form = useForm<ApplicationFormValues>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      name: user?.displayName || "",
      email: user?.email || "",
      resumeUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      proposal: "",
    },
  });

  React.useEffect(() => {
    if (user) {
      form.reset({
        name: user.displayName || "",
        email: user.email || "",
        resumeUrl: "",
        linkedinUrl: "",
        githubUrl: "",
        proposal: "",
      });
    }
  }, [user, form]);


  const handleGenerateProposal = async () => {
    if (!project) return;
    setIsGenerating(true);
    try {
      const response = await generateProposal({
        projectTitle: project.title,
        projectDescription: project.description,
        techStack: project.techStack,
        // In a real app, you might fetch these from a database
        successfulApplicationExamples: "Example 1: I built a similar app and scaled it to 100k users. Example 2: My expertise in Next.js and Firebase is a perfect match for this project.",
      });
      form.setValue("proposal", response.proposal);
      toast({
        title: "Proposal Generated!",
        description: "The AI has drafted a proposal for you. Feel free to edit it.",
      });
    } catch (error) {
      console.error("Failed to generate proposal:", error);
      toast({
        variant: "destructive",
        title: "AI Assistant Error",
        description: "Could not generate a proposal at this time.",
      });
    } finally {
      setIsGenerating(false);
    }
  };


  function onSubmit(data: ApplicationFormValues) {
    if (!firestore || !user || !project) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to apply for a project.",
      });
      return;
    }

    setIsSubmitting(true);

    const applicationData = {
      projectId: project.id,
      developerId: user.uid,
      developerName: data.name,
      developerEmail: data.email,
      resumeUrl: data.resumeUrl,
      linkedinUrl: data.linkedinUrl || '',
      githubUrl: data.githubUrl || '',
      proposalText: data.proposal,
      status: "Submitted",
      submittedAt: new Date().toISOString(),
    };
    
    const applicationsCollection = collection(firestore, `projects/${project.id}/applications`);

    addDoc(applicationsCollection, applicationData)
      .then(() => {
        toast({
          title: "Application Submitted!",
          description: "Your proposal has been sent to the company.",
        });
        router.push("/dashboard");
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: `projects/${project.id}/applications`,
          operation: 'create',
          requestResourceData: applicationData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  if (projectLoading || isUserLoading) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/4" />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-20 w-full" />
                    </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-40 w-full" />
                    <Skeleton className="h-10 w-32 mt-4" />
                </CardContent>
            </Card>
        </div>
    );
  }

  if (!project) {
    return <div>Project not found.</div>
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-headline">{project.title}</CardTitle>
          <CardDescription>
            Deadline: {format(new Date(project.deadline), "PPP")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-2">Project Description</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{project.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Budget</h3>
                    <p className="text-2xl font-bold text-primary">${project.budget.toLocaleString()}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg mb-2">Required Skills</h3>
                    <div className="flex flex-wrap gap-2">
                        {project.techStack.split(',').map((skill: string) => (
                            <Badge key={skill.trim()} variant="secondary" className="font-mono">{skill.trim()}</Badge>
                        ))}
                    </div>
                </div>
            </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
            <CardTitle>Apply for this Project</CardTitle>
            <CardDescription>Submit your proposal below. Make it stand out!</CardDescription>
        </CardHeader>
        <CardContent>
            <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                 <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="John Doe" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="resumeUrl"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Resume/CV Link</FormLabel>
                        <FormControl>
                            <Input placeholder="https://example.com/my-resume.pdf" {...field} />
                        </FormControl>
                        <FormDescription>
                            Link to your online resume (e.g., Google Drive, Dropbox, personal site).
                        </FormDescription>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="linkedinUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>LinkedIn Profile <span className="text-muted-foreground">(Optional)</span></FormLabel>
                            <FormControl>
                                <Input placeholder="https://linkedin.com/in/yourprofile" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="githubUrl"
                        render={({ field }) => (
                            <FormItem>
                            <FormLabel>GitHub Profile <span className="text-muted-foreground">(Optional)</span></FormLabel>
                            <FormControl>
                                <Input placeholder="https://github.com/yourusername" {...field} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                control={form.control}
                name="proposal"
                render={({ field }) => (
                    <FormItem>
                    <div className="flex justify-between items-center">
                        <FormLabel>Your Proposal</FormLabel>
                         <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleGenerateProposal}
                            disabled={isGenerating}
                        >
                            <Sparkles className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Generating...' : 'Generate with AI'}
                        </Button>
                    </div>
                    <FormControl>
                        <Textarea
                        placeholder="Explain why you're the perfect fit for this project. Highlight your relevant experience and how you'll approach the work."
                        className="min-h-[200px]"
                        {...field}
                        />
                    </FormControl>
                    <FormDescription>
                        This is your chance to impress the company. Be clear, concise, and professional.
                    </FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <Button type="submit" disabled={isSubmitting || isGenerating || isUserLoading} className="bg-accent hover:bg-accent/90 text-accent-foreground">
                {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
            </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
