"use client";

import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";

import DeveloperHero from "@/components/developers/developer-slug/DeveloperHero";
import DeveloperAbout from "@/components/developers/developer-slug/DeveloperAbout";
import DeveloperProjects from "@/components/developers/developer-slug/DeveloperProjects";
import DeveloperStats from "@/components/developers/developer-slug/DeveloperStats";

import DeveloperWhyChoose from "@/components/developers/developer-slug/DeveloperWhyChoose";
import DeveloperPresence from "@/components/developers/developer-slug/DeveloperPresence";
import DeveloperFAQ from "@/components/developers/developer-slug/DeveloperFAQ";
import DeveloperCustomSections from "@/components/developers/developer-slug/DeveloperCustomSections";

export default function DeveloperSlugClient({
  developer,
  properties = [],
  slug,
}) {
  const pageContent =
    developer?.pageContent || {};

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar />

      {/* ==================================================
          HERO
      ================================================== */}

      <DeveloperHero
        developer={developer}
        properties={properties}
        pageContent={pageContent}
      />

      {/* ==================================================
          PROJECTS
      ================================================== */}

      <DeveloperProjects
        developer={developer}
        properties={properties}
        slug={slug}
        pageContent={pageContent}
      />


      {/* ==================================================
          ABOUT
      ================================================== */}

      <DeveloperAbout
        developer={developer}
        properties={properties}
        pageContent={pageContent}
      />

      {/* ==================================================
          CMS STATS

          Only appears when Stats have been configured
          in the Developer admin.
      ================================================== */}

      <DeveloperStats
        developer={developer}
        pageContent={pageContent}
      />

      {/* ==================================================
          WHY CHOOSE
      ================================================== */}

      <DeveloperWhyChoose
        developer={developer}
        pageContent={pageContent}
      />

      {/* ==================================================
          MARKET PRESENCE
      ================================================== */}

      <DeveloperPresence
        developer={developer}
        pageContent={pageContent}
      />

      {/* ==================================================
          CUSTOM SECTIONS
      ================================================== */}

      <DeveloperCustomSections
        developer={developer}
        pageContent={pageContent}
      />

      {/* ==================================================
          FAQ
      ================================================== */}

      <DeveloperFAQ
        developer={developer}
        pageContent={pageContent}
      />

      <Footer />
    </div>
  );
}