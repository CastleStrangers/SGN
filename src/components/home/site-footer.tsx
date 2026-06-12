"use client";

import React from 'react';
import Image from "next/image";
import { Link } from "@/i18n/routing";

export function SiteFooter() {
  return (
    <footer className="bg-[#1B365D] text-white pt-12 pb-6 border-t-4 border-[#CCAA00]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* القسم الأول: نبذة وعنوان المؤسسة */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Image 
              src="/logo.png" 
              alt="SGN Logo" 
              width={48} 
              height={48} 
              className="w-12 h-12 object-contain" 
              priority
            />
            <div>
              <h3 className="font-bold text-lg">الجالية السورية في هولندا</h3>
              <p className="text-xs text-gray-300 font-light">De Syrische Gemeenschap in Nederland (SGN)</p>
            </div>
          </div>
          <p className="text-sm text-gray-400 leading-relaxed">
            مؤسسة غير حكومية وغير ربحية تُعنى بشؤون المغتربين السوريين، وتعمل وفق أحكام القانون المدني الهولندي كجمعية مسجلة أصولاً.
          </p>
        </div>

        {/* القسم الثاني: روابط سريعة للموقع */}
        <div>
          <h4 className="text-[#CCAA00] font-bold mb-4 border-b pb-2 border-gray-700 text-sm">روابط التنقل</h4>
          <ul className="space-y-2 text-sm text-gray-400">
            <li><Link href="/about" className="hover:text-[#CCAA00] transition-colors">من نحن وأعضاء المجلس</Link></li>
            <li><Link href="/news" className="hover:text-[#CCAA00] transition-colors">أخبار الأنشطة والفعاليات</Link></li>
            <li><Link href="/legal" className="hover:text-[#CCAA00] transition-colors">المكتب القانوني والاستشارات</Link></li>
            <li><Link href="/donate" className="hover:text-[#CCAA00] transition-colors">دعم مشاريع الإغاثة والتعليم</Link></li>
          </ul>
        </div>

        {/* القسم الثالث والأهم: البيانات القانونية والرسمية بطريقة بروفيشينال */}
        <div className="bg-[#142948] p-5 rounded-xl border border-gray-800 space-y-3">
          <h4 className="text-[#CCAA00] font-bold text-sm mb-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-[#CCAA00] rounded-full"></span>
            البيانات القانونية والرسمية (ANBI)
          </h4>
          
          <div className="text-xs space-y-2 text-gray-300">
            <p className="flex justify-between items-center bg-[#1B365D] p-2 rounded">
              <span className="text-gray-400">نوع المؤسسة:</span>
              <span className="font-medium">جمعية مسجلة (Vereniging)</span>
            </p>
            <p className="flex justify-between items-center bg-[#1B365D] p-2 rounded font-mono">
              <span className="text-gray-400 text-right font-sans">رقم السجل (KvK):</span>
              <span className="text-[#CCAA00] font-bold">96718943</span>
            </p>
            <p className="flex justify-between items-center bg-[#1B365D] p-2 rounded font-mono">
              <span className="text-gray-400 text-right font-sans">الرقم الضريبي (RSIN):</span>
              <span>867730286</span>
            </p>
            <div className="bg-[#1B365D] p-2 rounded space-y-1">
              <div className="text-gray-400 font-sans">الحساب البنكي الرسمي (IBAN):</div>
              <div className="font-mono text-[#CCAA00] tracking-wider text-left text-sm pt-1">NL90 ABNA 0148 7498 95</div>
            </div>
          </div>
        </div>

      </div>

      {/* حقوق الملكية والسياق الموحد */}
      <div className="max-w-7xl mx-auto px-4 mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500 flex flex-col sm:flex-row justify-between gap-4">
        <p>© {new Date().getFullYear()} الجالية السورية في هولندا. جميع الحقوق محفوظة.</p>
        <p className="font-light">عملاً بمبدأ الشفافية الكاملة والالتزام بالقوانين والأنظمة المعمول بها في مملكة هولندا.</p>
      </div>
    </footer>
  );
}

