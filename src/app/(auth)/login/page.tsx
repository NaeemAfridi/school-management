"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import { Mail, Lock } from "lucide-react";
import { getErrorMessage } from "@/lib/errorHandler";

export default function LoginPage() {
  const router = useRouter();
  const { data: session, status } = useSession(); //  Get session data
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //  Auto-redirect if already logged in
  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      const { role, approvalStatus } = session.user;

      if (approvalStatus !== "approved") {
        router.replace("/pending-approval");
      } else if (!role || role === "pending") {
        router.replace("/select-role");
      } else {
        const redirectMap: Record<string, string> = {
          admin: "/admin",
          teacher: "/teacher",
          student: "/student",
          parent: "/parent",
        };
        router.replace(redirectMap[role] || "/");
      }
    }
  }, [session, status, router]);

  //  Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  //  Handle login form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
      });

      if (res?.error) {
        setError("Invalid email or password");
      } else {
        //  Let the `useSession()` hook handle redirect via effect above
        setTimeout(() => window.location.reload(), 300); // ensure session refresh
      }
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  //  Optional: loading screen while session loads
  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        Checking session...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Login to your{" "}
          <span className="font-bold text-blue-600">EduSmart</span> account
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Email */}
          <div>
            <label className="text-sm text-gray-600">Email</label>
            <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 focus-within:ring-blue-400">
              <Mail className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="w-full outline-none text-gray-700"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-gray-600">Password</label>
            <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 focus-within:ring-blue-400">
              <Lock className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full outline-none text-gray-700"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          {/* Error */}
          {error && <p className="text-red-500 text-sm">{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/register")}
          >
            Register
          </span>
        </p>
      </div>
    </div>
  );
}
