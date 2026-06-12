"use client";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { formatDate } from "@/lib/date";
import { Check, X, Search, Loader2, Trash2, Download, Edit3, ExternalLink, FileText, Badge, CreditCard, Upload, Mail, Square, CheckSquare, History } from "lucide-react";

interface Member {
  id: string; memberNumber?: number | null;
  nameAr: string; nameNl: string; birthYear: number; gender: string;
  originCity: string; whatsapp: string; email: string | null;
  nlProvincie: string; nlCity: string; expNl: string | null; expOutside: string | null;
  status: string; notes: string | null; createdAt: string;
}

interface EditForm {
  memberNumber: string;
  nameAr: string; nameNl: string; email: string; whatsapp: string;
  originCity: string; nlProvincie: string; nlCity: string;
  expNl: string; expOutside: string;
  educationLevel: string; profession: string; skills: string; maritalStatus: string;
  notes: string;
}

const SYRIAN_GOVERNORATES = ["دمشق", "ريف دمشق", "حلب", "حمص", "حماة", "اللاذقية", "طرطوس", "إدلب", "دير الزور", "الرقة", "الحسكة", "درعا", "السويداء", "القنيطرة"];
const NL_PROVINCES = ["Zuid-Holland", "Noord-Holland", "Utrecht", "Gelderland", "Noord-Brabant", "Overijssel", "Flevoland", "Groningen", "Friesland", "Drenthe", "Zeeland", "Limburg"];

