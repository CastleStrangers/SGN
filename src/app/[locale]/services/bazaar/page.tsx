"use client";

import { useState, useMemo } from "react";
import { useParams } from "next/navigation";
import {
  ShoppingBag,
  Utensils,
  Scissors,
  Gift,
  Heart,
  Search,
  Filter,
  MapPin,
  MessageCircle,
  Plus,
  Sparkles,
  CheckCircle2,
  Tag,
  Clock,
  Truck,
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface BazaarItem {
  id: string;
  title: string;
  category: "food" | "crafts" | "sewing" | "sweets";
  producerName: string;
  city: string;
  province: string;
  price: number;
  unit: string;
  description: string;
  whatsapp: string;
  badge?: string;
  delivery: boolean;
  imageColor: string;
}

const SAMPLE_ITEMS: BazaarItem[] = [
  {
    id: "baz-1",
    title: "مكدوس سوري بلدي بالجوز والزيت الأصلي",
    category: "food",
    producerName: "أم عمر السورية",
    city: "Utrecht",
    province: "Utrecht",
    price: 18,
    unit: "مرطبان 1 كغ",
    description: "شغل يدوي منزلي نظيف، باذنجان حموي فاخر محشو بالجوز البلدي والفليفلة والشطة الحلبية وزيت الزيتون البكر الممتاز.",
    whatsapp: "31611223344",
    badge: "مونة الموسم",
    delivery: true,
    imageColor: "from-amber-700 to-red-900",
  },
  {
    id: "baz-2",
    title: "معمول مشكل بالفستق الحلبي والجوز والتمر",
    category: "sweets",
    producerName: "حلويات الشام المنزلية",
    city: "Rotterdam",
    province: "Zuid-Holland",
    price: 24,
    unit: "علبة 1 كغ مشكل",
    description: "معمول طازج بالسمن الحيواني الأصلي، فستق حلبي فاخر، وجوز متبل بماء الزهر ومحضر يومياً حسب الطلب.",
    whatsapp: "31622334455",
    badge: "طازج يومياً",
    delivery: true,
    imageColor: "from-amber-600 to-yellow-800",
  },
  {
    id: "baz-3",
    title: "كبة شامية مقلية ومفرزة (لحم بلدي وجوز)",
    category: "food",
    producerName: "مطبخ ورد الشام",
    city: "Amsterdam",
    province: "Noord-Holland",
    price: 22,
    unit: "طبق ٢٠ حبة",
    description: "كبة دراويش مقرمشة بحشوة لحم بقر حلال مع رمان وجوز، مفرزة وجاهزة للقلي المباشر أو مشوية.",
    whatsapp: "31633445566",
    badge: "حلال 100%",
    delivery: false,
    imageColor: "from-stone-700 to-amber-950",
  },
  {
    id: "baz-4",
    title: "تفصيل وتعديل فساتين وعبايات شرقية",
    category: "sewing",
    producerName: "مشغل الخياطة الدمشقية",
    city: "Den Haag",
    province: "Zuid-Holland",
    price: 35,
    unit: "تبدأ من",
    description: "خياطة نسائية احترافية، تضييق وتقصير وتعديل قياسات الملابس السواريه والعبايات اليومية بدقة وسرعة.",
    whatsapp: "31644556677",
    badge: "خياطة نسائية",
    delivery: false,
    imageColor: "from-rose-700 to-purple-950",
  },
  {
    id: "baz-5",
    title: "تطريز يدوي صوف وتوزيعات مواليد ومناسبات",
    category: "crafts",
    producerName: "لمسات يدوية (فاطمة)",
    city: "Eindhoven",
    province: "Noord-Brabant",
    price: 15,
    unit: "للقطعة",
    description: "لوحات تطريز إيتامين بالأسماء وتوزيعات هدايا راقية للمناسبات والأعراس وأعياد الميلاد بتصاميم حسب الطلب.",
    whatsapp: "31655667788",
    badge: "شغل يدوي",
    delivery: true,
    imageColor: "from-pink-700 to-indigo-950",
  },
  {
    id: "baz-6",
    title: "جبنة حلوم وبلدية سورية مغلية بحبة البركة",
    category: "food",
    producerName: "ألبان وأجبان الياسمين",
    city: "Arnhem",
    province: "Gelderland",
    price: 14,
    unit: "قالب 800 غرام",
    description: "حليب بقري هولندي طازج 100%، محضر على الطريقة السورية التقليدية مع المستكة والمحلب وحبة البركة.",
    whatsapp: "31666778899",
    badge: "حليب طازج",
    delivery: true,
    imageColor: "from-emerald-700 to-teal-950",
  },
];

export default function BazaarPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedProvince, setSelectedProvince] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);

  const categories = [
    { id: "all", label: isAr ? "الكل" : "Alles", icon: ShoppingBag },
    { id: "food", label: isAr ? "مونة وأطباق" : "Gerechten & Mouna", icon: Utensils },
    { id: "sweets", label: isAr ? "حلويات شرقية" : "Snoep & Gebak", icon: Gift },
    { id: "sewing", label: isAr ? "خياطة وتطريز" : "Kleding & Naaiwerk", icon: Scissors },
    { id: "crafts", label: isAr ? "أشغال وهدايا" : "Handwerk & Cadeaus", icon: Heart },
  ];

  const filteredItems = useMemo(() => {
    return SAMPLE_ITEMS.filter((item) => {
      const matchSearch =
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.producerName.toLowerCase().includes(search.toLowerCase()) ||
        item.description.toLowerCase().includes(search.toLowerCase()) ||
        item.city.toLowerCase().includes(search.toLowerCase());
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchProv = selectedProvince === "all" || item.province === selectedProvince;
      return matchSearch && matchCat && matchProv;
    });
  }, [search, selectedCategory, selectedProvince]);

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-700 via-orange-800 to-stone-900 text-white p-8 md:p-12 shadow-2xl border border-amber-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5" />
              {isAr ? "سوق الأسر المنتجة والمأكولات التراثية" : isNl ? "Syrische Thuisbazaar 2026" : "Home Cuisine & Artisan Bazaar"}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {isAr ? "سوق الجالية للأسر المنتجة والمونة" : isNl ? "Syrische Thuisbazaar & Ambachten" : "Syrian Home Bazaar & Kitchens"}
            </h1>
            <p className="text-amber-100/90 text-base md:text-lg leading-relaxed">
              {isAr
                ? "دعم مباشر لمصادر دخل العائلات والأمهات السوريات في هولندا: تذوق أطيب المونة والمأكولات المنزلية والحلويات والمنتجات اليدوية واطلبها عبر واتساب مباشرة."
                : isNl
                ? "Steun lokale Syrische gezinnen en geniet van authentieke huisgemaakte gerechten, traditioneel gebak en handgemaakte ambachten in heel Nederland."
                : "Support local Syrian home kitchens and artisans across the Netherlands. Direct orders for traditional food, pastry, and crafts."}
            </p>

            <button
              onClick={() => setShowAddModal(true)}
              className="mt-2 px-5 py-2.5 rounded-xl bg-white text-stone-900 font-bold text-xs flex items-center gap-2 shadow-lg hover:bg-amber-50 transition-all scale-105"
            >
              <Plus className="w-4 h-4 text-orange-600" />
              {isAr ? "أضيفي منتجاتكِ المنزلية (مجاناً)" : "Meld je thuisproducten aan"}
            </button>
          </div>
        </div>

        {/* Category Pills & Search */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                    isActive
                      ? "bg-amber-600 text-white shadow-md shadow-amber-600/20"
                      : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row gap-3 justify-between">
            <div className="relative flex-1">
              <Search className={`absolute top-3 ${isAr ? "right-3.5" : "left-3.5"} w-4 h-4 text-slate-400`} />
              <input
                type="text"
                placeholder={isAr ? "ابحث عن مكدوس، معمول، كبة، خياطة، أو مدينة..." : "Zoek op gerecht, product of stad..."}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full ${
                  isAr ? "pr-10 pl-4" : "pl-10 pr-4"
                } py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500`}
              />
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                <option value="all">{isAr ? "كافة المقاطعات" : "Alle provincies"}</option>
                <option value="Zuid-Holland">Zuid-Holland (Rotterdam, Den Haag)</option>
                <option value="Noord-Holland">Noord-Holland (Amsterdam)</option>
                <option value="Utrecht">Utrecht</option>
                <option value="Noord-Brabant">Noord-Brabant (Eindhoven)</option>
                <option value="Gelderland">Gelderland (Arnhem)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md border border-slate-200 dark:border-slate-800 transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Visual Header */}
                <div className={`h-36 bg-gradient-to-br ${item.imageColor} relative p-4 flex flex-col justify-between text-white`}>
                  <div className="flex justify-between items-start">
                    {item.badge && (
                      <span className="px-2.5 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-bold border border-white/20">
                        {item.badge}
                      </span>
                    )}
                    <span className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-md text-[10px] flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" />
                      {item.city}
                    </span>
                  </div>

                  <div className="flex justify-between items-end">
                    <span className="text-xs font-medium text-white/90">{item.producerName}</span>
                    <div className="text-lg font-black font-mono bg-white/90 text-stone-900 px-2.5 py-0.5 rounded-lg shadow-sm">
                      €{formatLocalizedDigits(item.price.toString(), locale)}
                    </div>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-bold text-slate-900 dark:text-white text-base group-hover:text-amber-600 transition-colors">
                      {item.title}
                    </h3>
                  </div>

                  <span className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 block">
                    {item.unit}
                  </span>

                  <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-3 leading-relaxed">
                    {item.description}
                  </p>

                  <div className="flex items-center gap-2 pt-2 text-[11px] text-slate-400">
                    {item.delivery ? (
                      <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                        <Truck className="w-3 h-3" />
                        {isAr ? "شحن وتوصيل متاح" : "Bezorging mogelijk"}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {isAr ? "استلام مباشر من المنزل" : "Afhalen"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <a
                  href={`https://wa.me/${item.whatsapp}?text=${encodeURIComponent(
                    isAr
                      ? `مرحباً، أود الاستفسار والطلب بخصوص منتجكِ المعروض في بازار الجالية السورية: "${item.title}"`
                      : `Hallo, ik wil graag bestellen: ${item.title}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  {isAr ? "طلب مباشر عبر واتساب" : "Bestellen via WhatsApp"}
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ADD PRODUCT MODAL */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 space-y-4 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in fade-in zoom-in duration-150 text-xs">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {isAr ? "إضافة منتج منزلي جديد إلى البازار" : "Nieuw thuisproduct aanmelden"}
                </h3>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-slate-500"
                >
                  ✕
                </button>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(isAr ? "تم إرسال منتجك بنجاح! سيتم مراجعته وعرضه في البازار مجاناً." : "Product succesvol ingediend!");
                  setShowAddModal(false);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="font-bold block mb-1">{isAr ? "اسم المنتج:" : "Productnaam:"}</label>
                  <input
                    type="text"
                    required
                    placeholder={isAr ? "مثال: معمول بالجوز، كبة مفرزة..." : "bijv. Mouna, Koekjes..."}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">{isAr ? "السعر التقريبي باليورو (€):" : "Prijs (€):"}</label>
                    <input
                      type="number"
                      required
                      placeholder="15"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{isAr ? "الكمية / العبوة:" : "Verpakking:"}</label>
                    <input
                      type="text"
                      required
                      placeholder={isAr ? "1 كغ، علبة، طبق..." : "per kg, per stuk"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold block mb-1">{isAr ? "المدينة:" : "Woonplaats:"}</label>
                    <input
                      type="text"
                      required
                      placeholder="Rotterdam"
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold block mb-1">{isAr ? "رقم واتساب للتواصل:" : "WhatsApp nummer:"}</label>
                    <input
                      type="tel"
                      required
                      placeholder="+31 6 ..."
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold block mb-1">{isAr ? "وصف المنتج وطريقة الطلب:" : "Beschrijving:"}</label>
                  <textarea
                    rows={2}
                    placeholder={isAr ? "المكونات، طريقة الحفظ والتوصيل..." : "Ingrediënten en bereiding..."}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  {isAr ? "إرسال ونشر في البازار مجاناً" : "Plaatsen in de bazaar"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
