"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import HeroSection from "@/components/locations/HeroSection";
import StatsBar from "@/components/locations/StatsBar";
import Filters from "@/components/locations/Filters";
import LocationsGrid from "@/components/locations/LocationsGrid";
import WhyExplore from "@/components/locations/WhyExplore";
import AdvisorCTA from "@/components/locations/AdvisorCTA";

export default function LocationsPage() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // =========================================================
  // FETCH LOCATION TREE
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          "/api/locations/tree"
        );

        if (!res.ok) {
          throw new Error(
            `Failed to fetch locations: ${res.status}`
          );
        }

        const data = await res.json();

        if (!isMounted) return;

        if (data?.success) {
          const tree =
            Array.isArray(data?.locations)
              ? data.locations
              : Array.isArray(data?.tree)
              ? data.tree
              : Array.isArray(data?.data)
              ? data.data
              : [];

          setLocations(tree);
        } else {
          setLocations([]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch locations:",
          error
        );

        if (isMounted) {
          setLocations([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // FLATTEN LOCATION TREE
  // =========================================================

  const flattenedLocations = useMemo(() => {
    const result = [];

    const walk = (
      items,
      root = null,
      level = 0
    ) => {
      if (!Array.isArray(items)) {
        return;
      }

      items.forEach((location) => {
        const currentRoot =
          root || location;

        result.push({
          ...location,
          _rootLocation: currentRoot,
          _level: level,
        });

        walk(
          location?.children || [],
          currentRoot,
          level + 1
        );
      });
    };

    walk(locations);

    return result;
  }, [locations]);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredLocations = useMemo(() => {
    let filtered = [
      ...flattenedLocations,
    ];

    // SEARCH
    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      filtered = filtered.filter(
        (location) =>
          location?.name
            ?.toLowerCase()
            .includes(searchValue)
      );
    }

    // SORT
    switch (sort) {
      case "az":
        filtered.sort((a, b) =>
          (a?.name || "").localeCompare(
            b?.name || ""
          )
        );
        break;

      case "za":
        filtered.sort((a, b) =>
          (b?.name || "").localeCompare(
            a?.name || ""
          )
        );
        break;

      case "latest":
      default:
        break;
    }

    return filtered;
  }, [
    flattenedLocations,
    search,
    sort,
  ]);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#161616]">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section
        aria-labelledby="locations-page-heading"
        className="relative"
      >
        <div className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </div>

        <HeroSection />
      </section>

      {/* =====================================================
          LOCATION STATISTICS
      ===================================================== */}

      <section
        aria-label="Location statistics"
      >
        <StatsBar
          locations={flattenedLocations}
        />
      </section>

      {/* =====================================================
          LOCATION SEARCH & FILTERS
      ===================================================== */}

      <section
        aria-label="Search real estate locations"
      >
        <Filters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />
      </section>

      {/* =====================================================
          LOCATION DIRECTORY
      ===================================================== */}

      <section
        aria-labelledby="location-directory-heading"
        className="scroll-mt-24"
      >
        <h2
          id="location-directory-heading"
          className="sr-only"
        >
          Real Estate Locations
        </h2>

        <LocationsGrid
          locations={filteredLocations}
          loading={loading}
        />
      </section>

      {/* =====================================================
          WHY EXPLORE LOCATIONS
      ===================================================== */}

      <section
        aria-labelledby="why-explore-locations-heading"
      >
        <WhyExplore />
      </section>

      {/* =====================================================
          ADVISOR CTA
      ===================================================== */}

      <section
        aria-label="Speak with a property advisor"
      >
        <AdvisorCTA />
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <Footer />

    </main>
  );
}