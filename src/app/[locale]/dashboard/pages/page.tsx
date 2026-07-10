"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, ExternalLink, Upload } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { RichTextEditor } from "@/components/rich-text-editor";
import { formatDate } from "@/lib/date";

interface Page { id: string; title: string; slug: string; content: string; excerpt: string; image: string; category: string; tags: string; source: string; featured: boolean; published: boolean; createdAt: string; views?: number; membersOnly?: boolean; }
const CATEGORIES = ["أخبار الجالية", "أخبار هولندا", "أخبار أوروبا", "اقتصاد وأعمال", "ثقافة وفن", "رياضة", "تكنولوجيا", "عمل إنساني", "خدمات", "منوعات"];
export default function PagesPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboard.pagesPage");
  const locale = useLocale();
  const [pages, setPages] = useState<Page[]>([]);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [image, setImage] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tags, setTags] = useState("");
  const [source, setSource] = useState("الجالية السورية في هولندا");
  const [featured, setFeatured] = useState(false);
  const [membersOnly, setMembersOnly] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  // Social media sharing states
  const [shareFacebook, setShareFacebook] = useState(false);
  const [shareInstagram, setShareInstagram] = useState(false);
  const [shareX, setShareX] = useState(false);
  const [shareTelegram, setShareTelegram] = useState(false);
  const [shareWhatsApp, setShareWhatsApp] = useState(false);
  const [shareYouTube, setShareYouTube] = useState(false);
  const [shareTikTok, setShareTikTok] = useState(false);

  const role = (session?.user as any)?.role;

  useEffect(() => {
    if (role && role !== "admin") window.location.href = "/dashboard";
  }, [role]);

  const fetchPages = async () => {
    const res = await fetch("/api/pages"); const data = await res.json();
    if (Array.isArray(data)) setPages(data);
  };
  useEffect(() => { if (status === "authenticated" && role === "admin") fetchPages(); }, [status, role]);

  const generateSlug = (t: string) => t.trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").toLowerCase().slice(0, 80);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); if (!title.trim()) return;
    const method = editing ? "PATCH" : "POST";
    
    // Gather selected platforms for social publishing
    const publishTo: string[] = [];
    if (!editing) {
      if (shareFacebook) publishTo.push("facebook");
      if (shareInstagram) publishTo.push("instagram");
      if (shareX) publishTo.push("x");
      if (shareTelegram) publishTo.push("telegram");
      if (shareWhatsApp) publishTo.push("whatsapp");
      if (shareYouTube) publishTo.push("youtube");
      if (shareTikTok) publishTo.push("tiktok");
    }

    const body: any = { 
      title, 
      content, 
      excerpt, 
      image, 
      category, 
      tags, 
      source, 
      featured, 
      membersOnly,
      slug: slug || generateSlug(title),
      publishTo 
    };
    if (editing) body.id = editing;
    await fetch("/api/pages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setTitle(""); setContent(""); setExcerpt(""); setImage(""); setCategory(CATEGORIES[0]); setTags(""); setSource("الجالية السورية في هولندا"); setFeatured(false); setMembersOnly(false); setSlug(""); setEditing(null); 
    setShareFacebook(false); setShareInstagram(false); setShareX(false); setShareTelegram(false); setShareWhatsApp(false); setShareYouTube(false); setShareTikTok(false);
    fetchPages();
  };

  const deletePage = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/pages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchPages();
  };

  const editPage = (p: Page) => {
    setTitle(p.title); setContent(p.content); setExcerpt(p.excerpt || ""); setImage(p.image || ""); setCategory(p.category || CATEGORIES[0]); setTags(p.tags || ""); setSource(p.source || "الجالية السورية في هولندا"); setFeatured(p.featured || false); setMembersOnly(p.membersOnly || false); setSlug(p.slug || ""); setEditing(p.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border p-4 mb-6 space-y-3">
        <div className="grid md:grid-cols-2 gap-3">
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder={t("titlePlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
          <input value={slug} onChange={e => setSlug(e.target.value)} placeholder={t("slugPlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632] text-gray-400" />
        </div>
        <RichTextEditor value={content} onChange={setContent} placeholder={t("contentPlaceholder")} />
        <div className="grid md:grid-cols-2 gap-3">
          <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} placeholder={t("excerptPlaceholder")} rows={2} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
          <div className="flex gap-2">
            <input value={image} onChange={e => setImage(e.target.value)} placeholder={t("imagePlaceholder")} className="flex-1 px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
            <label className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl text-sm cursor-pointer transition-colors">
              <Upload className="w-4 h-4" />
              <input type="file" accept="image/*" title="Upload Image File" aria-label="Upload Image File" className="hidden" onChange={async e => {
                const f = e.target.files?.[0]; if (!f) return;
                const fd = new FormData(); fd.set("file", f);
                const res = await fetch("/api/upload", { method: "POST", body: fd });
                const data = await res.json();
                if (data.url) setImage(data.url);
              }} />
            </label>
          </div>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          <select value={category} onChange={e => setCategory(e.target.value)} title="Category" aria-label="Category" className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder={t("tagsPlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
          <input value={source} onChange={e => setSource(e.target.value)} placeholder={t("sourcePlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
            {t("featuredLabel")}
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={membersOnly} onChange={e => setMembersOnly(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
            {t("membersOnlyLabel")}
          </label>
        </div>

        {!editing && (
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#1a5632]"></span>
              {t("socialShareTitle")}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareFacebook} onChange={e => setShareFacebook(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareFacebook")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareInstagram} onChange={e => setShareInstagram(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareInstagram")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareX} onChange={e => setShareX(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareX")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareTelegram} onChange={e => setShareTelegram(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareTelegram")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareWhatsApp} onChange={e => setShareWhatsApp(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareWhatsApp")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareYouTube} onChange={e => setShareYouTube(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareYouTube")}</span>
              </label>
              <label className="flex items-center gap-2.5 p-3 rounded-xl border border-gray-100 bg-gray-50 hover:bg-gray-100/70 hover:border-gray-200 cursor-pointer transition-all duration-200">
                <input type="checkbox" checked={shareTikTok} onChange={e => setShareTikTok(e.target.checked)} className="w-4 h-4 text-[#1a5632] rounded border-gray-300 focus:ring-[#1a5632]" />
                <span className="text-xs font-medium text-gray-700">{t("shareTikTok")}</span>
              </label>
            </div>
          </div>
        )}

        <button type="submit" className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 shadow-sm hover:shadow active:scale-[0.98]">
          <Plus className="w-4 h-4" /> {editing ? t("updateButton") : t("addButton")}
        </button>
      </form>

      <div className="space-y-2">
        {pages.map(p => (
          <div key={p.id} className="bg-white rounded-xl border p-4 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium text-gray-900">{p.title}</p>
                {p.featured && <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded">{t("featured")}</span>}
                {!p.published && <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded">{t("draft")}</span>}
              </div>
              <p className="text-xs text-gray-400">
                {p.category} — {formatDate(p.createdAt, locale)} — {p.views || 0} {t("viewsSuffix")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mr-3">
              {p.slug && <a href={`/news/${p.slug}`} target="_blank" title="View Page" aria-label="View Page" className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><ExternalLink className="w-4 h-4" /></a>}
              <button onClick={() => editPage(p)} title="Edit" aria-label="Edit" className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => deletePage(p.id)} title="Delete" aria-label="Delete" className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {pages.length === 0 && <p className="text-center text-gray-400 py-8">{t("noPages")}</p>}
      </div>
    </div>
  );
}
