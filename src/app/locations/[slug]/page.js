"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/home/Navbar";

import {
  MapPin,
  Building2,
  ArrowRight,
  SlidersHorizontal,
  Search,
  X,
  BedDouble,
  IndianRupee,
} from "lucide-react";

import { formatPrice } from "@/utils/formatPrice";

export default function LocationSlugPage() {
  const API =
    "/api";

  const { slug } = useParams();

  const [location, setLocation] = useState(null);

  const [properties, setProperties] = useState([]);

  const [filteredProperties, setFilteredProperties] =
    useState([]);

  const [loading, setLoading] = useState(true);

  // ================= FILTERS =================
  const [selectedDeveloper, setSelectedDeveloper] =
    useState("");

  const [selectedCategory, setSelectedCategory] =
    useState("");

  const [search, setSearch] = useState("");

  const [mobileFilter, setMobileFilter] =
    useState(false);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(
          `${API}/locations/${slug}`
        );

        const data = await res.json();

        if (res.ok) {
          setLocation(data.location);

          setProperties(data.properties || []);

          setFilteredProperties(
            data.properties || []
          );
        } else {
          setLocation(null);
        }
      } catch (err) {
        console.error(
          "Error fetching location:",
          err
        );

        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [slug]);

  // ================= FILTER OPTIONS =================
  const developers = useMemo(() => {
    return [
      ...new Set(
        properties
          .map(
            (p) =>
              p?.developerData?.name ||
              p?.coreDetails?.developerName
          )
          .filter(Boolean)
      ),
    ];
  }, [properties]);

  const categories = useMemo(() => {
    return [
      ...new Set(
        properties
          .map(
            (p) =>
              p?.categoryData?.name ||
              p?.coreDetails?.propertyType
          )
          .filter(Boolean)
      ),
    ];
  }, [properties]);

  // ================= APPLY FILTERS =================
  useEffect(() => {
    let updated = [...properties];

    // DEVELOPER
    if (selectedDeveloper) {
      updated = updated.filter(
        (item) =>
          item?.developerData?.name ===
            selectedDeveloper ||
          item?.coreDetails?.developerName ===
            selectedDeveloper
      );
    }

    // CATEGORY
    if (selectedCategory) {
      updated = updated.filter(
        (item) =>
          item?.categoryData?.name ===
            selectedCategory ||
          item?.coreDetails?.propertyType ===
            selectedCategory
      );
    }

    // SEARCH
    if (search.trim()) {
      updated = updated.filter((item) =>
        item?.coreDetails?.title
          ?.toLowerCase()
          ?.includes(search.toLowerCase())
      );
    }

    setFilteredProperties(updated);
  }, [
    properties,
    selectedDeveloper,
    selectedCategory,
    search,
  ]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/20 border-t-white rounded-full animate-spin mx-auto" />

          <p className="text-white text-lg mt-5">
            Loading luxury properties...
          </p>
        </div>
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!location) {
    return (
      <div className="h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-red-500 text-4xl font-black">
            Location Not Found
          </h2>

          <p className="text-white/60 mt-4">
            Please try another location.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen overflow-x-hidden">
      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-40 overflow-hidden min-h-[720px] bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#312e81]">
        {/* BG IMAGE */}
        <img
          src="/locationbanner.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* OVERLAYS */}
        <div className="absolute inset-0 bg-black/65" />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/30" />

        {/* CONTENT */}
        <div className="relative z-20 max-w-[1500px] mx-auto px-4">
          <div className="max-w-5xl">
            {/* BADGE */}
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full text-white mb-8">
              <MapPin size={18} />

              <span className="font-medium tracking-wide">
                Prime Investment Location
              </span>
            </div>

            {/* TITLE */}
            <h1 className="text-[56px] sm:text-[72px] lg:text-[110px] font-black text-white leading-[0.95] tracking-[-3px]">
              Luxury Properties
              <br />
              in {location.name}
            </h1>

            {/* DESC */}
            <p className="mt-8 text-xl text-white/70 max-w-3xl leading-9">
              Explore premium residences, branded
              developments and luxury investment
              opportunities curated for elite living.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-6 mt-12">
              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] px-8 py-7 min-w-[220px]">
                <h3 className="text-6xl font-black text-white">
                  {properties.length}
                </h3>

                <p className="text-white/70 mt-2">
                  Luxury Projects
                </p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/10 rounded-[30px] px-8 py-7 min-w-[220px]">
                <h3 className="text-5xl font-black text-white">
                  Luxury
                </h3>

                <p className="text-white/70 mt-2">
                  Elite Lifestyle
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="relative z-30 max-w-[1500px] mx-auto px-4 -mt-24 pb-20">
        <div className="grid lg:grid-cols-[320px_1fr] gap-10 items-start">
          {/* MOBILE OVERLAY */}
          {mobileFilter && (
            <div
              onClick={() =>
                setMobileFilter(false)
              }
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />
          )}

          {/* SIDEBAR */}
          <aside
            className={`fixed lg:sticky top-0 lg:top-28 left-0 h-screen lg:h-fit w-[88%] sm:w-[400px] lg:w-full bg-white z-50 transition-all duration-500 overflow-y-auto ${
              mobileFilter
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            } rounded-r-[32px] lg:rounded-[32px] shadow-2xl border border-gray-100`}
          >
            {/* MOBILE HEADER */}
            <div className="lg:hidden flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="text-2xl font-black">
                Filters
              </h3>

              <button
                onClick={() =>
                  setMobileFilter(false)
                }
                className="w-11 h-11 rounded-full bg-gray-100 flex items-center justify-center"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-7">
              {/* FILTER HEADER */}
              <div className="hidden lg:flex items-center gap-4 mb-10">
                <div className="w-14 h-14 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xl">
                  <SlidersHorizontal size={24} />
                </div>

                <div>
                  <h3 className="text-2xl font-black text-gray-900">
                    Filters
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Refine luxury properties
                  </p>
                </div>
              </div>

              {/* SEARCH */}
              <div className="mb-8">
                <label className="text-sm font-bold text-gray-700 block mb-3">
                  Search Property
                </label>

                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                  <input
                    type="text"
                    value={search}
                    onChange={(e) =>
                      setSearch(e.target.value)
                    }
                    placeholder="Search by title"
                    className="w-full h-14 rounded-2xl border border-gray-200 pl-12 pr-4 outline-none focus:border-red-500"
                  />
                </div>
              </div>

              {/* DEVELOPERS */}
              <div className="mb-8">
                <label className="text-sm font-bold text-gray-700 block mb-3">
                  Developer
                </label>

                <select
                  value={selectedDeveloper}
                  onChange={(e) =>
                    setSelectedDeveloper(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-red-500"
                >
                  <option value="">
                    All Developers
                  </option>

                  {developers.map((dev) => (
                    <option key={dev} value={dev}>
                      {dev}
                    </option>
                  ))}
                </select>
              </div>

              {/* CATEGORY */}
              <div className="mb-8">
                <label className="text-sm font-bold text-gray-700 block mb-3">
                  Property Type
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                  className="w-full h-14 rounded-2xl border border-gray-200 px-5 outline-none focus:border-red-500"
                >
                  <option value="">
                    All Types
                  </option>

                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* RESET */}
              <button
                onClick={() => {
                  setSelectedDeveloper("");
                  setSelectedCategory("");
                  setSearch("");
                }}
                className="w-full h-14 rounded-2xl bg-[#111827] hover:bg-red-600 text-white font-bold transition-all duration-300"
              >
                Reset Filters
              </button>
            </div>
          </aside>

          {/* RIGHT SIDE */}
          <div>
            {/* TOP BAR */}
            <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-5 md:items-center md:justify-between mb-10">
              <div>
                <h2 className="text-3xl font-black text-[#111827]">
                  Luxury Projects
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing{" "}
                  {filteredProperties.length} luxury
                  residences
                </p>
              </div>

              {/* MOBILE FILTER BUTTON */}
              <button
                onClick={() =>
                  setMobileFilter(true)
                }
                className="lg:hidden h-14 px-6 rounded-2xl bg-red-600 text-white font-bold flex items-center justify-center gap-3"
              >
                <SlidersHorizontal size={18} />

                Filters
              </button>
            </div>

            {/* GRID */}
            {filteredProperties.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
                {filteredProperties.map(
                  (property) => (
                    <div
                      key={property._id}
                      className="group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-500"
                    >
                      {/* IMAGE */}
                      <div className="relative h-[320px] overflow-hidden">
                        <img
                          src={
                            property?.media
                              ?.heroImageUrl ||
                            "/placeholder.jpg"
                          }
                          alt=""
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                        {/* PRICE */}
                        <div className="absolute top-5 right-5 bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-xl flex items-center gap-1">
                          <IndianRupee size={14} />

                          {formatPrice(
                            property?.coreDetails
                              ?.startingPrice
                          )}
                        </div>

                        {/* DEVELOPER */}
                        <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-xl px-4 py-2 rounded-full text-sm font-bold text-gray-900 shadow-xl flex items-center gap-2 max-w-[70%]">
                          <Building2 size={15} />

                          <span className="truncate">
                            {property
                              ?.developerData
                              ?.name ||
                              "Luxury Developer"}
                          </span>
                        </div>

                        {/* CONTENT */}
                        <div className="absolute bottom-6 left-6 right-6 text-white">
                          <h3 className="text-2xl font-black leading-tight">
                            {
                              property?.coreDetails
                                ?.title
                            }
                          </h3>

                          <div className="flex items-center gap-2 text-white/80 mt-3">
                            <MapPin size={16} />

                            <span className="text-sm">
                              {
                                property
                                  ?.locationData
                                  ?.locationName
                              }
                            </span>
                          </div>

                          <div className="mt-4 inline-flex items-center gap-2 bg-white/10 backdrop-blur-xl border border-white/10 px-4 py-2 rounded-full text-sm">
                            <BedDouble size={15} />

                            Luxury Residences
                          </div>
                        </div>
                      </div>

                      {/* BUTTON */}
                      <div className="p-6">
                        <Link
                          href={`/${property.slug}`}
                          className="w-full h-14 rounded-2xl bg-[#111827] hover:bg-red-600 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300"
                        >
                          Explore Property

                          <ArrowRight
                            size={18}
                            className="group-hover:translate-x-1 transition"
                          />
                        </Link>
                      </div>
                    </div>
                  )
                )}
              </div>
            ) : (
              <div className="bg-white rounded-[30px] p-16 text-center shadow-lg">
                <h3 className="text-3xl font-black">
                  No Properties Found
                </h3>

                <p className="text-gray-500 mt-4">
                  Try changing filters or check back
                  later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}