"use client";

import { formatPrice } from "@/utils/formatPrice";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

import Link from "next/link";

import Navbar from "@/components/home/Navbar";
import PropertyFilters from "@/utils/PropertyFilters";

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
  const API =
    "https://property-bouquet-backend.onrender.com/api";

  const { slug } = useParams();

  const [developer, setDeveloper] =
    useState(null);

  const [properties, setProperties] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchDeveloper =
      async () => {
        try {
          const res = await fetch(
            `${API}/developers/${slug}`
          );

          const data =
            await res.json();

          if (res.ok) {
            setDeveloper(
              data.developer
            );

            setProperties(
  (data.properties || []).filter((property) => {
    return (
      property?.status === "published" &&
      property?.isDeleted !== true &&
      property?.deletedFromStatus !== "trash"
    );
  })
);
          } else {
            setDeveloper(null);
          }
        } catch (err) {
          console.error(
            "Error fetching developer:",
            err
          );

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
      <section className="relative pt-28 pb-14 overflow-hidden bg-gradient-to-br from-[#081c15] via-[#10281f] to-[#163b2c]">

        {/* DEVELOPER COVER IMAGE */}
        {developer?.image && (
          <img
            src={developer.image}
            alt={developer.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* OVERLAY */}
        <div className="absolute inset-0 bg-black/60" />

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

              <div className="
w-28 h-28 md:w-32 md:h-32
rounded-[32px]
bg-white
shadow-[0_20px_60px_rgba(0,0,0,0.35)]
flex
items-center
justify-center
p-5
border
border-white/30
backdrop-blur-xl
">

                <img
                  src={developer.logo}
                  alt={developer.name}
                  className="max-h-full object-contain"
                />
              </div>
            </div>

            {/* NAME */}
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight">
              {developer.name}
            </h1>

            {/* TEXT */}
           <p className="mt-5 text-lg md:text-xl text-white/75 max-w-3xl leading-8">
              Explore iconic luxury residences and premium
              investment opportunities crafted by{" "}
              {developer.name}.
            </p>

            {/* STATS */}
            <div className="flex flex-wrap gap-4 mt-8">

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

        <div className="grid lg:grid-cols-[400px_1fr] gap-12 items-start">

        <PropertyFilters />

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
                <option>
                  Newest First
                </option>

                <option>
                  Price Low To High
                </option>

                <option>
                  Price High To Low
                </option>
              </select>
            </div>

            {/* GRID */}
            {properties.length > 0 ? (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

                {properties.map(
                  (property) => (
                    <div
                      key={
                        property._id
                      }
                      className="group relative bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500"
                    >

                      {/* IMAGE */}
                      <div className="relative h-[320px] overflow-hidden">

                        <img
                          src={
                            property
                              ?.media
                              ?.heroImageUrl ||
                            "/placeholder.jpg"
                          }
                          alt={
                            property
                              ?.coreDetails
                              ?.title
                          }
                          className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                        />

                        {/* OVERLAY */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />

                        {/* PRICE */}
                        <div className="absolute top-5 right-5 bg-[#081c15] text-white px-5 py-2 rounded-full text-sm font-bold shadow-2xl">
                          ₹{" "}
                          {formatPrice(
                            property
                              ?.coreDetails
                              ?.startingPrice
                          )}
                        </div>

                        {/* CONTENT */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">

                          <h3 className="text-2xl font-black leading-tight">
                            {
                              property
                                ?.coreDetails
                                ?.title
                            }
                          </h3>

                          <div className="flex items-center gap-2 text-white/80 mt-3">

                            <MapPin
                              size={16}
                            />

                            <span className="text-sm">
                              {
                                property
                                  ?.locationData
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
                  )
                )}
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
              {/* ================= ABOUT DEVELOPER ================= */}
      {developer?.description && (
        <section className="w-full px-4 lg:px-10 pt-20 pb-6">

          <div className="bg-white rounded-[36px] p-8 md:p-12 shadow-xl border border-gray-100">

            <div className="flex items-center gap-3 mb-6">

              <div className="h-12 w-12 rounded-2xl bg-[#0f3b2e] text-white flex items-center justify-center">
                <Building2 size={22} />
              </div>

              <div>
                <p className="text-sm font-semibold text-[#0f3b2e] uppercase tracking-widest">
                  About Developer
                </p>

                <h2 className="text-3xl md:text-4xl font-black text-[#081c15]">
                  {developer.name}
                </h2>
              </div>
            </div>

            <div className="h-[2px] w-24 bg-[#d4af37] rounded-full mb-8" />

            <div className="prose prose-lg max-w-none text-gray-700 leading-9">

              <p className="whitespace-pre-line text-[17px] leading-[2.1]">
                {developer.description}
              </p>

            </div>
          </div>
        </section>
      )}
      </section>
    </div>
  );
}