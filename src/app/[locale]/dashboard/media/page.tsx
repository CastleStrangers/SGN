"use client";
import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Image, Upload, Trash2, Copy, Check, X } from "lucide-react";

interface MediaItem {
  url: string; name: string;
}

export default function MediaPage() {
  const { data: session } = useSession();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const t = useTranslations('dashboard.mediaPage');

  useEffect(() => {
    fetch("/api/uploads").then(r => r.json()).then(data => {
      setItems(Array.isArray(data) ? data : []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (!session || (session.user as any).role !== "admin") {
    return <div className="p-8 text-center text-gray-500">Unauthorized</div>;
  }

  async function upload(file: File) {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (res.ok) {
      const data = await res.json();
      setItems(prev => [{ url: data.url, name: file.name }, ...prev]);
    }
    setUploading(false);
  }

  async function remove(url: string) {
    if (!confirm(t('confirmDelete'))) return;
    const filename = url.replace("/uploads/", "");
    await fetch(`/api/uploads/${filename}`, { method: "DELETE" });
    setItems(items.filter(i => i.url !== url));
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopied(url);
    setTimeout(() => setCopied(null), 2000);
  }

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('title')}</h1>
          <p className="text-sm text-gray-500 mt-1">{t('subtitle')}</p>
        </div>
        <div>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }} />
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="flex items-center gap-2 px-4 py-2 bg-[#1a5632] text-white rounded-lg text-sm hover:bg-[#0f3d23] transition-colors disabled:opacity-50">
            <Upload className="w-4 h-4" /> {uploading ? t('uploading') : t('uploadImage')}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-48"><div className="animate-spin w-8 h-8 border-4 border-[#1a5632] border-t-transparent rounded-full" /></div>
      ) : items.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <Image className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-lg font-medium mb-2">{t('noMedia')}</p>
          <p className="text-sm">{t('noMediaDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map(item => (
            <div key={item.url} className="group relative bg-white rounded-2xl border overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square bg-gray-50">
                <img src={item.url} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="p-2">
                <p className="text-xs text-gray-600 truncate">{item.name}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => copyUrl(item.url)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm" title={t('copyLink')}>
                  {copied === item.url ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-gray-600" />}
                </button>
                <button onClick={() => remove(item.url)} className="p-1.5 bg-white/90 rounded-lg hover:bg-white shadow-sm" title={t('delete')}>
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
