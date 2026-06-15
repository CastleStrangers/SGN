"use client";

import { useState } from "react";
import { Send, MessageSquareText } from "lucide-react";
import { useTranslations } from "next-intl";

export function SurveyWidget() {
  const t = useTranslations("survey");
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      const res = await fetch("/api/contact/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        throw new Error("failed");
      }

      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError(t("error"));
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border p-5 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquareText className="w-5 h-5 text-[#1a5632]" />
        <h3 className="font-bold text-gray-900 text-sm">{t("title")}</h3>
      </div>
      <p className="text-xs text-gray-500 mb-4">{t("description")}</p>

      {sent ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{t("success")}</div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder={t("name")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            required
          />
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            placeholder={t("email")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            required
          />
          <input
            type="text"
            value={form.subject}
            onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
            placeholder={t("subject")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            required
          />
          <textarea
            rows={4}
            value={form.message}
            onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))}
            placeholder={t("message")}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
            required
          />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={sending}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1a5632] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f3d23] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send className="w-4 h-4" />
            {sending ? t("sending") : t("submit")}
          </button>
        </form>
      )}
    </div>
  );
}
