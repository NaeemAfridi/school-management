// ============================================
// File: lib/auth.ts
// NextAuth Configuration (Email & Password Auth Only)
// ============================================

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "./db";
import User from "@/models/User";
import Student from "@/models/Student";
import Teacher from "@/models/Teacher";
import Parent from "@/models/Parent";

//  Extend NextAuth types for session + JWT
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string;
      role: "pending" | "admin" | "teacher" | "student" | "parent";
      approvalStatus: "pending" | "approved" | "rejected";
      profileId?: string;
      image?: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string;
    role: "pending" | "admin" | "teacher" | "student" | "parent";
    approvalStatus: "pending" | "approved" | "rejected";
    profileId?: string;
    image?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "pending" | "admin" | "teacher" | "student" | "parent";
    approvalStatus: "pending" | "approved" | "rejected";
    profileId?: string;
    image?: string | null;
  }
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      /**
       *  Authorize handles user login verification
       * It returns the user object (serialized into the JWT) or throws an error.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        await connectDB();

        //  Find the user
        const user = await User.findOne({ email: credentials.email }).select(
          "+password"
        );

        if (!user) throw new Error("Invalid email or password");
        if (!user.isActive)
          throw new Error("Account deactivated. Contact admin.");

        //  Compare password
        const validPassword = await user.comparePassword(credentials.password);
        if (!validPassword) throw new Error("Invalid email or password");

        // ⏱ Update last login timestamp
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

        //  Resolve user profile link (if exists)
        let profileId: string | undefined;

        if (user.role === "student") {
          const student = await Student.findOne({ userId: user._id }).lean();
          profileId = student?._id?.toString();
        } else if (user.role === "teacher") {
          const teacher = await Teacher.findOne({ userId: user._id }).lean();
          profileId = teacher?._id?.toString();
        } else if (user.role === "parent") {
          const parent = await Parent.findOne({ userId: user._id }).lean();
          profileId = parent?._id?.toString();
        }

        //  Return minimal safe object for JWT session
        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role || "pending",
          approvalStatus: user.approvalStatus || "pending",
          profileId,
          image: user.profilePhoto || null,
        };
      },
    }),
  ],

  //  Handle JWT + session synchronization
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.approvalStatus = user.approvalStatus;
        token.profileId = user.profileId;
        token.image = user.image || null;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.approvalStatus = token.approvalStatus;
        session.user.profileId = token.profileId;
        session.user.image = token.image;
      }
      return session;
    },
  },

  //  Session + token configuration
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
