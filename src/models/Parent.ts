// ============================================
// File: models/Parent.ts
// Parent Profile Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IParent extends Document {
  userId: Types.ObjectId;
  parentId: string;
  children: Types.ObjectId[];
  occupation?: string;
  relationship: "father" | "mother" | "guardian";
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  alternatePhone?: string;
  annualIncome?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    parentId: {
      type: String,
      required: true,
      unique: true,
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    occupation: String,
    relationship: {
      type: String,
      enum: ["father", "mother", "guardian"],
      required: true,
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    alternatePhone: String,
    annualIncome: Number,
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
ParentSchema.index({ parentId: 1 });
ParentSchema.index({ userId: 1 });
ParentSchema.index({ children: 1 });

const Parent: Model<IParent> =
  mongoose.models.Parent || mongoose.model<IParent>("Parent", ParentSchema);

export default Parent;
