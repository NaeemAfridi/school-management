// ============================================
// File: models/Result.ts
// Exam Results Model
// ============================================

import mongoose, { Schema, Document, Model, Types } from "mongoose";

export interface IResult extends Document {
  studentId: Types.ObjectId;
  examId: Types.ObjectId;
  classId: Types.ObjectId;
  academicYear: string;
  term: string;
  subjects: {
    subjectId: Types.ObjectId;
    totalMarks: number;
    obtainedMarks: number;
    percentage: number;
    grade: string;
    passingMarks: number;
    isPassed: boolean;
    remarks?: string;
  }[];
  totalMarks: number;
  obtainedMarks: number;
  percentage: number;
  overallGrade: string;
  rank?: number;
  isPassed: boolean;
  remarks?: string;
  publishedDate?: Date;
  isPublished: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ResultSchema = new Schema<IResult>(
  {
    studentId: {
      type: Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    examId: {
      type: Schema.Types.ObjectId,
      ref: "Exam",
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
    term: {
      type: String,
      required: true,
    },
    subjects: [
      {
        subjectId: {
          type: Schema.Types.ObjectId,
          ref: "Subject",
          required: true,
        },
        totalMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        obtainedMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        percentage: {
          type: Number,
          required: true,
          min: 0,
          max: 100,
        },
        grade: {
          type: String,
          required: true,
        },
        passingMarks: {
          type: Number,
          required: true,
          min: 0,
        },
        isPassed: {
          type: Boolean,
          required: true,
        },
        remarks: String,
      },
    ],
    totalMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    obtainedMarks: {
      type: Number,
      required: true,
      min: 0,
    },
    percentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    overallGrade: {
      type: String,
      required: true,
    },
    rank: {
      type: Number,
      min: 1,
    },
    isPassed: {
      type: Boolean,
      required: true,
    },
    remarks: String,
    publishedDate: Date,
    isPublished: {
      type: Boolean,
      default: false,
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

// Pre-save hook to calculate totals and grades
ResultSchema.pre("save", function (next) {
  // Calculate total marks and obtained marks
  this.totalMarks = this.subjects.reduce(
    (sum, subject) => sum + subject.totalMarks,
    0
  );
  this.obtainedMarks = this.subjects.reduce(
    (sum, subject) => sum + subject.obtainedMarks,
    0
  );

  // Calculate percentage
  this.percentage =
    this.totalMarks > 0 ? (this.obtainedMarks / this.totalMarks) * 100 : 0;

  // Calculate overall grade
  if (this.percentage >= 90) this.overallGrade = "A+";
  else if (this.percentage >= 80) this.overallGrade = "A";
  else if (this.percentage >= 70) this.overallGrade = "B+";
  else if (this.percentage >= 60) this.overallGrade = "B";
  else if (this.percentage >= 50) this.overallGrade = "C";
  else if (this.percentage >= 40) this.overallGrade = "D";
  else this.overallGrade = "F";

  // Check if passed (all subjects must be passed)
  this.isPassed = this.subjects.every((subject) => subject.isPassed);

  // Calculate subject grades and pass status
  this.subjects.forEach((subject) => {
    subject.percentage = (subject.obtainedMarks / subject.totalMarks) * 100;

    if (subject.percentage >= 90) subject.grade = "A+";
    else if (subject.percentage >= 80) subject.grade = "A";
    else if (subject.percentage >= 70) subject.grade = "B+";
    else if (subject.percentage >= 60) subject.grade = "B";
    else if (subject.percentage >= 50) subject.grade = "C";
    else if (subject.percentage >= 40) subject.grade = "D";
    else subject.grade = "F";

    subject.isPassed = subject.obtainedMarks >= subject.passingMarks;
  });

  next();
});

// Indexes
ResultSchema.index({ studentId: 1, examId: 1 }, { unique: true });
ResultSchema.index({ classId: 1, academicYear: 1 });
ResultSchema.index({ examId: 1 });
ResultSchema.index({ isPublished: 1 });
ResultSchema.index({ percentage: -1 });

const Result: Model<IResult> =
  mongoose.models.Result || mongoose.model<IResult>("Result", ResultSchema);

export default Result;
