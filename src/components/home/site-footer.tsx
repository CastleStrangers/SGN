import { Link } from "@/i18n/routing";

export function SiteFooter() {
  return (
    <footer className="bg-[#0B132B] text-white pt-16 pb-8 border-t-2 border-[#CCAA00]" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">

          <div className="bg-[#1C2541] p-6 rounded-2xl border border-gray-800 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.png" alt="SGN Logo" className="w-12 h-12 object-contain" />
                <div>
                  <h3 className="font-bold text-md text-white tracking-wide">الجالية السورية في هولندا</h3>
                  <p className="text-[10px] text-gray-400 font-mono">Syrische Gemeenschap in Nederland</p>
                </div>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                واجهة اجتماعية اعتبارية ومؤسسة غير ربحية تعنى بشؤون المغتربين وتخدم مصالحهم عبر قنوات التواصل الرسمية مع بلد الإقامة.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-800 mt-4 flex gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">www.sy-nl.org</span>
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
                قنوات التواصل والموقع الجغرافي
              </h4>
              <ul className="space-y-3 text-xs text-gray-300">
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>📍</span>
                  <a href="https://www.google.com/maps/place/Laan+van+Meerdervoort+53-D,+2517+AE+Den+Haag" target="_blank" rel="noreferrer" className="underline decoration-dotted">
                    Laan van Meerdervoort 53-D, 2517 AE Den Haag
                  </a>
                </li>
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>✉️</span>
                  <a href="mailto:info@sy-nl.org" className="font-mono">info@sy-nl.org</a>
                </li>
                <li className="flex items-center gap-2 hover:text-[#CCAA00] transition-colors">
                  <span>👥</span>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="underline decoration-dotted">
                    الصفحة الرسمية على فيسبوك
                  </a>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-gray-800 text-center text-[11px]">
              <Link href="/about" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">من نحن</Link>
              <Link href="/regulations" className="bg-[#0B132B] hover:bg-black p-1.5 rounded-lg text-gray-300 transition-colors">النظام الداخلي</Link>
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
