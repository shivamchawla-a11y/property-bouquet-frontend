"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/home/Navbar";

import {
  MapPin,
  Building2,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Trophy,
  Home,
  BadgeCheck,
} from "lucide-react";

export default function DeveloperSlugPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const { slug } = useParams();

  const [developer, setDeveloper] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchDeveloper = async () => {
      try {
        const res = await fetch(`${API}/developers/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setDeveloper(data.developer);
          setProperties(data.properties || []);
        } else {
          setDeveloper(null);
        }
      } catch (err) {
        console.error("Error fetching developer:", err);
        setDeveloper(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDeveloper();
  }, [slug]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-xl">
        Loading developer...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!developer) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-2xl font-bold">
        Developer not found ❌
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-24 overflow-hidden bg-gradient-to-br from-[#081c15] via-[#1b4332] to-[#2d6a4f]">

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />

        {/* GLOW */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4af37]/20 blur-3xl rounded-full" />

        <div className="relative max-w-7xl mx-auto px-4">

          <div className="max-w-5xl">

            {/* TAG */}
            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full text-white mb-8">

              <Trophy size={18} />

              <span className="font-medium tracking-wide">
                Luxury Developer Collection
              </span>
            </div>

            {/* LOGO */}
            <div className="mb-10">

              <div className="w-36 h-36 rounded-[40px] bg-white shadow-2xl flex items-center justify-center p-6">

                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="max-h-full object-contain"
                />
              </div>
            </div>

            {/* NAME */}
            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight">
              {developer.name}
            </h1>

            {/* TEXT */}
            <p className="mt-6 text-xl text-white/75 max-w-3xl leading-9">
              Explore iconic luxury residences and premium
              investment opportunities crafted by{" "}
              {developer.name}.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-5 mt-10">

              <div className="bg-white text-black px-7 h-14 rounded-2xl flex items-center font-bold shadow-2xl">
                {properties.length} Luxury Projects
              </div>

              <div className="bg-white/10 border border-white/10 backdrop-blur-xl px-7 h-14 rounded-2xl flex items-center gap-3 text-white font-semibold">

                <BadgeCheck size={18} />

                Verified Developer
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-[1500px] mx-auto px-4 py-16">

        <div className="grid lg:grid-cols-[320px_1fr] gap-10">

          {/* SIDEBAR */}
          <aside className="hidden lg:block">

            <div className="sticky top-28 bg-white rounded-[32px] p-7 shadow-xl border border-gray-100">

              {/* HEADER */}
              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">

                  <SlidersHorizontal size={20} />

                  <h3 className="text-2xl font-black">
                    Filters
                  </h3>
                </div>

                <button className="text-sm text-green-700 font-semibold">
                  Reset
                </button>
              </div>

              {/* SEARCH */}
              <div className="relative mb-10">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search project..."
                  className="w-full h-14 rounded-2xl border border-gray-200 pl-12 pr-4 outline-none focus:border-[#1b4332]"
                />
              </div>

              {/* PROPERTY TYPES */}
              <div className="mb-10">

                <div className="flex items-center gap-2 mb-5">
                  <Home size={18} />

                  <h4 className="font-bold text-lg">
                    Property Type
                  </h4>
                </div>

                <div className="space-y-4 text-gray-600">

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Apartments
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Villas
                  </label>

                  <label className="flex items-center gap-3">
                    Penthouse
                  </label>

                  <label className="flex items-center gap-3">
                    Commercial
                  </label>
                </div>
              </div>

              {/* LOCATIONS */}
              <div className="mb-10">

                <div className="flex items-center gap-2 mb-5">
                  <MapPin size={18} />

                  <h4 className="font-bold text-lg">
                    Prime Locations
                  </h4>
                </div>

                <div className="space-y-4 text-gray-600">

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Golf Course Road
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Dwarka Expressway
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Sohna Road
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    New Gurgaon
                  </label>
                </div>
              </div>

              {/* STATUS */}
              <div>

                <div className="flex items-center gap-2 mb-5">
                  <Building2 size={18} />

                  <h4 className="font-bold text-lg">
                    Project Status
                  </h4>
                </div>

                <div className="space-y-4 text-gray-600">

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    New Launch
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Under Construction
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Ready To Move
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <div>

            {/* TOP BAR */}
            <div className="bg-white rounded-[30px] p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-5 md:items-center md:justify-between mb-10">

              <div>

                <h2 className="text-3xl font-black text-[#081c15]">
                  Projects By {developer.name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing {properties.length} premium residences
                </p>
              </div>

              <select className="h-14 px-5 rounded-2xl border border-gray-200 outline-none bg-white">
                <option>Newest First</option>
                <option>Price Low To High</option>
                <option>Price High To Low</option>
              </select>
            </div>

            {/* GRID */}
            {properties.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {properties.map((property) => (
                  <div
                    key={property._id}
                    className="group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500"
                  >

                    {/* IMAGE */}
                    <div className="relative h-[320px] overflow-hidden">

                      <img
                        src={
                          property?.media?.heroImageUrl ||
                          "/placeholder.jpg"
                        }
                        alt={property?.coreDetails?.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />

                      {/* OVERLAY */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                      {/* PRICE */}
                      <div className="absolute top-5 right-5 bg-[#081c15] text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl">
                        ₹{" "}
                        {formatPrice(
                          property?.coreDetails?.startingPrice
                        )}
                      </div>

                      {/* CONTENT */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                        <h3 className="text-2xl font-black leading-tight">
                          {property?.coreDetails?.title}
                        </h3>

                        <div className="flex items-center gap-2 text-white/80 mt-3">

                          <MapPin size={16} />

                          <span className="text-sm">
                            {
                              property?.locationData
                                ?.locationName
                            }
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM */}
                    <div className="p-6">

                      <button className="w-full h-14 rounded-2xl bg-[#081c15] hover:bg-[#1b4332] text-white font-bold flex items-center justify-center gap-3 transition-all duration-300">

                        Explore Property

                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition"
                        />
                      </button>
                    </div>

                    {/* LINK */}
                    <Link
                      href={`/${property.slug}`}
                      className="absolute inset-0 z-10"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[32px] p-20 text-center shadow-xl">

                <h3 className="text-4xl font-black text-[#081c15]">
                  No Projects Found
                </h3>

                <p className="text-gray-500 mt-4 text-lg">
                  This developer has no linked properties yet.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}