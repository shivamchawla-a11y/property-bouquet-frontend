"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Menu,
  X,
  ChevronDown,
  Phone,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// =========================================================
// NAVIGATION ITEMS
// =========================================================

const navItems = [
  {
    title: "Properties",
    key: "properties",
    href: "/properties",
  },

  {
    title: "Locations",
    key: "locations",
    href: "/locations",
  },

  {
    title: "Developers",
    key: "developers",
    href: "/developers",
  },

  {
    title: "Knowledge Centre",
    key: "knowledge",
    href: "/knowledge",
    items: [
      "Buying Guides",
      "Home Loans",
      "Legal Guides",
      "Investment Guides",
    ],
  },

  {
    title: "Property Insights",
    key: "insights",
    href: "/insights",
    items: [
      "Market Reports",
      "Luxury News",
      "Investment Trends",
    ],
  },

  {
    title: "Tools",
    key: "tools",
    href: "/#tools",
    items: [
      "ROI Calculator",
      "Area Converter",
    ],
  },

  {
    title: "About Us",
    key: "about",
    href: "/about",
  },

  {
    title: "Contact",
    key: "contact",
    href: "/contact",
  },
];

// =========================================================
// PUBLIC DEVELOPER URL
//
// Examples:
//
// m3m
// → /developers/m3m-developer-projects
//
// signature-global
// → /developers/signature-global-developer-projects
//
// spiti-developer
// → /developers/spiti-developer-projects
//
// spiti-developers
// → /developers/spiti-developers-projects
//
// spiti-developer-projects
// → unchanged
//
// spiti-developers-projects
// → unchanged
// =========================================================

const getDeveloperProjectUrl = (slug) => {
  if (!slug) {
    return "/developers";
  }

  const cleanSlug = String(slug)
    .toLowerCase()
    .trim()
    .replace(/^\/+|\/+$/g, "");

  if (!cleanSlug) {
    return "/developers";
  }

  // Already complete public URL
  if (
    cleanSlug.endsWith("-developer-projects") ||
    cleanSlug.endsWith("-developers-projects")
  ) {
    return `/developers/${cleanSlug}`;
  }

  // Backend slug already ends with "-developer"
  if (cleanSlug.endsWith("-developer")) {
    return `/developers/${cleanSlug}-projects`;
  }

  // Backend slug already ends with "-developers"
  if (cleanSlug.endsWith("-developers")) {
    return `/developers/${cleanSlug}-projects`;
  }

  // Normal backend slug
  return `/developers/${cleanSlug}-developer-projects`;
};

// =========================================================
// LOCATION PREPOSITION
//
// Roads / Expressways / Highways etc.
// → "on"
//
// Sectors / Cities / Localities etc.
// → "in"
// =========================================================

const getLocationPreposition = (location) => {
  const name = String(location?.name || "")
    .trim()
    .toLowerCase();

  const slug = String(location?.slug || "")
    .trim()
    .toLowerCase();

  const value = `${name} ${slug}`;

  const onKeywords = [
    "expressway",
    "express way",
    "highway",
    "road",
    "street",
    "avenue",
    "boulevard",
    "drive",
    "marg",
  ];

  return onKeywords.some((keyword) =>
    value.includes(keyword)
  )
    ? "on"
    : "in";
};

// =========================================================
// LOCATION SLUGIFY
// =========================================================

