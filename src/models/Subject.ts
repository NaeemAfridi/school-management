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
  passingMarks?: number;
  totalMarks?: number;
  category: "core" | "elective" | "lab" | "extracurricular";
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubjectSchema = new Schema<ISubject>(
  {
    subjectName: { type: String, required: true, trim: true },
    subjectCode: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
    },
    passingMarks: {
      type: Number,
      min: 0,
    },
    totalMarks: {
      type: Number,
      min: 0,
    },
    description: { type: String },
    credits: { type: Number, min: 0 },
    category: {
      type: String,
      enum: ["core", "elective", "lab", "extracurricular"],
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

SubjectSchema.index({ code: 1 });
SubjectSchema.index({ category: 1 });

const Subject: Model<ISubject> =
  mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

export default Subject;

// import mongoose, { Schema, Document, Model } from "mongoose";

// export interface ISubject extends Document {
//   subjectName: string;
//   subjectCode: string;
//   description?: string;
//   credits?: number;
//   category: "core" | "elective" | "lab" | "extracurricular";
//   classes: mongoose.Types.ObjectId[]; // classes array removed
//   passingMarks?: number;
//   totalMarks?: number;
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const SubjectSchema = new Schema<ISubject>(
//   {
//     subjectName: {
//       type: String,
//       required: true,
//       trim: true,
//     },
//     subjectCode: {
//       type: String,
//       required: true,
//       unique: true,
//       uppercase: true,
//     },
//     description: String,
//     credits: {
//       type: Number,
//       min: 0,
//     },
//     classes: [{ type: Schema.Types.ObjectId, ref: "Class" }],
//     category: {
//       type: String,
//       enum: ["core", "elective", "lab", "extracurricular"],
//       required: true,
//     },
//     passingMarks: {
//       type: Number,
//       min: 0,
//     },
//     totalMarks: {
//       type: Number,
//       min: 0,
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
// SubjectSchema.index({ subjectCode: 1 });
// SubjectSchema.index({ category: 1 });

// const Subject: Model<ISubject> =
//   mongoose.models.Subject || mongoose.model<ISubject>("Subject", SubjectSchema);

// export default Subject;
