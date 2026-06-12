"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Plus, Pencil, Trash2, Upload, X, Check, Loader2, UserCircle2,
  ChevronUp, ChevronDown, Building2
} from "lucide-react";

interface BoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  image: string;
  committees: string[];
  bioPoints: string[];
  kvkNumber: string;
  isFounder: boolean;
  isLicensing: boolean;
}

const EMPTY_MEMBER: Omit<BoardMember, "id"> = {
  nameAr: "",
  nameEn: "",
  titleAr: "",
  titleEn: "",
  image: "",
  committees: [],
  bioPoints: [],
  kvkNumber: "96718943",
  isFounder: true,
  isLicensing: false,
};

// ─── مكوّن بطاقة العضو ─────────────────────────────────────────────────────
function MemberAvatar({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  if (!src || error) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1a5632] to-[#0f3d23] flex items-center justify-center">
        <span className="text-white text-2xl font-bold">{name.charAt(0)}</span>
      </div>
    );
  }
  return (
    <img src={src} alt={name} className="w-full h-full object-cover" onError={() => setError(true)} />
  );
}

// ─── مكوّن رفع الصورة ───────────────────────────────────────────────────────
function ImageUploader({
  currentUrl,
  onUploaded,
}: {
  currentUrl: string;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentUrl);
  const [error, setError] = useState("");

  async function handleFile(file: File) {
    if (!file) return;
    setError("");
    setUploading(true);
    setPreview(URL.createObjectURL(file));

    const fd = new FormData();
    fd.append("file", file);

    try {
      const res = await fetch("/api/board/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "فشل الرفع");
      setPreview(data.url);
      onUploaded(data.url);
    } catch (e: any) {
      setError(e.message);
      setPreview(currentUrl);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      {/* معاينة الصورة */}
      <div
        className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-dashed border-gray-200 hover:border-[#1a5632] cursor-pointer transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <MemberAvatar src={preview} name="?" />
        <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity rounded-full">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-white animate-spin" />
          ) : (
            <Upload className="w-6 h-6 text-white" />
          )}
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="text-xs text-[#1a5632] hover:underline flex items-center gap-1"
      >
        <Upload className="w-3 h-3" />
        {uploading ? "جاري الرفع..." : "رفع صورة"}
      </button>

      {error && <p className="text-red-500 text-xs text-center">{error}</p>}
      <p className="text-gray-400 text-xs">JPG, PNG, WebP — حتى 5MB</p>
    </div>
  );
}

// ─── مكوّن حقل القائمة (اللجان / نقاط السيرة) ─────────────────────────────
function ListEditor({
  label,
  items,
  onChange,
  placeholder,
}: {
  label: string;
  items: string[];
  onChange: (items: string[]) => void;
  placeholder: string;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const v = draft.trim();
    if (!v) return;
    onChange([...items, v]);
    setDraft("");
  }

  function remove(i: number) {
    onChange(items.filter((_, idx) => idx !== i));
  }

  function moveUp(i: number) {
    if (i === 0) return;
    const arr = [...items];
    [arr[i - 1], arr[i]] = [arr[i], arr[i - 1]];
    onChange(arr);
  }

  function moveDown(i: number) {
    if (i === items.length - 1) return;
    const arr = [...items];
    [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
    onChange(arr);
  }

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">{label}</label>

      {/* حقل الإضافة */}
      <div className="flex gap-2 mb-3">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder={placeholder}
          className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]"
          dir="rtl"
        />
        <button
          type="button"
          onClick={add}
          className="px-3 py-1.5 bg-[#1a5632] text-white text-sm rounded-lg hover:bg-[#0f3d23] transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* القائمة */}
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex items-start gap-2 bg-gray-50 rounded-lg px-3 py-2 text-sm group">
            <span className="flex-1 text-gray-700" dir="rtl">{item}</span>
            <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <button type="button" onClick={() => moveUp(i)} title="أعلى" className="p-0.5 hover:text-[#1a5632]">
                <ChevronUp className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => moveDown(i)} title="أسفل" className="p-0.5 hover:text-[#1a5632]">
                <ChevronDown className="w-3.5 h-3.5" />
              </button>
              <button type="button" onClick={() => remove(i)} title="حذف" className="p-0.5 hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </li>
        ))}
        {items.length === 0 && (
          <li className="text-gray-400 text-xs text-center py-2">لم تُضف أي عناصر بعد</li>
        )}
      </ul>
    </div>
  );
}

