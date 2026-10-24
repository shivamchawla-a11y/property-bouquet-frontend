
"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  RotateCcw,
  Send,
  Sparkles,
  X,
} from "lucide-react";

const QUICK_ACTIONS = [
  { label: "Buy a property", message: "I want to buy a property." },
  { label: "Search properties", message: "Help me search properties." },
  { label: "Talk to an agent", message: "I would like to talk to an agent." },
];

const WELCOME_MESSAGE =
  "Hi there! 👋 Welcome to Property Bouquet. I'm here to help you discover your perfect property. How can I assist you today?";

function getDemoReply(message) {
  const text = message.toLowerCase();

  if (text.includes("agent") || text.includes("callback") || text.includes("human")) {
    return "Of course! Our property team can help you personally. You can call us at +91 9090 106 101, or choose “Request a Callback” from the contact menu.";
  }

  if (
    text.includes("search") ||
    text.includes("find") ||
    text.includes("location") ||
    text.includes("gurgaon") ||
    text.includes("gurugram") ||
    text.includes("noida") ||
    text.includes("budget")
  ) {
    return "Let's narrow down your property search. Which city or location are you considering, what is your approximate budget, and are you looking for an apartment, builder floor, villa, or plot?";
  }

  if (text.includes("buy") || text.includes("purchase") || text.includes("property")) {
    return "I'd be happy to help you explore properties. To get started, tell me your preferred location, budget, and property type. Our live property-search and AI services can be connected here next.";
  }

  return "Thanks for sharing that with Property Bouquet! This chat interface is currently in preview mode. Once the AI backend is connected, this is where you'll receive property-specific answers. You can also call our team at +91 9090 106 101.";
}

