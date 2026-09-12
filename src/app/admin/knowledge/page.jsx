"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Trash,
  Star,
  FileText,
  CheckCircle2,
  Clock3,
  X,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";

import { useRouter } from "next/navigation";

const API_URL = "/api/knowledge";

const CATEGORIES = [
  "Buying Guide",
  "Selling Guide",
  "Investment",
  "Legal",
  "Home Loans",
  "Taxation",
  "Luxury Living",
  "Interior Design",
  "Market Education",
  "NRI Guide",
  "Tips & Tricks",
  "General",
];

const ITEMS_PER_PAGE = 10;

export default function KnowledgeAdminPage() {
  const router = useRouter();

  // ============================================================
  // STATE
  // ============================================================

  const [articles, setArticles] = useState([]);

  const [loading, setLoading] = useState(true);

  const [actionId, setActionId] = useState(null);

  const [activeTab, setActiveTab] = useState("all");

  const [searchTerm, setSearchTerm] = useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("");

  const [page, setPage] = useState(1);

  /*
   * We maintain the number of articles in Trash
   * separately so the Trash button can show its
   * count even when the active list is being viewed.
   */
  const [trashCount, setTrashCount] = useState(0);

  // ============================================================
  // SAFE JSON RESPONSE HELPER
  // ============================================================

  const readJson = async (res) => {
    try {
      return await res.json();
    } catch {
      return {};
    }
  };

  // ============================================================
  // FETCH ACTIVE ARTICLES
  // ============================================================

  const fetchKnowledge = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const res = await fetch(API_URL, {
          method: "GET",
          credentials: "include",
          cache: "no-store",
        });

        const data = await readJson(res);

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "Failed to load knowledge articles."
          );
        }

        const activeArticles = Array.isArray(
          data?.data
        )
          ? data.data.filter(
              (article) =>
                article?.isDeleted !== true
            )
          : [];

        setArticles(activeArticles);
      } catch (error) {
        console.error(
          "FETCH KNOWLEDGE ERROR:",
          error
        );

        alert(
          error?.message ||
            "Failed to load knowledge articles."
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    []
  );

  // ============================================================
  // FETCH TRASH
  // ============================================================

  const fetchTrash = useCallback(
    async (showLoader = true) => {
      try {
        if (showLoader) {
          setLoading(true);
        }

        const res = await fetch(
          `${API_URL}/trash/all`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await readJson(res);

        if (!res.ok) {
          throw new Error(
            data?.message ||
              "Failed to load Trash."
          );
        }

        const trashArticles = Array.isArray(
          data?.data
        )
          ? data.data.filter(
              (article) =>
                article?.isDeleted === true
            )
          : [];

        setArticles(trashArticles);

        setTrashCount(
          trashArticles.length
        );
      } catch (error) {
        console.error(
          "FETCH TRASH ERROR:",
          error
        );

        alert(
          error?.message ||
            "Failed to load Trash."
        );
      } finally {
        if (showLoader) {
          setLoading(false);
        }
      }
    },
    []
  );

  // ============================================================
  // FETCH TRASH COUNT ONLY
  // ============================================================

  const fetchTrashCount = useCallback(
    async () => {
      try {
        const res = await fetch(
          `${API_URL}/trash/all`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await readJson(res);

        if (!res.ok) {
          return;
        }

        const trashArticles = Array.isArray(
          data?.data
        )
          ? data.data.filter(
              (article) =>
                article?.isDeleted === true
            )
          : [];

        setTrashCount(
          trashArticles.length
        );
      } catch (error) {
        console.error(
          "FETCH TRASH COUNT ERROR:",
          error
        );
      }
    },
    []
  );

  // ============================================================
  // INITIAL LOAD
  // ============================================================

  useEffect(() => {
    fetchKnowledge();
    fetchTrashCount();
  }, [
    fetchKnowledge,
    fetchTrashCount,
  ]);

  // ============================================================
  // LOAD WHEN TAB CHANGES
  // ============================================================

  useEffect(() => {
    setPage(1);

    if (activeTab === "trash") {
      fetchTrash();
    } else {
      fetchKnowledge();
    }
  }, [
    activeTab,
    fetchKnowledge,
    fetchTrash,
  ]);

  // ============================================================
  // COUNTS
  // ============================================================

  const counts = useMemo(() => {
    /*
     * On active tabs, articles contains active articles.
     * On Trash tab, articles contains trash articles.
     *
     * Therefore we calculate the active counts only
     * when the active list is being displayed.
     */

    if (activeTab === "trash") {
      return {
        all: 0,
        published: 0,
        draft: 0,
        featured: 0,
        trash: trashCount,
      };
    }

    return {
      all: articles.length,

      published: articles.filter(
        (article) =>
          article?.status === "published"
      ).length,

      draft: articles.filter(
        (article) =>
          article?.status === "draft"
      ).length,

      featured: articles.filter(
        (article) =>
          article?.featured === true
      ).length,

      trash: trashCount,
    };
  }, [
    articles,
    activeTab,
    trashCount,
  ]);

  // ============================================================
  // FILTER
  // ============================================================

  const filteredArticles = useMemo(() => {
    let result = [...articles];

    // ----------------------------------------------------------
    // SAFETY FILTER
    // ----------------------------------------------------------

    if (activeTab === "trash") {
      result = result.filter(
        (article) =>
          article?.isDeleted === true
      );
    } else {
      result = result.filter(
        (article) =>
          article?.isDeleted !== true
      );
    }

    // ----------------------------------------------------------
    // TAB FILTER
    // ----------------------------------------------------------

    if (activeTab === "published") {
      result = result.filter(
        (article) =>
          article?.status === "published"
      );
    }

    if (activeTab === "draft") {
      result = result.filter(
        (article) =>
          article?.status === "draft"
      );
    }

    if (activeTab === "featured") {
      result = result.filter(
        (article) =>
          article?.featured === true
      );
    }

    // ----------------------------------------------------------
    // SEARCH
    // ----------------------------------------------------------

    const search =
      searchTerm.trim().toLowerCase();

    if (search) {
      result = result.filter((article) => {
        const title =
          String(article?.title || "")
            .toLowerCase();

        const slug =
          String(article?.slug || "")
            .toLowerCase();

        const description =
          String(
            article?.shortDescription || ""
          ).toLowerCase();

        return (
          title.includes(search) ||
          slug.includes(search) ||
          description.includes(search)
        );
      });
    }

    // ----------------------------------------------------------
    // CATEGORY
    // ----------------------------------------------------------

    if (categoryFilter) {
      result = result.filter(
        (article) =>
          article?.category ===
          categoryFilter
      );
    }

    // ----------------------------------------------------------
    // STATUS
    // ----------------------------------------------------------

    if (
      statusFilter &&
      activeTab !== "trash"
    ) {
      result = result.filter(
        (article) =>
          article?.status ===
          statusFilter
      );
    }

    return result;
  }, [
    articles,
    activeTab,
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  // ============================================================
  // PAGINATION
  // ============================================================

  const totalPages = Math.max(
    1,
    Math.ceil(
      filteredArticles.length /
        ITEMS_PER_PAGE
    )
  );

  /*
   * Safety:
   * If filters reduce the number of pages,
   * make sure the current page is still valid.
   */

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedArticles =
    filteredArticles.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );

  // ============================================================
  // RESET PAGE WHEN FILTERS CHANGE
  // ============================================================

  useEffect(() => {
    setPage(1);
  }, [
    searchTerm,
    categoryFilter,
    statusFilter,
  ]);

  // ============================================================
  // CREATE
  // ============================================================

  const handleCreate = () => {
    router.push(
      "/admin/knowledge/create"
    );
  };

  // ============================================================
  // EDIT
  // ============================================================

  const handleEdit = (id) => {
    if (!id) return;

    router.push(
      `/admin/knowledge/create?id=${id}`
    );
  };

  // ============================================================
  // VIEW
  // ============================================================

  const handleView = (slug) => {
    if (!slug) return;

    window.open(
      `/knowledge/${slug}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // ============================================================
  // PUBLISH
  // ============================================================

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

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to publish article."
        );
      }

      await fetchKnowledge(false);
      await fetchTrashCount();

      alert(
        "Article published successfully."
      );
    } catch (error) {
      console.error(
        "PUBLISH ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to publish article."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // MOVE TO DRAFT
  // ============================================================

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

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to move article to draft."
        );
      }

      await fetchKnowledge(false);
      await fetchTrashCount();

      alert(
        "Article moved to Draft."
      );
    } catch (error) {
      console.error(
        "DRAFT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to move article to draft."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // FEATURED
  // ============================================================

  const toggleFeatured = async (
    id,
    currentValue
  ) => {
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
            featured:
              !currentValue,
          }),
        }
      );

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to update featured status."
        );
      }

      await fetchKnowledge(false);

      alert(
        currentValue
          ? "Article removed from Featured."
          : "Article marked as Featured."
      );
    } catch (error) {
      console.error(
        "FEATURED ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to update featured status."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // MOVE TO TRASH — SOFT DELETE
  // ============================================================

  const moveToTrash = async (id) => {
    const confirmed =
      window.confirm(
        "Move this article to Trash?\n\nThe article will NOT be permanently deleted. It will remain in MongoDB and can be restored later from Trash."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/trash/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to move article to Trash."
        );
      }

      /*
       * Refresh active list.
       */
      await fetchKnowledge(false);

      /*
       * Refresh Trash count.
       */
      await fetchTrashCount();

      alert(
        "Article moved to Trash successfully."
      );
    } catch (error) {
      console.error(
        "TRASH ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to move article to Trash."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // RESTORE FROM TRASH
  // ============================================================

  const restoreFromTrash = async (
    id
  ) => {
    const confirmed =
      window.confirm(
        "Restore this article from Trash?\n\nThe article will return to your active articles as a Draft."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/restore/${id}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to restore article."
        );
      }

      /*
       * Refresh Trash list.
       */
      await fetchTrash(false);

      /*
       * Refresh count.
       */
      await fetchTrashCount();

      alert(
        "Article restored successfully as Draft."
      );
    } catch (error) {
      console.error(
        "RESTORE ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to restore article."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // DELETE FOREVER
  // ============================================================

  const deleteForever = async (id) => {
    const confirmed =
      window.confirm(
        "DELETE THIS ARTICLE FOREVER?\n\nThis will permanently remove the article from MongoDB.\n\nThis action CANNOT be undone."
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionId(id);

      const res = await fetch(
        `${API_URL}/delete/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const data = await readJson(res);

      if (!res.ok) {
        throw new Error(
          data?.message ||
            "Failed to permanently delete article."
        );
      }

      /*
       * Refresh Trash directly from MongoDB.
       */
      await fetchTrash(false);

      /*
       * Refresh Trash count.
       */
      await fetchTrashCount();

      alert(
        "Article permanently deleted from MongoDB."
      );
    } catch (error) {
      console.error(
        "PERMANENT DELETE ERROR:",
        error
      );

      alert(
        error?.message ||
          "Failed to permanently delete article."
      );
    } finally {
      setActionId(null);
    }
  };

  // ============================================================
  // CLEAR FILTERS
  // ============================================================

  const clearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setStatusFilter("");
    setPage(1);
  };

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (value) => {
    if (!value) return "—";

    try {
      return new Date(
        value
      ).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    } catch {
      return "—";
    }
  };

  // ============================================================
  // REFRESH
  // ============================================================

  const handleRefresh = async () => {
    if (activeTab === "trash") {
      await fetchTrash();
    } else {
      await fetchKnowledge();
    }

    await fetchTrashCount();
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f6f4ef] px-4 py-6 text-[#17342d] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px]">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[3px] text-[#b18a48]">
              Property Bouquet
            </p>

            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#17342d] sm:text-4xl">
              Knowledge Centre
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Create, manage, publish and safely archive knowledge articles.
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#17342d] px-5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#0f2a23]"
          >
            <Plus size={17} />
            Create Article
          </button>
        </div>

        {/* ======================================================
            TOP NAVIGATION
        ====================================================== */}

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
          <div className="flex flex-wrap gap-2">

            <TabButton
              active={activeTab === "all"}
              onClick={() =>
                setActiveTab("all")
              }
              icon={<FileText size={15} />}
              label="All Articles"
              count={counts.all}
            />

            <TabButton
              active={
                activeTab === "published"
              }
              onClick={() =>
                setActiveTab("published")
              }
              icon={
                <CheckCircle2 size={15} />
              }
              label="Published"
              count={counts.published}
            />

            <TabButton
              active={
                activeTab === "draft"
              }
              onClick={() =>
                setActiveTab("draft")
              }
              icon={<Clock3 size={15} />}
              label="Drafts"
              count={counts.draft}
            />

            <TabButton
              active={
                activeTab === "featured"
              }
              onClick={() =>
                setActiveTab("featured")
              }
              icon={<Star size={15} />}
              label="Featured"
              count={counts.featured}
            />

            {/* ==================================================
                TRASH
            ================================================== */}

            <button
              type="button"
              onClick={() =>
                setActiveTab("trash")
              }
              className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
                activeTab === "trash"
                  ? "bg-red-50 text-red-700 ring-1 ring-red-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-red-600"
              }`}
            >
              <Trash2 size={15} />

              Trash

              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  activeTab === "trash"
                    ? "bg-red-100 text-red-700"
                    : "bg-slate-100 text-slate-500"
                }`}
              >
                {counts.trash}
              </span>
            </button>

            {/* ==================================================
                REFRESH
            ================================================== */}

            <button
              type="button"
              onClick={handleRefresh}
              disabled={loading}
              className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-[#17342d] disabled:opacity-50"
              title="Refresh"
            >
              <RefreshCw
                size={15}
                className={
                  loading
                    ? "animate-spin"
                    : ""
                }
              />
            </button>
          </div>
        </div>

        {/* ======================================================
            TRASH NOTICE
        ====================================================== */}

        {activeTab === "trash" && (
          <div className="mb-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4 text-red-800">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-semibold">
                Trash / Soft Deleted Articles
              </p>

              <p className="mt-1 text-xs leading-5 text-red-700">
                Articles shown here still exist in MongoDB.
                Restore an article to bring it back as a Draft,
                or use Delete Forever to permanently remove it.
              </p>
            </div>
          </div>
        )}

        {/* ======================================================
            FILTER BAR
        ====================================================== */}

        <div className="mb-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px_auto]">

            {/* SEARCH */}

            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(
                    e.target.value
                  )
                }
                placeholder="Search articles..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-800 outline-none transition focus:border-[#b18a48] focus:bg-white"
              />
            </div>

            {/* CATEGORY */}

            <select
              value={categoryFilter}
              onChange={(e) =>
                setCategoryFilter(
                  e.target.value
                )
              }
              className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-[#b18a48]"
            >
              <option value="">
                All Categories
              </option>

              {CATEGORIES.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}
            </select>

            {/* STATUS */}

            {activeTab !== "trash" ? (
              <select
                value={statusFilter}
                onChange={(e) =>
                  setStatusFilter(
                    e.target.value
                  )
                }
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-700 outline-none focus:border-[#b18a48]"
              >
                <option value="">
                  All Status
                </option>

                <option value="published">
                  Published
                </option>

                <option value="draft">
                  Draft
                </option>
              </select>
            ) : (
              <div className="flex h-11 items-center rounded-xl border border-red-100 bg-red-50 px-3 text-sm font-medium text-red-700">
                Showing Trash only
              </div>
            )}

            {/* CLEAR */}

            {(searchTerm ||
              categoryFilter ||
              statusFilter) && (
              <button
                type="button"
                onClick={clearFilters}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
              >
                <X size={15} />
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ======================================================
            TABLE
        ====================================================== */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {loading ? (
            <div className="flex min-h-[350px] items-center justify-center">
              <div className="text-center">
                <RefreshCw
                  size={24}
                  className="mx-auto animate-spin text-[#b18a48]"
                />

                <p className="mt-3 text-sm text-slate-500">
                  {activeTab === "trash"
                    ? "Loading Trash..."
                    : "Loading knowledge articles..."}
                </p>
              </div>
            </div>
          ) : paginatedArticles.length === 0 ? (
            <div className="flex min-h-[350px] flex-col items-center justify-center px-6 text-center">

              {activeTab === "trash" ? (
                <Trash2
                  size={34}
                  className="text-slate-300"
                />
              ) : (
                <FileText
                  size={34}
                  className="text-slate-300"
                />
              )}

              <h3 className="mt-4 text-lg font-semibold text-slate-700">
                {activeTab === "trash"
                  ? "Trash is empty"
                  : "No articles found"}
              </h3>

              <p className="mt-1 max-w-md text-sm text-slate-400">
                {activeTab === "trash"
                  ? "Articles moved to Trash will appear here until they are restored or permanently deleted."
                  : "Try changing your filters or create a new knowledge article."}
              </p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1100px]">

                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50">

                      <th className="px-5 py-4 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        Article
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        Category
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        Status
                      </th>

                      <th className="px-4 py-4 text-left text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        Date
                      </th>

                      <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[1.5px] text-slate-500">
                        Actions
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {paginatedArticles.map(
                      (article) => {
                        const id =
                          article?._id;

                        const busy =
                          actionId === id;

                        const isTrash =
                          article?.isDeleted ===
                          true;

                        return (
                          <tr
                            key={id}
                            className="border-b border-slate-100 transition hover:bg-slate-50/70"
                          >

                            {/* ARTICLE */}

                            <td className="max-w-[500px] px-5 py-5">
                              <div className="flex items-start gap-3">

                                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-[#17342d] text-white">

                                  {article?.featuredImage ? (
                                    <img
                                      src={
                                        article.featuredImage
                                      }
                                      alt=""
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <FileText
                                      size={17}
                                    />
                                  )}

                                </div>

                                <div className="min-w-0">

                                  <div className="flex items-center gap-2">

                                    <h3 className="truncate text-sm font-semibold text-slate-800">
                                      {article?.title ||
                                        "Untitled Article"}
                                    </h3>

                                    {article?.featured &&
                                      !isTrash && (
                                        <Star
                                          size={
                                            13
                                          }
                                          className="shrink-0 fill-[#b18a48] text-[#b18a48]"
                                        />
                                      )}

                                  </div>

                                  <p className="mt-1 truncate text-xs text-slate-400">
                                    /knowledge/
                                    {article?.slug ||
                                      "—"}
                                  </p>

                                  <p className="mt-2 line-clamp-1 text-xs text-slate-500">
                                    {article?.shortDescription ||
                                      "No description"}
                                  </p>

                                  {isTrash &&
                                    article?.deletedAt && (
                                      <p className="mt-1 text-[10px] font-medium text-red-500">
                                        Trashed{" "}
                                        {formatDate(
                                          article.deletedAt
                                        )}
                                      </p>
                                    )}

                                </div>
                              </div>
                            </td>

                            {/* CATEGORY */}

                            <td className="px-4 py-5">
                              <span className="rounded-full bg-slate-100 px-3 py-1.5 text-[11px] font-medium text-slate-600">
                                {article?.category ||
                                  "General"}
                              </span>
                            </td>

                            {/* STATUS */}

                            <td className="px-4 py-5">

                              {isTrash ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1.5 text-[11px] font-semibold text-red-700">
                                  <Trash2
                                    size={12}
                                  />
                                  In Trash
                                </span>
                              ) : article?.status ===
                                "published" ? (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[11px] font-semibold text-emerald-700">
                                  <CheckCircle2
                                    size={12}
                                  />
                                  Published
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-[11px] font-semibold text-amber-700">
                                  <Clock3
                                    size={12}
                                  />
                                  Draft
                                </span>
                              )}

                            </td>

                            {/* DATE */}

                            <td className="whitespace-nowrap px-4 py-5 text-xs text-slate-500">

                              {formatDate(
                                isTrash
                                  ? article?.deletedAt ||
                                      article?.updatedAt
                                  : article?.updatedAt ||
                                      article?.publishDate ||
                                      article?.createdAt
                              )}

                            </td>

                            {/* ACTIONS */}

                            <td className="px-4 py-5">

                              <div className="flex items-center justify-end gap-2">

                                {/* VIEW */}

                                {!isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleView(
                                        article?.slug
                                      )
                                    }
                                    disabled={busy}
                                    title="View"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#17342d] hover:text-[#17342d] disabled:opacity-40"
                                  >
                                    <Eye
                                      size={15}
                                    />
                                  </button>
                                )}

                                {/* EDIT */}

                                {!isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleEdit(
                                        id
                                      )
                                    }
                                    disabled={busy}
                                    title="Edit"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-[#b18a48] hover:text-[#b18a48] disabled:opacity-40"
                                  >
                                    <Pencil
                                      size={15}
                                    />
                                  </button>
                                )}

                                {/* FEATURED */}

                                {!isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      toggleFeatured(
                                        id,
                                        article?.featured ===
                                          true
                                      )
                                    }
                                    disabled={busy}
                                    title={
                                      article?.featured
                                        ? "Remove featured"
                                        : "Make featured"
                                    }
                                    className={`flex h-9 w-9 items-center justify-center rounded-lg border transition disabled:opacity-40 ${
                                      article?.featured
                                        ? "border-[#b18a48]/30 bg-[#b18a48]/10 text-[#b18a48]"
                                        : "border-slate-200 text-slate-400 hover:border-[#b18a48] hover:text-[#b18a48]"
                                    }`}
                                  >
                                    <Star
                                      size={15}
                                      className={
                                        article?.featured
                                          ? "fill-current"
                                          : ""
                                      }
                                    />
                                  </button>
                                )}

                                {/* PUBLISH / DRAFT */}

                                {!isTrash &&
                                  (article?.status ===
                                  "published" ? (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        draftKnowledge(
                                          id
                                        )
                                      }
                                      disabled={
                                        busy
                                      }
                                      className="h-9 rounded-lg border border-amber-200 bg-amber-50 px-3 text-[11px] font-semibold text-amber-700 transition hover:bg-amber-100 disabled:opacity-40"
                                    >
                                      Draft
                                    </button>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        publishKnowledge(
                                          id
                                        )
                                      }
                                      disabled={
                                        busy
                                      }
                                      className="h-9 rounded-lg bg-[#17342d] px-3 text-[11px] font-semibold text-white transition hover:bg-[#0f2a23] disabled:opacity-40"
                                    >
                                      Publish
                                    </button>
                                  ))}

                                {/* SOFT DELETE */}

                                {!isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      moveToTrash(
                                        id
                                      )
                                    }
                                    disabled={busy}
                                    title="Move to Trash"
                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-100 text-red-500 transition hover:bg-red-50 disabled:opacity-40"
                                  >
                                    {busy ? (
                                      <RefreshCw
                                        size={
                                          15
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash2
                                        size={
                                          15
                                        }
                                      />
                                    )}
                                  </button>
                                )}

                                {/* RESTORE */}

                                {isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      restoreFromTrash(
                                        id
                                      )
                                    }
                                    disabled={busy}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 text-[11px] font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:opacity-40"
                                  >
                                    {busy ? (
                                      <RefreshCw
                                        size={
                                          14
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <RotateCcw
                                        size={
                                          14
                                        }
                                      />
                                    )}

                                    Restore
                                  </button>
                                )}

                                {/* DELETE FOREVER */}

                                {isTrash && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      deleteForever(
                                        id
                                      )
                                    }
                                    disabled={busy}
                                    className="inline-flex h-9 items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 text-[11px] font-semibold text-red-700 transition hover:bg-red-100 disabled:opacity-40"
                                  >
                                    {busy ? (
                                      <RefreshCw
                                        size={
                                          14
                                        }
                                        className="animate-spin"
                                      />
                                    ) : (
                                      <Trash
                                        size={
                                          14
                                        }
                                      />
                                    )}

                                    Delete Forever
                                  </button>
                                )}

                              </div>
                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>
                </table>
              </div>

              {/* ==================================================
                  PAGINATION
              ================================================== */}

              <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <p className="text-xs text-slate-500">

                  Showing{" "}

                  <span className="font-semibold text-slate-700">
                    {filteredArticles.length ===
                    0
                      ? 0
                      : (page - 1) *
                          ITEMS_PER_PAGE +
                        1}
                  </span>

                  {" "}–{" "}

                  <span className="font-semibold text-slate-700">
                    {Math.min(
                      page *
                        ITEMS_PER_PAGE,
                      filteredArticles.length
                    )}
                  </span>

                  {" "}of{" "}

                  <span className="font-semibold text-slate-700">
                    {
                      filteredArticles.length
                    }
                  </span>

                </p>

                <div className="flex items-center gap-2">

                  <button
                    type="button"
                    disabled={page <= 1}
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.max(
                            1,
                            current - 1
                          )
                      )
                    }
                    className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <span className="min-w-[70px] text-center text-xs font-semibold text-slate-600">
                    {page} / {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={
                      page >= totalPages
                    }
                    onClick={() =>
                      setPage(
                        (current) =>
                          Math.min(
                            totalPages,
                            current + 1
                          )
                      )
                    }
                    className="h-9 rounded-lg border border-slate-200 px-3 text-xs font-semibold text-slate-600 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                  </button>

                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

// ============================================================
// TAB BUTTON
// ============================================================

function TabButton({
  active,
  onClick,
  icon,
  label,
  count,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex h-10 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition ${
        active
          ? "bg-[#17342d] text-white shadow-sm"
          : "text-slate-600 hover:bg-slate-50"
      }`}
    >
      {icon}

      {label}

      {typeof count === "number" && (
        <span
          className={`rounded-full px-2 py-0.5 text-[10px] ${
            active
              ? "bg-white/15 text-white"
              : "bg-slate-100 text-slate-500"
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}