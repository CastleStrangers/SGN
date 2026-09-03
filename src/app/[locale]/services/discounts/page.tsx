"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { 
  Percent, Sparkles, MapPin, Phone, MessageCircle, ExternalLink, 
  Search, ShieldCheck, Tag, Utensils, Scale, Wrench, ShoppingBag, 
  Car, HeartPulse, Crown
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface PartnerItem {
  id: string;
  nameAr: string;
  nameEn: string;
  nameNl: string;
  category: "food" | "legal" | "auto" | "retail" | "health";
  city: string;
  discountAr: string;
  discountEn: string;
  discountNl: string;
  descriptionAr: string;
  descriptionEn: string;
  descriptionNl: string;
  phone: string;
  whatsapp: string;
  verified: boolean;
  featured: boolean;
}

const PARTNERS: PartnerItem[] = [
  {
    id: "1",
    nameAr: "مطعم ومشاوي دمشق الشام",
    nameEn: "Damascus Grill Restaurant",
    nameNl: "Damascus Grill Restaurant",
    category: "food",
    city: "Amsterdam",
    discountAr: "خصم ١٥٪ على الفاتورة",
    discountEn: "15% off total bill",
    discountNl: "15% korting op de rekening",
    descriptionAr: "أشهى المأكولات الشامية الأصيلة والمشاوي الحلبية مع جلسات عائلية مميزة.",
    descriptionEn: "Authentic Syrian grilled specialties and traditional Levantine dishes in Amsterdam.",
    descriptionNl: "Authentieke Syrische grill-specialiteiten en traditionele gerechten in Amsterdam.",
    phone: "+31 20 123 4567",
    whatsapp: "31201234567",
    verified: true,
    featured: true,
  },
  {
    id: "2",
    nameAr: "مكتب يوروتكس للترجمة المحلفة والاستشارات",
    nameEn: "EuroTex Sworn Translation & Legal Bureau",
    nameNl: "EuroTex Beëdigde Vertalingen",
    category: "legal",
    city: "Rotterdam",
    discountAr: "خصم ٢٠٪ على تصديق الوثائق والترجمة",
    discountEn: "20% off sworn translations",
    discountNl: "20% korting op beëdigde vertalingen",
    descriptionAr: "ترجمة محلفة ومعتمدة لدى المحاكم ودوائر الهجرة الهولندية IND لكافة الوثائق السورية.",
    descriptionEn: "Certified sworn translations accepted by Dutch IND and municipal courts.",
    descriptionNl: "Beëdigde vertalingen geaccepteerd door de IND en Nederlandse rechtbanken.",
    phone: "+31 10 987 6543",
    whatsapp: "31109876543",
    verified: true,
    featured: true,
  },
  {
    id: "3",
    nameAr: "مركز الأمانة لصيانة وتفتيش السيارات APK",
    nameEn: "Al-Amana Auto Garage & APK Inspection",
    nameNl: "Al-Amana Autogarage & APK",
    category: "auto",
    city: "Utrecht",
    discountAr: "فحص APK مجاني عند الصيانة الدورية",
    discountEn: "Free APK inspection with full service",
    discountNl: "Gratis APK bij grote onderhoudsbeurt",
    descriptionAr: "صيانة شاملة لكافة أنواع السيارات، ميزان دوزان إلكتروني وفحص دوري APK معتمد.",
    descriptionEn: "Full auto mechanics, diagnostics, and certified Dutch APK inspections in Utrecht.",
    descriptionNl: "Compleet auto-onderhoud, elektronische diagnose en officiële APK in Utrecht.",
    phone: "+31 30 555 4321",
    whatsapp: "31305554321",
    verified: true,
    featured: false,
  },
  {
    id: "4",
    nameAr: "سوبرماركت الشرق للمنتجات السورية واللحوم الحلال",
    nameEn: "Al-Sharq Oriental Supermarket & Halal Meat",
    nameNl: "Al-Sharq Supermarkt & Halal Slagerij",
    category: "retail",
    city: "The Hague",
    discountAr: "خصم ١٠٪ على جميع مشتريات اللحوم والمونة",
    discountEn: "10% off all halal meats and groceries",
    discountNl: "10% korting op halal vlees en levensmiddelen",
    descriptionAr: "أفضل منتجات المونة السورية، بهارات حلب، ولحوم طازجة مذبوحة على الطريقة الإسلامية.",
    descriptionEn: "Finest Syrian groceries, traditional spices, and certified fresh halal butcher.",
    descriptionNl: "Traditionele Syrische levensmiddelen, kruiden en verse halal slagerij in Den Haag.",
    phone: "+31 70 333 2211",
    whatsapp: "31703332211",
    verified: true,
    featured: false,
  },
];

