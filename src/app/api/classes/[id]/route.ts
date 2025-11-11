import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";
import Class from "@/models/Class";

import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await connectDB();
  const cls = await Class.findById(id)
    .populate("classTeacherId", "name")
    .populate("subjects", "subjectName");
  if (!cls)
    return NextResponse.json(
      { success: false, message: "Class not found" },
      { status: 404 }
    );
  return NextResponse.json({ success: true, data: cls });
}

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await context.params;
  await connectDB();
  const body = await req.json();
  try {
    const updatedClass = await Class.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!updatedClass)
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    return NextResponse.json({
      success: true,
      data: updatedClass,
      message: "Class updated successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 400 }
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
    const deletedClass = await Class.findByIdAndDelete(id);
    if (!deletedClass)
      return NextResponse.json(
        { success: false, message: "Class not found" },
        { status: 404 }
      );
    return NextResponse.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
