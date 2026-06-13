import { Link } from "@/i18n/routing";
import { FreeSyrianFlag, DutchFlag } from "@/components/flags";
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
  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-8 border-t-2 border-[#CCAA00]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between items-center text-center">
            <div className="w-full flex flex-col items-center">
              <div className="flex flex-col items-center mb-4">
                <img src="/logo.png" alt="SGN Logo" className="w-16 h-16 object-contain mb-3 hover:scale-105 transition-transform duration-300" />
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

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm space-y-3">
            <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
              التسجيل والشفافية القانونية
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center bg-[#0B132B] p-2.5 rounded-xl border border-gray-900">
                <span className="text-gray-400">رقم السجل التجاري KvK:</span>
                <span className="font-mono text-[#CCAA00] font-bold">96718943</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B132B] p-2.5 rounded-xl border border-gray-900">
                <span className="text-gray-400">الرقم الضريبي RSIN:</span>
                <span className="font-mono text-gray-300">867730286</span>
              </div>
              <div className="flex justify-between items-center bg-[#0B132B] p-2.5 rounded-xl border border-gray-900">
                <span className="text-gray-400">الصفة القانونية:</span>
                <span className="text-emerald-400 font-medium">جمعية مسجلة أصولاً</span>
              </div>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm space-y-3">
            <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-2">
              <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
              الحساب البنكي المعتمد (ANBI)
            </h4>
            <p className="text-[11px] text-gray-400 leading-normal">
              تُوجه جميع الاشتراكات والمساهمات لدعم الأنشطة التعليمية، الطبية، والإنسانية للجالية.
            </p>
            <div className="bg-[#0B132B] p-3 rounded-xl border border-gray-900 space-y-1">
              <span className="text-[10px] text-gray-500 block uppercase font-mono">Official Bank Account (IBAN)</span>
              <span className="text-[#CCAA00] font-mono font-bold text-xs block tracking-wider text-left">
                NL90 ABNA 0148 7498 95
              </span>
            </div>
          </div>

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <h4 className="text-[#CCAA00] font-bold text-xs uppercase tracking-wider flex items-center gap-2 mb-4">
                <span className="w-1.5 h-3 bg-[#CCAA00] rounded-sm"></span>
                روابط سريعة ومعلومات الاتصال
              </h4>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>✉️</span>
                  <a href="mailto:info@sy-nl.org" className="font-mono">info@sy-nl.org</a>
                </li>
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>💬</span>
                  <a href="https://wa.me/31684603406" target="_blank" rel="noopener noreferrer" dir="ltr" className="font-mono">+31 6 84 60 34 06</a>
                </li>
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>📍</span>
                  <a href="https://www.google.com/maps/place/Laan+van+Meerdervoort+53-D,+2517+AE+Den+Haag" target="_blank" rel="noopener noreferrer" className="underline decoration-dotted">
                    Laan van Meerdervoort 53-D, 2517 AE Den Haag
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800 text-center text-[11px]">
              <Link href="/about" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">من نحن</Link>
              <Link href="/regulations" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">النظام الداخلي</Link>
              <Link href="/volunteer" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">تطوع الآن</Link>
              <Link href="/contact" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">اتصل بنا</Link>
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
