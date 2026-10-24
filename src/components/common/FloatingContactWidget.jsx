
"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import PropertyBouquetChatPanel from "./PropertyBouquetChatPanel";
import {
  MessageCircle,
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
  Sparkles,
} from "lucide-react";

const SESSION_KEY = "propertyBouquetContactWidgetOpen_v1";
const WHATSAPP_URL =
  "https://wa.me/919090106101?text=Hello%20Property%20Bouquet%2C%20I%20would%20like%20to%20know%20more%20about%20your%20properties.";
const AUTO_CLOSE_DELAY = 5000;

const ACTIONS = [
  { id: "contact", label: "Contact Us", icon: "whatsapp", color: "whatsapp" },
  { id: "call", label: "Call +91 9090 106 101", icon: Phone, color: "light" },
  { id: "callback", label: "Request a Callback", icon: PhoneIncoming, color: "gold" },
  { id: "assistant", label: "Ask AI Assistant", icon: Bot, color: "light" },
];

const panelTransition = {
  type: "spring",
  stiffness: 300,
  damping: 25,
  mass: 0.72,
};

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

  // Preserve the existing five-second auto-close behaviour.
  // Chat and callback screens remain open while in use.
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
  }, [hydrated, isOpen, isHovered, activeAction, submitting]);

  const toggleWidget = () => {
    if (submitting) return;

    const next = !isOpen;
    setIsOpen(next);

    try {
      sessionStorage.setItem(SESSION_KEY, next ? "open" : "closed");
    } catch {
      // Ignore unavailable storage.
    }

    if (!next) {
      setActiveAction(null);
      setError("");
    }
  };

  const openAction = (id) => {
    setError("");
    setSubmitted(false);

    if (id === "contact") {
      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer");
      return;
    }

    if (id === "call") {
      window.location.href = "tel:+919090106101";
      return;
    }

    setActiveAction(id);
  };

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
      setError("Enter a valid 10-digit Indian mobile number.");
      return;
    }

    if (cleanEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        // The server may return a non-JSON response.
      }

      if (!response.ok) {
        throw new Error(data?.message || "Unable to submit your request.");
      }

      setSubmitted(true);
      setName("");
      setPhone("");
      setEmail("");
    } catch (err) {
      setError(err?.message || "Please try again in a moment.");
    } finally {
      setSubmitting(false);
    }
  };

  const fadeDuration = reduceMotion ? 0 : 0.3;

  if (!hydrated) return null;

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="hidden md:flex fixed bottom-6 right-5 z-[9997] flex-col items-end gap-3"
    >
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="contact-panel"
            initial={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.12, x: 12, y: 18 }
            }
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            exit={
              reduceMotion
                ? { opacity: 0 }
                : { opacity: 0, scale: 0.12, x: 8, y: 14 }
            }
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    ...panelTransition,
                    opacity: { duration: 0.18, ease: "easeOut" },
                  }
            }
            style={{ transformOrigin: "100% 100%", willChange: "transform, opacity" }}
            className={
              activeAction === "assistant"
                ? "w-[min(390px,calc(100vw-40px))]"
                : "flex w-[min(310px,calc(100vw-40px))] flex-col items-end gap-2.5"
            }
          >
            <AnimatePresence mode="wait" initial={false}>
  {!activeAction ? (
    <motion.div
      key="action-list"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -5 }}
      transition={{ duration: fadeDuration }}
      className="w-full space-y-2.5"
    >
      {ACTIONS.map((action, index) => {
        const Icon = action.icon;

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
                : { opacity: 0, x: 14, y: 4 }
            }
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
              duration: reduceMotion ? 0 : 0.32,
              delay: reduceMotion ? 0 : 0.07 + index * 0.055,
              ease: [0.22, 1, 0.36, 1],
            }}
            onClick={() => openAction(action.id)}
            whileTap={reduceMotion ? undefined : { opacity: 0.85 }}
            className="
              group flex w-full items-center gap-3
              rounded-[15px] border border-white/70
              bg-white/95 px-3.5 py-3 text-left
              shadow-[0_5px_24px_rgba(15,30,22,0.09)]
              backdrop-blur-xl
              transition-colors duration-200
            "
          >
            <span
              className={`
                flex h-10 w-10 shrink-0 items-center
                justify-center rounded-[12px]
                transition-colors duration-200
                ${
                  action.color === "whatsapp"
                    ? "border border-[#25D366]/20 bg-[#25D366]/10"
                    : action.color === "gold"
                      ? "border border-[#d9b875]/25 bg-[#c9a96e]/15 text-[#8e6827]"
                      : "border border-[#173b2b]/10 bg-[#173b2b]/[0.06] text-[#173b2b]"
                }
              `}
            >
              {action.icon === "whatsapp" ? (
                <WhatsAppIcon size={21} />
              ) : (
                <Icon size={20} strokeWidth={1.9} />
              )}
            </span>

            <span className="min-w-0 flex-1">
              <span
                className={`
                  block text-[12px] font-semibold
                  tracking-[-0.1px] text-[#1c2921]
                  transition-colors duration-300
                  ${labelHoverColor}
                `}
              >
                {action.label}
              </span>
            </span>

            <ArrowUpRight
              size={15}
              className={`
                shrink-0 transition-colors duration-200
                ${
                  action.color === "whatsapp"
                    ? "text-[#25D366]"
                    : "text-[#a0a198] group-hover:text-[#a47b35]"
                }
              `}
            />
          </motion.button>
        );
      })}
    </motion.div>
  ) : activeAction === "assistant" ? (
    <motion.section
      key="ai-assistant"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 10, scale: 0.98 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 6, scale: 0.99 }
      }
      transition={{ duration: fadeDuration }}
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
    <motion.section
      key="callback-form"
      initial={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 10, scale: 0.98 }
      }
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={
        reduceMotion
          ? { opacity: 0 }
          : { opacity: 0, y: 6, scale: 0.99 }
      }
      transition={{ duration: fadeDuration }}
      className="
        w-full overflow-hidden rounded-[18px]
        border border-[#c9a96e]/30 bg-[#0b1913]
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
            flex h-7 w-7 shrink-0 items-center
            justify-center rounded-full border
            border-white/10 text-white/70
            transition hover:bg-white/10
          "
        >
          <X size={14} />
        </button>
      </div>

      <div className="px-4 pb-4">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
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
                mt-4 text-[10px] font-semibold
                text-[#dfbd78] hover:text-white
              "
            >
              Back to contact options
            </button>
          </motion.div>
        ) : (
          <form onSubmit={submitCallback} className="space-y-2.5">
            <div className="relative">
              <UserRound
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b875]/80"
              />

              <input
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                autoComplete="name"
                aria-label="Full name"
                maxLength={100}
                required
                disabled={submitting}
                className="
                  h-10 w-full rounded-[10px]
                  border border-white/10 bg-white/[0.045]
                  pl-9 pr-3 text-[11px] text-white
                  outline-none placeholder:text-white/40
                  focus:border-[#c9a96e]/70
                "
              />
            </div>

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
                  setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
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
                  h-10 w-full rounded-[10px]
                  border border-white/10 bg-white/[0.045]
                  pl-9 pr-3 text-[11px] text-white
                  outline-none placeholder:text-white/40
                  focus:border-[#c9a96e]/70
                "
              />
            </div>

            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#d9b875]/80"
              />

              <input
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address (Optional)"
                autoComplete="email"
                aria-label="Email address, optional"
                maxLength={254}
                disabled={submitting}
                className="
                  h-10 w-full rounded-[10px]
                  border border-white/10 bg-white/[0.045]
                  pl-9 pr-3 text-[11px] text-white
                  outline-none placeholder:text-white/40
                  focus:border-[#c9a96e]/70
                "
              />
            </div>

            <AnimatePresence initial={false}>
              {error && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  role="alert"
                  className="
                    overflow-hidden rounded-lg
                    border border-red-400/20
                    bg-red-400/[0.07] px-3 py-2
                    text-[10px] text-red-300
                  "
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={submitting}
              className="
                flex h-10 w-full items-center
                justify-center gap-2 rounded-[10px]
                border border-[#f0d69a]/30
                bg-gradient-to-r from-[#c29a4d]
                via-[#dfbf78] to-[#c7a054]
                px-3 text-[9px] font-bold uppercase
                tracking-[1.1px] text-[#142016]
                transition duration-300
                hover:brightness-110 disabled:opacity-60
              "
            >
              {submitting ? (
                <>
                  <LoaderCircle size={14} className="animate-spin" />
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
              <ShieldCheck size={12} className="text-[#d9b875]/80" />
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

      <motion.button
        type="button"
        onClick={toggleWidget}
        disabled={submitting}
        aria-label={isOpen ? "Close contact menu" : "Open contact menu"}
        aria-expanded={isOpen}
        whileHover={reduceMotion ? undefined : { scale: 1.055 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        className="group relative flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-[2px] border-[#d9b875] bg-[#111b15] text-[#e4c581] shadow-[0_8px_30px_rgba(0,0,0,0.23)] transition-colors duration-300 hover:bg-[#1b3023] disabled:opacity-60"
      >
        <motion.span
          aria-hidden="true"
          className="absolute inset-[-5px] rounded-full border border-[#d9b875]/30"
          animate={
            isOpen || reduceMotion
              ? { opacity: 0, scale: 1 }
              : { opacity: [0.2, 0.65, 0.2], scale: [1, 1.12, 1] }
          }
          transition={
            reduceMotion
              ? { duration: 0 }
              : { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
          }
        />

        <AnimatePresence mode="wait" initial={false}>
          {isOpen ? (
            <motion.span
              key="close"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -100, scale: 0.45 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 100, scale: 0.45 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 23, mass: 0.65 }}
              className="flex items-center justify-center"
            >
              <X size={25} strokeWidth={1.8} />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: -100, scale: 0.45 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, rotate: 100, scale: 0.45 }}
              transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 23, mass: 0.65 }}
              className="flex items-center justify-center"
            >
              <MessageCircle size={25} strokeWidth={1.7} />
              <Sparkles size={11} className="absolute right-[15px] top-[13px] text-[#fff1bd]" />
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </div>
  );
}
