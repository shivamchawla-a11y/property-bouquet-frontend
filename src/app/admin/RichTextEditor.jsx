"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import "./RichTextEditor.css";

/*
|--------------------------------------------------------------------------
| REACT QUILL
|--------------------------------------------------------------------------
*/

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
   * Quill 2 built-in table module.
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
  return /<\s*(h[1-6]|p|strong|b|em|i|u|ul|ol|li|blockquote|table|thead|tbody|tfoot|tr|td|th|a|br|div|span|img|figure|figcaption)\b[^>]*>/i.test(
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
| SAFE RESPONSE READER
|--------------------------------------------------------------------------
*/

async function readResponse(response) {
  const contentType =
    response.headers.get("content-type") || "";

  const rawText = await response.text();

  if (
    contentType
      .toLowerCase()
      .includes("application/json")
  ) {
    try {
      return JSON.parse(rawText);
    } catch {
      throw new Error(
        "The server returned invalid JSON."
      );
    }
  }

  if (
    rawText
      .toLowerCase()
      .includes("<!doctype") ||
    rawText
      .toLowerCase()
      .includes("<html")
  ) {
    if (response.status === 413) {
      throw new Error(
        "The request is too large. Please remove the large embedded image and upload it again."
      );
    }

    throw new Error(
      `Server returned an HTML error page (HTTP ${response.status}).`
    );
  }

  throw new Error(
    rawText ||
      `Request failed with HTTP ${response.status}.`
  );
}

/*
|--------------------------------------------------------------------------
| BASE64 DETECTION
|--------------------------------------------------------------------------
*/

function containsBase64Image(html = "") {
  return /<img[^>]+src\s*=\s*["']data:image\//i.test(
    html
  );
}

/*
|--------------------------------------------------------------------------
| BASE64 DATA URI → FILE
|--------------------------------------------------------------------------
|
| Used when an image comes from Word, Google Docs,
| screenshots, copied HTML, etc.
|
|--------------------------------------------------------------------------
*/

function dataUriToFile(dataUri, filename = "pasted-image") {
  const match = dataUri.match(
    /^data:(image\/[\w.+-]+);base64,(.+)$/i
  );

  if (!match) {
    return null;
  }

  const mimeType = match[1];
  const base64Data = match[2];

  const binaryString =
    window.atob(base64Data);

  const length =
    binaryString.length;

  const bytes =
    new Uint8Array(length);

  for (let i = 0; i < length; i++) {
    bytes[i] =
      binaryString.charCodeAt(i);
  }

  let extension = "png";

  if (mimeType === "image/jpeg") {
    extension = "jpg";
  } else if (mimeType === "image/webp") {
    extension = "webp";
  } else if (mimeType === "image/gif") {
    extension = "gif";
  } else if (mimeType === "image/svg+xml") {
    extension = "svg";
  }

  return new File(
    [bytes],
    `${filename}.${extension}`,
    {
      type: mimeType,
    }
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
   * Always keep latest callback.
   */
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  /*
  |--------------------------------------------------------------------------
  | UPDATE PARENT VALUE
  |--------------------------------------------------------------------------
  */

  const updateEditorValue = (quill) => {
    if (!quill) {
      return;
    }

    const output =
      typeof quill.getSemanticHTML ===
      "function"
        ? quill.getSemanticHTML()
        : quill.root.innerHTML;

    if (containsBase64Image(output)) {
      console.error(
        "BLOCKED: Base64 image still exists in editor content."
      );
    }

    if (
      typeof onChangeRef.current ===
      "function"
    ) {
      onChangeRef.current(output);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | UPLOAD IMAGE TO CLOUDINARY
  |--------------------------------------------------------------------------
  */

  const uploadImageToCloudinary = async (
    file
  ) => {
    if (!file) {
      throw new Error(
        "No image selected."
      );
    }

    if (
      !file.type ||
      !file.type.startsWith("image/")
    ) {
      throw new Error(
        "Only image files are allowed."
      );
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      throw new Error(
        "Image is too large. Please select an image smaller than 10 MB."
      );
    }

    const token =
      getAuthToken();

    if (!token) {
      throw new Error(
        "Authentication token not found. Please log in again."
      );
    }

    const formData =
      new FormData();

    formData.append(
      "image",
      file
    );

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

    const result =
      await readResponse(
        response
      );

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

    return result.url;
  };

  /*
  |--------------------------------------------------------------------------
  | INSERT IMAGE
  |--------------------------------------------------------------------------
  */

  const insertImageIntoEditor = async (
    quill,
    file,
    index
  ) => {
    if (!quill || !file) {
      return;
    }

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
      const imageUrl =
        await uploadImageToCloudinary(
          file
        );

      /*
       * Remove loading text.
       */
      quill.deleteText(
        index,
        loadingText.length,
        "silent"
      );

      /*
       * Insert Cloudinary URL.
       */
      quill.insertEmbed(
        index,
        "image",
        imageUrl,
        "user"
      );

      quill.setSelection(
        index + 1,
        0,
        "silent"
      );

      updateEditorValue(quill);

      return imageUrl;
    } catch (error) {
      console.error(
        "KNOWLEDGE IMAGE UPLOAD ERROR:",
        error
      );

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
        // Ignore cleanup errors.
      }

      throw error;
    }
  };

  /*
  |--------------------------------------------------------------------------
  | IMAGE BUTTON HANDLER
  |--------------------------------------------------------------------------
  */

  const imageHandler = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return;
    }

    const input =
      document.createElement("input");

    input.type = "file";
    input.accept = "image/*";

    input.onchange = async () => {
      const file =
        input.files?.[0];

      if (!file) {
        return;
      }

      try {
        const range =
          quill.getSelection(true);

        const index = range
          ? range.index
          : Math.max(
              0,
              quill.getLength() - 1
            );

        await insertImageIntoEditor(
          quill,
          file,
          index
        );
      } catch (error) {
        window.alert(
          error?.message ||
            "Failed to upload image. Please try again."
        );
      }
    };

    input.click();
  };

  /*
  |--------------------------------------------------------------------------
  | REGISTER IMAGE HANDLER RELIABLY
  |--------------------------------------------------------------------------
  |
  | ReactQuill is dynamically loaded.
  |
  | A normal useEffect([]) can execute before
  | ReactQuill is available.
  |
  | We therefore retry until the editor exists.
  |
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let interval = null;
    let attempts = 0;

    const registerImageHandler = () => {
      const quill =
        quillRef.current?.getEditor?.();

      if (!quill) {
        return false;
      }

      const toolbar =
        quill.getModule("toolbar");

      if (!toolbar) {
        return false;
      }

      toolbar.addHandler(
        "image",
        imageHandler
      );

      console.log(
        "Knowledge RichTextEditor: Cloudinary image handler registered."
      );

      return true;
    };

    /*
     * Try immediately.
     */
    if (registerImageHandler()) {
      return () => {};
    }

    /*
     * ReactQuill may still be loading.
     */
    interval = window.setInterval(() => {
      attempts += 1;

      if (
        registerImageHandler() ||
        attempts >= 50
      ) {
        if (interval) {
          window.clearInterval(
            interval
          );
        }
      }
    }, 100);

    return () => {
      if (interval) {
        window.clearInterval(
          interval
        );
      }
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | TABLE HELPER
  |--------------------------------------------------------------------------
  */

  const getTableModule = () => {
    const quill =
      quillRef.current?.getEditor?.();

    if (!quill) {
      return {
        quill: null,
        table: null,
      };
    }

    return {
      quill,
      table: quill.getModule("table"),
    };
  };

  /*
  |--------------------------------------------------------------------------
  | INSERT TABLE
  |--------------------------------------------------------------------------
  */

  const insertTable = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
      window.alert(
        "Table module is not available. Please refresh the page."
      );
      return;
    }

    try {
      table.insertTable(3, 3);
      updateEditorValue(quill);
    } catch (error) {
      console.error(
        "INSERT TABLE ERROR:",
        error
      );

      window.alert(
        "Unable to insert table."
      );
    }
  };

  /*
  |--------------------------------------------------------------------------
  | INSERT ROW ABOVE
  |--------------------------------------------------------------------------
  */

  const insertRowAbove = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | INSERT ROW BELOW
  |--------------------------------------------------------------------------
  */

  const insertRowBelow = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | INSERT COLUMN LEFT
  |--------------------------------------------------------------------------
  */

  const insertColumnLeft = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | INSERT COLUMN RIGHT
  |--------------------------------------------------------------------------
  */

  const insertColumnRight = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | DELETE ROW
  |--------------------------------------------------------------------------
  */

  const deleteRow = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | DELETE COLUMN
  |--------------------------------------------------------------------------
  */

  const deleteColumn = () => {
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
    const {
      quill,
      table,
    } = getTableModule();

    if (!quill || !table) {
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
  | PASTE HANDLER
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let interval = null;
    let attempts = 0;
    let cleanupPaste = null;

    const attachPasteHandler = () => {
      const quill =
        quillRef.current?.getEditor?.();

      if (!quill) {
        return false;
      }

      const editor =
        quill.root;

      if (!editor) {
        return false;
      }

      /*
       * Prevent attaching twice.
       */
      if (
        editor.dataset
          .knowledgePasteHandler ===
        "true"
      ) {
        return true;
      }

      const handlePaste = async (
        event
      ) => {
        const clipboard =
          event.clipboardData;

        if (!clipboard) {
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | 1. DIRECT IMAGE PASTE
        |--------------------------------------------------------------------------
        */

        const imageItem =
          Array.from(
            clipboard.items || []
          ).find(
            (item) =>
              item.type &&
              item.type.startsWith(
                "image/"
              )
          );

        if (imageItem) {
          event.preventDefault();
          event.stopPropagation();

          const file =
            imageItem.getAsFile();

          if (!file) {
            return;
          }

          try {
            const range =
              quill.getSelection(true);

            const index = range
              ? range.index
              : Math.max(
                  0,
                  quill.getLength() - 1
                );

            await insertImageIntoEditor(
              quill,
              file,
              index
            );
          } catch (error) {
            console.error(
              "PASTED IMAGE UPLOAD ERROR:",
              error
            );

            window.alert(
              error?.message ||
                "Failed to upload pasted image. Please try again."
            );
          }

          return;
        }

        /*
        |--------------------------------------------------------------------------
        | 2. HTML PASTE
        |--------------------------------------------------------------------------
        */

        const htmlData =
          clipboard.getData(
            "text/html"
          );

        const plainText =
          clipboard.getData(
            "text/plain"
          );

        /*
         * If clipboard contains HTML,
         * inspect its images.
         */
        if (
          htmlData &&
          isHTML(htmlData)
        ) {
          /*
           * Find Base64 images.
           */
          if (
            containsBase64Image(
              htmlData
            )
          ) {
            event.preventDefault();
            event.stopPropagation();

            try {
              const parser =
                new DOMParser();

              const documentFragment =
                parser.parseFromString(
                  htmlData,
                  "text/html"
                );

              const images =
                Array.from(
                  documentFragment.querySelectorAll(
                    'img[src^="data:image/"]'
                  )
                );

              /*
               * Upload each embedded image.
               */
              for (
                let i = 0;
                i < images.length;
                i++
              ) {
                const img =
                  images[i];

                const dataUri =
                  img.getAttribute(
                    "src"
                  );

                if (!dataUri) {
                  continue;
                }

                const file =
                  dataUriToFile(
                    dataUri,
                    `knowledge-pasted-${Date.now()}-${i}`
                  );

                if (!file) {
                  continue;
                }

                /*
                 * Do not allow huge pasted
                 * images to enter Quill.
                 */
                const imageUrl =
                  await uploadImageToCloudinary(
                    file
                  );

                img.setAttribute(
                  "src",
                  imageUrl
                );
              }

              /*
               * Remove unsafe image attributes.
               */
              documentFragment
                .querySelectorAll("img")
                .forEach((img) => {
                  img.removeAttribute(
                    "srcset"
                  );

                  img.removeAttribute(
                    "onerror"
                  );

                  img.removeAttribute(
                    "onclick"
                  );
                });

              const safeHTML =
                documentFragment.body
                  .innerHTML;

              const range =
                quill.getSelection(
                  true
                );

              const index = range
                ? range.index
                : Math.max(
                    0,
                    quill.getLength() - 1
                  );

              quill.clipboard.dangerouslyPasteHTML(
                index,
                safeHTML,
                "user"
              );

              updateEditorValue(
                quill
              );
            } catch (error) {
              console.error(
                "PASTED HTML IMAGE UPLOAD ERROR:",
                error
              );

              window.alert(
                error?.message ||
                  "Failed to upload pasted image. Please try again."
              );
            }

            return;
          }

          /*
           * Normal HTML:
           * let Quill handle it.
           */
          return;
        }

        /*
        |--------------------------------------------------------------------------
        | 3. HTML COPIED AS PLAIN TEXT
        |--------------------------------------------------------------------------
        */

        if (
          plainText &&
          isHTML(plainText)
        ) {
          event.preventDefault();
          event.stopPropagation();

          const html =
            cleanHTML(
              plainText
            );

          /*
           * Base64 image in plain-text HTML.
           */
          if (
            containsBase64Image(
              html
            )
          ) {
            try {
              const parser =
                new DOMParser();

              const documentFragment =
                parser.parseFromString(
                  html,
                  "text/html"
                );

              const images =
                Array.from(
                  documentFragment.querySelectorAll(
                    'img[src^="data:image/"]'
                  )
                );

              for (
                let i = 0;
                i < images.length;
                i++
              ) {
                const img =
                  images[i];

                const dataUri =
                  img.getAttribute(
                    "src"
                  );

                if (!dataUri) {
                  continue;
                }

                const file =
                  dataUriToFile(
                    dataUri,
                    `knowledge-pasted-${Date.now()}-${i}`
                  );

                if (!file) {
                  continue;
                }

                const imageUrl =
                  await uploadImageToCloudinary(
                    file
                  );

                img.setAttribute(
                  "src",
                  imageUrl
                );
              }

              const safeHTML =
                documentFragment.body
                  .innerHTML;

              const range =
                quill.getSelection(
                  true
                );

              const index = range
                ? range.index
                : Math.max(
                    0,
                    quill.getLength() - 1
                  );

              quill.clipboard.dangerouslyPasteHTML(
                index,
                safeHTML,
                "user"
              );

              updateEditorValue(
                quill
              );
            } catch (error) {
              console.error(
                "PLAIN HTML IMAGE UPLOAD ERROR:",
                error
              );

              window.alert(
                error?.message ||
                  "Failed to process pasted content."
              );
            }

            return;
          }

          /*
           * Normal HTML/table paste.
           */
          const range =
            quill.getSelection(
              true
            );

          const index = range
            ? range.index
            : Math.max(
                0,
                quill.getLength() - 1
              );

          quill.clipboard.dangerouslyPasteHTML(
            index,
            html,
            "user"
          );

          updateEditorValue(
            quill
          );

          return;
        }

        /*
         * Normal text:
         * let Quill handle it.
         */
      };

      editor.addEventListener(
        "paste",
        handlePaste,
        true
      );

      editor.dataset
        .knowledgePasteHandler =
        "true";

      cleanupPaste = () => {
        editor.removeEventListener(
          "paste",
          handlePaste,
          true
        );

        delete editor.dataset
          .knowledgePasteHandler;
      };

      console.log(
        "Knowledge RichTextEditor: paste handler registered."
      );

      return true;
    };

    /*
     * Try immediately.
     */
    if (attachPasteHandler()) {
      return () => {
        if (cleanupPaste) {
          cleanupPaste();
        }
      };
    }

    /*
     * Wait for dynamically loaded ReactQuill.
     */
    interval = window.setInterval(() => {
      attempts += 1;

      if (
        attachPasteHandler() ||
        attempts >= 50
      ) {
        if (interval) {
          window.clearInterval(
            interval
          );
        }
      }
    }, 100);

    return () => {
      if (interval) {
        window.clearInterval(
          interval
        );
      }

      if (cleanupPaste) {
        cleanupPaste();
      }
    };
  }, []);

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
        maxWidth: "100%",
      }}
    >

      {/* ================================================================
          TABLE TOOLBAR
          ================================================================ */}

      <div className="knowledge-table-toolbar">

        <button
          type="button"
          onClick={insertTable}
          title="Insert 3 × 3 table"
          className="table-insert-button"
        >
          Insert Table
        </button>

        <button
          type="button"
          onClick={insertRowAbove}
          title="Insert row above"
        >
          + Row Above
        </button>

        <button
          type="button"
          onClick={insertRowBelow}
          title="Insert row below"
        >
          + Row Below
        </button>

        <button
          type="button"
          onClick={insertColumnLeft}
          title="Insert column left"
        >
          + Column Left
        </button>

        <button
          type="button"
          onClick={insertColumnRight}
          title="Insert column right"
        >
          + Column Right
        </button>

        <button
          type="button"
          onClick={deleteRow}
          title="Delete current row"
        >
          Delete Row
        </button>

        <button
          type="button"
          onClick={deleteColumn}
          title="Delete current column"
        >
          Delete Column
        </button>

        <button
          type="button"
          onClick={deleteTable}
          title="Delete current table"
        >
          Delete Table
        </button>

      </div>

      {/* ================================================================
          QUILL EDITOR
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