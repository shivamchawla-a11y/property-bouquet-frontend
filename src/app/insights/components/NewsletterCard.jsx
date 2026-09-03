"use client";

import { useState } from "react";

import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";

export default function NewsletterCard() {
  const [newsletterEmail, setNewsletterEmail] =
    useState("");

  const [newsletterLoading, setNewsletterLoading] =
    useState(false);

  const [newsletterMessage, setNewsletterMessage] =
    useState("");

  // ==========================================================
  // NEWSLETTER SUBSCRIBE
  // ==========================================================

  async function handleSubmit(e) {
    e.preventDefault();

    if (newsletterLoading) {
      return;
    }

    const email =
      newsletterEmail.trim().toLowerCase();

    // --------------------------------------------------------
    // EMPTY EMAIL
    // --------------------------------------------------------

    if (!email) {
      setNewsletterMessage(
        "Please enter your email address."
      );
      return;
    }

    // --------------------------------------------------------
    // EMAIL VALIDATION
    // --------------------------------------------------------

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setNewsletterMessage(
        "Please enter a valid email address."
      );
      return;
    }

    // --------------------------------------------------------
    // SUBMIT
    // --------------------------------------------------------

    try {
      setNewsletterLoading(true);
      setNewsletterMessage("");

      const response = await fetch(
        "/api/newsletter/subscribe",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            email,
            source: "Website Footer",
          }),
        }
      );

      const result =
        await response.json();

      // ------------------------------------------------------
      // API ERROR
      // ------------------------------------------------------

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Subscription failed"
        );
      }

      // ------------------------------------------------------
      // SUCCESS / DUPLICATE
      // ------------------------------------------------------

      setNewsletterMessage(
        result.duplicate
          ? "You're already subscribed."
          : "You're subscribed. Thank you!"
      );

      // Clear input after successful request
      setNewsletterEmail("");
    } catch (error) {
      console.error(
        "Newsletter subscription error:",
        error
      );

      setNewsletterMessage(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setNewsletterLoading(false);
    }
  }

  // ==========================================================
  // MAIN
  // ==========================================================

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="
        relative
        overflow-hidden
        rounded-[26px]
        border
        border-[#26372f]
        bg-gradient-to-br
        from-[#163629]
        via-[#122f24]
        to-[#0b2119]
        p-7
        shadow-[0_20px_60px_rgba(22,54,41,.16)]
        sm:p-8
      "
    >
      {/* ======================================================
          BACKGROUND GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          h-52
          w-52
          rounded-full
          bg-[#b88638]/10
          blur-3xl
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-28
          -left-28
          h-44
          w-44
          rounded-full
          bg-white/5
          blur-3xl
        "
      />

      {/* ======================================================
          CONTENT
      ====================================================== */}

      <div className="relative">
        {/* ICON */}

        <div
          className="
            mb-6
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-[14px]
            border
            border-[#d8b46b]/30
            bg-[#b88638]/10
            text-[#d8b46b]
          "
        >
          <Mail
            size={21}
            strokeWidth={1.5}
          />
        </div>

        {/* EYEBROW */}

        <p
          className="
            text-[8px]
            font-semibold
            uppercase
            tracking-[2.5px]
            text-[#d8b46b]
          "
        >
          Property Bouquet
        </p>

        {/* HEADING */}

        <h3
          className="
            mt-2
            text-[29px]
            font-normal
            leading-[1.15]
            tracking-[-0.2px]
            text-white
            sm:text-[31px]
          "
          style={{
            fontFamily:
              "Georgia, serif",
          }}
        >
          Never Miss
          <br />
          <span className="text-[#d8b46b]">
            an Update
          </span>
        </h3>

        {/* DIVIDER */}

        <div
          className="
            mt-4
            h-px
            w-9
            bg-[#b88638]
          "
        />

        {/* DESCRIPTION */}

        <p
          className="
            mt-5
            text-[11px]
            leading-[1.8]
            text-white/55
            sm:text-[12px]
          "
        >
          Subscribe to receive luxury
          property insights, expert analysis,
          market trends and investment
          opportunities directly in your inbox.
        </p>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={handleSubmit}
          className="mt-7"
        >
          {/* INPUT */}

          <div
            className="
              relative
              flex
              h-[50px]
              overflow-hidden
              rounded-[13px]
              border
              border-white/10
              bg-black/15
              transition-all
              duration-300
              focus-within:border-[#b88638]/70
              focus-within:bg-black/20
            "
          >
            <input
              type="email"
              value={newsletterEmail}
              onChange={(e) =>
                setNewsletterEmail(
                  e.target.value
                )
              }
              placeholder="Enter your email address"
              disabled={newsletterLoading}
              autoComplete="email"
              className="
                min-w-0
                flex-1
                bg-transparent
                px-4
                text-[11px]
                text-white
                outline-none
                placeholder:text-white/30
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            />

            <button
              type="submit"
              disabled={newsletterLoading}
              aria-label="Subscribe to newsletter"
              className="
                flex
                w-[52px]
                shrink-0
                items-center
                justify-center
                bg-[#d8b46b]
                text-[#163629]
                transition-all
                duration-300
                hover:bg-white
                disabled:cursor-not-allowed
                disabled:opacity-50
              "
            >
              {newsletterLoading ? (
                <span
                  className="
                    h-4
                    w-4
                    animate-spin
                    rounded-full
                    border-2
                    border-[#163629]/30
                    border-t-[#163629]
                  "
                />
              ) : (
                <ArrowRight
                  size={16}
                  className="
                    transition-transform
                    duration-300
                  "
                />
              )}
            </button>
          </div>

          {/* ==================================================
              MESSAGE
          ================================================== */}

          {newsletterMessage && (
            <motion.p
              initial={{
                opacity: 0,
                y: -5,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.3,
              }}
              className="
                mt-3
                text-[10px]
                leading-5
                text-[#d8b46b]
              "
            >
              {newsletterMessage}
            </motion.p>
          )}
        </form>

        {/* ====================================================
            TRUST LINE
        ==================================================== */}

        <div
          className="
            mt-5
            flex
            items-center
            gap-2
            text-[8px]
            uppercase
            tracking-[1.3px]
            text-white/25
          "
        >
          <span
            className="
              h-1.5
              w-1.5
              rounded-full
              bg-[#b88638]
            "
          />

          <span>
            No spam · Unsubscribe anytime
          </span>
        </div>
      </div>
    </motion.div>
  );
}