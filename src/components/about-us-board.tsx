"use client";

import React, { useState } from "react";

export interface BoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  image: string;
  committees: string[];
  bioPoints: string[];
  kvkNumber: string;
  isFounder?: boolean;
  isLicensing?: boolean;
}

interface AboutUsBoardProps {
  members: BoardMember[];
}

/** Avatar احتياطي يعرض الحرف الأول من الاسم */
function FallbackAvatar({ name }: { name: string }) {
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#1a5632] to-[#0f3d23] flex items-center justify-center">
      <span className="text-white text-4xl font-bold select-none">
        {name.charAt(0)}
      </span>
    </div>
  );
}

/** صورة العضو مع معالجة الخطأ تلقائياً */
function MemberImage({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  const [hasError, setHasError] = useState(false);

  if (!src || hasError) {
    return <FallbackAvatar name={alt} />;
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
    />
  );
}

export default function AboutUsBoard({ members }: AboutUsBoardProps) {
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 text-lg">
        لا توجد بيانات لأعضاء مجلس الإدارة حالياً.
      </div>
    );
  }

  const founders = members.filter((m) => m.isFounder);
  const executives = members.filter((m) => !m.isFounder);

  return (
    <div
      className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl my-12 border border-gray-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* ─── رأس القسم ─── */}
        <div className="text-center mb-16">
          <h2 className="text-base text-[#c8a84e] font-semibold tracking-wide uppercase">
            الهيكل التنظيمي المعتمد 2025
          </h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a5632] sm:text-4xl">
            أعضاء مجلس الإدارة والمكاتب التنفيذية
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            نخبة من الكفاءات السورية التي تعمل على تمكين الجالية وبناء جسور التواصل.
          </p>
        </div>

        {/* ─── الأعضاء المؤسسون ─── */}
        {founders.length > 0 && (
          <div className="mb-14">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-[#c8a84e] px-4 py-1 bg-amber-50 rounded-full border border-amber-200">
                الأعضاء المؤسسون
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {founders.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── الأعضاء التنفيذيون ─── */}
        {executives.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px flex-1 bg-gray-200" />
              <span className="text-sm font-semibold text-[#1a5632] px-4 py-1 bg-emerald-50 rounded-full border border-emerald-200">
                الأعضاء التنفيذيون
              </span>
              <span className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {executives.map((member) => (
                <MemberCard
                  key={member.id}
                  member={member}
                  onSelect={setSelectedMember}
                />
              ))}
            </div>
          </div>
        )}

        {/* ─── النافذة المنبثقة ─── */}
        {selectedMember && (
          <div
            className="fixed z-50 inset-0 overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-label={`سيرة ${selectedMember.nameAr}`}
          >
            <div className="flex items-center justify-center min-h-screen px-4 py-8">
              {/* الخلفية المظللة */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setSelectedMember(null)}
              />

              {/* صندوق المحتوى */}
              <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden z-10 animate-fade-in">
                {/* رأس المودال */}
                <div className="bg-[#1a5632] p-8 text-white relative">
                  <button
                    onClick={() => setSelectedMember(null)}
                    aria-label="إغلاق"
                    className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/20 rounded-full text-xl font-bold transition-colors cursor-pointer"
                  >
                    ×
                  </button>

                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/40 shadow-lg flex-shrink-0">
                      <MemberImage
                        src={selectedMember.image}
                        alt={selectedMember.nameAr}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="text-center sm:text-right">
                      <h3 className="text-2xl font-bold">{selectedMember.nameAr}</h3>
                      <p className="text-sm text-gray-300 font-light mb-3">
                        {selectedMember.nameEn}
                      </p>
                      <span className="inline-block bg-[#c8a84e] text-emerald-950 text-xs font-bold px-3 py-1.5 rounded-lg">
                        {selectedMember.titleAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* محتوى المودال */}
                <div className="p-8 max-h-[55vh] overflow-y-auto space-y-6">
                  {/* اللجان */}
                  {selectedMember.committees && selectedMember.committees.length > 0 && (
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                        اللجان والمكاتب الحالية
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMember.committees.map((c, i) => (
                          <span
                            key={i}
                            className="bg-emerald-50 text-[#1a5632] border border-emerald-200 text-xs font-medium px-3 py-1 rounded-full"
                          >
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* السيرة المهنية */}
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-3 border-b pb-2 flex items-center gap-2">
                      <span className="w-1 h-4 bg-[#c8a84e] rounded-sm inline-block" />
                      السيرة المهنية والمبادرات
                    </h4>
                    <ul className="space-y-3">
                      {selectedMember.bioPoints.map((point, index) => (
                        <li
                          key={index}
                          className="text-gray-600 text-sm leading-relaxed flex items-start gap-2"
                        >
                          <span className="text-[#c8a84e] mt-1 flex-shrink-0">•</span>
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* تذييل المودال */}
                <div className="bg-gray-50 px-8 py-4 flex justify-between items-center text-xs text-gray-400 border-t">
                  <span>رقم KVK: {selectedMember.kvkNumber}</span>
                  <button
                    onClick={() => setSelectedMember(null)}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-xl font-medium transition-colors cursor-pointer"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/** بطاقة العضو المنفردة */
function MemberCard({
  member,
  onSelect,
}: {
  member: BoardMember;
  onSelect: (m: BoardMember) => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-6 text-center group">
      {/* صورة العضو أو الـ avatar الاحتياطي */}
      <div className="relative w-32 h-32 rounded-full overflow-hidden ring-4 ring-gray-100 group-hover:ring-[#c8a84e] transition-all duration-300 mb-6">
        <div className="w-full h-full group-hover:scale-110 transition-transform duration-300">
          <MemberImage
            src={member.image}
            alt={member.nameAr}
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* الاسم والمنصب */}
      <h3 className="text-lg font-bold text-gray-900 mb-1">{member.nameAr}</h3>
      <p className="text-xs text-gray-400 mb-4 font-mono uppercase tracking-wider">
        {member.nameEn}
      </p>

      <div className="text-sm font-medium text-[#1a5632] bg-emerald-50 px-3 py-2 rounded-full mb-6 min-h-[40px] flex items-center justify-center leading-tight">
        {member.titleAr}
      </div>

      {/* زر فتح السيرة */}
      <button
        onClick={() => onSelect(member)}
        className="mt-auto w-full inline-flex justify-center items-center px-4 py-2.5 text-sm font-medium rounded-xl text-white bg-[#1a5632] hover:bg-[#0f3d23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a5632] transition-colors duration-200 shadow-sm cursor-pointer"
      >
        عرض اللمحة التعريفية
      </button>
    </div>
  );
}
