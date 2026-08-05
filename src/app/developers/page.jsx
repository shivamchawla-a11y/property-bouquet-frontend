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

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/developers");
      const data = await res.json();

      if (data.success) {
        setDevelopers(data.data || []);
      } else {
        setDevelopers([]);
      }
    } catch (err) {
      console.error("Failed to fetch developers:", err);
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredDevelopers = useMemo(() => {
    let filtered = [...developers];

    // Search
    if (search.trim()) {
      filtered = filtered.filter((developer) =>
        developer.name
          ?.toLowerCase()
          .includes(search.toLowerCase())
      );
    }

    // Sorting
    switch (sort) {
      case "az":
        filtered.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        break;

      case "za":
        filtered.sort((a, b) =>
          b.name.localeCompare(a.name)
        );
        break;

      case "latest":
      default:
        break;
    }

    return filtered;
  }, [developers, search, sort]);

  return (
    <main className="bg-[#faf8f4] overflow-x-hidden">

      {/* Hero */}
      <section className="relative">

        <div className="absolute inset-x-0 top-0 z-50">
          <Navbar />
        </div>

        <HeroSection />

      </section>

      {/* Stats */}
      <StatsBar />

      {/* Filters */}
      <Filters
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
      />

      {/* Developers */}
      <DevelopersGrid
        developers={filteredDevelopers}
        loading={loading}
      />

      <WhyPartner/>

      <AdvisorCTA/>

      <Footer/>
    </main>
  );
}