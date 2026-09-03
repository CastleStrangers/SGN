"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import Link from "next/link";
import { 
  CheckCircle2, XCircle, HelpCircle, ArrowRight, ArrowLeft, RotateCcw, 
  Sparkles, Award, Clock, BookOpen, ChevronRight, Share2
} from "lucide-react";
import { formatLocalizedDigits } from "@/lib/language-guard";

interface Question {
  id: number;
  questionAr: string;
  questionEn: string;
  questionNl: string;
  optionsAr: string[];
  optionsEn: string[];
  optionsNl: string[];
  correctAnswer: number;
  explanationAr: string;
  explanationEn: string;
  explanationNl: string;
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    questionAr: "انتقلت إلى منزل جديد في مدينة هولندية أخرى. كم من الوقت لديك لتسجيل عنوانك الجديد في البلدية (Gemeente)؟",
    questionEn: "You moved to a new house in another Dutch municipality. How much time do you have to register your new address?",
    questionNl: "U bent verhuisd naar een andere gemeente. Binnen hoeveel tijd moet u uw nieuwe adres doorgeven?",
    optionsAr: [
      "خلال ٤ أسابيع قبل الانتقال أو حتى ٥ أيام بعد الانتقال",
      "خلال شهرين كاملين",
      "لا داعي للتسجيل إلا عند تجديد الإقامة",
      "فقط عند طلب مصلحة الضرائب ذلك"
    ],
    optionsEn: [
      "Within 4 weeks before or up to 5 days after moving",
      "Within 2 full months",
      "No registration needed unless renewing residence permit",
      "Only when requested by tax authorities"
    ],
    optionsNl: [
      "Binnen 4 weken vóór of uiterlijk 5 dagen na de verhuizing",
      "Binnen 2 maanden na verhuizing",
      "Registratie is niet verplicht",
      "Alleen op verzoek van de Belastingdienst"
    ],
    correctAnswer: 0,
    explanationAr: "القانون الهولندي يفرض تسجيل الانتقال خلال ٤ أسابيع قبل موعد السكن أو بحد أقصى ٥ أيام بعد الانتقال لتجنب الغرامات المالية وضمان استمرار بدلات السكن والتأمين.",
    explanationEn: "Dutch law requires reporting your move within 4 weeks before or within 5 days after moving to avoid fines and maintain housing/health allowances.",
    explanationNl: "Volgens de wet moet u een verhuizing binnen 4 weken voor of uiterlijk 5 dagen na de verhuizing melden bij de gemeente.",
  },
  {
    id: 2,
    questionAr: "دعاك جارك الهولندي لزيارته وتناول القهوة في الساعة الثالثة عصراً. ما هو التصرف المتوقع في الثقافة الهولندية؟",
    questionEn: "Your Dutch neighbour invites you for coffee at 3:00 PM. What is the expected social etiquette?",
    questionNl: "Uw Nederlandse buurman nodigt u uit voor koffie om 15:00 uur. Wat is de verwachte gewoonte?",
    optionsAr: [
      "الحضور في الموعد المحدد تماماً (الساعة الثالثة)",
      "التأخر نصف ساعة لإظهار اللباقة وعدم التكلف",
      "إحضار جميع أفراد العائلة والأصدقاء دون إخبار الجار",
      "الاعتذار دائماً لأن الهولنديين لا يحبون الزيارات"
    ],
    optionsEn: [
      "Arrive punctually at exactly 3:00 PM",
      "Arrive half an hour late out of politeness",
      "Bring all extended family and friends unannounced",
      "Decline because Dutch people dislike visits"
    ],
    optionsNl: [
      "Precies op tijd komen (om 15:00 uur)",
      "Een half uur later komen uit beleefdheid",
      "Onaangekondigd vrienden en familie meenemen",
      "Altijd weigeren omdat buren liever geen bezoek willen"
    ],
    correctAnswer: 0,
    explanationAr: "الدقة في المواعيد (Punctualiteit) هي قيمة أساسية جداً في المجتمع الهولندي. يُفضل دائماً الحضور في الوقت المتفق عليه أو إرسال رسالة اعتذار إذا تأخرت أكثر من ٥ دقائق.",
    explanationEn: "Punctuality is a key Dutch cultural value. It is expected to arrive precisely on time or notify the host if delayed by even a few minutes.",
    explanationNl: "Punctualiteit en op tijd komen is een belangrijke waarde in de Nederlandse cultuur.",
  },
  {
    id: 3,
    questionAr: "من هو الشخص المسؤول أولاً عن متابعة صحتك وتحويلك للمستشفى أو الطبيب المختص في هولندا؟",
    questionEn: "Who is primarily responsible for your medical care and referrals to specialists in the Netherlands?",
    questionNl: "Wie is uw eerste aanspreekpunt voor medische zorg en verwijzingen in Nederland?",
    optionsAr: [
      "طبيب العائلة العام (Huisarts)",
      "طوارئ المستشفى مباشرة (Spoedeisende Hulp)",
      "الصيدلية المحلية (Apotheek)",
      "البلدية (Gemeente)"
    ],
    optionsEn: [
      "General Practitioner / Family Doctor (Huisarts)",
      "Hospital Emergency directly (SEH)",
      "Local Pharmacy (Apotheek)",
      "Municipality (Gemeente)"
    ],
    optionsNl: [
      "De Huisarts",
      "De Spoedeisende Hulp (SEH)",
      "De Apotheek",
      "De Gemeente"
    ],
    correctAnswer: 0,
    explanationAr: "في النظام الصحي الهولندي، طبيب العائلة (Huisarts) هو بوابة الرعاية الصحية الأولى. لا يمكنك الذهاب لطبيب اختصاصي في المستشفى إلا بإحالة طبية رسمية منه.",
    explanationEn: "In the Dutch healthcare system, your Huisarts acts as the primary gatekeeper. Specialist hospital visits require a referral letter.",
    explanationNl: "De huisarts is in Nederland de centrale poortwachter voor alle specialistische zorg in het ziekenhuis.",
  },
  {
    id: 4,
    questionAr: "تلقيت مخالفة مرورية أو إشعاراً مالياً من الـ CJIB وترى أن هناك خطأ. كم هي المهلة القانونية لتقديم اعتراض (Bezwaar)؟",
    questionEn: "You received a CJIB traffic notice and believe it is incorrect. What is the legal deadline to lodge an objection (Bezwaar)?",
    questionNl: "U ontvangt een CJIB-boete en bent het er niet mee eens. Binnen welke termijn kunt u bezwaar indienen?",
    optionsAr: [
      "خلال ٦ أسابيع من تاريخ صدور الخطاب (Dagtekening)",
      "خلال سنة كاملة",
      "لا يحق لك الاعتراض على قرارات الـ CJIB أبداً",
      "خلال ٢٤ ساعة فقط"
    ],
    optionsEn: [
      "Within 6 weeks of the letter date (Dagtekening)",
      "Within 1 full year",
      "You can never object to CJIB decisions",
      "Within 24 hours only"
    ],
    optionsNl: [
      "Binnen 6 weken na dagtekening van de beschikking",
      "Binnen 1 heel jaar",
      "Bezwaar maken is wettelijk niet mogelijk",
      "Binnen 24 uur"
    ],
    correctAnswer: 0,
    explanationAr: "المهلة القانونية الرسمية لمعظم القرارات الإدارية والمخالفات في هولندا هي ٦ أسابيع من تاريخ الخطاب المكتوب (Dagtekening). فوات هذه المهلة يسقط حق الطعن.",
    explanationEn: "The standard legal deadline for administrative objections in the Netherlands is 6 weeks from the date of the decision (Dagtekening).",
    explanationNl: "De wettelijke bezwaartermijn voor bestuursrechtelijke besluiten in Nederland bedraagt 6 weken na dagtekening.",
  },
  {
    id: 5,
    questionAr: "ما هو العمر الإلزامي للتعليم المدرسي (Leerplicht) لجميع الأطفال المقيمين في هولندا؟",
    questionEn: "What is the compulsory school age (Leerplicht) for children living in the Netherlands?",
    questionNl: "Vanaf welke leeftijd geldt de leerplicht voor kinderen in Nederland?",
    optionsAr: [
      "من سن ٥ سنوات حتى سن ١٦ سنة (وحتى ١٨ سنة بدون مؤهل أساسي)",
      "من سن ٧ سنوات فقط",
      "التعليم اختياري وليس إلزامياً",
      "من سن ١٠ سنوات"
    ],
    optionsEn: [
      "From age 5 until 16 (and up to 18 without a basic qualification)",
      "From age 7 only",
      "Schooling is optional and not mandatory",
      "From age 10"
    ],
    optionsNl: [
      "Van 5 tot 16 jaar (en tot 18 jaar zonder startkwalificatie)",
      "Pas vanaf 7 jaar",
      "Onderwijs is vrijwillig",
      "Vanaf 10 jaar"
    ],
    correctAnswer: 0,
    explanationAr: "يبدأ إلزام التعليم قانونياً في اليوم الأول من الشهر التالي لبلوغ الطفل سن الخامسة، وتتحمل الأسرة مسؤولية قانونية إذا تغيب الطفل دون عذر طبي معتمد.",
    explanationEn: "Compulsory education begins at age 5 and continues until 16 (or 18 if no start qualification is attained). Unauthorized absence leads to legal fines.",
    explanationNl: "De leerplicht begint op de eerste dag van de maand nadat het kind 5 jaar is geworden.",
  },
];

