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
  // Only use the admin groups when there is actual content.
  // This prevents an empty editor from making the public section
  // appear blank.
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
    const fallback = defaultGroups[index] || defaultGroups[0];

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
        <div
          className="
            grid
            items-stretch
            gap-5
            lg:grid-cols-[minmax(0,1fr)_250px]
            xl:grid-cols-[minmax(0,1fr)_280px]
          "
        >
          {/* ====================================================
              CONTENT
          ==================================================== */}

          <div>
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

            <h2
              id="lifestyle-heading"
              className="
                mt-2
                max-w-[720px]
                whitespace-pre-line
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

            <div
              className="
                mt-5
                grid
                gap-3
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
                        rounded-[14px]
                        border
                        border-[#e2dbd0]
                        bg-white
                        p-4
                      "
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className="
                            flex
                            h-8
                            w-8
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-[#17342d]
                            text-[#D4AF37]
                          "
                        >
                          <Icon size={16} />
                        </div>

                        <h3
                          className="
                            text-[10px]
                            font-semibold
                            leading-4
                            text-[#17342d]
                          "
                        >
                          {group.title}
                        </h3>
                      </div>

                      <p
                        className="
                          mt-3
                          text-[8.5px]
                          leading-[1.65]
                          text-[#727872]
                        "
                      >
                        {group.description}
                      </p>

                      <ul className="mt-3 space-y-1.5">
                        {group.items.map(
                          (item, itemIndex) => (
                            <li
                              key={`${item}-${itemIndex}`}
                              className="
                                flex
                                items-start
                                gap-2
                                text-[8px]
                                leading-4
                                text-[#656d68]
                              "
                            >
                              <span
                                className="
                                  mt-[5px]
                                  h-1
                                  w-1
                                  shrink-0
                                  rounded-full
                                  bg-[#C89D58]
                                "
                              />

                              {item}
                            </li>
                          )
                        )}
                      </ul>

                      <a
                        href="#projects"
                        className="
                          mt-3
                          inline-flex
                          items-center
                          gap-1
                          text-[8px]
                          font-semibold
                          text-[#17342d]
                        "
                      >
                        Explore Properties

                        <ArrowRight size={10} />
                      </a>
                    </article>
                  );
                }
              )}
            </div>
          </div>

          {/* ====================================================
              IMAGE
          ==================================================== */}

          <div
            className="
              relative
              min-h-[250px]
              overflow-hidden
              rounded-[15px]
              bg-[#17342d]
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
              </>
            ) : (
              <div
                className="
                  absolute
                  inset-0
                  bg-gradient-to-br
                  from-[#17342d]
                  to-[#0b221b]
                "
              />
            )}

            <div className="absolute bottom-0 left-0 right-0 p-5">
              <p
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-[#D4AF37]
                "
              >
                LIFESTYLE
              </p>

              <h3
                className="
                  mt-2
                  font-playfair
                  text-[20px]
                  leading-[1.25]
                  text-white
                "
              >
                Everything you
                <br />
                need, closer home.
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}