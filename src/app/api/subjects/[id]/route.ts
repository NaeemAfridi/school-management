import { NextResponse } from "next/server";

import Subject from "@/models/Subject";
import connectDB from "@/lib/db";
import { getErrorMessage } from "@/lib/errorHandler";

export async function GET(_: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  await connectDB();
  const subject = await Subject.findById(id).populate("teacherId");
  if (!subject)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(subject);
}

export async function PUT(req: Request, context: { params: { id: string } }) {
  try {
    const { id } = await context.params;
    await connectDB();
    const body = await req.json();
    const updated = await Subject.findByIdAndUpdate(id, body, {
      new: true,
    });
    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 400 });
  }
}

export async function DELETE(_: Request, context: { params: { id: string } }) {
  const { id } = await context.params;
  await connectDB();
  await Subject.findByIdAndDelete(id);
  return NextResponse.json({ message: "Subject deleted" });
}
