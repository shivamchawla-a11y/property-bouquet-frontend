"use client";

import { useState } from "react";

export default function HeroImageUpload({
  form,
  setForm,
}) {
  const [uploading, setUploading] =
    useState(false);

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
        "/api/upload",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(
          result.message || "Upload failed"
        );
      }

      return result.url;
    } catch (err) {
      console.error(
        "Upload Error:",
        err
      );

      alert("Upload failed ❌");

      return null;
    }
  };

  // ================= HERO =================
  const handleHeroUpload = async (
    file
  ) => {
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

  return (
    <div className="relative">

      {/* ================= LOADER ================= */}
      {uploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
          <p className="text-white text-lg animate-pulse">
            Uploading...
          </p>
        </div>
      )}

      {/* ================= HERO ================= */}
      <div>

        <p className="text-white font-semibold mb-3">
          Hero Image
        </p>

        <div
          className="upload-box cursor-pointer"
          onClick={() =>
            document
              .getElementById(
                "heroUpload"
              )
              .click()
          }
        >
          Upload Hero Image
        </div>

        <input
          id="heroUpload"
          type="file"
          hidden
          accept="image/*"
          onChange={(e) => {
            handleHeroUpload(
              e.target.files[0]
            );

            e.target.value = "";
          }}
        />

        {form.media?.heroImageUrl?.trim() && (
          <div className="relative mt-4">

            <img
              src={
                form.media.heroImageUrl
              }
              className="preview-img"
              alt=""
            />

            <button
              type="button"
              onClick={removeHero}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
}