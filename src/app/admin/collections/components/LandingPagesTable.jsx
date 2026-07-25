"use client";

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
    if (
      selectedPages.length === pages.length &&
      pages.length
    ) {
      setSelectedPages([]);
    } else {
      setSelectedPages(
        pages.map((page) => page._id)
      );
    }
  };

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

        <span className="rounded-full bg-[#0f3b2e] px-4 py-2 text-sm font-semibold text-white">
          {pages.length} Pages
        </span>

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
                      selectedPages.length ===
                        pages.length && pages.length > 0
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
                  Indexed
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

              {pages.map((page) => (

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

                    {page.status ===
                    "published" ? (
                      <span className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-sm font-semibold text-green-700">
                        <Globe size={14} />
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2 rounded-full bg-yellow-50 px-3 py-1 text-sm font-semibold text-yellow-700">
                        <FileClock size={14} />
                        Draft
                      </span>
                    )}

                  </td>

                  {/* Indexed */}

                  <td className="px-6 py-5 text-center">

                    {page.indexed ? (
                      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        Yes
                      </span>
                    ) : (
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                        No
                      </span>
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

                      <button className="rounded-xl p-2 text-gray-700 hover:bg-gray-100">
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

    </div>
  );
}