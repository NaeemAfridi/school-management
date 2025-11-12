import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Student from "@/models/Student";
import Class from "@/models/Class";
import { getErrorMessage } from "@/lib/errorHandler";
import { generateStudentId } from "@/utils/idGenerator";
import { requireRole } from "@/lib/auth-utils";
import { Types } from "mongoose";

interface StudentQuery {
  classId?: Types.ObjectId;
  section?: string;
  isActive?: boolean;
}

// =============== GET ALL STUDENTS ===============
export async function GET(req: NextRequest) {
  try {
    await requireRole(["admin", "teacher"]);
    await connectDB();

    const url = new URL(req.url);
    const classId = url.searchParams.get("classId");
    const section = url.searchParams.get("section");
    const isActive = url.searchParams.get("isActive");
    const search = url.searchParams.get("search");

    const query: StudentQuery = {};

    if (classId && Types.ObjectId.isValid(classId)) {
      query.classId = new Types.ObjectId(classId);
    }

    if (section) query.section = section;
    if (isActive !== null) query.isActive = isActive === "true";

    let students = await Student.find(query)
      .populate("userId", "firstName lastName email profilePhoto")
      .populate("classId", "className section")
      .populate("parentId", "userId")
      .sort({ createdAt: -1 })
      .lean();

    // ========== SEARCH FILTER ==========
    if (search) {
      const lower = search.toLowerCase();
      students = students.filter((s) => {
        const user = s.userId as unknown;

        if (
          typeof user === "object" &&
          user !== null &&
          "firstName" in user &&
          "lastName" in user &&
          "email" in user
        ) {
          const u = user as {
            firstName: string;
            lastName: string;
            email: string;
          };

          return (
            (u.firstName && u.firstName.toLowerCase().includes(lower)) ||
            (u.lastName && u.lastName.toLowerCase().includes(lower)) ||
            (u.email && u.email.toLowerCase().includes(lower))
          );
        }

        return false;
      });
    }

    return NextResponse.json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("❌ GET Students Error:", error);
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 500 }
    );
  }
}

//  Create new student
export async function POST(req: NextRequest) {
  try {
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
      bloodGroup,
      address,
      classId,
      section,
      rollNumber,
      parentId,
      emergencyContact,
      admissionDate,
    } = data;

    // =============== VALIDATIONS ===============
    if (
      !email ||
      !password ||
      !firstName ||
      !lastName ||
      !dateOfBirth ||
      !gender ||
      !classId ||
      !rollNumber
    ) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Email already exists" },
        { status: 400 }
      );
    }

    // Check if roll number already exists in the same class
    const existingStudent = await Student.findOne({
      classId,
      section,
      rollNumber,
    });
    if (existingStudent) {
      return NextResponse.json(
        { success: false, message: "Roll number already exists in this class" },
        { status: 400 }
      );
    }

    // =============== CREATE USER ===============
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phoneNumber,
      role: "student",
      isActive: true,
      approvalStatus: "approved",
    });

    // =============== GENERATE STUDENT ID ===============
    const studentCount = await Student.countDocuments();
    const studentId = await generateStudentId(studentCount);

    // =============== CREATE STUDENT ===============
    const student = await Student.create({
      userId: user._id,
      studentId,
      dateOfBirth,
      gender,
      bloodGroup,
      address,
      classId,
      section,
      rollNumber,
      parentId,
      emergencyContact,
      admissionDate: admissionDate || new Date(),
    });

    // =============== UPDATE CLASS ===============
    await Class.findByIdAndUpdate(classId, {
      $push: { students: student._id },
      $inc: { currentStrength: 1 },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Student created successfully",
        data: JSON.parse(JSON.stringify(student)),
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
