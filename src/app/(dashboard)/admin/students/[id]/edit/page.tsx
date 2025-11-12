"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import { useRouter, useParams } from "next/navigation";
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
  username: string;
  firstName: string;
  lastName: string;
  email: string;
}

interface ClassType {
  _id: string;
  className: string;
  section: string;
}

interface StudentForm {
  userId: string;
  studentId: string;
  classId: string;
  section: string;
  rollNumber: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
}

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const studentIdParam = params.id as string;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [form, setForm] = useState<StudentForm>({
    userId: "",
    studentId: "",
    classId: "",
    section: "",
    rollNumber: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
  });

  // Fetch student, users, and classes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [studentRes, usersRes, classesRes] = await Promise.all([
          axios.get(`/api/students/${studentIdParam}`),
          axios.get("/api/admin/users", {
            params: { role: "student", approvalStatus: "approved", limit: 100 },
          }),
          axios.get("/api/classes"),
        ]);

        const studentData = studentRes.data.users;
        setForm({
          userId: studentData.userId._id,
          studentId: studentData.studentId || "",
          classId: studentData.classId,
          section: studentData.section || "",
          rollNumber: studentData.rollNumber || "",
          dateOfBirth: studentData.dateOfBirth
            ? new Date(studentData.dateOfBirth).toISOString().split("T")[0]
            : "",
          gender: studentData.gender || "",
          bloodGroup: studentData.bloodGroup || "",
        });

        setUsers(usersRes.data.data || []);
        setClasses(classesRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [studentIdParam, toast]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.userId || !form.studentId || !form.classId || !form.rollNumber) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.put(`/api/students/${studentIdParam}`, form);
      toast({ title: "✅ Student updated successfully" });
      router.push("/admin/students");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to update student";
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
      <p className="text-center py-12 text-muted-foreground">
        Loading student data...
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="rounded-2xl shadow-md border border-border">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">
            Edit Student
          </h2>
          <p className="text-sm text-muted-foreground">
            Update student profile details
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

          {/* Class Select */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Select Class
            </label>
            <Select
              value={form.classId}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, classId: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.className} {cls.section ? `- ${cls.section}` : ""}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Student Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="studentId"
              placeholder="Student ID"
              value={form.studentId}
              onChange={handleChange}
              required
            />
            <Input
              name="rollNumber"
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="section"
              placeholder="Section (optional)"
              value={form.section}
              onChange={handleChange}
            />
            <Input
              name="dateOfBirth"
              type="date"
              placeholder="Date of Birth"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
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
            <select
              name="bloodGroup"
              value={form.bloodGroup}
              onChange={handleChange}
              className="border border-border rounded px-2 py-2 bg-background"
            >
              <option value="">Blood Group</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
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
              {submitting ? "Updating..." : "Update Student"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
