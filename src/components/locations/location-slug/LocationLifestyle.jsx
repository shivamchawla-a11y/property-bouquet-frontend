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
  // ============================================================
  // CUSTOM PAGE CONTENT
  // ============================================================

  const customContent = pageContent?.lifestyle || {};

  const customEyebrow =
    typeof customContent.eyebrow === "string" &&
    customContent.eyebrow.trim()
      ? customContent.eyebrow.trim()
      : "SCHOOLS, HOSPITALS & LIFESTYLE";

  const customTitle =
    typeof customContent.title === "string" &&
    customContent.title.trim()
      ? customContent.title.trim()
      : `Everyday Convenience Around ${locationName}`;

  const customDescription =
    typeof customContent.description === "string" &&
    customContent.description.trim()
      ? customContent.description.trim()
      : `A location becomes more than an address when the everyday essentials of modern living are within practical reach. For residents of ${locationName}, schools, healthcare, retail, dining and leisure infrastructure form an important part of the broader residential experience. Buyers can consider these factors alongside the individual project's specifications, amenities and connectivity.`;

  // ============================================================
  // DEFAULT GROUPS
  // ============================================================

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

  // ============================================================
  // CUSTOM GROUPS
  //
  // Use admin groups only when actual content exists.
  // ============================================================

  const hasCustomGroups =
    Array.isArray(customContent.groups) &&
    customContent.groups.some(
      (group) =>
        typeof group?.title === "string" &&
        group.title.trim()
    );

  const lifestyleGroups = (
    hasCustomGroups
      ? customContent.groups
      : defaultGroups
  ).map((group, index) => {
    const fallback =
      defaultGroups[index] || defaultGroups[0];

    const items = Array.isArray(group?.items)
      ? group.items
          .filter(
            (item) =>
              typeof item === "string" &&
              item.trim()
          )
          .map((item) => item.trim())
      : [];

    return {
      title:
        typeof group?.title === "string" &&
        group.title.trim()
          ? group.title.trim()
          : fallback.title,

      description:
        typeof group?.description === "string" &&
        group.description.trim()
          ? group.description.trim()
          : fallback.description,

      items:
        items.length > 0
          ? items
          : fallback.items,

      icon:
        index === 0
          ? GraduationCap
          : index === 1
            ? HeartPulse
            : ShoppingBag,
    };
  });

  // ============================================================
  // RENDER
  // ============================================================

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

              <span>{customEyebrow}</span>
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

            {/* DESCRIPTION */}

            <p
              className="
                mt-5
                max-w-[850px]
                text-[13px]
                leading-[1.85]
                text-[#59635e]
                sm:text-[14px]
                md:text-[15px]
              "
            >
              {customDescription}
            </p>

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
                  const Icon = group.icon;

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

                      <ul
                        className="
                          mt-5
                          space-y-3
                        "
                      >
                        {group.items.map(
                          (item, itemIndex) => (
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

                              <span>{item}</span>
                            </li>
                          )
                        )}
                      </ul>

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
            {/* IMAGE */}

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

                {/* DARK OVERLAY */}

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

                {/* SUBTLE SIDE OVERLAY */}

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
              {/* LABEL */}

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

                <span>LIFESTYLE</span>
              </div>

              {/* IMAGE TITLE */}

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

              {/* LOCATION */}

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