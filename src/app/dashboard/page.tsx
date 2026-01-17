'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import DeveloperDashboard from "@/components/dashboard/developer-dashboard";
import CompanyDashboard from "@/components/dashboard/company-dashboard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-4 font-headline">Dashboard</h1>
      <Tabs defaultValue="developer" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
          <TabsTrigger value="developer">Developer View</TabsTrigger>
          <TabsTrigger value="company">Company View</TabsTrigger>
        </TabsList>
        <TabsContent value="developer">
          <DeveloperDashboard />
        </TabsContent>
        <TabsContent value="company">
          <CompanyDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
}
