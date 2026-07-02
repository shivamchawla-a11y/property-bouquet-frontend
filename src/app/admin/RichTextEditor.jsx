"use client";

import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import "quill-table-better/dist/quill-table-better.css";

const ReactQuill = dynamic(
  () => import("react-quill-new"),
  { ssr: false }
);

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

export default function RichTextEditor({
  value,
  onChange,
}) {
  return (
    <div className="bg-white">
      <ReactQuill
        theme="snow"
        value={value}
        onChange={onChange}
        modules={modules}
        className="text-black"
      />
    </div>
  );
}