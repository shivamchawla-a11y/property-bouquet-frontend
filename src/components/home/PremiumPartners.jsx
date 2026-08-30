"use client";

import { motion, useAnimation } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

// ============================================================
// DEVELOPER URL HELPER
// ============================================================

function getDeveloperProjectUrl(slug) {
  if (!slug) {
    return "/developers";
  }

  const cleanSlug = String(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "/developers";
  }

  // Already complete public SEO slug
  //
  // Example:
  // signature-global-developer-projects
  //
  if (cleanSlug.endsWith("-developer-projects")) {
    return `/developers/${cleanSlug}`;
  }

  // Backend slug already contains "-developer"
  //
  // Example:
  // signature-global-developer
  //
  // becomes:
  // signature-global-developer-projects
  if (cleanSlug.includes("-developer")) {
    return `/developers/${cleanSlug}-projects`;
  }

  // Normal backend slug
  //
  // Example:
  // m3m
  //
  // becomes:
  // m3m-developer-projects
  return `/developers/${cleanSlug}-developer-projects`;
}

// ============================================================
// SHUFFLE HELPER
// ============================================================
//
// Creates a new shuffled array.
//
// IMPORTANT:
// - Does NOT modify original array.
// - Called only once after developers are fetched.
// - Does NOT continuously reshuffle during animation.
// ============================================================

function shuffleArray(array) {
  const shuffled = [...array];

  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [shuffled[i], shuffled[j]] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}

// ============================================================
// DEVELOPER NAME / SLUG HELPERS
// ============================================================

function getDeveloperIdentity(developer) {
  const slug = String(developer?.slug || "")
    .trim()
    .toLowerCase();

  const name = String(developer?.name || "")
    .trim()
    .toLowerCase();

  return {
    slug,
    name,
  };
}

// ============================================================
// SIGNATURE GLOBAL DETECTOR
// ============================================================

function isSignatureGlobal(developer) {
  const { slug, name } = getDeveloperIdentity(developer);

  return (
    slug.includes("signature-global") ||
    name.includes("signature global")
  );
}

// ============================================================
// BREEZ DETECTOR
// ============================================================

function isBreez(developer) {
  const { slug, name } = getDeveloperIdentity(developer);

  return (
    slug === "breez" ||
    slug.includes("breez-developer") ||
    slug.includes("breez-builders") ||
    slug.includes("breez-builders-developers") ||
    name === "breez" ||
    name.includes("breez builders") ||
    name.includes("breez builders & developers")
  );
}

// ============================================================
// SPECIAL DARK LOGO DETECTOR
// ============================================================
//
// ONLY these known logos receive the dark presentation:
//
// 1. Signature Global
// 2. Breez
//
// Other developer logos are NOT changed.
// ============================================================

function needsDarkLogoPresentation(developer) {
  return (
    isSignatureGlobal(developer) ||
    isBreez(developer)
  );
}

// ============================================================
// LOGO WRAPPER
// ============================================================
//
// NORMAL LOGOS:
// - Original white card.
// - Original logo.
// - No dark backing.
//
// SIGNATURE GLOBAL:
// - Dark green backing.
// - Clean white wordmark.
//
// BREEZ:
// - Dark green backing.
// - Original Breez logo remains visible.
// - White text becomes visible against dark backing.
//
// OTHER WHITE LOGOS:
// - Existing optional MongoDB flags are still supported.
//
// ============================================================