export default function InburgeringQuizPage() {
  const locale = useLocale() as "ar" | "en" | "nl";
  const isAr = locale === "ar";
  const isNl = locale === "nl";

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const currentQ = QUESTIONS[currentIndex];

  const handleSelect = (idx: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    if (idx === currentQ.correctAnswer) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setQuizFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setQuizFinished(false);
  };

  const dir = isAr ? "rtl" : "ltr";

  return (
    <div dir={dir} className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Navigation */}
        <div>
          <Link
            href={`/${locale}/courses`}
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            {isAr ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
            <span>{isAr ? "العودة إلى الدورات والاندماج" : isNl ? "Terug naar Cursussen" : "Back to Courses"}</span>
          </Link>
        </div>

        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold px-4 py-1.5 rounded-full border border-blue-500/20">
            <Sparkles className="w-3.5 h-3.5" />
            <span>
              {isAr ? "محاكي امتحان معرفة المجتمع الهولندي (KNM)" : isNl ? "KNM Oefenexamen Simulator" : "KNM Dutch Integration Simulator"}
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            {isAr ? "اختبر معلوماتك في الاندماج الهولندي" : isNl ? "Test uw kennis van de Nederlandse maatschappij" : "Test Your Dutch Integration Knowledge"}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm max-w-xl mx-auto">
            {isAr
              ? "نماذج أسئلة واقعية مستمدة من امتحانات الـ Inburgering الرسمية مع شروحات فورية بالعربية لتأهيلك للنجاح من المرة الأولى."
              : isNl
              ? "Representatieve oefenexamens voor KNM met directe toelichting en feedback."
              : "Realistic practice questions with instant explanations to prepare you for the official Dutch KNM exam."}
          </p>
        </div>

        {!quizFinished ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 md:p-8 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-bold text-slate-500">
                <span>
                  {isAr ? "السؤال" : "Vraag"} {isAr ? formatLocalizedDigits(currentIndex + 1, "ar") : currentIndex + 1} {isAr ? "من" : "van"} {isAr ? formatLocalizedDigits(QUESTIONS.length, "ar") : QUESTIONS.length}
                </span>
                <span className="text-emerald-600">
                  {isAr ? "النتيجة:" : "Score:"} {isAr ? formatLocalizedDigits(score, "ar") : score}
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-600 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question Text */}
            <div className="space-y-2">
              <h2 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-snug">
                {isAr ? currentQ.questionAr : isNl ? currentQ.questionNl : currentQ.questionEn}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3">
              {(isAr ? currentQ.optionsAr : isNl ? currentQ.optionsNl : currentQ.optionsEn).map((opt, idx) => {
                const isCorrect = idx === currentQ.correctAnswer;
                const isSelected = selectedOption === idx;

                let btnStyle = "border-slate-200 dark:border-slate-800 hover:border-blue-400 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-200";
                if (showExplanation) {
                  if (isCorrect) {
                    btnStyle = "border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-bold";
                  } else if (isSelected) {
                    btnStyle = "border-red-500 bg-red-50 dark:bg-red-950/40 text-red-900 dark:text-red-200 font-bold";
                  } else {
                    btnStyle = "opacity-50 border-slate-200 dark:border-slate-800";
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={showExplanation}
                    onClick={() => handleSelect(idx)}
                    className={`w-full p-4 rounded-2xl border text-start text-xs md:text-sm transition-all flex items-start gap-3 cursor-pointer ${btnStyle}`}
                  >
                    <span className="w-6 h-6 rounded-full border flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {showExplanation && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />}
                    {showExplanation && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation Box */}
            {showExplanation && (
              <div className="bg-blue-50/70 dark:bg-blue-950/30 p-5 rounded-2xl border border-blue-200/60 dark:border-blue-900/40 space-y-2 animate-in fade-in duration-300">
                <div className="flex items-center gap-2 text-blue-900 dark:text-blue-300 text-xs font-black uppercase">
                  <BookOpen className="w-4 h-4" />
                  <span>{isAr ? "الشرح القانوني والثقافي الهولندي:" : isNl ? "Uitleg:" : "Official Context:"}</span>
                </div>
                <p className="text-xs md:text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                  {isAr ? currentQ.explanationAr : isNl ? currentQ.explanationNl : currentQ.explanationEn}
                </p>
              </div>
            )}

            {/* Next Button */}
            {showExplanation && (
              <div className="pt-2 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs md:text-sm rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
                >
                  <span>
                    {currentIndex < QUESTIONS.length - 1 
                      ? (isAr ? "السؤال التالي" : isNl ? "Volgende vraag" : "Next Question")
                      : (isAr ? "عرض النتيجة النهائية" : isNl ? "Bekijk eindresultaat" : "View Final Score")}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Final Score Card */
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-300">
            <div className="w-20 h-20 bg-amber-100 dark:bg-amber-950/60 text-amber-600 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
                {score >= 4 
                  ? (isAr ? "مبروك! لقد اجتزت الامتحان بنجاح 🎓" : isNl ? "Gefeliciteerd! U bent geslaagd 🎓" : "Congratulations! You Passed 🎓")
                  : (isAr ? "تحتاج إلى مزيد من المراجعة والتدريب 📚" : isNl ? "Nog even oefenen voor een optimaal resultaat 📚" : "Needs More Practice 📚")}
              </h2>
              <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400">
                {isAr ? "أجبت بشكل صحيح على" : "You answered correctly"} {isAr ? formatLocalizedDigits(score, "ar") : score} {isAr ? "من أصل" : "out of"} {isAr ? formatLocalizedDigits(QUESTIONS.length, "ar") : QUESTIONS.length} {isAr ? "أسئلة" : "questions"}.
              </p>
            </div>

            <div className="inline-block p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border text-slate-900 dark:text-white font-mono text-2xl font-black" dir="ltr">
              {Math.round((score / QUESTIONS.length) * 100)}%
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-4">
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow flex items-center gap-2 transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{isAr ? "إعادة الاختبار من جديد" : isNl ? "Opnieuw proberen" : "Try Again"}</span>
              </button>

              <a
                href={`/${locale}/courses`}
                className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center gap-2"
              >
                <span>{isAr ? "العودة لدورات الاندماج" : isNl ? "Terug naar cursussen" : "Back to Courses"}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
