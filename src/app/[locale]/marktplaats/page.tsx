"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  ShoppingBag, Gift, Wrench, Search, MapPin, Tag, Plus, 
  Phone, MessageSquare, CheckCircle2, ShieldCheck, Heart, 
  ArrowLeft, ArrowRight, Sparkles, Filter, X, ExternalLink
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

type TabType = "all" | "gratis" | "marketplace" | "services";

interface ListingItem {
  id: string;
  type: "gratis" | "marketplace" | "service";
  titleAr: string;
  titleEn: string;
  titleNl: string;
  category: string;
  price: string;
  priceNl: string;
  isFree: boolean;
  city: string;
  province: string;
  condition?: string;
  image: string;
  descriptionAr: string;
  descriptionNl: string;
  sellerName: string;
  sellerPhone: string;
  verified: boolean;
  createdAt: string;
}

const SAMPLE_LISTINGS: ListingItem[] = [
  {
    id: "item-1",
    type: "gratis",
    titleAr: "طقم كنبايات صالون (٣ قطع) بحالة ممتازة مجاناً لمستحقين",
    titleEn: "Comfortable 3-piece living room sofa set (Free for newcomers)",
    titleNl: "Complete 3-zits bankstel in uitstekende staat (Gratis voor statushouders)",
    category: "furniture",
    price: "مجاناً (Gratis)",
    priceNl: "Gratis",
    isFree: true,
    city: "Utrecht",
    province: "Utrecht",
    condition: "ممتازة (Zeer goed)",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&auto=format&fit=crop&q=80",
    descriptionAr: "طقم كنب نظيف جداً ومريح تم استخدامه بعناية. متاح للتبرع لعائلة جديدة حصلت على بيت في أوترخت أو ما حولها.",
    descriptionNl: "Zeer nette en comfortabele bank. Gratis af te halen voor een gezin dat net een woning heeft gekregen in Utrecht of omgeving.",
    sellerName: "أبو عمر الشامي",
    sellerPhone: "+31 6 12345678",
    verified: true,
    createdAt: "2026-09-03",
  },
  {
    id: "item-2",
    type: "gratis",
    titleAr: "غسالة ملابس Bosch 8kg تعمل بكفاءة تامة للتبرع",
    titleEn: "Bosch 8kg washing machine in full working condition (Free)",
    titleNl: "Bosch 8kg wasmachine in perfect werkende staat (Gratis)",
    category: "appliances",
    price: "مجاناً (Gratis)",
    priceNl: "Gratis",
    isFree: true,
    city: "Rotterdam",
    province: "Zuid-Holland",
    condition: "جيدة جداً (Goed)",
    image: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=500&auto=format&fit=crop&q=80",
    descriptionAr: "غسالة بوش أصلية موفرة للطاقة A+++ تعمل بدون أي عطل، مناسبة لعائلة سورية تبدأ حياتها في روتردام.",
    descriptionNl: "Energiezuinige Bosch wasmachine, werkt 100% naar behoren. Gratis voor een familie in Rotterdam.",
    sellerName: "م. خالد فيصل",
    sellerPhone: "+31 10 9876543",
    verified: true,
    createdAt: "2026-09-04",
  },
  {
    id: "item-3",
    type: "marketplace",
    titleAr: "طاولة سفرة خشب زان متين مع ٦ كراسي جلد",
    titleEn: "Solid beechwood dining table with 6 leather chairs",
    titleNl: "Massief beukenhouten eettafel inclusief 6 lederen stoelen",
    category: "furniture",
    price: "€ ٧٥ (سعر رمزي)",
    priceNl: "€ 75 (symbolisch)",
    isFree: false,
    city: "Amsterdam",
    province: "Noord-Holland",
    condition: "شبه جديد (Zo goed als nieuw)",
    image: "https://images.unsplash.com/photo-1617806118233-18e1de247200?w=500&auto=format&fit=crop&q=80",
    descriptionAr: "طاولة سفرة راقية ومتينة جداً، معروضة بسعر رمزي لمساعدة أي عائلة سورية تبحث عن أثاث راقٍ بتكلفة بسيطة.",
    descriptionNl: "Mooie, stevige eettafel met 6 stoelen. Aangeboden voor een zeer lage prijs om een gezin te helpen.",
    sellerName: "نور الدين عثمان",
    sellerPhone: "+31 20 4567890",
    verified: true,
    createdAt: "2026-09-02",
  },
  {
    id: "item-4",
    type: "service",
    titleAr: "كهربائي وتمديدات منزلية معتمدة (NEN 1010 / NEN 3140)",
    titleEn: "Certified residential electrician (NEN 1010 standards)",
    titleNl: "Gecertificeerd Elektricien & Installateur (NEN 1010)",
    category: "craftsman",
    price: "خصم ١٥٪ لأعضاء SGN",
    priceNl: "15% SGN korting",
    isFree: false,
    city: "Den Haag",
    province: "Zuid-Holland",
    condition: "حرفي معتمد (Vakman)",
    image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80",
    descriptionAr: "فني كهربائي سوري معتمد في هولندا مع خبرة ١٢ عاماً في تركيب لوحات القواطع (Groepenkast)، تمديد الإضاءة، وصيانة الأعطال.",
    descriptionNl: "Ervaren elektricien voor groepenkasten, verlichting, storingen en keuringen. Betrouwbaar en professioneel.",
    sellerName: "المعلم وسيم حسان",
    sellerPhone: "+31 70 3334455",
    verified: true,
    createdAt: "2026-09-01",
  },
  {
    id: "item-5",
    type: "service",
    titleAr: "دهان وديكورات داخلية وترميم منازل قبل التسليم",
    titleEn: "Professional interior painter and home renovator",
    titleNl: "Schilder & Binnenafwerking / Woningschoonmaak",
    category: "craftsman",
    price: "أسعار تفضيلية للجالية",
    priceNl: "Scherpe tarieven",
    isFree: false,
    city: "Eindhoven",
    province: "Noord-Brabant",
    condition: "حرفي معتمد (Vakman)",
    image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=500&auto=format&fit=crop&q=80",
    descriptionAr: "معلم دهان محترف لتجهيز البيوت الجديدة أو إعادة دهانها قبل تسليمها لمؤسسات السكن (Woningcorporatie).",
    descriptionNl: "Vakkundig schilderwerk voor oplevering van huurwoningen en nieuwbouw. Snelle service en scherpe prijzen.",
    sellerName: "أبو عمار حمص",
    sellerPhone: "+31 40 8889900",
    verified: true,
    createdAt: "2026-09-04",
  },
];

