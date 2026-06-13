"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertyFilters({
  properties = [],
  selectedLocation,
  selectedDeveloper,
}) {
  const [openSections, setOpenSections] = useState({
  budget: true,
  bedrooms: true,
  propertyType: true,
  status: true,
  locations: true,
  developers: true,
  amenities: true,
});
  const router = useRouter();
 const locations = [
  "Golf Course Road",
  "Golf Course Extension Road",
  "Dwarka Expressway",
  "New Gurgaon",
  "Sohna Road",
  "SPR",
  "MG Road",
];
const [showDeveloperModal, setShowDeveloperModal] =
  useState(false);

const [developerSearch, setDeveloperSearch] =
  useState("");

const developers = [
  ...new Set(
    properties
      ?.map(
        (p) =>
          p?.coreDetails?.developerName
      )
      .filter(Boolean)
  ),
];

  const toggleSection = (key) => {
    setOpenSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const Pill = ({ label }) => (
    <button
      type="button"
      className="
        px-4
        py-2.5
        rounded-full
        border
        border-gray-200
        bg-white
        text-gray-800
        hover:border-[#0f3b2e]
        hover:text-[#0f3b2e]
        text-sm
        font-medium
        transition-all
        duration-300
        whitespace-nowrap
      "
    >
      + {label}
    </button>
  );

  return (
    <aside
  className="
    hidden
    lg:block
    w-full
    min-w-[380px]
    [&_*]:text-[#111827]
  "
>

      <div
  className="
    sticky
    top-28
    bg-white
    rounded-[30px]
    border
    border-gray-200
    shadow-[0_30px_80px_rgba(15,59,46,0.08)]
    overflow-hidden
    text-[#111827]
  "
>

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3 text-gray-900">
              <SlidersHorizontal size={20} />
              <h3 className="text-[17px] font-semibold text-gray-900">
                Filters
              </h3>
            </div>

            <button className="text-sm font-semibold text-[#0f3b2e]">
              Reset
            </button>

          </div>
        </div>

        {/* BODY */}
        <div className="max-h-[calc(100vh-180px)] overflow-y-auto p-6 bg-white">

          {/* APPLIED FILTERS */}
          {(selectedLocation ||
  selectedDeveloper) && (
  <div className="mb-10">

            <div className="flex items-center justify-between mb-4">

              <h4 className="font-bold text-lg text-gray-900">
                Applied Filters
              </h4>

              <button
  onClick={() =>
    router.push("/properties")
  }
  className="font-semibold text-[#0f3b2e]"
>
  Clear All
</button>

            </div>

           <div className="flex flex-wrap gap-2">

  {selectedLocation && (
    <div
      className="
        px-4
        py-2
        rounded-full
        bg-[#eef6f3]
        border
        border-[#cce3db]
        flex
        items-center
        gap-2
        text-sm
        font-medium
        text-gray-800
      "
    >
      📍 {selectedLocation}
    </div>
  )}

  {selectedDeveloper && (
    <div
      className="
        px-4
        py-2
        rounded-full
        bg-[#eef6f3]
        border
        border-[#cce3db]
        flex
        items-center
        gap-2
        text-sm
        font-medium
        text-gray-800
      "
    >
      🏢 {selectedDeveloper}
    </div>
  )}

  {!selectedLocation &&
    !selectedDeveloper && (
      <span className="text-gray-400 text-sm">
        No filters applied
      </span>
    )}

</div>
          </div>
)}

          {/* BUDGET */}
          <div className="border-t border-gray-100 pt-8">

            <button
              onClick={() => toggleSection("budget")}
              className="w-full flex items-center justify-between mb-5"
            >
              <h4 className="font-bold text-xl text-gray-900">
                Budget
              </h4>

              {openSections.budget ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-900" />
              )}
            </button>

            {openSections.budget && (
              <div className="grid grid-cols-2 gap-3">

                <select
                  className="
                    h-12
                    rounded-full
                    border
                    border-gray-200
                    px-4
                    bg-white
                    text-gray-900
                  "
                >
                  <option>No Min</option>
                  <option>₹50 L</option>
                  <option>₹1 Cr</option>
                  <option>₹2 Cr</option>
                </select>

                <select
                  className="
                    h-12
                    rounded-full
                    border
                    border-gray-200
                    px-4
                    bg-white
                    text-gray-900
                  "
                >
                  <option>No Max</option>
                  <option>₹2 Cr</option>
                  <option>₹5 Cr</option>
                  <option>₹10 Cr</option>
                </select>

              </div>
            )}
          </div>

          {/* BEDROOMS */}
          <div className="border-t border-gray-100 pt-8 mt-8">

            <button
              onClick={() => toggleSection("bedrooms")}
              className="w-full flex items-center justify-between mb-5"
            >
              <h4 className="font-bold text-xl text-gray-900">
                No. of Bedrooms
              </h4>

              {openSections.bedrooms ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-900" />
              )}
            </button>

            {openSections.bedrooms && (
              <div className="flex flex-wrap gap-3">
                <Pill label="1 BHK" />
                <Pill label="2 BHK" />
                <Pill label="3 BHK" />
                <Pill label="4 BHK" />
                <Pill label="5 BHK" />
                <Pill label="Penthouse" />
              </div>
            )}
          </div>

          {/* PROPERTY TYPE */}
          <div className="border-t border-gray-100 pt-8 mt-8">

            <button
              onClick={() => toggleSection("propertyType")}
              className="w-full flex items-center justify-between mb-5"
            >
              <h4 className="font-bold text-xl text-gray-900">
                Property Type
              </h4>

              {openSections.propertyType ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-900" />
              )}
            </button>

            {openSections.propertyType && (
              <div className="flex flex-wrap gap-3">
                <Pill label="Apartment" />
                <Pill label="Villa" />
                <Pill label="Floor" />
                <Pill label="Penthouse" />
                <Pill label="Commercial" />
              </div>
            )}
          </div>

          {/* STATUS */}
          <div className="border-t border-gray-100 pt-8 mt-8">

            <button
              onClick={() => toggleSection("status")}
              className="w-full flex items-center justify-between mb-5"
            >
              <h4 className="font-bold text-xl text-gray-900">
                Project Status
              </h4>

              {openSections.status ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-900" />
              )}
            </button>

            {openSections.status && (
              <div className="flex flex-wrap gap-3">
                <Pill label="New Launch" />
                <Pill label="Under Construction" />
                <Pill label="Ready To Move" />
              </div>
            )}
          </div>

          {/* LOCATIONS */}
<div className="border-t border-gray-100 pt-8 mt-8">

  <button
    onClick={() => toggleSection("locations")}
    className="w-full flex items-center justify-between mb-5"
  >
    <h4 className="font-bold text-xl text-gray-900">
      Prime Locations
    </h4>

    {openSections.locations ? (
      <ChevronUp size={20} className="text-gray-900" />
    ) : (
      <ChevronDown size={20} className="text-gray-900" />
    )}
  </button>

  {openSections.locations && (
  <div className="space-y-1">

    {locations.map((location) => (
      <label
        key={location}
        className="
          flex
          items-center
          gap-3
          px-3
          py-2.5
          rounded-xl
          hover:bg-[#faf7f2]
          cursor-pointer
          transition-all
        "
      >
        <input
          type="radio"
          checked={
            selectedLocation === location
          }
          onChange={() =>
            router.push(
              `/properties?location=${encodeURIComponent(
                location
              )}${
                selectedDeveloper
                  ? `&developer=${encodeURIComponent(
                      selectedDeveloper
                    )}`
                  : ""
              }`
            )
          }
          className="
            h-4
            w-4
            accent-[#c89d58]
          "
        />

        <span className="text-sm font-medium">
          {location}
        </span>
      </label>
    ))}

  </div>
)}
</div>

          {/* DEVELOPERS */}

{/* DEVELOPERS */}
<div className="border-t border-gray-100 pt-8 mt-8">

  <button
    onClick={() =>
      toggleSection("developers")
    }
    className="w-full flex items-center justify-between mb-5"
  >
    <h4 className="font-bold text-xl text-gray-900">
      Developers
    </h4>

    {openSections.developers ? (
      <ChevronUp
        size={20}
        className="text-gray-900"
      />
    ) : (
      <ChevronDown
        size={20}
        className="text-gray-900"
      />
    )}
  </button>

  {openSections.developers && (
  <div>

    <div className="space-y-1 mb-4">

      {developers
        .slice(0, 5)
        .map((developer) => (
          <label
            key={developer}
            className="
              flex
              items-center
              gap-3
              px-3
              py-2.5
              rounded-xl
              hover:bg-[#faf7f2]
              cursor-pointer
              transition-all
            "
          >
            <input
              type="radio"
              checked={
                selectedDeveloper ===
                developer
              }
              onChange={() =>
                router.push(
                  `/properties?${
                    selectedLocation
                      ? `location=${encodeURIComponent(
                          selectedLocation
                        )}&`
                      : ""
                  }developer=${encodeURIComponent(
                    developer
                  )}`
                )
              }
              className="
                h-4
                w-4
                accent-[#c89d58]
              "
            />

            <span className="text-sm font-medium truncate">
              {developer}
            </span>
          </label>
        ))}

    </div>

    <button
      onClick={() =>
        setShowDeveloperModal(true)
      }
      className="
        w-full
        h-11
        rounded-xl
        border
        border-[#c89d58]/20
        bg-[#faf7f2]
        text-[#0f3b2e]
        font-semibold
        text-sm
        hover:bg-[#f5efe6]
        transition-all
      "
    >
      View All Developers →
    </button>

  </div>
)}
</div>

          {/* AMENITIES */}
          <div className="border-t border-gray-100 pt-8 mt-8">

            <button
              onClick={() => toggleSection("amenities")}
              className="w-full flex items-center justify-between mb-5"
            >
              <h4 className="font-bold text-xl text-gray-900">
                Amenities
              </h4>

              {openSections.amenities ? (
                <ChevronUp size={20} className="text-gray-900" />
              ) : (
                <ChevronDown size={20} className="text-gray-900" />
              )}
            </button>

            {openSections.amenities && (
              <div className="flex flex-wrap gap-3">
                <Pill label="Clubhouse" />
                <Pill label="Swimming Pool" />
                <Pill label="Gymnasium" />
                <Pill label="Spa" />
                <Pill label="Sports Arena" />
                <Pill label="Kids Play Area" />
              </div>
            )}
          </div>

        </div>
      </div>
{showDeveloperModal && (
  <div
    className="
      fixed
      inset-0
      z-[999]
      bg-black/70
      backdrop-blur-md
      flex
      items-center
      justify-center
      p-6
    "
  >
    <div
      className="
        w-full
        max-w-[650px]
        bg-[#0b0b0b]
        rounded-[32px]
        overflow-hidden
        border
        border-white/10
        shadow-[0_30px_80px_rgba(0,0,0,0.5)]
      "
    >
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
              w-10
              h-10
              rounded-full
              bg-white/5
              hover:bg-white/10
              text-white
            "
          >
            ✕
          </button>

        </div>
      </div>

      {/* SEARCH */}

      <div
        className="
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
            h-[52px]
            rounded-[16px]
            bg-white/[0.04]
            border
            border-white/10
            px-5
            text-white
            placeholder:text-white/35
            outline-none
          "
        />
      </div>

      {/* LIST */}

      <div
        className="
          max-h-[500px]
          overflow-y-auto
        "
      >
        {developers
          .filter((developer) =>
            developer
              .toLowerCase()
              .includes(
                developerSearch.toLowerCase()
              )
          )
          .map((developer) => (
            <button
              key={developer}
              onClick={() => {
                router.push(
                  `/properties?developer=${encodeURIComponent(
                    developer
                  )}`
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
                justify-between
                border-b
                border-white/5
                hover:bg-white/[0.03]
                text-left
              "
            >
              <span
                className="
                  text-white
                  text-[15px]
                "
              >
                {developer}
              </span>

              <span className="text-[#c89d58]">
                →
              </span>
            </button>
          ))}
      </div>

    </div>
  </div>
)}
    </aside>
  );
}