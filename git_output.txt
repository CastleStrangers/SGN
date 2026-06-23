"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

interface BoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  image: string;
}

const screenshots = [
  "لقطة شاشة 2026-06-12 094404.png",
  "لقطة شاشة 2026-06-12 094419.png",
  "لقطة شاشة 2026-06-12 094433.png",
  "لقطة شاشة 2026-06-12 094448.png",
  "لقطة شاشة 2026-06-12 094501.png",
  "لقطة شاشة 2026-06-12 094514.png",
  "لقطة شاشة 2026-06-12 094526.png",
  "لقطة شاشة 2026-06-12 094536.png",
  "لقطة شاشة 2026-06-12 094552.png",
  "لقطة شاشة 2026-06-12 094604.png",
  "لقطة شاشة 2026-06-12 094620.png",
  "لقطة شاشة 2026-06-12 094630.png",
  "لقطة شاشة 2026-06-12 094641.png",
  "لقطة شاشة 2026-06-12 094656.png",
  "لقطة شاشة 2026-06-12 094707.png",
  "لقطة شاشة 2026-06-12 094718.png",
  "لقطة شاشة 2026-06-12 094729.png",
  "لقطة شاشة 2026-06-12 094739.png",
  "لقطة شاشة 2026-06-12 094748.png",
  "لقطة شاشة 2026-06-12 094759.png",
  "لقطة شاشة 2026-06-12 094809.png",
  "لقطة شاشة 2026-06-12 094823.png",
  "لقطة شاشة 2026-06-12 094834.png",
  "لقطة شاشة 2026-06-12 094847.png"
];

export default function AlignBoardImagesPage() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [mapping, setMapping] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    // Fetch members and current mapping
    Promise.all([
      fetch("/api/board").then((res) => res.json()),
      fetch("/api/board/align").then((res) => res.json().catch(() => ({})))
    ])
      .then(([membersData, alignData]) => {
        if (Array.isArray(membersData)) {
          setMembers(membersData);
          
          // Initialize mapping from DB data
          const initialMapping: Record<string, string> = {};
          membersData.forEach((m) => {
            const filename = m.image.split("/").pop() || "";
            if (screenshots.includes(filename)) {
              initialMapping[m.nameEn] = filename;
            } else if (alignData && alignData.mapping && alignData.mapping[m.nameEn]) {
              initialMapping[m.nameEn] = alignData.mapping[m.nameEn];
            }
          });
          setMapping(initialMapping);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load alignment data:", err);
        setLoading(false);
      });
  }, []);

  const handleSelectImage = (memberNameEn: string, filename: string) => {
    setMapping((prev) => ({
      ...prev,
      [memberNameEn]: filename
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/board/align", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapping })
      });
      const data = await res.json();
      if (data.success) {
        setMessage({ type: "success", text: "تم حفظ مطابقة الصور بنجاح وتحديث قاعدة البيانات وملفات البذر! ✅" });
      } else {
        setMessage({ type: "error", text: "فشل الحفظ: " + (data.error || "خطأ غير معروف") });
      }
    } catch (e: any) {
      setMessage({ type: "error", text: "فشل الاتصال بالخادم: " + e.message });
    } finally {
      setSaving(false);
    }
  };

  const autoMap = () => {
    // Try to auto-map based on chronological order matching array index
    const newMapping: Record<string, string> = {};
    members.forEach((m, idx) => {
      if (idx < screenshots.length) {
        newMapping[m.nameEn] = screenshots[idx];
      }
    });
    setMapping(newMapping);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#c8a84e] mx-auto mb-4"></div>
          <p className="text-gray-400">جاري تحميل بيانات الأعضاء والصور...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-[#c8a84e] mb-4">أداة مطابقة صور أعضاء مجلس الإدارة</h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            قم بمطابقة كل عضو من أعضاء مجلس الإدارة الـ 23 بالصورة الصحيحة من لقطات الشاشة الـ 24 المتاحة.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <button
              onClick={autoMap}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors cursor-pointer border border-gray-700"
            >
              مطابقة تلقائية (ترتيب زمني) ⏱️
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-colors cursor-pointer disabled:opacity-50"
            >
              {saving ? "جاري الحفظ..." : "حفظ المطابقة وتحديث النظام 💾"}
            </button>
          </div>

          {message && (
            <div
              className={`mt-6 p-4 rounded-xl max-w-xl mx-auto text-sm ${
                message.type === "success" ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800" : "bg-red-950/80 text-red-300 border border-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {members.map((member, idx) => {
            const currentImg = mapping[member.nameEn];
            return (
              <div
                key={member.id}
                className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col items-center hover:border-[#c8a84e]/50 transition-all duration-300"
              >
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 mb-4 flex items-center justify-center text-[#c8a84e] font-bold text-2xl border-2 border-gray-700">
                  {currentImg ? (
                    <img
                      src={`/images/board/${currentImg}`}
                      alt={member.nameAr}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>

                <h3 className="text-lg font-bold text-[#c8a84e]">{member.nameAr}</h3>
                <p className="text-xs text-gray-500 font-mono mt-1">{member.nameEn}</p>
                <span className="text-xs bg-emerald-950 text-emerald-400 px-3 py-1 rounded-full mt-2 font-medium">
                  {member.titleAr}
                </span>

                <div className="w-full mt-6">
                  <label className="block text-xs text-gray-400 mb-2">اختر لقطة الشاشة المطابقة:</label>
                  <select
                    value={currentImg || ""}
                    onChange={(e) => handleSelectImage(member.nameEn, e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-300 focus:outline-none focus:border-[#c8a84e]"
                  >
                    <option value="">-- بدون صورة --</option>
                    {screenshots.map((filename) => (
                      <option key={filename} value={filename}>
                        {filename}
                      </option>
                    ))}
                  </select>
                </div>

                {currentImg && (
                  <div className="w-full mt-4">
                    <p className="text-xs text-gray-500 mb-1 text-center">معاينة الصورة الكاملة:</p>
                    <div className="w-full h-48 bg-gray-950 rounded-xl overflow-hidden border border-gray-800">
                      <img
                        src={`/images/board/${currentImg}`}
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
