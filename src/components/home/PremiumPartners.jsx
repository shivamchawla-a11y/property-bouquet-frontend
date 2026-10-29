"use client";

import {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion, useAnimation } from "framer-motion";
import Link from "next/link";

// ============================================================
// CONFIGURATION
// ============================================================

const DEVELOPERS_API = "/api/developers";
const MARQUEE_DURATION = 80;
const LOGO_FALLBACK = "/placeholder.jpg";

// ============================================================
// DEVELOPER URL HELPER
// ============================================================

function getDeveloperProjectUrl(slug) {
  if (!slug) return "/developers";

  const cleanSlug = String(slug)
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) return "/developers";

  if (cleanSlug.endsWith("-developer-projects")) {
    return `/developers/${cleanSlug}`;
  }

  if (cleanSlug.includes("-developer")) {
    return `/developers/${cleanSlug}-projects`;
  }

  return `/developers/${cleanSlug}-developer-projects`;
}

// ============================================================
// SHUFFLE HELPER
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
// DEVELOPER IDENTITY
// ============================================================

function getDeveloperIdentity(developer) {
  return {
    slug: String(developer?.slug || "")
      .trim()
      .toLowerCase(),

    name: String(developer?.name || "")
      .trim()
      .toLowerCase(),
  };
}

function isSignatureGlobal(developer) {
  const { slug, name } = getDeveloperIdentity(developer);

  return (
    slug.includes("signature-global") ||
    name.includes("signature global")
  );
}

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

function needsDarkLogoPresentation(developer) {
  return (
    isSignatureGlobal(developer) ||
    isBreez(developer)
  );
}

// ============================================================
// LOGO COMPONENT
// ============================================================

