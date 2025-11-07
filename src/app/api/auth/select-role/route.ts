import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getErrorMessage } from "@/lib/errorHandler";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();
    const validRoles = ["student", "teacher", "parent", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent changing role if already approved
    if (user.role !== "pending" && user.approvalStatus === "approved") {
      return NextResponse.json(
        { error: "Role already set and approved" },
        { status: 400 }
      );
    }

    user.role = role;
    user.approvalStatus = "pending";
    await user.save();

    return NextResponse.json(
      { message: "Role updated successfully", role: user.role },
      { status: 200 }
    );
  } catch (error: unknown) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}
