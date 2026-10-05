"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import DeveloperHero from "@/components/developers/developer-slug/DeveloperHero";
import DeveloperAbout from "@/components/developers/developer-slug/DeveloperAbout";
import DeveloperProjects from "@/components/developers/developer-slug/DeveloperProjects";

export default function DeveloperSlugClient({
  developer,
  properties = [],
  slug,
}) {
  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      {/* ======================================================
          NAVBAR
      ====================================================== */}

      <Navbar />

      {/* ======================================================
          DEVELOPER HERO
      ====================================================== */}

      <DeveloperHero
        developer={developer}
        properties={properties}
      />

      {/* ======================================================
          ABOUT DEVELOPER
      ====================================================== */}

      <DeveloperAbout
        developer={developer}
        properties={properties}
      />

      {/* ======================================================
          PROJECTS
      ====================================================== */}

      <DeveloperProjects
        developer={developer}
        properties={properties}
        slug={slug}
      />

      {/* ======================================================
          FOOTER
      ====================================================== */}

      <Footer />
    </div>
  );
}