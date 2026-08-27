"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Calculator,
  MapPin,
  FileText,
  Construction,
  TrendingUp,
  House,
  HandCoins,
  ShieldCheck,
  Zap,
  LockKeyhole,
  Headphones,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import ROICalculator from "./ROICalculator";

/* ============================================================
   TOOLS
============================================================ */

const tools = [
  {
    id: "roi",
    title: "ROI Calculator",
    description:
      "Calculate return on investment and analyze potential returns on your property.",
    action: "Calculate Now",
    badge: "Popular",
    icon: Calculator,
    iconStyle: "sage",
    href: "/tools/roi-calculator",
  },
  {
    id: "area",
    title: "Area Converter",
    description:
      "Convert between different land units instantly. Sq. Ft., Sq. Yd., Acres, Hectares and more.",
    action: "Convert Now",
    icon: MapPin,
    iconStyle: "gold",
    href: "/tools/area-converter",
  },
  {
    id: "emi",
    title: "EMI Calculator",
    description:
      "Calculate your loan EMI, total interest, and repayment schedule in seconds.",
    action: "Calculate Now",
    badge: "Popular",
    icon: Calculator,
    iconStyle: "sage",
  },
  {
    id: "stamp-duty",
    title: "Stamp Duty Calculator",
    description:
      "Estimate stamp duty and registration charges for your property.",
    action: "Calculate Now",
    icon: FileText,
    iconStyle: "gold",
  },
  {
    id: "construction",
    title: "Construction Cost Calculator",
    description:
      "Estimate construction cost per sq. ft. for residential and commercial projects.",
    action: "Calculate Now",
    badge: "New",
    icon: Construction,
    iconStyle: "gold",
  },
  {
    id: "rental-yield",
    title: "Rental Yield Calculator",
    description:
      "Calculate rental yield and analyze the income potential of your property.",
    action: "Calculate Now",
    icon: TrendingUp,
    iconStyle: "sage",
  },
  {
    id: "affordability",
    title: "Affordability Calculator",
    description:
      "Find out how much property you can afford based on your income.",
    action: "Calculate Now",
    badge: "New",
    icon: House,
    iconStyle: "gold",
  },
  {
    id: "loan-eligibility",
    title: "Loan Eligibility Calculator",
    description:
      "Check your loan eligibility and discover your borrowing capacity.",
    action: "Check Now",
    icon: HandCoins,
    iconStyle: "sage",
  },
];

/* ============================================================
   BENEFITS
============================================================ */

const benefits = [
  {
    icon: ShieldCheck,
    title: "100% Accurate",
    description: "Reliable calculations you can trust",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get accurate results in seconds",
  },
  {
    icon: LockKeyhole,
    title: "Free to Use",
    description: "All tools are completely free forever",
  },
  {
    icon: Headphones,
    title: "Expert Support",
    description: "Need help? Our experts are here for you",
  },
];

/* ============================================================
   COMPONENT
============================================================ */

