"use client";

import { motion } from "framer-motion";
import { Mail } from "lucide-react";

export default function NewsletterCard() {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="
        rounded-[24px]
        border
        border-[#242424]
        bg-[#090909]
        p-9
        shadow-[0_20px_60px_rgba(0,0,0,.25)]
      "
    >
      {/* Icon */}

      <div
        className="
          mb-8
          flex
          h-14
          w-14
          items-center
          justify-center
          rounded-xl
          border
          border-[#C89D58]/40
        "
      >
        <Mail
          size={28}
          strokeWidth={1.5}
          className="text-[#C89D58]"
        />
      </div>

      {/* Heading */}

      <h3
        className="text-[34px] leading-tight text-white"
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Never Miss
        <br />
        an Update
      </h3>

      {/* Description */}

      <p className="mt-5 text-[15px] leading-7 text-[#b8b8b8]">
        Subscribe to receive luxury property insights,
        expert analysis, market trends and investment
        opportunities directly in your inbox.
      </p>

      {/* Input */}

      <input
        type="email"
        placeholder="Enter your email address"
        className="
          mt-8
          h-14
          w-full
          rounded-xl
          border
          border-[#2e2e2e]
          bg-transparent
          px-5
          text-white
          placeholder:text-[#6b6b6b]
          outline-none
          transition
          focus:border-[#C89D58]
        "
      />

      {/* Button */}

      <button
        className="
          mt-5
          h-14
          w-full
          rounded-xl
          bg-[#C89D58]
          font-semibold
          tracking-wide
          text-[#111]
          transition-all
          hover:bg-[#d4ab67]
        "
      >
        SUBSCRIBE NOW
      </button>
    </motion.div>
  );
}