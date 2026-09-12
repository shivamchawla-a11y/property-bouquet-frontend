"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          minHeight: "220px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#64748b",
          fontSize: "14px",
          background: "#fff",
        }}
      >
        Loading editor...
      </div>
    ),
  }
);

const MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, 4, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote", "code-block"],
    ["link", "image"],
    ["clean"],
  ],
};

const FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "color",
  "background",
  "align",
  "list",
  "blockquote",
  "code-block",
  "link",
  "image",
];

function isHTML(text = "") {
  return /<\s*(h[1-6]|p|strong|b|em|i|u|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|a|br|div|span)\b[^>]*>/i.test(
    text
  );
}

function cleanHTML(text = "") {
  return text
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export default function RichTextEditor({
  value = "",
  onChange,
}) {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();

    if (!quill) return;

    const editor = quill.root;

    const handlePaste = (event) => {
      const clipboard = event.clipboardData;

      if (!clipboard) return;

      const text = clipboard.getData("text/plain");

      /*
       * If copied content is actually HTML stored as plain text,
       * intercept it BEFORE Quill processes the paste.
       */
      if (!text || !isHTML(text)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const html = cleanHTML(text);

      const range = quill.getSelection(true);

      const index = range
        ? range.index
        : Math.max(0, quill.getLength() - 1);

      quill.clipboard.dangerouslyPasteHTML(
        index,
        html,
        "user"
      );

      const output =
        typeof quill.getSemanticHTML === "function"
          ? quill.getSemanticHTML()
          : quill.root.innerHTML;

      if (typeof onChange === "function") {
        onChange(output);
      }
    };

    /*
     * TRUE = CAPTURE PHASE
     *
     * This is the critical fix.
     * Our handler runs before Quill's own paste handler.
     */
    editor.addEventListener("paste", handlePaste, true);

    return () => {
      editor.removeEventListener("paste", handlePaste, true);
    };
  }, [onChange]);

  return (
    <div
      className="bg-white rich-text-editor-wrapper"
      style={{ width: "100%" }}
    >
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ""}
        onChange={onChange}
        modules={MODULES}
        formats={FORMATS}
        className="text-black"
      />
    </div>
  );
}