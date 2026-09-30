"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LuxuryDropdown from "./LuxuryDropdown";

import {
  Search,
  Building2,
  SlidersHorizontal,
  MapPin,
  LocateFixed,
} from "lucide-react";

export default function SearchPanel() {
  // ============================================================
  // DATA
  // ============================================================

  const [locations, setLocations] = useState([]);
  const [developers, setDevelopers] = useState([]);
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] = useState([]);

  // ============================================================
  // SEARCH
  // ============================================================

  const [searchTerm, setSearchTerm] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // ============================================================
  // MODALS
  // ============================================================

  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // ============================================================
  // MODAL SEARCH
  // ============================================================

  const [developerSearch, setDeveloperSearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // ============================================================
  // CURRENT LOCATION
  // ============================================================

  const [gettingLocation, setGettingLocation] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");
  const [currentCoordinates, setCurrentCoordinates] = useState(null);

  // ============================================================
  // FILTERS
  // ============================================================

  const [filters, setFilters] = useState({
    propertyType: "",
    budget: "",
    budgetLabel: "",
    location: "",
    developer: "",
  });

  const router = useRouter();

  // ============================================================
  // FETCH PROPERTIES
  // ============================================================

  useEffect(() => {
    let mounted = true;

    const fetchProperties = async () => {
      try {
        const res = await fetch("/api/properties", {
          cache: "no-store",
        });

        if (!res.ok) {
          throw new Error(`Properties request failed: ${res.status}`);
        }

        const data = await res.json();

        if (!mounted) return;

        const propertyData = data?.data || [];

        setProperties(propertyData);

        // ======================================================
        // LOCATIONS
        // ======================================================

        const uniqueLocations = [
          ...new Set(
            propertyData.flatMap((property) => {
              const location =
                property?.locationData?.locationName;

              if (!location) return [];

              return location
                .split(">")
                .map((item) => item.trim())
                .filter(Boolean);
            })
          ),
        ].sort((a, b) => a.localeCompare(b));

        setLocations(uniqueLocations);

        // ======================================================
        // DEVELOPERS
        // ======================================================

        const uniqueDevelopers = [
          ...new Map(
            propertyData
              .filter(
                (property) =>
                  property?.coreDetails?.developerName
              )
              .map((property) => {
                const developer =
                  property?.coreDetails?.developerRef;

                return [
                  property.coreDetails.developerName,
                  {
                    name:
                      property.coreDetails.developerName,

                    logo:
                      developer?.logo ||
                      developer?.image ||
                      property.coreDetails.developerLogo ||
                      property.coreDetails.developerImage ||
                      "/placeholder.jpg",
                  },
                ];
              })
          ).values(),
        ].sort((a, b) =>
          a.name.localeCompare(b.name)
        );

        setDevelopers(uniqueDevelopers);

        // ======================================================
        // PROPERTY TYPES
        // ======================================================

        const uniqueCategories = [
          ...new Set(
            propertyData
              .map(
                (property) =>
                  property?.categoryData?.categoryName
              )
              .filter(Boolean)
          ),
        ].sort((a, b) => a.localeCompare(b));

        setPropertyTypes(uniqueCategories);
      } catch (err) {
        console.error(
          "Failed to fetch properties:",
          err
        );
      }
    };

    fetchProperties();

    return () => {
      mounted = false;
    };
  }, []);

  // ============================================================
  // HANDLE FILTER CHANGE
  // ============================================================

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // ============================================================
  // NORMALIZE LOCATION
  // ============================================================

  const normalizeLocation = (value = "") => {
    return value
      .toLowerCase()
      .replace(/gurugram/g, "gurgaon")
      .replace(/gurgaon/g, "gurgaon")
      .replace(/new delhi/g, "delhi")
      .replace(/-/g, " ")
      .replace(/,/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  // ============================================================
  // FIND BEST LOCATION
  // ============================================================

  const findBestLocationMatch = (address = {}) => {
    const candidates = [
      address.locality,
      address.city,
      address.principalSubdivision,
      address.localityInfo?.administrative?.[2]?.name,
      address.localityInfo?.administrative?.[3]?.name,
      address.localityInfo?.administrative?.[4]?.name,
    ]
      .filter(Boolean)
      .map((item) => normalizeLocation(item));

    if (!candidates.length) {
      return "";
    }

    let bestMatch = "";

    for (const location of locations) {
      const normalizedLocation =
        normalizeLocation(location);

      if (!normalizedLocation) continue;

      for (const candidate of candidates) {
        if (
          candidate === normalizedLocation ||
          candidate.includes(normalizedLocation) ||
          normalizedLocation.includes(candidate)
        ) {
          bestMatch = location;
          break;
        }
      }

      if (bestMatch) break;
    }

    if (bestMatch) {
      return bestMatch;
    }

    return (
      address.locality ||
      address.city ||
      address.principalSubdivision ||
      ""
    );
  };

  // ============================================================
  // USE MY CURRENT LOCATION
  // ============================================================

  const handleUseMyLocation = () => {
    setLocationMessage("");

    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not supported by this browser."
      );
      return;
    }

    setGettingLocation(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          setCurrentCoordinates({
            latitude,
            longitude,
          });

          // ======================================================
          // REVERSE GEOCODING
          // ======================================================

          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
          );

          if (!response.ok) {
            throw new Error(
              "Unable to determine location"
            );
          }

          const address = await response.json();

          const matchedLocation =
            findBestLocationMatch(address);

          if (!matchedLocation) {
            setLocationMessage(
              "We couldn't find properties for your exact area."
            );

            setGettingLocation(false);
            return;
          }

          // ======================================================
          // UPDATE LOCATION FILTER
          // ======================================================

          setFilters((prev) => ({
            ...prev,
            location: matchedLocation,
          }));

          setLocationMessage(
            `Showing properties near ${matchedLocation}`
          );

          setGettingLocation(false);

          // ======================================================
          // AUTOMATIC SEARCH
          // ======================================================

          const params = new URLSearchParams();

          params.set(
            "location",
            matchedLocation
          );

          params.set(
            "lat",
            latitude.toString()
          );

          params.set(
            "lng",
            longitude.toString()
          );

          params.set(
            "nearby",
            "true"
          );

          router.push(
            `/properties?${params.toString()}`
          );
        } catch (error) {
          console.error(
            "Location detection failed:",
            error
          );

          setLocationMessage(
            "We couldn't determine your location. Please select a location manually."
          );

          setGettingLocation(false);
        }
      },

      (error) => {
        console.error(
          "Geolocation error:",
          error
        );

        setGettingLocation(false);

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          setLocationMessage(
            "Location access was denied. Please allow location access in your browser."
          );
        } else if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          setLocationMessage(
            "Your current location is unavailable."
          );
        } else if (
          error.code ===
          error.TIMEOUT
        ) {
          setLocationMessage(
            "Location request timed out. Please try again."
          );
        } else {
          setLocationMessage(
            "Unable to detect your location."
          );
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  // ============================================================
  // NORMAL SEARCH
  // ============================================================

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set(
        "search",
        searchTerm.trim()
      );
    }

    if (filters.location) {
      params.set(
        "location",
        filters.location
      );
    }

    if (filters.developer) {
      params.set(
        "developer",
        filters.developer
      );
    }

    if (filters.propertyType) {
      params.set(
        "propertyType",
        filters.propertyType
      );
    }

    if (filters.budget) {
      params.set(
        "budget",
        filters.budget
      );
    }

    // Preserve coordinates if available.
    if (currentCoordinates) {
      params.set(
        "lat",
        currentCoordinates.latitude.toString()
      );

      params.set(
        "lng",
        currentCoordinates.longitude.toString()
      );
    }

    const query = params.toString();

    router.push(
      `/properties${query ? `?${query}` : ""}`
    );
  };

  // ============================================================
  // OPTIONS
  // ============================================================

  const developerOptions = developers
    .slice(0, 5)
    .map((developer) => developer.name);

  const locationOptions = locations.slice(0, 6);

  // ============================================================
  // SEARCH SUGGESTIONS
  // ============================================================

  const suggestions = properties
    .filter((property) => {
      const search =
        searchTerm.toLowerCase();

      const title =
        property?.coreDetails?.title || "";

      const location =
        property?.locationData?.locationName || "";

      const developer =
        property?.coreDetails?.developerName || "";

      return (
        title.toLowerCase().includes(search) ||
        location.toLowerCase().includes(search) ||
        developer.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => {
      const aTitle =
        a?.coreDetails?.title || "";

      const bTitle =
        b?.coreDetails?.title || "";

      const search =
        searchTerm.toLowerCase();

      const aStarts =
        aTitle.toLowerCase().startsWith(search);

      const bStarts =
        bTitle.toLowerCase().startsWith(search);

      if (aStarts && !bStarts) return -1;

      if (!aStarts && bStarts) return 1;

      return aTitle.localeCompare(bTitle);
    })
    .slice(0, 8);

  // ============================================================
  // JSX
  // ============================================================

  return (
    <>
      {/* ========================================================
          MAIN SEARCH PANEL
      ======================================================== */}

      <div
        className="
          relative
          z-[200]
          w-full
          max-w-[1380px]
          mx-auto
          px-4
          sm:px-5
          lg:px-6
          xl:px-0
        "
      >
        <div
          className="
            relative
            z-[200]
            w-full
            rounded-[22px]
            border
            border-[#e7dfd2]
            bg-[#fffdfa]
            shadow-[0_18px_55px_rgba(15,59,46,0.14)]
          "
        >
          {/* ====================================================
              SEARCH INPUT ROW
          ==================================================== */}

          <div
            className="
              relative
              z-[3000]
              px-3
              sm:px-4
              lg:px-5
              pt-3
              lg:pt-4
            "
          >
            <div
              className="
                relative
                flex
                h-[52px]
                lg:h-[54px]
                items-center
                rounded-[13px]
                border
                border-[#e8e2d8]
                bg-[#f8f5ef]
                px-4
                lg:px-5
              "
            >
              {/* Search Icon */}

              <Search
                size={18}
                strokeWidth={1.8}
                className="
                  mr-3
                  shrink-0
                  text-[#b08a4b]
                "
              />

              {/* Search Input */}

              <input
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => {
                  if (searchTerm.trim()) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch();
                  }

                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Search by property name, project, or landmark"
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  outline-none
                  text-[13px]
                  lg:text-[14px]
                  font-medium
                  text-[#17342d]
                  placeholder:text-[#17342d]/40
                "
              />

              {/* ==================================================
                  USE MY LOCATION
              ================================================== */}

              <div className="relative ml-3 shrink-0">
                <motion.button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={gettingLocation}
                  whileHover={{
                    scale: 1.02,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    group
                    flex
                    items-center
                    gap-2
                    text-[#0f3b2e]
                    disabled:cursor-wait
                    disabled:opacity-55
                  "
                >
                  <span
                    className="
                      flex
                      h-7
                      w-7
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-[#c89d58]/30
                      bg-[#c89d58]/10
                      transition-all
                      group-hover:border-[#c89d58]/60
                      group-hover:bg-[#c89d58]/15
                    "
                  >
                    {gettingLocation ? (
                      <motion.span
                        animate={{
                          rotate: 360,
                        }}
                        transition={{
                          duration: 1,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      >
                        <LocateFixed
                          size={14}
                          className="text-[#a87d39]"
                        />
                      </motion.span>
                    ) : (
                      <MapPin
                        size={14}
                        className="
                          text-[#a87d39]
                          transition-transform
                          group-hover:scale-110
                        "
                      />
                    )}
                  </span>

                  <span
                    className="
                      hidden
                      lg:inline
                      whitespace-nowrap
                      text-[10px]
                      xl:text-[11px]
                      font-semibold
                      uppercase
                      tracking-[1.4px]
                      text-[#17342d]/75
                    "
                  >
                    {gettingLocation
                      ? "Locating..."
                      : "Use My Location"}
                  </span>
                </motion.button>

                {/* LOCATION STATUS */}

                <AnimatePresence>
                  {locationMessage && (
                    <motion.div
                      initial={{
                        opacity: 0,
                        y: 6,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        y: 6,
                      }}
                      className="
                        absolute
                        right-0
                        top-[40px]
                        z-[999999]
                        w-[280px]
                        rounded-[14px]
                        border
                        border-[#c89d58]/25
                        bg-[#102f27]
                        px-4
                        py-3
                        shadow-[0_20px_50px_rgba(0,0,0,0.25)]
                      "
                    >
                      <div className="flex items-start gap-3">
                        <MapPin
                          size={15}
                          className="
                            mt-0.5
                            shrink-0
                            text-[#d4ae67]
                          "
                        />

                        <p
                          className="
                            text-[11px]
                            leading-relaxed
                            text-white/75
                          "
                        >
                          {locationMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ==================================================
                SEARCH SUGGESTIONS
            ================================================== */}

            <AnimatePresence>
              {showSuggestions &&
                searchTerm &&
                suggestions.length > 0 && (
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
                      left-3
                      right-3
                      top-[68px]
                      z-[99999]
                      overflow-hidden
                      rounded-[16px]
                      border
                      border-[#e5ddd0]
                      bg-[#fffdfa]
                      shadow-[0_25px_70px_rgba(15,59,46,0.18)]
                      sm:left-4
                      sm:right-4
                      lg:left-5
                      lg:right-5
                      lg:top-[72px]
                    "
                  >
                    {suggestions.map((property) => (
                      <button
                        key={property._id}
                        type="button"
                        onClick={() => {
                          router.push(
                            `/${property.slug}`
                          );

                          setShowSuggestions(false);
                        }}
                        className="
                          block
                          w-full
                          border-b
                          border-[#eee8de]
                          px-5
                          py-3.5
                          text-left
                          transition-colors
                          last:border-none
                          hover:bg-[#f7f3ec]
                        "
                      >
                        <p
                          className="
                            text-[13px]
                            font-semibold
                            text-[#17342d]
                          "
                        >
                          {
                            property?.coreDetails
                              ?.title
                          }
                        </p>

                        <p
                          className="
                            mt-1
                            text-[10px]
                            text-[#17342d]/45
                          "
                        >
                          {
                            property?.locationData
                              ?.locationName
                          }
                        </p>
                      </button>
                    ))}
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* ====================================================
              FILTER ROW
          ==================================================== */}

          <div
            className="
              relative
              z-[1000]
              px-3
              pb-3
              pt-3
              sm:px-4
              lg:px-5
              lg:pb-4
            "
          >
            <div
              className="
                relative
                z-[1000]
                grid
                w-full
                overflow-visible
                rounded-[15px]
                border
                border-[#e8e0d4]
                bg-white
                lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_132px]
              "
            >
              {/* ==================================================
                  PROPERTY TYPE
              ================================================== */}

              <div
                className="
                  min-w-0
                  border-b
                  border-[#ece5db]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <LuxuryDropdown
                  icon={Building2}
                  label="PROPERTY TYPE"
                  placeholder="Select Type"
                  value={filters.propertyType}
                  options={propertyTypes}
                  onChange={(value) =>
                    handleChange(
                      "propertyType",
                      value
                    )
                  }
                />
              </div>

              {/* ==================================================
                  BUDGET
              ================================================== */}

              <div
                className="
                  min-w-0
                  border-b
                  border-[#ece5db]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <LuxuryDropdown
                  icon={SlidersHorizontal}
                  label="BUDGET"
                  placeholder="Budget Range"
                  value={filters.budgetLabel || ""}
                  budgetSlider={true}
                  onChange={(budgetData) => {
                    setFilters((prev) => ({
                      ...prev,
                      budget:
                        budgetData.value,
                      budgetLabel:
                        budgetData.label,
                    }));
                  }}
                />
              </div>

              {/* ==================================================
                  LOCATION
              ================================================== */}

              <div
                className="
                  min-w-0
                  border-b
                  border-[#ece5db]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <LuxuryDropdown
                  icon={MapPin}
                  label="LOCATION"
                  placeholder="Select Location"
                  value={filters.location}
                  options={[
                    ...locationOptions,
                    "View All Locations →",
                  ]}
                  onChange={(value) => {
                    if (
                      value ===
                      "View All Locations →"
                    ) {
                      setLocationSearch("");
                      setShowLocationModal(true);
                      return;
                    }

                    handleChange(
                      "location",
                      value
                    );
                  }}
                />
              </div>

              {/* ==================================================
                  DEVELOPER
              ================================================== */}

              <div
                className="
                  min-w-0
                  border-b
                  border-[#ece5db]
                  lg:border-b-0
                  lg:border-r
                "
              >
                <LuxuryDropdown
                  icon={Building2}
                  label="DEVELOPER"
                  placeholder="Select Developer"
                  value={filters.developer}
                  options={[
                    ...developerOptions,
                    "View All Developers →",
                  ]}
                  onChange={(value) => {
                    if (
                      value ===
                      "View All Developers →"
                    ) {
                      setDeveloperSearch("");
                      setShowDeveloperModal(true);
                      return;
                    }

                    handleChange(
                      "developer",
                      value
                    );
                  }}
                />
              </div>

              {/* ==================================================
                  SEARCH BUTTON
              ================================================== */}

              <motion.button
                type="button"
                whileHover={{
                  y: -1,
                }}
                whileTap={{
                  scale: 0.98,
                }}
                onClick={handleSearch}
                className="
                  relative
                  min-h-[58px]
                  overflow-hidden
                  rounded-b-[14px]
                  bg-[#0f3b2e]
                  px-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[2px]
                  text-white
                  transition-all
                  hover:bg-[#173f34]
                  lg:min-h-[70px]
                  lg:rounded-bl-none
                  lg:rounded-r-[14px]
                "
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Search

                  <span className="text-[17px] leading-none text-[#d4ae67]">
                    →
                  </span>
                </span>

                {/* Subtle gold highlight */}

                <span
                  className="
                    pointer-events-none
                    absolute
                    inset-x-0
                    top-0
                    h-px
                    bg-gradient-to-r
                    from-transparent
                    via-[#d4ae67]
                    to-transparent
                    opacity-80
                  "
                />
              </motion.button>
            </div>
          </div>

          {/* ====================================================
              TAGLINE
          ==================================================== */}

          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              px-4
              pb-3
              text-center
            "
          >
            <Building2
              size={12}
              strokeWidth={1.5}
              className="
                shrink-0
                text-[#b08a4b]
              "
            />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[2px]
                text-[#17342d]/50
                sm:text-[10px]
                sm:tracking-[3px]
              "
            >
              Explore Luxury. Invest With Confidence.
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================
          DEVELOPER MODAL
      ======================================================== */}

      <AnimatePresence>
        {showDeveloperModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[999999]
              flex
              items-start
              justify-center
              bg-black/45
              px-4
              pb-8
              pt-[100px]
              backdrop-blur-[5px]
            "
            onClick={() =>
              setShowDeveloperModal(false)
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
                overflow-hidden
                rounded-[28px]
                border
                border-[#c89d58]/20
                bg-[#0b0b0b]
                shadow-[0_40px_120px_rgba(0,0,0,0.65)]
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
                  border-b
                  border-white/10
                  bg-[#0b0b0b]
                  px-6
                  py-5
                "
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p
                      className="
                        mb-2
                        text-[10px]
                        uppercase
                        tracking-[3px]
                        text-[#c89d58]
                      "
                    >
                      Developer Directory
                    </p>

                    <h3
                      className="
                        text-[22px]
                        font-semibold
                        leading-none
                        text-white
                      "
                    >
                      Select Developer
                    </h3>

                    <p
                      className="
                        mt-2
                        text-[13px]
                        text-white/45
                      "
                    >
                      Browse all developer partners
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setShowDeveloperModal(false)
                    }
                    className="
                      flex
                      h-9
                      w-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white/5
                      text-white/60
                      transition-all
                      hover:bg-white/10
                    "
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* SEARCH */}

              <div
                className="
                  border-b
                  border-white/10
                  bg-[#0b0b0b]
                  p-5
                "
              >
                <input
                  value={developerSearch}
                  onChange={(e) =>
                    setDeveloperSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search developer..."
                  className="
                    h-[50px]
                    w-full
                    rounded-[16px]
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    text-white
                    outline-none
                    placeholder:text-white/35
                    focus:border-[#c89d58]/40
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
                  .filter((developer) =>
                    developer.name
                      .toLowerCase()
                      .includes(
                        developerSearch.toLowerCase()
                      )
                  )
                  .map((developer) => (
                    <button
                      key={developer.name}
                      type="button"
                      onClick={() => {
                        handleChange(
                          "developer",
                          developer.name
                        );

                        setShowDeveloperModal(false);
                      }}
                      className="
                        group
                        flex
                        w-full
                        items-center
                        gap-4
                        border-b
                        border-white/[0.04]
                        px-6
                        py-4
                        text-left
                        transition-all
                        hover:bg-white/[0.03]
                      "
                    >
                      <img
                        src={developer.logo}
                        alt={developer.name}
                        onError={(e) => {
                          e.currentTarget.src =
                            "/placeholder.jpg";
                        }}
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-xl
                          border
                          border-white/10
                          bg-white/5
                          object-cover
                        "
                      />

                      <div className="flex-1">
                        <p
                          className="
                            text-[15px]
                            font-medium
                            text-white
                            transition-colors
                            group-hover:text-[#c89d58]
                          "
                        >
                          {developer.name}
                        </p>

                        <p
                          className="
                            mt-0.5
                            text-[12px]
                            text-white/40
                          "
                        >
                          Developer Partner
                        </p>
                      </div>
                    </button>
                  ))}

                {developers.filter((developer) =>
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

        {/* ======================================================
            LOCATION MODAL
        ====================================================== */}

        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="
              fixed
              inset-0
              z-[999999]
              flex
              items-start
              justify-center
              bg-black/45
              px-4
              pb-8
              pt-[100px]
              backdrop-blur-[5px]
            "
            onClick={() =>
              setShowLocationModal(false)
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
                overflow-hidden
                rounded-[28px]
                border
                border-[#c89d58]/20
                bg-[#0b0b0b]
                shadow-[0_40px_120px_rgba(0,0,0,0.65)]
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
                  border-b
                  border-white/10
                  px-6
                  py-5
                "
              >
                <p
                  className="
                    mb-2
                    text-[10px]
                    uppercase
                    tracking-[3px]
                    text-[#c89d58]
                  "
                >
                  Location Directory
                </p>

                <h3
                  className="
                    text-[22px]
                    font-semibold
                    text-white
                  "
                >
                  Select Location
                </h3>

                <p
                  className="
                    mt-2
                    text-[13px]
                    text-white/45
                  "
                >
                  Browse all available locations
                </p>
              </div>

              {/* SEARCH */}

              <div
                className="
                  border-b
                  border-white/10
                  p-5
                "
              >
                <input
                  value={locationSearch}
                  onChange={(e) =>
                    setLocationSearch(
                      e.target.value
                    )
                  }
                  placeholder="Search location..."
                  className="
                    h-[50px]
                    w-full
                    rounded-[16px]
                    border
                    border-white/10
                    bg-white/[0.04]
                    px-5
                    text-white
                    outline-none
                    placeholder:text-white/35
                    focus:border-[#c89d58]/40
                  "
                />
              </div>

              {/* LIST */}

              <div className="max-h-[260px] overflow-y-auto">
                {locations
                  .filter((loc) =>
                    loc
                      .toLowerCase()
                      .includes(
                        locationSearch.toLowerCase()
                      )
                  )
                  .map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => {
                        handleChange(
                          "location",
                          loc
                        );

                        setShowLocationModal(false);
                      }}
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        border-b
                        border-white/[0.04]
                        px-6
                        py-4
                        text-left
                        transition-all
                        hover:bg-white/[0.03]
                      "
                    >
                      <span className="text-[14px] text-white">
                        {loc}
                      </span>

                      <span className="text-[16px] text-[#c89d58]">
                        →
                      </span>
                    </button>
                  ))}

                {locations.filter((loc) =>
                  loc
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
    </>
  );
}