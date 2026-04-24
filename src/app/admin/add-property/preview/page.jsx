"use client";

export default function PreviewPage({ form }) {
  if (!form) return <p>No Data</p>;

  return (
    <div className="p-10 bg-white">

      {/* HERO */}
      <div
        className="h-[400px] bg-cover flex items-end p-6 text-white"
        style={{ backgroundImage: `url(${form.media.heroImageUrl})` }}
      >
        <div>
          <h1 className="text-3xl font-bold">{form.coreDetails.title}</h1>
          <p>{form.keyMetrics.status}</p>
          <p>{form.coreDetails.startingPrice}</p>
        </div>
      </div>

      {/* OVERVIEW */}
      <div className="p-6">
        <h2 className="text-xl font-bold">Overview</h2>
        <p>{form.overview.description}</p>
      </div>

      {/* GALLERY */}
      <div className="grid grid-cols-4 gap-4 p-6">
        {form.media.gallery.map((img, i) => (
          <img key={i} src={img} className="rounded-xl" />
        ))}
      </div>

      {/* FLOOR PLANS */}
      <div className="p-6">
        <h2 className="text-xl font-bold">Floor Plans</h2>

        {form.gatedContent.floorPlans.map((fp, i) => (
          <div key={i} className="mb-4">
            <p>{fp.title}</p>
            <img src={fp.image} className="w-64 rounded" />
          </div>
        ))}
      </div>

    </div>
  );
}