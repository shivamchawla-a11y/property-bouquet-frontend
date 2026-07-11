"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/utils/formatPrice";
import {
  Pencil,
  Eye,
  RefreshCw,
  Globe,
  Star,
  TrendingUp,
  Sparkles,
  BadgeCheck,
  Tag,
  X,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";

const API_URL =
  "https://property-bouquet-backend.onrender.com/api/properties";

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
    const [sortBy, setSortBy] = useState("newest");
    const [developerFilter, setDeveloperFilter] = useState("All");
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  const [filter, setFilter] = useState("all"); // active | inactive | all

  // 🔥 TAG FILTER
  const [tagFilter, setTagFilter] = useState("All");

  // 🔥 FEATURE MODAL
  const [featureModal, setFeatureModal] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [seoFilter, setSeoFilter] = useState("All");


  const router = useRouter();

useEffect(() => {
  setCurrentPage(1);
}, [
  search,
  filter,
  tagFilter,
  developerFilter,
  seoFilter,
  itemsPerPage,
  sortBy,
]);

  // ================= FETCH =================
  const fetchProperties = async () => {
  try {
    setLoading(true);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/properties?all=true",
      {
        credentials: "include",
        cache: "no-store",
      }
    );

    const data = await res.json();

    if (res.ok) {
      setProperties(data.data || []);
    }
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
  fetchProperties();
}, []);

  // ================= FEATURE UPDATE =================
  const updatePropertyTag = async (id, tag) => {
    try {
      setActionId(id);

      const res = await fetch(
        `https://property-bouquet-backend.onrender.com/api/properties/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            propertyTag: tag,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === id
              ? { ...item, propertyTag: tag }
              : item
          )
        );

        setFeatureModal(null);
      } else {
        alert(data.message || "Update failed ❌");
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

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
            item._id === id ? { ...item, status: "draft" } : item
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

    const hasCustomSEO = (property) => {
  const seo = property?.seoEngine;

  if (!seo) return false;

  return (
    (seo.metaTitle?.trim()?.length ?? 0) > 0 ||
    (seo.metaDescription?.trim()?.length ?? 0) > 0 ||
    (Array.isArray(seo.keywords) &&
      seo.keywords.filter(k => k?.trim()).length > 0)
  );
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
            item._id === id
              ? { ...item, status: "published" }
              : item
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

// ================= FILTER + SORT =================
const filtered = properties
  .filter((p) => {

    const titleMatch =
      (p?.coreDetails?.title || "")
        .toLowerCase()
        .includes(search.toLowerCase());

    const tagMatch =
      tagFilter === "All" ||
      (p.propertyTag || "Normal") === tagFilter;

    const statusMatch =
      filter === "all"
        ? !p.isDeleted
        : filter === "trash"
        ? p.isDeleted
        : p.status === filter &&
          !p.isDeleted;

           // ✅ DEVELOPER FILTER
  const propertyDeveloperId =
    typeof p?.coreDetails?.developerRef === "object"
      ? p?.coreDetails?.developerRef?._id
      : p?.coreDetails?.developerRef;

  const developerMatch =
    developerFilter === "All" ||
    propertyDeveloperId === developerFilter ||
    p?.developerRef === developerFilter;

    const seoMatch =
  seoFilter === "All"
    ? true
    : seoFilter === "Custom"
    ? hasCustomSEO(p)
    : !hasCustomSEO(p);

return (
  titleMatch &&
  tagMatch &&
  statusMatch &&
  developerMatch &&
  seoMatch
);
  })
  .sort((a, b) => {

    switch (sortBy) {

      case "newest":
        return (
          new Date(b.createdAt) -
          new Date(a.createdAt)
        );

      case "oldest":
        return (
          new Date(a.createdAt) -
          new Date(b.createdAt)
        );

      case "name_asc":
        return (
          a?.coreDetails?.title || ""
        ).localeCompare(
          b?.coreDetails?.title || ""
        );

      case "name_desc":
        return (
          b?.coreDetails?.title || ""
        ).localeCompare(
          a?.coreDetails?.title || ""
        );

      case "published":
        return (
          b.status === "published"
        ) - (
          a.status === "published"
        );

      case "draft":
        return (
          b.status === "draft"
        ) - (
          a.status === "draft"
        );

      case "featured":
        return (
          (b.propertyTag === "Featured") -
          (a.propertyTag === "Featured")
        );

      default:
        return 0;
    }
  });

  // ================= PAGINATION =================
  const totalPages = Math.max(
  1,
  Math.ceil(filtered.length / itemsPerPage)
);

  const startIndex =
    (currentPage - 1) * itemsPerPage;

  const paginatedProperties = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // ================= TAG BADGE =================
  const tagStyle = (tag) => {
  switch (tag) {
    case "Featured":
      return "bg-yellow-50 text-yellow-700 border border-yellow-200";

    case "Recommended":
      return "bg-blue-50 text-blue-700 border border-blue-200";

    case "Trending":
      return "bg-pink-50 text-pink-700 border border-pink-200";

    case "New":
      return "bg-emerald-50 text-emerald-700 border border-emerald-200";

    default:
      return "bg-gray-50 text-gray-700 border border-gray-200";
  }
};

const moveToTrash = async (id) => {
  try {

    const res = await fetch(
      `${API_URL}/${id}/trash`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (res.ok) {

      setProperties((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isDeleted: true,
              }
            : item
        )
      );

    }

  } catch (err) {
    console.error(err);
  }
};

const restoreTrash = async (id) => {
  try {

    const res = await fetch(
      `${API_URL}/${id}/restore-trash`,
      {
        method: "PATCH",
        credentials: "include",
      }
    );

    if (res.ok) {

      setProperties((prev) =>
        prev.map((item) =>
          item._id === id
            ? {
                ...item,
                isDeleted: false,
              }
            : item
        )
      );

    }

  } catch (err) {
    console.error(err);
  }
};

const permanentDelete = async (id) => {

  if (
    !confirm(
      "Delete permanently?"
    )
  )
    return;

  try {

    const res = await fetch(
      `${API_URL}/${id}/permanent-delete`,
      {
        method: "DELETE",
        credentials: "include",
      }
    );

    if (res.ok) {

      setProperties((prev) =>
        prev.filter(
          (item) => item._id !== id
        )
      );

    }

  } catch (err) {
    console.error(err);
  }
};
const developerOptions = [
  {
    label: "All Developers",
    value: "All",
  },

  ...Array.from(
    new Map(
      properties
        .filter(
          (p) =>
            p?.coreDetails?.developerRef ||
            p?.developerRef
        )
        .map((p) => {
          const developerId =
            p?.coreDetails?.developerRef?._id ||
            p?.coreDetails?.developerRef ||
            p?.developerRef;

          const developerName =
            p?.coreDetails?.developerName ||
            `Developer ${String(developerId).slice(-6)}`;

          return [
            developerId,
            {
              label: developerName,
              value: developerId,
            },
          ];
        })
    ).values()
  ),
];

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
  onClick={() => setFilter("all")}
  className={`px-4 py-2 text-sm font-semibold transition ${
    filter === "all"
      ? "bg-[#0f3b2e] text-white"
      : "bg-white text-gray-700 hover:bg-gray-100"
  }`}
>
  All
          </button>

          <button
            onClick={() => setFilter("published")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              filter === "published"
                ? "bg-[#0f3b2e] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Live
          </button>

          <button
            onClick={() => setFilter("draft")}
            className={`px-4 py-2 text-sm font-semibold transition ${
              filter === "draft"
                ? "bg-[#0f3b2e] text-white"
                : "bg-white text-gray-700 hover:bg-gray-100"
            }`}
          >
            Draft
          </button>

          <button
  onClick={() => setFilter("trash")}
  className={`px-4 py-2 text-sm font-semibold transition ${
    filter === "trash"
      ? "bg-red-600 text-white"
      : "bg-white text-gray-700 hover:bg-gray-100"
  }`}
>
  Trash
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

      {/* ================= SEARCH + TAG FILTER ================= */}
      <div className="mb-4">

            {/* COUNTERS */}
 <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 mb-4">

  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-gray-500 font-medium">
      Total Properties
    </p>

    <h3 className="text-2xl font-bold text-[#0f3b2e] mt-1">
      {properties.length}
    </h3>
  </div>

  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-emerald-700 font-medium">
      Live Properties
    </p>

    <h3 className="text-2xl font-bold text-emerald-700 mt-1">
      {
  properties.filter(
    (p) =>
      p.status === "published" &&
      !p.isDeleted
  ).length
}
    </h3>
  </div>

  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
    <p className="text-xs text-amber-700 font-medium">
      Draft Properties
    </p>

    <h3 className="text-2xl font-bold text-amber-700 mt-1">
      {
  properties.filter(
    (p) =>
      p.status === "draft" &&
      !p.isDeleted
  ).length
}
    </h3>
  </div>
  <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">
  <p className="text-xs text-red-700 font-medium">
    Trash Properties
  </p>

  <h3 className="text-2xl font-bold text-red-700 mt-1">
    {
      properties.filter(
  (p) => p.isDeleted
).length
    }
  </h3>
</div>

</div>

        <div className="flex flex-col xl:flex-row gap-3">

  <input
  placeholder="Search properties..."
  value={search}
  onChange={(e) =>
    setSearch(e.target.value)
  }
  className="
    flex-1
    px-4
    py-3
    rounded-xl
    border
    border-gray-200
    bg-white
    text-gray-900
    placeholder:text-gray-400
    text-sm
    font-medium
    outline-none
    focus:ring-2
    focus:ring-[#0f3b2e]/20
    focus:border-[#0f3b2e]
  "
/>
{/* SORT BY */}
<div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 min-w-[230px]">
  <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
    Sort By
  </span>

  <select
  value={sortBy}
  onChange={(e) => setSortBy(e.target.value)}
  className="
    bg-white
    border
    border-gray-200
    rounded-xl
    px-4
    py-3
    text-sm
    font-medium
    text-gray-700
    min-w-[220px]
    shadow-sm
    outline-none
  "
>
  <option value="newest">Sort: Newest First</option>
  <option value="oldest">Sort: Oldest First</option>
  <option value="name_asc">Sort: Name A → Z</option>
  <option value="name_desc">Sort: Name Z → A</option>
  <option value="published">Sort: Published First</option>
  <option value="draft">Sort: Draft First</option>
  <option value="featured">Sort: Featured First</option>
</select>
</div>

        {/* TAG FILTER */}
        <select
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          className="bg-white border border-gray-300 text-sm text-gray-800 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#0f3b2e] outline-none transition shadow-sm"
        >
          <option value="All">All Tags</option>
          <option value="Featured">Featured</option>
          <option value="Recommended">Recommended</option>
          <option value="Trending">Trending</option>
          <option value="New">New</option>
          <option value="Normal">Normal</option>
        </select>

        {/* DEVELOPER FILTER */}
<select
  value={developerFilter}
  onChange={(e) =>
    setDeveloperFilter(e.target.value)
  }
  className="
    bg-white
    border
    border-gray-300
    text-sm
    text-gray-800
    px-4
    py-2.5
    rounded-xl
    focus:ring-2
    focus:ring-[#0f3b2e]
    outline-none
    transition
    shadow-sm
    min-w-[220px]
  "
>
  <option value="All">
    All Developers
  </option>

  {developerOptions.map((dev) => (
    <option
  key={dev.value}
  value={dev.value}
>
  {dev.label}
</option>
  ))}
</select>

<select
  value={seoFilter}
  onChange={(e) => setSeoFilter(e.target.value)}
  className="
    bg-white
    border
    border-gray-300
    text-sm
    text-gray-800
    px-4
    py-2.5
    rounded-xl
    focus:ring-2
    focus:ring-[#0f3b2e]
    outline-none
    transition
    shadow-sm
    min-w-[170px]
  "
>
  <option value="All">All SEO</option>
  <option value="Custom">Custom SEO</option>
  <option value="Auto">Auto SEO</option>
</select>

      </div>

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

              <th className="p-3 text-left font-bold">
                Price
              </th>

              <th className="p-3 text-left font-bold">
                Location
              </th>

              {/* NEW COLUMN */}
              <th className="p-3 text-left font-bold">
                Tag
              </th>

              <th className="p-3 text-left font-bold">
                Status
              </th>

              <th className="p-3 text-left font-bold">
                SEO
              </th>

              <th className="p-3 text-left font-bold">
                Created
              </th>

              <th className="p-3 text-right font-bold">
                Actions
              </th>

            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan="9"
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

                  {/* PRICE */}
<td className="p-3 text-[#0f3b2e] text-sm font-bold whitespace-nowrap">
  {property.coreDetails?.startingPrice ? (
    <>₹{formatPrice(property.coreDetails.startingPrice)}</>
  ) : property.unitConfigurations?.[0]?.price ? (
    <>₹{formatPrice(property.unitConfigurations[0].price)}</>
  ) : (
    "N/A"
  )}
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

                  {/* TAG */}
                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-[10px] font-bold inline-flex items-center ${tagStyle(
                      property.propertyTag || "Normal"
                    )}`}
                    >
                      {property.propertyTag || "Normal"}
                    </span>
                  </td>

                  {/* STATUS */}
<td className="p-3">

  {property.isDeleted ? (

    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
      TRASH
    </span>

  ) : property.status === "draft" ? (

    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
      DRAFT
    </span>

  ) : (

    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
      LIVE
    </span>

  )}

</td>

<td className="p-3">
  {hasCustomSEO(property) ? (
    <div
      className="flex items-center gap-2"
      title="Custom SEO"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
      <span className="text-xs font-semibold text-emerald-700">
        Custom
      </span>
    </div>
  ) : (
    <div
      className="flex items-center gap-2"
      title="Auto Generated SEO"
    >
      <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
      <span className="text-xs font-semibold text-red-700">
        Auto
      </span>
    </div>
  )}
</td>
{/* CREATED */}
<td className="p-3 text-xs text-gray-700 font-medium whitespace-nowrap">
  {new Date(property.createdAt).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  )}
</td>

{/* ACTIONS */}
<td className="p-3">

  <div className="flex justify-end gap-2 flex-wrap">

    {!property.isDeleted && (
      <>
        {/* VIEW */}
        <button
          onClick={() =>
            window.open(
              `/admin/preview/${property.slug}`,
              "_blank"
            )
          }
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition shadow-sm"
        >
          <Eye size={14} />
        </button>

        {/* WEBSITE */}
        {property.status !== "draft" && (
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

        {/* TAG */}
        <button
          onClick={() =>
            setFeatureModal(property)
          }
          className="h-9 w-9 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition shadow-sm"
        >
          <Star size={14} />
        </button>

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

        {/* LIVE / DRAFT */}
        {property.status === "published" ? (
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

        {/* MOVE TO TRASH */}
<button
  onClick={() =>
    moveToTrash(property._id)
  }
  className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 text-white transition shadow-sm"
  title="Move to Trash"
>
  <Trash2 size={15} />
</button>
      </>
    )}

    {property.isDeleted && (
      <>
        {/* RESTORE */}
        <button
          onClick={() =>
            restoreTrash(property._id)
          }
          className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
        >
          Restore
        </button>

        {/* DELETE FOREVER */}
        <button
          onClick={() =>
            permanentDelete(property._id)
          }
          className="h-9 px-3 rounded-lg bg-red-600 hover:bg-red-700 text-white text-xs font-semibold"
        >
          Delete Forever
        </button>
      </>
    )}

  </div>

</td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="9"
                  className="p-8 text-center text-sm text-gray-500 font-medium"
                >
                  No properties found
                </td>
              </tr>
            )}
          </tbody>
        </table>

{/* ================= PAGINATION ================= */}
<div className="flex items-center justify-between p-4 border-t border-gray-200 flex-wrap gap-4">

  {/* LEFT */}
  <div className="flex items-center gap-4 flex-wrap">

    <p className="text-sm text-gray-600 font-medium">
      Showing{" "}
      <span className="font-bold">
        {filtered.length === 0 ? 0 : startIndex + 1}
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

    {/* ITEMS PER PAGE */}
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600 font-medium">
        Show:
      </span>

      <select
        value={itemsPerPage}
        onChange={(e) => {
          setItemsPerPage(Number(e.target.value));
          setCurrentPage(1);
        }}
        className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white text-gray-800 min-w-[80px] focus:outline-none focus:ring-2 focus:ring-[#0f3b2e]"
      >
        <option value={10}>10</option>
        <option value={25}>25</option>
        <option value={50}>50</option>
        <option value={100}>100</option>
      </select>
    </div>

  </div>

  {/* RIGHT */}
  <div className="flex items-center gap-2 flex-wrap">

    {totalPages > 1 && (
      <>
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
            let startPage = 1;

            if (totalPages <= 5) {
              startPage = 1;
            } else if (currentPage <= 3) {
              startPage = 1;
            } else if (
              currentPage >= totalPages - 2
            ) {
              startPage = totalPages - 4;
            } else {
              startPage = currentPage - 2;
            }

            return startPage + i;
          }
        ).map((page) => (
          <button
            key={page}
            onClick={() =>
              setCurrentPage(page)
            }
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
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              (prev) => prev + 1
            )
          }
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            currentPage === totalPages
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white border border-gray-300 hover:bg-gray-100 text-gray-700"
          }`}
        >
          Next
        </button>
      </>
    )}

  </div>

</div>
      </div>

      {/* ================= FEATURE MODAL ================= */}
      {featureModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">

          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden">

            {/* HEADER */}
            <div className="flex items-center justify-between px-6 py-5 border-b">

              <div>
                <h2 className="text-xl font-bold text-[#0f3b2e]">
                  Property Tag
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Select a tag for this property
                </p>
              </div>

              <button
                onClick={() => setFeatureModal(null)}
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>

            </div>

            {/* BODY */}
            <div className="p-6 grid grid-cols-2 gap-4">

              {/* FEATURED */}
              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id,
                    "Featured"
                  )
                }
                className="h-24 rounded-2xl bg-yellow-50 hover:bg-yellow-100 border border-yellow-200 flex flex-col items-center justify-center transition"
              >
                <Star className="text-yellow-600 mb-2" />
                <span className="font-semibold text-yellow-700">
                  Featured
                </span>
              </button>

              {/* RECOMMENDED */}
              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id,
                    "Recommended"
                  )
                }
                className="h-24 rounded-2xl bg-blue-50 hover:bg-blue-100 border border-blue-200 flex flex-col items-center justify-center transition"
              >
                <BadgeCheck className="text-blue-600 mb-2" />
                <span className="font-semibold text-blue-700">
                  Recommended
                </span>
              </button>

              {/* TRENDING */}
              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id,
                    "Trending"
                  )
                }
                className="h-24 rounded-2xl bg-pink-50 hover:bg-pink-100 border border-pink-200 flex flex-col items-center justify-center transition"
              >
                <TrendingUp className="text-pink-600 mb-2" />
                <span className="font-semibold text-pink-700">
                  Trending
                </span>
              </button>

              {/* NEW */}
              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id,
                    "New"
                  )
                }
                className="h-24 rounded-2xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 flex flex-col items-center justify-center transition"
              >
                <Sparkles className="text-emerald-600 mb-2" />
                <span className="font-semibold text-emerald-700">
                  New
                </span>
              </button>

              {/* NORMAL */}
              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id,
                    "Normal"
                  )
                }
                className="col-span-2 h-20 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 flex items-center justify-center gap-3 transition"
              >
                <Tag className="text-gray-700" />

                <span className="font-semibold text-gray-700">
                  Normal Property
                </span>
              </button>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}