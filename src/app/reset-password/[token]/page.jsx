"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setMessage("Passwords do not match");
    }

    try {
      setLoading(true);

      const res = await fetch(
        `/api/auth/reset-password/${token}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setMessage("Password reset successful. Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setMessage(data.message || "Reset failed");
      }
    } catch (err) {
      setMessage("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#050505] flex items-center justify-center pt-[88px]">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-[420px] p-6 rounded-2xl border border-white/10 bg-white/[0.03]"
        >
          <div className="flex items-center gap-2 mb-6 text-[#D9B061]">
            <Lock size={18} />
            <h1 className="text-white text-xl font-semibold">
              Reset Password
            </h1>
          </div>

          <form onSubmit={handleReset} className="space-y-5">
            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-[50px] px-4 rounded-lg bg-black/30 border border-white/10 text-white"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full h-[50px] px-4 rounded-lg bg-black/30 border border-white/10 text-white"
            />

            {message && (
              <p className="text-sm text-white/70">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-[50px] bg-[#D9B061] text-black font-semibold rounded-lg"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <Link
              href="/login"
              className="block text-center text-[#D9B061] text-sm mt-4"
            >
              Back to Login
            </Link>
          </form>
        </motion.div>
      </main>
    </>
  );
}