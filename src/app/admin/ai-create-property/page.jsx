"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  WandSparkles,
  Search,
  Building2,
  MapPin,
  AlertTriangle,
  XCircle,
} from "lucide-react";

const N8N_WEBHOOK_URL =
  "https://n8n.propertybouquet.com/webhook/ai-create-property";

const DUPLICATE_CHECK_URL = "/api/properties/check-duplicate";

// Create a preview slug from the project name so the same duplicate-check
// endpoint used by the main Add Property page can be queried while typing.
const createSlugFromName = (value = "") => {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const getPropertyTitle = (property) => {
  return (
    property?.coreDetails?.title ||
    property?.title ||
    property?.projectName ||
    property?.name ||
    "Existing property"
  );
};

const getPropertySlug = (property) => {
  return property?.slug || property?.propertySlug || "";
};

const getPropertyStatus = (property) => {
  const status = String(property?.status || "draft").toLowerCase();
  return status === "published" ? "Published" : "Draft";
};

const getPropertyKey = (property) => {
  return (
    property?._id ||
    property?.id ||
    `${getPropertyTitle(property)}-${getPropertySlug(property)}`
  );
};

const isSameProjectName = (first, second) => {
  const firstSlug = createSlugFromName(first);
  const secondSlug = createSlugFromName(second);
  return Boolean(firstSlug && secondSlug && firstSlug === secondSlug);
};

// This deliberately follows the response fields consumed by the main
// Add Property page: slugExists, slugProperty, similarSlugs, similarTitles.
const requestDuplicateCheck = async (projectName, token) => {
  const slug = createSlugFromName(projectName);
  const params = new URLSearchParams();

  if (slug.length >= 2) params.set("slug", slug);
  if (projectName.trim().length >= 2) {
    params.set("title", projectName.trim());
  }

  const response = await fetch(
    `${DUPLICATE_CHECK_URL}?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );

  const rawText = await response.text();
  let responseData = {};

  try {
    responseData = rawText ? JSON.parse(rawText) : {};
  } catch {
    throw new Error("The duplicate-check service returned an invalid response.");
  }

  if (!response.ok) {
    throw new Error(
      responseData?.message || "Unable to check existing properties. Please try again."
    );
  }

  // The existing Add Property page reads these fields from the top-level
  // response. The nested fallback also supports an API wrapper if one is added.
  const data =
    responseData?.similarTitles ||
    responseData?.similarSlugs ||
    responseData?.slugExists !== undefined
      ? responseData
      : responseData?.data || responseData;

  const similarSlugs = Array.isArray(data?.similarSlugs)
    ? data.similarSlugs
    : [];
  const similarTitles = Array.isArray(data?.similarTitles)
    ? data.similarTitles
    : [];
  const slugExists = Boolean(data?.slugExists);
  const slugProperty = data?.slugProperty || null;

  const exactTitleProperty = similarTitles.find((property) =>
    isSameProjectName(getPropertyTitle(property), projectName)
  ) || null;

  const exactSlugProperty = similarSlugs.find((property) =>
    isSameProjectName(getPropertySlug(property), slug)
  ) || null;

  const exactMatchProperty =
    slugProperty || exactTitleProperty || exactSlugProperty || null;

  return {
    checkedSlug: slug,
    slugExists,
    slugProperty,
    similarSlugs: similarSlugs.filter(
      (property) => !isSameProjectName(getPropertySlug(property), slug)
    ),
    similarTitles: similarTitles.filter(
      (property) => !isSameProjectName(getPropertyTitle(property), projectName)
    ),
    exactMatchProperty,
    exactDuplicate: slugExists || Boolean(exactTitleProperty || exactSlugProperty),
  };
};

const emptyDuplicateCheck = {
  status: "idle",
  checkedSlug: "",
  slugExists: false,
  slugProperty: null,
  similarSlugs: [],
  similarTitles: [],
  exactMatchProperty: null,
  exactDuplicate: false,
  error: "",
};

export default function AICreatePropertyPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [duplicateCheck, setDuplicateCheck] = useState(emptyDuplicateCheck);
  const [showDuplicateSuggestions, setShowDuplicateSuggestions] = useState(false);
  const duplicateRequestIdRef = useRef(0);

  // Live duplicate lookup while the user types. This uses the same API and
  // response contract as the duplicate checker on the main Add Property page.
  useEffect(() => {
    const name = projectName.trim();
    const requestId = ++duplicateRequestIdRef.current;

    if (name.length < 2) {
      setDuplicateCheck(emptyDuplicateCheck);
      return undefined;
    }

    const checkedSlug = createSlugFromName(name);

    setDuplicateCheck({
      ...emptyDuplicateCheck,
      status: "waiting",
      checkedSlug,
    });

    const timer = setTimeout(async () => {
      if (requestId !== duplicateRequestIdRef.current) return;

      setDuplicateCheck((current) => ({
        ...current,
        status: "checking",
        error: "",
      }));

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          throw new Error("Your session has expired. Please log in again.");
        }

        const result = await requestDuplicateCheck(name, token);

        if (requestId !== duplicateRequestIdRef.current) return;

        setDuplicateCheck({
          ...result,
          status: "done",
          error: "",
        });
      } catch (err) {
        if (requestId !== duplicateRequestIdRef.current) return;

        console.error("PROPERTY DUPLICATE CHECK ERROR:", err);
        setDuplicateCheck({
          ...emptyDuplicateCheck,
          status: "error",
          checkedSlug,
          error:
            err?.message ||
            "Could not verify existing properties. Please try again.",
        });
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [projectName]);

  const handleCreateDraft = async (event) => {
    event?.preventDefault();

    setError("");
    setMessage("");

    const name = projectName.trim();

    if (!name) {
      setError("Please enter a property or project name.");
      return;
    }

    if (name.length < 2) {
      setError("Please enter a valid project name.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================================
      // GET CURRENT LOGGED-IN USER TOKEN
      // ==========================================================
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Your session has expired. Please log in again.");
        router.push("/login");
        return;
      }

      // ==========================================================
      // FINAL DUPLICATE RE-CHECK BEFORE CREATING THE DRAFT
      // This avoids relying only on a possibly stale dropdown result.
      // ==========================================================
      // Invalidate any live-typing request so an older response cannot
      // overwrite the fresh result from this final pre-submit check.
      duplicateRequestIdRef.current += 1;

      setDuplicateCheck((current) => ({
        ...current,
        status: "checking",
        error: "",
      }));
      setShowDuplicateSuggestions(true);

      let latestDuplicateResult;

      try {
        latestDuplicateResult = await requestDuplicateCheck(name, token);
      } catch (duplicateError) {
        setDuplicateCheck({
          ...emptyDuplicateCheck,
          status: "error",
          checkedSlug: createSlugFromName(name),
          error:
            duplicateError?.message ||
            "Could not verify existing properties. Please try again.",
        });

        setError(
          "We couldn't verify whether this property already exists. Draft creation has been paused to avoid adding a duplicate. Please try again."
        );
        return;
      }

      setDuplicateCheck({
        ...latestDuplicateResult,
        status: "done",
        error: "",
      });

      if (latestDuplicateResult.exactDuplicate) {
        setShowDuplicateSuggestions(true);
        setError(
          "This property name or its generated slug already exists. Please review the matching property before creating another draft."
        );
        return;
      }

      // ==========================================================
      // SEND REQUEST TO N8N WITH CURRENT USER AUTHENTICATION
      // Existing AI draft creation flow remains unchanged.
      // ==========================================================
      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectName: name,
          sourceText: name,
          propertyText: name,
        }),
      });

      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The automation service returned an invalid response. Please check the n8n workflow."
        );
      }

      // Supports either a direct response or an array response from n8n.
      const result = Array.isArray(data) ? data[0] : data;

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            `Unable to create the draft (HTTP ${response.status}).`
        );
      }

      const draftId =
        result?.draftId ||
        result?.data?._id ||
        result?.data?.id;

      if (!draftId) {
        throw new Error(
          "The workflow returned success but did not provide a draft ID. Check the n8n response."
        );
      }

      setMessage(
        "Research completed and the property draft was created. Opening the editor..."
      );

      router.push(`/admin/edit-property/${draftId}`);
    } catch (err) {
      console.error("AI PROPERTY CREATION ERROR:", err);

      setError(
        err?.message ||
          "Something went wrong while creating the property draft."
      );
    } finally {
      setLoading(false);
    }
  };

  const hasSimilarSuggestions =
    duplicateCheck.similarTitles.length > 0 ||
    duplicateCheck.similarSlugs.length > 0;

  const exactMatchProperty = duplicateCheck.exactMatchProperty;

  const renderPropertySuggestion = (property, index, type) => {
    const title = getPropertyTitle(property);
    const slug = getPropertySlug(property);
    const status = getPropertyStatus(property);

    return (
      <div
        key={`${type}-${getPropertyKey(property)}-${index}`}
        className="flex items-start justify-between gap-3 border-t border-[#e9eeeb] px-4 py-3 first:border-t-0"
      >
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#17342d]">
            {title}
          </p>
          {slug ? (
            <p className="mt-1 truncate text-xs text-[#9b7837]">/{slug}</p>
          ) : null}
          <p className="mt-1 text-[10px] uppercase tracking-wide text-[#89958f]">
            {type === "slug" ? "Similar slug" : "Similar project name"}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide ${
            status === "Published"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-amber-200 bg-amber-50 text-amber-700"
          }`}
        >
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="min-h-full pb-10">
      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            disabled={loading}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe7e2] bg-white text-[#17342d] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:opacity-50"
            aria-label="Back to Property Inventory"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-[#b58b45]" />
              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#b58b45]">
                Intelligent Property Creation
              </p>
            </div>

            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#10251f]">
              AI Create Property
            </h1>

            <p className="mt-1 text-sm text-[#6d7974]">
              Enter a project name. Let AI handle the research.
            </p>
          </div>
        </div>

        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfe7e2] bg-white px-4 py-2 shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#c9a64b]" />
          <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#53645e]">
            AI Draft Mode
          </span>
        </div>
      </div>

      {/* MAIN CARD */}
      <div className="mx-auto max-w-[1000px]">
        <div className="overflow-hidden rounded-[30px] border border-[#dfe7e2] bg-white shadow-[0_20px_70px_rgba(15,59,46,0.08)]">
          {/* HERO */}
          <div className="relative overflow-hidden bg-[#0f3b2e] px-6 py-8 sm:px-10 sm:py-9">
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#d4af37]/5 blur-3xl" />

            <div className="relative flex items-center gap-5">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#d4af37]/25 bg-white/10 text-[#e0be69] backdrop-blur">
                <WandSparkles size={27} />
              </div>

              <div>
                <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                  From project name to property draft
                </h2>

                <p className="mt-2 max-w-[650px] text-sm leading-6 text-white/65">
                  AI researches the project, organizes the available facts,
                  and prepares a complete listing for your review.
                </p>
              </div>
            </div>
          </div>

          {/* FORM */}
          <form onSubmit={handleCreateDraft} className="p-6 sm:p-10">
            <div className="mb-6">
              <div className="flex items-center gap-2">
                <Search size={17} className="text-[#b58b45]" />
                <h3 className="text-base font-semibold text-[#17342d]">
                  Property or Project Name
                </h3>
              </div>

              <p className="mt-1 text-xs leading-5 text-[#7b8782]">
                Enter the official project name. We will check existing property
                names and slugs across your inventory as you type.
              </p>
            </div>

            <div className="relative z-20">
              <div className="relative">
                <Building2
                  size={19}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa69f]"
                />

                <input
                  type="text"
                  value={projectName}
                  onChange={(event) => {
                    setProjectName(event.target.value);
                    setError("");
                    setMessage("");
                    setShowDuplicateSuggestions(true);
                  }}
                  onFocus={() => setShowDuplicateSuggestions(true)}
                  onBlur={() => {
                    // Small delay allows the user to finish interacting with
                    // the dropdown before it closes.
                    setTimeout(() => setShowDuplicateSuggestions(false), 140);
                  }}
                  disabled={loading}
                  maxLength={180}
                  autoComplete="off"
                  placeholder="e.g. Spiti Homes"
                  aria-label="Property or project name"
                  aria-autocomplete="list"
                  aria-expanded={
                    showDuplicateSuggestions && projectName.trim().length >= 2
                  }
                  aria-controls="property-duplicate-suggestions"
                  className={`h-14 w-full rounded-2xl border bg-[#fafcfb] pl-12 pr-12 text-sm text-[#243630] outline-none transition placeholder:text-[#9ca9a4] focus:bg-white focus:ring-4 disabled:cursor-not-allowed disabled:opacity-70 ${
                    duplicateCheck.status === "done" && duplicateCheck.exactDuplicate
                      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
                      : "border-[#dbe4df] focus:border-[#c9a64b] focus:ring-[#c9a64b]/10"
                  }`}
                />

                {(duplicateCheck.status === "waiting" ||
                  duplicateCheck.status === "checking") &&
                  projectName.trim().length >= 2 && (
                    <Loader2
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 animate-spin text-[#b58b45]"
                    />
                  )}

                {duplicateCheck.status === "done" &&
                  !duplicateCheck.exactDuplicate &&
                  projectName.trim().length >= 2 && (
                    <CheckCircle2
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600"
                    />
                  )}

                {duplicateCheck.status === "done" &&
                  duplicateCheck.exactDuplicate && (
                    <AlertTriangle
                      size={18}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500"
                    />
                  )}
              </div>

              {/* LIVE DUPLICATE SUGGESTIONS DROPDOWN */}
              {showDuplicateSuggestions && projectName.trim().length >= 2 && (
                <div
                  id="property-duplicate-suggestions"
                  role="listbox"
                  aria-live="polite"
                  className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[390px] overflow-y-auto rounded-2xl border border-[#dfe7e2] bg-white shadow-[0_18px_55px_rgba(15,59,46,0.18)]"
                >
                  {(duplicateCheck.status === "waiting" ||
                    duplicateCheck.status === "checking") && (
                    <div className="flex items-center gap-3 px-4 py-4">
                      <Loader2 size={17} className="animate-spin text-[#b58b45]" />
                      <div>
                        <p className="text-sm font-semibold text-[#17342d]">
                          Checking your property inventory...
                        </p>
                        <p className="mt-1 text-xs text-[#87938d]">
                          Looking for existing project names and matching slugs.
                        </p>
                      </div>
                    </div>
                  )}

                  {duplicateCheck.status === "error" && (
                    <div className="flex items-start gap-3 bg-red-50 px-4 py-4">
                      <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-600" />
                      <div>
                        <p className="text-sm font-semibold text-red-800">
                          Could not check existing properties
                        </p>
                        <p className="mt-1 text-xs leading-5 text-red-700">
                          {duplicateCheck.error}
                        </p>
                      </div>
                    </div>
                  )}

                  {duplicateCheck.status === "done" &&
                    duplicateCheck.exactDuplicate && (
                      <div className="border-b border-red-200 bg-red-50 px-4 py-4">
                        <div className="flex items-start gap-3">
                          <XCircle size={19} className="mt-0.5 shrink-0 text-red-600" />
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-red-800">
                              Exact project match found
                            </p>
                            <p className="mt-1 text-xs leading-5 text-red-700">
                              This project name or its generated slug is already
                              present in your property inventory. Review the
                              existing record before creating another draft.
                            </p>
                          </div>
                        </div>

                        {exactMatchProperty && (
                          <div className="mt-3 rounded-xl border border-red-200 bg-white px-3 py-3">
                            <p className="truncate text-sm font-semibold text-[#17342d]">
                              {getPropertyTitle(exactMatchProperty)}
                            </p>
                            {getPropertySlug(exactMatchProperty) && (
                              <p className="mt-1 truncate text-xs text-[#9b7837]">
                                /{getPropertySlug(exactMatchProperty)}
                              </p>
                            )}
                            <span className="mt-2 inline-flex rounded-full border border-red-100 bg-red-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-red-700">
                              {getPropertyStatus(exactMatchProperty)} property
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                  {duplicateCheck.status === "done" && hasSimilarSuggestions && (
                    <div>
                      <div className="border-b border-amber-100 bg-amber-50 px-4 py-3">
                        <div className="flex items-center gap-2">
                          <AlertTriangle size={16} className="text-amber-700" />
                          <p className="text-xs font-bold uppercase tracking-wide text-amber-800">
                            Similar properties found — please review
                          </p>
                        </div>
                        <p className="mt-1 text-[11px] leading-5 text-amber-800/80">
                          These are potential matches. They do not automatically
                          block draft creation unless an exact match is found.
                        </p>
                      </div>

                      {duplicateCheck.similarTitles.map((property, index) =>
                        renderPropertySuggestion(property, index, "title")
                      )}

                      {duplicateCheck.similarSlugs.map((property, index) =>
                        renderPropertySuggestion(property, index, "slug")
                      )}
                    </div>
                  )}

                  {duplicateCheck.status === "done" &&
                    !duplicateCheck.exactDuplicate &&
                    !hasSimilarSuggestions && (
                      <div className="flex items-start gap-3 px-4 py-4">
                        <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-emerald-600" />
                        <div>
                          <p className="text-sm font-semibold text-[#17342d]">
                            No matching property found
                          </p>
                          <p className="mt-1 text-xs text-[#87938d]">
                            No exact or similar project name/slug was returned
                            by the property inventory check.
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="border-t border-[#edf1ee] bg-[#fafcfb] px-4 py-2.5">
                    <p className="text-[10px] text-[#89958f]">
                      Slug being checked: <span className="font-semibold text-[#9b7837]">/{createSlugFromName(projectName)}</span>
                    </p>
                  </div>
                </div>
              )}
            </div>

            <p className="mt-2 text-right text-[10px] text-[#9aa59f]">
              {projectName.length}/180 characters
            </p>

            {/* DUPLICATE CHECK STATUS WHEN DROPDOWN IS CLOSED */}
            {!showDuplicateSuggestions &&
              duplicateCheck.status === "done" &&
              duplicateCheck.exactDuplicate && (
                <p className="mt-2 flex items-center gap-2 text-xs font-medium text-red-600">
                  <AlertTriangle size={14} />
                  An exact project match exists. Review it before proceeding.
                </p>
              )}

            {/* HOW IT WORKS */}
            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <Search size={17} className="text-[#b58b45]" />
                <p className="mt-2 text-xs font-semibold text-[#17342d]">
                  Research
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#78857f]">
                  Find project information and available sources.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <MapPin size={17} className="text-[#b58b45]" />
                <p className="mt-2 text-xs font-semibold text-[#17342d]">
                  Structure
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#78857f]">
                  Organize developer, location, pricing and project details.
                </p>
              </div>

              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <ShieldCheck size={17} className="text-[#b58b45]" />
                <p className="mt-2 text-xs font-semibold text-[#17342d]">
                  Review
                </p>
                <p className="mt-1 text-[11px] leading-5 text-[#78857f]">
                  Save as a draft and verify before publishing.
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div
                role="alert"
                className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4"
              >
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-600"
                />

                <div>
                  <p className="text-xs font-semibold text-red-800">
                    Unable to create draft
                  </p>
                  <p className="mt-1 text-xs leading-5 text-red-700">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {message && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4"
              >
                <CheckCircle2
                  size={18}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />

                <div>
                  <p className="text-xs font-semibold text-emerald-800">
                    Draft created
                  </p>
                  <p className="mt-1 text-xs leading-5 text-emerald-700">
                    {message}
                  </p>
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="mt-7 flex flex-col-reverse gap-3 border-t border-[#e7ece9] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={() => router.push("/admin/properties")}
                disabled={loading}
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-[#dbe4df] bg-white px-6 text-sm font-semibold text-[#42534d] transition hover:bg-[#f7f9f8] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={
                  loading ||
                  !projectName.trim() ||
                  (duplicateCheck.status === "done" && duplicateCheck.exactDuplicate)
                }
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-7 text-sm font-bold text-[#111b17] shadow-[0_10px_30px_rgba(201,166,75,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(201,166,75,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Checking & Creating Draft...</span>
                  </>
                ) : duplicateCheck.status === "done" && duplicateCheck.exactDuplicate ? (
                  <>
                    <AlertTriangle size={18} />
                    <span>Duplicate Property Found</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />
                    <span>Create Property Draft</span>
                  </>
                )}
              </button>
            </div>

            <p className="mt-5 text-center text-[10px] leading-5 text-[#9aa59f]">
              AI-generated content is saved as a draft. Verify developer and
              location matching, pricing, RERA, possession and other factual
              details before publishing.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
