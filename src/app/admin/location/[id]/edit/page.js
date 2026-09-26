"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  ArrowLeft,
  Save,
  Upload,
  Eye,
  MapPin,
  Loader2,
} from "lucide-react";

import RichTextEditor from "@/app/admin/RichTextEditor";

const API = "/api";

/* ============================================================
   EMPTY CONTENT
============================================================ */

const createEmptyContent = () => ({
  hero: {
    eyebrow: "",
    title: "",
    description: "",
    image: "",
    locationLabel: "",
    whyTitle: "",
    whyDescription: "",
    benefits: ["", "", "", ""],
    mobileBenefits: ["", "", "", ""],
    primaryCtaText: "",
    primaryCtaLink: "",
    secondaryCtaText: "",
    secondaryCtaLink: "",
    footerEyebrow: "",
    footerText: "",
  },

  about: {
    enabled: true,
    eyebrow: "",
    title: "",
    content: "",
    image: "",
    highlights: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    marketEyebrow: "",
    marketTitle: "",
    marketDescription: "",
    marketInsights: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
    perspectiveEyebrow: "",
    perspectiveQuote: "",
  },

  connectivity: {
    eyebrow: "",
    title: "",
    description: "",
    image: "",
    items: [
      { title: "", subtitle: "" },
      { title: "", subtitle: "" },
      { title: "", subtitle: "" },
      { title: "", subtitle: "" },
      { title: "", subtitle: "" },
      { title: "", subtitle: "" },
    ],
    advantageEyebrow: "",
    advantageTitle: "",
  },

  nearby: {
    eyebrow: "",
    title: "",
    description: "",
  },

  // ==========================================================
  // REAL ESTATE TYPES
  // ==========================================================

  realEstateTypes: {
    eyebrow: "",
    title: "",
    description: "",
    cards: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  },

  // ==========================================================
  // PROPERTY PRICES
  // ==========================================================

  propertyPrices: {
    eyebrow: "",
    title: "",
    description: "",
    ctaText: "",
    ctaLink: "",
    factorsTitle: "",
    factors: [
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ],
    currentPricingTitle: "",
    currentPricingDescription: "",
  },

  // ==========================================================
  // LIFESTYLE
  // ==========================================================

  lifestyle: {
    eyebrow: "",
    title: "",
    description: "",
    groups: [
      {
        title: "",
        description: "",
        items: ["", "", "", ""],
      },
      {
        title: "",
        description: "",
        items: ["", "", "", ""],
      },
      {
        title: "",
        description: "",
        items: ["", "", "", ""],
      },
    ],
  },

  // ==========================================================
  // WHY BUY
  // ==========================================================

  whyBuy: {
    eyebrow: "",
    title: "",
    description: "",
    reasons: [
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
      { title: "", description: "" },
    ],
  },

  // ==========================================================
  // FAQ
  // ==========================================================

  faq: {
    eyebrow: "",
    title: "",
    description: "",
    items: [
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
      { question: "", answer: "" },
    ],
  },

  sections: [],
});

/* ============================================================
   TOKEN
============================================================ */

const getToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null
  );
};

/* ============================================================
   RESPONSE READER
============================================================ */

async function readResponse(res) {
  const contentType =
    res.headers.get("content-type") || "";

  const text = await res.text();

  if (
    contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error(
        "The server returned invalid JSON."
      );
    }
  }

  throw new Error(
    text ||
      `Server returned an unexpected response (HTTP ${res.status}).`
  );
}

/* ============================================================
   NORMALIZE
============================================================ */

function normalizeContent(source) {
  const base = createEmptyContent();
  const input = source && typeof source === "object" ? source : {};

  const hero = input.hero && typeof input.hero === "object" ? input.hero : {};
  const about = input.about && typeof input.about === "object" ? input.about : {};
  const connectivity =
    input.connectivity && typeof input.connectivity === "object"
      ? input.connectivity
      : {};
  const nearby =
    input.nearby && typeof input.nearby === "object" ? input.nearby : {};

  const realEstateTypes =
    input.realEstateTypes && typeof input.realEstateTypes === "object"
      ? input.realEstateTypes
      : {};

  const propertyPrices =
    input.propertyPrices && typeof input.propertyPrices === "object"
      ? input.propertyPrices
      : {};

  const lifestyle =
    input.lifestyle && typeof input.lifestyle === "object"
      ? input.lifestyle
      : {};

  const whyBuy =
    input.whyBuy && typeof input.whyBuy === "object"
      ? input.whyBuy
      : {};

  const faq =
    input.faq && typeof input.faq === "object" ? input.faq : {};

  return {
    id: input.id || base.id,

    // ============================================================
    // HERO
    // ============================================================

    hero: {
      ...base.hero,
      ...hero,

      benefits: Array.isArray(hero.benefits)
        ? hero.benefits
        : base.hero.benefits,

      mobileBenefits: Array.isArray(hero.mobileBenefits)
        ? hero.mobileBenefits
        : base.hero.mobileBenefits,
    },

    // ============================================================
    // ABOUT
    // ============================================================

    about: {
      ...base.about,
      ...about,

      enabled: about.enabled !== false,

      highlights: Array.isArray(about.highlights)
        ? about.highlights.map((item) => ({
            title: item?.title || "",
            description: item?.description || "",
          }))
        : base.about.highlights,

      marketInsights: Array.isArray(about.marketInsights)
        ? about.marketInsights.map((item) => ({
            title: item?.title || "",
            description: item?.description || "",
          }))
        : base.about.marketInsights,
    },

    // ============================================================
    // CONNECTIVITY
    // ============================================================

    connectivity: {
      ...base.connectivity,
      ...connectivity,

      items: Array.isArray(connectivity.items)
        ? connectivity.items.map((item) => ({
            title: item?.title || "",
            subtitle: item?.subtitle || "",
          }))
        : base.connectivity.items,
    },

    // ============================================================
    // NEARBY
    // ============================================================

    nearby: {
      ...base.nearby,
      ...nearby,
    },

    // ============================================================
    // REAL ESTATE TYPES
    // ============================================================

    realEstateTypes: {
      ...base.realEstateTypes,
      ...realEstateTypes,

      cards: Array.isArray(realEstateTypes.cards)
        ? realEstateTypes.cards.map((item) => ({
            title: item?.title || "",
            description: item?.description || "",
          }))
        : base.realEstateTypes.cards,
    },

    // ============================================================
    // PROPERTY PRICES
    // ============================================================

    propertyPrices: {
      ...base.propertyPrices,
      ...propertyPrices,

      factors: Array.isArray(propertyPrices.factors)
        ? propertyPrices.factors.map((item) => item || "")
        : base.propertyPrices.factors,
    },

    // ============================================================
    // LIFESTYLE
    // ============================================================

    lifestyle: {
      ...base.lifestyle,
      ...lifestyle,

      groups: Array.isArray(lifestyle.groups)
        ? lifestyle.groups.map((group) => ({
            title: group?.title || "",
            description: group?.description || "",
            items: Array.isArray(group?.items)
              ? group.items.map((item) => item || "")
              : [],
          }))
        : base.lifestyle.groups,
    },

    // ============================================================
    // WHY BUY
    // ============================================================

    whyBuy: {
      ...base.whyBuy,
      ...whyBuy,

      reasons: Array.isArray(whyBuy.reasons)
        ? whyBuy.reasons.map((item) => ({
            title: item?.title || "",
            description: item?.description || "",
          }))
        : base.whyBuy.reasons,
    },

    // ============================================================
    // FAQ
    // ============================================================

    faq: {
      ...base.faq,
      ...faq,

      items: Array.isArray(faq.items)
        ? faq.items.map((item) => ({
            question: item?.question || "",
            answer: item?.answer || "",
          }))
        : base.faq.items,
    },

    // ============================================================
    // CUSTOM SECTIONS
    // ============================================================

    sections: Array.isArray(input.sections)
      ? input.sections
      : [],
  };
}

