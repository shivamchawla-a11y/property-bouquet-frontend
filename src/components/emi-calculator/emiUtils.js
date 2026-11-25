export const DEFAULT_EMI_VALUES = {
  loanAmount: "5000000",
  interestRate: "8.5",
  tenureYears: "20",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

export function formatCurrency(value) {
  if (!Number.isFinite(Number(value))) return "—";
  return currencyFormatter.format(Math.round(Number(value)));
}

export function formatNumber(value) {
  if (!Number.isFinite(Number(value))) return "—";
  return numberFormatter.format(Math.round(Number(value)));
}

export function calculateEMI(principal, annualRate, tenureYears) {
  const P = Number(principal);
  const annual = Number(annualRate);
  const years = Number(tenureYears);

  if (
    principal === "" ||
    annualRate === "" ||
    tenureYears === "" ||
    !Number.isFinite(P) ||
    !Number.isFinite(annual) ||
    !Number.isFinite(years) ||
    P <= 0 ||
    annual < 0 ||
    years <= 0
  ) {
    return {
      monthlyEmi: 0,
      totalPayment: 0,
      totalInterest: 0,
      principal: Math.max(0, P || 0),
      months: 0,
      monthlyRate: 0,
      valid: false,
    };
  }

  const months = Math.round(years * 12);
  const monthlyRate = annual / 1200;
  const monthlyEmi =
    monthlyRate === 0
      ? P / months
      : (P * monthlyRate * Math.pow(1 + monthlyRate, months)) /
        (Math.pow(1 + monthlyRate, months) - 1);
  const totalPayment = monthlyEmi * months;
  const totalInterest = totalPayment - P;

  return {
    monthlyEmi,
    totalPayment,
    totalInterest,
    principal: P,
    months,
    monthlyRate,
    valid: Number.isFinite(monthlyEmi) && monthlyEmi > 0,
  };
}

export function buildYearlyAmortization(principal, annualRate, tenureYears) {
  const summary = calculateEMI(principal, annualRate, tenureYears);
  if (!summary.valid) return [];

  const schedule = [];
  let balance = summary.principal;
  const monthlyRate = summary.monthlyRate;

  for (let month = 1; month <= summary.months && balance > 0.005; month += 1) {
    const year = Math.ceil(month / 12);
    const interest = balance * monthlyRate;
    const regularPayment = summary.monthlyEmi;
    const payment = Math.min(regularPayment, balance + interest);
    const principalPaid = Math.min(balance, Math.max(0, payment - interest));
    const openingBalance = balance;
    balance = Math.max(0, balance - principalPaid);

    let yearRow = schedule[schedule.length - 1];
    if (!yearRow || yearRow.year !== year) {
      yearRow = {
        year,
        openingBalance,
        emiPaid: 0,
        principalPaid: 0,
        interestPaid: 0,
        closingBalance: balance,
      };
      schedule.push(yearRow);
    }

    yearRow.emiPaid += payment;
    yearRow.principalPaid += principalPaid;
    yearRow.interestPaid += interest;
    yearRow.closingBalance = balance;
  }

  return schedule;
}
