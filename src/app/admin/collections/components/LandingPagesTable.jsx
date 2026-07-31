"use client";

import { useEffect, useMemo, useState } from "react";

import {
  Eye,
  Pencil,
  Globe,
  FileClock,
  MoreHorizontal,
  ChevronRight,
  SearchX,
} from "lucide-react";

export default function LandingPagesTable({
  pages = [],
  selectedPages = [],
  setSelectedPages,
  openDrawer,
  publishLandingPage,
  unpublishLandingPage,
}) {
  // =====================================================
  // SELECTION
  // =====================================================

  const toggleSelection = (id) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(
        selectedPages.filter((item) => item !== id)
      );
    } else {
      setSelectedPages([...selectedPages, id]);
    }
  };

  const toggleAll = () => {
  const currentIds = paginatedPages.map((page) => page._id);

  const allSelected = currentIds.every((id) =>
    selectedPages.includes(id)
  );

  if (allSelected) {
    setSelectedPages(
      selectedPages.filter(
        (id) => !currentIds.includes(id)
      )
    );
  } else {
    setSelectedPages([
      ...new Set([
        ...selectedPages,
        ...currentIds,
      ]),
    ]);
  }
};

  const [currentPage, setCurrentPage] = useState(1);
const [itemsPerPage, setItemsPerPage] = useState(10);
const [sortBy, setSortBy] = useState("newest");

const totalPages = Math.ceil(
  pages.length / itemsPerPage
);

const sortedPages = useMemo(() => {
  const data = [...pages];

  switch (sortBy) {
    case "newest":
      data.sort(
        (a, b) =>
          new Date(b.createdAt) -
          new Date(a.createdAt)
      );
      break;

    case "oldest":
      data.sort(
        (a, b) =>
          new Date(a.createdAt) -
          new Date(b.createdAt)
      );
      break;

    case "properties-desc":
      data.sort(
        (a, b) =>
          (b.propertyCount || 0) -
          (a.propertyCount || 0)
      );
      break;

    case "properties-asc":
      data.sort(
        (a, b) =>
          (a.propertyCount || 0) -
          (b.propertyCount || 0)
      );
      break;

    case "seo-desc":
      data.sort(
        (a, b) =>
          (b.seoScore || 0) -
          (a.seoScore || 0)
      );
      break;

    case "seo-asc":
      data.sort(
        (a, b) =>
          (a.seoScore || 0) -
          (b.seoScore || 0)
      );
      break;

    case "az":
      data.sort((a, b) =>
        a.title.localeCompare(b.title)
      );
      break;

    case "za":
      data.sort((a, b) =>
        b.title.localeCompare(a.title)
      );
      break;

    case "published":
      data.sort((a, b) =>
        a.status === b.status
          ? 0
          : a.status === "published"
          ? -1
          : 1
      );
      break;

    case "draft":
      data.sort((a, b) =>
        a.status === b.status
          ? 0
          : a.status === "draft"
          ? -1
          : 1
      );
      break;

    case "updated":
      data.sort(
        (a, b) =>
          new Date(b.updatedAt) -
          new Date(a.updatedAt)
      );
      break;

    default:
      break;
  }

  return data;
}, [pages, sortBy]);

const paginatedPages = useMemo(() => {
  const start = (currentPage - 1) * itemsPerPage;

  return sortedPages.slice(
    start,
    start + itemsPerPage
  );
}, [sortedPages, currentPage, itemsPerPage]);

const startItem =
  pages.length === 0
    ? 0
    : (currentPage - 1) * itemsPerPage + 1;

const endItem = Math.min(
  currentPage * itemsPerPage,
  pages.length
);

const getVisiblePages = () => {
  const pages = [];

  if (totalPages <= 7) {
    return Array.from(
      { length: totalPages },
      (_, i) => i + 1
    );
  }

  pages.push(1);

  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    pages.push("left-ellipsis");
  }

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (end < totalPages - 1) {
    pages.push("right-ellipsis");
  }

  pages.push(totalPages);

  return pages;
};

