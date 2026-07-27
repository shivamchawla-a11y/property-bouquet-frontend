"use client";

import { useRouter } from "next/navigation";
import {
  X,
  Globe,
  Link2,
  Layers3,
  Building2,
  MapPin,
  Home,
  DollarSign,
  CheckCircle2,
  Trash2,
  Pencil,
} from "lucide-react";

export default function DetailsDrawer({
  open,
  page,
  onClose,
  publishLandingPage,
  updateLandingPage,
  deleteLandingPage,
}) {
  const router = useRouter();
  if (!open || !page) return null;

  return (
    <>
      {/* Overlay */}

      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}

      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto border-l border-gray-200 bg-white text-gray-900 shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-8 py-6">

          <div className="flex items-start justify-between">

            <div>

              <div className="mb-3 inline-flex rounded-full bg-[#fff7df] px-3 py-1 text-xs font-semibold text-[#b68b1d]">
                {page.pageType}
              </div>

              <h2 className="text-2xl font-bold">
                {page.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                /{page.slug}
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 hover:bg-gray-100"
            >
              <X />
            </button>

          </div>

        </div>

        <div className="space-y-8 p-8">

          {/* Stats */}

          <div className="grid grid-cols-3 gap-4">

            <div className="rounded-2xl bg-gray-50 p-5">

              <Layers3 className="mb-3 text-[#0f3b2e]" />

              <p className="text-sm text-gray-500">
                Properties
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {page.propertyCount}
              </h3>

            </div>

            <div className="rounded-2xl bg-gray-50 p-5">

              <Globe className="mb-3 text-green-600" />

              <p className="text-sm text-gray-500">
                SEO Score
              </p>

              <h3 className="mt-2 text-2xl font-bold">
                {page.seoScore}
              </h3>

            </div>

            <div className="rounded-2xl bg-gray-50 p-5">

              <Link2 className="mb-3 text-[#c9a64b]" />

              <p className="text-sm text-gray-500">
                Status
              </p>

              <h3 className="mt-2 text-xl font-bold capitalize">
                {page.status}
              </h3>

            </div>

          </div>

          {/* Filters */}

          <div>

            <h3 className="mb-4 text-lg font-bold">
              Applied Filters
            </h3>

            <div className="space-y-3">

              {page.filters?.developers?.length > 0 && (
                <div className="flex items-center gap-3 rounded-xl border p-4">

                  <Building2 className="text-[#0f3b2e]" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Developers
                    </p>

                    <p className="font-semibold">
                      {page.filters.developers.length}
                    </p>

                  </div>

                </div>
              )}

              {page.filters?.locations?.length > 0 && (
                <div className="flex items-center gap-3 rounded-xl border p-4">

                  <MapPin className="text-[#0f3b2e]" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Locations
                    </p>

                    <p className="font-semibold">
                      {page.filters.locations.length}
                    </p>

                  </div>

                </div>
              )}

              {page.filters?.categories?.length > 0 && (
                <div className="flex items-center gap-3 rounded-xl border p-4">

                  <Home className="text-[#0f3b2e]" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Categories
                    </p>

                    <p className="font-semibold">
                      {page.filters.categories.length}
                    </p>

                  </div>

                </div>
              )}

              {(page.filters?.budget?.min ||
                page.filters?.budget?.max) && (
                <div className="flex items-center gap-3 rounded-xl border p-4">

                  <DollarSign className="text-[#0f3b2e]" />

                  <div>

                    <p className="text-xs text-gray-500">
                      Budget
                    </p>

                    <p className="font-semibold">
                      ₹
                      {page.filters?.budget?.min || 0}
                      {" - "}
                      ₹
                      {page.filters?.budget?.max || 0}
                    </p>

                  </div>

                </div>
              )}

            </div>

          </div>

          {/* SEO */}

          <div>

            <h3 className="mb-4 text-lg font-bold">
              SEO Preview
            </h3>

            <div className="rounded-2xl border p-5">

              <p className="text-xl font-semibold text-blue-700">
                {page.seo?.metaTitle ||
                  page.title}
              </p>

              <p className="mt-2 text-sm text-green-700">
                https://propertybouquet.com/
                {page.slug}
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                {page.seo?.metaDescription ||
                  "No meta description generated."}
              </p>

            </div>

          </div>

          {/* Statistics */}

          {page.statistics && (
            <div>

              <h3 className="mb-4 text-lg font-bold">
                Statistics
              </h3>

              <div className="grid grid-cols-2 gap-4">

                <div className="rounded-xl border p-4">
                  Average Price
                  <div className="mt-2 font-bold">
                    ₹
                    {page.statistics.averagePrice?.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  Min Price
                  <div className="mt-2 font-bold">
                    ₹
                    {page.statistics.minPrice?.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  Max Price
                  <div className="mt-2 font-bold">
                    ₹
                    {page.statistics.maxPrice?.toLocaleString()}
                  </div>
                </div>

                <div className="rounded-xl border p-4">
                  Developers
                  <div className="mt-2 font-bold">
                    {page.statistics.developerCount}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Actions */}

          <div className="grid grid-cols-2 gap-4">

            <button
  onClick={() => publishLandingPage(page._id)}
  className="rounded-xl bg-[#0f3b2e] py-4 font-semibold text-white hover:bg-[#174b3a]"
>
  <div className="flex items-center justify-center gap-2">
    <CheckCircle2 size={18} />
    {page.status === "published"
      ? "Published"
      : "Publish"}
  </div>
</button>

            <button
  onClick={() =>
    updateLandingPage(page)
  }
  className="
    rounded-xl
    border
    py-4
    font-semibold
    text-gray-900
    hover:bg-gray-50
  "
>
  <div className="flex items-center justify-center gap-2">
    <Pencil size={18} />
    Edit SEO
  </div>
</button>

            <button
  onClick={() =>
    window.open(
      `https://propertybouquet.com/${page.slug}`,
      "_blank"
    )
  }
  className="
    rounded-xl
    border
    py-4
    font-semibold
    text-gray-900
    hover:bg-gray-50
  "
>
  Preview
</button>

            <button
  onClick={() => {

    const confirmDelete =
      window.confirm(
        "Are you sure you want to delete this landing page?"
      );

    if(confirmDelete){
      deleteLandingPage(page._id);
    }

  }}
  className="
    rounded-xl
    bg-red-600
    py-4
    font-semibold
    text-white
    hover:bg-red-700
  "
>
  <div className="flex items-center justify-center gap-2">
    <Trash2 size={18} />
    Delete
  </div>
</button>

          </div>

        </div>

      </div>
    </>
  );
}