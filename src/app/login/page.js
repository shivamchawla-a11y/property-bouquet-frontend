"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e?.preventDefault();

    if (loading) return;

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        // Store authentication token
        localStorage.setItem("token", data.token);

        // Redirect to admin panel
        window.location.href = "/admin";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Unable to connect to the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#071713] text-white">
      {/* =========================================================
          BACKGROUND
      ========================================================= */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-32 -top-32 h-[350px] w-[350px] rounded-full bg-[#C89D58]/10 blur-[110px]" />

        <div className="absolute -right-32 top-1/4 h-[400px] w-[400px] rounded-full bg-[#1d5a47]/20 blur-[120px]" />

        <div className="absolute bottom-[-150px] left-1/3 h-[400px] w-[400px] rounded-full bg-[#C89D58]/5 blur-[120px]" />
      </div>

      {/* Subtle grid texture */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
          backgroundSize: "55px 55px",
        }}
      />

      {/* =========================================================
          CENTER CONTENT
      ========================================================= */}

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">

          {/* =====================================================
              LOGIN CARD
          ===================================================== */}

          <div className="relative overflow-hidden rounded-[26px] border border-white/[0.12] bg-white/[0.065] shadow-[0_25px_80px_rgba(0,0,0,0.42)] backdrop-blur-2xl">

            {/* Gold top accent */}
            <div className="absolute left-0 right-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-[#C89D58] to-transparent opacity-90" />

            {/* Inner glow */}
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.04] via-transparent to-transparent" />

            <div className="relative px-6 py-7 sm:px-8 sm:py-8">

              {/* =================================================
                  LOGO / BRAND
              ================================================= */}

              <div className="mb-7 text-center">

                <div className="mb-4 flex justify-center">
                  <div className="relative flex h-[58px] w-[58px] items-center justify-center rounded-[18px] border border-[#C89D58]/30 bg-[#0b241c] shadow-[0_10px_28px_rgba(0,0,0,0.3)]">

                    {/* Logo glow */}
                    <div className="absolute inset-0 rounded-[18px] bg-[#C89D58]/10 blur-lg" />

                    <Image
                      src="/logo.webp"
                      alt="Property Bouquet"
                      width={40}
                      height={40}
                      className="relative z-10 h-[40px] w-[40px] object-contain"
                      priority
                    />
                  </div>
                </div>

                <h1 className="font-serif text-[25px] font-medium tracking-wide text-white">
                  Property Bouquet
                </h1>

                <div className="mx-auto mt-2.5 flex items-center justify-center gap-2.5">
                  <span className="h-px w-7 bg-[#C89D58]/40" />

                  <p className="text-[10px] font-medium uppercase tracking-[0.22em] text-[#C89D58]">
                    Admin Portal
                  </p>

                  <span className="h-px w-7 bg-[#C89D58]/40" />
                </div>

                <p className="mx-auto mt-3 max-w-[280px] text-[12px] leading-5 text-white/45">
                  Sign in to securely manage your Property Bouquet platform.
                </p>
              </div>

              {/* =================================================
                  FORM
              ================================================= */}

              <form onSubmit={handleLogin} className="space-y-4">

                {/* =================================================
                    EMAIL
                ================================================= */}

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.11em] text-white/60"
                  >
                    Email Address
                  </label>

                  <div className="relative">

                    {/* Email icon — ALWAYS VISIBLE */}
                    <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
                      <Mail
                        size={17}
                        strokeWidth={1.8}
                        className="text-[#C89D58]"
                      />
                    </div>

                    <input
                      id="email"
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                      className="
                        h-[48px]
                        w-full
                        rounded-[13px]
                        border
                        border-white/[0.12]
                        bg-black/[0.18]
                        pl-11
                        pr-4
                        text-[13px]
                        text-white
                        outline-none
                        placeholder:text-white/25
                        transition-all
                        duration-200
                        hover:border-white/[0.18]
                        focus:border-[#C89D58]/60
                        focus:bg-black/[0.25]
                        focus:ring-4
                        focus:ring-[#C89D58]/[0.07]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />
                  </div>
                </div>

                {/* =================================================
                    PASSWORD
                ================================================= */}

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-[11px] font-medium uppercase tracking-[0.11em] text-white/60"
                  >
                    Password
                  </label>

                  <div className="relative">

                    {/* Lock icon — ALWAYS VISIBLE */}
                    <div className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2">
                      <Lock
                        size={17}
                        strokeWidth={1.8}
                        className="text-[#C89D58]"
                      />
                    </div>

                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      disabled={loading}
                      className="
                        h-[48px]
                        w-full
                        rounded-[13px]
                        border
                        border-white/[0.12]
                        bg-black/[0.18]
                        pl-11
                        pr-11
                        text-[13px]
                        text-white
                        outline-none
                        placeholder:text-white/25
                        transition-all
                        duration-200
                        hover:border-white/[0.18]
                        focus:border-[#C89D58]/60
                        focus:bg-black/[0.25]
                        focus:ring-4
                        focus:ring-[#C89D58]/[0.07]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />

                    {/* =================================================
                        EYE BUTTON — ALWAYS VISIBLE
                    ================================================= */}

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((previous) => !previous)
                      }
                      aria-label={
                        showPassword
                          ? "Hide password"
                          : "Show password"
                      }
                      disabled={loading}
                      className="
                        absolute
                        right-1.5
                        top-1/2
                        flex
                        h-9
                        w-9
                        -translate-y-1/2
                        items-center
                        justify-center
                        rounded-lg
                        text-[#C89D58]
                        transition-all
                        duration-200
                        hover:bg-white/[0.06]
                        hover:text-[#D4AF70]
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#C89D58]/25
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    >
                      {showPassword ? (
                        <EyeOff
                          size={18}
                          strokeWidth={1.8}
                        />
                      ) : (
                        <Eye
                          size={18}
                          strokeWidth={1.8}
                        />
                      )}
                    </button>
                  </div>

                  {/* =================================================
                      FORGOT PASSWORD
                  ================================================= */}

                  <div className="mt-2 flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="
                        text-[11px]
                        font-medium
                        text-[#C89D58]
                        transition-colors
                        duration-200
                        hover:text-[#D4AF70]
                        hover:underline
                        underline-offset-4
                        focus:outline-none
                        focus:ring-2
                        focus:ring-[#C89D58]/25
                        rounded-sm
                      "
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                {/* =================================================
                    LOGIN BUTTON
                ================================================= */}

                <button
                  type="submit"
                  disabled={loading}
                  className="
                    group
                    relative
                    mt-1
                    flex
                    h-[49px]
                    w-full
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-[13px]
                    border
                    border-[#D4AF70]/40
                    bg-gradient-to-r
                    from-[#B88948]
                    via-[#C89D58]
                    to-[#D4AF70]
                    px-5
                    text-[12px]
                    font-semibold
                    uppercase
                    tracking-[0.13em]
                    text-[#101612]
                    shadow-[0_8px_25px_rgba(200,157,88,0.16)]
                    transition-all
                    duration-300
                    hover:-translate-y-[1px]
                    hover:shadow-[0_12px_30px_rgba(200,157,88,0.24)]
                    focus:outline-none
                    focus:ring-4
                    focus:ring-[#C89D58]/20
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:translate-y-0
                  "
                >
                  {/* Permanent premium shine */}
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      left-[8%]
                      w-[18%]
                      rotate-[18deg]
                      bg-white/20
                      blur-md
                      opacity-70
                      transition-all
                      duration-700
                      group-hover:left-[75%]
                      group-hover:opacity-90
                    "
                  />

                  {/* Permanent top highlight */}
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      top-0
                      h-px
                      bg-white/35
                    "
                  />

                  {loading ? (
                    <span className="relative z-10 flex items-center gap-2">
                      <Loader2
                        size={16}
                        className="animate-spin"
                        strokeWidth={2}
                      />
                      Logging In
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center gap-2">
                      Sign In

                      <ArrowRight
                        size={16}
                        strokeWidth={2}
                        className="
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    </span>
                  )}
                </button>
              </form>

              {/* =================================================
                  SECURITY NOTE
              ================================================= */}

              <div className="mt-5 flex items-center justify-center gap-1.5">
                <Lock
                  size={11}
                  strokeWidth={1.8}
                  className="text-[#C89D58]"
                />

                <p className="text-[9px] uppercase tracking-[0.13em] text-white/30">
                  Secure Admin Access
                </p>
              </div>
            </div>
          </div>

          {/* =====================================================
              FOOTER
          ===================================================== */}

          <div className="mt-4 text-center">
            <p className="text-[10px] tracking-wide text-white/25">
              © 2026 Property Bouquet
            </p>

            <p className="mt-0.5 text-[8px] uppercase tracking-[0.17em] text-[#C89D58]/30">
              Luxury Real Estate
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}