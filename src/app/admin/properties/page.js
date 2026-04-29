"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Trash2,
  Eye,
  RefreshCw,
  RotateCcw,
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [filter, setFilter] = useState("active"); // active | inactive | all

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
        <h1 className="text-2xl font-bold text-primary">
          Properties
        </h1>

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
            onClick={() => router.push("/add-property")}
            className="bg-gold hover:bg-goldLight text-black px-5 py-2 rounded-lg font-semibold shadow-soft"
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
          className="border px-4 py-2 rounded-lg w-1/3 focus:ring-2 focus:ring-primary outline-none"
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 text-gray-600 text-sm">
            <tr>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Market</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Possession</th>
              <th className="p-4 text-left">Created</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="p-6 text-center">
                  Loading...
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((property) => (
                <tr
                  key={property._id}
                  className="border-t hover:bg-gray-50 transition"
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
                    {property.locationData?.address || "N/A"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        property.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {property.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    {property.keyMetrics?.possession || "N/A"}
                  </td>

                  <td className="p-4 text-sm text-gray-500">
                    {new Date(property.createdAt).toLocaleDateString()}
                  </td>

                  <td className="p-4">
                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() =>
                          router.push(`/property/${property.slug}`)
                        }
                        className="p-2 bg-blue-500 text-white rounded-lg"
                      >
                        <Eye size={16} />
                      </button>

                      <button
                        onClick={() =>
                          router.push(`/edit-property/${property._id}`)
                        }
                        className="p-2 bg-primary text-white rounded-lg"
                      >
                        <Pencil size={16} />
                      </button>

                      {property.isActive ? (
                        <button
                          disabled={actionId === property._id}
                          onClick={() =>
                            handleDelete(property._id)
                          }
                          className="p-2 bg-red-500 text-white rounded-lg"
                        >
                          <Trash2 size={16} />
                        </button>
                      ) : (
                        <button
                          disabled={actionId === property._id}
                          onClick={() =>
                            handleRestore(property._id)
                          }
                          className="p-2 bg-green-600 text-white rounded-lg"
                        >
                          <RotateCcw size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="p-8 text-center text-gray-500">
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