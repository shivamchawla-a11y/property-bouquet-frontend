import Link from "next/link";
import { ArrowRight, Building2, Landmark, MapPin } from "lucide-react";
import { getStateRateConfig, INDIAN_STATES, slugifyStateName } from "./stampDutyRates";

function StateCard({ state }) {
  const config = getStateRateConfig(state.code);
  const hasIndicativeRates = Boolean(config?.configured);
  const href = `/tools/stamp-duty-calculator/${slugifyStateName(state.name)}`;

  return (
    <Link
      href={href}
      className="group relative flex min-h-[154px] flex-col overflow-hidden rounded-[14px] border border-[#e5dfd4] bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#c89d58]/70 hover:shadow-[0_18px_45px_rgba(16,37,31,0.07)] focus:outline-none focus:ring-2 focus:ring-[#c89d58]/30"
    >
      <span className="absolute left-0 top-0 h-[2px] w-0 bg-[#c89d58] transition-all duration-300 group-hover:w-full" />
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e0d6c5] bg-[#faf7f1] text-[#173c31]">
          {state.type === "state" ? <MapPin size={18} strokeWidth={1.6} /> : <Building2 size={18} strokeWidth={1.6} />}
        </span>
        <span className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${hasIndicativeRates ? "border-[#dce8df] bg-[#f2f7f3] text-[#426b50]" : "border-[#eee4d2] bg-[#fbf7ef] text-[#987746]"}`}>
          {hasIndicativeRates ? "Indicative rates" : "Rate data pending"}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <p className="text-[13px] font-semibold leading-5 text-[#17382e] transition-colors group-hover:text-[#a47b37]">{state.name}</p>
          <p className="mt-1 text-[10px] uppercase tracking-[0.12em] text-[#999]">{state.type === "state" ? "State" : "Union Territory"}</p>
        </div>
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#ded5c5] text-[#17382f] transition-all duration-300 group-hover:border-[#c89d58] group-hover:bg-[#03261e] group-hover:text-white">
          <ArrowRight size={13} strokeWidth={1.8} />
        </span>
      </div>
    </Link>
  );
}

export default function StateDirectory() {
  const states = INDIAN_STATES.filter((item) => item.type === "state");
  const unionTerritories = INDIAN_STATES.filter((item) => item.type === "ut");

  return (
    <section id="stamp-duty-by-state" className="w-full bg-[#faf9f6]" aria-labelledby="state-directory-heading">
      <div className="mx-auto w-full max-w-[1450px] px-5 py-14 sm:px-6 md:py-16 lg:px-8 xl:px-10">
        <div className="max-w-[780px]">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#c89d58]" />
            <p className="text-[10px] font-semibold uppercase tracking-[2.5px] text-[#b58b45]">Explore by Location</p>
          </div>
          <h2 id="state-directory-heading" className="mt-3 font-serif text-[28px] font-normal leading-[1.15] tracking-[-0.3px] text-[#10251f] sm:text-[30px] md:text-[34px]">Stamp Duty Calculator by State</h2>
          <p className="mt-3 max-w-[720px] text-[12px] leading-6 text-[#777] sm:text-[13px]">Choose the state or Union Territory where the property is located. Each page opens a dedicated calculator with that jurisdiction pre-selected, so you can estimate the relevant registration costs without changing the state manually.</p>
        </div>

        <div className="mt-9">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17382e] text-[#d7b66a]"><Landmark size={17} strokeWidth={1.7} /></span>
            <div><h3 className="text-[16px] font-semibold text-[#17382e]">Indian States</h3><p className="mt-0.5 text-[10px] text-[#999]">28 state-specific calculator pages</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {states.map((state) => <StateCard key={state.code} state={state} />)}
          </div>
        </div>

        <div className="mt-11">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#17382e] text-[#d7b66a]"><Building2 size={17} strokeWidth={1.7} /></span>
            <div><h3 className="text-[16px] font-semibold text-[#17382e]">Union Territories</h3><p className="mt-0.5 text-[10px] text-[#999]">8 Union Territory calculator pages</p></div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {unionTerritories.map((state) => <StateCard key={state.code} state={state} />)}
          </div>
        </div>

        <div className="mt-8 rounded-[14px] border border-[#e5dfd2] bg-white px-5 py-4 md:px-6">
          <p className="text-[10px] leading-6 text-[#777]"><strong className="font-semibold text-[#17382e]">Rate information:</strong> A state page is available for every listed jurisdiction. Where a reviewed indicative rate configuration is not yet available, the calculator will show a rate-pending message rather than produce an unsupported estimate. Confirm final charges with the relevant registration authority before a transaction.</p>
        </div>
      </div>
    </section>
  );
}
