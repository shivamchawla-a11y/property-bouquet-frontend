"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  BadgeCheck,
  Building2,
  CircleStop,
  Headset,
  RotateCcw,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const WELCOME_MESSAGE =
  "Hello! Welcome to Property Bouquet. I'm your Property Bouquet Assistant. I can help you explore published properties, compare projects, understand locations and guide you through your property search. What are you looking for today?";

const QUICK_ACTIONS = [
  {
    label: "Explore properties",
    message: "Help me explore the properties currently published on Property Bouquet.",
    icon: Building2,
  },
  {
    label: "Compare projects",
    message: "Help me compare relevant published projects in Gurgaon.",
    icon: Sparkles,
  },
  {
    label: "Buying guidance",
    message: "What should I verify before buying a property in Gurgaon?",
    icon: ShieldCheck,
  },
  {
    label: "Arrange an expert call",
    message: "Please arrange an expert call for me.",
    icon: Headset,
  },
];

const MAX_MESSAGE_LENGTH = 1600;
// Keep this component dependency-light: message formatting is handled safely below without raw HTML.
const CHAT_ENDPOINT = "/api/assistant/chat";
const LEAD_ENDPOINT = "/api/leads";

const DIRECT_CALL_REQUEST =
  /\b(call me|give me a call|callback|call back|request (?:an? )?(?:expert )?call|arrange (?:an? )?(?:expert )?call|schedule (?:an? )?(?:expert )?call|book (?:an? )?(?:expert )?call|speak to (?:an? )?(?:expert|advisor|agent|consultant)|talk to (?:an? )?(?:expert|advisor|agent|consultant)|connect me (?:with|to) (?:an? )?(?:expert|advisor|agent|consultant)|have someone call)\b/i;