useEffect(() => {
  if (currentPage > totalPages && totalPages > 0) {
    setCurrentPage(totalPages);
  }
}, [currentPage, totalPages]);

useEffect(() => {
  setCurrentPage(1);
}, [pages.length]);

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

  <div>
    <h2 className="text-xl font-bold text-gray-900">
      Landing Pages
    </h2>

    <p className="mt-1 text-sm text-gray-500">
      Manage all generated landing pages.
    </p>
  </div>

  <div className="flex items-center gap-3">

    <select
      value={sortBy}
      onChange={(e) => {
        setSortBy(e.target.value);
        setCurrentPage(1);
      }}
      className="rounded-xl border border-gray-300 bg-white px-4 py-2 text-sm text-gray-900 outline-none"
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="properties-desc">Most Properties</option>
      <option value="properties-asc">Least Properties</option>
      <option value="seo-desc">Highest SEO Score</option>
      <option value="seo-asc">Lowest SEO Score</option>
      <option value="published">Published First</option>
      <option value="draft">Draft First</option>
      <option value="updated">Recently Updated</option>
      <option value="az">Title A → Z</option>
      <option value="za">Title Z → A</option>
    </select>

    <span className="rounded-full bg-[#0f3b2e] px-4 py-2 text-sm font-semibold text-white">
      {pages.length} Pages
    </span>

  </div>

