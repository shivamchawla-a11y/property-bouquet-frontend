"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  RotateCcw,
  Globe,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("active"); // active | inactive | all
  const [user, setUser] = useState(null);

useEffect(() => {
  const u = JSON.parse(localStorage.getItem("user"));
  setUser(u);
}, []);

  const router = useRouter();

  // ================= FETCH =================
  const fetchProperties = async () => {
    try {
      setLoading(true);

      const query =
        filter === "all"
          ? "?all=true"
          : filter === "inactive"
          ? "?inactive=true"
          : "";

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/properties${query}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties(data.data || []);
      } else {
        alert(data.message || "Failed to fetch properties");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [filter]);

  // ================= SOFT DELETE =================
  const handleDelete = async (id) => {
    if (!confirm("Deactivate this property?")) return;

    try {
      setActionId(id);

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/properties/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isActive: false } : item
          )
        );
      } else {
        alert(data.message || "Delete failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ================= RESTORE =================
  const handleRestore = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/properties/${id}/restore`,
        {
          method: "PATCH",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, isActive: true } : item
          )
        );
      } else {
        alert(data.message || "Restore failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };


  // ================= FILTER =================
  const filtered = properties.filter((p) =>
    p?.coreDetails?.title
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">

      {/* ================= HEADER ================= */}
      <div className="flex justify-between items-center mb-6">
        <div>
  <h1 className="text-3xl font-bold text-[#0f3b2e]">
    Property Inventory
  </h1>

  <p className="text-gray-500 mt-1 text-sm">
    Manage live listings, drafts, and property visibility
  </p>
</div>

        <div className="flex gap-3">

          {/* FILTER TABS */}
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setFilter("active")}
              className={`px-4 py-2 ${
                filter === "active"
                  ? "bg-primary text-white"
                  : "bg-white"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setFilter("inactive")}
              className={`px-4 py-2 ${
                filter === "inactive"
                  ? "bg-primary text-white"
                  : "bg-white"
              }`}
            >
              Inactive
            </button>

            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 ${
                filter === "all"
                  ? "bg-primary text-white"
                  : "bg-white"
              }`}
            >
              All
            </button>
          </div>

          {/* REFRESH */}
          <button
            onClick={fetchProperties}
            className="px-4 py-2 border rounded-lg flex items-center gap-2"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          {/* ADD */}
          <button
            onClick={() => router.push("/admin/add-property")}
            className="bg-gradient-to-r from-[#c9a64b] to-[#e0be69] hover:opacity-90 text-black px-6 py-3 rounded-2xl font-bold shadow-lg transition"
          >
            + Add Property
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-5">
        <input
          placeholder="Search by property title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[340px] bg-gray-50 border border-gray-200 px-5 py-3 rounded-2xl focus:ring-2 focus:ring-[#0f3b2e] outline-none transition"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_10px_40px_rgba(0,0,0,0.06)] overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-[#f8faf9] text-gray-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Market</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((property) => (
                <tr
                  key={property._id}
                  className="border-t border-gray-100 hover:bg-[#fafdfb] transition duration-200"
                >
                  <td className="p-4 font-semibold">
                    {property.coreDetails?.title || "N/A"}
                  </td>

                  <td className="p-4">
                    {property.marketType || "N/A"}
                  </td>

                  <td className="p-4 text-primary font-semibold">
                    {property.coreDetails?.startingPrice
                      ? `₹${property.coreDetails.startingPrice}`
                      : property.unitConfigurations?.[0]?.price || "N/A"}
                  </td>

                  <td className="p-4">
  <div
    className="max-w-[140px] truncate cursor-pointer"
    title={
      property.locationData?.locationName ||
      property.locationData?.customLocation ||
      property.locationData?.address ||
      "N/A"
    }
  >
    {property.locationData?.locationName
      ?.split(">")[0]
      ?.trim() ||
      property.locationData?.customLocation ||
      property.locationData?.address ||
      "N/A"}
  </div>
</td>

                  <td className="p-4">
                    <span
  className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide ${
    property.isActive
      ? "bg-emerald-100 text-emerald-700"
      : "bg-amber-100 text-amber-700"
  }`}
>
  <span
    className={`w-2 h-2 rounded-full ${
      property.isActive
        ? "bg-emerald-500"
        : "bg-amber-500"
    }`}
  />

  {property.isActive ? "LIVE" : "DRAFT"}
</span>
                  </td>


                  <td className="p-4 text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">

  {/* VIEW */}
  <button
    onClick={() =>
      router.push(`/property/${property.slug}`)
    }
    className="h-11 w-11 flex items-center justify-center rounded-xl bg-blue-500 hover:bg-blue-600 text-white transition shadow-md"
  >
    <Eye size={16} />
  </button>

  {/* LIVE WEBSITE */}
{property.isActive && (
  <button
    onClick={() =>
      window.open(
        `/${property.slug}`,
        "_blank"
      )
    }
    className="h-11 w-11 flex items-center justify-center rounded-xl bg-black hover:bg-gray-800 text-white transition shadow-md"
  >
    <Globe size={16} />
  </button>
)}

  {/* EDIT */}
  <button
    onClick={() =>
      router.push(`/admin/edit-property/${property._id}`)
    }
    className="h-11 w-11 flex items-center justify-center rounded-xl bg-[#0f3b2e] hover:bg-[#145240] text-white transition shadow-md"
  >
    <Pencil size={16} />
  </button>

  {/* DELETE / RESTORE */}
{property.isActive ? (
  <button
    disabled={actionId === property._id}
    onClick={() =>
      handleDelete(property._id)
    }
    className="h-11 px-4 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-sm font-semibold transition whitespace-nowrap"
  >
    {actionId === property._id
      ? "Processing..."
      : "📥 Move to Draft"}
  </button>
) : (
  <button
    disabled={actionId === property._id}
    onClick={() =>
      handleRestore(property._id)
    }
    className="h-11 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition shadow-md whitespace-nowrap"
  >
    {actionId === property._id
      ? "Processing..."
      : "🚀 Go Live"}
  </button>
)}
</div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-8 text-center text-gray-500">
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}