"use client";

import { useState } from "react";
import {
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  X,
} from "lucide-react";

export default function PropertyFilters() {
  const [openSections, setOpenSections] = useState({
    budget: true,
    bedrooms: true,
    propertyType: true,
    status: true,
    locations: true,
    amenities: true,
  });

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
      !text-[#111827]
      hover:border-[#0f3b2e]
      hover:!text-[#0f3b2e]
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
    shadow-[0_20px_60px_rgba(0,0,0,0.08)]
    overflow-hidden
    text-[#111827]
  "
>

        {/* HEADER */}
        <div className="px-6 py-5 border-b border-gray-100 bg-white">

          <div className="flex items-center justify-between">

            <div className="flex items-center gap-3 text-gray-900">
              <SlidersHorizontal size={20} />
              <h3 className="text-xl font-black text-gray-900">
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
          <div className="mb-10">

            <div className="flex items-center justify-between mb-4">

              <h4 className="font-bold text-lg text-gray-900">
                Applied Filters
              </h4>

              <button className="font-semibold text-[#0f3b2e]">
                Clear All
              </button>

            </div>

            <div className="flex flex-wrap gap-2">

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
                Gurgaon

                <X
                  size={14}
                  className="cursor-pointer"
                />
              </div>

            </div>
          </div>

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
    text-[#111827]
    font-medium
    outline-none
    appearance-none
    w-full
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
    text-[#111827]
    font-medium
    outline-none
    appearance-none
    w-full
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
              <div className="space-y-4">

                {[
                  "Golf Course Road",
                  "Dwarka Expressway",
                  "New Gurgaon",
                  "Sohna Road",
                  "Sector 113",
                ].map((item) => (
                  <label
                    key={item}
                    className="flex items-center gap-3 text-gray-800"
                  >
                    <input
                      type="checkbox"
                      className="h-4 w-4 accent-[#0f3b2e]"
                    />
                    {item}
                  </label>
                ))}

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

    </aside>
  );
}