</div>

      {/* ===================================================== */}
      {/* EMPTY */}
      {/* ===================================================== */}

      {!pages.length ? (
        <div className="flex flex-col items-center justify-center py-20">

          <SearchX
            size={55}
            className="text-gray-300"
          />

          <h3 className="mt-5 text-xl font-bold text-gray-900">
            No Landing Pages
          </h3>

          <p className="mt-2 max-w-md text-center text-gray-500">
            Click <b>Generate Collections</b> to automatically
            discover all landing pages from your property database.
          </p>

        </div>
      ) : (
        <div className="overflow-x-auto">

          <table className="min-w-full">

            {/* ===================================================== */}
            {/* HEAD */}
            {/* ===================================================== */}

            <thead className="bg-[#fafafa]">

              <tr>

                <th className="w-14 px-6 py-4">
                  <input
                    type="checkbox"
                    checked={
                    paginatedPages.length > 0 &&
                    paginatedPages.every((page) =>
                      selectedPages.includes(page._id)
                    )
                  }
                    onChange={toggleAll}
                  />
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Landing Page
                </th>

                <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Type
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Properties
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  SEO
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Status
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Generated
                </th>

                <th className="px-6 py-4 text-center text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Updated
                </th>

                <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                  Actions
                </th>

              </tr>

            </thead>

            {/* ===================================================== */}
            {/* BODY */}
            {/* ===================================================== */}

            <tbody>

              {paginatedPages.map((page) => (

                <tr
                  key={page._id}
                  onClick={() => openDrawer(page)}
                  className="cursor-pointer border-b border-gray-100 transition hover:bg-[#fafcfb]"
                >

                  {/* Checkbox */}

                  <td
                    className="px-6 py-5"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >
                    <input
                      type="checkbox"
                      checked={selectedPages.includes(
                        page._id
                      )}
                      onChange={() =>
                        toggleSelection(page._id)
                      }
                    />
                  </td>

                  {/* Title */}

                  <td className="px-6 py-5">

                    <div>

                      <h3 className="font-semibold text-gray-900">
                        {page.title}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        /{page.slug}
                      </p>

                    </div>

                  </td>

                  {/* Type */}

                  <td className="px-6 py-5">

                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {page.pageType}
                    </span>

                  </td>

                  {/* Property Count */}

                  <td className="px-6 py-5 text-center">

                    <span className="rounded-xl bg-[#f7f9f8] px-3 py-2 font-semibold text-[#0f3b2e]">
                      {page.propertyCount}
                    </span>

                  </td>

                  {/* SEO */}

                  <td className="px-6 py-5 text-center">

                    <span className="rounded-xl bg-green-50 px-3 py-2 font-semibold text-green-700">
                      {page.seoScore || 0}
                    </span>

                  </td>

                  {/* Status */}

<td className="px-6 py-5 text-center">

  {page.status === "published" ? (
    <button
      onClick={(e) => {
        e.stopPropagation();
        unpublishLandingPage(page._id);
      }}
      className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700 transition hover:bg-green-100"
    >
      <Globe size={14} />
      Published
    </button>
  ) : (
    <button
      onClick={(e) => {
        e.stopPropagation();
        publishLandingPage(page._id);
      }}
      className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700 transition hover:bg-yellow-100"
    >
      <FileClock size={14} />
      Draft
    </button>
  )}

</td>


                  {/* Generated */}

                  <td className="px-6 py-5 text-center">

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        page.generated
                          ? "bg-blue-100 text-blue-700"
                          : "bg-purple-100 text-purple-700"
                      }`}
                    >
                      {page.generated
                        ? "Generated"
                        : "Manual"}
                    </span>

                  </td>

                  {/* Updated */}

                  <td className="px-6 py-5 text-center text-sm text-gray-600">

                    {page.updatedAt
                      ? new Date(
                          page.updatedAt
                        ).toLocaleDateString()
                      : "-"}

                  </td>

                  {/* Actions */}

                  <td
                    className="px-6 py-5"
                    onClick={(e) =>
                      e.stopPropagation()
                    }
                  >

                    <div className="flex justify-end gap-2">

                      <button
                        onClick={() =>
                          openDrawer(page)
                        }
                        className="rounded-xl p-2 text-gray-700 hover:bg-gray-100"
                      >
                        <Eye size={18} />
                      </button>

                      <button
    onClick={(e) => {
        e.stopPropagation();
        openDrawer(page);
    }}
    className="rounded-xl p-2 text-gray-700 hover:bg-gray-100"
>
    <Pencil size={18} />
</button>

                      <button className="rounded-xl p-2 text-gray-700 hover:bg-gray-100">
                        <MoreHorizontal size={18} />
                      </button>

                      <button
                        onClick={() =>
                          openDrawer(page)
                        }
                        className="rounded-xl bg-[#0f3b2e] p-2 text-white"
                      >
                        <ChevronRight size={18} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>
        
      )}
<div className="flex flex-col gap-5 border-t border-gray-100 bg-white px-6 py-5 md:flex-row md:items-center md:justify-between">

  <div className="flex items-center gap-3 text-sm text-gray-600">

    <span>
      Showing {startItem}-{endItem} of {pages.length}
    </span>

    <select
      value={itemsPerPage}
      onChange={(e) => {
        setItemsPerPage(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="rounded-xl border border-gray-300 bg-white px-3 py-2 text-gray-900 outline-none"
    >
      <option value={10}>10 / page</option>
      <option value={25}>25 / page</option>
      <option value={50}>50 / page</option>
      <option value={100}>100 / page</option>
    </select>

  </div>

  <div className="flex items-center gap-2">

    <button
      disabled={currentPage === 1}
      onClick={() =>
  setCurrentPage((p) => Math.max(1, p - 1))
}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Prev
    </button>

    {getVisiblePages().map((page) =>
  typeof page === "string" ? (
    <span
      key={page}
      className="px-2 text-gray-400"
    >
      ...
    </span>
  ) : (
    <button
      key={page}
      onClick={() => setCurrentPage(page)}
      className={`h-10 w-10 rounded-xl text-sm font-semibold transition ${
        currentPage === page
          ? "bg-[#0f3b2e] text-white"
          : "border border-gray-200 bg-white text-gray-700 hover:bg-gray-100"
      }`}
    >
      {page}
    </button>
  )
)}

    <button
      disabled={currentPage === totalPages}
      onClick={() =>
  setCurrentPage((p) =>
    Math.min(totalPages, p + 1)
  )
}
      className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
    >
      Next
    </button>

  </div>

</div>
    </div>
  );
}