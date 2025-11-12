"use client";

import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
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
  email: string;
}

interface ClassType {
  _id: string;
  className: string;
  section: string;
}

interface Subject {
  _id: string;
  subjectName: string;
}

export default function CreateTeacherPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [users, setUsers] = useState<User[]>([]);
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phoneNumber: "",
    dateOfBirth: "",
    gender: "",
    qualification: "",
    degree: "",
    university: "",
    specialization: [] as string[],
    employmentType: "full-time",
    subjects: [] as string[],
    classTeacherOf: "",
    status: "active",
    address: "",
    emergencyContact: "",
    joiningDate: "",
  });

  // Fetch users, classes, and subjects
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, classesRes, subjectsRes] = await Promise.all([
          axios.get("/api/admin/users", {
            params: { role: "teacher", approvalStatus: "pending" },
          }),
          axios.get("/api/classes"),
          axios.get("/api/subjects"),
        ]);

        setUsers(usersRes.data.users || []);
        setClasses(classesRes.data.data || []);
        setSubjects(subjectsRes.data.data || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecializationSelect = (val: string) => {
    setForm((prev) => ({
      ...prev,
      specialization: prev.specialization.includes(val)
        ? prev.specialization.filter((s) => s !== val)
        : [...prev.specialization, val],
    }));
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
    if (
      !form.email ||
      !form.password ||
      !form.firstName ||
      !form.lastName ||
      !form.qualification ||
      !form.specialization.length ||
      !form.employmentType
    ) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/teachers", {
        ...form,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
        joiningDate: form.joiningDate ? new Date(form.joiningDate) : undefined,
      });
      toast({ title: "✅ Teacher created successfully" });
      router.push("/admin/teachers");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to create teacher";
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
            Create Teacher
          </h2>
          <p className="text-sm text-muted-foreground">Add a new teacher</p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <Input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
            <Input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <Input
              name="phoneNumber"
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={handleChange}
            />
            <Input
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth}
              onChange={handleChange}
            />
            <Select
              value={form.gender}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, gender: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="qualification"
              placeholder="Qualification"
              value={form.qualification}
              onChange={handleChange}
              required
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
          </div>

          {/* Specializations */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Specialization
            </label>
            <div className="flex flex-wrap gap-2">
              {["Math", "Science", "English", "History", "Art"].map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => handleSpecializationSelect(s)}
                  className={`px-3 py-1 rounded border ${
                    form.specialization.includes(s)
                      ? "bg-primary text-white"
                      : "border-border text-foreground"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Employment & Subjects */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Select
              value={form.classTeacherOf}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, classTeacherOf: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Class Teacher Of (optional)" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.className} ({c.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Address & Emergency */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
            />
            <Input
              name="emergencyContact"
              placeholder="Emergency Contact"
              value={form.emergencyContact}
              onChange={handleChange}
            />
            <Input
              name="joiningDate"
              type="date"
              placeholder="Joining Date"
              value={form.joiningDate}
              onChange={handleChange}
            />
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
              {submitting ? "Creating..." : "Create Teacher"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