export default function PropertyBouquetChatPanel({ onClose }) {
  const [messages, setMessages] = useState([
    { id: 1, role: "assistant", text: WELCOME_MESSAGE },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, isTyping]);

  const resetChat = () => {
    setMessages([{ id: Date.now(), role: "assistant", text: WELCOME_MESSAGE }]);
    setInput("");
    setIsTyping(false);
  };

  const sendMessage = (text) => {
    const cleanText = text.trim();
    if (!cleanText || isTyping) return;

    const userMessage = {
      id: Date.now(),
      role: "user",
      text: cleanText,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsTyping(true);

    // Frontend preview only. Replace this demo response with your AI API call later.
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          text: getDemoReply(cleanText),
        },
      ]);
      setIsTyping(false);
    }, 650);
  };

  const showQuickActions =
    messages.length === 1 && messages[0].role === "assistant";

  return (
    <section
      aria-label="Property Bouquet AI assistant"
      className="flex h-[min(590px,72vh)] min-h-[410px] w-full flex-col overflow-hidden rounded-[22px] border border-[#c9a96e]/40 bg-[#f4f5f8] shadow-[0_24px_70px_rgba(0,0,0,0.30)]"
    >
      {/* Assistant header */}
      <header className="relative z-10 flex shrink-0 items-center justify-between gap-3 border-b border-[#c9a96e]/70 bg-gradient-to-r from-[#09140f] via-[#101c15] to-[#080d0a] px-4 py-3.5 text-white">
        <div className="flex min-w-0 items-center gap-3">
          <div className="relative flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-full border border-[#f4d58d]/80 bg-gradient-to-br from-[#ffe8a6] via-[#e9b94f] to-[#c58b24] text-[#172218] shadow-[0_3px_12px_rgba(201,169,110,0.25)]">
            <Bot size={25} strokeWidth={1.9} />
            <span className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full border-[2px] border-[#101812] bg-[#25c875]" />
          </div>

          <div className="min-w-0">
            <h2 className="truncate text-[14px] font-bold tracking-[0.1px] sm:text-[15px]">
              Property Bouquet Assistant
            </h2>
            <p className="mt-1 flex items-center gap-1.5 text-[10px] font-medium text-white/75 sm:text-[11px]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#75e6a4]" />
              Here to help you find your property
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={resetChat}
            aria-label="Restart conversation"
            title="Restart conversation"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white/75 transition-colors hover:bg-white/10 hover:text-[#e5c780]"
          >
            <RotateCcw size={19} />
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            title="Close assistant"
            className="flex h-9 w-9 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 hover:text-[#e5c780]"
          >
            <X size={21} />
          </button>
        </div>
      </header>

      {/* Conversation area */}
      <div
        className="flex min-h-0 flex-1 flex-col overflow-y-auto px-3.5 py-4 sm:px-4"
        style={{ scrollbarWidth: "thin", scrollbarColor: "#c5cbd2 transparent" }}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 8, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.22 }}
              className={`mb-3 flex w-full ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.role === "assistant" && (
                <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#d8bc7d]/50 bg-[#e9d39c]/25 text-[#72551e]">
                  <Sparkles size={14} />
                </div>
              )}

              <div
                className={`max-w-[88%] whitespace-pre-wrap break-words rounded-[17px] px-3.5 py-3 text-[12px] leading-[1.65] shadow-[0_2px_5px_rgba(20,30,25,0.05)] sm:text-[13px] ${
                  message.role === "user"
                    ? "rounded-br-[5px] bg-[#173b2b] text-white"
                    : "rounded-tl-[5px] border border-[#e8e9ed] bg-white text-[#17202b]"
                }`}
              >
                {message.text}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {showQuickActions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12, duration: 0.25 }}
            className="mt-1 flex flex-wrap justify-end gap-2 pl-8"
          >
            {QUICK_ACTIONS.map((action) => (
              <button
                key={action.label}
                type="button"
                onClick={() => sendMessage(action.message)}
                className="rounded-full border border-[#d9a441] bg-white px-3.5 py-2.5 text-[11px] font-semibold text-[#a66c12] shadow-[0_2px_5px_rgba(30,30,20,0.03)] transition-colors duration-200 hover:bg-[#fff8e9] hover:text-[#765018] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a96e]"
              >
                {action.label}
              </button>
            ))}
          </motion.div>
        )}

        {isTyping && (
          <div className="mb-2 flex items-center gap-2 pl-1 text-[#59645d]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#e9d39c]/30 text-[#72551e]">
              <Bot size={15} />
            </div>
            <div className="flex items-center gap-1 rounded-full border border-[#e8e9ed] bg-white px-3.5 py-3">
              {[0, 1, 2].map((dot) => (
                <motion.span
                  key={dot}
                  className="h-1.5 w-1.5 rounded-full bg-[#9b8656]"
                  animate={{ y: [0, -3, 0], opacity: [0.45, 1, 0.45] }}
                  transition={{
                    duration: 0.65,
                    repeat: Infinity,
                    delay: dot * 0.12,
                  }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Message composer */}
      <footer className="shrink-0 border-t border-[#e1e4e9] bg-white p-3">
        <form
          onSubmit={(event) => {
            event.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <label htmlFor="property-bouquet-chat-input" className="sr-only">
            Type your message
          </label>

          <input
            id="property-bouquet-chat-input"
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Ask about properties..."
            maxLength={1000}
            autoComplete="off"
            className="h-[43px] min-w-0 flex-1 rounded-full border border-[#d7dce3] bg-[#f5f6f8] px-4 text-[12px] text-[#1c2921] outline-none transition focus:border-[#b99a5b] focus:bg-white focus:ring-2 focus:ring-[#c9a96e]/15 sm:text-[13px]"
          />

          <button
            type="submit"
            disabled={!input.trim() || isTyping}
            aria-label="Send message"
            className="flex h-[43px] w-[43px] shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#173b2b] to-[#0c2419] text-white shadow-[0_3px_10px_rgba(15,59,46,0.2)] transition hover:brightness-125 disabled:cursor-not-allowed disabled:bg-[#d5d9de] disabled:bg-none disabled:text-white disabled:shadow-none"
          >
            {input.trim() ? <Send size={17} /> : <Check size={17} />}
          </button>
        </form>

        <p className="mt-2 text-center text-[9px] text-[#89918b]">
          Property Bouquet · Your property journey starts here
        </p>
      </footer>
    </section>
  );
}