/* ============================================================
   COMPONENT
============================================================ */

export default function LocationPageEditor() {
  const params = useParams();
  const router = useRouter();

  const locationId =
    params?.id;

  const [location, setLocation] =
    useState(null);

  const [content, setContent] =
    useState(
      createEmptyContent()
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  /* ==========================================================
     LOAD LOCATION
  ========================================================== */

  useEffect(() => {
    if (!locationId) {
      return;
    }

    let cancelled = false;

    const loadLocation = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API}/locations/by-id/${locationId}?_=${Date.now()}`,
          {
            method: "GET",

            cache: "no-store",

            headers: {
              Accept:
                "application/json",

              "Cache-Control":
                "no-cache",
            },
          }
        );

        const data =
          await readResponse(res);

        if (
          !res.ok ||
          !data?.success
        ) {
          throw new Error(
            data?.message ||
              "Unable to load location."
          );
        }

        if (cancelled) {
          return;
        }

        setLocation(
          data.location || null
        );

        setContent(
          normalizeContent(
            data.location
              ?.pageContent
          )
        );
      } catch (err) {
        if (cancelled) {
          return;
        }

        console.error(
          "LOCATION PAGE LOAD ERROR:",
          err
        );

        setError(
          err?.message ||
            "Unable to load location."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadLocation();

    return () => {
      cancelled = true;
    };
  }, [locationId]);

  /* ==========================================================
     IMAGE UPLOAD
  ========================================================== */

  const uploadImage = async (
    file
  ) => {
    if (!file) {
      return "";
    }

    if (
      !file.type?.startsWith(
        "image/"
      )
    ) {
      alert(
        "Only image files are allowed."
      );

      return "";
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      alert(
        "Maximum image size is 5MB."
      );

      return "";
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const token =
        getToken();

      const res = await fetch(
        "/api/upload-developer",
        {
          method: "POST",

          headers: token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : undefined,

          body: formData,
        }
      );

      const data =
        await readResponse(res);

      if (
        !res.ok ||
        !data?.url
      ) {
        throw new Error(
          data?.message ||
            "Image upload failed."
        );
      }

      return data.url;
    } catch (err) {
      console.error(
        "LOCATION IMAGE UPLOAD ERROR:",
        err
      );

      alert(
        err?.message ||
          "Image upload failed."
      );

      return "";
    } finally {
      setUploading(false);
    }
  };

  /* ==========================================================
     UPDATE HERO
  ========================================================== */

  const updateHero = (
    key,
    value
  ) => {
    setContent((prev) => ({
      ...prev,

      hero: {
        ...prev.hero,

        [key]: value,
      },
    }));
  };

  /* ==========================================================
     UPDATE ABOUT
  ========================================================== */

  const updateAbout = (
    key,
    value
  ) => {
    setContent((prev) => ({
      ...prev,

      about: {
        ...prev.about,

        [key]: value,
      },
    }));
  };

  /* ==========================================================
     UPDATE CONNECTIVITY
  ========================================================== */

  const updateConnectivity = (
    key,
    value
  ) => {
    setContent((prev) => ({
      ...prev,

      connectivity: {
        ...prev.connectivity,

        [key]: value,
      },
    }));
  };

  /* ==========================================================
     UPDATE NEARBY
  ========================================================== */

  const updateNearby = (
    key,
    value
  ) => {
    setContent((prev) => ({
      ...prev,

      nearby: {
        ...prev.nearby,

        [key]: value,
      },
    }));
  };

  /* ==========================================================
     HERO ARRAYS
  ========================================================== */

  const updateHeroArray = (
    arrayName,
    index,
    value
  ) => {
    setContent((prev) => {
      const array = [
        ...(prev.hero?.[
          arrayName
        ] || []),
      ];

      array[index] = value;

      return {
        ...prev,

        hero: {
          ...prev.hero,

          [arrayName]: array,
        },
      };
    });
  };

  /* ==========================================================
     HIGHLIGHTS
  ========================================================== */

  const updateHighlight = (
    index,
    key,
    value
  ) => {
    setContent((prev) => {
      const highlights = [
        ...(prev.about
          ?.highlights || []),
      ];

      highlights[index] = {
        ...(highlights[index] ||
          {}),

        [key]: value,
      };

      return {
        ...prev,

        about: {
          ...prev.about,

          highlights,
        },
      };
    });
  };

  /* ==========================================================
     MARKET INSIGHTS
  ========================================================== */

  const updateMarketInsight = (
    index,
    key,
    value
  ) => {
    setContent((prev) => {
      const items = [
        ...(prev.about
          ?.marketInsights || []),
      ];

      items[index] = {
        ...(items[index] || {}),

        [key]: value,
      };

      return {
        ...prev,

        about: {
          ...prev.about,

          marketInsights: items,
        },
      };
    });
  };

  /* ==========================================================
     CONNECTIVITY ITEMS
  ========================================================== */

  const updateConnectivityItem = (
    index,
    key,
    value
  ) => {
    setContent((prev) => {
      const items = [
        ...(prev.connectivity
          ?.items || []),
      ];

      items[index] = {
        ...(items[index] || {}),

        [key]: value,
      };

      return {
        ...prev,

        connectivity: {
          ...prev.connectivity,

          items,
        },
      };
    });
  };

  /* ==========================================================
     IMAGE HANDLERS
  ========================================================== */

  const handleHeroImage = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const url =
      await uploadImage(file);

    if (url) {
      updateHero(
        "image",
        url
      );
    }
  };

  const handleAboutImage = async (
    event
  ) => {
    const file =
      event.target.files?.[0];

    event.target.value = "";

    if (!file) {
      return;
    }

    const url =
      await uploadImage(file);

    if (url) {
      updateAbout(
        "image",
        url
      );
    }
  };

  const handleConnectivityImage =
    async (event) => {
      const file =
        event.target.files?.[0];

      event.target.value = "";

      if (!file) {
        return;
      }

      const url =
        await uploadImage(file);

      if (url) {
        updateConnectivity(
          "image",
          url
        );
      }
    };

  /* ==========================================================
     SAVE
  ========================================================== */

  const savePage = async () => {
    if (!locationId) {
      setError(
        "Location id is missing."
      );

      return;
    }

    if (saving) {
      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token =
        getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      // --------------------------------------------------------
      // Create a clean snapshot of CURRENT state.
      //
      // This prevents accidental mutation/reference problems.
      // --------------------------------------------------------

      const payload =
        JSON.parse(
          JSON.stringify(
            normalizeContent(
              content
            )
          )
        );

      const res = await fetch(
        `${API}/locations/page-content/${locationId}`,
        {
          method: "PATCH",

          cache: "no-store",

          headers: {
            "Content-Type":
              "application/json",

            Accept:
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            pageContent:
              payload,
          }),
        }
      );

      const data =
        await readResponse(res);

      if (
        !res.ok ||
        !data?.success
      ) {
        throw new Error(
          data?.message ||
            "Unable to save location page."
        );
      }

      // --------------------------------------------------------
      // IMPORTANT:
      // Use the freshly returned document from MongoDB.
      // --------------------------------------------------------

      const savedLocation =
        data.location;

      if (savedLocation) {
        setLocation(
          savedLocation
        );

        setContent(
          normalizeContent(
            savedLocation.pageContent
          )
        );
      } else {
        // Fallback if backend doesn't return location.
        setContent(
          normalizeContent(
            payload
          )
        );
      }

      setSuccess(
        "Location page content saved successfully."
      );

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error(
        "SAVE LOCATION PAGE ERROR:",
        err
      );

      setError(
        err?.message ||
          "Unable to save location page."
      );
    } finally {
      setSaving(false);
    }
  };

  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Loader2
            size={16}
            className="animate-spin"
          />

          Loading location page...
        </div>
      </div>
    );
  }

  /* ==========================================================
     ERROR
  ========================================================== */

  if (
    error &&
    !location
  ) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-red-600">
          {error}
        </p>

        <button
          onClick={() =>
            router.back()
          }
          className="px-4 py-2 rounded-xl bg-[#0f3b2e] text-white text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  /* ==========================================================
     RENDER
  ========================================================== */

  return (
    <div
      className="min-h-screen bg-[#f7f8f7] p-4 md:p-6 space-y-5"
      style={{
        color: "#111827",
      }}
    >
      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={() =>
              router.back()
            }
            className="mt-1 h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <MapPin
                size={19}
                className="text-[#0f3b2e]"
              />

              <h1 className="text-2xl md:text-3xl font-extrabold text-[#0f3b2e]">
                Edit Location Page
              </h1>
            </div>

            <p className="text-sm text-gray-600 mt-1">
              Editing:{" "}
              <span className="font-semibold text-gray-800">
                {location?.name}
              </span>
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {location?.slug && (
            <Link
              href={`/locations/${location.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="h-10 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 flex items-center gap-2 text-sm font-semibold hover:bg-gray-50"
            >
              <Eye size={15} />

              View Page
            </Link>
          )}

          <button
            type="button"
            onClick={savePage}
            disabled={
              saving ||
              uploading
            }
            className="h-10 px-5 rounded-xl bg-[#0f3b2e] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#174b3b] disabled:opacity-60"
          >
            {saving ? (
              <Loader2
                size={15}
                className="animate-spin"
              />
            ) : (
              <Save size={15} />
            )}

            {saving
              ? "Saving..."
              : "Save Page"}
          </button>
        </div>
      </div>

      {/* ======================================================
          STATUS
      ====================================================== */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          title="Hero Section"
          description="Optional overrides for the existing location hero."
        />

        <div className="p-5 space-y-6">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={
                content.hero.eyebrow
              }
              onChange={(value) =>
                updateHero(
                  "eyebrow",
                  value
                )
              }
              placeholder="A PREMIUM REAL ESTATE DESTINATION"
            />

            <Field
              label="Hero Title"
              value={
                content.hero.title
              }
              onChange={(value) =>
                updateHero(
                  "title",
                  value
                )
              }
              placeholder={`Luxury Properties in ${
                location?.name || ""
              }`}
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={
              content.hero.description
            }
            onChange={(value) =>
              updateHero(
                "description",
                value
              )
            }
            placeholder="Leave blank to use the existing location-based description."
            rows={4}
          />

          <Field
            label="Location Label"
            value={
              content.hero.locationLabel
            }
            onChange={(value) =>
              updateHero(
                "locationLabel",
                value
              )
            }
            placeholder="Prime Location"
          />

          <ImageUpload
            label="Hero Image"
            image={
              content.hero.image
            }
            uploading={uploading}
            onUpload={
              handleHeroImage
            }
            onRemove={() =>
              updateHero(
                "image",
                ""
              )
            }
          />

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Hero Location Panel
            </h3>

            <div className="space-y-4">
              <Field
                label="Panel Title"
                value={
                  content.hero.whyTitle
                }
                onChange={(value) =>
                  updateHero(
                    "whyTitle",
                    value
                  )
                }
                placeholder={`Why ${
                  location?.name ||
                  "This Location"
                }`}
              />

              <TextAreaField
                label="Panel Description"
                value={
                  content.hero
                    .whyDescription
                }
                onChange={(value) =>
                  updateHero(
                    "whyDescription",
                    value
                  )
                }
                placeholder="A carefully curated collection of premium residential and investment opportunities."
                rows={3}
              />

              <div className="grid md:grid-cols-2 gap-4">
                {content.hero.benefits.map(
                  (item, index) => (
                    <Field
                      key={index}
                      label={`Benefit ${
                        index + 1
                      }`}
                      value={item}
                      onChange={(value) =>
                        updateHeroArray(
                          "benefits",
                          index,
                          value
                        )
                      }
                      placeholder={[
                        "Strategic connectivity & accessibility",
                        "Premium residential developments",
                        "Leading developer presence",
                        "Curated investment opportunities",
                      ][index]}
                    />
                  )
                )}
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {content.hero.mobileBenefits.map(
                  (item, index) => (
                    <Field
                      key={index}
                      label={`Mobile Benefit ${
                        index + 1
                      }`}
                      value={item}
                      onChange={(value) =>
                        updateHeroArray(
                          "mobileBenefits",
                          index,
                          value
                        )
                      }
                      placeholder={[
                        "Strategic Connectivity",
                        "Premium Developments",
                        "Leading Developers",
                        "Curated Opportunities",
                      ][index]}
                    />
                  )
                )}
              </div>

              <div className="grid lg:grid-cols-2 gap-4">
                <Field
                  label="Panel Footer Eyebrow"
                  value={
                    content.hero
                      .footerEyebrow
                  }
                  onChange={(value) =>
                    updateHero(
                      "footerEyebrow",
                      value
                    )
                  }
                  placeholder="Property Bouquet"
                />

                <Field
                  label="Panel Footer Text"
                  value={
                    content.hero.footerText
                  }
                  onChange={(value) =>
                    updateHero(
                      "footerText",
                      value
                    )
                  }
                  placeholder="Premium properties, thoughtfully curated."
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Hero Buttons
            </h3>

            <div className="grid lg:grid-cols-2 gap-5">
              <Field
                label="Primary Button Text"
                value={
                  content.hero.primaryCtaText
                }
                onChange={(value) =>
                  updateHero(
                    "primaryCtaText",
                    value
                  )
                }
                placeholder="Explore Properties"
              />

              <Field
                label="Primary Button Link"
                value={
                  content.hero.primaryCtaLink
                }
                onChange={(value) =>
                  updateHero(
                    "primaryCtaLink",
                    value
                  )
                }
                placeholder="#projects"
              />

              <Field
                label="Secondary Button Text"
                value={
                  content.hero
                    .secondaryCtaText
                }
                onChange={(value) =>
                  updateHero(
                    "secondaryCtaText",
                    value
                  )
                }
                placeholder="Contact Advisor"
              />

              <Field
                label="Secondary Button Link"
                value={
                  content.hero
                    .secondaryCtaLink
                }
                onChange={(value) =>
                  updateHero(
                    "secondaryCtaLink",
                    value
                  )
                }
                placeholder="/contact"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          ABOUT
      ====================================================== */}

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          title="About The Location"
          description="Override only the About content you want to change."
          right={
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={
                  content.about.enabled
                }
                onChange={(e) =>
                  updateAbout(
                    "enabled",
                    e.target.checked
                  )
                }
                className="h-4 w-4 accent-[#0f3b2e]"
              />

              Enabled
            </label>
          }
        />

        <div className="p-5 space-y-6">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={
                content.about.eyebrow
              }
              onChange={(value) =>
                updateAbout(
                  "eyebrow",
                  value
                )
              }
              placeholder="About The Location"
            />

            <Field
              label="Heading"
              value={
                content.about.title
              }
              onChange={(value) =>
                updateAbout(
                  "title",
                  value
                )
              }
              placeholder={
                location?.name
              }
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              About Content
            </label>

            <RichTextEditor
              value={
                content.about.content
              }
              onChange={(value) =>
                updateAbout(
                  "content",
                  value
                )
              }
            />
          </div>

          <ImageUpload
            label="About Image"
            image={
              content.about.image
            }
            uploading={uploading}
            onUpload={
              handleAboutImage
            }
            onRemove={() =>
              updateAbout(
                "image",
                ""
              )
            }
          />

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800">
              About Highlights
            </h3>

            <p className="text-xs text-gray-500 mt-1 mb-4">
              Leave individual fields blank to retain the existing default insight.
            </p>

            <div className="grid lg:grid-cols-3 gap-4">
              {content.about.highlights.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
                  >
                    <p className="text-xs font-bold text-[#0f3b2e]">
                      Highlight{" "}
                      {index + 1}
                    </p>

                    <Field
                      label="Title"
                      value={
                        item.title
                      }
                      onChange={(value) =>
                        updateHighlight(
                          index,
                          "title",
                          value
                        )
                      }
                      placeholder={[
                        "Growing Demand",
                        "Premium Developments",
                        "Connectivity Advantage",
                      ][index]}
                    />

                    <TextAreaField
                      label="Description"
                      value={
                        item.description
                      }
                      onChange={(value) =>
                        updateHighlight(
                          index,
                          "description",
                          value
                        )
                      }
                      placeholder="Existing default description"
                      rows={3}
                    />
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Real Estate Market
            </h3>

            <div className="space-y-4">
              <Field
                label="Market Eyebrow"
                value={
                  content.about.marketEyebrow
                }
                onChange={(value) =>
                  updateAbout(
                    "marketEyebrow",
                    value
                  )
                }
                placeholder="Real Estate Market"
              />

              <Field
                label="Market Title"
                value={
                  content.about.marketTitle
                }
                onChange={(value) =>
                  updateAbout(
                    "marketTitle",
                    value
                  )
                }
                placeholder="A Thriving Real Estate Destination"
              />

              <TextAreaField
                label="Market Description"
                value={
                  content.about
                    .marketDescription
                }
                onChange={(value) =>
                  updateAbout(
                    "marketDescription",
                    value
                  )
                }
                placeholder="Leave blank to use the existing market description."
                rows={4}
              />

              <div className="grid lg:grid-cols-3 gap-4">
                {content.about.marketInsights.map(
                  (item, index) => (
                    <div
                      key={index}
                      className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3"
                    >
                      <p className="text-xs font-bold text-[#0f3b2e]">
                        Market Insight{" "}
                        {index + 1}
                      </p>

                      <Field
                        label="Title"
                        value={
                          item.title
                        }
                        onChange={(value) =>
                          updateMarketInsight(
                            index,
                            "title",
                            value
                          )
                        }
                        placeholder={[
                          "Growing Demand",
                          "Premium Developments",
                          "Connectivity Advantage",
                        ][index]}
                      />

                      <TextAreaField
                        label="Description"
                        value={
                          item.description
                        }
                        onChange={(value) =>
                          updateMarketInsight(
                            index,
                            "description",
                            value
                          )
                        }
                        placeholder="Existing default insight description"
                        rows={3}
                      />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Market Perspective
            </h3>

            <div className="grid lg:grid-cols-2 gap-5">
              <Field
                label="Perspective Eyebrow"
                value={
                  content.about
                    .perspectiveEyebrow
                }
                onChange={(value) =>
                  updateAbout(
                    "perspectiveEyebrow",
                    value
                  )
                }
                placeholder="Market Perspective"
              />

              <TextAreaField
                label="Perspective Quote"
                value={
                  content.about
                    .perspectiveQuote
                }
                onChange={(value) =>
                  updateAbout(
                    "perspectiveQuote",
                    value
                  )
                }
                placeholder="A well-connected address, shaped for modern living and long-term opportunity."
                rows={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          CONNECTIVITY
      ====================================================== */}

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          title="Connectivity"
          description="Override the existing connectivity section without changing its design."
        />

        <div className="p-5 space-y-6">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={
                content.connectivity
                  .eyebrow
              }
              onChange={(value) =>
                updateConnectivity(
                  "eyebrow",
                  value
                )
              }
              placeholder="CONNECTIVITY & KEY DESTINATIONS"
            />

            <Field
              label="Heading"
              value={
                content.connectivity
                  .title
              }
              onChange={(value) =>
                updateConnectivity(
                  "title",
                  value
                )
              }
              placeholder="Seamless Connectivity to Key Destinations"
            />
          </div>

          <TextAreaField
            label="Description"
            value={
              content.connectivity
                .description
            }
            onChange={(value) =>
              updateConnectivity(
                "description",
                value
              )
            }
            placeholder="Leave blank to use the existing location-based connectivity description."
            rows={5}
          />

          <ImageUpload
            label="Connectivity Image"
            image={
              content.connectivity
                .image
            }
            uploading={uploading}
            onUpload={
              handleConnectivityImage
            }
            onRemove={() =>
              updateConnectivity(
                "image",
                ""
              )
            }
          />

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800">
              Connectivity Cards
            </h3>

            <p className="text-xs text-gray-500 mt-1 mb-4">
              Icons remain unchanged. You can override the title and subtitle of each card independently.
            </p>

            <div className="grid lg:grid-cols-2 gap-4">
              {content.connectivity.items.map(
                (item, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <p className="text-xs font-bold text-[#0f3b2e] mb-3">
                      Destination{" "}
                      {index + 1}
                    </p>

                    <div className="grid md:grid-cols-2 gap-3">
                      <Field
                        label="Title"
                        value={
                          item.title
                        }
                        onChange={(value) =>
                          updateConnectivityItem(
                            index,
                            "title",
                            value
                          )
                        }
                        placeholder={[
                          "Major Airport",
                          "Metro & Rail",
                          "Key Road Network",
                          "Business Districts",
                          "Golf & Leisure",
                          "Retail & Hospitality",
                        ][index]}
                      />

                      <Field
                        label="Subtitle"
                        value={
                          item.subtitle
                        }
                        onChange={(value) =>
                          updateConnectivityItem(
                            index,
                            "subtitle",
                            value
                          )
                        }
                        placeholder={[
                          "Air connectivity",
                          "Public transport",
                          "Major routes",
                          "Commercial hubs",
                          "Lifestyle destinations",
                          "Shopping & dining",
                        ][index]}
                      />
                    </div>
                  </div>
                )
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-5">
            <h3 className="text-sm font-bold text-gray-800 mb-4">
              Location Advantage
            </h3>

            <div className="grid lg:grid-cols-2 gap-5">
              <Field
                label="Advantage Eyebrow"
                value={
                  content.connectivity
                    .advantageEyebrow
                }
                onChange={(value) =>
                  updateConnectivity(
                    "advantageEyebrow",
                    value
                  )
                }
                placeholder="LOCATION ADVANTAGE"
              />

              <TextAreaField
                label="Advantage Title"
                value={
                  content.connectivity
                    .advantageTitle
                }
                onChange={(value) =>
                  updateConnectivity(
                    "advantageTitle",
                    value
                  )
                }
                placeholder="A well-connected address for a brighter tomorrow."
                rows={3}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================
          NEARBY
      ====================================================== */}

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <SectionHeader
          title="Nearby Locations"
          description="Only the section copy is editable. Nearby locations themselves remain dynamically calculated."
        />

        <div className="p-5 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={
                content.nearby
                  .eyebrow
              }
              onChange={(value) =>
                updateNearby(
                  "eyebrow",
                  value
                )
              }
              placeholder="EXPLORE MORE"
            />

            <Field
              label="Heading"
              value={
                content.nearby.title
              }
              onChange={(value) =>
                updateNearby(
                  "title",
                  value
                )
              }
              placeholder="Explore Nearby Locations"
            />
          </div>

          <TextAreaField
            label="Description"
            value={
              content.nearby
                .description
            }
            onChange={(value) =>
              updateNearby(
                "description",
                value
              )
            }
            placeholder="Leave blank to use the existing location-based description."
            rows={4}
          />

          <div className="rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 text-xs text-gray-600">
            <strong className="text-[#0f3b2e]">
              Dynamic nearby locations:
            </strong>{" "}
            The actual nearby-location chips continue to come from your existing property hierarchy and location children. This editor only changes their surrounding content.
          </div>
        </div>
      </section>

      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
  <SectionHeader
    eyebrow="REAL ESTATE TYPES"
    title="Real Estate Types"
    description="Control the editorial heading, description and card copy. Property availability itself remains dynamic."
  />

  <div className="mt-5 grid gap-4">
    <Field
      label="Eyebrow"
      value={content.realEstateTypes.eyebrow}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          realEstateTypes: {
            ...prev.realEstateTypes,
            eyebrow: value,
          },
        }))
      }
    />

    <Field
      label="Title"
      value={content.realEstateTypes.title}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          realEstateTypes: {
            ...prev.realEstateTypes,
            title: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Description"
      value={content.realEstateTypes.description}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          realEstateTypes: {
            ...prev.realEstateTypes,
            description: value,
          },
        }))
      }
    />

    <div className="mt-2">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#17342d]">
          Type Cards
        </h3>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {content.realEstateTypes.cards.map((card, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-[#e4ddd2]
              bg-[#fbfaf7]
              p-4
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-semibold text-[#17342d]">
                Card {index + 1}
              </span>

              {content.realEstateTypes.cards.length > 1 && (
                <ArrayRemoveButton
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      realEstateTypes: {
                        ...prev.realEstateTypes,
                        cards:
                          prev.realEstateTypes.cards.filter(
                            (_, i) => i !== index
                          ),
                      },
                    }))
                  }
                />
              )}
            </div>

            <Field
              label="Card Title"
              value={card.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  realEstateTypes: {
                    ...prev.realEstateTypes,
                    cards: prev.realEstateTypes.cards.map(
                      (item, i) =>
                        i === index
                          ? {
                              ...item,
                              title: value,
                            }
                          : item
                    ),
                  },
                }))
              }
            />

            <div className="mt-3">
              <TextAreaField
                label="Card Description"
                value={card.description}
                onChange={(value) =>
                  setContent((prev) => ({
                    ...prev,
                    realEstateTypes: {
                      ...prev.realEstateTypes,
                      cards:
                        prev.realEstateTypes.cards.map(
                          (item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  description: value,
                                }
                              : item
                        ),
                    },
                  }))
                }
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4">
        <SmallAddButton
          onClick={() =>
            setContent((prev) => ({
              ...prev,
              realEstateTypes: {
                ...prev.realEstateTypes,
                cards: [
                  ...prev.realEstateTypes.cards,
                  {
                    title: "",
                    description: "",
                  },
                ],
              },
            }))
          }
        >
          Add Type Card
        </SmallAddButton>
      </div>
    </div>
  </div>
