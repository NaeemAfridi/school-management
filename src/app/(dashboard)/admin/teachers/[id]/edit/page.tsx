"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
}

interface Subject {
  _id: string;
  subjectName: string;
}

interface TeacherForm {
  userId: string;
  teacherId: string;
  subjects: string[];
  specialization: string;
  employmentType: string;
  joiningDate: string;
  gender: string;
  degree: string;
  university: string;
}

export default function EditTeacherPage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const id = params.id;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [form, setForm] = useState<TeacherForm>({
    userId: "",
    teacherId: "",
    subjects: [],
    specialization: "",
    employmentType: "full-time",
    joiningDate: "",
    gender: "",
    degree: "",
    university: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, usersRes, subjectsRes] = await Promise.all([
          axios.get(`/api/teachers?id=${id}`),
          axios.get("/api/admin/users", {
            params: { role: "teacher", approvalStatus: "approved", limit: 100 },
          }),
          axios.get("/api/subjects"),
        ]);
        const teacher = teacherRes.data.data;
        setForm({
          userId: teacher.userId?._id || "",
          teacherId: teacher.teacherId || "",
          subjects: teacher.subjects.map((s: Subject) => s._id),
          specialization: teacher.specialization.join(", "),
          employmentType: teacher.employmentType || "full-time",
          joiningDate: teacher.joiningDate?.split("T")[0] || "",
          gender: teacher.gender || "",
          degree: teacher.degree || "",
          university: teacher.university || "",
        });
        setUsers(usersRes.data.users || []);
        setSubjects(subjectsRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, toast]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectSelect = (val: string) => {
    setForm((prev) => ({
      ...prev,
      subjects: prev.subjects.includes(val)
        ? prev.subjects.filter((s) => s !== val)
        : [...prev.subjects, val],
    }));
  };

  const handleSubmit = async () => {
    if (!form.userId || !form.teacherId || !form.subjects.length) {
      toast({ title: "Please fill required fields", variant: "destructive" });
      return;
    }
    try {
      setSubmitting(true);
      await axios.put(`/api/teachers?id=${id}`, form);
      toast({ title: "✅ Teacher updated successfully" });
      router.push("/admin/teachers");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to update teacher";
      toast({
        title: "❌ Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <p className="text-center py-12 text-muted-foreground">Loading...</p>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="rounded-2xl shadow-md border border-border">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">
            Edit Teacher
          </h2>
          <p className="text-sm text-muted-foreground">
            Update teacher profile
          </p>
        </CardHeader>
        <CardContent className="space-y-5">
          {/* User Select */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Select User
            </label>
            <Select
              value={form.userId}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, userId: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select user" />
              </SelectTrigger>
              <SelectContent>
                {users.map((u) => (
                  <SelectItem key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} ({u.username})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Teacher Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="teacherId"
              placeholder="Teacher ID"
              value={form.teacherId}
              onChange={handleChange}
              required
            />
            <Input
              name="specialization"
              placeholder="Specialization (comma separated)"
              value={form.specialization}
              onChange={handleChange}
            />
            <Input
              name="degree"
              placeholder="Degree"
              value={form.degree}
              onChange={handleChange}
            />
            <Input
              name="university"
              placeholder="University"
              value={form.university}
              onChange={handleChange}
            />
            <Input
              name="joiningDate"
              type="date"
              placeholder="Joining Date"
              value={form.joiningDate}
              onChange={handleChange}
            />
            <select
              name="employmentType"
              value={form.employmentType}
              onChange={handleChange}
              className="border border-border rounded px-2 py-2 bg-background"
            >
              <option value="full-time">Full-Time</option>
              <option value="part-time">Part-Time</option>
              <option value="contract">Contract</option>
            </select>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              className="border border-border rounded px-2 py-2 bg-background"
            >
              <option value="">Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          {/* Subjects */}
          <div>
            <label className="block mb-1 font-medium text-sm">Subjects</label>
            <div className="flex flex-wrap gap-2">
              {subjects.map((s) => (
                <button
                  key={s._id}
                  type="button"
                  onClick={() => handleSubjectSelect(s._id)}
                  className={`px-3 py-1 rounded border ${
                    form.subjects.includes(s._id)
                      ? "bg-primary text-white"
                      : "border-border text-foreground"
                  }`}
                >
                  {s.subjectName}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-white"
            >
              {submitting ? "Updating..." : "Update Teacher"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
