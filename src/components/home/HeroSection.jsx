"use client";

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

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import SearchPanel from "./SearchPanel";

/* ============================================================
   PROPERTY BOUQUET — DESKTOP HERO

   IMPORTANT
   ------------------------------------------------------------
   - Uses the REAL functional SearchPanel
   - SearchPanel remains in normal document flow
   - Hero uses overflow-visible so dropdowns can escape
   - Categories are fetched from /api/properties
   - Categories use categoryData.categoryName
   - Category click uses ?propertyType=
   - Mobile hero remains separate
============================================================ */

export default function HeroSection() {
  /* ==========================================================
     DYNAMIC PROPERTY CATEGORIES
  ========================================================== */

  const [propertyCategories, setPropertyCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    const fetchPropertyCategories = async () => {
      try {
        setCategoriesLoading(true);

        const response = await fetch("/api/properties", {
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch properties: ${response.status}`
          );
        }

        const data = await response.json();

        if (cancelled) return;

        /*
         * Support the common response shapes without changing
         * the actual category source.
         */
        const propertyData = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data?.data)
              ? data.data
              : [];

        /*
         * EXACT SAME CATEGORY SOURCE AS SEARCHPANEL:
         *
         * property?.categoryData?.categoryName
         */
        const uniqueCategories = [
          ...new Set(
            propertyData
              .map(
                (property) =>
                  property?.categoryData?.categoryName
              )
              .filter(Boolean)
              .map((name) => String(name).trim())
              .filter(Boolean)
          ),
        ];

        if (!uniqueCategories.length) {
          setPropertyCategories([]);
          return;
        }

        /*
         * Select the four most relevant categories for the
         * homepage while keeping their REAL database names.
         *
         * Nothing is renamed.
         */
        const getCategoryScore = (name) => {
          const value = name.toLowerCase();

          if (
            value.includes("apartment") ||
            value.includes("residential") ||
            value.includes("flat")
          ) {
            return 100;
          }

          if (value.includes("villa")) {
            return 90;
          }

          if (
            value.includes("plot") ||
            value.includes("land")
          ) {
            return 80;
          }

          if (
            value.includes("commercial") ||
            value.includes("office") ||
            value.includes("retail")
          ) {
            return 70;
          }

          if (
            value.includes("builder") ||
            value.includes("floor")
          ) {
            return 60;
          }

          if (value.includes("penthouse")) {
            return 55;
          }

          if (value.includes("investment")) {
            return 50;
          }

          return 10;
        };

        const sortedCategories = [...uniqueCategories].sort(
          (a, b) => {
            const scoreDifference =
              getCategoryScore(b) -
              getCategoryScore(a);

            if (scoreDifference !== 0) {
              return scoreDifference;
            }

            return a.localeCompare(b);
          }
        );

        /*
         * First four highest-priority REAL categories.
         */
        setPropertyCategories(
          sortedCategories.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Property Bouquet category fetch failed:",
          error
        );

        if (!cancelled) {
          setPropertyCategories([]);
        }
      } finally {
        if (!cancelled) {
          setCategoriesLoading(false);
        }
      }
    };

    fetchPropertyCategories();

    return () => {
      cancelled = true;
    };
  }, []);

  /* ==========================================================
     CATEGORY ICON
  ========================================================== */

  const getCategoryIcon = (categoryName) => {
    const value = String(categoryName || "").toLowerCase();

    if (
      value.includes("plot") ||
      value.includes("land")
    ) {
      return Trees;
    }

    if (
      value.includes("commercial") ||
      value.includes("office") ||
      value.includes("retail")
    ) {
      return Landmark;
    }

    if (value.includes("villa")) {
      return Home;
    }

    return Building2;
  };

  /* ==========================================================
     CATEGORY CARDS
  ========================================================== */

 const categoryCards = useMemo(() => {
  return propertyCategories.map((categoryName, index) => ({
    title: categoryName,
    icon: getCategoryIcon(categoryName),

    // Category images:
    // 1st → img4.jpg
    // 2nd → img5.jpg
    // 3rd → img6.jpg
    // 4th → img7.jpg
    image: `/img${index + 4}.webp`,

    /*
     * Slightly different crop for visual variety.
     * The actual category remains completely dynamic.
     */
    position:
      index === 0
        ? "center"
        : index === 1
          ? "65% center"
          : index === 2
            ? "25% bottom"
            : "80% center",
  }));
}, [propertyCategories]);

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

          IMPORTANT:
          NO overflow-hidden on the parent.
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
        {/* ====================================================
            CONTROLLED WIDTH
        ==================================================== */}

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
              {/* =================================================
                  EYEBROW
              ================================================= */}

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
                  CURATED FOR GENERATIONS OF WEALTH
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

              {/* =================================================
                  MAIN HEADING
              ================================================= */}

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

              {/* =================================================
                  DESCRIPTION
              ================================================= */}

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
                Premium residences, luxury investments, and
                exclusive opportunities across India&apos;s
                most sought-after locations.
              </motion.p>

              {/* =================================================
                  MINI FEATURES
              ================================================= */}

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

              {/* MAIN IMAGE */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 22,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.12,
                }}
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
                  quality={90}
                  sizes="365px"
                  className="object-cover object-center"
                />

                <div
                  className="
                    absolute
                    inset-0
                    bg-gradient-to-t
                    from-[#102f27]/15
                    to-transparent
                  "
                />
              </motion.div>

              {/* TOP RIGHT IMAGE */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: -14,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.7,
                  delay: 0.28,
                }}
                className="
                  absolute
                  right-[62px]
                  top-[20px]
                  z-30

                  h-[140px]
                  w-[188px]

                  overflow-hidden
                  rounded-[15px]
                  border
                  border-white
                  bg-white

                  shadow-[0_15px_35px_rgba(22,46,38,0.14)]

                  xl:right-[58px]
                  xl:h-[150px]
                  xl:w-[200px]
                "
              >
                <Image
                  src="/img2.jpg"
                  alt="Luxury residential development"
                  fill
                  quality={85}
                  sizes="200px"
                  className="object-cover object-[68%_35%]"
                />
              </motion.div>

              {/* BOTTOM RIGHT IMAGE */}

              <motion.div
                initial={{
                  opacity: 0,
                  x: 15,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 0.75,
                  delay: 0.38,
                }}
                className="
                  absolute
                  bottom-[3px]
                  right-[0px]
                  z-30

                  h-[140px]
                  w-[190px]

                  overflow-hidden
                  rounded-[15px]
                  border
                  border-white
                  bg-white

                  shadow-[0_15px_35px_rgba(22,46,38,0.14)]

                  xl:h-[148px]
                  xl:w-[202px]
                "
              >
                <Image
                  src="/img3.jpg"
                  alt="Premium property landscape"
                  fill
                  quality={85}
                  sizes="202px"
                  className="object-cover object-[30%_75%]"
                />
              </motion.div>

              {/* HANDWRITTEN TEXT */}

              <div
                className="
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
              REAL FUNCTIONAL SEARCH PANEL

              IMPORTANT:
              - High stacking level
              - Overflow visible
              - Dropdown can escape downward
              - Category section stays underneath
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

          IMPORTANT:
          - Lower stacking level than SearchPanel
          - NOT overflow-hidden
          - Search dropdown can appear over this section
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
            {/* =================================================
                CATEGORY TITLE
            ================================================= */}

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

            {/* =================================================
                REAL DYNAMIC CATEGORY CARDS
            ================================================= */}

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
                categoryCards.map((category) => (
  <CategoryCard
    key={category.title}
    title={category.title}
    icon={category.icon}
    image={category.image}
    position={category.position}
  />
))
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
                  Explore our property collection
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

        ${!last ? "border-r border-[#ddd9cf]" : ""}

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

        ${!first ? "border-l border-[#e5e1d8]" : ""}

        ${last ? "pr-0" : ""}

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

   IMPORTANT:
   Clicking this uses the EXACT SAME query parameter
   as SearchPanel:

   /properties?propertyType=...
============================================================ */

function CategoryCard({
  title,
  icon: Icon = Building2,
  image,
  position = "center",
}) {
  const href = `/properties?propertyType=${encodeURIComponent(
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
  sizes="250px"
  className="
    object-cover
    transition-transform
    duration-700
    group-hover:scale-[1.05]
  "
  style={{
    objectPosition: position,
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