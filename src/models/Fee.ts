// ============================================
// File: models/Fee.ts
// Fee Management Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IFee extends Document {
  studentId: Types.ObjectId;
  classId: Types.ObjectId;
  academicYear: string;
  feeType:
    | "tuition"
    | "transportation"
    | "library"
    | "laboratory"
    | "sports"
    | "exam"
    | "admission"
    | "other";
  feeStructure: {
    category: string;
    amount: number;
    description?: string;
  }[];
  totalAmount: number;
  paidAmount: number;
  discountAmount: number;
  dueAmount: number;
  dueDate: Date;
  status: "pending" | "partial" | "paid" | "overdue" | "waived";
  payments: {
    paymentId: string;
    amount: number;
    paymentMethod:
      | "cash"
      | "card"
      | "bank-transfer"
      | "cheque"
      | "online"
      | "upi";
    transactionId?: string;
    paymentDate: Date;
    receivedBy?: Types.ObjectId;
    receipt?: string;
    remarks?: string;
  }[];
  discount?: {
    reason: string;
    percentage?: number;
    amount: number;
    approvedBy: Types.ObjectId;
  };
  penalty?: {
    amount: number;
    reason: string;
  };
  remarks?: string;
  isActive: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FeeSchema = new Schema<IFee>(
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
    academicYear: {
      type: String,
      required: true,
    },
    feeType: {
      type: String,
      enum: [
        "tuition",
        "transportation",
        "library",
        "laboratory",
        "sports",
        "exam",
        "admission",
        "other",
      ],
      required: true,
    },
    feeStructure: [
      {
        category: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        description: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    discountAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    dueAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "partial", "paid", "overdue", "waived"],
      default: "pending",
    },
    payments: [
      {
        paymentId: { type: String, required: true },
        amount: { type: Number, required: true, min: 0 },
        paymentMethod: {
          type: String,
          enum: ["cash", "card", "bank-transfer", "cheque", "online", "upi"],
          required: true,
        },
        transactionId: String,
        paymentDate: { type: Date, required: true },
        receivedBy: { type: Schema.Types.ObjectId, ref: "User" },
        receipt: String,
        remarks: String,
      },
    ],
    discount: {
      reason: String,
      percentage: { type: Number, min: 0, max: 100 },
      amount: { type: Number, min: 0 },
      approvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    penalty: {
      amount: { type: Number, min: 0 },
      reason: String,
    },
    remarks: String,
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

// Pre-save hook to calculate due amount and status
FeeSchema.pre("save", function (next) {
  // Calculate total from fee structure if not set
  if (this.feeStructure && this.feeStructure.length > 0) {
    this.totalAmount = this.feeStructure.reduce(
      (sum, fee) => sum + fee.amount,
      0
    );
  }

  // Calculate due amount
  this.dueAmount = this.totalAmount - this.paidAmount - this.discountAmount;

  // Update status based on payment
  if (this.dueAmount <= 0) {
    this.status = "paid";
  } else if (this.paidAmount > 0) {
    this.status = "partial";
  } else if (new Date() > this.dueDate) {
    this.status = "overdue";
  } else {
    this.status = "pending";
  }

  next();
});

// Indexes
FeeSchema.index({ studentId: 1, academicYear: 1 });
FeeSchema.index({ classId: 1 });
FeeSchema.index({ status: 1 });
FeeSchema.index({ dueDate: 1 });
FeeSchema.index({ feeType: 1 });

const Fee: Model<IFee> =
  mongoose.models.Fee || mongoose.model<IFee>("Fee", FeeSchema);

export default Fee;
