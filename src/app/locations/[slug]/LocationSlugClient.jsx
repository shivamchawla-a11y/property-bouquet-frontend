"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import LocationHero from "@/components/locations/location-slug/LocationHero";
import LocationProjects from "@/components/locations/location-slug/LocationProjects";
import AboutLocation from "@/components/locations/location-slug/AboutLocation";
import LocationRealEstateTypes from "@/components/locations/location-slug/LocationRealEstateTypes";
import LocationPropertyPrices from "@/components/locations/location-slug/LocationPropertyPrices";
import LocationConnectivity from "@/components/locations/location-slug/LocationConnectivity";
import LocationLifestyle from "@/components/locations/location-slug/LocationLifestyle";
import WhyBuyLocation from "@/components/locations/location-slug/WhyBuyLocation";
import NearbyLocations from "@/components/locations/location-slug/NearbyLocations";
import LocationFAQ from "@/components/locations/location-slug/LocationFAQ";
import LocationAdvisorCTA from "@/components/locations/location-slug/LocationAdvisorCTA";
import MobileLocationFilters from "@/components/locations/location-slug/MobileLocationFilters";

/* ============================================================
   HELPERS
============================================================ */

/**
 * Safely convert anything into a trimmed string.
 */
function cleanString(value) {
  return typeof value === "string" ? value.trim() : "";
}

/**
 * Safely normalize IDs.
 */
function getEntityId(value) {
  return (
    value?._id?.toString?.() ||
    value?.id?.toString?.() ||
    cleanString(value?.slug) ||
    cleanString(value?.name)
  );
}

/**
 * Clean a slug.
 */
function cleanSlug(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/g, "");
}

/**
 * Published-property safety check.
 */
function isPublishedProperty(property) {
  if (!property) {
    return false;
  }

  if (property.status !== "published") {
    return false;
  }

  if (property.isDeleted === true) {
    return false;
  }

  if (property.deletedFromStatus === "trash") {
    return false;
  }

  return true;
}

/**
 * Build the public property slug.
 */
function getPropertySlug(property) {
  return cleanSlug(
    property?.slug ||
      property?.seoEngine?.slug ||
      property?._id?.toString?.()
  );
}

/**
 * Build the public property URL.
 */
function getPropertyUrl(property) {
  const propertySlug = getPropertySlug(property);

  return propertySlug
    ? `/properties/${propertySlug}`
    : "";
}

/**
 * Location-name display helper.
 *
 * We never modify the database value.
 * This only improves public presentation when the
 * stored value is completely lowercase.
 */
function formatLocationName(value) {
  const input = cleanString(value);

  if (!input) {
    return "Prime Location";
  }

  const hasUppercase = /[A-Z]/.test(input);

  if (hasUppercase) {
    return input;
  }

  return input
    .toLowerCase()
    .split(/\s+/)
    .map((word) => {
      if (!word) {
        return word;
      }

      return (
        word.charAt(0).toUpperCase() +
        word.slice(1)
      );
    })
    .join(" ");
}

/**
 * Replace CMS placeholders such as:
 *
 * [live count]
 * [project count]
 * {{ projectCount }}
 * {{ liveCount }}
 * {{ propertyCount }}
 * {{ count }}
 */
function replaceProjectCountPlaceholders(
  value,
  projectCount
) {
  if (typeof value !== "string") {
    return value;
  }

  return value
    .replace(
      /\[\s*live\s+count\s*\]/gi,
      String(projectCount)
    )
    .replace(
      /\[\s*project\s+count\s*\]/gi,
      String(projectCount)
    )
    .replace(
      /\{\{\s*projectCount\s*\}\}/gi,
      String(projectCount)
    )
    .replace(
      /\{\{\s*liveCount\s*\}\}/gi,
      String(projectCount)
    )
    .replace(
      /\{\{\s*propertyCount\s*\}\}/gi,
      String(projectCount)
    )
    .replace(
      /\{\{\s*count\s*\}\}/gi,
      String(projectCount)
    );
}

/**
 * Recursively replace live-count placeholders.
 */