function DeveloperLogo({ developer }) {
  const [imageError, setImageError] = useState(false);
  const [isWhiteLogo, setIsWhiteLogo] = useState(false);

  const logo = developer?.logo || "/placeholder.png";

  const signatureGlobal = isSignatureGlobal(developer);
  const breez = isBreez(developer);

  // ==========================================================
  // OPTIONAL WHITE LOGO FLAGS
  // ==========================================================
  //
  // These can still be used later if needed:
  //
  // isWhiteLogo: true
  // logoIsWhite: true
  // logoVariant: "white"
  //
  // ==========================================================

  const explicitlyWhite =
    developer?.isWhiteLogo === true ||
    developer?.logoIsWhite === true ||
    String(developer?.logoVariant || "").toLowerCase() ===
      "white";

  // ==========================================================
  // DETECT WHITE / LIGHT LOGO
  // ==========================================================
  //
  // We DON'T need canvas detection for Signature Global
  // or Breez because they are handled explicitly.
  //
  // ==========================================================

  const detectLightLogo = (event) => {
    // Signature Global and Breez are handled explicitly.
    if (signatureGlobal || breez) {
      setIsWhiteLogo(false);
      return;
    }

    // Database explicitly marks logo as white.
    if (explicitlyWhite) {
      setIsWhiteLogo(true);
      return;
    }

    try {
      const img = event.currentTarget;

      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }

      const canvas = document.createElement("canvas");

      const sampleWidth = Math.min(
        120,
        img.naturalWidth
      );

      const sampleHeight = Math.min(
        120,
        img.naturalHeight
      );

      canvas.width = sampleWidth;
      canvas.height = sampleHeight;

      const ctx = canvas.getContext("2d", {
        willReadFrequently: true,
      });

      if (!ctx) {
        return;
      }

      ctx.drawImage(
        img,
        0,
        0,
        sampleWidth,
        sampleHeight
      );

      const imageData = ctx.getImageData(
        0,
        0,
        sampleWidth,
        sampleHeight
      );

      const pixels = imageData.data;

      let visiblePixels = 0;
      let lightPixels = 0;

      // ========================================================
      // CHECK ONLY NON-TRANSPARENT PIXELS
      // ========================================================

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Ignore transparent pixels.
        if (a < 40) {
          continue;
        }

        visiblePixels++;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);

        const brightness = (r + g + b) / 3;
        const saturation = max - min;

        // Predominantly white/light neutral pixels.
        if (
          brightness >= 205 &&
          saturation <= 45
        ) {
          lightPixels++;
        }
      }

      if (visiblePixels === 0) {
        setIsWhiteLogo(false);
        return;
      }

      const lightRatio =
        lightPixels / visiblePixels;

      setIsWhiteLogo(
        lightRatio >= 0.55
      );
    } catch (error) {
      // Canvas may fail for remote images.
      //
      // In that case, leave the normal logo unchanged.
      console.warn(
        "Could not analyze developer logo:",
        error
      );

      setIsWhiteLogo(false);
    }
  };

  // ==========================================================
  // SPECIAL DARK PRESENTATION
  // ==========================================================
  //
  // Signature Global:
  // Clean white wordmark.
  //
  // Breez:
  // Original logo on dark green backing.
  //
  // ==========================================================

  if (signatureGlobal || breez) {
    return (
      <div
        className="
          relative
          flex
          h-full
          w-full
          items-center
          justify-center
          p-2
        "
      >
        {/* ==================================================
            DARK PREMIUM BACKING
        ================================================== */}

        <div
          className="
            pointer-events-none
            absolute
            h-[82px]
            w-[170px]
            rounded-[18px]
            bg-[#12352d]
            shadow-[0_8px_25px_rgba(18,53,45,0.18)]
          "
        />

        {/* ==================================================
            LOGO CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-10
            flex
            h-[82px]
            w-[170px]
            items-center
            justify-center
            rounded-[18px]
            px-4
          "
        >
          {/* ==================================================
              SIGNATURE GLOBAL
          ================================================== */}

          {signatureGlobal && (
            <div
              className="
                flex
                flex-col
                items-center
                justify-center
              "
            >
              <span
                className="
                  whitespace-nowrap
                  text-[17px]
                  font-bold
                  uppercase
                  leading-none
                  tracking-[1.5px]
                  text-white
                "
              >
                SIGNATURE
              </span>

              <span
                className="
                  mt-[5px]
                  whitespace-nowrap
                  text-[15px]
                  font-semibold
                  uppercase
                  leading-none
                  tracking-[2px]
                  text-white/95
                "
              >
                GLOBAL
              </span>

              <span
                className="
                  mt-[5px]
                  whitespace-nowrap
                  text-[6px]
                  font-medium
                  uppercase
                  leading-none
                  tracking-[1.4px]
                  text-white/55
                "
              >
                REALTY • RELIABILITY • RESPONSIBILITY
              </span>
            </div>
          )}

          {/* ==================================================
              BREEZ
          ================================================== */}

          {breez && !imageError && (
            <img
              src={logo}
              alt={
                developer?.name ||
                "Breez"
              }
              onError={() => {
                setImageError(true);
              }}
              className="
                relative
                z-10
                max-h-[68px]
                max-w-[96%]
                object-contain
                transition-all
                duration-500
                group-hover:scale-105
              "
            />
          )}

          {/* ==================================================
              BREEZ FALLBACK
          ================================================== */}

          {breez && imageError && (
            <div
              className="
                relative
                z-10
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <span
                className="
                  text-[20px]
                  font-semibold
                  uppercase
                  tracking-[3px]
                  text-white
                "
              >
                BREEZ
              </span>

              <span
                className="
                  mt-1
                  text-[6px]
                  font-medium
                  uppercase
                  tracking-[1.5px]
                  text-white/65
                "
              >
                BUILDERS & DEVELOPERS
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ==========================================================
  // NORMAL / WHITE LOGO RENDER
  // ==========================================================

  const shouldShowWhiteBacking =
    explicitlyWhite || isWhiteLogo;

  return (
    <div
      className="
        relative
        flex
        h-full
        w-full
        items-center
        justify-center
        p-2
      "
    >
      {/* ======================================================
          WHITE LOGO BACKING

          ONLY shown when the logo is actually white/light.

          Normal colored logos receive NO backing.
      ====================================================== */}

      <div
        className={`
          pointer-events-none
          absolute
          h-[82px]
          w-[170px]
          rounded-[18px]
          bg-[#12352d]
          shadow-[0_8px_25px_rgba(18,53,45,0.18)]
          transition-opacity
          duration-300
          ${
            shouldShowWhiteBacking
              ? "opacity-100"
              : "opacity-0"
          }
        `}
      />

      {/* ======================================================
          MAIN LOGO AREA
      ====================================================== */}

      <div
        className="
          relative
          z-10
          flex
          h-[82px]
          w-[170px]
          items-center
          justify-center
          rounded-[18px]
          p-3
        "
      >
        {!imageError && (
          <img
            src={logo}
            alt={
              developer?.name ||
              "Developer"
            }
            crossOrigin="anonymous"
            onLoad={detectLightLogo}
            onError={(e) => {
              setImageError(true);

              const fallback =
                `${window.location.origin}/placeholder.png`;

              if (
                e.currentTarget.src !==
                fallback
              ) {
                e.currentTarget.src =
                  "/placeholder.png";
              }
            }}
            className="
              relative
              z-10
              max-h-[68px]
              max-w-[92%]
              object-contain
              transition-all
              duration-500
              group-hover:scale-105
            "
          />
        )}

        {/* ====================================================
            FALLBACK
        ==================================================== */}

        {imageError && (
          <span
            className="
              relative
              z-10
              px-3
              text-center
              font-serif
              text-[13px]
              font-medium
              leading-tight
              text-[#161616]
            "
          >
            {developer?.name ||
              "Developer"}
          </span>
        )}
      </div>
    </div>
  );
}

// ============================================================
// PREMIUM PARTNERS
// ============================================================

export default function PremiumPartners() {
  const [developers, setDevelopers] = useState([]);

  // ==========================================================
  // SEPARATE SHUFFLED ROWS
  // ==========================================================
  //
  // Both rows contain the same developers.
  //
  // But they are shuffled independently so they don't look
  // identical.
  //
  // ==========================================================

  const [topDevelopers, setTopDevelopers] =
    useState([]);

  const [bottomDevelopers, setBottomDevelopers] =
    useState([]);

  const topControls = useAnimation();

  const bottomControls = useAnimation();

  // ==========================================================
  // FETCH DEVELOPERS
  // ==========================================================

  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const res = await fetch(
          "/api/developers"
        );

        const data = await res.json();

        console.log(
          "Developers API Response:",
          data
        );

        if (
          data.success &&
          Array.isArray(data.data)
        ) {
          const fetchedDevelopers =
            data.data;

          setDevelopers(
            fetchedDevelopers
          );

          // ==================================================
          // SHUFFLE TOP ROW
          // ==================================================

          const shuffledTop =
            shuffleArray(
              fetchedDevelopers
            );

          // ==================================================
          // SHUFFLE BOTTOM ROW
          // ==================================================

          let shuffledBottom =
            shuffleArray(
              fetchedDevelopers
            );

          // ==================================================
          // MAKE SURE FIRST ITEMS DIFFER
          // ==================================================

          if (
            shuffledBottom.length > 1 &&
            shuffledTop.length > 0 &&
            shuffledBottom[0]?._id ===
              shuffledTop[0]?._id
          ) {
            [
              shuffledBottom[0],
              shuffledBottom[1],
            ] = [
              shuffledBottom[1],
              shuffledBottom[0],
            ];
          }

          setTopDevelopers(
            shuffledTop
          );

          setBottomDevelopers(
            shuffledBottom
          );
        } else {
          setDevelopers([]);
          setTopDevelopers([]);
          setBottomDevelopers([]);
        }
      } catch (err) {
        console.error(
          "Error fetching developers:",
          err
        );

        setDevelopers([]);
        setTopDevelopers([]);
        setBottomDevelopers([]);
      }
    };

    fetchDevelopers();
  }, []);

  // ==========================================================
  // MARQUEE ANIMATION
  // ==========================================================
  //
  // IMPORTANT:
  //
  // THIS HAS NOT BEEN CHANGED.
  //
  // Same:
  // - top direction
  // - bottom direction
  // - 80 second duration
  // - infinite loop
  // - linear easing
  // - -50% loop
  //
  // ==========================================================

  useEffect(() => {
    if (!topDevelopers.length) {
      return;
    }

    topControls.start({
      x: ["0%", "-50%"],

      transition: {
        duration: 80,
        repeat: Infinity,
        ease: "linear",
      },
    });

    bottomControls.start({
      x: ["-50%", "0%"],

      transition: {
        duration: 80,
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [
    topDevelopers,
    bottomDevelopers,
    topControls,
    bottomControls,
  ]);

  // ==========================================================
  // NO DEVELOPERS
  // ==========================================================

  if (!developers.length) {
    return null;
  }

  // ==========================================================
  // DEVELOPER CARD
  // ==========================================================

  const DeveloperCard = ({
    developer,
    index,
    row,
  }) => {
    const developerUrl =
      getDeveloperProjectUrl(
        developer?.slug
      );

    return (
      <Link
        key={`${row}-${developer?._id}-${index}`}
        href={developerUrl}
      >
        <div
          className="
            group
            relative
            h-[120px]
            w-[240px]
            cursor-pointer
            overflow-hidden
            rounded-[24px]
            border
            border-black/10
            bg-white
            shadow-[0_4px_25px_rgba(0,0,0,0.04)]
            transition-all
            duration-500
            hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]
          "
        >
          {/* ==================================================
              PREMIUM LIGHT EFFECT
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-br
              from-[#c89d58]/5
              via-transparent
              to-transparent
              opacity-0
              transition
              duration-500
              group-hover:opacity-100
            "
          />

          {/* ==================================================
              SUBTLE GOLD GLOW
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-10
              rounded-full
              bg-[#c89d58]/[0.04]
              blur-3xl
              opacity-0
              transition-opacity
              duration-500
              group-hover:opacity-100
            "
          />

          {/* ==================================================
              SHINE
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              top-0
              -left-[120%]
              z-20
              h-full
              w-[70%]
              rotate-12
              bg-gradient-to-r
              from-transparent
              via-white/60
              to-transparent
              transition-all
              duration-1000
              group-hover:left-[140%]
            "
          />

          {/* ==================================================
              LOGO
          ================================================== */}

          <DeveloperLogo
            developer={developer}
          />

          {/* ==================================================
              INNER BORDER
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              rounded-[24px]
              border
              border-white/50
            "
          />

          {/* ==================================================
              BOTTOM GOLD LINE ON HOVER
          ================================================== */}

          <div
            className="
              pointer-events-none
              absolute
              bottom-0
              left-1/2
              h-[1px]
              w-0
              -translate-x-1/2
              bg-[#c89d58]
              transition-all
              duration-500
              group-hover:w-[45%]
            "
          />
        </div>
      </Link>
    );
  };

  // ==========================================================
  // DUPLICATED ARRAYS
  // ==========================================================
  //
  // IMPORTANT:
  //
  // Each shuffled row is duplicated exactly once.
  //
  // This is required for the seamless -50% marquee.
  //
  // ==========================================================

  const topMarquee = [
    ...topDevelopers,
    ...topDevelopers,
  ];

  const bottomMarquee = [
    ...bottomDevelopers,
    ...bottomDevelopers,
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      className="
        overflow-hidden
        bg-[#faf8f5]
        py-24
      "
    >
      <div
        className="
          mx-auto
          max-w-[1600px]
          px-5
        "
      >
        {/* ==================================================
            TOP BORDER
        ================================================== */}

        <div
          className="
            border-t
            border-black/10
            pt-14
          "
        >
          <div
            className="
              grid
              items-center
              gap-14
              lg:grid-cols-[260px_1fr]
            "
          >
            {/* ==================================================
                LEFT CONTENT
            ================================================== */}

            <div>
              <p
                className="
                  mb-3
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[2.5px]
                  text-black/45
                "
              >
                Platinum Partners
              </p>

              <h3
                className="
                  text-[34px]
                  leading-[1.2]
                  text-[#161616]
                "
              >
                Trusted By
                <br />
                Industry Leaders.
              </h3>
            </div>

            {/* ==================================================
                RIGHT MARQUEE
            ================================================== */}

            <div
              className="
                overflow-hidden
              "
            >
              {/* ==================================================
                  TOP ROW
              ================================================== */}

              <motion.div
                animate={topControls}
                className="
                  mb-5
                  flex
                  w-max
                  gap-5
                "
              >
                {topMarquee.map(
                  (
                    developer,
                    index
                  ) => (
                    <DeveloperCard
                      key={`top-${developer?._id}-${index}`}
                      developer={
                        developer
                      }
                      index={index}
                      row="top"
                    />
                  )
                )}
              </motion.div>

              {/* ==================================================
                  BOTTOM ROW
              ================================================== */}

              <motion.div
                animate={bottomControls}
                className="
                  flex
                  w-max
                  gap-5
                "
              >
                {bottomMarquee.map(
                  (
                    developer,
                    index
                  ) => (
                    <DeveloperCard
                      key={`bottom-${developer?._id}-${index}`}
                      developer={
                        developer
                      }
                      index={index}
                      row="bottom"
                    />
                  )
                )}
              </motion.div>
            </div>
          </div>
        </div>

        {/* ==================================================
            VIEW ALL DEVELOPERS
        ================================================== */}

        <div
          className="
            mt-14
            flex
            justify-center
          "
        >
          <Link href="/developers">
            <button
              className="
                group
                relative
                overflow-hidden
                rounded-full
                border
                border-[#c89d58]
                bg-gradient-to-r
                from-[#c89d58]
                to-[#d8b46b]
                px-8
                py-4
                text-[13px]
                font-semibold
                uppercase
                tracking-[2px]
                text-white
                shadow-[0_10px_35px_rgba(200,157,88,0.28)]
                transition-all
                duration-500
                hover:-translate-y-1
                hover:shadow-[0_18px_45px_rgba(200,157,88,0.4)]
              "
            >
              <span
                className="
                  relative
                  z-10
                  flex
                  items-center
                  gap-3
                "
              >
                View All Developers

                <svg
                  className="
                    h-4
                    w-4
                    transition-transform
                    duration-300
                    group-hover:translate-x-1
                  "
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 12h14M13 5l7 7-7 7"
                  />
                </svg>
              </span>

              {/* ==================================================
                  SHINE EFFECT
              ================================================== */}

              <span
                className="
                  absolute
                  top-0
                  -left-[120%]
                  h-full
                  w-[60%]
                  rotate-12
                  bg-gradient-to-r
                  from-transparent
                  via-white/40
                  to-transparent
                  transition-all
                  duration-1000
                  group-hover:left-[140%]
                "
              />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
}