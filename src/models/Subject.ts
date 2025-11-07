// ============================================
// File: models/Subject.ts
// Subject Model
// ============================================

import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISubject extends Document {
  subjectName: string;
  subjectCode: string;
  description?: string;
  credits?: number;
  category: "core" | "elective" | "lab" | "extracurricular";
  passingMarks?: number;
  totalMarks?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    subjectName: {
      type: String,
      required: true,
      trim: true,
    },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    description: String,
    credits: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      enum: ["core", "elective", "lab", "extracurricular"],
      required: true,
    },
    passingMarks: {
      type: Number,
      min: 0,
    },
    totalMarks: {
      type: Number,
      min: 0,
    },
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
SubjectSchema.index({ subjectCode: 1 });
SubjectSchema.index({ category: 1 });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;
