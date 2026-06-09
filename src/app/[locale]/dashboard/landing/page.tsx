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
  const t = useTranslations();
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
    return <div className="p-8 text-center text-gray-500">Unauthorized</div>;
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
    if (!confirm("Confirm delete?")) return;
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
          <h1 className="text-2xl font-bold text-gray-900">Landing Pages</h1>
          <p className="text-sm text-gray-500 mt-1">إدارة صفحات الهبوط للحملات الدعوية</p>
        </div>
        <button onClick={() => { setShowForm(!showForm); setEditId(null); }} className="flex items-center gap-2 px-4 py-2 bg-[#1a5632] text-white rounded-lg text-sm hover:bg-[#0f3d23] transition-colors">
          <Plus className="w-4 h-4" /> New Page
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border p-6 mb-6 space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <input placeholder="Title *" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Slug (auto)" value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Subtitle" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Hero Image URL" value={form.heroImage} onChange={e => setForm({ ...form, heroImage: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Hero Headline" value={form.heroHeadline} onChange={e => setForm({ ...form, heroHeadline: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Hero Subheadline" value={form.heroSubheadline} onChange={e => setForm({ ...form, heroSubheadline: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="CTA Text" value={form.ctaText} onChange={e => setForm({ ...form, ctaText: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="CTA Link" value={form.ctaLink} onChange={e => setForm({ ...form, ctaLink: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Theme Color (#1a5632)" value={form.themeColor} onChange={e => setForm({ ...form, themeColor: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
            <input placeholder="Meta Title (SEO)" value={form.metaTitle} onChange={e => setForm({ ...form, metaTitle: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm" />
          </div>
          <textarea placeholder="Meta Description (SEO)" value={form.metaDescription} onChange={e => setForm({ ...form, metaDescription: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm w-full" rows={2} />
          <textarea placeholder="Content (HTML supported)" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} className="border rounded-xl px-4 py-2.5 text-sm w-full font-mono" rows={6} />
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.published} onChange={e => setForm({ ...form, published: e.target.checked })} />
            Published
          </label>
          <div className="flex gap-2">
            <button onClick={save} className="px-6 py-2 bg-[#1a5632] text-white rounded-xl text-sm hover:bg-[#0f3d23] transition-colors">
              {editId ? "Update" : "Create"}
            </button>
            <button onClick={() => setShowForm(false)} className="px-6 py-2 border rounded-xl text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" />
        </div>
      ) : pages.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium mb-2">No landing pages yet</p>
          <p className="text-sm">Create your first campaign page</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map(p => (
            <div key={p.id} className="bg-white rounded-2xl border p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-gray-900 truncate">{p.title}</h3>
                  {p.published ? (
                    <span className="text-xs bg-green-50 text-green-600 px-2 py-0.5 rounded-full flex items-center gap-1"><Eye className="w-3 h-3" /> Published</span>
                  ) : (
                    <span className="text-xs bg-gray-50 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1"><EyeOff className="w-3 h-3" /> Draft</span>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">/{p.slug}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <a href={`/landing/${p.slug}`} target="_blank" className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-gray-400" />
                </a>
                <button onClick={() => edit(p)} className="p-2 hover:bg-gray-50 rounded-lg transition-colors">
                  <Pencil className="w-4 h-4 text-gray-400" />
                </button>
                <button onClick={() => remove(p.id)} className="p-2 hover:bg-red-50 rounded-lg transition-colors">
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
