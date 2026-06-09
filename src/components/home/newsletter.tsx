"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function Newsletter() {
  const t = useTranslations();
  const [msg, setMsg] = useState<string | null>(null);

  return (
    <div className="mt-10 bg-[#1a1a2e] text-white rounded-2xl p-8 text-center">
      <h3 className="text-xl font-bold mb-2">{t("newsletter.title")}</h3>
      <p className="text-sm text-gray-400 mb-4">{t("newsletter.desc")}</p>
      <form onSubmit={async e => { e.preventDefault(); const fd = new FormData(e.currentTarget); const email = fd.get("email") as string; if (!email) return; try { const r = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }); if (r.ok) { setMsg("success"); (e.target as HTMLFormElement).reset(); } else { const d = await r.json(); setMsg(d.error || "error"); } } catch { setMsg("error"); } }} className="max-w-md mx-auto flex gap-2">
        <input name="email" type="email" placeholder={t("newsletter.placeholder")} className="flex-1 px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-[#c8a84e]" />
        <button type="submit" className="px-6 py-2.5 bg-[#c8a84e] hover:bg-[#b8973f] text-[#1a1a2e] font-bold rounded-xl text-sm transition-colors">{t("newsletter.button")}</button>
      </form>
      {msg === "success" && <p className="text-green-400 text-sm mt-2">تم الاشتراك بنجاح!</p>}
      {msg === "error" && <p className="text-red-400 text-sm mt-2">حدث خطأ. حاول مرة أخرى.</p>}
      {msg === "البريد مسجل مسبقاً" && <p className="text-amber-400 text-sm mt-2">البريد مسجل مسبقاً</p>}
    </div>
  );
}
