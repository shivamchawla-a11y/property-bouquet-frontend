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

    const urls = await Promise.all(
      validFiles.map(uploadImage)
    );

    const cleanUrls = urls.filter(
      (u) => u && u.trim()
    );

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

    const url = await uploadImage(file);

    if (url) {
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

      {/* ================= HERO ================= */}
      <div>

        <p className="text-white font-semibold mb-3">
          Hero Image
        </p>

        <div
          className="upload-box cursor-pointer"
          onClick={() =>
            document
              .getElementById("heroUpload")
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

        <p className="text-white font-semibold mb-3">
          Gallery
        </p>

        <div
          className="upload-box cursor-pointer"
          onClick={() =>
            document
              .getElementById("galleryUpload")
              .click()
          }
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
            handleGalleryUpload(
              Array.from(e.target.files)
            );

            e.target.value = "";
          }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">

          {(form.media?.gallery || [])
            .filter(
              (img) => img && img.trim()
            )
            .map((img, i) => (
              <div
                key={i}
                className="relative group"
              >

                <img
                  src={img}
                  className="preview-thumb"
                  alt=""
                />

                <button
                  onClick={() =>
                    removeImage(i)
                  }
                  className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
                >
                  ✕
                </button>
              </div>
            ))}
        </div>
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

        {/* IMAGE UPLOAD */}
        <div
          className="upload-box cursor-pointer"
          onClick={() =>
            document
              .getElementById(`fp-${i}`)
              .click()
          }
        >
          Upload Floor Plan Image
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

        {/* IMAGE PREVIEW */}
        {fp.image && (
          <div className="relative">
            <img
              src={fp.image}
              className="preview-thumb"
              alt=""
            />

            <button
              onClick={() => {
                const arr = [
                  ...(form.gatedContent
                    ?.floorPlans || []),
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
              className="absolute top-1 right-1 bg-red-500 text-white px-2 py-1 rounded text-xs"
            >
              ✕
            </button>
          </div>
        )}

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
    className="text-gold"
  >
    + Add Floor Plan
  </button>
</div>
    </div>
  );
}