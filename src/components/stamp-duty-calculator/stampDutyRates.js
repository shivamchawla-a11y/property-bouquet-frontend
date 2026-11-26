/**
 * Property Bouquet — indicative stamp-duty data for standard residential sale deeds.
 *
 * IMPORTANT:
 * - Rates below are indicative reference values, not legal advice or a government quote.
 * - Rates can differ by district, municipal limits, agreement value, property category,
 *   document type, buyer eligibility and government notifications.
 * - `null` rates mean that a defensible rate set has not been added yet. The UI will
 *   block the calculation rather than invent a number.
 * - Review each source and the relevant State IGR / Revenue portal before publishing.
 */

const configured = (name, stampDuty, registration, options = {}) => ({
  name,
  configured: true,
  transaction: "Standard residential sale deed",
  stampDuty,
  registration,
  additionalCharges: options.additionalCharges || [],
  notes: options.notes || [],
  sourceLabel: options.sourceLabel || "2026 indicative state-wise reference",
  sourceUrl: options.sourceUrl || "https://www.toolbench.in/tools/stamp-duty-calculator/compare-all-states",
});

const notConfigured = (name) => ({
  name,
  configured: false,
  stampDuty: null,
  registration: null,
  additionalCharges: [],
  notes: ["A reviewed rate configuration is not available in this version. Please verify with the State/UT Registration Department."],
  sourceLabel: "Needs verification",
  sourceUrl: null,
});

export const INDIAN_STATES = [
  { code: "AP", name: "Andhra Pradesh", type: "state" },
  { code: "AR", name: "Arunachal Pradesh", type: "state" },
  { code: "AS", name: "Assam", type: "state" },
  { code: "BR", name: "Bihar", type: "state" },
  { code: "CT", name: "Chhattisgarh", type: "state" },
  { code: "GA", name: "Goa", type: "state" },
  { code: "GJ", name: "Gujarat", type: "state" },
  { code: "HR", name: "Haryana", type: "state" },
  { code: "HP", name: "Himachal Pradesh", type: "state" },
  { code: "JH", name: "Jharkhand", type: "state" },
  { code: "KA", name: "Karnataka", type: "state" },
  { code: "KL", name: "Kerala", type: "state" },
  { code: "MP", name: "Madhya Pradesh", type: "state" },
  { code: "MH", name: "Maharashtra", type: "state" },
  { code: "MN", name: "Manipur", type: "state" },
  { code: "ML", name: "Meghalaya", type: "state" },
  { code: "MZ", name: "Mizoram", type: "state" },
  { code: "NL", name: "Nagaland", type: "state" },
  { code: "OD", name: "Odisha", type: "state" },
  { code: "PB", name: "Punjab", type: "state" },
  { code: "RJ", name: "Rajasthan", type: "state" },
  { code: "SK", name: "Sikkim", type: "state" },
  { code: "TN", name: "Tamil Nadu", type: "state" },
  { code: "TS", name: "Telangana", type: "state" },
  { code: "TR", name: "Tripura", type: "state" },
  { code: "UP", name: "Uttar Pradesh", type: "state" },
  { code: "UK", name: "Uttarakhand", type: "state" },
  { code: "WB", name: "West Bengal", type: "state" },
  { code: "AN", name: "Andaman and Nicobar Islands", type: "ut" },
  { code: "CH", name: "Chandigarh", type: "ut" },
  { code: "DN", name: "Dadra and Nagar Haveli and Daman and Diu", type: "ut" },
  { code: "DL", name: "Delhi", type: "ut" },
  { code: "JK", name: "Jammu and Kashmir", type: "ut" },
  { code: "LA", name: "Ladakh", type: "ut" },
  { code: "LD", name: "Lakshadweep", type: "ut" },
  { code: "PY", name: "Puducherry", type: "ut" },
];

