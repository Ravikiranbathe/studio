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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { useFirestore, useUser, errorEmitter, FirestorePermissionError } from "@/firebase"
import { addDoc, collection } from "firebase/firestore"

const projectFormSchema = z.object({
  title: z.string().min(5, {
    message: "Title must be at least 5 characters.",
  }),
  description: z.string().min(20, {
    message: "Description must be at least 20 characters.",
  }),
  techStack: z.string().min(2, {
    message: "Please list at least one technology.",
  }),
  budget: z.coerce.number().positive({
    message: "Budget must be a positive number.",
  }),
  deadline: z.date({
    required_error: "A project deadline is required.",
  }),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>

export default function CreateProjectPage() {
  const { toast } = useToast();
  const router = useRouter();
  const firestore = useFirestore();
  const { user, isUserLoading } = useUser();
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      description: "",
      techStack: "",
    },
  });

  function onSubmit(data: ProjectFormValues) {
    if (!firestore || !user || isUserLoading) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to create a project.",
      });
      return;
    }

    setIsSubmitting(true);

    const projectData = {
      title: data.title,
      description: data.description,
      techStack: data.techStack,
      budget: data.budget,
      deadline: data.deadline.toISOString(),
      companyId: user.uid,
      createdAt: new Date().toISOString(),
      status: "open",
    };
    const projectsCollection = collection(firestore, "projects");

    addDoc(projectsCollection, projectData)
      .then(() => {
        toast({
          title: "Project Created!",
          description: "Your new project has been successfully posted.",
        });
        router.push("/company/dashboard");
      })
      .catch(async (error) => {
        const permissionError = new FirestorePermissionError({
          path: 'projects',
          operation: 'create',
          requestResourceData: projectData,
        });
        errorEmitter.emit('permission-error', permissionError);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Project</CardTitle>
        <CardDescription>Fill out the details below to find the perfect talent for your project.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., E-commerce Platform Redesign" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail. What are the goals, key features, and deliverables?"
                      className="min-h-[150px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="techStack"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Required Technologies</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., React, Next.js, Firebase, Stripe" {...field} />
                  </FormControl>
                   <FormDescription>
                    Enter a comma-separated list of required skills or technologies.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Budget (USD)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="deadline"
                render={({ field }) => (
                  <FormItem className="flex flex-col pt-2">
                    <FormLabel>Project Deadline</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date(new Date().setHours(0,0,0,0))
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" disabled={isSubmitting || isUserLoading}>
              {isSubmitting ? 'Posting Project...' : 'Post Project'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