function replaceProjectCountDeep(
  value,
  projectCount
) {
  if (typeof value === "string") {
    return replaceProjectCountPlaceholders(
      value,
      projectCount
    );
  }

  if (Array.isArray(value)) {
    return value.map((item) =>
      replaceProjectCountDeep(
        item,
        projectCount
      )
    );
  }

  if (
    value &&
    typeof value === "object"
  ) {
    const result = {};

    Object.keys(value).forEach((key) => {
      result[key] =
        replaceProjectCountDeep(
          value[key],
          projectCount
        );
    });

    return result;
  }

  return value;
}

/**
 * Normalize old CMS field names into the current
 * component names.
 *
 * This prevents older database records from causing
 * sections to disappear simply because a field was
 * renamed in the frontend.
 */
function normalizePageContent(content) {
  if (
    !content ||
    typeof content !== "object"
  ) {
    return {};
  }

  const normalized = {
    ...content,
  };

  /**
   * Real estate type
   */
  if (
    !normalized.realEstateTypes &&
    normalized.realEstateType
  ) {
    normalized.realEstateTypes =
      normalized.realEstateType;
  }

  /**
   * Property prices
   */
  if (
    !normalized.prices &&
    normalized.propertyPrices
  ) {
    normalized.prices =
      normalized.propertyPrices;
  }

  /**
   * Nearby locations
   */
  if (
    !normalized.nearby &&
    normalized.nearbyLocations
  ) {
    normalized.nearby =
      normalized.nearbyLocations;
  }

  /**
   * Why buy
   */
  if (
    !normalized.whyBuy &&
    normalized.whyBuyLocation
  ) {
    normalized.whyBuy =
      normalized.whyBuyLocation;
  }

  /**
   * FAQ
   *
   * Older CMS versions may have:
   *
   * faqs: [...]
   *
   * while the current components expect:
   *
   * faq: {
   *   items: [...]
   * }
   */
  if (
    !normalized.faq &&
    Array.isArray(normalized.faqs)
  ) {
    normalized.faq = {
      enabled: true,
      items: normalized.faqs,
    };
  } else if (
    normalized.faq &&
    Array.isArray(normalized.faqs) &&
    !Array.isArray(normalized.faq.items)
  ) {
    normalized.faq = {
      ...normalized.faq,
      items: normalized.faqs,
    };
  }

  /**
   * Legacy connectivity aliases.
   */
  if (
    !normalized.connectivity &&
    normalized.locationConnectivity
  ) {
    normalized.connectivity =
      normalized.locationConnectivity;
  }

  /**
   * Legacy lifestyle aliases.
   */
  if (
    !normalized.lifestyle &&
    normalized.locationLifestyle
  ) {
    normalized.lifestyle =
      normalized.locationLifestyle;
  }

  /**
   * Legacy advisor aliases.
   */
  if (
    !normalized.advisor &&
    normalized.advisorCTA
  ) {
    normalized.advisor =
      normalized.advisorCTA;
  }

  return normalized;
}

/* ============================================================
   PUBLIC LOCATION URL HELPERS
============================================================ */

function getLocationPreposition(
  currentLocation
) {
  const name = String(
    currentLocation?.name || ""
  )
    .trim()
    .toLowerCase();

  const currentSlug = String(
    currentLocation?.slug || ""
  )
    .trim()
    .toLowerCase();

  const value = `${name} ${currentSlug}`;

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
}

/**
 * Builds:
 *
 * Sector 102 + Gurgaon
 * -> properties-in-sector-102-gurgaon
 *
 * Dwarka Expressway + Gurgaon
 * -> properties-on-dwarka-expressway-gurgaon
 */
function buildPublicLocationSlug(
  currentLocation
) {
  if (!currentLocation) {
    return "";
  }

  const currentSlug = cleanSlug(
    currentLocation?.slug
  );

  if (!currentSlug) {
    return "";
  }

  let root = currentLocation;
  const visited = new Set();

  while (root?.parent) {
    const rootId = getEntityId(root);

    if (
      rootId &&
      visited.has(rootId)
    ) {
      break;
    }

    if (rootId) {
      visited.add(rootId);
    }

    root = root.parent;
  }

  const rootSlug = cleanSlug(
    root?.slug
  );

  const preposition =
    getLocationPreposition(
      currentLocation
    );

  if (
    !rootSlug ||
    rootSlug === currentSlug
  ) {
    return `properties-${preposition}-${currentSlug}`;
  }

  return `properties-${preposition}-${currentSlug}-${rootSlug}`;
}

