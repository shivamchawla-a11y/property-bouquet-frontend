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

    // Original file (contains originalname)
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
      throw new Error(result.message || "Upload failed");
    }

    return {
      url: result.url,
      alt: result.alt || file.name.replace(/\.[^/.]+$/, ""),
      publicId: result.public_id || "",
    };
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

    const uploaded = await uploadImage(file);

if (uploaded) {
  setForm((prev) => ({
    ...prev,
    media: {
      ...prev.media,
      heroImageUrl: uploaded.url,
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

    const uploads = await Promise.all(
  validFiles.map(uploadImage)
);

const cleanUrls = uploads
  .filter(Boolean)
  .map((item) => item.url);

    if (cleanUrls.length) {
      setForm((prev) => ({
        ...prev,
        media: {
          ...prev.media,
          gallery: [
            ...(prev.media.gallery || []),
            ...cleanUrls,
          ],
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

  // ================= FLOOR PLAN IMAGE =================
  const handleFloorPlanUpload = async (
    file,
    index
  ) => {
    if (!validateFile(file)) return;

    setUploading(true);

    const uploaded = await uploadImage(file);

if (uploaded) {
      setForm((prev) => {
        const updated = [
          ...(prev.gatedContent.floorPlans || []),
        ];

        if (!updated[index]) {
          updated[index] = {
            unitType: "",
            area: "",
            price: "",
            paymentPlan: "",
            bedrooms: "",
            bathrooms: "",
            balconies: "",
            image: "",
          };
        }

        updated[index].image = uploaded.url;

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

      {/* ================= LOADER ================= */}
      {uploading && (
        <div className="absolute inset-0 bg-black/60 flex items-center justify-center rounded-xl z-10">
          <p className="text-white text-lg animate-pulse">
            Uploading...
          </p>
        </div>
      )}

      <h2 className="section-title">
        Media & Assets
      </h2>

      {/* ================= CONFIGURATION CMS ================= */}
      <div className="glass p-6 rounded-2xl border border-white/10">

        <h3 className="text-white text-xl font-semibold mb-5">
          Configuration Section CMS
        </h3>

        {/* SECTION NUMBER */}
        <input
          className="input mb-4"
          placeholder="Section Number"
          value={
            form.configurationSection
              ?.sectionNumber || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                sectionNumber: e.target.value,
              },
            }))
          }
        />

        {/* SECTION LABEL */}
        <input
          className="input mb-4"
          placeholder="Section Label"
          value={
            form.configurationSection
              ?.sectionLabel || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                sectionLabel: e.target.value,
              },
            }))
          }
        />

        {/* TITLE LINE 1 */}
        <input
          className="input mb-4"
          placeholder="Title Line 1"
          value={
            form.configurationSection
              ?.titleLine1 || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                titleLine1: e.target.value,
              },
            }))
          }
        />

        {/* TITLE LINE 2 */}
        <input
          className="input mb-4"
          placeholder="Title Line 2 (Golden)"
          value={
            form.configurationSection
              ?.titleLine2 || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                titleLine2: e.target.value,
              },
            }))
          }
        />

        {/* SUBHEADING */}
        <textarea
          className="input min-h-[120px] mb-4"
          placeholder="Subheading"
          value={
            form.configurationSection
              ?.subheading || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                subheading: e.target.value,
              },
            }))
          }
        />

        {/* BUTTON TEXT */}
        <input
          className="input mb-5"
          placeholder="Button Text"
          value={
            form.configurationSection
              ?.buttonText || ""
          }
          onChange={(e) =>
            setForm((prev) => ({
              ...prev,
              configurationSection: {
                ...prev.configurationSection,
                buttonText: e.target.value,
              },
            }))
          }
        />

        {/* FEATURES */}
        <div className="space-y-3">

          <div className="flex items-center justify-between">

            <p className="text-white font-medium">
              Configuration Features
            </p>

            <button
              type="button"
              onClick={() =>
                setForm((prev) => ({
                  ...prev,
                  configurationSection: {
                    ...prev.configurationSection,
                    features: [
                      ...(prev.configurationSection
                        ?.features || []),
                      "",
                    ],
                  },
                }))
              }
              className="px-4 py-2 rounded-xl bg-[#D4AF37] text-black"
            >
              + Add Feature
            </button>
          </div>

          {(form.configurationSection
            ?.features || []).map(
            (item, index) => (
              <div
                key={index}
                className="flex gap-2"
              >

                <input
                  className="input"
                  placeholder={`Feature ${
                    index + 1
                  }`}
                  value={item}
                  onChange={(e) => {
                    const updated = [
                      ...(form
                        .configurationSection
                        ?.features || []),
                    ];

                    updated[index] =
                      e.target.value;

                    setForm((prev) => ({
                      ...prev,
                      configurationSection: {
                        ...prev.configurationSection,
                        features: updated,
                      },
                    }));
                  }}
                />

                <button
                  type="button"
                  onClick={() => {
                    const updated =
                      form.configurationSection.features.filter(
                        (_, i) =>
                          i !== index
                      );

                    setForm((prev) => ({
                      ...prev,
                      configurationSection: {
                        ...prev.configurationSection,
                        features: updated,
                      },
                    }));
                  }}
                  className="bg-red-500 text-white px-3 rounded-lg"
                >
                  ✕
                </button>
              </div>
            )
          )}
        </div>
      </div>


      {/* ================= GALLERY ================= */}
