'use client'

import DeveloperDashboard from "@/components/dashboard/developer-dashboard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight mb-1 font-headline">Available Projects</h1>
      <p className="text-muted-foreground mb-6">Browse and apply to projects that match your skills.</p>
      <DeveloperDashboard />
    </div>
  );
}