// ─── نموذج تحرير / إضافة عضو ───────────────────────────────────────────────
function MemberForm({
  initial,
  onSave,
  onCancel,
}: {
  initial: Omit<BoardMember, "id"> & { id?: string };
  onSave: (data: typeof initial) => Promise<void>;
  onCancel: () => void;
}) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function set<K extends keyof typeof form>(key: K, val: (typeof form)[K]) {
    setForm((f) => ({ ...f, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.nameAr.trim() || !form.titleAr.trim()) {
      setError("الاسم والمنصب (عربي) حقلان إلزاميان");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave(form);
    } catch (e: any) {
      setError(e.message || "حدث خطأ");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
      {/* صورة العضو */}
      <div className="flex justify-center">
        <ImageUploader
          currentUrl={form.image}
          onUploaded={(url) => set("image", url)}
        />
      </div>

      {/* الأسماء */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">الاسم (عربي) *</label>
          <input value={form.nameAr} onChange={(e) => set("nameAr", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Name (English)</label>
          <input value={form.nameEn} onChange={(e) => set("nameEn", e.target.value)} dir="ltr"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
        </div>
      </div>

      {/* المناصب */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">المنصب (عربي) *</label>
          <input value={form.titleAr} onChange={(e) => set("titleAr", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" required />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">Title (English)</label>
          <input value={form.titleEn} onChange={(e) => set("titleEn", e.target.value)} dir="ltr"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
        </div>
      </div>

      {/* رقم KVK */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">رقم KVK</label>
        <input value={form.kvkNumber} onChange={(e) => set("kvkNumber", e.target.value)} dir="ltr"
          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1a5632]" />
      </div>

      {/* خانات الاختيار */}
      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.isFounder} onChange={(e) => set("isFounder", e.target.checked)}
            className="w-4 h-4 accent-[#1a5632]" />
          <span className="text-sm font-medium text-gray-700">عضو مؤسس</span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" checked={form.isLicensing} onChange={(e) => set("isLicensing", e.target.checked)}
            className="w-4 h-4 accent-[#1a5632]" />
          <span className="text-sm font-medium text-gray-700">عضو لجنة الترخيص</span>
        </label>
      </div>

      {/* اللجان */}
      <ListEditor
        label="اللجان والمكاتب"
        items={form.committees}
        onChange={(v) => set("committees", v)}
        placeholder="اكتب اسم اللجنة واضغط Enter..."
      />

      {/* نقاط السيرة */}
      <ListEditor
        label="نقاط السيرة المهنية"
        items={form.bioPoints}
        onChange={(v) => set("bioPoints", v)}
        placeholder="اكتب نقطة سيرة واضغط Enter..."
      />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* أزرار الحفظ */}
      <div className="flex justify-end gap-3 pt-2 border-t">
        <button type="button" onClick={onCancel}
          className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
          إلغاء
        </button>
        <button type="submit" disabled={saving}
          className="px-5 py-2.5 text-sm font-medium text-white bg-[#1a5632] hover:bg-[#0f3d23] rounded-xl transition-colors flex items-center gap-2 disabled:opacity-60">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
          {saving ? "جاري الحفظ..." : "حفظ"}
        </button>
      </div>
    </form>
  );
}

// ─── الصفحة الرئيسية ────────────────────────────────────────────────────────
export default function DashboardBoardPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | "new" | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  // جلب الأعضاء
  async function load() {
    setLoading(true);
    const res = await fetch("/api/board");
    const data = await res.json();
    if (Array.isArray(data)) setMembers(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function showToast(msg: string, type: "success" | "error" = "success") {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }

  // حفظ (إضافة أو تعديل)
  async function handleSave(data: Omit<BoardMember, "id"> & { id?: string }) {
    const isNew = !data.id;
    const url = isNew ? "/api/board" : `/api/board/${data.id}`;
    const method = isNew ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || "فشل الحفظ");
    }

    showToast(isNew ? "تمت إضافة العضو بنجاح ✅" : "تم تحديث بيانات العضو ✅");
    setEditingId(null);
    await load();
  }

  // حذف
  async function handleDelete(id: string) {
    setDeleting(true);
    const res = await fetch(`/api/board/${id}`, { method: "DELETE" });
    if (res.ok) {
      showToast("تم حذف العضو بنجاح");
      setMembers((m) => m.filter((x) => x.id !== id));
    } else {
      showToast("فشل الحذف", "error");
    }
    setDeleteId(null);
    setDeleting(false);
  }

  const editingMember = editingId === "new"
    ? { ...EMPTY_MEMBER }
    : members.find((m) => m.id === editingId);

  return (
    <div className="p-6 max-w-6xl mx-auto" dir="rtl">
      {/* ─── Toast ─────────────────────── */}
      {toast && (
        <div className={`fixed top-6 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg text-white text-sm font-medium transition-all ${toast.type === "success" ? "bg-[#1a5632]" : "bg-red-600"}`}>
          {toast.msg}
        </div>
      )}

      {/* ─── رأس الصفحة ─────────────────── */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a5632]/10 rounded-xl flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[#1a5632]" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">إدارة مجلس الإدارة</h1>
            <p className="text-sm text-gray-500">{members.length} عضو في قاعدة البيانات</p>
          </div>
        </div>
        {editingId === null && (
          <button
            onClick={() => setEditingId("new")}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#1a5632] text-white text-sm font-medium rounded-xl hover:bg-[#0f3d23] transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            إضافة عضو
          </button>
        )}
      </div>

      {/* ─── نموذج الإضافة / التعديل ──── */}
      {editingId !== null && editingMember && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-900 text-lg">
              {editingId === "new" ? "إضافة عضو جديد" : "تعديل بيانات العضو"}
            </h2>
            <button onClick={() => setEditingId(null)} className="p-1.5 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
          <MemberForm
            initial={editingId === "new" ? EMPTY_MEMBER : (editingMember as BoardMember)}
            onSave={handleSave}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}

      {/* ─── قائمة الأعضاء ──────────────── */}
      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="w-8 h-8 animate-spin text-[#1a5632]" />
        </div>
      ) : members.length === 0 ? (
        <div className="text-center py-24 text-gray-400">
          <UserCircle2 className="w-14 h-14 mx-auto mb-3 opacity-30" />
          <p>لا توجد أعضاء بعد. ابدأ بإضافة العضو الأول.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {members.map((m) => (
            <div key={m.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {/* صورة + بيانات */}
              <div className="p-5 flex items-center gap-4">
                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-2 border-gray-100">
                  <MemberAvatar src={m.image} name={m.nameAr} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 truncate">{m.nameAr}</p>
                  <p className="text-xs text-gray-400 truncate mb-1">{m.nameEn}</p>
                  <span className="inline-block bg-emerald-50 text-[#1a5632] text-xs px-2 py-0.5 rounded-full border border-emerald-200 leading-tight">
                    {m.titleAr}
                  </span>
                </div>
              </div>

              {/* شارات */}
              <div className="px-5 pb-3 flex flex-wrap gap-1.5">
                {m.isFounder && (
                  <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">مؤسس</span>
                )}
                {m.isLicensing && (
                  <span className="text-xs bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded-full">لجنة الترخيص</span>
                )}
                <span className="text-xs bg-gray-50 text-gray-500 border px-2 py-0.5 rounded-full">
                  {m.committees.length} لجنة
                </span>
              </div>

              {/* أزرار الإجراءات */}
              <div className="px-5 pb-5 flex gap-2 mt-auto pt-3 border-t border-gray-50">
                <button
                  onClick={() => setEditingId(m.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#1a5632] bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors border border-emerald-200"
                >
                  <Pencil className="w-3.5 h-3.5" />
                  تعديل
                </button>
                <button
                  onClick={() => setDeleteId(m.id)}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-200"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── مودال تأكيد الحذف ───────────── */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" dir="rtl">
          <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-6 h-6 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">تأكيد الحذف</h3>
            <p className="text-gray-500 text-sm text-center mb-6">
              سيتم حذف بيانات هذا العضو نهائياً من قاعدة البيانات ولا يمكن التراجع.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                إلغاء
              </button>
              <button onClick={() => handleDelete(deleteId)} disabled={deleting}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-xl transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? "جاري الحذف..." : "حذف"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
