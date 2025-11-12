"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface SubjectForm {
  subjectName: string;
  subjectCode: string;
  description?: string;
  credits?: number;
  category: "core" | "elective" | "lab" | "extracurricular";
  passingMarks?: number;
  totalMarks?: number;
  isActive: boolean;
}

export default function CreateSubjectPage() {
  const router = useRouter();
  const [form, setForm] = useState<SubjectForm>({
    subjectName: "",
    subjectCode: "",
    description: "",
    credits: 0,
    category: "core",
    passingMarks: 0,
    totalMarks: 0,
    isActive: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // Handle form field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        e.target.type === "number"
          ? Number(value)
          : value.toUpperCase?.() && name === "subjectCode"
          ? value.toUpperCase()
          : value,
    }));
  };

  // Basic form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!form.subjectName.trim())
      newErrors.subjectName = "Subject name is required.";
    if (!form.subjectCode.trim())
      newErrors.subjectCode = "Subject code is required.";
    if (!form.category) newErrors.category = "Please select a category.";
    if (
      form.totalMarks &&
      form.passingMarks &&
      form.passingMarks > form.totalMarks
    )
      newErrors.passingMarks = "Passing marks cannot exceed total marks.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    try {
      await axios.post("/api/subjects", form);
      router.push("/admin/subjects");
    } catch (err) {
      console.error("Error creating subject:", err);
      setErrors({ submit: "Failed to create subject. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <Card className="w-full max-w-3xl shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold text-gray-800">
            Create Subject
          </CardTitle>
          <p className="text-gray-500 text-sm">
            Fill in the details below to add a new subject.
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Subject Name <span className="text-red-500">*</span>
                </label>
                <Input
                  name="subjectName"
                  placeholder="e.g. Physics"
                  value={form.subjectName}
                  onChange={handleChange}
                />
                {errors.subjectName && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.subjectName}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Subject Code <span className="text-red-500">*</span>
                </label>
                <Input
                  name="subjectCode"
                  placeholder="e.g. PHY101"
                  value={form.subjectCode}
                  onChange={handleChange}
                />
                {errors.subjectCode && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.subjectCode}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Category <span className="text-red-500">*</span>
                </label>
                <Select
                  onValueChange={(val) =>
                    setForm((p) => ({
                      ...p,
                      category: val as
                        | "core"
                        | "elective"
                        | "lab"
                        | "extracurricular",
                    }))
                  }
                  value={form.category}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="core">Core</SelectItem>
                    <SelectItem value="elective">Elective</SelectItem>
                    <SelectItem value="lab">Lab</SelectItem>
                    <SelectItem value="extracurricular">
                      Extracurricular
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 mt-1">{errors.category}</p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Credits
                </label>
                <Input
                  type="number"
                  name="credits"
                  min={0}
                  placeholder="e.g. 3"
                  value={form.credits || ""}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Passing Marks
                </label>
                <Input
                  type="number"
                  name="passingMarks"
                  min={0}
                  placeholder="e.g. 40"
                  value={form.passingMarks || ""}
                  onChange={handleChange}
                />
                {errors.passingMarks && (
                  <p className="text-sm text-red-500 mt-1">
                    {errors.passingMarks}
                  </p>
                )}
              </div>

              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Total Marks
                </label>
                <Input
                  type="number"
                  name="totalMarks"
                  min={0}
                  placeholder="e.g. 100"
                  value={form.totalMarks || ""}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between rounded-md border p-3">
                <span className="font-medium text-gray-700">Active</span>
                <Switch
                  checked={form.isActive}
                  onCheckedChange={(checked) =>
                    setForm((p) => ({ ...p, isActive: checked }))
                  }
                />
              </div>
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700 mb-1">
                Description
              </label>
              <Textarea
                name="description"
                placeholder="Brief subject overview..."
                value={form.description}
                onChange={handleChange}
              />
            </div>

            {/* Submit */}
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Create Subject"}
              </Button>
            </div>

            {errors.submit && (
              <p className="text-sm text-red-500 md:col-span-2 text-right">
                {errors.submit}
              </p>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
