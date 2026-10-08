"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";

import {
  Menu,
  X,
  ChevronDown,
  Phone,
  Search,
  ArrowRight,
  MapPin,
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
// FIND LOCATION + MOST-PARENT LOCATION
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

  if (
    rootSlug &&
    rootSlug !== currentSlug
  ) {
    return `/locations/properties-${preposition}-${currentSlug}-${rootSlug}`;
  }

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

  const [mounted, setMounted] = useState(false);

  // =========================================================
  // MOUNT
  // =========================================================

  useEffect(() => {
    setMounted(true);
  }, []);

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
    const fetchNavbarData = async () => {
      try {
        const [
          propertiesResponse,
          developersResponse,
          locationResponse,
        ] = await Promise.all([
          fetch("/api/properties"),
          
          // IMPORTANT:
          // Developers come directly from the developer API.
          // They are NOT derived from /api/properties.
          fetch("/api/developers?limit=10000"),

          fetch("/api/locations/tree"),
        ]);

        // =====================================================
        // PARSE PROPERTIES
        // =====================================================

        let propertyDataResponse = {};

        try {
          propertyDataResponse =
            await propertiesResponse.json();
        } catch {
          propertyDataResponse = {};
        }

        // =====================================================
        // PARSE DEVELOPERS
        // =====================================================

        let developerDataResponse = {};

        try {
          developerDataResponse =
            await developersResponse.json();
        } catch {
          developerDataResponse = {};
        }

        // =====================================================
        // PARSE LOCATIONS
        // =====================================================

        let locationDataResponse = {};

        try {
          locationDataResponse =
            await locationResponse.json();
        } catch {
          locationDataResponse = {};
        }

        // =====================================================
        // PROPERTIES
        // =====================================================

        if (!propertiesResponse.ok) {
          throw new Error(
            `Failed to fetch properties: ${propertiesResponse.status}`
          );
        }

        const propertyData = Array.isArray(
          propertyDataResponse?.data
        )
          ? propertyDataResponse.data
          : Array.isArray(
              propertyDataResponse
            )
          ? propertyDataResponse
          : [];

        setProperties(propertyData);

        // =====================================================
        // LOCATIONS
        // =====================================================

        if (locationResponse.ok) {
          const tree = Array.isArray(
            locationDataResponse?.data
          )
            ? locationDataResponse.data
            : Array.isArray(
                locationDataResponse
              )
            ? locationDataResponse
            : [];

          setLocationTree(tree);
        }

        // =====================================================
        // UNIQUE LOCATIONS
        // =====================================================

        const uniqueLocations = [
          ...new Set(
            propertyData.flatMap((property) => {
              const location =
                property?.locationData
                  ?.locationName;

              if (!location) {
                return [];
              }

              return String(location)
                .split(">")
                .map((item) =>
                  item.trim()
                )
                .filter(Boolean);
            })
          ),
        ].sort();

        setLocations(uniqueLocations);

        // =====================================================
        // PROPERTY DEVELOPER COUNTS
        //
        // IMPORTANT:
        //
        // These counts are ONLY used for displaying
        // how many properties belong to a developer.
        //
        // They DO NOT decide which developers appear
        // in the developer directory.
        // =====================================================

        const developerCountsById =
          new Map();

        const developerCountsByName =
          new Map();

        propertyData.forEach((property) => {
          const developerName =
            property?.coreDetails
              ?.developerName?.trim();

          const developerRef =
            property?.coreDetails
              ?.developerRef;

          const developerId =
            developerRef?._id ||
            developerRef?.id ||
            (typeof developerRef ===
            "string"
              ? developerRef
              : null);

          // Count by ID
          if (developerId) {
            const idKey =
              String(developerId);

            developerCountsById.set(
              idKey,
              (developerCountsById.get(
                idKey
              ) || 0) + 1
            );
          }

          // Count by name
          if (developerName) {
            const nameKey =
              developerName.toLowerCase();

            developerCountsByName.set(
              nameKey,
              (developerCountsByName.get(
                nameKey
              ) || 0) + 1
            );
          }
        });

        // =====================================================
        // DEVELOPERS
        //
        // THIS IS THE IMPORTANT FIX.
        //
        // The complete developer directory comes directly
        // from /api/developers.
        //
        // /api/properties is NOT the source of developers.
        // =====================================================

        if (!developersResponse.ok) {
          console.error(
            `Failed to fetch developers: ${developersResponse.status}`
          );

          setDevelopers([]);
        } else {
          // ---------------------------------------------------
          // Your Developers page currently uses:
          //
          // response.data
          //
          // This code also safely supports:
          //
          // response.developers
          // response.data.data
          // direct array
          // ---------------------------------------------------

          let rawDevelopers = [];

          if (
            Array.isArray(
              developerDataResponse
            )
          ) {
            rawDevelopers =
              developerDataResponse;
          } else if (
            Array.isArray(
              developerDataResponse?.data
            )
          ) {
            rawDevelopers =
              developerDataResponse.data;
          } else if (
            Array.isArray(
              developerDataResponse
                ?.data?.data
            )
          ) {
            rawDevelopers =
              developerDataResponse
                .data.data;
          } else if (
            Array.isArray(
              developerDataResponse?.developers
            )
          ) {
            rawDevelopers =
              developerDataResponse.developers;
          }

          // ---------------------------------------------------
          // DEDUPLICATE DEVELOPERS
          //
          // Prefer ID.
          // Fall back to slug/name.
          // ---------------------------------------------------

          const developerMap =
            new Map();

          rawDevelopers.forEach(
            (developer) => {
              if (
                !developer ||
                typeof developer.name !==
                  "string" ||
                !developer.name.trim()
              ) {
                return;
              }

              const developerName =
                developer.name.trim();

              const developerId =
                developer?._id ||
                developer?.id ||
                null;

              const slug =
                developer?.slug ||
                developer?.publicSlug ||
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

              const key =
                developerId
                  ? `id:${String(
                      developerId
                    )}`
                  : `slug:${String(
                      slug
                    ).toLowerCase()}`;

              const countById =
                developerId
                  ? developerCountsById.get(
                      String(
                        developerId
                      )
                    ) || 0
                  : 0;

              const countByName =
                developerCountsByName.get(
                  developerName.toLowerCase()
                ) || 0;

              const logo =
                developer?.logo ||
                developer?.image ||
                "/placeholder.jpg";

              developerMap.set(key, {
                ...developer,

                name: developerName,

                slug,

                logo,

                propertyCount:
                  countById > 0
                    ? countById
                    : countByName,
              });
            }
          );

          const allDevelopers =
            Array.from(
              developerMap.values()
            );

          // ---------------------------------------------------
          // SORT
          //
          // Developers with properties first.
          // Zero-property developers remain visible.
          // ---------------------------------------------------

          allDevelopers.sort(
            (a, b) =>
              (b.propertyCount || 0) -
                (a.propertyCount || 0) ||
              a.name.localeCompare(
                b.name
              )
          );

          setDevelopers(
            allDevelopers
          );

          // ---------------------------------------------------
          // DEBUG
          //
          // You can remove this later.
          // ---------------------------------------------------

          console.log(
            "Navbar developers from /api/developers:",
            allDevelopers
          );

          console.log(
            "Navbar developer count:",
            allDevelopers.length
          );
        }

        // =====================================================
        // PROPERTY TYPES
        // =====================================================

        const uniqueCategories = [
          ...new Set(
            propertyData
              .map(
                (property) =>
                  property?.categoryData
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
          "Navbar data fetch error:",
          err
        );
      }
    };

    fetchNavbarData();
  }, []);

  // =========================================================
  // MOBILE ITEMS
  // =========================================================

  const mobileItems =
    navItems.map((item) => {
      let items =
        item.items || [];

      if (
        item.key ===
        "properties"
      ) {
        items = propertyTypes;
      }

      if (
        item.key ===
        "locations"
      ) {
        items = [
          ...locations.slice(0, 5),
          "View All Locations →",
        ];
      }

      if (
        item.key ===
        "developers"
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
      item.key ===
      "properties"
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
      item.key ===
      "locations"
    ) {
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
      item.key ===
      "developers"
    ) {
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
      item.key ===
      "knowledge"
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
      item.key ===
      "insights"
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
      item.key ===
      "tools"
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
    if (
      item.key ===
      "tools"
    ) {
      closeMobileMenu();

      router.push("/#tools");

      return;
    }

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
      item.key ===
      "properties"
    ) {
      dropdownItems =
        propertyTypes;
    }

    if (
      item.key ===
      "locations"
    ) {
      dropdownItems = [
        ...locations.slice(0, 5),
        "View All Locations →",
      ];
    }

    if (
      item.key ===
      "developers"
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
      item.key ===
      "properties"
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
      item.key ===
      "locations"
    ) {
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
      item.key ===
      "developers"
    ) {
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
      item.key ===
      "knowledge"
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
      item.key ===
      "insights"
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
      item.key ===
      "tools"
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
        router.push(route);
      }

      setActive(null);

      return;
    }
  };

  // =========================================================
  // FILTERED DEVELOPERS
  // =========================================================

  const filteredDevelopers =
    developers.filter(
      (developer) => {
        const name = String(
          developer?.name || ""
        )
          .trim()
          .toLowerCase();

        const search = String(
          developerSearch || ""
        )
          .trim()
          .toLowerCase();

        return name.includes(
          search
        );
      }
    );

// =========================================================
// DEVELOPER MODAL
// =========================================================

const developerModal =
  mounted &&
  createPortal(
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
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
          className="
            fixed
            inset-0
            z-[999999]
            flex
            items-center
            justify-center
            bg-black/55
            backdrop-blur-[7px]
            px-4
            py-6
            sm:px-6
            sm:py-8
          "
          onClick={() =>
            setShowDeveloperModal(false)
          }
        >
          {/* =====================================================
              MODAL
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.975,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.975,
              y: 12,
            }}
            transition={{
              duration: 0.24,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative
              w-full
              max-w-[820px]
              h-[455px]
              max-h-[calc(100vh-40px)]
              rounded-[25px]
              border
              border-[#a77b35]
              bg-[#080b0a]
              shadow-[0_30px_90px_rgba(0,0,0,0.70)]
              overflow-hidden
              flex
              flex-col
            "
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setShowDeveloperModal(false)
              }
              aria-label="Close developer directory"
              className="
                absolute
                right-4
                top-4
                z-30
                w-[42px]
                h-[42px]
                rounded-full
                bg-[#171a19]
                border
                border-white/[0.025]
                text-white/65
                flex
                items-center
                justify-center
                transition-all
                duration-200
                hover:bg-[#222624]
                hover:text-white
              "
            >
              <X
                size={21}
                strokeWidth={1.6}
              />
            </button>

            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                relative
                shrink-0
                px-5
                pt-5
                pb-3
                sm:px-6
                sm:pt-5
                sm:pb-3
              "
            >
              <div
                className="
                  text-[#c89d58]
                  text-[10px]
                  sm:text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  leading-none
                  mb-2.5
                "
              >
                Developer Directory
              </div>

              <h3
                className="
                  pr-14
                  text-white
                  text-[29px]
                  sm:text-[32px]
                  font-medium
                  tracking-[-0.03em]
                  leading-[1]
                "
              >
                Select Developer
              </h3>

              <p
                className="
                  text-[#929997]
                  text-[14px]
                  sm:text-[15px]
                  font-normal
                  mt-2
                  leading-[1.2]
                "
              >
                Browse all developer partners
              </p>
            </div>

            {/* =================================================
                SEARCH
            ================================================== */}

            <div
              className="
                shrink-0
                px-5
                sm:px-6
                pb-3.5
              "
            >
              <div
                className="
                  relative
                  w-full
                  h-[62px]
                  rounded-[21px]
                  border
                  border-[#a77b35]
                  bg-[#101413]
                  transition-all
                  duration-200
                  focus-within:border-[#c89d58]
                  focus-within:shadow-[0_0_0_1px_rgba(200,157,88,0.10)]
                "
              >
                <Search
                  size={23}
                  strokeWidth={1.7}
                  className="
                    absolute
                    left-4.5
                    top-1/2
                    -translate-y-1/2
                    text-white
                  "
                />

                <input
                  type="text"
                  value={developerSearch}
                  onChange={(e) =>
                    setDeveloperSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search developer..."
                  aria-label="Search developer"
                  autoComplete="off"
                  className="
                    w-full
                    h-full
                    rounded-[21px]
                    bg-transparent
                    pl-[56px]
                    pr-5
                    text-white
                    text-[15px]
                    sm:text-[16px]
                    font-normal
                    outline-none
                    placeholder:text-[#858b89]
                    placeholder:font-normal
                  "
                />
              </div>
            </div>

            {/* =================================================
                DEVELOPER LIST
            ================================================== */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                overscroll-contain
              "
              style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                  "rgba(255,255,255,0.25) transparent",
              }}
            >
              {filteredDevelopers.length > 0 ? (
                <div>
                  {filteredDevelopers.map(
                    (developer, index) => (
                      <button
                        key={
                          developer?._id ||
                          developer?.id ||
                          developer?.slug ||
                          developer?.name ||
                          index
                        }
                        type="button"
                        onClick={() => {
                          setShowDeveloperModal(
                            false
                          );

                          setDeveloperSearch(
                            ""
                          );

                          const developerSlug =
                            developer?.slug ||
                            developer?.publicSlug ||
                            developer?.name;

                          if (
                            developerSlug
                          ) {
                            router.push(
                              getDeveloperProjectUrl(
                                developerSlug
                              )
                            );
                          }
                        }}
                        className="
                          group
                          w-full
                          min-h-[82px]
                          px-5
                          sm:px-6
                          py-2
                          flex
                          items-center
                          gap-3.5
                          text-left
                          border-t
                          border-white/[0.075]
                          bg-transparent
                          hover:bg-white/[0.025]
                          transition-all
                          duration-200
                        "
                      >
                        {/* =====================================
                            LOGO
                        ====================================== */}

                        <div
                          className="
                            w-[68px]
                            h-[68px]
                            shrink-0
                            rounded-[15px]
                            bg-white
                            border
                            border-white/[0.08]
                            overflow-hidden
                            flex
                            items-center
                            justify-center
                            shadow-[0_4px_14px_rgba(0,0,0,0.15)]
                          "
                        >
                          <img
                            src={
                              developer?.logo ||
                              developer?.image ||
                              "/placeholder.jpg"
                            }
                            alt={
                              developer?.name ||
                              "Developer"
                            }
                            onError={(
                              e
                            ) => {
                              e.currentTarget.src =
                                "/placeholder.jpg";
                            }}
                            className="
                              w-full
                              h-full
                              object-contain
                              p-1.5
                            "
                          />
                        </div>

                        {/* =====================================
                            INFORMATION
                        ====================================== */}

                        <div
                          className="
                            flex-1
                            min-w-0
                          "
                        >
                          <p
                            className="
                              text-[#f3f3f1]
                              text-[18px]
                              sm:text-[19px]
                              font-medium
                              leading-[1.15]
                              tracking-[-0.01em]
                              truncate
                            "
                          >
                            {developer?.name ||
                              "Developer"}
                          </p>

                          <p
                            className="
                              text-[#858d8a]
                              text-[13px]
                              sm:text-[14px]
                              font-normal
                              mt-1
                              leading-[1.2]
                            "
                          >
                            Developer Partner
                          </p>
                        </div>

                        {/* =====================================
                            ARROW
                        ====================================== */}

                        <div
                          className="
                            shrink-0
                            w-[34px]
                            h-[34px]
                            flex
                            items-center
                            justify-center
                            text-[#c89d58]
                            group-hover:text-[#e0b86d]
                            group-hover:translate-x-1
                            transition-all
                            duration-200
                          "
                        >
                          <ArrowRight
                            size={25}
                            strokeWidth={1.35}
                          />
                        </div>
                      </button>
                    )
                  )}
                </div>
              ) : (
                /* =============================================
                   NO RESULTS
                ============================================== */

                <div
                  className="
                    min-h-[190px]
                    flex
                    items-center
                    justify-center
                    px-5
                  "
                >
                  <div className="text-center">
                    <div
                      className="
                        w-[46px]
                        h-[46px]
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        flex
                        items-center
                        justify-center
                        mx-auto
                        mb-3
                      "
                    >
                      <Search
                        size={18}
                        strokeWidth={1.5}
                        className="text-white/35"
                      />
                    </div>

                    <p
                      className="
                        text-white/50
                        text-[14px]
                      "
                    >
                      No developers found
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

// =========================================================
// LOCATION MODAL
// =========================================================

/*
  Build a hierarchy-aware location list.

  The modal still uses your existing `locations` array as the
  source of locations that should be displayed, while the
  locationTree is used to determine parent/root relationships.
*/

const hierarchicalLocations = (() => {
  const result = [];
  const seen = new Set();

  const normalize = (value) =>
    String(value || "")
      .trim()
      .toLowerCase();

  const allowedLocations = new Set(
    locations.map((location) =>
      normalize(location)
    )
  );

  const getChildren = (node) => {
    if (!node) return [];

    if (Array.isArray(node.children)) {
      return node.children;
    }

    if (Array.isArray(node.locations)) {
      return node.locations;
    }

    if (Array.isArray(node.subLocations)) {
      return node.subLocations;
    }

    if (Array.isArray(node.descendants)) {
      return node.descendants;
    }

    return [];
  };

  const getName = (node) => {
    if (!node) return "";

    return (
      node.name ||
      node.locationName ||
      node.title ||
      node.label ||
      ""
    );
  };

  const walk = (
    nodes,
    parents = [],
    root = null
  ) => {
    if (!Array.isArray(nodes)) return;

    nodes.forEach((node) => {
      const name = getName(node);

      if (!name) return;

      const currentRoot =
        root || node;

      const normalizedName =
        normalize(name);

      const parent =
        parents.length > 0
          ? parents[
              parents.length - 1
            ]
          : null;

      /*
        Only show locations that are actually
        present in the existing property/location
        dataset.

        This prevents the directory from becoming
        an enormous CMS tree containing unused
        locations.
      */
      if (
        allowedLocations.has(
          normalizedName
        ) &&
        !seen.has(normalizedName)
      ) {
        seen.add(normalizedName);

        result.push({
          name,
          location: node,
          root: currentRoot,
          parentName: parent
            ? getName(parent)
            : null,
          parents: [...parents],
          depth: parents.length,
        });
      }

      walk(
        getChildren(node),
        [...parents, node],
        currentRoot
      );
    });
  };

  /*
    Preferred tree structure.
  */
  if (Array.isArray(locationTree)) {
    walk(locationTree);
  } else if (
    Array.isArray(locationTree?.data)
  ) {
    walk(locationTree.data);
  } else if (
    Array.isArray(
      locationTree?.locations
    )
  ) {
    walk(locationTree.locations);
  } else if (
    Array.isArray(
      locationTree?.children
    )
  ) {
    walk(locationTree.children);
  }

  /*
    Safety fallback:
    Any location that wasn't found in the
    hierarchy is still displayed.
  */
  locations.forEach((location) => {
    const normalized =
      normalize(location);

    if (!seen.has(normalized)) {
      result.push({
        name: location,
        location: null,
        root: null,
        parentName: null,
        parents: [],
        depth: 0,
      });
    }
  });

  /*
    Keep hierarchy order, but make sure the
    parent/root locations appear before children.
  */
  return result;
})();


/* =========================================================
   FILTER LOCATIONS
========================================================= */

const normalizedLocationSearch =
  locationSearch
    .trim()
    .toLowerCase();

const filteredLocations =
  hierarchicalLocations.filter(
    (item) => {
      if (
        !normalizedLocationSearch
      ) {
        return true;
      }

      const hierarchyText =
        [
          item.name,
          item.parentName,
          ...(item.parents || []).map(
            (parent) =>
              parent?.name ||
              parent?.locationName ||
              parent?.title ||
              parent?.label ||
              ""
          ),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

      return hierarchyText.includes(
        normalizedLocationSearch
      );
    }
  );


/* =========================================================
   LOCATION MODAL
========================================================= */

const locationModal =
  mounted &&
  createPortal(
    <AnimatePresence>
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
          transition={{
            duration: 0.22,
            ease: "easeOut",
          }}
          className="
            fixed
            inset-0
            z-[999999]
            flex
            items-center
            justify-center
            bg-black/55
            backdrop-blur-[7px]
            px-4
            py-6
            sm:px-6
            sm:py-8
          "
          onClick={() =>
            setShowLocationModal(
              false
            )
          }
        >
          {/* =================================================
              MODAL
          ================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              scale: 0.975,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.975,
              y: 12,
            }}
            transition={{
              duration: 0.24,
              ease: [
                0.22,
                1,
                0.36,
                1,
              ],
            }}
            onClick={(e) =>
              e.stopPropagation()
            }
            className="
              relative
              w-full
              max-w-[820px]
              h-[455px]
              max-h-[calc(100vh-40px)]
              rounded-[25px]
              border
              border-[#a77b35]
              bg-[#080b0a]
              shadow-[0_30px_90px_rgba(0,0,0,0.70)]
              overflow-hidden
              flex
              flex-col
            "
          >
            {/* =================================================
                CLOSE BUTTON
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setShowLocationModal(
                  false
                )
              }
              aria-label="Close location directory"
              className="
                absolute
                right-4
                top-4
                z-30
                w-[42px]
                h-[42px]
                rounded-full
                bg-[#171a19]
                border
                border-white/[0.025]
                text-white/65
                flex
                items-center
                justify-center
                transition-all
                duration-200
                hover:bg-[#222624]
                hover:text-white
              "
            >
              <X
                size={21}
                strokeWidth={1.6}
              />
            </button>

            {/* =================================================
                HEADER
            ================================================== */}

            <div
              className="
                relative
                shrink-0
                px-5
                pt-5
                pb-3
                sm:px-6
                sm:pt-5
                sm:pb-3
              "
            >
              <div
                className="
                  text-[#c89d58]
                  text-[10px]
                  sm:text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  leading-none
                  mb-2.5
                "
              >
                Location Directory
              </div>

              <h3
                className="
                  pr-14
                  text-white
                  text-[29px]
                  sm:text-[32px]
                  font-medium
                  tracking-[-0.03em]
                  leading-[1]
                "
              >
                Select Location
              </h3>

              <p
                className="
                  text-[#929997]
                  text-[14px]
                  sm:text-[15px]
                  font-normal
                  mt-2
                  leading-[1.2]
                "
              >
                Browse locations by
                hierarchy
              </p>
            </div>

            {/* =================================================
                SEARCH
            ================================================== */}

            <div
              className="
                shrink-0
                px-5
                sm:px-6
                pb-3.5
              "
            >
              <div
                className="
                  relative
                  w-full
                  h-[62px]
                  rounded-[21px]
                  border
                  border-[#a77b35]
                  bg-[#101413]
                  transition-all
                  duration-200
                  focus-within:border-[#c89d58]
                  focus-within:shadow-[0_0_0_1px_rgba(200,157,88,0.10)]
                "
              >
                <Search
                  size={23}
                  strokeWidth={1.7}
                  className="
                    absolute
                    left-4.5
                    top-1/2
                    -translate-y-1/2
                    text-white
                  "
                />

                <input
                  type="text"
                  value={locationSearch}
                  onChange={(e) =>
                    setLocationSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search location..."
                  aria-label="Search location"
                  autoComplete="off"
                  className="
                    w-full
                    h-full
                    rounded-[21px]
                    bg-transparent
                    pl-[56px]
                    pr-5
                    text-white
                    text-[15px]
                    sm:text-[16px]
                    font-normal
                    outline-none
                    placeholder:text-[#858b89]
                    placeholder:font-normal
                  "
                />
              </div>
            </div>

            {/* =================================================
                LOCATION LIST
            ================================================== */}

            <div
              className="
                flex-1
                min-h-0
                overflow-y-auto
                overscroll-contain
              "
              style={{
                scrollbarWidth: "thin",
                scrollbarColor:
                  "rgba(255,255,255,0.25) transparent",
              }}
            >
              {filteredLocations.length >
              0 ? (
                <div>
                  {filteredLocations.map(
                    (
                      item,
                      index
                    ) => {
                      const isRoot =
                        item.depth === 0;

                      const isChild =
                        item.depth > 0;

                      const hierarchyParent =
                        item.parentName;

                      return (
                        <button
                          key={`${item.name}-${index}`}
                          type="button"
                          onClick={() => {
                            setShowLocationModal(
                              false
                            );

                            setLocationSearch(
                              ""
                            );

                            /*
                              Prefer the existing
                              location-tree routing.
                            */
                            if (
                              item.location &&
                              item.root
                            ) {
                              router.push(
                                getPublicLocationUrl(
                                  item.location,
                                  item.root
                                )
                              );

                              return;
                            }

                            /*
                              Fallback for locations
                              that aren't represented
                              in the tree.
                            */
                            const locationData =
                              findLocationInTree(
                                locationTree,
                                item.name
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
                                  item.name
                                )}`
                              );
                            }
                          }}
                          className={`
                            group
                            relative
                            w-full
                            min-h-[68px]
                            px-5
                            sm:px-6
                            py-2.5
                            flex
                            items-center
                            text-left
                            border-t
                            border-white/[0.075]
                            bg-transparent
                            hover:bg-white/[0.025]
                            transition-all
                            duration-200
                            ${
                              isRoot
                                ? "pl-5 sm:pl-6"
                                : "pl-10 sm:pl-12"
                            }
                          `}
                        >
                          {/* =====================================
                              HIERARCHY INDICATOR
                          ====================================== */}

                          {isChild && (
                            <div
                              className="
                                absolute
                                left-5
                                sm:left-6
                                top-0
                                bottom-0
                                flex
                                items-center
                              "
                            >
                              <div
                                className="
                                  h-[34px]
                                  w-px
                                  bg-white/[0.10]
                                "
                              />
                            </div>
                          )}

                          {/* =====================================
                              LOCATION ICON
                          ====================================== */}

                          <div
                            className={`
                              shrink-0
                              mr-3
                              flex
                              items-center
                              justify-center
                              rounded-full
                              transition-all
                              duration-200
                              ${
                                isRoot
                                  ? "w-[34px] h-[34px] bg-[#c89d58]/[0.10] text-[#c89d58]"
                                  : "w-[28px] h-[28px] bg-white/[0.035] text-[#777f7c]"
                              }
                            `}
                          >
                            <MapPin
                              size={
                                isRoot
                                  ? 17
                                  : 14
                              }
                              strokeWidth={
                                1.6
                              }
                            />
                          </div>

                          {/* =====================================
                              LOCATION INFORMATION
                          ====================================== */}

                          <div
                            className="
                              min-w-0
                              flex-1
                            "
                          >
                            <p
                              className={`
                                truncate
                                leading-[1.2]
                                tracking-[-0.01em]
                                ${
                                  isRoot
                                    ? "text-[#f3f3f1] text-[17px] sm:text-[18px] font-medium"
                                    : "text-[#e2e4e2] text-[15px] sm:text-[16px] font-normal"
                                }
                              `}
                            >
                              {item.name}
                            </p>

                            {isChild &&
                              hierarchyParent && (
                                <p
                                  className="
                                    mt-1
                                    truncate
                                    text-[12px]
                                    sm:text-[13px]
                                    font-normal
                                    text-[#737b78]
                                  "
                                >
                                  {hierarchyParent}
                                </p>
                              )}

                            {isRoot && (
                              <p
                                className="
                                  mt-1
                                  text-[12px]
                                  sm:text-[13px]
                                  font-normal
                                  text-[#737b78]
                                "
                              >
                                Primary location
                              </p>
                            )}
                          </div>

                          {/* =====================================
                              ARROW
                          ====================================== */}

                          <div
                            className="
                              shrink-0
                              w-[34px]
                              h-[34px]
                              flex
                              items-center
                              justify-center
                              text-[#c89d58]
                              group-hover:text-[#e0b86d]
                              group-hover:translate-x-1
                              transition-all
                              duration-200
                            "
                          >
                            <ArrowRight
                              size={24}
                              strokeWidth={1.35}
                            />
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              ) : (
                /* =================================================
                   NO RESULTS
                ================================================== */

                <div
                  className="
                    min-h-[190px]
                    flex
                    items-center
                    justify-center
                    px-5
                  "
                >
                  <div className="text-center">
                    <div
                      className="
                        w-[46px]
                        h-[46px]
                        rounded-full
                        border
                        border-white/10
                        bg-white/[0.03]
                        flex
                        items-center
                        justify-center
                        mx-auto
                        mb-3
                      "
                    >
                      <Search
                        size={18}
                        strokeWidth={1.5}
                        className="text-white/35"
                      />
                    </div>

                    <p
                      className="
                        text-white/50
                        text-[14px]
                      "
                    >
                      No locations found
                    </p>

                    {locationSearch && (
                      <p
                        className="
                          mt-1.5
                          text-white/25
                          text-[12px]
                        "
                      >
                        Try another location
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <>
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
                      key={
                        item.title
                      }
                      className="relative"
                      onMouseEnter={() =>
                        hasDropdown
                          ? setActive(
                              item.title
                            )
                          : setActive(
                              null
                            )
                      }
                      onMouseLeave={() =>
                        setActive(
                          null
                        )
                      }
                    >
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
                          {
                            item.title
                          }
                        </Link>

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
                              size={
                                13
                              }
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
                                    (
                                      sub
                                    ) => (
                                      <button
                                        key={
                                          sub
                                        }
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
                                        {
                                          sub
                                        }
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

              {/* CONSULTATION */}

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

              {/* DESKTOP ACCOUNT */}

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

              {/* MOBILE MENU */}

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
                              {
                                item.title
                              }
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
                                    (
                                      sub
                                    ) => (
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
                                        {
                                          sub
                                        }
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

                  {/* MOBILE CALL */}

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

                  {/* AUTH */}

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
      </header>

      {/* ===================================================== */}
      {/* PORTALED MODALS */}
      {/* ===================================================== */}

      {developerModal}

      {locationModal}
    </>
  );
}