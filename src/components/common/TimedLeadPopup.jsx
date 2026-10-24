
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
  ShieldCheck,
} from "lucide-react";

export default function TimedLeadPopup() {
  const API = "/api";
  const SESSION_KEY = "propertyBouquetTimedLeadPopupShown_v5";
  const DELAY_MS = 2000;

  const [visible, setVisible] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "true") {
        return;
      }
    } catch (error) {
      console.warn("Unable to read popup session state:", error);
    }

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.setItem(SESSION_KEY, "true");
      } catch (error) {
        console.warn("Unable to save popup session state:", error);
      }

      setVisible(true);
    }, DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  const handleClose = () => {
    if (submitting) return;

    setVisible(false);
    setErrorMessage("");
  };

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
      setErrorMessage(
        "Please enter a valid 10-digit Indian mobile number."
      );
      return;
    }

    if (
      email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(`${API}/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          email,
          property: "Website Enquiry",
          source: "Website - 2 Second Popup",
          leadType: "Website Enquiry",
          pageUrl: window.location.href,
          pagePath: window.location.pathname,
          pageTitle: document.title || "Property Bouquet",
        }),
      });

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            `Submission failed (${response.status})`
        );
      }

      setSubmitted(true);
      setLeadName("");
      setLeadPhone("");
      setLeadEmail("");
      setErrorMessage("");

      window.setTimeout(() => {
        setVisible(false);
        setSubmitted(false);
      }, 2500);
    } catch (error) {
      console.error(
        "TIMED WEBSITE LEAD SUBMISSION ERROR:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to submit your details. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="
        hidden md:block
        pointer-events-none
        fixed right-4 bottom-6
        z-[9998]
        w-[min(320px,calc(100vw-32px))]
      "
    >
      <AnimatePresence mode="wait">
        {visible && (
          <motion.section
            key="property-bouquet-lead-popup"
            initial={{
              opacity: 0,
              x: 32,
              y: 8,
              scale: 0.975,
              filter: "blur(3px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
            }}
            exit={{
              opacity: 0,
              x: 18,
              y: 4,
              scale: 0.985,
              filter: "blur(2px)",
              transition: {
                duration: 0.24,
                ease: [0.4, 0, 1, 1],
              },
            }}
            transition={{
              opacity: {
                duration: 0.42,
                ease: "easeOut",
              },
              x: {
                type: "spring",
                stiffness: 145,
                damping: 25,
                mass: 0.8,
              },
              y: {
                type: "spring",
                stiffness: 130,
                damping: 24,
                mass: 0.8,
              },
              scale: {
                duration: 0.48,
                ease: [0.22, 1, 0.36, 1],
              },
              filter: {
                duration: 0.38,
                ease: "easeOut",
              },
            }}
            aria-label="Property enquiry"
            className="
              pointer-events-auto
              relative isolate overflow-hidden
              rounded-[18px]
              border border-[#c9a96e]/30
              bg-[#0a1913]
              shadow-[0_16px_48px_rgba(0,0,0,0.32),0_3px_12px_rgba(0,0,0,0.12)]
              [transform:translateZ(0)]
            "
          >
            {/* Subtle luxury background */}
            <div
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-0 -z-10
                overflow-hidden rounded-[18px]
              "
            >
              <div
                className="
                  absolute -right-20 -top-24
                  h-48 w-48 rounded-full
                  bg-[#c9a96e]/[0.09] blur-[65px]
                "
              />

              <div
                className="
                  absolute -bottom-24 -left-20
                  h-40 w-40 rounded-full
                  bg-[#1b503a]/30 blur-[55px]
                "
              />

              <div
                className="
                  absolute inset-0
                  bg-gradient-to-br
                  from-white/[0.025] via-transparent
                  to-[#c9a96e]/[0.035]
                "
              />
            </div>

            {/* Fine gold accent */}
            <div
              aria-hidden="true"
              className="
                h-[2px] w-full
                bg-gradient-to-r
                from-transparent via-[#dfbd78] to-transparent
              "
            />

            {/* Compact header */}
            <header
              className="
                relative border-b border-white/[0.075]
                px-4 pb-3.5 pt-4
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="h-px w-5 bg-[#d9b875]" />

                    <p
                      className="
                        text-[8px] font-semibold uppercase
                        tracking-[2px] text-[#d9b875]
                      "
                    >
                      Property Bouquet
                    </p>
                  </div>

                  <h2
                    className="
                      mt-3 font-serif
                      text-[24px] leading-[1.08]
                      tracking-[-0.55px] text-[#fffdf7]
                    "
                  >
                    Find Your
                    <br />
                    <span className="text-[#dfc38b]">
                      Next Address.
                    </span>
                  </h2>

                  <p
                    className="
                      mt-2 max-w-[235px]
                      text-[10.5px] leading-[1.7]
                      text-[#e7e5da]/65
                    "
                  >
                    Tell us what you are looking for.
                    We’ll help you find the right property.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleClose}
                  disabled={submitting}
                  aria-label="Close property enquiry popup"
                  className="
                    flex h-7 w-7 shrink-0 items-center
                    justify-center rounded-full
                    border border-white/[0.09]
                    bg-white/[0.035] text-white/55
                    transition-all duration-300
                    hover:rotate-90 hover:border-[#d9b875]/40
                    hover:bg-[#d9b875]/10 hover:text-[#f0d49a]
                    disabled:opacity-40
                  "
                >
                  <X size={14} strokeWidth={1.7} />
                </button>
              </div>
            </header>

            {/* Form and success state */}
            <div className="relative px-4 py-3.5">
              <AnimatePresence mode="wait" initial={false}>
                {submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="py-3 text-center"
                  >
                    <div
                      className="
                        mx-auto flex h-11 w-11 items-center
                        justify-center rounded-full
                        border border-[#d9b875]/30
                        bg-[#d9b875]/[0.09] text-[#e5c887]
                      "
                    >
                      <Sparkles size={20} strokeWidth={1.5} />
                    </div>

                    <p
                      className="
                        mt-3 text-[8px] font-medium uppercase
                        tracking-[2px] text-[#d9b875]
                      "
                    >
                      Enquiry Received
                    </p>

                    <h3 className="mt-1.5 font-serif text-[25px] text-white">
                      Thank You.
                    </h3>

                    <p
                      className="
                        mx-auto mt-1.5 max-w-[230px]
                        text-[10.5px] leading-[1.8] text-white/60
                      "
                    >
                      Our property specialists will connect with
                      you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    onSubmit={handleSubmit}
                    className="space-y-2.5"
                  >
                    {/* Full name */}
                    <div className="group relative">
                      <UserRound
                        size={14}
                        strokeWidth={1.6}
                        className="
                          pointer-events-none absolute left-3.5
                          top-1/2 -translate-y-1/2
                          text-[#c9a96e]/75
                          transition-colors duration-200
                          group-focus-within:text-[#e4c581]
                        "
                      />

                      <input
                        type="text"
                        name="name"
                        value={leadName}
                        onChange={(event) =>
                          setLeadName(event.target.value)
                        }
                        placeholder="Full Name"
                        autoComplete="name"
                        aria-label="Full name"
                        maxLength={100}
                        required
                        disabled={submitting}
                        className="
                          h-[39px] w-full rounded-[10px]
                          border border-white/[0.09]
                          bg-white/[0.035]
                          pl-10 pr-3
                          text-[11px] text-white
                          outline-none transition-all duration-200
                          placeholder:text-white/40
                          hover:border-white/[0.17]
                          focus:border-[#c9a96e]/65
                          focus:bg-white/[0.055]
                          focus:ring-2 focus:ring-[#c9a96e]/[0.07]
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Mobile number */}
                    <div className="group relative">
                      <Phone
                        size={14}
                        strokeWidth={1.6}
                        className="
                          pointer-events-none absolute left-3.5
                          top-1/2 -translate-y-1/2
                          text-[#c9a96e]/75
                          transition-colors duration-200
                          group-focus-within:text-[#e4c581]
                        "
                      />

                      <input
                        type="tel"
                        name="phone"
                        value={leadPhone}
                        onChange={(event) =>
                          setLeadPhone(
                            event.target.value
                              .replace(/\D/g, "")
                              .slice(0, 10)
                          )
                        }
                        placeholder="10-Digit Mobile Number"
                        inputMode="numeric"
                        autoComplete="tel-national"
                        aria-label="Mobile number"
                        pattern="[6-9][0-9]{9}"
                        title="Enter a valid 10-digit Indian mobile number."
                        maxLength={10}
                        required
                        disabled={submitting}
                        className="
                          h-[39px] w-full rounded-[10px]
                          border border-white/[0.09]
                          bg-white/[0.035]
                          pl-10 pr-3
                          text-[11px] text-white
                          outline-none transition-all duration-200
                          placeholder:text-white/40
                          hover:border-white/[0.17]
                          focus:border-[#c9a96e]/65
                          focus:bg-white/[0.055]
                          focus:ring-2 focus:ring-[#c9a96e]/[0.07]
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Optional email */}
                    <div className="group relative">
                      <Mail
                        size={14}
                        strokeWidth={1.6}
                        className="
                          pointer-events-none absolute left-3.5
                          top-1/2 -translate-y-1/2
                          text-[#c9a96e]/75
                          transition-colors duration-200
                          group-focus-within:text-[#e4c581]
                        "
                      />

                      <input
                        type="email"
                        name="email"
                        value={leadEmail}
                        onChange={(event) =>
                          setLeadEmail(event.target.value)
                        }
                        placeholder="Email Address (Optional)"
                        autoComplete="email"
                        aria-label="Email address, optional"
                        maxLength={254}
                        disabled={submitting}
                        className="
                          h-[39px] w-full rounded-[10px]
                          border border-white/[0.09]
                          bg-white/[0.035]
                          pl-10 pr-3
                          text-[11px] text-white
                          outline-none transition-all duration-200
                          placeholder:text-white/40
                          hover:border-white/[0.17]
                          focus:border-[#c9a96e]/65
                          focus:bg-white/[0.055]
                          focus:ring-2 focus:ring-[#c9a96e]/[0.07]
                          disabled:opacity-60
                        "
                      />
                    </div>

                    {/* Validation and API errors */}
                    <AnimatePresence initial={false}>
                      {errorMessage && (
                        <motion.p
                          key="error"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          role="alert"
                          className="
                            overflow-hidden rounded-lg
                            border border-red-400/20
                            bg-red-400/[0.06]
                            px-3 py-2 text-[10px]
                            leading-relaxed text-red-300
                          "
                        >
                          {errorMessage}
                        </motion.p>
                      )}
                    </AnimatePresence>

                    {/* Premium CTA */}
                    <button
                      type="submit"
                      disabled={submitting}
                      className="
                        group relative mt-0.5
                        flex h-[41px] w-full
                        items-center justify-center gap-2
                        overflow-hidden rounded-[10px]
                        border border-[#f0d69a]/25
                        bg-gradient-to-r
                        from-[#c29a4d] via-[#dfbf78] to-[#c7a054]
                        px-3
                        text-[9px] font-bold uppercase
                        tracking-[1.25px] text-[#142016]
                        shadow-[0_4px_14px_rgba(201,169,110,0.10)]
                        transition-all duration-300
                        hover:brightness-110
                        hover:shadow-[0_5px_18px_rgba(201,169,110,0.20)]
                        active:scale-[0.99]
                        disabled:cursor-not-allowed disabled:opacity-60
                      "
                    >
                      <span
                        aria-hidden="true"
                        className="
                          pointer-events-none absolute inset-y-0
                          -left-1/2 w-1/3 rotate-[18deg]
                          bg-white/25 blur-sm
                          transition-all duration-700
                          group-hover:left-[120%]
                        "
                      />

                      <span className="relative z-10">
                        {submitting
                          ? "Submitting Enquiry..."
                          : "Get Property Assistance"}
                      </span>

                      {!submitting && (
                        <ArrowRight
                          size={14}
                          strokeWidth={1.8}
                          className="
                            relative z-10
                            transition-transform duration-300
                            group-hover:translate-x-1
                          "
                        />
                      )}
                    </button>

                    {/* Privacy reassurance */}
                    <div className="flex items-center justify-center gap-1.5 pt-0.5">
                      <ShieldCheck
                        size={12}
                        strokeWidth={1.5}
                        className="shrink-0 text-[#d9b875]/75"
                      />

                      <p className="text-center text-[9px] leading-relaxed text-white/45">
                        Your details remain confidential.
                      </p>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom gold hairline */}
            <div
              aria-hidden="true"
              className="
                h-px bg-gradient-to-r
                from-transparent via-[#c9a96e]/40 to-transparent
              "
            />
          </motion.section>
        )}
      </AnimatePresence>
    </div>
  );
}
