
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// ======================================================
// KNOWLEDGE ARTICLE CARD
// SERVER COMPONENT
// ======================================================

export default function KnowledgeCard({
  image,
  badge,
  title,
  description,
  href = "#",
}) {
  return (
    <article
      className="
        bg-white
        rounded-2xl
        overflow-hidden
        border
        border-[#ebe5da]
        shadow-sm
        hover:shadow-xl
        transition-shadow
        duration-300
        group
      "
    >

      {/* ==================================================
          ARTICLE IMAGE
      ================================================== */}

      <div
        className="
          relative
          h-60
          overflow-hidden
          bg-[#eeeae2]
        "
      >

        {image ? (
          <Image
            src={image}
            alt={title || "Knowledge article"}
            fill
            sizes="
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            quality={75}
            loading="lazy"
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              items-center
              justify-center
              bg-gradient-to-br
              from-[#163629]
              to-[#07111d]
              text-[#c9a64b]
            "
            aria-label="Article image unavailable"
          >
            <span className="text-4xl" aria-hidden="true">
              ✦
            </span>
          </div>
        )}

        {/* CATEGORY BADGE */}

        {badge && (
          <span
            className="
              absolute
              top-4
              left-4
              bg-[#f7edd1]
              text-[#a87a14]
              text-xs
              font-semibold
              uppercase
              tracking-wide
              px-3
              py-1.5
              rounded-md
            "
          >
            {badge}
          </span>
        )}

      </div>

      {/* ==================================================
          ARTICLE CONTENT
      ================================================== */}

      <div className="p-6">

        {/* TITLE */}

        <h3
          className="
            text-[30px]
            leading-snug
            font-serif
            text-[#111]
            group-hover:text-[#b88a24]
            transition-colors
            duration-300
          "
        >
          {title}
        </h3>

        {/* DESCRIPTION */}

        {description && (
          <p
            className="
              mt-4
              text-gray-600
              leading-8
            "
          >
            {description}
          </p>
        )}

        {/* READ MORE */}

        <Link
          href={href}
          className="
            inline-flex
            items-center
            gap-2
            mt-6
            font-medium
            text-[#b88a24]
            hover:gap-3
            transition-all
            duration-300
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#b88a24]
            focus-visible:ring-offset-4
            rounded-sm
          "
        >
          Read More

          <ArrowRight
            size={18}
            aria-hidden="true"
          />

        </Link>

      </div>

    </article>
  );
}
