"use client";

import {
  X,
  Globe,
  Link2,
  Layers3,
  Building2,
  MapPin,
  Home,
  FileText,
  CheckCircle2,
  Trash2,
  Pencil,
  ExternalLink,
} from "lucide-react";

export default function DetailsDrawer({
  open,
  page,
  onClose,
}) {
  if (!open || !page) return null;

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 z-50 h-screen w-full max-w-2xl overflow-y-auto border-l border-gray-200 bg-white shadow-2xl">

        {/* Header */}

        <div className="sticky top-0 z-20 border-b border-gray-200 bg-white px-8 py-6">

          <div className="flex items-start justify-between">

            <div>

              <div className="mb-3 inline-flex rounded-full bg-[#fff7df] px-3 py-1 text-xs font-semibold text-[#b68b1d]">
                SEO Landing Page
              </div>

              <h2 className="text-2xl font-bold text-gray-900">
                {page.title}
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                /{page.slug}
              </p>

            </div>

            <button
              onClick={onClose}
              className="rounded-xl p-2 transition hover:bg-gray-100"
            >
              <X size={22} />
            </button>

          </div>

        </div>

        <div className="space-y-8 p-8">

          {/* Quick Stats */}

          <div className="grid grid-cols-3 gap-4">

            <div className="rounded-2xl bg-[#f7f9f8] p-5">

              <Layers3
                size={22}
                className="mb-3 text-[#0f3b2e]"
              />

              <p className="text-sm text-gray-500">
                Properties
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                {page.propertyCount}
              </h3>

            </div>

            <div className="rounded-2xl bg-[#f7f9f8] p-5">

              <Globe
                size={22}
                className="mb-3 text-green-600"
              />

              <p className="text-sm text-gray-500">
                SEO Score
              </p>

              <h3 className="mt-1 text-2xl font-bold">
                {page.seoScore}
              </h3>

            </div>

            <div className="rounded-2xl bg-[#f7f9f8] p-5">

              <Link2
                size={22}
                className="mb-3 text-[#c9a64b]"
              />

              <p className="text-sm text-gray-500">
                Status
              </p>

              <h3 className="mt-1 text-lg font-bold capitalize">
                {page.status}
              </h3>

            </div>

          </div>

          {/* Generated Filters */}

          <div>

            <h3 className="mb-4 text-lg font-bold">
              Generated Filters
            </h3>

            <div className="space-y-3">

              <div className="flex items-center gap-3 rounded-2xl border p-4">

                <Building2
                  size={20}
                  className="text-[#0f3b2e]"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Developer
                  </p>

                  <p className="font-semibold">
                    DLF
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border p-4">

                <MapPin
                  size={20}
                  className="text-[#0f3b2e]"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Location
                  </p>

                  <p className="font-semibold">
                    Sector 56 Gurgaon
                  </p>
                </div>

              </div>

              <div className="flex items-center gap-3 rounded-2xl border p-4">

                <Home
                  size={20}
                  className="text-[#0f3b2e]"
                />

                <div>
                  <p className="text-xs text-gray-500">
                    Category
                  </p>

                  <p className="font-semibold">
                    Apartments
                  </p>
                </div>

              </div>

            </div>

          </div>

          {/* SEO */}

          <div>

            <h3 className="mb-4 text-lg font-bold">
              SEO Preview
            </h3>

            <div className="rounded-2xl border p-5">

              <p className="text-xl font-semibold text-[#1a0dab]">
                {page.title}
              </p>

              <p className="mt-2 text-sm text-green-700">
                https://propertybouquet.com/{page.slug}
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-600">
                This landing page will automatically display all
                matching properties based on the generated filters.
                Meta title and description can be customized before
                publishing.
              </p>

            </div>

          </div>

          {/* Matching Properties */}

          <div>

            <div className="mb-4 flex items-center justify-between">

              <h3 className="text-lg font-bold">
                Matching Properties
              </h3>

              <span className="rounded-full bg-[#0f3b2e] px-3 py-1 text-sm font-semibold text-white">
                {page.propertyCount}
              </span>

            </div>

            <div className="space-y-3">

              {[
                "DLF The Arbour",
                "DLF Privana",
                "DLF Crest",
              ].map((property) => (

                <div
                  key={property}
                  className="flex items-center justify-between rounded-2xl border p-4"
                >

                  <div>

                    <h4 className="font-semibold">
                      {property}
                    </h4>

                    <p className="text-sm text-gray-500">
                      Published
                    </p>

                  </div>

                  <ExternalLink
                    size={18}
                    className="text-gray-400"
                  />

                </div>

              ))}

            </div>

          </div>

          {/* Actions */}

          <div className="grid grid-cols-2 gap-4">

            <button className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] py-4 font-semibold text-black transition hover:scale-[1.02]">
              <CheckCircle2 size={18} />
              Publish
            </button>

            <button className="flex items-center justify-center gap-2 rounded-2xl border py-4 font-semibold transition hover:bg-gray-50">
              <Pencil size={18} />
              Edit SEO
            </button>

            <button className="flex items-center justify-center gap-2 rounded-2xl border py-4 font-semibold transition hover:bg-gray-50">
              <Globe size={18} />
              Preview
            </button>

            <button className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 py-4 font-semibold text-white transition hover:bg-red-700">
              <Trash2 size={18} />
              Delete
            </button>

          </div>

        </div>

      </div>
    </>
  );
}