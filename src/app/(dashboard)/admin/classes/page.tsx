"use client";

import { useEffect, useCallback, useState } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";

interface ClassType {
  _id: string;
  className: string;
  section: string;
  academicYear: string;
  classTeacherId: { name: string } | null;
  subjects: Array<{ _id: string; subjectName: string }>;
  students: string[];
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClasses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const { data } = await axios.get("/api/classes");
      setClasses(data.data || []);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to fetch classes";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await axios.delete(`/api/classes/${id}`);
      fetchClasses();
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Delete failed";
      console.error(message);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Classes</h2>
        <Link
          href="/admin/classes/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + Create Class
        </Link>
      </div>

      <table className="w-full border border-border bg-background rounded-lg">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Class Name</th>
            <th className="p-3">Section</th>
            <th className="p-3">Academic Year</th>
            <th className="p-3">Teacher</th>
            <th className="p-3">Students</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                Loading classes...
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

          {!loading && !error && classes.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={6}>
                No classes available.
              </td>
            </tr>
          )}

          {!loading &&
            !error &&
            classes.map((cls) => (
              <tr
                key={cls._id}
                className="border-t border-border hover:bg-muted/40"
              >
                <td className="p-3">{cls.className}</td>
                <td className="p-3">{cls.section}</td>
                <td className="p-3">{cls.academicYear}</td>
                <td className="p-3">{cls.classTeacherId?.name || "—"}</td>
                <td className="p-3">{cls.students.length}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => console.log("View", cls)}
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                  <Link
                    href={`/admin/classes/${cls._id}/edit`}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(cls._id)}
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
