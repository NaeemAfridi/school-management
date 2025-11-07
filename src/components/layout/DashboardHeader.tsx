"use client";

import { Menu, LogOut, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function DashboardHeader({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") {
    return (
      <header className="flex items-center justify-between bg-white border-b px-4 py-3 sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <Loader2 className="animate-spin text-indigo-500 w-5 h-5" />
      </header>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  const role = session.user.role || "user";
  const userName = session.user.email || "User";

  return (
    <header className="flex items-center justify-between bg-white border-b px-4 py-3 sticky top-0 z-40">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-lg font-semibold text-gray-800 capitalize">
          {role} Dashboard
        </h1>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-3">
          <span className="text-gray-600 text-sm hidden sm:block">
            {userName}
          </span>
          <div className="h-8 w-8 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold">
            {userName[0]?.toUpperCase() || "U"}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut({ callbackUrl: "/login" })}
          title="Logout"
        >
          <LogOut className="h-5 w-5 text-gray-600 hover:text-red-500 transition" />
        </Button>
      </div>
    </header>
  );
}
