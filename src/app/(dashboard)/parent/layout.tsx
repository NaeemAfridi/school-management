import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { DashboardSidebar } from "@/components/layout/DashboardSidebar";
import React from "react";

export default function ParentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
