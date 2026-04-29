"use client";

import { useState } from "react";

export default function StepMedia({ form, setForm }) {
  const [uploading, setUploading] = useState(false);

  // ================= VALIDATION =================
  const validateFile = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed ❌");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Max file size is 5MB ❌");
      return false;
    }

    return true;
  };

  // ================= UPLOAD =================
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

      if (!res.ok || !result.url) {
        throw new Error(result.message || "Upload failed");
      }

      return result.url;
    } catch (err) {
      console.error("Upload Error:", err);
      alert("Upload failed ❌");
      return null;
    }
  };

  // ================= HERO =================
  const handleHeroUpload = async (file) => {
    if (!validateFile(file)) return;

    setUploading(true);

    const url = await uploadImage(file);

    if (url) {
      setForm((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          heroImageUrl: url,
        },
      }));
    }

    setUploading(false);
  };

  const removeHero = () => {
    setForm((prev) => ({
      ...prev,
      media: {
        ...prev.media,
        heroImageUrl: "",
      },
    }));
  };

  // ================= GALLERY =================
  const handleGalleryUpload = async (files) => {
    const validFiles = files.filter(validateFile);
    if (validFiles.length === 0) return;

    setUploading(true);

    // 🔥 parallel upload
    const urls = await Promise.all(validFiles.map(uploadImage));
    const cleanUrls = urls.filter((u) => u && u.trim());

    if (cleanUrls.length) {
      setForm((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          gallery: [...(prev.media.gallery || []), ...cleanUrls],
        },
      }));
    }

    setUploading(false);
  };

  const removeImage = (index) => {
    setForm((prev) => {
      const updated = [...(prev.media.gallery || [])];
      updated.splice(index, 1);

      return {
        ...prev,
        media: {
          ...prev.media,
          gallery: updated,
        },
      };
    });
  };

  // ================= FLOOR PLAN =================
  const handleFloorPlanUpload = async (file, index) => {
    if (!validateFile(file)) return;

    setUploading(true);

    const url = await uploadImage(file);

    if (url) {
      setForm((prev) => {
        const updated = [...(prev.gatedContent.floorPlans || [])];

        if (!updated[index]) {
          updated[index] = { title: "", image: "" };
        }

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

  // ================= UI =================
  return (
    <div className="section space-y-10 relative">

      {/* LOADER */}
      {uploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
          <p className="text-white text-lg animate-pulse">
            Uploading...
          </p>
        </div>
      )}

      <h2 className="section-title">Media & Assets</h2>

      {/* ================= HERO ================= */}
      <div>
        <p className="text-white font-semibold mb-3">Hero Image</p>

        <div
          className="upload-box cursor-pointer"
          onClick={() => document.getElementById("heroUpload").click()}
        >
          Upload Hero Image
        </div>

        <input
          id="heroUpload"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            handleHeroUpload(e.target.files[0]);
            e.target.value = "";
          }}
        />

        {form.media?.heroImageUrl?.trim() && (
          <div className="relative mt-4">
            <img
              src={form.media.heroImageUrl}
              className="preview-img"
              alt=""
            />

            <button
              onClick={removeHero}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* ================= GALLERY ================= */}
      <div>
        <p className="text-white font-semibold mb-3">Gallery</p>

        <div
          className="upload-box cursor-pointer"
          onClick={() => document.getElementById("galleryUpload").click()}
        >
          Upload Images
        </div>

        <input
          id="galleryUpload"
          type="file"
          hidden
          multiple
          accept="image/*"
          onChange={(e) => {
            handleGalleryUpload(Array.from(e.target.files));
            e.target.value = "";
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
          {(form.media?.gallery || [])
            .filter((img) => img && img.trim())
            .map((img, i) => (
              <div key={i} className="relative group">
                <img src={img} className="preview-thumb" alt="" />

                <button
                  onClick={() => removeImage(i)}
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
      </div>

      {/* ================= FLOOR PLANS ================= */}
      {/* ================= FLOOR PLANS ================= */}
<div>
  <p className="text-white font-semibold mb-4">Floor Plans</p>

  {(form.gatedContent?.floorPlans || []).map((fp, i) => (
    <div key={i} className="glass p-4 rounded-lg space-y-3 mb-4">

      {/* UNIT TYPE */}
      <input
        className="input"
        placeholder="Unit Type (e.g. 3 BHK)"
        value={fp.unitType || ""}
        onChange={(e) => {
          const arr = [...form.gatedContent.floorPlans];
          arr[i].unitType = e.target.value;

          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              floorPlans: arr,
            },
          }));
        }}
      />

      {/* AREA */}
      <input
        className="input"
        placeholder="Area (e.g. 3000 Sq Ft)"
        value={fp.area || ""}
        onChange={(e) => {
          const arr = [...form.gatedContent.floorPlans];
          arr[i].area = e.target.value;

          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              floorPlans: arr,
            },
          }));
        }}
      />

      {/* PRICE */}
      <input
        className="input"
        placeholder="Price (e.g. ₹ 5 Cr)"
        value={fp.price || ""}
        onChange={(e) => {
          const arr = [...form.gatedContent.floorPlans];
          arr[i].price = e.target.value;

          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              floorPlans: arr,
            },
          }));
        }}
      />

      {/* PAYMENT PLAN */}
      <input
        className="input"
        placeholder="Payment Plan (e.g. 30:70)"
        value={fp.paymentPlan || ""}
        onChange={(e) => {
          const arr = [...form.gatedContent.floorPlans];
          arr[i].paymentPlan = e.target.value;

          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              floorPlans: arr,
            },
          }));
        }}
      />

      {/* IMAGE UPLOAD */}
      <div
        className="upload-box cursor-pointer"
        onClick={() => document.getElementById(`fp-${i}`).click()}
      >
        Upload Floor Plan Image
      </div>

      <input
        id={`fp-${i}`}
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => {
          handleFloorPlanUpload(e.target.files[0], i);
          e.target.value = "";
        }}
      />

      {/* PREVIEW */}
      {fp.image && fp.image.trim() && (
        <div className="relative">
          <img src={fp.image} className="preview-thumb" alt="" />

          <button
            onClick={() => {
              const arr = [...form.gatedContent.floorPlans];
              arr[i].image = "";

              setForm((prev) => ({
                ...prev,
                gatedContent: {
                  ...prev.gatedContent,
                  floorPlans: arr,
                },
              }));
            }}
            className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* DELETE FULL ITEM */}
      <button
        onClick={() => {
          const arr = form.gatedContent.floorPlans.filter(
            (_, idx) => idx !== i
          );

          setForm((prev) => ({
            ...prev,
            gatedContent: {
              ...prev.gatedContent,
              floorPlans: arr,
            },
          }));
        }}
        className="text-red-400 text-sm"
      >
        ❌ Remove Floor Plan
      </button>
    </div>
  ))}

  {/* ADD NEW */}
  <button
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        gatedContent: {
          ...prev.gatedContent,
          floorPlans: [
            ...(prev.gatedContent.floorPlans || []),
            {
              unitType: "",
              area: "",
              price: "",
              paymentPlan: "",
              image: "",
            },
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