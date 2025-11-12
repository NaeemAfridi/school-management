"use client";

import { useState, useEffect, type ChangeEvent } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Subject {
  _id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
}

interface Period {
  periodNumber: number;
  startTime: string;
  endTime: string;
  subjectId: string;
  teacherId: string;
}

interface Day {
  day: string;
  periods: Period[];
}

export default function CreateClassPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [teachersBySubject, setTeachersBySubject] = useState<
    Record<string, Teacher[]>
  >({});

  const [form, setForm] = useState({
    className: "",
    section: "",
    academicYear: "",
    subjects: [] as string[],
    maxCapacity: 40,
    classRoom: "",
    isActive: true,
  });

  const [schedule, setSchedule] = useState<Day[]>([]);

  // Fetch subjects on mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const subjectRes = await axios.get("/api/subjects");
        setSubjects(subjectRes.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSubjects();
  }, []);

  // Fetch teachers by subject
  const fetchTeachersBySubject = async (subjectId: string) => {
    if (!subjectId || teachersBySubject[subjectId]) return;
    try {
      const res = await axios.get(`/api/teachers?subject=${subjectId}`);
      setTeachersBySubject((prev) => ({
        ...prev,
        [subjectId]: res.data.data || [],
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "maxCapacity" ? Number(value) : value,
    }));
  };

  const handleSubjectToggle = (id: string) => {
    setForm((prev) => {
      const exists = prev.subjects.includes(id);
      return {
        ...prev,
        subjects: exists
          ? prev.subjects.filter((s) => s !== id)
          : [...prev.subjects, id],
      };
    });
  };

  const handleAddDay = () => {
    setSchedule((prev) => [...prev, { day: "Monday", periods: [] }]);
  };

  const handleAddPeriod = (dayIndex: number) => {
    setSchedule((prev) => {
      const updated = [...prev];
      updated[dayIndex].periods.push({
        periodNumber: updated[dayIndex].periods.length + 1,
        startTime: "",
        endTime: "",
        subjectId: "",
        teacherId: "",
      });
      return updated;
    });
  };

  const handleScheduleChange = (
    dayIndex: number,
    periodIndex: number,
    field: keyof Period,
    value: string
  ) => {
    setSchedule((prev) =>
      prev.map((d, di) =>
        di !== dayIndex
          ? d
          : {
              ...d,
              periods: d.periods.map((p, pi) =>
                pi !== periodIndex ? p : { ...p, [field]: value }
              ),
            }
      )
    );

    // Fetch teachers if subject changed
    if (field === "subjectId") {
      fetchTeachersBySubject(value);
      // Reset teacherId if subject changes
      setSchedule((prev) =>
        prev.map((d, di) =>
          di !== dayIndex
            ? d
            : {
                ...d,
                periods: d.periods.map((p, pi) =>
                  pi !== periodIndex ? p : { ...p, teacherId: "" }
                ),
              }
        )
      );
    }
  };

  const handleSubmit = async () => {
    try {
      await axios.post("/api/classes", { ...form, schedule });
      toast({ title: "✅ Class created successfully" });
      router.push("/admin/classes");
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "An error occurred";
      toast({
        title: "❌ Error",
        description: message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 py-8">
      <Card className="border-border shadow-md rounded-2xl">
        <CardHeader>
          <h2 className="text-2xl font-semibold text-foreground">
            Create New Class
          </h2>
          <p className="text-sm text-muted-foreground">
            Define class details, assign subjects, and schedule periods.
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label>Class Name</label>
              <Input
                name="className"
                placeholder="e.g. Grade 10"
                value={form.className}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Section</label>
              <Input
                name="section"
                placeholder="A"
                value={form.section}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Academic Year</label>
              <Input
                name="academicYear"
                placeholder="2025-2026"
                value={form.academicYear}
                onChange={handleChange}
              />
            </div>
            <div>
              <label>Class Room</label>
              <Input
                name="classRoom"
                placeholder="Room 204"
                value={form.classRoom}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Subjects */}
          <div>
            <label>Subjects</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2">
              {subjects.map((s) => (
                <label
                  key={s._id}
                  className="flex items-center gap-2 border border-border rounded-lg p-2 cursor-pointer hover:bg-accent"
                >
                  <input
                    type="checkbox"
                    checked={form.subjects.includes(s._id)}
                    onChange={() => handleSubjectToggle(s._id)}
                  />
                  <span>{s.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Capacity */}
          <div>
            <label>Max Capacity</label>
            <Input
              type="number"
              name="maxCapacity"
              value={form.maxCapacity}
              onChange={handleChange}
            />
          </div>

          {/* Schedule */}
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <label>Schedule</label>
              <Button
                variant="outline"
                onClick={handleAddDay}
                className="text-sm"
              >
                + Add Day
              </Button>
            </div>

            {schedule.map((day, dayIdx) => (
              <div
                key={dayIdx}
                className="border border-border rounded-lg p-3 bg-accent"
              >
                <div className="flex justify-between items-center mb-2">
                  <select
                    value={day.day}
                    onChange={(e) => {
                      const updated = [...schedule];
                      updated[dayIdx].day = e.target.value;
                      setSchedule(updated);
                    }}
                    className="border border-border rounded px-2 py-1 bg-background"
                  >
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                  <Button
                    size="sm"
                    onClick={() => handleAddPeriod(dayIdx)}
                    variant="outline"
                  >
                    + Add Period
                  </Button>
                </div>

                {day.periods.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-2"
                  >
                    <Input
                      placeholder="Start"
                      value={p.startTime}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIdx,
                          pIdx,
                          "startTime",
                          e.target.value
                        )
                      }
                    />
                    <Input
                      placeholder="End"
                      value={p.endTime}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIdx,
                          pIdx,
                          "endTime",
                          e.target.value
                        )
                      }
                    />
                    <select
                      value={p.subjectId}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIdx,
                          pIdx,
                          "subjectId",
                          e.target.value
                        )
                      }
                      className="border border-border rounded px-2 py-1"
                    >
                      <option value="">Subject</option>
                      {subjects.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name}
                        </option>
                      ))}
                    </select>
                    <select
                      value={p.teacherId}
                      onChange={(e) =>
                        handleScheduleChange(
                          dayIdx,
                          pIdx,
                          "teacherId",
                          e.target.value
                        )
                      }
                      className="border border-border rounded px-2 py-1"
                    >
                      <option value="">Teacher</option>
                      {(teachersBySubject[p.subjectId] || []).map((t) => (
                        <option key={t._id} value={t._id}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              className="border-border"
            >
              Cancel
            </Button>
            <Button onClick={handleSubmit} className="bg-primary text-white">
              Create Class
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