export default function ToolsSection() {
  const toolsSectionRef = useRef(null);

  const [sectionVisible, setSectionVisible] = useState(false);
  const [activeTool, setActiveTool] = useState(null);

  /* ============================================================
     DETECT WHEN TOOLS SECTION IS ACTUALLY IN VIEW

     This controls the floating ROI button.

     The button does NOT belong to the entire website.
     It only exists while this section is visible.
  ============================================================ */

  useEffect(() => {
    const section = toolsSectionRef.current;

    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setSectionVisible(entry.isIntersecting);

        /*
          If the user scrolls away from this section,
          automatically close the drawer.
        */
        if (!entry.isIntersecting) {
          setActiveTool(null);
        }
      },
      {
        threshold: 0.08,
      }
    );

    observer.observe(section);

    return () => {
      observer.disconnect();
    };
  }, []);

  /* ============================================================
     LOCK PAGE SCROLL ONLY WHILE DRAWER IS OPEN

     The ROI tab itself does NOT lock scrolling.
  ============================================================ */

  useEffect(() => {
    if (!activeTool) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [activeTool]);

  /* ============================================================
     ESC TO CLOSE
  ============================================================ */

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setActiveTool(null);
      }
    };

    if (activeTool) {
      window.addEventListener("keydown", handleEscape);
    }

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [activeTool]);

  /* ============================================================
     OPEN TOOL
  ============================================================ */

  const handleToolClick = (tool) => {
    /*
      ROI and Area Converter have dedicated pages.

      The grid cards should navigate directly to those pages.
    */
    if (tool.href) {
      return;
    }

    /*
      Other tools can use the temporary drawer until
      their dedicated calculator components are connected.
    */
    setActiveTool(tool.id);
  };

  /* ============================================================
     CLOSE DRAWER
  ============================================================ */

  const closeDrawer = () => {
    setActiveTool(null);
  };

  /* ============================================================
     ACTIVE TOOL DATA
  ============================================================ */

  const activeToolData = tools.find(
    (tool) => tool.id === activeTool
  );

  return (
    <>
      {/* ==========================================================
          MAIN TOOLS SECTION
      ========================================================== */}

      <section
        ref={toolsSectionRef}
        id="tools"
        className="
          relative
          w-full
          overflow-hidden
          bg-[#f6f3ee]
          px-4
          py-16
          sm:px-6
          sm:py-20
          lg:px-8
          lg:py-22
        "
      >
        {/* ========================================================
            CONTAINER
        ======================================================== */}

        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
          "
        >
          {/* ======================================================
              HEADER
          ====================================================== */}

          <div
            className="
              mx-auto
              mb-10
              max-w-[720px]
              text-center
              sm:mb-12
            "
          >
            {/* Eyebrow */}

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="
                mx-auto
                inline-flex
                items-center
                rounded-full
                border
                border-[#ddd5c7]
                bg-[#fffdfa]
                px-4
                py-1.5
                text-[10px]
                font-medium
                tracking-[0.08em]
                text-[#89692f]
                sm:text-[11px]
              "
            >
              ALL-IN-ONE REAL ESTATE TOOLS
            </motion.div>

            {/* Heading */}

            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.05,
              }}
              className="
                mt-4
                font-serif
                text-[32px]
                leading-[1.08]
                tracking-[-0.025em]
                text-[#06261d]
                sm:text-[39px]
                md:text-[44px]
                lg:text-[48px]
              "
            >
              Powerful Tools for
              <br />

              <span className="text-[#b38428]">
                Smarter
              </span>{" "}
              Real Estate Decisions
            </motion.h2>

            {/* Description */}

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: 0.1,
              }}
              className="
                mx-auto
                mt-4
                max-w-[570px]
                text-[13px]
                leading-6
                text-[#454b48]
                sm:text-[14px]
                sm:leading-6
              "
            >
              Calculate, compare and plan your real estate investments with
              our advanced calculators and smart tools.
            </motion.p>

            {/* Divider */}

            <motion.div
              initial={{
                opacity: 0,
                scaleX: 0.8,
              }}
              whileInView={{
                opacity: 1,
                scaleX: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.55,
                delay: 0.15,
              }}
              className="
                mx-auto
                mt-5
                flex
                w-[180px]
                items-center
                gap-2.5
              "
            >
              <span className="h-px flex-1 bg-[#d8c9a8]" />

              <span
                className="
                  relative
                  flex
                  h-6
                  w-6
                  items-center
                  justify-center
                  text-[#b38428]
                "
              >
                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[16px]
                    w-[10px]
                    -translate-x-1/2
                    border-x
                    border-t
                    border-[#b38428]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    left-1/2
                    h-[11px]
                    w-[3px]
                    -translate-x-1/2
                    border-x
                    border-t
                    border-[#b38428]
                  "
                />

                <span
                  className="
                    absolute
                    bottom-0
                    left-[4px]
                    right-[4px]
                    h-px
                    bg-[#b38428]
                  "
                />
              </span>

              <span className="h-px flex-1 bg-[#d8c9a8]" />
            </motion.div>
          </div>

          {/* ======================================================
              TOOLS GRID
          ====================================================== */}

          <div
            className="
              grid
              grid-cols-1
              gap-3
              sm:grid-cols-2
              lg:grid-cols-4
            "
          >
            {tools.map((tool, index) => {
              const Icon = tool.icon;

              /*
                ROI and Area Converter are real links.

                Other tools remain buttons until their dedicated
                calculators are connected.
              */
              const CardContent = (
                <>
                  {/* Badge */}

                  {tool.badge && (
                    <span
                      className={`
                        absolute
                        right-2.5
                        top-2.5
                        rounded-[6px]
                        px-2
                        py-[3px]
                        text-[9px]
                        font-medium
                        ${
                          tool.badge === "New"
                            ? "bg-[#fff0d0] text-[#956818]"
                            : "bg-[#edf2e9] text-[#315e49]"
                        }
                      `}
                    >
                      {tool.badge}
                    </span>
                  )}

                  {/* Card Content */}

                  <div className="flex h-full items-center gap-4">
                    {/* Icon */}

                    <div
                      className={`
                        flex
                        h-[72px]
                        w-[72px]
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                          tool.iconStyle === "gold"
                            ? "bg-[#fcf1d9]"
                            : "bg-[#e9eee8]"
                        }
                      `}
                    >
                      <Icon
                        strokeWidth={1.65}
                        className="
                          h-[37px]
                          w-[37px]
                          text-[#07392b]
                          transition-transform
                          duration-300
                          group-hover:scale-105
                        "
                      />
                    </div>

                    {/* Text */}

                    <div
                      className="
                        flex
                        min-w-0
                        flex-1
                        flex-col
                        self-stretch
                        py-1
                      "
                    >
                      <h3
                        className="
                          pr-5
                          font-serif
                          text-[15px]
                          leading-[1.2]
                          text-[#10251f]
                          sm:text-[16px]
                        "
                      >
                        {tool.title}
                      </h3>

                      <p
                        className="
                          mt-2
                          max-w-[220px]
                          text-[11px]
                          leading-[1.65]
                          text-[#454a48]
                          sm:text-[11.5px]
                        "
                      >
                        {tool.description}
                      </p>

                      <span
                        className="
                          mt-auto
                          inline-flex
                          items-center
                          gap-1.5
                          pt-3
                          text-[11px]
                          font-medium
                          text-[#07392b]
                        "
                      >
                        {tool.action}

                        <ArrowRight
                          strokeWidth={1.8}
                          className="
                            h-[14px]
                            w-[14px]
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                          "
                        />
                      </span>
                    </div>
                  </div>
                </>
              );

              /* ==================================================
                 REAL LINK CARDS
              ================================================== */

              if (tool.href) {
                return (
                  <motion.div
                    key={tool.id}
                    initial={{
                      opacity: 0,
                      y: 14,
                    }}
                    whileInView={{
                      opacity: 1,
                      y: 0,
                    }}
                    viewport={{
                      once: true,
                      amount: 0.05,
                    }}
                    transition={{
                      duration: 0.45,
                      delay: Math.min(
                        index * 0.035,
                        0.22
                      ),
                    }}
                    whileHover={{
                      y: -2,
                    }}
                    className="h-full"
                  >
                    <Link
                      href={tool.href}
                      className="
                        group
                        relative
                        flex
                        min-h-[178px]
                        h-full
                        w-full
                        overflow-hidden
                        rounded-[8px]
                        border
                        border-[#dedbd4]
                        bg-[#fffefa]
                        p-4
                        text-left
                        transition-all
                        duration-300
                        hover:border-[#cfc6b5]
                        hover:bg-white
                        hover:shadow-[0_10px_28px_rgba(20,38,31,0.06)]
                        sm:min-h-[184px]
                        lg:p-[17px]
                      "
                    >
                      {CardContent}
                    </Link>
                  </motion.div>
                );
              }

              /* ==================================================
                 OTHER TOOL CARDS
              ================================================== */

              return (
                <motion.button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool)}
                  initial={{
                    opacity: 0,
                    y: 14,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                    amount: 0.05,
                  }}
                  transition={{
                    duration: 0.45,
                    delay: Math.min(
                      index * 0.035,
                      0.22
                    ),
                  }}
                  whileHover={{
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.995,
                  }}
                  className="
                    group
                    relative
                    min-h-[178px]
                    overflow-hidden
                    rounded-[8px]
                    border
                    border-[#dedbd4]
                    bg-[#fffefa]
                    p-4
                    text-left
                    transition-all
                    duration-300
                    hover:border-[#cfc6b5]
                    hover:bg-white
                    hover:shadow-[0_10px_28px_rgba(20,38,31,0.06)]
                    sm:min-h-[184px]
                    lg:p-[17px]
                  "
                >
                  {CardContent}
                </motion.button>
              );
            })}
          </div>

          {/* ======================================================
              BENEFITS STRIP
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 12,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.1,
            }}
            transition={{
              duration: 0.5,
            }}
            className="
              relative
              mt-4
              overflow-hidden
              rounded-[8px]
              border
              border-[#dedfd8]
              bg-[#f1f4ef]
            "
          >
            {/* Decorative buildings — LEFT */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                left-0
                h-[75px]
                w-[90px]
                opacity-[0.13]
              "
            >
              <div
                className="
                  absolute
                  bottom-0
                  left-0
                  h-[55px]
                  w-[22px]
                  border
                  border-[#91a299]
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-[17px]
                  h-[68px]
                  w-[25px]
                  border
                  border-[#91a299]
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  left-[39px]
                  h-[45px]
                  w-[28px]
                  border
                  border-[#91a299]
                "
              />
            </div>

            {/* Decorative buildings — RIGHT */}

            <div
              className="
                pointer-events-none
                absolute
                bottom-0
                right-0
                h-[75px]
                w-[90px]
                opacity-[0.13]
              "
            >
              <div
                className="
                  absolute
                  bottom-0
                  right-0
                  h-[58px]
                  w-[24px]
                  border
                  border-[#91a299]
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  right-[18px]
                  h-[70px]
                  w-[25px]
                  border
                  border-[#91a299]
                "
              />

              <div
                className="
                  absolute
                  bottom-0
                  right-[40px]
                  h-[45px]
                  w-[28px]
                  border
                  border-[#91a299]
                "
              />
            </div>

            {/* Benefits */}

            <div
              className="
                relative
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-4
                lg:divide-x
                lg:divide-[#d9ddd7]
              "
            >
              {benefits.map((benefit) => {
                const Icon = benefit.icon;

                return (
                  <div
                    key={benefit.title}
                    className="
                      flex
                      min-h-[92px]
                      items-center
                      gap-3.5
                      border-b
                      border-[#d9ddd7]
                      px-5
                      py-4
                      last:border-b-0
                      md:px-6
                      lg:border-b-0
                      lg:px-6
                      xl:px-7
                    "
                  >
                    <Icon
                      strokeWidth={1.5}
                      className="
                        h-[30px]
                        w-[30px]
                        shrink-0
                        text-[#06402f]
                      "
                    />

                    <div className="min-w-0">
                      <h4
                        className="
                          font-serif
                          text-[14px]
                          leading-tight
                          text-[#12352a]
                        "
                      >
                        {benefit.title}
                      </h4>

                      <p
                        className="
                          mt-1
                          text-[10.5px]
                          leading-4
                          text-[#4a5550]
                        "
                      >
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* ======================================================
              EXPLORE ALL TOOLS
          ====================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              duration: 0.45,
              delay: 0.1,
            }}
            className="
              mt-5
              flex
              justify-center
            "
          >
            <button
              type="button"
              onClick={() => {
                const element =
                  document.getElementById("tools");

                if (element) {
                  element.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                  });
                }
              }}
              className="
                group
                inline-flex
                min-w-[205px]
                items-center
                justify-center
                gap-2.5
                rounded-[6px]
                bg-[#034536]
                px-6
                py-3
                text-[12px]
                font-medium
                text-white
                shadow-[0_7px_18px_rgba(3,69,54,0.13)]
                transition-all
                duration-300
                hover:bg-[#02503e]
                hover:shadow-[0_10px_24px_rgba(3,69,54,0.18)]
              "
            >
              Explore All Tools

              <ArrowRight
                strokeWidth={1.8}
                className="
                  h-[16px]
                  w-[16px]
                  transition-transform
                  duration-300
                  group-hover:translate-x-1
                "
              />
            </button>
          </motion.div>
        </div>
      </section>

      {/* ==========================================================
          ROI SIDE TAB

          IMPORTANT:
          This is rendered ONLY when the ToolsSection is visible.

          It is fixed to the viewport's right edge so it feels
          attached to the website, but the IntersectionObserver
          above controls whether it exists.
      ========================================================== */}

      <AnimatePresence>
        {sectionVisible && !activeTool && (
          <motion.button
            type="button"
            onClick={() => setActiveTool("roi")}
            initial={{
              opacity: 0,
              x: 70,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            exit={{
              opacity: 0,
              x: 70,
            }}
            transition={{
              type: "spring",
              stiffness: 320,
              damping: 28,
            }}
            aria-label="Open ROI Calculator"
            className="
              fixed
              right-0
              top-1/2
              z-[9990]
              -translate-y-1/2
              overflow-hidden
              rounded-l-[10px]
              border
              border-r-0
              border-[#c49a45]
              bg-[#034536]
              text-white
              shadow-[-6px_8px_30px_rgba(3,38,30,0.18)]
              transition-all
              duration-300
              hover:bg-[#02503e]
              hover:shadow-[-8px_10px_35px_rgba(3,38,30,0.24)]
            "
          >
            <span
              className="
                flex
                items-center
                gap-2
                px-3
                py-5
                [writing-mode:vertical-rl]
                rotate-180
                text-[11px]
                font-medium
                tracking-[0.08em]
                sm:px-3.5
                sm:py-6
                sm:text-[12px]
              "
            >
              <Calculator
                className="h-[17px] w-[17px] shrink-0"
                strokeWidth={1.6}
              />

              <span>
                ROI Calculator
              </span>

              <ArrowRight
                className="h-[15px] w-[15px] shrink-0"
                strokeWidth={1.7}
              />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ==========================================================
          ROI / TOOL DRAWER

          58% DESKTOP WIDTH
          92% MOBILE WIDTH

          This drawer belongs visually to the ToolsSection.
          It disappears automatically when the section leaves
          the viewport.
      ========================================================== */}

      <AnimatePresence>
        {sectionVisible && activeTool && (
          <>
            {/* ====================================================
                BACKDROP

                Covers the viewport visually while the drawer is
                open, but the drawer itself is still anchored to
                the right side.
            ==================================================== */}

            <motion.div
              key="tools-drawer-backdrop"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.25,
              }}
              onClick={closeDrawer}
              className="
                fixed
                inset-0
                z-[9997]
                bg-[#02130f]/35
                backdrop-blur-[2px]
              "
            />

            {/* ====================================================
                DRAWER
            ==================================================== */}

            <motion.aside
              key="tools-drawer"
              initial={{
                x: "100%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "100%",
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 32,
                mass: 0.8,
              }}
              className="
                fixed
                right-0
                top-0
                z-[9999]
                flex
                h-dvh
                w-[92vw]
                flex-col
                overflow-hidden
                border-l
                border-[#d8d0c2]
                bg-[#f7f4ee]
                shadow-[-20px_0_60px_rgba(0,0,0,0.18)]
                sm:w-[78vw]
                md:w-[68vw]
                lg:w-[58vw]
                lg:max-w-[900px]
              "
            >
              {/* ==================================================
                  DRAWER HEADER
              ================================================== */}

              <div
                className="
                  flex
                  shrink-0
                  items-center
                  justify-between
                  border-b
                  border-[#ddd8ce]
                  bg-white
                  px-4
                  py-3
                  sm:px-6
                  sm:py-3.5
                  lg:px-7
                  lg:py-4
                "
              >
                <div className="min-w-0">
                  <p
                    className="
                      text-[8px]
                      font-medium
                      uppercase
                      tracking-[0.18em]
                      text-[#9b762e]
                      sm:text-[9px]
                    "
                  >
                    Property Bouquet
                  </p>

                  <h2
                    className="
                      mt-0.5
                      truncate
                      font-serif
                      text-[18px]
                      leading-tight
                      text-[#07392b]
                      sm:text-[20px]
                      lg:text-[22px]
                    "
                  >
                    {activeTool === "roi"
                      ? "ROI Calculator"
                      : activeToolData?.title ||
                        "Real Estate Tool"}
                  </h2>
                </div>

                {/* Close */}

                <button
                  type="button"
                  onClick={closeDrawer}
                  aria-label="Close calculator"
                  className="
                    ml-4
                    flex
                    h-8
                    w-8
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#ddd8ce]
                    bg-[#faf9f6]
                    text-[#17382d]
                    transition-all
                    duration-200
                    hover:bg-[#eeeae2]
                    hover:rotate-90
                    sm:h-9
                    sm:w-9
                  "
                >
                  <X
                    strokeWidth={1.7}
                    className="
                      h-[16px]
                      w-[16px]
                      sm:h-[18px]
                      sm:w-[18px]
                    "
                  />
                </button>
              </div>

              {/* ==================================================
                  DRAWER BODY
              ================================================== */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                  bg-[#f7f4ee]
                "
              >
                {activeTool === "roi" ? (
                  /*
                    EXISTING BASIC ROI CALCULATOR

                    This is the same ROICalculator component
                    that was previously imported.

                    Grid card:
                      /tools/roi-calculator

                    Side tab:
                      opens this component here.
                  */
                  <div className="min-h-full w-full">
                    <ROICalculator />
                  </div>
                ) : (
                  /* =================================================
                     OTHER TOOLS — TEMPORARY PLACEHOLDER
                  ================================================= */

                  <div
                    className="
                      flex
                      min-h-[350px]
                      items-center
                      justify-center
                      px-6
                      py-12
                      text-center
                      sm:min-h-[450px]
                      sm:px-10
                    "
                  >
                    <div className="max-w-[360px]">
                      <div
                        className="
                          mx-auto
                          flex
                          h-14
                          w-14
                          items-center
                          justify-center
                          rounded-full
                          bg-[#e8eee8]
                          sm:h-16
                          sm:w-16
                        "
                      >
                        <Calculator
                          className="
                            h-7
                            w-7
                            text-[#07392b]
                            sm:h-8
                            sm:w-8
                          "
                          strokeWidth={1.5}
                        />
                      </div>

                      <h3
                        className="
                          mt-4
                          font-serif
                          text-[21px]
                          text-[#07392b]
                          sm:text-[24px]
                        "
                      >
                        Coming Soon
                      </h3>

                      <p
                        className="
                          mx-auto
                          mt-2
                          text-[12px]
                          leading-5
                          text-[#555d59]
                          sm:text-[13px]
                        "
                      >
                        This calculator will be connected to its
                        dedicated real estate tool soon.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* ==================================================
                  DRAWER FOOTER

                  Only show for ROI so the basic calculator has a
                  clear path toward the full dedicated calculator.
              ================================================== */}

              {activeTool === "roi" && (
                <div
                  className="
                    shrink-0
                    border-t
                    border-[#ddd8ce]
                    bg-white
                    px-4
                    py-3
                    sm:px-6
                    sm:py-3.5
                  "
                >
                  <Link
                    href="/tools/roi-calculator"
                    onClick={closeDrawer}
                    className="
                      group
                      flex
                      w-full
                      items-center
                      justify-center
                      gap-2
                      rounded-[6px]
                      bg-[#034536]
                      px-5
                      py-2.5
                      text-[11px]
                      font-medium
                      text-white
                      transition-all
                      duration-300
                      hover:bg-[#02503e]
                      sm:text-[12px]
                    "
                  >
                    Open Full ROI Calculator

                    <ArrowRight
                      className="
                        h-[15px]
                        w-[15px]
                        transition-transform
                        duration-300
                        group-hover:translate-x-1
                      "
                      strokeWidth={1.7}
                    />
                  </Link>
                </div>
              )}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}