export default function DiscountsPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = PARTNERS.filter((p) => {
    const matchCat = selectedCat === "all" || p.category === selectedCat;
    const name = isAr ? p.nameAr : isNl ? p.nameNl : p.nameEn;
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) || p.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold px-4 py-1.5 rounded-full border border-amber-500/20">
            <Percent className="w-3.5 h-3.5" />
            <span>
              {isAr ? "شبكة الخصومات والشراكات المعتمدة للجالية" : isNl ? "SGN Voordeel & Kortingen Netwerk" : "SGN Community Advantage & Discounts"}
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "خصومات حصرية لحاملي بطاقة SGN" : isNl ? "Exclusieve kortingen voor SGN-leden" : "Exclusive Discounts for SGN Members"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-sm md:text-base max-w-2xl mx-auto">
            {isAr
              ? "استفد من خصومات تبدأ من ١٠٪ وحتى ٢٥٪ لدى مئات المطاعم، المتاجر، مكاتب المحاماة والترجمة، ومراكز الصيانة في كافة المدن الهولندية بإبراز بطاقة عضويتك."
              : isNl
              ? "Profiteer van 10% tot 25% korting bij aangesloten restaurants, winkels, beëdigde vertalers en garages door uw SGN-lidmaatschapskaart te tonen."
              : "Enjoy 10% to 25% off at partner restaurants, stores, legal translators, and auto garages across the Netherlands by presenting your SGN card."}
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-80">
            <Search className={`absolute top-3 ${isAr ? "right-3" : "left-3"} w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={isAr ? "ابحث باسم المحل أو المدينة..." : isNl ? "Zoek op naam of stad..." : "Search by name or city..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full py-2 ${isAr ? "pr-9 pl-4" : "pl-9 pr-4"} bg-slate-50 dark:bg-slate-800 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 border border-slate-200 dark:border-slate-700`}
            />
          </div>

          <div className="flex flex-wrap gap-1.5 w-full md:w-auto justify-center">
            {[
              { key: "all", labelAr: "الكل", labelEn: "All", labelNl: "Alles" },
              { key: "food", labelAr: "مطاعم وحلويات", labelEn: "Food & Dining", labelNl: "Restaurants" },
              { key: "legal", labelAr: "ترجمة ومحاماة", labelEn: "Legal & Translators", labelNl: "Juridisch" },
              { key: "auto", labelAr: "كراجات وصيانة", labelEn: "Auto & Repairs", labelNl: "Autogarages" },
              { key: "retail", labelAr: "متاجر ومونة", labelEn: "Retail & Groceries", labelNl: "Supermarkten" },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setSelectedCat(tab.key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCat === tab.key
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200"
                }`}
              >
                {isAr ? tab.labelAr : isNl ? tab.labelNl : tab.labelEn}
              </button>
            ))}
          </div>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const title = isAr ? item.nameAr : isNl ? item.nameNl : item.nameEn;
            const desc = isAr ? item.descriptionAr : isNl ? item.descriptionNl : item.descriptionEn;
            const discount = isAr ? item.discountAr : isNl ? item.discountNl : item.discountEn;

            return (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 dark:text-white">{title}</h3>
                        {item.verified && (
                          <span title={isAr ? "شريك معتمد من الجالية" : "Verified Partner"}>
                            <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-medium">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>{item.city}</span>
                      </div>
                    </div>

                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-black bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 shrink-0">
                      {discount}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {desc}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-bold text-slate-400">
                    {isAr ? "أبرز بطاقة SGN عند الحضور" : isNl ? "Toon uw SGN-kaart bij aankomst" : "Show SGN card upon arrival"}
                  </span>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${item.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl hover:bg-emerald-100 transition-colors"
                      title="WhatsApp"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </a>
                    <a
                      href={`tel:${item.phone}`}
                      className="p-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-200 transition-colors"
                      title="Call"
                    >
                      <Phone className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Business Partnership CTA Box */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white rounded-3xl p-8 shadow-xl text-center space-y-4">
          <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto">
            <Crown className="w-6 h-6 text-amber-300" />
          </div>
          <h3 className="text-2xl font-black tracking-tight">
            {isAr ? "هل تملك مشروعاً أو عملاً في هولندا وترغب في الانضمام للشبكة؟" : isNl ? "Heeft u een bedrijf en wilt u zich aansluiten bij SGN?" : "Do you own a business and want to join the SGN Partner Network?"}
          </h3>
          <p className="text-xs md:text-sm text-emerald-100 max-w-xl mx-auto">
            {isAr
              ? "اجذب آلاف الزبائن السوريين في هولندا وقدم عرضاً خاصاً لحاملي بطاقة العضوية، مع باقات ترويجية مميزة."
              : isNl
              ? "Bereik duizenden potentiële klanten en bied een exclusief aanbod aan voor onze leden."
              : "Reach thousands of community members and offer exclusive promotions to boost your business."}
          </p>
          <a
            href="https://wa.me/31612345678?text=Hello%20SGN%20Partnership"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-900 hover:bg-emerald-50 text-xs font-black rounded-xl shadow-lg transition-all"
          >
            <span>{isAr ? "تسجيل نشاطك التجاري كشريك معتمد" : isNl ? "Meld uw bedrijf aan" : "Register Your Business as Partner"}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
