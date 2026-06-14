"use client";
import { useState } from "react";
import { Link } from "@/i18n/routing";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";
import { SgnLogo } from "@/components/sgn-logo";
import { Facebook, Instagram, Youtube, Twitter } from "lucide-react";
import { TikTok } from "@/components/tiktok-icon";

const socials = [
  { icon: TikTok, name: "TikTok", href: "https://www.tiktok.com/@sgn_syria" },
  { icon: Twitter, name: "Twitter", href: "https://x.com/SGN2098551" },
  { icon: Youtube, name: "YouTube", href: "https://www.youtube.com/@SY-NL" },
  { icon: Instagram, name: "Instagram", href: "https://www.instagram.com/sgn_syria/" },
  { icon: Facebook, name: "Facebook", href: "https://www.facebook.com/DeSyrischeGemeenschapInNederland" },
];

export function SiteFooter() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText("NL90 ABNA 0148 7498 95");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-8 border-t-2 border-[#CCAA00]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center mb-4">
                <SgnLogo size={64} className="mb-3" />
                <div className="flex items-center gap-2 justify-center">
                  <FreeSyrianFlag className="w-5 h-3 rounded shadow-sm border border-white/10 flex-shrink-0 object-cover" />
                  <h3 className="font-bold text-sm text-white tracking-wide">الجالية السورية في هولندا</h3>
                  <DutchFlag className="w-5 h-3 rounded shadow-sm border border-white/10 flex-shrink-0 object-cover" />
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed text-center">
                واجهة اجتماعية اعتبارية ومؤسسة غير ربحية تعنى بشؤون المغتربين وتخدم مصالحهم عبر قنوات التواصل الرسمية مع بلد الإقامة.
              </p>
              
              <div className="flex items-center justify-center gap-3 mt-4" dir="ltr">
                {socials.map((s, idx) => (
                  <a
                    key={idx}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={s.name}
                    aria-label={s.name}
                    className="w-8 h-8 rounded-full bg-[#0B132B]/60 hover:bg-[#CCAA00] text-gray-300 hover:text-black flex items-center justify-center transition-all duration-300 border border-gray-800 hover:border-[#CCAA00] hover:scale-110 shadow-sm"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800 mt-4 w-full flex justify-center text-xs text-gray-400">
              <span className="flex items-center gap-1 font-mono hover:text-[#CCAA00] transition-colors">
                <a href="https://www.sy-nl.org" target="_blank" rel="noopener noreferrer">www.sy-nl.org</a>
              </span>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mb-4 w-full">
                <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
                التسجيل والشفافية القانونية
              </h4>
              <div className="space-y-2.5 text-xs w-full">
                <div className="flex flex-col items-center bg-[#0B132B] p-3 rounded-xl border border-gray-900/60">
                  <span className="text-gray-400 mb-1 text-[11px]">رقم السجل التجاري KvK</span>
                  <span className="font-mono text-[#CCAA00] font-bold text-sm">96718943</span>
                </div>
                <div className="flex flex-col items-center bg-[#0B132B] p-3 rounded-xl border border-gray-900/60">
                  <span className="text-gray-400 mb-1 text-[11px]">الرقم الضريبي RSIN</span>
                  <span className="font-mono text-gray-300 text-sm">867730286</span>
                </div>
                <div className="flex flex-col items-center bg-[#0B132B] p-3 rounded-xl border border-gray-900/60">
                  <span className="text-gray-400 mb-1 text-[11px]">الصفة القانونية</span>
                  <span className="text-emerald-400 font-bold">جمعية مسجلة أصولاً</span>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800 mt-4 w-full flex justify-center text-xs text-gray-400">
              <span className="text-gray-500 text-[10px]">مؤسسة خاضعة للرقابة والشفافية</span>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mb-4 w-full">
                <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
                الحساب البنكي المعتمد (ANBI)
              </h4>
              <p className="text-[11px] text-gray-400 leading-relaxed text-center mb-4">
                تُوجه جميع الاشتراكات والمساهمات لدعم الأنشطة التعليمية، الطبية، والإنسانية للجالية.
              </p>
              <div className="bg-[#0B132B] p-3 rounded-xl border border-gray-900/60 w-full space-y-1">
                <span className="text-[10px] text-gray-500 block uppercase font-mono text-center">Official Bank Account (IBAN)</span>
                <span className="text-[#CCAA00] font-mono font-bold text-sm block tracking-wider text-center py-1">
                  NL90 ABNA 0148 7498 95
                </span>
                <div className="flex gap-2 mt-2 w-full">
                  <Link
                    href="/donate"
                    className="flex-1 bg-[#CCAA00] hover:bg-yellow-500 text-black font-bold py-1.5 px-2 rounded-lg text-center text-[10px] transition-all duration-300 flex items-center justify-center gap-1 hover:scale-[1.03]"
                  >
                    <span>❤️</span> تبرع الآن
                  </Link>
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-[#1C2541] hover:bg-gray-800 text-gray-200 border border-gray-700 py-1.5 px-2 rounded-lg text-center text-[10px] transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer hover:scale-[1.03]"
                  >
                    {copied ? (
                      <>
                        <span>✓</span> تم النسخ
                      </>
                    ) : (
                      <>
                        <span>📋</span> نسخ الحساب
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
            <div className="pt-4 border-t border-gray-800 mt-4 w-full flex justify-center text-xs text-gray-400">
              <span className="text-gray-500 text-[10px]">مؤسسة ذات منفعة عامة معفاة من الضرائب</span>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 mb-4 w-full">
                <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
                روابط سريعة ومعلومات الاتصال
              </h4>
              <ul className="space-y-2.5 text-xs text-gray-300 w-full flex flex-col items-center">
                <li className="flex items-center justify-center gap-2 hover:text-[#CCAA00] transition-colors bg-[#0B132B] py-2 px-3 rounded-xl border border-gray-900/60 w-full">
                  <span className="text-base leading-none">✉️</span>
                  <a href="mailto:info@sy-nl.org" className="font-mono text-[11px]">info@sy-nl.org</a>
                </li>
                <li className="flex items-center justify-center gap-2 hover:text-[#CCAA00] transition-colors bg-[#0B132B] py-2 px-3 rounded-xl border border-gray-900/60 w-full">
                  <span className="text-base leading-none">💬</span>
                  <a href="https://wa.me/31684603406" target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono text-[11px]">+31 6 84 60 34 06</a>
                </li>
                <li className="flex flex-col items-center justify-center gap-1 hover:text-[#CCAA00] transition-colors bg-[#0B132B] py-2 px-3 rounded-xl border border-gray-900/60 w-full text-center">
                  <span className="text-base leading-none">📍</span>
                  <a href="https://www.google.com/maps/place/Laan+van+Meerdervoort+53-D,+2517+AE+Den+Haag" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted text-[11px] leading-snug">
                    Laan van Meerdervoort 53-D<br />2517 AE Den Haag
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800 text-center text-[10px] w-full">
              <Link href="/about" className="bg-[#0B132B] hover:bg-black py-1.5 rounded-lg text-gray-300 transition-colors border border-gray-900/40">من نحن</Link>
              <Link href="/regulations" className="bg-[#0B132B] hover:bg-black py-1.5 rounded-lg text-gray-300 transition-colors border border-gray-900/40">النظام الداخلي</Link>
              <Link href="/volunteer" className="bg-[#0B132B] hover:bg-black py-1.5 rounded-lg text-gray-300 transition-colors border border-gray-900/40">تطوع الآن</Link>
              <Link href="/contact" className="bg-[#0B132B] hover:bg-black py-1.5 rounded-lg text-gray-300 transition-colors border border-gray-900/40">اتصل بنا</Link>
            </div>
          </div>

        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[11px] text-gray-500">
          <p>© {new Date().getFullYear()} الجالية السورية في هولندا (SGN). جميع الحقوق محفوظة.</p>
          <div className="flex gap-4">
            <span className="text-gray-400 font-light">نظام أساسي معتمد من الجمعية العمومية أصولاً.</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
