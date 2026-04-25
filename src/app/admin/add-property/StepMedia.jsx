"use client";

import { useState } from "react";

export default function StepMedia({ form, setForm }) {
  const [uploading, setUploading] = useState(false);

  // 🔥 UPLOAD FUNCTION
  const uploadImage = async (file) => {
    const data = new FormData();
    data.append("file", file);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/upload",
      {
        method: "POST",
        body: data,
      }
    );

    const result = await res.json();
    return result.url;
  };

  // 🔥 HERO UPLOAD
  const handleHeroUpload = async (file) => {
    setUploading(true);
    const url = await uploadImage(file);

    setForm({
      ...form,
      media: { ...form.media, heroImageUrl: url },
    });

    setUploading(false);
  };

  // 🔥 GALLERY UPLOAD
  const handleGalleryUpload = async (files) => {
    setUploading(true);

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

  // 🔥 REMOVE IMAGE
  const removeImage = (index) => {
    const updated = [...form.media.gallery];
    updated.splice(index, 1);

    setForm({
      ...form,
      media: { ...form.media, gallery: updated },
    });
  };

  // 🔥 FLOOR PLAN UPLOAD
  const handleFloorPlanUpload = async (file, index) => {
    setUploading(true);
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

    setUploading(false);
  };

  return (
    <div className="section space-y-10 relative">

      {/* LOADER OVERLAY */}
      {uploading && (
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-2xl z-10">
          <p className="text-white text-lg animate-pulse">
            Uploading...
          </p>
        </div>
      )}

      <h2 className="section-title">Media & Assets</h2>

      {/* HERO IMAGE */}
      <div>
        <p className="text-white font-semibold mb-3">Hero Image</p>

        <div
          className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center cursor-pointer hover:bg-white/10 transition"
          onClick={() => document.getElementById("heroUpload").click()}
        >
          <p className="text-gray-300">
            Click or drag image here
          </p>

          <input
            id="heroUpload"
            type="file"
            hidden
            onChange={(e) => handleHeroUpload(e.target.files[0])}
          />
        </div>

        {form.media.heroImageUrl && (
          <img
            src={form.media.heroImageUrl}
            className="w-full h-64 object-cover rounded-xl mt-4 shadow-lg"
          />
        )}
      </div>

      {/* GALLERY */}
      <div>
        <p className="text-white font-semibold mb-3">Gallery</p>

        <div
          className="border-2 border-dashed border-white/30 rounded-xl p-6 text-center cursor-pointer hover:bg-white/10 transition"
          onClick={() => document.getElementById("galleryUpload").click()}
        >
          <p className="text-gray-300">
            Upload multiple images
          </p>

          <input
            id="galleryUpload"
            type="file"
            multiple
            hidden
            onChange={(e) =>
              handleGalleryUpload(Array.from(e.target.files))
            }
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
          {form.media.gallery.map((img, i) => (
            <div key={i} className="relative group">
              <img
                src={img}
                className="h-32 w-full object-cover rounded-xl transition group-hover:scale-105"
              />

              {/* DELETE BUTTON */}
              <button
                onClick={() => removeImage(i)}
                className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FLOOR PLANS */}
      <div>
        <p className="text-white font-semibold mb-4">Floor Plans</p>

        {form.gatedContent.floorPlans.map((fp, i) => (
          <div
            key={i}
            className="glass p-5 rounded-xl space-y-3 mb-4"
          >
            <input
              placeholder="Plan Title"
              className="input"
              value={fp.title}
              onChange={(e) => {
                const arr = [...form.gatedContent.floorPlans];
                arr[i].title = e.target.value;

                setForm({
                  ...form,
                  gatedContent: {
                    ...form.gatedContent,
                    floorPlans: arr,
                  },
                });
              }}
            />

            <div
              className="border border-white/20 rounded-lg p-4 text-center cursor-pointer hover:bg-white/10"
              onClick={() =>
                document.getElementById(`fp-${i}`).click()
              }
            >
              Upload Floor Plan
              <input
                id={`fp-${i}`}
                type="file"
                hidden
                onChange={(e) =>
                  handleFloorPlanUpload(e.target.files[0], i)
                }
              />
            </div>

            {fp.image && (
              <img
                src={fp.image}
                className="h-32 rounded-lg"
              />
            )}
          </div>
        ))}

        <button
          onClick={() =>
            setForm({
              ...form,
              gatedContent: {
                ...form.gatedContent,
                floorPlans: [
                  ...form.gatedContent.floorPlans,
                  { title: "", image: "" },
                ],
              },
            })
          }
          className="text-gold"
        >
          + Add Floor Plan
        </button>
      </div>
    </div>
  );
}