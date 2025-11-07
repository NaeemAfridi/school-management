"use client";

import { Hourglass, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export default function PendingApprovalPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground px-4">
      <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md text-center">
        <Hourglass className="w-12 h-12 text-primary mx-auto mb-4 animate-pulse" />
        <h1 className="text-2xl font-semibold mb-2">Pending Approval</h1>
        <p className="text-muted-foreground mb-6">
          Your account is currently awaiting approval from the administrator.
          You’ll receive access to your dashboard once approved.
        </p>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2 px-4 rounded-lg hover:bg-primary/90 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
