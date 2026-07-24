"use client";

import { useState } from "react";

import Header from "./components/Header";
import StatsCards from "./components/StatsCards";
import ToolBar from "./components/ToolBar";
import PotentialPages from "./components/PotentialPages";
import LandingPagesTable from "./components/LandingPagesTable";
import DetailsDrawer from "./components/DetailsDrawer";

export default function CollectionClient() {
  const [stats, setStats] = useState({
    total: 0,
    draft: 0,
    published: 0,
    indexed: 0,
    averageScore: 0,
  });

  const [potentialPages, setPotentialPages] = useState([]);

  const [landingPages, setLandingPages] = useState([]);

  const [selectedPages, setSelectedPages] = useState([]);

  const [selectedPage, setSelectedPage] = useState(null);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const openDrawer = (page) => {
    setSelectedPage(page);
    setDrawerOpen(true);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setSelectedPage(null);
  };

  return (
    <div className="space-y-8">
      <Header />

      <StatsCards stats={stats} />

      <ToolBar
        selectedPages={selectedPages}
      />

      <PotentialPages
        pages={potentialPages}
      />

      <LandingPagesTable
        pages={landingPages}
        selectedPages={selectedPages}
        setSelectedPages={setSelectedPages}
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