export default function MarktplaatsPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";
  const dir = isAr ? "rtl" : "ltr";

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ListingItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addSubmitted, setAddSubmitted] = useState(false);

  const filteredListings = SAMPLE_LISTINGS.filter((item) => {
    if (activeTab === "gratis" && item.type !== "gratis") return false;
    if (activeTab === "marketplace" && item.type !== "marketplace") return false;
    if (activeTab === "services" && item.type !== "service") return false;
    if (selectedProvince !== "all" && item.province !== selectedProvince) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.titleAr.toLowerCase().includes(q) ||
        item.titleNl.toLowerCase().includes(q) ||
        item.city.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Navigation back */}
        <div className="flex items-center justify-between">
          <Link
            href={`/${locale}/services`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الخدمات" : isNl ? "Terug naar Diensten" : "Back to Services"}</span>
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1a5632] hover:bg-[#0f3d23] text-white text-xs font-black shadow-md transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{isAr ? "أضف تبرعاً أو خدمة" : isNl ? "Plaats advertentie / dienst" : "Post Donation / Service"}</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold px-4 py-1.5 rounded-full border border-emerald-500/20">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>{isAr ? "سوق التكافل وتبادل الأثاث والخدمات (SGN Marktplaats)" : isNl ? "SGN Marktplaats & Diensten" : "SGN Marketplace & Services"}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "التكافل بين أفراد الجالية في كل هولندا" : isNl ? "Samen delen, ruilen en helpen in heel Nederland" : "Sharing, Swapping & Mutual Help Across the Netherlands"}
          </h1>
          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {isAr 
              ? "منصة آمنة للتبرع بالأثاث والأجهزة مجاناً للقادمين الجدد، البيع بأسعار رمزية، ودليل الحرفيين السوريين المعتمدين في هولندا."
              : isNl
              ? "Gratis meubels en apparaten voor statushouders, voordelige spullen en een gids van betrouwbare Syrische vakmensen in Nederland."
              : "Free furniture & appliances for newcomers, low-cost community items, and directory of verified Syrian tradesmen in the Netherlands."}
          </p>
        </div>

        {/* Search & Tabs Controls */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 md:p-6 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          {/* Main Tabs */}
          <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
            {[
              { id: "all", ar: "الكل", nl: "Alles tonen", icon: ShoppingBag },
              { id: "gratis", ar: "مجاناً للقادمين الجدد", nl: "Gratis donaties", icon: Gift },
              { id: "marketplace", ar: "بيع بأسعار رمزية", nl: "Voordelig marktplaats", icon: Tag },
              { id: "services", ar: "دليل الحرفيين والمستقلين", nl: "Vakmensen & Diensten", icon: Wrench },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === tab.id
                      ? "bg-[#1a5632] text-white shadow-md"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{isAr ? tab.ar : tab.nl}</span>
                </button>
              );
            })}
          </div>

          {/* Search bar & Province Filter */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-8 relative">
              <Search className="w-4 h-4 absolute top-3.5 right-3.5 text-slate-400 rtl:right-3.5 rtl:left-auto ltr:left-3.5 ltr:right-auto" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isAr ? "ابحث عن أثاث، غسالة، طاولة، كهربائي، دهان..." : "Zoek op meubels, witgoed, schilder, elektricien..."}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 pr-10 rtl:pr-10 rtl:pl-4 ltr:pl-10 ltr:pr-4 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="md:col-span-4">
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="all">{isAr ? "كافة المقاطعات الـ ١٢" : "Alle 12 provincies"}</option>
                <option value="Utrecht">Utrecht (أوترخت)</option>
                <option value="Zuid-Holland">Zuid-Holland (روتردام ولاهاي)</option>
                <option value="Noord-Holland">Noord-Holland (أمستردام)</option>
                <option value="Noord-Brabant">Noord-Brabant (آيندهوفن)</option>
                <option value="Gelderland">Gelderland (آرنهم ونيميخن)</option>
                <option value="Overijssel">Overijssel (إنسخيده)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Listings Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Image Container */}
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  <img
                    src={item.image}
                    alt={item.titleAr}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Badge */}
                  <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black shadow-md ${
                      item.isFree
                        ? "bg-emerald-600 text-white"
                        : item.type === "service"
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-900 text-white"
                    }`}>
                      {isAr ? item.price : item.priceNl}
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto bg-black/60 backdrop-blur-sm text-white px-2.5 py-1 rounded-xl text-[10px] font-bold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-emerald-400" />
                    <span>{item.city} ({item.province})</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-2">
                  <h3 className="text-sm font-black text-slate-900 dark:text-white line-clamp-2 leading-snug">
                    {isAr ? item.titleAr : item.titleNl}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {isAr ? item.descriptionAr : item.descriptionNl}
                  </p>

                  <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      {item.sellerName}
                    </span>
                    <span>{item.condition}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-5 pt-0 flex items-center gap-2">
                <a
                  href={`https://wa.me/${item.sellerPhone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(isAr ? `مرحباً، بخصوص إعلانك على SGN: ${item.titleAr}` : `Hallo, over uw advertentie op SGN: ${item.titleNl}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black flex items-center justify-center gap-1.5 transition-all shadow-sm"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{isAr ? "محادثة واتساب" : "WhatsApp"}</span>
                </a>
                <a
                  href={`tel:${item.sellerPhone}`}
                  className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
            <div dir={dir} className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 space-y-6">
              {!addSubmitted ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setAddSubmitted(true);
                  }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {isAr ? "إضافة إعلان أو خدمة جديدة" : "Nieuwe advertentie plaatsen"}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center hover:bg-slate-200 cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? "عنوان الإعلان:" : "Titel advertentie:"}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "مثال: طاولة طعام مجانية أو فني كهربائي" : "Bijv: Gratis bank of Elektricien"}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "المدينة:" : "Stad:"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Amsterdam / Utrecht"
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                        {isAr ? "السعر أو مجاني:" : "Prijs / Gratis:"}
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isAr ? "مجاناً أو € ٥٠" : "Gratis / € 50"}
                        className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? "رقم الهاتف والواتساب للتواصل:" : "Telefoonnummer / WhatsApp:"}
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+31 6 ..."
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {isAr ? "وصف مختصر:" : "Omschrijving:"}
                    </label>
                    <textarea
                      rows={3}
                      required
                      placeholder={isAr ? "تفاصيل حالة الغرض، المقاسات، وموعد الاستلام..." : "Details over staat, afmetingen..."}
                      className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-2.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddModal(false)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 cursor-pointer"
                    >
                      {isAr ? "إلغاء" : "Annuleren"}
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-xl bg-[#1a5632] hover:bg-[#0f3d23] text-white font-black text-xs shadow-md transition-all cursor-pointer"
                    >
                      {isAr ? "نشر الإعلان الآن" : "Advertentie plaatsen"}
                    </button>
                  </div>
                </form>
              ) : (
                <div className="py-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white">
                    {isAr ? "تم نشر إعلانك بنجاح!" : "Advertentie succesvol geplaatst!"}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isAr ? "أصبح الإعلان متاحاً الآن لكافة أبناء الجالية في هولندا." : "Uw advertentie is nu zichtbaar voor de gemeenschap."}
                  </p>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setAddSubmitted(false);
                    }}
                    className="px-6 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold cursor-pointer"
                  >
                    {isAr ? "إغلاق" : "Sluiten"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
