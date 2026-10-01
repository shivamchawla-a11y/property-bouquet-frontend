"use client";

import {
  GraduationCap,
  HeartPulse,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";

export default function LocationLifestyle({
  locationName,
  locationImage = "",
  pageContent,
}) {
  /* ============================================================
     CUSTOM PAGE CONTENT
  ============================================================ */

  const customContent =
    pageContent?.lifestyle || {};

  /* ============================================================
     HELPER
  ============================================================ */

  const value = (
    customValue,
    fallback
  ) => {
    return (
      typeof customValue === "string" &&
      customValue.trim()
    )
      ? customValue.trim()
      : fallback;
  };

  /* ============================================================
     RICH TEXT HELPERS
     
     Supports:
     - Rich HTML saved by RichTextEditor
     - Existing plain-text descriptions
     - Empty paragraphs
     - NBSP entities
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
      .replace(/<p>\s*<\/p>/gi, "");
  };

  const hasRichText = (text) => {
    if (typeof text !== "string") {
      return false;
    }

    return /<\s*[a-z][^>]*>/i.test(text);
  };

  /* ============================================================
     RENDER SECTION DESCRIPTION
     
     If HTML exists:
       Render as rich text.
     
     If no HTML exists:
       Render as normal plain text.
  ============================================================ */

  const renderDescription = (
    description,
    className = ""
  ) => {
    const normalized =
      normalizeRichText(description);

    if (!normalized) {
      return null;
    }

    /* ==========================================================
       RICH TEXT
    ========================================================== */

    if (hasRichText(normalized)) {
      return (
        <div
          className={`
            ${className}
            [&_p]:m-0
            [&_p]:mb-4
            [&_p:last-child]:mb-0

            [&_strong]:font-semibold
            [&_b]:font-semibold

            [&_em]:italic

            [&_u]:underline
            [&_u]:underline-offset-2

            [&_a]:font-medium
            [&_a]:text-[#8F7335]
            [&_a]:underline
            [&_a]:underline-offset-2
            [&_a]:transition-colors
            [&_a:hover]:text-[#17342d]

            [&_ul]:my-4
            [&_ul]:list-disc
            [&_ul]:pl-5

            [&_ol]:my-4
            [&_ol]:list-decimal
            [&_ol]:pl-5

            [&_li]:mb-1.5

            [&_h1]:mb-3
            [&_h1]:font-playfair
            [&_h1]:text-2xl
            [&_h1]:font-medium
            [&_h1]:leading-tight
            [&_h1]:text-[#17342d]

            [&_h2]:mb-3
            [&_h2]:font-playfair
            [&_h2]:text-xl
            [&_h2]:font-medium
            [&_h2]:leading-tight
            [&_h2]:text-[#17342d]

            [&_h3]:mb-2
            [&_h3]:font-playfair
            [&_h3]:text-lg
            [&_h3]:font-medium
            [&_h3]:leading-tight
            [&_h3]:text-[#17342d]

            [&_h4]:mb-2
            [&_h4]:font-semibold
            [&_h4]:text-[#17342d]

            [&_blockquote]:my-4
            [&_blockquote]:border-l-2
            [&_blockquote]:border-[#C89D58]
            [&_blockquote]:pl-4
            [&_blockquote]:italic

            [&_img]:my-4
            [&_img]:max-w-full
            [&_img]:rounded-xl
          `}
          dangerouslySetInnerHTML={{
            __html: normalized,
          }}
        />
      );
    }

    /* ==========================================================
       PLAIN TEXT
       
       Preserve paragraph breaks from old database content.
    ========================================================== */

    const paragraphs =
      normalized.split(/\n\s*\n/);

    return (
      <div className={className}>
        {paragraphs.map(
          (paragraph, index) => {
            const trimmed =
              paragraph.trim();

            if (!trimmed) {
              return null;
            }

            return (
              <p
                key={index}
                className="
                  m-0
                  mb-4
                  last:mb-0
                "
              >
                {trimmed}
              </p>
            );
          }
        )}
      </div>
    );
  };

  /* ============================================================
     HEADER DEFAULTS
  ============================================================ */

  const defaultEyebrow =
    "SCHOOLS, HOSPITALS & LIFESTYLE";

  const defaultTitle =
    `Everyday Convenience Around ${locationName}`;

  const defaultDescription =
    `A location becomes more than an address when the everyday essentials of modern living are within practical reach. For residents of ${locationName}, schools, healthcare, retail, dining and leisure infrastructure form an important part of the broader residential experience. Buyers can consider these factors alongside the individual project's specifications, amenities and connectivity.`;

  const customEyebrow = value(
    customContent?.eyebrow,
    defaultEyebrow
  );

  const customTitle = value(
    customContent?.title,
    defaultTitle
  );

  const customDescription = value(
    customContent?.description,
    defaultDescription
  );

  /* ============================================================
     DEFAULT GROUPS
  ============================================================ */

  const defaultGroups = [
    {
      title: "Top Schools & Universities",

      description:
        "Educational options are an important consideration for families evaluating a long-term residential address.",

      items: [
        "Schools and educational institutions",
        "Higher education options",
        "Learning and activity centres",
        "Family-oriented neighbourhoods",
      ],
    },

    {
      title: "Leading Healthcare",

      description:
        "Access to healthcare infrastructure contributes to everyday convenience and residential liveability.",

      items: [
        "Hospitals and medical centres",
        "Specialist healthcare",
        "Diagnostic facilities",
        "Emergency care access",
      ],
    },

    {
      title: "Shopping & Entertainment",

      description:
        "Retail, dining and leisure destinations add to the lifestyle experience surrounding a residential community.",

      items: [
        "Shopping destinations",
        "Restaurants and cafes",
        "Entertainment options",
        "Daily convenience retail",
      ],
    },
  ];

  /* ============================================================
     ICONS

     First three retain the original icons.
     Additional custom groups cycle through them.
  ============================================================ */

  const groupIcons = [
    GraduationCap,
    HeartPulse,
    ShoppingBag,
  ];

  /* ============================================================
     CUSTOM GROUPS
  ============================================================ */

  const customGroups =
    Array.isArray(
      customContent?.groups
    )
      ? customContent.groups
      : [];

  const totalGroups = Math.max(
    defaultGroups.length,
    customGroups.length
  );

  const lifestyleGroups = [];

  /* ============================================================
     BUILD GROUPS
  ============================================================ */

  for (
    let index = 0;
    index < totalGroups;
    index++
  ) {
    const fallback =
      defaultGroups[index];

    const customGroup =
      customGroups[index] &&
      typeof customGroups[index] ===
        "object"
        ? customGroups[index]
        : {};

    const hasCustomTitle =
      typeof customGroup?.title ===
        "string" &&
      customGroup.title.trim();

    const hasCustomDescription =
      typeof customGroup?.description ===
        "string" &&
      customGroup.description.trim();

    const customItems =
      Array.isArray(
        customGroup?.items
      )
        ? customGroup.items
            .filter(
              (item) =>
                typeof item ===
                  "string" &&
                item.trim()
            )
            .map((item) =>
              item.trim()
            )
        : [];

    const hasCustomItems =
      customItems.length > 0;

    /* ==========================================================
       EXISTING DEFAULT GROUP
    ========================================================== */

    if (fallback) {
      const Icon =
        groupIcons[
          index % groupIcons.length
        ];

      /*
       * If there is NO custom content for this group:
       * use the complete static/default group.
       *
       * If the admin has customized the title or description:
       * this becomes a custom group.
       *
       * In that case:
       * - custom items -> show custom items
       * - no custom items -> show NO bullet items
       */

      const groupHasCustomContent =
        Boolean(
          hasCustomTitle ||
            hasCustomDescription ||
            hasCustomItems
        );

      let finalTitle;
      let finalDescription;
      let finalItems;

      if (!groupHasCustomContent) {
        /* ------------------------------------------------------
           COMPLETELY DEFAULT GROUP
        ------------------------------------------------------ */

        finalTitle =
          fallback.title;

        finalDescription =
          fallback.description;

        finalItems = [
          ...fallback.items,
        ];
      } else {
        /* ------------------------------------------------------
           CUSTOMIZED GROUP
        ------------------------------------------------------ */

        finalTitle = value(
          customGroup?.title,
          fallback.title
        );

        finalDescription = value(
          customGroup?.description,
          fallback.description
        );

        /*
         * If custom items exist, use them.
         *
         * If no custom items exist, intentionally return
         * an empty array instead of fallback.items.
         *
         * This prevents unrelated default bullets such as:
         * "Hospitals and medical centres"
         * from appearing underneath a custom description.
         */

        finalItems = hasCustomItems
          ? customItems
          : [];
      }

      /*
       * Only add a group if it has meaningful content.
       */

      if (
        finalTitle ||
        finalDescription ||
        finalItems.length > 0
      ) {
        lifestyleGroups.push({
          title: finalTitle,
          description:
            finalDescription,
          items: finalItems,
          icon: Icon,
        });
      }

      continue;
    }

    /* ==========================================================
       ADDITIONAL CUSTOM GROUP

       Example:
       Admin creates group #4.

       We preserve it instead of throwing it away.
    ========================================================== */

    const Icon =
      groupIcons[
        index % groupIcons.length
      ];

    const title =
      typeof customGroup?.title ===
        "string" &&
      customGroup.title.trim()
        ? customGroup.title.trim()
        : "Lifestyle & Convenience";

    const description =
      typeof customGroup?.description ===
        "string" &&
      customGroup.description.trim()
        ? customGroup.description.trim()
        : `Everyday conveniences and lifestyle destinations around ${locationName}.`;

    lifestyleGroups.push({
      title,
      description,
      items: customItems,
      icon: Icon,
    });
  }

  /* ============================================================
     RENDER
  ============================================================ */

  return (
    <section
      id="lifestyle"
      aria-labelledby="lifestyle-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-[#f7f3ec]
        py-16
        sm:py-18
        md:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[1380px]
          px-5
          sm:px-7
          lg:px-10
        "
      >
        <div
          className="
            grid
            items-stretch
            gap-8
            lg:grid-cols-[minmax(0,1fr)_340px]
            xl:grid-cols-[minmax(0,1fr)_380px]
            xl:gap-10
          "
        >
          {/* ====================================================
              LEFT CONTENT
          ==================================================== */}

          <div>
            {/* EYEBROW */}

            <div
              className="
                flex
                items-center
                gap-3
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.24em]
                text-[#8F7335]
                sm:text-[11px]
              "
            >
              <span className="h-px w-8 bg-[#C89D58]" />

              <span>
                {customEyebrow}
              </span>
            </div>

            {/* TITLE */}

            <h2
              id="lifestyle-heading"
              className="
                mt-4
                max-w-[800px]
                whitespace-pre-line
                font-playfair
                text-[34px]
                font-medium
                leading-[1.08]
                tracking-[-0.025em]
                text-[#17342d]
                sm:text-[39px]
                md:text-[44px]
                lg:text-[48px]
              "
            >
              {customTitle}
            </h2>

            {/* GOLD ACCENT */}

            <div className="mt-5 h-[2px] w-16 bg-[#C89D58]" />

            {/* ==================================================
                DESCRIPTION

                Supports BOTH:

                1. Rich HTML from RichTextEditor
                2. Existing plain text from database
            ================================================== */}

            {renderDescription(
              customDescription,
              `
                mt-5
                max-w-[850px]
                text-[13px]
                leading-[1.85]
                text-[#59635e]
                sm:text-[14px]
                md:text-[15px]
              `
            )}

            {/* ==================================================
                LIFESTYLE CARDS
            ================================================== */}

            <div
              className="
                mt-9
                grid
                gap-5
                md:grid-cols-3
              "
            >
              {lifestyleGroups.map(
                (group, index) => {
                  const Icon =
                    group.icon;

                  return (
                    <article
                      key={`${group.title}-${index}`}
                      className="
                        group
                        flex
                        h-full
                        flex-col
                        rounded-[20px]
                        border
                        border-[#e1d9cd]
                        bg-white
                        p-5
                        shadow-[0_10px_35px_rgba(23,52,45,0.04)]
                        transition-all
                        duration-300
                        hover:-translate-y-1
                        hover:border-[#d2c4af]
                        hover:shadow-[0_18px_45px_rgba(23,52,45,0.08)]
                        sm:p-6
                      "
                    >
                      {/* CARD HEADER */}

                      <div className="flex items-start gap-4">
                        <div
                          className="
                            flex
                            h-11
                            w-11
                            shrink-0
                            items-center
                            justify-center
                            rounded-[13px]
                            bg-[#17342d]
                            text-[#D4AF37]
                            shadow-[0_6px_18px_rgba(23,52,45,0.12)]
                            transition-transform
                            duration-300
                            group-hover:scale-105
                          "
                        >
                          <Icon
                            size={21}
                            strokeWidth={1.6}
                          />
                        </div>

                        <h3
                          className="
                            pt-1
                            text-[15px]
                            font-semibold
                            leading-[1.35]
                            text-[#17342d]
                            sm:text-[16px]
                          "
                        >
                          {group.title}
                        </h3>
                      </div>

                      {/* CARD DESCRIPTION */}

                      <p
                        className="
                          mt-5
                          text-[12px]
                          leading-[1.75]
                          text-[#6d746f]
                          sm:text-[13px]
                        "
                      >
                        {group.description}
                      </p>

                      {/* DIVIDER */}

                      <div
                        className="
                          mt-5
                          h-px
                          w-full
                          bg-[#eee8df]
                        "
                      />

                      {/* ITEMS */}

                      {group.items.length >
                        0 && (
                        <ul
                          className="
                            mt-5
                            space-y-3
                          "
                        >
                          {group.items.map(
                            (
                              item,
                              itemIndex
                            ) => (
                              <li
                                key={`${item}-${itemIndex}`}
                                className="
                                  flex
                                  items-start
                                  gap-3
                                  text-[11.5px]
                                  leading-[1.55]
                                  text-[#59635e]
                                  sm:text-[12px]
                                "
                              >
                                <span
                                  className="
                                    mt-[7px]
                                    h-[5px]
                                    w-[5px]
                                    shrink-0
                                    rounded-full
                                    bg-[#C89D58]
                                  "
                                />

                                <span>
                                  {item}
                                </span>
                              </li>
                            )
                          )}
                        </ul>
                      )}

                      {/* CTA */}

                      <a
                        href="#projects"
                        className="
                          mt-auto
                          inline-flex
                          items-center
                          gap-2
                          pt-7
                          text-[11px]
                          font-semibold
                          tracking-[0.01em]
                          text-[#17342d]
                          transition-colors
                          duration-200
                          hover:text-[#8F7335]
                          sm:text-[12px]
                        "
                      >
                        <span>
                          Explore Properties
                        </span>

                        <ArrowRight
                          size={14}
                          strokeWidth={1.7}
                          className="
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                          "
                        />
                      </a>
                    </article>
                  );
                }
              )}
            </div>
          </div>

          {/* ====================================================
              IMAGE PANEL
          ==================================================== */}

          <div
            className="
              relative
              min-h-[420px]
              overflow-hidden
              rounded-[24px]
              bg-[#17342d]
              lg:min-h-full
            "
          >
            {locationImage ? (
              <>
                <img
                  src={locationImage}
                  alt={`${locationName} residential and lifestyle surroundings`}
                  className="
                    absolute
                    inset-0
                    h-full
                    w-full
                    object-cover
                    transition-transform
                    duration-700
                    hover:scale-[1.025]
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#061811]
                    via-[#061811]/35
                    to-transparent
                  "
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-r
                    from-[#061811]/20
                    to-transparent
                  "
                />
              </>
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#17342d]
                  via-[#102d25]
                  to-[#081a14]
                "
              />
            )}

            {/* IMAGE CONTENT */}

            <div
              className="
                absolute
                inset-x-0
                bottom-0
                p-7
                sm:p-8
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-3
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-[#D4AF37]
                  sm:text-[11px]
                "
              >
                <span className="h-px w-7 bg-[#D4AF37]" />

                <span>
                  LIFESTYLE
                </span>
              </div>

              <h3
                className="
                  mt-4
                  max-w-[290px]
                  font-playfair
                  text-[29px]
                  leading-[1.18]
                  tracking-[-0.015em]
                  text-white
                  sm:text-[32px]
                "
              >
                Everything you need,
                <br />
                closer to home.
              </h3>

              <p
                className="
                  mt-4
                  text-[11px]
                  leading-[1.6]
                  text-white/70
                  sm:text-[12px]
                "
              >
                Everyday essentials, education,
                healthcare, shopping and leisure
                around {locationName}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}