/* ============================================================
   LOCATION IMAGE INHERITANCE
============================================================ */

function getClosestLocationImage(
  currentLocation
) {
  const visited = new Set();
  let current = currentLocation;

  while (current) {
    const currentId =
      getEntityId(current);

    if (
      currentId &&
      visited.has(currentId)
    ) {
      break;
    }

    if (currentId) {
      visited.add(currentId);
    }

    const image =
      typeof current?.image ===
      "string"
        ? current.image.trim()
        : "";

    if (image) {
      return image;
    }

    current = current?.parent;
  }

  return "";
}

/* ============================================================
   PROPERTY PRICE HELPERS
============================================================ */

/**
 * Supports multiple versions of the property
 * pricing model.
 */
function getStartingPrice(property) {
  const candidates = [
    property?.coreDetails?.startingPrice,
    property?.pricing?.startingPrice,
    property?.pricing?.minPrice,
  ];

  for (const value of candidates) {
    const numeric = Number(value);

    if (
      Number.isFinite(numeric) &&
      numeric > 0
    ) {
      return numeric;
    }
  }

  return 0;
}

function getMaximumPrice(property) {
  const startingPrice =
    getStartingPrice(property);

  const candidates = [
    property?.coreDetails?.maxPrice,
    property?.pricing?.maxPrice,
    property?.pricing?.maximumPrice,
  ];

  for (const value of candidates) {
    const numeric = Number(value);

    if (
      Number.isFinite(numeric) &&
      numeric > 0
    ) {
      return numeric;
    }
  }

  return startingPrice;
}

/**
 * Keep configuration information available for
 * price/configuration components.
 */
function normalizePropertyForPublicUse(
  property
) {
  if (!property) {
    return property;
  }

  const configuration =
    property.configuration &&
    typeof property.configuration ===
      "object"
      ? {
          ...property.configuration,
        }
      : {};

  const floorPlans =
    Array.isArray(
      property?.gatedContent
        ?.floorPlans
    )
      ? property.gatedContent.floorPlans
      : [];

  if (
    !Array.isArray(
      configuration.floorPlans
    ) &&
    floorPlans.length
  ) {
    configuration.floorPlans =
      floorPlans;
  }

  return {
    ...property,
    configuration,
  };
}

/* ============================================================
   LOCATION PROPERTY FILTERING
============================================================ */

/**
 * Applies every URL filter and sorting rule synchronously.
 *
 * IMPORTANT:
 *
 * This function intentionally runs during render rather than
 * inside useEffect().
 *
 * Previously filteredProperties started as [] and was populated
 * only after hydration. That meant the server-rendered HTML did
 * not contain the same project cards as the browser.
 *
 * By calculating this synchronously, the initial server render
 * and the initial browser render receive the same collection.
 */
