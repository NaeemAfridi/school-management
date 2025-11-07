// ============================================
// File: models/Attendance.ts
// Attendance Tracking Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IAttendance extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  date: Date;
  status: "present" | "absent" | "late" | "excused" | "half-day";
  markedBy: Types.ObjectId;
  remarks?: string;
  period?: string;
  checkInTime?: Date;
  checkOutTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
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
    date: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["present", "absent", "late", "excused", "half-day"],
      required: true,
    },
    markedBy: {
      type: Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },
    remarks: String,
    period: String,
    checkInTime: Date,
    checkOutTime: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
AttendanceSchema.index({ studentId: 1, date: 1 });
AttendanceSchema.index({ classId: 1, date: 1 });
AttendanceSchema.index({ date: -1 });
AttendanceSchema.index({ status: 1 });

const Attendance: Model<IAttendance> =
  mongoose.models.Attendance ||
  mongoose.model<IAttendance>("Attendance", AttendanceSchema);

export default Attendance;
