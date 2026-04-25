"use client";

export default function PreviewPage({ form }) {
  if (!form) return <p className="p-10">No Data</p>;

  return (
    <div className="bg-lightBg min-h-screen">

      {/* ================= HERO ================= */}
      <div
        className="h-[500px] relative bg-cover bg-center flex items-end"
        style={{ backgroundImage: `url(${form.media.heroImageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

        <div className="relative p-10 text-white">
          <h1 className="text-4xl font-bold">
            {form.coreDetails.title}
          </h1>

          <p className="text-gray-300 mt-1">
            {form.locationData.address}
          </p>

          <div className="flex gap-4 mt-4">
            <span className="bg-gold text-black px-4 py-1 rounded-full text-sm font-semibold">
              {form.keyMetrics.status}
            </span>

            <span className="bg-white/20 backdrop-blur px-4 py-1 rounded-full text-sm">
              {form.keyMetrics.possession}
            </span>
          </div>

          <p className="text-2xl font-semibold mt-4">
            ₹ {form.coreDetails.startingPrice} - {form.coreDetails.maxPrice}
          </p>
        </div>
      </div>

      {/* ================= OVERVIEW ================= */}
      <div className="max-w-6xl mx-auto p-10 grid md:grid-cols-2 gap-10">

        {/* TEXT */}
        <div>
          <h2 className="text-2xl font-bold text-primary mb-4">
            About the Property
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {form.overview.description}
          </p>

          {/* HIGHLIGHTS */}
          <div className="grid grid-cols-2 gap-3 mt-6">
            {form.overview.highlights.map((h, i) => (
              <div
                key={i}
                className="bg-white shadow-soft p-3 rounded-xl text-sm"
              >
                ✔ {h}
              </div>
            ))}
          </div>
        </div>

        {/* IMAGE */}
        {form.overview.aboutImageUrl && (
          <img
            src={form.overview.aboutImageUrl}
            className="rounded-2xl shadow-card"
          />
        )}
      </div>

      {/* ================= CONFIGURATIONS ================= */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-bold text-primary mb-6">
            Unit Configurations
          </h2>

          <div className="space-y-4">
            {form.unitConfigurations.map((u, i) => (
              <div
                key={i}
                className="flex justify-between items-center border rounded-xl p-4"
              >
                <div>
                  <p className="font-semibold">{u.unitType}</p>
                  <p className="text-sm text-gray-500">{u.area}</p>
                </div>

                <div className="text-right">
                  <p className="font-semibold text-primary">
                    ₹ {u.price}
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

      {/* ================= GALLERY ================= */}
      <div className="max-w-6xl mx-auto p-10">

        <h2 className="text-2xl font-bold text-primary mb-6">
          Gallery
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {form.media.gallery.map((img, i) => (
            <img
              key={i}
              src={img}
              className="rounded-xl object-cover h-40 w-full hover:scale-105 transition"
            />
          ))}
        </div>
      </div>

      {/* ================= FLOOR PLANS ================= */}
      <div className="bg-white py-12">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-2xl font-bold text-primary mb-6">
            Floor Plans
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {form.gatedContent.floorPlans.map((fp, i) => (
              <div
                key={i}
                className="border rounded-xl overflow-hidden shadow-soft"
              >
                <img
                  src={fp.image}
                  className="h-48 w-full object-cover"
                />

                <div className="p-4">
                  <p className="font-semibold">{fp.title}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* ================= LOCATION ================= */}
      <div className="max-w-6xl mx-auto p-10">

        <h2 className="text-2xl font-bold text-primary mb-6">
          Location & Connectivity
        </h2>

        {/* MAP */}
        {form.locationData.mapEmbedUrl && (
          <iframe
            src={form.locationData.mapEmbedUrl}
            className="w-full h-80 rounded-xl border"
            loading="lazy"
          />
        )}

        {/* LANDMARKS */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {form.locationData.landmarks.map((l, i) => (
            <div
              key={i}
              className="bg-white shadow-soft p-4 rounded-xl"
            >
              <p className="font-semibold">{l.name}</p>
              <p className="text-sm text-gray-500">
                {l.distance}
              </p>
            </div>
          ))}
        </div>

      </div>

      {/* ================= FAQ ================= */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-6">

          <h2 className="text-2xl font-bold text-primary mb-6">
            FAQs
          </h2>

          {form.faqs.map((f, i) => (
            <div key={i} className="mb-4 border-b pb-3">
              <p className="font-semibold">{f.question}</p>
              <p className="text-gray-600 text-sm mt-1">
                {f.answer}
              </p>
            </div>
          ))}

        </div>
      </div>

    </div>
  );
}