export default function MembersPage() {
  const t = useTranslations("membersDashboard");
  const locale = useLocale();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState<EditForm>({
    memberNumber: "", nameAr: "", nameNl: "", email: "", whatsapp: "",
    originCity: "", nlProvincie: "", nlCity: "", expNl: "", expOutside: "",
    educationLevel: "", profession: "", skills: "", maritalStatus: "", notes: "",
  });
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importMsg, setImportMsg] = useState("");
  const [showEmail, setShowEmail] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailSending, setEmailSending] = useState(false);
  const [emailResult, setEmailResult] = useState("");
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppMessage, setWhatsAppMessage] = useState("");
  const [whatsAppSending, setWhatsAppSending] = useState(false);
  const [whatsAppResult, setWhatsAppResult] = useState("");
  const [showActivity, setShowActivity] = useState<string | null>(null);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [batchStatus, setBatchStatus] = useState("pending");
  const [batchNotes, setBatchNotes] = useState("");

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/members");
      const data = await res.json();
      setMembers(Array.isArray(data) ? data : []);
    } catch {
      setMembers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMembers(); }, []);

  const updateStatus = async (id: string, status: string) => {
    await fetch(`/api/members/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    fetchMembers();
  };

  const deleteMember = async (id: string) => {
    if (!confirm(t("confirmDelete"))) return;
    await fetch(`/api/members/${id}`, { method: "DELETE" });
    fetchMembers();
  };

  const exportExcel = () => {
    const a = document.createElement("a");
    a.href = "/api/members/export";
    a.download = "";
    a.click();
  };

  const exportPdf = (id: string) => {
    const a = document.createElement("a");
    a.href = `/api/members/${id}/pdf`;
    a.download = "";
    a.click();
  };

  const openEdit = (m: Member) => {
    setEditForm({
      memberNumber: m.memberNumber?.toString() || "",
      nameAr: m.nameAr, nameNl: m.nameNl,
      email: m.email || "", whatsapp: m.whatsapp,
      originCity: m.originCity, nlProvincie: m.nlProvincie, nlCity: m.nlCity,
      expNl: m.expNl || "", expOutside: m.expOutside || "",
      educationLevel: (m as any).educationLevel || "",
      profession: (m as any).profession || "",
      skills: (m as any).skills || "",
      maritalStatus: (m as any).maritalStatus || "",
      notes: m.notes || "",
    });
    setEditing(m);
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const body: any = { ...editForm };
      if (editForm.memberNumber) body.memberNumber = parseInt(editForm.memberNumber);
      await fetch(`/api/members/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      setEditing(null);
      fetchMembers();
    } finally {
      setSaving(false);
    }
  };

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(m => m.id)));
  };

  const doBatch = async (action: string) => {
    if (selected.size === 0) return;
    if (action === "delete" && !confirm(`حذف ${selected.size} عضو؟`)) return;
    await fetch("/api/members/batch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected), action, status: action === "status" ? batchStatus : undefined, notes: batchNotes || undefined }),
    });
    setSelected(new Set());
    setBatchNotes("");
    fetchMembers();
  };

  const importExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);
    setImportMsg("");
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/members/import", { method: "POST", body: fd });
    const data = await res.json();
    setImportMsg(`تم استيراد ${data.imported} عضو، تخطي ${data.skipped}`);
    setImporting(false);
    fetchMembers();
  };

  const sendEmail = async () => {
    if (!emailSubject || !emailMessage) return;
    setEmailSending(true);
    setEmailResult("");
    const res = await fetch("/api/members/email-broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: filter, subject: emailSubject, message: emailMessage }),
    });
    const data = await res.json();
    setEmailResult(res.ok ? `تم الإرسال إلى ${data.sent} عضو` : data.error);
    setEmailSending(false);
  };

  const sendWhatsApp = async () => {
    if (!whatsAppMessage) return;
    setWhatsAppSending(true);
    setWhatsAppResult("");
    const res = await fetch("/api/members/whatsapp-broadcast", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: filter, message: whatsAppMessage }),
    });
    const data = await res.json();
    setWhatsAppResult(res.ok ? `تم الإرسال إلى ${data.sent} عضو` : data.error);
    setWhatsAppSending(false);
  };

  const viewActivity = async (memberId: string) => {
    setShowActivity(memberId);
    const res = await fetch(`/api/members/activity?memberId=${memberId}`);
    setActivityLogs(await res.json());
  };

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchSearch = m.nameAr.includes(q) || m.nameNl.toLowerCase().includes(q) || m.whatsapp.includes(q);
    const matchFilter = filter === "all" || m.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{t("title")}</h1>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder={t("search")} title={t("search")} aria-label={t("search")} className="w-full pr-10 p-3 border rounded-xl text-sm bg-white" />
        </div>
        <select value={filter} onChange={e => setFilter(e.target.value)} title="تصفية حسب الحالة" aria-label="تصفية حسب الحالة" className="p-3 border rounded-xl text-sm bg-white">
          <option value="all">{t("all")}</option>
          <option value="pending">{t("pending")}</option>
          <option value="accepted">{t("accepted")}</option>
          <option value="rejected">{t("rejected")}</option>
        </select>
        <button onClick={exportExcel} className="p-3 border rounded-xl text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2 whitespace-nowrap" title={t("excel")}>
          <Download className="w-4 h-4" /> {t("excel")}
        </button>
        <label className="p-3 border rounded-xl text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2 cursor-pointer whitespace-nowrap" title="استيراد Excel">
          <Upload className="w-4 h-4" /> {importing ? "جاري الاستيراد..." : "استيراد"}
          <input type="file" accept=".csv,.txt" className="hidden" title="استيراد ملف Excel" aria-label="استيراد ملف Excel" onChange={importExcel} disabled={importing} />
        </label>
        <button onClick={() => setShowEmail(true)} className="p-3 border rounded-xl text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2 whitespace-nowrap" title="بريد جماعي">
          <Mail className="w-4 h-4" /> بريد
        </button>
        <button onClick={() => setShowWhatsApp(true)} className="p-3 border rounded-xl text-sm bg-white hover:bg-gray-50 transition flex items-center gap-2 whitespace-nowrap" title="واتساب جماعي">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" title="رمز واتساب" aria-label="رمز واتساب"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> واتساب
        </button>
      </div>
      {importMsg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{importMsg}</div>}

      {selected.size > 0 && (
        <div className="mb-4 p-3 bg-blue-50 rounded-xl flex flex-wrap items-center gap-3 text-sm">
          <span className="font-bold text-blue-800">تم اختيار {selected.size} عضو</span>
          <select value={batchStatus} onChange={e => setBatchStatus(e.target.value)} title="حالة الدفعة" aria-label="حالة الدفعة" className="p-2 border rounded-lg text-sm bg-white">
            <option value="pending">قيد المراجعة</option>
            <option value="accepted">مقبول</option>
            <option value="rejected">مرفوض</option>
          </select>
          <input type="text" value={batchNotes} onChange={e => setBatchNotes(e.target.value)} placeholder="ملاحظات..." title="ملاحظات..." aria-label="ملاحظات..." className="p-2 border rounded-lg text-sm flex-1 min-w-[120px]" />
          <button onClick={() => doBatch("status")} className="px-4 py-2 bg-emerald-700 text-white rounded-lg hover:bg-emerald-800 transition">تطبيق الحالة</button>
          <button onClick={() => doBatch("delete")} className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">حذف</button>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-emerald-800" /></div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{t("noMembers")}</div>
      ) : (
        <div className="space-y-3">
          {filtered.map(m => (
            <div key={m.id} className="bg-white rounded-xl border p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSelect(m.id)} className="shrink-0 text-gray-400 hover:text-emerald-700 transition">
                      {selected.has(m.id) ? <CheckSquare className="w-4 h-4 text-emerald-700" /> : <Square className="w-4 h-4" />}
                    </button>
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-900">{m.nameAr}</h3>
                      <span className="text-sm text-gray-500" dir="ltr">{m.nameNl}</span>
                      {m.status === "accepted" && (
                        <a href={`/member/${m.id}`} target="_blank" className="text-emerald-600 hover:text-emerald-800 transition" title={t("viewPublic")}>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        m.status === "accepted" ? "bg-emerald-100 text-emerald-800" :
                        m.status === "rejected" ? "bg-red-100 text-red-800" : "bg-yellow-100 text-yellow-800"
                      }`}>
                        {m.status === "accepted" ? t("accepted") : m.status === "rejected" ? t("rejected") : t("pending")}
                      </span>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-2 space-y-1 mr-6">
                    <div className="flex flex-wrap gap-x-6 gap-y-1">
                      {m.memberNumber && <span><Badge className="w-3 h-3 inline" /> #{m.memberNumber}</span>}
                      <span>📞 {m.whatsapp}</span>
                      {m.email && <span>✉️ {m.email}</span>}
                      <span>📍 {m.originCity} ← {m.nlProvincie} / {m.nlCity}</span>
                      <span>🎂 {m.birthYear}</span>
                      <span>{m.gender === "ذكر" ? "♂" : "♀"} {m.gender}</span>
                    </div>
                    {m.expNl && <p className="text-gray-600 mt-1"><span className="text-gray-400">{t("expNl")}:</span> {m.expNl}</p>}
                    {m.expOutside && <p className="text-gray-600"><span className="text-gray-400">{t("expOutside")}:</span> {m.expOutside}</p>}
                    {m.notes && <p className="text-gray-600 mt-1"><span className="text-gray-400">{t("notes")}:</span> {m.notes}</p>}
                  </div>
                  <div className="text-[10px] text-gray-400 mt-2 mr-6">{formatDate(m.createdAt, locale)}</div>
                </div>
                <div className="flex gap-2 shrink-0 flex-col sm:flex-row">
                  <div className="flex gap-2">
                    {m.status !== "accepted" && (
                      <button onClick={() => updateStatus(m.id, "accepted")} className="p-2 bg-emerald-100 text-emerald-700 rounded-xl hover:bg-emerald-200 transition" title={t("accept")}>
                        <Check className="w-4 h-4" />
                      </button>
                    )}
                    {m.status !== "rejected" && (
                      <button onClick={() => updateStatus(m.id, "rejected")} className="p-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition" title={t("reject")}>
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => viewActivity(m.id)} className="p-2 bg-gray-100 text-gray-600 rounded-xl hover:bg-gray-200 transition" title="سجل النشاط">
                      <History className="w-4 h-4" />
                    </button>
                    <button onClick={() => openEdit(m)} className="p-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition" title={t("edit")}>
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => exportPdf(m.id)} className="p-2 bg-violet-100 text-violet-700 rounded-xl hover:bg-violet-200 transition" title="PDF">
                      <FileText className="w-4 h-4" />
                    </button>
                    <a href={`/membership-card/${m.id}`} target="_blank" className="p-2 bg-amber-100 text-amber-700 rounded-xl hover:bg-amber-200 transition inline-flex" title="بطاقة العضوية">
                      <CreditCard className="w-4 h-4" />
                    </a>
                    <button onClick={() => deleteMember(m.id)} className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition" title={t("delete")}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Activity Log Modal */}
      {showActivity && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowActivity(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-y-auto p-6" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">سجل النشاط</h2>
              <button onClick={() => setShowActivity(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            {activityLogs.length === 0 ? (
              <p className="text-gray-500 text-sm">لا يوجد نشاط مسجل</p>
            ) : (
              <div className="space-y-2">
                {activityLogs.map((log: any) => (
                  <div key={log.id} className="p-3 bg-gray-50 rounded-xl text-sm">
                    <div className="font-medium text-gray-800">{log.action}</div>
                    {log.details && <div className="text-gray-500 text-xs mt-1">{log.details}</div>}
                    <div className="text-gray-400 text-[10px] mt-1">{new Date(log.createdAt).toLocaleString("ar")}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Email Broadcast Modal */}
      {showEmail && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowEmail(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">إرسال بريد جماعي</h2>
              <button onClick={() => setShowEmail(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">الحالة المحددة: {filter === "all" ? "الكل" : filter}</p>
              <input type="text" value={emailSubject} onChange={e => setEmailSubject(e.target.value)} placeholder="الموضوع" className="w-full p-2.5 border rounded-xl text-sm" />
              <textarea value={emailMessage} onChange={e => setEmailMessage(e.target.value)} placeholder="الرسالة (HTML)" className="w-full p-2.5 border rounded-xl text-sm h-40 resize-none" />
              {emailResult && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{emailResult}</div>}
              <button onClick={sendEmail} disabled={emailSending} className="w-full py-3 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition disabled:opacity-50">
                {emailSending ? "جاري الإرسال..." : "إرسال"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* WhatsApp Broadcast Modal */}
      {showWhatsApp && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setShowWhatsApp(false)}>
          <div className="bg-white rounded-2xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">إرسال واتساب جماعي</h2>
              <button onClick={() => setShowWhatsApp(false)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-gray-500">الحالة المحددة: {filter === "all" ? "الكل" : filter}</p>
              <textarea value={whatsAppMessage} onChange={e => setWhatsAppMessage(e.target.value)} placeholder="الرسالة (نص فقط)" className="w-full p-2.5 border rounded-xl text-sm h-40 resize-none" />
              <p className="text-xs text-gray-400">ملاحظة: يستخدم { '{name}' } لاسم العضو (مثلاً: مرحباً { '{name}' })</p>
              {whatsAppResult && <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl text-sm">{whatsAppResult}</div>}
              <button onClick={sendWhatsApp} disabled={whatsAppSending} className="w-full py-3 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition disabled:opacity-50">
                {whatsAppSending ? "جاري الإرسال..." : "إرسال"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto p-6 space-y-4" onClick={e => e.stopPropagation()} dir="rtl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">{t("editTitle")}</h2>
              <button onClick={() => setEditing(null)} className="p-1 hover:bg-gray-100 rounded-lg"><X className="w-5 h-5" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">رقم العضوية</label>
                <input type="number" value={editForm.memberNumber} onChange={e => setEditForm(f => ({ ...f, memberNumber: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("nameAr")}</label>
                <input type="text" value={editForm.nameAr} onChange={e => setEditForm(f => ({ ...f, nameAr: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("nameNl")}</label>
                <input type="text" value={editForm.nameNl} onChange={e => setEditForm(f => ({ ...f, nameNl: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("whatsapp")}</label>
                <input type="text" value={editForm.whatsapp} onChange={e => setEditForm(f => ({ ...f, whatsapp: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("email")}</label>
                <input type="text" value={editForm.email} onChange={e => setEditForm(f => ({ ...f, email: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" dir="ltr" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("originCity")}</label>
                <select value={editForm.originCity} onChange={e => setEditForm(f => ({ ...f, originCity: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl">
                  {SYRIAN_GOVERNORATES.map(g => <option key={g}>{g}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("nlProvincie")}</label>
                <select value={editForm.nlProvincie} onChange={e => setEditForm(f => ({ ...f, nlProvincie: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl">
                  {NL_PROVINCES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("nlCity")}</label>
                <input type="text" value={editForm.nlCity} onChange={e => setEditForm(f => ({ ...f, nlCity: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("expNl")}</label>
                <textarea value={editForm.expNl} onChange={e => setEditForm(f => ({ ...f, expNl: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl h-16 resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("expOutside")}</label>
                <textarea value={editForm.expOutside} onChange={e => setEditForm(f => ({ ...f, expOutside: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl h-16 resize-none" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("educationLevel")}</label>
                <select value={editForm.educationLevel} onChange={e => setEditForm(f => ({ ...f, educationLevel: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl">
                  <option value=""></option>
                  <option>أمي</option><option>ابتدائي</option><option>إعدادي</option>
                  <option>ثانوي</option><option>معهد متوسط</option><option>جامعي</option><option>دراسات عليا</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("profession")}</label>
                <input type="text" value={editForm.profession} onChange={e => setEditForm(f => ({ ...f, profession: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("skills")}</label>
                <input type="text" value={editForm.skills} onChange={e => setEditForm(f => ({ ...f, skills: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-gray-600">{t("maritalStatus")}</label>
                <select value={editForm.maritalStatus} onChange={e => setEditForm(f => ({ ...f, maritalStatus: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl">
                  <option value=""></option>
                  <option>أعزب</option><option>متزوج</option><option>مطلق</option><option>أرمل</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600">{t("notesLabel")}</label>
              <textarea value={editForm.notes} onChange={e => setEditForm(f => ({ ...f, notes: e.target.value }))} className="w-full p-2.5 text-sm border rounded-xl h-20 resize-none" />
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setEditing(null)} className="flex-1 py-3 border rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition">{t("cancel")}</button>
              <button onClick={saveEdit} disabled={saving} className="flex-[2] py-3 bg-emerald-800 text-white rounded-xl text-sm font-bold hover:bg-emerald-900 transition disabled:opacity-50 flex items-center justify-center gap-2">
                {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> {t("saving")}</> : t("save")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
