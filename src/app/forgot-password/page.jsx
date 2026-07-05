"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";

import {
  Mail,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";

import { motion } from "framer-motion";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setMessage("");

      const res = await fetch(
        "https://property-bouquet-backend.onrender.com/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setSuccess(true);
        setMessage(
          data.message ||
            "Password reset email has been sent."
        );
      } else {
        setMessage(
          data.message || "Something went wrong."
        );
      }
    } catch (err) {
      setMessage("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-[#050505]
          pt-[88px]
        "
      >
        {/* Floating Particles */}

        <div
          className="
          absolute
          top-[18%]
          left-[12%]
          w-2
          h-2
          rounded-full
          bg-[#D9B061]
          animate-pulse
        "
        />

        <div
          className="
          absolute
          top-[38%]
          left-[28%]
          w-3
          h-3
          rounded-full
          bg-[#D9B061]/60
          animate-ping
        "
        />

        <div
          className="
          absolute
          bottom-[25%]
          right-[30%]
          w-2
          h-2
          rounded-full
          bg-[#D9B061]/70
          animate-pulse
        "
        />

        {/* Background */}

        <div
          className="
            absolute
            inset-y-0
            left-0
            w-full
            lg:w-[62%]
            overflow-hidden
          "
        >

<Image
  src="/auth-bg.webp"
  alt=""
  fill
  priority
  sizes="100vw"
  className="
    absolute
    inset-0
    object-cover
    object-center
    scale-[1.08]
  "
/>

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/10
              via-black/30
              to-[#050505]
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-b
              from-black/40
              via-transparent
              to-black/60
            "
          />
        </div>

        <div
          className="
            absolute
            top-0
            right-0
            h-full
            w-full
            lg:w-[42%]
            bg-[#050505]
          "
        />

        <motion.div
          initial={{
            opacity: 0,
            y: 30,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.7,
          }}
          className="
            relative
            z-20
            min-h-screen
            max-w-[1500px]
            mx-auto
            grid
            lg:grid-cols-[1fr_500px]
            items-center
            gap-6
            px-5
            lg:px-14
          "
        >

                      {/* ================= LEFT SECTION ================= */}

          <div
            className="
              hidden
              lg:flex
              relative
              flex-col
              justify-center
              pb-20
              max-w-[430px]
            "
          >
            {/* Heading */}

            <div className="max-w-[480px]">

              <h1
                className="
                  text-white
                  text-[54px]
                  leading-[0.92]
                  tracking-[-0.05em]
                  font-extralight
                "
              >
                Secure

                <span className="block text-[#D9B061]">
                  Account
                </span>

                Recovery
              </h1>

              <p
                className="
                  mt-10
                  text-white/70
                  text-[17px]
                  leading-[1.8]
                "
              >
                Regain access to your Property Bouquet
                account through our secure password
                recovery process protected with
                enterprise-grade encryption.
              </p>

            </div>

            {/* Features */}

            <div className="mt-14 space-y-7">

              {[
                "256-bit SSL Encryption",
                "Secure Email Verification",
                "15 Minute Expiry Link",
                "Enterprise Grade Security",
              ].map((item) => (

                <div
                  key={item}
                  className="flex items-center gap-5"
                >

                  <div
                    className="
                      w-9
                      h-9
                      rounded-full
                      border
                      border-[#D9B061]
                      bg-[#D9B061]/10
                      flex
                      items-center
                      justify-center
                      text-[#D9B061]
                    "
                  >
                    ✓
                  </div>

                  <span
                    className="
                      text-white
                      text-[13px]
                      tracking-wide
                    "
                  >
                    {item}
                  </span>

                </div>

              ))}

            </div>

            {/* Security Card */}

            <motion.div

              initial={{
                opacity:0,
                y:25,
              }}

              animate={{
                opacity:1,
                y:0,
              }}

              transition={{
                delay:0.35,
              }}

              className="
                mt-12
                rounded-[24px]
                border
                border-[#D9B061]/20
                bg-[rgba(12,12,12,0.72)]
                backdrop-blur-xl
                shadow-[0_20px_60px_rgba(0,0,0,0.45)]
                p-7
              "
            >

              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  bg-[#D9B061]/10
                  border
                  border-[#D9B061]/20
                  flex
                  items-center
                  justify-center
                  mb-5
                "
              >
                <ShieldCheck
                  className="text-[#D9B061]"
                  size={22}
                />
              </div>

              <h3
                className="
                  text-white
                  text-xl
                  font-medium
                "
              >
                Your Security Matters
              </h3>

              <p
                className="
                  mt-4
                  text-white/60
                  text-[14px]
                  leading-7
                "
              >
                Every password reset request is protected
                with encrypted verification and
                time-limited access to ensure your
                account remains secure.
              </p>

            </motion.div>

          </div>

          {/* ================= RIGHT SECTION ================= */}

          <div
            className="
              relative
              flex
              justify-end
              items-center
              py-16
              lg:py-0
            "
          >

            <div
              className="
                absolute
                right-10
                w-[520px]
                h-[520px]
                rounded-full
                bg-[#D9B061]/8
                blur-[150px]
              "
            />

            <motion.div

              whileHover={{
                y:-6,
                scale:1.01,
              }}

              className="
                relative
                w-full
                max-w-[460px]
                overflow-hidden
                rounded-[28px]
                border
                border-white/10
                bg-[rgba(12,12,12,0.78)]
                backdrop-blur-[28px]
                shadow-[0_35px_90px_rgba(0,0,0,0.55)]
                p-7
              "
            >

                          <div
                className="
                  bg-white/[0.03]
                  rounded-xl
                  p-1
                  flex
                  mb-8
                "
              >
                <button
                  className="
                    flex-1
                    h-[48px]
                    rounded-full
                    text-[13px]
                    font-semibold
                    tracking-[0.15em]
                    uppercase
                    bg-[#D9B061]
                    text-black
                    shadow-[0_10px_35px_rgba(217,176,97,0.4)]
                  "
                >
                  Forgot Password
                </button>
              </div>

              {/* FORM */}
              <form
                onSubmit={handleForgotPassword}
                className="space-y-6"
              >
                <h3
                  className="
                    text-white
                    text-3xl
                    font-semibold
                    mb-2
                  "
                >
                  Reset Your Password
                </h3>

                <p
                  className="
                    text-white/55
                    text-[13px]
                    leading-7
                    mb-8
                  "
                >
                  Enter your registered email address and we will send you a secure password reset link.
                </p>

                {/* EMAIL INPUT */}
                <div className="space-y-3">
                  <label
                    className="
                      text-[12px]
                      uppercase
                      tracking-[0.28em]
                      text-white/45
                    "
                  >
                    Email Address
                  </label>

                  <div className="relative">
                    <Mail
                      className="
                        absolute
                        left-5
                        top-1/2
                        -translate-y-1/2
                        text-white/30
                      "
                      size={18}
                    />

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="
                        w-full
                        h-[54px]
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.03]
                        pl-12
                        pr-5
                        text-[13px]
                        text-white
                        placeholder:text-white/25
                        outline-none
                        transition-all
                        duration-300
                        focus:border-[#D9B061]
                        focus:bg-white/[0.05]
                        focus:ring-4
                        focus:ring-[#D9B061]/10
                      "
                    />
                  </div>
                </div>

                {/* MESSAGE */}
                {message && (
                  <div
                    className={`
                      text-[13px]
                      px-4
                      py-3
                      rounded-lg
                      border
                      ${
                        success
                          ? "border-green-500/30 bg-green-500/10 text-green-300"
                          : "border-red-500/30 bg-red-500/10 text-red-300"
                      }
                    `}
                  >
                    {message}
                  </div>
                )}

                {/* SUBMIT BUTTON */}
                <button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    h-[50px]
                    rounded-xl
                    bg-[#D9B061]
                    text-black
                    font-semibold
                    tracking-[0.12em]
                    uppercase
                    transition-all
                    duration-500
                    hover:scale-[1.02]
                    hover:shadow-[0_20px_50px_rgba(217,176,97,0.35)]
                    disabled:opacity-60
                  "
                >
                  {loading
                    ? "Sending Link..."
                    : "Send Reset Link"}
                </button>

                {/* BACK TO LOGIN */}
                <div className="text-center mt-6">
                  <Link
                    href="/auth"
                    className="
                      inline-flex
                      items-center
                      gap-2
                      text-[#D9B061]
                      text-sm
                      hover:text-[#f2d08c]
                      transition
                    "
                  >
                    <ArrowLeft size={16} />
                    Back to Login
                  </Link>
                </div>
              </form>

              {/* SUCCESS STATE EXTRA UI */}
              {success && (
                <div
                  className="
                    mt-8
                    p-5
                    rounded-xl
                    border
                    border-green-500/20
                    bg-green-500/5
                  "
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-green-400" />

                    <p className="text-green-300 text-sm">
                      If this email exists, a secure reset link has been sent.
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
