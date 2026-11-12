
"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  Mail,
  Users,
  UserCheck,
  UserX,
  Search,
  RefreshCw,
  Trash2,
  CalendarDays,
  X,
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Inbox,
  Filter,
} from "lucide-react";

const API_URL = "/api/newsletter";
const PAGE_SIZE = 10;

// =====================================================
// DATE FORMATTER
// =====================================================

const formatDate = (date) => {
  if (!date) return "—";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "—";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// =====================================================
// MAIN PAGE
// =====================================================

export default function SubscribersPage() {
  const [subscribers, setSubscribers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sourceFilter, setSourceFilter] = useState("All");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedSubscriber, setSelectedSubscriber] =
    useState(null);

  const [deleting, setDeleting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  // =====================================================
  // FETCH SUBSCRIBERS
  // =====================================================

  const fetchSubscribers = useCallback(async (showRefresh = false) => {
    try {
      setError("");
      setNotice("");

      if (showRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      const response = await fetch(API_URL, {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to fetch subscribers"
        );
      }

      if (!Array.isArray(result.data)) {
        throw new Error("Invalid subscriber data received");
      }

      setSubscribers(result.data);
    } catch (err) {
      console.error("Fetch subscribers error:", err);

      setError(
        err.message || "Unable to load newsletter subscribers."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // =====================================================
  // INITIAL FETCH
  // =====================================================

  useEffect(() => {
    fetchSubscribers();
  }, [fetchSubscribers]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalSubscribers = subscribers.length;

  const activeSubscribers = subscribers.filter(
    (item) => item.status === "Subscribed"
  ).length;

  const unsubscribed = subscribers.filter(
    (item) => item.status === "Unsubscribed"
  ).length;

  // =====================================================
  // SOURCE OPTIONS
  // =====================================================

  const sources = useMemo(() => {
    return [
      ...new Set(
        subscribers
          .map((item) => item.source || "Website Footer")
          .filter(Boolean)
      ),
    ].sort();
  }, [subscribers]);

  // =====================================================
  // SEARCH AND FILTER
  // =====================================================

  const filteredSubscribers = useMemo(() => {
    return subscribers.filter((subscriber) => {
      const email = (subscriber.email || "").toLowerCase();

      const source = (
        subscriber.source || "Website Footer"
      ).toLowerCase();

      const searchValue = search.trim().toLowerCase();

      const matchesSearch =
        !searchValue ||
        email.includes(searchValue) ||
        source.includes(searchValue);

      const matchesStatus =
        statusFilter === "All" ||
        subscriber.status === statusFilter;

      const matchesSource =
        sourceFilter === "All" ||
        (subscriber.source || "Website Footer") === sourceFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesSource
      );
    });
  }, [subscribers, search, statusFilter, sourceFilter]);

  // =====================================================
  // PAGINATION
  // =====================================================

  const totalPages = Math.max(
    1,
    Math.ceil(filteredSubscribers.length / PAGE_SIZE)
  );

  const safePage = Math.min(currentPage, totalPages);

  const startIndex = (safePage - 1) * PAGE_SIZE;

  const paginatedSubscribers = filteredSubscribers.slice(
    startIndex,
    startIndex + PAGE_SIZE
  );

  // =====================================================
  // DELETE SUBSCRIBER
  // =====================================================

  const handleDelete = async () => {
    if (!selectedSubscriber?._id || deleting) return;

    try {
      setDeleting(true);
      setDeletingId(selectedSubscriber._id);
      setError("");

      const response = await fetch(
        `${API_URL}/${encodeURIComponent(selectedSubscriber._id)}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result = await response.json();

      if (!response.ok || result.success === false) {
        throw new Error(
          result.message || "Failed to delete subscriber"
        );
      }

      setSubscribers((previous) =>
        previous.filter(
          (item) => item._id !== selectedSubscriber._id
        )
      );

      setSelectedSubscriber(null);

      setNotice("Subscriber deleted successfully.");

    } catch (err) {
      console.error("Delete subscriber error:", err);

      setError(
        err.message || "Unable to delete subscriber."
      );
    } finally {
      setDeleting(false);
      setDeletingId(null);
    }
  };

  // =====================================================
  // CSV EXPORT
  // =====================================================

  const exportCSV = () => {
    const headers = [
      "Email",
      "Source",
      "Status",
      "Subscribed At",
      "Created At",
    ];

    const rows = filteredSubscribers.map((item) => [
      item.email || "",
      item.source || "Website Footer",
      item.status || "",
      formatDate(item.subscribedAt),
      formatDate(item.createdAt),
    ]);

    const csvContent = [
      headers,
      ...rows,
    ]
      .map((row) =>
        row
          .map((value) =>
            `"${String(value).replace(/"/g, '""')}"`
          )
          .join(",")
      )
      .join("\n");

    const blob = new Blob(
      ["\uFEFF" + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = "property-bouquet-subscribers.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // =====================================================
  // RESET FILTERS
  // =====================================================

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setSourceFilter("All");
    setCurrentPage(1);
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#f7f9f8]">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col justify-between gap-5 lg:flex-row lg:items-center">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0f3b2e] text-white shadow-lg">
              <Mail size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-[#123b2e] sm:text-3xl">
                Newsletter Subscribers
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Manage your Property Bouquet newsletter audience.
              </p>
            </div>

          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">

          <button
            type="button"
            onClick={() => fetchSubscribers(true)}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm font-semibold text-gray-700 shadow-sm transition hover:border-[#c9a64b] hover:text-[#0f3b2e] disabled:opacity-50"
          >
            <RefreshCw
              size={16}
              className={refreshing ? "animate-spin" : ""}
            />

            Refresh
          </button>

          <button
            type="button"
            onClick={exportCSV}
            disabled={filteredSubscribers.length === 0}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-4 py-3 text-sm font-bold text-black shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Download size={17} />
            Export CSV
          </button>

        </div>

      </div>

      {/* =================================================
          ERROR MESSAGE
      ================================================= */}

      {error && (
        <div
          role="alert"
          className="mb-6 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
          <AlertCircle size={19} />
          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="ml-auto"
            aria-label="Dismiss error"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =================================================
          SUCCESS MESSAGE
      ================================================= */}

      {notice && (
        <div
          role="status"
          className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700"
        >
          <CheckCircle2 size={19} />
          {notice}

          <button
            type="button"
            onClick={() => setNotice("")}
            className="ml-auto"
            aria-label="Dismiss message"
          >
            <X size={17} />
          </button>
        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">

        {/* TOTAL */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Total Subscribers
              </p>

              <h2 className="mt-3 text-3xl font-bold text-[#123b2e]">
                {loading ? "—" : totalSubscribers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                All newsletter records
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#e8f0ec] text-[#0f3b2e]">
              <Users size={26} />
            </div>

          </div>

          <div className="mt-5 h-1 w-full rounded-full bg-[#0f3b2e]" />

        </div>

        {/* ACTIVE */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Active Subscribers
              </p>

              <h2 className="mt-3 text-3xl font-bold text-emerald-600">
                {loading ? "—" : activeSubscribers}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Currently subscribed
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <UserCheck size={26} />
            </div>

          </div>

          <div className="mt-5 h-1 w-full rounded-full bg-emerald-500" />

        </div>

        {/* UNSUBSCRIBED */}

        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">

          <div className="flex items-center justify-between">

            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Unsubscribed
              </p>

              <h2 className="mt-3 text-3xl font-bold text-red-500">
                {loading ? "—" : unsubscribed}
              </h2>

              <p className="mt-2 text-xs text-gray-400">
                Inactive subscribers
              </p>
            </div>

            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <UserX size={26} />
            </div>

          </div>

          <div className="mt-5 h-1 w-full rounded-full bg-red-400" />

        </div>

      </div>

      {/* =================================================
          SUBSCRIBER TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

        {/* TABLE HEADER */}

        <div className="flex flex-col justify-between gap-4 border-b border-gray-100 p-5 lg:flex-row lg:items-center">

          <div>
            <h2 className="text-lg font-bold text-[#123b2e]">
              Subscriber Directory
            </h2>

            <p className="mt-1 text-xs text-gray-400">
              Search, filter and manage newsletter subscribers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">

            <span className="rounded-lg bg-[#f7f9f8] px-3 py-2">
              {filteredSubscribers.length} records found
            </span>

          </div>

        </div>

        {/* FILTERS */}

        <div className="grid grid-cols-1 gap-3 border-b border-gray-100 bg-[#fcfdfc] p-5 md:grid-cols-3">

          {/* SEARCH */}

          <div className="relative">

            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search email or source..."
              className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#c9a64b] focus:ring-2 focus:ring-[#c9a64b]/10"
            />

          </div>

          {/* STATUS */}

          <div className="relative">

            <Filter
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#c9a64b]"
            >
              <option value="All">All Status</option>
              <option value="Subscribed">Subscribed</option>
              <option value="Unsubscribed">Unsubscribed</option>
            </select>

          </div>

          {/* SOURCE */}

          <div className="relative">

            <select
              value={sourceFilter}
              onChange={(e) => {
                setSourceFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white px-4 text-sm outline-none transition focus:border-[#c9a64b]"
            >
              <option value="All">All Sources</option>

              {sources.map((source) => (
                <option key={source} value={source}>
                  {source}
                </option>
              ))}

            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px] border-collapse text-left">

            <thead>
              <tr className="bg-[#f7f9f8] text-[11px] font-bold uppercase tracking-wider text-gray-500">

                <th className="px-6 py-4">
                  Subscriber
                </th>

                <th className="px-6 py-4">
                  Source
                </th>

                <th className="px-6 py-4">
                  Status
                </th>

                <th className="px-6 py-4">
                  Subscription Date
                </th>

                <th className="px-6 py-4 text-right">
                  Action
                </th>

              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">

              {/* LOADING */}

              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <RefreshCw
                      size={25}
                      className="mx-auto animate-spin text-[#c9a64b]"
                    />

                    <p className="mt-3 text-sm text-gray-400">
                      Loading subscribers...
                    </p>
                  </td>
                </tr>
              )}

              {/* EMPTY */}

              {!loading && paginatedSubscribers.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-16 text-center"
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f7f9f8] text-gray-400">
                      <Inbox size={25} />
                    </div>

                    <h3 className="mt-4 text-base font-semibold text-gray-700">
                      No subscribers found
                    </h3>

                    <p className="mt-2 text-sm text-gray-400">
                      {search || statusFilter !== "All" || sourceFilter !== "All"
                        ? "Try adjusting your search or filters."
                        : "Newsletter subscriptions will appear here."}
                    </p>

                    {(search || statusFilter !== "All" || sourceFilter !== "All") && (
                      <button
                        type="button"
                        onClick={resetFilters}
                        className="mt-4 text-sm font-semibold text-[#a77d27] hover:underline"
                      >
                        Clear filters
                      </button>
                    )}

                  </td>
                </tr>
              )}

              {/* SUBSCRIBERS */}

              {!loading && paginatedSubscribers.map((subscriber) => {

                const isSubscribed =
                  subscriber.status === "Subscribed";

                return (
                  <tr
                    key={subscriber._id}
                    className="group transition hover:bg-[#fcfdfc]"
                  >

                    {/* EMAIL */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#eaf1ed] text-sm font-bold uppercase text-[#0f3b2e]">
                          {(subscriber.email || "U")
                            .charAt(0)}
                        </div>

                        <div className="min-w-0">
                          <p className="max-w-[300px] break-all text-sm font-semibold text-gray-800">
                            {subscriber.email}
                          </p>

                          <p className="mt-1 text-[11px] text-gray-400">
                            Subscriber ID:{" "}
                            {(subscriber._id || "").slice(-8)}
                          </p>
                        </div>

                      </div>

                    </td>

                    {/* SOURCE */}

                    <td className="px-6 py-5">

                      <span className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-xs font-medium text-gray-600">
                        {subscriber.source || "Website Footer"}
                      </span>

                    </td>

                    {/* STATUS */}

                    <td className="px-6 py-5">

                      {isSubscribed ? (
                        <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">

                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />

                          Subscribed

                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 rounded-full bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">

                          <span className="h-1.5 w-1.5 rounded-full bg-red-500" />

                          Unsubscribed

                        </span>
                      )}

                    </td>

                    {/* DATE */}

                    <td className="px-6 py-5">

                      <div className="flex items-center gap-2 text-sm text-gray-600">

                        <CalendarDays
                          size={15}
                          className="text-gray-400"
                        />

                        {formatDate(subscriber.subscribedAt)}

                      </div>

                    </td>

                    {/* ACTION */}

                    <td className="px-6 py-5 text-right">

                      <button
                        type="button"
                        onClick={() => setSelectedSubscriber(subscriber)}
                        disabled={
                          deletingId === subscriber._id
                        }
                        title="Delete subscriber"
                        aria-label={`Delete ${subscriber.email}`}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-red-100 text-red-500 transition hover:border-red-500 hover:bg-red-50 disabled:opacity-50"
                      >
                        <Trash2 size={16} />
                      </button>

                    </td>

                  </tr>
                );
              })}

            </tbody>

          </table>

        </div>

        {/* =================================================
            PAGINATION
        ================================================= */}

        {!loading && filteredSubscribers.length > 0 && (

          <div className="flex flex-col justify-between gap-4 border-t border-gray-100 px-5 py-5 sm:flex-row sm:items-center">

            <p className="text-xs text-gray-500">

              Showing{" "}
              <strong className="text-gray-800">
                {startIndex + 1}
              </strong>

              {" "}to{" "}

              <strong className="text-gray-800">
                {Math.min(
                  startIndex + PAGE_SIZE,
                  filteredSubscribers.length
                )}
              </strong>

              {" "}of{" "}

              <strong className="text-gray-800">
                {filteredSubscribers.length}
              </strong>

              {" "}subscribers

            </p>

            <div className="flex items-center gap-2">

              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={17} />
              </button>

              <span className="px-3 text-xs font-semibold text-gray-600">
                Page {safePage} of {totalPages}
              </span>

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) =>
                    Math.min(totalPages, page + 1)
                  )
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={17} />
              </button>

            </div>

          </div>

        )}

      </div>

      {/* =================================================
          DELETE CONFIRMATION MODAL
      ================================================= */}

      {selectedSubscriber && (

        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget &&
              !deleting
            ) {
              setSelectedSubscriber(null);
            }
          }}
        >

          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-subscriber-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl"
          >

            <div className="flex items-start justify-between">

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-500">
                <Trash2 size={23} />
              </div>

              <button
                type="button"
                onClick={() => setSelectedSubscriber(null)}
                disabled={deleting}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>

            </div>

            <h2
              id="delete-subscriber-title"
              className="mt-5 text-xl font-bold text-gray-900"
            >
              Delete Subscriber?
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Are you sure you want to permanently delete this
              newsletter subscriber?
            </p>

            <div className="mt-4 break-all rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm font-semibold text-gray-700">
              {selectedSubscriber.email}
            </div>

            <p className="mt-3 text-xs text-red-500">
              This action cannot be undone.
            </p>

            <div className="mt-7 flex gap-3">

              <button
                type="button"
                onClick={() => setSelectedSubscriber(null)}
                disabled={deleting}
                className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {deleting ? "Deleting..." : "Delete Subscriber"}
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}