const DeveloperLogo = memo(function DeveloperLogo({
  developer,
}) {
  const [imageError, setImageError] = useState(false);
  const [isWhiteLogo, setIsWhiteLogo] = useState(false);

  const logo = developer?.logo || LOGO_FALLBACK;
  const signatureGlobal = isSignatureGlobal(developer);
  const breez = isBreez(developer);

  const explicitlyWhite =
    developer?.isWhiteLogo === true ||
    developer?.logoIsWhite === true ||
    String(developer?.logoVariant || "").toLowerCase() ===
      "white";

  const specialDarkLogo = needsDarkLogoPresentation(developer);

  // Only analyze normal logos when no explicit flag exists.
  // A smaller sample reduces the cost of canvas pixel analysis.
  const detectLightLogo = useCallback(
    (event) => {
      if (specialDarkLogo) {
        setIsWhiteLogo(false);
        return;
      }

      if (explicitlyWhite) {
        setIsWhiteLogo(true);
        return;
      }

      const img = event.currentTarget;

      if (!img.naturalWidth || !img.naturalHeight) {
        return;
      }

      try {
        const sampleSize = 40;
        const canvas = document.createElement("canvas");

        canvas.width = sampleSize;
        canvas.height = sampleSize;

        const ctx = canvas.getContext("2d", {
          willReadFrequently: true,
        });

        if (!ctx) return;

        ctx.clearRect(0, 0, sampleSize, sampleSize);
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const pixels = ctx.getImageData(
          0,
          0,
          sampleSize,
          sampleSize
        ).data;

        let visiblePixels = 0;
        let lightPixels = 0;

        for (let i = 0; i < pixels.length; i += 4) {
          const r = pixels[i];
          const g = pixels[i + 1];
          const b = pixels[i + 2];
          const a = pixels[i + 3];

          if (a < 40) continue;

          visiblePixels++;

          const brightness = (r + g + b) / 3;
          const saturation =
            Math.max(r, g, b) - Math.min(r, g, b);

          if (
            brightness >= 205 &&
            saturation <= 45
          ) {
            lightPixels++;
          }
        }

        const lightRatio = visiblePixels
          ? lightPixels / visiblePixels
          : 0;

        setIsWhiteLogo(lightRatio >= 0.55);
      } catch {
        // Remote images may block canvas access.
        // Preserve the regular logo presentation on failure.
        setIsWhiteLogo(false);
      }
    },
    [explicitlyWhite, specialDarkLogo]
  );

  const handleImageError = useCallback(() => {
    setImageError(true);
  }, []);

  const shouldShowWhiteBacking =
    explicitlyWhite || isWhiteLogo;

  // ----------------------------------------------------------
  // SPECIAL LOGOS: SIGNATURE GLOBAL AND BREEZ
  // ----------------------------------------------------------

  if (signatureGlobal || breez) {
    return (
      <div className="relative flex h-full w-full items-center justify-center p-2">
        <div className="pointer-events-none absolute h-[82px] w-[170px] rounded-[18px] bg-[#12352d] shadow-[0_8px_25px_rgba(18,53,45,0.18)]" />

        <div className="relative z-10 flex h-[82px] w-[170px] items-center justify-center rounded-[18px] px-4">
          {signatureGlobal && (
            <div className="flex flex-col items-center justify-center">
              <span className="whitespace-nowrap text-[17px] font-bold uppercase leading-none tracking-[1.5px] text-white">
                SIGNATURE
              </span>

              <span className="mt-[5px] whitespace-nowrap text-[15px] font-semibold uppercase leading-none tracking-[2px] text-white/95">
                GLOBAL
              </span>

              <span className="mt-[5px] whitespace-nowrap text-[6px] font-medium uppercase leading-none tracking-[1.4px] text-white/55">
                REALTY • RELIABILITY • RESPONSIBILITY
              </span>
            </div>
          )}

          {breez && !imageError && (
            <img
              src={logo}
              alt={developer?.name || "Breez"}
              loading="lazy"
              decoding="async"
              onError={handleImageError}
              className="relative z-10 max-h-[68px] max-w-[96%] object-contain transition-transform duration-500 group-hover:scale-105"
            />
          )}

          {breez && imageError && (
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <span className="text-[20px] font-semibold uppercase tracking-[3px] text-white">
                BREEZ
              </span>

              <span className="mt-1 text-[6px] font-medium uppercase tracking-[1.5px] text-white/65">
                BUILDERS & DEVELOPERS
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ----------------------------------------------------------
  // NORMAL LOGOS
  // ----------------------------------------------------------

  return (
    <div className="relative flex h-full w-full items-center justify-center p-2">
      <div
        className={`pointer-events-none absolute h-[82px] w-[170px] rounded-[18px] bg-[#12352d] shadow-[0_8px_25px_rgba(18,53,45,0.18)] transition-opacity duration-300 ${
          shouldShowWhiteBacking
            ? "opacity-100"
            : "opacity-0"
        }`}
      />

      <div className="relative z-10 flex h-[82px] w-[170px] items-center justify-center rounded-[18px] p-3">
        {!imageError && (
          <img
            src={logo}
            alt={developer?.name || "Developer"}
            loading="lazy"
            decoding="async"
            crossOrigin="anonymous"
            onLoad={detectLightLogo}
            onError={handleImageError}
            className="relative z-10 max-h-[68px] max-w-[92%] object-contain transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {imageError && (
          <span className="relative z-10 px-3 text-center font-serif text-[13px] font-medium leading-tight text-[#161616]">
            {developer?.name || "Developer"}
          </span>
        )}
      </div>
    </div>
  );
});

// ============================================================
// DEVELOPER CARD
// Defined outside PremiumPartners to avoid recreating the
// component type whenever the parent renders.
// ============================================================

const DeveloperCard = memo(function DeveloperCard({
  developer,
}) {
  const developerUrl = getDeveloperProjectUrl(
    developer?.slug
  );

  return (
    <Link
      href={developerUrl}
      prefetch={false}
      className="block shrink-0"
      aria-label={`View ${developer?.name || "developer"} projects`}
    >
      <div className="group relative h-[120px] w-[240px] cursor-pointer overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-[0_4px_25px_rgba(0,0,0,0.04)] transition-shadow duration-500 hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#c89d58]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute -inset-10 rounded-full bg-[#c89d58]/[0.04] opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute -left-[120%] top-0 z-20 h-full w-[70%] rotate-12 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-[left] duration-1000 group-hover:left-[140%]" />

        <DeveloperLogo developer={developer} />

        <div className="pointer-events-none absolute inset-0 rounded-[24px] border border-white/50" />

        <div className="pointer-events-none absolute bottom-0 left-1/2 h-[1px] w-0 -translate-x-1/2 bg-[#c89d58] transition-[width] duration-500 group-hover:w-[45%]" />
      </div>
    </Link>
  );
});

// ============================================================
// VIEW ALL BUTTON
// ============================================================

function ViewAllDevelopersButton() {
  return (
    <div className="mt-14 flex justify-center">
      <Link
        href="/developers"
        prefetch={false}
        className="group relative inline-flex overflow-hidden rounded-full border border-[#c89d58] bg-gradient-to-r from-[#c89d58] to-[#d8b46b] px-8 py-4 text-[13px] font-semibold uppercase tracking-[2px] text-white shadow-[0_10px_35px_rgba(200,157,88,0.28)] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(200,157,88,0.4)]"
      >
        <span className="relative z-10 flex items-center gap-3">
          View All Developers

          <svg
            className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 12h14M13 5l7 7-7 7"
            />
          </svg>
        </span>

        <span className="pointer-events-none absolute -left-[120%] top-0 h-full w-[60%] rotate-12 bg-gradient-to-r from-transparent via-white/40 to-transparent transition-[left] duration-1000 group-hover:left-[140%]" />
      </Link>
    </div>
  );
}

// ============================================================
// PREMIUM PARTNERS
// ============================================================

export default function PremiumPartners() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [topDevelopers, setTopDevelopers] = useState([]);
  const [bottomDevelopers, setBottomDevelopers] = useState([]);

  const topControls = useAnimation();
  const bottomControls = useAnimation();

  // ----------------------------------------------------------
  // FETCH DEVELOPERS
  // ----------------------------------------------------------

  useEffect(() => {
    const controller = new AbortController();

    async function fetchDevelopers() {
      try {
        const response = await fetch(DEVELOPERS_API, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(
            `Developers request failed: ${response.status}`
          );
        }

        const result = await response.json();

        const records =
          result?.success && Array.isArray(result?.data)
            ? result.data
            : [];

        if (controller.signal.aborted) return;

        if (!records.length) {
          setDevelopers([]);
          setTopDevelopers([]);
          setBottomDevelopers([]);
          return;
        }

        // Shuffle each row independently, once per successful fetch.
        const top = shuffleArray(records);
        const bottom = shuffleArray(records);

        // Avoid the same first developer in both rows.
        if (
          bottom.length > 1 &&
          top.length > 0 &&
          bottom[0]?._id === top[0]?._id
        ) {
          [bottom[0], bottom[1]] = [
            bottom[1],
            bottom[0],
          ];
        }

        setDevelopers(records);
        setTopDevelopers(top);
        setBottomDevelopers(bottom);
      } catch (error) {
        if (
          error?.name !== "AbortError" &&
          !controller.signal.aborted
        ) {
          console.error(
            "Unable to load developers:",
            error
          );

          setDevelopers([]);
          setTopDevelopers([]);
          setBottomDevelopers([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchDevelopers();

    return () => {
      controller.abort();
    };
  }, []);

  // ----------------------------------------------------------
  // MEMOIZED MARQUEE ARRAYS
  // Duplicate each row exactly once for seamless -50% looping.
  // ----------------------------------------------------------

  const topMarquee = useMemo(
    () => [...topDevelopers, ...topDevelopers],
    [topDevelopers]
  );

  const bottomMarquee = useMemo(
    () => [...bottomDevelopers, ...bottomDevelopers],
    [bottomDevelopers]
  );

  // ----------------------------------------------------------
  // MARQUEE ANIMATION
  // Preserves directions, duration, easing, and infinite loop.
  // ----------------------------------------------------------

  useEffect(() => {
    if (!topDevelopers.length || !bottomDevelopers.length) {
      topControls.stop();
      bottomControls.stop();
      return;
    }

    topControls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: MARQUEE_DURATION,
        repeat: Infinity,
        ease: "linear",
      },
    });

    bottomControls.start({
      x: ["-50%", "0%"],
      transition: {
        duration: MARQUEE_DURATION,
        repeat: Infinity,
        ease: "linear",
      },
    });

    return () => {
      topControls.stop();
      bottomControls.stop();
    };
  }, [
    topDevelopers,
    bottomDevelopers,
    topControls,
    bottomControls,
  ]);

  // Preserve the original behavior: don't display the section
  // when no developer records are available.
  if (!loading && !developers.length) {
    return null;
  }

  // Avoid rendering an empty marquee while the request is pending.
  if (loading) {
    return (
      <section
        className="overflow-hidden bg-[#faf8f5] py-24"
        aria-label="Premium developer partners"
      >
        <div className="mx-auto max-w-[1600px] px-5">
          <div className="border-t border-black/10 pt-14">
            <div className="grid items-center gap-14 lg:grid-cols-[260px_1fr]">
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[2.5px] text-black/45">
                  Platinum Partners
                </p>

                <h3 className="text-[34px] leading-[1.2] text-[#161616]">
                  Trusted By
                  <br />
                  Industry Leaders.
                </h3>
              </div>

              <div className="overflow-hidden">
                <div className="mb-5 flex w-max gap-5">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={`top-skeleton-${index}`}
                      className="h-[120px] w-[240px] shrink-0 animate-pulse rounded-[24px] border border-black/5 bg-white"
                    />
                  ))}
                </div>

                <div className="flex w-max gap-5">
                  {Array.from({ length: 4 }, (_, index) => (
                    <div
                      key={`bottom-skeleton-${index}`}
                      className="h-[120px] w-[240px] shrink-0 animate-pulse rounded-[24px] border border-black/5 bg-white"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // ----------------------------------------------------------
  // RENDER
  // ----------------------------------------------------------

  return (
    <section
      className="overflow-hidden bg-[#faf8f5] py-24"
      aria-label="Premium developer partners"
    >
      <div className="mx-auto max-w-[1600px] px-5">
        <div className="border-t border-black/10 pt-14">
          <div className="grid items-center gap-14 lg:grid-cols-[260px_1fr]">
            {/* LEFT CONTENT */}

            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[2.5px] text-black/45">
                Platinum Partners
              </p>

              <h3 className="text-[34px] leading-[1.2] text-[#161616]">
                Trusted By
                <br />
                Industry Leaders.
              </h3>
            </div>

            {/* RIGHT MARQUEE */}

            <div className="overflow-hidden">
              {/* TOP ROW */}

              <motion.div
                animate={topControls}
                className="mb-5 flex w-max gap-5"
                style={{ willChange: "transform" }}
              >
                {topMarquee.map((developer, index) => (
                  <DeveloperCard
                    key={`top-${developer?._id || developer?.slug || "developer"}-${index}`}
                    developer={developer}
                  />
                ))}
              </motion.div>

              {/* BOTTOM ROW */}

              <motion.div
                animate={bottomControls}
                className="flex w-max gap-5"
                style={{ willChange: "transform" }}
              >
                {bottomMarquee.map((developer, index) => (
                  <DeveloperCard
                    key={`bottom-${developer?._id || developer?.slug || "developer"}-${index}`}
                    developer={developer}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </div>

        <ViewAllDevelopersButton />
      </div>
    </section>
  );
}