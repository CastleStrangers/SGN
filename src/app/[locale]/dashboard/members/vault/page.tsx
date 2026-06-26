"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import {
  FileText, Shield, Search, Trash2,
  Sparkles, Loader2, Image as ImageIcon,
  CheckCircle, XCircle, ExternalLink, User
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatDate } from "@/lib/date";

interface DocWithMember {
  id: string;
  title: string;
  fileUrl: string;
  category: string | null;
  analysis: string | null;
  status: string;
  createdAt: string;
  member: {
    id: string;
    nameAr: string;
    nameNl: string;
  };
}

export default function AdminVaultPage() {
  const t = useTranslations("dashboard.memberProfilePage");
  const [docs, setDocs] = useState<DocWithMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [selectedDoc, setSelectedDoc] = useState<DocWithMember | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchDocs();
  }, []);

  const fetchDocs = async () => {
    try {
      const res = await fetch("/api/admin/vault");
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

  const updateDocStatus = async (docId: string, status: string) => {
    setUpdating(docId);
    setFeedback(null);
    try {
      const res = await fetch(`/api/admin/vault/${docId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated = docs.map(d => d.id === docId ? { ...d, status } : d);
        setDocs(updated);
        if (selectedDoc?.id === docId) setSelectedDoc({ ...selectedDoc, status });
        setFeedback({ type: "success", msg: status === "approved" ? "تم اعتماد المستند بنجاح" : "تم رفض المستند" });
      } else {
        const err = await res.json();
        setFeedback({ type: "error", msg: err.error || "حدث خطأ" });
      }
    } catch {
      setFeedback({ type: "error", msg: "فشل الاتصال بالخادم" });
    } finally {
      setUpdating(null);
    }
  };

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(q.toLowerCase()) ||
    d.member.nameAr.includes(q) ||
    d.member.nameNl.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {feedback && (
        <div className={`p-4 rounded-xl text-sm font-bold ${feedback.type === "success" ? "bg-emerald-50 text-emerald-700 border border-emerald-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {feedback.msg}
          <button onClick={() => setFeedback(null)} className="mr-3 text-xs opacity-70 hover:opacity-100">✕</button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="w-6 h-6 text-emerald-700" />
            إدارة مخزن المستندات
          </h1>
          <p className="text-sm text-gray-500 mt-1">عرض وتحقق من الوثائق المرفوعة من قبل الأعضاء</p>
        </div>
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="بحث باسم العضو أو المستند..."
            className="w-full pl-10 pr-4 py-2 border rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Document List */}
        <div className="lg:col-span-7 xl:col-span-8">
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-20 flex justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-emerald-700" />
              </div>
            ) : filteredDocs.length === 0 ? (
              <div className="p-20 text-center">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-200" />
                <p className="text-gray-400 font-medium">لا توجد مستندات مطابقة</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-right text-sm">
                    <thead className="bg-gray-50 text-gray-500 font-bold">
                    <tr>
                      <th className="px-6 py-3">المستند</th>
                      <th className="px-6 py-3">العضو</th>
                      <th className="px-6 py-3">التاريخ</th>
                      <th className="px-6 py-3 text-center">الحالة</th>
                      <th className="px-6 py-3 text-center">الذكاء الاصطناعي</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {filteredDocs.map((doc) => (
                      <tr
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`cursor-pointer transition-colors ${selectedDoc?.id === doc.id ? "bg-emerald-50" : "hover:bg-gray-50"}`}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                              <ImageIcon className="w-5 h-5 text-gray-400" />
                            </div>
                            <span className="font-medium text-gray-900 truncate max-w-[150px]">{doc.title}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">
                          <div className="flex flex-col">
                            <span className="font-bold">{doc.member.nameAr}</span>
                            <span className="text-[10px] text-gray-400">{doc.member.nameNl}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {new Date(doc.createdAt).toLocaleDateString("ar-SA")}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            doc.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                            doc.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                          }`}>
                            {doc.status === "approved" ? "مقبول" : doc.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          {doc.analysis ? (
                            <Sparkles className="w-4 h-4 text-amber-500 mx-auto" />
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="lg:col-span-5 xl:col-span-4">
          <div className="bg-white rounded-2xl border shadow-sm p-6 sticky top-6">
            {!selectedDoc ? (
              <div className="text-center py-20">
                <Shield className="w-12 h-12 mx-auto mb-3 text-gray-200" />
                <p className="text-sm text-gray-400">اختر مستنداً للمعاينة والتحقق</p>
              </div>
            ) : (
              <div className="space-y-6 text-right">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-gray-900 truncate">{selectedDoc.title}</h2>
                  <Link
                    href={`/profile/${selectedDoc.member.id}`}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="عرض ملف العضو"
                  >
                    <User className="w-4 h-4" />
                  </Link>
                </div>

                <div className="rounded-xl overflow-hidden border bg-gray-50 aspect-video flex items-center justify-center">
                  <img src={selectedDoc.fileUrl} alt="" className="max-w-full max-h-full object-contain" />
                </div>

                {selectedDoc.analysis && (
                  <div className="p-4 rounded-xl bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                      <h3 className="text-xs font-black text-amber-900 uppercase">تحليل الذكاء الاصطناعي</h3>
                    </div>
                    <p className="text-xs text-amber-800 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                      {selectedDoc.analysis}
                    </p>
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <a
                    href={selectedDoc.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all"
                  >
                    <ExternalLink className="w-4 h-4" />
                    فتح الملف الأصلي
                  </a>

                  <div className="flex items-center justify-between px-1">
                    <span className="text-xs text-gray-400">الحالة:</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      selectedDoc.status === "approved" ? "bg-emerald-100 text-emerald-800" :
                      selectedDoc.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                    }`}>
                      {selectedDoc.status === "approved" ? "مقبول" : selectedDoc.status === "rejected" ? "مرفوض" : "قيد المراجعة"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => updateDocStatus(selectedDoc.id, "approved")}
                      disabled={updating === selectedDoc.id || selectedDoc.status === "approved"}
                      className="flex items-center justify-center gap-2 py-2 border border-emerald-200 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {updating === selectedDoc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3.5 h-3.5" />
                      )}
                      اعتماد المستند
                    </button>
                    <button
                      onClick={() => updateDocStatus(selectedDoc.id, "rejected")}
                      disabled={updating === selectedDoc.id || selectedDoc.status === "rejected"}
                      className="flex items-center justify-center gap-2 py-2 border border-red-200 text-red-700 rounded-xl text-xs font-bold hover:bg-red-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {updating === selectedDoc.id ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5" />
                      )}
                      رفض المستند
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
