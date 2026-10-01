"use client";

import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";

import {
  ArrowRight,
  Building2,
  Home,
  MapPin,
  ShieldCheck,
  Target,
  Landmark,
  Trees,
} from "lucide-react";

import { motion } from "framer-motion";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

/* ============================================================
   PROPERTY BOUQUET — DESKTOP HERO

   HERO PROJECT CAROUSEL
   ------------------------------------------------------------
   Automatic circular movement:

       TOP
        ↓
      CENTER
        ↓
      BOTTOM
        ↓
       TOP

   Therefore on every rotation:

     TOP PROJECT    → CENTER
     CENTER PROJECT → BOTTOM
     BOTTOM PROJECT → TOP

   No arrows.
   No manual carousel controls.
   Real Featured properties.
============================================================ */


/* ============================================================
   SEARCH PANEL
   ------------------------------------------------------------
   Loaded separately so SearchPanel does not block the initial
   hero render.
============================================================ */

const SearchPanel = dynamic(
  () => import("./SearchPanel"),
  {
    ssr: false,
    loading: () => (
      <div
        className="
          h-[72px]
          w-full
          animate-pulse
          rounded-[18px]
          border
          border-[#e8e2d7]
          bg-white/80
        "
      />
    ),
  }
);


/* ============================================================
   CONSTANTS
============================================================ */

const FEATURED_API =
  "/api/properties?propertyTag=Featured";

/*
 * Time between carousel movements.
 *
 * 4200ms gives the user enough time to see the project while
 * still making the hero feel alive.
 */
const HERO_ROTATION_MS = 4200;

/*
 * The actual movement duration.
 *
 * This is deliberately longer than a normal fade so the user
 * can SEE the project physically move between positions.
 */
const HERO_ANIMATION_MS = 1150;


/*
 * Only keep a small number of featured projects in memory.
 *
 * We don't need 30/50/100 properties in the hero carousel.
 */
const MAX_HERO_PROPERTIES = 8;


const FALLBACK_IMAGES = [
  "/img1.jpg",
  "/img2.jpg",
  "/img3.jpg",
];


/* ============================================================
   RANDOM SHUFFLE
============================================================ */

function shuffleArray(array) {
  const shuffled = [...array];

  for (
    let i = shuffled.length - 1;
    i > 0;
    i -= 1
  ) {
    const j = Math.floor(
      Math.random() * (i + 1)
    );

    [
      shuffled[i],
      shuffled[j],
    ] = [
      shuffled[j],
      shuffled[i],
    ];
  }

  return shuffled;
}


/* ============================================================
   PROPERTY ID
   ------------------------------------------------------------
   Important for Framer Motion.

   The same property must keep the same React key when it moves
   from TOP → CENTER → BOTTOM.

   That is what makes the movement physical rather than making
   the old image disappear and the new image appear.
============================================================ */

function getPropertyKey(property) {
  return (
    property?._id ||
    property?.id ||
    property?.slug ||
    property?.coreDetails?.title ||
    Math.random()
  );
}


/* ============================================================
   PROPERTY IMAGE
============================================================ */

function getPropertyImage(
  property,
  fallbackIndex = 0
) {
  const image =
    property?.media?.heroImageUrl ||
    property?.media?.heroImage ||
    property?.media?.heroImage?.url ||
    property?.heroImageUrl ||
    property?.image ||
    property?.coreDetails?.image;

  if (
    image &&
    typeof image === "string"
  ) {
    return image;
  }

  return (
    FALLBACK_IMAGES[
      Math.abs(fallbackIndex) %
        FALLBACK_IMAGES.length
    ] ||
    FALLBACK_IMAGES[0]
  );
}


/* ============================================================
   PROPERTY TITLE
============================================================ */

function getPropertyTitle(property) {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.name ||
    "Featured Property"
  );
}


/* ============================================================
   PROPERTY LOCATION
============================================================ */

function getPropertyLocation(property) {
  const location =
    property?.locationData?.locationRef;

  if (!location) {
    return (
      property?.locationData?.customLocation ||
      property?.locationData?.locationName ||
      property?.location ||
      "Prime Location"
    );
  }

  const parts = [];

  if (location?.name) {
    parts.push(location.name);
  }

  if (location?.parent?.name) {
    parts.push(
      location.parent.name
    );
  }

  if (
    location?.parent?.parent?.name
  ) {
    parts.push(
      location.parent.parent.name
    );
  }

  return (
    parts.join(", ") ||
    property?.locationData?.locationName ||
    "Prime Location"
  );
}


/* ============================================================
   COMPONENT
============================================================ */

