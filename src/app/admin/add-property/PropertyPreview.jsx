"use client";

export default function PropertyPreview({ form }) {
  if (!form) return null;

  const {
    coreDetails = {},
    overview = {},
    media = {},
    unitConfigurations = [],
    locationData = {},
    faqs = [],
    keyMetrics = {},
  } = form;

  return (
    <div className="bg-[#f5f5f5] text-[#1f3d2b]">

      {/* ================= HERO ================= */}
      <div
        className="relative h-[520px] bg-cover bg-center flex items-end"
        style={{
          backgroundImage: media?.heroImageUrl
            ? `url(${media.heroImageUrl})`
            : "linear-gradient(#000,#222)",
        }}
      >
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 p-10 text-white">
          <h1 className="text-4xl font-bold mb-2">
            {coreDetails.title || "Property Title"}
          </h1>

          <p className="text-sm text-gray-200">
            📍 {locationData.address || "Location"}
          </p>

          <div className="flex gap-4 mt-4 flex-wrap">
            <span className="bg-green-700 px-4 py-2 rounded">
              {keyMetrics.status || "STATUS"}
            </span>

            <span className="bg-green-600 px-4 py-2 rounded">
              {keyMetrics.possession || "POSSESSION"}
            </span>

            <span className="bg-green-500 px-4 py-2 rounded">
              {keyMetrics.landArea || "AREA"}
            </span>

            <span className="bg-yellow-600 px-4 py-2 rounded">
              ₹ {coreDetails.startingPrice || "—"} - {coreDetails.maxPrice || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h2 className="text-3xl font-bold mb-4">
            {coreDetails.title}
          </h2>

          <p className="text-gray-700 leading-relaxed">
            {overview.description || "No description provided"}
          </p>

          <button className="mt-6 bg-green-700 text-white px-5 py-2 rounded">
            More Details →
          </button>
        </div>

        {overview.aboutImageUrl && (
          <img
            src={overview.aboutImageUrl}
            className="rounded-2xl shadow-lg"
          />
        )}
      </div>

      {/* ================= HIGHLIGHTS ================= */}
      {overview.highlights?.filter(Boolean).length > 0 && (
        <div className="bg-white py-12">
          <h2 className="text-center text-2xl font-bold mb-8">
            Project Highlights
          </h2>

          <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
            {overview.highlights.filter(Boolean).map((h, i) => (
              <div
                key={i}
                className="bg-[#f1f1f1] p-4 rounded-lg text-center shadow"
              >
                {h}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CONFIG TABLE ================= */}
      {unitConfigurations.length > 0 && (
        <div className="py-12 bg-[#f9f9f9]">
          <h2 className="text-center text-2xl font-bold mb-6">
            Sizes & Floor Plan
          </h2>

          <div className="max-w-5xl mx-auto bg-gradient-to-r from-green-800 to-yellow-600 p-6 rounded-xl text-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/30">
                  <th>Type</th>
                  <th>Area</th>
                  <th>Plan</th>
                  <th>Price</th>
                </tr>
              </thead>

              <tbody>
                {unitConfigurations.map((u, i) => (
                  <tr key={i} className="text-center border-b border-white/10">
                    <td>{u.unitType}</td>
                    <td>{u.area}</td>
                    <td>{u.paymentPlan}</td>
                    <td>₹ {u.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= AMENITIES (using highlights fallback) ================= */}
      {overview.highlights?.length > 0 && (
        <div className="bg-white py-12">
          <h2 className="text-center text-2xl font-bold mb-8">
            Amenities
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {overview.highlights.slice(0, 8).map((a, i) => (
              <div
                key={i}
                className="border p-4 text-center rounded-lg"
              >
                🏊 {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= GALLERY ================= */}
      {media.gallery?.filter(Boolean).length > 0 && (
        <div className="py-12">
          <h2 className="text-center text-2xl font-bold mb-6">
            Gallery
          </h2>

          <div className="grid md:grid-cols-4 gap-4 max-w-6xl mx-auto px-6">
            {media.gallery.filter(Boolean).map((img, i) => (
              <img
                key={i}
                src={img}
                className="rounded-lg object-cover h-40 w-full"
              />
            ))}
          </div>
        </div>
      )}

      {/* ================= LOCATION ================= */}
      <div className="bg-white py-12">
        <h2 className="text-center text-2xl font-bold mb-6">
          Location Advantages
        </h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto px-6">
          <div className="space-y-2">
            {locationData.landmarks?.map((l, i) => (
              l.name && (
                <p key={i}>
                  • {l.name} - {l.distance}
                </p>
              )
            ))}
          </div>

          {locationData.mapEmbedUrl && (
            <iframe
              src={locationData.mapEmbedUrl}
              className="w-full h-80 rounded-lg"
            />
          )}
        </div>
      </div>

      {/* ================= MASTER PLAN ================= */}
      <div className="py-12 text-center">
        <h2 className="text-2xl font-bold mb-6">
          Master Plan
        </h2>

        <div className="bg-gray-200 h-60 flex items-center justify-center rounded-xl max-w-5xl mx-auto">
          <button className="bg-green-800 text-white px-6 py-3 rounded">
            View Master Plan 👁
          </button>
        </div>
      </div>

      {/* ================= FAQ ================= */}
      {faqs.filter(f => f.question).length > 0 && (
        <div className="bg-white py-12">
          <h2 className="text-center text-2xl font-bold mb-6">
            FAQs
          </h2>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((f, i) => (
              f.question && (
                <details key={i} className="border rounded p-4">
                  <summary className="font-semibold cursor-pointer">
                    {f.question}
                  </summary>
                  <p className="mt-2 text-gray-600">
                    {f.answer}
                  </p>
                </details>
              )
            ))}
          </div>
        </div>
      )}

    </div>
  );
}