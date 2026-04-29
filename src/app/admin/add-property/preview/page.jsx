"use client";

import { useEffect, useState } from "react";

export default function PreviewPage() {
  const [form, setForm] = useState(null);

  useEffect(() => {
    const data = localStorage.getItem("previewData");
    if (data) {
      setForm(JSON.parse(data));
    }
  }, []);

  if (!form) return <p className="p-10">No Data</p>;

  const {
    media = {},
    coreDetails = {},
    overview = {},
    unitConfigurations = [],
    locationData = {},
    gatedContent = {},
    faqs = [],
    keyMetrics = {},
  } = form;

  return (
    <div className="bg-lightBg min-h-screen">

      {/* ================= HERO ================= */}
      <div
        className="h-[500px] relative bg-cover bg-center flex items-end"
        style={{
          backgroundImage: media?.heroImageUrl
            ? `url(${media.heroImageUrl})`
            : "linear-gradient(#000,#222)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative p-10 text-white">
          <h1 className="text-4xl font-bold">
            {coreDetails?.title || "Property Title"}
          </h1>

          <p className="text-gray-300 mt-1">
            {locationData?.address || "Location not provided"}
          </p>

          <div className="flex gap-4 mt-4">
            {keyMetrics?.status && (
              <span className="badge">{keyMetrics.status}</span>
            )}

            {keyMetrics?.possession && (
              <span className="badge-secondary">
                {keyMetrics.possession}
              </span>
            )}
          </div>

          {(coreDetails?.startingPrice || coreDetails?.maxPrice) && (
            <p className="text-2xl font-semibold mt-4">
              ₹ {coreDetails.startingPrice || "—"} -{" "}
              {coreDetails.maxPrice || "—"}
            </p>
          )}
        </div>
      </div>

      {/* ================= OVERVIEW ================= */}
      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            About the Property
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {overview?.description || "No description provided"}
          </p>

          {overview?.highlights?.filter(Boolean).length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-6">
              {overview.highlights
                .filter((h) => h)
                .map((h, i) => (
                  <div key={i} className="highlight-card">
                    ✔ {h}
                  </div>
                ))}
            </div>
          )}
        </div>

        {overview?.aboutImageUrl && (
          <img
            src={overview.aboutImageUrl}
            className="rounded-2xl shadow-card"
          />
        )}
      </div>

      {/* ================= CONFIG ================= */}
      {unitConfigurations?.length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-6">

            <h2 className="text-2xl font-bold text-primary mb-6">
              Unit Configurations
            </h2>

            <div className="space-y-4">
              {unitConfigurations.map((u, i) => (
                <div key={i} className="config-card">
                  <div>
                    <p className="font-semibold">{u.unitType}</p>
                    <p className="text-sm text-gray-500">{u.area}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-primary">
                      ₹ {u.price || "—"}
                    </p>
                    <p className="text-sm text-gray-500">
                      {u.paymentPlan}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ================= GALLERY ================= */}
      {media?.gallery?.filter(Boolean).length > 0 && (
        <div className="max-w-6xl mx-auto p-10">
          <h2 className="text-2xl font-bold text-primary mb-6">
            Gallery
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {media.gallery
              .filter((img) => img)
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="gallery-img"
                />
              ))}
          </div>
        </div>
      )}

      {/* ================= FLOOR PLANS ================= */}
      {gatedContent?.floorPlans?.filter(fp => fp.image).length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-6xl mx-auto px-6">

            <h2 className="text-2xl font-bold text-primary mb-6">
              Floor Plans
            </h2>

            <div className="grid md:grid-cols-3 gap-6">
              {gatedContent.floorPlans.map((fp, i) => (
                fp.image && (
                  <div key={i} className="card">
                    <img src={fp.image} className="h-48 w-full object-cover" />
                    <div className="p-4">
                      <p className="font-semibold">{fp.title}</p>
                    </div>
                  </div>
                )
              ))}
            </div>

          </div>
        </div>
      )}

      {/* ================= LOCATION ================= */}
      <div className="max-w-6xl mx-auto p-10">

        <h2 className="text-2xl font-bold text-primary mb-6">
          Location & Connectivity
        </h2>

        {locationData?.mapEmbedUrl && (
          <iframe
            src={locationData.mapEmbedUrl}
            className="w-full h-80 rounded-xl border"
          />
        )}

        {locationData?.landmarks?.filter(l => l.name).length > 0 && (
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            {locationData.landmarks.map((l, i) => (
              l.name && (
                <div key={i} className="card">
                  <p className="font-semibold">{l.name}</p>
                  <p className="text-sm text-gray-500">
                    {l.distance}
                  </p>
                </div>
              )
            ))}
          </div>
        )}

      </div>

      {/* ================= FAQ ================= */}
      {faqs?.filter(f => f.question).length > 0 && (
        <div className="bg-white py-12">
          <div className="max-w-4xl mx-auto px-6">

            <h2 className="text-2xl font-bold text-primary mb-6">
              FAQs
            </h2>

            {faqs.map((f, i) => (
              f.question && (
                <div key={i} className="faq-item">
                  <p className="font-semibold">{f.question}</p>
                  <p className="text-gray-600 text-sm mt-1">
                    {f.answer}
                  </p>
                </div>
              )
            ))}

          </div>
        </div>
      )}

    </div>
  );
}