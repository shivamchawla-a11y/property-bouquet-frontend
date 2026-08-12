"use client";

import {
  Building2,
  CalendarDays,
  Landmark,
  Percent,
  WalletCards,
  ChartNoAxesCombined,
} from "lucide-react";

/* =========================================================
   INVESTMENT FORM
========================================================= */

export default function InvestmentForm({
  formData,
  setFormData,
  onCalculate,
  onReset,
}) {
  const updateField = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  /* =======================================================
     PROPERTY VALUE CHANGE
     Keep loan/down payment relationship consistent.
  ======================================================= */

  const handlePropertyValueChange = (value) => {
    const propertyValue = Math.max(
      0,
      Number(value) || 0
    );

    setFormData((prev) => {
      const downPaymentPercent = clamp(
        Number(prev.breakdown.downPaymentPercent) || 0,
        0,
        100
      );

      const loanPercent = Math.max(
        0,
        100 - downPaymentPercent
      );

      const downPayment =
        propertyValue *
        (downPaymentPercent / 100);

      const loanAmount =
        propertyValue *
        (loanPercent / 100);

      return {
        ...prev,
        investment: {
          ...prev.investment,
          propertyValue: value,
        },
        breakdown: {
          ...prev.breakdown,
          downPayment: String(
            Math.round(downPayment)
          ),
          loanAmount: String(
            Math.round(loanAmount)
          ),
          downPaymentPercent: String(
            downPaymentPercent
          ),
          loanPercent: String(
            loanPercent
          ),
        },
      };
    });
  };

  /* =======================================================
     DOWN PAYMENT AMOUNT
  ======================================================= */

  const handleDownPaymentChange = (value) => {
    setFormData((prev) => {
      const propertyValue =
        Number(prev.investment.propertyValue) || 0;

      const downPayment = clamp(
        Number(value) || 0,
        0,
        propertyValue
      );

      const loanAmount =
        propertyValue - downPayment;

      const downPaymentPercent =
        propertyValue > 0
          ? (downPayment / propertyValue) * 100
          : 0;

      const loanPercent =
        propertyValue > 0
          ? (loanAmount / propertyValue) * 100
          : 0;

      return {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          downPayment: String(
            Math.round(downPayment)
          ),
          downPaymentPercent:
            formatNumberString(
              downPaymentPercent
            ),
          loanAmount: String(
            Math.round(loanAmount)
          ),
          loanPercent:
            formatNumberString(
              loanPercent
            ),
        },
      };
    });
  };

  /* =======================================================
     DOWN PAYMENT PERCENTAGE
  ======================================================= */

  const handleDownPaymentPercentChange = (
    value
  ) => {
    setFormData((prev) => {
      const propertyValue =
        Number(prev.investment.propertyValue) || 0;

      const downPaymentPercent = clamp(
        Number(value) || 0,
        0,
        100
      );

      const loanPercent =
        100 - downPaymentPercent;

      const downPayment =
        propertyValue *
        (downPaymentPercent / 100);

      const loanAmount =
        propertyValue *
        (loanPercent / 100);

      return {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          downPaymentPercent:
            formatNumberString(
              downPaymentPercent
            ),
          loanPercent:
            formatNumberString(
              loanPercent
            ),
          downPayment: String(
            Math.round(downPayment)
          ),
          loanAmount: String(
            Math.round(loanAmount)
          ),
        },
      };
    });
  };

  /* =======================================================
     LOAN AMOUNT
  ======================================================= */

  const handleLoanAmountChange = (value) => {
    setFormData((prev) => {
      const propertyValue =
        Number(prev.investment.propertyValue) || 0;

      const loanAmount = clamp(
        Number(value) || 0,
        0,
        propertyValue
      );

      const downPayment =
        propertyValue - loanAmount;

      const loanPercent =
        propertyValue > 0
          ? (loanAmount / propertyValue) * 100
          : 0;

      const downPaymentPercent =
        propertyValue > 0
          ? (downPayment / propertyValue) * 100
          : 0;

      return {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          loanAmount: String(
            Math.round(loanAmount)
          ),
          loanPercent:
            formatNumberString(
              loanPercent
            ),
          downPayment: String(
            Math.round(downPayment)
          ),
          downPaymentPercent:
            formatNumberString(
              downPaymentPercent
            ),
        },
      };
    });
  };

  /* =======================================================
     LOAN PERCENTAGE
  ======================================================= */

  const handleLoanPercentChange = (
    value
  ) => {
    setFormData((prev) => {
      const propertyValue =
        Number(prev.investment.propertyValue) || 0;

      const loanPercent = clamp(
        Number(value) || 0,
        0,
        100
      );

      const downPaymentPercent =
        100 - loanPercent;

      const loanAmount =
        propertyValue *
        (loanPercent / 100);

      const downPayment =
        propertyValue *
        (downPaymentPercent / 100);

      return {
        ...prev,
        breakdown: {
          ...prev.breakdown,
          loanPercent:
            formatNumberString(
              loanPercent
            ),
          downPaymentPercent:
            formatNumberString(
              downPaymentPercent
            ),
          loanAmount: String(
            Math.round(loanAmount)
          ),
          downPayment: String(
            Math.round(downPayment)
          ),
        },
      };
    });
  };

  return (
    <div
      className="
        rounded-[10px]
        border
        border-[#e9e2d7]
        bg-white
        p-5
        shadow-[0_4px_24px_rgba(0,0,0,0.025)]
        md:p-6
      "
    >
      {/* ===================================================== */}
      {/* INVESTMENT DETAILS                                    */}
      {/* ===================================================== */}

      <FormSection
        icon={Building2}
        title="Investment Details"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Property Type">
            <SelectInput
              value={
                formData.investment.propertyType
              }
              onChange={(value) =>
                updateField(
                  "investment",
                  "propertyType",
                  value
                )
              }
              options={[
                "Residential",
                "Commercial",
                "Plot",
                "Villa",
              ]}
            />
          </Field>

          <Field label="Location">
            <SelectInput
              value={
                formData.investment.location
              }
              onChange={(value) =>
                updateField(
                  "investment",
                  "location",
                  value
                )
              }
              options={[
                "Gurgaon",
                "Delhi",
                "Noida",
                "Faridabad",
                "Other",
              ]}
            />
          </Field>

          <Field label="Property Value">
            <MoneyInput
              value={
                formData.investment.propertyValue
              }
              onChange={
                handlePropertyValueChange
              }
            />
          </Field>

          <Field label="Carpet Area (sq.ft.)">
            <input
              type="number"
              min="0"
              value={
                formData.investment.carpetArea
              }
              onChange={(e) =>
                updateField(
                  "investment",
                  "carpetArea",
                  e.target.value
                )
              }
              className={inputClass}
              placeholder="1500"
            />
          </Field>

          <Field label="Purchase Date">
            <div className="relative">
              <input
                type="month"
                value={
                  formData.investment.purchaseDate
                }
                onChange={(e) =>
                  updateField(
                    "investment",
                    "purchaseDate",
                    e.target.value
                  )
                }
                className={`${inputClass} pr-10`}
              />

              <CalendarDays
                size={15}
                strokeWidth={1.7}
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-[#777]
                "
              />
            </div>
          </Field>

          <Field label="Holding Period">
            <SelectInput
              value={
                formData.investment.holdingPeriod
              }
              onChange={(value) =>
                updateField(
                  "investment",
                  "holdingPeriod",
                  value
                )
              }
              options={[
                "3",
                "5",
                "7",
                "10",
                "15",
                "20",
              ]}
              formatOption={(value) =>
                `${value} Years`
              }
            />
          </Field>
        </div>
      </FormSection>

      {/* ===================================================== */}
      {/* INVESTMENT BREAKDOWN                                 */}
      {/* ===================================================== */}

      <FormSection
        icon={WalletCards}
        title="Investment Breakdown"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <PercentageMoneyField
            label="Down Payment"
            value={
              formData.breakdown.downPayment
            }
            percentage={
              formData.breakdown
                .downPaymentPercent
            }
            onValueChange={
              handleDownPaymentChange
            }
            onPercentageChange={
              handleDownPaymentPercentChange
            }
          />

          <Field label="Interest Rate (%)">
            <PercentageInput
              value={
                formData.breakdown.interestRate
              }
              onChange={(value) =>
                updateField(
                  "breakdown",
                  "interestRate",
                  value
                )
              }
              step="0.01"
            />
          </Field>

          <PercentageMoneyField
            label="Loan Amount"
            value={
              formData.breakdown.loanAmount
            }
            percentage={
              formData.breakdown.loanPercent
            }
            onValueChange={
              handleLoanAmountChange
            }
            onPercentageChange={
              handleLoanPercentChange
            }
          />

          <Field label="Loan Tenure">
            <SelectInput
              value={
                formData.breakdown.loanTenure
              }
              onChange={(value) =>
                updateField(
                  "breakdown",
                  "loanTenure",
                  value
                )
              }
              options={[
                "10",
                "15",
                "20",
                "25",
                "30",
              ]}
              formatOption={(value) =>
                `${value} Years`
              }
            />
          </Field>
        </div>
      </FormSection>

      {/* ===================================================== */}
      {/* RENTAL INCOME                                        */}
      {/* ===================================================== */}

      <FormSection
        icon={Landmark}
        title="Rental Income"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Expected Monthly Rent">
            <MoneyInput
              value={
                formData.rental.monthlyRent
              }
              onChange={(value) =>
                updateField(
                  "rental",
                  "monthlyRent",
                  value
                )
              }
            />
          </Field>

          <Field label="Annual Rent Escalation">
            <PercentageInput
              value={
                formData.rental.rentEscalation
              }
              onChange={(value) =>
                updateField(
                  "rental",
                  "rentEscalation",
                  value
                )
              }
              step="0.5"
            />
          </Field>
        </div>
      </FormSection>

      {/* ===================================================== */}
      {/* EXPENSES                                              */}
      {/* ===================================================== */}

      <FormSection
        icon={Landmark}
        title="Expenses (Annual)"
      >
        <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2">
          <Field label="Maintenance Charges">
            <MoneyInput
              value={
                formData.expenses.maintenance
              }
              onChange={(value) =>
                updateField(
                  "expenses",
                  "maintenance",
                  value
                )
              }
            />
          </Field>

          <Field label="Property Tax">
            <MoneyInput
              value={
                formData.expenses.propertyTax
              }
              onChange={(value) =>
                updateField(
                  "expenses",
                  "propertyTax",
                  value
                )
              }
            />
          </Field>

          <Field label="Insurance">
            <MoneyInput
              value={
                formData.expenses.insurance
              }
              onChange={(value) =>
                updateField(
                  "expenses",
                  "insurance",
                  value
                )
              }
            />
          </Field>

          <Field label="Other Expenses">
            <MoneyInput
              value={
                formData.expenses.other
              }
              onChange={(value) =>
                updateField(
                  "expenses",
                  "other",
                  value
                )
              }
            />
          </Field>
        </div>
      </FormSection>

      {/* ===================================================== */}
      {/* ACTION BUTTONS                                        */}
      {/* ===================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <button
          type="button"
          onClick={onCalculate}
          className="
            flex
            h-[48px]
            items-center
            justify-center
            gap-2
            rounded-lg
            bg-[#003d2e]
            px-5
            text-[12px]
            font-semibold
            text-white
            shadow-[0_8px_25px_rgba(0,61,46,0.16)]
            transition-all
            duration-300
            hover:bg-[#00523d]
            hover:shadow-[0_10px_30px_rgba(0,61,46,0.22)]
            active:scale-[0.99]
          "
        >
          Calculate ROI

          <ChartNoAxesCombined
            size={14}
            strokeWidth={1.8}
          />
        </button>

        <button
          type="button"
          onClick={onReset}
          className="
            flex
            h-[48px]
            items-center
            justify-center
            gap-2
            rounded-lg
            border
            border-[#d9b061]
            bg-white
            px-5
            text-[12px]
            font-medium
            text-[#333]
            transition-all
            duration-300
            hover:bg-[#fcf8ef]
            active:scale-[0.99]
          "
        >
          Reset

          <span className="text-[16px] leading-none">
            ↻
          </span>
        </button>
      </div>
    </div>
  );
}

/* ========================================================= */
/* FORM SECTION                                              */
/* ========================================================= */

function FormSection({
  icon: Icon,
  title,
  children,
}) {
  return (
    <section className="mb-7 last:mb-0">
      <div className="mb-4 flex items-center gap-3">
        <div
          className="
            flex
            h-7
            w-7
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#c9a64b]/10
            text-[#a57c2b]
          "
        >
          <Icon
            size={15}
            strokeWidth={1.6}
          />
        </div>

        <h2
          className="
            font-serif
            text-[17px]
            font-medium
            text-[#10251f]
            md:text-[18px]
          "
        >
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}

/* ========================================================= */
/* FIELD                                                     */
/* ========================================================= */

function Field({
  label,
  children,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1.5
          block
          text-[10px]
          font-medium
          leading-none
          text-[#555]
        "
      >
        {label}
      </label>

      {children}
    </div>
  );
}

/* ========================================================= */
/* SELECT                                                     */
/* ========================================================= */

function SelectInput({
  value,
  onChange,
  options,
  formatOption,
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={selectClass}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {formatOption
              ? formatOption(option)
              : option}
          </option>
        ))}
      </select>
    </div>
  );
}

/* ========================================================= */
/* MONEY INPUT                                                */
/* ========================================================= */

function MoneyInput({
  value,
  onChange,
}) {
  return (
    <div className="relative">
      <span
        className="
          pointer-events-none
          absolute
          left-3
          top-1/2
          -translate-y-1/2
          text-[12px]
          text-[#555]
        "
      >
        ₹
      </span>

      <input
        type="number"
        min="0"
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`${inputClass} pl-7`}
        placeholder="0"
      />
    </div>
  );
}

/* ========================================================= */
/* PERCENTAGE INPUT                                          */
/* ========================================================= */

function PercentageInput({
  value,
  onChange,
  step = "0.01",
}) {
  return (
    <div className="relative">
      <input
        type="number"
        min="0"
        step={step}
        value={value ?? ""}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className={`${inputClass} pr-9`}
        placeholder="0"
      />

      <Percent
        size={14}
        strokeWidth={1.7}
        className="
          pointer-events-none
          absolute
          right-3
          top-1/2
          -translate-y-1/2
          text-[#777]
        "
      />
    </div>
  );
}

/* ========================================================= */
/* MONEY + PERCENTAGE FIELD                                  */
/* ========================================================= */

function PercentageMoneyField({
  label,
  value,
  percentage,
  onValueChange,
  onPercentageChange,
}) {
  return (
    <div className="min-w-0">
      <label
        className="
          mb-1.5
          block
          text-[10px]
          font-medium
          leading-none
          text-[#555]
        "
      >
        {label}
      </label>

      <div className="relative">
        <span
          className="
            pointer-events-none
            absolute
            left-3
            top-1/2
            -translate-y-1/2
            text-[12px]
            text-[#555]
          "
        >
          ₹
        </span>

        <input
          type="number"
          min="0"
          value={value ?? ""}
          onChange={(e) =>
            onValueChange(
              e.target.value
            )
          }
          className={`
            ${inputClass}
            pl-7
            pr-[68px]
          `}
          placeholder="0"
        />

        <div
          className="
            absolute
            right-3
            top-1/2
            flex
            -translate-y-1/2
            items-center
            border-l
            border-[#e3ddd3]
            pl-2.5
            text-[10px]
            text-[#555]
          "
        >
          <input
            type="number"
            min="0"
            max="100"
            step="0.01"
            value={percentage ?? ""}
            onChange={(e) =>
              onPercentageChange(
                e.target.value
              )
            }
            className="
              w-[32px]
              bg-transparent
              text-right
              text-[10px]
              outline-none
            "
          />

          <span className="ml-0.5">
            %
          </span>
        </div>
      </div>
    </div>
  );
}

/* ========================================================= */
/* HELPERS                                                    */
/* ========================================================= */

function clamp(value, min, max) {
  return Math.min(
    Math.max(value, min),
    max
  );
}

function formatNumberString(value) {
  if (!Number.isFinite(value)) {
    return "0";
  }

  return Number(value.toFixed(2)).toString();
}

/* ========================================================= */
/* INPUT STYLES                                               */
/* ========================================================= */

const inputClass = `
  h-[42px]
  w-full
  rounded-md
  border
  border-[#ded8ce]
  bg-white
  px-3
  text-[11px]
  text-[#222]
  outline-none
  transition-all
  duration-200
  placeholder:text-[#aaa]
  focus:border-[#c9a64b]
  focus:ring-2
  focus:ring-[#c9a64b]/10
`;

/* ========================================================= */
/* SELECT STYLES                                              */
/* ========================================================= */

const selectClass = `
  ${inputClass}
  cursor-pointer
  appearance-none
  bg-[linear-gradient(45deg,transparent_50%,#777_50%),linear-gradient(135deg,#777_50%,transparent_50%)]
  bg-[position:calc(100%-14px)_18px,calc(100%-10px)_18px]
  bg-[length:4px_4px,4px_4px]
  bg-no-repeat
  pr-8
`;