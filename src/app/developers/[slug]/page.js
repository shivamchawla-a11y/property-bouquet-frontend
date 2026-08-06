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
    "/api";

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
      {/* ================= HERO ================= */}
<section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#06110d]">

  {/* Background Image */}
  {developer?.image && (
    <img
      src={developer.image}
      alt={developer.name}
      className="absolute inset-0 h-full w-full object-cover scale-105"
    />
  )}

  {/* Luxury Overlays */}
  <div className="absolute inset-0 bg-black/55" />
  <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20" />
  <div className="absolute inset-0 bg-gradient-to-t from-[#06110d] via-transparent to-transparent" />

  {/* Luxury Glow */}
  <div className="absolute -top-40 right-[-120px] h-[600px] w-[600px] rounded-full bg-[#D4AF37]/15 blur-[140px]" />
  <div className="absolute -bottom-32 left-[-120px] h-[500px] w-[500px] rounded-full bg-[#D4AF37]/10 blur-[120px]" />

  <div className="relative z-10 mx-auto flex w-full max-w-[1450px] items-center px-6 pt-28 pb-20">

    <div className="max-w-[760px]">

      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-3 text-sm tracking-[0.18em] uppercase text-white/60">

        <Link
          href="/"
          className="hover:text-[#D4AF37] transition"
        >
          Home
        </Link>

        <span>/</span>

        <Link
          href="/developers"
          className="hover:text-[#D4AF37] transition"
        >
          Developers
        </Link>

        <span>/</span>

        <span className="text-[#D4AF37]">
          {developer.name}
        </span>

      </div>

      {/* Premium Badge */}
      <div className="inline-flex items-center gap-3 rounded-full border border-[#D4AF37]/30 bg-white/10 px-6 py-3 backdrop-blur-xl">

        <Trophy
          size={18}
          className="text-[#D4AF37]"
        />

        <span className="text-[13px] font-semibold uppercase tracking-[0.22em] text-[#F3E5AB]">
          Luxury Developer Collection
        </span>

      </div>

      {/* Logo */}
      <div className="mt-10">

        <div
          className="
            relative
            flex
            h-[150px]
            w-[150px]
            items-center
            justify-center
            rounded-[36px]
            border
            border-white/15
            bg-white/95
            backdrop-blur-2xl
            shadow-[0_35px_80px_rgba(0,0,0,0.45)]
          "
        >

          <div className="absolute inset-0 rounded-[36px] border border-[#D4AF37]/25" />

          <img
            src={developer.logo}
            alt={developer.name}
            className="relative z-10 max-h-[95px] max-w-[95px] object-contain"
          />

        </div>

      </div>

      {/* Title */}
      <h1
        className="
          mt-10
          max-w-[900px]
          font-playfair
          text-5xl
          font-semibold
          leading-[1.05]
          text-white
          md:text-7xl
        "
      >
        {developer.name}
      </h1>

      {/* Gold Divider */}
      <div className="mt-8 h-[2px] w-32 rounded-full bg-gradient-to-r from-[#D4AF37] to-transparent" />

      {/* Description */}
      <p
        className="
          mt-8
          max-w-[700px]
          text-[18px]
          leading-9
          text-white/75
        "
      >
        Explore iconic luxury residences, landmark developments,
        and investment opportunities by{" "}
        <span className="font-semibold text-[#F3D98A]">
          {developer.name}
        </span>
        , one of India's trusted names in premium real estate.
      </p>

      {/* Stats */}
      <div className="mt-12 grid gap-5 md:grid-cols-3">

        <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

          <p className="text-4xl font-bold text-[#D4AF37]">
            {properties.length}+
          </p>

          <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
            Luxury Projects
          </p>

        </div>

        <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

          <p className="text-4xl font-bold text-[#D4AF37]">
            Verified
          </p>

          <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
            Developer
          </p>

        </div>

        <div className="rounded-[26px] border border-white/10 bg-white/10 p-6 backdrop-blur-xl">

          <p className="text-4xl font-bold text-[#D4AF37]">
            Premium
          </p>

          <p className="mt-2 text-sm uppercase tracking-[0.15em] text-white/65">
            Collection
          </p>

        </div>

      </div>

      {/* CTA */}
      <div className="mt-12 flex flex-wrap gap-5">

        <a
          href="#projects"
          className="
            inline-flex
            h-[58px]
            items-center
            rounded-2xl
            bg-gradient-to-r
            from-[#D4AF37]
            to-[#B8862E]
            px-9
            text-[15px]
            font-semibold
            text-black
            transition
            hover:scale-105
          "
        >
          Explore Projects
        </a>

        <Link
          href="/contact"
          className="
            inline-flex
            h-[58px]
            items-center
            rounded-2xl
            border
            border-white/20
            bg-white/10
            px-9
            text-[15px]
            font-semibold
            text-white
            backdrop-blur-xl
            transition
            hover:border-[#D4AF37]
            hover:text-[#D4AF37]
          "
        >
          Contact Advisor
        </Link>

      </div>

    </div>

  </div>

  {/* Scroll Indicator */}
  <div className="absolute bottom-10 left-1/2 -translate-x-1/2">

    <div className="flex flex-col items-center gap-3">

      <span className="text-[11px] uppercase tracking-[0.3em] text-white/50">
        Scroll
      </span>

      <div className="flex h-12 w-7 justify-center rounded-full border border-white/30">

        <div className="mt-2 h-2 w-2 animate-bounce rounded-full bg-[#D4AF37]" />

      </div>

    </div>

  </div>

</section>

                {/* ================= ABOUT DEVELOPER ================= */}
      {/* ================= ABOUT DEVELOPER ================= */}
{developer?.description && (
  <section className="relative py-24 bg-[#faf8f3] overflow-hidden">

    {/* Background Glow */}
    <div className="absolute top-0 right-0 w-[450px] h-[450px] rounded-full bg-[#D4AF37]/8 blur-[120px]" />

    <div className="max-w-[1450px] mx-auto px-6 relative z-10">

      <div className="grid lg:grid-cols-[1.4fr_420px] gap-16 items-start">

        {/* LEFT */}
        <div>

          <span
            className="
              inline-flex
              items-center
              rounded-full
              bg-[#0B221B]
              px-5
              py-2
              text-[11px]
              uppercase
              tracking-[0.28em]
              text-[#D4AF37]
            "
          >
            About The Developer
          </span>

          <h2
            className="
              mt-7
              font-playfair
              text-4xl
              md:text-5xl
              text-[#0B221B]
              leading-tight
            "
          >
            {developer.name}
          </h2>

          <div className="mt-6 h-[2px] w-28 bg-[#D4AF37]" />

          <div
            className="
              mt-10
              text-[17px]
              leading-[2.05]
              text-[#4d4d4d]
            "
          >
            <p className="whitespace-pre-line">
              {developer.description}
            </p>
          </div>

        </div>

        {/* RIGHT */}
        <div>

          <div
            className="
              sticky
              top-28
              rounded-[32px]
              border
              border-[#eadfcb]
              bg-white
              p-8
              shadow-[0_20px_70px_rgba(0,0,0,0.06)]
            "
          >

            <div className="flex items-center gap-3">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B221B] text-[#D4AF37]">
                <Building2 size={24} />
              </div>

              <div>

                <p className="text-[11px] uppercase tracking-[0.25em] text-[#B58B2D]">
                  Company Highlights
                </p>

                <h3 className="mt-1 text-2xl font-semibold text-[#0B221B]">
                  Why Choose {developer.name}
                </h3>

              </div>

            </div>

            <div className="mt-8 space-y-5">

              {[
                "Luxury Residential Developments",
                "Premium Construction Quality",
                "Prime Investment Locations",
                "Trusted Developer Reputation",
                "RERA Registered Projects",
                "Customer-Centric Experience",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-4"
                >
                  <div
                    className="
                      mt-1
                      flex
                      h-8
                      w-8
                      items-center
                      justify-center
                      rounded-full
                      bg-[#D4AF37]/15
                    "
                  >
                    <BadgeCheck
                      size={16}
                      className="text-[#B58B2D]"
                    />
                  </div>

                  <p className="text-[15px] leading-7 text-[#555]">
                    {item}
                  </p>

                </div>
              ))}

            </div>

            {/* Bottom Card */}

            <div
              className="
                mt-10
                rounded-2xl
                bg-gradient-to-r
                from-[#0B221B]
                to-[#123126]
                p-6
              "
            >

              <p className="text-[#D4AF37] uppercase tracking-[0.2em] text-[11px]">
                Portfolio
              </p>

              <h4 className="mt-2 text-4xl font-bold text-white">
                {properties.length}+
              </h4>

              <p className="mt-2 text-white/70">
                Signature luxury developments available through Property Bouquet.
              </p>

            </div>

          </div>

        </div>

      </div>

    </div>

  </section>
)}

      {/* MAIN */}
      <section className="max-w-[1500px] mx-auto px-4 py-16">

        <div className="grid xl:grid-cols-[360px_1fr] gap-16 items-start">

        <div
  className="
    sticky
    top-28
    self-start
    rounded-[34px]
    border
    border-[#E8DFC9]
    bg-white
    p-7
    shadow-[0_20px_70px_rgba(0,0,0,0.06)]
  "
>

  <div className="mb-7">

    <p
      className="
        text-[11px]
        uppercase
        tracking-[0.25em]
        text-[#B58B2D]
      "
    >
      Property Search
    </p>

    <h3
      className="
        mt-2
        font-playfair
        text-3xl
        text-[#081c15]
      "
    >
      Refine Results
    </h3>

    <div className="mt-5 h-[2px] w-20 bg-[#D4AF37]" />

  </div>

  <PropertyFilters />

</div>

          {/* RIGHT */}
          <div>

            {/* TOP BAR */}
            {/* ================= PROJECT HEADER ================= */}

<div className="mb-10">

  <span
    className="
      inline-flex
      items-center
      rounded-full
      bg-[#0B221B]
      px-5
      py-2
      text-[11px]
      uppercase
      tracking-[0.25em]
      text-[#D4AF37]
    "
  >
    Exclusive Collection
  </span>

  <div className="mt-6 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">

    <div>

      <h2
        className="
          font-playfair
          text-4xl
          md:text-5xl
          text-[#081c15]
          leading-tight
        "
      >
        Projects by {developer.name}
      </h2>

      <div className="mt-5 h-[2px] w-28 bg-[#D4AF37]" />

      <p
        className="
          mt-6
          max-w-2xl
          text-[17px]
          leading-8
          text-[#666]
        "
      >
        Browse an exclusive portfolio of luxury residences,
        premium apartments and investment opportunities
        developed by {developer.name}.
      </p>

    </div>

    {/* Right Side */}

    <div
      className="
        flex
        flex-wrap
        items-center
        gap-4
      "
    >

      <div
        className="
          rounded-2xl
          border
          border-[#E6DDCC]
          bg-white
          px-7
          py-4
          shadow-sm
        "
      >
        <p className="text-[12px] uppercase tracking-[0.18em] text-[#888]">
          Available Projects
        </p>

        <h3 className="mt-1 text-3xl font-bold text-[#081c15]">
          {properties.length}
        </h3>
      </div>

    </div>

  </div>

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
    
      </section>
    </div>
  );
}