// Joint rates are represented explicitly where a reference publishes one.
// Where a source does not publish a joint rate, the general rate is used and flagged in notes.
export const STAMP_DUTY_RATES = {
  AP: configured("Andhra Pradesh", { male: 5, female: 5, joint: 5 }, { rate: 1 }, {
    additionalCharges: [{ label: "Transfer duty", type: "percentage", rate: 1.5, basis: "propertyValue" }],
    notes: ["A 1.5% transfer-duty estimate is included. Confirm local levies and document-specific treatment."],
    sourceUrl: "https://www.toolbench.in/tools/stamp-duty-calculator/compare-all-states",
  }),
  AS: configured("Assam", { male: 5, female: 5, joint: 5 }, { rate: 1 }, {
    notes: ["Gender-neutral indicative rate. Confirm applicable local surcharge and registration fee."],
  }),
  BR: configured("Bihar", { male: 6, female: 5.7, joint: 5.85 }, { rate: 2 }, {
    notes: ["Indicative 2026 rates; deed and buyer category can affect the final duty."],
  }),
  CT: configured("Chhattisgarh", { male: 5, female: 4, joint: 4.5 }, { rate: 4 }, {}),
  DL: configured("Delhi", { male: 6, female: 4, joint: 5 }, { rate: 1, fixed: 100 }, {
    notes: ["Official Delhi guidance states 6% for a male buyer and 4% for a female buyer; registration is 1% plus ₹100 pasting charge. The joint rate shown is an indicative 5% reference."],
    sourceLabel: "Government of NCT of Delhi + 2026 reference",
    sourceUrl: "https://revenue.delhi.gov.in/revenue/property-registration",
  }),
  GA: configured("Goa", { male: 4, female: 4, joint: 4 }, { rate: 1 }, {}),
  GJ: configured("Gujarat", { male: 4.9, female: 3.9, joint: 4.9 }, { rate: 1, femaleSoleWaiver: true }, {
    notes: ["The registration-fee waiver for a sole female buyer is subject to eligibility and current state rules."],
  }),
  HR: configured("Haryana", {
    urban: { male: 7, female: 5, joint: 6 },
    rural: { male: 5, female: 3, joint: 4 },
  }, { rate: 1 }, {
    notes: ["Urban/rural rates shown are indicative. Haryana rates can vary by municipal area, property category and local notification."],
    sourceUrl: "https://www.toolbench.in/tools/stamp-duty-calculator/compare-all-states",
  }),
  HP: configured("Himachal Pradesh", { male: 6, female: 4, joint: 5 }, { rate: 2 }, {}),
  JH: configured("Jharkhand", { male: 4, female: 4, joint: 4 }, { rate: 3 }, {}),
  JK: configured("Jammu and Kashmir", { male: 7, female: 3, joint: 5 }, { rate: 1 }, {
    notes: ["Indicative reference only; verify the current UT notification and local fee schedule."],
  }),
  KA: configured("Karnataka", { male: 5, female: 5, joint: 5 }, { rate: 2 }, {
    additionalCharges: [{ label: "Indicative cess and surcharge", type: "percentage", rate: 0.6, basis: "propertyValue" }],
    notes: ["The 0.6% add-on is a simplified reference. Bengaluru/BBMP and other local levies can differ; value slabs and local calculations should be checked on Kaveri."],
    sourceUrl: "https://www.toolbench.in/tools/stamp-duty-calculator/compare-all-states",
  }),
  KL: configured("Kerala", { male: 8, female: 8, joint: 8 }, { rate: 2 }, {}),
  MP: configured("Madhya Pradesh", { male: 7.5, female: 7.5, joint: 7.5 }, { rate: 3 }, {
    notes: ["No gender concession is assumed in this estimate; verify the latest SAMPADA schedule."],
  }),
  MH: configured("Maharashtra", { male: 6, female: 5, joint: 6 }, { rate: 1, max: 30000 }, {
    notes: ["Base rate shown is a broad estimate; Mumbai, Pune, Nagpur, municipal limits and local body/metro cess can change the effective rate. ₹30,000 registration cap is indicative and may not apply in every urban area."],
  }),
  OD: configured("Odisha", { male: 5, female: 4, joint: 4.5 }, { rate: 2 }, {}),
  PB: configured("Punjab", { male: 7, female: 5, joint: 6 }, { rate: 1 }, {}),
  RJ: configured("Rajasthan", { male: 6, female: 5, joint: 6 }, { rate: 1 }, {
    additionalCharges: [{ label: "Labour cess (20% of stamp duty)", type: "percentage", rate: 20, basis: "stampDuty" }],
    notes: ["Labour cess is modelled as 20% of the calculated stamp duty; confirm exemptions and buyer-specific concessions."],
  }),
  TN: configured("Tamil Nadu", { male: 7, female: 7, joint: 7 }, { rate: 4 }, {
    notes: ["Some published consumer guides report different registration-fee figures. This estimate uses the 4% rate in the 2026 state comparison reference; verify TNREGINET before relying on it."],
  }),
  TS: configured("Telangana", { male: 4, female: 4, joint: 4 }, { rate: 0.5 }, {
    additionalCharges: [{ label: "Transfer duty", type: "percentage", rate: 1.5, basis: "propertyValue" }],
    notes: ["Indicative urban sale-deed estimate. Rural/local-area treatment can differ."],
  }),
  UP: configured("Uttar Pradesh", { male: 7, female: 6, joint: 6.5 }, { rate: 1 }, {
    additionalCharges: [{ label: "Nagar Nigam surcharge (optional)", type: "percentage", rate: 2, basis: "propertyValue", optionalKey: "includeMunicipalSurcharge" }],
    notes: ["A 2% additional surcharge is modelled only when the user selects a Nagar Nigam area. The female rebate is subject to eligibility and the notified value limit."],
    sourceUrl: "https://www.toolbench.in/tools/stamp-duty-calculator/compare-all-states",
  }),
  UK: configured("Uttarakhand", { male: 5, female: 3.75, joint: 4.375 }, { rate: 1 }, {}),
  WB: configured("West Bengal", {
    urban: { male: 6, female: 6, joint: 6 },
    rural: { male: 5, female: 5, joint: 5 },
  }, { rate: 1 }, {
    notes: ["Urban/rural duty is shown as a broad estimate. Additional value-based stamp duty thresholds and local conditions are not modelled."],
  }),
};

export function getStateRateConfig(stateCode) {
  if (STAMP_DUTY_RATES[stateCode]) return STAMP_DUTY_RATES[stateCode];
  const selectedState = INDIAN_STATES.find((state) => state.code === stateCode);
  return selectedState ? notConfigured(selectedState.name) : null;
}

export const RATE_DATA_LAST_REVIEWED = "26 November 2026";


/** Convert a State / UT name into a stable URL slug. */
export function slugifyStateName(name) {
  return String(name || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Find a State / UT using its URL slug. */
export function getStateBySlug(slug) {
  if (!slug) return null;
  return INDIAN_STATES.find(
    (state) => slugifyStateName(state.name) === String(slug).toLowerCase()
  ) || null;
}
