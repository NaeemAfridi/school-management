// ============================================
// File: models/Exam.ts
// Exam Management Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IExam extends Document {
  examName: string;
  examType: "midterm" | "final" | "quarterly" | "unit-test" | "mock";
  academicYear: string;
  term: string;
  startDate: Date;
  endDate: Date;
  classId: Types.ObjectId;
  subjects: {
    subjectId: Types.ObjectId;
    examDate: Date;
    startTime: string;
    endTime: string;
    totalMarks: number;
    passingMarks: number;
    room?: string;
    invigilator?: Types.ObjectId;
  }[];
  instructions?: string;
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ExamSchema = new Schema<IExam>(
  {
    examName: {
      type: String,
      required: true,
    },
    examType: {
      type: String,
      enum: ["midterm", "final", "quarterly", "unit-test", "mock"],
      required: true,
    },
    academicYear: {
      type: String,
      required: true,
    },
    term: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    classId: {
      type: Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },
    subjects: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        examDate: {
          type: Date,
          required: true,
        },
        startTime: {
          type: String,
          required: true,
        },
        endTime: {
          type: String,
          required: true,
        },
        totalMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        passingMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        room: String,
        invigilator: {
          type: Schema.Types.ObjectId,
          ref: "Teacher",
        },
      },
    ],
    instructions: String,
    status: {
      type: String,
      enum: ["scheduled", "ongoing", "completed", "cancelled"],
      default: "scheduled",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
ExamSchema.index({ classId: 1, academicYear: 1 });
ExamSchema.index({ startDate: 1, endDate: 1 });
ExamSchema.index({ examType: 1 });
ExamSchema.index({ status: 1 });

const Exam: Model<IExam> =
  mongoose.models.Exam || mongoose.model<IExam>("Exam", ExamSchema);

export default Exam;
