import { NextRequest, NextResponse } from "next/server";
import Student from "@/models/Student";
import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await connectDB();

  try {
    const student = await Student.findById(id).populate(
      "userId",
      "username firstName lastName email"
    );
    if (!student)
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    return NextResponse.json({ success: true, data: student });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await connectDB();

  const body = await req.json();
  try {
    const updated = await Student.findByIdAndUpdate(id, body, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (err: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(err) },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await connectDB();
  try {
    await Student.findByIdAndDelete(id);
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
