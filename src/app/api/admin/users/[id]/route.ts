// ============================================
// File: app/api/admin/users/[id]/route.ts
// REST: GET /api/admin/users/:id, PATCH to edit/approve, DELETE to remove
// ============================================

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getErrorMessage } from "@/lib/errorHandler";

type AllowedFields =
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "role"
  | "approvalStatus"
  | "isActive";

interface UserUpdate {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  role?: "pending" | "admin" | "teacher" | "student" | "parent";
  approvalStatus?: "pending" | "approved" | "rejected";
  isActive?: boolean;
}
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findById(params.id)
      .select("-password -resetPasswordToken -resetPasswordExpires")
      .lean();
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const body = await req.json();
    const allowed: AllowedFields[] = [
      "firstName",
      "lastName",
      "phoneNumber",
      "role",
      "approvalStatus",
      "isActive",
    ];
    const update: UserUpdate = {};
    for (const k of allowed) {
      if (k in body) {
        update[k] = body[k];
      }
    }

    if (Object.keys(update).length === 0) {
      return NextResponse.json(
        { error: "No valid fields to update" },
        { status: 400 }
      );
    }
    const user = await User.findByIdAndUpdate(params.id, update, {
      new: true,
    }).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const user = await User.findByIdAndDelete(params.id).select("-password");
    if (!user)
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    return NextResponse.json({ message: "User deleted", user });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