</section>

<section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
  <SectionHeader
    eyebrow="PROPERTY PRICES"
    title="Property Prices"
    description="The project pricing table remains database-driven. These fields control the editorial content around it."
  />

  <div className="mt-5 grid gap-4">
    <Field
      label="Eyebrow"
      value={content.propertyPrices.eyebrow}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            eyebrow: value,
          },
        }))
      }
    />

    <Field
      label="Title"
      value={content.propertyPrices.title}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            title: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Description"
      value={content.propertyPrices.description}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            description: value,
          },
        }))
      }
    />

    <div className="grid gap-4 md:grid-cols-2">
      <Field
        label="CTA Text"
        value={content.propertyPrices.ctaText}
        onChange={(value) =>
          setContent((prev) => ({
            ...prev,
            propertyPrices: {
              ...prev.propertyPrices,
              ctaText: value,
            },
          }))
        }
      />

      <Field
        label="CTA Link"
        value={content.propertyPrices.ctaLink}
        onChange={(value) =>
          setContent((prev) => ({
            ...prev,
            propertyPrices: {
              ...prev.propertyPrices,
              ctaLink: value,
            },
          }))
        }
      />
    </div>

    <Field
      label="Price Factors Heading"
      value={content.propertyPrices.factorsTitle}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            factorsTitle: value,
          },
        }))
      }
    />

    <div>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-[#17342d]">
          Price Factors
        </h3>
      </div>

      <div className="space-y-3">
        {content.propertyPrices.factors.map(
          (factor, index) => (
            <div
              key={index}
              className="flex gap-3"
            >
              <input
                value={factor}
                onChange={(e) =>
                  setContent((prev) => ({
                    ...prev,
                    propertyPrices: {
                      ...prev.propertyPrices,
                      factors:
                        prev.propertyPrices.factors.map(
                          (item, i) =>
                            i === index
                              ? e.target.value
                              : item
                        ),
                    },
                  }))
                }
                className="
                  min-w-0
                  flex-1
                  rounded-xl
                  border
                  border-[#ddd5c8]
                  bg-white
                  px-3
                  py-2.5
                  text-sm
                  text-[#17342d]
                  outline-none
                  focus:border-[#C89D58]
                "
                placeholder={`Price factor ${index + 1}`}
              />

              <ArrayRemoveButton
                onClick={() =>
                  setContent((prev) => ({
                    ...prev,
                    propertyPrices: {
                      ...prev.propertyPrices,
                      factors:
                        prev.propertyPrices.factors.filter(
                          (_, i) => i !== index
                        ),
                    },
                  }))
                }
              />
            </div>
          ))}
      </div>

      <div className="mt-3">
        <SmallAddButton
          onClick={() =>
            setContent((prev) => ({
              ...prev,
              propertyPrices: {
                ...prev.propertyPrices,
                factors: [
                  ...prev.propertyPrices.factors,
                  "",
                ],
              },
            }))
          }
        >
          Add Price Factor
        </SmallAddButton>
      </div>
    </div>

    <Field
      label="Current Pricing Heading"
      value={content.propertyPrices.currentPricingTitle}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            currentPricingTitle: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Current Pricing Description"
      value={content.propertyPrices.currentPricingDescription}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          propertyPrices: {
            ...prev.propertyPrices,
            currentPricingDescription: value,
          },
        }))
      }
    />
  </div>
