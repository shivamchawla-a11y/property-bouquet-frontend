"use client";

import { useMemo, useState } from "react";

import {
  ArrowRight,
  ArrowUp,
  BadgeCheck,
  Building2,
  MapPin,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

/* ============================================================
   DEVELOPER ABOUT
   Same visual language + behavior as AboutLocation
============================================================ */

export default function DeveloperAbout({
  developer,
  properties = [],
  pageContent = {},
}) {
  if (!developer) {
    return null;
  }

  const about = pageContent?.about || {};

  /* ============================================================
     READ MORE STATE
  ============================================================ */

  const [isExpanded, setIsExpanded] = useState(false);

  /* ============================================================
     HELPER
  ============================================================ */

  const value = (customValue, fallback) => {
    return typeof customValue === "string" && customValue.trim()
      ? customValue.trim()
      : fallback;
  };

  /* ============================================================
     RICH TEXT HELPERS
  ============================================================ */

  const normalizeRichText = (text) => {
    if (typeof text !== "string") {
      return "";
    }

    return text
      .replace(/&nbsp;/gi, " ")
      .replace(/&#160;/gi, " ")
      .replace(/&#xA0;/gi, " ")
      .replace(/\u00a0/g, " ")
      .replace(/<p>\s*<\/p>/gi, "")
      .trim();
  };

  const hasRichText = (text) => {
    if (typeof text !== "string") {
      return false;
    }

    return /<\s*[a-z][^>]*>/i.test(text);
  };

  /* ============================================================
     ABOUT CONTENT
     
     Priority:
     1. pageContent.about.content
     2. existing developer.description
  ============================================================ */

  const cmsAboutContent =
    typeof about?.content === "string"
      ? normalizeRichText(about.content)
      : "";

  const developerDescription =
    typeof developer?.description === "string"
      ? normalizeRichText(developer.description)
      : "";

  const aboutContent =
    cmsAboutContent || developerDescription;

  /*
    Preserve existing behavior:
    if there is no content at all,
    don't render the section.
  */

  if (!aboutContent) {
    return null;
  }

  /* ============================================================
     ABOUT HEADING
  ============================================================ */

  const aboutEyebrow = value(
    about?.eyebrow,
    "ABOUT THE DEVELOPER"
  );

  const aboutTitle = value(
    about?.title,
    developer?.name || "About The Developer"
  );

  /* ============================================================
     DEVELOPER IMAGE
     
     Priority:
     1. developer.image
     2. developer.logo
     3. first project's hero image
     4. first project's regular image
  ============================================================ */

  const resolvedImage = useMemo(() => {
    const candidates = [
      developer?.image,
      developer?.logo,

      properties?.[0]?.media?.heroImageUrl,

      properties?.[0]?.media?.images?.[0]?.url,

      properties?.[0]?.media?.images?.[0],

      properties?.[0]?.image,

      properties?.[0]?.imageUrl,
    ];

    return (
      candidates.find(
        (image) =>
          typeof image === "string" &&
          image.trim()
      ) || ""
    );
  }, [developer, properties]);

  /* ============================================================
     PROJECT COUNT
  ============================================================ */

  const projectCount = properties.length;

  /* ============================================================
     PROPERTY TYPES
  ============================================================ */

  const propertyTypes = useMemo(() => {
    const types = new Set();

    properties.forEach((property) => {
      const values = [
        property?.categoryData?.categoryName,
        property?.category?.name,
        property?.propertyType,
        property?.propertyCategory,
        property?.coreDetails?.propertyType,
      ];

      values.forEach((item) => {
        if (
          typeof item === "string" &&
          item.trim()
        ) {
          types.add(item.trim());
        }
      });
    });

    return Array.from(types);
  }, [properties]);

  /* ============================================================
     LOCATIONS / PROJECT LOCATIONS
  ============================================================ */

  const projectLocations = useMemo(() => {
    const locations = new Set();

    properties.forEach((property) => {
      const values = [
        property?.locationName,
        property?.location?.name,
        property?.locationData?.name,
        property?.coreDetails?.location,
        property?.coreDetails?.locationName,
        property?.locationHierarchy,
      ];

      values.forEach((item) => {
        if (
          typeof item === "string" &&
          item.trim()
        ) {
          locations.add(item.trim());
        }
      });
    });

    return Array.from(locations);
  }, [properties]);

  /* ============================================================
     DEVELOPER STATUS
  ============================================================ */

  const developerStatus = value(
    about?.status,
    "Verified Developer"
  );

  /* ============================================================
     DEFAULT SNAPSHOT CARDS
     
     These are intentionally dynamic, similar to
     AboutLocation's Property Types / Developer Presence /
     Price Positioning cards.
  ============================================================ */

  const defaultHighlights = [
    {
      title: "Portfolio",
      description:
        projectCount > 0
          ? `${projectCount}+ ${
              projectCount === 1
                ? "project"
                : "projects"
            } available through Property Bouquet.`
          : "Curated premium developments available through Property Bouquet.",
    },

    {
      title: "Property Types",
      description: propertyTypes.length
        ? propertyTypes
            .slice(0, 3)
            .join(", ")
        : "Premium residential developments",
    },

    {
      title: "Developer Status",
      description: developerStatus,
    },
  ];

  /* ============================================================
     OPTIONAL CMS HIGHLIGHTS
     
     If pageContent.about.highlights exists, use it.
     Otherwise dynamic defaults remain active.
  ============================================================ */

  const customHighlights = Array.isArray(
    about?.highlights
  )
    ? about.highlights
    : [];

  const highlightLength = Math.max(
    defaultHighlights.length,
    customHighlights.length
  );

  const highlights = Array.from(
    {
      length: highlightLength,
    },
    (_, index) => {
      const fallback =
        defaultHighlights[index] || {
          title: "",
          description: "",
        };

      const customItem =
        customHighlights[index] &&
        typeof customHighlights[index] === "object"
          ? customHighlights[index]
          : {};

      return {
        title: value(
          customItem?.title,
          fallback.title
        ),

        description: value(
          customItem?.description,
          fallback.description
        ),
      };
    }
  ).filter(
    (item) =>
      item.title ||
      item.description
  );

  /* ============================================================
     ABOUT CONTENT CLEANUP
  ============================================================ */

  const normalizedContent =
    normalizeRichText(aboutContent);

  const contentHasRichText =
    hasRichText(normalizedContent);

  /* ============================================================
     ABOUT TEXT LENGTH
     
     Used for Read More / Read Less.
     
     Works for both:
     - plain text
     - rich HTML
  ============================================================ */

  const plainTextLength =
    normalizedContent
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .length;

  const needsReadMore =
    plainTextLength > 420;

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      id="about-developer"
      className="
        relative
        overflow-hidden
        bg-[#f7f7f7]
        py-16
        sm:py-20
        lg:py-24
      "
    >
      {/* ======================================================
          SOFT DECORATIVE GLOW
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-32
          -top-32
          h-[420px]
          w-[420px]
          rounded-full
          bg-[#D4AF37]/[0.06]
          blur-[120px]
        "
        aria-hidden="true"
      />

      {/* ======================================================
          MAIN CONTAINER
      ====================================================== */}

      <div
        className="
          mx-auto
          w-full
          max-w-[1450px]
          px-5
          sm:px-6
          md:px-8
          lg:px-10
        "
      >
        {/* ====================================================
            MAIN GRID
        ==================================================== */}

        <div
          className="
            grid
            w-full
            min-w-0
            items-start
            gap-10
            lg:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.75fr)]
            lg:gap-12
            xl:gap-16
            2xl:gap-20
          "
        >
          {/* ==================================================
              LEFT CONTENT COLUMN
          ================================================== */}

          <div
            className="
              min-w-0
              w-full
              max-w-full
            "
          >
            {/* ==================================================
                EYEBROW
            ================================================== */}

            <div
              className="
                mb-4
                flex
                min-w-0
                max-w-full
                items-center
                gap-2.5
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#A47A2B]
                sm:text-[10px]
                md:text-[11px]
              "
            >
              <span
                className="
                  h-px
                  w-8
                  shrink-0
                  bg-[#C89D58]
                "
              />

              <span
                className="
                  min-w-0
                  max-w-full
                  break-words
                  [overflow-wrap:anywhere]
                "
              >
                {aboutEyebrow}
              </span>
            </div>

            {/* ==================================================
                TITLE
            ================================================== */}

            <h2
              className="
                m-0
                max-w-full
                break-words
                font-playfair
                text-[34px]
                font-semibold
                leading-[1.08]
                tracking-[-0.025em]
                text-[#17342d]
                [overflow-wrap:anywhere]
                sm:text-[40px]
                md:text-[46px]
                lg:text-[52px]
              "
            >
              {aboutTitle}
            </h2>

            {/* GOLD DIVIDER */}

            <div
              className="
                mt-5
                h-px
                w-20
                bg-[#C89D58]
              "
              aria-hidden="true"
            />

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div
              className={`
                relative
                mt-6
                min-w-0
                w-full
                max-w-full
                ${
                  !isExpanded &&
                  needsReadMore
                    ? "max-h-[178px] overflow-hidden"
                    : "overflow-visible"
                }
              `}
            >
              {contentHasRichText ? (
                <div
                  className="
                    min-w-0
                    w-full
                    max-w-full
                    break-words
                    text-[13px]
                    leading-7
                    text-[#47545a]
                    [overflow-wrap:anywhere]
                    [word-break:break-word]

                    [&_*]:max-w-full

                    [&_p]:m-0
                    [&_p]:mb-4
                    [&_p:last-child]:mb-0
                    [&_p]:break-words
                    [&_p]:[overflow-wrap:anywhere]

                    [&_strong]:font-semibold
                    [&_strong]:text-[#263832]

                    [&_b]:font-semibold
                    [&_b]:text-[#263832]

                    [&_em]:italic

                    [&_u]:underline
                    [&_u]:underline-offset-2

                    [&_a]:font-medium
                    [&_a]:text-[#A47A2B]
                    [&_a]:underline
                    [&_a]:underline-offset-2

                    [&_ul]:mb-4
                    [&_ul]:ml-5
                    [&_ul]:max-w-full
                    [&_ul]:list-disc

                    [&_ol]:mb-4
                    [&_ol]:ml-5
                    [&_ol]:max-w-full
                    [&_ol]:list-decimal

                    [&_li]:mb-1
                    [&_li]:break-words
                    [&_li]:[overflow-wrap:anywhere]

                    [&_h1]:max-w-full
                    [&_h2]:max-w-full
                    [&_h3]:max-w-full
                    [&_h4]:max-w-full
                    [&_h5]:max-w-full
                    [&_h6]:max-w-full

                    [&_h1]:font-playfair
                    [&_h2]:font-playfair
                    [&_h3]:font-playfair
                    [&_h4]:font-playfair

                    [&_h1]:text-[#17342d]
                    [&_h2]:text-[#17342d]
                    [&_h3]:text-[#17342d]
                    [&_h4]:text-[#17342d]

                    [&_h1]:mb-4
                    [&_h2]:mb-4
                    [&_h3]:mb-3
                    [&_h4]:mb-2

                    [&_h3]:mt-5
                    [&_h4]:mt-4

                    [&_h3]:text-xl
                    [&_h3]:font-semibold

                    [&_h4]:font-semibold

                    [&_blockquote]:my-4
                    [&_blockquote]:border-l-2
                    [&_blockquote]:border-[#C89D58]
                    [&_blockquote]:pl-4
                    [&_blockquote]:italic

                    [&_img]:my-4
                    [&_img]:h-auto
                    [&_img]:max-w-full
                    [&_img]:rounded-xl

                    sm:text-[14px]
                    sm:leading-7

                    md:text-[15px]
                  "
                  dangerouslySetInnerHTML={{
                    __html: normalizedContent,
                  }}
                />
              ) : (
                <div
                  className="
                    min-w-0
                    w-full
                    max-w-full
                    space-y-4
                    break-words
                    text-[13px]
                    leading-7
                    text-[#47545a]
                    [overflow-wrap:anywhere]
                    [word-break:break-word]
                    sm:text-[14px]
                    sm:leading-7
                    md:text-[15px]
                  "
                >
                  {normalizedContent
                    .split(/\n\s*\n/)
                    .map(
                      (
                        paragraph,
                        index
                      ) => (
                        <p
                          key={index}
                          className="
                            m-0
                            max-w-full
                            break-words
                            [overflow-wrap:anywhere]
                          "
                        >
                          {paragraph.trim()}
                        </p>
                      )
                    )}
                </div>
              )}

              {/* ==================================================
                  COLLAPSED FADE
              ================================================== */}

              {!isExpanded &&
                needsReadMore && (
                  <div
                    className="
                      pointer-events-none
                      absolute
                      inset-x-0
                      bottom-0
                      h-20
                      bg-gradient-to-t
                      from-[#f7f7f7]
                      via-[#f7f7f7]/90
                      to-transparent
                    "
                  />
                )}
            </div>

            {/* ==================================================
                READ MORE
            ================================================== */}

            {needsReadMore && (
              <button
                type="button"
                onClick={() =>
                  setIsExpanded(
                    (previous) =>
                      !previous
                  )
                }
                aria-expanded={isExpanded}
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  border-0
                  bg-transparent
                  p-0
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-[#17342d]
                  transition-all
                  duration-300
                  hover:text-[#A47A2B]
                  focus:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#C89D58]/50
                  focus-visible:ring-offset-4
                "
              >
                <span>
                  {isExpanded
                    ? "Read Less"
                    : "Read More"}
                </span>

                {isExpanded ? (
                  <ArrowUp
                    size={14}
                    className="shrink-0"
                  />
                ) : (
                  <ArrowRight
                    size={14}
                    className="shrink-0"
                  />
                )}
              </button>
            )}

            {!needsReadMore && (
              <div className="h-1" />
            )}
          </div>

          {/* ==================================================
              RIGHT IMAGE COLUMN
          ================================================== */}

          <div
            className="
              relative
              min-w-0
              w-full
              max-w-full
              self-start
            "
          >
            {resolvedImage ? (
              <div
                className="
                  relative
                  w-full
                  min-w-0
                  max-w-full
                  overflow-hidden
                  rounded-[28px]
                  border
                  border-[#17342d]/10
                  bg-white
                  shadow-[0_24px_70px_rgba(23,52,45,0.12)]
                "
              >
                <div
                  className="
                    relative
                    aspect-[4/3]
                    w-full
                    min-w-0
                    max-w-full
                    overflow-hidden
                  "
                >
                  <img
                    src={resolvedImage}
                    alt={`${developer.name} developer projects`}
                    className="
                      block
                      h-full
                      w-full
                      max-w-full
                      object-cover
                      transition-transform
                      duration-700
                      hover:scale-[1.03]
                    "
                  />
                </div>

                {/* ==================================================
                    IMAGE OVERLAY
                ================================================== */}

                <div
                  className="
                    absolute
                    inset-x-0
                    bottom-0
                    bg-gradient-to-t
                    from-[#061811]/95
                    via-[#061811]/50
                    to-transparent
                    px-5
                    pb-5
                    pt-20
                  "
                >
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-2
                    "
                  >
                    <Building2
                      size={14}
                      className="
                        shrink-0
                        text-[#D4AF37]
                      "
                    />

                    <span
                      className="
                        min-w-0
                        max-w-full
                        break-words
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.16em]
                        text-white/75
                        [overflow-wrap:anywhere]
                      "
                    >
                      Developer Portfolio
                    </span>
                  </div>

                  <p
                    className="
                      mt-1
                      max-w-full
                      break-words
                      font-playfair
                      text-[22px]
                      font-semibold
                      leading-tight
                      text-white
                      [overflow-wrap:anywhere]
                    "
                  >
                    {developer.name}
                  </p>
                </div>
              </div>
            ) : (
              <div
                className="
                  flex
                  aspect-[4/3]
                  w-full
                  min-w-0
                  max-w-full
                  items-center
                  justify-center
                  overflow-hidden
                  rounded-[28px]
                  bg-[#17342d]
                  text-white/60
                "
              >
                <Building2
                  size={30}
                  className="text-[#D4AF37]"
                />
              </div>
            )}
          </div>
        </div>

        {/* ======================================================
            SNAPSHOT CARDS
        ====================================================== */}

        {highlights.length > 0 && (
          <div
            className="
              mt-10
              grid
              min-w-0
              w-full
              gap-3
              sm:grid-cols-3
              lg:mt-14
              lg:gap-4
            "
          >
            {highlights.map(
              (item, index) => (
                <SnapshotCard
                  key={`${index}-${item.title}`}
                  icon={
                    index === 0 ? (
                      <Building2 size={16} />
                    ) : index === 1 ? (
                      <TrendingUp size={16} />
                    ) : (
                      <ShieldCheck size={16} />
                    )
                  }
                  title={item.title}
                  description={
                    item.description
                  }
                />
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}

/* ============================================================
   SNAPSHOT CARD
============================================================ */

function SnapshotCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        min-w-0
        w-full
        overflow-hidden
        rounded-[20px]
        border
        border-[#17342d]/10
        bg-white
        p-5
        shadow-[0_12px_35px_rgba(23,52,45,0.05)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:shadow-[0_18px_45px_rgba(23,52,45,0.09)]
      "
    >
      {/* ICON */}

      <div
        className="
          flex
          h-9
          w-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#17342d]
          text-[#D4AF37]
        "
      >
        {icon}
      </div>

      {/* TITLE */}

      <p
        className="
          mt-4
          max-w-full
          break-words
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.14em]
          text-[#17342d]
          [overflow-wrap:anywhere]
        "
      >
        {title}
      </p>

      {/* DESCRIPTION */}

      <p
        className="
          mt-2
          max-w-full
          break-words
          text-[12px]
          leading-5
          text-[#667078]
          [overflow-wrap:anywhere]
        "
      >
        {description}
      </p>
    </div>
  );
}