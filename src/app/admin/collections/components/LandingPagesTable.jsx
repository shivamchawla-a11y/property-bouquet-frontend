"use client";

import {
  Eye,
  Pencil,
  Globe,
  FileClock,
  MoreHorizontal,
  ChevronRight,
} from "lucide-react";

export default function LandingPagesTable({
  pages = [],
  selectedPages = [],
  setSelectedPages,
  openDrawer,
}) {
  const demoPages =
    pages.length > 0
      ? pages
      : [
          {
            _id: "1",
            title: "DLF Apartments in Sector 56 Gurgaon",
            slug: "dlf-apartments-in-sector-56-gurgaon",
            pageType: "Developer + Location",
            propertyCount: 18,
            seoScore: 97,
            status: "draft",
          },
          {
            _id: "2",
            title: "Luxury Apartments in Gurgaon",
            slug: "luxury-apartments-gurgaon",
            pageType: "Category + Location",
            propertyCount: 36,
            seoScore: 94,
            status: "published",
          },
          {
            _id: "3",
            title: "M3M Projects in Golf Course Road",
            slug: "m3m-projects-golf-course-road",
            pageType: "Developer + Location",
            propertyCount: 14,
            seoScore: 92,
            status: "draft",
          },
        ];

  const toggleSelection = (id) => {
    if (selectedPages.includes(id)) {
      setSelectedPages(selectedPages.filter((item) => item !== id));
    } else {
      setSelectedPages([...selectedPages, id]);
    }
  };

  const toggleAll = () => {
    if (selectedPages.length === demoPages.length) {
      setSelectedPages([]);
    } else {
      setSelectedPages(demoPages.map((p) => p._id));
    }
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}

      <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            Landing Pages
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Review generated landing pages before publishing.
          </p>
        </div>

        <span className="rounded-full bg-[#0f3b2e] px-4 py-2 text-sm font-semibold text-white">
          {demoPages.length} Pages
        </span>

      </div>

      <div className="overflow-x-auto">

        <table className="min-w-full">

          <thead className="bg-[#fafafa]">

            <tr>

              <th className="w-14 px-6 py-4">

                <input
                  type="checkbox"
                  checked={
                    selectedPages.length === demoPages.length &&
                    demoPages.length > 0
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

              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Actions
              </th>

            </tr>

          </thead>

          <tbody>

            {demoPages.map((page) => (

              <tr
                key={page._id}
                className="cursor-pointer border-b border-gray-100 transition hover:bg-[#fafcfb]"
                onClick={() => openDrawer(page)}
              >

                <td
                  className="px-6 py-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedPages.includes(page._id)}
                    onChange={() => toggleSelection(page._id)}
                  />
                </td>

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

                <td className="px-6 py-5">

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {page.pageType}
                  </span>

                </td>

                <td className="px-6 py-5 text-center">

                  <span className="rounded-xl bg-[#f7f9f8] px-3 py-2 font-semibold text-[#0f3b2e]">
                    {page.propertyCount}
                  </span>

                </td>

                <td className="px-6 py-5 text-center">

                  <span className="rounded-xl bg-green-50 px-3 py-2 font-semibold text-green-700">
                    {page.seoScore}
                  </span>

                </td>

                <td className="px-6 py-5 text-center">

                  {page.status === "published" ? (
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

                <td
                  className="px-6 py-5"
                  onClick={(e) => e.stopPropagation()}
                >

                  <div className="flex justify-end gap-2">

                    <button
                      onClick={() => openDrawer(page)}
                      className="rounded-xl p-2 hover:bg-gray-100"
                    >
                      <Eye size={18} />
                    </button>

                    <button className="rounded-xl p-2 hover:bg-gray-100">
                      <Pencil size={18} />
                    </button>

                    <button className="rounded-xl p-2 hover:bg-gray-100">
                      <MoreHorizontal size={18} />
                    </button>

                    <button
                      onClick={() => openDrawer(page)}
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
    </div>
  );
}