function filterLocationProperties(
  properties,
  searchParams,
  sortBy
) {
  let result = Array.isArray(properties)
    ? [...properties]
    : [];

  if (!searchParams) {
    return result;
  }

  /* ==========================================================
     SEARCH
  ========================================================== */

  const search =
    searchParams.get("search");

  if (search) {
    const searchValue =
      search.toLowerCase().trim();

    result = result.filter(
      (property) => {
        const title = String(
          property?.coreDetails
            ?.title ||
            property?.title ||
            ""
        );

        const developer = String(
          property?.coreDetails
            ?.developerName ||
            property?.developerName ||
            property?.developer
              ?.name ||
            ""
        );

        const locationNameValue =
          String(
            property?.locationData
              ?.locationName ||
              property?.coreDetails
                ?.location ||
              ""
          );

        return (
          title
            .toLowerCase()
            .includes(searchValue) ||
          developer
            .toLowerCase()
            .includes(searchValue) ||
          locationNameValue
            .toLowerCase()
            .includes(searchValue)
        );
      }
    );
  }

  /* ==========================================================
     PROPERTY TYPE
  ========================================================== */

  const type =
    searchParams.get(
      "propertyType"
    );

  if (type) {
    const searchCategory =
      type.toLowerCase().trim();

    result = result.filter(
      (property) => {
        const categoryName =
          String(
            property?.categoryData
              ?.categoryName ||
              ""
          )
            .toLowerCase()
            .trim();

        const propertyType =
          String(
            property?.coreDetails
              ?.propertyType ||
              ""
          )
            .toLowerCase()
            .trim();

        if (
          !categoryName &&
          !propertyType
        ) {
          return false;
        }

        return (
          categoryName.includes(
            searchCategory
          ) ||
          searchCategory.includes(
            categoryName
          ) ||
          propertyType.includes(
            searchCategory
          ) ||
          searchCategory.includes(
            propertyType
          )
        );
      }
    );
  }

  /* ==========================================================
     LOCATION
  ========================================================== */

  const locationFilter =
    searchParams.get(
      "location"
    );

  if (locationFilter) {
    const searchLocation =
      locationFilter
        .toLowerCase()
        .trim();

    result = result.filter(
      (property) => {
        const locationNames = [];

        let current =
          property?.locationData
            ?.locationRef;

        const visited = new Set();

        while (current) {
          const currentId =
            getEntityId(current);

          if (
            currentId &&
            visited.has(currentId)
          ) {
            break;
          }

          if (currentId) {
            visited.add(currentId);
          }

          if (current?.name) {
            locationNames.push(
              String(current.name)
                .toLowerCase()
                .trim()
            );
          }

          current =
            current?.parent;
        }

        if (
          property?.locationData
            ?.locationName
        ) {
          locationNames.push(
            String(
              property.locationData
                .locationName
            )
              .toLowerCase()
              .trim()
          );
        }

        if (
          property?.locationData
            ?.customLocation
        ) {
          locationNames.push(
            String(
              property.locationData
                .customLocation
            )
              .toLowerCase()
              .trim()
          );
        }

        if (
          property?.coreDetails
            ?.location
        ) {
          locationNames.push(
            String(
              property.coreDetails
                .location
            )
              .toLowerCase()
              .trim()
          );
        }

        return locationNames.some(
          (name) =>
            name.includes(
              searchLocation
            ) ||
            searchLocation.includes(
              name
            )
        );
      }
    );
  }

  /* ==========================================================
     DEVELOPER
  ========================================================== */

  const developerFilter =
    searchParams.get(
      "developer"
    );

  if (developerFilter) {
    const searchDeveloper =
      developerFilter
        .toLowerCase()
        .trim();

    result = result.filter(
      (property) => {
        const developerNames = [
          property?.developerName,
          property?.coreDetails
            ?.developerName,
          property?.developer?.name,
          property?.developerData?.name,
          property?.developerRef?.name,
          property?.coreDetails
            ?.developerRef?.name,
        ]
          .filter(Boolean)
          .map((item) =>
            String(item)
              .toLowerCase()
              .trim()
          );

        return developerNames.some(
          (name) =>
            name.includes(
              searchDeveloper
            ) ||
            searchDeveloper.includes(
              name
            )
        );
      }
    );
  }

  /* ==========================================================
     BUDGET
  ========================================================== */

  const budget =
    searchParams.get("budget");

  if (budget) {
    const [
      minBudget,
      maxBudget,
    ] = budget
      .split("-")
      .map(Number);

    if (
      Number.isFinite(
        minBudget
      ) &&
      Number.isFinite(
        maxBudget
      )
    ) {
      result = result.filter(
        (property) => {
          if (
            property?.coreDetails
              ?.priceOnRequest
          ) {
            return true;
          }

          const startPrice =
            getStartingPrice(
              property
            );

          const maxPrice =
            getMaximumPrice(
              property
            );

          return (
            maxPrice >= minBudget &&
            startPrice <= maxBudget
          );
        }
      );
    }
  }

  /* ==========================================================
     AMENITIES
  ========================================================== */

  const amenitiesParam =
    searchParams.get(
      "amenity"
    );

  const selectedAmenities =
    amenitiesParam
      ? amenitiesParam
          .split(",")
          .map((item) =>
            item.trim()
          )
          .filter(Boolean)
      : [];

  if (
    selectedAmenities.length
  ) {
    result = result.filter(
      (property) => {
        const propertyAmenities =
          Array.isArray(
            property?.overview
              ?.amenities
          )
            ? property.overview.amenities
                .map(
                  (item) =>
                    item?.heading
                      ?.toLowerCase()
                      .trim()
                )
                .filter(Boolean)
            : [];

        return selectedAmenities.every(
          (amenity) =>
            propertyAmenities.includes(
              amenity
                .toLowerCase()
                .trim()
            )
        );
      }
    );
  }

  /* ==========================================================
     BHK
  ========================================================== */

  const bhk =
    searchParams.get("bhk");

  if (bhk) {
    const searchBhk =
      bhk.toLowerCase().trim();

    result = result.filter(
      (property) => {
        const floorPlans =
          Array.isArray(
            property?.gatedContent
              ?.floorPlans
          )
            ? property.gatedContent
                .floorPlans
            : Array.isArray(
                property
                  ?.configuration
                  ?.floorPlans
              )
            ? property.configuration
                .floorPlans
            : [];

        return floorPlans.some(
          (plan) =>
            String(
              plan?.unitType || ""
            )
              .toLowerCase()
              .trim() === searchBhk
        );
      }
    );
  }

  /* ==========================================================
     SORTING
  ========================================================== */

  if (sortBy === "newest") {
    result.sort(
      (a, b) =>
        new Date(
          b?.createdAt || 0
        ) -
        new Date(
          a?.createdAt || 0
        )
    );
  }

  if (
    sortBy ===
    "price-low-high"
  ) {
    result.sort(
      (a, b) =>
        getStartingPrice(a) -
        getStartingPrice(b)
    );
  }

  if (
    sortBy ===
    "price-high-low"
  ) {
    result.sort(
      (a, b) =>
        getStartingPrice(b) -
        getStartingPrice(a)
    );
  }

  return result;
}

