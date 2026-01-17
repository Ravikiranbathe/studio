'use client';

import React, { useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, Briefcase, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useUser, useFirestore, useCollection, useMemoFirebase, WithId } from '@/firebase';
import { collection, query, where, onSnapshot, getDoc, doc, getDocs, DocumentData } from 'firebase/firestore';
import { Skeleton } from '../ui/skeleton';
import { placeHolderImages } from '@/lib/placeholder-images';

interface Project extends DocumentData {
  id: string;
  title: string;
  company: string;
  proposals: number;
  createdAt: string;
}

interface Application extends DocumentData {
  id: string;
  developerId: string;
  developerName: string;
  developerAvatar: string;
  projectName: string;
  status: string;
  submittedAt: string;
  projectId: string;
}

export default function CompanyDashboard() {
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();

  const projectsQuery = useMemoFirebase(() => {
    if (!user || !firestore) return null;
    return query(collection(firestore, 'projects'), where('companyId', '==', user.uid));
  }, [firestore, user]);
  const { data: projects, isLoading: projectsLoading } = useCollection<Project>(projectsQuery);

  const [applications, setApplications] = useState<WithId<Application>[]>([]);
  const [applicationsLoading, setApplicationsLoading] = useState(true);

  useEffect(() => {
    if (!projects || projectsLoading || !firestore) {
      if(!projectsLoading) setApplicationsLoading(false);
      return;
    };
    
    if (projects.length === 0) {
      setApplications([]);
      setApplicationsLoading(false);
      return;
    }

    setApplicationsLoading(true);

    const unsubscribers = projects.map((project) => {
      const q = collection(firestore, `projects/${project.id}/applications`);
      return onSnapshot(q, async (snapshot) => {
        const projectApplications = await Promise.all(snapshot.docs.map(async (d) => {
            const appData = d.data() as Application;
            
            const developerName = appData.developerName || 'Unknown';
            const devAvatar = placeHolderImages.find(p => p.id === 'dev-avatar-1')?.imageUrl || '';

            return {
                ...appData,
                id: d.id,
                projectId: project.id,
                projectName: project.title,
                developerName: developerName,
                developerAvatar: devAvatar, // Using a placeholder for now
                submittedAt: appData.submittedAt ? new Date(appData.submittedAt).toISOString() : new Date().toISOString(),
            }
        }));

        setApplications((currentApps) => {
          const otherApps = currentApps.filter(
            (app) => app.projectId !== project.id
          );
          return [...otherApps, ...projectApplications];
        });
      });
    });

    const checkLoading = async () => {
      await Promise.all(projects.map(p => getDocs(collection(firestore, `projects/${p.id}/applications`))));
      setApplicationsLoading(false);
    }
    checkLoading();

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [projects, firestore, projectsLoading]);

  const isLoading = projectsLoading || isUserLoading || applicationsLoading;

  const projectsPosted = projects?.length || 0;
  const proposalsReceived = applications?.length || 0;
  const developersHired = applications?.filter(app => app.status === 'Accepted').length || 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 md:gap-8 pt-4">
        <div className="grid gap-4 md:grid-cols-3">
          <Card><CardHeader><Skeleton className="h-4 w-24" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-32" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-4 w-28" /></CardHeader><CardContent><Skeleton className="h-8 w-12" /></CardContent></Card>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
          <Card><CardHeader><CardTitle>Active Projects</CardTitle></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
          <Card><CardHeader><CardTitle>Manage Applicants</CardTitle></CardHeader><CardContent><Skeleton className="h-32 w-full" /></CardContent></Card>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:gap-8 pt-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Projects Posted</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projectsPosted}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Proposals Received</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{proposalsReceived}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Developers Hired</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{developersHired}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Active Projects</CardTitle>
              <CardDescription>Your currently active projects.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/company/dashboard">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project</TableHead>
                  <TableHead className="hidden sm:table-cell text-center">Proposals</TableHead>
                  <TableHead className="text-right">Posted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects && projects.slice(0, 3).map((project) => (
                  <TableRow key={project.id}>
                    <TableCell>
                      <div className="font-medium">{project.title}</div>
                      <div className="text-sm text-muted-foreground">{project.company}</div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-center">
                      <Badge variant="outline">{applications.filter(a => a.projectId === project.id).length}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Manage Applicants</CardTitle>
              <CardDescription>Recent proposals for your projects.</CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/company/dashboard">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead className="hidden sm:table-cell">Status</TableHead>
                  <TableHead className="text-right">Submitted</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applications.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()).slice(0, 5).map((proposal) => (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={proposal.developerAvatar} alt="Avatar" />
                          <AvatarFallback>{proposal.developerName?.charAt(0) || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="grid gap-0.5">
                          <div className="font-medium">{proposal.developerName}</div>
                          <div className="text-sm text-muted-foreground">{proposal.projectName}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge variant={
                        proposal.status === "Contacted" ? "default" :
                        proposal.status === "In Review" ? "secondary" : "outline"
                      }>{proposal.status}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {formatDistanceToNow(new Date(proposal.submittedAt), { addSuffix: true })}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