</section>

<section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
  <SectionHeader
    eyebrow="LIFESTYLE"
    title="Lifestyle"
    description="Manage the schools, healthcare, shopping and lifestyle editorial content for this location."
  />

  <div className="mt-5 grid gap-4">
    <Field
      label="Eyebrow"
      value={content.lifestyle.eyebrow}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          lifestyle: {
            ...prev.lifestyle,
            eyebrow: value,
          },
        }))
      }
    />

    <Field
      label="Title"
      value={content.lifestyle.title}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          lifestyle: {
            ...prev.lifestyle,
            title: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Description"
      value={content.lifestyle.description}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          lifestyle: {
            ...prev.lifestyle,
            description: value,
          },
        }))
      }
    />

    <div className="grid gap-4">
      {content.lifestyle.groups.map(
        (group, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-[#e4ddd2]
              bg-[#fbfaf7]
              p-4
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#17342d]">
                Lifestyle Group {index + 1}
              </h3>

              {content.lifestyle.groups.length > 1 && (
                <ArrayRemoveButton
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      lifestyle: {
                        ...prev.lifestyle,
                        groups:
                          prev.lifestyle.groups.filter(
                            (_, i) => i !== index
                          ),
                      },
                    }))
                  }
                />
              )}
            </div>

            <Field
              label="Group Title"
              value={group.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  lifestyle: {
                    ...prev.lifestyle,
                    groups:
                      prev.lifestyle.groups.map(
                        (item, i) =>
                          i === index
                            ? {
                                ...item,
                                title: value,
                              }
                            : item
                      ),
                  },
                }))
              }
            />

            <div className="mt-3">
              <TextAreaField
                label="Group Description"
                value={group.description}
                onChange={(value) =>
                  setContent((prev) => ({
                    ...prev,
                    lifestyle: {
                      ...prev.lifestyle,
                      groups:
                        prev.lifestyle.groups.map(
                          (item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  description:
                                    value,
                                }
                              : item
                        ),
                    },
                  }))
                }
              />
            </div>

            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold text-[#17342d]">
                Items
              </p>

              <div className="space-y-2">
                {group.items.map(
                  (item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex gap-2"
                    >
                      <input
                        value={item}
                        onChange={(e) =>
                          setContent((prev) => ({
                            ...prev,
                            lifestyle: {
                              ...prev.lifestyle,
                              groups:
                                prev.lifestyle.groups.map(
                                  (groupItem, i) =>
                                    i === index
                                      ? {
                                          ...groupItem,
                                          items:
                                            groupItem.items.map(
                                              (
                                                value,
                                                j
                                              ) =>
                                                j ===
                                                itemIndex
                                                  ? e
                                                      .target
                                                      .value
                                                  : value
                                            ),
                                        }
                                      : groupItem
                                ),
                            },
                          }))
                        }
                        className="
                          min-w-0
                          flex-1
                          rounded-xl
                          border
                          border-[#ddd5c8]
                          bg-white
                          px-3
                          py-2.5
                          text-sm
                          text-[#17342d]
                          outline-none
                          focus:border-[#C89D58]
                        "
                        placeholder={`Item ${itemIndex + 1}`}
                      />

                      <ArrayRemoveButton
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            lifestyle: {
                              ...prev.lifestyle,
                              groups:
                                prev.lifestyle.groups.map(
                                  (groupItem, i) =>
                                    i === index
                                      ? {
                                          ...groupItem,
                                          items:
                                            groupItem.items.filter(
                                              (_, j) =>
                                                j !==
                                                itemIndex
                                            ),
                                        }
                                      : groupItem
                                ),
                            },
                          }))
                        }
                      />
                    </div>
                  )
                )}
              </div>

              <div className="mt-3">
                <SmallAddButton
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      lifestyle: {
                        ...prev.lifestyle,
                        groups:
                          prev.lifestyle.groups.map(
                            (groupItem, i) =>
                              i === index
                                ? {
                                    ...groupItem,
                                    items: [
                                      ...groupItem.items,
                                      "",
                                    ],
                                  }
                                : groupItem
                          ),
                      },
                    }))
                  }
                >
                  Add Item
                </SmallAddButton>
              </div>
            </div>
          </div>
        )
      )}
    </div>

    <SmallAddButton
      onClick={() =>
        setContent((prev) => ({
          ...prev,
          lifestyle: {
            ...prev.lifestyle,
            groups: [
              ...prev.lifestyle.groups,
              {
                title: "",
                description: "",
                items: ["", "", "", ""],
              },
            ],
          },
        }))
      }
    >
      Add Lifestyle Group
    </SmallAddButton>
  </div>
