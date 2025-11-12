import { NextRequest, NextResponse } from "next/server";

import Teacher from "@/models/Teacher";
import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";

// GET teacher by ID
export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    const teacher = await Teacher.findById(id)
      .populate("userId", "username firstName lastName email")
      .populate("subjects", "subjectName");
    if (!teacher)
      return NextResponse.json(
        { success: false, message: "Teacher not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: teacher });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

// PUT update teacher
export async function PUT(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const body = await req.json();
  try {
    const updated = await Teacher.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

// DELETE teacher
export async function DELETE(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  try {
    await Teacher.findByIdAndDelete(id);
    return NextResponse.json({
      success: true,
      message: "Deleted successfully",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}
