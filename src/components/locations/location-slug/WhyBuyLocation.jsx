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

  const customContent =
    pageContent?.whyBuy || {};

  const customEyebrow =
    customContent?.eyebrow?.trim() ||
    "WHY BUY?";

  const customTitle =
    customContent?.title?.trim() ||
    `Why Consider Buying in ${locationName}?`;

  const customDescription =
    customContent?.description?.trim() ||
    `Choosing a property is about more than the individual home. Buyers often evaluate the surrounding location, connectivity, infrastructure, residential demand, quality of development, lifestyle ecosystem and the potential suitability of the address for their long-term objectives. These factors can help provide a broader framework when assessing opportunities in ${locationName}.`;

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
            reason.title || reason.description
        )
    : [];

  const reasons =
    customReasons.length > 0
      ? customReasons
      : defaultReasons;

  // ============================================================
  // ICONS
  //
  // Icons are intentionally controlled by position rather
  // than the admin editor. This keeps the CMS simple.
  // ============================================================

  const icons = [
    <MapPinned key="map" size={15} />,
    <TrendingUp key="trend" size={15} />,
    <Home key="home" size={15} />,
    <ShieldCheck key="shield" size={15} />,
    <Sparkles key="sparkles" size={15} />,
    <Clock3 key="clock" size={15} />,
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
        py-10
        sm:py-12
        md:py-14
        lg:py-16
      "
    >
      <div
        className="
          mx-auto
          max-w-[1450px]
          px-5
          sm:px-6
          lg:px-8
        "
      >
        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="max-w-[800px]">
          {/* EYEBROW */}

          <div
            className="
              flex
              items-center
              gap-2
              text-[8px]
              font-semibold
              uppercase
              tracking-[0.22em]
              text-[#8F7335]
              sm:text-[9px]
              md:text-[10px]
            "
          >
            <span className="h-px w-7 bg-[#C89D58]" />

            {customEyebrow}
          </div>

          {/* TITLE */}

          <h2
            id="why-buy-heading"
            className="
              mt-2
              font-playfair
              text-[27px]
              font-medium
              leading-[1.08]
              tracking-[-0.025em]
              text-[#17342d]
              sm:text-[31px]
              md:text-[35px]
              lg:text-[39px]
            "
          >
            {customTitle}
          </h2>

          <div className="mt-3 h-[2px] w-16 bg-[#C89D58]" />

          {/* DESCRIPTION */}

          <p
            className="
              mt-4
              max-w-[820px]
              text-[10.5px]
              leading-[1.8]
              text-[#59635e]
              sm:text-[11px]
              md:text-[12px]
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
            mt-6
            grid
            grid-cols-2
            gap-2
            sm:grid-cols-3
            lg:grid-cols-6
            lg:gap-3
          "
        >
          {reasons.map((reason, index) => (
            <article
              key={`${reason.title || "reason"}-${index}`}
              className="
                rounded-[12px]
                border
                border-[#e5ded4]
                bg-[#fbfaf7]
                px-3
                py-4
                text-center
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-[0_14px_35px_rgba(23,52,45,0.06)]
              "
            >
              {/* ICON */}

              <div
                className="
                  mx-auto
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#D4AF37]/40
                  bg-[#f7f3ec]
                  text-[#B58B2D]
                "
              >
                {icons[index] || (
                  <Sparkles size={15} />
                )}
              </div>

              {/* TITLE */}

              <h3
                className="
                  mt-3
                  text-[9px]
                  font-semibold
                  leading-4
                  text-[#17342d]
                "
              >
                {reason.title}
              </h3>

              {/* DESCRIPTION */}

              <p
                className="
                  mt-1
                  text-[7.8px]
                  leading-[1.55]
                  text-[#858b87]
                "
              >
                {reason.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}