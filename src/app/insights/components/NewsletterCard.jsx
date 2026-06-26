"use client";

import { useState } from "react";
import { Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function NewsletterCard() {
  const [email, setEmail] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    console.log(email);

    // We'll connect this later
  }

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.3 }}
      className="
      rounded-[28px]
      bg-[#07090C]
      text-white
      p-8
      shadow-xl
      "
    >
      <div
        className="
        w-14
        h-14
        rounded-2xl
        border
        border-[#C89D58]/30
        flex
        items-center
        justify-center
        mb-8
        "
      >
        <Mail
          size={24}
          className="text-[#C89D58]"
        />
      </div>

      <h3
        className="text-3xl"
        style={{
          fontFamily: "Georgia, serif",
        }}
      >
        Never Miss
        <br />
        an Update
      </h3>

      <p className="mt-5 leading-7 text-white/70">
        Subscribe to receive market insights,
        luxury launches and investment
        opportunities directly in your inbox.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-4"
      >
        <input
          type="email"
          required
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          placeholder="Enter your email"
          className="
          w-full
          rounded-xl
          border
          border-white/10
          bg-white/5
          px-5
          py-4
          text-white
          placeholder:text-white/40
          outline-none
          focus:border-[#C89D58]
          "
        />

        <button
          className="
          w-full
          rounded-xl
          bg-[#C89D58]
          py-4
          text-sm
          font-semibold
          text-black
          transition
          hover:bg-[#D9B877]
          "
        >
          SUBSCRIBE NOW
        </button>
      </form>
    </motion.div>
  );
}