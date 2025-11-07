"use client";

import { Users, BarChart3, ClipboardList, UserCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminDashboardPage() {
  const stats = [
    {
      title: "Total Users",
      value: "1,245",
      icon: Users,
      color: "text-blue-600",
    },
    {
      title: "Active Classes",
      value: "38",
      icon: ClipboardList,
      color: "text-green-600",
    },
    {
      title: "Pending Approvals",
      value: "12",
      icon: UserCheck,
      color: "text-yellow-600",
    },
    {
      title: "Reports Generated",
      value: "57",
      icon: BarChart3,
      color: "text-indigo-600",
    },
  ];

  const recentActions = [
    { user: "John Doe", action: "Approved Teacher Role", time: "2h ago" },
    { user: "Jane Smith", action: "Created Class 10A", time: "5h ago" },
    { user: "Mark Lee", action: "Rejected Parent Request", time: "1d ago" },
  ];

  return (
    <>
      {/* Dashboard Overview */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ title, value, icon: Icon, color }) => (
          <Card
            key={title}
            className="hover:shadow-md transition-all border border-border"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
              <Icon className={`w-5 h-5 ${color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold">{value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          {recentActions.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-between border-b last:border-none pb-3 last:pb-0"
            >
              <div>
                <p className="font-medium text-foreground">{item.user}</p>
                <p className="text-sm text-muted-foreground">{item.action}</p>
              </div>
              <span className="text-xs text-muted-foreground">{item.time}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