</section>

<section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
  <SectionHeader
    eyebrow="WHY BUY"
    title="Why Buy"
    description="Control the six location-specific reasons displayed in the Why Buy section."
  />

  <div className="mt-5 grid gap-4">
    <Field
      label="Eyebrow"
      value={content.whyBuy.eyebrow}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          whyBuy: {
            ...prev.whyBuy,
            eyebrow: value,
          },
        }))
      }
    />

    <Field
      label="Title"
      value={content.whyBuy.title}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          whyBuy: {
            ...prev.whyBuy,
            title: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Description"
      value={content.whyBuy.description}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          whyBuy: {
            ...prev.whyBuy,
            description: value,
          },
        }))
      }
    />

    <div className="grid gap-4 lg:grid-cols-2">
      {content.whyBuy.reasons.map(
        (reason, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-[#e4ddd2]
              bg-[#fbfaf7]
              p-4
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#17342d]">
                Reason {index + 1}
              </h3>

              {content.whyBuy.reasons.length > 1 && (
                <ArrayRemoveButton
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      whyBuy: {
                        ...prev.whyBuy,
                        reasons:
                          prev.whyBuy.reasons.filter(
                            (_, i) => i !== index
                          ),
                      },
                    }))
                  }
                />
              )}
            </div>

            <Field
              label="Title"
              value={reason.title}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  whyBuy: {
                    ...prev.whyBuy,
                    reasons:
                      prev.whyBuy.reasons.map(
                        (item, i) =>
                          i === index
                            ? {
                                ...item,
                                title: value,
                              }
                            : item
                      ),
                  },
                }))
              }
            />

            <div className="mt-3">
              <TextAreaField
                label="Description"
                value={reason.description}
                onChange={(value) =>
                  setContent((prev) => ({
                    ...prev,
                    whyBuy: {
                      ...prev.whyBuy,
                      reasons:
                        prev.whyBuy.reasons.map(
                          (item, i) =>
                            i === index
                              ? {
                                  ...item,
                                  description:
                                    value,
                                }
                              : item
                        ),
                    },
                  }))
                }
              />
            </div>
          </div>
        )
      )}
    </div>

    <SmallAddButton
      onClick={() =>
        setContent((prev) => ({
          ...prev,
          whyBuy: {
            ...prev.whyBuy,
            reasons: [
              ...prev.whyBuy.reasons,
              {
                title: "",
                description: "",
              },
            ],
          },
        }))
      }
    >
      Add Reason
    </SmallAddButton>
  </div>
