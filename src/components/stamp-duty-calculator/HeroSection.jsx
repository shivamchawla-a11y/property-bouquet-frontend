"use client";

import Link from "next/link";
import {
  Calculator,
  CheckCircle2,
  Clock3,
  FileCheck2,
  ShieldCheck,
} from "lucide-react";

const features = [
  { icon: ShieldCheck, title: "State-wise Reference", text: "36 States & Union Territories" },
  { icon: Calculator, title: "Instant Estimate", text: "See charges as you enter details" },
  { icon: FileCheck2, title: "Cost Breakdown", text: "Duty, registration & add-ons" },
  { icon: Clock3, title: "Quick & Convenient", text: "Plan your property budget" },
];

export default function HeroSection({ stateName = null }) {
  return (
    <section className="relative min-h-[560px] overflow-hidden bg-[#03251d]" aria-labelledby="stamp-duty-calculator-heading">
      {/* Reuse the existing Area Converter hero visual from the project assets. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 scale-[1.02] bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/area-converter/hero-bg.png')" }}
      />
      <div aria-hidden="true" className="absolute inset-0 bg-[#03251d]/25" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#03251d]/95 via-[#03251d]/65 via-[55%] to-[#03251d]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-24 top-[-100px] h-[560px] w-[560px] rounded-full border border-[#d4af37]/15" />
      <div aria-hidden="true" className="pointer-events-none absolute -right-8 top-[-42px] h-[430px] w-[430px] rounded-full border border-[#d4af37]/10" />
      <div aria-hidden="true" className="pointer-events-none absolute right-[8%] top-[90px] h-[300px] w-[300px] rounded-full bg-[#d4af37]/[0.06] blur-[85px]" />
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_right,transparent,black)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/30 to-transparent" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-[#06251d] via-[#06251d]/35 to-transparent" />

      <div className="relative z-10 mx-auto max-w-[1450px] px-5 xl:px-8">
        <nav className="pt-24 md:pt-28" aria-label="Breadcrumb">
          <ol className="flex items-center gap-2 text-[11px] font-medium text-white/65">
            <li><Link href="/" className="transition-colors hover:text-[#d4af37]">Home</Link></li>
            <li aria-hidden="true" className="text-white/35">›</li>
            <li><Link href="/tools" className="transition-colors hover:text-[#d4af37]">Tools</Link></li>
            <li aria-hidden="true" className="text-white/35">›</li>
            <li><span aria-current="page" className="text-white">{stateName ? `Stamp Duty in ${stateName}` : "Stamp Duty Calculator"}</span></li>
          </ol>
        </nav>

        <div className="max-w-[790px] pb-[155px] pt-8 md:pb-[165px] md:pt-10">
          <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.30em] text-[#d4af37] md:text-[11px]">Property Bouquet Tools</p>
          <h1 id="stamp-duty-calculator-heading" className="font-serif text-[43px] font-normal leading-[1.02] tracking-[-0.025em] text-white md:text-[62px] lg:text-[68px]">
            Stamp Duty <span className="text-[#d8b46b]">Calculator</span>
          </h1>
          <h2 className="mt-3 font-serif text-[21px] font-normal leading-tight text-[#d8b46b] md:text-[29px]">
            {stateName
              ? `Estimate ${stateName} Property Registration Costs`
              : "Estimate Property Registration Costs Across India"}
          </h2>
          <p className="mt-5 max-w-[700px] text-[14px] leading-7 text-white/80 md:text-[16px] md:leading-8">
            {stateName
              ? `Estimate stamp duty, registration fees and applicable additional charges for a residential property transaction in ${stateName}. Enter the property details to understand the likely government-charge outlay for this jurisdiction.`
              : "Estimate stamp duty, registration fees and applicable additional charges for a residential property transaction. Select your State or Union Territory and enter the property details to understand the likely government-charge outlay."}
          </p>
          <div className="mt-8 flex flex-wrap gap-3 lg:hidden" aria-label="Calculator features">
            {features.map(({ icon: Icon, title }) => (
              <span key={title} className="inline-flex items-center gap-2 rounded-full border border-[#d4af37]/20 bg-[#07362a]/70 px-3 py-2 text-[10px] font-medium text-white/85">
                <Icon size={14} className="text-[#d4af37]" />{title}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute bottom-5 left-0 right-0 z-20 hidden px-5 lg:block" aria-label="Calculator features">
        <div className="mx-auto max-w-[1350px] overflow-hidden rounded-xl border border-[#d4af37]/15 bg-[#07362a]/90 px-6 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.30)] backdrop-blur-xl">
          <div className="grid grid-cols-4">
            {features.map(({ icon: Icon, title, text }) => (
              <div key={title} className="flex items-center gap-4 border-r border-white/10 px-6 last:border-r-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#d4af37]/20 bg-[#d4af37]/5 text-[#d4af37]"><Icon size={21} /></div>
                <div><p className="text-[12px] font-semibold text-white">{title}</p><p className="mt-1 text-[10px] text-white/55">{text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#d4af37]/30 to-transparent" />
    </section>
  );
}