const slugifyLocation = (value) => {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

// =========================================================
// FIND LOCATION + MOST-PARENT LOCATION
//
// IMPORTANT:
//
// The /api/locations/tree endpoint already contains
// the hierarchy through "children".
//
// Example:
//
// Gurgaon
//   └── Farukhnagar
//
// When Farukhnagar is found:
//
// {
//   location: Farukhnagar,
//   root: Gurgaon
// }
//
// This is more reliable than trying to use
// location.parent on the frontend.
// =========================================================

const findLocationInTree = (
  tree,
  locationName,
  root = null
) => {
  if (!Array.isArray(tree)) {
    return null;
  }

  const target = String(locationName || "")
    .trim()
    .toLowerCase();

  for (const location of tree) {
    // The first location at the current hierarchy level
    // becomes the most-parent/root location.
    const currentRoot = root || location;

    const currentName = String(
      location?.name || ""
    )
      .trim()
      .toLowerCase();

    // Found requested location
    if (currentName === target) {
      return {
        location,
        root: currentRoot,
      };
    }

    // Search children recursively
    const found = findLocationInTree(
      location?.children || [],
      locationName,
      currentRoot
    );

    if (found) {
      return found;
    }
  }

  return null;
};

// =========================================================
// PUBLIC LOCATION SEO URL
//
// CURRENT LOCATION + MOST-PARENT LOCATION ONLY
//
// Examples:
//
// Gurgaon
// → /locations/properties-in-gurgaon
//
// Farukhnagar
// → /locations/properties-in-farukhnagar-gurgaon
//
// Sector 56
// → /locations/properties-in-sector-56-gurgaon
//
// Golf Course Road
// → /locations/properties-on-golf-course-road-gurgaon
//
// Dwarka Expressway
// → /locations/properties-on-dwarka-expressway-gurgaon
//
// IMPORTANT:
//
// Intermediate parents are NOT included.
// =========================================================

const getPublicLocationUrl = (
  location,
  root = null
) => {
  if (!location) {
    return "/locations";
  }

  const currentSlug = slugifyLocation(
    location.slug ||
      location.name ||
      ""
  );

  if (!currentSlug) {
    return "/locations";
  }

  const rootSlug = slugifyLocation(
    root?.slug ||
      root?.name ||
      ""
  );

  const preposition =
    getLocationPreposition(location);

  // -------------------------------------------------------
  // Child location
  //
  // Current + most-parent
  //
  // Farukhnagar + Gurgaon
  // -------------------------------------------------------

  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  // -------------------------------------------------------
  // Root location
  //
  // Gurgaon
  // → /locations/properties-in-gurgaon
  // -------------------------------------------------------

  return `/locations/properties-${preposition}-${currentSlug}`;
};

// =========================================================
// NAVBAR
// =========================================================

export default function Navbar({
  onConsultationClick,
  forceSolid = false,
}) {
  const router = useRouter();

  const [active, setActive] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [accountDropdown, setAccountDropdown] =
    useState(false);

  const [mobileDropdown, setMobileDropdown] =
    useState(null);

  const [locations, setLocations] = useState([]);
  const [locationTree, setLocationTree] = useState([]);

  const [developers, setDevelopers] = useState([]);

  const [propertyTypes, setPropertyTypes] =
    useState([]);

  const [properties, setProperties] =
    useState([]);

  const [showLocationModal, setShowLocationModal] =
    useState(false);

  const [locationSearch, setLocationSearch] =
    useState("");

  const [showDeveloperModal, setShowDeveloperModal] =
    useState(false);

  const [developerSearch, setDeveloperSearch] =
    useState("");

  // =========================================================
  // SCROLL
  // =========================================================

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  const lightNavbar =
    forceSolid || scrolled;

  // =========================================================
  // FETCH PROPERTIES / LOCATIONS / DEVELOPERS
  // =========================================================

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch(
          "/api/properties"
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            `Failed to fetch properties: ${res.status}`
          );
        }

        const propertyData =
          data?.data || [];

        setProperties(propertyData);

        // =====================================================
        // LOCATION TREE
        // =====================================================

        try {
          const locationRes =
            await fetch(
              "/api/locations/tree"
            );

          const locationData =
            await locationRes.json();

          if (locationRes.ok) {
            setLocationTree(
              locationData?.data || []
            );
          }
        } catch (locationError) {
          console.error(
            "Navbar location tree error:",
            locationError
          );
        }

        // =====================================================
        // LOCATIONS
        //
        // Existing location names are preserved.
        // This does NOT change location search/filter logic.
        // =====================================================

        const uniqueLocations = [
          ...new Set(
            propertyData.flatMap(
              (property) => {
                const location =
                  property
                    ?.locationData
                    ?.locationName;

                if (!location) {
                  return [];
                }

                return location
                  .split(">")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean);
              }
            )
          ),
        ].sort();

        setLocations(
          uniqueLocations
        );

        // =====================================================
        // DEVELOPERS
        //
        // Sorted by:
        // 1. Property count
        // 2. Alphabetical tie-break
        // =====================================================

        const developerMap =
          new Map();

        propertyData.forEach(
          (property) => {
            const developerName =
              property
                ?.coreDetails
                ?.developerName;

            if (!developerName) {
              return;
            }

            const developer =
              property
                ?.coreDetails
                ?.developerRef;

            const existing =
              developerMap.get(
                developerName
              );

            // -------------------------------------------------
            // Existing developer
            // -------------------------------------------------

            if (existing) {
              existing.propertyCount += 1;
              return;
            }

            // -------------------------------------------------
            // Developer slug
            // -------------------------------------------------

            const developerSlug =
              developer?.slug ||
              developerName
                .toLowerCase()
                .trim()
                .replace(
                  /[^a-z0-9]+/g,
                  "-"
                )
                .replace(
                  /^-+|-+$/g,
                  "");

            // -------------------------------------------------
            // First property for developer
            // -------------------------------------------------

            developerMap.set(
              developerName,
              {
                name: developerName,

                slug: developerSlug,

                logo:
                  developer?.logo ||
                  developer?.image ||
                  property
                    .coreDetails
                    ?.developerLogo ||
                  property
                    .coreDetails
                    ?.developerImage ||
                  "/placeholder.png",

                propertyCount: 1,
              }
            );
          }
        );

        // -----------------------------------------------------
        // SORT DEVELOPERS
        // -----------------------------------------------------

        const uniqueDevelopers =
          Array.from(
            developerMap.values()
          ).sort(
            (a, b) =>
              b.propertyCount -
                a.propertyCount ||
              a.name.localeCompare(
                b.name
              )
          );

        setDevelopers(
          uniqueDevelopers
        );

        // =====================================================
        // PROPERTY TYPES
        // =====================================================

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
          ),
        ].sort();

        setPropertyTypes(
          uniqueCategories
        );
      } catch (err) {
        console.error(
          "Navbar property fetch error:",
          err
        );
      }
    };

    fetchProperties();
  }, []);

  // =========================================================
  // MOBILE ITEMS
  // =========================================================

  const mobileItems =
    navItems.map((item) => {
      let items =
        item.items || [];

      if (
        item.key === "properties"
      ) {
        items = propertyTypes;
      }

      if (
        item.key === "locations"
      ) {
        items = [
          ...locations.slice(0, 5),
          "View All Locations →",
        ];
      }

      if (
        item.key === "developers"
      ) {
        items = [
          ...developers
            .slice(0, 5)
            .map(
              (developer) =>
                developer.name
            ),
          "View All Developers →",
        ];
      }

      return {
        ...item,
        items,
      };
    });

  // =========================================================
  // CLOSE MOBILE MENU
  // =========================================================

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    setMobileDropdown(null);
  };

  // =========================================================
  // MOBILE NAVIGATION
  // =========================================================

  const handleMobileNavigation = (
    item,
    sub
  ) => {
    // =======================================================
    // PROPERTIES
    // =======================================================

    if (
      item.key === "properties"
    ) {
      closeMobileMenu();

      router.push(
        `/properties?propertyType=${encodeURIComponent(
          sub
        )}`
      );

      return;
    }

    // =======================================================
    // LOCATIONS
    // =======================================================

    if (
      item.key === "locations"
    ) {
      // -----------------------------------------------------
      // VIEW ALL
      // -----------------------------------------------------

      if (
        sub ===
        "View All Locations →"
      ) {
        closeMobileMenu();

        setLocationSearch("");

        setShowLocationModal(
          true
        );

        return;
      }

      // -----------------------------------------------------
      // Find location and its
      // most-parent/root location
      // -----------------------------------------------------

      const locationData =
        findLocationInTree(
          locationTree,
          sub
        );

      closeMobileMenu();

      if (locationData) {
        router.push(
          getPublicLocationUrl(
            locationData.location,
            locationData.root
          )
        );
      } else {
        // Safe fallback
        router.push(
          `/properties?location=${encodeURIComponent(
            sub
          )}`
        );
      }

      return;
    }

    // =======================================================
    // DEVELOPERS
    // =======================================================

    if (
      item.key === "developers"
    ) {
      // -----------------------------------------------------
      // VIEW ALL
      // -----------------------------------------------------

      if (
        sub ===
        "View All Developers →"
      ) {
        closeMobileMenu();

        setDeveloperSearch("");

        setShowDeveloperModal(
          true
        );

        return;
      }

      // -----------------------------------------------------
      // Find developer
      // -----------------------------------------------------

      const developer =
        developers.find(
          (item) =>
            item.name === sub
        );

      closeMobileMenu();

      if (developer?.slug) {
        router.push(
          getDeveloperProjectUrl(
            developer.slug
          )
        );
      }

      return;
    }

    // =======================================================
    // KNOWLEDGE CENTRE
    // =======================================================

    if (
      item.key === "knowledge"
    ) {
      closeMobileMenu();

      router.push("/knowledge");

      return;
    }

    // =======================================================
    // PROPERTY INSIGHTS
    // =======================================================

    if (
      item.key === "insights"
    ) {
      closeMobileMenu();

      router.push("/insights");

      return;
    }

    // =======================================================
    // TOOLS
    // =======================================================

    if (
      item.key === "tools"
    ) {
      const routes = {
        "ROI Calculator":
          "/tools/roi-calculator",

        "Area Converter":
          "/tools/area-converter",
      };

      const route =
        routes[sub];

      if (route) {
        closeMobileMenu();

        router.push(route);
      }

      return;
    }
  };

  // =========================================================
  // MOBILE MAIN ITEM CLICK
  // =========================================================

  const handleMobileItemClick = (
    item
  ) => {
    // -------------------------------------------------------
    // TOOLS
    // -------------------------------------------------------

    if (
      item.key === "tools"
    ) {
      closeMobileMenu();

      router.push("/#tools");

      return;
    }

    // -------------------------------------------------------
    // DIRECT LINKS
    // -------------------------------------------------------

    if (
      item.key === "about" ||
      item.key === "contact"
    ) {
      closeMobileMenu();

      router.push(
        item.href
      );

      return;
    }

    // -------------------------------------------------------
    // No dropdown
    // -------------------------------------------------------

    if (
      !item.items ||
      item.items.length === 0
    ) {
      closeMobileMenu();

      router.push(
        item.href || "/"
      );

      return;
    }

    // -------------------------------------------------------
    // Toggle dropdown
    // -------------------------------------------------------

    setMobileDropdown(
      mobileDropdown ===
        item.title
        ? null
        : item.title
    );
  };

  // =========================================================
  // DESKTOP DROPDOWN ITEMS
  // =========================================================

  const getDesktopDropdownItems = (
    item
  ) => {
    let dropdownItems =
      item.items || [];

    if (
      item.key === "properties"
    ) {
      dropdownItems =
        propertyTypes;
    }

    if (
      item.key === "locations"
    ) {
      dropdownItems = [
        ...locations.slice(0, 5),
        "View All Locations →",
      ];
    }

    if (
      item.key === "developers"
    ) {
      dropdownItems = [
        ...developers
          .slice(0, 5)
          .map(
            (developer) =>
              developer.name
          ),
        "View All Developers →",
      ];
    }

    return dropdownItems;
  };

  // =========================================================
  // DESKTOP DROPDOWN CLICK
  // =========================================================

  const handleDesktopSubNavigation = (
    item,
    sub
  ) => {
    // =======================================================
    // PROPERTIES
    // =======================================================

    if (
      item.key === "properties"
    ) {
      router.push(
        `/properties?propertyType=${encodeURIComponent(
          sub
        )}`
      );

      return;
    }

    // =======================================================
    // LOCATIONS
    // =======================================================

    if (
      item.key === "locations"
    ) {
      // -----------------------------------------------------
      // VIEW ALL
      // -----------------------------------------------------

      if (
        sub ===
        "View All Locations →"
      ) {
        setLocationSearch("");

        setShowLocationModal(
          true
        );

        setActive(null);

        return;
      }

      // -----------------------------------------------------
      // Find location + root
      // -----------------------------------------------------

      const locationData =
        findLocationInTree(
          locationTree,
          sub
        );

      if (locationData) {
        router.push(
          getPublicLocationUrl(
            locationData.location,
            locationData.root
          )
        );
      } else {
        // Safe fallback
        router.push(
          `/properties?location=${encodeURIComponent(
            sub
          )}`
        );
      }

      setActive(null);

      return;
    }

    // =======================================================
    // DEVELOPERS
    // =======================================================

    if (
      item.key === "developers"
    ) {
      // -----------------------------------------------------
      // VIEW ALL
      // -----------------------------------------------------

      if (
        sub ===
        "View All Developers →"
      ) {
        setDeveloperSearch("");

        setShowDeveloperModal(
          true
        );

        setActive(null);

        return;
      }

      // -----------------------------------------------------
      // Find developer
      // -----------------------------------------------------

      const developer =
        developers.find(
          (item) =>
            item.name === sub
        );

      if (developer?.slug) {
        router.push(
          getDeveloperProjectUrl(
            developer.slug
          )
        );
      }

      setActive(null);

      return;
    }

    // =======================================================
    // KNOWLEDGE CENTRE
    // =======================================================

    if (
      item.key === "knowledge"
    ) {
      router.push(
        "/knowledge"
      );

      setActive(null);

      return;
    }

    // =======================================================
    // PROPERTY INSIGHTS
    // =======================================================

    if (
      item.key === "insights"
    ) {
      router.push(
        "/insights"
      );

      setActive(null);

      return;
    }

    // =======================================================
    // TOOLS
    // =======================================================

    if (
      item.key === "tools"
    ) {
      const routes = {
        "ROI Calculator":
          "/tools/roi-calculator",

        "Area Converter":
          "/tools/area-converter",
      };

      const route =
        routes[sub];

      if (route) {
        router.push(
          route
        );
      }

      setActive(null);

      return;
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <header
      className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
        lightNavbar
          ? "bg-[#0b0b0b]/90 backdrop-blur-xl border-b border-white/10"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-[1450px] mx-auto px-5 xl:px-8">
        <div className="h-[72px] flex items-center justify-between">

          {/* ================================================= */}
          {/* LEFT */}
          {/* ================================================= */}

          <div className="flex items-center gap-10">

            {/* ================================================= */}
            {/* LOGO */}
            {/* ================================================= */}

            <Link
              href="/"
              className="
                flex
                items-center
                gap-4
                shrink-0
                group
                transition-all
                duration-500
              "
            >
              <Image
                src="/logo.webp"
                alt="Property Bouquet"
                width={52}
                height={52}
                priority
                className="
                  w-[46px]
                  h-[46px]
                  xl:w-[52px]
                  xl:h-[52px]
                  object-contain
                  transition-all
                  duration-500
                  group-hover:scale-105
                  drop-shadow-[0_6px_14px_rgba(0,0,0,.3)]
                "
              />

              <div className="flex flex-col leading-none">

                <h2
                  className="
                    text-[24px]
                    xl:text-[27px]
                    font-light
                    tracking-[0.08em]
                    text-white
                    uppercase
                    drop-shadow-[0_2px_12px_rgba(0,0,0,.35)]
                  "
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif",
                  }}
                >
                  PROPERTY
                </h2>

                <div className="flex items-center gap-3 shrink-0">

                  <div
                    className="
                      h-px
                      w-8
                      bg-gradient-to-r
                      from-transparent
                      via-[#D4AF37]
                      to-[#D4AF37]
                    "
                  />

                  <span
                    className="
                      mx-3
                      text-[#D4AF37]
                      text-[10px]
                      tracking-[0.38em]
                      uppercase
                      font-semibold
                    "
                  >
                    BOUQUET
                  </span>

                  <div
                    className="
                      h-px
                      flex-1
                      bg-gradient-to-l
                      from-transparent
                      via-[#D4AF37]
                      to-[#D4AF37]
                    "
                  />

                </div>
              </div>
            </Link>

            {/* ================================================= */}
            {/* DESKTOP MENU */}
            {/* ================================================= */}

            <nav className="hidden xl:flex items-center gap-[2px]">

              {navItems.map((item) => {
                const dropdownItems =
                  getDesktopDropdownItems(
                    item
                  );

                const hasDropdown =
                  dropdownItems.length >
                  0;

                return (
                  <div
                    key={item.title}
                    className="relative"
                    onMouseEnter={() =>
                      hasDropdown
                        ? setActive(
                            item.title
                          )
                        : setActive(null)
                    }
                    onMouseLeave={() =>
                      setActive(null)
                    }
                  >

                    {/* MENU TITLE */}

                    <div className="flex items-center h-9">

                      <Link
                        href={
                          item.href ??
                          "/"
                        }
                        className="
                          flex
                          items-center
                          text-white/85
                          hover:text-[#d6aa53]
                          transition
                          text-[10px]
                          xl:text-[11px]
                          font-medium
                          tracking-[0.08em]
                          pl-2.5
                        "
                      >
                        {item.title}
                      </Link>

                      {/* ONLY SHOW ARROW IF DROPDOWN */}

                      {hasDropdown && (
                        <button
                          type="button"
                          aria-label={`Open ${item.title} menu`}
                          onClick={() =>
                            setActive(
                              active ===
                                item.title
                                ? null
                                : item.title
                            )
                          }
                          className="
                            px-1
                            text-white/85
                            hover:text-[#d6aa53]
                          "
                        >
                          <ChevronDown
                            size={13}
                            className={`transition duration-300 ${
                              active ===
                              item.title
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      )}

                    </div>

                    {/* DESKTOP DROPDOWN */}

                    <AnimatePresence>
                      {hasDropdown &&
                        active ===
                          item.title && (
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 12,
                            }}
                            animate={{
                              opacity: 1,
                              y: 0,
                            }}
                            exit={{
                              opacity: 0,
                              y: 8,
                            }}
                            transition={{
                              duration: 0.2,
                            }}
                            className="
                              absolute
                              top-[48px]
                              left-0
                              w-[240px]
                            "
                          >
                            <div
                              className="
                                rounded-[22px]
                                border
                                border-white/10
                                bg-[#0b0b0b]/95
                                backdrop-blur-2xl
                                p-3
                                shadow-[0_20px_80px_rgba(0,0,0,0.4)]
                              "
                            >
                              <div className="space-y-1">

                                {dropdownItems.map(
                                  (sub) => (
                                    <button
                                      key={sub}
                                      type="button"
                                      onClick={() =>
                                        handleDesktopSubNavigation(
                                          item,
                                          sub
                                        )
                                      }
                                      className="
                                        w-full
                                        text-left
                                        px-4
                                        py-3
                                        rounded-xl
                                        text-white/75
                                        hover:bg-white/5
                                        hover:text-[#d6aa53]
                                        transition
                                        text-[13px]
                                      "
                                    >
                                      {sub}
                                    </button>
                                  )
                                )}

                              </div>
                            </div>
                          </motion.div>
                        )}
                    </AnimatePresence>

                  </div>
                );
              })}

            </nav>
          </div>

          {/* ================================================= */}
          {/* RIGHT */}
          {/* ================================================= */}

          <div className="flex items-center gap-3 relative">

            {/* ================================================= */}
            {/* CONSULTATION BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={
                onConsultationClick
              }
              className="
                hidden
                lg:flex
                items-center
                gap-2
                h-[44px]
                px-4
                rounded-xl
                bg-gradient-to-b
                from-[#d9b061]
                to-[#b8862e]
                text-black
                shadow-[0_10px_35px_rgba(0,0,0,0.35)]
                hover:scale-[1.03]
                transition
              "
            >
              <Phone
                size={16}
                strokeWidth={2.4}
              />

              <span className="font-bold text-[13px] tracking-[0.05em]">
                9090 106 101
              </span>
            </button>

            {/* ================================================= */}
            {/* DESKTOP ACCOUNT MENU */}
            {/* ================================================= */}

            <div className="relative hidden xl:block">

              <button
                type="button"
                onClick={() =>
                  setAccountDropdown(
                    !accountDropdown
                  )
                }
                className="
                  w-[46px]
                  h-[46px]
                  rounded-full
                  border
                  border-[#b8862e]/40
                  bg-black/30
                  backdrop-blur-xl
                  flex
                  items-center
                  justify-center
                  text-[#d9b061]
                  hover:bg-[#d9b061]
                  hover:text-black
                  transition-all
                  duration-300
                "
              >
                <Menu size={18} />
              </button>

              <AnimatePresence>
                {accountDropdown && (
                  <motion.div
                    initial={{
                      opacity: 0,
                      y: 10,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: 10,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                    className="
                      absolute
                      right-0
                      top-[58px]
                      w-[260px]
                      rounded-[24px]
                      border
                      border-white/10
                      bg-[#0b0b0b]/95
                      backdrop-blur-2xl
                      p-3
                      shadow-[0_20px_80px_rgba(0,0,0,0.45)]
                    "
                  >
                    <div className="space-y-3">

                      {/* PREMIUM CARD */}

                      <div
                        className="
                          rounded-2xl
                          border
                          border-[#d9b061]/20
                          bg-gradient-to-br
                          from-[#d9b061]/10
                          via-transparent
                          to-transparent
                          p-5
                        "
                      >
                        <p className="text-white text-base font-semibold">
                          Welcome to Property Bouquet
                        </p>

                        <p className="text-white/60 text-sm mt-2 leading-6">
                          India's luxury real estate marketplace
                          for premium buyers, investors and
                          property owners.
                        </p>
                      </div>

                      <Link
                        href="/auth"
                        className="
                          flex
                          items-center
                          justify-center
                          h-[48px]
                          rounded-xl
                          border
                          border-white/10
                          text-white
                          hover:bg-white/5
                          hover:text-[#d9b061]
                          transition
                        "
                      >
                        Login
                      </Link>

                      <Link
                        href="/auth"
                        className="
                          flex
                          items-center
                          justify-center
                          h-[48px]
                          rounded-xl
                          bg-white
                          text-black
                          font-semibold
                          hover:scale-[1.02]
                          transition
                        "
                      >
                        Create Account
                      </Link>

                      <Link
                        href="/contact"
                        className="
                          flex
                          items-center
                          justify-center
                          h-[48px]
                          rounded-xl
                          border
                          border-white/10
                          text-white
                          hover:bg-white/5
                          hover:text-[#d9b061]
                          transition
                        "
                      >
                        Contact Us
                      </Link>

                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* ================================================= */}
            {/* MOBILE MENU BUTTON */}
            {/* ================================================= */}

            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(
                  !mobileMenuOpen
                );

                setMobileDropdown(
                  null
                );
              }}
              className="
                xl:hidden
                w-[46px]
                h-[46px]
                rounded-full
                border
                border-[#b8862e]/40
                bg-black/30
                backdrop-blur-xl
                flex
                items-center
                justify-center
                text-[#d9b061]
                hover:bg-[#d9b061]
                hover:text-black
                transition-all
                duration-300
              "
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? (
                <X size={18} />
              ) : (
                <Menu size={18} />
              )}
            </button>

          </div>
        </div>
      </div>

      {/* ===================================================== */}
      {/* MOBILE MENU */}
      {/* ===================================================== */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* BACKDROP */}

            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              onClick={
                closeMobileMenu
              }
              className="
                fixed
                inset-0
                bg-black/70
                backdrop-blur-md
                z-[998]
                xl:hidden
              "
            />

            {/* DRAWER */}

            <motion.div
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                damping: 28,
                stiffness: 250,
              }}
              className="
                fixed
                top-0
                right-0
                h-screen
                w-[90%]
                max-w-[380px]
                bg-[#0b0b0b]
                border-l
                border-white/10
                z-[999]
                overflow-y-auto
                xl:hidden
              "
            >

              {/* HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-30
                  bg-[#0b0b0b]
                  border-b
                  border-white/10
                  px-6
                  py-5
                  flex
                  items-center
                  justify-between
                "
              >
                <h3
                  className="
                    text-white
                    font-semibold
                    text-lg
                  "
                >
                  Menu
                </h3>

                <button
                  type="button"
                  onClick={
                    closeMobileMenu
                  }
                  className="
                    w-10
                    h-10
                    rounded-full
                    bg-white/5
                    text-white
                    flex
                    items-center
                    justify-center
                  "
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>

              {/* NAV ITEMS */}

              <div className="p-4">

                {mobileItems.map(
                  (item) => {
                    const hasDropdown =
                      item.items &&
                      item.items.length >
                        0;

                    const isOpen =
                      mobileDropdown ===
                      item.title;

                    return (
                      <div
                        key={
                          item.title
                        }
                        className="border-b border-white/10"
                      >

                        {/* MAIN MOBILE ITEM */}

                        <button
                          type="button"
                          onClick={() =>
                            handleMobileItemClick(
                              item
                            )
                          }
                          className="
                            w-full
                            flex
                            items-center
                            justify-between
                            py-5
                            text-left
                            text-white
                            font-medium
                          "
                        >
                          <span>
                            {item.title}
                          </span>

                          {hasDropdown && (
                            <ChevronDown
                              size={15}
                              className={`transition duration-300 ${
                                isOpen
                                  ? "rotate-180 text-[#d6aa53]"
                                  : "text-white/70"
                              }`}
                            />
                          )}
                        </button>

                        {/* SUBMENU */}

                        <AnimatePresence>
                          {hasDropdown &&
                            isOpen && (
                              <motion.div
                                initial={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                animate={{
                                  height:
                                    "auto",
                                  opacity: 1,
                                }}
                                exit={{
                                  height: 0,
                                  opacity: 0,
                                }}
                                transition={{
                                  duration: 0.2,
                                }}
                                className="overflow-hidden pb-4"
                              >
                                {item.items.map(
                                  (sub) => (
                                    <button
                                      key={
                                        sub
                                      }
                                      type="button"
                                      onClick={() =>
                                        handleMobileNavigation(
                                          item,
                                          sub
                                        )
                                      }
                                      className="
                                        block
                                        w-full
                                        text-left
                                        px-4
                                        py-3
                                        rounded-xl
                                        text-white/70
                                        hover:bg-white/5
                                        hover:text-[#d6aa53]
                                        transition
                                      "
                                    >
                                      {sub}
                                    </button>
                                  )
                                )}
                              </motion.div>
                            )}
                        </AnimatePresence>

                      </div>
                    );
                  }
                )}

                {/* ================================================= */}
                {/* MOBILE CALL BUTTON */}
                {/* ================================================= */}

                <button
                  type="button"
                  onClick={
                    onConsultationClick
                  }
                  className="
                    w-full
                    mt-6
                    h-[52px]
                    rounded-xl
                    bg-gradient-to-b
                    from-[#d9b061]
                    to-[#b8862e]
                    text-black
                    shadow-[0_10px_35px_rgba(0,0,0,0.35)]
                    hover:scale-[1.02]
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >
                  <Phone
                    size={18}
                    strokeWidth={2.4}
                  />

                  <span className="font-bold text-[15px] tracking-[0.04em]">
                    +91 9090 106 101
                  </span>
                </button>

                {/* ================================================= */}
                {/* AUTH BUTTONS */}
                {/* ================================================= */}

                <div className="space-y-3 mt-6 mb-8">

                  <div className="grid grid-cols-2 gap-3">

                    <Link
                      href="/auth"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        h-[48px]
                        rounded-xl
                        border
                        border-white/10
                        flex
                        items-center
                        justify-center
                        text-white
                      "
                    >
                      Login
                    </Link>

                    <Link
                      href="/auth"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        h-[48px]
                        rounded-xl
                        bg-white
                        text-black
                        font-semibold
                        flex
                        items-center
                        justify-center
                      "
                    >
                      Sign Up
                    </Link>

                  </div>

                  <Link
                    href="/contact"
                    onClick={
                      closeMobileMenu
                    }
                    className="
                      h-[48px]
                      rounded-xl
                      border
                      border-white/10
                      flex
                      items-center
                      justify-center
                      text-white
                    "
                  >
                    Contact Us
                  </Link>

                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ===================================================== */}
      {/* DEVELOPER MODAL */}
      {/* ===================================================== */}

      <AnimatePresence>
        {showDeveloperModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[999999]
              bg-black/45
              backdrop-blur-[5px]
              flex
              items-start
              justify-center
              pt-[110px]
              pb-8
              px-4
            "
            onClick={() =>
              setShowDeveloperModal(
                false
              )
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                relative
                w-full
                max-w-[540px]
                rounded-[28px]
                border
                border-[#c89d58]/15
                bg-[#0b0b0b]
                shadow-[0_40px_120px_rgba(0,0,0,0.65)]
                overflow-hidden
              "
            >

              {/* GOLD TOP LINE */}

              <div
                className="
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-[#c89d58]
                  to-transparent
                "
              />

              {/* HEADER */}

              <div
                className="
                  sticky
                  top-0
                  z-20
                  bg-[#0b0b0b]
                  border-b
                  border-white/10
                  px-6
                  py-5
                "
              >
                <div className="flex items-start justify-between">

                  <div>

                    <p
                      className="
                        text-[#c89d58]
                        text-[10px]
                        uppercase
                        tracking-[3px]
                        mb-2
                      "
                    >
                      Developer Directory
                    </p>

                    <h3
                      className="
                        text-white
                        text-[22px]
                        font-semibold
                        leading-none
                      "
                    >
                      Select Developer
                    </h3>

                    <p
                      className="
                        text-white/45
                        text-[13px]
                        mt-2
                      "
                    >
                      Browse all developer partners
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowDeveloperModal(
                        false
                      )
                    }
                    className="
                      w-9
                      h-9
                      rounded-full
                      bg-white/5
                      hover:bg-white/10
                      text-white/60
                      transition-all
                      flex
                      items-center
                      justify-center
                    "
                  >
                    ✕
                  </button>

                </div>
              </div>

              {/* SEARCH */}

              <div
                className="
                  sticky
                  top-[104px]
                  z-10
                  bg-[#0b0b0b]
                  p-5
                  border-b
                  border-white/10
                "
              >
                <input
                  value={
                    developerSearch
                  }
                  onChange={(e) =>
                    setDeveloperSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search developer..."
                  className="
                    w-full
                    h-[50px]
                    rounded-[16px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-5
                    text-white
                    placeholder:text-white/35
                    outline-none
                    focus:border-[#c89d58]/40
                    transition-all
                  "
                />
              </div>

              {/* LIST */}

              <div
                className="
                  max-h-[260px]
                  overflow-y-auto
                  scrollbar-thin
                  scrollbar-thumb-white/10
                "
              >
                {developers
                  .filter(
                    (developer) =>
                      developer.name
                        .toLowerCase()
                        .includes(
                          developerSearch.toLowerCase()
                        )
                  )
                  .map(
                    (developer) => (
                      <button
                        key={
                          developer.name
                        }
                        type="button"
                        onClick={() => {
                          setShowDeveloperModal(
                            false
                          );

                          if (
                            developer?.slug
                          ) {
                            router.push(
                              getDeveloperProjectUrl(
                                developer.slug
                              )
                            );
                          }
                        }}
                        className="
                          w-full
                          px-6
                          py-4
                          flex
                          items-center
                          gap-4
                          border-b
                          border-white/[0.04]
                          hover:bg-white/[0.03]
                          transition-all
                          text-left
                          group
                        "
                      >
                        <img
                          src={
                            developer.logo
                          }
                          alt={
                            developer.name
                          }
                          onError={(e) => {
                            e.currentTarget.src =
                              "/placeholder.png";
                          }}
                          className="
                            w-12
                            h-12
                            rounded-xl
                            object-cover
                            border
                            border-white/10
                            bg-white/5
                            shrink-0
                          "
                        />

                        <div className="flex-1">

                          <p
                            className="
                              text-white
                              text-[15px]
                              font-medium
                              group-hover:text-[#c89d58]
                              transition-colors
                            "
                          >
                            {
                              developer.name
                            }
                          </p>

                          <p
                            className="
                              text-white/40
                              text-[12px]
                              mt-0.5
                            "
                          >
                            Developer Partner
                          </p>

                        </div>
                      </button>
                    )
                  )}

                {developers.filter(
                  (developer) =>
                    developer.name
                      .toLowerCase()
                      .includes(
                        developerSearch.toLowerCase()
                      )
                ).length === 0 && (
                  <div className="py-14 text-center">
                    <p className="text-white/40">
                      No developers found
                    </p>
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}

        {/* =================================================== */}
        {/* LOCATION MODAL */}
        {/* =================================================== */}

        {showLocationModal && (
          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            exit={{
              opacity: 0,
            }}
            className="
              fixed
              inset-0
              z-[999999]
              bg-black/45
              backdrop-blur-[5px]
              flex
              items-start
              justify-center
              pt-[110px]
              pb-8
              px-4
            "
            onClick={() =>
              setShowLocationModal(
                false
              )
            }
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.96,
                y: 20,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={(e) =>
                e.stopPropagation()
              }
              className="
                relative
                w-full
                max-w-[540px]
                rounded-[28px]
                border
                border-[#c89d58]/15
                bg-[#0b0b0b]
                shadow-[0_40px_120px_rgba(0,0,0,0.65)]
                overflow-hidden
              "
            >

              {/* TOP LINE */}

              <div
                className="
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-[#c89d58]
                  to-transparent
                "
              />

              {/* HEADER */}

              <div
                className="
                  px-6
                  py-5
                  border-b
                  border-white/10
                "
              >
                <p
                  className="
                    text-[#c89d58]
                    text-[10px]
                    uppercase
                    tracking-[3px]
                    mb-2
                  "
                >
                  Location Directory
                </p>

                <h3 className="text-white text-[22px] font-semibold">
                  Select Location
                </h3>

                <p className="text-white/45 text-[13px] mt-2">
                  Browse all available locations
                </p>
              </div>

              {/* SEARCH */}

              <div className="p-5 border-b border-white/10">

                <input
                  value={
                    locationSearch
                  }
                  onChange={(e) =>
                    setLocationSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search location..."
                  className="
                    w-full
                    h-[50px]
                    rounded-[16px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-5
                    text-white
                    placeholder:text-white/35
                    outline-none
                    focus:border-[#c89d58]/40
                  "
                />

              </div>

              {/* LIST */}

              <div className="max-h-[260px] overflow-y-auto">

                {locations
                  .filter(
                    (location) =>
                      location
                        .toLowerCase()
                        .includes(
                          locationSearch.toLowerCase()
                        )
                  )
                  .map(
                    (location) => (
                      <button
                        key={
                          location
                        }
                        type="button"
                        onClick={() => {

                          setShowLocationModal(
                            false
                          );

                          // -------------------------------------------------
                          // Find location + most-parent/root
                          // -------------------------------------------------

                          const locationData =
                            findLocationInTree(
                              locationTree,
                              location
                            );

                          if (
                            locationData
                          ) {
                            router.push(
                              getPublicLocationUrl(
                                locationData.location,
                                locationData.root
                              )
                            );
                          } else {
                            // Safe fallback
                            router.push(
                              `/properties?location=${encodeURIComponent(
                                location
                              )}`
                            );
                          }
                        }}
                        className="
                          w-full
                          px-6
                          py-4
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/[0.04]
                          hover:bg-white/[0.03]
                          transition-all
                          text-left
                        "
                      >
                        <span className="text-white text-[14px]">
                          {location}
                        </span>

                        <span className="text-[#c89d58] text-[16px]">
                          →
                        </span>
                      </button>
                    )
                  )}

                {locations.filter(
                  (location) =>
                    location
                      .toLowerCase()
                      .includes(
                        locationSearch.toLowerCase()
                      )
                ).length === 0 && (
                  <div className="py-14 text-center text-white/40">
                    No locations found
                  </div>
                )}

              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </header>
  );
}