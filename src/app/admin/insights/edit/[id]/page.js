"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import RichTextEditor from "@/app/admin/RichTextEditor";

import {
  Save,
  ArrowLeft,
  FileText,
  Globe,
  Star,
} from "lucide-react";

const API_URL = "/api/news";

export default function EditInsightPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [keywords, setKeywords] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",

    shortDescription: "",

    content: "",

    featuredImage: "",

    category: "Luxury Real Estate",

    author: "Property Bouquet Research Team",

    authorDesignation:
      "Property Bouquet Research Team",

    authorQuote: "",

    readTime: 5,

    featured: false,

    status: "draft",

    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  // ===========================
  // FETCH INSIGHT
  // ===========================

  const fetchInsight = async () => {
    try {
      setPageLoading(true);

      const res = await fetch(
        `${API_URL}/${id}`,
        {
          credentials: "include",
          cache: "no-store",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Failed to load article"
        );
        return;
      }

      const article = data.data;

      setForm({
        title: article.title || "",
        slug: article.slug || "",

        shortDescription:
          article.shortDescription || "",

        content: article.content || "",

        featuredImage:
          article.featuredImage || "",

        category:
          article.category ||
          "Luxury Real Estate",

        author:
          article.author ||
          "Property Bouquet Research Team",

        authorDesignation:
          article.authorDesignation ||
          "Property Bouquet Research Team",

        authorQuote:
          article.authorQuote || "",

        readTime:
          article.readTime || 5,

        featured:
          article.featured || false,

        status:
          article.status || "draft",

        seo: {
          metaTitle:
            article.seo?.metaTitle || "",

          metaDescription:
            article.seo
              ?.metaDescription || "",

          keywords:
            article.seo?.keywords || [],
        },
      });

      setKeywords(
        (article.seo?.keywords || []).join(", ")
      );
    } catch (err) {
      console.error(err);
      alert("Failed to load article");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchInsight();
    }
  }, [id]);

  // ===========================
  // FIELD UPDATE
  // ===========================

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSeo = (key, value) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  // ===========================
  // AUTO SLUG
  // ===========================

  useEffect(() => {
    if (!form.title) return;

    const slug = form.title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");

    setForm((prev) => ({
      ...prev,
      slug,
    }));
  }, [form.title]);
    // ===========================
  // VALIDATE FILE
  // ===========================

  const validateFile = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      alert("Only image files are allowed.");
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Maximum image size is 5MB.");
      return false;
    }

    return true;
  };

  // ===========================
  // UPLOAD IMAGE
  // ===========================

  const uploadImage = async (file) => {
    try {
      const formData = new FormData();

      formData.append("file", file);

      const res = await fetch(
        "/api/upload-developer",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(
          data.message || "Upload failed"
        );
      }

      return data.url;
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
      return null;
    }
  };

  // ===========================
  // FEATURED IMAGE
  // ===========================

  const handleFeaturedImageUpload =
    async (file) => {
      if (!validateFile(file)) return;

      setUploading(true);

      const image = await uploadImage(file);

      if (image) {
        updateField(
          "featuredImage",
          image
        );
      }

      setUploading(false);
    };

  // ===========================
  // UPDATE INSIGHT
  // ===========================

  const updateInsight = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,

        seo: {
          metaTitle:
            form.seo.metaTitle,

          metaDescription:
            form.seo.metaDescription,

          keywords: keywords
            .split(",")
            .map((k) => k.trim())
            .filter(Boolean),
        },
      };

      const res = await fetch(
        `${API_URL}/update/${id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials: "include",

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(
          data.message ||
            "Failed to update article"
        );
        return;
      }

      alert(
        "Insight updated successfully ✅"
      );

      router.push(
        "/admin/insights"
      );
    } catch (err) {
      console.error(err);
      alert("Server Error");
    } finally {
      setLoading(false);
    }
  };

  // ===========================
  // PAGE LOADING
  // ===========================

  if (pageLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center">

          <div className="w-12 h-12 border-4 border-[#c9a64b] border-t-transparent rounded-full animate-spin mx-auto mb-5" />

          <h2 className="text-xl font-bold text-[#0f3b2e]">
            Loading Insight...
          </h2>

          <p className="text-gray-500 mt-2">
            Please wait while we fetch the article.
          </p>

        </div>
      </div>
    );
  }

  // ===========================
  // JSX
  // ===========================

  return (
    <div className="max-w-7xl mx-auto p-6">

      {uploading && (
        <div className="fixed inset-0 bg-black/60 z-[9999] flex items-center justify-center">

          <div className="bg-white px-6 py-4 rounded-2xl shadow-xl text-sm font-semibold">
            Uploading image...
          </div>

        </div>
      )}

      {/* HEADER */}

      <div className="flex items-center justify-between mb-8">

        <div>

          <button
            onClick={() =>
              router.push(
                "/admin/insights"
              )
            }
            className="flex items-center gap-2 text-[#0f3b2e] font-semibold mb-4 hover:opacity-70"
          >
            <ArrowLeft size={18} />
            Back to Insights
          </button>

          <h1 className="text-4xl font-extrabold text-[#0f3b2e]">
            Edit Insight
          </h1>

          <p className="text-gray-500 mt-2">
            Update your luxury real estate article.
          </p>

        </div>

        <button
          onClick={updateInsight}
          disabled={loading}
          className="px-6 py-3 rounded-xl font-bold text-black bg-gradient-to-r from-[#c9a64b] to-[#e0be69] shadow-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading
            ? "Saving..."
            : "Save Changes"}
        </button>

      </div>

      <form onSubmit={updateInsight}>

                <div className="grid xl:grid-cols-3 gap-6">

          {/* ================= LEFT COLUMN ================= */}

          <div className="xl:col-span-2 space-y-6">

            {/* ================= BASIC INFORMATION ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">
                <FileText
                  className="text-[#0f3b2e]"
                  size={22}
                />

                <h2 className="text-xl font-bold text-[#0f3b2e]">
                  Basic Information
                </h2>
              </div>

              <div className="space-y-5">

                {/* TITLE */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Article Title *
                  </label>

                  <input
                    required
                    value={form.title}
                    onChange={(e) =>
                      updateField(
                        "title",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      placeholder:text-gray-400
                      bg-white
                    "
                    placeholder="DLF Camellias vs The Dahlias"
                  />

                </div>

                {/* SLUG */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    URL Slug *
                  </label>

                  <input
                    required
                    value={form.slug}
                    onChange={(e) =>
                      updateField(
                        "slug",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      placeholder:text-gray-400
                      bg-white
                    "
                  />

                </div>

                {/* SHORT DESCRIPTION */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Short Description *
                  </label>

                  <textarea
                    required
                    rows={5}
                    maxLength={250}
                    value={form.shortDescription}
                    onChange={(e) =>
                      updateField(
                        "shortDescription",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      placeholder:text-gray-400
                      bg-white
                    "
                    placeholder="Brief summary shown on cards..."
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    {form.shortDescription.length}/250 Characters
                  </p>

                </div>

              </div>

            </div>

            {/* ================= ARTICLE CONTENT ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-6">

                <FileText
                  className="text-[#0f3b2e]"
                  size={22}
                />

                <h2 className="text-xl font-bold text-[#0f3b2e]">
                  Article Content
                </h2>

              </div>

              <RichTextEditor
                value={form.content}
                onChange={(value) =>
                  updateField(
                    "content",
                    value
                  )
                }
              />

              <p className="text-xs text-gray-500 mt-3">
                HTML content is supported and will be rendered on the article page.
              </p>

            </div>

          </div>

          {/* ================= RIGHT COLUMN STARTS HERE ================= */}

          <div className="space-y-6">

                        {/* ================= PUBLISHING ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-5">
                <Star
                  className="text-[#0f3b2e]"
                  size={20}
                />
                <h2 className="text-lg font-bold text-[#0f3b2e]">
                  Publishing
                </h2>
              </div>

              <div className="space-y-5">

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      bg-white
                      text-gray-900
                    "
                  >
                    <option value="draft">
                      Draft
                    </option>

                    <option value="published">
                      Published
                    </option>

                  </select>

                </div>

                <label className="flex items-center gap-3 cursor-pointer">

                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(e) =>
                      updateField(
                        "featured",
                        e.target.checked
                      )
                    }
                    className="h-5 w-5 accent-[#c9a64b]"
                  />

                  <span className="font-semibold text-gray-900">
                    Featured Article
                  </span>

                </label>

              </div>

            </div>

            {/* ================= ARTICLE SETTINGS ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#0f3b2e] mb-5">
                Article Settings
              </h2>

              <div className="space-y-5">

                {/* CATEGORY */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Category
                  </label>

                  <select
                    value={form.category}
                    onChange={(e) =>
                      updateField(
                        "category",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      bg-white
                      text-gray-900
                    "
                  >

                    <option>
                      Luxury Real Estate
                    </option>

                    <option>
                      Investment
                    </option>

                    <option>
                      Market Insights
                    </option>

                    <option>
                      Branded Residences
                    </option>

                    <option>
                      Developer News
                    </option>

                    <option>
                      Location Guide
                    </option>

                  </select>

                </div>

                {/* AUTHOR */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Author
                  </label>

                  <input
                    value={form.author}
                    onChange={(e) =>
                      updateField(
                        "author",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      bg-white
                    "
                  />

                </div>

                {/* AUTHOR QUOTE */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Author Quote
                  </label>

                  <textarea
                    rows={4}
                    value={form.authorQuote}
                    onChange={(e) =>
                      updateField(
                        "authorQuote",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      bg-white
                    "
                    placeholder="Knowledge-backed real estate decisions create long-term wealth..."
                  />

                </div>

                {/* AUTHOR DESIGNATION */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Author Designation
                  </label>

                  <input
                    value={form.authorDesignation}
                    onChange={(e) =>
                      updateField(
                        "authorDesignation",
                        e.target.value
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      bg-white
                    "
                    placeholder="Senior Investment Advisor"
                  />

                </div>

                {/* READ TIME */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Read Time (Minutes)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={form.readTime}
                    onChange={(e) =>
                      updateField(
                        "readTime",
                        Number(
                          e.target.value
                        )
                      )
                    }
                    className="
                      w-full
                      border
                      border-gray-300
                      rounded-xl
                      px-4
                      py-3
                      text-gray-900
                      bg-white
                    "
                  />

                </div>

              </div>

            </div>

                        {/* ================= FEATURED IMAGE ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#0f3b2e] mb-5">
                Featured Image
              </h2>

              <div
                onClick={() =>
                  document
                    .getElementById("featuredImageUpload")
                    ?.click()
                }
                className="
                border-2
                border-dashed
                border-gray-300
                rounded-2xl
                p-8
                text-center
                cursor-pointer
                hover:bg-gray-50
                transition
                "
              >
                <p className="font-semibold text-[#0f3b2e]">
                  Click to Upload Featured Image
                </p>

                <p className="text-sm text-gray-500 mt-2">
                  PNG, JPG, WEBP (Maximum 5MB)
                </p>
              </div>

              <input
                id="featuredImageUpload"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => {
                  handleFeaturedImageUpload(
                    e.target.files[0]
                  );
                  e.target.value = "";
                }}
              />

              {form.featuredImage && (
                <img
                  src={form.featuredImage}
                  alt="Preview"
                  className="
                  mt-5
                  w-full
                  h-56
                  object-cover
                  rounded-2xl
                  border
                  "
                />
              )}

            </div>

            {/* ================= SEO ================= */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <div className="flex items-center gap-3 mb-5">

                <Globe
                  className="text-[#0f3b2e]"
                  size={20}
                />

                <h2 className="text-lg font-bold text-[#0f3b2e]">
                  SEO Settings
                </h2>

              </div>

              <div className="space-y-5">

                {/* META TITLE */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Meta Title
                  </label>

                  <input
                    value={form.seo.metaTitle}
                    onChange={(e) =>
                      updateSeo(
                        "metaTitle",
                        e.target.value
                      )
                    }
                    className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    px-4
                    py-3
                    text-gray-900
                    bg-white
                    "
                  />

                </div>

                {/* META DESCRIPTION */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Meta Description
                  </label>

                  <textarea
                    rows={4}
                    value={
                      form.seo
                        .metaDescription
                    }
                    onChange={(e) =>
                      updateSeo(
                        "metaDescription",
                        e.target.value
                      )
                    }
                    className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    px-4
                    py-3
                    text-gray-900
                    bg-white
                    "
                  />

                </div>

                {/* KEYWORDS */}

                <div>

                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Keywords
                  </label>

                  <input
                    value={keywords}
                    onChange={(e) =>
                      setKeywords(
                        e.target.value
                      )
                    }
                    placeholder="luxury homes, gurgaon, investment"
                    className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    px-4
                    py-3
                    text-gray-900
                    bg-white
                    "
                  />

                  <p className="text-xs text-gray-500 mt-2">
                    Separate multiple keywords with commas.
                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* ================= FOOTER ================= */}

        <div className="flex justify-end gap-3 mt-8 pb-10">

          <button
            type="button"
            onClick={() =>
              router.push(
                "/admin/insights"
              )
            }
            className="
            px-6
            py-3
            rounded-xl
            border
            border-gray-300
            bg-white
            text-gray-900
            hover:bg-gray-50
            font-semibold
            "
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="
            px-8
            py-3
            rounded-xl
            font-bold
            text-black
            bg-gradient-to-r
            from-[#c9a64b]
            to-[#e0be69]
            shadow-lg
            hover:opacity-90
            disabled:opacity-50
            flex items-center gap-2
            "
          >
            <Save size={18} />

            {loading
              ? "Saving..."
              : "Save Changes"}

          </button>

        </div>

      </form>

    </div>
  );
}