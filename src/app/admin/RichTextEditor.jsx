"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";
import "./RichTextEditor.css";

// ============================================================
// REACT QUILL
// ============================================================

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
  }
);

// ============================================================
// QUILL MODULES
// ============================================================

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],

    ["bold", "italic", "underline", "strike"],

    [{ color: [] }, { background: [] }],

    [{ align: [] }],

    [{ list: "ordered" }],
    [{ list: "bullet" }],

    ["blockquote", "code-block"],

    ["link", "image"],

    ["table"],

    ["clean"],
  ],

  table: true,
};

// ============================================================
// INTERNAL LINK CLEANER
//
// Property Bouquet internal links should NEVER be saved with:
//
// target="_blank"
// rel="noopener"
// rel="noreferrer"
//
// External links are NOT modified.
// ============================================================

function cleanInternalLinks(html = "") {
  if (!html || typeof html !== "string") {
    return html;
  }

  // ----------------------------------------------------------
  // Browser-side DOM parser
  // ----------------------------------------------------------

  if (typeof window !== "undefined" && typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();

      const doc = parser.parseFromString(
        `<div id="__rte_root__">${html}</div>`,
        "text/html"
      );

      const root = doc.getElementById("__rte_root__");

      if (!root) {
        return html;
      }

      const links = root.querySelectorAll("a");

      links.forEach((link) => {
        const href = link.getAttribute("href") || "";

        // ----------------------------------------------------
        // Detect Property Bouquet internal links
        //
        // Handles:
        // https://propertybouquet.com/...
        // https://www.propertybouquet.com/...
        // http://propertybouquet.com/...
        // http://www.propertybouquet.com/...
        // /relative/internal/path
        // ----------------------------------------------------

        let isInternalLink = false;

        // Relative URL
        if (
          href.startsWith("/") &&
          !href.startsWith("//")
        ) {
          isInternalLink = true;
        }

        // Absolute Property Bouquet URL
        try {
          if (
            href.startsWith("http://") ||
            href.startsWith("https://")
          ) {
            const url = new URL(href);

            isInternalLink =
              url.hostname === "propertybouquet.com" ||
              url.hostname === "www.propertybouquet.com";
          }
        } catch {
          // Invalid URL — leave untouched
        }

        // ----------------------------------------------------
        // ONLY clean internal links
        // ----------------------------------------------------

        if (isInternalLink) {
          // Remove new-tab behavior
          link.removeAttribute("target");

          // Remove rel completely if it only exists for
          // noopener / noreferrer.
          const rel = link.getAttribute("rel");

          if (rel) {
            const remainingRelTokens = rel
              .split(/\s+/)
              .filter(Boolean)
              .filter(
                (token) =>
                  token.toLowerCase() !== "noopener" &&
                  token.toLowerCase() !== "noreferrer"
              );

            if (remainingRelTokens.length > 0) {
              link.setAttribute(
                "rel",
                remainingRelTokens.join(" ")
              );
            } else {
              link.removeAttribute("rel");
            }
          }
        }
      });

      return root.innerHTML;
    } catch (error) {
      console.error(
        "RichTextEditor internal-link cleanup failed:",
        error
      );
    }
  }

  // ----------------------------------------------------------
  // Fallback cleanup
  //
  // Used only if DOMParser is unavailable.
  // ----------------------------------------------------------

  return html.replace(
    /<a\b([^>]*)>/gi,
    (fullMatch, attributes) => {
      let isInternalLink = false;

      const hrefMatch = attributes.match(
        /\bhref\s*=\s*["']([^"']*)["']/i
      );

      if (hrefMatch) {
        const href = hrefMatch[1];

        // Relative internal link
        if (
          href.startsWith("/") &&
          !href.startsWith("//")
        ) {
          isInternalLink = true;
        }

        // Absolute internal link
        try {
          if (
            href.startsWith("http://") ||
            href.startsWith("https://")
          ) {
            const url = new URL(href);

            isInternalLink =
              url.hostname === "propertybouquet.com" ||
              url.hostname === "www.propertybouquet.com";
          }
        } catch {
          // Leave invalid URLs untouched
        }
      }

      if (!isInternalLink) {
        return fullMatch;
      }

      let cleanedAttributes = attributes;

      // Remove target="_blank"
      cleanedAttributes = cleanedAttributes.replace(
        /\s+target\s*=\s*["']_blank["']/gi,
        ""
      );

      // Remove noopener/noreferrer from rel
      cleanedAttributes = cleanedAttributes.replace(
        /\s+rel\s*=\s*["']([^"']*)["']/gi,
        (relMatch, relValue) => {
          const remainingTokens = relValue
            .split(/\s+/)
            .filter(Boolean)
            .filter(
              (token) =>
                token.toLowerCase() !== "noopener" &&
                token.toLowerCase() !== "noreferrer"
            );

          if (remainingTokens.length === 0) {
            return "";
          }

          return ` rel="${remainingTokens.join(" ")}"`;
        }
      );

      return `<a${cleanedAttributes}>`;
    }
  );
}

// ============================================================
// COMPONENT
// ============================================================

export default function RichTextEditor({
  value,
  onChange,
}) {
  // ==========================================================
  // HANDLE CONTENT CHANGE
  // ==========================================================

  const handleChange = (content) => {
    const cleanedContent = cleanInternalLinks(content);

    onChange(cleanedContent);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value || ""}
        onChange={handleChange}
        modules={modules}
        className="text-black"
      />
    </div>
  );
}