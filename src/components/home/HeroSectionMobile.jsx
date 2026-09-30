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

import SearchPanelMobile from "./SearchPanelMobile";

/* ============================================================
   PROPERTY BOUQUET — MOBILE HERO

   IMPORTANT
   ------------------------------------------------------------
   - MOBILE-ONLY responsive hero
   - Uses the REAL functional SearchPanelMobile
   - SearchPanelMobile remains in normal document flow
   - Hero uses overflow-visible so dropdowns can escape
   - Categories are fetched from /api/properties
   - Uses categoryData.categoryName
   - Category click uses ?propertyType=
   - Uses EXACTLY the SAME HOMEPAGE IMAGE NAMES as DESKTOP

   HERO IMAGES
   ------------------------------------------------------------
   /img1.jpg  → Main hero image
   /img2.jpg  → Top-right hero image
   /img3.jpg  → Bottom-right hero image

   CATEGORY IMAGES
   ------------------------------------------------------------
   /img4.webp → Category 1
   /img5.webp → Category 2
   /img6.webp → Category 3
   /img7.webp → Category 4
============================================================ */

export default function HeroSectionMobile() {
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
         * Support the same common response shapes
         * used by the desktop HeroSection.
         */
        const propertyData = Array.isArray(data)
          ? data
          : Array.isArray(data?.properties)
            ? data.properties
            : Array.isArray(data?.data)
              ? data.data
              : [];

        /*
         * EXACT SAME CATEGORY SOURCE AS DESKTOP SEARCH:
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

        /* ====================================================
           SAME CATEGORY PRIORITY LOGIC AS DESKTOP
        ==================================================== */

        const getCategoryScore = (name) => {
          const value = String(name || "").toLowerCase();

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
         * EXACTLY THE SAME FOUR-CATEGORY LIMIT AS DESKTOP.
         */
        setPropertyCategories(
          sortedCategories.slice(0, 4)
        );
      } catch (error) {
        console.error(
          "Property Bouquet mobile category fetch failed:",
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

     IMPORTANT
     ----------------------------------------------------------
     These use the EXACT SAME IMAGE ASSIGNMENT as desktop.

     1st category → /img4.webp
     2nd category → /img5.webp
     3rd category → /img6.webp
     4th category → /img7.webp

     Category names themselves remain dynamic.
  ========================================================== */

  const categoryCards = useMemo(() => {
    return propertyCategories
      .slice(0, 4)
      .map((categoryName, index) => ({
        title: categoryName,
        icon: getCategoryIcon(categoryName),

        /*
         * EXACT SAME CATEGORY IMAGE SOURCE AS DESKTOP.
         */
        image: `/img${index + 4}.webp`,
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
          SOFT BACKGROUND DECORATION
      ====================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          right-[-150px]
          top-[-120px]
          h-[330px]
          w-[330px]
          rounded-full
          bg-[#eadfc8]/60
          blur-[2px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[-120px]
          top-[420px]
          h-[260px]
          w-[260px]
          rounded-full
          bg-[#e8dfcc]/30
          blur-[70px]
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          left-[38%]
          top-[330px]
          h-[180px]
          w-[180px]
          rounded-full
          bg-[#e9dfc9]/25
          blur-[60px]
        "
      />

      {/* ======================================================
          MAIN MOBILE CONTENT
      ====================================================== */}

      <div
        className="
          relative
          z-[110]
          overflow-visible
          px-4
          pt-[82px]
          pb-0
          sm:px-5
          sm:pt-[88px]
        "
      >
        {/* ====================================================
            MOBILE HERO TOP
        ==================================================== */}

        <div
          className="
            relative
            overflow-visible
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
              mb-[13px]
              flex
              items-center
              gap-2.5
            "
          >
            <span
              className="
                h-px
                w-[28px]
                shrink-0
                bg-[#c89d58]
              "
            />

            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[2.3px]
                text-[#85877e]
              "
            >
              CURATED FOR GENERATIONS OF WEALTH
            </span>
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
              max-w-[360px]
              font-serif
              text-[39px]
              font-medium
              leading-[0.99]
              tracking-[-1.7px]
              text-[#12392f]

              sm:max-w-[420px]
              sm:text-[44px]
              sm:tracking-[-1.9px]
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
              mt-[15px]
              max-w-[345px]
              text-[12px]
              leading-[1.7]
              text-[#66736e]

              sm:max-w-[450px]
              sm:text-[13px]
            "
          >
            Premium residences, luxury investments, and
            exclusive opportunities across India&apos;s
            most sought-after locations.
          </motion.p>

          {/* =================================================
              MOBILE HERO IMAGE COMPOSITION

              EXACT SAME IMAGE FILES AS DESKTOP:

              /img1.jpg
              /img2.jpg
              /img3.jpg
          ================================================= */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.75,
              delay: 0.18,
            }}
            className="
              relative
              mt-[22px]
              h-[245px]
              w-full

              sm:h-[275px]
            "
          >
            {/* =================================================
                SOFT CIRCLE
            ================================================= */}

            <div
              className="
                absolute
                right-[-25px]
                top-[-12px]
                h-[205px]
                w-[205px]
                rounded-full
                bg-[#eee3cb]

                sm:right-[8px]
                sm:h-[225px]
                sm:w-[225px]
              "
            />

            {/* =================================================
                MAIN IMAGE

                DESKTOP:
                /img1.jpg

                MOBILE:
                SAME /img1.jpg
            ================================================= */}

            <div
              className="
                absolute
                left-0
                top-[48px]
                z-20
                h-[170px]
                w-[68%]
                overflow-hidden
                rounded-[16px]
                border
                border-white
                bg-white
                shadow-[0_16px_35px_rgba(22,46,38,0.15)]

                sm:top-[52px]
                sm:h-[195px]
                sm:w-[70%]
              "
            >
              <Image
                src="/img1.jpg"
                alt="Luxury property"
                fill
                priority
                quality={90}
                sizes="70vw"
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
                  from-[#102f27]/15
                  to-transparent
                "
              />
            </div>

            {/* =================================================
                TOP-RIGHT IMAGE

                DESKTOP:
                /img2.jpg

                MOBILE:
                SAME /img2.jpg
            ================================================= */}

            <div
              className="
                absolute
                right-0
                top-0
                z-30
                h-[105px]
                w-[39%]
                overflow-hidden
                rounded-[14px]
                border
                border-white
                bg-white
                shadow-[0_13px_30px_rgba(22,46,38,0.14)]

                sm:h-[120px]
                sm:w-[38%]
              "
            >
              <Image
                src="/img2.jpg"
                alt="Luxury residential development"
                fill
                quality={85}
                sizes="40vw"
                className="
                  object-cover
                  object-[68%_35%]
                "
              />
            </div>

            {/* =================================================
                BOTTOM-RIGHT IMAGE

                DESKTOP:
                /img3.jpg

                MOBILE:
                SAME /img3.jpg
            ================================================= */}

            <div
              className="
                absolute
                bottom-0
                right-0
                z-30
                h-[105px]
                w-[42%]
                overflow-hidden
                rounded-[14px]
                border
                border-white
                bg-white
                shadow-[0_13px_30px_rgba(22,46,38,0.14)]

                sm:h-[120px]
                sm:w-[40%]
              "
            >
              <Image
                src="/img3.jpg"
                alt="Premium property landscape"
                fill
                quality={85}
                sizes="42vw"
                className="
                  object-cover
                  object-[30%_75%]
                "
              />
            </div>

            {/* =================================================
                GOLD HANDWRITTEN LABEL
            ================================================= */}

            <div
              className="
                absolute
                right-[2px]
                top-[108px]
                z-40
                rotate-[-5deg]
                text-right
                text-[13px]
                italic
                leading-[1.05]
                text-[#c89d58]
                opacity-90

                sm:right-[4px]
                sm:top-[122px]
                sm:text-[15px]
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

            {/* =================================================
                GOLD LINE
            ================================================= */}

            <div
              className="
                absolute
                left-[42%]
                top-[41px]
                z-10
                h-px
                w-[27%]
                bg-[#c89d58]
                opacity-80
              "
            />

            {/* =================================================
                LEAF DETAIL
            ================================================= */}

            <div
              className="
                absolute
                bottom-[-2px]
                left-[2px]
                z-30
                text-[34px]
                leading-none
                opacity-50
              "
            >
              🌿
            </div>
          </motion.div>

          {/* =================================================
              MOBILE MINI FEATURES
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
              delay: 0.28,
            }}
            className="
              mt-[18px]
              grid
              grid-cols-2
              gap-y-4
              border-t
              border-[#e4dfd5]
              pt-[15px]

              sm:grid-cols-4
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
            />
          </motion.div>
        </div>

        {/* ==================================================
            REAL FUNCTIONAL MOBILE SEARCH PANEL

            IMPORTANT:
            - Normal document flow
            - No absolute positioning
            - Overflow visible
            - Dropdowns can extend below
        ================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.34,
          }}
          className="
            relative
            z-[1000]
            mt-[22px]
            w-full
            overflow-visible
          "
        >
          <SearchPanelMobile />
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
            pb-[18px]
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-y-5
            "
          >
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

      {/* ======================================================
          MOBILE CATEGORY SECTION

          Uses EXACT SAME CATEGORY IMAGE FILES as DESKTOP.

          /img4.webp
          /img5.webp
          /img6.webp
          /img7.webp
      ====================================================== */}

      <section
        className="
          relative
          z-[1]
          overflow-visible
          bg-[#fbfaf6]
          px-4
          py-[27px]

          sm:px-5
          sm:py-[32px]
        "
      >
        <div className="mx-auto w-full">
          {/* =================================================
              CATEGORY HEADER
          ================================================= */}

          <div className="mb-[17px]">
            <div
              className="
                mb-[7px]
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[2.4px]
                  text-[#888379]
                "
              >
                EXPLORE BY CATEGORY
              </span>

              <span
                className="
                  h-px
                  w-[42px]
                  bg-[#c89d58]
                "
              />
            </div>

            <h2
              className="
                font-serif
                text-[25px]
                leading-[1.08]
                tracking-[-0.7px]
                text-[#173a31]

                sm:text-[28px]
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
              CATEGORY CARDS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2
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
                />
              ))
            ) : (
              <div
                className="
                  col-span-2
                  flex
                  min-h-[110px]
                  items-center
                  justify-center
                  rounded-[14px]
                  border
                  border-[#e8e2d7]
                  bg-white
                  px-4
                  text-center
                  text-[9px]
                  uppercase
                  tracking-[1.8px]
                  text-[#8a8f8b]
                "
              >
                Explore our property collection
              </div>
            )}
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
}) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-2
      "
    >
      <span
        className="
          flex
          h-[29px]
          w-[29px]
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
          size={14}
          strokeWidth={1.6}
        />
      </span>

      <span className="min-w-0">
        <span
          className="
            block
            truncate
            text-[9px]
            font-semibold
            leading-[1.2]
            text-[#344b44]
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
        gap-2.5
        px-1

        ${!first ? "border-l border-[#e5e1d8] pl-3" : ""}

        ${last ? "pr-0" : ""}
      `}
    >
      <span
        className="
          flex
          h-[30px]
          w-[30px]
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
          size={14}
          strokeWidth={1.7}
        />
      </span>

      <span className="min-w-0">
        <span
          className="
            block
            truncate
            text-[9px]
            font-semibold
            text-[#394e47]
          "
        >
          {title}
        </span>

        <span
          className="
            mt-[2px]
            block
            truncate
            text-[7.5px]
            text-[#8a918c]
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
        h-[112px]
        animate-pulse
        rounded-[14px]
        border
        border-[#e7e1d6]
        bg-[#eeeae1]

        sm:h-[125px]
      "
    />
  );
}

/* ============================================================
   CATEGORY CARD

   REAL LINK:

   /properties?propertyType=...

   IMAGE SOURCE:
   EXACT SAME /img4.webp → /img7.webp
   ASSIGNED BY CATEGORY POSITION
============================================================ */

function CategoryCard({
  title,
  icon: Icon = Building2,
  image,
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
        h-[112px]
        overflow-hidden
        rounded-[14px]
        border
        border-white
        bg-[#163a31]
        shadow-[0_7px_20px_rgba(22,48,40,0.08)]

        sm:h-[125px]
      "
    >
      <Image
        src={image}
        alt={`${title} properties`}
        fill
        sizes="50vw"
        className="
          object-cover
          transition-transform
          duration-700
          group-hover:scale-[1.05]
        "
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
          bottom-2.5
          left-2.5
          right-2.5
          flex
          items-center
          justify-between
          gap-2
        "
      >
        <div
          className="
            flex
            min-w-0
            items-center
            gap-1.5
          "
        >
          <Icon
            size={13}
            strokeWidth={1.7}
            className="
              shrink-0
              text-[#d4b16d]
            "
          />

          <span
            className="
              truncate
              text-[8.5px]
              font-medium
              text-white

              sm:text-[9px]
            "
          >
            {title}
          </span>
        </div>

        <span
          className="
            flex
            h-[22px]
            w-[22px]
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
            size={10}
            strokeWidth={2}
          />
        </span>
      </div>
    </Link>
  );
}