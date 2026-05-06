"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import PropertyPreview from "@/app/admin/add-property/PropertyPreview";


export default function PropertyViewPage() {
  const { slug } = useParams();

  const [property, setProperty] = useState(null);
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(true);

  const API = "https://property-bouquet-backend.onrender.com/api";

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        // 🔥 Fetch property by slug
        const res = await fetch(`${API}/properties/slug/${slug}`);
        const data = await res.json();

        if (res.ok) {
          setProperty(data.data);
        }

        // 🔥 Fetch developers (for name mapping)
        const devRes = await fetch(`${API}/developers`);
        const devData = await devRes.json();

        if (devRes.ok) {
          setDevelopers(devData.data || []);
        }

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading property...
      </div>
    );
  }

  if (!property) {
    return (
      <div className="h-screen flex items-center justify-center text-red-500">
        Property not found
      </div>
    );
  }

  return (
    <div>
      <PropertyPreview form={property} developers={developers} />
    </div>
  );
}