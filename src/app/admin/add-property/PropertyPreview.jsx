"use client";

import { useState } from "react";
import {
  Waves,
  Dumbbell,
  Building2,
  Trees,
  Car,
  ArrowUpCircle,
  ShieldCheck,
  Zap,
  Home,
  Baby,
  Footprints,
  Camera,
  Gamepad2,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

const amenityIcons = {
  "Swimming Pool": <Waves size={28} />,
  Gym: <Dumbbell size={28} />,
  Clubhouse: <Building2 size={28} />,
  Garden: <Trees size={28} />,
  Parking: <Car size={28} />,
  Lift: <ArrowUpCircle size={28} />,
  Security: <ShieldCheck size={28} />,
  "Power Backup": <Zap size={28} />,
  Balcony: <Home size={28} />,
  "Kids Play Area": <Baby size={28} />,
  "Jogging Track": <Footprints size={28} />,
  CCTV: <Camera size={28} />,
  "Indoor Games": <Gamepad2 size={28} />,
  Spa: <Sparkles size={28} />,
  "Shopping Center": <ShoppingBag size={28} />,
};

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
  function getDeveloperLogo() {
  // ✅ 1. Direct logo (highest priority)
  if (coreDetails?.developerLogo) {
    return coreDetails.developerLogo;
  }

  // ✅ 2. Populated object
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return coreDetails.developerRef.logo || "";
  }

  // ✅ 3. Lookup from developers list
  if (coreDetails?.developerRef) {
    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );
    return dev?.logo || "";
  }

  return "";
}


  const floorPlans = gatedContent?.floorPlans || [];
  const [activePlan, setActivePlan] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const developerLogo = getDeveloperLogo(); // ✅ ADD THIS LINE

  
  

  const handleLeadSubmit = async () => {
  if (!leadName.trim() || !leadPhone.trim()) {
    alert("Please fill all fields");
    return;
  }

  try {
    setSubmitting(true);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/leads",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: leadName,
          phone: leadPhone,
          property: coreDetails?.title || "",
        }),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || "Failed ❌");
      return;
    }

    // ✅ CLOSE MODAL
    setShowModal(false);

    // ✅ DOWNLOAD PDF
    window.open(gatedContent.brochurePdfUrl, "_blank");

    // RESET
    setLeadName("");
    setLeadPhone("");

  } catch (err) {
    console.error(err);
    alert("Server error ❌");
  } finally {
    setSubmitting(false);
  }
};

  // ================= FIX: DEVELOPER NAME RESOLVER =================
  const getDeveloperName = () => {
  // ✅ Custom name (highest priority)
  if (coreDetails?.developerName?.trim()) {
    return coreDetails.developerName;
  }

  // ✅ If populated object from backend
  if (
    coreDetails?.developerRef &&
    typeof coreDetails.developerRef === "object"
  ) {
    return coreDetails.developerRef.name || "DEVELOPER";
  }

  // ✅ If only ID (fallback case)
  if (coreDetails?.developerRef) {
    const dev = developers.find(
      (d) => d._id === coreDetails.developerRef
    );

    if (dev) return dev.name;
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

  if (locationData?.locationName?.includes(">")) {
    const parts = locationData.locationName.split(">").map(p => p.trim());

    // 🔥 SHOW LAST 2 LEVELS ONLY
    if (parts.length >= 2) {
      return `${parts[parts.length - 1]}, ${parts[parts.length - 2]}`;
    }

    return parts[0];
  }

  if (locationData?.locationName) {
    return locationData.locationName;
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
<div className="text-white flex items-center">
  {developerLogo && developerLogo.trim() !== "" ? (
    <img
      src={developerLogo}
      alt={developerName}
      className="h-10 object-contain"
      onError={(e) => (e.target.style.display = "none")} // fallback safety
    />
  ) : (
    <div>
      <p className="text-2xl tracking-[6px] font-light">
        {developerName || "DEVELOPER"}
      </p>
    </div>
  )}
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

{/* ================= HERO ================= */}
<div
  className="relative h-[640px] bg-cover bg-center flex items-end"
  style={{
    backgroundImage: media?.heroImageUrl
      ? `url(${media.heroImageUrl})`
      : "linear-gradient(#000,#222)",
  }}
>
  {/* OVERLAY */}
  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

  {/* CONTENT (LOWER POSITIONED) */}
  <div className="relative z-10 w-full pb-16 px-6 flex flex-col items-center text-center">

    {/* TITLE */}
    <h1 className="text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
      {coreDetails.title}
    </h1>

    {/* LOCATION */}
    <p className="mt-3 text-lg text-gray-200 flex items-center gap-2">
      📍 {locationName}
    </p>

    {/* METRICS BAR */}
    <div className="mt-8 bg-[#1f3d2b]/90 backdrop-blur-xl border border-white/20 rounded-xl px-8 py-5 flex flex-wrap justify-center items-center gap-10 text-white shadow-2xl">

      {/* SIZES */}
      <div className="text-center">
        <p className="text-xs text-gray-300 tracking-widest">SIZES</p>
        <p className="text-xl font-semibold">
          {unitConfigurations?.length > 0
            ? unitConfigurations.map(u => u.unitType).join(" & ")
            : "3 & 4 BHK"}
        </p>
      </div>

      <div className="hidden md:block h-10 w-[1px] bg-white/20" />

      {/* STATUS */}
      <div className="text-center">
        <p className="text-xs text-gray-300 tracking-widest">STATUS</p>
        <p className="text-xl font-semibold">
          {keyMetrics.status || "NEW LAUNCH"}
        </p>
      </div>

      <div className="hidden md:block h-10 w-[1px] bg-white/20" />

      {/* AREA */}
      <div className="text-center">
        <p className="text-xs text-gray-300 tracking-widest">CARPET AREA</p>
        <p className="text-xl font-semibold">
          {unitConfigurations?.length > 0
            ? `${unitConfigurations[0]?.area || ""} - ${
                unitConfigurations[unitConfigurations.length - 1]?.area || ""
              }`
            : "1250 - 2140 SQ.FT."}
        </p>
      </div>

      <div className="hidden md:block h-10 w-[1px] bg-white/20" />

      {/* PRICE */}
      <div className="text-center">
        <p className="text-xs text-gray-300 tracking-widest">
          STARTING PRICE
        </p>
        <p className="text-xl font-semibold">
          ₹ {coreDetails.startingPrice || "5 Cr"} -{" "}
          {coreDetails.maxPrice || "10 Cr"}
        </p>
      </div>
    </div>
  </div>
</div>

      {/* ================= ABOUT (PREMIUM UI) ================= */}
<div className="bg-[#f8f8f8] py-16">
  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">

    {/* LEFT CONTENT */}
    <div>
      {/* SMALL TITLE */}
      <p className="text-sm text-[#1f3d2b] font-semibold mb-2">
        About us {developerName}
      </p>

      {/* MAIN TITLE */}
      <h2 className="text-5xl font-bold text-[#1f3d2b] leading-tight mb-4">
        {coreDetails.title}
      </h2>

      {/* DESCRIPTION */}
      <p className="text-gray-700 leading-relaxed text-[15px]">
        {overview.description || "No description provided"}
      </p>

      {/* BUTTON */}
      <button className="mt-6 bg-[#c9a64b] hover:bg-[#b8933f] text-white px-6 py-3 rounded shadow-md flex items-center gap-2 font-medium transition">
        More Details
        <span>▶</span>
      </button>
    </div>

    {/* RIGHT IMAGE DESIGN */}
    {overview.aboutImageUrl && (
      <div className="relative">

        {/* GOLD BACK LAYER */}
        <div className="absolute -top-4 right-0 w-full h-full bg-[#c9a64b] rounded-3xl z-0" />

        {/* GREEN BASE SHADOW */}
        <div className="absolute bottom-[-15px] left-6 w-[90%] h-full bg-[#1f3d2b] rounded-3xl z-0" />

        {/* MAIN IMAGE */}
        <img
          src={overview.aboutImageUrl}
          alt="about"
          className="relative z-10 rounded-3xl w-full h-[380px] object-cover shadow-xl"
        />
      </div>
    )}

  </div>
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
      className="bg-[#f1f1f1] p-5 rounded-xl text-center shadow flex flex-col items-center gap-3 hover:shadow-lg transition"
    >
      {/* ICON */}
      <div className="text-green-700">
        {amenityIcons[h] || <Home size={28} />} {/* fallback icon */}
      </div>

      {/* TEXT */}
      <p className="text-sm font-medium">{h}</p>
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

      {/* ================= PREMIUM BROCHURE CTA ================= */}
{gatedContent?.brochurePdfUrl && (
  <div className="relative py-16 text-white overflow-hidden">

    {/* BACKGROUND GLOW */}
    <div className="absolute inset-0 bg-gradient-to-r from-[#1f3d2b] to-[#c9a64b]" />
    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />

    <div className="relative z-10 max-w-5xl mx-auto text-center px-6">

      {/* ICON */}
      <div className="mb-4 text-4xl">📄</div>

      {/* TITLE */}
      <h2 className="text-3xl font-bold mb-3">
        Unlock Full Project Details
      </h2>

      {/* SUBTEXT */}
      <p className="text-sm opacity-90 mb-8">
        Get brochure, floor plans, pricing & exclusive insights instantly
      </p>

      {/* CTA BUTTON */}
      <button
        onClick={() => setShowModal(true)}
        className="bg-white text-[#1f3d2b] px-8 py-4 rounded-full font-semibold shadow-xl hover:scale-105 transition flex items-center gap-2 mx-auto"
      >
        Download Brochure
        <span className="text-lg">→</span>
      </button>

    </div>
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

        {/* ================= PREMIUM LEAD MODAL ================= */}
{showModal && (
  <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">

    <div className="w-[92%] max-w-md rounded-2xl overflow-hidden shadow-2xl bg-white">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-[#c9a64b] to-[#1f3d2b] px-6 py-4 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-white">
          Get Instant Access
        </h2>

        <button
          onClick={() => setShowModal(false)}
          className="text-white text-xl"
        >
          ✕
        </button>
      </div>

      {/* BODY */}
      <div className="p-6 space-y-4">

        <p className="text-sm text-gray-600 text-center">
          Fill details to download brochure instantly
        </p>

        {/* NAME FIELD */}
        <div className="relative">
          <input
            type="text"
            value={leadName}
            onChange={(e) => setLeadName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 pt-5 pb-2 focus:outline-none focus:ring-2 focus:ring-[#1f3d2b]"
            placeholder=" "
          />
          <label className="absolute left-4 top-2 text-xs text-gray-500">
            Full Name *
          </label>
        </div>

        {/* PHONE FIELD */}
        <div className="flex border border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#1f3d2b]">

          <div className="px-3 flex items-center bg-gray-50 text-sm">
            🇮🇳 +91
          </div>

          <input
            type="tel"
            value={leadPhone}
            onChange={(e) => setLeadPhone(e.target.value)}
            className="flex-1 px-4 py-3 outline-none"
            placeholder="Enter phone number"
          />
        </div>

        {/* CTA BUTTON */}
        <button
          onClick={handleLeadSubmit}
          disabled={submitting}
          className="w-full bg-gradient-to-r from-[#c9a64b] to-[#1f3d2b] text-white py-3 rounded-lg font-semibold hover:scale-[1.02] transition"
        >
          {submitting ? "Processing..." : "Download Brochure →"}
        </button>

        {/* TRUST TEXT */}
        <p className="text-xs text-gray-500 text-center">
          🔒 Your details are safe & never shared
        </p>

      </div>
    </div>
  </div>
)}

    </div>
  );
}