</section>

<section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
  <SectionHeader
    eyebrow="FAQ"
    title="Frequently Asked Questions"
    description="Create location-specific questions and answers. Property count remains dynamic in the default FAQ."
  />

  <div className="mt-5 grid gap-4">
    <Field
      label="Eyebrow"
      value={content.faq.eyebrow}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          faq: {
            ...prev.faq,
            eyebrow: value,
          },
        }))
      }
    />

    <Field
      label="Title"
      value={content.faq.title}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          faq: {
            ...prev.faq,
            title: value,
          },
        }))
      }
    />

    <TextAreaField
      label="Description"
      value={content.faq.description}
      onChange={(value) =>
        setContent((prev) => ({
          ...prev,
          faq: {
            ...prev.faq,
            description: value,
          },
        }))
      }
    />

    <div className="grid gap-4">
      {content.faq.items.map(
        (item, index) => (
          <div
            key={index}
            className="
              rounded-2xl
              border
              border-[#e4ddd2]
              bg-[#fbfaf7]
              p-4
            "
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-[#17342d]">
                Question {index + 1}
              </h3>

              {content.faq.items.length > 1 && (
                <ArrayRemoveButton
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      faq: {
                        ...prev.faq,
                        items:
                          prev.faq.items.filter(
                            (_, i) => i !== index
                          ),
                      },
                    }))
                  }
                />
              )}
            </div>

            <Field
              label="Question"
              value={item.question}
              onChange={(value) =>
                setContent((prev) => ({
                  ...prev,
                  faq: {
                    ...prev.faq,
                    items:
                      prev.faq.items.map(
                        (faq, i) =>
                          i === index
                            ? {
                                ...faq,
                                question: value,
                              }
                            : faq
                      ),
                  },
                }))
              }
            />

            <div className="mt-3">
              <TextAreaField
                label="Answer"
                value={item.answer}
                onChange={(value) =>
                  setContent((prev) => ({
                    ...prev,
                    faq: {
                      ...prev.faq,
                      items:
                        prev.faq.items.map(
                          (faq, i) =>
                            i === index
                              ? {
                                  ...faq,
                                  answer: value,
                                }
                              : faq
                        ),
                    },
                  }))
                }
              />
            </div>
          </div>
        )
      )}
    </div>

    <SmallAddButton
      onClick={() =>
        setContent((prev) => ({
          ...prev,
          faq: {
            ...prev.faq,
            items: [
              ...prev.faq.items,
              {
                question: "",
                answer: "",
              },
            ],
          },
        }))
      }
    >
      Add FAQ
    </SmallAddButton>
  </div>
