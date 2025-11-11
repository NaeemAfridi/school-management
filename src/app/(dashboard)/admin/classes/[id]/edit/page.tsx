"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  _id: string;
  name: string;
}

export default function EditClassPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [form, setForm] = useState({
    className: "",
    section: "",
    academicYear: "",
    classTeacherId: "",
    maxCapacity: 40,
  });

  useEffect(() => {
    axios.get("/api/teachers").then(({ data }) => setTeachers(data.data || []));
    if (id) {
      axios.get(`/api/classes/${id}`).then(({ data }) => {
        const cls = data.data;
        setForm({
          className: cls.className,
          section: cls.section,
          academicYear: cls.academicYear,
          classTeacherId: cls.classTeacherId?._id || "",
          maxCapacity: cls.maxCapacity || 40,
        });
      });
    }
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await axios.put(`/api/classes/${id}`, form);
      toast({ title: "Class updated successfully" });
      router.push("/admin/classes");
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Edit Class</h2>

      <div className="space-y-4">
        <input
          name="className"
          placeholder="Class Name"
          value={form.className}
          onChange={handleChange}
          className="w-full border border-border rounded-lg px-3 py-2"
        />
        <input
          name="section"
          placeholder="Section"
          value={form.section}
          onChange={handleChange}
          className="w-full border border-border rounded-lg px-3 py-2"
        />
        <input
          name="academicYear"
          placeholder="Academic Year"
          value={form.academicYear}
          onChange={handleChange}
          className="w-full border border-border rounded-lg px-3 py-2"
        />
        <select
          name="classTeacherId"
          value={form.classTeacherId}
          onChange={handleChange}
          className="w-full border border-border rounded-lg px-3 py-2"
        >
          <option value="">Select Class Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          name="maxCapacity"
          type="number"
          placeholder="Max Capacity"
          value={form.maxCapacity}
          onChange={handleChange}
          className="w-full border border-border rounded-lg px-3 py-2"
        />
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => router.back()}
          className="border border-border px-4 py-2 rounded-lg hover:bg-muted"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-lg"
        >
          Update
        </button>
      </div>
    </div>
  );
}
