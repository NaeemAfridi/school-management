"use client";

import axios, { AxiosError } from "axios";
import { Table } from "@/components/ui/table";

interface ClassType {
  _id: string;
  className: string;
  section: string;
  academicYear: string;
  classTeacherId: { name: string } | null;
  subjects: Array<{ _id: string; subjectName: string }>;
  students: string[];
}

interface ClassesTableProps {
  classes: ClassType[];
  onEdit: (cls: ClassType) => void;
  onView: (cls: ClassType) => void;
  refreshData: () => void;
}

export default function ClassesTable({
  classes,
  onEdit,
  onView,
  refreshData,
}: ClassesTableProps) {
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this class?")) return;
    try {
      await axios.delete(`/api/classes/${id}`);
      refreshData();
    } catch (error: unknown) {
      const message =
        error instanceof AxiosError
          ? error.response?.data?.message || error.message
          : "Delete failed";
      console.error(message);
    }
  };

  return (
    <Table className="bg-background border border-border rounded-lg">
      <thead>
        <tr>
          <th>Class Name</th>
          <th>Section</th>
          <th>Academic Year</th>
          <th>Teacher</th>
          <th>Students</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {classes.map((cls) => (
          <tr key={cls._id}>
            <td>{cls.className}</td>
            <td>{cls.section}</td>
            <td>{cls.academicYear}</td>
            <td>{cls.classTeacherId?.name || "—"}</td>
            <td>{cls.students.length}</td>
            <td className="flex gap-2">
              <button onClick={() => onView(cls)}>View</button>
              <button onClick={() => onEdit(cls)}>Edit</button>
              <button onClick={() => handleDelete(cls._id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
