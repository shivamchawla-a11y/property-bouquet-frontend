"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import RichTextEditor from "@/app/admin/RichTextEditor";

import {
  Save,
  ArrowLeft,
  FileText,
  Globe,
  Star,
} from "lucide-react";

const API_URL = "/api/knowledge";

const CATEGORIES = [
  "Buying Guide",
  "Selling Guide",
  "Investment",
  "Legal",
  "Home Loans",
  "Taxation",
  "Luxury Living",
  "Interior Design",
  "Market Education",
  "NRI Guide",
  "Tips & Tricks",
  "General",
];

export default function CreateKnowledgePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ============================================================
  // CREATE vs EDIT MODE
  // ============================================================

  const editId = searchParams.get("id");
  const isEditing = Boolean(editId);

  // ============================================================
  // STATES
  // ============================================================

  const [loading, setLoading] = useState(false);
  const [loadingArticle, setLoadingArticle] = useState(isEditing);
  const [uploading, setUploading] = useState(false);

  const [keywords, setKeywords] = useState("");

  const [form, setForm] = useState({
    title: "",
    slug: "",
    shortDescription: "",
    content: "",
    featuredImage: "",
    category: "General",
    author: "Property Bouquet Research Team",
    readTime: 5,
    featured: false,
    status: "draft",

    seo: {
      metaTitle: "",
      metaDescription: "",
      keywords: [],
    },
  });

  // ============================================================
  // LOAD ARTICLE WHEN EDITING
  // ============================================================

  useEffect(() => {
    if (!editId) {
      setLoadingArticle(false);
      return;
    }

    const loadArticle = async () => {
      try {
        setLoadingArticle(true);

        const res = await fetch(
          `${API_URL}/${editId}`,
          {
            method: "GET",
            credentials: "include",
            cache: "no-store",
          }
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Failed to load knowledge article"
          );
        }

        /*
         * Supports the usual backend response:
         *
         * {
         *   success: true,
         *   data: article
         * }
         *
         * Also safely handles data.article if your
         * controller uses that property.
         */
        const article =
          data?.data ||
          data?.article ||
          null;

        if (!article) {
          throw new Error(
            "Knowledge article data was not returned by the server."
          );
        }

        // ========================================================
        // LOAD EXISTING ARTICLE
        // ========================================================

        setForm({
          title: article.title || "",

          slug: article.slug || "",

          shortDescription:
            article.shortDescription || "",

          content:
            article.content || "",

          featuredImage:
            article.featuredImage || "",

          category:
            article.category || "General",

          author:
            article.author ||
            "Property Bouquet Research Team",

          readTime:
            Number(article.readTime) || 5,

          featured:
            Boolean(article.featured),

          status:
            article.status || "draft",

          seo: {
            metaTitle:
              article.seo?.metaTitle || "",

            metaDescription:
              article.seo?.metaDescription || "",

            keywords:
              Array.isArray(
                article.seo?.keywords
              )
                ? article.seo.keywords
                : [],
          },
        });

        // ========================================================
        // LOAD KEYWORDS INTO TEXT INPUT
        // ========================================================

        setKeywords(
          Array.isArray(article.seo?.keywords)
            ? article.seo.keywords.join(", ")
            : ""
        );
      } catch (err) {
        console.error(
          "Failed to load knowledge article:",
          err
        );

        alert(
          err.message ||
            "Failed to load knowledge article"
        );

        router.push("/admin/knowledge");
      } finally {
        setLoadingArticle(false);
      }
    };

    loadArticle();
  }, [editId, router]);

  // ============================================================
  // AUTO GENERATE SLUG
  // ONLY IN CREATE MODE
  // ============================================================

  useEffect(() => {
    /*
     * VERY IMPORTANT:
     *
     * Never regenerate the slug while editing.
     * Otherwise changing the article title would
     * automatically change the existing URL.
     */
    if (isEditing) return;

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
  }, [form.title, isEditing]);

  // ============================================================
  // FIELD UPDATER
  // ============================================================

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  // ============================================================
  // SEO UPDATER
  // ============================================================

  const updateSeo = (key, value) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  // ============================================================
  // SAVE / CREATE / UPDATE ARTICLE
  // ============================================================

  const saveKnowledge = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (!form.title.trim()) {
      alert("Please enter an article title.");
      return;
    }

    if (!form.slug.trim()) {
      alert("Please enter a URL slug.");
      return;
    }

    if (!form.shortDescription.trim()) {
      alert(
        "Please enter a short description."
      );
      return;
    }

    if (!form.content.trim()) {
      alert(
        "Please enter article content."
      );
      return;
    }

    try {
      setLoading(true);

      // ========================================================
      // PREPARE PAYLOAD
      // ========================================================

      const payload = {
        title: form.title.trim(),

        slug: form.slug
          .trim()
          .toLowerCase(),

        shortDescription:
          form.shortDescription.trim(),

        content: form.content,

        featuredImage:
          form.featuredImage || "",

        category:
          form.category || "General",

        author:
          form.author?.trim() ||
          "Property Bouquet Research Team",

        readTime:
          Number(form.readTime) || 5,

        featured:
          Boolean(form.featured),

        status:
          form.status || "draft",

        seo: {
          metaTitle:
            form.seo.metaTitle?.trim() || "",

          metaDescription:
            form.seo.metaDescription?.trim() ||
            "",

          keywords: keywords
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
        },
      };

      // ========================================================
      // CREATE OR UPDATE
      // ========================================================

      const url = isEditing
        ? `${API_URL}/update/${editId}`
        : `${API_URL}/create`;

      const method = isEditing
        ? "PUT"
        : "POST";

      const res = await fetch(url, {
        method,

        headers: {
          "Content-Type":
            "application/json",
        },

        credentials: "include",

        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message ||
            (isEditing
              ? "Failed to update article"
              : "Failed to create article")
        );
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      alert(
        isEditing
          ? "Knowledge article updated successfully ✅"
          : "Knowledge article created successfully ✅"
      );

      router.push("/admin/knowledge");
    } catch (err) {
      console.error(
        isEditing
          ? "Update knowledge article error:"
          : "Create knowledge article error:",
        err
      );

      alert(
        err.message ||
          "Server Error"
      );
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // VALIDATE IMAGE
  // ============================================================

  const validateFile = (file) => {
    if (!file) return false;

    if (!file.type.startsWith("image/")) {
      alert(
        "Only image files are allowed."
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "Maximum file size is 5MB."
      );
      return false;
    }

    return true;
  };

  // ============================================================
  // UPLOAD IMAGE
  // ============================================================

  const uploadImage = async (file) => {
    try {
      const data = new FormData();

      data.append("file", file);

      const res = await fetch(
        "/api/upload-developer",
        {
          method: "POST",
          body: data,
        }
      );

      const result = await res.json();

      if (!res.ok || !result.url) {
        throw new Error(
          result.message ||
            "Upload failed"
        );
      }

      return result.url;
    } catch (err) {
      console.error(
        "Image upload error:",
        err
      );

      alert(
        err.message ||
          "Image upload failed"
      );

      return null;
    }
  };

  // ============================================================
  // FEATURED IMAGE UPLOAD
  // ============================================================

  const handleFeaturedImageUpload = async (
    file
  ) => {
    if (!validateFile(file)) return;

    try {
      setUploading(true);

      const url =
        await uploadImage(file);

      if (url) {
        updateField(
          "featuredImage",
          url
        );
      }
    } finally {
      setUploading(false);
    }
  };

  // ============================================================
  // LOADING ARTICLE SCREEN
  // ============================================================

  if (loadingArticle) {
    return (
      <div className="min-h-[500px] flex items-center justify-center">
        <div className="flex items-center gap-3 text-[#0f3b2e]">
          <div className="h-6 w-6 rounded-full border-4 border-[#c9a64b] border-t-transparent animate-spin" />

          <span className="font-semibold">
            Loading knowledge article...
          </span>
        </div>
      </div>
    );
  }

  // ============================================================
  // PAGE
  // ============================================================

  return (
    <>
      {/* ======================================================
          IMAGE UPLOAD OVERLAY
      ====================================================== */}

      {uploading && (
        <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl px-8 py-6 shadow-2xl">
            <div className="flex items-center gap-4">

              <div className="h-6 w-6 rounded-full border-4 border-[#c9a64b] border-t-transparent animate-spin" />

              <div>
                <p className="font-semibold text-[#0f3b2e]">
                  Uploading Image...
                </p>

                <p className="text-sm text-gray-500">
                  Please wait
                </p>
              </div>

            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="flex items-center justify-between mb-8">

          <div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/knowledge"
                )
              }
              className="
                flex
                items-center
                gap-2
                text-[#0f3b2e]
                font-semibold
                mb-4
                hover:opacity-70
              "
            >
              <ArrowLeft size={18} />

              Back to Knowledge Centre
            </button>

            <h1 className="text-4xl font-extrabold text-[#0f3b2e]">
              {isEditing
                ? "Edit Knowledge Article"
                : "Create Knowledge Article"}
            </h1>

            <p className="text-gray-500 mt-2">
              {isEditing
                ? "Update your educational buying guides, investment articles, legal resources, FAQs and real estate knowledge."
                : "Create educational buying guides, investment articles, legal resources, FAQs and real estate knowledge."}
            </p>

          </div>

          <button
            type="button"
            onClick={saveKnowledge}
            disabled={loading}
            className="
              px-6
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
              flex
              items-center
              gap-2
            "
          >
            <Save size={17} />

            {loading
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
                ? "Save Changes"
                : "Create Article"}
          </button>

        </div>

        {/* ====================================================
            FORM
        ==================================================== */}

        <form
          onSubmit={saveKnowledge}
        >
          <div className="grid xl:grid-cols-3 gap-6">

            {/* ==================================================
                LEFT COLUMN
            ================================================== */}

            <div className="xl:col-span-2 space-y-6">

              {/* =================================================
                  BASIC INFORMATION
              ================================================= */}

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
                      placeholder="How to Buy Your First Property in Gurgaon"
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

                    <p className="text-xs text-gray-500 mt-2">
                      {isEditing
                        ? "The existing slug is preserved. Change it only if you intentionally want to change the article URL."
                        : "The slug is automatically generated from the article title. You can edit it manually."}
                    </p>

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
                      value={
                        form.shortDescription
                      }
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
                      placeholder="Brief educational summary shown on article cards and the knowledge page..."
                    />

                    <p className="text-xs text-gray-600 mt-2">
                      {
                        form.shortDescription.length
                      }
                      /250 characters
                    </p>

                  </div>

                </div>

              </div>

              {/* =================================================
                  ARTICLE CONTENT
              ================================================= */}

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
                  Paste formatted content directly
                  into the editor. Headings,
                  paragraphs, lists, links and
                  other supported formatting will
                  be preserved.
                </p>

              </div>

            </div>

            {/* ==================================================
                RIGHT COLUMN
            ================================================== */}

            <div className="space-y-6">

              {/* =================================================
                  PUBLISHING
              ================================================= */}

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

                  {/* STATUS */}

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
                        text-gray-900
                        bg-white
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

                  {/* FEATURED */}

                  <label className="flex items-center gap-3 cursor-pointer text-gray-900">

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
                      Featured Knowledge Article
                    </span>

                  </label>

                </div>

              </div>

              {/* =================================================
                  ARTICLE SETTINGS
              ================================================= */}

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
                        text-gray-900
                        bg-white
                      "
                    >
                      {CATEGORIES.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                      {/* Preserve legacy category */}
                      {!CATEGORIES.includes(
                        form.category
                      ) &&
                        form.category && (
                          <option
                            value={form.category}
                          >
                            {form.category}
                          </option>
                        )}
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
                        placeholder:text-gray-400
                        bg-white
                      "
                    />

                  </div>

                  {/* READ TIME */}

                  <div>

                    <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                      Read Time (mins)
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
                        placeholder:text-gray-400
                        bg-white
                      "
                    />

                  </div>

                </div>

              </div>

              {/* =================================================
                  FEATURED IMAGE
              ================================================= */}

              <div className="bg-white border rounded-3xl p-6 shadow-sm">

                <h2 className="text-lg font-bold text-[#0f3b2e] mb-5">
                  Featured Image
                </h2>

                <div className="space-y-4">

                  <input
                    value={
                      form.featuredImage
                    }
                    onChange={(e) =>
                      updateField(
                        "featuredImage",
                        e.target.value
                      )
                    }
                    placeholder="https://..."
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

                  <div className="flex items-center gap-3">

                    <label
                      htmlFor="knowledge-image"
                      className="
                        cursor-pointer
                        px-5
                        py-3
                        rounded-xl
                        bg-[#0f3b2e]
                        text-white
                        font-semibold
                        hover:bg-[#145440]
                        transition
                      "
                    >
                      Upload From Computer
                    </label>

                    <input
                      id="knowledge-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        if (
                          e.target.files?.[0]
                        ) {
                          handleFeaturedImageUpload(
                            e.target.files[0]
                          );
                        }

                        // Allow selecting the same
                        // file again later.
                        e.target.value = "";
                      }}
                    />

                    <span className="text-sm text-gray-500">
                      JPG, PNG, WEBP
                      (Max 5MB)
                    </span>

                  </div>

                  {form.featuredImage && (
                    <img
                      src={
                        form.featuredImage
                      }
                      alt="Featured preview"
                      className="
                        w-full
                        h-56
                        rounded-2xl
                        border
                        object-cover
                        mt-4
                      "
                    />
                  )}

                </div>

              </div>

              {/* =================================================
                  SEO SETTINGS
              ================================================= */}

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
                      value={
                        form.seo.metaTitle
                      }
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
                        placeholder:text-gray-400
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
                        placeholder:text-gray-400
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
                      placeholder="buying guide, home loans, property investment, legal tips"
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

                    <p className="text-xs text-gray-600 mt-2">
                      Separate keywords
                      using commas.
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ====================================================
              BOTTOM BUTTONS
          ==================================================== */}

          <div className="flex justify-end gap-3 mt-8 pb-10">

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/knowledge"
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
              "
            >
              {loading
                ? isEditing
                  ? "Saving..."
                  : "Creating..."
                : isEditing
                  ? "Save Changes"
                  : "Create Article"}
            </button>

          </div>

        </form>

      </div>
    </>
  );
}