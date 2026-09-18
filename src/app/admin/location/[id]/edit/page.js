"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Upload,
  Eye,
  ChevronUp,
  ChevronDown,
  MapPin,
  Loader2,
} from "lucide-react";
import RichTextEditor from "@/app/admin/RichTextEditor";

const API = "/api";

const emptyContent = {
  hero: {
    eyebrow: "",
    title: "",
    description: "",
    image: "",
    buttonText: "",
    buttonLink: "",
  },
  about: {
    enabled: true,
    eyebrow: "About The Location",
    title: "",
    content: "",
    highlights: [],
  },
  sections: [],
};

const makeSection = () => ({
  id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
  type: "richText",
  enabled: true,
  eyebrow: "",
  title: "",
  subtitle: "",
  content: "",
  image: "",
  imagePosition: "right",
});

const getToken = () => {
  if (typeof window === "undefined") return null;

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null
  );
};

async function readResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (contentType.toLowerCase().includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      throw new Error("The server returned invalid JSON.");
    }
  }

  throw new Error(
    text ||
      `Server returned an unexpected response (HTTP ${res.status}).`
  );
}

function normalizeContent(content) {
  const source = content || {};

  return {
    hero: {
      ...emptyContent.hero,
      ...(source.hero || {}),
    },

    about: {
      ...emptyContent.about,
      ...(source.about || {}),
      highlights: Array.isArray(source.about?.highlights)
        ? source.about.highlights.map((item) => ({
            title: item?.title || "",
            description: item?.description || "",
          }))
        : [],
    },

    sections: Array.isArray(source.sections)
      ? source.sections.map((section) => ({
          ...makeSection(),
          ...section,
          id:
            section?.id ||
            `${Date.now()}-${Math.random()
              .toString(36)
              .slice(2, 9)}`,
        }))
      : [],
  };
}

