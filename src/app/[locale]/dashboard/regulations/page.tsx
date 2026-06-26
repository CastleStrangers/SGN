"use client";

import React, { useEffect, useState } from "react";
import { Save, Loader2, FileText, Plus, Trash2, GripVertical } from "lucide-react";

interface Section {
  title: string;
  body: string;
}

interface Regulation {
  id: string;
  title: string;
  description: string;
  content: string;
  pdfPath: string | null;
  pdfSize: number | null;
  version: number;
  published: boolean;
}

export default function RegulationsDashboard() {
  const [data, setData] = useState<Regulation | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetch("/api/regulations")
      .then((r) => r.json())
      .then((d) => {
        if (d.id) {
          setData(d);
          setSections(JSON.parse(d.content || "[]"));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const addSection = () => {
    setSections([...sections, { title: "", body: "" }]);
  };

  const removeSection = (i: number) => {
    setSections(sections.filter((_, idx) => idx !== i));
  };

  const updateSection = (i: number, field: "title" | "body", value: string) => {
    const copy = [...sections];
    copy[i] = { ...copy[i], [field]: value };
    setSections(copy);
  };

  const save = async () => {
    if (!data?.id) return;
    setSaving(true);
    setMsg("");
    try {
      const res = await fetch("/api/regulations", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: data.id, content: JSON.stringify(sections), version: data.version + 1 }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      const updated = await res.json();
      setData(updated);
      setMsg("✅ تم الحفظ");
    } catch (e: any) {
      setMsg("❌ " + e.message);
    }
    setSaving(false);
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">إدارة النظام الداخلي</h1>

      <div className="bg-[#f0f7f2] border border-emerald-200 rounded-2xl p-6 mb-6">
        <label className="block font-bold mb-2">الوصف</label>
        <textarea
          className="w-full p-3 border rounded-xl"
          rows={3}
          value={data?.description || ""}
          onChange={(e) => setData(data ? { ...data, description: e.target.value } : null)}
        />
      </div>

      <div className="space-y-4 mb-6">
        {sections.map((sec, i) => (
          <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div className="flex items-center gap-2 mb-2">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <input
                className="flex-1 font-bold p-2 border rounded-lg"
                value={sec.title}
                onChange={(e) => updateSection(i, "title", e.target.value)}
                placeholder="عنوان القسم"
              />
              <button onClick={() => removeSection(i)} className="text-red-500 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <textarea
              className="w-full p-2 border rounded-lg text-sm"
              rows={3}
              value={sec.body}
              onChange={(e) => updateSection(i, "body", e.target.value)}
              placeholder="نص القسم"
            />
          </div>
        ))}
      </div>

      <button onClick={addSection} className="flex items-center gap-2 text-[#1a5632] font-bold mb-6">
        <Plus className="w-4 h-4" /> إضافة قسم
      </button>

      <div className="flex items-center gap-4">
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-[#1a5632] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#0f3d23] disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          حفظ التعديلات
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>

      <div className="mt-8 p-4 bg-gray-50 rounded-xl">
        <h3 className="font-bold mb-2">ملف PDF</h3>
        <p className="text-sm text-gray-600">
          المسار: <code className="bg-gray-200 px-2 py-0.5 rounded">{data?.pdfPath}</code>
        </p>
        <p className="text-sm text-gray-600">الحجم: {data?.pdfSize ? Math.round(data.pdfSize / 1024) + " كيلوبايت" : "-"}</p>
        <p className="text-sm text-gray-600">النسخة: v{data?.version}</p>
      </div>
    </div>
  );
}
