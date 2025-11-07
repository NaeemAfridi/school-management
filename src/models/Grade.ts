// ============================================
// File: models/Grade.ts
// Grades and Assessment Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IGrade extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  academicYear: string;
  term: "midterm" | "final" | "quarterly" | "assignment" | "quiz" | "project";
  assessmentName: string;
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  grade: string;
  remarks?: string;
  submissionDate?: Date;
  assessmentDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const GradeSchema = new Schema<IGrade>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjectId: {
      type: Schema.Types.ObjectId,
      ref: "Subject",
      required: true,
    },
    teacherId: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      enum: ["midterm", "final", "quarterly", "assignment", "quiz", "project"],
      required: true,
    },
    assessmentName: {
      type: String,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    grade: {
      type: String,
      required: true,
    },
    remarks: String,
    submissionDate: Date,
    assessmentDate: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook to calculate percentage
GradeSchema.pre("save", function (next) {
  this.percentage = (this.obtainedMarks / this.totalMarks) * 100;

  // Auto-calculate grade
  if (this.percentage >= 90) this.grade = "A+";
  else if (this.percentage >= 80) this.grade = "A";
  else if (this.percentage >= 70) this.grade = "B+";
  else if (this.percentage >= 60) this.grade = "B";
  else if (this.percentage >= 50) this.grade = "C";
  else if (this.percentage >= 40) this.grade = "D";
  else this.grade = "F";

  next();
});

// Indexes
GradeSchema.index({ studentId: 1, subjectId: 1, academicYear: 1 });
GradeSchema.index({ classId: 1, subjectId: 1 });
GradeSchema.index({ assessmentDate: -1 });
GradeSchema.index({ term: 1 });

const Grade: Model<IGrade> =
  mongoose.models.Grade || mongoose.model<IGrade>("Grade", GradeSchema);

export default Grade;
