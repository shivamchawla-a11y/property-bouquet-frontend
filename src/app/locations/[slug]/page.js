"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MapPin, Building2, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

export default function LocationSlugPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

  const { slug } = useParams();

  const [location, setLocation] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    if (!slug) return;

    const fetchLocation = async () => {
      try {
        const res = await fetch(`${API}/locations/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setLocation(data.location);
          setProperties(data.properties || []);
        } else {
          setLocation(null);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setLocation(null);
      } finally {
        setLoading(false);
      }
    };

    fetchLocation();
  }, [slug]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading location...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!location) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Location not found ❌
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-[#1f3d2b] to-[#c9a64b] text-white py-20">

        <div className="max-w-7xl mx-auto px-6 text-center">

          {/* ICON */}
          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-3xl shadow-2xl text-[#1f3d2b]">
              <MapPin size={40} />
            </div>
          </div>

          {/* NAME */}
          <h1 className="text-6xl font-bold">
            {location.name}
          </h1>

          {/* COUNT */}
          <p className="mt-5 text-xl text-white/90">
            {properties.length} Luxury Projects
          </p>

        </div>
      </div>

      {/* ================= PROJECTS ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="flex items-center gap-3 mb-10">
          <Building2 className="text-[#1f3d2b]" />

          <h2 className="text-4xl font-bold text-[#1f3d2b]">
            Projects in {location.name}
          </h2>
        </div>

        {/* GRID */}
        {properties.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">

            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-3xl overflow-hidden shadow-xl hover:-translate-y-2 transition duration-500"
              >

                {/* IMAGE */}
                <div className="relative h-72 overflow-hidden">

                  <img
                    src={property?.media?.heroImageUrl || "/placeholder.jpg"}
                    alt={property?.coreDetails?.title}
                    className="w-full h-full object-cover"
                  />

                  {/* PRICE */}
                  <div className="absolute top-4 right-4 bg-[#1f3d2b] text-white px-4 py-2 rounded-full text-sm font-semibold shadow-lg">
                    ₹ {formatPrice(property?.coreDetails?.startingPrice)}
                  </div>

                </div>

                {/* CONTENT */}
                <div className="p-6">

                  <h3 className="text-2xl font-bold text-[#1f3d2b]">
                    {property?.coreDetails?.title}
                  </h3>

                  <div className="flex items-center gap-2 text-gray-500 mt-3">
                    <MapPin size={18} />
                    <span>{property?.locationData?.locationName}</span>
                  </div>

                  <Link
                    href={`/${property.slug}`}
                    className="mt-6 bg-[#1f3d2b] text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-[#163021] transition"
                  >
                    View Property
                    <ArrowRight size={18} />
                  </Link>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-xl">
            <h3 className="text-3xl font-bold text-[#1f3d2b]">
              No Projects Found
            </h3>
          </div>
        )}

      </div>
    </div>
  );
}