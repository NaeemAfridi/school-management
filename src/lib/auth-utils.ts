// ============================================
// File: lib/auth-utils.ts
// Helper functions for authentication
// ============================================

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

/**
 * Get the current session on the server side
 */
export async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  return session?.user;
}

/**
 * Require authentication - redirect to login if not authenticated
 */
export async function requireAuth() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return user;
}

/**
 * Require specific role - redirect if user doesn't have required role
 */
export async function requireRole(
  allowedRoles: Array<"pending" | "admin" | "teacher" | "student" | "parent">
) {
  const user = await requireAuth();

  if (!allowedRoles.includes(user.role)) {
    redirect("/unauthorized");
  }

  return user;
}

/**
 * Check if user has specific role
 */
export async function hasRole(
  role: "admin" | "teacher" | "student" | "parent"
) {
  const user = await getCurrentUser();
  return user?.role === role;
}

/**
 * Check if user has any of the specified roles
 */
export async function hasAnyRole(
  roles: Array<"pending" | "admin" | "teacher" | "student" | "parent">
) {
  const user = await getCurrentUser();
  return user ? roles.includes(user.role) : false;
}
