// ============================================
// File: models/Teacher.ts
// Teacher Profile Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface ITeacher extends Document {
  userId: Types.ObjectId;
  teacherId: string;
  dateOfBirth: Date;
  gender: "male" | "female" | "other";
  qualification: string;
  degree?: string;
  university?: string;
  experience: number;
  specialization: string[];
  joiningDate: Date;
  employmentType: "full-time" | "part-time" | "contract";
  salary?: number;
  subjects: Types.ObjectId[];
  classes: Types.ObjectId[];
  classTeacherOf?: Types.ObjectId;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  bankDetails?: {
    accountNumber?: string;
    bankName?: string;
    ifscCode?: string;
  };
  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];
  leaveBalance?: {
    casual: number;
    sick: number;
    earned: number;
  };
  status: "active" | "inactive" | "on-leave" | "resigned";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TeacherSchema = new Schema<ITeacher>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    teacherId: {
      type: String,
      required: true,
      unique: true,
    },
    dateOfBirth: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    qualification: {
      type: String,
      required: true,
    },
    degree: String,
    university: String,
    experience: {
      type: Number,
      required: true,
      min: 0,
    },
    specialization: [
      {
        type: String,
        required: true,
      },
    ],
    joiningDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    employmentType: {
      type: String,
      enum: ["full-time", "part-time", "contract"],
      required: true,
    },
    salary: {
      type: Number,
      min: 0,
    },
    subjects: [
      {
        type: Schema.Types.ObjectId,
        ref: "Subject",
      },
    ],
    classes: [
      {
        type: Schema.Types.ObjectId,
        ref: "Class",
      },
    ],
    classTeacherOf: {
      type: Schema.Types.ObjectId,
      ref: "Class",
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    emergencyContact: {
      name: { type: String, required: true },
      relationship: { type: String, required: true },
      phoneNumber: { type: String, required: true },
    },
    bankDetails: {
      accountNumber: String,
      bankName: String,
      ifscCode: String,
    },
    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
    leaveBalance: {
      casual: { type: Number, default: 12 },
      sick: { type: Number, default: 12 },
      earned: { type: Number, default: 12 },
    },
    status: {
      type: String,
      enum: ["active", "inactive", "on-leave", "resigned"],
      default: "active",
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
TeacherSchema.index({ teacherId: 1 });
TeacherSchema.index({ userId: 1 });
TeacherSchema.index({ subjects: 1 });
TeacherSchema.index({ classes: 1 });
TeacherSchema.index({ status: 1 });

const Teacher: Model<ITeacher> =
  mongoose.models.Teacher || mongoose.model<ITeacher>("Teacher", TeacherSchema);

export default Teacher;
