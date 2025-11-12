import { NextResponse } from "next/server";

import Subject from "@/models/Subject";
import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";

export async function GET() {
  await connectDB();
  const subjects = await Subject.find().populate("teacherId", "name email");
  return NextResponse.json(subjects);
}

export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const subject = await Subject.create(body);
    return NextResponse.json(subject, { status: 201 });
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 400 }
    );
  }
}
