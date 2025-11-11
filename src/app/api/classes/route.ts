import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";
import Class from "@/models/Class";

import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  await connectDB();
  const classes = await Class.find()
    .populate("classTeacherId", "name")
    .populate("subjects", "subjectName subjectCode");
  return NextResponse.json({ success: true, data: classes });
}

export async function POST(req: NextRequest) {
  await connectDB();
  const body = await req.json();
  try {
    const newClass = new Class(body);
    await newClass.save();
    return NextResponse.json({
      success: true,
      data: newClass,
      message: "Class created successfully",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
