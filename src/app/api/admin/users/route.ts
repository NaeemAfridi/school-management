// ============================================
// File: app/api/admin/users/route.ts
// REST: GET /api/admin/users?page=&limit=&search=&role=&approvalStatus=
// ============================================

import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getErrorMessage } from "@/lib/errorHandler";

// Add interface for filter
interface UserFilter {
  $or?: Array<{
    email?: { $regex: string; $options: string };
    username?: { $regex: string; $options: string };
    firstName?: { $regex: string; $options: string };
    lastName?: { $regex: string; $options: string };
  }>;
  role?: string;
  approvalStatus?: string;
}

export async function GET(req: Request) {
  try {
    await connectDB();

    const url = new URL(req.url);
    const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
    const limit = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("limit") || "10"))
    );
    const search = (url.searchParams.get("search") || "").trim();
    const role = url.searchParams.get("role");
    const approvalStatus = url.searchParams.get("approvalStatus");

    const filter: UserFilter = {};
    if (search) {
      filter.$or = [
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
        { firstName: { $regex: search, $options: "i" } },
        { lastName: { $regex: search, $options: "i" } },
      ];
    }
    if (role) filter.role = role;
    if (approvalStatus) filter.approvalStatus = approvalStatus;

    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(filter)
        .select("-password -resetPasswordToken -resetPasswordExpires")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(filter),
    ]);

    return NextResponse.json({ users, total, page, limit });
  } catch (err: unknown) {
    return NextResponse.json({ error: getErrorMessage(err) }, { status: 500 });
  }
}
