// ============================================
// File: models/User.ts
// Base User Model (Authentication)
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  role: "pending" | "admin" | "teacher" | "student" | "parent";
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  profilePhoto?: string;
  isActive: boolean;
  approvalStatus: "pending" | "approved" | "rejected";
  lastLogin?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true, // Keep unique, remove manual index below
      trim: true,
      match: [
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },

    role: {
      type: String,
      enum: ["pending", "admin", "teacher", "student", "parent"],
      default: "pending",
      required: true,
    },

    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    phoneNumber: { type: String, trim: true },
    profilePhoto: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    lastLogin: Date,
    resetPasswordToken: { type: String, select: false },
    resetPasswordExpires: { type: Date, select: false },
  },
  { timestamps: true }
);

// ====================================================
// Keep only these indexes (no duplicates)
// ====================================================
UserSchema.index({ role: 1 });
UserSchema.index({ approvalStatus: 1 });

// ====================================================
// Virtual for full name
// ====================================================
UserSchema.virtual("fullName").get(function (this: IUser) {
  return `${this.firstName} ${this.lastName}`;
});

// ====================================================
// Password hashing before saving
// ====================================================
UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ====================================================
// Password comparison method
// ====================================================
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// ====================================================
// Export model
// ====================================================
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