const NEGATIVE_CALL_REQUEST =
  /\b(don't|do not|dont|no|not now|maybe later|not interested)\b.{0,35}\b(call|callback|advisor|expert)\b/i;
const POSITIVE_CONFIRMATION =
  /^(yes|yes please|yeah|yep|sure|okay|ok|please|go ahead|that would be great|please do|arrange it|do that|sounds good)[.! ]*$/i;
const CALL_OFFER =
  /\b(?:would you like|shall i|should i|can i|may i|want me to).{0,85}\b(?:arrange|schedule|book|request|organise|organize|connect|have|ask).{0,60}\b(?:an? )?(?:expert|advisor|property|sales)? ?(?:call|callback|team|specialist|advisor)\b|\b(?:i can|i'd be happy to|let me).{0,45}\b(?:arrange|schedule|book|request|organise|organize)\b.{0,45}\b(?:an? )?(?:expert )?(?:call|callback)\b/i;

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

const CHAT_SESSION_STORAGE_KEY = "pb_assistant_visitor_id_v1";

function createVisitorUuid() {
  if (typeof window !== "undefined" && window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (character) => {
    const random = Math.floor(Math.random() * 16);
    const value = character === "x" ? random : (random & 0x3) | 0x8;
    return value.toString(16);
  });
}

function getOrCreateChatSessionId() {
  if (typeof window === "undefined") return "";

  try {
    const existing = window.localStorage.getItem(CHAT_SESSION_STORAGE_KEY);
    if (existing && /^[a-f0-9-]{36}$/i.test(existing)) return existing;

    const created = createVisitorUuid();
    window.localStorage.setItem(CHAT_SESSION_STORAGE_KEY, created);
    return created;
  } catch {
    // Storage-blocked browsers still receive a valid ID; persistence then lasts
    // only for the life of this mounted chat panel.
    return createVisitorUuid();
  }
}

function extractContactDetails(history) {
  const userMessages = (history || []).filter((item) => item?.role === "user");
  let phone = "";
  let name = "";

  for (const item of [...userMessages].reverse()) {
    const value = String(item.text || item.content || "");
    const phoneMatch = value.match(/(?:\+?91[\s().-]*)?([6-9](?:[\s().-]*\d){9})(?!\d)/);
    if (!phone && phoneMatch) phone = phoneMatch[1].replace(/\D/g, "");

    if (!name) {
      const nameMatch = value.match(/(?:my name is|i am|i'm|this is|name\s*[:=-]|mera naam(?: hai)?|mera name(?: hai)?)\s+([\p{L}\p{M}][\p{L}\p{M} .'-]{1,49})/iu);
      let candidate = nameMatch?.[1] || "";

      // Also accept a simple "Rahul 9876543210" reply after the assistant
      // has asked for contact details, while avoiding phone/call words.
      if (!candidate && phoneMatch) {
        candidate = value.slice(0, phoneMatch.index)
          .replace(/^(?:hi|hello)\s+/i, "")
          .replace(/^[,;:\s-]+|[,;:\s-]+$/g, "");
      }

      candidate = candidate
        .split(/\b(?:and|aur|my|i|phone|number|mobile|no|call|contact)\b/i)[0]
        .trim()
        .replace(/\s+(?:hai|hoon|hun|is)$/iu, "")
        .replace(/^[,;:\s-]+|[.,;:\s-]+$/g, "");

      const nonNameOpening = /^(?:interested|looking|searching|planning|considering|from|based|here|happy|unable|currently|seeking|thinking|going|ready|exploring|visiting|new|a|an|the)\b/i;
      if (nonNameOpening.test(candidate)) candidate = "";

      if (candidate.length >= 2 && candidate.length <= 50 && /^[\p{L}\p{M}][\p{L}\p{M} .'-]*$/u.test(candidate)) {
        name = candidate;
      }
    }
  }

  return { name, phone };
}

function AssistantMark({ size = 24 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <path d="M24 7v4" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      <circle cx="24" cy="5.5" r="2.5" fill="#D9B875" />
      <rect x="10" y="12" width="28" height="25" rx="8" fill="#173B2B" stroke="#E9D6A8" strokeWidth="2" />
      <path d="M10 21H8.5A2.5 2.5 0 0 0 6 23.5v3A2.5 2.5 0 0 0 8.5 29H10M38 21h1.5a2.5 2.5 0 0 1 2.5 2.5v3a2.5 2.5 0 0 1-2.5 2.5H38" stroke="#D9B875" strokeWidth="2" strokeLinecap="round" />
      <circle cx="18.5" cy="23" r="2.1" fill="#F1D99F" />
      <circle cx="29.5" cy="23" r="2.1" fill="#F1D99F" />
      <path d="M18 29.5c1.6 1.7 3.6 2.5 6 2.5s4.4-.8 6-2.5" stroke="#F4E8CC" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function renderInline(rawText, keyPrefix, tone = "assistant") {
  // Some model responses escape Markdown characters. Normalise those first so
  // bold and italic formatting is rendered instead of showing the raw markers.
  const text = String(rawText ?? "").replace(/\\([*_`])/g, "$1");
  const tokenPattern = /(\*\*[\s\S]+?\*\*|__[\s\S]+?__|`[^`\n]+`|\*[^*\n]+\*|_[^_\n]+_|\[[^\]]+\]\(https?:\/\/[^)\s]+\)|https?:\/\/[^\s<>]+)/g;
  const parts = text.split(tokenPattern);
  const isUser = tone === "user";

  return parts.map((part, index) => {
    const key = `${keyPrefix}-${index}`;
    const markdownLink = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)$/);
    const rawUrl = part.match(/^https?:\/\/[^\s<>]+$/);

    if (markdownLink) {
      return (
        <a
          key={key}
          href={markdownLink[2]}
          target="_blank"
          rel="noopener noreferrer"
          className={`font-semibold underline underline-offset-2 ${
            isUser ? "text-[#F4DDAA] decoration-white/40 hover:text-white" : "text-[#98702C] decoration-[#C9A24D]/50 hover:text-[#173B2B]"
          }`}
        >
          {markdownLink[1]}
          <ArrowUpRight className="ml-0.5 inline-block" size={11} />
        </a>
      );
    }

    if (rawUrl) {
      const safeUrl = part.replace(/[.,!?;:)\]]+$/, "");
      const trailing = part.slice(safeUrl.length);
      return (
        <span key={key} className="contents">
          <a
            href={safeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`break-all font-semibold underline underline-offset-2 ${
              isUser ? "text-[#F4DDAA] decoration-white/40 hover:text-white" : "text-[#98702C] decoration-[#C9A24D]/50 hover:text-[#173B2B]"
            }`}
          >
            {safeUrl}
          </a>
          {trailing}
        </span>
      );
    }

    if (
      (part.startsWith("**") && part.endsWith("**") && part.length > 4) ||
      (part.startsWith("__") && part.endsWith("__") && part.length > 4)
    ) {
      return (
        <strong key={key} className={`font-bold ${isUser ? "text-white" : "text-[#173B2B]"}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (
      (part.startsWith("*") && part.endsWith("*") && part.length > 2) ||
      (part.startsWith("_") && part.endsWith("_") && part.length > 2)
    ) {
      return <em key={key}>{part.slice(1, -1)}</em>;
    }

    if (part.startsWith("`") && part.endsWith("`") && part.length > 2) {
      return (
        <code
          key={key}
          className={`rounded px-1 py-0.5 font-mono text-[0.92em] ${
            isUser ? "bg-white/15 text-white" : "bg-[#F3F0E8] text-[#5B4928]"
          }`}
        >
          {part.slice(1, -1)}
        </code>
      );
    }

    // Do not expose unmatched Markdown delimiters if a model response contains
    // an incomplete bold/italic marker. Plain text remains readable.
    const cleanPart = part.replace(/\\([*_`])/g, "$1").replace(/\*\*/g, "").replace(/__/g, "");
    return <span key={key}>{cleanPart}</span>;
  });
}

function MessageText({ text, tone = "assistant" }) {
  const lines = String(text ?? "").replace(/\r/g, "").split("\n");
  const blocks = [];
  let index = 0;
  let blockNumber = 0;

  const isTableRow = (line) => {
    const value = line.trim();
    return value.includes("|") && (value.startsWith("|") || value.endsWith("|"));
  };
  const isTableDivider = (line) =>
    /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
  const tableCells = (line) =>
    line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
  const isHeading = (line) => /^#{1,4}\s+/.test(line.trim());
  const isBullet = (line) => /^\s*[-*+]\s+/.test(line);
  const isNumbered = (line) => /^\s*\d+[.)]\s+/.test(line);
  const isQuote = (line) => /^\s*>\s?/.test(line);
  const isFence = (line) => /^\s*```/.test(line);
  const isRule = (line) => /^\s*(?:---+|___+|\*\s*\*\s*\*+)\s*$/.test(line);
  const startsBlock = (line, nextLine = "") =>
    isHeading(line) || isBullet(line) || isNumbered(line) || isQuote(line) ||
    isFence(line) || isRule(line) || (isTableRow(line) && isTableDivider(nextLine));

  while (index < lines.length) {
    const line = lines[index].trimEnd();
    const key = `block-${blockNumber++}`;

    if (!line.trim()) {
      index += 1;
      continue;
    }

    // Fenced code blocks are rendered as text, never as executable HTML.
    if (isFence(line)) {
      const language = line.trim().replace(/^```/, "").trim();
      index += 1;
      const codeLines = [];
      while (index < lines.length && !isFence(lines[index])) {
        codeLines.push(lines[index]);
        index += 1;
      }
      if (index < lines.length) index += 1;
      blocks.push(
        <pre key={key} className="my-2 max-w-full overflow-x-auto rounded-xl border border-[#E8E1D2] bg-[#F4F1E9] p-3 text-[10px] leading-relaxed text-[#39463C]">
          {language && <span className="mb-1 block text-[8px] font-semibold uppercase tracking-wider text-[#9A8253]">{language}</span>}
          <code className="whitespace-pre-wrap break-words font-mono">{codeLines.join("\n")}</code>
        </pre>
      );
      continue;
    }

    // Only treat pipe-separated content as a table when a Markdown divider
    // follows the header. This avoids turning ordinary sentences into tables.
    if (isTableRow(line) && index + 1 < lines.length && isTableDivider(lines[index + 1])) {
      const headers = tableCells(line);
      index += 2;
      const rows = [];
      while (index < lines.length && isTableRow(lines[index]) && lines[index].trim()) {
        rows.push(tableCells(lines[index]));
        index += 1;
      }
      blocks.push(
        <div key={key} className="my-2 max-w-full overflow-x-auto rounded-xl border border-[#E8E1D2]">
          <table className="w-full min-w-[290px] border-collapse text-left text-[10px] leading-relaxed">
            <thead className="bg-[#F4F0E5] text-[#314638]">
              <tr>
                {headers.map((cell, cellIndex) => (
                  <th key={cellIndex} className="border-b border-[#E3D8BD] px-2.5 py-2 font-bold">
                    {renderInline(cell, `${key}-head-${cellIndex}`, tone)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="odd:bg-white even:bg-[#FBFAF7]">
                  {headers.map((_, cellIndex) => (
                    <td key={cellIndex} className="border-b border-[#F0ECE3] px-2.5 py-2 align-top">
                      {renderInline(row[cellIndex] ?? "—", `${key}-row-${rowIndex}-${cellIndex}`, tone)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    const heading = line.trim().match(/^(#{1,4})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const headingClass = level <= 2
        ? "pt-1 text-[12px] font-bold leading-snug text-[#173B2B]"
        : "pt-1 text-[11px] font-bold leading-snug text-[#314638]";
      blocks.push(
        <p key={key} className={headingClass}>
          {renderInline(heading[2], key, tone)}
        </p>
      );
      index += 1;
      continue;
    }

    if (isRule(line)) {
      blocks.push(<div key={key} className="my-2 h-px bg-[#EAE4D7]" />);
      index += 1;
      continue;
    }

    if (isQuote(line)) {
      const quoteLines = [];
      while (index < lines.length && isQuote(lines[index])) {
        quoteLines.push(lines[index].replace(/^\s*>\s?/, "").trim());
        index += 1;
      }
      blocks.push(
        <blockquote key={key} className="my-1 border-l-2 border-[#C9A24D] pl-3 text-[#647066]">
          {quoteLines.map((quoteLine, quoteIndex) => (
            <p key={quoteIndex}>{renderInline(quoteLine, `${key}-quote-${quoteIndex}`, tone)}</p>
          ))}
        </blockquote>
      );
      continue;
    }

    if (isBullet(line) || isNumbered(line)) {
      const ordered = isNumbered(line);
      const items = [];
      while (index < lines.length && (ordered ? isNumbered(lines[index]) : isBullet(lines[index]))) {
        const itemText = lines[index].trim().replace(ordered ? /^\d+[.)]\s+/ : /^[-*+]\s+/, "");
        items.push(itemText);
        index += 1;
      }
      const ListTag = ordered ? "ol" : "ul";
      blocks.push(
        <ListTag
          key={key}
          className={ordered ? "my-1.5 list-decimal space-y-1 pl-5 marker:font-semibold marker:text-[#98702C]" : "my-1.5 list-disc space-y-1 pl-5 marker:text-[#C49A4A]"}
        >
          {items.map((item, itemIndex) => (
            <li key={itemIndex} className="pl-0.5">
              {renderInline(item, `${key}-item-${itemIndex}`, tone)}
            </li>
          ))}
        </ListTag>
      );
      continue;
    }

    // Join wrapped lines in a paragraph while preserving intentional blank
    // lines as paragraph breaks.
    const paragraphLines = [line.trim()];
    index += 1;
    while (index < lines.length && lines[index].trim()) {
      const nextLine = lines[index].trim();
      const followingLine = index + 1 < lines.length ? lines[index + 1] : "";
      if (startsBlock(nextLine, followingLine)) break;
      paragraphLines.push(nextLine);
      index += 1;
    }
    blocks.push(
      <p key={key} className="leading-[1.7]">
        {renderInline(paragraphLines.join(" "), key, tone)}
      </p>
    );
  }

  return <div className="space-y-2 break-words">{blocks}</div>;
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5" aria-label="Assistant is responding">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8C18B]/60 bg-[#F1E8D5] text-[#173B2B]">
        <AssistantMark size={21} />
      </div>
      <div className="rounded-[17px] rounded-bl-[5px] border border-[#EAE5D9] bg-white px-4 py-3 shadow-[0_4px_14px_rgba(26,43,33,0.05)]">
        <div className="flex items-center gap-1.5">
          {[0, 1, 2].map((dot) => (
            <motion.span
              key={dot}
              className="h-1.5 w-1.5 rounded-full bg-[#A88748]"
              animate={{ y: [0, -4, 0], opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 0.7, repeat: Infinity, delay: dot * 0.13 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function LeadCaptureCard({
  name,
  phone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  submitting,
  submitted,
  error,
  onDismiss,
  required = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="ml-10 mb-3 max-w-[calc(100%-2.5rem)] overflow-hidden rounded-[18px] border border-[#D8C69A] bg-white shadow-[0_8px_26px_rgba(31,47,36,0.08)]"
    >
      <div className="flex items-center gap-2.5 border-b border-[#EEE7D8] bg-[linear-gradient(110deg,#FBF8EF,#FFFFFF)] px-3.5 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E4D4AC] bg-[#F5ECD7] text-[#785D2B]">
          <Headset size={18} />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] font-bold text-[#173B2B]">Arrange an expert call</p>
          <p className="mt-0.5 text-[9px] leading-relaxed text-[#7A8178]">A Property Bouquet advisor can contact you.</p>
        </div>
        {!submitted && !required && (
          <button type="button" onClick={onDismiss} className="ml-auto rounded-full px-2 py-1 text-[9px] font-semibold text-[#8B9088] transition hover:bg-[#F0EEE8] hover:text-[#36483B]">
            Maybe later
          </button>
        )}
      </div>

      {submitted ? (
        <div className="flex items-start gap-2.5 px-4 py-4">
          <BadgeCheck size={21} className="mt-0.5 shrink-0 text-[#23865A]" />
          <div>
            <p className="text-[11px] font-bold text-[#1C6847]">Request received</p>
            <p className="mt-1 text-[10px] leading-relaxed text-[#5E6B61]">Your details have been sent to the Property Bouquet team. They will contact you on the number you provided.</p>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-3 p-3.5">
          <div>
            <label htmlFor="pb-chat-lead-name" className="mb-1 block text-[9px] font-semibold text-[#536157]">Your name</label>
            <input
              id="pb-chat-lead-name"
              type="text"
              value={name}
              onChange={(event) => onNameChange(event.target.value)}
              maxLength={150}
              autoComplete="name"
              placeholder="Enter your full name"
              required
              disabled={submitting}
              className="h-10 w-full rounded-xl border border-[#E4E0D6] bg-[#FCFBF8] px-3 text-[11px] text-[#1D2E23] outline-none transition placeholder:text-[#A2A69E] focus:border-[#C9A24D] focus:bg-white focus:ring-2 focus:ring-[#C9A24D]/10 disabled:opacity-60"
            />
          </div>
          <div>
            <label htmlFor="pb-chat-lead-phone" className="mb-1 block text-[9px] font-semibold text-[#536157]">Mobile number</label>
            <div className="flex h-10 overflow-hidden rounded-xl border border-[#E4E0D6] bg-[#FCFBF8] focus-within:border-[#C9A24D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C9A24D]/10">
              <span className="flex items-center border-r border-[#E4E0D6] px-3 text-[10px] font-semibold text-[#657367]">+91</span>
              <input
                id="pb-chat-lead-phone"
                type="tel"
                inputMode="numeric"
                pattern="[6-9][0-9]{9}"
                value={phone}
                onChange={(event) => onPhoneChange(event.target.value.replace(/\D/g, "").slice(0, 10))}
                maxLength={10}
                autoComplete="tel-national"
                placeholder="10-digit mobile number"
                required
                disabled={submitting}
                className="min-w-0 flex-1 bg-transparent px-3 text-[11px] text-[#1D2E23] outline-none placeholder:text-[#A2A69E] disabled:opacity-60"
              />
            </div>
            <p className="mt-1 text-[8px] text-[#92988F]">Enter a valid 10-digit Indian mobile number.</p>
          </div>

          {error && <p role="alert" className="rounded-lg bg-[#FFF3EF] px-3 py-2 text-[9px] leading-relaxed text-[#974B3D]">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !name.trim() || !/^[6-9]\d{9}$/.test(phone)}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[linear-gradient(145deg,#244A35_0%,#0E281B_100%)] px-4 text-[10px] font-bold tracking-wide text-[#F6E8C4] shadow-[0_5px_14px_rgba(18,57,39,0.15)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-45"
          >
            {submitting ? "Submitting request…" : "Request an expert call"}
            {!submitting && <ArrowUpRight size={13} />}
          </button>
          <p className="text-center text-[8px] leading-relaxed text-[#92988F]">By submitting, you agree to be contacted by the Property Bouquet team.</p>
        </form>
      )}
    </motion.div>
  );
}

async function postAssistantLead(details) {
  const cleanName = String(details?.name || "").trim();
  const digits = String(details?.phone || "").replace(/\D/g, "");
  if (!cleanName) throw new Error("Please enter your name.");
  if (!/^[6-9]\d{9}$/.test(digits)) {
    throw new Error("Please enter a valid 10-digit Indian mobile number.");
  }

  const payload = {
    name: cleanName,
    phone: `+91${digits}`,
    email: "",
    property: "Property Bouquet Assistant - Expert Call",
    source: "Website - Floating Contact Widget",
    leadType: "Private Consultation",
    pageUrl: window.location.href,
    pagePath: window.location.pathname,
    pageTitle: document.title || "Property Bouquet",
  };

  const response = await fetch(LEAD_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok || data?.success !== true) {
    throw new Error(data?.message || data?.error || `Lead submission failed (${response.status}). Please try again.`);
  }
  return { data, cleanName, digits };
}

function leadReceiptMessage(data, cleanName, digits) {
  return data?.duplicate
    ? `Thank you, ${cleanName}. We have already received a recent enquiry from this number. The Property Bouquet team will follow up.`
    : `Thank you, ${cleanName}. Your expert-call request has been received. The Property Bouquet team will contact you on +91 ******${digits.slice(-4)}.`;
}

async function readSseStream(response, onDelta) {
  if (!response.body) {
    throw new Error("The assistant did not return a response stream. Please try again.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let receivedText = false;

  const processBlock = (block) => {
    const data = block
      .split(/\r?\n/)
      .filter((line) => line.startsWith("data:"))
      .map((line) => line.slice(5).trim())
      .join("\n");

    if (!data || data === "[DONE]") return;

    let event;
    try {
      event = JSON.parse(data);
    } catch {
      return;
    }

    if (event.type === "response.output_text.delta" && typeof event.delta === "string") {
      receivedText = true;
      onDelta(event.delta);
      return;
    }

    if (event.type === "error" || event.type === "response.failed") {
      const message =
        event.message ||
        event.error?.message ||
        event.response?.error?.message ||
        "The assistant could not complete this response.";
      throw new Error(message);
    }
  };

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const blocks = buffer.split(/\r?\n\r?\n/);
      buffer = blocks.pop() || "";
      for (const block of blocks) processBlock(block);
    }

    buffer += decoder.decode();
    if (buffer.trim()) processBlock(buffer);
  } finally {
    reader.releaseLock();
  }

  if (!receivedText) {
    throw new Error("The assistant returned an empty response. Please try again.");
  }
}

export default function PropertyBouquetChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { id: makeId(), role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const [lastFailedMessage, setLastFailedMessage] = useState("");
  const [awaitingCallConfirmation, setAwaitingCallConfirmation] = useState(false);
  const [leadFormOpen, setLeadFormOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSubmitting, setLeadSubmitting] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState("");
  const [chatSessionId, setChatSessionId] = useState("");
  const [chatLimitReached, setChatLimitReached] = useState(false);

  const scrollAreaRef = useRef(null);
  const inputRef = useRef(null);
  const abortControllerRef = useRef(null);
  const activeRequestIdRef = useRef(null);

  useEffect(() => {
    const area = scrollAreaRef.current;
    if (area) area.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
  }, [messages, isSending, error, leadFormOpen, leadSubmitted, leadError]);

  useEffect(() => {
    setChatSessionId(getOrCreateChatSessionId());
    inputRef.current?.focus();
    return () => {
      activeRequestIdRef.current = null;
      abortControllerRef.current?.abort();
    };
  }, []);

  const stopResponse = useCallback(() => {
    abortControllerRef.current?.abort();
  }, []);

  const openLeadCapture = useCallback((history, options = {}) => {
    setAwaitingCallConfirmation(false);
    setLeadFormOpen(true);
    setLeadName(options.name || "");
    setLeadPhone(options.phone || "");
    setLeadSubmitted(false);
    setLeadError("");
    setError("");
    setMessages([
      ...history,
      {
        id: makeId(),
        role: "assistant",
        text: options.message || "Certainly. I can arrange a call with our property advisory team. Please share your name and mobile number below, and our team will get in touch.",
      },
    ]);
  }, []);

  const saveLeadFromChat = useCallback(async (contact) => {
    if (leadSubmitting) return;
    setLeadSubmitting(true);
    setLeadError("");
    try {
      const result = await postAssistantLead(contact);
      setLeadSubmitted(true);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          text: leadReceiptMessage(result.data, result.cleanName, result.digits),
        },
      ]);
    } catch (submitError) {
      setLeadError(submitError?.message || "We could not submit your request. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  }, [leadSubmitting]);

  const startAssistantRequest = useCallback(async (history, assistantMessageId, visitorId) => {
    const requestId = makeId();
    const controller = new AbortController();

    activeRequestIdRef.current = requestId;
    abortControllerRef.current = controller;
    setIsSending(true);
    setError("");
    setAwaitingCallConfirmation(false);

    let streamedText = "";

    try {
      const response = await fetch(CHAT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({
          visitorId,
          messages: history.slice(-12).map((message) => ({
            role: message.role,
            content: message.text,
          })),
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        let data = {};
        try {
          data = await response.json();
        } catch {
          // Keep the friendly fallback below for non-JSON errors.
        }
        const requestError = new Error(data.error || data.message || `The assistant request failed (${response.status}).`);
        requestError.code = data.code || "";
        throw requestError;
      }

      await readSseStream(response, (delta) => {
        if (activeRequestIdRef.current !== requestId) return;
        streamedText += delta;
        setMessages((current) =>
          current.map((message) =>
            message.id === assistantMessageId
              ? { ...message, text: streamedText, streaming: true }
              : message
          )
        );
      });

      if (activeRequestIdRef.current === requestId) {
        const responsesUsed = Number(response.headers.get("X-Assistant-Responses-Used") || 0);
        const reachedFiveResponses = responsesUsed >= 5;

        setMessages((current) =>
          current.map((message) => {
            if (message.id !== assistantMessageId) return message;
            const quotaMessage = leadSubmitted
              ? "\n\nYou've now used all five AI responses for this visitor session. Since you have already shared your contact details, a Property Bouquet advisor can continue with you directly."
              : "\n\nYou've reached the five-response limit. Share your name and mobile number below so a Property Bouquet advisor can continue helping you directly.";
            return {
              ...message,
              text: streamedText + (reachedFiveResponses ? quotaMessage : ""),
              streaming: false,
            };
          })
        );
        setLastFailedMessage("");
        setAwaitingCallConfirmation(!reachedFiveResponses && CALL_OFFER.test(streamedText));

        // Show the advisor handoff immediately after the fifth AI answer.
        // No sixth OpenAI request is needed to discover the limit.
        if (reachedFiveResponses) {
          setChatLimitReached(true);
          if (!leadSubmitted) {
            setLeadFormOpen(true);
            setLeadName("");
            setLeadPhone("");
            setLeadSubmitted(false);
            setLeadError("");
          }
        }
      }
    } catch (requestError) {
      if (activeRequestIdRef.current !== requestId) return;

      if (requestError?.name === "AbortError") {
        setMessages((current) => {
          const remaining = current.filter((message) => message.id !== assistantMessageId);
          return streamedText
            ? [...remaining, { id: assistantMessageId, role: "assistant", text: `${streamedText}\n\n(Response stopped.)` }]
            : remaining;
        });
      } else if (requestError?.code === "CHAT_LIMIT_REACHED") {
        const contact = extractContactDetails(history);
        setChatLimitReached(true);
        setMessages(history);
        openLeadCapture(history, {
          ...contact,
          message: "You've used your five assistant responses for this visit. Share your name and mobile number below, and a Property Bouquet advisor can continue the conversation with you directly. This handoff does not send another AI request.",
        });
      } else {
        setMessages((current) => current.filter((message) => message.id !== assistantMessageId));
        setError(requestError?.message || "Something went wrong. Please try again.");
        const latestUserMessage = [...history].reverse().find((message) => message.role === "user");
        setLastFailedMessage(latestUserMessage?.text || "");
      }
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        abortControllerRef.current = null;
        setIsSending(false);
      }
    }
  }, [leadSubmitted, openLeadCapture]);

  const sendMessage = useCallback(
    (rawText) => {
      const cleanText = String(rawText || "").trim().slice(0, MAX_MESSAGE_LENGTH);
      if (!cleanText || isSending || leadSubmitting || (chatLimitReached && leadSubmitted)) return;

      const userMessage = { id: makeId(), role: "user", text: cleanText };
      const history = [...messages, userMessage];
      const contact = extractContactDetails(history);
      const currentContact = extractContactDetails([userMessage]);
      const previousAssistantText = [...messages].reverse().find((item) => item.role === "assistant")?.text || "";
      const assistantAskedForDetails = /name.{0,45}(mobile|phone|number)|(?:mobile|phone|number).{0,45}name|share.{0,45}(details|contact)/i.test(previousAssistantText);

      // If the advisor asked for contact details and the visitor replies with
      // just their name (for example, "Rahul"), recognise that as the name.
      if (!currentContact.name && assistantAskedForDetails && /^[\p{L}\p{M}][\p{L}\p{M} .'-]{1,49}$/u.test(cleanText)) {
        currentContact.name = cleanText.trim();
      }

      const isNegative = NEGATIVE_CALL_REQUEST.test(cleanText);
      const isDirectCall = !isNegative && DIRECT_CALL_REQUEST.test(cleanText);
      const isPositive = POSITIVE_CONFIRMATION.test(cleanText);

      setInput("");
      setError("");
      setLastFailedMessage("");

      // Only react to contact details newly supplied in this message. This
      // prevents an earlier phone number in the chat history from hijacking
      // every later property question. Combine the new field with a field the
      // visitor may have shared in a separate message.
      if (currentContact.phone || currentContact.name || chatLimitReached) {
        const resolvedContact = {
          name: currentContact.name || contact.name || leadName,
          phone: currentContact.phone || contact.phone || leadPhone,
        };
        openLeadCapture(history, {
          ...resolvedContact,
          message: resolvedContact.name && resolvedContact.phone
            ? "Thank you. I am sharing your contact details with the Property Bouquet advisory team."
            : "Please complete your name and mobile number below so our team can contact you.",
        });

        // A visitor who supplies both their name and valid mobile number is
        // submitted directly to the existing lead endpoint. This request
        // does not call OpenAI.
        if (resolvedContact.name && resolvedContact.phone) {
          void saveLeadFromChat(resolvedContact);
        }
        return;
      }

      if (isDirectCall || (awaitingCallConfirmation && isPositive)) {
        openLeadCapture(history, contact);
        return;
      }

      if (isNegative) setAwaitingCallConfirmation(false);
      const assistantMessage = { id: makeId(), role: "assistant", text: "", streaming: true };
      setMessages([...history, assistantMessage]);
      const visitorId = chatSessionId || getOrCreateChatSessionId();
      if (!chatSessionId) setChatSessionId(visitorId);
      startAssistantRequest(history, assistantMessage.id, visitorId);
    },
    [awaitingCallConfirmation, chatLimitReached, chatSessionId, isSending, leadName, leadPhone, leadSubmitting, leadSubmitted, messages, openLeadCapture, saveLeadFromChat, startAssistantRequest]
  );

  const retryLastMessage = useCallback(() => {
    if (isSending || !lastFailedMessage) return;

    const lastUserIndex = messages.map((message) => message.role).lastIndexOf("user");
    if (lastUserIndex < 0) return;

    const history = messages.slice(0, lastUserIndex + 1);
    const assistantMessage = { id: makeId(), role: "assistant", text: "", streaming: true };
    setMessages([...history, assistantMessage]);
    setError("");
    const visitorId = chatSessionId || getOrCreateChatSessionId();
    if (!chatSessionId) setChatSessionId(visitorId);
    startAssistantRequest(history, assistantMessage.id, visitorId);
  }, [chatSessionId, isSending, lastFailedMessage, messages, startAssistantRequest]);

  const submitLead = useCallback(async (event) => {
    event.preventDefault();
    if (leadSubmitting || leadSubmitted) return;

    setLeadSubmitting(true);
    setLeadError("");

    try {
      const result = await postAssistantLead({ name: leadName, phone: leadPhone });
      setLeadSubmitted(true);
      setMessages((current) => [
        ...current,
        {
          id: makeId(),
          role: "assistant",
          text: leadReceiptMessage(result.data, result.cleanName, result.digits),
        },
      ]);
    } catch (submitError) {
      setLeadError(submitError?.message || "We could not submit your request. Please try again.");
    } finally {
      setLeadSubmitting(false);
    }
  }, [leadName, leadPhone, leadSubmitting, leadSubmitted]);

  const resetChat = useCallback(() => {
    activeRequestIdRef.current = null;
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    setMessages([{ id: makeId(), role: "assistant", text: WELCOME_MESSAGE }]);
    setInput("");
    setIsSending(false);
    setError("");
    setLastFailedMessage("");
    setAwaitingCallConfirmation(false);
    setLeadFormOpen(false);
    setLeadName("");
    setLeadPhone("");
    setLeadSubmitting(false);
    if (!chatLimitReached) setLeadSubmitted(false);
    setLeadError("");
    inputRef.current?.focus();
  }, [chatLimitReached]);

  const showQuickActions = messages.length === 1 && messages[0].role === "assistant";

  return (
    <section
      aria-label="Property Bouquet AI property assistant"
      className="flex h-[min(640px,78vh)] min-h-[450px] w-full flex-col overflow-hidden rounded-[23px] border border-[#C9A24D]/45 bg-[#F8F7F3] shadow-[0_26px_75px_rgba(3,16,10,0.34)]"
    >
      <header className="relative flex shrink-0 items-center justify-between gap-3 overflow-hidden border-b border-[#D7BD82]/45 bg-[linear-gradient(115deg,#07140E_0%,#153B2B_56%,#0A1B12_100%)] px-4 py-3.5 text-white">
        <div className="pointer-events-none absolute -right-8 -top-14 h-36 w-36 rounded-full bg-[#C9A24D]/10 blur-2xl" />
        <div className="relative flex min-w-0 items-center gap-3">
          <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[15px] border border-[#E8D3A0]/55 bg-[linear-gradient(145deg,#E9D6A5_0%,#C69B48_100%)] text-[#173B2B] shadow-[0_5px_18px_rgba(0,0,0,0.22)]">
            <AssistantMark size={31} />
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[2.5px] border-[#10271A] bg-[#18C987] shadow-[0_0_10px_rgba(24,201,135,0.5)]" />
          </div>
          <div className="min-w-0">
            <p className="text-[8px] font-bold uppercase tracking-[2.2px] text-[#D9B875]">PROPERTY BOUQUET</p>
            <h2 className="mt-0.5 truncate text-[14px] font-semibold tracking-[-0.2px] sm:text-[15px]">Property Bouquet Assistant</h2>
            <p className="mt-1 flex items-center gap-1.5 text-[9px] font-medium text-white/65 sm:text-[10px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#35D69B] shadow-[0_0_7px_rgba(53,214,155,0.65)]" />
              Property discovery · Personalised guidance
            </p>
          </div>
        </div>

        <div className="relative flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={resetChat}
            aria-label="Start a new conversation"
            title="New conversation"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition hover:border-[#D9B875]/45 hover:bg-white/10 hover:text-[#F0DCA9] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B875]"
          >
            <RotateCcw size={16} />
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            title="Close assistant"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/75 transition hover:border-white/25 hover:bg-white/10 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9B875]"
          >
            <X size={19} />
          </button>
        </div>
        <div className="absolute bottom-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#D9B875]/75 to-transparent" />
      </header>

      <div
        ref={scrollAreaRef}
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        aria-label="Chat messages"
        className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[radial-gradient(ellipse_at_top,rgba(224,211,180,0.18),transparent_58%),#F8F7F3] px-3.5 py-4 sm:px-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#C8B98F transparent" }}
      >
        <div className="mb-4 flex items-center justify-center gap-2 text-[8px] font-semibold uppercase tracking-[1.8px] text-[#A49A82]">
          <span className="h-px w-7 bg-[#D8C99F]" />
          Your property journey starts here
          <span className="h-px w-7 bg-[#D8C99F]" />
        </div>

        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8, scale: 0.99 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className={`mb-3 flex w-full items-end gap-2.5 ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {message.role === "assistant" && (
                <div className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#D8C18B]/60 bg-[#F0E8D6] text-[#173B2B] shadow-[0_3px_10px_rgba(23,59,43,0.07)]">
                  <AssistantMark size={22} />
                </div>
              )}

              <div
                className={`max-w-[86%] rounded-[18px] px-3.5 py-3 text-[11px] leading-[1.7] shadow-[0_4px_15px_rgba(23,38,28,0.055)] sm:max-w-[88%] sm:px-4 sm:text-[12px] ${
                  message.role === "user"
                    ? "rounded-br-[5px] border border-[#244C38] bg-[linear-gradient(145deg,#214A35_0%,#102E20_100%)] text-white"
                    : "rounded-bl-[5px] border border-[#E9E3D6] bg-white text-[#26352B]"
                }`}
              >
                {message.text ? <MessageText text={message.text} tone={message.role === "user" ? "user" : "assistant"} /> : message.streaming ? <span className="text-[#9A8A68]">Thinking…</span> : null}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.22 }}
            className="mb-3 ml-10 flex flex-wrap gap-2"
          >
            {QUICK_ACTIONS.map((action) => {
              const ActionIcon = action.icon;
              return (
                <button
                  key={action.label}
                  type="button"
                  onClick={() => sendMessage(action.message)}
                  disabled={isSending}
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#D7C69B] bg-white px-3 py-2 text-[9px] font-semibold text-[#4C603F] shadow-[0_2px_8px_rgba(23,59,43,0.045)] transition hover:border-[#B9954B] hover:bg-[#FBF6E9] hover:text-[#173B2B] disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24D] sm:text-[10px]"
                >
                  <ActionIcon size={12} className="text-[#A78343]" />
                  {action.label}
                </button>
              );
            })}
          </motion.div>
        )}

        {awaitingCallConfirmation && !leadFormOpen && !leadSubmitted && (
          <div className="mb-3 ml-10 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => openLeadCapture(messages)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#C9A24D] bg-[#F7EEDB] px-3.5 py-2 text-[10px] font-bold text-[#684E20] transition hover:bg-[#F0E2C4]"
            >
              <Headset size={12} /> Yes, arrange a call
            </button>
            <button
              type="button"
              onClick={() => setAwaitingCallConfirmation(false)}
              className="rounded-full border border-[#E2DED3] bg-white px-3.5 py-2 text-[10px] font-semibold text-[#667168] transition hover:bg-[#F7F6F2]"
            >
              Not now
            </button>
          </div>
        )}

        {leadFormOpen && (
          <LeadCaptureCard
            name={leadName}
            phone={leadPhone}
            onNameChange={setLeadName}
            onPhoneChange={setLeadPhone}
            onSubmit={submitLead}
            submitting={leadSubmitting}
            submitted={leadSubmitted}
            error={leadError}
            required={chatLimitReached}
            onDismiss={() => setLeadFormOpen(false)}
          />
        )}

        {isSending && <div className="mb-3"><TypingIndicator /></div>}

        {error && (
          <div role="alert" className="mb-3 ml-10 rounded-[14px] border border-[#E5C5B8] bg-[#FFF5F1] px-3.5 py-3 text-[10px] leading-relaxed text-[#874B3D]">
            <p>{error}</p>
            {lastFailedMessage && (
              <button
                type="button"
                onClick={retryLastMessage}
                className="mt-2 inline-flex items-center gap-1.5 font-bold text-[#173B2B] underline underline-offset-2 hover:text-[#9A742F]"
              >
                <RotateCcw size={11} /> Try again
              </button>
            )}
          </div>
        )}
      </div>

      <footer className="shrink-0 border-t border-[#E7E0D2] bg-white px-3.5 pb-3 pt-3 sm:px-4">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2 rounded-full border border-[#DED8C9] bg-[#F8F7F3] p-1.5 pl-3.5 shadow-[inset_0_1px_2px_rgba(30,40,30,0.035)] transition focus-within:border-[#C9A24D] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#C9A24D]/10"
        >
          <label htmlFor="property-bouquet-chat-input" className="sr-only">Type your property question</label>
          <input
            id="property-bouquet-chat-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={chatLimitReached ? (leadSubmitted ? "Your request has been sent to our team" : "Share your details to continue with an advisor") : "Ask about properties, locations…"}
            maxLength={MAX_MESSAGE_LENGTH}
            autoComplete="off"
            disabled={isSending || leadSubmitting || (chatLimitReached && leadSubmitted)}
            className="h-[38px] min-w-0 flex-1 bg-transparent text-[11px] text-[#1C2921] outline-none placeholder:text-[#9AA097] disabled:opacity-60 sm:text-[12px]"
          />
          {isSending ? (
            <button
              type="button"
              onClick={stopResponse}
              aria-label="Stop response"
              title="Stop response"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F2EBDD] text-[#795D2B] transition hover:bg-[#E8D8B8] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24D]"
            >
              <CircleStop size={17} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim() || leadSubmitting || (chatLimitReached && leadSubmitted)}
              aria-label="Send message"
              title="Send message"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(145deg,#244A35_0%,#0E281B_100%)] text-[#F6E8C4] shadow-[0_4px_12px_rgba(18,57,39,0.2)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-[#E5E6E1] disabled:text-[#A9AEA7] disabled:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9A24D]"
            >
              <Send size={15} />
            </button>
          )}
        </form>

        <div className="mt-2 flex items-center justify-center gap-1.5 text-[8px] text-[#92988F]">
          <ShieldCheck size={10} className="text-[#A78B50]" />
          Five AI responses per visitor session · Further assistance through our property advisory team
        </div>
      </footer>
    </section>
  );
}
