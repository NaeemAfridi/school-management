"use client";

import { useState, useEffect, ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
}

interface PopulatedSubject {
  _id: string;
  subjectName: string;
}

interface PopulatedClass {
  _id: string;
  className: string;
  section: string;
}

interface Teacher {
  _id: string;
  teacherId: string;
  userId: PopulatedUser;
  subjects: PopulatedSubject[];
  employmentType: string;
  joiningDate: string;
  specialization: string[];
  classTeacherOf?: PopulatedClass;
  status?: string;
}

export default function TeachersPage() {
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTeachers = async (searchQuery = "") => {
    try {
      setLoading(true);
      const res = await axios.get("/api/teachers", {
        params: { search: searchQuery },
      });
      setTeachers(res.data.data || []);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to fetch teachers";
      toast({ title: message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this teacher?")) return;
    try {
      await axios.delete(`/api/teachers?id=${id}`);
      toast({ title: "Teacher deleted successfully" });
      fetchTeachers(search);
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Delete failed";
      toast({ title: message, variant: "destructive" });
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    fetchTeachers(e.target.value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">All Teachers</h2>
        <Link
          href="/admin/teachers/create"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition"
        >
          + Create Teacher
        </Link>
      </div>

      <input
        type="text"
        value={search}
        onChange={handleSearch}
        placeholder="Search by name or teacher ID..."
        className="w-full border border-border rounded px-3 py-2 mb-4"
      />

      <table className="w-full border border-border bg-background rounded-lg">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-3">Teacher ID</th>
            <th className="p-3">Name</th>
            <th className="p-3">Subjects</th>
            <th className="p-3">Specialization</th>
            <th className="p-3">Employment Type</th>
            <th className="p-3">Status</th>
            <th className="p-3">Class Teacher Of</th>
            <th className="p-3">Joining Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={9}>
                Loading Teachers...
              </td>
            </tr>
          )}

          {!loading && teachers.length === 0 && (
            <tr>
              <td className="p-4 text-center text-muted-foreground" colSpan={9}>
                No teachers found.
              </td>
            </tr>
          )}

          {!loading &&
            teachers.map((t) => (
              <tr
                key={t._id}
                className="border-t border-border hover:bg-muted/40"
              >
                <td className="p-3">{t.teacherId}</td>
                <td className="p-3">
                  {t.userId?.firstName} {t.userId?.lastName}
                </td>
                <td className="p-3">
                  {t.subjects.map((s) => s.subjectName).join(", ")}
                </td>
                <td className="p-3">{t.specialization.join(", ")}</td>
                <td className="p-3">{t.employmentType}</td>
                <td className="p-3">{t.status}</td>
                <td className="p-3">
                  {t.classTeacherOf
                    ? `${t.classTeacherOf.className} (${t.classTeacherOf.section})`
                    : "-"}
                </td>
                <td className="p-3">
                  {new Date(t.joiningDate).toLocaleDateString()}
                </td>
                <td className="p-3 flex gap-2">
                  <Link
                    href={`/admin/teachers/${t._id}/edit`}
                    className="text-yellow-600 hover:underline"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(t._id)}
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
