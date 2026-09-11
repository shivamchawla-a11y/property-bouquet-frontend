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

  const [open, setOpen] = useState(false);

  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ============================================================
  // OPEN AFTER 20 SECONDS
  // ============================================================

  useEffect(() => {
    try {
      const alreadyShown = sessionStorage.getItem(
        "propertyBouquetTimedLeadPopupShown"
      );

      if (alreadyShown === "true") {
        return;
      }
    } catch (error) {
      console.warn(
        "Unable to access sessionStorage:",
        error
      );
    }

    const timer = window.setTimeout(() => {
      setOpen(true);

      try {
        sessionStorage.setItem(
          "propertyBouquetTimedLeadPopupShown",
          "true"
        );
      } catch (error) {
        console.warn(
          "Unable to save popup session state:",
          error
        );
      }
    }, 4000);

    return () => {
      window.clearTimeout(timer);
    };
  }, []);

  // ============================================================
  // CLOSE
  // ============================================================

  const handleClose = () => {
    if (submitting) return;

    setOpen(false);
    setErrorMessage("");

    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setSubmitted(false);
  };

  // ============================================================
  // SUBMIT LEAD
  // ============================================================

  const handleSubmit = async () => {
    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();

    setErrorMessage("");

    // ----------------------------------------------------------
    // NAME
    // ----------------------------------------------------------

    if (!name) {
      setErrorMessage("Please enter your name.");
      return;
    }

    // ----------------------------------------------------------
    // PHONE
    // ----------------------------------------------------------

    if (!phone) {
      setErrorMessage("Please enter your mobile number.");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      setErrorMessage(
        "Please enter a valid 10-digit mobile number."
      );
      return;
    }

    // ----------------------------------------------------------
    // EMAIL
    // ----------------------------------------------------------

    if (email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setErrorMessage(
          "Please enter a valid email address."
        );
        return;
      }
    }

    try {
      setSubmitting(true);

      // --------------------------------------------------------
      // CURRENT PAGE CONTEXT
      // --------------------------------------------------------

      const currentPage =
        typeof window !== "undefined"
          ? window.location.href
          : "";

      const currentPagePath =
        typeof window !== "undefined"
          ? window.location.pathname
          : "";

      const currentPageTitle =
        typeof document !== "undefined"
          ? document.title
          : "Property Bouquet";

      // --------------------------------------------------------
      // API REQUEST
      // --------------------------------------------------------

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

          source: "Website - 20 Second Popup",

          leadType: "Website Enquiry",

          pageUrl: currentPage,
          pagePath: currentPagePath,
          pageTitle: currentPageTitle,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data?.message || "Submission failed"
        );
      }

      // --------------------------------------------------------
      // SUCCESS
      // --------------------------------------------------------

      setSubmitted(true);

      window.setTimeout(() => {
        handleClose();
      }, 2200);
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
            overflow-y-auto
            p-4
            sm:p-6
          "
        >
          {/* ==================================================
              LIGHTER BACKDROP
          ================================================== */}

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="
              absolute
              inset-0
              bg-[#020806]/55
              backdrop-blur-[2px]
            "
            onClick={handleClose}
          />

          {/* ==================================================
              COMPACT MODAL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 16,
              scale: 0.98,
            }}
            transition={{
              duration: 0.35,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              relative
              z-10
              w-full
              max-w-[410px]
              overflow-hidden
              rounded-[22px]
              border
              border-[#c9a64b]/25
              bg-[#07130f]
              shadow-[0_25px_80px_rgba(0,0,0,0.50)]
            "
          >
            {/* ==================================================
                SUBTLE MODAL BACKGROUND
            ================================================== */}

            <div
              className="
                pointer-events-none
                absolute
                inset-0
              "
            >
              {/* Small gold glow */}

              <div
                className="
                  absolute
                  -left-[100px]
                  -top-[130px]
                  h-[260px]
                  w-[260px]
                  rounded-full
                  bg-[#c9a64b]/10
                  blur-[80px]
                "
              />

              {/* Small green glow */}

              <div
                className="
                  absolute
                  -bottom-[130px]
                  -right-[100px]
                  h-[260px]
                  w-[260px]
                  rounded-full
                  bg-[#0d4b3c]/20
                  blur-[80px]
                "
              />

              {/* Very subtle radial light */}

              <div
                className="
                  absolute
                  inset-0
                  bg-[radial-gradient(circle_at_50%_0%,rgba(201,166,75,0.06),transparent_50%)]
                "
              />

              {/* Very subtle grid */}

              <div
                className="
                  absolute
                  inset-0
                  opacity-[0.018]
                "
                style={{
                  backgroundImage:
                    "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
                  backgroundSize: "50px 50px",
                }}
              />
            </div>

            {/* ==================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              aria-label="Close"
              className="
                absolute
                right-4
                top-4
                z-30
                flex
                h-8
                w-8
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/[0.04]
                text-white/45
                transition-all
                duration-300
                hover:border-[#c9a64b]/30
                hover:bg-[#c9a64b]/10
                hover:text-[#d8b46b]
                disabled:cursor-not-allowed
                disabled:opacity-40
              "
            >
              <X
                size={14}
                strokeWidth={1.5}
              />
            </button>

            {/* ==================================================
                SUCCESS STATE
            ================================================== */}

            {submitted ? (
              <div
                className="
                  relative
                  z-10
                  px-6
                  py-12
                  text-center
                  sm:px-8
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#c9a64b]/30
                    bg-[#c9a64b]/10
                    text-[#d8b46b]
                  "
                >
                  <Sparkles
                    size={22}
                    strokeWidth={1.3}
                  />
                </div>

                <p
                  className="
                    mt-5
                    text-[8px]
                    uppercase
                    tracking-[2.5px]
                    text-[#d8b46b]
                  "
                >
                  Property Bouquet
                </p>

                <h2
                  className="
                    mt-3
                    font-serif
                    text-[25px]
                    leading-[1.1]
                    text-white
                  "
                >
                  Your Enquiry
                  <br />
                  Has Been Received
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-[310px]
                    text-[11px]
                    leading-[1.7]
                    text-white/45
                  "
                >
                  Our property specialists will connect
                  with you shortly with thoughtfully
                  selected opportunities.
                </p>
              </div>
            ) : (
              <>
                {/* ==================================================
                    HEADER
                ================================================== */}

                <div
                  className="
                    relative
                    z-10
                    border-b
                    border-white/[0.08]
                    px-6
                    pb-5
                    pt-6
                    sm:px-7
                    sm:pt-7
                  "
                >
                  {/* Eyebrow */}

                  <div className="flex items-center gap-2.5">
                    <div className="h-px w-7 bg-[#d8b46b]" />

                    <p
                      className="
                        text-[8px]
                        font-medium
                        uppercase
                        tracking-[2.5px]
                        text-[#d8b46b]
                      "
                    >
                      Curated Property Experience
                    </p>
                  </div>

                  {/* Heading */}

                  <h2
                    className="
                      mt-3.5
                      max-w-[340px]
                      font-serif
                      text-[28px]
                      leading-[1.08]
                      tracking-[-0.3px]
                      text-white
                      sm:text-[30px]
                    "
                  >
                    Let Us Curate
                    <br />
                    Your Next Address.
                  </h2>

                  {/* Description */}

                  <p
                    className="
                      mt-3
                      max-w-[350px]
                      text-[11px]
                      leading-[1.7]
                      text-white/45
                    "
                  >
                    Tell us what you're looking for and
                    our property specialists will help you
                    discover the right opportunities.
                  </p>
                </div>

                {/* ==================================================
                    FORM
                ================================================== */}

                <div
                  className="
                    relative
                    z-10
                    space-y-2.5
                    px-6
                    py-5
                    sm:px-7
                    sm:py-6
                  "
                >
                  {/* ==================================================
                      NAME
                  ================================================== */}

                  <div className="relative">
                    <UserRound
                      size={14}
                      strokeWidth={1.5}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-[#d8b46b]/55
                      "
                    />

                    <input
                      value={leadName}
                      onChange={(e) =>
                        setLeadName(e.target.value)
                      }
                      placeholder="Full Name"
                      autoComplete="name"
                      disabled={submitting}
                      className="
                        h-[46px]
                        w-full
                        rounded-[10px]
                        border
                        border-white/10
                        bg-white/[0.04]
                        pl-10
                        pr-3.5
                        text-[12px]
                        text-white
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-white/28
                        hover:border-white/15
                        focus:border-[#c9a64b]/50
                        focus:bg-white/[0.055]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* ==================================================
                      PHONE
                  ================================================== */}

                  <div className="relative">
                    <Phone
                      size={14}
                      strokeWidth={1.5}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-[#d8b46b]/55
                      "
                    />

                    <input
                      value={leadPhone}
                      onChange={(e) =>
                        setLeadPhone(
                          e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 10)
                        )
                      }
                      placeholder="Mobile Number"
                      inputMode="numeric"
                      autoComplete="tel"
                      disabled={submitting}
                      className="
                        h-[46px]
                        w-full
                        rounded-[10px]
                        border
                        border-white/10
                        bg-white/[0.04]
                        pl-10
                        pr-3.5
                        text-[12px]
                        text-white
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-white/28
                        hover:border-white/15
                        focus:border-[#c9a64b]/50
                        focus:bg-white/[0.055]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* ==================================================
                      EMAIL
                  ================================================== */}

                  <div className="relative">
                    <Mail
                      size={14}
                      strokeWidth={1.5}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        z-10
                        -translate-y-1/2
                        text-[#d8b46b]/55
                      "
                    />

                    <input
                      value={leadEmail}
                      onChange={(e) =>
                        setLeadEmail(e.target.value)
                      }
                      placeholder="Email Address (Optional)"
                      type="email"
                      autoComplete="email"
                      disabled={submitting}
                      className="
                        h-[46px]
                        w-full
                        rounded-[10px]
                        border
                        border-white/10
                        bg-white/[0.04]
                        pl-10
                        pr-3.5
                        text-[12px]
                        text-white
                        outline-none
                        transition-all
                        duration-300
                        placeholder:text-white/28
                        hover:border-white/15
                        focus:border-[#c9a64b]/50
                        focus:bg-white/[0.055]
                        disabled:cursor-not-allowed
                        disabled:opacity-60
                      "
                    />
                  </div>

                  {/* ==================================================
                      ERROR
                  ================================================== */}

                  {errorMessage && (
                    <p
                      className="
                        rounded-lg
                        border
                        border-red-400/15
                        bg-red-400/5
                        px-3
                        py-2
                        text-[10px]
                        leading-[1.4]
                        text-red-300
                      "
                    >
                      {errorMessage}
                    </p>
                  )}

                  {/* ==================================================
                      SUBMIT BUTTON
                  ================================================== */}

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="
                      group
                      relative
                      mt-1
                      flex
                      h-[48px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      overflow-hidden
                      rounded-[10px]
                      bg-[#c9a64b]
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[1.9px]
                      text-[#101510]
                      shadow-[0_10px_30px_rgba(201,166,75,0.14)]
                      transition-all
                      duration-300
                      hover:bg-[#d8b46b]
                      hover:shadow-[0_13px_35px_rgba(201,166,75,0.20)]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-55
                    "
                  >
                    {/* Shine */}

                    <span
                      className="
                        pointer-events-none
                        absolute
                        inset-y-0
                        -left-[70%]
                        w-[45%]
                        rotate-[18deg]
                        bg-white/20
                        transition-all
                        duration-700
                        group-hover:left-[125%]
                      "
                    />

                    <span className="relative z-10">
                      {submitting
                        ? "Submitting..."
                        : "Begin My Property Search"}
                    </span>

                    {!submitting && (
                      <ArrowRight
                        size={14}
                        strokeWidth={1.7}
                        className="
                          relative
                          z-10
                          transition-transform
                          duration-300
                          group-hover:translate-x-1
                        "
                      />
                    )}
                  </button>

                  {/* ==================================================
                      PRIVACY
                  ================================================== */}

                  <p
                    className="
                      pt-0.5
                      text-center
                      text-[8.5px]
                      leading-[1.6]
                      text-white/22
                    "
                  >
                    Your information is kept confidential
                    and used only to assist with your
                    property enquiry.
                  </p>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}