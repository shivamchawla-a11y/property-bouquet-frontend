"use client";

import { useEffect, useState } from "react";
import {
  X,
  ArrowRight,
  Save,
  Loader2,
  Link2,
} from "lucide-react";
import toast from "react-hot-toast";

const API =
  "https://property-bouquet-backend.onrender.com/api/redirections";

export default function RedirectModal({
  open,
  onClose,
  onSuccess,
  redirect,
}) {
  const [form, setForm] = useState({
    from: "",
    to: "",
    type: "301",
    isActive: true,
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (redirect) {
      setForm({
        from: redirect.from || "",
        to: redirect.to || "",
        type: redirect.type || "301",
        isActive:
          redirect.isActive !== undefined
            ? redirect.isActive
            : true,
      });
    } else {
      setForm({
        from: "",
        to: "",
        type: "301",
        isActive: true,
      });
    }
  }, [redirect, open]);

  if (!open) return null;

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const validate = () => {
    if (!form.from.trim()) {
      toast.error("Please enter From URL");
      return false;
    }

    if (!form.to.trim()) {
      toast.error("Please enter Redirect URL");
      return false;
    }

    if (form.from === form.to) {
      toast.error(
        "From URL and Redirect URL cannot be same."
      );
      return false;
    }

    return true;
  };

  const saveRedirect = async () => {
    if (!validate()) return;

    try {
      setSaving(true);

      const payload = {
        from: form.from.trim(),
        to: form.to.trim(),
        type: form.type,
        isActive: form.isActive,
      };

      let res;

      if (redirect) {
        res = await fetch(
          `${API}/${redirect._id}`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
      } else {
        res = await fetch(API, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json();
        throw new Error(
          data.message ||
            "Unable to save redirect"
        );
      }

      toast.success(
        redirect
          ? "Redirect updated"
          : "Redirect created"
      );

      onSuccess();

      onClose();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm p-5">

      <div className="w-full max-w-2xl rounded-[32px] bg-white shadow-2xl overflow-hidden">

        {/* HEADER */}

        <div className="flex items-center justify-between px-8 py-6 border-b">

          <div className="flex items-center gap-4">

            <div className="w-14 h-14 rounded-2xl bg-[#0f3b2e]/10 flex items-center justify-center">

              <Link2
                size={28}
                className="text-[#0f3b2e]"
              />

            </div>

            <div>

              <h2 className="text-2xl font-bold text-[#14352b]">

                {redirect
                  ? "Edit Redirection"
                  : "Add Redirection"}

              </h2>

              <p className="text-gray-500 mt-1">

                Create SEO friendly URL redirects.

              </p>

            </div>

          </div>

          <button
            onClick={onClose}
            className="w-11 h-11 rounded-xl border hover:bg-gray-100 flex items-center justify-center"
          >
            <X
              size={20}
              className="text-[#14352b]"
            />
          </button>

        </div>

        {/* BODY */}

        <div className="p-8 space-y-7">

          {/* FROM URL */}

          <div>

            <label className="block text-sm font-semibold text-[#14352b] mb-2">

              From URL

            </label>

            <input
              value={form.from}
              onChange={(e) =>
                updateField(
                  "from",
                  e.target.value
                )
              }
              placeholder="/old-project"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-[#14352b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a64b]"
            />

          </div>

          {/* ARROW */}

          <div className="flex justify-center">

            <div className="w-12 h-12 rounded-full bg-[#0f3b2e]/10 flex items-center justify-center">

              <ArrowRight className="text-[#0f3b2e]" />

            </div>

          </div>
                    {/* REDIRECT TO */}

          <div>

            <label className="block text-sm font-semibold text-[#14352b] mb-2">
              Redirect To
            </label>

            <input
              value={form.to}
              onChange={(e) =>
                updateField("to", e.target.value)
              }
              placeholder="/new-project"
              className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-[#14352b] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#c9a64b]"
            />

          </div>

          {/* TYPE + STATUS */}

          <div className="grid md:grid-cols-2 gap-6">

            {/* REDIRECT TYPE */}

            <div>

              <label className="block text-sm font-semibold text-[#14352b] mb-2">
                Redirect Type
              </label>

              <select
                value={form.type}
                onChange={(e) =>
                  updateField("type", e.target.value)
                }
                className="w-full rounded-2xl border border-gray-300 px-5 py-4 text-[#14352b] focus:outline-none focus:ring-2 focus:ring-[#c9a64b]"
              >
                <option value="301">
                  301 — Permanent Redirect
                </option>

                <option value="302">
                  302 — Temporary Redirect
                </option>
              </select>

            </div>

            {/* ACTIVE */}

            <div>

              <label className="block text-sm font-semibold text-[#14352b] mb-2">
                Status
              </label>

              <button
                type="button"
                onClick={() =>
                  updateField(
                    "isActive",
                    !form.isActive
                  )
                }
                className={`w-full rounded-2xl py-4 font-semibold transition-all duration-300 ${
                  form.isActive
                    ? "bg-green-100 text-green-700 border border-green-300"
                    : "bg-red-100 text-red-700 border border-red-300"
                }`}
              >
                {form.isActive
                  ? "✓ Active"
                  : "✕ Inactive"}
              </button>

            </div>

          </div>

        </div>

        {/* FOOTER */}

        <div className="border-t bg-[#fafafa] px-8 py-6 flex items-center justify-end gap-4">

          <button
            onClick={onClose}
            disabled={saving}
            className="px-6 py-3 rounded-2xl border border-gray-300 text-[#14352b] hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            onClick={saveRedirect}
            disabled={saving}
            className="bg-gradient-to-r from-[#0f3b2e] to-[#15503d] text-white px-8 py-3 rounded-2xl font-semibold flex items-center gap-3 hover:opacity-90 transition disabled:opacity-60"
          >
            {saving ? (
              <>
                <Loader2
                  size={18}
                  className="animate-spin"
                />
                Saving...
              </>
            ) : (
              <>
                <Save size={18} />

                {redirect
                  ? "Update Redirect"
                  : "Create Redirect"}
              </>
            )}
          </button>

        </div>

      </div>

    </div>
  );
}