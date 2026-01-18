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
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { collection, query, DocumentData, orderBy, limit } from 'firebase/firestore';
import { Skeleton } from './ui/skeleton';
import { Badge } from './ui/badge';

interface Project extends DocumentData {
  id: string;
  title: string;
  companyName: string;
  budget: number;
  techStack: string;
}

export default function FeaturedProjects() {
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'projects'), orderBy('createdAt', 'desc'), limit(3));
  }, [firestore]);
  
  const { data: projects, isLoading } = useCollection<Project>(projectsQuery);

  if (isLoading) {
    return (
      <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/4 mt-2" />
            </CardHeader>
            <CardContent className="grid gap-2">
              <Skeleton className="h-6 w-1/3" />
               <div className="flex flex-wrap gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
            </CardContent>
            <CardFooter>
              <Skeleton className="h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  if (!projects || projects.length === 0) {
      return (
          <div className="text-center text-muted-foreground py-16 col-span-full rounded-lg border border-dashed mt-12">
            <h3 className="text-xl font-semibold">No Featured Projects</h3>
            <p className="mt-2">There are currently no open projects. Check back soon!</p>
          </div>
      )
  }

  return (
    <div className="mx-auto grid gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3 mt-12">
      {projects.map(project => (
        <Card key={project.id}>
          <CardHeader>
            <CardTitle>{project.title}</CardTitle>
            <CardDescription>{project.companyName}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="font-semibold">${project.budget.toLocaleString()} Budget</div>
            <div className="flex flex-wrap gap-2">
              {project.techStack.split(',').map(skill => (
                  <Badge key={skill.trim()} variant="secondary" className="font-mono">{skill.trim()}</Badge>
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
  )
}
