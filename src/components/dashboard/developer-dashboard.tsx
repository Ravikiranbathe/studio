'use client';

import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { useFirestore, useCollection, useMemoFirebase, WithId, useUser } from '@/firebase';
import { collection, query, DocumentData, orderBy } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';

interface Project extends DocumentData {
  id: string;
  title: string;
  companyId: string;
  budget: number;
  techStack: string;
  createdAt: string;
  description: string;
}

export default function DeveloperDashboard() {
  const firestore = useFirestore();
  const { isUserLoading } = useUser();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'));
  }, [firestore]);
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const isLoading = projectsLoading || isUserLoading;

  return (
    <div className="grid gap-6">
      {isLoading ? (
        Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-12 w-full mb-4" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-8 w-24" />
                <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))
      ) : (
        projects && projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project.id}>
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <CardDescription>
                  Posted {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <p className="text-muted-foreground leading-relaxed line-clamp-2">{project.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <span className="font-semibold text-lg text-primary">${project.budget.toLocaleString()}</span>
                  <div className="flex flex-wrap gap-2">
                    {project.techStack.split(',').map(skill => (
                      <Badge key={skill.trim()} variant="secondary" className="font-mono">{skill.trim()}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    View Project and Apply
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center text-muted-foreground py-16 col-span-full rounded-lg border border-dashed">
            <h3 className="text-xl font-semibold">No Projects Found</h3>
            <p className="mt-2">There are currently no open projects. Check back soon!</p>
          </div>
        )
      )}
    </div>
  )
}
