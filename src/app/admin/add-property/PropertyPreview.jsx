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
  Coffee,
  School,
  Hospital,
  Wifi,
  Utensils,
  Film,
  Landmark,
  Bus,
  Store,
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

const CUSTOM_ICONS = [
  { name: "Home", icon: Home },
  { name: "Swimming", icon: Waves },
  { name: "Gym", icon: Dumbbell },
  { name: "Club", icon: Building2 },
  { name: "Garden", icon: Trees },
  { name: "Parking", icon: Car },
  { name: "Lift", icon: ArrowUpCircle },
  { name: "Security", icon: ShieldCheck },
  { name: "Power", icon: Zap },
  { name: "Kids", icon: Baby },
  { name: "Track", icon: Footprints },
  { name: "CCTV", icon: Camera },
  { name: "Games", icon: Gamepad2 },
  { name: "Spa", icon: Sparkles },
  { name: "Shopping", icon: ShoppingBag },
  { name: "Cafe", icon: Coffee },
  { name: "School", icon: School },
  { name: "Hospital", icon: Hospital },
  { name: "Wifi", icon: Wifi },
  { name: "Restaurant", icon: Utensils },
  { name: "Cinema", icon: Film },
  { name: "Temple", icon: Landmark },
  { name: "Bus", icon: Bus },
  { name: "Store", icon: Store },
];

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
{Array.isArray(overview.highlights) &&
  overview.highlights.filter(Boolean).length > 0 && (
    <div className="bg-white py-12">
      <h2 className="text-center text-2xl font-bold mb-8">
        Project Highlights
      </h2>

      <div className="grid md:grid-cols-4 gap-6 max-w-6xl mx-auto px-6">
        {overview.highlights
          .filter((h) => h)
          .map((h, i) => {
            // SUPPORT OLD STRING + NEW OBJECT
            const amenityName =
              typeof h === "string"
                ? h
                : h?.name || "Amenity";

            const iconKey =
              typeof h === "string"
                ? "Home"
                : h?.icon || "Home";

            // FIND ICON
            const IconComponent =
              CUSTOM_ICONS.find(
                (item) => item.name === iconKey
              )?.icon || Home;

            return (
              <div
                key={i}
                className="bg-[#f1f1f1] p-5 rounded-xl text-center shadow flex flex-col items-center gap-3 hover:shadow-lg transition duration-300 hover:-translate-y-1"
              >
                {/* ICON */}
                <div className="text-green-700">
                  <IconComponent size={28} />
                </div>

                {/* NAME */}
                <p className="text-sm font-medium">
                  {amenityName}
                </p>
              </div>
            );
          })}
      </div>
    </div>
)}

      {/* ================= PREMIUM SIZE & FLOOR PLAN ================= */}
{unitConfigurations.length > 0 && (
  <div className="py-16 bg-[#f3f3f3]">

    {/* HEADING */}
    <div className="text-center mb-10">
      <p className="text-[#1f3d2b] uppercase tracking-wide font-semibold text-sm">
        Sizes & Floors Plan
      </p>

      <h2 className="text-5xl font-bold text-[#1f3d2b] mt-1">
        {coreDetails.title}
      </h2>
    </div>

    {/* MAIN PREMIUM BOX */}
    <div className="max-w-6xl mx-auto relative px-6">

      {/* GRADIENT BACKGROUND */}
      <div className="bg-gradient-to-r from-[#1f5c32] to-[#c49b33] rounded-[28px] p-8 md:p-10 shadow-2xl">

        {/* TABLE */}
        <div className="border border-white/40 overflow-hidden bg-white/10 backdrop-blur-sm">

          <table className="w-full text-white">

            <thead className="bg-white text-[#1f3d2b]">
              <tr>
                <th className="py-4 border-r border-gray-300 text-xl font-bold">
                  Unit Type
                </th>

                <th className="py-4 border-r border-gray-300 text-xl font-bold">
                  Area (Sq.ft.)
                </th>

                <th className="py-4 border-r border-gray-300 text-xl font-bold">
                  Payment Plan
                </th>

                <th className="py-4 text-xl font-bold">
                  Price
                </th>
              </tr>
            </thead>

            <tbody>
              {unitConfigurations.map((u, i) => (
                <tr
                  key={i}
                  className="text-center border-t border-white/20"
                >
                  <td className="py-4 border-r border-white/20 text-2xl font-medium">
                    {u.unitType}
                  </td>

                  <td className="py-4 border-r border-white/20 text-xl">
                    {u.area}
                  </td>

                  <td className="py-4 border-r border-white/20 text-xl">
                    {u.paymentPlan}
                  </td>

                  <td className="py-4 text-2xl font-bold">
                    ₹ {u.price}
                  </td>
                </tr>
              ))}
            </tbody>

          </table>
        </div>

        {/* FLOOR PLAN CARD */}
        {floorPlans.filter(fp => fp.image).length > 0 && (
          <div className="mt-10 bg-[#f7f7f7] rounded-[24px] p-6 shadow-2xl border-2 border-[#1f5c32] relative">

            {/* ACTIVE IMAGE */}
            <div className="flex justify-center">
              <img
                src={floorPlans[activePlan]?.image}
                alt="floor-plan"
                className="rounded-xl max-h-[420px] object-contain"
              />
            </div>

            {/* PLAN SELECTOR */}
            <div className="flex flex-wrap justify-center gap-3 mt-6">
              {floorPlans.map((fp, i) => (
                <button
                  key={i}
                  onClick={() => setActivePlan(i)}
                  className={`px-5 py-2 rounded-full border transition font-medium ${
                    activePlan === i
                      ? "bg-[#1f5c32] text-white border-[#1f5c32]"
                      : "bg-white text-[#1f3d2b] border-gray-300"
                  }`}
                >
                  {fp.unitType}
                </button>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA BUTTONS */}
      <div className="flex flex-wrap justify-center gap-6 mt-10">

        {/* GET IN TOUCH */}
        <button className="bg-[#1f5c32] hover:scale-105 transition text-white px-8 py-4 rounded-md flex items-center gap-3 shadow-xl text-xl font-semibold">
          ✉️ Get in Touch
        </button>

        {/* CALL BUTTON */}
        <button className="bg-[#c49b33] hover:scale-105 transition text-white px-8 py-4 rounded-md flex items-center gap-3 shadow-xl text-xl font-semibold">
          🎧 +91-9958328555
        </button>

      </div>
    </div>
  </div>
)}

      {/* ================= GALLERY ================= */}
{media.gallery?.filter(Boolean).length > 0 && (
  <div className="bg-[#f3f3f3] py-16">

    {/* HEADING */}
    <div className="text-center mb-10">
      <p className="text-[#1f5b36] uppercase font-semibold tracking-wide">
        Gallery
      </p>

      <h2 className="text-4xl font-bold text-[#1f5b36]">
        {coreDetails.title}
      </h2>
    </div>

    {/* GALLERY GRID */}
    <div className="max-w-6xl mx-auto px-4">

      <div className="grid grid-cols-12 gap-3 auto-rows-[120px]">

        {media.gallery
          .filter((img) => img && img.trim())
          .map((img, i) => {

            // BIG LAYOUT LIKE DESIGN
            let spanClass = "col-span-3 row-span-1";

            if (i === 0) spanClass = "col-span-6 row-span-2";
            if (i === 3) spanClass = "col-span-3 row-span-2";
            if (i === 6) spanClass = "col-span-3 row-span-2";

            return (
              <div
                key={i}
                className={`overflow-hidden rounded-md shadow-md ${spanClass}`}
              >
                <img
                  src={img}
                  alt=""
                  className="w-full h-full object-cover hover:scale-110 transition duration-700"
                />
              </div>
            );
          })}
      </div>
    </div>
  </div>
)}

{/* ================= LOCATION ADVANTAGES ================= */}
<div className="bg-[#efefef] py-16">

  {/* HEADING */}
  <div className="text-center mb-12">
    <p className="text-[#1f5b36] uppercase font-semibold tracking-wide">
      Location Advantages
    </p>

    <h2 className="text-4xl font-bold text-[#1f5b36]">
      {coreDetails.title}
    </h2>
  </div>

  <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-14 items-center">

    {/* LEFT SIDE LANDMARKS */}
    <div className="space-y-5">

      {locationData.landmarks?.map(
        (l, i) =>
          l.name && (
            <div key={i} className="flex items-start gap-4">

              {/* GOLD DOT + LINE */}
              <div className="flex flex-col items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-[#b9932f]" />

                {i !== locationData.landmarks.length - 1 && (
                  <div className="w-[2px] h-8 bg-[#b9932f]" />
                )}
              </div>

              {/* TEXT */}
              <p className="text-[#222] font-medium text-lg leading-relaxed">
                {l.name} – {l.distance}
              </p>
            </div>
          )
      )}
    </div>

    {/* RIGHT SIDE MAP */}
    <div className="rounded-xl overflow-hidden shadow-xl border border-gray-300 bg-white">

      {locationData.mapEmbedUrl ? (
        <iframe
          src={locationData.mapEmbedUrl}
          className="w-full h-[360px]"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      ) : (
        <div className="h-[360px] flex items-center justify-center text-gray-500">
          Map Not Available
        </div>
      )}
    </div>
  </div>
</div>

{/* ================= MASTER PLAN CTA ================= */}
{gatedContent?.brochurePdfUrl && (
  <div className="bg-[#f3f3f3] py-20 overflow-hidden">

    {/* HEADING */}
    <div className="text-center mb-10">
      <p className="text-[#1f5b36] uppercase font-semibold tracking-wide">
        Master Plan
      </p>

      <h2 className="text-4xl font-bold text-[#1f5b36]">
        {coreDetails.title}
      </h2>
    </div>

    {/* CENTER DESIGN */}
    <div className="relative max-w-6xl mx-auto px-6">

      {/* GREEN + GOLD STRIP */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-24 z-0">
        <div className="grid grid-cols-2 h-full">
          <div className="bg-[#1f5b36]" />
          <div className="bg-[#b9932f]" />
        </div>
      </div>

      {/* IMAGE CARD */}
      <div className="relative z-10 max-w-5xl mx-auto bg-white rounded-xl overflow-hidden shadow-2xl border border-gray-300">

        <div className="relative">

          {/* IMAGE */}
          <img
            src={
              media?.gallery?.[0] ||
              media?.heroImageUrl ||
              "/placeholder.jpg"
            }
            alt="Master Plan"
            className="w-full h-[500px] object-cover opacity-20"
          />

          {/* LIGHT OVERLAY */}
          <div className="absolute inset-0 bg-white/40" />

          {/* BUTTON */}
          <div className="absolute inset-0 flex items-center justify-center">

            <button
              onClick={() => setShowModal(true)}
              className="bg-[#1f5b36] hover:bg-[#17452a] text-white px-8 py-4 rounded-lg shadow-2xl text-2xl font-semibold flex items-center gap-3 transition duration-300 hover:scale-105"
            >
              View Master Plan

              <span className="text-xl">
                ◉
              </span>
            </button>

          </div>
        </div>
      </div>
    </div>
  </div>
)}

{/* ================= FAQs ================= */}
{faqs.filter((f) => f.question).length > 0 && (
  <div className="relative bg-[#f3f3f3] py-20 overflow-hidden">

    {/* LIGHT BACKGROUND EFFECT */}
    <div className="absolute inset-0 opacity-[0.03]">
      <div
  className="absolute inset-0 opacity-[0.04]"
  style={{
    backgroundImage:
      "radial-gradient(circle, #1f5b36 1px, transparent 1px)",
    backgroundSize: "30px 30px",
  }}
/>
    </div>

    <div className="relative z-10">

      {/* HEADING */}
      <div className="text-center mb-12">
        <p className="text-[#1f5b36] uppercase font-semibold tracking-wide">
          FAQs
        </p>

        <h2 className="text-4xl font-bold text-[#1f5b36]">
          {coreDetails.title}
        </h2>
      </div>

      {/* FAQ LIST */}
      <div className="max-w-5xl mx-auto px-6 space-y-3">

        {faqs.map(
          (f, i) =>
            f.question && (
              <details
                key={i}
                open={i === 0} // ✅ FIRST FAQ ALWAYS OPEN
                className="group bg-[#efefef] border border-gray-300 shadow-sm overflow-hidden"
              >

                {/* QUESTION */}
                <summary className="list-none cursor-pointer px-6 py-5 flex items-center justify-between text-[20px] font-semibold text-[#111]">

                  <div className="flex items-center gap-5">

                    {/* PLUS / MINUS */}
                    <span className="text-3xl leading-none font-light group-open:hidden">
                      +
                    </span>

                    <span className="text-3xl leading-none font-light hidden group-open:block">
                      −
                    </span>

                    <span>{f.question}</span>
                  </div>
                </summary>

                {/* ANSWER */}
                <div className="px-16 pb-6 text-gray-800 text-[15px] leading-relaxed border-t border-gray-300 bg-[#efefef]">
                  <div className="pt-5 max-w-4xl">
                    {f.answer}
                  </div>
                </div>
              </details>
            )
        )}
      </div>
    </div>
  </div>
)}

{/* ================= FOOTER CTA ================= */}
<div className="bg-gradient-to-r from-[#1f5b36] to-[#b9932f] py-10">

  <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-8">

    {/* LEFT SIDE */}
    <div className="flex items-center gap-6">

      {/* ICON */}
      <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow-lg">

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-10 h-10 text-[#1f5b36]"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25H4.5a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5H4.5A2.25 2.25 0 002.25 6.75m19.5 0v.243a2.25 2.25 0 01-.97 1.846l-7.5 5.25a2.25 2.25 0 01-2.56 0l-7.5-5.25a2.25 2.25 0 01-.97-1.846V6.75"
          />
        </svg>
      </div>

      {/* TEXT */}
      <div className="text-white">

        <h3 className="text-4xl font-bold leading-tight">
          The Door is Always Open
        </h3>

        <p className="text-sm md:text-base mt-2 opacity-95 leading-relaxed max-w-xl">
          Big decisions deserve better than "maybe." Reach out now for a
          transparent look at everything this project offers.
        </p>
      </div>
    </div>

    {/* RIGHT BUTTON */}
    <button
      onClick={() => setShowModal(true)}
      className="bg-white hover:scale-105 transition duration-300 text-[#1f5b36] font-bold text-2xl px-10 py-5 rounded-md shadow-xl flex items-center gap-4"
    >

      {/* ICON */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 24 24"
        className="w-9 h-9"
      >
        <path d="M1.5 4.5h21v15h-21v-15zm1.5 1.5v.638l9 5.4 9-5.4v-.638h-18zm18 12v-9.112l-8.614 5.168a.75.75 0 01-.772 0l-8.614-5.168v9.112h18z" />
      </svg>

      Contact Us
    </button>
  </div>
</div>

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