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

/*
|--------------------------------------------------------------------------
| QUILL MODULES
|--------------------------------------------------------------------------
|
| Quill 2 includes a built-in table module.
|
|--------------------------------------------------------------------------
*/

const MODULES = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, 4, false] }],

      ["bold", "italic", "underline", "strike"],

      [{ color: [] }, { background: [] }],

      [{ align: [] }],

      [
        { list: "ordered" },
        { list: "bullet" },
      ],

      ["blockquote", "code-block"],

      ["link", "image"],

      ["clean"],
    ],
  },

  /*
   * Built-in Quill table module.
   */
  table: true,
};

/*
|--------------------------------------------------------------------------
| FORMATS
|--------------------------------------------------------------------------
*/

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

/*
|--------------------------------------------------------------------------
| HTML DETECTION
|--------------------------------------------------------------------------
*/

function isHTML(text = "") {
  return /<\s*(h[1-6]|p|strong|b|em|i|u|ul|ol|li|blockquote|table|thead|tbody|tr|td|th|a|br|div|span|img)\b[^>]*>/i.test(
    text
  );
}

/*
|--------------------------------------------------------------------------
| CLEAN PASTED HTML
|--------------------------------------------------------------------------
*/

function cleanHTML(text = "") {
  return text
    .replace(/^```html\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

/*
|--------------------------------------------------------------------------
| GET AUTH TOKEN
|--------------------------------------------------------------------------
*/

function getAuthToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return (
    localStorage.getItem("token") ||
    localStorage.getItem("authToken") ||
    localStorage.getItem("accessToken") ||
    null
  );
}

/*
|--------------------------------------------------------------------------
| READ RESPONSE SAFELY
|--------------------------------------------------------------------------
|
| Prevents:
|
| Unexpected token '<', '<!DOCTYPE'...
|
| from appearing when the backend returns HTML.
|
|--------------------------------------------------------------------------
*/

async function readResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  const rawText = await response.text();

  /*
   * JSON response.
   */
  if (
    contentType.includes(
      "application/json"
    )
  ) {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        "The server returned invalid JSON."
      );
    }
  }

  /*
   * HTML error page.
   */
  if (
    rawText.includes("<!DOCTYPE") ||
    rawText.includes("<html")
  ) {
    throw new Error(
      `Server returned an HTML error page (HTTP ${response.status}).`
    );
  }

  /*
   * Plain text error.
   */
  throw new Error(
    rawText ||
      `Request failed with HTTP ${response.status}.`
  );
}

/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

export default function RichTextEditor({
  value = "",
  onChange,
}) {
  const quillRef = useRef(null);

  /*
  |--------------------------------------------------------------------------
  | IMAGE UPLOAD HANDLER
  |--------------------------------------------------------------------------
  */

  const imageHandler = async () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    /*
     * Create temporary file picker.
     */
    const input =
      document.createElement("input");

    input.setAttribute(
      "type",
      "file"
    );

    input.setAttribute(
      "accept",
      "image/*"
    );

    input.click();

    input.onchange = async () => {
      const file =
        input.files?.[0];

      if (!file) {
        return;
      }

      /*
       * Validate image type.
       */
      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        window.alert(
          "Please select a valid image file."
        );

        return;
      }

      /*
       * Maximum image size:
       * 10 MB
       */
      if (
        file.size >
        10 * 1024 * 1024
      ) {
        window.alert(
          "Image is too large. Please select an image smaller than 10 MB."
        );

        return;
      }

      /*
       * Save cursor position.
       */
      const range =
        quill.getSelection(true);

      const index = range
        ? range.index
        : Math.max(
            0,
            quill.getLength() - 1
          );

      /*
       * Insert temporary loading text.
       */
      const loadingText =
        "Uploading image...";

      quill.insertText(
        index,
        loadingText,
        "user"
      );

      quill.setSelection(
        index +
          loadingText.length,
        0,
        "silent"
      );

      try {
        /*
         * Get authentication token.
         */
        const token =
          getAuthToken();

        if (!token) {
          throw new Error(
            "Authentication token not found. Please log in again."
          );
        }

        /*
         * Multipart FormData.
         */
        const formData =
          new FormData();

        formData.append(
          "image",
          file
        );

        /*
         * Upload image to backend.
         */
        const response =
          await fetch(
            "/api/knowledge/upload-image",
            {
              method: "POST",

              headers: {
                Authorization: `Bearer ${token}`,
              },

              body: formData,
            }
          );

        /*
         * Safely parse response.
         */
        const result =
          await readResponse(
            response
          );

        /*
         * Validate response.
         */
        if (
          !response.ok ||
          !result?.success ||
          !result?.url
        ) {
          throw new Error(
            result?.message ||
              "Image upload failed."
          );
        }

        /*
         * Remove temporary text.
         */
        quill.deleteText(
          index,
          loadingText.length,
          "silent"
        );

        /*
         * Insert Cloudinary image.
         */
        quill.insertEmbed(
          index,
          "image",
          result.url,
          "user"
        );

        /*
         * Move cursor after image.
         */
        quill.setSelection(
          index + 1,
          0,
          "silent"
        );

        /*
         * Update parent value.
         */
        const output =
          typeof quill.getSemanticHTML ===
          "function"
            ? quill.getSemanticHTML()
            : quill.root.innerHTML;

        if (
          typeof onChange ===
          "function"
        ) {
          onChange(output);
        }
      } catch (error) {
        console.error(
          "KNOWLEDGE IMAGE UPLOAD ERROR:",
          error
        );

        /*
         * Try to remove loading text.
         */
        try {
          const currentText =
            quill.getText(
              index,
              loadingText.length
            );

          if (
            currentText ===
            loadingText
          ) {
            quill.deleteText(
              index,
              loadingText.length,
              "silent"
            );
          }
        } catch {
          /*
           * Ignore cleanup errors.
           */
        }

        window.alert(
          error?.message ||
            "Failed to upload image. Please try again."
        );
      }
    };
  };

  /*
  |--------------------------------------------------------------------------
  | TABLE HANDLER
  |--------------------------------------------------------------------------
  |
  | Uses Quill 2's built-in table module.
  |
  |--------------------------------------------------------------------------
  */

  const insertTable = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      window.alert(
        "Table module is not available. Please refresh the page."
      );

      return;
    }

    /*
     * Default table:
     * 3 rows x 3 columns
     */
    table.insertTable(3, 3);

    updateEditorValue(quill);
  };

  /*
  |--------------------------------------------------------------------------
  | TABLE ROW ABOVE
  |--------------------------------------------------------------------------
  */

  const insertRowAbove = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.insertRowAbove();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "INSERT ROW ABOVE ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TABLE ROW BELOW
  |--------------------------------------------------------------------------
  */

  const insertRowBelow = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.insertRowBelow();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "INSERT ROW BELOW ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TABLE COLUMN LEFT
  |--------------------------------------------------------------------------
  */

  const insertColumnLeft = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.insertColumnLeft();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "INSERT COLUMN LEFT ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | TABLE COLUMN RIGHT
  |--------------------------------------------------------------------------
  */

  const insertColumnRight = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.insertColumnRight();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "INSERT COLUMN RIGHT ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE TABLE ROW
  |--------------------------------------------------------------------------
  */

  const deleteRow = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.deleteRow();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "DELETE ROW ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE TABLE COLUMN
  |--------------------------------------------------------------------------
  */

  const deleteColumn = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.deleteColumn();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "DELETE COLUMN ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | DELETE TABLE
  |--------------------------------------------------------------------------
  */

  const deleteTable = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const table =
      quill.getModule("table");

    if (!table) {
      return;
    }

    try {
      table.deleteTable();

      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "DELETE TABLE ERROR:",
        error
      );

      window.alert(
        "Please place your cursor inside a table first."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPDATE EDITOR VALUE
  |--------------------------------------------------------------------------
  */

  const updateEditorValue = (
    quill
  ) => {
    const output =
      typeof quill.getSemanticHTML ===
      "function"
        ? quill.getSemanticHTML()
        : quill.root.innerHTML;

    if (
      typeof onChange ===
      "function"
    ) {
      onChange(output);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER IMAGE HANDLER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const toolbar =
      quill.getModule(
        "toolbar"
      );

    if (!toolbar) {
      return;
    }

    toolbar.addHandler(
      "image",
      imageHandler
    );
  }, []);

  /*
  |--------------------------------------------------------------------------
  | PASTE HTML HANDLER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const editor =
      quill.root;

    const handlePaste = (
      event
    ) => {
      const clipboard =
        event.clipboardData;

      if (!clipboard) {
        return;
      }

      /*
       * Read plain text.
       */
      const text =
        clipboard.getData(
          "text/plain"
        );

      /*
       * If copied content is HTML
       * represented as plain text,
       * convert it back to HTML.
       */
      if (
        !text ||
        !isHTML(text)
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      const html =
        cleanHTML(text);

      const range =
        quill.getSelection(true);

      const index = range
        ? range.index
        : Math.max(
            0,
            quill.getLength() - 1
          );

      /*
       * Paste HTML.
       *
       * Tables are intentionally included
       * in isHTML() above.
       */
      quill.clipboard.dangerouslyPasteHTML(
        index,
        html,
        "user"
      );

      updateEditorValue(
        quill
      );
    };

    /*
     * CAPTURE PHASE
     *
     * Runs before Quill's own
     * paste handler.
     */
    editor.addEventListener(
      "paste",
      handlePaste,
      true
    );

    return () => {
      editor.removeEventListener(
        "paste",
        handlePaste,
        true
      );
    };
  }, [onChange]);

  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (
    <div
      className="bg-white rich-text-editor-wrapper"
      style={{
        width: "100%",
      }}
    >
      {/* ================================================================
          CUSTOM TABLE TOOLBAR
          ================================================================ */}

      <div
        className="knowledge-table-toolbar"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "6px",
          padding: "8px 10px",
          border: "1px solid #e2e8f0",
          borderBottom: "0",
          background: "#f8fafc",
          alignItems: "center",
        }}
      >
        <button
          type="button"
          onClick={insertTable}
          title="Insert 3 × 3 table"
          style={{
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 600,
            color: "#17342d",
          }}
        >
          Insert Table
        </button>

        <button
          type="button"
          onClick={insertRowAbove}
          title="Insert row above"
          style={{
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          + Row Above
        </button>

        <button
          type="button"
          onClick={insertRowBelow}
          title="Insert row below"
          style={{
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          + Row Below
        </button>

        <button
          type="button"
          onClick={insertColumnLeft}
          title="Insert column left"
          style={{
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          + Column Left
        </button>

        <button
          type="button"
          onClick={insertColumnRight}
          title="Insert column right"
          style={{
            border:
              "1px solid #cbd5e1",
            background: "#ffffff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#334155",
          }}
        >
          + Column Right
        </button>

        <button
          type="button"
          onClick={deleteRow}
          title="Delete current row"
          style={{
            border:
              "1px solid #fecaca",
            background: "#fff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#b91c1c",
          }}
        >
          Delete Row
        </button>

        <button
          type="button"
          onClick={deleteColumn}
          title="Delete current column"
          style={{
            border:
              "1px solid #fecaca",
            background: "#fff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#b91c1c",
          }}
        >
          Delete Column
        </button>

        <button
          type="button"
          onClick={deleteTable}
          title="Delete current table"
          style={{
            border:
              "1px solid #fecaca",
            background: "#fff",
            borderRadius: "6px",
            padding:
              "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#b91c1c",
          }}
        >
          Delete Table
        </button>
      </div>

      {/* ================================================================
          QUILL
          ================================================================ */}

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