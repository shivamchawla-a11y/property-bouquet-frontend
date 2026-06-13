"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import LuxuryDropdown from "./LuxuryDropdown";
import {
  Search,
  Building2,
  SlidersHorizontal,
  MapPin,
  Target,
  ChevronDown,
} from "lucide-react";

const propertyTypes = [
  "Apartment",
  "Villa",
  "Plot",
  "Commercial",
  "Penthouse",
];

const budgetRanges = [
  "₹50L - ₹1Cr",
  "₹1Cr - ₹2Cr",
  "₹2Cr - ₹5Cr",
  "₹5Cr+",
];


const goals = [
  "Investment",
  "End Use",
  "Rental Yield",
  "Luxury Living",
];

export default function SearchPanel() {
    const [locations, setLocations] = useState([]);
const [developers, setDevelopers] = useState([]);
const [developerSearch, setDeveloperSearch] =
  useState("");
  const [properties, setProperties] = useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [showSuggestions, setShowSuggestions] =
  useState(false);
const [showDeveloperModal, setShowDeveloperModal] =
  useState(false);
  const [filters, setFilters] = useState({
  propertyType: "",
  budget: "",
  location: "",
  developer: "",
  goal: "",
});
  const router = useRouter();

useEffect(() => {
  const fetchData = async () => {
    try {
      // LOCATIONS
      const locationRes = await fetch(
        "https://property-bouquet-backend.onrender.com/api/locations/tree"
      );

      const locationData =
        await locationRes.json();

      if (locationRes.ok) {
        setLocations(
          locationData.data || []
        );
      }

      // DEVELOPERS
      const developerRes = await fetch(
        "https://property-bouquet-backend.onrender.com/api/developers"
      );

      const developerData =
        await developerRes.json();

      if (developerRes.ok) {
        setDevelopers(
          developerData.data || []
        );
      }
    } catch (error) {
      console.error(error);
    }
  };
  const fetchProperties = async () => {
  try {
    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/properties"
    );

    const data = await res.json();

    if (res.ok) {
      setProperties(data.data || []);
    }
  } catch (err) {
    console.error(err);
  }
};

  fetchData();
  fetchProperties();
}, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSearch = () => {

  // PROPERTY SEARCH
  // PROPERTY SEARCH
if (searchTerm.trim()) {

  const property =
    suggestions?.[0];

  if (property?.slug) {

    router.push(
      `/${property.slug}`
    );

    return;
  }
}

  // DEVELOPER SEARCH
  if (filters.developer) {

    const selectedDeveloper =
      developers.find(
        (developer) =>
          developer.name ===
          filters.developer
      );

    if (selectedDeveloper?.slug) {
      router.push(
        `/developers/${selectedDeveloper.slug}`
      );
      return;
    }
  }

  // LOCATION SEARCH
  if (filters.location) {

    const selectedLocation =
      locations.find(
        (location) =>
          location.name ===
          filters.location
      );

    if (selectedLocation?.slug) {
      router.push(
        `/locations/${selectedLocation.slug}`
      );
    }
  }
};

const developerOptions =
  developers.slice(0, 3).map(
    (developer) => developer.name
  );

  const suggestions = properties
  .filter((property) => {

    const title =
      property?.coreDetails?.title || "";

    return title
      .toLowerCase()
      .includes(
        searchTerm.toLowerCase()
      );
  })
  .sort((a, b) => {

    const aTitle =
      a?.coreDetails?.title || "";

    const bTitle =
      b?.coreDetails?.title || "";

    const search =
      searchTerm.toLowerCase();

    const aStarts =
      aTitle.toLowerCase().startsWith(
        search
      );

    const bStarts =
      bTitle.toLowerCase().startsWith(
        search
      );

    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    return aTitle.localeCompare(
      bTitle
    );
  })
  .slice(0, 8);

  return (
  <div className="max-w-[1180px] mx-auto px-5">
    <div
  className="
    relative
    rounded-[30px]
    border border-[#c89d58]/15
    bg-white/[0.08]
    backdrop-blur-[50px]
    shadow-[0_25px_90px_rgba(0,0,0,0.65)]
    overflow-visible
  "
>
      {/* OUTER GLOW */}
      <div className="absolute -inset-[1px] rounded-[36px] bg-gradient-to-r from-[#c89d58]/25 via-white/10 to-[#c89d58]/15 blur-xl opacity-70" />

      {/* TOP SEARCH BAR */}
      <div className="relative z-[2000] p-5 pb-0">
        <div
  className="
    h-[58px]
    rounded-[16px]
    border border-[#c89d58]/10
    bg-black/25
    backdrop-blur-xl
    flex items-center justify-between
    px-5
  "
>
          <div className="flex items-center gap-4 flex-1">
            <Search
              size={20}
              className="text-[#c89d58]"
            />

            <input
  value={searchTerm}
  onChange={(e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  }}
  onFocus={() =>
    setShowSuggestions(true)
  }
  placeholder="Search by property name, project, or landmark"
  className="
    bg-transparent
    w-full
    outline-none
    text-white
    placeholder:text-white/35
    text-[14px]
  "
/>
          </div>

          <AnimatePresence>
  {showSuggestions &&
    searchTerm &&
    suggestions.length > 0 && (
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 10,
        }}
        className="
          absolute
          top-full
          left-5
          right-5
          mt-2
          z-[99999]
          rounded-[18px]
          overflow-hidden
          border
          border-[#c89d58]/15
          bg-[#0b0b0b]/95
          backdrop-blur-3xl
          shadow-[0_30px_80px_rgba(0,0,0,0.75)]
        "
      >
        {suggestions.map(
          (property) => (
            <button
              key={property._id}
              onClick={() => {
                router.push(
                  `/${property.slug}`
                );

                setShowSuggestions(
                  false
                );
              }}
              className="
                w-full
                text-left
                px-5
                py-4
                border-b
                border-white/[0.05]
                last:border-none
                hover:bg-white/[0.04]
                transition-all
              "
            >
              <p className="text-white text-[14px] font-medium">
                {
                  property
                    ?.coreDetails?.title
                }
              </p>

              <p className="text-white/40 text-[11px] mt-1">
                {
                  property
                    ?.locationData
                    ?.locationName
                }
              </p>
            </button>
          )
        )}
      </motion.div>
    )}
</AnimatePresence>

          <div className="w-px h-8 bg-white/10 mx-5" />

          <button
            className="
              flex items-center gap-2
              text-[#c89d58]
              text-[12px]
              uppercase
              tracking-[2px]
            "
          >
            <SlidersHorizontal size={15} />
            Advanced Search
          </button>
        </div>
      </div>

      {/* FILTER ROW */}
      <div className="relative z-[999] p-4 pt-2">
        <div
  className="
    overflow-visible
    rounded-[16px]
    border border-white/10
    bg-white/[0.05]
    backdrop-blur-xl
    grid
    grid-cols-1
    lg:grid-cols-[1fr_1fr_1fr_1fr_1fr_150px]
  "
>
          {/* PROPERTY TYPE */}
          <div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
            <LuxuryDropdown
              icon={Building2}
              label="PROPERTY TYPE"
              placeholder="Select Type"
              value={filters.propertyType}
              options={propertyTypes}
              onChange={(value) =>
                handleChange("propertyType", value)
              }
            />
          </div>

          {/* BUDGET */}
          <div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
            <LuxuryDropdown
  icon={SlidersHorizontal}
  label="BUDGET"
  placeholder="Budget Range"
  value={filters.budget}
  budgetSlider={true}
  onChange={(value) =>
    handleChange("budget", value)
  }
/>
          </div>

          {/* LOCATION */}
          <div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
            <LuxuryDropdown
              icon={MapPin}
              label="LOCATION"
              placeholder="Select Location"
              value={filters.location}
              options={locations.map(
                (l) => l.name
              )}
              onChange={(value) =>
                handleChange("location", value)
              }
            />
          </div>

          {/* DEVELOPER */}
          <div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
            <LuxuryDropdown
  icon={Building2}
  label="DEVELOPER"
  placeholder="Select Developer"
  value={filters.developer}
  options={[
    ...developerOptions,
    "View All Developers →",
  ]}
  onChange={(value) => {
    if (
      value ===
      "View All Developers →"
    ) {
      setShowDeveloperModal(true);
      return;
    }

    handleChange(
      "developer",
      value
    );
  }}
/>
          </div>

          {/* GOAL */}
          <div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
            <LuxuryDropdown
              icon={Target}
              label="INVESTMENT GOAL"
              placeholder="Select Goal"
              value={filters.goal}
              options={goals}
              onChange={(value) =>
                handleChange("goal", value)
              }
            />
          </div>

          {/* SEARCH BUTTON */}
          <motion.button
            whileHover={{
              scale: 1.02,
              y: -2,
            }}
            whileTap={{
              scale: 0.97,
            }}
            onClick={handleSearch}
            className="
  relative
  overflow-hidden
  bg-gradient-to-b
  from-[#e6c57b]
  via-[#d4ab57]
  to-[#be8c32]
  text-black
  font-semibold
  tracking-[3px]
  uppercase
  text-[12px]
  flex
  items-center
  justify-center
  gap-2
  min-h-[74px]
"
          >
            Search
            <span className="text-[18px]">
              →
            </span>
          </motion.button>
        </div>
      </div>

      {/* TAGLINE */}
      <div
        className="
          relative
          z-20
          flex
          items-center
          justify-center
          gap-3
          pb-3
        pt-0
        "
      >
        <Building2
          size={14}
          className="text-[#c89d58]"
        />

        <span
          className="
            text-[11px]
            uppercase
            tracking-[6px]
            text-white/70
          "
        >
          Explore Luxury. Invest With Confidence.
        </span>
      </div>
    </div>
    <AnimatePresence>
  {showDeveloperModal && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="
        fixed
        inset-0
        z-[999999]
        bg-black/45
        backdrop-blur-[5px]
        flex
        items-start
        justify-center
        pt-[110px]
        pb-8
        px-4
      "
      onClick={() =>
        setShowDeveloperModal(false)
      }
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.96,
          y: 20,
        }}
        transition={{
          duration: 0.25,
        }}
        onClick={(e) =>
          e.stopPropagation()
        }
        className="
          relative
          w-full
          max-w-[540px]
          rounded-[28px]
          border
          border-[#c89d58]/15
          bg-[#0b0b0b]
          shadow-[0_40px_120px_rgba(0,0,0,0.65)]
          overflow-hidden
        "
      >
        {/* GOLD TOP LINE */}
        <div
          className="
            h-[2px]
            bg-gradient-to-r
            from-transparent
            via-[#c89d58]
            to-transparent
          "
        />

        {/* HEADER */}
        <div
          className="
            sticky
            top-0
            z-20
            bg-[#0b0b0b]
            border-b
            border-white/10
            px-6
            py-5
          "
        >
          <div className="flex items-start justify-between">
            <div>
              <p
                className="
                  text-[#c89d58]
                  text-[10px]
                  uppercase
                  tracking-[3px]
                  mb-2
                "
              >
                Developer Directory
              </p>

              <h3
                className="
                  text-white
                  text-[22px]
                  font-semibold
                  leading-none
                "
              >
                Select Developer
              </h3>

              <p
                className="
                  text-white/45
                  text-[13px]
                  mt-2
                "
              >
                Browse all developer partners
              </p>
            </div>

            <button
              onClick={() =>
                setShowDeveloperModal(false)
              }
              className="
                w-9
                h-9
                rounded-full
                bg-white/5
                hover:bg-white/10
                text-white/60
                transition-all
                flex
                items-center
                justify-center
              "
            >
              ✕
            </button>
          </div>
        </div>

        {/* SEARCH */}
        <div
          className="
            sticky
            top-[104px]
            z-10
            bg-[#0b0b0b]
            p-5
            border-b
            border-white/10
          "
        >
          <input
            value={developerSearch}
            onChange={(e) =>
              setDeveloperSearch(
                e.target.value
              )
            }
            placeholder="Search developer..."
            className="
              w-full
              h-[50px]
              rounded-[16px]
              bg-white/[0.04]
              border
              border-white/10
              px-5
              text-white
              placeholder:text-white/35
              outline-none
              focus:border-[#c89d58]/40
              transition-all
            "
          />
        </div>

        {/* LIST */}
        <div
  className="
    max-h-[260px]
    overflow-y-auto
    scrollbar-thin
    scrollbar-thumb-white/10
  "
>
          {developers
            .filter((developer) =>
              developer.name
                .toLowerCase()
                .includes(
                  developerSearch.toLowerCase()
                )
            )
            .map((developer) => (
              <button
                key={developer._id}
                onClick={() => {
                  handleChange(
                    "developer",
                    developer.name
                  );

                  setShowDeveloperModal(
                    false
                  );
                }}
                className="
                  w-full
                  px-6
                  py-4
                  flex
                  items-center
                  gap-4
                  border-b
                  border-white/[0.04]
                  hover:bg-white/[0.03]
                  transition-all
                  text-left
                  group
                "
              >
                <img
                  src={
                    developer.logo ||
                    "/placeholder.png"
                  }
                  alt={developer.name}
                  className="
                    w-12
                    h-12
                    rounded-xl
                    object-cover
                    border
                    border-white/10
                    bg-white/5
                    shrink-0
                  "
                />

                <div className="flex-1">
                  <p
                    className="
                      text-white
                      text-[15px]
                      font-medium
                      group-hover:text-[#c89d58]
                      transition-colors
                    "
                  >
                    {developer.name}
                  </p>

                  <p
                    className="
                      text-white/40
                      text-[12px]
                      mt-0.5
                    "
                  >
                    Developer Partner
                  </p>
                </div>
              </button>
            ))}

          {developers.filter((developer) =>
            developer.name
              .toLowerCase()
              .includes(
                developerSearch.toLowerCase()
              )
          ).length === 0 && (
            <div
              className="
                py-14
                text-center
              "
            >
              <p className="text-white/40">
                No developers found
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
  </div>
  
);
}