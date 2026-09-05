"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  GraduationCap,
  HardHat,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Check,
  Building,
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface VCAQuestion {
  id: number;
  questionNl: string;
  questionAr: string;
  options: { textNl: string; textAr: string; isCorrect: boolean }[];
  explanationAr: string;
}

const VCA_QUESTIONS: VCAQuestion[] = [
  {
    id: 1,
    questionNl: "Wanneer is het dragen van een veiligheidshelm op een bouwplaats verplicht?",
    questionAr: "متى يكون ارتداء خوذة السلامة (Veiligheidshelm) إلزامياً في موقع البناء؟",
    options: [
      { textNl: "Alleen wanneer er boven je hoofd wordt gewerkt.", textAr: "فقط عندما يتم العمل فوق مستوى رأسك.", isCorrect: false },
      { textNl: "Altijd, zodra de veiligheidsborden dat aangeven.", textAr: "دائماً، بمجرد أن تشير لوحات السلامة والإشارات الزرقاء إلى ذلك.", isCorrect: true },
      { textNl: "Alleen voor ZZP'ers en onderaannemers.", textAr: "فقط لعمال الـ ZZP والمقاولين الفرعيين.", isCorrect: false },
    ],
    explanationAr: "في هولندا، تشير الإشارات الدائرية الزرقاء إلى تعليمات إلزامية (Gebodsborden). عندما يظهر رمز الخوذة يجب ارتداؤها طوال فترة التواجد بالموقع.",
  },
  {
    id: 2,
    questionNl: "Wat betekent de term 'LMRA' in de Nederlandse veiligheidspraktijk?",
    questionAr: "ماذا يعني مصطلح 'LMRA' في ممارسات السلامة المهنية بهولندا؟",
    options: [
      { textNl: "Laatste Minuut Risico Analyse.", textAr: "تحليل المخاطر في اللحظة الأخيرة (قبل بدء العمل مباشرة).", isCorrect: true },
      { textNl: "Landelijke Milieu Regels Administratie.", textAr: "إدارة القوانين البيئية الوطنية.", isCorrect: false },
      { textNl: "Loonbelasting Maatregel Registratie.", textAr: "تسجيل ضريبة الرواتب.", isCorrect: false },
    ],
    explanationAr: "تقنية LMRA هي وقفة لمدة دقيقة واحدة يقوم بها العامل قبل بدء أي مهمة للتأكد من خلو محيط العمل الفوري من أي خطر طارئ.",
  },
  {
    id: 3,
    questionNl: "Vanaf welke hoogte is valbeveiliging in Nederland wettelijk verplicht?",
    questionAr: "بدءاً من أي ارتفاع يصبح استخدام وسائل الحماية من السقوط إلزامياً بحكم القانون الهولندي؟",
    options: [
      { textNl: "Vanaf 1,5 meter hoogte.", textAr: "بدءاً من ارتفاع ١٫٥ متر.", isCorrect: false },
      { textNl: "Vanaf 2,5 meter hoogte.", textAr: "بدءاً من ارتفاع ٢٫٥ متر (أو أقل إذا وُجد خطر إضافي كالماء أو الأسياخ).", isCorrect: true },
      { textNl: "Vanaf 5,0 meter hoogte.", textAr: "بدءاً من ارتفاع ٥ أمتار.", isCorrect: false },
    ],
    explanationAr: "القانون الهولندي يفرض إجراءات الحماية من السقوط (سقالات، درابزين، حزام أمان) بدءاً من ٢٫٥ متر، أو عند أي ارتفاع إذا كان السقوط يسبب خطراً جسيماً.",
  },
  {
    id: 4,
    questionNl: "Wat is de maximale veilige bewaartemperatuur voor gekoeld voedsel volgens HACCP?",
    questionAr: "ما هي أقصى درجة حرارة آمنة لحفظ الأغذية المبردة في المطاعم وفق معايير HACCP؟",
    options: [
      { textNl: "Maximaal 4 °C.", textAr: "٤ درجات مئوية كحد أقصى للمنتجات الحساسة (واللحوم/الأسماك).", isCorrect: false },
      { textNl: "Maximaal 7 °C.", textAr: "٧ درجات مئوية كحد أقصى للتبريد العام بالمطاعم الهولندية.", isCorrect: true },
      { textNl: "Maximaal 10 °C.", textAr: "١٠ درجات مئوية.", isCorrect: false },
    ],
    explanationAr: "وفق كود النظافة الهولندي (Hygiënecode Horeca)، فإن درجة حرارة الثلاجات العامة يجب ألا تتجاوز 7°C، بينما الأطعمة شديدة الحساسية تُحفظ في 4°C.",
  },
];

