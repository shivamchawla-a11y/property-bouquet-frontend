"use client";

import { useState, useEffect } from "react";
import {
  Pencil,
  Eye,
  RefreshCw,
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
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;


  useEffect(() => {
    const u = JSON.parse(localStorage.getItem("user"));
    setUser(u);
  }, []);

  useEffect(() => {
  setCurrentPage(1);
}, [search, filter]);

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

// ================= PAGINATION =================
const totalPages = Math.ceil(
  filtered.length / itemsPerPage
);

const startIndex =
  (currentPage - 1) * itemsPerPage;

const paginatedProperties = filtered.slice(
  startIndex,
  startIndex + itemsPerPage
);

  return (
  <div className="p-4 bg-[#f7f8f7] min-h-screen">

    {/* ================= HEADER ================= */}
    <div className="flex flex-col xl:flex-row xl:justify-between xl:items-center gap-4 mb-6">

      <div>
        <h1 className="text-3xl font-extrabold text-[#0f3b2e] tracking-tight">
          Property Inventory
        </h1>

        <p className="text-gray-600 mt-1 text-xs font-medium">
          Manage live listings, drafts, and property visibility
        </p>
      </div>

      <div className="flex flex-wrap gap-2">

        {/* FILTER TABS */}
        <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">

          <button
            onClick={() => setFilter("active")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              filter === "active"
                ? "bg-[#0f3b2e] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Active
          </button>

          <button
            onClick={() => setFilter("inactive")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              filter === "inactive"
                ? "bg-[#0f3b2e] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Inactive
          </button>

          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              filter === "all"
                ? "bg-[#0f3b2e] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            All
          </button>
        </div>

        {/* REFRESH */}
        <button
          onClick={fetchProperties}
          className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-xl flex items-center gap-2 hover:bg-gray-100 transition text-sm font-semibold shadow-sm"
        >
          <RefreshCw size={14} />
          Refresh
        </button>

        {/* ADD */}
        <button
          onClick={() => router.push("/admin/add-property")}
          className="bg-gradient-to-r from-[#c9a64b] to-[#e0be69] hover:opacity-90 text-black px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition"
        >
          + Add Property
        </button>
      </div>
    </div>

    {/* ================= SEARCH ================= */}
    <div className="mb-4">
      <input
        placeholder="Search by property title..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-[320px] bg-white border border-gray-300 text-sm text-gray-800 placeholder:text-gray-400 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#0f3b2e] outline-none transition shadow-sm"
      />
    </div>

    {/* ================= TABLE ================= */}
    <div className="bg-white rounded-2xl border border-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden">

      <table className="w-full">

        <thead className="bg-[#f5f7f6] text-gray-700 text-[11px] uppercase tracking-wider">
          <tr>
            <th className="p-3 text-left font-bold w-[60px]">
  Sr.
</th>

<th className="p-3 text-left font-bold">
  Title
</th>
            <th className="p-3 text-left font-bold">Market</th>
            <th className="p-3 text-left font-bold">Price</th>
            <th className="p-3 text-left font-bold">Location</th>
            <th className="p-3 text-left font-bold">Status</th>
            <th className="p-3 text-left font-bold">Created</th>
            <th className="p-3 text-right font-bold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan="8"
                className="p-8 text-center text-sm text-gray-600 font-medium"
              >
                Loading properties...
              </td>
            </tr>
          ) : filtered.length > 0 ? (
            paginatedProperties.map((property, index) => (
              <tr
                key={property._id}
                className="border-t border-gray-200 hover:bg-[#f7faf8] transition duration-200"
              >

                <td className="p-3 text-sm font-semibold text-gray-500">
  {startIndex + index + 1}
</td>
                {/* TITLE */}
                <td className="p-3 font-semibold text-sm text-gray-900 max-w-[180px] truncate">
                  {property.coreDetails?.title || "N/A"}
                </td>

                {/* MARKET */}
                <td className="p-3 text-gray-700 text-sm font-medium">
                  {property.marketType || "N/A"}
                </td>

                {/* PRICE */}
                <td className="p-3 text-[#0f3b2e] text-sm font-bold whitespace-nowrap">
                  {property.coreDetails?.startingPrice
                    ? `₹${property.coreDetails.startingPrice}`
                    : property.unitConfigurations?.[0]?.price || "N/A"}
                </td>

                {/* LOCATION */}
                <td className="p-3">
                  <div
                    className="max-w-[130px] truncate cursor-pointer text-sm text-gray-700 font-medium"
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

                {/* STATUS */}
                <td className="p-3">
                  <span
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${
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

                {/* CREATED */}
                <td className="p-3 text-xs text-gray-700 font-medium whitespace-nowrap">
                  {new Date(property.createdAt).toLocaleDateString()}
                </td>

                {/* ACTIONS */}
                <td className="p-3">
                  <div className="flex justify-end gap-2">

                    {/* VIEW */}
                    <button
                      onClick={() =>
                        router.push(`/property/${property.slug}`)
                      }
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition shadow-sm"
                    >
                      <Eye size={14} />
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
                        className="h-9 w-9 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 text-white transition shadow-sm"
                      >
                        <Globe size={14} />
                      </button>
                    )}

                    {/* EDIT */}
                    <button
                      onClick={() =>
                        router.push(
                          `/admin/edit-property/${property._id}`
                        )
                      }
                      className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#0f3b2e] hover:bg-[#145240] text-white transition shadow-sm"
                    >
                      <Pencil size={14} />
                    </button>

                    {/* DELETE / RESTORE */}
                    {property.isActive ? (
                      <button
                        disabled={actionId === property._id}
                        onClick={() =>
                          handleDelete(property._id)
                        }
                        className="h-9 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition whitespace-nowrap"
                      >
                        {actionId === property._id
                          ? "..."
                          : "Draft"}
                      </button>
                    ) : (
                      <button
                        disabled={actionId === property._id}
                        onClick={() =>
                          handleRestore(property._id)
                        }
                        className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm whitespace-nowrap"
                      >
                        {actionId === property._id
                          ? "..."
                          : "Live"}
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan="8"
                className="p-8 text-center text-sm text-gray-500 font-medium"
              >
                No properties found
              </td>
            </tr>
          )}
        </tbody>

      </table>

      {/* ================= PAGINATION ================= */}
{totalPages > 1 && (
  <div className="flex items-center justify-between px-4 py-4 border-t border-gray-200 bg-white">

    <p className="text-sm text-gray-600 font-medium">
      Showing{" "}
      <span className="font-bold">
        {startIndex + 1}
      </span>{" "}
      to{" "}
      <span className="font-bold">
        {Math.min(
          startIndex + itemsPerPage,
          filtered.length
        )}
      </span>{" "}
      of{" "}
      <span className="font-bold">
        {filtered.length}
      </span>{" "}
      properties
    </p>

    <div className="flex items-center gap-2">

      {/* PREV */}
      <button
        disabled={currentPage === 1}
        onClick={() =>
          setCurrentPage((prev) => prev - 1)
        }
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
          currentPage === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
        }`}
      >
        Prev
      </button>

      {/* PAGE NUMBERS */}
      {Array.from(
  {
    length: Math.min(totalPages, 5),
  },
  (_, i) => {
    let page;

    if (currentPage <= 3) {
      page = i + 1;
    } else if (
      currentPage >=
      totalPages - 2
    ) {
      page =
        totalPages - 4 + i;
    } else {
      page = currentPage - 2 + i;
    }

    return page;
  }
).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
            currentPage === page
              ? "bg-[#0f3b2e] text-white"
              : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
          }`}
        >
          {page}
        </button>
      ))}

      {/* NEXT */}
      <button
        disabled={currentPage === totalPages}
        onClick={() =>
          setCurrentPage((prev) => prev + 1)
        }
        className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
          currentPage === totalPages
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
        }`}
      >
        Next
      </button>
    </div>
  </div>
)}
    </div>
  </div>
);
}