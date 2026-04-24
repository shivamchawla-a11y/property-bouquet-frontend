"use client";

import { useState } from "react";

export default function StepMedia({ form, setForm }) {
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch("http://localhost:5000/api/upload", {
      method: "POST",
      body: data,
    });

    const result = await res.json();
    return result.url;
  };

  // 🔥 HERO IMAGE
  const handleHeroUpload = async (e) => {
    setUploading(true);
    const url = await uploadImage(e.target.files[0]);

    setForm({
      ...form,
      media: { ...form.media, heroImageUrl: url },
    });

    setUploading(false);
  };

  // 🔥 GALLERY (MULTIPLE)
  const handleGalleryUpload = async (e) => {
    setUploading(true);

    const files = Array.from(e.target.files);
    const urls = [];

    for (let file of files) {
      const url = await uploadImage(file);
      urls.push(url);
    }

    setForm({
      ...form,
      media: {
        ...form.media,
        gallery: [...form.media.gallery, ...urls],
      },
    });

    setUploading(false);
  };

  // 🔥 FLOOR PLAN
  const handleFloorPlanUpload = async (e, index) => {
    const file = e.target.files[0];
    const url = await uploadImage(file);

    const updated = [...form.gatedContent.floorPlans];
    updated[index].image = url;

    setForm({
      ...form,
      gatedContent: {
        ...form.gatedContent,
        floorPlans: updated,
      },
    });
  };

  return (
    <div className="card space-y-6">

      <h2 className="section-title">Media Upload</h2>

      {/* HERO */}
      <div>
        <p className="font-semibold">Hero Image</p>
        <input type="file" onChange={handleHeroUpload} />

        {form.media.heroImageUrl && (
          <img src={form.media.heroImageUrl} className="w-64 mt-3 rounded-xl" />
        )}
      </div>

      {/* GALLERY */}
      <div>
        <p className="font-semibold">Gallery Images</p>
        <input type="file" multiple onChange={handleGalleryUpload} />

        <div className="grid grid-cols-4 gap-3 mt-3">
          {form.media.gallery.map((img, i) => (
            <img key={i} src={img} className="rounded-lg" />
          ))}
        </div>
      </div>

      {/* FLOOR PLANS */}
      <div>
        <p className="font-semibold">Floor Plans</p>

        {form.gatedContent.floorPlans.map((fp, i) => (
          <div key={i} className="border p-3 rounded-xl mb-3">

            <input
              placeholder="Plan Title"
              className="input"
              onChange={(e) => {
                const arr = [...form.gatedContent.floorPlans];
                arr[i].title = e.target.value;

                setForm({
                  ...form,
                  gatedContent: { ...form.gatedContent, floorPlans: arr },
                });
              }}
            />

            <input type="file" onChange={(e) => handleFloorPlanUpload(e, i)} />

            {fp.image && (
              <img src={fp.image} className="w-40 mt-2 rounded" />
            )}
          </div>
        ))}

        <button
          onClick={() =>
            setForm({
              ...form,
              gatedContent: {
                ...form.gatedContent,
                floorPlans: [...form.gatedContent.floorPlans, { title: "", image: "" }],
              },
            })
          }
          className="text-primary"
        >
          + Add Floor Plan
        </button>
      </div>

      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
    </div>
  );
}