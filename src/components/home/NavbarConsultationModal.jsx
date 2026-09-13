"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  Phone,
  UserRound,
  ArrowRight,
} from "lucide-react";

export default function NavbarConsultationModal({
  open,
  onClose,
}) {
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleClose = () => {
    if (submitting) return;

    setLeadName("");
    setLeadPhone("");
    setLeadEmail("");
    setSubmitted(false);

    onClose();
  };

  const handleSubmit = async () => {
    const name = leadName.trim();
    const phone = leadPhone.trim();
    const email = leadEmail.trim();

    if (!name) {
      alert("Please enter your name");
      return;
    }

    if (!phone) {
      alert("Please enter your phone number");
      return;
    }

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit mobile number");
      return;
    }

    if (email) {
      const emailRegex =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        alert("Please enter a valid email address");
        return;
      }
    }

    try {
      setSubmitting(true);

      const res = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name,
        phone,
        email,
        property: "General Consultation",
        source: "Private Consultation",
        leadType: "Private Consultation",
      })
      });

      const contentType =
        res.headers.get("content-type") || "";

      let data = {};

      if (contentType.includes("application/json")) {
        data = await res.json();
      } else {
        const text = await res.text();

        throw new Error(
          text || "Unable to submit consultation request."
        );
      }

      if (!res.ok) {
        throw new Error(
          data.message ||
            "Failed to submit consultation request."
        );
      }

      setSubmitted(true);

      setTimeout(() => {
        handleClose();
      }, 1800);
    } catch (error) {
      console.error(
        "NAVBAR CONSULTATION SUBMISSION ERROR:",
        error
      );

      alert(
        error.message ||
          "Failed to submit your details. Please try again."
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
            md:p-6
          "
        >
          {/* BACKDROP */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              absolute
              inset-0
              bg-black/70
              backdrop-blur-md
            "
            onClick={handleClose}
          />

          {/* MODAL */}
          <motion.div
            initial={{
              opacity: 0,
              y: 25,
              scale: 0.97,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: 20,
              scale: 0.97,
            }}
            transition={{
              duration: 0.3,
              ease: "easeOut",
            }}
            className="
              relative
              z-10
              w-full
              max-w-[470px]
              overflow-hidden
              rounded-[24px]
              border
              border-white/10
              bg-[#0b1110]
              shadow-[0_30px_100px_rgba(0,0,0,0.55)]
            "
          >
            {/* GOLD GLOW */}
            <div
              className="
                pointer-events-none
                absolute
                inset-0
                bg-[radial-gradient(circle_at_top_left,rgba(201,166,75,0.18),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(201,166,75,0.10),transparent_32%)]
              "
            />

            {/* CLOSE */}
            <button
              type="button"
              onClick={handleClose}
              disabled={submitting}
              className="
                absolute
                right-5
                top-5
                z-20
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-full
                border
                border-white/10
                bg-white/5
                text-white/60
                transition
                hover:bg-white/10
                hover:text-white
                disabled:opacity-40
              "
            >
              <X size={16} />
            </button>

            {/* SUCCESS */}
            {submitted ? (
              <div
                className="
                  relative
                  z-10
                  px-7
                  py-12
                  text-center
                "
              >
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#c9a64b]/30
                    bg-[#c9a64b]/10
                    text-[#d8b46b]
                    text-2xl
                  "
                >
                  ✓
                </div>

                <h2
                  className="
                    mt-6
                    font-serif
                    text-[28px]
                    leading-tight
                    text-white
                  "
                >
                  Consultation Request Received
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-[330px]
                    text-[13px]
                    leading-[1.8]
                    text-white/55
                  "
                >
                  Thank you for reaching out.
                  Our property specialists will
                  get in touch with you shortly.
                </p>
              </div>
            ) : (
              <>
                {/* HEADER */}
                <div
                  className="
                    relative
                    z-10
                    border-b
                    border-white/10
                    px-7
                    pb-6
                    pt-7
                  "
                >
                  <div className="mb-4 flex items-center gap-3">
                    <div className="h-px w-8 bg-[#d8b46b]" />

                    <p
                      className="
                        text-[9px]
                        uppercase
                        tracking-[3px]
                        text-[#d8b46b]
                      "
                    >
                      Private Advisory
                    </p>
                  </div>

                  <h2
                    className="
                      max-w-[350px]
                      font-serif
                      text-[30px]
                      leading-[1.08]
                      tracking-[-0.5px]
                      text-white
                    "
                  >
                    Book Your
                    <br />
                    Private Consultation
                  </h2>

                  <p
                    className="
                      mt-4
                      max-w-[390px]
                      text-[12px]
                      leading-[1.8]
                      text-white/55
                    "
                  >
                    Connect with our property
                    specialists for personalised
                    guidance on premium real estate
                    opportunities, investments and
                    acquisitions.
                  </p>
                </div>

                {/* FORM */}
                <div
                  className="
                    relative
                    z-10
                    space-y-3.5
                    p-7
                  "
                >
                  {/* NAME */}
                  <div className="relative">
                    <UserRound
                      size={16}
                      strokeWidth={1.6}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-white/35
                      "
                    />

                    <input
                      value={leadName}
                      onChange={(e) =>
                        setLeadName(e.target.value)
                      }
                      placeholder="Full Name"
                      autoComplete="name"
                      className="
                        h-[52px]
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.045]
                        pl-11
                        pr-4
                        text-[13px]
                        text-white
                        outline-none
                        transition
                        placeholder:text-white/30
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                      "
                    />
                  </div>

                  {/* PHONE */}
                  <div className="relative">
                    <Phone
                      size={16}
                      strokeWidth={1.6}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-white/35
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
                      className="
                        h-[52px]
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.045]
                        pl-11
                        pr-4
                        text-[13px]
                        text-white
                        outline-none
                        transition
                        placeholder:text-white/30
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                      "
                    />
                  </div>

                  {/* EMAIL */}
                  <div className="relative">
                    <Mail
                      size={16}
                      strokeWidth={1.6}
                      className="
                        pointer-events-none
                        absolute
                        left-4
                        top-1/2
                        -translate-y-1/2
                        text-white/35
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
                      className="
                        h-[52px]
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.045]
                        pl-11
                        pr-4
                        text-[13px]
                        text-white
                        outline-none
                        transition
                        placeholder:text-white/30
                        focus:border-[#c9a64b]/60
                        focus:bg-white/[0.06]
                      "
                    />
                  </div>

                  {/* SUBMIT */}
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="
                      group
                      mt-2
                      flex
                      h-[54px]
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-[#c9a64b]
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[2px]
                      text-[#101010]
                      shadow-[0_10px_35px_rgba(201,166,75,0.18)]
                      transition-all
                      duration-300
                      hover:bg-[#d8b46b]
                      hover:shadow-[0_14px_40px_rgba(201,166,75,0.28)]
                      active:scale-[0.99]
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    {submitting ? (
                      "Sending Request..."
                    ) : (
                      <>
                        Request Consultation

                        <ArrowRight
                          size={15}
                          className="
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </>
                    )}
                  </button>

                  <p
                    className="
                      pt-1
                      text-center
                      text-[10px]
                      leading-[1.7]
                      text-white/30
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