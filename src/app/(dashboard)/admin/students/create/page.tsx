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

interface ClassType {
  _id: string;
  className: string;
  section: string;
}

interface ParentType {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export default function CreateStudentPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [classes, setClasses] = useState<ClassType[]>([]);
  const [parents, setParents] = useState<ParentType[]>([]);
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
    bloodGroup: "",
    address: "",
    classId: "",
    section: "",
    rollNumber: "",
    parentId: "",
    emergencyContact: "",
    admissionDate: "",
  });

  // =============== FETCH CLASSES & PARENTS ===============
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classRes, parentRes] = await Promise.all([
          axios.get("/api/classes"),
          axios.get("/api/admin/users", {
            params: { role: "parent", approvalStatus: "approved", limit: 100 },
          }),
        ]);
        setClasses(classRes.data.data || []);
        setParents(parentRes.data.users || []);
      } catch (err) {
        console.error(err);
        toast({ title: "Failed to load data", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [toast]);

  // =============== HANDLE INPUT CHANGES ===============
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // =============== SUBMIT STUDENT ===============
  const handleSubmit = async () => {
    if (
      !form.email ||
      !form.password ||
      !form.firstName ||
      !form.lastName ||
      !form.classId ||
      !form.rollNumber
    ) {
      toast({
        title: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post("/api/students", {
        ...form,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth) : undefined,
        admissionDate: form.admissionDate
          ? new Date(form.admissionDate)
          : undefined,
      });

      toast({ title: "✅ Student created successfully" });
      router.push("/admin/students");
    } catch (err: unknown) {
      const message =
        err instanceof AxiosError
          ? err.response?.data?.message || err.message
          : "Failed to create student";
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

  // ========================= RENDER =========================
  return (
    <div className="max-w-3xl mx-auto py-8 space-y-8">
      <Card className="rounded-2xl shadow-md border border-border">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">
            Create Student
          </h2>
          <p className="text-sm text-muted-foreground">
            Fill out the student details below
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* BASIC DETAILS */}
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
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <Input
              name="password"
              placeholder="Password"
              type="password"
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
              placeholder="Date of Birth"
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
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              name="bloodGroup"
              placeholder="Blood Group"
              value={form.bloodGroup}
              onChange={handleChange}
            />
          </div>

          {/* CLASS & ADMISSION INFO */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              value={form.classId}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, classId: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((c) => (
                  <SelectItem key={c._id} value={c._id}>
                    {c.className} ({c.section})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              name="section"
              placeholder="Section"
              value={form.section}
              onChange={handleChange}
            />
            <Input
              name="rollNumber"
              placeholder="Roll Number"
              value={form.rollNumber}
              onChange={handleChange}
              required
            />
            <Input
              name="admissionDate"
              type="date"
              placeholder="Admission Date"
              value={form.admissionDate}
              onChange={handleChange}
            />
          </div>

          {/* ADDRESS & CONTACT */}
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
          </div>

          {/* PARENT SELECT */}
          <div>
            <label className="block mb-1 font-medium text-sm">
              Select Parent (Optional)
            </label>
            <Select
              value={form.parentId}
              onValueChange={(val) =>
                setForm((prev) => ({ ...prev, parentId: val }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Parent" />
              </SelectTrigger>
              <SelectContent>
                {parents.map((p) => (
                  <SelectItem key={p._id} value={p._id}>
                    {p.firstName} {p.lastName} ({p.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-primary text-white"
            >
              {submitting ? "Creating..." : "Create Student"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
