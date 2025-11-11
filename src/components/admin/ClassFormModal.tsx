"use client";

import { useState, useEffect, useRef } from "react";
import axios, { AxiosError } from "axios";
import { useToast } from "@/hooks/use-toast";

interface Teacher {
  _id: string;
  name: string;
}

interface ClassFormData {
  className: string;
  section: string;
  academicYear: string;
  classTeacherId: string;
  maxCapacity: number;
}

interface ClassData extends ClassFormData {
  _id: string;
}

interface ClassFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: ClassData;
  refreshData: () => void;
  teachers: Teacher[];
}

export const ClassFormModal = ({
  isOpen,
  onClose,
  initialData,
  refreshData,
  teachers,
}: ClassFormModalProps) => {
  const { toast } = useToast();
  const [form, setForm] = useState<ClassFormData>({
    className: "",
    section: "",
    academicYear: "",
    classTeacherId: "",
    maxCapacity: 40,
  });

  // Avoid synchronous state updates during render
  const initialDataRef = useRef(initialData);

  // ✅ Use layout-safe initialization
  useEffect(() => {
    if (!isOpen) return; // Only initialize when modal opens

    if (initialDataRef.current) {
      const data = initialDataRef.current;
      setForm({
        className: data.className,
        section: data.section,
        academicYear: data.academicYear,
        classTeacherId:
          typeof data.classTeacherId === "string"
            ? data.classTeacherId
            : (data.classTeacherId as any)?._id || "",
        maxCapacity: data.maxCapacity,
      });
    } else {
      setForm({
        className: "",
        section: "",
        academicYear: "",
        classTeacherId: "",
        maxCapacity: 40,
      });
    }
  }, [isOpen]);

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
      if (initialData) {
        await axios.put(`/api/classes/${initialData._id}`, form);
        toast({
          title: "Class updated successfully",
          description: `${form.className} has been updated.`,
        });
      } else {
        await axios.post("/api/classes", form);
        toast({
          title: "Class created successfully",
          description: `${form.className} has been added.`,
        });
      }
      refreshData();
      onClose();
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-background border border-border rounded-2xl shadow-lg w-full max-w-md p-6">
        <h2 className="text-xl font-semibold text-foreground mb-4">
          {initialData ? "Edit Class" : "Create New Class"}
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Class Name
            </label>
            <input
              type="text"
              name="className"
              value={form.className}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., Class 10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Section
            </label>
            <input
              type="text"
              name="section"
              value={form.section}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., A, B, C"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Academic Year
            </label>
            <input
              type="text"
              name="academicYear"
              value={form.academicYear}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
              placeholder="e.g., 2024-2025"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Class Teacher
            </label>
            <select
              name="classTeacherId"
              value={form.classTeacherId}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
            >
              <option value="">Select a teacher</option>
              {teachers.map((teacher) => (
                <option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground/80 mb-1">
              Max Capacity
            </label>
            <input
              type="number"
              name="maxCapacity"
              value={form.maxCapacity}
              onChange={handleChange}
              className="w-full border border-border rounded-lg px-3 py-2 bg-background text-foreground focus:ring-2 focus:ring-primary outline-none"
              min={1}
            />
          </div>
        </div>

        <div className="flex gap-2 justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-border rounded-lg hover:bg-muted transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            {initialData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};
