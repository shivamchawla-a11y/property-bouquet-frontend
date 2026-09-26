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

export default function LocationSlugClient({
  location,
  properties = [],
  slug,
}) {
  const searchParams = useSearchParams();

  const [
    filteredProperties,
    setFilteredProperties,
  ] = useState(() => [...properties]);

  const [sortBy, setSortBy] =
    useState("newest");

  const [visibleCards, setVisibleCards] =
    useState(9);

  const [showFilters, setShowFilters] =
    useState(false);

  const CARDS_PER_PAGE = 9;

  // ============================================================
  // LOCATION NAME
  // ============================================================

  const locationName =
    location?.name || "Prime Location";

  // ============================================================
  // PAGE CONTENT
  //
  // All editable location-page copy lives here.
  //
  // Every section below receives this same object so that
  // individual components can decide which custom values
  // should override their existing defaults.
  // ============================================================

  const pageContent =
    location?.pageContent || {};

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

  const buildPublicLocationSlug = (
    currentLocation
  ) => {
    if (!currentLocation) return "";

    const currentSlug = String(
      currentLocation?.slug || ""
    )
      .trim()
      .toLowerCase()
      .replace(/^\/+|\/+$/g, "");

    if (!currentSlug) return "";

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
  };

  // ============================================================
  // LOCATION IMAGE
  // ============================================================

  const locationImage = useMemo(() => {
    return getClosestLocationImage(
      location
    );
  }, [location]);

  const heroImage =
    locationImage ||
    properties?.[0]?.media
      ?.heroImageUrl ||
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
      result = result.filter(
        (property) =>
          property?.coreDetails?.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
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
              item
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
              property?.coreDetails
                ?.startingPrice || 0;

            const maxPrice =
              property?.coreDetails
                ?.maxPrice ||
              startPrice;

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
      result = result.filter(
        (property) =>
          property?.gatedContent
            ?.floorPlans
            ?.some(
              (plan) =>
                plan?.unitType
                  ?.toLowerCase()
                  .trim() ===
                bhk
                  .toLowerCase()
                  .trim()
            )
      );
    }

    // ==========================================================
    // SORTING
    // ==========================================================

    if (
      sortBy === "newest"
    ) {
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
          (
            a?.coreDetails
              ?.startingPrice || 0
          ) -
          (
            b?.coreDetails
              ?.startingPrice || 0
          )
      );
    }

    if (
      sortBy ===
      "price-high-low"
    ) {
      result.sort(
        (a, b) =>
          (
            b?.coreDetails
              ?.startingPrice || 0
          ) -
          (
            a?.coreDetails
              ?.startingPrice || 0
          )
      );
    }

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
    document.body.style.overflow =
      showFilters
        ? "hidden"
        : "auto";

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

          IMPORTANT:
          Projects remain dynamic.

          They are NOT controlled by pageContent.
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

      <LocationRealEstateTypes
        locationName={locationName}
        properties={properties}
        pageContent={pageContent}
      />

      {/* ======================================================
          PROPERTY PRICES
      ====================================================== */}

      <LocationPropertyPrices
        locationName={locationName}
        properties={properties}
        pageContent={pageContent}
      />

      {/* ======================================================
          CONNECTIVITY
      ====================================================== */}

      <LocationConnectivity
        location={location}
        locationName={locationName}
        locationImage={locationImage}
        pageContent={pageContent}
      />

      {/* ======================================================
          SCHOOLS / HOSPITALS / LIFESTYLE
      ====================================================== */}

      <LocationLifestyle
        locationName={locationName}
        locationImage={locationImage}
        pageContent={pageContent}
      />

      {/* ======================================================
          WHY BUY
      ====================================================== */}

      <WhyBuyLocation
        locationName={locationName}
        pageContent={pageContent}
      />

      {/* ======================================================
          NEARBY LOCATIONS
      ====================================================== */}

      <NearbyLocations
        location={location}
        locationName={locationName}
        properties={properties}
        buildPublicLocationSlug={
          buildPublicLocationSlug
        }
        pageContent={pageContent}
      />

      {/* ======================================================
          FAQ
      ====================================================== */}

      <LocationFAQ
        locationName={locationName}
        properties={properties}
        pageContent={pageContent}
      />

      {/* ======================================================
          FINAL ADVISOR CTA
      ====================================================== */}

      <LocationAdvisorCTA
        locationName={locationName}
        properties={properties}
        locationImage={locationImage}
        pageContent={pageContent}
      />

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

            setShowFilters(false);
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