/**
 * Property Bouquet — Stamp Duty Calculator utilities.
 * Calculation model: standard residential sale deed estimate.
 */

export function parseAmount(value) {
  if (value === null || value === undefined || String(value).trim() === "") return 0;
  const amount = Number(String(value).replace(/,/g, "").trim());
  return Number.isFinite(amount) && amount >= 0 ? amount : 0;
}

export function formatINR(amount, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits,
  }).format(Number(amount) || 0);
}

export function formatIndianNumber(amount, maximumFractionDigits = 0) {
  return new Intl.NumberFormat("en-IN", { maximumFractionDigits }).format(Number(amount) || 0);
}

function getRateForBuyer(stampDutyConfig, ownership, area) {
  if (!stampDutyConfig) return null;
  const areaConfig = stampDutyConfig[area];
  const candidate = areaConfig && typeof areaConfig === "object"
    ? areaConfig[ownership]
    : stampDutyConfig[ownership];
  if (Number.isFinite(Number(candidate))) return Number(candidate);
  return null;
}

function clampCharge(amount, config) {
  let result = Number(amount) || 0;
  if (config.min !== undefined && config.min !== null && Number.isFinite(Number(config.min))) {
    result = Math.max(result, Number(config.min));
  }
  if (config.max !== undefined && config.max !== null && Number.isFinite(Number(config.max))) {
    result = Math.min(result, Number(config.max));
  }
  return Math.max(0, Math.round(result));
}

function calculateRegistration(config, baseValue, ownership) {
  if (!config) return 0;
  if (config.femaleSoleWaiver && ownership === "female") return 0;
  const rate = Number(config.rate) || 0;
  const variableFee = baseValue * (rate / 100);
  return clampCharge(variableFee, config) + (Number(config.fixed) || 0);
}

function calculateAdditionalCharge(charge, baseValue, stampDuty) {
  const basisAmount = charge.basis === "stampDuty" ? stampDuty : baseValue;
  if (charge.type === "fixed") return clampCharge(Number(charge.amount) || 0, charge);
  if (charge.type !== "percentage") return 0;
  return clampCharge(basisAmount * ((Number(charge.rate) || 0) / 100), charge);
}

/**
 * Sale-deed estimate. Uses the higher of agreement value and circle/guidance value
 * as the calculation base. Total property outlay uses agreement value + charges.
 */
export function calculateStampDuty({
  agreementValue,
  circleRateValue = "",
  stateCode,
  rateConfig,
  ownership = "male",
  area = "urban",
  includeMunicipalSurcharge = false,
}) {
  const agreement = parseAmount(agreementValue);
  const guidance = parseAmount(circleRateValue);
  const baseValue = Math.max(agreement, guidance);

  const emptyResult = {
    isValid: false,
    reason: "missing-rate-or-value",
    stateCode,
    agreementValue: agreement,
    circleRateValue: guidance,
    calculationBase: baseValue,
    usedCircleRate: guidance > agreement,
    stampDuty: 0,
    registrationFee: 0,
    additionalBreakdown: [],
    additionalCharges: 0,
    totalGovernmentCharges: 0,
    totalPropertyCost: agreement,
    effectiveChargeRate: 0,
  };

  if (!agreement || !rateConfig?.configured) return emptyResult;

  const stampDutyRate = getRateForBuyer(rateConfig.stampDuty, ownership, area);
  if (!Number.isFinite(stampDutyRate)) {
    return { ...emptyResult, reason: "missing-rate" };
  }

  const stampDuty = Math.round(baseValue * (stampDutyRate / 100));
  const registrationFee = calculateRegistration(rateConfig.registration, baseValue, ownership);

  const additionalBreakdown = (rateConfig.additionalCharges || [])
    .filter((charge) => {
      if (!charge.optionalKey) return true;
      return charge.optionalKey === "includeMunicipalSurcharge" && includeMunicipalSurcharge;
    })
    .map((charge) => ({
      label: charge.label,
      amount: calculateAdditionalCharge(charge, baseValue, stampDuty),
    }));

  const additionalCharges = additionalBreakdown.reduce((sum, item) => sum + item.amount, 0);
  const totalGovernmentCharges = stampDuty + registrationFee + additionalCharges;

  return {
    isValid: true,
    stateCode,
    agreementValue: agreement,
    circleRateValue: guidance,
    calculationBase: baseValue,
    usedCircleRate: guidance > agreement,
    stampDutyRate,
    stampDuty,
    registrationFee,
    additionalBreakdown,
    additionalCharges,
    totalGovernmentCharges,
    totalPropertyCost: agreement + totalGovernmentCharges,
    effectiveChargeRate: agreement > 0 ? (totalGovernmentCharges / agreement) * 100 : 0,
  };
}
