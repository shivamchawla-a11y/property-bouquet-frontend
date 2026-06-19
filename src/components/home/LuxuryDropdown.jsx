"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Range, getTrackBackground } from "react-range";

export default function LuxuryDropdown({
  icon: Icon,
  label,
  placeholder,
  options = [],
  value,
  onChange,
  budgetSlider = false,
}) {
const [open, setOpen] = useState(false);
const [budgetValues, setBudgetValues] =
  useState([50, 500]);

const ref = useRef(null);

useEffect(() => {
const handleClickOutside = (e) => {
if (
ref.current &&
!ref.current.contains(e.target)
) {
setOpen(false);
}
};


document.addEventListener(
  "mousedown",
  handleClickOutside
);

return () => {
  document.removeEventListener(
    "mousedown",
    handleClickOutside
  );
};


}, []);

const formatBudget = (value) => {
  if (value >= 500) return "₹5Cr+";

  if (value >= 100) {
    return `₹${(
      value / 100
    ).toFixed(
      value % 100 === 0 ? 0 : 1
    )}Cr`;
  }

  return `₹${value}L`;
};

return ( <div
   ref={ref}
   className="group relative flex items-center gap-3 px-4 py-3 h-full"
 >
{/* ICON */} 
<div className="relative shrink-0"> <div className="absolute inset-0 bg-[#c89d58]/30 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />

    <div className="relative w-8 h-8 rounded-xl border border-white/10 bg-white/[0.06] backdrop-blur-xl flex items-center justify-center">
      <Icon
        size={16}
        className="text-[#d4ae67]"
      />
    </div>
  </div>

  {/* CONTENT */}
  <div className="flex-1 min-w-0">
    <p className="text-[8px] uppercase tracking-[2.5px] text-white/40 font-semibold mb-1">
      {label}
    </p>

    <button
      type="button"
      onClick={() => setOpen((prev) => !prev)}
      className="w-full flex items-center justify-between text-left"
    >
      <span className="text-white text-[13px] font-medium truncate">
        {value || placeholder}
      </span>

      <motion.div
        animate={{
          rotate: open ? 180 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
      >
        <ChevronDown
          size={15}
          className="text-[#c89d58]"
        />
      </motion.div>
    </button>
  </div>

  {/* DROPDOWN */} 
  <AnimatePresence>
{open && (
<motion.div
initial={{
opacity: 0,
y: 20,
scale: 0.95,
}}
animate={{
opacity: 1,
y: 0,
scale: 1,
}}
exit={{
opacity: 0,
y: 20,
scale: 0.95,
}}
transition={{
duration: 0.22,
ease: [0.22, 1, 0.36, 1],
}}
className="
absolute
left-0
top-full
mt-2
w-[300px]
z-[999999]
rounded-2xl
overflow-hidden
border
border-[#c89d58]/20
bg-black/95
backdrop-blur-3xl
shadow-[0_25px_80px_rgba(0,0,0,0.7)]
"
>
{budgetSlider ? (
  <div className="p-5">

  {/* HEADER CARD */}

  <div
    className="
      mb-5
      rounded-[16px]
      border border-[#c89d58]/15
      bg-gradient-to-b
      from-white/[0.05]
      to-white/[0.02]
      backdrop-blur-xl
      p-4
    "
  >
    <div className="flex justify-between">

      <div>
        <p className="text-white/35 text-[10px] uppercase tracking-[2px]">
          Minimum
        </p>

        <p className="text-white text-[15px] font-medium mt-1">
          {formatBudget(
            budgetValues[0]
          )}
        </p>
      </div>

      <div className="text-right">
        <p className="text-white/35 text-[10px] uppercase tracking-[2px]">
          Maximum
        </p>

        <p className="text-[#d4ab57] text-[15px] font-medium mt-1">
          {formatBudget(
            budgetValues[1]
          )}
        </p>
      </div>

    </div>
  </div>

  {/* RANGE */}

  <div className="px-2 py-4">

    <Range
      values={budgetValues}
      step={10}
      min={50}
      max={500}
      onChange={(values) =>
        setBudgetValues(values)
      }
      renderTrack={({
        props,
        children,
      }) => (
        <div
          {...props}
          className="h-[4px] w-full rounded-full"
          style={{
            background: getTrackBackground({
              values:
                budgetValues,
              colors: [
                "rgba(255,255,255,0.08)",
                "#d4ab57",
                "rgba(255,255,255,0.08)",
              ],
              min: 50,
              max: 500,
            }),
          }}
        >
          {children}
        </div>
      )}
      renderThumb={({ props }) => {
  const { key, ...restProps } = props;

  return (
    <div
      key={key}
      {...restProps}
      className="
        h-5
        w-5
        rounded-full
        border
        border-white/20
        bg-gradient-to-b
        from-[#e6c57b]
        to-[#be8c32]
        shadow-[0_0_20px_rgba(200,157,88,0.6)]
        focus:outline-none
      "
    />
  );
}}
    />

  </div>

  {/* PRESET CHIPS */}

  <div className="grid grid-cols-2 gap-2 mt-5">

    {[
  [50,100],
  [100,200],
  [200,500],
].map((range, index) => (
      <button
        key={index}
        onClick={() =>
          setBudgetValues(range)
        }
        className="
          h-[36px]
          rounded-xl
          border
          border-white/10
          bg-white/[0.03]
          hover:border-[#c89d58]/40
          hover:bg-white/[0.05]
          text-white/80
          text-[11px]
          transition-all
        "
      >
        {formatBudget(range[0])}
        {" - "}
        {formatBudget(range[1])}
      </button>
    ))}

    <button
  onClick={() =>
    setBudgetValues([500,500])
  }
  className="
    h-[36px]
    rounded-xl
    border
    border-[#c89d58]/20
    bg-[#c89d58]/10
    text-[#d4ab57]
    text-[11px]
    transition-all
  "
>
  ₹5Cr+
</button>

  </div>

  {/* APPLY */}

  <button
    onClick={() => {
  const min =
    budgetValues[0] * 100000;

  const max =
    budgetValues[1] * 100000;

  onChange({
    value: `${min}-${max}`,
    label: `${formatBudget(
      budgetValues[0]
    )} - ${formatBudget(
      budgetValues[1]
    )}`,
  });

  setOpen(false);
}}
    className="
      mt-5
      w-full
      h-[44px]
      rounded-[14px]
      bg-gradient-to-r
      from-[#e6c57b]
      via-[#d4ab57]
      to-[#be8c32]
      text-black
      text-[12px]
      font-semibold
      tracking-[2px]
      uppercase
      shadow-[0_10px_25px_rgba(200,157,88,0.25)]
    "
  >
    Apply Budget
  </button>

</div>
) : (
  <>
  {options.map((item) => (
  <button
    key={item}
    type="button"
    onClick={() => {
      onChange(item);
      setOpen(false);
    }}
    className="
      w-full
      px-5
      py-4
      text-left
      text-white/80
      hover:text-white
      hover:bg-white/[0.05]
      transition-all
      duration-200
      border-b
      border-white/[0.04]
      last:border-none
    "
  >
    {item}
  </button>
))}
  </>
)}
</motion.div>
)} 

</AnimatePresence>

</div>


);
}