export default function HeroSection() {

  /* ==========================================================
     FEATURED PROPERTIES
  ========================================================== */

  const [
    featuredProperties,
    setFeaturedProperties,
  ] = useState([]);

  const [
    featuredLoading,
    setFeaturedLoading,
  ] = useState(true);

  const [
    activeIndex,
    setActiveIndex,
  ] = useState(0);


  /* ==========================================================
     CATEGORY DATA
  ========================================================== */

  const [
    propertyCategories,
    setPropertyCategories,
  ] = useState([]);

  const [
    categoriesLoading,
    setCategoriesLoading,
  ] = useState(true);


  /* ==========================================================
     ROTATION REF
  ========================================================== */

  const rotationTimeoutRef =
    useRef(null);


  /* ==========================================================
     FETCH FEATURED PROPERTIES
     ----------------------------------------------------------
     Exact Featured API:

       /api/properties?propertyTag=Featured
  ========================================================== */

  useEffect(() => {
    const controller =
      new AbortController();

    let mounted = true;

    async function fetchFeaturedProperties() {
      try {
        setFeaturedLoading(true);

        const response =
          await fetch(
            FEATURED_API,
            {
              /*
               * Keep this request fresh because Featured
               * properties can be changed from admin.
               */
              cache: "no-store",

              signal:
                controller.signal,
            }
          );

        if (!response.ok) {
          throw new Error(
            `Featured properties request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (!mounted) {
          return;
        }

        /*
         * Expected API shape:
         *
         * {
         *   success: true,
         *   data: [...]
         * }
         */
        if (!data?.success) {
          setFeaturedProperties([]);
          return;
        }

        /*
         * Keep only valid public properties.
         */
        const published =
          Array.isArray(data?.data)
            ? data.data.filter(
                (property) =>
                  property?.status ===
                    "published" &&
                  property?.isDeleted ===
                    false &&
                  property?.isActive ===
                    true
              )
            : [];

        /*
         * Randomize once.
         *
         * The carousel itself does NOT randomize every rotation.
         */
        const randomized =
          shuffleArray(published);

        /*
         * Keep the hero lightweight.
         */
        const limited =
          randomized.slice(
            0,
            MAX_HERO_PROPERTIES
          );

        setFeaturedProperties(
          limited
        );

        setActiveIndex(0);
      } catch (error) {
        if (
          error?.name !==
          "AbortError"
        ) {
          console.error(
            "Property Bouquet featured hero fetch failed:",
            error
          );

          if (mounted) {
            setFeaturedProperties([]);
          }
        }
      } finally {
        if (
          mounted &&
          !controller.signal.aborted
        ) {
          setFeaturedLoading(false);
        }
      }
    }

    fetchFeaturedProperties();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, []);


  /* ==========================================================
     FETCH CATEGORIES
     ----------------------------------------------------------
     Delayed so the Featured hero gets the network priority.
  ========================================================== */

  useEffect(() => {
    let cancelled = false;

    let idleId = null;
    let timeoutId = null;

    async function fetchCategories() {
      try {
        setCategoriesLoading(true);

        const response =
          await fetch(
            "/api/properties",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          throw new Error(
            `Categories request failed: ${response.status}`
          );
        }

        const data =
          await response.json();

        if (cancelled) {
          return;
        }

        const propertyData =
          Array.isArray(data)
            ? data
            : Array.isArray(
                  data?.properties
                )
              ? data.properties
              : Array.isArray(
                    data?.data
                  )
                ? data.data
                : [];

        const uniqueCategories = [
          ...new Set(
            propertyData
              .map(
                (property) =>
                  property
                    ?.categoryData
                    ?.categoryName
              )
              .filter(Boolean)
              .map((name) =>
                String(name).trim()
              )
              .filter(Boolean)
          ),
        ];

        const getCategoryScore = (
          name
        ) => {
          const value =
            String(name)
              .toLowerCase();

          if (
            value.includes(
              "apartment"
            ) ||
            value.includes(
              "residential"
            ) ||
            value.includes("flat")
          ) {
            return 100;
          }

          if (
            value.includes("villa")
          ) {
            return 90;
          }

          if (
            value.includes("plot") ||
            value.includes("land")
          ) {
            return 80;
          }

          if (
            value.includes(
              "commercial"
            ) ||
            value.includes("office") ||
            value.includes("retail")
          ) {
            return 70;
          }

          if (
            value.includes(
              "builder"
            ) ||
            value.includes("floor")
          ) {
            return 60;
          }

          if (
            value.includes(
              "penthouse"
            )
          ) {
            return 55;
          }

          if (
            value.includes(
              "investment"
            )
          ) {
            return 50;
          }

          return 10;
        };

        const sortedCategories =
          [...uniqueCategories].sort(
            (a, b) => {
              const difference =
                getCategoryScore(b) -
                getCategoryScore(a);

              if (
                difference !== 0
              ) {
                return difference;
              }

              return a.localeCompare(
                b
              );
            }
          );

        setPropertyCategories(
          sortedCategories.slice(
            0,
            4
          )
        );
      } catch (error) {
        if (!cancelled) {
          console.error(
            "Property Bouquet category fetch failed:",
            error
          );

          setPropertyCategories(
            []
          );
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(
            false
          );
        }
      }
    }


    /*
     * Do not make the category request compete with the hero.
     */
    if (
      typeof window !==
        "undefined" &&
      "requestIdleCallback" in
        window
    ) {
      idleId =
        window.requestIdleCallback(
          fetchCategories,
          {
            timeout: 1400,
          }
        );
    } else {
      timeoutId =
        window.setTimeout(
          fetchCategories,
          350
        );
    }


    return () => {
      cancelled = true;

      if (
        idleId !== null &&
        typeof window !==
          "undefined" &&
        "cancelIdleCallback" in
          window
      ) {
        window.cancelIdleCallback(
          idleId
        );
      }

      if (
        timeoutId !== null
      ) {
        clearTimeout(
          timeoutId
        );
      }
    };
  }, []);


  /* ==========================================================
     AUTOMATIC CIRCULAR ROTATION
     ----------------------------------------------------------

     Current state:

       TOP    = next
       CENTER = active
       BOTTOM = previous


     After +1:

       old TOP    → CENTER
       old CENTER → BOTTOM
       old BOTTOM → TOP


     This is the actual physical circular movement.
  ========================================================== */

  useEffect(() => {
    if (
      featuredProperties.length <
      3
    ) {
      return undefined;
    }

    let cancelled = false;


    const scheduleNextRotation =
      () => {
        if (cancelled) {
          return;
        }

        /*
         * Do not rotate when the user has another tab open.
         * This saves CPU and avoids unnecessary animation work.
         */
        if (
          typeof document !==
            "undefined" &&
          document.visibilityState !==
            "visible"
        ) {
          rotationTimeoutRef.current =
            window.setTimeout(
              scheduleNextRotation,
              HERO_ROTATION_MS
            );

          return;
        }

        setActiveIndex(
  (prev) =>
    (prev - 1 + featuredProperties.length) %
    featuredProperties.length
);
        rotationTimeoutRef.current =
          window.setTimeout(
            scheduleNextRotation,
            HERO_ROTATION_MS
          );
      };


    rotationTimeoutRef.current =
      window.setTimeout(
        scheduleNextRotation,
        HERO_ROTATION_MS
      );


    return () => {
      cancelled = true;

      if (
        rotationTimeoutRef.current
      ) {
        clearTimeout(
          rotationTimeoutRef.current
        );

        rotationTimeoutRef.current =
          null;
      }
    };
  }, [
    featuredProperties.length,
  ]);


  /* ==========================================================
     CATEGORY ICON
  ========================================================== */

  const getCategoryIcon = (
    categoryName
  ) => {
    const value =
      String(
        categoryName || ""
      ).toLowerCase();

    if (
      value.includes("plot") ||
      value.includes("land")
    ) {
      return Trees;
    }

    if (
      value.includes(
        "commercial"
      ) ||
      value.includes("office") ||
      value.includes("retail")
    ) {
      return Landmark;
    }

    if (
      value.includes("villa")
    ) {
      return Home;
    }

    return Building2;
  };


  /* ==========================================================
     CATEGORY CARDS
  ========================================================== */

  const categoryCards =
    useMemo(() => {
      return propertyCategories.map(
        (
          categoryName,
          index
        ) => ({
          title:
            categoryName,

          icon:
            getCategoryIcon(
              categoryName
            ),

          image:
            `/img${index + 4}.webp`,

          position:
            index === 0
              ? "center"
              : index === 1
                ? "65% center"
                : index === 2
                  ? "25% bottom"
                  : "80% center",
        })
      );
    }, [
      propertyCategories,
    ]);


  /* ==========================================================
     CAROUSEL DATA
  ========================================================== */

  const carouselProperties =
    useMemo(() => {
      const count =
        featuredProperties.length;

      if (count < 3) {
        return {
          previous: null,
          active: null,
          next: null,
        };
      }

      const safeActive =
        activeIndex % count;

      const previous =
        featuredProperties[
          (
            safeActive -
            1 +
            count
          ) % count
        ];

      const active =
        featuredProperties[
          safeActive
        ];

      const next =
        featuredProperties[
          (safeActive + 1) %
            count
        ];

      return {
        previous,
        active,
        next,
      };
    }, [
      featuredProperties,
      activeIndex,
    ]);


  /* ==========================================================
     UNIQUE VISIBLE CARDS
     ----------------------------------------------------------
     Stable keys are essential for the physical movement.
  ========================================================== */

  const visibleCarouselCards =
    useMemo(() => {
      const cards = [];

      if (
        carouselProperties.previous
      ) {
        cards.push({
          property:
            carouselProperties.previous,
          role: "previous",
        });
      }

      if (
        carouselProperties.active
      ) {
        cards.push({
          property:
            carouselProperties.active,
          role: "active",
        });
      }

      if (
        carouselProperties.next
      ) {
        cards.push({
          property:
            carouselProperties.next,
          role: "next",
        });
      }

      return cards;
    }, [
      carouselProperties,
    ]);


  const showHeroSkeleton =
    featuredLoading &&
    !featuredProperties.length;


  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <section
      className="
        relative
        z-[100]
        overflow-visible
        bg-[#faf9f4]
        text-[#17342d]
      "
    >

      {/* ======================================================
          BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          -right-[150px]
          -top-[110px]
          hidden
          h-[470px]
          w-[470px]
          rounded-full
          bg-[#eadfc8]/65
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[34%]
          top-[150px]
          hidden
          h-[240px]
          w-[240px]
          rounded-full
          bg-[#e9dfc9]/25
          blur-[60px]
          lg:block
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-[380px]
          hidden
          h-[280px]
          w-[280px]
          rounded-full
          bg-[#e8dfcc]/25
          blur-[70px]
          lg:block
        "
      />


      {/* ======================================================
          DESKTOP HERO CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-[110]
          overflow-visible
          pt-[76px]
          lg:pt-[72px]
          xl:pt-[76px]
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-[1380px]
            overflow-visible
            px-6
            sm:px-7
            lg:px-8
            xl:px-6
          "
        >

          {/* ==================================================
              HERO TOP
          ================================================== */}

          <div
            className="
              relative
              h-[405px]
              overflow-visible
              lg:h-[410px]
              xl:h-[420px]
            "
          >

            {/* =================================================
                LEFT CONTENT
            ================================================= */}

            <div
              className="
                relative
                z-30
                w-[54%]
                max-w-[665px]
                pt-[58px]
                lg:pt-[60px]
                xl:pt-[62px]
              "
            >

              {/* EYEBROW */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.55,
                }}
                className="
                  mb-[14px]
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    whitespace-nowrap
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[3px]
                    text-[#85877e]
                    xl:text-[10px]
                    xl:tracking-[3.2px]
                  "
                >
                  CURATED FOR GENERATIONS OF
                  WEALTH
                </span>

                <span
                  className="
                    h-px
                    w-[100px]
                    shrink-0
                    bg-[#c89d58]
                    xl:w-[108px]
                  "
                />
              </motion.div>


              {/* MAIN HEADING */}

              <motion.h1
                initial={{
                  opacity: 0,
                  y: 22,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.05,
                }}
                className="
                  max-w-[625px]
                  font-serif
                  text-[47px]
                  font-medium
                  leading-[0.98]
                  tracking-[-1.9px]
                  text-[#12392f]

                  lg:text-[48px]

                  xl:text-[54px]
                  xl:tracking-[-2.1px]

                  2xl:text-[57px]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Find Your Perfect
                <br />

                <span className="text-[#bd8e45]">
                  Property in India
                </span>
              </motion.h1>


              {/* DESCRIPTION */}

              <motion.p
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.14,
                }}
                className="
                  mt-[18px]
                  max-w-[525px]
                  text-[13px]
                  leading-[1.65]
                  text-[#66736e]

                  xl:mt-[19px]
                  xl:text-[14px]
                  xl:leading-[1.7]
                "
              >
                Premium residences, luxury
                investments, and exclusive
                opportunities across India&apos;s
                most sought-after locations.
              </motion.p>


              {/* MINI FEATURES */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.65,
                  delay: 0.23,
                }}
                className="
                  mt-[27px]
                  flex
                  items-center
                "
              >
                <MiniFeature
                  icon={Home}
                  title="Premium"
                  subtitle="Properties"
                />

                <MiniFeature
                  icon={Building2}
                  title="Trusted"
                  subtitle="Developers"
                />

                <MiniFeature
                  icon={MapPin}
                  title="Prime"
                  subtitle="Locations"
                />

                <MiniFeature
                  icon={ShieldCheck}
                  title="Expert"
                  subtitle="Guidance"
                  last
                />
              </motion.div>

            </div>


            {/* =================================================
                RIGHT IMAGE COMPOSITION
            ================================================= */}

            <div
              className="
                pointer-events-none
                absolute
                right-[-5px]
                top-[0px]
                z-20
                h-[405px]
                w-[570px]

                lg:right-[-4px]
                lg:w-[580px]

                xl:right-[8px]
                xl:h-[420px]
                xl:w-[610px]
              "
            >

              {/* LARGE CIRCLE */}

              <div
                className="
                  absolute
                  right-[48px]
                  top-[-8px]
                  h-[340px]
                  w-[340px]
                  rounded-full
                  bg-[#eee3cb]

                  xl:right-[55px]
                  xl:h-[355px]
                  xl:w-[355px]
                "
              />


              {/* DECORATIVE GOLD LINE */}

              <div
                className="
                  absolute
                  right-[225px]
                  top-[94px]
                  z-10
                  h-px
                  w-[210px]
                  bg-[#c89d58]
                  opacity-80

                  xl:right-[235px]
                  xl:w-[225px]
                "
              />


              {/* =================================================
                  HERO PROJECT CAROUSEL

                  IMPORTANT:

                  We DO NOT render separate permanent TOP /
                  CENTER / BOTTOM image elements.

                  Instead, the SAME project DOM element changes
                  role.

                  Framer Motion therefore sees:

                    Project A:
                      CENTER → BOTTOM

                    Project B:
                      TOP → CENTER

                    Project C:
                      BOTTOM → TOP

                  That produces the actual circular movement.
              ================================================= */}

              {showHeroSkeleton ? (
                <HeroCarouselSkeleton />
              ) : visibleCarouselCards.length > 0 ? (

                visibleCarouselCards.map(
                  ({
                    property,
                    role,
                  }) => (
                    <HeroProjectCard
                      key={getPropertyKey(
                        property
                      )}
                      property={
                        property
                      }
                      role={role}
                    />
                  )
                )

              ) : (
                <FallbackHeroImage />
              )}


              {/* =================================================
                  HANDWRITTEN TEXT
              ================================================= */}

              <div
                className="
                  pointer-events-none
                  absolute
                  right-[-2px]
                  top-[102px]
                  z-40

                  rotate-[-5deg]

                  text-right
                  font-serif
                  text-[17px]
                  italic
                  leading-[1.05]
                  text-[#c89d58]
                  opacity-90

                  xl:right-[-7px]
                  xl:text-[18px]
                "
                style={{
                  fontFamily:
                    "'Brush Script MT', 'Segoe Script', cursive",
                }}
              >
                Luxury
                <br />
                Living
                <br />
                Redefined
              </div>


              {/* LEAF DETAIL */}

              <div
                className="
                  pointer-events-none
                  absolute
                  bottom-[4px]
                  left-[0px]
                  z-30
                  text-[46px]
                  leading-none
                  opacity-50
                "
              >
                🌿
              </div>

            </div>

          </div>


          {/* ==================================================
              SEARCH PANEL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.32,
            }}
            className="
              relative
              z-[1000]
              mt-0
              w-full
              overflow-visible
            "
          >
            <SearchPanel />
          </motion.div>


          {/* ==================================================
              TRUST STRIP
          ================================================== */}

          <div
            className="
              relative
              z-[10]
              mt-[20px]
              border-b
              border-[#e9e5dc]
              pb-[19px]

              lg:mt-[20px]
              lg:pb-[19px]
            "
          >
            <div className="grid grid-cols-4">

              <TrustItem
                icon={ShieldCheck}
                title="Exclusive Listings"
                subtitle="Handpicked premium properties"
                first
              />

              <TrustItem
                icon={Building2}
                title="Verified Developers"
                subtitle="Trusted & established brands"
              />

              <TrustItem
                icon={Target}
                title="End-to-End Support"
                subtitle="From search to possession"
              />

              <TrustItem
                icon={ShieldCheck}
                title="Better Investment"
                subtitle="Build wealth for tomorrow"
                last
              />

            </div>
          </div>

        </div>
      </div>


      {/* ======================================================
          CATEGORY SECTION
      ====================================================== */}

      <section
        className="
          relative
          z-[1]
          bg-[#fbfaf6]
          py-[28px]
          lg:py-[29px]
        "
      >

        <div
          className="
            mx-auto
            w-full
            max-w-[1380px]
            px-6
            sm:px-7
            lg:px-8
            xl:px-6
          "
        >

          <div
            className="
              grid
              items-center
              gap-6

              lg:grid-cols-[330px_1fr]
              lg:gap-8
            "
          >

            {/* CATEGORY TITLE */}

            <div>

              <div
                className="
                  mb-[8px]
                  flex
                  items-center
                  gap-3
                "
              >
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[2.6px]
                    text-[#888379]
                  "
                >
                  EXPLORE BY CATEGORY
                </span>

                <span
                  className="
                    h-px
                    w-[50px]
                    bg-[#c89d58]
                  "
                />
              </div>


              <h2
                className="
                  font-serif
                  text-[25px]
                  leading-[1.08]
                  tracking-[-0.6px]
                  text-[#173a31]

                  xl:text-[27px]
                "
                style={{
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                }}
              >
                Find Properties That Match
                <br />
                Your Dreams
              </h2>

            </div>


            {/* CATEGORY CARDS */}

            <div
              className="
                grid
                grid-cols-4
                gap-3
              "
            >

              {categoriesLoading ? (
                <>
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                  <CategorySkeleton />
                </>
              ) : categoryCards.length > 0 ? (

                categoryCards.map(
                  (category) => (
                    <CategoryCard
                      key={
                        category.title
                      }
                      title={
                        category.title
                      }
                      icon={
                        category.icon
                      }
                      image={
                        category.image
                      }
                      position={
                        category.position
                      }
                    />
                  )
                )

              ) : (

                <div
                  className="
                    col-span-4
                    flex
                    min-h-[108px]
                    items-center
                    justify-center
                    rounded-[13px]
                    border
                    border-[#e8e2d7]
                    bg-white
                    text-[11px]
                    uppercase
                    tracking-[2px]
                    text-[#8a8f8b]
                  "
                >
                  Explore our property
                  collection
                </div>

              )}

            </div>

          </div>

        </div>

      </section>

    </section>
  );
}


/* ============================================================
   HERO PROJECT CARD
   ------------------------------------------------------------
   THIS IS THE IMPORTANT PART.

   The `key` belongs to the PROPERTY, not the ROLE.

   Example:

   First state:

     Project A = CENTER
     Project B = TOP
     Project C = BOTTOM

   Next state:

     Project A = BOTTOM
     Project B = CENTER
     Project C = TOP

   React keeps A/B/C alive.

   Framer Motion detects that their layout positions changed and
   physically animates each card to its new position.
============================================================ */

function HeroProjectCard({
  property,
  role,
}) {
  const href =
    property?.slug
      ? `/${property.slug}`
      : "/properties";

  const title =
    getPropertyTitle(
      property
    );

  const image =
    getPropertyImage(
      property
    );

  const location =
    getPropertyLocation(
      property
    );


  /*
   * The classes define the three physical positions.
   *
   * Framer Motion's `layout` animates between them.
   */
  const roleClasses = {
    active: `
      left-[28px]
      top-[112px]

      h-[245px]
      w-[350px]

      z-20

      xl:left-[22px]
      xl:top-[112px]
      xl:h-[255px]
      xl:w-[365px]
    `,

    next: `
      right-[62px]
      top-[20px]

      h-[140px]
      w-[188px]

      z-30

      xl:right-[58px]
      xl:top-[20px]
      xl:h-[150px]
      xl:w-[200px]
    `,

    previous: `
      right-[0px]
      bottom-[3px]

      h-[140px]
      w-[190px]

      z-30

      xl:right-[0px]
      xl:bottom-[3px]
      xl:h-[148px]
      xl:w-[202px]
    `,
  };


  const isActive =
    role === "active";


  return (
    <motion.div
      layout
      initial={false}

      /*
       * Opacity remains high for all three cards.
       *
       * The important animation is layout:
       * position + size + stacking.
       */
      animate={{
        opacity:
          isActive
            ? 1
            : 0.97,
      }}

      transition={{
        layout: {
          duration:
            HERO_ANIMATION_MS /
            1000,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },

        opacity: {
          duration:
            HERO_ANIMATION_MS /
            1000,
          ease: "easeOut",
        },
      }}

      className={`
        pointer-events-auto
        absolute

        overflow-hidden
        rounded-[17px]

        border
        border-white

        bg-white

        ${roleClasses[role]}

        ${
          isActive
            ? `
              shadow-[0_18px_42px_rgba(22,46,38,0.15)]
            `
            : `
              rounded-[15px]
              shadow-[0_15px_35px_rgba(22,46,38,0.14)]
            `
        }
      `}
    >

      <Link
        href={href}
        aria-label={`View ${title}`}
        className="
          group
          block
          h-full
          w-full
        "
      >

        <Image
          src={image}
          alt={title}
          fill

          /*
           * Only the CENTER image is prioritized.
           *
           * TOP and BOTTOM use lazy loading so we don't
           * unnecessarily compete with the initial hero LCP.
           */
          priority={
            isActive
          }

          loading={
            isActive
              ? "eager"
              : "lazy"
          }

          quality={
            isActive
              ? 88
              : 78
          }

          sizes={
            isActive
              ? `
                (min-width: 1280px) 365px,
                350px
              `
              : `
                (min-width: 1280px) 202px,
                200px
              `
          }

          className="
            object-cover
            object-center

            transition-transform
            duration-[1200ms]
            ease-out

            group-hover:scale-[1.035]
          "
        />


        {/* IMAGE GRADIENT */}

        <div
          className={`
            absolute
            inset-0

            bg-gradient-to-t

            ${
              isActive
                ? `
                  from-[#102f27]/55
                  via-[#102f27]/5
                  to-transparent
                `
                : `
                  from-[#102f27]/50
                  via-transparent
                  to-transparent
                `
            }
          `}
        />


        {/* =================================================
            CENTER PROJECT INFORMATION
        ================================================= */}

        {isActive ? (

          <div
            className="
              absolute
              bottom-3
              left-3
              right-3

              flex
              items-end
              justify-between
              gap-3
            "
          >

            <div className="min-w-0">

              <p
                className="
                  truncate
                  text-[11px]
                  font-semibold
                  tracking-[0.3px]
                  text-white
                  drop-shadow
                "
              >
                {title}
              </p>

              <p
                className="
                  mt-[2px]
                  truncate
                  text-[8px]
                  uppercase
                  tracking-[1.2px]
                  text-white/80
                "
              >
                {location}
              </p>

            </div>


            <span
              className="
                flex
                h-[27px]
                w-[27px]
                shrink-0

                items-center
                justify-center

                rounded-full

                border
                border-white/70

                bg-[#17342d]/40

                text-white

                backdrop-blur-sm

                transition-all
                duration-300

                group-hover:border-[#d4b16d]
                group-hover:bg-[#d4b16d]
                group-hover:text-[#17342d]
              "
            >
              <ArrowRight
                size={12}
                strokeWidth={2}
              />
            </span>

          </div>

        ) : (

          /* =================================================
             TOP / BOTTOM COMPACT LABEL
          ================================================= */

          <div
            className="
              absolute
              bottom-2
              left-2
              right-2
            "
          >

            <p
              className="
                truncate
                text-[9px]
                font-semibold
                text-white
                drop-shadow
              "
            >
              {title}
            </p>

          </div>

        )}

      </Link>

    </motion.div>
  );
}


/* ============================================================
   HERO SKELETON
============================================================ */

function HeroCarouselSkeleton() {
  return (
    <>
      {/* MAIN */}

      <div
        className="
          absolute
          left-[28px]
          top-[112px]
          z-20

          h-[245px]
          w-[350px]

          animate-pulse

          overflow-hidden
          rounded-[17px]

          border
          border-white

          bg-[#e9e5dc]

          shadow-[0_18px_42px_rgba(22,46,38,0.12)]

          xl:left-[22px]
          xl:top-[112px]
          xl:h-[255px]
          xl:w-[365px]
        "
      />


      {/* TOP */}

      <div
        className="
          absolute
          right-[62px]
          top-[20px]
          z-30

          h-[140px]
          w-[188px]

          animate-pulse

          rounded-[15px]
          border
          border-white

          bg-[#e9e5dc]

          xl:right-[58px]
          xl:h-[150px]
          xl:w-[200px]
        "
      />


      {/* BOTTOM */}

      <div
        className="
          absolute
          bottom-[3px]
          right-[0px]
          z-30

          h-[140px]
          w-[190px]

          animate-pulse

          rounded-[15px]
          border
          border-white

          bg-[#e9e5dc]

          xl:h-[148px]
          xl:w-[202px]
        "
      />
    </>
  );
}


/* ============================================================
   FALLBACK HERO IMAGE
============================================================ */

function FallbackHeroImage() {
  return (
    <div
      className="
        absolute
        left-[28px]
        top-[112px]
        z-20

        h-[245px]
        w-[350px]

        overflow-hidden
        rounded-[17px]

        border
        border-white

        bg-white

        shadow-[0_18px_42px_rgba(22,46,38,0.15)]

        xl:left-[22px]
        xl:top-[112px]
        xl:h-[255px]
        xl:w-[365px]
      "
    >

      <Image
        src="/img1.jpg"
        alt="Luxury property"
        fill
        priority
        quality={88}
        sizes="
          (min-width: 1280px) 365px,
          350px
        "
        className="
          object-cover
          object-center
        "
      />

      <div
        className="
          absolute
          inset-0
          bg-gradient-to-t
          from-[#102f27]/20
          to-transparent
        "
      />

    </div>
  );
}


/* ============================================================
   MINI FEATURE
============================================================ */

function MiniFeature({
  icon: Icon,
  title,
  subtitle,
  last = false,
}) {
  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-2.5

        pr-5
        mr-4

        ${
          !last
            ? "border-r border-[#ddd9cf]"
            : ""
        }

        xl:pr-6
        xl:mr-5
      `}
    >

      <span
        className="
          flex
          h-[31px]
          w-[31px]
          shrink-0

          items-center
          justify-center

          rounded-full

          border
          border-[#d8bb82]

          text-[#c0934d]
        "
      >
        <Icon
          size={16}
          strokeWidth={1.6}
        />
      </span>


      <span className="whitespace-nowrap">

        <span
          className="
            block
            text-[10px]
            font-semibold
            leading-[1.2]
            text-[#344b44]

            xl:text-[11px]
          "
        >
          {title}
        </span>

        <span
          className="
            mt-[2px]
            block
            text-[9px]
            leading-[1.2]
            text-[#7d8782]
          "
        >
          {subtitle}
        </span>

      </span>

    </div>
  );
}


/* ============================================================
   TRUST ITEM
============================================================ */

function TrustItem({
  icon: Icon,
  title,
  subtitle,
  first = false,
  last = false,
}) {
  return (
    <div
      className={`
        flex
        min-w-0
        items-center
        gap-3
        px-2

        ${
          !first
            ? "border-l border-[#e5e1d8]"
            : ""
        }

        ${
          last
            ? "pr-0"
            : ""
        }

        xl:px-5
      `}
    >

      <span
        className="
          flex
          h-[31px]
          w-[31px]
          shrink-0

          items-center
          justify-center

          rounded-full

          border
          border-[#d9bd86]

          text-[#bd914d]
        "
      >
        <Icon
          size={15}
          strokeWidth={1.7}
        />
      </span>


      <span className="min-w-0">

        <span
          className="
            block
            truncate
            text-[10px]
            font-semibold
            text-[#394e47]

            xl:text-[11px]
          "
        >
          {title}
        </span>

        <span
          className="
            mt-[2px]
            block
            truncate
            text-[8px]
            text-[#8a918c]

            xl:text-[9px]
          "
        >
          {subtitle}
        </span>

      </span>

    </div>
  );
}


/* ============================================================
   CATEGORY SKELETON
============================================================ */

function CategorySkeleton() {
  return (
    <div
      className="
        h-[108px]

        animate-pulse

        rounded-[13px]

        border
        border-[#e7e1d6]

        bg-[#eeeae1]

        xl:h-[114px]
      "
    />
  );
}


/* ============================================================
   CATEGORY CARD
============================================================ */

function CategoryCard({
  title,
  icon: Icon = Building2,
  image,
  position = "center",
}) {
  const href =
    `/properties?propertyType=${encodeURIComponent(
      title
    )}`;

  return (
    <Link
      href={href}
      className="
        group
        relative

        h-[108px]

        overflow-hidden

        rounded-[13px]

        border
        border-white

        bg-[#163a31]

        shadow-[0_7px_20px_rgba(22,48,40,0.08)]

        xl:h-[114px]
      "
    >

      <Image
        src={image}
        alt={`${title} properties`}
        fill

        /*
         * Category images are below the hero and therefore
         * remain lazy-loaded.
         */
        loading="lazy"

        sizes="250px"

        className="
          object-cover

          transition-transform
          duration-700

          group-hover:scale-[1.05]
        "

        style={{
          objectPosition:
            position,
        }}
      />


      <div
        className="
          absolute
          inset-0

          bg-gradient-to-t
          from-[#12392f]/95
          via-[#12392f]/30
          to-transparent
        "
      />


      <div
        className="
          absolute
          bottom-3
          left-3
          right-3

          flex
          items-center
          justify-between
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

          <Icon
            size={14}
            strokeWidth={1.7}
            className="
              shrink-0
              text-[#d4b16d]
            "
          />

          <span
            className="
              truncate
              text-[9px]
              font-medium
              text-white

              xl:text-[10px]
            "
          >
            {title}
          </span>

        </div>


        <span
          className="
            flex
            h-[23px]
            w-[23px]
            shrink-0

            items-center
            justify-center

            rounded-full

            border
            border-white/55

            text-white

            transition-all
            duration-300

            group-hover:border-[#d4b16d]
            group-hover:bg-[#d4b16d]
            group-hover:text-[#17342d]
          "
        >
          <ArrowRight
            size={11}
            strokeWidth={2}
          />
        </span>

      </div>

    </Link>
  );
}