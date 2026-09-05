"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import {
  FileText, Shield, Upload, Trash2,
  Sparkles, Loader2, Image as ImageIcon,
  AlertCircle, ChevronLeft
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { TopBar } from "@/components/home/top-bar";
import { SiteHeader } from "@/components/home/site-header";
import { formatDate } from "@/lib/date";

interface Doc {
  id: string;
  title: string;
  fileUrl: string;
  category: string | null;
  analysis: string | null;
  createdAt: string;
}

export default function VaultPage() {
  const { id } = useParams<{ id: string }>();
  const t = useTranslations("userProfile");
  const tm = useTranslations("memberProfilePage");
  const locale = useLocale();
  const isRtl = locale === "ar";

  const [docs, setDocs] = useState<Doc[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<Doc | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/member/vault");
      if (res.ok) {
        const data = await res.json();
        setDocs(data.documents);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);

      const upRes = await fetch("/api/upload", { method: "POST", body: fd });
      const upData = await upRes.json();

      if (!upData.url) throw new Error("Upload failed");

      const saveRes = await fetch("/api/member/vault", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: file.name,
          fileUrl: upData.url,
          category: "letter",
          analyze: true
        }),
      });

      if (saveRes.ok) fetchDocs();
    } catch (e) {
      alert("Error uploading");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm(tm("deleteConfirm") || "Are you sure?")) return;
    try {
      const res = await fetch(`/api/member/vault/${docId}`, { method: "DELETE" });
      if (res.ok) {
        setDocs(docs.filter(d => d.id !== docId));
        if (selectedDoc?.id === docId) setSelectedDoc(null);
      }
    } catch (e) {
      alert("Error deleting");
    }
  };

  return (
    <div dir="auto" className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      <TopBar />
      <SiteHeader />
      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2">
          <Link href={`/profile/${id}`} className="text-slate-400 hover:text-emerald-700 transition-colors">
            {t("title")}
          </Link>
          <ChevronLeft className={`w-4 h-4 text-slate-300 ${isRtl ? "" : "rotate-180"}`} />
          <span className="font-bold text-slate-900">{tm("vaultTitle") || "مخزن المستندات"}</span>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left: Document List */}
          <div className="lg:col-span-7 xl:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-black text-slate-900 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-emerald-700" />
                    {tm("vaultTitle") || "المخزن الآمن"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">{tm("vaultDesc")}</p>
                </div>

                <label className="flex items-center gap-2 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold rounded-xl cursor-pointer transition-all shadow-md shadow-emerald-900/20">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {tm("uploadDoc")}
                  <input type="file" className="hidden" onChange={handleUpload} disabled={uploading} />
                </label>
              </div>

              {loading ? (
                <div className="p-20 flex justify-center">
                  <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
                </div>
              ) : docs.length === 0 ? (
                <div className="p-20 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-slate-200" />
                  <p className="text-slate-400 font-medium">{tm("noDocs")}</p>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      onClick={() => setSelectedDoc(doc)}
                      className={`relative group cursor-pointer rounded-2xl border-2 transition-all overflow-hidden ${
                        selectedDoc?.id === doc.id ? "border-emerald-600 bg-emerald-50" : "border-slate-50 bg-white hover:border-emerald-200"
                      }`}
                    >
                      <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                        <img src={doc.fileUrl} alt={doc.title} className="w-full h-full object-cover" />
                        {doc.analysis && (
                          <div className="absolute top-2 right-2 w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center text-white shadow-lg">
                            <Sparkles className="w-4 h-4" />
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h3 className="text-xs font-bold text-slate-900 truncate">{doc.title}</h3>
                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(doc.createdAt, locale)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: Preview & Analysis */}
          <div className="lg:col-span-5 xl:col-span-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-8">
              {!selectedDoc ? (
                <div className="text-center py-12">
                  <ImageIcon className="w-12 h-12 mx-auto mb-3 text-slate-200" />
                  <p className="text-sm text-slate-400">{t("selectToPreview") || "اختر مستنداً لعرضه وتحليله"}</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h2 className="font-bold text-slate-900 truncate">{selectedDoc.title}</h2>
                    <button onClick={() => handleDelete(selectedDoc.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="rounded-2xl overflow-hidden border shadow-inner bg-slate-50">
                    <img src={selectedDoc.fileUrl} alt="" className="w-full h-auto max-h-[300px] object-contain" />
                  </div>

                  {selectedDoc.analysis ? (
                    <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-100">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <h3 className="text-sm font-black text-amber-900 uppercase tracking-wider">
                          {tm("analysisResult") || "تحليل الذكاء الاصطناعي"}
                        </h3>
                      </div>
                      <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap">
                        {selectedDoc.analysis}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl border border-dashed border-slate-200 text-center">
                      <AlertCircle className="w-5 h-5 mx-auto mb-2 text-slate-300" />
                      <p className="text-xs text-slate-400">لا يوجد تحليل لهذا المستند</p>
                    </div>
                  )}

                  <a
                    href={selectedDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-bold transition-all"
                  >
                    عرض الملف الأصلي
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
