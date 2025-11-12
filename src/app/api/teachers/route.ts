import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import Teacher from "@/models/Teacher";
import User from "@/models/User";
import { getErrorMessage } from "@/lib/errorHandler";
import { Types } from "mongoose";
import { requireRole } from "@/lib/auth-utils";
import { generateParentId } from "@/utils/idGenerator";

type PopulatedUser = {
  _id?: Types.ObjectId | string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  profilePhoto?: string;
};

type PopulatedSubject = {
  _id?: Types.ObjectId | string;
  subjectName?: string;
  subjectCode?: string;
};

type PopulatedClass = {
  _id?: Types.ObjectId | string;
  className?: string;
  section?: string;
};

type TeacherLean = {
  _id: Types.ObjectId | string;
  teacherId: string;
  isActive?: boolean;
  status?: string;
  userId: Types.ObjectId | string | PopulatedUser;
  subjects: Array<Types.ObjectId | string | PopulatedSubject>;
  classTeacherOf?: Types.ObjectId | string | PopulatedClass;
  [key: string]: unknown;
};

interface TeacherQuery {
  isActive?: boolean;
}

type SubjectRef = Types.ObjectId | string | PopulatedSubject;

// utility to safely extract id from subject reference
const getSubjectId = (s: SubjectRef): string | null => {
  if (typeof s === "string") return s;
  if (s && typeof s === "object") {
    if ("_id" in s) {
      const id = (s as Record<string, unknown>)._id;
      return typeof id === "string" ? id : String(id);
    }
  }
  return null;
};

// ============================================
// GET all teachers with optional search/subject filter
// ============================================
export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "teacher"]);
    await connectDB();

    const url = new URL(req.url);
    const subjectId = url.searchParams.get("subjectId");
    const isActive = url.searchParams.get("isActive");
    const search = url.searchParams.get("search");

    const query: TeacherQuery = {};
    if (isActive !== null) query.isActive = isActive === "true";

    // Cast lean() result as unknown first to satisfy TS
    let teachers = (await Teacher.find(query)
      .populate("userId", "firstName lastName email phoneNumber profilePhoto")
      .populate("subjects", "subjectName subjectCode")
      .populate("classTeacherOf", "className section")
      .sort({ createdAt: -1 })
      .lean()) as unknown as TeacherLean[];

    // Filter by subject
    if (subjectId && Types.ObjectId.isValid(subjectId)) {
      teachers = teachers.filter((t) =>
        t.subjects.some((s) => getSubjectId(s) === subjectId)
      );
    }

    // Search by teacherId, firstName or lastName
    if (search) {
      const searchLower = search.toLowerCase();
      teachers = teachers.filter((t) => {
        const teacherIdMatch =
          typeof t.teacherId === "string" &&
          t.teacherId.toLowerCase().includes(searchLower);

        const user = t.userId;
        const firstNameMatch =
          typeof user === "object" &&
          user !== null &&
          "firstName" in user &&
          (user as PopulatedUser).firstName.toLowerCase().includes(searchLower);

        const lastNameMatch =
          typeof user === "object" &&
          user !== null &&
          "lastName" in user &&
          (user as PopulatedUser).lastName.toLowerCase().includes(searchLower);

        return teacherIdMatch || firstNameMatch || lastNameMatch;
      });
    }

    return NextResponse.json({
      success: true,
      count: teachers.length,
      data: teachers,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

// ============================================
// POST create a new teacher
// ============================================
export async function POST(req: NextRequest) {
  try {
    await requireRole(["admin"]);
    await connectDB();
    const data = await req.json();

    const {
      email,
      password,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      qualification,
      degree,
      university,
      specialization,
      employmentType,
      subjects,
      classTeacherOf,
      status,
      address,
      emergencyContact,
      joiningDate,
    } = data;

    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !qualification ||
      !specialization ||
      !employmentType
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: "teacher",
      isActive: true,
      approvalStatus: "approved",
    });

    const count = await Teacher.countDocuments();
    const teacherId = generateParentId(count);

    const teacher = await Teacher.create({
      userId: user._id,
      teacherId,
      gender,
      qualification,
      degree,
      university,
      specialization,
      employmentType,
      subjects: subjects || [],
      classTeacherOf: classTeacherOf || undefined,
      status: status || "active",
      isActive: true,
      address: address || {},
      emergencyContact: emergencyContact || {},
      joiningDate: joiningDate ? new Date(joiningDate) : new Date(),
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : undefined,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Teacher created successfully",
        data: JSON.parse(JSON.stringify(teacher)),
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}
