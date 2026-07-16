"use client";

import { Phone, FileText, Home } from "lucide-react";
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
          group
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
        <FaWhatsapp className="text-white text-[28px]" />
      </a>

      {/* ================= MOBILE ACTION BAR ================= */}
<div
  className="
    lg:hidden
    fixed
    bottom-0
    left-0
    right-0
    z-[9999]
    bg-[#081310]/95
    backdrop-blur-xl
    border-t
    border-[#c9a64b]/20
    shadow-[0_-15px_40px_rgba(0,0,0,0.35)]
    pb-[max(env(safe-area-inset-bottom),10px)]
  "
>
  <div className="grid grid-cols-3 h-[68px]">

    {/* HOME */}
    {/* ================= HOME ================= */}
<a
  href="/"
  className="
    flex-1
    flex
    flex-col
    items-center
    justify-center
    gap-[4px]
    border-r
    border-[#c9a64b]/10
    active:bg-white/5
    transition-all
    duration-200
  "
>
  <Home
    size={20}
    strokeWidth={2}
    className="text-[#c9a64b]"
  />

  <span
    className="
      text-[11px]
      tracking-[0.5px]
      font-medium
      text-white/95
    "
  >
    Home
  </span>
</a>

{/* ================= CALL ================= */}
<a
  href={`tel:+${phone}`}
  className="
    flex-1
    flex
    flex-col
    items-center
    justify-center
    gap-[4px]
    border-r
    border-[#c9a64b]/10
    active:bg-white/5
    transition-all
    duration-200
  "
>
  <Phone
    size={20}
    strokeWidth={2}
    className="text-[#c9a64b]"
  />

  <span
    className="
      text-[11px]
      tracking-[0.5px]
      font-medium
      text-white/95
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
    flex-1
    flex
    flex-col
    items-center
    justify-center
    gap-[4px]
    active:bg-white/5
    transition-all
    duration-200
  "
>
  <FaWhatsapp
    size={21}
    className="text-[#25D366]"
  />

  <span
    className="
      text-[11px]
      tracking-[0.5px]
      font-medium
      text-white/95
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