<div className="mt-8">

  <label className="block text-white font-semibold mb-3">
    Property Gallery
  </label>

  {/* Upload Area */}
  <div
    onClick={() =>
      document
        .getElementById("galleryUpload")
        .click()
    }
    className="
      relative
      group
      cursor-pointer
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      border-white/20
      bg-white/5
      hover:border-[#C6A15B]
      hover:bg-white/10
      transition-all
      duration-300
    "
  >

    <div
      className="
        py-14
        px-6
        flex
        flex-col
        items-center
        justify-center
        text-center
      "
    >
      <div
        className="
          h-16
          w-16
          rounded-full
          bg-white/10
          flex
          items-center
          justify-center
          mb-4
        "
      >
        <svg
          className="w-8 h-8 text-[#C6A15B]"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
      </div>

      <h4 className="text-white font-semibold text-lg">
        Upload Gallery Images
      </h4>

      <p className="text-gray-400 text-sm mt-2">
        Upload multiple images for the property
      </p>

      <p className="text-gray-500 text-xs mt-1">
        JPG, PNG, WEBP • Max 5MB each
      </p>
    </div>
  </div>

  <input
    id="galleryUpload"
    type="file"
    hidden
    multiple
    accept="image/*"
    onChange={(e) => {
      handleGalleryUpload(
        Array.from(e.target.files)
      );

      e.target.value = "";
    }}
  />

  {/* Gallery Preview Grid */}
  {(form.media?.gallery || []).length > 0 && (

    <div className="mt-6">

      <div className="flex items-center justify-between mb-4">

        <p className="text-white font-medium">
          Uploaded Images
        </p>

        <span className="text-xs text-white/50">
          {(form.media?.gallery || []).length}
          {" "}
          Images
        </span>

      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">

        {(form.media?.gallery || [])
          .filter(
            (img) =>
              img && img.trim()
          )
          .map((img, i) => (

            <div
              key={i}
              className="
                relative
                group
                overflow-hidden
                rounded-2xl
                border
                border-white/10
              "
            >

              <img
                src={img}
                alt=""
                className="
                  w-full
                  h-[180px]
                  object-cover
                  transition-all
                  duration-500
                  group-hover:scale-110
                "
              />

              {/* Hover Overlay */}
              <div
                className="
                  absolute
                  inset-0
                  bg-black/50
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                  duration-300
                "
              />

              {/* Image Number */}
              <div
                className="
                  absolute
                  bottom-3
                  left-3
                  px-2
                  py-1
                  rounded-lg
                  bg-black/60
                  text-white
                  text-xs
                "
              >
                #{i + 1}
              </div>

              {/* Remove Button */}
              <button
                type="button"
                onClick={() =>
                  removeImage(i)
                }
                className="
                  absolute
                  top-3
                  right-3
                  h-8
                  w-8
                  rounded-full
                  bg-red-500
                  text-white
                  flex
                  items-center
                  justify-center
                  shadow-lg
                  opacity-0
                  group-hover:opacity-100
                  transition-all
                "
              >
                ✕
              </button>

            </div>
          ))}
      </div>
    </div>
  )}

</div>
      {/* ================= FLOOR PLANS ================= */}
<div>
  <p className="text-white font-semibold mb-4">
    Floor Plans
  </p>

  {(
    form.gatedContent?.floorPlans || []
  ).map((floorPlan, i) => {

    // ✅ SAFE OBJECT NORMALIZATION
    const fp = {
      unitType: "",
      area: "",
      price: "",
      paymentPlan: "",
      bedrooms: "",
      bathrooms: "",
      balconies: "",
      image: "",
      ...floorPlan,
    };

    return (
      <div
        key={i}
        className="glass p-4 rounded-lg space-y-3 mb-4"
      >

        {/* UNIT TYPE */}
        <input
          className="input"
          placeholder="Unit Type (e.g. 3 BHK)"
          value={fp.unitType}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              unitType: e.target.value,
            };

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
          value={fp.area}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              area: e.target.value,
            };

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
          value={fp.price}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              price: e.target.value,
            };

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
          value={fp.paymentPlan}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              paymentPlan: e.target.value,
            };

            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: arr,
              },
            }));
          }}
        />

        {/* BEDROOMS */}
        <input
          className="input"
          placeholder="Bedrooms (e.g. 4)"
          value={fp.bedrooms}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              bedrooms: e.target.value,
            };

            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: arr,
              },
            }));
          }}
        />

        {/* BATHROOMS */}
        <input
          className="input"
          placeholder="Bathrooms (e.g. 4)"
          value={fp.bathrooms}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              bathrooms: e.target.value,
            };

            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: arr,
              },
            }));
          }}
        />

        {/* BALCONIES */}
        <input
          className="input"
          placeholder="Balconies (e.g. 3)"
          value={fp.balconies}
          onChange={(e) => {
            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              balconies: e.target.value,
            };

            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: arr,
              },
            }));
          }}
        />

        {/* ================= FLOOR PLAN IMAGE ================= */}