</section>



      {/* ======================================================
          SAVE
      ====================================================== */}

      <div className="flex justify-end pb-8">
        <button
          type="button"
          onClick={savePage}
          disabled={
            saving ||
            uploading
          }
          className="px-6 py-3 rounded-xl bg-[#0f3b2e] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#174b3b] disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Save size={15} />
          )}

          {saving
            ? "Saving..."
            : "Save Page Content"}
        </button>
      </div>
    </div>
  );
}

/* ============================================================
   SECTION HEADER
============================================================ */

function SectionHeader({
  eyebrow,
  title,
  description,
  right,
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="min-w-0">
        {eyebrow && (
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#C89D58]">
            {eyebrow}
          </p>
        )}

        <h2 className="text-xl font-semibold tracking-tight text-[#17342d]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-500">
            {description}
          </p>
        )}
      </div>

      {right && (
        <div className="shrink-0">
          {right}
        </div>
      )}
    </div>
  );
}

/* ============================================================
   FIELD
============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder = "",
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <input
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/15"
      />
    </div>
  );
}

/* ============================================================
   TEXTAREA
============================================================ */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <textarea
        rows={rows}
        value={value ?? ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        placeholder={
          placeholder
        }
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-y focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/15"
      />
    </div>
  );
}

/* ============================================================
   IMAGE UPLOAD
============================================================ */

