"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LuxuryDropdown from "./LuxuryDropdown";

import {
  Search,
  Building2,
  SlidersHorizontal,
  MapPin,
  LocateFixed,
  Mic,
  MicOff,
} from "lucide-react";

/* ============================================================
   FUZZY SEARCH HELPERS
   These functions allow searches with minor spelling mistakes.
============================================================ */

const normalizeSearchText = (value = "") => {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/gurugram/g, "gurgaon")
    .replace(/new delhi/g, "delhi")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
};

const levenshteinDistance = (first = "", second = "") => {
  const a = String(first);
  const b = String(second);

  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;

  let previousRow = Array.from(
    { length: b.length + 1 },
    (_, index) => index
  );

  for (let i = 1; i <= a.length; i++) {
    const currentRow = [i];

    for (let j = 1; j <= b.length; j++) {
      const substitutionCost =
        a[i - 1] === b[j - 1] ? 0 : 1;

      currentRow[j] = Math.min(
        currentRow[j - 1] + 1,
        previousRow[j] + 1,
        previousRow[j - 1] + substitutionCost
      );
    }

    previousRow = currentRow;
  }

  return previousRow[b.length];
};

/*
 * Scores one search word against one candidate word.
 *
 * Exact matches score highest.
 * Small spelling mistakes are accepted for longer words.
 * Very short words are deliberately kept stricter to avoid
 * returning too many irrelevant suggestions.
 */
const getWordMatchScore = (queryWord, candidateWord) => {
  if (!queryWord || !candidateWord) return 0;

  if (candidateWord === queryWord) {
    return 100;
  }

  if (candidateWord.startsWith(queryWord)) {
    return queryWord.length >= 2 ? 88 : 0;
  }

  if (candidateWord.includes(queryWord)) {
    return queryWord.length >= 3 ? 78 : 0;
  }

  if (queryWord.length < 4 || candidateWord.length < 4) {
    return 0;
  }

  const distance = levenshteinDistance(
    queryWord,
    candidateWord
  );

  const maxLength = Math.max(
    queryWord.length,
    candidateWord.length
  );

  const allowedDistance =
    maxLength >= 8 ? 2 : maxLength >= 5 ? 2 : 1;

  if (distance > allowedDistance) {
    return 0;
  }

  /*
   * "flowers" and "floors" have a small edit distance,
   * so a search such as "Spiti Flowers" can match
   * "Spiti Floors".
   */
  return Math.max(
    0,
    76 - distance * 17
  );
};

/*
 * Scores a complete query against a title, location, or developer.
 * Every query word must match somewhere in the candidate.
 * This prevents a single matching word from making an
 * unrelated result rank highly.
 */
