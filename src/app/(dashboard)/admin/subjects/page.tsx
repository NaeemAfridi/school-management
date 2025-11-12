"use client";

import { useEffect, useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";

interface SubjectType {
  _id: string;
  subjectName: string;
  subjectCode: string;
  category: string;
  credits?: number;
  totalMarks?: number;
  isActive: boolean;
  classes?: Array<{ _id: string; className: string }>;
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<SubjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("/api/subjects");
      setSubjects(data.data || []);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to fetch subjects";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this subject?")) return;
    try {
      await axios.delete(`/api/subjects/${id}`);
      fetchSubjects();
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Delete failed";
      console.error(message);
    }
  };

  const handleView = (sub: SubjectType) => {
    console.log("View", sub);
  };

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Subjects</h2>
        <Link
          href="/admin/subjects/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + Create Subject
        </Link>
      </div>

      {/* Subjects Table */}
      <table className="w-full border border-border bg-background rounded-lg">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Subject Name</th>
            <th className="p-3">Code</th>
            <th className="p-3">Category</th>
            <th className="p-3">Credits</th>
            <th className="p-3">Total Marks</th>
            <th className="p-3">Active</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                Loading subjects...
              </td>
            </tr>
          )}

          {!loading && error && (
            <tr>
              <td className="p-4 text-center text-red-500" colSpan={6}>
                {error}
              </td>
            </tr>
          )}

          {!loading && !error && subjects.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                No subjects available.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            subjects.map((sub) => (
              <tr
                key={sub._id}
                className="border-t border-border hover:bg-muted/40"
              >
                <td className="p-3 font-medium">{sub.subjectName}</td>
                <td className="p-3">{sub.subjectCode}</td>
                <td className="p-3 capitalize">{sub.category}</td>
                <td className="p-3">{sub.credits ?? "—"}</td>
                <td className="p-3">{sub.totalMarks ?? "—"}</td>
                <td className="p-3">
                  {sub.isActive ? (
                    <span className="text-green-600 font-medium">Active</span>
                  ) : (
                    <span className="text-red-500 font-medium">Inactive</span>
                  )}
                </td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleView(sub)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <Link
                    href={`/admin/subjects/${sub._id}/edit`}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