<div>
  <label className="block text-white font-semibold mb-3">
    Floor Plan Image
  </label>

  <div
    onClick={() =>
      document
        .getElementById(`fp-${i}`)
        .click()
    }
    className={`
      relative
      group
      cursor-pointer
      overflow-hidden
      rounded-2xl
      border-2
      border-dashed
      border-white/20
      bg-white/5
      hover:border-[#C6A15B]
      hover:bg-white/10
      transition-all
      duration-300
    `}
  >

    {/* IMAGE EXISTS */}
    {fp.image ? (

      <div className="relative">

        <img
          src={fp.image}
          alt="Floor Plan"
          className="
            w-full
            h-[260px]
            object-cover
          "
        />

        {/* Overlay */}
        <div
          className="
            absolute
            inset-0
            bg-black/50
            opacity-0
            group-hover:opacity-100
            transition-all
            duration-300
            flex
            flex-col
            items-center
            justify-center
          "
        >
          <svg
            className="w-8 h-8 text-white mb-2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1M12 4v12m0 0l-4-4m4 4l4-4"
            />
          </svg>

          <p className="text-white font-medium">
            Change Image
          </p>
        </div>

        {/* Remove Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();

            const arr = [
              ...(form.gatedContent?.floorPlans || []),
            ];

            arr[i] = {
              ...fp,
              image: "",
            };

            setForm((prev) => ({
              ...prev,
              gatedContent: {
                ...prev.gatedContent,
                floorPlans: arr,
              },
            }));
          }}
          className="
            absolute
            top-3
            right-3
            h-9
            w-9
            rounded-full
            bg-red-500
            text-white
            flex
            items-center
            justify-center
            shadow-lg
            hover:scale-110
            transition
          "
        >
          ✕
        </button>

      </div>

    ) : (

      <div
        className="
          py-14
          px-6
          flex
          flex-col
          items-center
          justify-center
          text-center
        "
      >

        <div
          className="
            h-16
            w-16
            rounded-full
            bg-white/10
            flex
            items-center
            justify-center
            mb-4
          "
        >
          <svg
            className="w-8 h-8 text-[#C6A15B]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        <h4 className="text-white font-semibold text-lg">
          Upload Floor Plan
        </h4>

        <p className="text-gray-400 text-sm mt-2">
          Drag & drop or click to upload
        </p>

        <p className="text-gray-500 text-xs mt-1">
          JPG, PNG, WEBP • Max 5MB
        </p>

      </div>

    )}
  </div>

  <input
    id={`fp-${i}`}
    type="file"
    hidden
    accept="image/*"
    onChange={(e) => {
      handleFloorPlanUpload(
        e.target.files[0],
        i
      );

      e.target.value = "";
    }}
  />
</div>

        {/* REMOVE FLOOR PLAN */}
        <button
          type="button"
          onClick={() => {
            const arr =
              form.gatedContent?.floorPlans?.filter(
                (_, idx) => idx !== i
              ) || [];

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
    );
  })}

  {/* ================= ADD FLOOR PLAN ================= */}
  <button
    type="button"
    onClick={() =>
      setForm((prev) => ({
        ...prev,
        gatedContent: {
          ...prev.gatedContent,
          floorPlans: [
            ...(prev.gatedContent?.floorPlans || []),

            {
              unitType: "",
              area: "",
              price: "",
              paymentPlan: "",
              bedrooms: "",
              bathrooms: "",
              balconies: "",
              image: "",
            },
          ],
        },
      }))
    }
    className="
mt-4
px-5
py-3
rounded-2xl
bg-[#C6A15B]
text-black
font-semibold
hover:scale-[1.02]
transition
"
  >
    + Add Floor Plan
  </button>
</div>
    </div>
  );
}