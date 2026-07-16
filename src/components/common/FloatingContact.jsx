"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  Newspaper,
  Phone,
} from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";

export default function FloatingContact() {
  const phone = "919090106101";

  const whatsappMessage = encodeURIComponent(
    "Hi Property Bouquet, I'm interested in a property. Please assist me."
  );

  return (
    <>
      {/* ================= DESKTOP WHATSAPP ================= */}
      <a
        href={`https://wa.me/${phone}?text=${whatsappMessage}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="
          hidden
          lg:flex
          fixed
          bottom-6
          right-6
          z-50
          items-center
          justify-center
          w-[50px]
          h-[50px]
          rounded-full
          bg-[#25D366]
          border
          border-white/20
          transition-all
          duration-300
          hover:scale-110
          hover:-translate-y-1
          active:scale-95
        "
      >
        <FaWhatsapp
          size={28}
          className="text-white"
        />
      </a>

      {/* ================= MOBILE BOTTOM BAR ================= */}
      <div
        className="
          lg:hidden
          fixed
          bottom-0
          left-0
          right-0
          z-[9999]
          h-[78px]
          bg-[#07120f]/95
          backdrop-blur-2xl
          border-t
          border-[#c9a64b]/15
          shadow-[0_-18px_45px_rgba(0,0,0,0.45)]
          pb-[env(safe-area-inset-bottom)]
        "
      >
        {/* Floating Logo */}
        <Link
          href="/"
          className="
            absolute
            left-1/2
            -translate-x-1/2
            -top-8
            w-[74px]
            h-[74px]
            rounded-full
            bg-white
            border-[5px]
            border-[#07120f]
            shadow-[0_12px_35px_rgba(0,0,0,0.25)]
            flex
            items-center
            justify-center
            overflow-hidden
          "
        >
          <Image
            src="/logo.webp"
            alt="Property Bouquet"
            width={46}
            height={46}
            className="object-contain"
          />
        </Link>

        <div className="grid grid-cols-4 h-full px-3">

  {/* ================= PROPERTIES ================= */}
  <Link
    href="/properties"
    className="
  flex
  flex-col
  items-center
  justify-center
  pr-5
      gap-1
      border-r
      border-[#c9a64b]/10
      active:bg-white/5
      transition-all
    "
  >
    <Building2
      size={20}
      strokeWidth={2}
      className="text-[#c9a64b]"
    />

    <span
      className="
        text-[10px]
        font-medium
        tracking-[0.4px]
        text-white
      "
    >
      Properties
    </span>
  </Link>

  {/* ================= INSIGHTS ================= */}
  <Link
    href="/insights"
    className="
  flex
  flex-col
  items-center
  justify-center
  pr-8
      gap-1
      border-r
      border-[#c9a64b]/10
      active:bg-white/5
      transition-all
    "
  >
    <Newspaper
      size={20}
      strokeWidth={2}
      className="text-[#c9a64b]"
    />

    <span
      className="
        text-[10px]
        font-medium
        tracking-[0.4px]
        text-white
      "
    >
      Insights
    </span>
  </Link>

  {/* ================= CALL ================= */}
  <a
    href={`tel:+${phone}`}
    className="
  flex
  flex-col
  items-center
  justify-center
  pl-8
      gap-1
      border-r
      border-[#c9a64b]/10
      active:bg-white/5
      transition-all
    "
  >
    <Phone
      size={20}
      strokeWidth={2}
      className="text-[#c9a64b]"
    />

    <span
      className="
        text-[10px]
        font-medium
        tracking-[0.4px]
        text-white
      "
    >
      Call
    </span>
  </a>

  {/* ================= WHATSAPP ================= */}
  <a
    href={`https://wa.me/${phone}?text=${whatsappMessage}`}
    target="_blank"
    rel="noopener noreferrer"
   className="
  flex
  flex-col
  items-center
  justify-center
  pl-5
      gap-1
      active:bg-white/5 
      transition-all
    "
  >
    <FaWhatsapp
      size={21}
      className="text-[#25D366]"
    />

    <span
      className="
        text-[10px]
        font-medium
        tracking-[0.4px]
        text-white
      "
    >
      WhatsApp
    </span>
  </a>

</div>
      </div>
    </>
  );
}