"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Tag, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatPrice } from "@/utils/formatPrice";

export default function CategorySlugPage() {
  const API = "https://property-bouquet-backend.onrender.com/api";

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
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading category...
      </div>
    );
  }

  // ================= NOT FOUND =================
  if (!category) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Category not found ❌
      </div>
    );
  }

  return (
    <div className="bg-[#f5f5f5] min-h-screen">

      {/* ================= HERO ================= */}
      <div className="bg-gradient-to-r from-purple-900 to-indigo-600 text-white py-20">

        <div className="max-w-7xl mx-auto px-6 text-center">

          <div className="flex justify-center mb-6">
            <div className="bg-white p-6 rounded-3xl text-purple-700 shadow-xl">
              <Tag size={40} />
            </div>
          </div>

          <h1 className="text-5xl font-bold capitalize">
            {category.name}
          </h1>

          <p className="mt-4 text-white/80">
            {properties.length} Properties Listed
          </p>

        </div>
      </div>

      {/* ================= LIST ================= */}
      <div className="max-w-7xl mx-auto px-6 py-16">

        {properties.length > 0 ? (
          <div className="grid md:grid-cols-3 gap-8">

            {properties.map((property) => (
              <div
                key={property._id}
                className="bg-white rounded-3xl overflow-hidden shadow hover:-translate-y-1 transition"
              >

                <div className="h-64 overflow-hidden">
                  <img
                    src={property?.media?.heroImageUrl || "/placeholder.jpg"}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                </div>

                <div className="p-6">

                  <h2 className="text-xl font-bold text-gray-800">
                    {property?.coreDetails?.title}
                  </h2>

                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin size={16} />
                    <span>
                      {property?.locationData?.locationName}
                    </span>
                  </div>

                  <p className="mt-3 font-semibold text-green-700">
                    ₹ {formatPrice(property?.coreDetails?.startingPrice)}
                  </p>

                  <Link
                    href={`/${property.slug}`}
                    className="mt-5 inline-flex items-center gap-2 bg-purple-700 text-white px-4 py-2 rounded-lg"
                  >
                    View Property <ArrowRight size={16} />
                  </Link>

                </div>

              </div>
            ))}

          </div>
        ) : (
          <div className="text-center text-gray-500">
            No properties found in this category
          </div>
        )}

      </div>
    </div>
  );
}