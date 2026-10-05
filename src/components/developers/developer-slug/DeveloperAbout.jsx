"use client";

import {
  Building2,
  BadgeCheck,
} from "lucide-react";

/* ============================================================
   RICH TEXT HELPERS
============================================================ */

function normalizeRichText(text) {
  if (typeof text !== "string") return "";

  return text
    .replace(/&nbsp;/gi, " ")
    .replace(/&#160;/gi, " ")
    .replace(/&#xA0;/gi, " ")
    .replace(/\u00a0/g, " ")
    .replace(/<p>\s*<\/p>/gi, "")
    .trim();
}

function hasRichText(text) {
  if (typeof text !== "string") return false;

  return /<\s*[a-z][^>]*>/i.test(text);
}

export default function DeveloperAbout({
  developer,
  properties = [],
  pageContent = {},
}) {
  if (!developer) {
    return null;
  }

  /* ============================================================
      CMS + EXISTING FALLBACK VALUES

      IMPORTANT:
      CMS values are used only when actually populated.

      If the admin has not edited the About section yet,
      the existing Developer description continues to work.
  ============================================================ */

  const about = pageContent?.about || {};

  const aboutEyebrow =
    typeof about.eyebrow === "string" && about.eyebrow.trim()
      ? about.eyebrow.trim()
      : "About The Developer";

  const aboutTitle =
    typeof about.title === "string" && about.title.trim()
      ? about.title.trim()
      : developer?.name || "About The Developer";

  const cmsAboutContent =
    typeof about.content === "string"
      ? normalizeRichText(about.content)
      : "";

  const developerDescription =
    typeof developer?.description === "string"
      ? normalizeRichText(developer.description)
      : "";

  /*
    Priority:

    1. CMS About content
    2. Existing developer.description
  */
  const aboutContent = cmsAboutContent || developerDescription;

  /*
    Preserve the previous behavior:
    if there is absolutely no About content available,
    don't render an empty About section.
  */
  if (!aboutContent) {
    return null;
  }

  /* ============================================================
      EXISTING COMPANY HIGHLIGHTS
      These remain untouched because they are not part of the
      new CMS rich-text migration.
  ============================================================ */

  const companyHighlights = [
    "Luxury Residential Developments",
    "Premium Construction Quality",
    "Prime Investment Locations",
    "Trusted Developer Reputation",
    "RERA Registered Projects",
    "Customer-Centric Experience",
  ];

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-white
        py-24
      "
    >
      {/* ==================================================
          BACKGROUND GLOW
      ================================================== */}

      <div
        className="
          absolute
          right-0
          top-0
          h-[450px]
          w-[450px]
          rounded-full
          bg-[#D4AF37]/8
          blur-[120px]
        "
        aria-hidden="true"
      />

      {/* ==================================================
          CONTENT
      ================================================== */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1450px]
          px-6
        "
      >
        <div
          className="
            grid
            items-start
            gap-16
            lg:grid-cols-[1.4fr_420px]
          "
        >
          {/* ==================================================
              LEFT — DESCRIPTION
          ================================================== */}

          <div>
            {/* EYEBROW */}

            <span
              className="
                inline-flex
                items-center
                rounded-full
                bg-[#0B221B]
                px-5
                py-2
                text-[11px]
                uppercase
                tracking-[0.28em]
                text-[#D4AF37]
              "
            >
              {aboutEyebrow}
            </span>

            {/* TITLE */}

            <h2
              className="
                mt-7
                font-playfair
                text-4xl
                leading-tight
                text-[#0B221B]
                md:text-5xl
              "
            >
              {aboutTitle}
            </h2>

            <div
              className="
                mt-6
                h-[2px]
                w-28
                bg-[#D4AF37]
              "
              aria-hidden="true"
            />

            {/* ==================================================
                CONTENT

                CMS rich text is rendered as HTML.

                If CMS content is plain text, it still renders
                safely as normal text.

                If CMS is empty, developer.description is used.
            ================================================== */}

            <div
              className="
                mt-10
                text-[17px]
                leading-[2.05]
                text-[#4d4d4d]

                [&_p]:m-0
                [&_p]:mb-5
                [&_p:last-child]:mb-0

                [&_strong]:font-semibold
                [&_b]:font-semibold

                [&_em]:italic

                [&_u]:underline
                [&_u]:underline-offset-2

                [&_a]:font-medium
                [&_a]:text-[#B58B2D]
                [&_a]:underline
                [&_a]:underline-offset-2

                [&_ul]:my-5
                [&_ul]:list-disc
                [&_ul]:pl-6

                [&_ol]:my-5
                [&_ol]:list-decimal
                [&_ol]:pl-6

                [&_li]:mb-2

                [&_h1]:mb-4
                [&_h1]:font-playfair
                [&_h1]:text-3xl
                [&_h1]:font-medium
                [&_h1]:leading-tight
                [&_h1]:text-[#0B221B]

                [&_h2]:mb-4
                [&_h2]:font-playfair
                [&_h2]:text-2xl
                [&_h2]:font-medium
                [&_h2]:leading-tight
                [&_h2]:text-[#0B221B]

                [&_h3]:mb-3
                [&_h3]:font-playfair
                [&_h3]:text-xl
                [&_h3]:font-medium
                [&_h3]:leading-tight
                [&_h3]:text-[#0B221B]

                [&_h4]:mb-3
                [&_h4]:font-semibold
                [&_h4]:text-[#0B221B]

                [&_blockquote]:my-5
                [&_blockquote]:border-l-2
                [&_blockquote]:border-[#D4AF37]
                [&_blockquote]:pl-5
                [&_blockquote]:italic

                [&_img]:my-5
                [&_img]:max-w-full
                [&_img]:rounded-2xl
              "
            >
              {hasRichText(aboutContent) ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: aboutContent,
                  }}
                />
              ) : (
                <p className="whitespace-pre-line">
                  {aboutContent}
                </p>
              )}
            </div>
          </div>

          {/* ==================================================
              RIGHT — COMPANY HIGHLIGHTS
          ================================================== */}

          <div>
            <div
              className="
                rounded-[32px]
                border
                border-[#eadfcb]
                bg-white
                p-8
                shadow-[0_20px_70px_rgba(0,0,0,0.06)]
                lg:sticky
                lg:top-28
              "
            >
              {/* HEADER */}

              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#0B221B]
                    text-[#D4AF37]
                  "
                >
                  <Building2
                    size={24}
                    aria-hidden="true"
                  />
                </div>

                <div>
                  <p
                    className="
                      text-[11px]
                      uppercase
                      tracking-[0.25em]
                      text-[#B58B2D]
                    "
                  >
                    Company Highlights
                  </p>

                  <h3
                    className="
                      mt-1
                      text-2xl
                      font-semibold
                      text-[#0B221B]
                    "
                  >
                    Why Choose {developer.name}
                  </h3>
                </div>
              </div>

              {/* HIGHLIGHTS */}

              <div className="mt-8 space-y-5">
                {companyHighlights.map((item) => (
                  <div
                    key={item}
                    className="
                      flex
                      items-start
                      gap-4
                    "
                  >
                    <div
                      className="
                        mt-1
                        flex
                        h-8
                        w-8
                        items-center
                        justify-center
                        rounded-full
                        bg-[#D4AF37]/15
                      "
                    >
                      <BadgeCheck
                        size={16}
                        className="text-[#B58B2D]"
                        aria-hidden="true"
                      />
                    </div>

                    <p
                      className="
                        text-[15px]
                        leading-7
                        text-[#555]
                      "
                    >
                      {item}
                    </p>
                  </div>
                ))}
              </div>

              {/* PORTFOLIO */}

              <div
                className="
                  mt-10
                  rounded-2xl
                  bg-gradient-to-r
                  from-[#0B221B]
                  to-[#123126]
                  p-6
                "
              >
                <p
                  className="
                    text-[11px]
                    uppercase
                    tracking-[0.2em]
                    text-[#D4AF37]
                  "
                >
                  Portfolio
                </p>

                <h4
                  className="
                    mt-2
                    text-4xl
                    font-bold
                    text-white
                  "
                >
                  {properties.length}+
                </h4>

                <p className="mt-2 text-white/70">
                  Signature luxury developments available
                  through Property Bouquet.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}