"use client";

import { useEffect, useState } from "react";
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
  BarChart3,
  FolderKanban,
  ShieldCheck,
  MapPin,
  HelpCircle,
  Globe,
  Layers3,
  Search,
  Sparkles,
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
    title: "Featured Projects",
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
   SAFE PAGE CONTENT NORMALIZER
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

    customSections: Array.isArray(
      source.customSections
    )
      ? source.customSections
      : [],
  };
}


/* ============================================================
   FIELD
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
  const inputClass = `
    w-full
    rounded-xl
    border
    border-gray-300
    bg-white
    px-4
    py-2.5
    text-sm
    text-gray-800
    outline-none
    transition
    placeholder:text-gray-400
    focus:border-[#0f3b2e]
    focus:ring-2
    focus:ring-[#0f3b2e]/10
  `;

  return (
    <div>
      {label && (
        <label className="mb-2 block text-sm font-semibold text-gray-800">
          {label}
        </label>
      )}

      {rows ? (
        <textarea
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          rows={rows}
          className={`${inputClass} resize-y`}
        />
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder={placeholder}
          className={inputClass}
        />
      )}

      {hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
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
    <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="
          flex
          w-full
          items-center
          justify-between
          gap-4
          px-5
          py-4
          text-left
          transition
          hover:bg-gray-50
        "
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#0f3b2e]/10
              text-[#0f3b2e]
            "
          >
            {icon}
          </div>

          <div className="min-w-0">
            <h2 className="text-base font-bold text-[#17342d]">
              {title}
            </h2>

            {description && (
              <p className="mt-0.5 text-xs text-gray-500">
                {description}
              </p>
            )}
          </div>
        </div>

        {open ? (
          <ChevronUp
            size={18}
            className="shrink-0 text-gray-500"
          />
        ) : (
          <ChevronDown
            size={18}
            className="shrink-0 text-gray-500"
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
      onClick={() => onChange(!enabled)}
      className={`
        relative
        inline-flex
        h-6
        w-11
        shrink-0
        items-center
        rounded-full
        transition
        ${
          enabled
            ? "bg-[#0f3b2e]"
            : "bg-gray-300"
        }
      `}
      aria-label={
        enabled
          ? "Disable section"
          : "Enable section"
      }
    >
      <span
        className={`
          inline-block
          h-5
          w-5
          transform
          rounded-full
          bg-white
          shadow
          transition
          ${
            enabled
              ? "translate-x-5"
              : "translate-x-0.5"
          }
        `}
      />
    </button>
  );
}


/* ============================================================
   ENABLE ROW
============================================================ */

function EnableRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-between
        gap-5
        rounded-xl
        border
        border-gray-200
        bg-gray-50
        px-4
        py-3.5
      "
    >
      <div>
        <p className="text-sm font-semibold text-gray-800">
          {title}
        </p>

        {description && (
          <p className="mt-0.5 text-xs text-gray-500">
            {description}
          </p>
        )}
      </div>

      <EnableToggle
        enabled={enabled}
        onChange={onChange}
      />
    </div>
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
  hint,
}) {
  const handleUpload = async (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error(
        "Only image files are allowed ❌"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        "Maximum file size is 5MB ❌"
      );
      return;
    }

    try {
      setUploading(true);

      const formData = new FormData();

      formData.append(
        "file",
        file
      );

      const response = await fetch(
        "/api/upload-developer",
        {
          method: "POST",
          body: formData,
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result?.url
      ) {
        throw new Error(
          result?.message ||
            "Image upload failed"
        );
      }

      onChange(result.url);

      toast.success(
        "Image uploaded successfully ✅"
      );
    } catch (error) {
      console.error(
        "DEVELOPER IMAGE UPLOAD ERROR:",
        error
      );

      toast.error(
        error?.message ||
          "Image upload failed ❌"
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <div className="grid gap-3 md:grid-cols-[1fr_auto]">
        <input
          value={value || ""}
          onChange={(event) =>
            onChange(event.target.value)
          }
          placeholder="https://..."
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            bg-white
            px-4
            py-2.5
            text-sm
            text-gray-800
            outline-none
            placeholder:text-gray-400
            focus:border-[#0f3b2e]
            focus:ring-2
            focus:ring-[#0f3b2e]/10
          "
        />

        <label
          className="
            inline-flex
            cursor-pointer
            items-center
            justify-center
            gap-2
            rounded-xl
            border
            border-gray-200
            bg-[#f5f7f6]
            px-4
            py-2.5
            text-sm
            font-semibold
            text-[#17342d]
            transition
            hover:bg-[#eaf0ed]
          "
        >
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
            onChange={(event) => {
              handleUpload(
                event.target.files?.[0]
              );

              event.target.value = "";
            }}
          />
        </label>
      </div>

      {hint && (
        <p className="mt-1.5 text-[11px] text-gray-500">
          {hint}
        </p>
      )}

      {value && (
        <div className="mt-3 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 p-3">
          <img
            src={value}
            alt=""
            className="
              h-32
              w-full
              rounded-lg
              object-cover
            "
          />
        </div>
      )}
    </div>
  );
}


/* ============================================================
   RICH TEXT FIELD
============================================================ */

function RichField({
  label,
  value,
  onChange,
  hint,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-gray-800">
        {label}
      </label>

      <RichTextEditor
        value={value || ""}
        onChange={onChange}
      />

      {hint && (
        <p className="mt-1.5 text-[11px] leading-relaxed text-gray-500">
          {hint}
        </p>
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
      buildPageContent({})
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
     LOAD DEVELOPER
  ========================================================== */

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    const loadDeveloper = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/developers/${id}`,
          {
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to load developer"
          );
        }

        /*
          Our controller returns the developer
          object directly.

          This also supports older response
          formats just in case.
        */

        const loaded =
          data?.developer ||
          data?.data ||
          data;

        if (
          !loaded ||
          !loaded._id
        ) {
          throw new Error(
            "Developer data not found"
          );
        }

        if (cancelled) return;

        setDeveloper(loaded);

        setPageContent(
          buildPageContent(
            loaded.pageContent
          )
        );
      } catch (error) {
        console.error(
          "LOAD DEVELOPER ERROR:",
          error
        );

        if (!cancelled) {
          toast.error(
            error?.message ||
              "Failed to load developer ❌"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDeveloper();

    return () => {
      cancelled = true;
    };
  }, [id]);


  /* ==========================================================
     UPDATE BASIC DEVELOPER FIELD
  ========================================================== */

  const updateDeveloper = (
    key,
    value
  ) => {
    setDeveloper((previous) => ({
      ...previous,
      [key]: value,
    }));
  };


  /* ==========================================================
     UPDATE PAGE CONTENT
  ========================================================== */

  const updatePage = (
    section,
    key,
    value
  ) => {
    setPageContent((previous) => ({
      ...previous,

      [section]: {
        ...(previous[section] || {}),
        [key]: value,
      },
    }));
  };


  /* ==========================================================
     TOGGLE SECTION
  ========================================================== */

  const toggleSection = (
    section
  ) => {
    setOpenSections((previous) => ({
      ...previous,

      [section]:
        !previous[section],
    }));
  };


  /* ==========================================================
     SAVE
  ========================================================== */

  const saveDeveloper =
    async () => {
      if (!developer || !id) {
        return;
      }

      if (saving) {
        return;
      }

      try {
        setSaving(true);

        /*
          Clone the content before sending it.
          This prevents accidental state-reference
          mutations.
        */

        const cleanPageContent =
          JSON.parse(
            JSON.stringify(
              buildPageContent(
                pageContent
              )
            )
          );

        const payload = {
          name:
            developer.name || "",

          logo:
            developer.logo || "",

          image:
            developer.image || "",

          description:
            developer.description || "",

          pageContent:
            cleanPageContent,
        };

        const response =
          await fetch(
            `/api/developers/${id}`,
            {
              method: "PUT",

              headers: {
                "Content-Type":
                  "application/json",

                Accept:
                  "application/json",
              },

              body:
                JSON.stringify(
                  payload
                ),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to save developer"
          );
        }

        /*
          Our controller returns:

          {
            message,
            developer
          }

          But this also safely supports
          older response formats.
        */

        const saved =
          data?.developer ||
          data?.data ||
          data;

        if (
          saved &&
          saved._id
        ) {
          setDeveloper(saved);

          setPageContent(
            buildPageContent(
              saved.pageContent
            )
          );
        } else {
          setPageContent(
            buildPageContent(
              cleanPageContent
            )
          );
        }

        toast.success(
          "Developer page saved successfully ✅"
        );
      } catch (error) {
        console.error(
          "SAVE DEVELOPER ERROR:",
          error
        );

        toast.error(
          error?.message ||
            "Failed to save developer ❌"
        );
      } finally {
        setSaving(false);
      }
    };


  /* ==========================================================
     STATS
  ========================================================== */

  const addStat = () => {
    updatePage(
      "stats",
      "items",
      [
        ...(pageContent.stats
          ?.items || []),

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
     WHY CHOOSE
  ========================================================== */

  const addWhyItem = () => {
    updatePage(
      "whyChoose",
      "items",
      [
        ...(pageContent
          .whyChoose
          ?.items || []),

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
     FAQ
  ========================================================== */

  const addFaq = () => {
    updatePage(
      "faq",
      "items",
      [
        ...(pageContent.faq
          ?.items || []),

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
      setPageContent((previous) => ({
        ...previous,

        customSections: [
          ...(previous.customSections ||
            []),

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
      }));
    };

  const updateCustomSection =
    (
      index,
      key,
      value
    ) => {
      setPageContent((previous) => {
        const sections = [
          ...(previous.customSections ||
            []),
        ];

        sections[index] = {
          ...sections[index],
          [key]: value,
        };

        return {
          ...previous,
          customSections:
            sections,
        };
      });
    };

  const removeCustomSection =
    (index) => {
      setPageContent((previous) => {
        const sections = [
          ...(previous.customSections ||
            []),
        ];

        sections.splice(
          index,
          1
        );

        return {
          ...previous,
          customSections:
            sections,
        };
      });
    };


  /* ==========================================================
     LOADING
  ========================================================== */

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f7]">
        <div className="flex items-center gap-3 text-sm font-semibold text-gray-600">
          <Loader2
            size={18}
            className="animate-spin"
          />

          Loading developer page...
        </div>
      </div>
    );
  }


  /* ==========================================================
     NOT FOUND
  ========================================================== */

  if (!developer) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f7f8f7] px-5">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-red-600">
            <Building2 size={21} />
          </div>

          <h1 className="text-xl font-bold text-[#17342d]">
            Developer not found
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            The requested developer could not
            be loaded.
          </p>

          <Link
            href="/admin/developers"
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-xl
              bg-[#0f3b2e]
              px-5
              py-2.5
              text-sm
              font-semibold
              text-white
              transition
              hover:bg-[#17342d]
            "
          >
            <ArrowLeft size={15} />

            Back to Developers
          </Link>
        </div>
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

      <div className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-[1500px] px-4 py-3 sm:px-6">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            {/* LEFT */}

            <div className="flex min-w-0 items-center gap-3">
              <Link
                href="/admin/developers"
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  text-gray-600
                  transition
                  hover:bg-gray-50
                "
                title="Back to Developers"
              >
                <ArrowLeft size={16} />
              </Link>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h1 className="truncate text-lg font-bold text-[#17342d] sm:text-xl">
                    Edit Developer Page
                  </h1>

                  <span className="hidden rounded-full bg-[#0f3b2e]/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#0f3b2e] sm:inline-flex">
                    CMS
                  </span>
                </div>

                <p className="truncate text-xs text-gray-500">
                  {developer.name}
                </p>
              </div>
            </div>

            {/* RIGHT */}

            <div className="flex items-center gap-2">
              <Link
                href={`/developers/${
                  developer.publicSlug ||
                  developer.slug
                }`}
                target="_blank"
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-gray-200
                  bg-white
                  px-3.5
                  py-2
                  text-xs
                  font-semibold
                  text-gray-700
                  transition
                  hover:bg-gray-50
                "
              >
                <Eye size={15} />

                Preview
              </Link>

              <button
                type="button"
                onClick={saveDeveloper}
                disabled={saving}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#0f3b2e]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  text-white
                  shadow-sm
                  transition
                  hover:bg-[#17342d]
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
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
        </div>
      </div>


      {/* ======================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8">
        {/* ====================================================
            INTRO
        ==================================================== */}

        <div className="mb-6">
          <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#A68142]">
            <Sparkles size={13} />

            Developer Content Management
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-[#17342d] sm:text-3xl">
            {developer.name}
          </h2>

          <p className="mt-2 max-w-3xl text-sm leading-relaxed text-gray-500">
            Manage the public developer page,
            editorial content, project section,
            FAQs and SEO from one place.
          </p>
        </div>


        {/* ====================================================
            EDITOR STACK
        ==================================================== */}

        <div className="space-y-4">
          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

          <EditorSection
            icon={
              <Building2 size={18} />
            }
            title="Basic Developer Information"
            description="Core developer information retained for the existing system."
            open={
              openSections.basic
            }
            onToggle={() =>
              toggleSection(
                "basic"
              )
            }
          >
            <div className="space-y-5">
              <div className="grid gap-5 md:grid-cols-2">
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
                  label="Legacy Slug"
                  value={
                    developer.slug
                  }
                  onChange={(value) =>
                    updateDeveloper(
                      "slug",
                      value
                    )
                  }
                  hint="The backend automatically regenerates the slug from the developer name when saved."
                />
              </div>

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
                label="Legacy Developer Image"
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

              <Field
                label="Legacy Description"
                value={
                  developer.description
                }
                onChange={(value) =>
                  updateDeveloper(
                    "description",
                    value
                  )
                }
                rows={5}
                hint="This field is retained for compatibility with existing developer components. The dedicated About section below is the new CMS content."
              />
            </div>
          </EditorSection>


          {/* ==================================================
              HERO
          ================================================== */}

          <EditorSection
            icon={
              <ImageIcon size={18} />
            }
            title="Hero Section"
            description="The primary introduction at the top of the developer page."
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
              <div className="grid gap-5 md:grid-cols-2">
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
                hint="Use a high-quality landscape image suitable for the hero."
              />
            </div>
          </EditorSection>


          {/* ==================================================
              ABOUT
          ================================================== */}

          <EditorSection
            icon={
              <Building2 size={18} />
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
              <EnableRow
                title="Show About Section"
                description="Enable or hide this section on the public page."
                enabled={
                  pageContent.about
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

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Eyebrow"
                  value={
                    pageContent.about
                      .eyebrow
                  }
                  onChange={(value) =>
                    updatePage(
                      "about",
                      "eyebrow",
                      value
                    )
                  }
                  placeholder="ABOUT THE DEVELOPER"
                />

                <Field
                  label="Title"
                  value={
                    pageContent.about
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

              <RichField
                label="About Content"
                value={
                  pageContent.about
                    .content
                }
                onChange={(value) =>
                  updatePage(
                    "about",
                    "content",
                    value
                  )
                }
                hint="Supports paragraphs, bold, italic, headings, lists, links and other formatting supported by your existing RichTextEditor."
              />
            </div>
          </EditorSection>


          {/* ==================================================
              STATS
          ================================================== */}

          <EditorSection
            icon={
              <BarChart3 size={18} />
            }
            title="Developer Stats"
            description="Optional numbers and facts displayed as a statistics strip."
            open={
              openSections.stats
            }
            onToggle={() =>
              toggleSection(
                "stats"
              )
            }
          >
            <div className="space-y-5">
              <EnableRow
                title="Show Statistics"
                description="Enable or hide the statistics section."
                enabled={
                  pageContent.stats
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

              <div className="flex items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-[#17342d]">
                    Statistics
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Example: 30+ Years, 50+ Projects,
                    10+ Cities.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addStat}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0f3b2e]
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[#17342d]
                  "
                >
                  <Plus size={14} />

                  Add Stat
                </button>
              </div>

              {pageContent.stats
                ?.items?.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <BarChart3
                    size={22}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    No statistics added
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Add statistics when you want
                    to highlight the developer's
                    achievements.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pageContent.stats.items.map(
                    (item, index) => (
                      <div
                        key={`stat-${index}`}
                        className="
                          grid
                          gap-3
                          rounded-xl
                          border
                          border-gray-200
                          bg-gray-50
                          p-4
                          md:grid-cols-[1fr_1fr_auto]
                        "
                      >
                        <Field
                          label="Value"
                          value={
                            item.value
                          }
                          onChange={(
                            value
                          ) =>
                            updateStat(
                              index,
                              "value",
                              value
                            )
                          }
                          placeholder="30+"
                        />

                        <Field
                          label="Label"
                          value={
                            item.label
                          }
                          onChange={(
                            value
                          ) =>
                            updateStat(
                              index,
                              "label",
                              value
                            )
                          }
                          placeholder="Years of Excellence"
                        />

                        <div className="flex items-end">
                          <button
                            type="button"
                            onClick={() =>
                              removeStat(
                                index
                              )
                            }
                            className="
                              flex
                              h-10
                              w-10
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-red-200
                              bg-red-50
                              text-red-600
                              transition
                              hover:bg-red-100
                            "
                            title="Remove statistic"
                          >
                            <Trash2
                              size={16}
                            />
                          </button>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </EditorSection>


          {/* ==================================================
              PROJECTS
          ================================================== */}

          <EditorSection
            icon={
              <FolderKanban size={18} />
            }
            title="Projects / Portfolio"
            description="Controls the heading and editorial introduction above the dynamic property projects."
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
              <EnableRow
                title="Show Projects Section"
                description="The actual projects remain dynamic from the Property collection."
                enabled={
                  pageContent.projects
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

              <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="THE PORTFOLIO"
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
                  placeholder="Featured Projects"
                />
              </div>

              <RichField
                label="Projects Description"
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
                hint="This is editorial content only. Projects themselves continue to come from active properties linked to this developer."
              />
            </div>
          </EditorSection>


          {/* ==================================================
              WHY CHOOSE
          ================================================== */}

          <EditorSection
            icon={
              <ShieldCheck size={18} />
            }
            title="Why Choose This Developer"
            description="Create a premium editorial section explaining the developer's strengths."
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
              <EnableRow
                title="Show Why Choose Section"
                description="Enable or hide this section on the public page."
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

              <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="WHY CHOOSE THIS DEVELOPER"
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
                  placeholder="A legacy built around trust"
                />
              </div>

              <RichField
                label="Introduction"
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

              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <div>
                  <h3 className="text-sm font-bold text-[#17342d]">
                    Reasons
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Add individual reasons or
                    strengths.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addWhyItem}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0f3b2e]
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[#17342d]
                  "
                >
                  <Plus size={14} />

                  Add Reason
                </button>
              </div>

              {pageContent
                .whyChoose?.items
                ?.length === 0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <ShieldCheck
                    size={22}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    No reasons added
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageContent.whyChoose.items.map(
                    (item, index) => (
                      <div
                        key={`why-${index}`}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#A68142]">
                            Reason {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeWhyItem(
                                index
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              text-red-600
                              hover:bg-red-100
                            "
                            title="Remove reason"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <Field
                            label="Title"
                            value={
                              item.title
                            }
                            onChange={(
                              value
                            ) =>
                              updateWhyItem(
                                index,
                                "title",
                                value
                              )
                            }
                            placeholder="Trusted track record"
                          />

                          <RichField
                            label="Description"
                            value={
                              item.description
                            }
                            onChange={(
                              value
                            ) =>
                              updateWhyItem(
                                index,
                                "description",
                                value
                              )
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </EditorSection>


          {/* ==================================================
              PRESENCE
          ================================================== */}

          <EditorSection
            icon={
              <MapPin size={18} />
            }
            title="Market Presence"
            description="Editorial section describing the developer's geographic or market footprint."
            open={
              openSections.presence
            }
            onToggle={() =>
              toggleSection(
                "presence"
              )
            }
          >
            <div className="space-y-5">
              <EnableRow
                title="Show Market Presence"
                description="Enable or hide this section."
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

              <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="DEVELOPER PRESENCE"
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
                  placeholder="A growing presence across India's key markets"
                />
              </div>

              <RichField
                label="Market Presence Description"
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
          </EditorSection>


          {/* ==================================================
              FAQ
          ================================================== */}

          <EditorSection
            icon={
              <HelpCircle size={18} />
            }
            title="Frequently Asked Questions"
            description="Create developer-specific FAQ questions with rich-text answers."
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
              <EnableRow
                title="Show FAQ Section"
                description="Enable or hide the FAQ section."
                enabled={
                  pageContent.faq
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

              <div className="grid gap-5 md:grid-cols-2">
                <Field
                  label="Eyebrow"
                  value={
                    pageContent.faq
                      .eyebrow
                  }
                  onChange={(value) =>
                    updatePage(
                      "faq",
                      "eyebrow",
                      value
                    )
                  }
                  placeholder="FREQUENTLY ASKED QUESTIONS"
                />

                <Field
                  label="Title"
                  value={
                    pageContent.faq
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

              <div className="flex items-center justify-between gap-4 border-t border-gray-200 pt-5">
                <div>
                  <h3 className="text-sm font-bold text-[#17342d]">
                    FAQ Items
                  </h3>

                  <p className="mt-1 text-xs text-gray-500">
                    Answers support rich text.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addFaq}
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    bg-[#0f3b2e]
                    px-3.5
                    py-2
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[#17342d]
                  "
                >
                  <Plus size={14} />

                  Add FAQ
                </button>
              </div>

              {pageContent.faq
                ?.items?.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-8 text-center">
                  <HelpCircle
                    size={22}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    No FAQ items added
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pageContent.faq.items.map(
                    (item, index) => (
                      <div
                        key={`faq-${index}`}
                        className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                      >
                        <div className="mb-4 flex items-center justify-between gap-3">
                          <span className="text-xs font-bold uppercase tracking-wider text-[#A68142]">
                            FAQ {index + 1}
                          </span>

                          <button
                            type="button"
                            onClick={() =>
                              removeFaq(
                                index
                              )
                            }
                            className="
                              flex
                              h-8
                              w-8
                              items-center
                              justify-center
                              rounded-lg
                              border
                              border-red-200
                              bg-red-50
                              text-red-600
                              hover:bg-red-100
                            "
                            title="Remove FAQ"
                          >
                            <Trash2
                              size={14}
                            />
                          </button>
                        </div>

                        <div className="space-y-4">
                          <Field
                            label="Question"
                            value={
                              item.question
                            }
                            onChange={(
                              value
                            ) =>
                              updateFaq(
                                index,
                                "question",
                                value
                              )
                            }
                            placeholder="What projects has this developer delivered?"
                          />

                          <RichField
                            label="Answer"
                            value={
                              item.answer
                            }
                            onChange={(
                              value
                            ) =>
                              updateFaq(
                                index,
                                "answer",
                                value
                              )
                            }
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </EditorSection>


          {/* ==================================================
              SEO
          ================================================== */}

          <EditorSection
            icon={
              <Globe size={18} />
            }
            title="SEO & Social Metadata"
            description="Control the developer page's search engine and social metadata."
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
              <div className="rounded-xl border border-[#C89D58]/20 bg-[#C89D58]/5 p-4">
                <div className="flex gap-3">
                  <Search
                    size={17}
                    className="mt-0.5 shrink-0 text-[#A68142]"
                  />

                  <div>
                    <p className="text-sm font-semibold text-[#17342d]">
                      Custom SEO overrides
                    </p>

                    <p className="mt-1 text-xs leading-relaxed text-gray-600">
                      Leave fields empty to allow
                      the automatic developer SEO
                      fallback to be used.
                    </p>
                  </div>
                </div>
              </div>

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
                placeholder="M3M: All Projects | Residential & Commercial"
                hint={`${(
                  pageContent.seo
                    .metaTitle || ""
                ).length} characters`}
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
                placeholder="Discover projects, developments and property opportunities..."
                rows={4}
                hint={`${(
                  pageContent.seo
                    .metaDescription ||
                  ""
                ).length} characters`}
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
                placeholder="developer projects, luxury real estate, Gurgaon properties"
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

              <div className="grid gap-5 md:grid-cols-2">
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
                  placeholder="Developer Projects | Property Bouquet"
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
                  rows={3}
                  placeholder="Discover premium developer projects..."
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
              <Layers3 size={18} />
            }
            title="Custom Sections"
            description="Build additional rich editorial sections without changing the database structure."
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
              <div className="flex flex-col gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-sm font-bold text-[#17342d]">
                    Flexible Content Blocks
                  </h3>

                  <p className="mt-1 text-xs leading-relaxed text-gray-500">
                    Add additional editorial sections
                    such as legacy, philosophy,
                    sustainability, awards or
                    investment outlook.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={
                    addCustomSection
                  }
                  className="
                    inline-flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#0f3b2e]
                    px-4
                    py-2.5
                    text-xs
                    font-bold
                    text-white
                    transition
                    hover:bg-[#17342d]
                  "
                >
                  <Plus size={14} />

                  Add Section
                </button>
              </div>

              {pageContent
                .customSections
                ?.length ===
              0 ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-gray-50 px-5 py-10 text-center">
                  <Layers3
                    size={24}
                    className="mx-auto text-gray-400"
                  />

                  <p className="mt-2 text-sm font-semibold text-gray-600">
                    No custom sections
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Add a section whenever you need
                    content beyond the standard
                    developer page structure.
                  </p>
                </div>
              ) : (
                <div className="space-y-5">
                  {pageContent.customSections.map(
                    (
                      section,
                      index
                    ) => (
                      <div
                        key={
                          section.id ||
                          `custom-${index}`
                        }
                        className="
                          rounded-2xl
                          border
                          border-gray-200
                          bg-white
                          p-5
                          shadow-sm
                        "
                      >
                        <div className="mb-5 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e]">
                              <Layers3
                                size={17}
                              />
                            </div>

                            <div>
                              <p className="text-sm font-bold text-[#17342d]">
                                Custom Section{" "}
                                {index + 1}
                              </p>

                              <p className="text-[11px] text-gray-500">
                                {section.id}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeCustomSection(
                                index
                              )
                            }
                            className="
                              flex
                              h-9
                              w-9
                              items-center
                              justify-center
                              rounded-xl
                              border
                              border-red-200
                              bg-red-50
                              text-red-600
                              transition
                              hover:bg-red-100
                            "
                            title="Delete custom section"
                          >
                            <Trash2
                              size={15}
                            />
                          </button>
                        </div>

                        <div className="space-y-5">
                          <EnableRow
                            title="Show Section"
                            description="Disable it temporarily without deleting its content."
                            enabled={
                              section.enabled !==
                              false
                            }
                            onChange={(
                              value
                            ) =>
                              updateCustomSection(
                                index,
                                "enabled",
                                value
                              )
                            }
                          />

                          <div className="grid gap-5 md:grid-cols-2">
                            <Field
                              label="Eyebrow"
                              value={
                                section.eyebrow
                              }
                              onChange={(
                                value
                              ) =>
                                updateCustomSection(
                                  index,
                                  "eyebrow",
                                  value
                                )
                              }
                              placeholder="OUR LEGACY"
                            />

                            <Field
                              label="Title"
                              value={
                                section.title
                              }
                              onChange={(
                                value
                              ) =>
                                updateCustomSection(
                                  index,
                                  "title",
                                  value
                                )
                              }
                              placeholder="Building landmarks for generations"
                            />
                          </div>

                          <Field
                            label="Subtitle"
                            value={
                              section.subtitle
                            }
                            onChange={(
                              value
                            ) =>
                              updateCustomSection(
                                index,
                                "subtitle",
                                value
                              )
                            }
                            placeholder="Optional supporting statement"
                          />

                          <RichField
                            label="Content"
                            value={
                              section.content
                            }
                            onChange={(
                              value
                            ) =>
                              updateCustomSection(
                                index,
                                "content",
                                value
                              )
                            }
                          />

                          <ImageUpload
                            label="Section Image"
                            value={
                              section.image
                            }
                            onChange={(
                              value
                            ) =>
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

                          <div>
                            <label className="mb-2 block text-sm font-semibold text-gray-800">
                              Image Position
                            </label>

                            <select
                              value={
                                section.imagePosition ||
                                "right"
                              }
                              onChange={(
                                event
                              ) =>
                                updateCustomSection(
                                  index,
                                  "imagePosition",
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="
                                w-full
                                rounded-xl
                                border
                                border-gray-300
                                bg-white
                                px-4
                                py-2.5
                                text-sm
                                text-gray-800
                                outline-none
                                focus:border-[#0f3b2e]
                                focus:ring-2
                                focus:ring-[#0f3b2e]/10
                              "
                            >
                              <option value="left">
                                Image Left
                              </option>

                              <option value="right">
                                Image Right
                              </option>

                              <option value="top">
                                Image Top
                              </option>

                              <option value="bottom">
                                Image Bottom
                              </option>
                            </select>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </EditorSection>
        </div>


        {/* ====================================================
            BOTTOM SAVE BAR
        ==================================================== */}

        <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0f3b2e]/10 text-[#0f3b2e]">
              <Save size={16} />
            </div>

            <div>
              <p className="text-sm font-bold text-[#17342d]">
                Ready to publish your changes?
              </p>

              <p className="text-xs text-gray-500">
                Save the developer page after
                editing any section.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={saveDeveloper}
            disabled={saving}
            className="
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-[#0f3b2e]
              px-5
              py-2.5
              text-sm
              font-bold
              text-white
              transition
              hover:bg-[#17342d]
              disabled:cursor-not-allowed
              disabled:opacity-60
            "
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
      </main>
    </div>
  );
}