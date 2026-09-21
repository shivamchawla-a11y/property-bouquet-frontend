"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  MapPin,
  Search,
  Navigation,
  TrendingUp,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

// ============================================================
// LOCATIONS HERO
// ============================================================
//
// Main hero for:
//
// /locations
//
// Features:
// - Premium location directory introduction
// - SEO-visible contextual copy
// - Recursive location search
// - Live suggestions
// - Keyboard search
// - Overflow-safe suggestion panel
// - Navbar-safe top spacing
//
// Expected props:
//
// locations = recursive location tree
// onSearch = callback(value)
//
// ============================================================

export default function LocationsHero({
  locations = [],
  onSearch,
}) {
  // ============================================================
  // SEARCH STATE
  // ============================================================

   // ============================================================
  // ROUTER
  // ============================================================

  const router = useRouter();

  // ============================================================
  // SEARCH STATE
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] =
    useState(false);
  const [searchFocused, setSearchFocused] =
    useState(false);

  // ============================================================
  // NORMALIZE LOCATION
  // ============================================================

  const normalizeLocation = (value = "") => {
    return String(value)
      .toLowerCase()
      .replace(/gurugram/g, "gurgaon")
      .replace(/new delhi/g, "delhi")
      .replace(/-/g, " ")
      .replace(/,/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

    // ============================================================
  // FLATTEN LOCATION TREE
  //
  // IMPORTANT:
  // We keep the ROOT LOCATION with every child.
  //
  // Example:
  //
  // Gurgaon
  //   └── Sector 56
  //
  // Sector 56 will remember:
  // __rootLocation = Gurgaon
  //
  // This allows us to build:
  //
  // /locations/properties-in-sector-56-gurgaon
  // ============================================================

  const flattenLocations = (
    items,
    parentNames = [],
    rootLocation = null,
    result = []
  ) => {
    if (!Array.isArray(items)) {
      return result;
    }

    items.forEach((item) => {
      if (!item) return;

      const name = String(
        item?.name || ""
      ).trim();

      if (!name) {
        flattenLocations(
          item?.children || [],
          parentNames,
          rootLocation,
          result
        );

        return;
      }

      // The first location in a branch is the root.
      const currentRoot =
        rootLocation || item;

      const currentPath = [
        ...parentNames,
        name,
      ];

      result.push({
        ...item,

        __name: name,

        __path:
          currentPath.join(" > "),

        __normalizedName:
          normalizeLocation(name),

        __normalizedPath:
          normalizeLocation(
            currentPath.join(" ")
          ),

        __level:
          parentNames.length,

        // Keep the top-level location.
        __rootLocation:
          currentRoot,
      });

      flattenLocations(
        item?.children || [],
        currentPath,
        currentRoot,
        result
      );
    });

    return result;
  };

  // ============================================================
  // SEARCHABLE LOCATIONS
  // ============================================================

  const searchableLocations = useMemo(() => {
    return flattenLocations(locations);
  }, [locations]);

    // ============================================================
  // BUILD PUBLIC LOCATION SLUG
  //
  // Examples:
  //
  // Sector 56 + Gurgaon
  // -> properties-in-sector-56-gurgaon
  //
  // Sector 57 + Gurgaon
  // -> properties-in-sector-57-gurgaon
  //
  // Gurgaon
  // -> properties-in-gurgaon
  // ============================================================

  const buildPublicLocationSlug = (
    location
  ) => {
    if (!location) {
      return "";
    }

    const cleanSlug = (value = "") => {
      return String(value)
        .trim()
        .toLowerCase()
        .replace(/^\/+|\/+$/g, "")
        .replace(
          /^properties-in-/,
          ""
        )
        .replace(
          /^properties-on-/,
          ""
        )
        .replace(/gurugram/g, "gurgaon")
        .replace(/new-delhi/g, "delhi")
        .replace(
          /[^a-z0-9]+/g,
          "-"
        )
        .replace(
          /^-+|-+$/g,
          ""
        )
        .replace(
          /-+/g,
          "-"
        );
    };

    /*
      Current location slug.

      Prefer the backend slug if available.
      Otherwise create one from the name.
    */
    const currentSlug = cleanSlug(
      location?.slug ||
        location?.locationSlug ||
        location?.publicSlug ||
        location?.name ||
        ""
    );

    if (!currentSlug) {
      return "";
    }

    /*
      Root location.

      For:

      Gurgaon
        -> Sector 56

      rootLocation = Gurgaon
    */
    const rootLocation =
      location?.__rootLocation;

    const rootSlug = cleanSlug(
      rootLocation?.slug ||
        rootLocation?.locationSlug ||
        rootLocation?.publicSlug ||
        rootLocation?.name ||
        ""
    );

    /*
      Root location itself.

      Gurgaon
      ->
      properties-in-gurgaon
    */
    if (
      !rootSlug ||
      currentSlug === rootSlug
    ) {
      return `properties-in-${currentSlug}`;
    }

    /*
      Prevent duplication.

      If backend gives:

      sector-56-gurgaon

      we don't want:

      sector-56-gurgaon-gurgaon
    */
    const finalLocationSlug =
      currentSlug.endsWith(
        `-${rootSlug}`
      )
        ? currentSlug
        : `${currentSlug}-${rootSlug}`;

    return `properties-in-${finalLocationSlug}`;
  };

  // ============================================================
  // LOCATION COUNTS
  // ============================================================

  const totalLocations =
    searchableLocations.length;

  const rootLocationCount =
    Array.isArray(locations)
      ? locations.length
      : 0;

  // ============================================================
  // SEARCH RESULTS
  // ============================================================

  const suggestions = useMemo(() => {
    const query =
      normalizeLocation(searchTerm);

    // Initial dropdown
    if (!query) {
      return searchableLocations.slice(0, 4);
    }

    return searchableLocations
      .filter((location) => {
        const name =
          location.__normalizedName || "";

        const path =
          location.__normalizedPath || "";

        return (
          name.includes(query) ||
          path.includes(query)
        );
      })
      .sort((a, b) => {
        const aName =
          a.__normalizedName || "";

        const bName =
          b.__normalizedName || "";

        const aExact =
          aName === query;

        const bExact =
          bName === query;

        if (aExact && !bExact) {
          return -1;
        }

        if (!aExact && bExact) {
          return 1;
        }

        const aStarts =
          aName.startsWith(query);

        const bStarts =
          bName.startsWith(query);

        if (aStarts && !bStarts) {
          return -1;
        }

        if (!aStarts && bStarts) {
          return 1;
        }

        return aName.localeCompare(
          bName
        );
      })
      .slice(0, 8);
  }, [
    searchTerm,
    searchableLocations,
  ]);

    // ============================================================
  // FIND BEST LOCATION MATCH
  // ============================================================

  const findBestLocationMatch = (
    value
  ) => {
    const query =
      normalizeLocation(value);

    if (
      !query ||
      !searchableLocations.length
    ) {
      return null;
    }

    /*
      1. Exact location name
    */

    const exactName =
      searchableLocations.find(
        (location) =>
          location.__normalizedName ===
          query
      );

    if (exactName) {
      return exactName;
    }

    /*
      2. Exact complete path
    */

    const exactPath =
      searchableLocations.find(
        (location) =>
          location.__normalizedPath ===
          query
      );

    if (exactPath) {
      return exactPath;
    }

    /*
      3. Partial match
    */

    const matches =
      searchableLocations
        .filter((location) => {
          const name =
            location.__normalizedName ||
            "";

          const path =
            location.__normalizedPath ||
            "";

          return (
            name.includes(query) ||
            path.includes(query)
          );
        })
        .sort((a, b) => {
          const aName =
            a.__normalizedName || "";

          const bName =
            b.__normalizedName || "";

          const aExact =
            aName === query;

          const bExact =
            bName === query;

          if (
            aExact &&
            !bExact
          ) {
            return -1;
          }

          if (
            !aExact &&
            bExact
          ) {
            return 1;
          }

          const aStarts =
            aName.startsWith(query);

          const bStarts =
            bName.startsWith(query);

          if (
            aStarts &&
            !bStarts
          ) {
            return -1;
          }

          if (
            !aStarts &&
            bStarts
          ) {
            return 1;
          }

          return aName.localeCompare(
            bName
          );
        });

    return matches[0] || null;
  };

  // ============================================================
  // NAVIGATE TO LOCATION
  // ============================================================

  const navigateToLocation = (
    location
  ) => {
    if (!location) {
      return false;
    }

    const publicSlug =
      buildPublicLocationSlug(
        location
      );

    if (!publicSlug) {
      return false;
    }

    /*
      This produces:

      /locations/properties-in-sector-56-gurgaon
    */

    const locationUrl =
      `/locations/${encodeURIComponent(
        publicSlug
      )}`;

    setSearchTerm(
      location.__name ||
        location?.name ||
        ""
    );

    setShowSuggestions(false);
    setSearchFocused(false);

    router.push(locationUrl);

    return true;
  };

  // ============================================================
  // PERFORM SEARCH
  // ============================================================

  const performSearch = (
    value = searchTerm
  ) => {
    const cleanValue = String(
      value || ""
    ).trim();

    if (!cleanValue) {
      return;
    }

    /*
      Find the actual location from the
      recursive location tree.
    */
    const matchedLocation =
      findBestLocationMatch(
        cleanValue
      );

    /*
      If we found a location,
      go directly to its location page.
    */
    if (
      matchedLocation &&
      navigateToLocation(
        matchedLocation
      )
    ) {
      return;
    }

    /*
      Keep your existing callback as
      fallback behavior.
    */
    if (
      typeof onSearch === "function"
    ) {
      onSearch(cleanValue);
    }

    setShowSuggestions(false);
    setSearchFocused(false);
  };

  // ============================================================
  // INPUT CHANGE
  // ============================================================

  const handleSearchChange = (event) => {
    const value =
      event.target.value || "";

    setSearchTerm(value);
    setShowSuggestions(true);

    if (typeof onSearch === "function") {
      onSearch(value);
    }
  };

  // ============================================================
  // CLEAR SEARCH
  // ============================================================

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);

    if (typeof onSearch === "function") {
      onSearch("");
    }
  };

   // ============================================================
  // SELECT LOCATION
  // ============================================================

  const handleSelectLocation = (
    location
  ) => {
    if (!location) {
      return;
    }

    navigateToLocation(location);
  };

  // ============================================================
  // KEYBOARD
  // ============================================================

  const handleSearchKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      performSearch();
    }

    if (event.key === "Escape") {
      setShowSuggestions(false);
      setSearchFocused(false);
    }
  };

  // ============================================================
  // CLOSE ON OUTSIDE CLICK
  // ============================================================

  useEffect(() => {
    const handleOutsideClick = (event) => {
      const target = event.target;

      if (
        !target.closest?.(
          "[data-location-search]"
        )
      ) {
        setShowSuggestions(false);
        setSearchFocused(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
    };
  }, []);

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      className="
        relative
        z-[50]
        isolate
        overflow-visible
        bg-[#071b16]
        text-white
      "
    >
      {/* ======================================================
          BACKGROUND / DECORATIVE LAYER

          This layer remains clipped.

          The actual hero section does NOT use overflow-hidden,
          so the search suggestions can extend beyond it.
      ====================================================== */}

      <div
        className="
          absolute
          inset-0
          overflow-hidden
          pointer-events-none
          rounded-b-[36px]
        "
      >
        {/* BACKGROUND IMAGE */}

        <img
          src="/locations-hero.png"
          alt=""
          aria-hidden="true"
          className="
            absolute
            inset-0
            w-full
            h-full
            object-cover
            opacity-[0.27]
          "
          onError={(event) => {
            event.currentTarget.style.display =
              "none";
          }}
        />

        {/* DARK OVERLAY */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#061713]
            via-[#071b16]/95
            to-[#071b16]/58
          "
        />

        {/* BOTTOM FADE */}

        <div
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-[#071b16]
            via-[#071b16]/15
            to-[#071b16]/25
          "
        />

        {/* LARGE GOLD GLOW */}

        <div
          className="
            absolute
            right-[4%]
            top-[3%]
            w-[540px]
            h-[540px]
            rounded-full
            bg-[#c89d58]/[0.10]
            blur-[150px]
          "
        />

        {/* GREEN GLOW */}

        <div
          className="
            absolute
            left-[-220px]
            bottom-[-240px]
            w-[620px]
            h-[620px]
            rounded-full
            bg-[#2b7660]/[0.18]
            blur-[150px]
          "
        />

        {/* SECOND GOLD GLOW */}

        <div
          className="
            absolute
            right-[-120px]
            bottom-[-180px]
            w-[420px]
            h-[420px]
            rounded-full
            bg-[#c89d58]/[0.055]
            blur-[120px]
          "
        />

        {/* RADIAL GOLD HIGHLIGHT */}

        <div
          className="
            absolute
            inset-0
            bg-[radial-gradient(circle_at_72%_28%,rgba(200,157,88,0.13),transparent_32%)]
          "
        />

        {/* GRID */}

        <div
          className="
            absolute
            inset-0
            opacity-[0.035]
          "
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize:
              "80px 80px",
          }}
        />

        {/* RIGHT ORNAMENT */}

        <div
          className="
            absolute
            right-[8%]
            top-[26%]
            hidden
            lg:block
            w-[310px]
            h-[310px]
            rounded-full
            border
            border-[#c89d58]/[0.06]
          "
        />

        <div
          className="
            absolute
            right-[12%]
            top-[34%]
            hidden
            lg:block
            w-[180px]
            h-[180px]
            rounded-full
            border
            border-[#c89d58]/[0.05]
          "
        />
      </div>

      {/* ======================================================
          HERO CONTENT

          pt-40 is intentional.

          Your Navbar is visually overlaying the top of the
          hero, so the previous pt-24 was not sufficient.
      ====================================================== */}

      <div
        className="
          relative
          z-[60]
          max-w-[1440px]
          mx-auto
          px-5
          sm:px-8
          lg:px-12
          pt-32
          sm:pt-36
          lg:pt-40
          pb-16
          sm:pb-20
          lg:pb-24
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[minmax(0,1fr)_390px]
            gap-12
            lg:gap-20
            items-end
          "
        >
          {/* ==================================================
              LEFT SIDE
          ================================================== */}

          <div className="max-w-[820px]">
            {/* EYEBROW */}

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
                duration: 0.55,
              }}
              className="
                inline-flex
                items-center
                gap-3
                mb-6
              "
            >
              <span
                className="
                  w-9
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  to-[#c89d58]
                "
              />

              <span
                className="
                  text-[10px]
                  sm:text-[11px]
                  uppercase
                  tracking-[3px]
                  text-[#d8b46b]
                  font-semibold
                "
              >
                Explore Prime Locations
              </span>

              <span
                className="
                  w-1.5
                  h-1.5
                  rounded-full
                  bg-[#c89d58]
                  shadow-[0_0_12px_rgba(200,157,88,0.7)]
                "
              />
            </motion.div>

            {/* H1 */}

            <motion.h1
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                delay: 0.08,
              }}
              className="
                text-[39px]
                sm:text-[49px]
                md:text-[58px]
                lg:text-[65px]
                leading-[1.02]
                tracking-[-1.8px]
                text-white
                max-w-[760px]
              "
              style={{
                fontFamily:
                  "Georgia, 'Times New Roman', serif",
              }}
            >
              Find the Right
              <br />

              <span
                className="
                  text-transparent
                  bg-clip-text
                  bg-gradient-to-r
                  from-[#e8c982]
                  via-[#d4aa62]
                  to-[#b9863a]
                "
              >
                Location
              </span>

              <br />

              for Your Property
            </motion.h1>

            {/* DESCRIPTION */}

            <motion.p
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.65,
                delay: 0.18,
              }}
              className="
                mt-7
                max-w-[700px]
                text-[14px]
                sm:text-[15px]
                leading-[1.9]
                text-white/65
              "
            >
              Explore residential and investment
              locations across Gurgaon and other
              emerging real estate destinations.
              Discover established neighbourhoods,
              premium corridors, sectors and growing
              micro-markets to find the location that
              fits your property goals.
            </motion.p>

            {/* ==================================================
                SEARCH
            ================================================== */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
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
                relative
                z-[100]
                mt-9
                max-w-[720px]
              "
              data-location-search
            >
              {/* GLOW */}

              <div
                className="
                  absolute
                  -inset-[1px]
                  rounded-[23px]
                  bg-gradient-to-r
                  from-[#c89d58]/30
                  via-white/[0.05]
                  to-[#c89d58]/20
                  blur-lg
                  pointer-events-none
                "
              />

              {/* SEARCH BOX */}

              <div
                className={`
                  relative
                  z-[101]
                  flex
                  items-center
                  min-h-[66px]
                  sm:min-h-[70px]
                  rounded-[21px]
                  border
                  ${
                    searchFocused
                      ? "border-[#c89d58]/65 shadow-[0_0_0_1px_rgba(200,157,88,0.08),0_25px_80px_rgba(0,0,0,0.48)]"
                      : "border-white/[0.14]"
                  }
                  bg-[#071713]/[0.88]
                  backdrop-blur-2xl
                  overflow-visible
                  transition-all
                  duration-300
                `}
              >
                {/* ICON */}

                <div
                  className="
                    ml-4
                    sm:ml-5
                    w-10
                    h-10
                    shrink-0
                    rounded-[13px]
                    bg-gradient-to-br
                    from-[#c89d58]/[0.16]
                    to-[#c89d58]/[0.04]
                    border
                    border-[#c89d58]/25
                    flex
                    items-center
                    justify-center
                  "
                >
                  <Search
                    size={17}
                    strokeWidth={1.8}
                    className="text-[#d4aa62]"
                  />
                </div>

                {/* INPUT */}

                <input
                  type="text"
                  value={searchTerm}
                  onChange={
                    handleSearchChange
                  }
                  onFocus={() => {
                    setSearchFocused(true);
                    setShowSuggestions(true);
                  }}
                  onKeyDown={
                    handleSearchKeyDown
                  }
                  placeholder="Search a city, locality, sector or corridor..."
                  aria-label="Search locations"
                  autoComplete="off"
                  className="
                    min-w-0
                    flex-1
                    h-[66px]
                    sm:h-[70px]
                    px-4
                    bg-transparent
                    outline-none
                    text-[13px]
                    sm:text-[14px]
                    text-white
                    placeholder:text-white/30
                  "
                />

                {/* CLEAR */}

                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="
                      w-8
                      h-8
                      mr-1
                      shrink-0
                      rounded-full
                      flex
                      items-center
                      justify-center
                      text-white/30
                      hover:text-white
                      hover:bg-white/10
                      transition-all
                    "
                    aria-label="Clear location search"
                  >
                    <X size={15} />
                  </button>
                )}

                {/* SEARCH */}

                <motion.button
                  type="button"
                  onClick={() =>
                    performSearch()
                  }
                  whileHover={{
                    scale: 1.035,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  className="
                    mr-2
                    w-[49px]
                    h-[49px]
                    shrink-0
                    rounded-[15px]
                    bg-gradient-to-b
                    from-[#ecd18a]
                    via-[#d4aa62]
                    to-[#b98436]
                    text-[#101713]
                    flex
                    items-center
                    justify-center
                    shadow-[0_12px_32px_rgba(200,157,88,0.30)]
                  "
                  aria-label="Search locations"
                >
                  <ArrowRight
                    size={18}
                    strokeWidth={2.1}
                  />
                </motion.button>
              </div>

              {/* ==================================================
                  SUGGESTIONS
              ================================================== */}

              <AnimatePresence>
                {showSuggestions &&
                  searchFocused &&
                  suggestions.length > 0 && (
                    <motion.div
  initial={{
    opacity: 0,
    y: 7,
    scale: 0.99,
  }}
  animate={{
    opacity: 1,
    y: 0,
    scale: 1,
  }}
  exit={{
    opacity: 0,
    y: 6,
    scale: 0.99,
  }}
  transition={{
    duration: 0.18,
    ease: "easeOut",
  }}
  className="
    absolute
    top-[calc(100%+8px)]
    left-0
    right-0
    z-[999999]
    overflow-hidden
    rounded-[18px]
    border
    border-[#c89d58]/20
    bg-[#07110e]/[0.99]
    backdrop-blur-3xl
    shadow-[0_25px_70px_rgba(0,0,0,0.72)]
  "
  data-location-search
>
  {/* TOP GOLD LINE */}

  <div
    className="
      absolute
      top-0
      left-7
      right-7
      h-px
      bg-gradient-to-r
      from-transparent
      via-[#c89d58]/65
      to-transparent
    "
  />

  {/* HEADER */}

  <div
    className="
      flex
      items-center
      justify-between
      px-4
      sm:px-5
      py-3
      border-b
      border-white/[0.07]
    "
  >
    <div
      className="
        flex
        items-center
        gap-2.5
      "
    >
      <div
        className="
          w-6
          h-6
          rounded-[8px]
          bg-[#c89d58]/[0.09]
          border
          border-[#c89d58]/20
          flex
          items-center
          justify-center
        "
      >
        <Sparkles
          size={11}
          className="text-[#d4aa62]"
        />
      </div>

      <div>
        <p
          className="
            text-[8px]
            uppercase
            tracking-[2px]
            text-[#d4aa62]
            font-semibold
          "
        >
          {searchTerm
            ? "Matching Locations"
            : "Explore Locations"}
        </p>

        <p
          className="
            mt-0.5
            text-[8px]
            text-white/30
          "
        >
          Select a location to explore
        </p>
      </div>
    </div>

    <span
      className="
        text-[8px]
        uppercase
        tracking-[1.3px]
        text-white/30
      "
    >
      {suggestions.length}{" "}
      {suggestions.length === 1
        ? "result"
        : "results"}
    </span>
  </div>

  {/* RESULTS */}

  <div
    className="
      max-h-[245px]
      overflow-y-auto
      overscroll-contain
    "
    style={{
      scrollbarWidth: "thin",
      scrollbarColor:
        "rgba(200,157,88,0.35) transparent",
    }}
  >
    {suggestions.map(
      (location, index) => (
        <button
          key={
            location?._id ||
            `${location.__path}-${index}`
          }
          type="button"
          onClick={() =>
            handleSelectLocation(location)
          }
          className="
            group
            relative
            w-full
            text-left
            px-4
            sm:px-5
            py-2.5
            border-b
            border-white/[0.045]
            last:border-none
            hover:bg-white/[0.035]
            transition-all
          "
        >
          {/* LEFT ACCENT */}

          <span
            className="
              absolute
              left-0
              top-0
              bottom-0
              w-[2px]
              bg-[#c89d58]
              opacity-0
              group-hover:opacity-100
              transition-opacity
            "
          />

          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            {/* NUMBER */}

            <span
              className="
                hidden
                sm:block
                w-4
                text-[8px]
                text-white/15
                font-medium
              "
            >
              {String(index + 1).padStart(
                2,
                "0"
              )}
            </span>

            {/* LOCATION ICON */}

            <div
              className="
                w-8
                h-8
                shrink-0
                rounded-[9px]
                border
                border-[#c89d58]/20
                bg-[#c89d58]/[0.06]
                flex
                items-center
                justify-center
                group-hover:border-[#c89d58]/40
                group-hover:bg-[#c89d58]/[0.11]
                transition-all
              "
            >
              <MapPin
                size={13}
                strokeWidth={1.8}
                className="text-[#d4aa62]"
              />
            </div>

            {/* LOCATION TEXT */}

            <div className="min-w-0 flex-1">
              <p
                className="
                  text-[12px]
                  sm:text-[13px]
                  font-medium
                  text-white
                  truncate
                  group-hover:text-[#d4aa62]
                  transition-colors
                "
              >
                {location.__name}
              </p>

              <p
                className="
                  mt-0.5
                  text-[9px]
                  text-white/25
                  truncate
                "
              >
                {location.__path}
              </p>
            </div>

            {/* ARROW */}

            <div
              className="
                w-6
                h-6
                shrink-0
                rounded-full
                border
                border-white/[0.06]
                flex
                items-center
                justify-center
                group-hover:border-[#c89d58]/25
                transition-all
              "
            >
              <ChevronRight
                size={12}
                className="
                  text-white/20
                  group-hover:text-[#c89d58]
                  group-hover:translate-x-0.5
                  transition-all
                "
              />
            </div>
          </div>
        </button>
      )
    )}
  </div>

  {/* FOOTER */}

  <div
    className="
      px-4
      sm:px-5
      py-2.5
      border-t
      border-white/[0.05]
      bg-white/[0.012]
    "
  >
    <div
      className="
        flex
        items-center
        gap-2
        text-[7px]
        uppercase
        tracking-[1.4px]
        text-white/20
      "
    >
      <Navigation
        size={9}
        className="text-[#c89d58]"
      />

      Search by city, sector, locality
      or corridor
    </div>
  </div>
</motion.div>
                  )}
              </AnimatePresence>

              {/* ==================================================
                  NO RESULTS
              ================================================== */}

              <AnimatePresence>
                {showSuggestions &&
                  searchFocused &&
                  searchTerm &&
                  suggestions.length === 0 && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 8,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 8,
                      }}
                      className="
                        absolute
                        top-[calc(100%+12px)]
                        left-0
                        right-0
                        z-[999999]
                        rounded-[22px]
                        border
                        border-white/10
                        bg-[#07110e]/[0.99]
                        backdrop-blur-3xl
                        shadow-[0_35px_100px_rgba(0,0,0,0.82)]
                        overflow-hidden
                      "
                      data-location-search
                    >
                      <div
                        className="
                          p-8
                          sm:p-10
                          text-center
                        "
                      >
                        <div
                          className="
                            mx-auto
                            w-12
                            h-12
                            rounded-[15px]
                            border
                            border-[#c89d58]/20
                            bg-[#c89d58]/[0.07]
                            flex
                            items-center
                            justify-center
                          "
                        >
                          <MapPin
                            size={18}
                            className="text-[#c89d58]"
                          />
                        </div>

                        <p
                          className="
                            mt-4
                            text-[13px]
                            text-white/65
                          "
                        >
                          No matching
                          locations found
                        </p>

                        <p
                          className="
                            mt-2
                            text-[10px]
                            leading-5
                            text-white/25
                          "
                        >
                          Try searching for a
                          city, sector,
                          locality or corridor.
                        </p>
                      </div>
                    </motion.div>
                  )}
              </AnimatePresence>
            </motion.div>

            {/* SEARCH SUPPORT */}

            <div
              className="
                mt-3
                flex
                items-center
                justify-between
                gap-4
                px-2
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-[9px]
                  uppercase
                  tracking-[1.5px]
                  text-white/30
                "
              >
                <MapPin
                  size={11}
                  className="text-[#c89d58]"
                />

                <span>
                  Search Gurgaon sectors,
                  corridors & neighbourhoods
                </span>
              </div>

              <span
                className="
                  hidden
                  sm:block
                  text-[9px]
                  uppercase
                  tracking-[1.5px]
                  text-white/20
                  whitespace-nowrap
                "
              >
                Press Enter ↵
              </span>
            </div>
          </div>

          {/* ==================================================
              DESKTOP DIRECTORY CARD
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 24,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.7,
              delay: 0.38,
            }}
            className="
              relative
              hidden
              lg:block
            "
          >
            {/* GLOW */}

            <div
              className="
                absolute
                -inset-5
                rounded-[36px]
                bg-[#c89d58]/[0.045]
                blur-2xl
                pointer-events-none
              "
            />

            {/* CARD */}

            <div
              className="
                relative
                rounded-[28px]
                border
                border-white/[0.10]
                bg-[#081914]/[0.68]
                backdrop-blur-2xl
                shadow-[0_30px_90px_rgba(0,0,0,0.35)]
                overflow-hidden
              "
            >
              {/* GOLD LINE */}

              <div
                className="
                  absolute
                  top-0
                  left-10
                  right-10
                  h-px
                  bg-gradient-to-r
                  from-transparent
                  via-[#c89d58]/60
                  to-transparent
                "
              />

              {/* INTRO */}

              <div className="p-7 pb-6">
                <div
                  className="
                    flex
                    items-center
                    justify-between
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-2
                    "
                  >
                    <div
                      className="
                        w-8
                        h-8
                        rounded-[10px]
                        border
                        border-[#c89d58]/20
                        bg-[#c89d58]/[0.08]
                        flex
                        items-center
                        justify-center
                      "
                    >
                      <Navigation
                        size={14}
                        className="text-[#d4aa62]"
                      />
                    </div>

                    <span
                      className="
                        text-[9px]
                        uppercase
                        tracking-[2px]
                        text-[#d4aa62]
                        font-semibold
                      "
                    >
                      Location Directory
                    </span>
                  </div>

                  <span
                    className="
                      w-2
                      h-2
                      rounded-full
                      bg-[#c89d58]
                      shadow-[0_0_12px_rgba(200,157,88,0.7)]
                    "
                  />
                </div>

                <h2
                  className="
                    mt-5
                    text-[24px]
                    leading-[1.15]
                    text-white
                  "
                  style={{
                    fontFamily:
                      "Georgia, 'Times New Roman', serif",
                  }}
                >
                  Explore markets
                  <br />
                  with{" "}
                  <span className="text-[#d4aa62]">
                    context.
                  </span>
                </h2>

                <p
                  className="
                    mt-3
                    text-[11px]
                    leading-[1.8]
                    text-white/40
                  "
                >
                  Browse cities, sectors,
                  neighbourhoods and emerging
                  corridors through one
                  connected location directory.
                </p>
              </div>

              {/* DIVIDER */}

              <div className="h-px bg-white/[0.06]" />

              {/* STATS */}

              <div className="grid grid-cols-2">
                {/* LOCATIONS */}

                <div
                  className="
                    p-6
                    border-r
                    border-white/[0.06]
                  "
                >
                  <div
                    className="
                      w-9
                      h-9
                      rounded-[11px]
                      border
                      border-[#c89d58]/20
                      bg-[#c89d58]/[0.07]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <MapPin
                      size={15}
                      className="text-[#d4aa62]"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-[22px]
                      font-semibold
                      text-white
                    "
                  >
                    {totalLocations || "—"}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      uppercase
                      tracking-[1.7px]
                      text-white/35
                    "
                  >
                    Locations
                  </p>
                </div>

                {/* MARKETS */}

                <div className="p-6">
                  <div
                    className="
                      w-9
                      h-9
                      rounded-[11px]
                      border
                      border-[#c89d58]/20
                      bg-[#c89d58]/[0.07]
                      flex
                      items-center
                      justify-center
                    "
                  >
                    <Navigation
                      size={15}
                      className="text-[#d4aa62]"
                    />
                  </div>

                  <p
                    className="
                      mt-4
                      text-[22px]
                      font-semibold
                      text-white
                    "
                  >
                    {rootLocationCount || "—"}
                  </p>

                  <p
                    className="
                      mt-1
                      text-[8px]
                      uppercase
                      tracking-[1.7px]
                      text-white/35
                    "
                  >
                    Prime Markets
                  </p>
                </div>
              </div>

              {/* OPPORTUNITY */}

              <div
                className="
                  mx-5
                  mb-5
                  rounded-[17px]
                  border
                  border-[#c89d58]/10
                  bg-[#c89d58]/[0.045]
                  px-4
                  py-3.5
                  flex
                  items-center
                  gap-3
                "
              >
                <div
                  className="
                    w-8
                    h-8
                    shrink-0
                    rounded-[10px]
                    bg-[#c89d58]/[0.08]
                    border
                    border-[#c89d58]/15
                    flex
                    items-center
                    justify-center
                  "
                >
                  <TrendingUp
                    size={14}
                    className="text-[#d4aa62]"
                  />
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      text-[13px]
                      font-semibold
                      text-white
                    "
                  >
                    1000+
                  </p>

                  <p
                    className="
                      mt-0.5
                      text-[8px]
                      uppercase
                      tracking-[1.4px]
                      text-white/30
                    "
                  >
                    Property Opportunities
                  </p>
                </div>

                <ArrowRight
                  size={14}
                  className="
                    ml-auto
                    text-[#c89d58]/50
                  "
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* ======================================================
            MOBILE STATS
        ====================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.38,
          }}
          className="
            lg:hidden
            mt-10
            grid
            grid-cols-3
            gap-2
          "
        >
          {/* LOCATIONS */}

          <div
            className="
              rounded-[18px]
              border
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
              px-3
              py-4
            "
          >
            <div
              className="
                w-8
                h-8
                rounded-[10px]
                border
                border-[#c89d58]/20
                bg-[#c89d58]/[0.07]
                flex
                items-center
                justify-center
              "
            >
              <MapPin
                size={14}
                className="text-[#d4aa62]"
              />
            </div>

            <p
              className="
                mt-3
                text-[18px]
                font-semibold
                text-white
              "
            >
              {totalLocations || "—"}
            </p>

            <p
              className="
                mt-0.5
                text-[7px]
                uppercase
                tracking-[1.2px]
                text-white/35
              "
            >
              Locations
            </p>
          </div>

          {/* MARKETS */}

          <div
            className="
              rounded-[18px]
              border
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
              px-3
              py-4
            "
          >
            <div
              className="
                w-8
                h-8
                rounded-[10px]
                border
                border-[#c89d58]/20
                bg-[#c89d58]/[0.07]
                flex
                items-center
                justify-center
              "
            >
              <Navigation
                size={14}
                className="text-[#d4aa62]"
              />
            </div>

            <p
              className="
                mt-3
                text-[18px]
                font-semibold
                text-white
              "
            >
              {rootLocationCount || "—"}
            </p>

            <p
              className="
                mt-0.5
                text-[7px]
                uppercase
                tracking-[1.2px]
                text-white/35
              "
            >
              Markets
            </p>
          </div>

          {/* OPPORTUNITIES */}

          <div
            className="
              rounded-[18px]
              border
              border-white/[0.08]
              bg-white/[0.025]
              backdrop-blur-xl
              px-3
              py-4
            "
          >
            <div
              className="
                w-8
                h-8
                rounded-[10px]
                border
                border-[#c89d58]/20
                bg-[#c89d58]/[0.07]
                flex
                items-center
                justify-center
              "
            >
              <TrendingUp
                size={14}
                className="text-[#d4aa62]"
              />
            </div>

            <p
              className="
                mt-3
                text-[18px]
                font-semibold
                text-white
              "
            >
              1000+
            </p>

            <p
              className="
                mt-0.5
                text-[7px]
                uppercase
                tracking-[1.2px]
                text-white/35
              "
            >
              Opportunities
            </p>
          </div>
        </motion.div>
      </div>

      {/* ======================================================
          BOTTOM EDGE
      ====================================================== */}

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          z-[70]
          h-px
          bg-gradient-to-r
          from-transparent
          via-[#c89d58]/60
          to-transparent
          pointer-events-none
        "
      />
    </section>
  );
}