export default function AcademyPage() {
  const params = useParams();
  const locale = (params?.locale as string) || "ar";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [activeCourse, setActiveCourse] = useState<"vca" | "haccp" | "heftruck">("vca");

  // VCA Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [showResults, setShowResults] = useState(false);

  const handleSelect = (qId: number, optionIdx: number) => {
    if (showResults) return;
    setSelectedAnswers({ ...selectedAnswers, [qId]: optionIdx });
  };

  const score = Object.entries(selectedAnswers).reduce((acc, [qId, optIdx]) => {
    const q = VCA_QUESTIONS.find((item) => item.id === Number(qId));
    if (q && q.options[optIdx]?.isCorrect) {
      return acc + 1;
    }
    return acc;
  }, 0);

  const resetQuiz = () => {
    setSelectedAnswers({});
    setShowResults(false);
  };

  return (
    <div dir={isAr ? "rtl" : "ltr"} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-800 via-orange-900 to-slate-950 text-white p-8 md:p-12 shadow-2xl border border-amber-500/20">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
              <Award className="w-3.5 h-3.5" />
              {isAr ? "أكاديمية التدريب والتأهيل المهني السريع ٢٠٢٦" : isNl ? "Vakacademie 2026" : "Skills Academy 2026"}
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
              {isAr ? "أكاديمية الشهادات والمهن الهولندية" : isNl ? "SGN Vakacademie & Certificaten" : "Dutch Professional Certifications Hub"}
            </h1>
            <p className="text-amber-100/90 text-base md:text-lg leading-relaxed">
              {isAr
                ? "احصل على أهم الشهادات الإلزامية لدخول سوق العمل الهولندي فوراً برواتب مجزية: بنوك أسئلة تدريبية لشهادات السلامة (VCA)، سلامة الأغذية للمطاعم (HACCP)، ورخص الرافعات الشوكية (Heftruck)."
                : isNl
                ? "Haal essentiële certificaten voor de Nederlandse arbeidsmarkt: oefenvragen voor VCA Basis/VOL, HACCP hygiënecode en heftruckcertificering met tweetalige uitleg."
                : "Fast-track your Dutch career: practice exams and guides for VCA Safety, HACCP Food Hygiene, and Forklift licenses."}
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => setActiveCourse("vca")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeCourse === "vca"
                    ? "bg-white text-stone-950 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                <HardHat className="w-4 h-4" />
                <span>{isAr ? "شهادة السلامة VCA" : "VCA Basis & VOL"}</span>
              </button>
              <button
                onClick={() => setActiveCourse("haccp")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeCourse === "haccp"
                    ? "bg-white text-stone-950 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isAr ? "نظافة الأغذية HACCP" : "HACCP Horeca"}</span>
              </button>
              <button
                onClick={() => setActiveCourse("heftruck")}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  activeCourse === "heftruck"
                    ? "bg-white text-stone-950 shadow-lg scale-105"
                    : "bg-white/10 hover:bg-white/20 text-white border border-white/10"
                }`}
              >
                <Building className="w-4 h-4" />
                <span>{isAr ? "رخصة الرافعة Heftruck" : "Heftruck Certificaat"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* SECTION 1: VCA INTERACTIVE PRACTICE EXAM */}
        {activeCourse === "vca" && (
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-amber-600" />
                    {isAr ? "امتحان تجريبي تفاعلي: شهادة السلامة المهنية VCA Basis" : "Proefexamen VCA Basis"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                    {isAr
                      ? "أسئلة حقيقية مترجمة مع شرح للمصطلحات الهولندية المعقدة التي تتكرر في الامتحان الرسمي."
                      : "Echte examenvragen met tweetalige uitleg en directe scoreberekening."}
                  </p>
                </div>

                {showResults && (
                  <button
                    onClick={resetQuiz}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    {isAr ? "إعادة الاختبار" : "Opnieuw"}
                  </button>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {VCA_QUESTIONS.map((q, idx) => {
                  const selected = selectedAnswers[q.id];
                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 space-y-3"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                          {formatLocalizedDigits((idx + 1).toString(), locale)}
                        </span>
                        <div>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">{q.questionAr}</p>
                          <p className="text-xs text-slate-500 font-medium italic mt-0.5" dir="ltr">
                            {q.questionNl}
                          </p>
                        </div>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pt-2">
                        {q.options.map((opt, optIdx) => {
                          const isPicked = selected === optIdx;
                          let btnStyle = "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 hover:border-amber-500";

                          if (showResults) {
                            if (opt.isCorrect) {
                              btnStyle = "bg-emerald-50 dark:bg-emerald-950/50 border-emerald-500 text-emerald-900 dark:text-emerald-200 font-bold";
                            } else if (isPicked && !opt.isCorrect) {
                              btnStyle = "bg-red-50 dark:bg-red-950/50 border-red-500 text-red-900 dark:text-red-200";
                            }
                          } else if (isPicked) {
                            btnStyle = "bg-amber-50 dark:bg-amber-950/40 border-amber-600 text-amber-900 dark:text-amber-200 font-semibold";
                          }

                          return (
                            <button
                              key={optIdx}
                              onClick={() => handleSelect(q.id, optIdx)}
                              className={`w-full p-3 rounded-xl border text-xs text-left rtl:text-right flex items-center justify-between gap-3 transition-all ${btnStyle}`}
                            >
                              <div>
                                <span className="block">{opt.textAr}</span>
                                <span className="block text-[11px] text-slate-400 mt-0.5" dir="ltr">
                                  {opt.textNl}
                                </span>
                              </div>
                              {showResults && opt.isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                              {showResults && isPicked && !opt.isCorrect && <XCircle className="w-4 h-4 text-red-600 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Explanation */}
                      {showResults && (
                        <div className="p-3 rounded-xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 text-xs text-amber-900 dark:text-amber-300">
                          <span className="font-bold block mb-0.5">💡 توضيح السؤال:</span>
                          {q.explanationAr}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Submit / Score Box */}
              {!showResults ? (
                <button
                  onClick={() => setShowResults(true)}
                  disabled={Object.keys(selectedAnswers).length < VCA_QUESTIONS.length}
                  className="w-full py-3.5 rounded-xl bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isAr ? "تصحيح الامتحان وعرض النتيجة والشرح" : "Examenuitslag bekijken"}
                </button>
              ) : (
                <div className="p-6 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-white text-center space-y-2 shadow-lg">
                  <span className="text-xs font-semibold uppercase tracking-wider text-amber-100">نتيجتك في الاختبار التجريبي</span>
                  <div className="text-4xl font-black font-mono">
                    {formatLocalizedDigits(score.toString(), locale)} / {formatLocalizedDigits(VCA_QUESTIONS.length.toString(), locale)}
                  </div>
                  <p className="text-xs text-amber-100 max-w-md mx-auto">
                    {score >= 3
                      ? "ممتاز! إجاباتك تدل على جاهزية ممتازة لخوض الامتحان الرسمي للـ VCA والحصول على بطاقة السلامة الخضراء."
                      : "تحتاج إلى مراجعة بعض المصطلحات الهولندية. راجع الشروحات أسفل كل سؤال وحاول مجدداً!"}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* SECTION 2: HACCP GUIDE */}
        {activeCourse === "haccp" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                {isAr ? "دليل سلامة ونظافة الأغذية للمطاعم (Hygiënecode Horeca - HACCP)" : "HACCP Hygiënecode Horeca"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? "المعايير الإلزامية التي يفتش عليها مفتشو الصحة والبلدية الهولندية (NVWA) في المطاعم والمقاهي ومحلات الشاورما."
                  : "Belangrijke richtlijnen van de NVWA voor hygiënisch en veilig werken in de horeca."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-2xl font-black text-emerald-600 block">≤ 7 °C</span>
                <h3 className="font-bold text-slate-900 dark:text-white">درجات حرارة التبريد</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  يجب ألا تتجاوز حرارة ثلاجة الأطعمة العامة ٧ درجات مئوية، بينما اللحوم المفرومة والأسماك الطازجة تحفظ في درجة أقصاها ٤ درجات مئوية مع تسجيل يومي لدرجات الحرارة.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-2xl font-black text-amber-600 block">≥ 75 °C</span>
                <h3 className="font-bold text-slate-900 dark:text-white">طهي وتسخين الطعام</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  يجب أن تصل درجة الحرارة في قلب قطعة اللحم أو الدجاج إلى 75°C على الأقل للتأكد من قتل بكتيريا السالمونيلا تماماً، والحفاظ على حرارة العرض الساخن فوق 60°C.
                </p>
              </div>

              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-2">
                <span className="text-2xl font-black text-blue-600 block">Kruisbesmetting</span>
                <h3 className="font-bold text-slate-900 dark:text-white">منع التلوث التبادلي</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  فصل ألواح التقطيع بدقة عبر نظام الألوان: الأحمر للحم النيئ، الأصفر للدواجن، الأخضر للخضار، والأبيض للأجبان والخبز الجاهز للأكل.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: HEFTRUCK */}
        {activeCourse === "heftruck" && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200 dark:border-slate-800 space-y-6">
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-600" />
                {isAr ? "دورة ورخصة قيادة الرافعات الشوكية (Heftruck & Reachtruck)" : "Heftruck & Reachtruck Certificering"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isAr
                  ? "من أكثر الرخص طلباً في المستودعات اللوجستية ومراكز التوزيع الهولندية (Albert Heijn, Jumbo, PostNL, DHL)."
                  : "Snel aan het werk in magazijnen en distributiecentra in Nederland."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-3 p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/30">
                <h3 className="font-bold text-indigo-900 dark:text-indigo-300 text-sm">مميزات الدورة والشهادة:</h3>
                <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>دورة مكثفة ليوم واحد فقط (١ يوم نظري + تدريب عملي).</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>الشهادة صالحة لمدة ٥ سنوات في كامل دول الاتحاد الأوروبي.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>فرص عمل فورية بمتوسط راتب ١٥ - ١٨ يورو في الساعة.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3 p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm">التسجيل عبر شراكة الجالية:</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  تعقد الجالية دورات منتظمة بالشراكة مع معاهد هولندية معتمدة مع مترجم عربي مرافق لتسهيل اجتياز الامتحان العملي والنظري.
                </p>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <span>استفسر عن موعد الدورة القادمة في مقاطعتك</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl:rotate-180" />
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
