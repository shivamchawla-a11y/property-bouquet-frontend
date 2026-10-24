"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import {
  ArrowRight,
  Mail,
  Phone,
  UserRound,
  X,
  Sparkles,
} from "lucide-react";

export default function TimedLeadPopup() {
  const API = "/api";
  const SESSION_KEY = "propertyBouquetTimedLeadPopupShown_v4";
  const DELAY_MS = 3000;

  const [visible, setVisible] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Show the complete form after 3 seconds, once per browser session.
  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        return;
      }
    } catch (error) {
      console.warn("Unable to read popup session state:", error);
    }

    const timer = window.setTimeout(() => {
      setVisible(true);

      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch (error) {
        console.warn("Unable to save popup session state:", error);
      }
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // Close the popup for the current browser session.
  const handleClose = () => {
    if (submitting) return;

    setVisible(false);
    setErrorMessage("");
    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setSubmitted(false);
  };

  // Submit using the existing Property Bouquet leads API.
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (submitting || submitted) return;

    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();

    setErrorMessage("");

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage("Please enter a valid 10-digit mobile number.");
      return;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          property: "Website Enquiry",
          source: "Website - 4 Second Popup",
          leadType: "Website Enquiry",
          pageUrl: window.location.href,
          pagePath: window.location.pathname,
          pageTitle: document.title || "Property Bouquet",
        }),
      });

      let data = {};

      try {
        data = await res.json();
      } catch {
        data = {};
      }

      if (!res.ok) {
        throw new Error(
          data?.message || `Submission failed (${res.status})`
        );
      }

      setSubmitted(true);

      window.setTimeout(() => {
        setVisible(false);
        setLeadName("");
        setLeadPhone("");
        setLeadEmail("");
        setErrorMessage("");
        setSubmitted(false);
      }, 2500);
    } catch (error) {
      console.error("TIMED WEBSITE LEAD SUBMISSION ERROR:", error);

      setErrorMessage(
        error?.message ||
          "Unable to submit your details. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="timed-lead-popup"
          initial={{ opacity: 0, y: 18, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{
            duration: 0.3,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="
            fixed
            right-3
            bottom-[104px]
            z-[9990]
            w-[min(350px,calc(100vw-24px))]
            sm:right-5
            sm:bottom-[104px]
          "
        >
          <div
            className="
              relative isolate overflow-hidden
              max-h-[min(72dvh,570px)]
              overflow-y-auto overscroll-contain
              rounded-[20px]
              border border-[#c9a64b]/25
              bg-[#07130f]
              shadow-[0_18px_60px_rgba(0,0,0,0.38)]
            "
          >
            {/* Decorative background glow */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[20px]">
              <div className="absolute -left-20 -top-24 h-48 w-48 rounded-full bg-[#c9a64b]/10 blur-[65px]" />
              <div className="absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-[#0d4b3c]/20 blur-[65px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 border-b border-white/[0.08] px-5 pb-4 pt-4 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-6 bg-[#d8b46b]" />

                    <p className="text-[8px] font-medium uppercase tracking-[2px] text-[#d8b46b]">
                      Curated Property Experience
                    </p>
                  </div>

                  <h2 className="mt-3 font-serif text-[25px] leading-[1.12] tracking-[-0.3px] text-white">
                    Let Us Curate
                    <br />
                    Your Next Address.
                  </h2>

                  <p className="mt-2 max-w-[280px] text-[10px] leading-[1.65] text-white/55">
                    Share your details and our property specialists
                    will help you discover suitable opportunities.
                  </p>
                </div>

                {/* Close button only; no expand or collapse controls */}
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  aria-label="Close property enquiry popup"
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full text-white/50 transition
                    hover:bg-white/10 hover:text-white
                    disabled:cursor-not-allowed disabled:opacity-40
                  "
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Form / success state */}
            <div className="relative z-10 px-5 py-4 sm:px-6">
              {submitted ? (
                <div className="py-5 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a64b]/30 bg-[#c9a64b]/10 text-[#d8b46b]">
                    <Sparkles size={21} strokeWidth={1.5} />
                  </div>

                  <p className="mt-4 text-[8px] uppercase tracking-[2px] text-[#d8b46b]">
                    Property Bouquet
                  </p>

                  <h3 className="mt-2 font-serif text-[23px] leading-tight text-white">
                    Thank You!
                  </h3>

                  <p className="mt-2 text-[11px] leading-relaxed text-white/55">
                    Your enquiry has been received. Our property
                    specialists will connect with you shortly.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-2.5">
                  {/* Name */}
                  <div className="relative">
                    <UserRound
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/60"
                    />

                    <input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Full Name"
                      autoComplete="name"
                      aria-label="Full name"
                      disabled={submitting}
                      required
                      className="
                        h-11 w-full rounded-[10px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/35
                        focus:border-[#c9a64b]/50
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Mobile */}
                  <div className="relative">
                    <Phone
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/60"
                    />

                    <input
                      value={leadPhone}
                      onChange={(e) =>
                        setLeadPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="10-Digit Mobile Number"
                      inputMode="numeric"
                      autoComplete="tel"
                      aria-label="Mobile number"
                      disabled={submitting}
                      required
                      maxLength={10}
                      className="
                        h-11 w-full rounded-[10px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/35
                        focus:border-[#c9a64b]/50
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Optional email */}
                  <div className="relative">
                    <Mail
                      size={14}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/60"
                    />

                    <input
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email Address (Optional)"
                      type="email"
                      autoComplete="email"
                      aria-label="Email address, optional"
                      disabled={submitting}
                      className="
                        h-11 w-full rounded-[10px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/35
                        focus:border-[#c9a64b]/50
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Error */}
                  {errorMessage && (
                    <p
                      role="alert"
                      className="
                        rounded-lg border border-red-400/20
                        bg-red-400/5 px-3 py-2
                        text-[10px] leading-relaxed text-red-300
                      "
                    >
                      {errorMessage}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={submitting}
                    className="
                      group relative mt-1 flex h-11 w-full
                      items-center justify-center gap-2 overflow-hidden
                      rounded-[10px] bg-[#c9a64b]
                      text-[9px] font-semibold uppercase tracking-[1.6px]
                      text-[#101510] transition hover:bg-[#d8b46b]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed disabled:opacity-60
                    "
                  >
                    <span className="pointer-events-none absolute inset-y-0 -left-[70%] w-[45%] rotate-[18deg] bg-white/20 transition-all duration-700 group-hover:left-[125%]" />

                    <span className="relative z-10">
                      {submitting
                        ? "Submitting..."
                        : "Get Property Assistance"}
                    </span>

                    {!submitting && (
                      <ArrowRight
                        size={14}
                        strokeWidth={1.7}
                        className="relative z-10 transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  <p className="pt-1 text-center text-[8px] leading-relaxed text-white/35">
                    Your information is kept confidential and used
                    only to assist with your property enquiry.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}