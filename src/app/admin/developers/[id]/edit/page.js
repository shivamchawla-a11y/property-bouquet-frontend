"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  Save,
  Upload,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Eye,
  Loader2,
  Building2,
  Image as ImageIcon,
  Search,
  Sparkles,
  BarChart3,
  FolderKanban,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Globe,
  Layers3,
} from "lucide-react";

import RichTextEditor from "@/app/admin/RichTextEditor";


/* ============================================================
   DEFAULT PAGE CONTENT
   ============================================================ */

const DEFAULT_PAGE_CONTENT = {
  hero: {
    eyebrow: "LUXURY DEVELOPER COLLECTION",
    title: "",
    description: "",
    image: "",
  },

  about: {
    enabled: true,
    eyebrow: "ABOUT THE DEVELOPER",
    title: "",
    content: "",
  },

  stats: {
    enabled: true,
    items: [],
  },

  projects: {
    enabled: true,
    eyebrow: "THE PORTFOLIO",
    title: "",
    description: "",
  },

  whyChoose: {
    enabled: true,
    eyebrow: "WHY CHOOSE THIS DEVELOPER",
    title: "",
    description: "",
    items: [],
  },

  presence: {
    enabled: true,
    eyebrow: "DEVELOPER PRESENCE",
    title: "",
    description: "",
  },

  faq: {
    enabled: true,
    eyebrow: "FREQUENTLY ASKED QUESTIONS",
    title: "",
    items: [],
  },

  seo: {
    metaTitle: "",
    metaDescription: "",
    keywords: "",
    canonical: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
  },

  customSections: [],
};


/* ============================================================
   SAFE DEEP MERGE
   ============================================================ */

function buildPageContent(value) {
  const source =
    value &&
    typeof value === "object"
      ? value
      : {};

  return {
    ...DEFAULT_PAGE_CONTENT,

    ...source,

    hero: {
      ...DEFAULT_PAGE_CONTENT.hero,
      ...(source.hero || {}),
    },

    about: {
      ...DEFAULT_PAGE_CONTENT.about,
      ...(source.about || {}),
    },

    stats: {
      ...DEFAULT_PAGE_CONTENT.stats,
      ...(source.stats || {}),
      items: Array.isArray(
        source.stats?.items
      )
        ? source.stats.items
        : [],
    },

    projects: {
      ...DEFAULT_PAGE_CONTENT.projects,
      ...(source.projects || {}),
    },

    whyChoose: {
      ...DEFAULT_PAGE_CONTENT.whyChoose,
      ...(source.whyChoose || {}),
      items: Array.isArray(
        source.whyChoose?.items
      )
        ? source.whyChoose.items
        : [],
    },

    presence: {
      ...DEFAULT_PAGE_CONTENT.presence,
      ...(source.presence || {}),
    },

    faq: {
      ...DEFAULT_PAGE_CONTENT.faq,
      ...(source.faq || {}),
      items: Array.isArray(
        source.faq?.items
      )
        ? source.faq.items
        : [],
    },

    seo: {
      ...DEFAULT_PAGE_CONTENT.seo,
      ...(source.seo || {}),
    },

    customSections:
      Array.isArray(
        source.customSections
      )
        ? source.customSections
        : [],
  };
}


/* ============================================================
   SMALL FIELD COMPONENT
   ============================================================ */

