// ============================================
// File: models/Assignment.ts
// Homework/Assignment Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAssignment extends Document {
  title: string;
  description: string;
  classId: Types.ObjectId;
  subjectId: Types.ObjectId;
  teacherId: Types.ObjectId;
  dueDate: Date;
  totalMarks: number;
  attachments?: string[];
  submissions: {
    studentId: Types.ObjectId;
    submittedAt?: Date;
    fileUrl?: string;
    marksObtained?: number;
    feedback?: string;
    status: "pending" | "submitted" | "graded" | "late";
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const AssignmentSchema = new Schema<IAssignment>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
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
    dueDate: {
      type: Date,
      required: true,
    },
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    attachments: [String],
    submissions: [
      {
        studentId: {
          type: Schema.Types.ObjectId,
          ref: "Student",
          required: true,
        },
        submittedAt: Date,
        fileUrl: String,
        marksObtained: { type: Number, min: 0 },
        feedback: String,
        status: {
          type: String,
          enum: ["pending", "submitted", "graded", "late"],
          default: "pending",
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
AssignmentSchema.index({ classId: 1, subjectId: 1 });
AssignmentSchema.index({ teacherId: 1 });
AssignmentSchema.index({ dueDate: 1 });

const Assignment: Model<IAssignment> =
  mongoose.models.Assignment ||
  mongoose.model<IAssignment>("Assignment", AssignmentSchema);

export default Assignment;
