"use client";

import {
  MapPinned,
  TrendingUp,
  Home,
  ShieldCheck,
  Sparkles,
  Clock3,
} from "lucide-react";

export default function WhyBuyLocation({
  locationName,
  pageContent,
}) {
  // ============================================================
  // ADMIN CUSTOM CONTENT
  // ============================================================

  const customContent = pageContent?.whyBuy || {};

  const customEyebrow =
    typeof customContent?.eyebrow === "string" &&
    customContent.eyebrow.trim()
      ? customContent.eyebrow.trim()
      : "WHY BUY?";

  const customTitle =
    typeof customContent?.title === "string" &&
    customContent.title.trim()
      ? customContent.title.trim()
      : `Why Consider Buying in ${locationName}?`;

  const customDescription =
    typeof customContent?.description === "string" &&
    customContent.description.trim()
      ? customContent.description.trim()
      : `Choosing a property is about more than the individual home. Buyers often evaluate the surrounding location, connectivity, infrastructure, residential demand, quality of development, lifestyle ecosystem and the potential suitability of the address for their long-term objectives. These factors can help provide a broader framework when assessing opportunities in ${locationName}.`;

  // ============================================================
  // DEFAULT REASONS
  // ============================================================

  const defaultReasons = [
    {
      title: "Strategic Location",
      description:
        "A well-positioned address can improve everyday convenience and broaden access to important destinations.",
    },
    {
      title: "Infrastructure Growth",
      description:
        "Infrastructure development can influence accessibility, activity and the long-term character of a locality.",
    },
    {
      title: "Residential Demand",
      description:
        "Demand from homebuyers can support the development of diverse residential communities and amenities.",
    },
    {
      title: "Reputed Developers",
      description:
        "Established developers can bring planned communities, professional execution and differentiated project offerings.",
    },
    {
      title: "Lifestyle Ecosystem",
      description:
        "A growing combination of retail, education, healthcare and leisure can enhance everyday liveability.",
    },
    {
      title: "Long-Term Potential",
      description:
        "Buyers can evaluate infrastructure, supply, demand and future development while considering long-term ownership.",
    },
  ];

  // ============================================================
  // ADMIN REASONS
  // ============================================================

  const customReasons = Array.isArray(
    customContent?.reasons
  )
    ? customContent.reasons
        .map((reason) => ({
          title:
            typeof reason?.title === "string"
              ? reason.title.trim()
              : "",

          description:
            typeof reason?.description === "string"
              ? reason.description.trim()
              : "",
        }))
        .filter(
          (reason) =>
            reason.title &&
            reason.description
        )
    : [];

  const reasons =
    customReasons.length > 0
      ? customReasons
      : defaultReasons;

  // ============================================================
  // ICONS
  //
  // Icons remain frontend-controlled by position.
  // ============================================================

  const icons = [
    MapPinned,
    TrendingUp,
    Home,
    ShieldCheck,
    Sparkles,
    Clock3,
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      id="why-buy"
      aria-labelledby="why-buy-heading"
      className="
        relative
        overflow-hidden
        border-t
        border-[#e8e1d7]
        bg-white
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
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="max-w-[900px]">
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
            id="why-buy-heading"
            className="
              mt-4
              max-w-[850px]
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
        </div>

        {/* ======================================================
            REASONS
        ====================================================== */}

        <div
          className="
            mt-10
            grid
            grid-cols-1
            gap-4
            sm:grid-cols-2
            lg:grid-cols-3
            xl:grid-cols-6
          "
        >
          {reasons.map((reason, index) => {
            const Icon =
              icons[index] || Sparkles;

            return (
              <article
                key={`${reason.title || "reason"}-${index}`}
                className="
                  group
                  relative
                  flex
                  h-full
                  min-h-[235px]
                  flex-col
                  rounded-[20px]
                  border
                  border-[#e2dbd0]
                  bg-[#fbfaf7]
                  p-6
                  transition-all
                  duration-300
                  hover:-translate-y-1
                  hover:border-[#d2c4af]
                  hover:bg-white
                  hover:shadow-[0_18px_45px_rgba(23,52,45,0.08)]
                "
              >
                {/* TOP ACCENT */}

                <div
                  className="
                    absolute
                    left-6
                    top-0
                    h-[2px]
                    w-10
                    bg-[#C89D58]
                    opacity-70
                    transition-all
                    duration-300
                    group-hover:w-16
                  "
                />

                {/* ICON */}

                <div
                  className="
                    flex
                    h-11
                    w-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-[13px]
                    border
                    border-[#D4AF37]/35
                    bg-[#f5f0e7]
                    text-[#A9822E]
                    transition-all
                    duration-300
                    group-hover:border-[#C89D58]/50
                    group-hover:bg-[#17342d]
                    group-hover:text-[#D4AF37]
                  "
                >
                  <Icon
                    size={20}
                    strokeWidth={1.6}
                  />
                </div>

                {/* NUMBER */}

                <span
                  className="
                    absolute
                    right-5
                    top-5
                    text-[10px]
                    font-semibold
                    tracking-[0.12em]
                    text-[#b7afa3]
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* TITLE */}

                <h3
                  className="
                    mt-6
                    text-[15px]
                    font-semibold
                    leading-[1.35]
                    text-[#17342d]
                    sm:text-[16px]
                  "
                >
                  {reason.title}
                </h3>

                {/* DESCRIPTION */}

                <p
                  className="
                    mt-3
                    text-[12px]
                    leading-[1.75]
                    text-[#6d746f]
                    sm:text-[13px]
                  "
                >
                  {reason.description}
                </p>

                {/* BOTTOM DETAIL */}

                <div
                  className="
                    mt-auto
                    pt-6
                  "
                >
                  <div
                    className="
                      h-px
                      w-full
                      bg-[#e9e3da]
                    "
                  />

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.12em]
                      text-[#8F7335]
                    "
                  >
                    <span
                      className="
                        h-1.5
                        w-1.5
                        rounded-full
                        bg-[#C89D58]
                      "
                    />

                    Location Factor
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}