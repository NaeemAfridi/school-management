"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { GraduationCap, Users, UserCog, Shield } from "lucide-react";
import { getErrorMessage } from "@/lib/errorHandler";

const roles = [
  { id: "student", label: "Student", icon: GraduationCap },
  { id: "teacher", label: "Teacher", icon: UserCog },
  { id: "parent", label: "Parent", icon: Users },
  { id: "admin", label: "Admin", icon: Shield },
];

export default function RoleSelectionPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSelect = async () => {
    if (!selectedRole) return setError("Please select a role first.");
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("/api/auth/select-role", {
        role: selectedRole,
      });
      if (res.status === 200) {
        router.push(`/${selectedRole}/dashboard`);
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err) || "Failed to set role");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-4">
      <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-md p-8">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Select Your Role
        </h1>
        <p className="text-muted-foreground text-sm mb-6 text-center">
          Choose your role to continue to your dashboard.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {roles.map(({ id, label, icon: Icon }) => {
            const selected = selectedRole === id;
            return (
              <button
                key={id}
                onClick={() => setSelectedRole(id)}
                className={`flex flex-col items-center justify-center rounded-xl border p-5 transition-all
                  ${
                    selected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted-foreground hover:border-primary/50 hover:bg-accent"
                  }`}
              >
                <Icon className="w-8 h-8 mb-2" />
                <span className="font-medium">{label}</span>
              </button>
            );
          })}
        </div>

        {error && (
          <p className="text-destructive text-sm text-center mb-3">{error}</p>
        )}

        <button
          disabled={loading}
          onClick={handleSelect}
          className="w-full bg-primary text-primary-foreground py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-all disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
