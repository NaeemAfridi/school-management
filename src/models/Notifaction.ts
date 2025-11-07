// ============================================
// File: models/Notification.ts
// Notification System Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface INotification extends Document {
  recipientId: Types.ObjectId;
  recipientRole: "admin" | "teacher" | "student" | "parent";
  title: string;
  message: string;
  type:
    | "announcement"
    | "grade"
    | "attendance"
    | "assignment"
    | "event"
    | "alert"
    | "fee"
    | "exam";
  priority: "low" | "medium" | "high" | "urgent";
  isRead: boolean;
  relatedId?: Types.ObjectId;
  relatedType?: string;
  createdBy: Types.ObjectId;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    recipientRole: {
      type: String,
      enum: ["admin", "teacher", "student", "parent"],
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "announcement",
        "grade",
        "attendance",
        "assignment",
        "event",
        "alert",
        "fee",
        "exam",
      ],
      required: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    relatedId: Schema.Types.ObjectId,
    relatedType: String,
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    expiresAt: Date,
  },
  {
    timestamps: true,
  }
);

// Indexes
NotificationSchema.index({ recipientId: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });
NotificationSchema.index({ type: 1 });
NotificationSchema.index({ priority: 1 });
NotificationSchema.index({ expiresAt: 1 });

const Notification: Model<INotification> =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);

export default Notification;
