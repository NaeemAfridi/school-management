"use client";

import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Edit, CheckSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface User {
  _id: string;
  email: string;
  username: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role: string;
  approvalStatus: string;
  isActive: boolean;
  createdAt: string;
}

export default function UsersTable() {
  //   const { data: session } = useSession();
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [approvalFilter, setApprovalFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<User | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const q = new URLSearchParams({
        page: String(page),
        limit: String(limit),
      });

      if (search) q.set("search", search);
      if (roleFilter && roleFilter !== "all") q.set("role", roleFilter);
      if (approvalFilter && approvalFilter !== "all")
        q.set("approvalStatus", approvalFilter);

      const { data } = await axios.get(`/api/admin/users?${q.toString()}`);
      setUsers(data.users);
      setTotal(data.total);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, roleFilter, approvalFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (search === "") {
      setPage(1);
      fetchUsers();
    }
  }, [search, fetchUsers]);

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`/api/admin/users/${id}`);
      setConfirmDelete(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.patch(`/api/admin/users/${id}`, {
        approvalStatus: "approved",
        isActive: true,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveEdit = async (form: Partial<User>) => {
    if (!editing) return;
    try {
      await axios.patch(`/api/admin/users/${editing._id}`, form);
      setEditing(null);
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-700">Approved</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-700">Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rejected</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Unknown</Badge>;
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <form onSubmit={onSearchSubmit} className="flex gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by email, username or name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button type="submit">Search</Button>
        </form>

        <div className="flex gap-2 items-center flex-wrap">
          <Select
            value={roleFilter}
            onValueChange={(val) => {
              setRoleFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Roles" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All roles</SelectItem>
              <SelectItem value="student">Student</SelectItem>
              <SelectItem value="teacher">Teacher</SelectItem>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={approvalFilter}
            onValueChange={(val) => {
              setApprovalFilter(val);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={String(limit)}
            onValueChange={(val) => {
              setLimit(Number(val));
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-100">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                User
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Role
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Status
              </th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                Joined
              </th>
              <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <div className="text-sm font-medium text-gray-900">
                      {u.firstName || u.username} {u.lastName}
                    </div>
                    <div className="text-xs text-gray-500">{u.email}</div>
                  </td>
                  <td className="px-4 py-3 text-sm capitalize text-gray-700">
                    {u.role}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    {getStatusBadge(u.approvalStatus)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    {u.approvalStatus === "pending" && (
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleApprove(u._id)}
                        title="Approve"
                      >
                        <CheckSquare className="h-4 w-4" />
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setEditing(u)}
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => setConfirmDelete(u)}
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between text-sm text-gray-600">
        <div>
          Showing {(page - 1) * limit + 1} - {Math.min(page * limit, total)} of{" "}
          {total}
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <div className="px-3 py-1 rounded bg-gray-100">
            {page} / {totalPages}
          </div>
          <Button
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </Button>
        </div>
      </div>

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setEditing(null)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md z-10">
            <h3 className="text-lg font-semibold mb-4">Edit User</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.currentTarget as HTMLFormElement);
                handleSaveEdit({
                  firstName: String(form.get("firstName") || ""),
                  lastName: String(form.get("lastName") || ""),
                  phoneNumber: String(form.get("phoneNumber") || ""),
                  role: String(form.get("role") || editing.role),
                  approvalStatus: String(
                    form.get("approvalStatus") || editing.approvalStatus
                  ),
                });
              }}
            >
              <div className="grid gap-3">
                <Input
                  name="firstName"
                  defaultValue={editing.firstName || ""}
                  placeholder="First name"
                />
                <Input
                  name="lastName"
                  defaultValue={editing.lastName || ""}
                  placeholder="Last name"
                />
                <Input
                  name="phoneNumber"
                  defaultValue={editing.phoneNumber || ""}
                  placeholder="Phone number"
                />
                <Select name="role" defaultValue={editing.role}>
                  <SelectTrigger>
                    <SelectValue placeholder="Role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="student">Student</SelectItem>
                    <SelectItem value="teacher">Teacher</SelectItem>
                    <SelectItem value="parent">Parent</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  name="approvalStatus"
                  defaultValue={editing.approvalStatus}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex justify-end gap-2 mt-4">
                  <Button
                    variant="ghost"
                    type="button"
                    onClick={() => setEditing(null)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit">Save</Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setConfirmDelete(null)}
          />
          <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 max-w-md z-10">
            <h3 className="text-lg font-semibold mb-4">Delete User</h3>
            <p className="mb-4 text-sm text-gray-700">
              Are you sure you want to delete{" "}
              <strong>{confirmDelete.email}</strong>? This action cannot be
              undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button variant="ghost" onClick={() => setConfirmDelete(null)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => handleDelete(confirmDelete._id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
