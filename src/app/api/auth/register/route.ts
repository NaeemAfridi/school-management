// app/api/auth/register/route.ts

import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { getErrorMessage } from "@/lib/errorHandler";

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const { username, email, password } = body;

    // Validation
    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return NextResponse.json(
        { error: "Username already taken." },
        { status: 409 }
      );
    }

    // Limit accounts per email (to prevent spam)
    const existingEmailCount = await User.countDocuments({ email });
    if (existingEmailCount >= 5) {
      return NextResponse.json(
        {
          error:
            "Too many accounts registered with this email. Please contact support.",
        },
        { status: 429 }
      );
    }

    // Create minimal user record
    const user = await User.create({
      username,
      email,
      password,
      role: "pending",
      approvalStatus: "pending",
    });

    return NextResponse.json(
      {
        message: "Account created successfully.",
        user: {
          id: user._id,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Registration error:", error);
    const message = getErrorMessage(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