function Field({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows,
  hint,
}) {
  const common =
    "w-full border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none transition focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/10";

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-gray-800 mb-2">
          {label}
        </label>
      )}

      {rows ? (
        <textarea
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          rows={rows}
          className={`${common} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder={placeholder}
          className={common}
        />
      )}

      {hint && (
        <p className="text-[11px] text-gray-500 mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}


/* ============================================================
   SECTION WRAPPER
   ============================================================ */

function EditorSection({
  icon,
  title,
  description,
  open,
  onToggle,
  children,
}) {
  return (
    <section className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 transition"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 shrink-0 rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e] flex items-center justify-center">
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#17342d]">
              {title}
            </h2>

            {description && (
              <p className="text-xs text-gray-500 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {open ? (
          <ChevronUp
            size={18}
            className="text-gray-500 shrink-0"
          />
        ) : (
          <ChevronDown
            size={18}
            className="text-gray-500 shrink-0"
          />
        )}
      </button>

      {open && (
        <div className="border-t border-gray-200 p-5">
          {children}
        </div>
      )}
    </section>
  );
}


/* ============================================================
   ENABLE TOGGLE
   ============================================================ */

function EnableToggle({
  enabled,
  onChange,
}) {
  return (
    <button
      type="button"
      onClick={() =>
        onChange(!enabled)
      }
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${
        enabled
          ? "bg-[#0f3b2e]"
          : "bg-gray-300"
      }`}
      aria-label={
        enabled
          ? "Disable section"
          : "Enable section"
      }
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition ${
          enabled
            ? "translate-x-5"
            : "translate-x-0.5"
        }`}
      />
    </button>
  );
}


/* ============================================================
   IMAGE UPLOAD
   ============================================================ */

function ImageUpload({
  label,
  value,
  onChange,
  uploading,
  setUploading,
}) {
  const handleUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Only image files are allowed ❌"
      );
      return;
    }

    if (
      file.size >
      5 * 1024 * 1024
    ) {
      toast.error(
        "Maximum file size is 5MB ❌"
      );
      return;
    }

    try {
      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      const res = await fetch(
        "/api/upload-developer",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await res.json();

      if (
        !res.ok ||
        !result.url
      ) {
        throw new Error(
          result.message ||
            "Upload failed"
        );
      }

      onChange(result.url);

      toast.success(
        "Image uploaded successfully ✅"
      );
    } catch (error) {
      console.error(error);

      toast.error(
        error.message ||
          "Image upload failed ❌"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-800 mb-2">
        {label}
      </label>

      <div className="grid md:grid-cols-[1fr_auto] gap-3">
        <input
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
          placeholder="https://..."
          className="w-full border border-gray-300 bg-white text-sm text-gray-800 placeholder:text-gray-400 rounded-xl px-4 py-2.5 outline-none focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/10"
        />

        <label className="cursor-pointer inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#f5f7f6] border border-gray-200 text-sm font-semibold text-[#17342d] hover:bg-[#eaf0ed] transition">
          {uploading ? (
            <Loader2
              size={15}
              className="animate-spin"
            />
          ) : (
            <Upload size={15} />
          )}

          {uploading
            ? "Uploading..."
            : "Upload"}

          <input
            type="file"
            hidden
            accept="image/*"
            disabled={uploading}
            onChange={(e) => {
              handleUpload(
                e.target.files?.[0]
              );

              e.target.value = "";
            }}
          />
        </label>
      </div>

      {value && (
        <div className="mt-3 rounded-xl border border-gray-200 bg-gray-50 p-3">
          <img
            src={value}
            alt=""
            className="h-28 w-full object-cover rounded-lg"
          />
        </div>
      )}
    </div>
  );
}


/* ============================================================
   MAIN PAGE
   ============================================================ */

export default function DeveloperEditPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [developer, setDeveloper] =
    useState(null);

  const [pageContent, setPageContent] =
    useState(
      DEFAULT_PAGE_CONTENT
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [openSections, setOpenSections] =
    useState({
      basic: true,
      hero: true,
      about: true,
      stats: false,
      projects: true,
      whyChoose: false,
      presence: false,
      faq: false,
      seo: false,
      custom: false,
    });


  /* ==========================================================
     FETCH DEVELOPER
     ========================================================== */

  useEffect(() => {
    if (!id) return;

    const loadDeveloper =
      async () => {
        try {
          setLoading(true);

          const res =
            await fetch(
              `/api/developers/${id}`,
              {
                cache: "no-store",
              }
            );

          const data =
            await res.json();

          if (!res.ok) {
            throw new Error(
              data.message ||
                "Failed to load developer"
            );
          }

          const loaded =
            data.developer;

          if (!loaded) {
            throw new Error(
              "Developer data not found"
            );
          }

          setDeveloper(
            loaded
          );

          setPageContent(
            buildPageContent(
              loaded.pageContent
            )
          );
        } catch (error) {
          console.error(
            error
          );

          toast.error(
            error.message ||
              "Failed to load developer ❌"
          );
        } finally {
          setLoading(false);
        }
      };

    loadDeveloper();
  }, [id]);


  /* ==========================================================
     UPDATE HELPERS
     ========================================================== */

  const updateDeveloper = (
    key,
    value
  ) => {
    setDeveloper(
      (prev) => ({
        ...prev,
        [key]: value,
      })
    );
  };

  const updatePage = (
    section,
    key,
    value
  ) => {
    setPageContent(
      (prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [key]: value,
        },
      })
    );
  };


  /* ==========================================================
     SAVE
     ========================================================== */

  const saveDeveloper =
    async () => {
      if (!developer) return;

      try {
        setSaving(true);

        const payload = {
          name:
            developer.name || "",

          logo:
            developer.logo || "",

          image:
            developer.image || "",

          description:
            developer.description ||
            "",

          pageContent,
        };

        const res =
          await fetch(
            `/api/developers/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const data =
          await res.json();

        if (!res.ok) {
          throw new Error(
            data.message ||
              "Failed to save developer"
          );
        }

        setDeveloper(
          data.data
        );

        setPageContent(
          buildPageContent(
            data.data
              ?.pageContent
          )
        );

        toast.success(
          "Developer page saved successfully ✅"
        );
      } catch (error) {
        console.error(
          error
        );

        toast.error(
          error.message ||
            "Failed to save developer ❌"
        );
      } finally {
        setSaving(false);
      }
    };


  /* ==========================================================
     TOGGLE SECTION
     ========================================================== */

  const toggleSection =
    (section) => {
      setOpenSections(
        (prev) => ({
          ...prev,
          [section]:
            !prev[section],
        })
      );
    };


  /* ==========================================================
     STATS
     ========================================================== */

  const addStat = () => {
    updatePage(
      "stats",
      "items",
      [
        ...(
          pageContent.stats
            ?.items || []
        ),

        {
          label: "",
          value: "",
        },
      ]
    );
  };

  const updateStat = (
    index,
    key,
    value
  ) => {
    const items = [
      ...(pageContent.stats
        ?.items || []),
    ];

    items[index] = {
      ...items[index],
      [key]: value,
    };

    updatePage(
      "stats",
      "items",
      items
    );
  };

  const removeStat = (
    index
  ) => {
    const items = [
      ...(pageContent.stats
        ?.items || []),
    ];

    items.splice(index, 1);

    updatePage(
      "stats",
      "items",
      items
    );
  };


  /* ==========================================================
     WHY CHOOSE ITEMS
     ========================================================== */

  const addWhyItem =
    () => {
      updatePage(
        "whyChoose",
        "items",
        [
          ...(
            pageContent
              .whyChoose
              ?.items || []
          ),

          {
            title: "",
            description: "",
          },
        ]
      );
    };

  const updateWhyItem = (
    index,
    key,
    value
  ) => {
    const items = [
      ...(pageContent
        .whyChoose
        ?.items || []),
    ];

    items[index] = {
      ...items[index],
      [key]: value,
    };

    updatePage(
      "whyChoose",
      "items",
      items
    );
  };

  const removeWhyItem =
    (index) => {
      const items = [
        ...(pageContent
          .whyChoose
          ?.items || []),
      ];

      items.splice(index, 1);

      updatePage(
        "whyChoose",
        "items",
        items
      );
    };


  /* ==========================================================
     FAQ ITEMS
     ========================================================== */

  const addFaq = () => {
    updatePage(
      "faq",
      "items",
      [
        ...(
          pageContent.faq
            ?.items || []
        ),

        {
          question: "",
          answer: "",
        },
      ]
    );
  };

  const updateFaq = (
    index,
    key,
    value
  ) => {
    const items = [
      ...(pageContent.faq
        ?.items || []),
    ];

    items[index] = {
      ...items[index],
      [key]: value,
    };

    updatePage(
      "faq",
      "items",
      items
    );
  };

  const removeFaq = (
    index
  ) => {
    const items = [
      ...(pageContent.faq
        ?.items || []),
    ];

    items.splice(index, 1);

    updatePage(
      "faq",
      "items",
      items
    );
  };


  /* ==========================================================
     CUSTOM SECTIONS
     ========================================================== */

  const addCustomSection =
    () => {
      setPageContent(
        (prev) => ({
          ...prev,

          customSections: [
            ...(
              prev.customSections ||
              []
            ),

            {
              id: `section-${Date.now()}`,
              type: "content",
              enabled: true,
              eyebrow: "",
              title: "",
              subtitle: "",
              content: "",
              image: "",
              imagePosition:
                "right",
            },
          ],
        })
      );
    };

  const updateCustomSection =
    (
      index,
      key,
      value
    ) => {
      setPageContent(
        (prev) => {
          const sections = [
            ...(prev.customSections ||
              []),
          ];

          sections[index] = {
            ...sections[index],
            [key]: value,
          };

          return {
            ...prev,
            customSections:
              sections,
          };
        }
      );
    };

  const removeCustomSection =
    (index) => {
      setPageContent(
        (prev) => {
          const sections = [
            ...(prev.customSections ||
              []),
          ];

          sections.splice(
            index,
            1
          );

          return {
            ...prev,
            customSections:
              sections,
          };
        }
      );
    };


  /* ==========================================================
     LOADING
     ========================================================== */

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-[#f7f8f7]">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
          <Loader2
            size={18}
            className="animate-spin"
          />
          Loading developer...
        </div>
      </div>
    );
  }


  if (!developer) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#f7f8f7] px-5">
        <Building2
          size={40}
          className="text-gray-400 mb-4"
        />

        <h1 className="text-xl font-bold text-[#17342d]">
          Developer not found
        </h1>

        <Link
          href="/admin/developers"
          className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3b2e] text-white text-sm font-semibold"
        >
          <ArrowLeft size={15} />
          Back to Developers
        </Link>
      </div>
    );
  }


  /* ==========================================================
     PAGE
     ========================================================== */

  return (
    <div className="min-h-screen bg-[#f7f8f7]">

      {/* ======================================================
          STICKY HEADER
          ====================================================== */}

      <div className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">

        <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-3">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">

            <div className="flex items-center gap-3 min-w-0">

              <Link
                href="/admin/developers"
                className="h-9 w-9 shrink-0 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
                title="Back"
              >
                <ArrowLeft size={16} />
              </Link>

              <div className="min-w-0">

                <div className="flex items-center gap-2">

                  <h1 className="text-lg sm:text-xl font-bold text-[#17342d] truncate">
                    Edit Developer Page
                  </h1>

                  <span className="hidden sm:inline-flex px-2 py-1 rounded-full bg-[#0f3b2e]/10 text-[#0f3b2e] text-[10px] font-bold uppercase tracking-wider">
                    CMS
                  </span>
                </div>

                <p className="text-xs text-gray-500 truncate">
                  {developer.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">

              <Link
                href={`/developers/${
                  developer.publicSlug ||
                  developer.slug
                }`}
                target="_blank"
                className="inline-flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 text-sm font-semibold transition"
              >
                <Eye size={15} />
                <span className="hidden sm:inline">
                  View Page
                </span>
              </Link>

              <button
                type="button"
                onClick={saveDeveloper}
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3b2e] hover:bg-[#145240] text-white text-sm font-semibold transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
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
                  : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* ======================================================
          CONTENT
          ====================================================== */}

      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6">

        <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6">

          {/* ==================================================
              MAIN EDITOR
              ================================================== */}

          <div className="space-y-4">

            {/* ==================================================
                BASIC INFORMATION
                ================================================== */}

            <EditorSection
              icon={
                <Building2
                  size={18}
                />
              }
              title="Basic Developer Information"
              description="Existing developer information used throughout the website."
              open={
                openSections.basic
              }
              onToggle={() =>
                toggleSection(
                  "basic"
                )
              }
            >

              <div className="grid md:grid-cols-2 gap-5">

                <Field
                  label="Developer Name"
                  value={
                    developer.name
                  }
                  onChange={(value) =>
                    updateDeveloper(
                      "name",
                      value
                    )
                  }
                  placeholder="Developer name"
                />

                <Field
                  label="Existing Description"
                  value={
                    developer.description
                  }
                  onChange={(value) =>
                    updateDeveloper(
                      "description",
                      value
                    )
                  }
                  placeholder="Existing developer description"
                  rows={5}
                  hint="This legacy description is preserved for backward compatibility."
                />

                <ImageUpload
                  label="Developer Logo"
                  value={
                    developer.logo
                  }
                  onChange={(value) =>
                    updateDeveloper(
                      "logo",
                      value
                    )
                  }
                  uploading={
                    uploading
                  }
                  setUploading={
                    setUploading
                  }
                />

                <ImageUpload
                  label="Developer Cover Image"
                  value={
                    developer.image
                  }
                  onChange={(value) =>
                    updateDeveloper(
                      "image",
                      value
                    )
                  }
                  uploading={
                    uploading
                  }
                  setUploading={
                    setUploading
                  }
                />

              </div>
            </EditorSection>


            {/* ==================================================
                HERO
                ================================================== */}

            <EditorSection
              icon={
                <Sparkles
                  size={18}
                />
              }
              title="Hero Section"
              description="Controls the main developer hero presentation."
              open={
                openSections.hero
              }
              onToggle={() =>
                toggleSection(
                  "hero"
                )
              }
            >

              <div className="space-y-5">

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent.hero
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "hero",
                        "eyebrow",
                        value
                      )
                    }
                    placeholder="LUXURY DEVELOPER COLLECTION"
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent.hero
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "hero",
                        "title",
                        value
                      )
                    }
                    placeholder="Discover the legacy behind..."
                  />

                </div>

                <Field
                  label="Hero Description"
                  value={
                    pageContent.hero
                      .description
                  }
                  onChange={(value) =>
                    updatePage(
                      "hero",
                      "description",
                      value
                    )
                  }
                  placeholder="Short introductory description..."
                  rows={5}
                  hint="Hero description is plain text."
                />

                <ImageUpload
                  label="Hero Image"
                  value={
                    pageContent.hero
                      .image
                  }
                  onChange={(value) =>
                    updatePage(
                      "hero",
                      "image",
                      value
                    )
                  }
                  uploading={
                    uploading
                  }
                  setUploading={
                    setUploading
                  }
                />

              </div>
            </EditorSection>


            {/* ==================================================
                ABOUT
                ================================================== */}

            <EditorSection
              icon={
                <Building2
                  size={18}
                />
              }
              title="About Developer"
              description="Rich-text introduction to the developer."
              open={
                openSections.about
              }
              onToggle={() =>
                toggleSection(
                  "about"
                )
              }
            >

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show About Section
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Enable or hide this section on the public page.
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .about
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "about",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent
                        .about
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "about",
                        "eyebrow",
                        value
                      )
                    }
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent
                        .about
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "about",
                        "title",
                        value
                      )
                    }
                    placeholder="About the developer"
                  />

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    About Content
                  </label>

                  <RichTextEditor
                    value={
                      pageContent
                        .about
                        .content
                    }
                    onChange={(value) =>
                      updatePage(
                        "about",
                        "content",
                        value
                      )
                    }
                  />
                </div>

              </div>
            </EditorSection>


            {/* ==================================================
                STATS
                ================================================== */}

            <EditorSection
              icon={
                <BarChart3
                  size={18}
                />
              }
              title="Statistics"
              description="Optional custom developer statistics."
              open={
                openSections.stats
              }
              onToggle={() =>
                toggleSection(
                  "stats"
                )
              }
            >

              <div className="space-y-4">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show Statistics
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Display custom statistics on the public page.
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .stats
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "stats",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                {pageContent.stats
                  .items
                  .map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={index}
                        className="border border-gray-200 rounded-xl p-4 bg-gray-50"
                      >

                        <div className="flex items-center justify-between mb-3">

                          <p className="text-sm font-bold text-[#17342d]">
                            Statistic{" "}
                            {index +
                              1}
                          </p>

                          <button
                            type="button"
                            onClick={() =>
                              removeStat(
                                index
                              )
                            }
                            className="h-8 w-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center hover:bg-red-100"
                          >
                            <Trash2
                              size={
                                14
                              }
                            />
                          </button>

                        </div>

                        <div className="grid md:grid-cols-2 gap-4">

                          <Field
                            label="Value"
                            value={
                              item.value
                            }
                            onChange={(value) =>
                              updateStat(
                                index,
                                "value",
                                value
                              )
                            }
                            placeholder="25+"
                          />

                          <Field
                            label="Label"
                            value={
                              item.label
                            }
                            onChange={(value) =>
                              updateStat(
                                index,
                                "label",
                                value
                              )
                            }
                            placeholder="Years of Excellence"
                          />

                        </div>
                      </div>
                    )
                  )}

                <button
                  type="button"
                  onClick={addStat}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3b2e] text-white text-sm font-semibold hover:bg-[#145240] transition"
                >
                  <Plus size={15} />
                  Add Statistic
                </button>

              </div>
            </EditorSection>


            {/* ==================================================
                PROJECTS
                ================================================== */}

            <EditorSection
              icon={
                <FolderKanban
                  size={18}
                />
              }
              title="Projects Section"
              description="Controls the introduction above the dynamic project listings."
              open={
                openSections.projects
              }
              onToggle={() =>
                toggleSection(
                  "projects"
                )
              }
            >

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show Projects Section
                    </p>

                    <p className="text-xs text-gray-500 mt-0.5">
                      Projects themselves remain automatically loaded from the Property collection.
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .projects
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "projects",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent
                        .projects
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "projects",
                        "eyebrow",
                        value
                      )
                    }
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent
                        .projects
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "projects",
                        "title",
                        value
                      )
                    }
                    placeholder="Explore Projects"
                  />

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Projects Description
                  </label>

                  <RichTextEditor
                    value={
                      pageContent
                        .projects
                        .description
                    }
                    onChange={(value) =>
                      updatePage(
                        "projects",
                        "description",
                        value
                      )
                    }
                  />
                </div>

              </div>
            </EditorSection>


            {/* ==================================================
                WHY CHOOSE
                ================================================== */}

            <EditorSection
              icon={
                <ShieldCheck
                  size={18}
                />
              }
              title="Why Choose This Developer"
              description="Create reasons and rich descriptions explaining the developer's strengths."
              open={
                openSections
                  .whyChoose
              }
              onToggle={() =>
                toggleSection(
                  "whyChoose"
                )
              }
            >

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show Why Choose Section
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .whyChoose
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "whyChoose",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent
                        .whyChoose
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "whyChoose",
                        "eyebrow",
                        value
                      )
                    }
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent
                        .whyChoose
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "whyChoose",
                        "title",
                        value
                      )
                    }
                    placeholder="Why choose this developer?"
                  />

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Section Description
                  </label>

                  <RichTextEditor
                    value={
                      pageContent
                        .whyChoose
                        .description
                    }
                    onChange={(value) =>
                      updatePage(
                        "whyChoose",
                        "description",
                        value
                      )
                    }
                  />
                </div>

                <div className="border-t border-gray-200 pt-5">

                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <h3 className="text-sm font-bold text-[#17342d]">
                        Reasons
                      </h3>

                      <p className="text-xs text-gray-500 mt-0.5">
                        Each reason supports rich-text descriptions.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={
                        addWhyItem
                      }
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0f3b2e] text-white text-xs font-semibold"
                    >
                      <Plus
                        size={14}
                      />
                      Add Reason
                    </button>

                  </div>

                  <div className="space-y-4">

                    {pageContent
                      .whyChoose
                      .items
                      .map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                          >

                            <div className="flex items-center justify-between mb-4">

                              <p className="text-sm font-bold text-[#17342d]">
                                Reason{" "}
                                {index +
                                  1}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeWhyItem(
                                    index
                                  )
                                }
                                className="h-8 w-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center"
                              >
                                <Trash2
                                  size={
                                    14
                                  }
                                />
                              </button>

                            </div>

                            <div className="space-y-4">

                              <Field
                                label="Title"
                                value={
                                  item.title
                                }
                                onChange={(value) =>
                                  updateWhyItem(
                                    index,
                                    "title",
                                    value
                                  )
                                }
                                placeholder="Trusted Legacy"
                              />

                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                  Description
                                </label>

                                <RichTextEditor
                                  value={
                                    item.description
                                  }
                                  onChange={(value) =>
                                    updateWhyItem(
                                      index,
                                      "description",
                                      value
                                    )
                                  }
                                />
                              </div>

                            </div>
                          </div>
                        )
                      )}

                  </div>

                </div>

              </div>
            </EditorSection>


            {/* ==================================================
                PRESENCE
                ================================================== */}

            <EditorSection
              icon={
                <MapPin
                  size={18}
                />
              }
              title="Developer Presence"
              description="Describe the locations and markets where the developer operates."
              open={
                openSections
                  .presence
              }
              onToggle={() =>
                toggleSection(
                  "presence"
                )
              }
            >

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show Presence Section
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .presence
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "presence",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent
                        .presence
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "presence",
                        "eyebrow",
                        value
                      )
                    }
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent
                        .presence
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "presence",
                        "title",
                        value
                      )
                    }
                    placeholder="A growing presence across India"
                  />

                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Presence Description
                  </label>

                  <RichTextEditor
                    value={
                      pageContent
                        .presence
                        .description
                    }
                    onChange={(value) =>
                      updatePage(
                        "presence",
                        "description",
                        value
                      )
                    }
                  />
                </div>

              </div>
            </EditorSection>


            {/* ==================================================
                FAQ
                ================================================== */}

            <EditorSection
              icon={
                <HelpCircle
                  size={18}
                />
              }
              title="Frequently Asked Questions"
              description="Create developer-specific FAQs with rich-text answers."
              open={
                openSections.faq
              }
              onToggle={() =>
                toggleSection(
                  "faq"
                )
              }
            >

              <div className="space-y-5">

                <div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3">

                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Show FAQ Section
                    </p>
                  </div>

                  <EnableToggle
                    enabled={
                      pageContent
                        .faq
                        .enabled
                    }
                    onChange={(value) =>
                      updatePage(
                        "faq",
                        "enabled",
                        value
                      )
                    }
                  />

                </div>

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Eyebrow"
                    value={
                      pageContent
                        .faq
                        .eyebrow
                    }
                    onChange={(value) =>
                      updatePage(
                        "faq",
                        "eyebrow",
                        value
                      )
                    }
                  />

                  <Field
                    label="Title"
                    value={
                      pageContent
                        .faq
                        .title
                    }
                    onChange={(value) =>
                      updatePage(
                        "faq",
                        "title",
                        value
                      )
                    }
                    placeholder="Frequently Asked Questions"
                  />

                </div>

                <div className="border-t border-gray-200 pt-5">

                  <div className="flex items-center justify-between mb-4">

                    <div>
                      <h3 className="text-sm font-bold text-[#17342d]">
                        Questions
                      </h3>
                    </div>

                    <button
                      type="button"
                      onClick={addFaq}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#0f3b2e] text-white text-xs font-semibold"
                    >
                      <Plus
                        size={14}
                      />
                      Add FAQ
                    </button>

                  </div>

                  <div className="space-y-4">

                    {pageContent.faq
                      .items
                      .map(
                        (
                          item,
                          index
                        ) => (
                          <div
                            key={index}
                            className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                          >

                            <div className="flex items-center justify-between mb-4">

                              <p className="text-sm font-bold text-[#17342d]">
                                FAQ{" "}
                                {index +
                                  1}
                              </p>

                              <button
                                type="button"
                                onClick={() =>
                                  removeFaq(
                                    index
                                  )
                                }
                                className="h-8 w-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center"
                              >
                                <Trash2
                                  size={
                                    14
                                  }
                                />
                              </button>

                            </div>

                            <div className="space-y-4">

                              <Field
                                label="Question"
                                value={
                                  item.question
                                }
                                onChange={(value) =>
                                  updateFaq(
                                    index,
                                    "question",
                                    value
                                  )
                                }
                                placeholder="What projects does this developer offer?"
                              />

                              <div>
                                <label className="block text-sm font-semibold text-gray-800 mb-2">
                                  Answer
                                </label>

                                <RichTextEditor
                                  value={
                                    item.answer
                                  }
                                  onChange={(value) =>
                                    updateFaq(
                                      index,
                                      "answer",
                                      value
                                    )
                                  }
                                />
                              </div>

                            </div>

                          </div>
                        )
                      )}

                  </div>

                </div>

              </div>
            </EditorSection>


            {/* ==================================================
                SEO
                ================================================== */}

            <EditorSection
              icon={
                <Search
                  size={18}
                />
              }
              title="SEO"
              description="Optional manual SEO values. Automatic SEO remains the fallback."
              open={
                openSections.seo
              }
              onToggle={() =>
                toggleSection(
                  "seo"
                )
              }
            >

              <div className="space-y-5">

                <Field
                  label="Meta Title"
                  value={
                    pageContent.seo
                      .metaTitle
                  }
                  onChange={(value) =>
                    updatePage(
                      "seo",
                      "metaTitle",
                      value
                    )
                  }
                  placeholder="Developer Name: All Projects | Property Bouquet"
                  hint="Leave empty to use automatic SEO."
                />

                <Field
                  label="Meta Description"
                  value={
                    pageContent.seo
                      .metaDescription
                  }
                  onChange={(value) =>
                    updatePage(
                      "seo",
                      "metaDescription",
                      value
                    )
                  }
                  placeholder="Explore premium projects by..."
                  rows={4}
                  hint="Leave empty to use automatic SEO."
                />

                <Field
                  label="Keywords"
                  value={
                    pageContent.seo
                      .keywords
                  }
                  onChange={(value) =>
                    updatePage(
                      "seo",
                      "keywords",
                      value
                    )
                  }
                  placeholder="developer projects, luxury properties, ..."
                />

                <Field
                  label="Canonical URL"
                  value={
                    pageContent.seo
                      .canonical
                  }
                  onChange={(value) =>
                    updatePage(
                      "seo",
                      "canonical",
                      value
                    )
                  }
                  placeholder="https://propertybouquet.com/developers/..."
                />

                <div className="grid md:grid-cols-2 gap-5">

                  <Field
                    label="Open Graph Title"
                    value={
                      pageContent.seo
                        .ogTitle
                    }
                    onChange={(value) =>
                      updatePage(
                        "seo",
                        "ogTitle",
                        value
                      )
                    }
                  />

                  <Field
                    label="Open Graph Description"
                    value={
                      pageContent.seo
                        .ogDescription
                    }
                    onChange={(value) =>
                      updatePage(
                        "seo",
                        "ogDescription",
                        value
                      )
                    }
                    rows={4}
                  />

                </div>

                <ImageUpload
                  label="Open Graph Image"
                  value={
                    pageContent.seo
                      .ogImage
                  }
                  onChange={(value) =>
                    updatePage(
                      "seo",
                      "ogImage",
                      value
                    )
                  }
                  uploading={
                    uploading
                  }
                  setUploading={
                    setUploading
                  }
                />

              </div>
            </EditorSection>


            {/* ==================================================
                CUSTOM SECTIONS
                ================================================== */}

            <EditorSection
              icon={
                <Layers3
                  size={18}
                />
              }
              title="Custom Sections"
              description="Add additional rich-text sections without changing the developer schema again."
              open={
                openSections.custom
              }
              onToggle={() =>
                toggleSection(
                  "custom"
                )
              }
            >

              <div className="space-y-5">

                {pageContent
                  .customSections
                  .map(
                    (
                      section,
                      index
                    ) => (
                      <div
                        key={
                          section.id ||
                          index
                        }
                        className="border border-gray-200 rounded-2xl bg-gray-50 p-5"
                      >

                        <div className="flex items-center justify-between mb-5">

                          <div>
                            <p className="text-sm font-bold text-[#17342d]">
                              Custom Section{" "}
                              {index +
                                1}
                            </p>

                            <p className="text-xs text-gray-500 mt-0.5">
                              Additional developer page content.
                            </p>
                          </div>

                          <div className="flex items-center gap-2">

                            <EnableToggle
                              enabled={
                                section.enabled
                              }
                              onChange={(value) =>
                                updateCustomSection(
                                  index,
                                  "enabled",
                                  value
                                )
                              }
                            />

                            <button
                              type="button"
                              onClick={() =>
                                removeCustomSection(
                                  index
                                )
                              }
                              className="h-8 w-8 rounded-lg bg-red-50 text-red-600 border border-red-200 flex items-center justify-center"
                            >
                              <Trash2
                                size={
                                  14
                                }
                              />
                            </button>

                          </div>

                        </div>

                        <div className="space-y-5">

                          <div className="grid md:grid-cols-2 gap-5">

                            <Field
                              label="Eyebrow"
                              value={
                                section.eyebrow
                              }
                              onChange={(value) =>
                                updateCustomSection(
                                  index,
                                  "eyebrow",
                                  value
                                )
                              }
                              placeholder="INSIGHTS"
                            />

                            <Field
                              label="Title"
                              value={
                                section.title
                              }
                              onChange={(value) =>
                                updateCustomSection(
                                  index,
                                  "title",
                                  value
                                )
                              }
                              placeholder="A distinctive legacy"
                            />

                          </div>

                          <Field
                            label="Subtitle"
                            value={
                              section.subtitle
                            }
                            onChange={(value) =>
                              updateCustomSection(
                                index,
                                "subtitle",
                                value
                              )
                            }
                            placeholder="Optional supporting subtitle"
                          />

                          <div>
                            <label className="block text-sm font-semibold text-gray-800 mb-2">
                              Content
                            </label>

                            <RichTextEditor
                              value={
                                section.content
                              }
                              onChange={(value) =>
                                updateCustomSection(
                                  index,
                                  "content",
                                  value
                                )
                              }
                            />
                          </div>

                          <ImageUpload
                            label="Section Image"
                            value={
                              section.image
                            }
                            onChange={(value) =>
                              updateCustomSection(
                                index,
                                "image",
                                value
                              )
                            }
                            uploading={
                              uploading
                            }
                            setUploading={
                              setUploading
                            }
                          />

                          <div className="grid md:grid-cols-2 gap-5">

                            <Field
                              label="Section Type"
                              value={
                                section.type
                              }
                              onChange={(value) =>
                                updateCustomSection(
                                  index,
                                  "type",
                                  value
                                )
                              }
                              placeholder="content"
                            />

                            <div>
                              <label className="block text-sm font-semibold text-gray-800 mb-2">
                                Image Position
                              </label>

                              <select
                                value={
                                  section.imagePosition ||
                                  "right"
                                }
                                onChange={(e) =>
                                  updateCustomSection(
                                    index,
                                    "imagePosition",
                                    e.target.value
                                  )
                                }
                                className="w-full border border-gray-300 bg-white text-sm text-gray-800 rounded-xl px-4 py-2.5 outline-none focus:border-[#0f3b2e] focus:ring-2 focus:ring-[#0f3b2e]/10"
                              >
                                <option value="left">
                                  Left
                                </option>

                                <option value="right">
                                  Right
                                </option>

                                <option value="top">
                                  Top
                                </option>

                                <option value="bottom">
                                  Bottom
                                </option>
                              </select>
                            </div>

                          </div>

                        </div>
                      </div>
                    )
                  )}

                <button
                  type="button"
                  onClick={
                    addCustomSection
                  }
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0f3b2e] text-white text-sm font-semibold hover:bg-[#145240] transition"
                >
                  <Plus size={15} />
                  Add Custom Section
                </button>

              </div>
            </EditorSection>

          </div>


          {/* ==================================================
              SIDEBAR
              ================================================== */}

          <aside className="space-y-4 xl:sticky xl:top-[90px] xl:self-start">

            {/* STATUS CARD */}

            <div className="bg-[#17342d] rounded-2xl p-5 text-white shadow-sm">

              <div className="flex items-center gap-2 mb-4">
                <Globe
                  size={17}
                />

                <h3 className="font-bold">
                  Public Page
                </h3>
              </div>

              <p className="text-xs text-white/70 leading-5">
                Your CMS content will appear on the public developer page after saving.
              </p>

              <Link
                href={`/developers/${
                  developer.publicSlug ||
                  developer.slug
                }`}
                target="_blank"
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#D4AF37] hover:text-white transition"
              >
                Open Public Page
                <Eye size={13} />
              </Link>

            </div>


            {/* DEVELOPER INFO */}

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

              <h3 className="font-bold text-[#17342d] text-sm mb-4">
                Developer Details
              </h3>

              <div className="space-y-3 text-xs">

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Name
                  </span>

                  <span className="font-semibold text-gray-800 text-right">
                    {developer.name}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Backend Slug
                  </span>

                  <span className="font-semibold text-gray-800 text-right break-all">
                    {developer.slug}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-gray-500">
                    Public Slug
                  </span>

                  <span className="font-semibold text-gray-800 text-right break-all">
                    {developer.publicSlug ||
                      developer.slug}
                  </span>
                </div>

              </div>

            </div>


            {/* SAVE REMINDER */}

            <div className="bg-[#f7f3ee] border border-[#e5d7bf] rounded-2xl p-5">

              <div className="flex items-center gap-2 text-[#8F7335] mb-2">
                <Save
                  size={16}
                />

                <h3 className="text-sm font-bold">
                  Remember to save
                </h3>
              </div>

              <p className="text-xs text-[#6d6250] leading-5">
                Changes are kept in this editor until you click Save Changes.
              </p>

            </div>

          </aside>

        </div>

      </main>


      {/* ======================================================
          MOBILE SAVE BAR
          ====================================================== */}

      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-gray-200 p-3">

        <button
          type="button"
          onClick={saveDeveloper}
          disabled={saving}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#0f3b2e] text-white text-sm font-bold shadow-lg disabled:opacity-60"
        >
          {saving ? (
            <Loader2
              size={16}
              className="animate-spin"
            />
          ) : (
            <Save size={16} />
          )}

          {saving
            ? "Saving..."
            : "Save Developer Page"}
        </button>

      </div>

    </div>
  );
}