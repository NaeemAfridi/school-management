// // ============================================
// // File: models/Student.ts
// // Student Profile Model
// // ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

// -------------------------
// TypeScript Interface
// -------------------------
export interface IStudent extends Document {
  userId: Types.ObjectId; // reference to User
  studentId: string; // unique student identifier
  dateOfBirth?: Date;
  gender?: "male" | "female";
  bloodGroup?: "A+" | "A-" | "B+" | "B-" | "AB+" | "AB-" | "O+" | "O-";

  classId: Types.ObjectId; // reference to Class
  section?: string; // optional if Class has multiple sections
  rollNumber: string; // unique within class + section
  admissionDate?: Date;
  previousSchool?: string;

  parentId?: Types.ObjectId; // reference to Parent
  guardian?: {
    name: string;
    phone: string;
    relationship: string;
  };

  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };

  medicalInfo?: {
    allergies?: string[];
    medications?: string[];
    conditions?: string[];
    bloodType?: string;
  };

  transportation?: {
    required: boolean;
    busRoute?: string;
  };

  documents?: {
    type: string;
    url: string;
    uploadedAt: Date;
  }[];

  status: "active" | "inactive" | "suspended" | "graduated" | "transferred";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// -------------------------
// Mongoose Schema
// -------------------------
const StudentSchema = new Schema<IStudent>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    studentId: { type: String, required: true, unique: true },
    dateOfBirth: Date,
    gender: { type: String, enum: ["male", "female"] },
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },

    classId: { type: Schema.Types.ObjectId, ref: "Class", required: true },
    section: { type: String },
    rollNumber: { type: String, required: true },
    admissionDate: { type: Date, default: Date.now },
    previousSchool: { type: String },

    parentId: { type: Schema.Types.ObjectId, ref: "Parent" },
    guardian: {
      name: { type: String },
      phone: { type: String },
      relationship: { type: String },
    },

    emergencyContact: {
      name: { type: String },
      relationship: { type: String },
      phone: { type: String },
    },

    medicalInfo: {
      allergies: [String],
      medications: [String],
      conditions: [String],
      bloodType: String,
    },

    transportation: {
      required: { type: Boolean, default: false },
      busRoute: String,
    },

    documents: [
      {
        type: { type: String, required: true },
        url: { type: String, required: true },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],

    status: {
      type: String,
      enum: ["active", "inactive", "suspended", "graduated", "transferred"],
      default: "active",
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// -------------------------
// Indexes
// -------------------------
StudentSchema.index({ studentId: 1 });
StudentSchema.index({ userId: 1 });
StudentSchema.index(
  { classId: 1, section: 1, rollNumber: 1 },
  { unique: true }
);
StudentSchema.index({ parentId: 1 });
StudentSchema.index({ status: 1 });

// -------------------------
// Model Export
// -------------------------
const Student: Model<IStudent> =
  mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

export default Student;

// import mongoose, { Schema, Document, Model, Types } from "mongoose";

// export interface IStudent extends Document {
//   userId: Types.ObjectId;
//   studentId: string;
//   dateOfBirth: Date;
//   gender: "male" | "female" | "other";
//   bloodGroup?: string;
//   address: {
//     street: string;
//     city: string;
//     state: string;
//     zipCode: string;
//     country: string;
//   };
//   admissionDate: Date;
//   classId: Types.ObjectId;
//   section: string;
//   rollNumber: string;
//   parentId?: Types.ObjectId;
//   guardianName?: string;
//   guardianPhone?: string;
//   guardianRelationship?: string;
//   emergencyContact: {
//     name: string;
//     relationship: string;
//     phoneNumber: string;
//   };
//   medicalInfo?: {
//     allergies?: string[];
//     medications?: string[];
//     conditions?: string[];
//     bloodType?: string;
//   };
//   previousSchool?: string;
//   transportationRequired?: boolean;
//   busRoute?: string;
//   documents?: {
//     type: string;
//     url: string;
//     uploadedAt: Date;
//   }[];
//   status: "active" | "inactive" | "suspended" | "graduated" | "transferred";
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const StudentSchema = new Schema<IStudent>(
//   {
//     userId: {
//       type: Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       unique: true,
//     },
//     studentId: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     dateOfBirth: {
//       type: Date,
//       required: true,
//     },
//     gender: {
//       type: String,
//       enum: ["male", "female", "other"],
//       required: true,
//     },
//     bloodGroup: {
//       type: String,
//       enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
//     },
//     address: {
//       street: { type: String, required: true },
//       city: { type: String, required: true },
//       state: { type: String, required: true },
//       zipCode: { type: String, required: true },
//       country: { type: String, required: true },
//     },
//     admissionDate: {
//       type: Date,
//       required: true,
//       default: Date.now,
//     },
//     classId: {
//       type: Schema.Types.ObjectId,
//       ref: "Class",
//       required: true,
//     },
//     section: {
//       type: String,
//       required: true,
//     },
//     rollNumber: {
//       type: String,
//       required: true,
//     },
//     parentId: {
//       type: Schema.Types.ObjectId,
//       ref: "Parent",
//     },
//     guardianName: String,
//     guardianPhone: String,
//     guardianRelationship: String,
//     emergencyContact: {
//       name: { type: String, required: true },
//       relationship: { type: String, required: true },
//       phoneNumber: { type: String, required: true },
//     },
//     medicalInfo: {
//       allergies: [String],
//       medications: [String],
//       conditions: [String],
//       bloodType: String,
//     },
//     previousSchool: String,
//     transportationRequired: {
//       type: Boolean,
//       default: false,
//     },
//     busRoute: String,
//     documents: [
//       {
//         type: { type: String, required: true },
//         url: { type: String, required: true },
//         uploadedAt: { type: Date, default: Date.now },
//       },
//     ],
//     status: {
//       type: String,
//       enum: ["active", "inactive", "suspended", "graduated", "transferred"],
//       default: "active",
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Indexes
// StudentSchema.index({ studentId: 1 });
// StudentSchema.index({ userId: 1 });
// StudentSchema.index({ classId: 1, section: 1 });
// StudentSchema.index({ parentId: 1 });
// StudentSchema.index({ status: 1 });

// // Compound unique index
// StudentSchema.index(
//   { classId: 1, section: 1, rollNumber: 1 },
//   { unique: true }
// );

// const Student: Model<IStudent> =
//   mongoose.models.Student || mongoose.model<IStudent>("Student", StudentSchema);

// export default Student;
