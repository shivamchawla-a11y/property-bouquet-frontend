"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import RichTextEditor from "@/app/admin/RichTextEditor";

import {
  Save,
  ArrowLeft,
  FileText,
  Globe,
  Star,
} from "lucide-react";

const API_URL =
  "https://property-bouquet-backend.onrender.com/api/news";

export default function CreateInsightPage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);
    const [uploading, setUploading] = useState(false);

  const [keywords, setKeywords] =
    useState("");

  const [form, setForm] =
    useState({
      title: "",
      slug: "",

      shortDescription: "",

      content: "",

      featuredImage: "",

      category:
        "Luxury Real Estate",

      author:
      "Property Bouquet Research Team",

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

  // =========================
  // AUTO GENERATE SLUG
  // =========================

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

  // =========================
  // FIELD UPDATER
  // =========================

  const updateField = (
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateSeo = (
    key,
    value
  ) => {
    setForm((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  // =========================
  // CREATE INSIGHT
  // =========================

  const createInsight = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...form,

        seo: {
          metaTitle:
            form.seo.metaTitle,

          metaDescription:
            form.seo
              .metaDescription,

          keywords: keywords
            .split(",")
            .map((item) =>
              item.trim()
            )
            .filter(Boolean),
        },
      };

      const res = await fetch(
        `${API_URL}/create`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          credentials:
            "include",

          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await res.json();

      if (!res.ok) {
        return alert(
          data.message ||
            "Failed to create insight"
        );
      }

      alert(
        "Insight created successfully ✅"
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

  // ================= VALIDATE FILE =================
const validateFile = (file) => {
  if (!file) return false;

  if (!file.type.startsWith("image/")) {
    alert("Only image files allowed");
    return false;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert("Maximum file size is 5MB");
    return false;
  }

  return true;
};

// ================= UPLOAD IMAGE =================
const uploadImage = async (file) => {
  try {
    const data = new FormData();

    data.append("file", file);

    const res = await fetch(
      "https://property-bouquet-backend.onrender.com/api/upload-developer",
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
    console.error(err);
    alert("Image upload failed");
    return null;
  }
};

// ================= FEATURED IMAGE UPLOAD =================
const handleFeaturedImageUpload = async (file) => {
  if (!validateFile(file)) return;

  setUploading(true);

  const url = await uploadImage(file);

  if (url) {
    updateField("featuredImage", url);
  }

  setUploading(false);
};

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
            Back to Insights
          </button>

          <h1 className="text-4xl font-extrabold text-[#0f3b2e]">
            Create New Insight
          </h1>

          <p className="text-gray-500 mt-2">
            Publish luxury real estate
            articles, reports and
            market insights.
          </p>

        </div>

        <button
          onClick={createInsight}
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
          "
        >
          {loading
            ? "Creating..."
            : "Create Insight"}
        </button>

      </div>

      <form
        onSubmit={createInsight}
      >
        <div className="grid xl:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}

          <div className="xl:col-span-2 space-y-6">

                        {/* BASIC INFORMATION */}

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
                    placeholder="DLF Camellias vs The Dahlias: Which Is Better?"
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
                    placeholder="Brief summary shown on insight cards and article pages..."
                  />

                  <p className="text-xs text-gray-600 mt-2">
                    {
                      form
                        .shortDescription
                        .length
                    }
                    /250 characters
                  </p>
                </div>

              </div>

            </div>

            {/* ARTICLE CONTENT */}

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
                HTML content is supported if
                your frontend renders it using
                dangerouslySetInnerHTML.
              </p>

            </div>

          </div>

          {/* RIGHT COLUMN */}

          <div className="space-y-6">

                        {/* PUBLISHING */}

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
    Featured Article
  </span>
</label>

              </div>

            </div>

            {/* ARTICLE SETTINGS */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#0f3b2e] mb-5">
                Article Settings
              </h2>

              <div className="space-y-5">

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
placeholder:text-gray-400
bg-white
"
    placeholder="Knowledge-backed real estate decisions create long-term wealth..."
  />
</div>
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
placeholder:text-gray-400
bg-white
"
    placeholder="Senior Investment Advisor"
  />
</div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Read Time (mins)
                  </label>

                  <input
                    type="number"
                    min="1"
                    value={
                      form.readTime
                    }
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

            {/* FEATURED IMAGE */}

            <div className="bg-white border rounded-3xl p-6 shadow-sm">

              <h2 className="text-lg font-bold text-[#0f3b2e] mb-5">
                Featured Image
              </h2>

              <div
  onClick={() =>
    document
      .getElementById("featuredImageUpload")
      .click()
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
    PNG, JPG, WEBP (Max 5MB)
  </p>
</div>

<input
  id="featuredImageUpload"
  type="file"
  hidden
  accept="image/*"
  onChange={(e) => {
    handleFeaturedImageUpload(e.target.files[0]);
    e.target.value = "";
  }}
/>

              {form.featuredImage && (
                <img
                  src={
                    form.featuredImage
                  }
                  alt="Preview"
                  className="
                  mt-4
                  w-full
                  h-52
                  object-cover
                  rounded-2xl
                  border
                  "
                />
              )}

            </div>

            {/* SEO */}

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

                <div>
                  <label className="block text-sm font-semibold mb-2 text-[#0f3b2e]">
                    Meta Title
                  </label>

                  <input
                    value={
                      form.seo
                        .metaTitle
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
                    placeholder="luxury real estate, gurgaon property, branded residences"
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
            "
          >
            {loading
              ? "Creating..."
              : "Create Insight"}
          </button>

        </div>

      </form>

    </div>
  );
}