export default function LocationPageEditor() {
  const params = useParams();
  const router = useRouter();

  const locationId = params?.id;

  const [location, setLocation] = useState(null);
  const [content, setContent] = useState(emptyContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!locationId) return;

    const load = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(`${API}/locations/by-id/${locationId}`);

        const data = await readResponse(res);

        if (!res.ok || !data?.success) {
          throw new Error(
            data?.message || "Unable to load location."
          );
        }

        setLocation(data.location);
        setContent(normalizeContent(data.location?.pageContent));
      } catch (err) {
        console.error("LOCATION PAGE LOAD ERROR:", err);
        setError(err?.message || "Unable to load location.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [locationId]);

  const uploadImage = async (file) => {
    if (!file) return "";

    if (!file.type?.startsWith("image/")) {
      alert("Only image files are allowed.");
      return "";
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5MB.");
      return "";
    }

    try {
      setUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-developer", {
        method: "POST",
        body: formData,
      });

      const data = await readResponse(res);

      if (!res.ok || !data?.url) {
        throw new Error(data?.message || "Image upload failed.");
      }

      return data.url;
    } catch (err) {
      console.error("LOCATION IMAGE UPLOAD ERROR:", err);
      alert(err?.message || "Image upload failed.");
      return "";
    } finally {
      setUploading(false);
    }
  };

  const updateHero = (key, value) => {
    setContent((prev) => ({
      ...prev,
      hero: {
        ...prev.hero,
        [key]: value,
      },
    }));
  };

  const updateAbout = (key, value) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        [key]: value,
      },
    }));
  };

  const addHighlight = () => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: [
          ...(prev.about.highlights || []),
          {
            title: "",
            description: "",
          },
        ],
      },
    }));
  };

  const updateHighlight = (index, key, value) => {
    setContent((prev) => {
      const highlights = [...(prev.about.highlights || [])];

      highlights[index] = {
        ...highlights[index],
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

  const deleteHighlight = (index) => {
    setContent((prev) => ({
      ...prev,
      about: {
        ...prev.about,
        highlights: prev.about.highlights.filter(
          (_, itemIndex) => itemIndex !== index
        ),
      },
    }));
  };

  const addSection = () => {
    setContent((prev) => ({
      ...prev,
      sections: [...prev.sections, makeSection()],
    }));
  };

  const updateSection = (index, key, value) => {
    setContent((prev) => {
      const sections = [...prev.sections];

      sections[index] = {
        ...sections[index],
        [key]: value,
      };

      return {
        ...prev,
        sections,
      };
    });
  };

  const deleteSection = (index) => {
    if (!confirm("Delete this custom section?")) return;

    setContent((prev) => ({
      ...prev,
      sections: prev.sections.filter(
        (_, itemIndex) => itemIndex !== index
      ),
    }));
  };

  const moveSection = (index, direction) => {
    setContent((prev) => {
      const sections = [...prev.sections];
      const targetIndex = index + direction;

      if (
        targetIndex < 0 ||
        targetIndex >= sections.length
      ) {
        return prev;
      }

      [sections[index], sections[targetIndex]] = [
        sections[targetIndex],
        sections[index],
      ];

      return {
        ...prev,
        sections,
      };
    });
  };

  const handleHeroImage = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const url = await uploadImage(file);

    if (url) updateHero("image", url);
  };

  const handleSectionImage = async (index, event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    const url = await uploadImage(file);

    if (url) updateSection(index, "image", url);
  };

  const savePage = async () => {
    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const token = getToken();

      if (!token) {
        throw new Error(
          "Authentication token not found. Please log in again."
        );
      }

      const res = await fetch(
        `${API}/locations/page-content/${locationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            pageContent: content,
          }),
        }
      );

      const data = await readResponse(res);

      if (!res.ok || !data?.success) {
        throw new Error(
          data?.message || "Unable to save location page."
        );
      }

      setLocation(data.location || location);
      setContent(normalizeContent(data.location?.pageContent || content));
      setSuccess("Location page content saved successfully.");

      window.setTimeout(() => {
        setSuccess("");
      }, 3000);
    } catch (err) {
      console.error("SAVE LOCATION PAGE ERROR:", err);
      setError(err?.message || "Unable to save location page.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Loader2 size={16} className="animate-spin" />
          Loading location page...
        </div>
      </div>
    );
  }

  if (error && !location) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 p-6">
        <p className="text-sm text-red-600">{error}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-[#0f3b2e] text-white text-sm"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-[#f7f8f7] p-4 md:p-6 space-y-5"
      style={{ color: "#111827" }}
    >
      {/* HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div className="flex items-start gap-3">
          <button
            onClick={() => router.back()}
            className="mt-1 h-10 w-10 rounded-xl border border-gray-200 bg-white flex items-center justify-center hover:bg-gray-50"
            title="Back"
          >
            <ArrowLeft size={17} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <MapPin size={19} className="text-[#0f3b2e]" />
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
              className="h-10 px-4 rounded-xl border border-gray-300 bg-white text-gray-700 flex items-center gap-2 text-sm font-semibold hover:bg-gray-50"
            >
              <Eye size={15} />
              View Page
            </Link>
          )}

          <button
            onClick={savePage}
            disabled={saving || uploading}
            className="h-10 px-5 rounded-xl bg-[#0f3b2e] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#174b3b] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <Save size={15} />
            )}
            {saving ? "Saving..." : "Save Page"}
          </button>
        </div>
      </div>

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

      {/* HERO */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-[#0f3b2e]">
              Hero Section
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Controls the editable content displayed in the location hero.
            </p>
          </div>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={content.hero.eyebrow}
              onChange={(value) => updateHero("eyebrow", value)}
              placeholder="Luxury Real Estate Destination"
            />

            <Field
              label="Hero Title"
              value={content.hero.title}
              onChange={(value) => updateHero("title", value)}
              placeholder={`Luxury Properties in ${location?.name || ""}`}
            />
          </div>

          <TextAreaField
            label="Hero Description"
            value={content.hero.description}
            onChange={(value) => updateHero("description", value)}
            placeholder="Write the description shown below the hero heading."
            rows={4}
          />

          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Button Text"
              value={content.hero.buttonText}
              onChange={(value) => updateHero("buttonText", value)}
              placeholder="Explore Properties"
            />

            <Field
              label="Button Link"
              value={content.hero.buttonLink}
              onChange={(value) => updateHero("buttonLink", value)}
              placeholder="#projects"
            />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Hero Image
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Upload a replacement image. Maximum 5MB.
                </p>
              </div>

              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-gray-300 text-sm font-semibold hover:bg-gray-100">
                <Upload size={15} />
                {uploading ? "Uploading..." : "Upload Image"}
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleHeroImage}
                />
              </label>
            </div>

            {content.hero.image && (
              <div className="mt-4">
                <img
                  src={content.hero.image}
                  alt=""
                  className="h-44 w-full md:w-[420px] rounded-2xl object-cover border border-gray-200"
                />

                <button
                  type="button"
                  onClick={() => updateHero("image", "")}
                  className="mt-2 text-xs text-red-600 hover:underline"
                >
                  Remove custom hero image
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#0f3b2e]">
              About The Location
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Rich-text content displayed below the properties.
            </p>
          </div>

          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
            <input
              type="checkbox"
              checked={content.about.enabled}
              onChange={(e) =>
                updateAbout("enabled", e.target.checked)
              }
              className="h-4 w-4 accent-[#0f3b2e]"
            />
            Enabled
          </label>
        </div>

        <div className="p-5 space-y-5">
          <div className="grid lg:grid-cols-2 gap-5">
            <Field
              label="Eyebrow"
              value={content.about.eyebrow}
              onChange={(value) => updateAbout("eyebrow", value)}
              placeholder="About The Location"
            />

            <Field
              label="Heading"
              value={content.about.title}
              onChange={(value) => updateAbout("title", value)}
              placeholder={`Luxury Real Estate in ${location?.name || ""}`}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              About Content
            </label>

            <RichTextEditor
              value={content.about.content}
              onChange={(value) => updateAbout("content", value)}
            />
          </div>

          <div className="border-t border-gray-200 pt-5">
            <div className="flex items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-gray-800">
                  Location Highlights
                </h3>
                <p className="text-xs text-gray-500 mt-1">
                  Optional highlight cards shown with the About section.
                </p>
              </div>

              <button
                type="button"
                onClick={addHighlight}
                className="px-3 py-2 rounded-lg bg-[#0f3b2e] text-white text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus size={13} />
                Add Highlight
              </button>
            </div>

            <div className="space-y-3">
              {content.about.highlights.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 p-5 text-sm text-gray-500">
                  No custom highlights added. The public page can use its
                  existing default highlights.
                </div>
              )}

              {content.about.highlights.map((item, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-3 items-start">
                    <Field
                      label="Title"
                      value={item.title}
                      onChange={(value) =>
                        updateHighlight(index, "title", value)
                      }
                      placeholder="Strong Connectivity"
                    />

                    <Field
                      label="Description"
                      value={item.description}
                      onChange={(value) =>
                        updateHighlight(index, "description", value)
                      }
                      placeholder="Excellent access to major corridors."
                    />

                    <button
                      type="button"
                      onClick={() => deleteHighlight(index)}
                      className="mt-7 h-10 w-10 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-100"
                      title="Delete highlight"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOM SECTIONS */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0f3b2e]">
              Custom Sections
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Add additional rich-text sections after About The Location.
            </p>
          </div>

          <button
            type="button"
            onClick={addSection}
            className="px-4 py-2.5 rounded-xl bg-[#0f3b2e] text-white text-sm font-semibold flex items-center justify-center gap-2"
          >
            <Plus size={15} />
            Add Section
          </button>
        </div>

        <div className="p-5 space-y-5">
          {content.sections.length === 0 && (
            <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-8 text-center">
              <p className="text-sm font-semibold text-gray-700">
                No custom sections yet
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Click “Add Section” to create an additional editable section.
              </p>
            </div>
          )}

          {content.sections.map((section, index) => (
            <div
              key={section.id || index}
              className="rounded-2xl border border-gray-200 bg-gray-50 overflow-hidden"
            >
              <div className="px-4 py-3 bg-white border-b border-gray-200 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="h-8 w-8 rounded-lg bg-[#0f3b2e] text-white text-xs font-bold flex items-center justify-center">
                    {index + 1}
                  </span>

                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      {section.title || `Custom Section ${index + 1}`}
                    </p>
                    <p className="text-[11px] text-gray-500">
                      Rich text section
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => moveSection(index, -1)}
                    className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40"
                    title="Move up"
                  >
                    <ChevronUp size={14} />
                  </button>

                  <button
                    type="button"
                    disabled={index === content.sections.length - 1}
                    onClick={() => moveSection(index, 1)}
                    className="h-8 w-8 rounded-lg border border-gray-200 bg-white flex items-center justify-center disabled:opacity-40"
                    title="Move down"
                  >
                    <ChevronDown size={14} />
                  </button>

                  <button
                    type="button"
                    onClick={() => deleteSection(index)}
                    className="h-8 w-8 rounded-lg border border-red-200 bg-red-50 text-red-600 flex items-center justify-center"
                    title="Delete section"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="p-4 space-y-5">
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={section.enabled}
                      onChange={(e) =>
                        updateSection(
                          index,
                          "enabled",
                          e.target.checked
                        )
                      }
                      className="h-4 w-4 accent-[#0f3b2e]"
                    />
                    Section enabled
                  </label>

                  <select
                    value={section.imagePosition || "right"}
                    onChange={(e) =>
                      updateSection(
                        index,
                        "imagePosition",
                        e.target.value
                      )
                    }
                    className="border border-gray-300 rounded-lg px-3 py-2 text-xs bg-white"
                  >
                    <option value="left">Image left</option>
                    <option value="right">Image right</option>
                  </select>
                </div>

                <div className="grid lg:grid-cols-2 gap-5">
                  <Field
                    label="Eyebrow"
                    value={section.eyebrow}
                    onChange={(value) =>
                      updateSection(index, "eyebrow", value)
                    }
                    placeholder="Connectivity & Lifestyle"
                  />

                  <Field
                    label="Heading"
                    value={section.title}
                    onChange={(value) =>
                      updateSection(index, "title", value)
                    }
                    placeholder="Why Gurgaon Continues To Grow"
                  />
                </div>

                <Field
                  label="Subtitle"
                  value={section.subtitle}
                  onChange={(value) =>
                    updateSection(index, "subtitle", value)
                  }
                  placeholder="A short supporting line"
                />

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Section Content
                  </label>

                  <RichTextEditor
                    value={section.content}
                    onChange={(value) =>
                      updateSection(index, "content", value)
                    }
                  />
                </div>

                <div className="rounded-xl border border-gray-200 bg-white p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Section Image
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Optional. Maximum 5MB.
                      </p>
                    </div>

                    <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-xs font-semibold hover:bg-gray-50">
                      <Upload size={14} />
                      Upload Image
                      <input
                        type="file"
                        hidden
                        accept="image/*"
                        onChange={(e) =>
                          handleSectionImage(index, e)
                        }
                      />
                    </label>
                  </div>

                  {section.image && (
                    <div className="mt-3">
                      <img
                        src={section.image}
                        alt=""
                        className="h-40 w-full md:w-[360px] rounded-xl object-cover border border-gray-200"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          updateSection(index, "image", "")
                        }
                        className="mt-2 text-xs text-red-600 hover:underline"
                      >
                        Remove section image
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM SAVE */}
      <div className="flex justify-end pb-8">
        <button
          onClick={savePage}
          disabled={saving || uploading}
          className="px-6 py-3 rounded-xl bg-[#0f3b2e] text-white flex items-center gap-2 text-sm font-semibold hover:bg-[#174b3b] disabled:opacity-60"
        >
          {saving ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <Save size={15} />
          )}
          {saving ? "Saving..." : "Save Page Content"}
        </button>
      </div>
    </div>
  );
}

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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-11 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/15"
      />
    </div>
  );
}

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
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none resize-y focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/15"
      />
    </div>
  );
}
