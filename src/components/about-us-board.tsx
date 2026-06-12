"use client";

import React, { useState } from 'react';

export interface BoardMember {
  id: string;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  image: string;
  bioPoints: string[];
  kvkNumber: string;
}

interface AboutUsBoardProps {
  members: BoardMember[];
}

export default function AboutUsBoard({ members }: AboutUsBoardProps) {
  // حالة التحكم في فتح النافذة المنبثقة وتحديد العضو المختار
  const [selectedMember, setSelectedMember] = useState<BoardMember | null>(null);

  return (
    <div className="bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 rounded-3xl my-12 border border-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto">
        
        {/* عنوان القسم في صفحة من نحن */}
        <div className="text-center mb-16">
          <h2 className="text-base text-[#c8a84e] font-semibold tracking-wide uppercase">الهيكل القيادي</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-[#1a5632] sm:text-4xl">
            مجلس إدارة الجالية السورية في هولندا
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-500 mx-auto">
            نخبة من الكفاءات السورية التي تعمل على تمكين الجالية وبناء جسور التواصل.
          </p>
        </div>

        {/* شبكة العرض العصرية (Grid) */}
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {members.map((member) => (
            <div 
              key={member.id} 
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col items-center p-6 text-center group"
            >
              {/* إطار الصورة الشخصية مع تأثير حركة عند تمرير الفأرة */}
              <div className="relative w-36 h-36 rounded-full overflow-hidden ring-4 ring-gray-50 group-hover:ring-[#c8a84e] transition-all duration-300 mb-6">
                <img 
                  src={member.image} 
                  alt={member.nameAr} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-all duration-300"
                />
              </div>

              {/* البيانات الأساسية */}
              <h3 className="text-lg font-bold text-gray-900 mb-1">{member.nameAr}</h3>
              <p className="text-xs text-gray-400 mb-3 font-mono uppercase tracking-wider">{member.nameEn}</p>
              
              {/* منصب العضو المحدث من لوحة التحكم */}
              <div className="text-sm font-medium text-[#1a5632] bg-emerald-50 px-3 py-1 rounded-full mb-6 min-h-[40px] flex items-center justify-center">
                {member.titleAr}
              </div>

              {/* الزر العصري التفاعلي لفتح السيرة الذاتية */}
              <button
                onClick={() => setSelectedMember(member)}
                className="mt-auto w-full inline-flex justify-center items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-xl text-white bg-[#1a5632] hover:bg-[#0f3d23] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1a5632] transition-colors duration-200 shadow-sm cursor-pointer"
              >
                عرض السيرة الذاتية
              </button>
            </div>
          ))}
        </div>

        {/* النافذة المنبثقة التفاعلية (Modal Component) */}
        {selectedMember && (
          <div className="fixed z-50 inset-0 overflow-y-auto animate-fade-in" role="dialog" aria-modal="true">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
              
              {/* تظليل الخلفية */}
              <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setSelectedMember(null)}></div>

              {/* خدعة لتوسيط النافذة في الشاشة */}
              <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

              {/* صندوق المحتوى للنافذة المنبثقة */}
              <div className="inline-block align-bottom bg-white rounded-3xl text-right overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                
                {/* رأس النافذة الأنيق */}
                <div className="bg-[#1a5632] p-8 text-white relative">
                  <button 
                    onClick={() => setSelectedMember(null)}
                    className="absolute top-4 left-4 text-gray-300 hover:text-white text-2xl font-bold focus:outline-none cursor-pointer"
                  >
                    &times;
                  </button>
                  <div className="flex flex-col sm:flex-row items-center gap-6">
                    <img 
                      src={selectedMember.image} 
                      alt={selectedMember.nameAr} 
                      className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md"
                    />
                    <div className="text-center sm:text-right">
                      <h3 className="text-2xl font-bold">{selectedMember.nameAr}</h3>
                      <p className="text-sm text-gray-300 font-light mb-2">{selectedMember.nameEn}</p>
                      <span className="inline-block bg-[#c8a84e] text-xs font-semibold px-3 py-1 rounded-md text-emerald-950">
                        {selectedMember.titleAr}
                      </span>
                    </div>
                  </div>
                </div>

                {/* محتوى السيرة الذاتية المسترجع من السيرفر */}
                <div className="bg-white p-8 max-h-[60vh] overflow-y-auto">
                  <h4 className="text-md font-bold text-gray-900 mb-4 border-b pb-2 border-gray-100 flex items-center gap-2">
                    <span className="w-2 h-4 bg-[#c8a84e] inline-block rounded-sm"></span>
                    اللمحة التعريفية والمسيرة المهنية:
                  </h4>
                  <ul className="space-y-4">
                    {selectedMember.bioPoints.map((point, index) => (
                      <li key={index} className="text-gray-600 text-sm leading-relaxed flex items-start gap-2">
                        <span className="text-[#c8a84e] mt-1">•</span>
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* تذييل النافذة المنبثقة */}
                <div className="bg-gray-50 px-8 py-4 flex justify-between items-center text-xs text-gray-400 border-t border-gray-100">
                  <div className="flex gap-4">
                    <span>رقم الترخيص التجاري: KVK {selectedMember.kvkNumber}</span>
                  </div>
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
