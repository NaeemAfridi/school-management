"use client";

import { ReactNode } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashbaordSidebar } from "./DashboardSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role: "student" | "parent" | "teacher" | "admin";
  userName?: string;
}

export function DashboardLayout({
  children,
  role,
  userName,
}: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <DashbaordSidebar role={role} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <DashboardHeader role={role} userName={userName} />
        <main className="flex-1 p-6 md:p-10">{children}</main>
      </div>
    </div>
  );
}
