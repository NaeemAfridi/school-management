// ============================================
// File: models/Class.ts
// Class/Grade Model
// ============================================
import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IClass extends Document {
  className: string;
  section: string;
  academicYear: string;
  students: Types.ObjectId[];
  subjects: Types.ObjectId[];
  maxCapacity: number;
  classroom?: string;
  schedule?: {
    day: string;
    periods: {
      periodNumber: number;
      startTime: string;
      endTime: string;
      subjectId: Types.ObjectId;
      teacherId: Types.ObjectId;
    }[];
  }[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ClassSchema = new Schema<IClass>(
  {
    className: { type: String, required: true },
    section: { type: String, required: true },
    academicYear: { type: String, required: true },
    students: [{ type: Schema.Types.ObjectId, ref: "Student" }],
    subjects: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    maxCapacity: { type: Number, default: 40 },
    classroom: { type: String },
    schedule: [
      {
        day: {
          type: String,
          enum: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
          ],
          required: true,
        },
        periods: [
          {
            periodNumber: { type: Number, required: true },
            startTime: { type: String, required: true },
            endTime: { type: String, required: true },
            subjectId: {
              type: Schema.Types.ObjectId,
              ref: "Subject",
              required: true,
            },
            teacherId: {
              type: Schema.Types.ObjectId,
              ref: "Teacher",
              required: true,
            },
          },
        ],
      },
    ],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

ClassSchema.index({ name: 1, section: 1, academicYear: 1 }, { unique: true });
ClassSchema.index({ academicYear: 1 });

const Class: Model<IClass> =
  mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);

export default Class;

// import mongoose, { Schema, Document, Model, Types } from "mongoose";

// export interface IClass extends Document {
//   className: string;
//   section: string;
//   academicYear: string;
//   classTeacherId: Types.ObjectId; // class teacher removed
//   subjects: Types.ObjectId[];
//   students: Types.ObjectId[];
//   maxCapacity: number;
//   currentStrength: number;
//   classRoom?: string;
//   schedule?: {
//     day: string;
//     periods: {
//       periodNumber: number;
//       startTime: string;
//       endTime: string;
//       subjectId: Types.ObjectId;
//       teacherId: Types.ObjectId;
//     }[];
//   }[];
//   isActive: boolean;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const ClassSchema = new Schema<IClass>(
//   {
//     className: {
//       type: String,
//       required: true,
//     },
//     section: {
//       type: String,
//       required: true,
//     },
//     academicYear: {
//       type: String,
//       required: true,
//     },
//     classTeacherId: {
//       type: Schema.Types.ObjectId,
//       ref: "Teacher",
//       required: true,
//     },
//     subjects: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Subject",
//       },
//     ],
//     students: [
//       {
//         type: Schema.Types.ObjectId,
//         ref: "Student",
//       },
//     ],
//     maxCapacity: {
//       type: Number,
//       required: true,
//       default: 40,
//     },
//     currentStrength: {
//       type: Number,
//       default: 0,
//     },
//     classRoom: String,
//     schedule: [
//       {
//         day: {
//           type: String,
//           enum: [
//             "Monday",
//             "Tuesday",
//             "Wednesday",
//             "Thursday",
//             "Friday",
//             "Saturday",
//           ],
//         },
//         periods: [
//           {
//             periodNumber: Number,
//             startTime: String,
//             endTime: String,
//             subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
//             teacherId: { type: Schema.Types.ObjectId, ref: "Teacher" },
//           },
//         ],
//       },
//     ],
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
// ClassSchema.index(
//   { className: 1, section: 1, academicYear: 1 },
//   { unique: true }
// );
// ClassSchema.index({ classTeacherId: 1 });
// ClassSchema.index({ academicYear: 1 });

// const Class: Model<IClass> =
//   mongoose.models.Class || mongoose.model<IClass>("Class", ClassSchema);

// export default Class;
