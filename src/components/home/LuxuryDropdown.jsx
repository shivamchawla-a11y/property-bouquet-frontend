"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

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

const [minBudget, setMinBudget] =
  useState(50);

const [maxBudget, setMaxBudget] =
  useState(500);

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
w-[260px]
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
    {/* VALUE DISPLAY */}

    <div
      className="
        mb-5
        rounded-[14px]
        border border-[#c89d58]/15
        bg-white/[0.03]
        px-4
        py-3
      "
    >
      <div className="flex justify-between">
        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-[2px]">
            Min
          </p>

          <p className="text-white text-[14px] font-medium mt-1">
            {formatBudget(minBudget)}
          </p>
        </div>

        <div>
          <p className="text-white/40 text-[10px] uppercase tracking-[2px] text-right">
            Max
          </p>

          <p className="text-[#c89d58] text-[14px] font-medium mt-1">
            {formatBudget(maxBudget)}
          </p>
        </div>
      </div>
    </div>

    {/* MIN SLIDER */}

    <div className="mb-5">
      <p className="text-white/50 text-[10px] uppercase tracking-[2px] mb-2">
        Minimum Budget
      </p>

      <input
        type="range"
        min="50"
        max="500"
        value={minBudget}
        onChange={(e) => {
          const val = Number(e.target.value);

          setMinBudget(val);

          if (val > maxBudget) {
            setMaxBudget(val);
          }
        }}
        className="luxury-range"
      />
    </div>

    {/* MAX SLIDER */}

    <div className="mb-5">
      <p className="text-white/50 text-[10px] uppercase tracking-[2px] mb-2">
        Maximum Budget
      </p>

      <input
        type="range"
        min="50"
        max="500"
        value={maxBudget}
        onChange={(e) => {
          const val = Number(e.target.value);

          setMaxBudget(val);

          if (val < minBudget) {
            setMinBudget(val);
          }
        }}
        className="luxury-range"
      />
    </div>

    <button
      onClick={() => {
        onChange(
          `${formatBudget(
            minBudget
          )} - ${formatBudget(maxBudget)}`
        );

        setOpen(false);
      }}
      className="
        w-full
        h-[42px]
        rounded-[12px]
        bg-gradient-to-r
        from-[#e6c57b]
        via-[#d4ab57]
        to-[#be8c32]
        text-black
        text-[12px]
        font-semibold
        tracking-[2px]
        uppercase
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
