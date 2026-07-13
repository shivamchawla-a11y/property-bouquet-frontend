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
  {
    label: "₹50L - ₹1Cr",
    value: "5000000-10000000",
  },
  {
    label: "₹1Cr - ₹2Cr",
    value: "10000000-20000000",
  },
  {
    label: "₹2Cr - ₹5Cr",
    value: "20000000-50000000",
  },
  {
    label: "₹5Cr+",
    value: "50000000-999999999",
  },
];


export default function SearchPanel() {
    const [locations, setLocations] = useState([]);
const [developers, setDevelopers] = useState([]);
const [developerSearch, setDeveloperSearch] =
  useState("");
  const [properties, setProperties] = useState([]);
  const [propertyTypes, setPropertyTypes] =
  useState([]);
const [searchTerm, setSearchTerm] = useState("");
const [showSuggestions, setShowSuggestions] =
  useState(false);
const [showDeveloperModal, setShowDeveloperModal] =
  useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
const [locationSearch, setLocationSearch] = useState("");
  const [filters, setFilters] = useState({
  propertyType: "",
  budget: "",
  budgetLabel: "",
  location: "",
  developer: "",
});
  const router = useRouter();

useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await fetch(
        "/api/properties"
      );

      const data = await res.json();

      if (res.ok) {
        const propertyData =
          data.data || [];

        setProperties(propertyData);

        // LOCATIONS
        const uniqueLocations = [
          ...new Set(
            propertyData.flatMap(
              (property) => {
                const location =
                  property?.locationData
                    ?.locationName;

                if (!location) return [];

                return location
                  .split(">")
                  .map((item) =>
                    item.trim()
                  )
                  .filter(Boolean);
              }
            )
          ),
        ].sort();

        setLocations(
          uniqueLocations
        );

// DEVELOPERS
const uniqueDevelopers = [
  ...new Map(
    propertyData
      .filter((property) => property?.coreDetails?.developerName)
      .map((property) => {
        const developer = property.coreDetails.developerRef;

        return [
          property.coreDetails.developerName,
          {
            name: property.coreDetails.developerName,
            logo:
              developer?.logo ||
              developer?.image ||
              property.coreDetails.developerLogo ||
              property.coreDetails.developerImage ||
              "/placeholder.png",
          },
        ];
      })
  ).values(),
].sort((a, b) => a.name.localeCompare(b.name));

setDevelopers(uniqueDevelopers);
        const uniqueCategories = [
  ...new Set(
    propertyData
      .map(
        (property) =>
          property?.categoryData
            ?.categoryName
      )
      .filter(Boolean)
  ),
].sort();

setPropertyTypes(
  uniqueCategories
);
      }
    } catch (err) {
      console.error(err);
    }
  };

  fetchProperties();
}, []);

  const handleChange = (field, value) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSearch = () => {
  const params =
    new URLSearchParams();

  if (searchTerm.trim()) {
    params.set(
      "search",
      searchTerm.trim()
    );
  }

  if (filters.location) {
    params.set(
      "location",
      filters.location
    );
  }

  if (filters.developer) {
    params.set(
      "developer",
      filters.developer
    );
  }

  if (filters.propertyType) {
  params.set(
    "propertyType",
    filters.propertyType
  );
}

  if (filters.budget) {
    params.set(
      "budget",
      filters.budget
    );
  }

  console.log(
    `/properties?${params.toString()}`
  );

  router.push(
    `/properties${
      params.toString()
        ? `?${params.toString()}`
        : ""
    }`
  );
};

