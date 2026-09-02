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

const API_URL = "/api/properties";

export default function PropertiesPage() {
  const router = useRouter();

  // ============================================================
  // USER / ROLE
  // ============================================================

  const [user, setUser] = useState(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // ============================================================
  // FILTER / SEARCH
  // ============================================================

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [developerFilter, setDeveloperFilter] = useState("All");

  const [filter, setFilter] = useState("all");
  const [selectedTags, setSelectedTags] = useState([]);

  const [tagFilter, setTagFilter] = useState("All");
  const [seoFilter, setSeoFilter] = useState("All");

  // ============================================================
  // PROPERTY DATA
  // ============================================================

  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // ============================================================
  // FEATURE / TAG MODAL
  // ============================================================

  const [featureModal, setFeatureModal] = useState(null);

  // ============================================================
  // PAGINATION
  // ============================================================

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // ============================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ============================================================

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

  // ============================================================
  // FETCH USER + PROPERTIES
  // ============================================================

  const fetchProperties = async () => {
    try {
      setLoading(true);

      // ========================================================
      // GET CURRENT USER
      // ========================================================

      const userRes = await fetch("/api/auth/me", {
        credentials: "include",
        cache: "no-store",
      });

      const userData = await userRes.json();

      if (!userRes.ok || !userData?.user) {
        router.push("/login");
        return;
      }

      const currentUser = userData.user;

      setUser(currentUser);

      const superAdmin =
        currentUser?.role === "SuperAdmin";

      setIsSuperAdmin(superAdmin);

      // ========================================================
      // IMPORTANT:
      // AGENT AND SUPERADMIN BOTH FETCH NORMAL INVENTORY.
      //
      // Trash records may come from the API, but:
      // - SuperAdmin can access them
      // - Agent cannot see them because of frontend filtering
      // ========================================================

      const res = await fetch(
        "/api/properties?all=true",
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties(data.data || []);
      } else {
        console.error(
          data?.message ||
            "Failed to fetch properties"
        );
      }
    } catch (err) {
      console.error(
        "Property inventory error:",
        err
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, []);

  // ============================================================
  // SAFETY:
  // AGENT CAN NEVER REMAIN ON TRASH FILTER
  // ============================================================

  useEffect(() => {
    if (!isSuperAdmin && filter === "trash") {
      setFilter("all");
    }
  }, [isSuperAdmin, filter]);

  // ============================================================
  // FEATURE / TAG UPDATE
  // ============================================================

  const updatePropertyTag = async (id) => {
    try {
      setActionId(id);

      const tags =
        selectedTags.length > 0
          ? selectedTags
          : ["Normal"];

      const res = await fetch(
        `/api/properties/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            propertyTag: tags,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  propertyTag: tags,
                }
              : item
          )
        );

        setFeatureModal(null);
        setSelectedTags([]);
      } else {
        alert(
          data?.message ||
            "Update failed ❌"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // SOFT DELETE
  //
  // LIVE → DRAFT
  //
  // AGENT: ALLOWED
  // SUPERADMIN: ALLOWED
  //
  // This does NOT move the property to Trash.
  // ============================================================

  const handleDelete = async (id) => {
    if (
      !confirm(
        "Deactivate this property and move it to Draft?"
      )
    ) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `/api/properties/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status: "draft",
                }
              : item
          )
        );
      } else {
        alert(
          data?.message ||
            "Deactivate failed ❌"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // SEO CHECK
  // ============================================================

  const hasCustomSEO = (property) => {
    const seo = property?.seoEngine;

    if (!seo) return false;

    return (
      (seo.metaTitle?.trim()?.length ?? 0) >
        0 ||
      (seo.metaDescription?.trim()?.length ??
        0) > 0 ||
      (Array.isArray(seo.keywords) &&
        seo.keywords.filter(
          (k) => k?.trim()
        ).length > 0)
    );
  };

  // ============================================================
  // DRAFT → LIVE
  //
  // AGENT: ALLOWED
  // SUPERADMIN: ALLOWED
  // ============================================================

  const handleRestore = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(
        `/api/properties/${id}/restore`,
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
              ? {
                  ...item,
                  status: "published",
                  isDeleted: false,
                }
              : item
          )
        );
      } else {
        alert(
          data?.message ||
            "Restore failed ❌"
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // MOVE TO TRASH
  //
  // AGENT: ALLOWED
  // SUPERADMIN: ALLOWED
  //
  // IMPORTANT:
  // Agent can move LIVE or DRAFT → TRASH.
  // Agent cannot access Trash afterward.
  // ============================================================

  const moveToTrash = async (id) => {
    if (!user) return;

    if (
      user.role !== "Agent" &&
      user.role !== "SuperAdmin"
    ) {
      alert(
        "You are not authorized to move properties to Trash."
      );
      return;
    }

    if (
      !confirm(
        "Move this property to Trash?"
      )
    ) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/${id}/trash`,
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
              ? {
                  ...item,
                  isDeleted: true,
                }
              : item
          )
        );
      } else {
        alert(
          data?.message ||
            "Failed to move property to Trash."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // RESTORE FROM TRASH
  //
  // SUPERADMIN ONLY
  // ============================================================

  const restoreTrash = async (id) => {
    if (!isSuperAdmin) {
      alert(
        "Only SuperAdmin can restore properties from Trash."
      );
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/${id}/restore-trash`,
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
              ? {
                  ...item,
                  isDeleted: false,
                  status:
                    item.status === "published"
                      ? "published"
                      : "draft",
                }
              : item
          )
        );
      } else {
        alert(
          data?.message ||
            "Failed to restore property."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // PERMANENT DELETE
  //
  // SUPERADMIN ONLY
  // ============================================================

  const permanentDelete = async (id) => {
    if (!isSuperAdmin) {
      alert(
        "Only SuperAdmin can permanently delete properties."
      );
      return;
    }

    if (
      !confirm(
        "This will permanently delete the property and cannot be undone. Continue?"
      )
    ) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/${id}/permanent-delete`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setProperties((prev) =>
          prev.filter(
            (item) => item._id !== id
          )
        );
      } else {
        alert(
          data?.message ||
            "Permanent delete failed."
        );
      }
    } catch (err) {
      console.error(err);
      alert("Server error ❌");
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // FILTER + SORT
  // ============================================================

  const filtered = properties
    .filter((p) => {
      const titleMatch =
        (
          p?.coreDetails?.title || ""
        )
          .toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const tags = Array.isArray(
        p.propertyTag
      )
        ? p.propertyTag
        : [
            p.propertyTag ||
              "Normal",
          ];

      const tagMatch =
        tagFilter === "All" ||
        tags.includes(tagFilter);

      // ========================================================
      // STATUS FILTER
      //
      // AGENT:
      // - All = only non-trash
      // - Live = live non-trash
      // - Draft = draft non-trash
      // - Trash = impossible
      //
      // SUPERADMIN:
      // - All = non-trash
      // - Live = live non-trash
      // - Draft = draft non-trash
      // - Trash = trash
      // ========================================================

      const statusMatch =
        filter === "all"
          ? !p.isDeleted
          : filter === "trash"
          ? isSuperAdmin &&
            p.isDeleted
          : p.status === filter &&
            !p.isDeleted;

      // ========================================================
      // DEVELOPER FILTER
      // ========================================================

      const propertyDeveloperId =
        typeof p?.coreDetails
          ?.developerRef === "object"
          ? p?.coreDetails
              ?.developerRef?._id
          : p?.coreDetails
              ?.developerRef;

      const developerMatch =
        developerFilter === "All" ||
        propertyDeveloperId ===
          developerFilter ||
        p?.developerRef ===
          developerFilter;

      // ========================================================
      // SEO FILTER
      // ========================================================

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
            a?.coreDetails?.title ||
            ""
          ).localeCompare(
            b?.coreDetails?.title ||
              ""
          );

        case "name_desc":
          return (
            b?.coreDetails?.title ||
            ""
          ).localeCompare(
            a?.coreDetails?.title ||
              ""
          );

        case "published":
          return (
            (b.status === "published"
              ? 1
              : 0) -
            (a.status === "published"
              ? 1
              : 0)
          );

        case "draft":
          return (
            (b.status === "draft"
              ? 1
              : 0) -
            (a.status === "draft"
              ? 1
              : 0)
          );

        case "featured":
          return (
            (b.propertyTag?.includes(
              "Featured"
            )
              ? 1
              : 0) -
            (a.propertyTag?.includes(
              "Featured"
            )
              ? 1
              : 0)
          );

        default:
          return 0;
      }
    });

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filtered.length /
        itemsPerPage
    )
  );

  const startIndex =
    (currentPage - 1) *
    itemsPerPage;

  const paginatedProperties =
    filtered.slice(
      startIndex,
      startIndex + itemsPerPage
    );

  // ============================================================
  // TAG BADGE
  // ============================================================

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

  // ============================================================
  // DEVELOPER OPTIONS
  // ============================================================

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
              p?.coreDetails
                ?.developerRef ||
              p?.developerRef
          )
          .map((p) => {
            const developerId =
              p?.coreDetails
                ?.developerRef?._id ||
              p?.coreDetails
                ?.developerRef ||
              p?.developerRef;

            const developerName =
              p?.coreDetails
                ?.developerName ||
              `Developer ${String(
                developerId
              ).slice(-6)}`;

            return [
              developerId,
              {
                label:
                  developerName,
                value:
                  developerId,
              },
            ];
          })
      ).values()
    ),
  ];

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div className="p-4 bg-[#f7f8f7] min-h-screen">

      {/* ======================================================
          HEADER
      ====================================================== */}

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

          {/* ==================================================
              FILTER TABS
          ================================================== */}

          <div className="flex border border-gray-300 rounded-xl overflow-hidden bg-white shadow-sm">

            {/* ALL */}

            <button
              onClick={() =>
                setFilter("all")
              }
              className={`px-4 py-2 text-sm font-semibold transition ${
                filter === "all"
                  ? "bg-[#0f3b2e] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All
            </button>

            {/* LIVE */}

            <button
              onClick={() =>
                setFilter(
                  "published"
                )
              }
              className={`px-4 py-2 text-sm font-semibold transition ${
                filter ===
                "published"
                  ? "bg-[#0f3b2e] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Live
            </button>

            {/* DRAFT */}

            <button
              onClick={() =>
                setFilter("draft")
              }
              className={`px-4 py-2 text-sm font-semibold transition ${
                filter === "draft"
                  ? "bg-[#0f3b2e] text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Draft
            </button>

            {/* =================================================
                TRASH
                SUPERADMIN ONLY
            ================================================= */}

            {isSuperAdmin && (
              <button
                onClick={() =>
                  setFilter("trash")
                }
                className={`px-4 py-2 text-sm font-semibold transition ${
                  filter === "trash"
                    ? "bg-red-600 text-white"
                    : "bg-white text-gray-700 hover:bg-gray-100"
                }`}
              >
                Trash
              </button>
            )}

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
            onClick={() =>
              router.push(
                "/admin/add-property"
              )
            }
            className="bg-gradient-to-r from-[#c9a64b] to-[#e0be69] hover:opacity-90 text-black px-5 py-2 rounded-xl text-sm font-bold shadow-lg transition"
          >
            + Add Property
          </button>

        </div>
      </div>

      {/* ======================================================
          COUNTERS
      ====================================================== */}

      <div className="mb-4">

        <div
          className={`grid grid-cols-1 ${
            isSuperAdmin
              ? "sm:grid-cols-4"
              : "sm:grid-cols-3"
          } gap-3 mb-4`}
        >

          {/* TOTAL */}

          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 font-medium">
              Total Properties
            </p>

            <h3 className="text-2xl font-bold text-[#0f3b2e] mt-1">
              {
                properties.filter(
                  (p) =>
                    !p.isDeleted
                ).length
              }
            </h3>
          </div>

          {/* LIVE */}

          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-emerald-700 font-medium">
              Live Properties
            </p>

            <h3 className="text-2xl font-bold text-emerald-700 mt-1">
              {
                properties.filter(
                  (p) =>
                    p.status ===
                      "published" &&
                    !p.isDeleted
                ).length
              }
            </h3>
          </div>

          {/* DRAFT */}

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 shadow-sm">
            <p className="text-xs text-amber-700 font-medium">
              Draft Properties
            </p>

            <h3 className="text-2xl font-bold text-amber-700 mt-1">
              {
                properties.filter(
                  (p) =>
                    p.status ===
                      "draft" &&
                    !p.isDeleted
                ).length
              }
            </h3>
          </div>

          {/* =================================================
              TRASH COUNTER
              SUPERADMIN ONLY
          ================================================= */}

          {isSuperAdmin && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 shadow-sm">

              <p className="text-xs text-red-700 font-medium">
                Trash Properties
              </p>

              <h3 className="text-2xl font-bold text-red-700 mt-1">
                {
                  properties.filter(
                    (p) =>
                      p.isDeleted
                  ).length
                }
              </h3>

            </div>
          )}

        </div>

        {/* ====================================================
            SEARCH / FILTERS
        ==================================================== */}

        <div className="flex flex-col xl:flex-row gap-3">

          {/* SEARCH */}

          <input
            placeholder="Search properties..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
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

          {/* SORT */}

          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 min-w-[230px]">

            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">
              Sort By
            </span>

            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(
                  e.target.value
                )
              }
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
              <option value="newest">
                Sort: Newest First
              </option>

              <option value="oldest">
                Sort: Oldest First
              </option>

              <option value="name_asc">
                Sort: Name A → Z
              </option>

              <option value="name_desc">
                Sort: Name Z → A
              </option>

              <option value="published">
                Sort: Published First
              </option>

              <option value="draft">
                Sort: Draft First
              </option>

              <option value="featured">
                Sort: Featured First
              </option>
            </select>

          </div>

          {/* TAG FILTER */}

          <select
            value={tagFilter}
            onChange={(e) =>
              setTagFilter(
                e.target.value
              )
            }
            className="bg-white border border-gray-300 text-sm text-gray-800 px-4 py-2.5 rounded-xl focus:ring-2 focus:ring-[#0f3b2e] outline-none transition shadow-sm"
          >
            <option value="All">
              All Tags
            </option>

            <option value="Featured">
              Featured
            </option>

            <option value="Recommended">
              Recommended
            </option>

            <option value="Trending">
              Trending
            </option>

            <option value="New">
              New
            </option>

            <option value="Normal">
              Normal
            </option>
          </select>

          {/* DEVELOPER FILTER */}

          <select
            value={developerFilter}
            onChange={(e) =>
              setDeveloperFilter(
                e.target.value
              )
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

            {developerOptions.map(
              (dev) => (
                <option
                  key={dev.value}
                  value={dev.value}
                >
                  {dev.label}
                </option>
              )
            )}
          </select>

          {/* SEO FILTER */}

          <select
            value={seoFilter}
            onChange={(e) =>
              setSeoFilter(
                e.target.value
              )
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
              min-w-[170px]
            "
          >
            <option value="All">
              All SEO
            </option>

            <option value="Custom">
              Custom SEO
            </option>

            <option value="Auto">
              Auto SEO
            </option>
          </select>

        </div>
      </div>

      {/* ======================================================
          TABLE
      ====================================================== */}

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
              paginatedProperties.map(
                (property, index) => (
                  <tr
                    key={property._id}
                    className="border-t border-gray-200 hover:bg-[#f7faf8] transition duration-200"
                  >

                    {/* SR */}

                    <td className="p-3 text-sm font-semibold text-gray-500">
                      {startIndex +
                        index +
                        1}
                    </td>

                    {/* TITLE */}

                    <td className="p-3 font-semibold text-sm text-gray-900 max-w-[220px]">
  <div
    className="max-w-[220px] truncate cursor-pointer"
    title={
      property?.coreDetails?.title ||
      "N/A"
    }
  >
    {property?.coreDetails?.title || "N/A"}
  </div>
</td>

                    {/* PRICE */}

                    <td className="p-3 text-[#0f3b2e] text-sm font-bold whitespace-nowrap">

                      {property
                        .coreDetails
                        ?.priceOnRequest ? (
                        <span className="inline-flex items-center rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-[11px] font-semibold text-amber-700">
                          On Request
                        </span>
                      ) : property
                          .coreDetails
                          ?.startingPrice &&
                        property
                          .coreDetails
                          ?.maxPrice ? (
                        <>
                          ₹
                          {formatPrice(
                            property
                              .coreDetails
                              .startingPrice
                          )}{" "}
                          - ₹
                          {formatPrice(
                            property
                              .coreDetails
                              .maxPrice
                          )}
                        </>
                      ) : property
                          .coreDetails
                          ?.startingPrice ? (
                        <>
                          ₹
                          {formatPrice(
                            property
                              .coreDetails
                              .startingPrice
                          )}
                        </>
                      ) : property
                          .unitConfigurations?.[0]
                          ?.price ? (
                        <>
                          ₹
                          {formatPrice(
                            property
                              .unitConfigurations[0]
                              .price
                          )}
                        </>
                      ) : (
                        <span className="text-gray-400 font-medium">
                          N/A
                        </span>
                      )}

                    </td>

                    {/* LOCATION */}

                    <td className="p-3">

                      <div
                        className="max-w-[130px] truncate cursor-pointer text-sm text-gray-700 font-medium"
                        title={
                          property
                            .locationData
                            ?.locationName ||
                          property
                            .locationData
                            ?.customLocation ||
                          property
                            .locationData
                            ?.address ||
                          "N/A"
                        }
                      >
                        {property
                          .locationData
                          ?.locationName
                          ?.split(
                            ">"
                          )[0]
                          ?.trim() ||
                          property
                            .locationData
                            ?.customLocation ||
                          property
                            .locationData
                            ?.address ||
                          "N/A"}
                      </div>

                    </td>

                    {/* TAG */}

                    <td className="p-3">

                      <div className="flex flex-wrap gap-1 max-w-[180px]">

                        {(Array.isArray(
                          property.propertyTag
                        )
                          ? property.propertyTag
                          : [
                              property.propertyTag ||
                                "Normal",
                            ]
                        ).map(
                          (tag) => (
                            <span
                              key={tag}
                              className={`px-2 py-1 rounded-full text-[10px] font-bold ${tagStyle(
                                tag
                              )}`}
                            >
                              {tag}
                            </span>
                          )
                        )}

                      </div>

                    </td>

                    {/* STATUS */}

                    <td className="p-3">

                      {property.isDeleted ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-red-100 text-red-700">
                          TRASH
                        </span>
                      ) : property.status ===
                        "draft" ? (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-700">
                          DRAFT
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                          LIVE
                        </span>
                      )}

                    </td>

                    {/* SEO */}

                    <td className="p-3">

                      <div
                        className="flex justify-center"
                        title={
                          hasCustomSEO(
                            property
                          )
                            ? "Custom SEO"
                            : "Auto SEO"
                        }
                      >
                        <span
                          className={`h-4 w-4 rounded-full ${
                            hasCustomSEO(
                              property
                            )
                              ? "bg-emerald-500"
                              : "bg-red-500"
                          }`}
                        />
                      </div>

                    </td>

                    {/* CREATED */}

                    <td className="p-3 text-xs text-gray-700 font-medium">
  <div className="flex flex-col gap-0.5">
    <span className="whitespace-nowrap">
      {property.createdAt
        ? new Date(
            property.createdAt
          ).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "N/A"}
    </span>

    <span className="text-[10px] text-gray-500 font-medium whitespace-nowrap">
      By{" "}
      {property?.createdBy?.name ||
        property?.createdBy?.fullName ||
        property?.createdBy?.username ||
        "Unknown"}
    </span>
  </div>
</td>

                    {/* ACTIONS */}

                    <td className="p-3">

                      <div className="flex justify-end gap-2 flex-wrap">

                        {/* ==================================================
                            NON-TRASH PROPERTY ACTIONS
                        ================================================== */}

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
                              title="Preview"
                            >
                              <Eye
                                size={14}
                              />
                            </button>

                            {/* WEBSITE */}

                            {property.status !==
                              "draft" && (
                              <button
                                onClick={() =>
                                  window.open(
                                    `/${property.slug}`,
                                    "_blank"
                                  )
                                }
                                className="h-9 w-9 flex items-center justify-center rounded-lg bg-black hover:bg-gray-800 text-white transition shadow-sm"
                                title="Open Website"
                              >
                                <Globe
                                  size={14}
                                />
                              </button>
                            )}

                            {/* TAG */}

                            <button
                              onClick={() => {
                                setFeatureModal(
                                  property
                                );

                                const tags =
                                  Array.isArray(
                                    property.propertyTag
                                  )
                                    ? property.propertyTag
                                    : property.propertyTag
                                    ? [
                                        property.propertyTag,
                                      ]
                                    : [];

                                setSelectedTags(
                                  tags.filter(
                                    (tag) =>
                                      tag !==
                                      "Normal"
                                  )
                                );
                              }}
                              className="h-9 w-9 flex items-center justify-center rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white transition shadow-sm"
                              title="Property Tags"
                            >
                              <Star
                                size={14}
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/edit-property/${property._id}`
                                )
                              }
                              className="h-9 w-9 flex items-center justify-center rounded-lg bg-[#0f3b2e] hover:bg-[#145240] text-white transition shadow-sm"
                              title="Edit Property"
                            >
                              <Pencil
                                size={14}
                              />
                            </button>

                            {/* ==================================================
                                LIVE → DRAFT
                                OR
                                DRAFT → LIVE

                                AGENT + SUPERADMIN
                            ================================================== */}

                            {property.status ===
                            "published" ? (
                              <button
                                disabled={
                                  actionId ===
                                  property._id
                                }
                                onClick={() =>
                                  handleDelete(
                                    property._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 text-xs font-semibold transition whitespace-nowrap"
                                title="Deactivate to Draft"
                              >
                                {actionId ===
                                property._id
                                  ? "..."
                                  : "Draft"}
                              </button>
                            ) : (
                              <button
                                disabled={
                                  actionId ===
                                  property._id
                                }
                                onClick={() =>
                                  handleRestore(
                                    property._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition shadow-sm whitespace-nowrap"
                                title="Publish Property"
                              >
                                {actionId ===
                                property._id
                                  ? "..."
                                  : "Live"}
                              </button>
                            )}

                            {/* ==================================================
                                MOVE TO TRASH

                                AGENT + SUPERADMIN
                                
                                IMPORTANT:
                                This button is NOT hidden for Agent.
                            ================================================== */}

                            <button
                              disabled={
                                actionId ===
                                property._id
                              }
                              onClick={() =>
                                moveToTrash(
                                  property._id
                                )
                              }
                              className="h-9 w-9 flex items-center justify-center rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition shadow-sm"
                              title="Move to Trash"
                            >
                              {actionId ===
                              property._id ? (
                                <RefreshCw
                                  size={15}
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={15}
                                />
                              )}
                            </button>

                          </>
                        )}

                        {/* ==================================================
                            TRASH ACTIONS

                            SUPERADMIN ONLY
                        ================================================== */}

                        {isSuperAdmin &&
                          property.isDeleted && (
                            <>

                              {/* RESTORE FROM TRASH */}

                              <button
                                disabled={
                                  actionId ===
                                  property._id
                                }
                                onClick={() =>
                                  restoreTrash(
                                    property._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-semibold"
                              >
                                {actionId ===
                                property._id
                                  ? "..."
                                  : "Restore"}
                              </button>

                              {/* DELETE FOREVER */}

                              <button
                                disabled={
                                  actionId ===
                                  property._id
                                }
                                onClick={() =>
                                  permanentDelete(
                                    property._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white text-xs font-semibold"
                              >
                                {actionId ===
                                property._id
                                  ? "..."
                                  : "Delete Forever"}
                              </button>

                            </>
                          )}

                      </div>

                    </td>

                  </tr>
                )
              )
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

        {/* ======================================================
            PAGINATION
        ====================================================== */}

        <div className="flex items-center justify-between p-4 border-t border-gray-200 flex-wrap gap-4">

          {/* LEFT */}

          <div className="flex items-center gap-4 flex-wrap">

            <p className="text-sm text-gray-600 font-medium">

              Showing{" "}

              <span className="font-bold">
                {filtered.length === 0
                  ? 0
                  : startIndex + 1}
              </span>

              {" "}to{" "}

              <span className="font-bold">
                {Math.min(
                  startIndex +
                    itemsPerPage,
                  filtered.length
                )}
              </span>

              {" "}of{" "}

              <span className="font-bold">
                {filtered.length}
              </span>

              {" "}properties

            </p>

            {/* ITEMS PER PAGE */}

            <div className="flex items-center gap-2">

              <span className="text-sm text-gray-600 font-medium">
                Show:
              </span>

              <select
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(
                    Number(
                      e.target.value
                    )
                  );
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-medium bg-white text-gray-800 min-w-[80px] focus:outline-none focus:ring-2 focus:ring-[#0f3b2e]"
              >
                <option value={10}>
                  10
                </option>

                <option value={25}>
                  25
                </option>

                <option value={50}>
                  50
                </option>

                <option value={100}>
                  100
                </option>
              </select>

            </div>

          </div>

          {/* RIGHT */}

          <div className="flex items-center gap-2 flex-wrap">

            {totalPages > 1 && (
              <>

                {/* PREVIOUS */}

                <button
                  disabled={
                    currentPage === 1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev - 1
                    )
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
                    length: Math.min(
                      totalPages,
                      5
                    ),
                  },
                  (_, i) => {
                    let startPage =
                      1;

                    if (
                      totalPages <=
                      5
                    ) {
                      startPage = 1;
                    } else if (
                      currentPage <=
                      3
                    ) {
                      startPage = 1;
                    } else if (
                      currentPage >=
                      totalPages - 2
                    ) {
                      startPage =
                        totalPages -
                        4;
                    } else {
                      startPage =
                        currentPage -
                        2;
                    }

                    return (
                      startPage +
                      i
                    );
                  }
                ).map(
                  (page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(
                          page
                        )
                      }
                      className={`h-9 w-9 rounded-lg text-sm font-bold transition ${
                        currentPage ===
                        page
                          ? "bg-[#0f3b2e] text-white"
                          : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  )
                )}

                {/* NEXT */}

                <button
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (prev) =>
                        prev + 1
                    )
                  }
                  className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
                    currentPage ===
                    totalPages
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

      {/* ======================================================
          PROPERTY TAG MODAL
      ====================================================== */}

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
                onClick={() =>
                  setFeatureModal(
                    null
                  )
                }
                className="h-9 w-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
              >
                <X size={18} />
              </button>

            </div>

            {/* TAG OPTIONS */}

            <div className="p-6">

              {[
                {
                  label:
                    "Featured",
                  icon: (
                    <Star
                      size={18}
                    />
                  ),
                  color:
                    "bg-yellow-50 border-yellow-200 text-yellow-700",
                },

                {
                  label:
                    "Recommended",
                  icon: (
                    <BadgeCheck
                      size={18}
                    />
                  ),
                  color:
                    "bg-blue-50 border-blue-200 text-blue-700",
                },

                {
                  label:
                    "Trending",
                  icon: (
                    <TrendingUp
                      size={18}
                    />
                  ),
                  color:
                    "bg-pink-50 border-pink-200 text-pink-700",
                },

                {
                  label:
                    "New",
                  icon: (
                    <Sparkles
                      size={18}
                    />
                  ),
                  color:
                    "bg-emerald-50 border-emerald-200 text-emerald-700",
                },

                {
                  label:
                    "Normal",
                  icon: (
                    <Tag
                      size={18}
                    />
                  ),
                  color:
                    "bg-gray-50 border-gray-200 text-gray-700",
                },
              ].map(
                (item) => {
                  const active =
                    item.label ===
                    "Normal"
                      ? selectedTags.length ===
                        0
                      : selectedTags.includes(
                          item.label
                        );

                  return (
                    <button
                      key={
                        item.label
                      }
                      onClick={() => {
                        if (
                          item.label ===
                          "Normal"
                        ) {
                          setSelectedTags(
                            []
                          );
                          return;
                        }

                        setSelectedTags(
                          (prev) =>
                            prev.includes(
                              item.label
                            )
                              ? prev.filter(
                                  (
                                    t
                                  ) =>
                                    t !==
                                    item.label
                                )
                              : [
                                  ...prev,
                                  item.label,
                                ]
                        );
                      }}
                      className={`
                        w-full
                        mb-3
                        rounded-2xl
                        border
                        p-4
                        flex
                        items-center
                        justify-between
                        transition
                        ${item.color}
                        ${
                          active
                            ? "ring-2 ring-[#0f3b2e] scale-[1.02]"
                            : "opacity-80 hover:opacity-100"
                        }
                      `}
                    >

                      <div className="flex items-center gap-3">

                        {item.icon}

                        <span className="font-semibold">
                          {
                            item.label
                          }
                        </span>

                      </div>

                      <input
                        type="checkbox"
                        checked={
                          active
                        }
                        readOnly
                        className="h-5 w-5"
                      />

                    </button>
                  );
                }
              )}

              {/* SAVE */}

              <button
                onClick={() =>
                  updatePropertyTag(
                    featureModal._id
                  )
                }
                disabled={
                  actionId ===
                  featureModal._id
                }
                className="mt-5 w-full h-12 rounded-xl bg-[#0f3b2e] hover:bg-[#145240] disabled:opacity-50 text-white font-semibold transition"
              >
                {actionId ===
                featureModal._id
                  ? "Saving..."
                  : "Save Tags"}
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}
