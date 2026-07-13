"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/home/Navbar";

import {
  Tag,
  MapPin,
  ArrowRight,
  Building2,
  Map,
  Home,
  SlidersHorizontal,
  Search,
} from "lucide-react";

import { formatPrice } from "@/utils/formatPrice";

export default function CategorySlugPage() {
  const API = "/api";

  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        const res = await fetch(`${API}/categories/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setCategory(data.category);
          setProperties(data.properties || []);
        } else {
          setCategory(null);
        }
      } catch (err) {
        console.error(err);
        setCategory(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500 text-xl">
        Loading luxury properties...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500 text-2xl font-bold">
        Category not found ❌
      </div>
    );
  }

  return (
    <div className="bg-[#f7f7f7] min-h-screen">

      {/* NAVBAR */}
      <Navbar />

      {/* HERO */}
      <section className="relative pt-36 pb-20 overflow-hidden bg-gradient-to-br from-[#111827] via-[#1e293b] to-[#312e81]">

        <div className="absolute inset-0 bg-black/30" />

        <div className="relative max-w-7xl mx-auto px-4">

          <div className="max-w-4xl">

            <div className="inline-flex items-center gap-3 bg-white/10 border border-white/10 backdrop-blur-xl px-6 py-3 rounded-full text-white mb-8">

              <Tag size={18} />

              <span className="font-medium tracking-wide">
                Luxury Collection
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-black text-white leading-tight capitalize">
              {category.name}
            </h1>

            <p className="mt-6 text-xl text-white/70 max-w-2xl leading-9">
              Discover handpicked luxury residences, premium
              apartments and elite investment opportunities.
            </p>

            <div className="flex flex-wrap items-center gap-5 mt-10">

              <div className="bg-white text-black px-7 h-14 rounded-2xl flex items-center font-bold shadow-2xl">
                {properties.length} Properties
              </div>

              <button className="h-14 px-7 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-xl text-white font-semibold hover:bg-white/20 transition">
                Explore Luxury Homes
              </button>
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

              {/* FILTER HEADER */}
              <div className="flex items-center justify-between mb-8">

                <div className="flex items-center gap-3">

                  <SlidersHorizontal size={20} />

                  <h3 className="text-2xl font-black">
                    Filters
                  </h3>
                </div>

                <button className="text-sm text-red-600 font-semibold">
                  Reset
                </button>
              </div>

              {/* SEARCH */}
              <div className="relative mb-8">

                <Search
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  type="text"
                  placeholder="Search property..."
                  className="w-full h-14 rounded-2xl border border-gray-200 pl-12 pr-4 outline-none focus:border-red-500"
                />
              </div>

              {/* DEVELOPERS */}
              <div className="mb-10">

                <div className="flex items-center gap-2 mb-5">
                  <Building2 size={18} />
                  <h4 className="font-bold text-lg">
                    Developers
                  </h4>
                </div>

                <div className="space-y-4 text-gray-600">

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    DLF
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    M3M
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Smartworld
                  </label>

                  <label className="flex items-center gap-3">
                    <input type="checkbox" />
                    Trump Towers
                  </label>
                </div>
              </div>

              {/* LOCATIONS */}
              <div className="mb-10">

                <div className="flex items-center gap-2 mb-5">
                  <Map size={18} />
                  <h4 className="font-bold text-lg">
                    Locations
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
                </div>
              </div>

              {/* PROPERTY TYPES */}
              <div>

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
                    <input type="checkbox" />
                    Penthouse
                  </label>
                </div>
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <div>

            {/* TOP BAR */}
            <div className="bg-white rounded-[28px] p-6 shadow-lg border border-gray-100 flex flex-col md:flex-row gap-5 md:items-center md:justify-between mb-10">

              <div>
                <h2 className="text-3xl font-black">
                  Premium Properties
                </h2>

                <p className="text-gray-500 mt-2">
                  Showing {properties.length} luxury residences
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
                    className="group bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition duration-500"
                  >

                    {/* IMAGE */}
                    <div className="relative h-[300px] overflow-hidden">

                      <img
                        src={
                          property?.media?.heroImageUrl ||
                          "/placeholder.jpg"
                        }
                        alt=""
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

                      <div className="absolute bottom-6 left-6 right-6 text-white">

                        <div className="inline-flex bg-red-600 px-4 py-2 rounded-full text-sm font-bold mb-4">
                          ₹{" "}
                          {formatPrice(
                            property?.coreDetails?.startingPrice
                          )}
                        </div>

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

                    {/* CONTENT */}
                    <div className="p-6">

                      <button className="w-full h-14 rounded-2xl bg-[#111827] hover:bg-red-600 text-white font-bold flex items-center justify-center gap-3 transition-all duration-300">

                        Explore Property

                        <ArrowRight
                          size={18}
                          className="group-hover:translate-x-1 transition"
                        />
                      </button>

                      <Link
                        href={`/${property.slug}`}
                        className="absolute inset-0 z-10"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[30px] p-16 text-center shadow-lg">

                <h3 className="text-3xl font-black">
                  No Properties Found
                </h3>

                <p className="text-gray-500 mt-4">
                  Try changing filters or check back later.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}