const getFuzzyMatchScore = (query, candidate) => {
  const normalizedQuery = normalizeSearchText(query);
  const normalizedCandidate = normalizeSearchText(candidate);

  if (!normalizedQuery || !normalizedCandidate) {
    return 0;
  }

  if (normalizedCandidate === normalizedQuery) {
    return 120;
  }

  if (normalizedCandidate.includes(normalizedQuery)) {
    return 110;
  }

  const queryWords = normalizedQuery
    .split(" ")
    .filter(Boolean);

  const candidateWords = normalizedCandidate
    .split(" ")
    .filter(Boolean);

  if (!queryWords.length || !candidateWords.length) {
    return 0;
  }

  let totalScore = 0;

  for (const queryWord of queryWords) {
    let bestWordScore = 0;

    for (const candidateWord of candidateWords) {
      const score = getWordMatchScore(
        queryWord,
        candidateWord
      );

      if (score > bestWordScore) {
        bestWordScore = score;
      }
    }

    /*
     * Every query word needs a reasonable match.
     * Otherwise, do not return the candidate.
     */
    if (bestWordScore < 45) {
      return 0;
    }

    totalScore += bestWordScore;
  }

  const averageScore =
    totalScore / queryWords.length;

  /*
   * Slightly favor candidates containing the entire query
   * in the same order.
   */
  if (
    normalizedCandidate.includes(normalizedQuery)
  ) {
    return averageScore + 12;
  }

  return averageScore;
};

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
  // VOICE SEARCH
  // ============================================================

  const [isListening, setIsListening] = useState(false);
  const [voiceMessage, setVoiceMessage] = useState("");
  const recognitionRef = useRef(null);

  // ============================================================
  // MODALS
  // ============================================================

  const [showDeveloperModal, setShowDeveloperModal] =
    useState(false);

  const [showLocationModal, setShowLocationModal] =
    useState(false);

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
  const [currentCoordinates, setCurrentCoordinates] =
    useState(null);

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
          throw new Error(
            `Properties request failed: ${res.status}`
          );
        }

        const data = await res.json();

        if (!mounted) return;

        const propertyData = Array.isArray(data?.data)
          ? data.data
          : [];

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
                  property.coreDetails.developerRef;

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

          // REVERSE GEOCODING

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

          // UPDATE LOCATION FILTER

          setFilters((prev) => ({
            ...prev,
            location: matchedLocation,
          }));

          setLocationMessage(
            `Showing properties near ${matchedLocation}`
          );

          setGettingLocation(false);

          // AUTOMATIC SEARCH

          const params = new URLSearchParams();

          params.set("location", matchedLocation);
          params.set("lat", latitude.toString());
          params.set("lng", longitude.toString());
          params.set("nearby", "true");

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

        if (error.code === error.PERMISSION_DENIED) {
          setLocationMessage(
            "Location access was denied. Please allow location access in your browser."
          );
        } else if (
          error.code === error.POSITION_UNAVAILABLE
        ) {
          setLocationMessage(
            "Your current location is unavailable."
          );
        } else if (error.code === error.TIMEOUT) {
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
      params.set("search", searchTerm.trim());
    }

    if (filters.location) {
      params.set("location", filters.location);
    }

    if (filters.developer) {
      params.set("developer", filters.developer);
    }

    if (filters.propertyType) {
      params.set("propertyType", filters.propertyType);
    }

    if (filters.budget) {
      params.set("budget", filters.budget);
    }

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

    setShowSuggestions(false);

    const query = params.toString();

    router.push(
      `/properties${query ? `?${query}` : ""}`
    );
  };

  // ============================================================
  // VOICE SEARCH — SPEECH TO TEXT
  // ============================================================

  const handleVoiceSearch = () => {
    setVoiceMessage("");

    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
      setIsListening(false);
      return;
    }

    if (typeof window === "undefined") return;

    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceMessage(
        "Voice search is not supported in this browser. Please try Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = "en-IN";
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognitionRef.current = recognition;

    recognition.onstart = () => {
      setIsListening(true);
      setVoiceMessage(
        "Listening... Speak your property search."
      );
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ")
        .trim();

      if (transcript) {
        setSearchTerm(transcript);
        setShowSuggestions(true);
        setVoiceMessage(
          "Your speech has been added to search."
        );
      }
    };

    recognition.onerror = (event) => {
      setIsListening(false);
      recognitionRef.current = null;

      if (event.error === "not-allowed") {
        setVoiceMessage(
          "Microphone access denied. Allow microphone access in your browser settings."
        );
      } else if (event.error === "no-speech") {
        setVoiceMessage(
          "No speech detected. Tap the microphone and try again."
        );
      } else if (event.error !== "aborted") {
        setVoiceMessage(
          "Voice search could not start. Please try again."
        );
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
    };

    try {
      recognition.start();
    } catch (error) {
      recognitionRef.current = null;
      setIsListening(false);
      setVoiceMessage(
        "Unable to start the microphone. Please try again."
      );
    }
  };

  // Stop voice recognition when the component unmounts.

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.onend = null;
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, []);

  // ============================================================
  // OPTIONS
  // ============================================================

  const developerOptions = developers
    .slice(0, 5)
    .map((developer) => developer.name);

  const locationOptions = locations.slice(0, 6);

  // ============================================================
  // FUZZY SEARCH SUGGESTIONS
  // Properties + locations + developers
  // ============================================================

  const suggestions = useMemo(() => {
    const query = searchTerm.trim();

    if (!query || query.length < 2) {
      return [];
    }

    const results = [];

    // ----------------------------------------------------------
    // PROPERTY SUGGESTIONS
    // ----------------------------------------------------------

    for (const property of properties) {
      const title =
        property?.coreDetails?.title || "";

      const location =
        property?.locationData?.locationName || "";

      const developer =
        property?.coreDetails?.developerName || "";

      const titleScore = getFuzzyMatchScore(
        query,
        title
      );

      const locationScore = getFuzzyMatchScore(
        query,
        location
      );

      const developerScore = getFuzzyMatchScore(
        query,
        developer
      );

      const score = Math.max(
        titleScore,
        locationScore * 0.92,
        developerScore * 0.96
      );

      if (score >= 45) {
        results.push({
          type: "property",
          key: `property-${property._id || property.slug || title}`,
          label: title || "Property",
          subtitle: [
            location,
            developer,
          ].filter(Boolean).join(" · "),
          score,
          property,
        });
      }
    }

    // ----------------------------------------------------------
    // LOCATION SUGGESTIONS
    // ----------------------------------------------------------

    for (const location of locations) {
      const score = getFuzzyMatchScore(
        query,
        location
      );

      if (score >= 45) {
        results.push({
          type: "location",
          key: `location-${location}`,
          label: location,
          subtitle: "Explore properties in this location",
          score,
          location,
        });
      }
    }

    // ----------------------------------------------------------
    // DEVELOPER SUGGESTIONS
    // ----------------------------------------------------------

    for (const developer of developers) {
      const score = getFuzzyMatchScore(
        query,
        developer.name
      );

      if (score >= 45) {
        results.push({
          type: "developer",
          key: `developer-${developer.name}`,
          label: developer.name,
          subtitle: "Explore this developer's properties",
          score,
          developer,
        });
      }
    }

    // ----------------------------------------------------------
    // RANK AND REMOVE DUPLICATES
    // ----------------------------------------------------------

    const seen = new Set();

    return results
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }

        return a.label.localeCompare(b.label);
      })
      .filter((item) => {
        const uniqueKey =
          `${item.type}-${normalizeSearchText(item.label)}`;

        if (seen.has(uniqueKey)) {
          return false;
        }

        seen.add(uniqueKey);
        return true;
      })
      .slice(0, 8);
  }, [
    searchTerm,
    properties,
    locations,
    developers,
  ]);

  // ============================================================
  // SELECT A SEARCH SUGGESTION
  // ============================================================

  const handleSuggestionSelect = (suggestion) => {
    setShowSuggestions(false);

    if (suggestion.type === "property") {
      const slug = suggestion.property?.slug;

      if (slug) {
        router.push(`/${slug}`);
      }

      return;
    }

    const params = new URLSearchParams();

    if (suggestion.type === "location") {
      setFilters((prev) => ({
        ...prev,
        location: suggestion.location,
      }));

      params.set("location", suggestion.location);
    }

    if (suggestion.type === "developer") {
      setFilters((prev) => ({
        ...prev,
        developer: suggestion.developer.name,
      }));

      params.set(
        "developer",
        suggestion.developer.name
      );
    }

    if (filters.propertyType) {
      params.set(
        "propertyType",
        filters.propertyType
      );
    }

    if (filters.budget) {
      params.set("budget", filters.budget);
    }

    router.push(`/properties?${params.toString()}`);
  };

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
          {/* SEARCH INPUT ROW */}

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
              <Search
                size={18}
                strokeWidth={1.8}
                className="mr-3 shrink-0 text-[#b08a4b]"
              />

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
                    e.preventDefault();
                    handleSearch();
                  }

                  if (e.key === "Escape") {
                    setShowSuggestions(false);
                  }
                }}
                placeholder="Search by property name, project, developer, or location"
                autoComplete="off"
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

              {/* VOICE SEARCH BUTTON */}

              <motion.button
                type="button"
                onClick={handleVoiceSearch}
                whileTap={{ scale: 0.92 }}
                aria-label={
                  isListening
                    ? "Stop voice search"
                    : "Start voice search"
                }
                aria-pressed={isListening}
                title={
                  isListening
                    ? "Stop listening"
                    : "Search using your voice"
                }
                className={`
                  relative ml-2 flex h-9 w-9 shrink-0
                  items-center justify-center rounded-xl
                  border transition-colors duration-200
                  ${
                    isListening
                      ? "border-red-300 bg-red-50 text-red-600"
                      : "border-[#c89d58]/30 bg-white text-[#0f3b2e] hover:bg-[#f7f3ee]"
                  }
                `}
              >
                {isListening && (
                  <motion.span
                    aria-hidden="true"
                    className="absolute inset-0 rounded-xl border border-red-400"
                    animate={{
                      scale: [1, 1.2],
                      opacity: [0.8, 0],
                    }}
                    transition={{
                      duration: 1.2,
                      repeat: Infinity,
                      ease: "easeOut",
                    }}
                  />
                )}

                {isListening ? (
                  <MicOff size={17} />
                ) : (
                  <Mic size={17} />
                )}
              </motion.button>

              {/* USE MY LOCATION */}

              <div className="relative ml-3 shrink-0">
                <motion.button
                  type="button"
                  onClick={handleUseMyLocation}
                  disabled={gettingLocation}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
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
                        animate={{ rotate: 360 }}
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

                <AnimatePresence>
                  {locationMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
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
                          className="mt-0.5 shrink-0 text-[#d4ae67]"
                        />

                        <p className="text-[11px] leading-relaxed text-white/75">
                          {locationMessage}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* VOICE SEARCH STATUS */}

            <AnimatePresence>
              {voiceMessage && (
                <motion.p
                  role="status"
                  aria-live="polite"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className={`mt-2 px-2 text-[10px] ${
                    isListening
                      ? "text-[#a87d39]"
                      : "text-[#17342d]/65"
                  }`}
                >
                  {isListening && (
                    <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                  )}
                  {voiceMessage}
                </motion.p>
              )}
            </AnimatePresence>

            {/* SEARCH SUGGESTIONS */}

            <AnimatePresence>
              {showSuggestions &&
                searchTerm.trim() &&
                suggestions.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
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
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.key}
                        type="button"
                        onClick={() =>
                          handleSuggestionSelect(suggestion)
                        }
                        className="
                          flex
                          w-full
                          items-center
                          gap-3
                          border-b
                          border-[#eee8de]
                          px-4
                          py-3
                          text-left
                          transition-colors
                          last:border-none
                          hover:bg-[#f7f3ec]
                          sm:px-5
                        "
                      >
                        <span
                          className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-[#c89d58]/20
                            bg-[#c89d58]/10
                            text-[#a87d39]
                          "
                        >
                          {suggestion.type === "location" ? (
                            <MapPin size={16} />
                          ) : (
                            <Building2 size={16} />
                          )}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="flex flex-wrap items-center gap-2">
                            <span className="text-[13px] font-semibold text-[#17342d]">
                              {suggestion.label}
                            </span>

                            <span
                              className="
                                rounded-full
                                border
                                border-[#c89d58]/25
                                bg-[#c89d58]/10
                                px-2
                                py-0.5
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-[0.8px]
                                text-[#8c692f]
                              "
                            >
                              {suggestion.type === "property"
                                ? "Property"
                                : suggestion.type === "location"
                                  ? "Location"
                                  : "Developer"}
                            </span>
                          </span>

                          <span className="mt-1 block truncate text-[10px] text-[#17342d]/55">
                            {suggestion.subtitle}
                          </span>
                        </span>

                        <span className="shrink-0 text-[17px] text-[#b08a4b]">
                          →
                        </span>
                      </button>
                    ))}
                  </motion.div>
                )}

              {showSuggestions &&
                searchTerm.trim().length >= 2 &&
                suggestions.length === 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="
                      absolute
                      left-3
                      right-3
                      top-[68px]
                      z-[99999]
                      rounded-[16px]
                      border
                      border-[#e5ddd0]
                      bg-[#fffdfa]
                      px-5
                      py-5
                      shadow-[0_25px_70px_rgba(15,59,46,0.18)]
                      sm:left-4
                      sm:right-4
                      lg:left-5
                      lg:right-5
                      lg:top-[72px]
                    "
                  >
                    <p className="text-[12px] font-semibold text-[#17342d]">
                      No matching suggestions found
                    </p>

                    <p className="mt-1 text-[11px] text-[#17342d]/55">
                      Try a project name, developer, or location. You can also press Enter to search.
                    </p>
                  </motion.div>
                )}
            </AnimatePresence>
          </div>

          {/* FILTER ROW */}

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
              {/* PROPERTY TYPE */}

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
                    handleChange("propertyType", value)
                  }
                />
              </div>

              {/* BUDGET */}

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
                      budget: budgetData.value,
                      budgetLabel: budgetData.label,
                    }));
                  }}
                />
              </div>

              {/* LOCATION */}

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
                    if (value === "View All Locations →") {
                      setLocationSearch("");
                      setShowLocationModal(true);
                      return;
                    }

                    handleChange("location", value);
                  }}
                />
              </div>

              {/* DEVELOPER */}

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
                    if (value === "View All Developers →") {
                      setDeveloperSearch("");
                      setShowDeveloperModal(true);
                      return;
                    }

                    handleChange("developer", value);
                  }}
                />
              </div>

              {/* SEARCH BUTTON */}

              <motion.button
                type="button"
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
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

          {/* TAGLINE */}

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
              className="shrink-0 text-[#b08a4b]"
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
            onClick={() => setShowDeveloperModal(false)}
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
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
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
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

              {/* HEADER */}

              <div className="border-b border-white/10 bg-[#0b0b0b] px-6 py-5">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[#c89d58]">
                      Developer Directory
                    </p>

                    <h3 className="text-[22px] font-semibold leading-none text-white">
                      Select Developer
                    </h3>

                    <p className="mt-2 text-[13px] text-white/45">
                      Browse all developer partners
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowDeveloperModal(false)}
                    aria-label="Close developer directory"
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-white/60 transition-all hover:bg-white/10"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* SEARCH */}

              <div className="border-b border-white/10 bg-[#0b0b0b] p-5">
                <input
                  value={developerSearch}
                  onChange={(e) =>
                    setDeveloperSearch(e.target.value)
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

              <div className="max-h-[260px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                {developers
                  .filter((developer) =>
                    getFuzzyMatchScore(
                      developerSearch,
                      developer.name
                    ) >= 45
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
                        <p className="text-[15px] font-medium text-white transition-colors group-hover:text-[#c89d58]">
                          {developer.name}
                        </p>

                        <p className="mt-0.5 text-[12px] text-white/40">
                          Developer Partner
                        </p>
                      </div>
                    </button>
                  ))}

                {developers.filter((developer) =>
                  getFuzzyMatchScore(
                    developerSearch,
                    developer.name
                  ) >= 45
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
            onClick={() => setShowLocationModal(false)}
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
              transition={{ duration: 0.25 }}
              onClick={(e) => e.stopPropagation()}
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
              <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

              {/* HEADER */}

              <div className="border-b border-white/10 px-6 py-5">
                <p className="mb-2 text-[10px] uppercase tracking-[3px] text-[#c89d58]">
                  Location Directory
                </p>

                <h3 className="text-[22px] font-semibold text-white">
                  Select Location
                </h3>

                <p className="mt-2 text-[13px] text-white/45">
                  Browse all available locations
                </p>
              </div>

              {/* SEARCH */}

              <div className="border-b border-white/10 p-5">
                <input
                  value={locationSearch}
                  onChange={(e) =>
                    setLocationSearch(e.target.value)
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
                  .filter(
                    (location) =>
                      !locationSearch.trim() ||
                      getFuzzyMatchScore(
                        locationSearch,
                        location
                      ) >= 45
                  )
                  .map((location) => (
                    <button
                      key={location}
                      type="button"
                      onClick={() => {
                        handleChange("location", location);
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
                        {location}
                      </span>

                      <span className="text-[16px] text-[#c89d58]">
                        →
                      </span>
                    </button>
                  ))}

                {locations.filter(
                  (location) =>
                    !locationSearch.trim() ||
                    getFuzzyMatchScore(
                      locationSearch,
                      location
                    ) >= 45
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
