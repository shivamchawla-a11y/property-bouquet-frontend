"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function ConsultationModal({
  open,
  onClose,
}) {
  const API =
    "/api";

  const [leadName, setLeadName] =
    useState("");

  const [leadPhone, setLeadPhone] =
    useState("");

  const [submitting, setSubmitting] =
    useState(false);

    const handleSubmit = async () => {
  if (!leadName.trim()) {
    alert("Please enter your name");
    return;
  }

  if (!leadPhone.trim()) {
    alert("Please enter your phone number");
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(
      `${API}/leads`,
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          source:
            "Private Consultation",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ||
          "Submission failed"
      );
    }

    alert(
      "Consultation request submitted successfully ✅"
    );

    setLeadName("");
    setLeadPhone("");

    onClose();
  } catch (err) {
    console.error(err);

    alert(
      "Failed to submit request ❌"
    );
  } finally {
    setSubmitting(false);
  }
};
  return (
    <AnimatePresence>
      {open && (
        <div
          className="
            fixed
            inset-0
            z-[99999]
            flex
            items-center
            justify-center
            p-4
          "
        >
          {/* BACKDROP */}
          <div
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-sm
            "
            onClick={onClose}
          />

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
              scale: 0.95,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.95,
            }}
            transition={{
              duration: 0.35,
            }}
            className="
              relative
              w-full
              max-w-md
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-[rgba(7,10,10,0.58)]
              backdrop-blur-3xl
              shadow-[0_20px_80px_rgba(0,0,0,0.55)]
            "
          >
            {/* GLOW */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,166,75,0.16),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(201,166,75,0.10),transparent_30%)]" />

            {/* HEADER */}
            <div className="relative z-10 px-6 pt-6 pb-5 border-b border-white/10">
              <button
                onClick={onClose}
                className="
                  absolute
                  right-5
                  top-5
                  w-8
                  h-8
                  rounded-full
                  bg-white/5
                  border
                  border-white/10
                  text-white/70
                "
              >
                ✕
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-[1px] bg-[#d8b46b]" />

                <p className="text-[#d8b46b] text-[10px] tracking-[3px] uppercase">
                  Private Advisory
                </p>
              </div>

              <h2
                className="
                  text-white
                  text-[34px]
                  leading-none
                  tracking-[-1px]
                "
                style={{
                  fontFamily:
                    "Georgia, Times New Roman, serif",
                }}
              >
                Book a
                <br />
                Private Consultation
              </h2>

              <p className="mt-4 text-white/60 text-[13px] leading-[1.9]">
                Connect directly with our luxury property
                specialists for personalized investment
                guidance and exclusive opportunities.
              </p>
            </div>

            {/* FORM */}
            <div className="relative z-10 p-6 space-y-5">
              <input
  value={leadName}
  onChange={(e) =>
    setLeadName(e.target.value)
  }
  placeholder="Full Name"
  className="
    w-full
    h-[52px]
    px-4
    rounded-xl
    bg-white/5
    border
    border-white/10
    text-white
  "
/>

              <input
  value={leadPhone}
  onChange={(e) =>
    setLeadPhone(e.target.value)
  }
  placeholder="Mobile Number"
  className="
    w-full
    h-[52px]
    px-4
    rounded-xl
    bg-white/5
    border
    border-white/10
    text-white
  "
/>

              <button
  onClick={handleSubmit}
  disabled={submitting}
  className="
    w-full
    h-[52px]
    rounded-xl
    bg-[#c9a64b]
    text-black
    text-[10px]
    tracking-[2px]
    uppercase
    font-semibold
    disabled:opacity-50
  "
>
  {submitting
    ? "Submitting..."
    : "REQUEST CONSULTATION →"}
</button>

              <p className="text-center text-white/40 text-[11px]">
                Your information remains completely
                confidential.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}