function ImageUpload({
  label,
  image,
  uploading,
  onUpload,
  onRemove,
}) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {label}
          </p>

          <p className="text-xs text-gray-500 mt-1">
            Leave empty to use the existing image. Maximum 5MB.
          </p>
        </div>

        <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-100">
          <Upload size={15} />

          {uploading
            ? "Uploading..."
            : "Upload Image"}

          <input
            type="file"
            hidden
            accept="image/*"
            onChange={
              onUpload
            }
          />
        </label>
      </div>

      {image && (
        <div className="mt-4">
          <img
            src={image}
            alt=""
            className="h-44 w-full md:w-[420px] rounded-2xl object-cover border border-gray-200"
          />

          <button
            type="button"
            onClick={
              onRemove
            }
            className="mt-2 text-xs text-red-600 hover:underline"
          >
            Remove custom image
          </button>
        </div>
      )}
    </div>
  );
}

function ArrayRemoveButton({ onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        rounded-lg
        border
        border-red-200
        bg-red-50
        px-3
        py-2
        text-[11px]
        font-semibold
        text-red-600
        transition
        hover:bg-red-100
      "
    >
      Remove
    </button>
  );
}

function SmallAddButton({ children, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="
        inline-flex
        items-center
        justify-center
        rounded-lg
        border
        border-[#d8c49a]
        bg-[#faf7ef]
        px-3
        py-2
        text-[11px]
        font-semibold
        text-[#17342d]
        transition
        hover:bg-[#f2ead9]
      "
    >
      + {children}
    </button>
  );
}