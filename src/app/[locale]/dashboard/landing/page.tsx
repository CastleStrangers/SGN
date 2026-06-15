"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ExternalLink, Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

interface LandingPage {
  id: string; title: string; slug: string; published: boolean;
  createdAt: string; metaTitle: string | null;
}

export default function LandingAdminPage() {
  const t = useTranslations("dashboard.landingPage");
  const tApi = useTranslations("api");
  const { data: session } = useSession();
  const router = useRouter();
  const [pages, setPages] = useState<LandingPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "", subtitle: "", slug: "", heroImage: "", heroHeadline: "",
    heroSubheadline: "", content: "", ctaText: "", ctaLink: "",
    themeColor: "#1a5632", metaTitle: "", metaDescription: "", published: false,
  });

  useEffect(() => {
    fetch("/api/landing").then(r => r.json()).then(data => {
      setPages(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!session || (session.user as any).role !== "admin") {
    return <div className="p-8 text-center text-gray-500">{tApi("unauthorized")}</div>;
  }

  async function save() {
    const url = editId ? "/api/landing" : "/api/landing";
    const method = editId ? "PUT" : "POST";
    const body = editId ? { id: editId, ...form } : form;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setShowForm(false);
      setEditId(null);
      setForm({ title: "", subtitle: "", slug: "", heroImage: "", heroHeadline: "", heroSubheadline: "", content: "", ctaText: "", ctaLink: "", themeColor: "#1a5632", metaTitle: "", metaDescription: "", published: false });
      const data = await fetch("/api/landing").then(r => r.json());
      setPages(Array.isArray(data) ? data : []);
    }
  }

  async function remove(id: string) {
    if (!confirm(t("confirmDelete"))) return;
    await fetch("/api/landing", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setPages(pages.filter(p => p.id !== id));
  }

  function edit(p: LandingPage) {
    setEditId(p.id);
    setForm({ ...form, title: p.title, slug: p.slug, published: p.published });
    setShowForm(true);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t("title")}</h1>
          <p className="text-sm text-gray-500 mt-1">{t("subtitle")}</p>
        </div>
        <button
          onClick={() => { setShowForm(!showForm); setEditId(null); }}
          title={t("newPage")}
          aria-label={t("newPage")}
          className="flex items-center gap-2 px-4 py-2 bg-[#1a5632] text-white rounded-lg text-sm hover:bg-[#0f3d23] transition-colors"
        >
          <Plus className="w-4 h-4" /> {t("newPage")}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input
              title={t("placeholderTitle")}
              placeholder={t("placeholderTitle")}
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderSlug")}
              placeholder={t("placeholderSlug")}
              value={form.slug}
              onChange={e => setForm({ ...form, slug: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderSubtitle")}
              placeholder={t("placeholderSubtitle")}
              value={form.subtitle}
              onChange={e => setForm({ ...form, subtitle: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderHeroImage")}
              placeholder={t("placeholderHeroImage")}
              value={form.heroImage}
              onChange={e => setForm({ ...form, heroImage: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderHeroHeadline")}
              placeholder={t("placeholderHeroHeadline")}
              value={form.heroHeadline}
              onChange={e => setForm({ ...form, heroHeadline: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderHeroSubheadline")}
              placeholder={t("placeholderHeroSubheadline")}
              value={form.heroSubheadline}
              onChange={e => setForm({ ...form, heroSubheadline: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderCtaText")}
              placeholder={t("placeholderCtaText")}
              value={form.ctaText}
              onChange={e => setForm({ ...form, ctaText: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderCtaLink")}
              placeholder={t("placeholderCtaLink")}
              value={form.ctaLink}
              onChange={e => setForm({ ...form, ctaLink: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderThemeColor")}
              placeholder={t("placeholderThemeColor")}
              value={form.themeColor}
              onChange={e => setForm({ ...form, themeColor: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
            <input
              title={t("placeholderMetaTitle")}
              placeholder={t("placeholderMetaTitle")}
              value={form.metaTitle}
              onChange={e => setForm({ ...form, metaTitle: e.target.value })}
              className="border rounded-xl px-4 py-2.5 text-sm"
            />
          </div>
          <textarea
            title={t("placeholderMetaDescription")}
            placeholder={t("placeholderMetaDescription")}
            value={form.metaDescription}
            onChange={e => setForm({ ...form, metaDescription: e.target.value })}
            className="border rounded-xl px-4 py-2.5 text-sm w-full"
            rows={2}
          />
          <textarea
            title={t("placeholderContent")}
            placeholder={t("placeholderContent")}
            value={form.content}
            onChange={e => setForm({ ...form, content: e.target.value })}
            className="border rounded-xl px-4 py-2.5 text-sm w-full font-mono"
            rows={6}
          />
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              title={t("published")}
              checked={form.published}
              onChange={e => setForm({ ...form, published: e.target.checked })}
            />
            {t("published")}
          </label>
          <div className="flex gap-2">
            <button
              onClick={save}
              title={editId ? t("update") : t("create")}
              className="px-6 py-2 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors"
            >
              {editId ? t("update") : t("create")}
            </button>
            <button
              onClick={() => setShowForm(false)}
              title={t("cancel")}
              className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors"
            >
              {t("cancel")}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium mb-2">{t("noPages")}</p>
          <p className="text-sm">{t("createFirst")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{p.title}</h3>
                  {p.published ? (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> {t("published")}</span>
                  ) : (
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff className="w-3 h-3" /> {t("draft")}</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={`/landing/${p.slug}`}
                  target="_blank"
                  title={t("title")}
                  aria-label="Preview"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <button
                  onClick={() => edit(p)}
                  title={t("update")}
                  aria-label="Edit"
                  className="p-2 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button
                  onClick={() => remove(p.id)}
                  title={t("confirmDelete")}
                  aria-label="Delete"
                  className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
