// ============================================
// File: app/(auth)/register/page.tsx
// ============================================

"use client";

import { useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { getErrorMessage } from "@/lib/errorHandler";

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const res = await axios.post("/api/auth/register", formData);
      if (res.data.error) {
        setError(res.data.error);
        return;
      }
      setSuccess("Account created successfully! Redirecting...");
      setTimeout(() => router.push("/login"), 2000);
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      setError(message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-blue-100 to-blue-200 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">
          Create Your Account
        </h2>
        <p className="text-gray-500 mb-6 text-sm">
          Welcome to <span className="font-bold text-blue-600">EduSmart</span>{" "}
          School Portal
        </p>

        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          {/* Username */}
          <div>
            <label className="text-sm text-gray-600">Username</label>
            <div className="flex items-center border rounded-lg p-2 mt-1 focus-within:ring-2 focus-within:ring-blue-400">
              <User className="text-gray-400 w-5 h-5 mr-2" />
              <input
                type="text"
                name="username"
                placeholder="Enter a unique username"
                className="w-full outline-none text-gray-700"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
          </div>

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

          {/* Error & Success Messages */}
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-600 text-sm">{success}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-all"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => router.push("/login")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
}
