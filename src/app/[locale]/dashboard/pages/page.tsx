"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Plus, Edit3, Trash2, ExternalLink, Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { RichTextEditor } from "@/components/rich-text-editor";

interface Page { id: string; title: string; slug: string; content: string; excerpt: string; image: string; category: string; tags: string; source: string; featured: boolean; published: boolean; createdAt: string; views?: number; }

const CATEGORIES = ["أخبار الجالية", "أخبار هولندا", "أخبار أوروبا", "اقتصاد وأعمال", "ثقافة وفن", "رياضة", "تكنولوجيا", "عمل إنساني", "خدمات"];

export default function PagesPage() {
  const { data: session, status } = useSession();
  const t = useTranslations("dashboard.pagesPage");
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
  const [editing, setEditing] = useState<string | null>(null);

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
    const body: any = { title, content, excerpt, image, category, tags, source, featured, slug: slug || generateSlug(title) };
    if (editing) body.id = editing;
    await fetch("/api/pages", { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setTitle(""); setContent(""); setExcerpt(""); setImage(""); setCategory(CATEGORIES[0]); setTags(""); setSource("الجالية السورية في هولندا"); setFeatured(false); setSlug(""); setEditing(null); fetchPages();
  };

  const deletePage = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/pages", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    fetchPages();
  };

  const editPage = (p: Page) => {
    setTitle(p.title); setContent(p.content); setExcerpt(p.excerpt || ""); setImage(p.image || ""); setCategory(p.category || CATEGORIES[0]); setTags(p.tags || ""); setSource(p.source || "الجالية السورية في هولندا"); setFeatured(p.featured || false); setSlug(p.slug || ""); setEditing(p.id);
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
              <input type="file" accept="image/*" className="hidden" onChange={async e => {
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
          <select value={category} onChange={e => setCategory(e.target.value)} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]">
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder={t("tagsPlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
          <input value={source} onChange={e => setSource(e.target.value)} placeholder={t("sourcePlaceholder")} className="w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
        </div>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={featured} onChange={e => setFeatured(e.target.checked)} className="w-4 h-4 text-[#1a5632]" />
            {t("featuredLabel")}
          </label>
        </div>
        <button type="submit" className="flex items-center gap-2 bg-[#1a5632] hover:bg-[#0f3d23] text-white px-5 py-2.5 rounded-xl text-sm transition-colors">
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
                {p.category} — {new Date(p.createdAt).toLocaleDateString()} — {p.views || 0} {t("viewsSuffix")}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 mr-3">
              {p.slug && <a href={`/news/${p.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><ExternalLink className="w-4 h-4" /></a>}
              <button onClick={() => editPage(p)} className="p-1.5 hover:bg-gray-100 rounded text-gray-400"><Edit3 className="w-4 h-4" /></button>
              <button onClick={() => deletePage(p.id)} className="p-1.5 hover:bg-red-50 rounded text-gray-400 hover:text-red-500"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
        {pages.length === 0 && <p className="text-center text-gray-400 py-8">{t("noPages")}</p>}
      </div>
    </div>
  );
}
