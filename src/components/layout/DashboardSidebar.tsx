"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Home,
  BookOpen,
  CalendarCheck,
  BarChart3,
  User,
  Users,
  ClipboardList,
  Settings,
  Loader2,
  type LucideIcon,
  GraduationCap,
  UserCog,
  FileText,
  Wallet,
  CalendarClock,
} from "lucide-react";
import { cn } from "@/lib/utils";

type Role = "student" | "parent" | "teacher" | "admin";

const menuConfig: Record<
  Role,
  { name: string; href: string; icon: LucideIcon }[]
> = {
  student: [
    { name: "Dashboard", href: "/student", icon: Home },
    { name: "Classes", href: "/student/classes", icon: BookOpen },
    { name: "Attendance", href: "/student/attendance", icon: CalendarCheck },
    { name: "Results", href: "/student/results", icon: BarChart3 },
    { name: "Profile", href: "/student/profile", icon: User },
  ],
  parent: [
    { name: "Dashboard", href: "/parent", icon: Home },
    { name: "Children", href: "/parent/children", icon: Users },
    { name: "Attendance", href: "/parent/attendance", icon: CalendarCheck },
    { name: "Reports", href: "/parent/reports", icon: BarChart3 },
    { name: "Profile", href: "/parent/profile", icon: User },
  ],
  teacher: [
    { name: "Dashboard", href: "/teacher", icon: Home },
    { name: "My Classes", href: "/teacher/classes", icon: BookOpen },
    { name: "Attendance", href: "/teacher/attendance", icon: ClipboardList },
    { name: "Grades", href: "/teacher/grades", icon: BarChart3 },
    { name: "Profile", href: "/teacher/profile", icon: User },
  ],
  admin: [
    { name: "Dashboard", href: "/admin", icon: Home },
    { name: "Manage Users", href: "/admin/users", icon: Users },
    { name: "Classes", href: "/admin/classes", icon: BookOpen },
    { name: "Subjects", href: "/admin/subjects", icon: GraduationCap },
    { name: "Students", href: "/admin/students", icon: Users },
    { name: "Teachers", href: "/admin/teachers", icon: UserCog },
    { name: "Exams", href: "/admin/exams", icon: FileText },
    { name: "Fees", href: "/admin/fees", icon: Wallet },
    { name: "Timetable", href: "/admin/timetable", icon: CalendarClock },
    { name: "Reports", href: "/admin/reports", icon: BarChart3 },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ],
};

export function DashboardSidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();

  // Handle session states
  if (status === "loading") {
    return (
      <aside className="hidden md:flex flex-col w-64 border-r bg-white p-4 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500 w-6 h-6" />
      </aside>
    );
  }

  if (!session?.user) {
    router.push("/login");
    return null;
  }

  const role = session.user.role as Role;

  if (!role || !(role in menuConfig)) {
    router.push("/select-role");
    return null;
  }

  const menuItems = menuConfig[role];

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-white p-4">
      <div className="text-2xl font-bold text-indigo-600 mb-6 text-center">
        EduSmart
      </div>
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-2 rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition",
                active && "bg-indigo-100 text-indigo-600 font-medium"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
