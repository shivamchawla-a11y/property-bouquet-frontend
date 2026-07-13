"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Pencil,
  Eye,
  RefreshCw,
  Trash2,
  Star,
  Globe,
  FileText,
} from "lucide-react";

const API_URL =
  "/api/knowledge";

export default function KnowledgePage() {
  const router = useRouter();

const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  const [filter, setFilter] = useState("all");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [itemsPerPage, setItemsPerPage] =
    useState(10);

  const [actionId, setActionId] =
    useState(null);

  // ================= FETCH =================

  const fetchKnowledge = async () => {
    try {
      setLoading(true);

      const res = await fetch(API_URL, {
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        setArticles(data.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    sortBy,
    filter,
    categoryFilter,
    itemsPerPage,
  ]);

  // ================= PUBLISH =================

  const publishKnowledge = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "published",
          }),
        }
      );

      if (res.ok) {
        setArticles((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status: "published",
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  // ================= DRAFT =================

  const draftKnowledge = async (id) => {
    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status: "draft",
          }),
        }
      );

      if (res.ok) {
        setArticles((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  status: "draft",
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setActionId(null);
    }
  };

  // ================= FEATURED =================

  const toggleFeatured = async (
    id,
    current
  ) => {
    try {
      const res = await fetch(
        `${API_URL}/update/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            featured: !current,
          }),
        }
      );

      if (res.ok) {
        setArticles((prev) =>
          prev.map((item) =>
            item._id === id
              ? {
                  ...item,
                  featured: !current,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= MOVE TO TRASH =================

  const moveToTrash = async (id) => {
    if (
      !confirm(
        "Move article to trash?"
      )
    )
      return;

    try {
      const res = await fetch(
        `${API_URL}/trash/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (res.ok) {
        setArticles((prev) =>
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

  // ================= RESTORE =================

  const restoreTrash = async (id) => {
    try {
      const res = await fetch(
        `${API_URL}/restore/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (res.ok) {
        setArticles((prev) =>
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

  // ================= DELETE FOREVER =================

  const deleteForever = async (id) => {
    if (
      !confirm(
        "Delete permanently?"
      )
    )
      return;

    try {
      const res = await fetch(
        `${API_URL}/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.ok) {
        setArticles((prev) =>
          prev.filter(
            (item) =>
              item._id !== id
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ================= FILTER =================

  const filtered = articles
    .filter((item) => {
      const titleMatch =
        item.title
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          );

      const categoryMatch =
        categoryFilter === "All"
          ? true
          : item.category ===
            categoryFilter;

      const statusMatch =
        filter === "all"
          ? !item.isDeleted
          : filter === "trash"
          ? item.isDeleted
          : item.status === filter &&
            !item.isDeleted;

      return (
        titleMatch &&
        categoryMatch &&
        statusMatch
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

        case "views":
          return b.views - a.views;

        case "featured":
          return (
            Number(b.featured) -
            Number(a.featured)
          );

        default:
          return 0;
      }
    });

  // ================= PAGINATION =================

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

  const paginatedArticles =
    filtered.slice(
      startIndex,
      startIndex + itemsPerPage
    );

      return (
    <div className="space-y-6">

      {/* ================= HEADER ================= */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">

        <div>
          <h1 className="text-3xl font-extrabold text-[#0f3b2e] tracking-tight">
                Knowledge Centre
            </h1>

            <p className="text-gray-600 mt-1 text-sm">
            Manage educational articles, buying guides, investment resources, FAQs and real estate knowledge content.
            </p>
        </div>

        <div className="flex items-center gap-3">

          <button
            onClick={fetchKnowledge}
            className="px-4 py-3 rounded-xl border border-gray-300 bg-white text-gray-900 hover:bg-gray-50 transition flex items-center gap-2 text-sm font-semibold"
          >
            <RefreshCw size={16} />
            Refresh
          </button>

          <button
            onClick={() =>
              router.push("/admin/knowledge/create")
            }
            className="
            bg-gradient-to-r
            from-[#c9a64b]
            to-[#e0be69]
            hover:opacity-90
            text-black
            px-5
            py-3
            rounded-xl
            font-bold
            shadow-lg
            transition
            "
          >
            + Add Article
          </button>

        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="grid md:grid-cols-4 gap-4">

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Total Articles
              </p>

              <h3 className="text-3xl font-extrabold text-[#0f3b2e] mt-2">
                {articles.filter(
                  (n) => !n.isDeleted
                ).length}
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
              <FileText className="text-blue-600" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Published
              </p>

              <h3 className="text-3xl font-extrabold text-emerald-700 mt-2">
                {
                  articles.filter(
                    (n) =>
                      n.status ===
                        "published" &&
                      !n.isDeleted
                  ).length
                }
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Globe className="text-emerald-600" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Drafts
              </p>

              <h3 className="text-3xl font-extrabold text-amber-700 mt-2">
                {
                  articles.filter(
                    (n) =>
                      n.status ===
                        "draft" &&
                      !n.isDeleted
                  ).length
                }
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <Pencil className="text-amber-600" />
            </div>

          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Featured
              </p>

              <h3 className="text-3xl font-extrabold text-yellow-600 mt-2">
                {
                  articles.filter(
                    (n) =>
                      n.featured &&
                      !n.isDeleted
                  ).length
                }
              </h3>
            </div>

            <div className="h-12 w-12 rounded-xl bg-yellow-50 flex items-center justify-center">
              <Star className="text-yellow-600" />
            </div>

          </div>
        </div>

      </div>

      {/* ================= FILTER BAR ================= */}

      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">

        <div className="grid xl:grid-cols-5 gap-3">

          {/* SEARCH */}

          <input
            type="text"
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
           placeholder="Search knowledge articles..."
            className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            outline-none
            text-gray-900
            placeholder:text-gray-400
            bg-white
            focus:ring-2
            focus:ring-[#0f3b2e]/20
            "
          />

          {/* STATUS */}

          <select
            value={filter}
            onChange={(e) =>
              setFilter(
                e.target.value
              )
            }
            className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            text-gray-900
            "
          >
            <option value="all">
              All Articles
            </option>

            <option value="published">
              Published
            </option>

            <option value="draft">
              Draft
            </option>

            <option value="trash">
              Trash
            </option>
          </select>

          {/* CATEGORY */}

          <select
            value={categoryFilter}
            onChange={(e) =>
              setCategoryFilter(
                e.target.value
              )
            }
            className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            text-gray-900
            "
          >
            <option value="All">All Categories</option>

<option value="Buying Guide">
  Buying Guide
</option>

<option value="Selling Guide">
  Selling Guide
</option>

<option value="Investment">
  Investment
</option>

<option value="Legal & Tax">
  Legal & Tax
</option>

<option value="Home Loan">
  Home Loan
</option>

<option value="Interior Design">
  Interior Design
</option>

<option value="Real Estate Basics">
  Real Estate Basics
</option>

<option value="Market Knowledge">
  Market Knowledge
</option>

<option value="Luxury Homes">
  Luxury Homes
</option>

<option value="NRI Corner">
  NRI Corner
</option>

<option value="FAQ">
  FAQ
</option>

<option value="Others">
  Others
</option>
          </select>

          {/* SORT */}

          <select
            value={sortBy}
            onChange={(e) =>
              setSortBy(
                e.target.value
              )
            }
            className="
            px-4
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            text-gray-900
            "
          >
            <option value="newest">
              Newest First
            </option>

            <option value="oldest">
              Oldest First
            </option>

            <option value="views">
              Most Viewed
            </option>

            <option value="featured">
              Featured First
            </option>
          </select>

          {/* RESULTS */}

          <div className="flex items-center justify-center rounded-xl bg-[#0f3b2e] text-white font-bold">
            {filtered.length} Knowledge Articles
          </div>

        </div>
      </div>

            {/* ================= TABLE ================= */}

      <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">

        <table className="w-full">

          <thead className="bg-[#f5f7f6]">

            <tr>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                #
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Article
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Category
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Author
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Views
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Status
              </th>

              <th className="p-4 text-left text-xs uppercase font-bold text-gray-600">
                Featured
              </th>

              <th className="p-4 text-right text-xs uppercase font-bold text-gray-600">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {loading ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-10 text-gray-500"
                >
                  Loading knowledge articles...
                </td>
              </tr>
            ) : paginatedArticles.length === 0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="text-center p-10 text-gray-500"
                >
                  No articles found. Click "Add Article" to create your first knowledge article.
                </td>
              </tr>
            ) : (
              paginatedArticles.map(
                (item, index) => (
                  <tr
                    key={item._id}
                    className="border-t border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="p-4 font-semibold text-gray-500">
                      {startIndex +
                        index +
                        1}
                    </td>

                    {/* ARTICLE */}

                    <td className="p-4">

                      <div className="max-w-[350px]">

                        <h3 className="font-semibold text-gray-900 line-clamp-1">
                          {item.title}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {
                            item.shortDescription
                          }
                        </p>

                      </div>

                    </td>

                    {/* CATEGORY */}

                    <td className="p-4">
                      <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold">
                        {item.category}
                      </span>
                    </td>

                    {/* AUTHOR */}

                    <td className="p-4 text-sm text-gray-700">
                      {item.author}
                    </td>

                    {/* VIEWS */}

                    <td className="p-4 font-semibold text-gray-700">
                      {item.views || 0}
                    </td>

                    {/* STATUS */}

                    <td className="p-4">

                      {item.isDeleted ? (
                        <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold">
                          TRASH
                        </span>
                      ) : item.status ===
                        "published" ? (
                        <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                          PUBLISHED
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">
                          DRAFT
                        </span>
                      )}

                    </td>

                    {/* FEATURED */}

                    <td className="p-4">

                      <button
                        disabled={
                          item.isDeleted
                        }
                        onClick={() =>
                          toggleFeatured(
                            item._id,
                            item.featured
                          )
                        }
                        className={`h-9 w-9 rounded-lg flex items-center justify-center transition ${
                          item.featured
                            ? "bg-yellow-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        <Star
                          size={16}
                        />
                      </button>

                    </td>

                    {/* ACTIONS */}

                    <td className="p-4">

                      <div className="flex justify-end gap-2 flex-wrap">

                        {!item.isDeleted ? (
                          <>
                            {/* VIEW */}

                            <button
                              onClick={() =>
                                window.open(
                                `/knowledge/${item.slug}`,
                                "_blank"
                                )
                              }
                              className="h-9 w-9 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center"
                            >
                              <Eye
                                size={14}
                              />
                            </button>

                            {/* EDIT */}

                            <button
                              onClick={() =>
                                router.push(
                                  `/admin/knowledge/edit/${item._id}`
                                )
                              }
                              className="h-9 w-9 rounded-lg bg-[#0f3b2e] hover:bg-[#145240] text-white flex items-center justify-center"
                            >
                              <Pencil
                                size={14}
                              />
                            </button>

                            {/* STATUS */}

                            {item.status ===
                            "published" ? (
                              <button
                                disabled={
                                  actionId ===
                                  item._id
                                }
                                onClick={() =>
                                  draftKnowledge(
                                    item._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-red-50 text-red-600 text-xs font-semibold"
                              >
                                Draft
                              </button>
                            ) : (
                              <button
                                disabled={
                                  actionId ===
                                  item._id
                                }
                                onClick={() =>
                                  publishKnowledge(
                                    item._id
                                  )
                                }
                                className="h-9 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                              >
                                Publish
                              </button>
                            )}

                            {/* TRASH */}

                            <button
                              onClick={() =>
                                moveToTrash(
                                  item._id
                                )
                              }
                              className="h-9 w-9 rounded-lg bg-red-600 hover:bg-red-700 text-white flex items-center justify-center"
                            >
                              <Trash2
                                size={14}
                              />
                            </button>
                          </>
                        ) : (
                          <>
                            {/* RESTORE */}

                            <button
                              onClick={() =>
                                restoreTrash(
                                  item._id
                                )
                              }
                              className="h-9 px-4 rounded-lg bg-emerald-600 text-white text-xs font-semibold"
                            >
                              Restore
                            </button>

                            {/* DELETE */}

                            <button
                              onClick={() =>
                                deleteForever(
                                  item._id
                                )
                              }
                              className="h-9 px-4 rounded-lg bg-red-600 text-white text-xs font-semibold"
                            >
                              Delete Forever
                            </button>
                          </>
                        )}

                      </div>

                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* ================= PAGINATION ================= */}

      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">

        <p className="text-sm text-gray-600 font-medium">
          Showing{" "}
          <strong>
            {filtered.length === 0
              ? 0
              : startIndex + 1}
          </strong>{" "}
          to{" "}
          <strong>
            {Math.min(
              startIndex +
                itemsPerPage,
              filtered.length
            )}
          </strong>{" "}
          of{" "}
          <strong>
            {filtered.length}
          </strong>{" "}
          Knowledge articles
        </p>

        <div className="flex items-center gap-3">

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
            className="border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900"
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

          {totalPages > 1 && (
            <div className="flex gap-2">

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
                className="
px-4
py-2
border
rounded-lg
bg-white
text-gray-900
"
              >
                Prev
              </button>

              <div className="px-4 py-2 bg-[#0f3b2e] text-white rounded-lg font-bold">
                {currentPage}
              </div>

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
                className="
                px-4
                py-2
                border
                rounded-lg
                bg-white
                text-gray-900
                "
              >
                Next
              </button>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}