/* ============================================================
   COMPONENT
============================================================ */

export default function LocationSlugClient({
  location,
  properties = [],
  slug,
  pageContent: serverPageContent = {},
}) {
  const searchParams =
    useSearchParams();

  /* ==========================================================
     CONSTANTS
  ========================================================== */

  const CARDS_PER_PAGE = 9;

  /* ==========================================================
     STATE
  ========================================================== */

  const [sortBy, setSortBy] =
    useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(CARDS_PER_PAGE);

  const [showFilters, setShowFilters] =
    useState(false);

  /* ==========================================================
     LOCATION NAME
  ========================================================== */

  const rawLocationName =
    location?.name ||
    location?.seoName ||
    "Prime Location";

  const locationName =
    formatLocationName(
      rawLocationName
    );

  /* ==========================================================
     PUBLISHED PROPERTIES
  ========================================================== */

  /**
   * The server should already send published projects.
   *
   * This additional check prevents drafts/deleted properties
   * from entering the public location page.
   */
  const publishedProperties =
    useMemo(() => {
      if (!Array.isArray(properties)) {
        return [];
      }

      return properties
        .filter(
          isPublishedProperty
        )
        .map(
          normalizePropertyForPublicUse
        );
    }, [properties]);

  /* ==========================================================
     PAGE CONTENT
  ========================================================== */

  /**
   * IMPORTANT:
   *
   * page.js is responsible for resolving:
   *
   * database CMS content
   *        +
   * static location content
   *
   * The browser must NOT independently call
   * getLocationContent() again.
   *
   * That was causing server/browser mismatches and
   * old CMS content to reappear.
   */
  const pageContent = useMemo(() => {
    const incoming =
      serverPageContent &&
      typeof serverPageContent ===
        "object"
        ? serverPageContent
        : location?.pageContent &&
          typeof location.pageContent ===
            "object"
        ? location.pageContent
        : {};

    const normalized =
      normalizePageContent(
        incoming
      );

    return replaceProjectCountDeep(
      normalized,
      publishedProperties.length
    );
  }, [
    serverPageContent,
    location?.pageContent,
    publishedProperties.length,
  ]);

  /* ==========================================================
     LOCATION IMAGE
  ========================================================== */

  const locationImage = useMemo(
    () =>
      getClosestLocationImage(
        location
      ),
    [location]
  );

  /* ==========================================================
     HERO IMAGE
  ========================================================== */

  const heroImage =
    cleanString(
      pageContent?.images?.hero
    ) ||
    cleanString(
      pageContent?.hero?.image
    ) ||
    locationImage ||
    cleanString(
      publishedProperties?.[0]?.media
        ?.heroImageUrl
    ) ||
    "";

  /* ==========================================================
     URL FILTERS
  ========================================================== */

  const selectedLocation =
    searchParams.get("location") ||
    location?.name ||
    "";

  const selectedDeveloper =
    searchParams.get(
      "developer"
    ) || "";

  const selectedBudget =
    searchParams.get("budget") ||
    "";

  const selectedAmenity =
    searchParams.get("amenity") ||
    "";

  const selectedBhk =
    searchParams.get("bhk") ||
    "";

  const selectedPropertyType =
    searchParams.get(
      "propertyType"
    ) || "";

  /* ==========================================================
     LOCATION DESCRIPTION
  ========================================================== */

  const locationDescription =
    cleanString(
      pageContent?.about
        ?.description
    ) ||
    cleanString(
      pageContent?.about?.content
    ) ||
    cleanString(
      location?.description
    ) ||
    `Explore property opportunities in ${locationName}, including residential developments, premium communities and investment options. Compare projects, locations, pricing and property features through Property Bouquet.`;

  /* ==========================================================
     FILTERING
  ========================================================== */

  /**
   * IMPORTANT SEO FIX:
   *
   * Previously filteredProperties started as [] and was only
   * populated inside useEffect().
   *
   * useEffect() does not run during the server render.
   *
   * Therefore:
   *
   * SERVER:
   * filteredProperties = []
   *
   * BROWSER AFTER HYDRATION:
   * filteredProperties = actual projects
   *
   * This produced different project-card HTML between the
   * server response and the browser DOM.
   *
   * The filtering is now calculated synchronously with useMemo.
   * Therefore the initial server render already contains the
   * correct filtered collection.
   */
  const initialFilteredProperties =
    useMemo(
      () =>
        filterLocationProperties(
          publishedProperties,
          searchParams,
          sortBy
        ),
      [
        publishedProperties,
        searchParams,
        sortBy,
      ]
    );

  /**
   * Keep filteredProperties in state because the mobile filter
   * drawer directly updates this collection.
   *
   * The initial state is now populated synchronously rather
   * than starting as [].
   */
  const [
    filteredProperties,
    setFilteredProperties,
  ] = useState(
    initialFilteredProperties
  );

  /**
   * Keep the state synchronized when URL filters, sorting,
   * or server-provided properties change.
   *
   * This does NOT interfere with the mobile filter drawer,
   * because opening/applying the mobile drawer does not change
   * initialFilteredProperties unless the actual URL/property
   * inputs change.
   */
  useEffect(() => {
    setFilteredProperties(
      initialFilteredProperties
    );

    setVisibleCards(
      CARDS_PER_PAGE
    );
  }, [
    initialFilteredProperties,
  ]);

  /* ==========================================================
     BODY LOCK
  ========================================================== */

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "";
    }

    return () => {
      document.body.style.overflow =
        "";
    };
  }, [showFilters]);

  /* ==========================================================
     CURRENT VISIBLE PROPERTIES
  ========================================================== */

  /**
   * The visual grid intentionally remains limited to 9 cards.
   *
   * Do NOT change CARDS_PER_PAGE to the total project count.
   *
   * LocationProjects receives:
   *
   * currentProperties -> visual cards
   * filteredProperties -> complete filtered collection
   * allProperties -> complete filtered collection
   *
   * This allows the UX to remain compact while the full
   * project collection can be exposed through real links.
   */
  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  /* ==========================================================
     FILTER PROPS
  ========================================================== */

  const filterProps = {
    properties:
      publishedProperties,

    selectedLocation,

    selectedDeveloper,

    selectedBudget,

    selectedAmenity,

    selectedBhk,

    selectedPropertyType,

    baseUrl: `/locations/${cleanSlug(
      slug
    )}`,
  };

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="
        min-h-screen
        bg-[#f7f7f7]
        text-[#111827]
      "
    >
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          HERO
      ====================================================== */}

      <LocationHero
        location={location}
        locationName={locationName}
        locationImage={locationImage}
        heroImage={heroImage}
        properties={
          publishedProperties
        }
        buildPublicLocationSlug={
          buildPublicLocationSlug
        }
        pageContent={pageContent}
      />

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      <LocationProjects
        properties={
          publishedProperties
        }

        filteredProperties={
          filteredProperties
        }

        currentProperties={
          currentProperties
        }

        /**
         * IMPORTANT:
         *
         * LocationProjects should use this complete collection
         * when generating its crawlable project-link directory.
         *
         * The visual grid itself can remain limited to 9 cards
         * through currentProperties.
         */
        allProperties={
          filteredProperties
        }

        locationName={locationName}

        sortBy={sortBy}

        setSortBy={setSortBy}

        setShowFilters={
          setShowFilters
        }

        filterProps={filterProps}

        setFilteredProperties={
          setFilteredProperties
        }

        setVisibleCards={
          setVisibleCards
        }

        cardsPerPage={
          CARDS_PER_PAGE
        }

        visibleCards={
          visibleCards
        }
      />

      {/* ======================================================
          ABOUT LOCATION
      ====================================================== */}

      {pageContent?.about
        ?.enabled !== false && (
        <AboutLocation
          location={location}
          locationName={locationName}
          locationDescription={
            locationDescription
          }
          properties={
            publishedProperties
          }
          locationImage={
            locationImage
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          REAL ESTATE TYPES
      ====================================================== */}

      {pageContent
        ?.realEstateTypes
        ?.enabled !== false && (
        <LocationRealEstateTypes
          locationName={
            locationName
          }
          properties={
            publishedProperties
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          PROPERTY PRICES
      ====================================================== */}

      {pageContent?.prices
        ?.enabled !== false && (
        <LocationPropertyPrices
          locationName={
            locationName
          }
          properties={
            publishedProperties
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          CONNECTIVITY
      ====================================================== */}

      {pageContent
        ?.connectivity
        ?.enabled !== false && (
        <LocationConnectivity
          location={location}
          locationName={
            locationName
          }
          locationImage={
            locationImage
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          LIFESTYLE
      ====================================================== */}

      {pageContent?.lifestyle
        ?.enabled !== false && (
        <LocationLifestyle
          locationName={
            locationName
          }
          locationImage={
            locationImage
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          WHY BUY
      ====================================================== */}

      {pageContent?.whyBuy
        ?.enabled !== false && (
        <WhyBuyLocation
          locationName={
            locationName
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          NEARBY LOCATIONS
      ====================================================== */}

      {pageContent?.nearby
        ?.enabled !== false && (
        <NearbyLocations
          location={location}
          locationName={
            locationName
          }
          properties={
            publishedProperties
          }
          buildPublicLocationSlug={
            buildPublicLocationSlug
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          FAQ
      ====================================================== */}

      {pageContent?.faq
        ?.enabled !== false && (
        <LocationFAQ
          locationName={
            locationName
          }
          properties={
            publishedProperties
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          ADVISOR CTA
      ====================================================== */}

      {pageContent?.advisor
        ?.enabled !== false && (
        <LocationAdvisorCTA
          locationName={
            locationName
          }
          properties={
            publishedProperties
          }
          locationImage={
            locationImage
          }
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {showFilters && (
        <MobileLocationFilters
          {...filterProps}

          onFiltered={(data) => {
            const safeData =
              Array.isArray(data)
                ? data.filter(
                    isPublishedProperty
                  )
                : [];

            setFilteredProperties(
              safeData
            );

            setVisibleCards(
              CARDS_PER_PAGE
            );

            setShowFilters(
              false
            );
          }}

          onClose={() =>
            setShowFilters(false)
          }
        />
      )}

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </div>
  );
}