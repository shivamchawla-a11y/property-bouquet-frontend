"use client";

import { Trash2, X } from "lucide-react";

export default function DeleteRedirectModal({
  open,
  redirect,
  onCancel,
  onDelete,
  deleting,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-sm flex items-center justify-center p-5">

      <div className="bg-white rounded-[30px] shadow-2xl w-full max-w-lg overflow-hidden">

        <div className="p-8">

          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mx-auto">

            <Trash2
              className="text-red-600"
              size={30}
            />

          </div>

          <h2 className="text-2xl font-bold text-center text-[#14352b] mt-6">
            Delete Redirect
          </h2>

          <p className="text-center text-gray-500 mt-3 leading-7">

            This redirect will be permanently removed.

            <br />

            <span className="font-semibold text-[#14352b]">
              {redirect?.from}
            </span>

          </p>

        </div>

        <div className="border-t bg-[#fafafa] p-6 flex justify-end gap-4">

          <button
            onClick={onCancel}
            disabled={deleting}
            className="px-6 py-3 rounded-xl border"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            disabled={deleting}
            className="px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700"
          >
            {deleting ? "Deleting..." : "Delete Redirect"}
          </button>

        </div>

      </div>

    </div>
  );
}