"use client";

import { useState } from "react";

export default function StepMedia({ form, setForm }) {
  const [uploading, setUploading] = useState(false);

  // 🔥 CLOUDINARY UPLOAD
  const uploadImage = async (file) => {
    try {
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

      if (!res.ok) {
        throw new Error(result.message || "Upload failed");
      }

      return result.url;

    } catch (err) {
      console.error("Upload Error:", err);
      alert("Image upload failed ❌");
      return null;
    }
  };

  // 🔥 HERO
  const handleHeroUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);

    if (url) {
      setForm((prev) => ({
        ...prev,
        media: { ...prev.media, heroImageUrl: url },
      }));
    }

    setUploading(false);
  };

  // 🔥 GALLERY
  const handleGalleryUpload = async (files) => {
    setUploading(true);

    const uploadedUrls = [];

    for (let file of files) {
      const url = await uploadImage(file);
      if (url) uploadedUrls.push(url);
    }

    setForm((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        gallery: [...prev.media.gallery, ...uploadedUrls],
      },
    }));

    setUploading(false);
  };

  // 🔥 REMOVE IMAGE
  const removeImage = (index) => {
    setForm((prev) => {
      const updated = [...prev.media.gallery];
      updated.splice(index, 1);

      return {
        ...prev,
        media: { ...prev.media, gallery: updated },
      };
    });
  };

  // 🔥 FLOOR PLAN
  const handleFloorPlanUpload = async (file, index) => {
    if (!file) return;

    setUploading(true);
    const url = await uploadImage(file);

    if (url) {
      setForm((prev) => {
        const updated = [...prev.gatedContent.floorPlans];
        updated[index].image = url;

        return {
          ...prev,
          gatedContent: {
            ...prev.gatedContent,
            floorPlans: updated,
          },
        };
      });
    }

    setUploading(false);
  };

  return (
    <div className="section space-y-10 relative">

      {/* LOADER */}
      {uploading && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-xl z-10">
          <p className="text-white text-lg animate-pulse">
            Uploading to Cloudinary...
          </p>
        </div>
      )}

      <h2 className="section-title">Media & Assets</h2>

      {/* HERO */}
      <div>
        <p className="text-white font-semibold mb-3">Hero Image</p>

        <div
          className="upload-box"
          onClick={() => document.getElementById("heroUpload").click()}
        >
          Click to upload hero image
        </div>

        <input
          id="heroUpload"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => handleHeroUpload(e.target.files[0])}
        />

        {form.media.heroImageUrl && (
          <img
            src={form.media.heroImageUrl}
            className="preview-img"
          />
        )}
      </div>

      {/* GALLERY */}
      <div>
        <p className="text-white font-semibold mb-3">Gallery</p>

        <div
          className="upload-box"
          onClick={() => document.getElementById("galleryUpload").click()}
        >
          Upload multiple images
        </div>

        <input
          id="galleryUpload"
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) =>
            handleGalleryUpload(Array.from(e.target.files))
          }
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {form.media.gallery.map((img, i) => (
            <div key={i} className="relative group">
              <img src={img} className="preview-thumb" />

              <button
                onClick={() => removeImage(i)}
                className="delete-btn"
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
          <div key={i} className="glass p-4 rounded-lg space-y-3 mb-4">

            <input
              className="input"
              placeholder="Plan Title"
              value={fp.title}
              onChange={(e) => {
                const arr = [...form.gatedContent.floorPlans];
                arr[i].title = e.target.value;

                setForm((prev) => ({
                  ...prev,
                  gatedContent: {
                    ...prev.gatedContent,
                    floorPlans: arr,
                  },
                }));
              }}
            />

            <div
              className="upload-box"
              onClick={() => document.getElementById(`fp-${i}`).click()}
            >
              Upload Floor Plan
            </div>

            <input
              id={`fp-${i}`}
              type="file"
              hidden
              accept="image/*"
              onChange={(e) =>
                handleFloorPlanUpload(e.target.files[0], i)
              }
            />

            {fp.image && <img src={fp.image} className="preview-thumb" />}
          </div>
        ))}

        <button
          onClick={() =>
            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: [
                  ...prev.gatedContent.floorPlans,
                  { title: "", image: "" },
                ],
              },
            }))
          }
          className="text-gold"
        >
          + Add Floor Plan
        </button>
      </div>

    </div>
  );
}