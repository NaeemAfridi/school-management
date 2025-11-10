// ============================================
// File: app/admin/users/page.tsx
// Server component that shows UsersTable (client)
// ============================================

import React from "react";
import UsersTable from "@/components/admin/UsersTable";

export default function AdminUsersPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Users</h1>
        <div className="text-sm text-gray-600">
          Manage users: approve, edit, or remove
        </div>
      </div>

      <UsersTable />
    </div>
  );
}
