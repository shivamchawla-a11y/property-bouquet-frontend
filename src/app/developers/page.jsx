"use client";

import { useEffect, useMemo, useState } from "react";

import Navbar from "@/components/home/Navbar";

import HeroSection from "@/components/developers/HeroSection";
import StatsBar from "@/components/developers/StatsBar";
import Filters from "@/components/developers/Filters";
import DevelopersGrid from "@/components/developers/DevelopersGrid";
import WhyPartner from "@/components/developers/WhyPartner";
import AdvisorCTA from "@/components/developers/AdvisorCTA";
import Footer from "@/components/home/Footer";

export default function AllDevelopersPage() {
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("latest");

  // =========================================================
  // FETCH DEVELOPERS
  // =========================================================

  useEffect(() => {
    let isMounted = true;

    const fetchDevelopers = async () => {
      try {
        setLoading(true);

        const res = await fetch("/api/developers");

        if (!res.ok) {
          throw new Error(
            `Failed to fetch developers: ${res.status}`
          );
        }

        const data = await res.json();

        if (!isMounted) return;

        if (data?.success) {
          setDevelopers(data.data || []);
        } else {
          setDevelopers([]);
        }
      } catch (err) {
        console.error(
          "Failed to fetch developers:",
          err
        );

        if (isMounted) {
          setDevelopers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDevelopers();

    return () => {
      isMounted = false;
    };
  }, []);

  // =========================================================
  // FILTER + SORT
  // =========================================================

  const filteredDevelopers = useMemo(() => {
    let filtered = [...developers];

    // SEARCH
    if (search.trim()) {
      const searchValue =
        search.trim().toLowerCase();

      filtered = filtered.filter(
        (developer) =>
          developer?.name
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
  }, [developers, search, sort]);

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#161616]">

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        aria-labelledby="developers-page-heading"
        className="relative"
      >
        <div className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </div>

        <HeroSection />

        {/* SEO H1 SUPPORT
            Keep the actual H1 inside HeroSection.
            This visually-hidden fallback is intentionally
            NOT added if HeroSection already has the H1.
        */}
      </section>

      {/* ===================================================== */}
      {/* DEVELOPER STATISTICS */}
      {/* ===================================================== */}

      <section
        aria-label="Developer statistics"
      >
        <StatsBar />
      </section>

      {/* ===================================================== */}
      {/* DEVELOPER SEARCH & FILTERS */}
      {/* ===================================================== */}

      <section
        aria-label="Search and filter real estate developers"
      >
        <Filters
          search={search}
          setSearch={setSearch}
          sort={sort}
          setSort={setSort}
        />
      </section>

      {/* ===================================================== */}
      {/* DEVELOPERS DIRECTORY */}
      {/* ===================================================== */}

      <section
        aria-labelledby="developer-directory-heading"
        className="scroll-mt-24"
      >
        <h2
          id="developer-directory-heading"
          className="sr-only"
        >
          Real Estate Developers
        </h2>

        <DevelopersGrid
          developers={filteredDevelopers}
          loading={loading}
        />
      </section>

      {/* ===================================================== */}
      {/* WHY PARTNER */}
      {/* ===================================================== */}

      <section aria-labelledby="why-partner-heading">
        <WhyPartner />
      </section>

      {/* ===================================================== */}
      {/* ADVISOR CTA */}
      {/* ===================================================== */}

      <section aria-label="Speak with a property advisor">
        <AdvisorCTA />
      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <Footer />
    </main>
  );
}