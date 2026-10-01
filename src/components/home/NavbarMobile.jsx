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
// MOBILE NAVIGATION ITEMS
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
// DEVELOPER PUBLIC URL
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
// FIND LOCATION + ROOT
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
    const currentRoot = root || location;

    const currentName = String(
      location?.name || ""
    )
      .trim()
      .toLowerCase();

    if (currentName === target) {
      return {
        location,
        root: currentRoot,
      };
    }

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

  // Child location
  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

  // Root location
  return `/locations/properties-${preposition}-${currentSlug}`;
};

// =========================================================
// NAVBAR MOBILE
// =========================================================

export default function NavbarMobile({
  onConsultationClick,
}) {
  const router = useRouter();

  // =======================================================
  // UI STATE
  // =======================================================

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const [mobileDropdown, setMobileDropdown] =
    useState(null);

  const [locations, setLocations] = useState([]);

  const [locationTree, setLocationTree] =
    useState([]);

  const [developers, setDevelopers] =
    useState([]);

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
  // FETCH DATA
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

        // ===================================================
        // LOCATION TREE
        // ===================================================

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
            "Navbar mobile location tree error:",
            locationError
          );
        }

        // ===================================================
        // LOCATIONS
        // ===================================================

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

        // ===================================================
        // DEVELOPERS
        // ===================================================

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

            if (existing) {
              existing.propertyCount += 1;
              return;
            }

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

            developerMap.set(
              developerName,
              {
                name: developerName,

                slug: developerSlug,

                logo:
                  developer?.logo ||
                  developer?.image ||
                  property
                    ?.coreDetails
                    ?.developerLogo ||
                  property
                    ?.coreDetails
                    ?.developerImage ||
                  "/placeholder.jpg",

                propertyCount: 1,
              }
            );
          }
        );

        // ===================================================
        // SORT DEVELOPERS
        // ===================================================

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

        // ===================================================
        // PROPERTY TYPES
        // ===================================================

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
          "Navbar mobile property fetch error:",
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
      // View All
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

      // Find location
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
      // View All
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

      router.push(
        "/knowledge"
      );

      return;
    }

    // =======================================================
    // PROPERTY INSIGHTS
    // =======================================================

    if (
      item.key === "insights"
    ) {
      closeMobileMenu();

      router.push(
        "/insights"
      );

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
    // Tools main button
    if (
      item.key === "tools"
    ) {
      closeMobileMenu();

      router.push("/#tools");

      return;
    }

    // Direct links
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

    // No dropdown
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

    // Toggle dropdown
    setMobileDropdown(
      mobileDropdown ===
        item.title
        ? null
        : item.title
    );
  };

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <>
      {/* =====================================================
          MOBILE NAVBAR
      ===================================================== */}

      <header
        className="
          fixed
          top-0
          left-0
          w-full
          z-[999]
          xl:hidden
          bg-[#071b16]/95
          backdrop-blur-xl
          border-b
          border-white/10
        "
      >
        <div className="w-full px-4">
          <div
            className="
              h-[68px]
              flex
              items-center
              justify-between
            "
          >

            {/* =================================================
                LOGO
            ================================================= */}

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="
                flex
                items-center
                gap-2.5
                shrink-0
              "
            >
              <Image
                src="/logo.webp"
                alt="Property Bouquet"
                width={42}
                height={42}
                priority
                className="
                  w-[40px]
                  h-[40px]
                  object-contain
                  drop-shadow-[0_4px_12px_rgba(0,0,0,.35)]
                "
              />

              <div className="flex flex-col leading-none">

                <span
                  className="
                    text-white
                    text-[16px]
                    font-light
                    tracking-[0.08em]
                    uppercase
                  "
                  style={{
                    fontFamily:
                      "Cormorant Garamond, serif",
                  }}
                >
                  PROPERTY
                </span>

                <div className="flex items-center gap-1.5 mt-[3px]">

                  <span
                    className="
                      h-px
                      w-4
                      bg-[#D4AF37]
                    "
                  />

                  <span
                    className="
                      text-[#D4AF37]
                      text-[7px]
                      tracking-[0.32em]
                      font-semibold
                    "
                  >
                    BOUQUET
                  </span>

                </div>
              </div>
            </Link>

            {/* =================================================
                HAMBURGER
            ================================================= */}

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
                w-[42px]
                h-[42px]
                rounded-full
                border
                border-[#c89d58]/40
                bg-black/30
                backdrop-blur-xl
                flex
                items-center
                justify-center
                text-[#d9b061]
                active:scale-95
                transition-all
                duration-300
              "
              aria-label="Toggle mobile menu"
              aria-expanded={
                mobileMenuOpen
              }
            >
              {mobileMenuOpen ? (
                <X size={19} />
              ) : (
                <Menu size={19} />
              )}
            </button>

          </div>
        </div>
      </header>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}

      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* =================================================
                BACKDROP
            ================================================= */}

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

            {/* =================================================
                DRAWER
            ================================================= */}

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
                h-[100dvh]
                w-[90%]
                max-w-[380px]
                bg-[#071b16]
                border-l
                border-[#c89d58]/15
                z-[999]
                overflow-y-auto
                overscroll-contain
                xl:hidden
              "
            >

              {/* =================================================
                  GOLD TOP ACCENT
              ================================================= */}

              <div
                className="
                  absolute
                  top-0
                  left-0
                  right-0
                  h-[2px]
                  bg-gradient-to-r
                  from-transparent
                  via-[#c89d58]
                  to-transparent
                  z-40
                "
              />

              {/* =================================================
                  DRAWER HEADER
              ================================================= */}

              <div
                className="
                  sticky
                  top-0
                  z-30
                  bg-[#071b16]/95
                  backdrop-blur-xl
                  border-b
                  border-white/10
                  px-5
                  py-4
                  flex
                  items-center
                  justify-between
                "
              >

                <div className="flex items-center gap-3">

                  <Image
                    src="/logo.webp"
                    alt="Property Bouquet"
                    width={38}
                    height={38}
                    className="
                      w-[36px]
                      h-[36px]
                      object-contain
                    "
                  />

                  <div>

                    <p
                      className="
                        text-[#c89d58]
                        text-[8px]
                        uppercase
                        tracking-[3px]
                        mb-1
                      "
                    >
                      Property Bouquet
                    </p>

                    <h3
                      className="
                        text-white
                        text-[17px]
                        font-medium
                      "
                    >
                      Menu
                    </h3>

                  </div>

                </div>

                <button
                  type="button"
                  onClick={
                    closeMobileMenu
                  }
                  className="
                    w-10
                    h-10
                    rounded-full
                    border
                    border-white/10
                    bg-white/[0.04]
                    text-white/80
                    flex
                    items-center
                    justify-center
                    active:scale-95
                    transition
                  "
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>

              </div>

              {/* =================================================
                  NAV ITEMS
              ================================================= */}

              <div className="px-4 py-2">

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
                        className="
                          border-b
                          border-white/[0.08]
                        "
                      >

                        {/* =======================================
                            MAIN ITEM
                        ======================================= */}

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
                            py-[17px]
                            text-left
                            text-white
                            text-[14px]
                            font-medium
                            tracking-[0.01em]
                          "
                        >

                          <span>
                            {item.title}
                          </span>

                          {hasDropdown && (
                            <span
                              className="
                                w-7
                                h-7
                                rounded-full
                                bg-white/[0.04]
                                border
                                border-white/[0.06]
                                flex
                                items-center
                                justify-center
                              "
                            >
                              <ChevronDown
                                size={14}
                                className={`
                                  transition-all
                                  duration-300
                                  ${
                                    isOpen
                                      ? "rotate-180 text-[#d6aa53]"
                                      : "text-white/55"
                                  }
                                `}
                              />
                            </span>
                          )}

                        </button>

                        {/* =======================================
                            SUBMENU
                        ======================================= */}

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
                                  duration: 0.22,
                                  ease: [
                                    0.22,
                                    1,
                                    0.36,
                                    1,
                                  ],
                                }}
                                className="
                                  overflow-hidden
                                  pb-3
                                "
                              >

                                <div
                                  className="
                                    ml-1
                                    rounded-2xl
                                    border
                                    border-[#c89d58]/10
                                    bg-black/10
                                    p-1.5
                                  "
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
                                          text-white/65
                                          hover:bg-white/[0.05]
                                          hover:text-[#d6aa53]
                                          active:bg-white/[0.07]
                                          transition-all
                                          duration-200
                                          text-[13px]
                                        "
                                      >
                                        {sub}
                                      </button>
                                    )
                                  )}

                                </div>

                              </motion.div>
                            )}
                        </AnimatePresence>

                      </div>
                    );
                  }
                )}

                {/* =================================================
                    CONSULTATION BUTTON
                ================================================= */}

                <button
                  type="button"
                  onClick={() => {
                    closeMobileMenu();

                    if (
                      typeof onConsultationClick ===
                      "function"
                    ) {
                      onConsultationClick();
                    }
                  }}
                  className="
                    w-full
                    mt-6
                    h-[52px]
                    rounded-[15px]
                    bg-gradient-to-b
                    from-[#d9b061]
                    to-[#b8862e]
                    text-black
                    shadow-[0_10px_35px_rgba(0,0,0,0.3)]
                    active:scale-[0.98]
                    transition-all
                    duration-300
                    flex
                    items-center
                    justify-center
                    gap-2
                  "
                >

                  <Phone
                    size={17}
                    strokeWidth={2.4}
                  />

                  <span
                    className="
                      font-bold
                      text-[14px]
                      tracking-[0.04em]
                    "
                  >
                    +91 9090 106 101
                  </span>

                </button>

                {/* =================================================
                    AUTH BUTTONS
                ================================================= */}

                <div className="space-y-3 mt-5 mb-8">

                  <div className="grid grid-cols-2 gap-3">

                    <Link
                      href="/auth"
                      onClick={
                        closeMobileMenu
                      }
                      className="
                        h-[48px]
                        rounded-[14px]
                        border
                        border-white/10
                        bg-white/[0.02]
                        flex
                        items-center
                        justify-center
                        text-white/80
                        text-[13px]
                        font-medium
                        hover:border-[#c89d58]/30
                        hover:text-[#d9b061]
                        transition
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
                        rounded-[14px]
                        bg-white
                        text-black
                        font-semibold
                        text-[13px]
                        flex
                        items-center
                        justify-center
                        hover:bg-[#f7f3ee]
                        transition
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
                      rounded-[14px]
                      border
                      border-white/10
                      bg-white/[0.02]
                      flex
                      items-center
                      justify-center
                      text-white/80
                      text-[13px]
                      font-medium
                      hover:border-[#c89d58]/30
                      hover:text-[#d9b061]
                      transition
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

      {/* =====================================================
          DEVELOPER MODAL
      ===================================================== */}

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
              bg-black/50
              backdrop-blur-[6px]
              flex
              items-start
              justify-center
              pt-[90px]
              pb-6
              px-4
              xl:hidden
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
                max-h-[calc(100dvh-110px)]
                rounded-[26px]
                border
                border-[#c89d58]/15
                bg-[#071b16]
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
                  px-5
                  py-4
                  border-b
                  border-white/10
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p
                      className="
                        text-[#c89d58]
                        text-[9px]
                        uppercase
                        tracking-[3px]
                        mb-1.5
                      "
                    >
                      Developer Directory
                    </p>

                    <h3
                      className="
                        text-white
                        text-[20px]
                        font-semibold
                      "
                    >
                      Select Developer
                    </h3>

                    <p
                      className="
                        text-white/40
                        text-[12px]
                        mt-1.5
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
                      flex
                      items-center
                      justify-center
                      transition
                    "
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>

              {/* SEARCH */}

              <div
                className="
                  px-5
                  py-4
                  border-b
                  border-white/10
                  bg-[#071b16]
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
                    h-[48px]
                    rounded-[15px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-4
                    text-[13px]
                    text-white
                    placeholder:text-white/30
                    outline-none
                    focus:border-[#c89d58]/40
                    transition-all
                  "
                />

              </div>

              {/* LIST */}

              <div
                className="
                  max-h-[55dvh]
                  overflow-y-auto
                  overscroll-contain
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
                          px-5
                          py-3.5
                          flex
                          items-center
                          gap-3
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
                              "/placeholder.jpg";
                          }}
                          className="
                            w-11
                            h-11
                            rounded-xl
                            object-cover
                            border
                            border-white/10
                            bg-white/5
                            shrink-0
                          "
                        />

                        <div className="flex-1 min-w-0">

                          <p
                            className="
                              text-white
                              text-[14px]
                              font-medium
                              group-hover:text-[#c89d58]
                              transition-colors
                              truncate
                            "
                          >
                            {
                              developer.name
                            }
                          </p>

                          <p
                            className="
                              text-white/35
                              text-[11px]
                              mt-0.5
                            "
                          >
                            Developer Partner
                          </p>

                        </div>

                        <span
                          className="
                            text-[#c89d58]/60
                            text-[16px]
                          "
                        >
                          →
                        </span>

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
                    <p className="text-white/40 text-[13px]">
                      No developers found
                    </p>
                  </div>
                )}

              </div>

            </motion.div>
          </motion.div>
        )}

        {/* =====================================================
            LOCATION MODAL
        ===================================================== */}

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
              bg-black/50
              backdrop-blur-[6px]
              flex
              items-start
              justify-center
              pt-[90px]
              pb-6
              px-4
              xl:hidden
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
                max-h-[calc(100dvh-110px)]
                rounded-[26px]
                border
                border-[#c89d58]/15
                bg-[#071b16]
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
                  px-5
                  py-4
                  border-b
                  border-white/10
                "
              >

                <div className="flex items-start justify-between">

                  <div>

                    <p
                      className="
                        text-[#c89d58]
                        text-[9px]
                        uppercase
                        tracking-[3px]
                        mb-1.5
                      "
                    >
                      Location Directory
                    </p>

                    <h3
                      className="
                        text-white
                        text-[20px]
                        font-semibold
                      "
                    >
                      Select Location
                    </h3>

                    <p
                      className="
                        text-white/40
                        text-[12px]
                        mt-1.5
                      "
                    >
                      Browse all available locations
                    </p>

                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowLocationModal(
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
                      flex
                      items-center
                      justify-center
                      transition
                    "
                  >
                    <X size={17} />
                  </button>

                </div>

              </div>

              {/* SEARCH */}

              <div
                className="
                  p-4
                  border-b
                  border-white/10
                "
              >

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
                    h-[48px]
                    rounded-[15px]
                    bg-white/[0.04]
                    border
                    border-white/10
                    px-4
                    text-[13px]
                    text-white
                    placeholder:text-white/30
                    outline-none
                    focus:border-[#c89d58]/40
                    transition-all
                  "
                />

              </div>

              {/* LIST */}

              <div
                className="
                  max-h-[55dvh]
                  overflow-y-auto
                  overscroll-contain
                "
              >

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
                            router.push(
                              `/properties?location=${encodeURIComponent(
                                location
                              )}`
                            );
                          }
                        }}
                        className="
                          w-full
                          px-5
                          py-3.5
                          flex
                          items-center
                          justify-between
                          border-b
                          border-white/[0.04]
                          hover:bg-white/[0.03]
                          active:bg-white/[0.05]
                          transition-all
                          text-left
                        "
                      >

                        <span
                          className="
                            text-white/80
                            text-[13px]
                          "
                        >
                          {location}
                        </span>

                        <span
                          className="
                            text-[#c89d58]
                            text-[16px]
                          "
                        >
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
                  <div className="py-14 text-center">
                    <p className="text-white/40 text-[13px]">
                      No locations found
                    </p>
                  </div>
                )}

              </div>

            </motion.div>

          </motion.div>
        )}

      </AnimatePresence>
    </>
  );
}