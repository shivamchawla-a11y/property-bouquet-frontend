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

import { getLocationContent } from "./locationContent";

export default function LocationSlugClient({
  location,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  // ============================================================
  // STATE
  // ============================================================

  const [filteredProperties, setFilteredProperties] =
    useState(() => [...properties]);

  const [sortBy, setSortBy] = useState("newest");

  const [visibleCards, setVisibleCards] = useState(9);

  const [showFilters, setShowFilters] = useState(false);

  const CARDS_PER_PAGE = 9;

  // ============================================================
  // LOCATION NAME
  // ============================================================

  const locationName =
    location?.name ||
    location?.seoName ||
    "Prime Location";

  // ============================================================
  // LOCATION CONTENT
  //
  // locationContent.js provides the default / SEO content
  // for each location.
  //
  // Backend/admin pageContent has higher priority and can
  // override individual sections.
  // ============================================================

  const pageContent = useMemo(() => {
    const generatedContent =
      getLocationContent(
        location,
        properties
      ) || {};

    const adminContent =
      location?.pageContent || {};

    return {
      ...generatedContent,

      // ========================================================
      // ROOT CONTENT
      // ========================================================

      ...adminContent,

      // ========================================================
      // HERO
      // ========================================================

      hero: {
        ...(generatedContent?.hero || {}),
        ...(adminContent?.hero || {}),
      },

      // ========================================================
      // ABOUT
      // ========================================================

      about: {
        ...(generatedContent?.about || {}),
        ...(adminContent?.about || {}),
      },

      // ========================================================
      // REAL ESTATE TYPES
      // ========================================================

      realEstateTypes: {
        ...(generatedContent?.realEstateTypes || {}),
        ...(adminContent?.realEstateTypes || {}),
      },

      // ========================================================
      // PROPERTY PRICES
      // ========================================================

      prices: {
        ...(generatedContent?.prices || {}),
        ...(adminContent?.prices || {}),
      },

      // ========================================================
      // CONNECTIVITY
      // ========================================================

      connectivity: {
        ...(generatedContent?.connectivity || {}),
        ...(adminContent?.connectivity || {}),
      },

      // ========================================================
      // LIFESTYLE
      // ========================================================

      lifestyle: {
        ...(generatedContent?.lifestyle || {}),
        ...(adminContent?.lifestyle || {}),
      },

      // ========================================================
      // WHY BUY
      // ========================================================

      whyBuy: {
        ...(generatedContent?.whyBuy || {}),
        ...(adminContent?.whyBuy || {}),
      },

      // ========================================================
      // NEARBY
      // ========================================================

      nearby: {
        ...(generatedContent?.nearby || {}),
        ...(adminContent?.nearby || {}),
      },

      // ========================================================
      // FAQ
      // ========================================================

      faq: {
        ...(generatedContent?.faq || {}),
        ...(adminContent?.faq || {}),
      },

      // ========================================================
      // ADVISOR CTA
      // ========================================================

      advisor: {
        ...(generatedContent?.advisor || {}),
        ...(adminContent?.advisor || {}),
      },

      // ========================================================
      // IMAGES
      // ========================================================

      images: {
        ...(generatedContent?.images || {}),
        ...(adminContent?.images || {}),
      },
    };
  }, [location, properties]);

  // ============================================================
  // PUBLIC LOCATION URL HELPERS
  // ============================================================

  const getLocationPreposition = (
    currentLocation
  ) => {
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
  };

  // ============================================================
  // BUILD PUBLIC LOCATION SLUG
  // ============================================================

  const buildPublicLocationSlug = (
    currentLocation
  ) => {
    if (!currentLocation) {
      return "";
    }

    const currentSlug = String(
      currentLocation?.slug || ""
    )
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

    if (!currentSlug) {
      return "";
    }

    let root = currentLocation;

    const visited = new Set();

    while (root?.parent) {
      const rootId =
        root?._id?.toString?.() ||
        root?.id?.toString?.() ||
        root?.slug ||
        root?.name;

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

    const rootSlug = String(
      root?.slug || ""
    )
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

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
  };

  // ============================================================
  // FIND CLOSEST LOCATION IMAGE
  //
  // Current location image wins.
  //
  // If unavailable:
  // Current Location
  //      ↓
  // Parent
  //      ↓
  // Grandparent
  //      ↓
  // etc.
  // ============================================================

  const getClosestLocationImage = (
    currentLocation
  ) => {
    const visited = new Set();

    let current = currentLocation;

    while (current) {
      const currentId =
        current?._id?.toString?.() ||
        current?.id?.toString?.() ||
        current?.slug ||
        current?.name;

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
        typeof current?.image === "string"
          ? current.image.trim()
          : "";

      if (image) {
        return image;
      }

      current = current?.parent;
    }

    return "";
  };

  // ============================================================
  // LOCATION IMAGE
  // ============================================================

  const locationImage = useMemo(() => {
    return getClosestLocationImage(
      location
    );
  }, [location]);

  // ============================================================
  // HERO IMAGE
  //
  // Priority:
  //
  // 1. Custom locationContent image
  // 2. Current / parent location image
  // 3. First property hero image
  // ============================================================

  const heroImage =
    pageContent?.images?.hero ||
    pageContent?.hero?.image ||
    locationImage ||
    properties?.[0]?.media?.heroImageUrl ||
    "";

  // ============================================================
  // URL FILTERS
  // ============================================================

  const selectedLocation =
    location?.name ||
    searchParams.get("location");

  const selectedDeveloper =
    searchParams.get("developer");

  const selectedBudget =
    searchParams.get("budget");

  const selectedAmenity =
    searchParams.get("amenity");

  const selectedBhk =
    searchParams.get("bhk");

  const selectedPropertyType =
    searchParams.get("propertyType");

  // ============================================================
  // LOCATION DESCRIPTION
  // ============================================================

  const locationDescription =
    location?.description ||
    pageContent?.about?.description ||
    pageContent?.about?.content ||
    `Explore the real estate landscape of ${locationName}, including premium residences, landmark developments, thoughtfully planned communities and property opportunities across different segments. ${locationName} offers buyers and investors an address to evaluate through the combined lens of connectivity, infrastructure, lifestyle convenience, development quality and long-term suitability. Property Bouquet brings together curated property opportunities to help you research the area, compare available projects and identify homes or investments aligned with your requirements.`;

  // ============================================================
  // FILTERING
  // ============================================================

  useEffect(() => {
    let result = [...properties];

    // ==========================================================
    // SEARCH
    // ==========================================================

    const search =
      searchParams.get("search");

    if (search) {
      const searchValue =
        search.toLowerCase().trim();

      result = result.filter(
        (property) => {
          const title =
            property?.coreDetails?.title ||
            "";

          const developer =
            property?.coreDetails
              ?.developerName ||
            "";

          const locationNameValue =
            property?.locationData
              ?.locationName ||
            "";

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

    // ==========================================================
    // PROPERTY TYPE
    // ==========================================================

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
            property?.categoryData
              ?.categoryName
              ?.toLowerCase()
              .trim();

          if (!categoryName) {
            return false;
          }

          return (
            categoryName.includes(
              searchCategory
            ) ||
            searchCategory.includes(
              categoryName
            )
          );
        }
      );
    }

    // ==========================================================
    // LOCATION
    // ==========================================================

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
              current?._id?.toString?.() ||
              current?.id?.toString?.() ||
              current?.slug ||
              current?.name;

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
                current.name
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
              property.locationData.locationName
                .toLowerCase()
                .trim()
            );
          }

          if (
            property?.locationData
              ?.customLocation
          ) {
            locationNames.push(
              property.locationData.customLocation
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

    // ==========================================================
    // DEVELOPER
    // ==========================================================

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

            property?.developer
              ?.name,

            property?.developerData
              ?.name,

            property?.developerRef
              ?.name,
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

    // ==========================================================
    // BUDGET
    // ==========================================================

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
              Number(
                property?.coreDetails
                  ?.startingPrice
              ) || 0;

            const maxPrice =
              Number(
                property?.coreDetails
                  ?.maxPrice
              ) || startPrice;

            return (
              maxPrice >= minBudget &&
              startPrice <= maxBudget
            );
          }
        );
      }
    }

    // ==========================================================
    // AMENITIES
    // ==========================================================

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
            property?.overview
              ?.amenities
              ?.map(
                (item) =>
                  item?.heading
                    ?.toLowerCase()
                    .trim()
              )
              .filter(Boolean) || [];

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

    // ==========================================================
    // BHK
    // ==========================================================

    const bhk =
      searchParams.get("bhk");

    if (bhk) {
      const searchBhk =
        bhk.toLowerCase().trim();

      result = result.filter(
        (property) =>
          property?.gatedContent
            ?.floorPlans
            ?.some(
              (plan) =>
                plan?.unitType
                  ?.toLowerCase()
                  .trim() === searchBhk
            )
      );
    }

    // ==========================================================
    // SORTING
    // ==========================================================

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
          (Number(
            a?.coreDetails
              ?.startingPrice
          ) || 0) -
          (Number(
            b?.coreDetails
              ?.startingPrice
          ) || 0)
      );
    }

    if (
      sortBy ===
      "price-high-low"
    ) {
      result.sort(
        (a, b) =>
          (Number(
            b?.coreDetails
              ?.startingPrice
          ) || 0) -
          (Number(
            a?.coreDetails
              ?.startingPrice
          ) || 0)
      );
    }

    // ==========================================================
    // RESET PAGINATION
    // ==========================================================

    setVisibleCards(
      CARDS_PER_PAGE
    );

    setFilteredProperties(
      result
    );
  }, [
    properties,
    searchParams,
    sortBy,
  ]);

  // ============================================================
  // BODY LOCK
  // ============================================================

  useEffect(() => {
    if (showFilters) {
      document.body.style.overflow =
        "hidden";
    } else {
      document.body.style.overflow =
        "auto";
    }

    return () => {
      document.body.style.overflow =
        "auto";
    };
  }, [showFilters]);

  // ============================================================
  // CURRENT PROPERTIES
  // ============================================================

  const currentProperties =
    filteredProperties.slice(
      0,
      visibleCards
    );

  // ============================================================
  // FILTER PROPS
  // ============================================================

  const filterProps = {
    properties,

    selectedLocation,

    selectedDeveloper,

    selectedBudget,

    selectedAmenity,

    selectedBhk,

    selectedPropertyType,

    baseUrl: `/locations/${slug}`,
  };

  // ============================================================
  // RENDER
  // ============================================================

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
        properties={properties}
        buildPublicLocationSlug={
          buildPublicLocationSlug
        }
        pageContent={pageContent}
      />

      {/* ======================================================
          PROJECTS
          
          Projects remain fully dynamic.

          locationContent.js does NOT replace the actual
          property/project data.
      ====================================================== */}

      <LocationProjects
        properties={properties}
        filteredProperties={
          filteredProperties
        }
        currentProperties={
          currentProperties
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

      {pageContent?.about?.enabled !==
        false && (
        <AboutLocation
          location={location}
          locationName={locationName}
          locationDescription={
            locationDescription
          }
          properties={properties}
          locationImage={locationImage}
          pageContent={pageContent}
        />
      )}

      {/* ======================================================
          REAL ESTATE TYPES
      ====================================================== */}

      {pageContent?.realEstateTypes
        ?.enabled !== false && (
        <LocationRealEstateTypes
          locationName={
            locationName
          }
          properties={
            properties
          }
          pageContent={
            pageContent
          }
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
            properties
          }
          pageContent={
            pageContent
          }
        />
      )}

      {/* ======================================================
          CONNECTIVITY
      ====================================================== */}

      {pageContent?.connectivity
        ?.enabled !== false && (
        <LocationConnectivity
          location={location}
          locationName={
            locationName
          }
          locationImage={
            locationImage
          }
          pageContent={
            pageContent
          }
        />
      )}

      {/* ======================================================
          LIFESTYLE
          
          Schools / hospitals / lifestyle / amenities
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
          pageContent={
            pageContent
          }
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
          pageContent={
            pageContent
          }
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
            properties
          }
          buildPublicLocationSlug={
            buildPublicLocationSlug
          }
          pageContent={
            pageContent
          }
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
            properties
          }
          pageContent={
            pageContent
          }
        />
      )}

      {/* ======================================================
          FINAL ADVISOR CTA
      ====================================================== */}

      {pageContent?.advisor
        ?.enabled !== false && (
        <LocationAdvisorCTA
          locationName={
            locationName
          }
          properties={
            properties
          }
          locationImage={
            locationImage
          }
          pageContent={
            pageContent
          }
        />
      )}

      {/* ======================================================
          MOBILE FILTER DRAWER
      ====================================================== */}

      {showFilters && (
        <MobileLocationFilters
          {...filterProps}
          onFiltered={(data) => {
            setFilteredProperties(
              data
            );

            setVisibleCards(
              CARDS_PER_PAGE
            );

            setShowFilters(
              false
            );
          }}
          onClose={() =>
            setShowFilters(
              false
            )
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