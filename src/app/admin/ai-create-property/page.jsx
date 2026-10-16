"use client";

import { useState } from "react";
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
} from "lucide-react";

const N8N_WEBHOOK_URL =
  "https://n8n.propertybouquet.com/webhook/ai-create-property";

export default function AICreatePropertyPage() {
  const router = useRouter();

  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

      const response = await fetch(N8N_WEBHOOK_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
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
                Enter the official project name. No brochure text or lengthy
                property description is required.
              </p>
            </div>

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
                }}
                disabled={loading}
                maxLength={180}
                autoComplete="off"
                placeholder="e.g. Spiti Homes"
                aria-label="Property or project name"
                className="h-14 w-full rounded-2xl border border-[#dbe4df] bg-[#fafcfb] pl-12 pr-4 text-sm text-[#243630] outline-none transition placeholder:text-[#9ca9a4] focus:border-[#c9a64b] focus:bg-white focus:ring-4 focus:ring-[#c9a64b]/10 disabled:cursor-not-allowed disabled:opacity-70"
              />
            </div>

            <p className="mt-2 text-right text-[10px] text-[#9aa59f]">
              {projectName.length}/180 characters
            </p>

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
                disabled={loading || !projectName.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-7 text-sm font-bold text-[#111b17] shadow-[0_10px_30px_rgba(201,166,75,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(201,166,75,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Researching & Creating Draft...</span>
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
