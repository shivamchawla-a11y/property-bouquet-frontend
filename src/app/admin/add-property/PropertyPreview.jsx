"use client";

import { useState } from "react";

export default function PropertyPreview({ form, developers = [] }) {
  if (!form) return null;

  const {
    coreDetails = {},
    overview = {},
    media = {},
    unitConfigurations = [],
    locationData = {},
    faqs = [],
    keyMetrics = {},
    gatedContent = {},
  } = form;

  const floorPlans = gatedContent?.floorPlans || [];
  const [activePlan, setActivePlan] = useState(0);

  // ================= FIX: DEVELOPER NAME RESOLVER =================
  const getDeveloperName = () => {
    // If custom developer name exists → use it
    if (coreDetails?.developerName && coreDetails.developerName.trim()) {
      return coreDetails.developerName;
    }

    // If developerRef is ObjectId → map it
    if (coreDetails?.developerRef) {
      const dev = developers.find(
        (d) => d._id === coreDetails.developerRef
      );

      if (dev) return dev.name;

      // fallback if not found
      return coreDetails.developerRef;
    }

    return "DEVELOPER";
  };

  // ================= CATEGORY NAME RESOLVER =================
const getCategoryName = () => {
  if (form?.categoryData?.customCategory?.trim()) {
    return form.categoryData.customCategory;
  }

  if (form?.categoryData?.categoryName?.trim()) {
    return form.categoryData.categoryName;
  }

  return "CATEGORY";
};

// ================= LOCATION NAME RESOLVER =================
const getLocationName = () => {
  if (locationData?.customLocation?.trim()) {
    return locationData.customLocation;
  }

  if (locationData?.locationName?.trim()) {
    return locationData.locationName;
  }

  if (locationData?.address?.trim()) {
    return locationData.address;
  }

  return "Location";
};

const categoryName = getCategoryName();
const locationName = getLocationName();

  const developerName = getDeveloperName();

  return (
    <div className="bg-[#f5f5f5] text-[#1f3d2b] overflow-visible">

      {/* ================= NAVBAR ================= */}
      <div className="relative overflow-visible bg-gradient-to-r from-[#1f3d2b] to-[#c9a64b] text-white h-[80px] px-10 flex items-center justify-between">

        {/* LEFT BRAND */}
        <div className="leading-tight">
          <div className="text-sm tracking-[3px] font-semibold">
            {developerName}
          </div>
        </div>

        {/* RIGHT CALL BUTTON */}
        <div className="border border-white rounded-full px-5 py-1 text-sm flex items-center gap-2 bg-white/10 backdrop-blur">
          📞 +91-9958328555
        </div>

        {/* CENTER LOGO */}
        <div className="absolute left-1/2 top-[100%] translate-x-[-50%] translate-y-[-50%] z-20">
          <div className="bg-white p-2 rounded-full shadow-xl">
            <img
              src="/logo.png"
              alt="logo"
              className="w-14 h-14 object-contain"
            />
          </div>
        </div>
      </div>

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

          <div className="flex gap-3 mt-2 text-xs">
  <span className="bg-white/20 px-3 py-1 rounded-full">
    {categoryName}
  </span>

  <span className="bg-white/20 px-3 py-1 rounded-full">
    {developerName}
  </span>
</div>

          <p className="text-sm text-gray-200">
              📍 {locationName}
            </p>

          {/* METRICS BAR */}
          <div className="mt-6 bg-green-900/80 backdrop-blur px-6 py-4 rounded-xl flex flex-wrap gap-6 text-sm">

            <div>
              <p className="opacity-70 text-xs">STATUS</p>
              <p className="font-semibold">
                {keyMetrics.status || "NEW LAUNCH"}
              </p>
            </div>

            <div>
              <p className="opacity-70 text-xs">POSSESSION</p>
              <p className="font-semibold">
                {keyMetrics.possession || "2028"}
              </p>
            </div>

            <div>
              <p className="opacity-70 text-xs">LAND AREA</p>
              <p className="font-semibold">
                {keyMetrics.landArea || "10 Acres"}
              </p>
            </div>

            <div>
              <p className="opacity-70 text-xs">PRICE</p>
              <p className="font-semibold">
                ₹ {coreDetails.startingPrice || "—"} - {coreDetails.maxPrice || "—"}
              </p>
            </div>

            <div>
  <p className="opacity-70 text-xs">UNITS</p>
  <p className="font-semibold">
    {keyMetrics.totalUnits || "—"}
  </p>
</div>

<div>
  <p className="opacity-70 text-xs">TOWERS</p>
  <p className="font-semibold">
    {keyMetrics.totalTowers || "—"}
  </p>
</div>

          </div>
        </div>
      </div>

      {/* ================= ABOUT ================= */}
      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10 items-center">
        
        <div>
          <p className="text-sm text-green-700 font-semibold mb-2">
            About {developerName}
          </p>

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
            className="rounded-2xl shadow-lg border-[6px] border-[#c9a64b]"
            alt=""
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
            Sizes & Pricing
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
                    <td>{u.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= FLOOR PLAN ================= */}
      {floorPlans.filter(fp => fp.image).length > 0 && (
        <div className="py-12 bg-white">
          <h2 className="text-center text-2xl font-bold mb-8">
            Floor Plans
          </h2>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {floorPlans.map((fp, i) => (
              <button
                key={i}
                onClick={() => setActivePlan(i)}
                className={`px-4 py-2 rounded-lg border ${
                  activePlan === i
                    ? "bg-green-800 text-white"
                    : "bg-gray-100"
                }`}
              >
                {fp.unitType || "Unit"} | {fp.area || "-"} | ₹ {fp.price || "-"}
              </button>
            ))}
          </div>

          <div className="max-w-4xl mx-auto">
            {floorPlans[activePlan]?.image && (
              <img
                src={floorPlans[activePlan].image}
                className="rounded-xl shadow-lg w-full"
                alt=""
              />
            )}
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
            {media.gallery
              .filter(img => img && img.trim())
              .map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="rounded-lg object-cover h-40 w-full"
                  alt=""
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

      {/* ================= CTA / BROCHURE ================= */}
{gatedContent?.brochurePdfUrl && (
  <div className="py-12 bg-gradient-to-r from-[#1f3d2b] to-[#c9a64b] text-white text-center">
    
    <h2 className="text-2xl font-bold mb-4">
      Download Brochure
    </h2>

    <p className="mb-6 text-sm opacity-90">
      Get complete details, floor plans & pricing
    </p>

    <a
      href={gatedContent.brochurePdfUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block bg-white text-black px-6 py-3 rounded-lg font-semibold hover:scale-105 transition"
    >
      📄 Download Brochure
    </a>

  </div>
)}

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