const developerOptions = developers
  .slice(0, 5)
  .map((developer) => developer.name);

  const locationOptions = locations.slice(0, 6);

  const suggestions = properties
  .filter((property) => {

    const search =
      searchTerm.toLowerCase();

    const title =
      property?.coreDetails?.title || "";

    const location =
      property?.locationData
        ?.locationName || "";

    const developer =
      property?.coreDetails
        ?.developerName || "";

    return (
      title.toLowerCase().includes(search) ||
      location.toLowerCase().includes(search) ||
      developer.toLowerCase().includes(search)
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
    setSearchTerm(
      e.target.value
    );
    setShowSuggestions(true);
  }}
  onFocus={() =>
    setShowSuggestions(true)
  }
  onKeyDown={(e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  }}
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
    lg:grid-cols-[1fr_1fr_1fr_1fr_170px]
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
  value={filters.budgetLabel || ""}
  budgetSlider={true}
  onChange={(budgetData) => {
    setFilters((prev) => ({
      ...prev,
      budget: budgetData.value,
      budgetLabel: budgetData.label,
    }));
  }}
/>
          </div>

          {/* LOCATION */}
<div className="lg:border-r border-white/10 hover:bg-white/[0.02] transition-all duration-300">
  <LuxuryDropdown
    icon={MapPin}
    label="LOCATION"
    placeholder="Select Location"
    value={filters.location}
    options={[
      ...locationOptions,
      "View All Locations →",
    ]}
    onChange={(value) => {
      if (value === "View All Locations →") {
        setShowLocationModal(true);
        return;
      }

      handleChange("location", value);
    }}
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
    gap-2
    pb-3
    pt-1
    px-4
    text-center
  "
>
  <Building2
    size={14}
    className="text-[#c89d58] shrink-0"
  />

  <span
    className="
      text-[10px]
      sm:text-[11px]
      uppercase
      tracking-[2px]
      sm:tracking-[6px]
      text-white/70
      leading-relaxed
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
        key={developer.name}
        onClick={() => {
          handleChange(
  "developer",
  developer.name
);
          setShowDeveloperModal(false);
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
  src={developer.logo}
  alt={developer.name}
  onError={(e) => {
    e.currentTarget.src = "/placeholder.png";
  }}
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
      .includes(developerSearch.toLowerCase())
  ).length === 0 && (
    <div className="py-14 text-center">
      <p className="text-white/40">
        No developers found
      </p>
    </div>
  )}
</div>
      </motion.div>
    </motion.div>
  )}
  {showLocationModal && (
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
      onClick={() => setShowLocationModal(false)}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 20 }}
        transition={{ duration: 0.25 }}
        onClick={(e) => e.stopPropagation()}
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
        {/* TOP LINE */}
        <div className="h-[2px] bg-gradient-to-r from-transparent via-[#c89d58] to-transparent" />

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-white/10">
          <p className="text-[#c89d58] text-[10px] uppercase tracking-[3px] mb-2">
            Location Directory
          </p>

          <h3 className="text-white text-[22px] font-semibold">
            Select Location
          </h3>

          <p className="text-white/45 text-[13px] mt-2">
            Browse all available locations
          </p>
        </div>

        {/* SEARCH */}
        <div className="p-5 border-b border-white/10">
          <input
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            placeholder="Search location..."
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
            "
          />
        </div>

        {/* LIST */}
        <div className="max-h-[260px] overflow-y-auto">
          {locations
            .filter((loc) =>
              loc.toLowerCase().includes(locationSearch.toLowerCase())
            )
            .map((loc) => (
              <button
                key={loc}
                onClick={() => {
                  handleChange("location", loc);
                  setShowLocationModal(false);
                }}
                className="
                  w-full
                  px-6
                  py-4
                  flex
                  items-center
                  justify-between
                  border-b
                  border-white/[0.04]
                  hover:bg-white/[0.03]
                  transition-all
                  text-left
                "
              >
                <span className="text-white text-[14px] group-hover:text-[#c89d58]">
                  {loc}
                </span>

                <span className="text-[#c89d58] text-[16px]">
                  →
                </span>
              </button>
            ))}

          {locations.filter((loc) =>
            loc.toLowerCase().includes(locationSearch.toLowerCase())
          ).length === 0 && (
            <div className="py-14 text-center text-white/40">
              No locations found
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