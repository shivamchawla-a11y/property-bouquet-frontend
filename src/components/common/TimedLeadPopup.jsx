
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

  // New key allows the updated popup to appear during testing.
  const SESSION_KEY = "propertyBouquetTimedLeadPopupShown_v4";
  const DELAY_MS = 3000;

  const [visible, setVisible] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Display the fully expanded popup after 3 seconds.
  // It appears once per browser session.
  useEffect(() => {
    let alreadyShown = false;

    try {
      alreadyShown =
        sessionStorage.getItem(SESSION_KEY) === "true";
    } catch (error) {
      console.warn("Unable to read popup session state:", error);
    }

    if (alreadyShown) return;

    const timer = window.setTimeout(() => {
      // Record that the popup has appeared.
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch (error) {
        console.warn("Unable to save popup session state:", error);
      }

      setVisible(true);
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  // Close the popup without affecting the WhatsApp widget.
  const handleClose = () => {
    if (submitting) return;

    setVisible(false);
    setErrorMessage("");
  };

  // Submit the enquiry to the existing API.
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

    if (!phone) {
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
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

          // Preserved for existing lead reporting.
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
      setLeadName("");
      setLeadPhone("");
      setLeadEmail("");
      setErrorMessage("");

      // Keep the success message visible before closing.
      window.setTimeout(() => {
        setVisible(false);
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

  // Hidden on mobile and small screens.
  if (!visible) return null;

  return (
    <div
      className="
        hidden md:block
        fixed
        right-5
        bottom-[100px]
        z-[9998]
        w-[min(370px,calc(100vw-40px))]
      "
    >
      <AnimatePresence>
        {visible && (
          <motion.div
            key="timed-lead-popup"
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{
              duration: 0.32,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative isolate overflow-hidden
              max-h-[min(76dvh,620px)]
              overflow-y-auto overscroll-contain
              rounded-[20px]
              border border-[#c9a64b]/30
              bg-[#07130f]
              shadow-[0_18px_60px_rgba(0,0,0,0.38)]
            "
          >
            {/* Luxury background effects */}
            <div className="pointer-events-none absolute inset-0 -z-10">
              <div className="absolute -left-20 -top-24 h-48 w-48 rounded-full bg-[#c9a64b]/10 blur-[65px]" />
              <div className="absolute -bottom-24 -right-20 h-48 w-48 rounded-full bg-[#0d4b3c]/25 blur-[65px]" />
            </div>

            {/* Header */}
            <div className="relative z-10 border-b border-white/[0.08] px-5 pb-4 pt-5 sm:px-6">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="h-px w-6 shrink-0 bg-[#d8b46b]" />

                    <p className="text-[8px] font-medium uppercase tracking-[2px] text-[#d8b46b]">
                      Curated Property Experience
                    </p>
                  </div>

                  <h2 className="mt-3 font-serif text-[25px] leading-[1.12] tracking-[-0.3px] text-white">
                    Let Us Curate
                    <br />
                    Your Next Address.
                  </h2>

                  <p className="mt-2 max-w-[280px] text-[11px] leading-[1.7] text-white/55">
                    Share your details and our property specialists
                    will help you discover suitable opportunities.
                  </p>
                </div>

                {/* Only close button; no expand or minimize controls */}
                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  aria-label="Close property enquiry popup"
                  className="
                    flex h-8 w-8 shrink-0 items-center justify-center
                    rounded-full text-white/55 transition
                    hover:bg-white/10 hover:text-white
                    disabled:cursor-not-allowed disabled:opacity-40
                  "
                >
                  <X size={17} />
                </button>
              </div>
            </div>

            {/* Form / success state */}
            <div className="relative z-10 px-5 py-4 sm:px-6">
              {submitted ? (
                <div className="py-6 text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full border border-[#c9a64b]/30 bg-[#c9a64b]/10 text-[#d8b46b]">
                    <Sparkles size={22} strokeWidth={1.5} />
                  </div>

                  <p className="mt-4 text-[9px] uppercase tracking-[2px] text-[#d8b46b]">
                    Property Bouquet
                  </p>

                  <h3 className="mt-2 font-serif text-[25px] leading-tight text-white">
                    Thank You!
                  </h3>

                  <p className="mt-2 text-[12px] leading-relaxed text-white/55">
                    Your enquiry has been received. Our property
                    specialists will connect with you shortly.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={handleSubmit}
                  className="space-y-3"
                >
                  {/* Full name */}
                  <div className="relative">
                    <UserRound
                      size={15}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/70"
                    />

                    <input
                      type="text"
                      name="name"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Full Name"
                      autoComplete="name"
                      aria-label="Full name"
                      disabled={submitting}
                      required
                      maxLength={100}
                      className="
                        h-11 w-full rounded-[11px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/40
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Mobile number */}
                  <div className="relative">
                    <Phone
                      size={15}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/70"
                    />

                    <input
                      type="tel"
                      name="phone"
                      value={leadPhone}
                      onChange={(e) =>
                        setLeadPhone(
                          e.target.value.replace(/\D/g, "").slice(0, 10)
                        )
                      }
                      placeholder="10-Digit Mobile Number"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      aria-label="Mobile number"
                      disabled={submitting}
                      required
                      maxLength={10}
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit Indian mobile number."
                      className="
                        h-11 w-full rounded-[11px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/40
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Optional email */}
                  <div className="relative">
                    <Mail
                      size={15}
                      strokeWidth={1.5}
                      className="pointer-events-none absolute left-3.5 top-1/2 z-10 -translate-y-1/2 text-[#d8b46b]/70"
                    />

                    <input
                      type="email"
                      name="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email Address (Optional)"
                      autoComplete="email"
                      aria-label="Email address, optional"
                      disabled={submitting}
                      maxLength={254}
                      className="
                        h-11 w-full rounded-[11px] border
                        border-white/10 bg-white/[0.04]
                        pl-10 pr-3.5 text-[12px] text-white
                        outline-none transition
                        placeholder:text-white/40
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* Validation / API error */}
                  {errorMessage && (
                    <p
                      role="alert"
                      className="
                        rounded-lg border border-red-400/20
                        bg-red-400/5 px-3 py-2
                        text-[11px] leading-relaxed text-red-300
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
                      group relative mt-1 flex h-12 w-full
                      items-center justify-center gap-2 overflow-hidden
                      rounded-[11px] bg-[#c9a64b]
                      text-[10px] font-semibold uppercase tracking-[1.5px]
                      text-[#101510] transition
                      hover:bg-[#d8b46b]
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
                        size={15}
                        strokeWidth={1.7}
                        className="relative z-10 transition-transform group-hover:translate-x-1"
                      />
                    )}
                  </button>

                  <p className="pt-1 text-center text-[9px] leading-relaxed text-white/40">
                    Your information is kept confidential and used
                    only to assist with your property enquiry.
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
