"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function FloatingContact() {
  const phone = "919090106101";

  const whatsappMessage = encodeURIComponent(
    "Hi Property Bouquet, I'm interested in a property. Please assist me."
  );

  return (
    <a
      href={`https://wa.me/${phone}?text=${whatsappMessage}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        group
        fixed
        bottom-6
        right-6
        z-50
        flex
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
        className="
          text-white
          text-[34px]
          transition-transform
          duration-300
          group-hover:scale-110
        "
      />
    </a>
  );
}