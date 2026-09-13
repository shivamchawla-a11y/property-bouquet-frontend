"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sparkles,
  FileText,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  WandSparkles,
} from "lucide-react";

const N8N_WEBHOOK_URL =
  "https://n8n.propertybouquet.com/webhook/ai-create-property";

export default function AICreatePropertyPage() {
  const router = useRouter();

  const [propertyText, setPropertyText] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleCreateDraft = async () => {
    setError("");
    setMessage("");

    const text = propertyText.trim();

    if (!text) {
      setError("Please paste the property information first.");
      return;
    }

    if (text.length < 30) {
      setError(
        "Please provide more property information so the AI can create a useful draft."
      );
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
          propertyText: text,
        }),
      });

      const rawText = await response.text();

      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(
          "The automation service returned an invalid response."
        );
      }

      /*
       * n8n may return either:
       *
       * [
       *   {
       *     success: true,
       *     draftId: "..."
       *   }
       * ]
       *
       * or directly:
       *
       * {
       *   success: true,
       *   draftId: "..."
       * }
       */

      const result = Array.isArray(data) ? data[0] : data;

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to create the property draft."
        );
      }

      const draftId =
        result?.draftId ||
        result?.data?._id ||
        result?.data?.id;

      if (!draftId) {
        throw new Error(
          "The property draft was created, but no draft ID was returned."
        );
      }

      setMessage(
        "Property draft created successfully. Opening the editor..."
      );

      /*
       * Give the success message a moment to appear,
       * then open the normal existing Edit Property page.
       */
      setTimeout(() => {
        router.push(`/admin/edit-property/${draftId}`);
      }, 900);
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

      {/* =========================================================
          TOP HEADER
      ========================================================= */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-4">

          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dfe7e2] bg-white text-[#17342d] shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            aria-label="Back to Property Inventory"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <Sparkles
                size={18}
                className="text-[#b58b45]"
              />

              <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#b58b45]">
                Intelligent Property Creation
              </p>
            </div>

            <h1 className="mt-1 font-serif text-3xl font-semibold tracking-tight text-[#10251f]">
              AI Create Property
            </h1>

            <p className="mt-1 text-sm text-[#6d7974]">
              Turn raw property information into a structured draft.
            </p>
          </div>

        </div>

        {/* AI STATUS */}
        <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#dfe7e2] bg-white px-4 py-2 shadow-sm">
          <span className="flex h-2 w-2 rounded-full bg-[#c9a64b]" />

          <span className="text-[10px] font-semibold uppercase tracking-[1.5px] text-[#53645e]">
            AI Draft Mode
          </span>
        </div>

      </div>


      {/* =========================================================
          MAIN CARD
      ========================================================= */}
      <div className="mx-auto max-w-[1100px]">

        <div className="overflow-hidden rounded-[30px] border border-[#dfe7e2] bg-white shadow-[0_20px_70px_rgba(15,59,46,0.08)]">

          {/* =====================================================
              HERO STRIP
          ===================================================== */}
          <div className="relative overflow-hidden bg-[#0f3b2e] px-6 py-8 sm:px-10">

            {/* Decorative glow */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-[#d4af37]/10 blur-3xl" />

            <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-[#d4af37]/5 blur-3xl" />

            <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

              <div className="max-w-[700px]">

                <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#d4af37]/25 bg-white/10 text-[#e0be69] backdrop-blur">
                  <WandSparkles size={21} />
                </div>

                <h2 className="font-serif text-2xl font-semibold text-white sm:text-3xl">
                  Create a property draft with AI
                </h2>

                <p className="mt-3 max-w-[650px] text-sm leading-6 text-white/65">
                  Paste the property information you have available.
                  The AI will extract factual information and create a
                  draft for your review. Missing information will remain
                  empty instead of being guessed.
                </p>

              </div>

              <div className="hidden shrink-0 lg:block">
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] border border-white/10 bg-white/5 backdrop-blur">
                  <Sparkles
                    size={38}
                    strokeWidth={1.4}
                    className="text-[#d4af37]"
                  />
                </div>
              </div>

            </div>

          </div>


          {/* =====================================================
              CONTENT
          ===================================================== */}
          <div className="p-6 sm:p-10">

            {/* INFORMATION LABEL */}
            <div className="mb-3 flex items-center justify-between gap-4">

              <div>
                <div className="flex items-center gap-2">
                  <FileText
                    size={17}
                    className="text-[#b58b45]"
                  />

                  <h3 className="text-base font-semibold text-[#17342d]">
                    Property Information
                  </h3>
                </div>

                <p className="mt-1 text-xs leading-5 text-[#7b8782]">
                  Paste brochure text, developer information, pricing,
                  configurations, location, amenities, possession,
                  RERA information, or any other available details.
                </p>
              </div>

              <div className="hidden rounded-full bg-[#f5f1e8] px-3 py-1.5 sm:block">
                <span className="text-[9px] font-semibold uppercase tracking-[1.5px] text-[#9b763d]">
                  Source Text
                </span>
              </div>

            </div>


            {/* ===================================================
                TEXTAREA
            =================================================== */}
            <div className="relative">

              <textarea
                value={propertyText}
                onChange={(e) => {
                  setPropertyText(e.target.value);
                  setError("");
                  setMessage("");
                }}
                disabled={loading}
                placeholder={`Paste property information here...

Example:

Godrej Vriksha is a residential project by Godrej Properties located in Sector 103, Gurgaon, along Dwarka Expressway. The project offers 3 and 4 BHK residences with premium amenities.

You can paste much longer information including:
• Project overview
• Developer information
• Price
• Unit configurations
• Sizes
• Possession
• RERA
• Amenities
• Location
• Connectivity
• Land area
• Towers
• Floors
• Other factual project information`}
                className="min-h-[420px] w-full resize-y rounded-[24px] border border-[#dbe4df] bg-[#fafcfb] px-5 py-5 text-[14px] leading-7 text-[#243630] outline-none transition placeholder:text-[#9ca9a4] focus:border-[#c9a64b] focus:bg-white focus:ring-4 focus:ring-[#c9a64b]/10 disabled:cursor-not-allowed disabled:opacity-70"
              />

              {/* CHARACTER COUNT */}
              <div className="pointer-events-none absolute bottom-4 right-4 rounded-full border border-[#e3e9e6] bg-white/90 px-3 py-1 shadow-sm backdrop-blur">
                <span className="text-[9px] font-medium tracking-[0.5px] text-[#87938e]">
                  {propertyText.length.toLocaleString()} characters
                </span>
              </div>

            </div>


            {/* ===================================================
                RULES / TRUST BAR
            =================================================== */}
            <div className="mt-5 grid gap-3 sm:grid-cols-3">

              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <div className="flex items-center gap-2">
                  <ShieldCheck
                    size={16}
                    className="text-[#b58b45]"
                  />

                  <span className="text-xs font-semibold text-[#17342d]">
                    Factual extraction
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] leading-5 text-[#78857f]">
                  AI uses information provided in your source text.
                </p>
              </div>


              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <div className="flex items-center gap-2">
                  <FileText
                    size={16}
                    className="text-[#b58b45]"
                  />

                  <span className="text-xs font-semibold text-[#17342d]">
                    Missing data stays empty
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] leading-5 text-[#78857f]">
                  No invented pricing, RERA, possession or measurements.
                </p>
              </div>


              <div className="rounded-2xl border border-[#e4ebe7] bg-[#f8faf9] px-4 py-4">
                <div className="flex items-center gap-2">
                  <Sparkles
                    size={16}
                    className="text-[#b58b45]"
                  />

                  <span className="text-xs font-semibold text-[#17342d]">
                    Draft first
                  </span>
                </div>

                <p className="mt-1.5 text-[11px] leading-5 text-[#78857f]">
                  You review everything before publishing.
                </p>
              </div>

            </div>


            {/* ===================================================
                ERROR
            =================================================== */}
            {error && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-4">

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


            {/* ===================================================
                SUCCESS
            =================================================== */}
            {message && (
              <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4">

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


            {/* ===================================================
                ACTIONS
            =================================================== */}
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
                type="button"
                onClick={handleCreateDraft}
                disabled={loading || !propertyText.trim()}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#c9a64b] to-[#e0be69] px-7 text-sm font-bold text-[#111b17] shadow-[0_10px_30px_rgba(201,166,75,0.22)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_35px_rgba(201,166,75,0.28)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={18}
                      className="animate-spin"
                    />

                    <span>
                      Creating Property Draft...
                    </span>
                  </>
                ) : (
                  <>
                    <Sparkles size={18} />

                    <span>
                      Create Property Draft
                    </span>
                  </>
                )}

              </button>

            </div>


            {/* ===================================================
                FOOTNOTE
            =================================================== */}
            <p className="mt-5 text-center text-[10px] leading-5 text-[#9aa59f]">
              AI-generated information is created as a draft only.
              Please review all extracted information before publishing.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}