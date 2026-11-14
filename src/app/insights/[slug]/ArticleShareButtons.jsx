"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { FaFacebook } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export default function ArticleShareButtons({ articleTitle = "" }) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  const getArticleUrl = () => {
    if (typeof window === "undefined") return "";
    return window.location.href;
  };

  const openShareWindow = (url) => {
    if (!url) return;
    window.open(
      url,
      "_blank",
      "noopener,noreferrer,width=700,height=600"
    );
  };

  const shareFacebook = () => {
    const url = getArticleUrl();
    if (!url) return;

    openShareWindow(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    );
  };

  const shareX = () => {
    const url = getArticleUrl();
    if (!url) return;

    openShareWindow(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(articleTitle)}`
    );
  };

  const shareLinkedIn = () => {
    const url = getArticleUrl();
    if (!url) return;

    openShareWindow(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
    );
  };

  const copyArticleLink = async () => {
    const url = getArticleUrl();
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);

      if (resetTimerRef.current) {
        window.clearTimeout(resetTimerRef.current);
      }

      resetTimerRef.current = window.setTimeout(() => {
        setCopied(false);
        resetTimerRef.current = null;
      }, 2000);
    } catch (error) {
      console.error("COPY ARTICLE LINK ERROR:", error);
    }
  };

  const buttonClassName = `
    flex h-11 w-11 items-center justify-center rounded-full
    border border-[#d9d2c7] bg-white text-[#163629]
    shadow-sm transition-all duration-300
    hover:bg-[#163629] hover:text-white
    focus-visible:outline-none focus-visible:ring-2
    focus-visible:ring-[#805b1e] focus-visible:ring-offset-2
  `;

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-[#666666]">Share</span>

      <button
        type="button"
        onClick={shareFacebook}
        aria-label="Share this article on Facebook"
        className={buttonClassName}
      >
        <FaFacebook size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={shareX}
        aria-label="Share this article on X"
        className={buttonClassName}
      >
        <FaXTwitter size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={shareLinkedIn}
        aria-label="Share this article on LinkedIn"
        className={buttonClassName}
      >
        <FaLinkedinIn size={16} aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={copyArticleLink}
        aria-label={copied ? "Article link copied" : "Copy article link"}
        title={copied ? "Link copied" : "Copy article link"}
        className={buttonClassName}
      >
        {copied ? (
          <Check size={17} aria-hidden="true" />
        ) : (
          <Link2 size={17} aria-hidden="true" />
        )}
      </button>

      <span className="sr-only" aria-live="polite">
        {copied ? "Article link copied to clipboard." : ""}
      </span>
    </div>
  );
}
