"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ToolBar from "./components/ToolBar";
import PotentialPages from "./components/PotentialPages";
import LandingPagesTable from "./components/LandingPagesTable";
import DetailsDrawer from "./components/DetailsDrawer";

export default function CollectionClient() {
  const API = "/api";

  // =====================================================
  // STATES
  // =====================================================

  const [loading, setLoading] = useState(true);

  const [generating, setGenerating] =
    useState(false);

  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    indexed: 0,
    averageScore: 0,
  });

  const [potentialPages, setPotentialPages] =
    useState([]);

  const [landingPages, setLandingPages] =
    useState([]);

  const [selectedPages, setSelectedPages] =
    useState([]);

  const [selectedPage, setSelectedPage] =
    useState(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  // =====================================================
  // FETCH LANDING PAGES
  // =====================================================

  const fetchLandingPages = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `${API}/landing-pages`,
        {
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error(data.message);
        return;
      }

      const pages = data.data || [];

      setLandingPages(pages);

      setStats({
        total: pages.length,

        draft: pages.filter(
          (page) => page.status === "draft"
        ).length,

        published: pages.filter(
          (page) => page.status === "published"
        ).length,

        indexed: pages.filter(
          (page) => page.indexed
        ).length,

        averageScore: pages.length
          ? Math.round(
              pages.reduce(
                (sum, page) =>
                  sum + (page.seoScore || 0),
                0
              ) / pages.length
            )
          : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GENERATE COLLECTIONS
  // =====================================================

  const generateCollections = async () => {
    if (
  !window.confirm(
    "Generate landing pages now?"
  )
) {
  return;
}
    try {
      setGenerating(true);

      const res = await fetch(
        `${API}/landing-pages/generate`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        toast.error("Unable to generate landing pages.");
        return;
      }

      await fetchLandingPages();

      toast.success("Landing pages generated successfully.");

    } catch (error) {
      console.error(error);

      toast.error("Unable to generate landing pages.");
    } finally {
      setGenerating(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    fetchLandingPages();
  }, []);

  // =====================================================
  // DRAWER
  // =====================================================

  const openDrawer = (page) => {
    setSelectedPage(page);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPage(null);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-lg font-semibold">
          Loading Collection Engine...
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="space-y-6">
      <Header />

      <StatsCards stats={stats} />

      <ToolBar
        selectedPages={selectedPages}
        generateCollections={
          generateCollections
        }
        generating={generating}
        refreshCollections={
          fetchLandingPages
        }
      />

      <LandingPagesTable
        pages={landingPages}
        selectedPages={selectedPages}
        setSelectedPages={
          setSelectedPages
        }
        openDrawer={openDrawer}
      />

      <DetailsDrawer
        open={drawerOpen}
        page={selectedPage}
        onClose={closeDrawer}
      />
    </div>
  );
}