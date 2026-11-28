"use client";

import { useEffect, useState } from "react";

import Link from "next/link";

import Image from "next/image";

import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";

import dynamic from "next/dynamic";

import {


  Building2,

  Newspaper,

  Phone,

  PhoneIncoming,

  Bot,

  X,

  ArrowUpRight,

  ShieldCheck,

  UserRound,

  Mail,

  CheckCircle2,

  LoaderCircle,


} from "lucide-react";

import { FaWhatsapp } from "react-icons/fa";

// Load the AI assistant only when a visitor opens it.
const PropertyBouquetChatPanel = dynamic(
  () => import("./PropertyBouquetChatPanel"),
  {
    loading: () => (
      <div
        role="status"
        className="
          w-full
          rounded-[18px]
          bg-[#0b1913]
          px-4
          py-8
          text-center
          text-sm
          text-white/70
        "
      >
        Loading assistant...
      </div>
    ),
  }
);

const SESSION_KEY = "propertyBouquetContactWidgetOpen_v1";

const WHATSAPP_URL =

  "https://wa.me/919090106101?text=Hello%20Property%20Bouquet%2C%20I%20would%20like%20to%20know%20more%20about%20your%20properties.";

const AUTO_CLOSE_DELAY = 5000;

const PHONE_NUMBER = "919090106101";

const WHATSAPP_MESSAGE = encodeURIComponent(

  "Hi Property Bouquet, I'm interested in a property. Please assist me."

);

const ACTIONS = [

  {

    id: "contact",

    label: "Contact Us",

    icon: "whatsapp",

    color: "whatsapp",

  },

  {

    id: "call",

    label: "Call +91 9090 106 101",

    icon: Phone,

    color: "light",

  },

  {

    id: "callback",

    label: "Request a Callback",

    icon: PhoneIncoming,

    color: "gold",

  },

  {

    id: "assistant",

    label: "Ask AI Assistant",

    icon: Bot,

    color: "light",

  },

];

const panelTransition = {

  type: "spring",

  stiffness: 300,

  damping: 25,

  mass: 0.72,

};

// ============================================================

// WHATSAPP ICON FOR DESKTOP PANEL

// ============================================================

function WhatsAppIcon({ size = 20 }) {

  return (

    <svg

      width={size}

      height={size}

      viewBox="0 0 24 24"

      fill="none"

      aria-hidden="true"

      className="shrink-0"

    >

      <path

        fill="#25D366"

        d="M12.04 2C6.52 2 2.03 6.49 2.03 12.01c0 1.77.47 3.49 1.37 5L2 22l5.12-1.34a9.96 9.96 0 0 0 4.92 1.29h.01c5.52 0 10.01-4.49 10.01-10.01A9.96 9.96 0 0 0 19.13 4.9 9.96 9.96 0 0 0 12.04 2Z"

      />

      <path

        fill="#FFFFFF"

        d="M17.85 14.62c-.32-.16-1.88-.93-2.17-1.03-.29-.11-.5-.16-.71.16-.22.32-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.56.16-.19.21-.32.32-.53.1-.21.05-.4-.03-.56-.08-.16-.71-1.72-.98-2.35-.26-.62-.52-.54-.71-.55h-.61c-.21 0-.56.08-.85.4-.29.32-1.11 1.08-1.11 2.64s1.14 3.06 1.3 3.27c.16.21 2.24 3.42 5.43 4.8.76.33 1.35.53 1.81.68.76.24 1.45.21 1.99.13.61-.09 1.88-.77 2.14-1.51.27-.74.27-1.37.19-1.51-.08-.13-.29-.21-.61-.37Z"

      />

    </svg>

  );

}

// Custom assistant mark designed to stay crisp at the small launcher size.
function AssistantRobotIcon({ size = 34 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0 overflow-visible"
    >
      <path
        d="M24 7.2v4.1"
        stroke="#F4E6C5"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="5.6" r="2.7" fill="#D9B875" />
      <rect
        x="10.5"
        y="12.2"
        width="27"
        height="24"
        rx="8"
        fill="#183426"
        stroke="#F4E6C5"
        strokeWidth="2.1"
      />
      <path
        d="M10.4 21.2H8.7a2.5 2.5 0 0 0-2.5 2.5v2.9a2.5 2.5 0 0 0 2.5 2.5h1.7M37.6 21.2h1.7a2.5 2.5 0 0 1 2.5 2.5v2.9a2.5 2.5 0 0 1-2.5 2.5h-1.7"
        stroke="#D9B875"
        strokeWidth="2.1"
        strokeLinecap="round"
      />
      <circle cx="18.7" cy="22.8" r="2.05" fill="#E8CB8B" />
      <circle cx="29.3" cy="22.8" r="2.05" fill="#E8CB8B" />
      <path
        d="M18.2 29.2c1.5 1.8 3.4 2.7 5.8 2.7s4.3-.9 5.8-2.7"
        stroke="#F4E6C5"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M16.3 39.1h15.4"
        stroke="#D9B875"
        strokeWidth="1.8"
        strokeLinecap="round"
        opacity=".9"
      />
    </svg>
  );
}

// ============================================================

// MAIN FLOATING CONTACT WIDGET

// ============================================================

export default function FloatingContactWidget() {

  const reduceMotion = useReducedMotion();

  const [isOpen, setIsOpen] = useState(true);

  const [hydrated, setHydrated] = useState(false);

  const [isHovered, setIsHovered] = useState(false);

  const [activeAction, setActiveAction] = useState(null);

  const [name, setName] = useState("");

  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const [error, setError] = useState("");

  // ============================================================

  // SESSION STORAGE

  // ============================================================

  useEffect(() => {

    try {

      const saved = sessionStorage.getItem(SESSION_KEY);

      if (saved === "closed") setIsOpen(false);

      if (saved === "open") setIsOpen(true);

    } catch {

      // Session storage is optional.

    }

    setHydrated(true);

  }, []);

  // ============================================================

  // AUTO CLOSE AFTER 5 SECONDS

  // ============================================================

  useEffect(() => {

    if (

      !hydrated ||

      !isOpen ||

      isHovered ||

      activeAction ||

      submitting

    ) {

      return;

    }

    const timer = window.setTimeout(() => {

      setIsOpen(false);

      setActiveAction(null);

      setError("");

      try {

        sessionStorage.setItem(SESSION_KEY, "closed");

      } catch {

        // Ignore unavailable storage.

      }

    }, AUTO_CLOSE_DELAY);

    return () => window.clearTimeout(timer);

  }, [

    hydrated,

    isOpen,

    isHovered,

    activeAction,

    submitting,

  ]);

  // ============================================================

  // TOGGLE DESKTOP WIDGET

  // ============================================================

  const toggleWidget = () => {

    if (submitting) return;

    const next = !isOpen;

    setIsOpen(next);

    try {

      sessionStorage.setItem(

        SESSION_KEY,

        next ? "open" : "closed"

      );

    } catch {

      // Ignore unavailable storage.

    }

    if (!next) {

      setActiveAction(null);

      setError("");

    }

  };

  // ============================================================

  // CONTACT ACTIONS

  // ============================================================

  const openAction = (id) => {

    setError("");

    setSubmitted(false);

    if (id === "contact") {

      window.open(

        WHATSAPP_URL,

        "_blank",

        "noopener,noreferrer"

      );

      return;

    }

    if (id === "call") {

      window.location.href = "tel:+919090106101";

      return;

    }

    setActiveAction(id);

  };

  // ============================================================

  // CALLBACK FORM SUBMISSION

  // ============================================================

  const submitCallback = async (event) => {

    event.preventDefault();

    if (submitting || submitted) return;

    const cleanName = name.trim();

    const cleanPhone = phone.trim();

    const cleanEmail = email.trim();

    setError("");

    if (!cleanName) {

      setError("Please enter your name.");

      return;

    }

    if (!/^[6-9]\d{9}$/.test(cleanPhone)) {

      setError(

        "Enter a valid 10-digit Indian mobile number."

      );

      return;

    }

    if (

      cleanEmail &&

      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)

    ) {

      setError("Please enter a valid email address.");

      return;

    }

    try {

      setSubmitting(true);

      const response = await fetch("/api/leads", {

        method: "POST",

        headers: {

          "Content-Type": "application/json",

        },

        body: JSON.stringify({

          name: cleanName,

          phone: cleanPhone,

          email: cleanEmail,

          property: "Website Callback Request",

          source: "Website - Floating Contact Widget",

          leadType: "Website Enquiry",

          pageUrl: window.location.href,

          pagePath: window.location.pathname,

          pageTitle: document.title || "Property Bouquet",

        }),

      });

      let data = {};

      try {

        data = await response.json();

      } catch {

        // Server may return a non-JSON response.

      }

      if (!response.ok) {

        throw new Error(

          data?.message || "Unable to submit your request."

        );

      }

      setSubmitted(true);

      setName("");

      setPhone("");

      setEmail("");

    } catch (err) {

      setError(

        err?.message || "Please try again in a moment."

      );

    } finally {

      setSubmitting(false);

    }

  };

  const fadeDuration = reduceMotion ? 0 : 0.3;

  if (!hydrated) return null;

  return (

    <>

      {/* ======================================================

          DESKTOP FLOATING CONTACT WIDGET

          ====================================================== */}

      <div

        onMouseEnter={() => setIsHovered(true)}

        onMouseLeave={() => setIsHovered(false)}

        className="

          hidden

          lg:flex

          fixed

          bottom-6

          right-5

          z-[9997]

          flex-col

          items-end

          gap-3

        "

      >

        <AnimatePresence initial={false}>

          {isOpen && (

            <motion.div

              key="contact-panel"

              initial={

                reduceMotion

                  ? { opacity: 0 }

                  : {

                      opacity: 0,

                      scale: 0.12,

                      x: 12,

                      y: 18,

                    }

              }

              animate={{

                opacity: 1,

                scale: 1,

                x: 0,

                y: 0,

              }}

              exit={

                reduceMotion

                  ? { opacity: 0 }

                  : {

                      opacity: 0,

                      scale: 0.12,

                      x: 8,

                      y: 14,

                    }

              }

              transition={

                reduceMotion

                  ? { duration: 0 }

                  : {

                      ...panelTransition,

                      opacity: {

                        duration: 0.18,

                        ease: "easeOut",

                      },

                    }

              }

              style={{

                transformOrigin: "100% 100%",

                willChange: "transform, opacity",

              }}

              className={

                activeAction === "assistant"

                  ? "w-[min(390px,calc(100vw-40px))]"

                  : "flex w-[min(310px,calc(100vw-40px))] flex-col items-end gap-2.5"

              }

            >

              <AnimatePresence

                mode="wait"

                initial={false}

              >

                {/* ==========================================

                    CONTACT ACTION LIST

                    ========================================== */}

                {!activeAction ? (

                  <motion.div

                    key="action-list"

                    initial={

                      reduceMotion

                        ? { opacity: 0 }

                        : { opacity: 0, y: 8 }

                    }

                    animate={{

                      opacity: 1,

                      y: 0,

                    }}

                    exit={

                      reduceMotion

                        ? { opacity: 0 }

                        : { opacity: 0, y: -5 }

                    }

                    transition={{

                      duration: fadeDuration,

                    }}

                    className="w-full space-y-2.5"

                  >

                    {ACTIONS.map((action, index) => {

                      const Icon = action.icon;
                      const isAssistantAction = action.id === "assistant";
                      const labelHoverColor =

                        action.color === "whatsapp"

                          ? "group-hover:!text-[#25D366]"

                          : action.color === "gold"

                            ? "group-hover:!text-[#a47b35]"

                            : "group-hover:!text-[#0f6b43]";

                      return (

                        <motion.button

                          key={action.id}

                          type="button"

                          initial={

                            reduceMotion

                              ? { opacity: 1 }

                              : {

                                  opacity: 0,

                                  x: 14,

                                  y: 4,

                                }

                          }

                          animate={{

                            opacity: 1,

                            x: 0,

                            y: 0,

                          }}

                          transition={{

                            duration: reduceMotion ? 0 : 0.32,

                            delay: reduceMotion

                              ? 0

                              : 0.07 + index * 0.055,

                            ease: [0.22, 1, 0.36, 1],

                          }}

                          onClick={() => openAction(action.id)}

                          whileTap={

                            reduceMotion

                              ? undefined

                              : { opacity: 0.85 }

                          }

                          className={`
                            group relative flex w-full items-center gap-3 rounded-[15px]
                            border px-3.5 py-3 text-left backdrop-blur-xl
                            transition-all duration-300
                            ${
                              isAssistantAction
                                ? "border-[#d8ba78]/75 bg-[linear-gradient(110deg,#fffdf7_0%,#fbf7ed_54%,#eef5ef_100%)] shadow-[0_7px_26px_rgba(27,58,43,0.13),0_0_0_1px_rgba(216,186,120,0.18)] ring-1 ring-[#d8ba78]/25 hover:border-[#bd984f] hover:shadow-[0_9px_30px_rgba(27,58,43,0.17),0_0_22px_rgba(201,162,77,0.18)]"
                                : "border-white/70 bg-white/95 shadow-[0_5px_24px_rgba(15,30,22,0.09)] hover:border-[#d9b875]/50 hover:shadow-[0_7px_26px_rgba(15,30,22,0.13)]"
                            }
                          `}

                        >

                          <span

                            className={`

                              flex

                              h-10

                              w-10

                              shrink-0

                              items-center

                              justify-center

                              rounded-[12px]

                              transition-colors

                              duration-200

                              ${

                                action.color === "whatsapp"

                                  ? "border border-[#25D366]/20 bg-[#25D366]/10"

                                  : action.color === "gold"

                                    ? "border border-[#d9b875]/25 bg-[#c9a96e]/15 text-[#8e6827]"

                                    : isAssistantAction
                                      ? "border border-[#c9a24d]/35 bg-[#173b2b] text-[#f3dfae] shadow-[0_3px_12px_rgba(23,59,43,0.18)]"
                                      : "border border-[#173b2b]/10 bg-[#173b2b]/[0.06] text-[#173b2b]"

                              }

                            `}

                          >

                            {action.icon === "whatsapp" ? (
                              <WhatsAppIcon size={21} />
                            ) : isAssistantAction ? (
                              <AssistantRobotIcon size={27} />
                            ) : (
                              <Icon size={20} strokeWidth={1.9} />
                            )}

                          </span>

                          <span className="min-w-0 flex-1">
                            <span
                              className={`block text-[12px] font-semibold tracking-[-0.1px] ${
                                isAssistantAction ? "text-[#123c2b]" : "text-[#1c2921]"
                              } transition-colors duration-300 ${labelHoverColor}`}
                            >
                              {action.label}
                            </span>
                            {isAssistantAction && (
                              <span className="mt-0.5 block text-[8px] font-medium tracking-[0.55px] text-[#6b806f]">
                                SMART PROPERTY GUIDANCE
                              </span>
                            )}
                          </span>

                          {isAssistantAction && (
                            <span className="shrink-0 rounded-full border border-[#c9a24d]/35 bg-[#f4ead0] px-2 py-1 text-[8px] font-bold tracking-[0.7px] text-[#80612a]">
                              AI
                            </span>
                          )}
                          <ArrowUpRight
                            size={15}
                            className={`shrink-0 transition-colors duration-200 ${
                              action.color === "whatsapp"
                                ? "text-[#25D366]"
                                : isAssistantAction
                                  ? "text-[#9b783d] group-hover:text-[#143f2d]"
                                  : "text-[#a0a198] group-hover:text-[#a47b35]"
                            }`}
                          />

                        </motion.button>

                      );

                    })}

                  </motion.div>

                ) : activeAction === "assistant" ? (

                  /* ==========================================

                     AI ASSISTANT

                     ========================================== */

                  <motion.section

                    key="ai-assistant"

                    initial={

                      reduceMotion

                        ? { opacity: 0 }

                        : {

                            opacity: 0,

                            y: 10,

                            scale: 0.98,

                          }

                    }

                    animate={{

                      opacity: 1,

                      y: 0,

                      scale: 1,

                    }}

                    exit={

                      reduceMotion

                        ? { opacity: 0 }

                        : {

                            opacity: 0,

                            y: 6,

                            scale: 0.99,

                          }

                    }

                    transition={{

                      duration: fadeDuration,

                    }}

                    className="w-full"

                  >

                    <PropertyBouquetChatPanel

                      onClose={() => {

                        setActiveAction(null);

                        setError("");

                      }}

                    />

                  </motion.section>

                ) : (

                  /* ==========================================

                     CALLBACK FORM

                     ========================================== */

                  <motion.section

                    key="callback-form"

                    initial={

                      reduceMotion

                        ? { opacity: 0 }

                        : {

                            opacity: 0,

                            y: 10,

                            scale: 0.98,

                          }

                    }

                    animate={{

                      opacity: 1,

                      y: 0,

                      scale: 1,

                    }}

                    exit={

                      reduceMotion

                        ? { opacity: 0 }

                        : {

                            opacity: 0,

                            y: 6,

                            scale: 0.99,

                          }

                    }

                    transition={{

                      duration: fadeDuration,

                    }}

                    className="

                      w-full

                      overflow-hidden

                      rounded-[18px]

                      border

                      border-[#c9a96e]/30

                      bg-[#0b1913]

                      shadow-[0_18px_55px_rgba(0,0,0,0.24)]

                    "

                  >

                    <div className="h-[2px] bg-gradient-to-r from-transparent via-[#dfbd78] to-transparent" />

                    <div className="flex items-start justify-between gap-3 px-4 pb-3 pt-4">

                      <div>

                        <p className="text-[8px] font-semibold uppercase tracking-[2px] text-[#d9b875]">

                          Property Bouquet

                        </p>

                        <h3 className="mt-2 font-serif text-[23px] leading-tight text-white">

                          Request a Callback

                        </h3>

                        <p className="mt-1.5 text-[10px] leading-relaxed text-white/60">

                          Leave your details and our team will contact you.

                        </p>

                      </div>

                      <button

                        type="button"

                        aria-label="Back to contact options"

                        onClick={() => {

                          setActiveAction(null);

                          setError("");

                          setSubmitted(false);

                        }}

                        disabled={submitting}

                        className="

                          flex

                          h-7

                          w-7

                          shrink-0

                          items-center

                          justify-center

                          rounded-full

                          border

                          border-white/10

                          text-white/70

                          transition

                          hover:bg-white/10

                        "

                      >

                        <X size={14} />

                      </button>

                    </div>

                    <div className="px-4 pb-4">

                      {submitted ? (

                        <motion.div

                          initial={{

                            opacity: 0,

                            y: 8,

                          }}

                          animate={{

                            opacity: 1,

                            y: 0,

                          }}

                          className="py-5 text-center"

                        >

                          <CheckCircle2

                            size={35}

                            className="mx-auto text-[#dfbd78]"

                            strokeWidth={1.5}

                          />

                          <h4 className="mt-3 font-serif text-xl text-white">

                            Thank You!

                          </h4>

                          <p className="mt-2 text-[11px] leading-relaxed text-white/65">

                            Your callback request has been received.

                          </p>

                          <button

                            type="button"

                            onClick={() => {

                              setActiveAction(null);

                              setSubmitted(false);

                            }}

                            className="

                              mt-4

                              text-[10px]

                              font-semibold

                              text-[#dfbd78]

                              hover:text-white

                            "

                          >

                            Back to contact options

                          </button>

                        </motion.div>

                      ) : (

                        <form

                          onSubmit={submitCallback}

                          className="space-y-2.5"

                        >

                          {/* NAME */}

                          <div className="relative">

                            <UserRound

                              size={14}

                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b875]/80"

                            />

                            <input

                              name="name"

                              value={name}

                              onChange={(e) =>

                                setName(e.target.value)

                              }

                              placeholder="Full Name"

                              autoComplete="name"

                              aria-label="Full name"

                              maxLength={100}

                              required

                              disabled={submitting}

                              className="

                                h-10

                                w-full

                                rounded-[10px]

                                border

                                border-white/10

                                bg-white/[0.045]

                                pl-9

                                pr-3

                                text-[11px]

                                text-white

                                outline-none

                                placeholder:text-white/40

                                focus:border-[#c9a96e]/70

                              "

                            />

                          </div>

                          {/* PHONE */}

                          <div className="relative">

                            <Phone

                              size={14}

                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b875]/80"

                            />

                            <input

                              name="phone"

                              type="tel"

                              value={phone}

                              onChange={(e) =>

                                setPhone(

                                  e.target.value

                                    .replace(/\D/g, "")

                                    .slice(0, 10)

                                )

                              }

                              placeholder="10-Digit Mobile Number"

                              inputMode="numeric"

                              autoComplete="tel-national"

                              pattern="[6-9][0-9]{9}"

                              title="Enter a valid 10-digit Indian mobile number."

                              aria-label="Mobile number"

                              maxLength={10}

                              required

                              disabled={submitting}

                              className="

                                h-10

                                w-full

                                rounded-[10px]

                                border

                                border-white/10

                                bg-white/[0.045]

                                pl-9

                                pr-3

                                text-[11px]

                                text-white

                                outline-none

                                placeholder:text-white/40

                                focus:border-[#c9a96e]/70

                              "

                            />

                          </div>

                          {/* EMAIL */}

                          <div className="relative">

                            <Mail

                              size={14}

                              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b875]/80"

                            />

                            <input

                              name="email"

                              type="email"

                              value={email}

                              onChange={(e) =>

                                setEmail(e.target.value)

                              }

                              placeholder="Email Address (Optional)"

                              autoComplete="email"

                              aria-label="Email address, optional"

                              maxLength={254}

                              disabled={submitting}

                              className="

                                h-10

                                w-full

                                rounded-[10px]

                                border

                                border-white/10

                                bg-white/[0.045]

                                pl-9

                                pr-3

                                text-[11px]

                                text-white

                                outline-none

                                placeholder:text-white/40

                                focus:border-[#c9a96e]/70

                              "

                            />

                          </div>

                          {/* ERROR */}

                          <AnimatePresence initial={false}>

                            {error && (

                              <motion.p

                                initial={{

                                  opacity: 0,

                                  height: 0,

                                }}

                                animate={{

                                  opacity: 1,

                                  height: "auto",

                                }}

                                exit={{

                                  opacity: 0,

                                  height: 0,

                                }}

                                role="alert"

                                className="

                                  overflow-hidden

                                  rounded-lg

                                  border

                                  border-red-400/20

                                  bg-red-400/[0.07]

                                  px-3

                                  py-2

                                  text-[10px]

                                  text-red-300

                                "

                              >

                                {error}

                              </motion.p>

                            )}

                          </AnimatePresence>

                          {/* SUBMIT */}

                          <button

                            type="submit"

                            disabled={submitting}

                            className="

                              flex

                              h-10

                              w-full

                              items-center

                              justify-center

                              gap-2

                              rounded-[10px]

                              border

                              border-[#f0d69a]/30

                              bg-gradient-to-r

                              from-[#c29a4d]

                              via-[#dfbf78]

                              to-[#c7a054]

                              px-3

                              text-[9px]

                              font-bold

                              uppercase

                              tracking-[1.1px]

                              text-[#142016]

                              transition

                              duration-300

                              hover:brightness-110

                              disabled:opacity-60

                            "

                          >

                            {submitting ? (

                              <>

                                <LoaderCircle

                                  size={14}

                                  className="animate-spin"

                                />

                                Submitting...

                              </>

                            ) : (

                              <>

                                Request My Callback

                                <ArrowUpRight size={14} />

                              </>

                            )}

                          </button>

                          <p className="flex items-center justify-center gap-1.5 pt-1 text-[9px] text-white/45">

                            <ShieldCheck

                              size={12}

                              className="text-[#d9b875]/80"

                            />

                            Your details remain confidential.

                          </p>

                        </form>

                      )}

                    </div>

                  </motion.section>

                )}

              </AnimatePresence>

            </motion.div>

          )}

        </AnimatePresence>

        {/* ================================================

            DESKTOP TOGGLE BUTTON

            ================================================ */}

        <motion.button
          type="button"
          onClick={toggleWidget}
          disabled={submitting}
          aria-label={
            isOpen
              ? "Close contact menu"
              : "Open AI assistant and contact options"
          }
          aria-expanded={isOpen}
          whileHover={reduceMotion ? undefined : { scale: 1.045 }}
          whileTap={reduceMotion ? undefined : { scale: 0.96 }}
          className="
            group
            relative
            flex
            h-[56px]
            shrink-0
            items-center
            justify-center
            gap-1.5
            border-0
            bg-transparent
            p-0
            outline-none
            disabled:opacity-60
          "
        >
          {/* Compact assistant label shown only while the widget is closed. */}
          {!isOpen && (
            <motion.span
              initial={reduceMotion ? false : { opacity: 0, x: 7, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0, x: 5, scale: 0.98 }}
              transition={{ duration: reduceMotion ? 0 : 0.2, ease: "easeOut" }}
              className="
                relative
                z-[1]
                flex
                h-9
                items-center
                gap-1.5
                rounded-full
                border
                border-[#173b2b]/10
                bg-white/95
                px-3
                text-[11px]
                font-semibold
                tracking-[-0.2px]
                text-[#1c2921]
                shadow-[0_4px_18px_rgba(15,30,22,0.10)]
                backdrop-blur-xl
                transition-all
                duration-300
                group-hover:border-[#d9b875]/65
                group-hover:shadow-[0_5px_22px_rgba(15,30,22,0.14)]
              "
            >
              <motion.span
                aria-hidden="true"
                className="h-[6px] w-[6px] rounded-full bg-[#10b981] shadow-[0_0_0_3px_rgba(16,185,129,0.10)]"
                animate={reduceMotion ? undefined : { opacity: [1, 0.72, 1], scale: [1, 0.88, 1] }}
                transition={reduceMotion ? undefined : { duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
              Ask Anything
            </motion.span>
          )}

          {/* Layered ambient glow and fine pulse ring around the launcher. */}
          <span className="relative flex h-[56px] w-[56px] shrink-0 items-center justify-center">
            {!isOpen && (
              <>
                {/* Warm champagne halo with a soft emerald core. */}
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-24px] rounded-full bg-[radial-gradient(circle,rgba(217,184,117,0.38)_0%,rgba(217,184,117,0.22)_30%,rgba(16,80,54,0.12)_52%,rgba(217,184,117,0)_74%)] blur-[10px]"
                  animate={
                    reduceMotion
                      ? { opacity: 0.6, scale: 1 }
                      : { opacity: [0.38, 0.92, 0.38], scale: [0.82, 1.16, 0.82] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 2.8, repeat: Infinity, ease: "easeInOut" }
                  }
                />
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-8px] rounded-full border border-[#e8cc8f]/75 shadow-[0_0_14px_rgba(217,184,117,0.28)]"
                  animate={
                    reduceMotion
                      ? { opacity: 0.48, scale: 1 }
                      : { opacity: [0.62, 0], scale: [0.92, 1.28] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 2.35, repeat: Infinity, repeatDelay: 0.12, ease: "easeOut" }
                  }
                />
                <motion.span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-8px] rounded-full border border-[#6ca78a]/55"
                  animate={
                    reduceMotion
                      ? { opacity: 0.28, scale: 1 }
                      : { opacity: [0.48, 0], scale: [0.92, 1.22] }
                  }
                  transition={
                    reduceMotion
                      ? { duration: 0 }
                      : { duration: 2.35, delay: 1.15, repeat: Infinity, repeatDelay: 0.12, ease: "easeOut" }
                  }
                />
              </>
            )}

            <motion.span
              animate={
                !isOpen && !reduceMotion
                  ? {
                      scale: [1, 1.025, 1],
                      boxShadow: [
                        "0 7px 25px rgba(0,0,0,0.24), 0 0 16px rgba(201,162,77,0.22), 0 0 0 1px rgba(217,184,117,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
                        "0 9px 30px rgba(0,0,0,0.25), 0 0 30px rgba(217,184,117,0.42), 0 0 12px rgba(36,112,75,0.24), inset 0 1px 0 rgba(255,255,255,0.18)",
                        "0 7px 25px rgba(0,0,0,0.24), 0 0 16px rgba(201,162,77,0.22), 0 0 0 1px rgba(217,184,117,0.10), inset 0 1px 0 rgba(255,255,255,0.12)",
                      ],
                    }
                  : { scale: 1 }
              }
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : { duration: 2.8, repeat: isOpen ? 0 : Infinity, ease: "easeInOut" }
              }
              className="
                relative z-[1] flex h-[56px] w-[56px] items-center justify-center
                rounded-full border-[2px] border-[#e0c27d]
                bg-[linear-gradient(145deg,#244a35_0%,#14291d_58%,#09140f_100%)]
                text-[#f4e6c5] transition-colors duration-300
                group-hover:border-[#fff0c2]
              "
            >
              {!isOpen && (
                <>
                  {/* Small, crisp availability indicator attached to the icon. */}
                  <span
                    aria-label="Online"
                    className="
                      absolute
                      -right-[2px]
                      -top-[2px]
                      z-20
                      h-[14px]
                      w-[14px]
                      rounded-full
                      border-[2.5px]
                      border-[#102017]
                      bg-[#10c987]
                      shadow-[0_0_0_2px_rgba(16,201,135,0.16),0_0_9px_rgba(16,201,135,0.55)]
                    "
                  />
                  <AssistantRobotIcon size={35} />
                </>
              )}

              <AnimatePresence mode="wait" initial={false}>
                {isOpen && (
                  <motion.span
                    key="close"
                    initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -100, scale: 0.45 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 100, scale: 0.45 }}
                    transition={
                      reduceMotion
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 360, damping: 23, mass: 0.65 }
                    }
                    className="relative z-[1] flex items-center justify-center"
                  >
                    <X size={24} strokeWidth={1.9} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.span>
          </span>
        </motion.button>

      </div>

      {/* ======================================================

          MOBILE BOTTOM NAVIGATION

          EXACT ORIGINAL FLOATING CONTACT DESIGN

          ====================================================== */}

      <div

        className="

          lg:hidden

          fixed

          bottom-0

          left-0

          right-0

          z-[9999]

          h-[78px]

          bg-[#07120f]/95

          backdrop-blur-2xl

          border-t

          border-[#c9a64b]/15

          shadow-[0_-18px_45px_rgba(0,0,0,0.45)]

          pb-[env(safe-area-inset-bottom)]

        "

      >

        {/* ================================================

            FLOATING PROPERTY BOUQUET LOGO

            ================================================ */}

        <Link

          href="/"

          aria-label="Property Bouquet Home"

          className="

            absolute

            left-1/2

            -translate-x-1/2

            -top-8

            w-[74px]

            h-[74px]

            rounded-full

            bg-white

            border-[5px]

            border-[#07120f]

            shadow-[0_12px_35px_rgba(0,0,0,0.25)]

            flex

            items-center

            justify-center

            overflow-hidden

          "

        >

          <Image

            src="/logo.webp"

            alt="Property Bouquet"

            width={46}

            height={46}

            className="object-contain"

          />

        </Link>

        {/* ================================================

            MOBILE NAVIGATION ITEMS

            ================================================ */}

        <div className="grid grid-cols-4 h-full px-3">

          {/* ==========================================

              PROPERTIES

              ========================================== */}

          <Link

            href="/properties"

            className="

              flex

              flex-col

              items-center

              justify-center

              pr-5

              gap-1

              border-r

              border-[#c9a64b]/10

              active:bg-white/5

              transition-all

            "

          >

            <Building2

              size={20}

              strokeWidth={2}

              className="text-[#c9a64b]"

            />

            <span

              className="

                text-[10px]

                font-medium

                tracking-[0.4px]

                text-white

              "

            >

              Properties

            </span>

          </Link>

          {/* ==========================================

              INSIGHTS

              ========================================== */}

          <Link

            href="/insights"

            className="

              flex

              flex-col

              items-center

              justify-center

              pr-8

              gap-1

              border-r

              border-[#c9a64b]/10

              active:bg-white/5

              transition-all

            "

          >

            <Newspaper

              size={20}

              strokeWidth={2}

              className="text-[#c9a64b]"

            />

            <span

              className="

                text-[10px]

                font-medium

                tracking-[0.4px]

                text-white

              "

            >

              Insights

            </span>

          </Link>

          {/* ==========================================

              CALL

              ========================================== */}

          <a

            href={`tel:+${PHONE_NUMBER}`}

            aria-label="Call Property Bouquet"

            className="

              flex

              flex-col

              items-center

              justify-center

              pl-8

              gap-1

              border-r

              border-[#c9a64b]/10

              active:bg-white/5

              transition-all

            "

          >

            <Phone

              size={20}

              strokeWidth={2}

              className="text-[#c9a64b]"

            />

            <span

              className="

                text-[10px]

                font-medium

                tracking-[0.4px]

                text-white

              "

            >

              Call

            </span>

          </a>

          {/* ==========================================

              WHATSAPP

              ========================================== */}

          <a

            href={`https://wa.me/${PHONE_NUMBER}?text=${WHATSAPP_MESSAGE}`}

            target="_blank"

            rel="noopener noreferrer"

            aria-label="Chat with Property Bouquet on WhatsApp"

            className="

              flex

              flex-col

              items-center

              justify-center

              pl-5

              gap-1

              active:bg-white/5

              transition-all

            "

          >

            <FaWhatsapp

              size={21}

              className="text-[#25D366]"

            />

            <span

              className="

                text-[10px]

                font-medium

                tracking-[0.4px]

                text-white

              "

            >

              WhatsApp

            </span>

          </a>

        </div>

      </div>

    </>

  );

}
