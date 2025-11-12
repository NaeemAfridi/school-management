"use client";

import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface StudentUser {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePhoto?: string;
}

interface StudentClass {
  _id: string;
  className: string;
  section: string;
}

interface StudentType {
  _id: string;
  studentId: string;
  rollNumber: string;
  userId: StudentUser;
  classId: StudentClass;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  const fetchStudents = useCallback(async (searchQuery?: string) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.set("search", searchQuery);
      const { data } = await axios.get(`/api/students?${params.toString()}`);
      setStudents(data.data || []);
    } catch (error) {
      console.error("❌ Error fetching students:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleSearch = async () => {
    setSearching(true);
    await fetchStudents(search.trim());
    setSearching(false);
  };

  return (
    <div className="space-y-6">
      {/* ====== HEADER ====== */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-2xl font-semibold">Students</h2>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Input
            placeholder="Search by name, ID, or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full sm:w-64"
          />
          <Button onClick={handleSearch} disabled={searching}>
            {searching ? (
              <>
                <Loader2 className="animate-spin mr-2 h-4 w-4" /> Searching
              </>
            ) : (
              "Search"
            )}
          </Button>
          <Link href="/admin/students/create">
            <Button className="bg-primary text-white hover:bg-primary/90">
              + Add Student
            </Button>
          </Link>
        </div>
      </div>

      {/* ====== TABLE ====== */}
      <div className="overflow-x-auto border border-border rounded-lg bg-background">
        <table className="w-full text-sm">
          <thead className="bg-muted text-left">
            <tr>
              <th className="p-3 font-medium">Student ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Class</th>
              <th className="p-3 font-medium">Roll No</th>
              <th className="p-3 font-medium text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="p-4 text-center text-muted-foreground"
                >
                  No students found
                </td>
              </tr>
            ) : (
              students.map((s) => (
                <tr
                  key={s._id}
                  className="border-t border-border hover:bg-muted/40 transition"
                >
                  <td className="p-3 font-medium">{s.studentId}</td>
                  <td className="p-3">
                    {s.userId?.firstName} {s.userId?.lastName}
                  </td>
                  <td className="p-3">{s.userId?.email}</td>
                  <td className="p-3">
                    {s.classId?.className} ({s.classId?.section})
                  </td>
                  <td className="p-3">{s.rollNumber}</td>
                  <td className="p-3 text-center">
                    <Link
                      href={`/admin/students/${s._id}/edit`}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
