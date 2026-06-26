import "dotenv/config"
import { prisma } from "../src/lib/db"

const INITIAL_FAQS = [
  {
    questionAr: "كيف يمكنني الانضمام للجالية السورية في هولندا؟",
    questionNl: "Hoe kan ik lid worden van de Syrische gemeenschap in Nederland?",
    questionEn: "How can I join the Syrian community in the Netherlands?",
    answerAr: "يمكنك الانضمام عن طريق تعبئة نموذج طلب الانتساب في قسم 'حسابي' بعد إنشاء حساب على الموقع.",
    answerNl: "U kunt lid worden door het aanmeldingsformulier in te vullen in de sectie 'Mijn account' nadat u een account op de website heeft aangemaakt.",
    answerEn: "You can join by filling out the membership application form in the 'My Account' section after creating an account on the website.",
    category: "general",
    tags: "انضمام,انتساب,عضوية",
  },
  {
    questionAr: "ما هي شروط الحصول على سكن اجتماعي في هولندا؟",
    questionNl: "Wat zijn de voorwaarden voor sociale huurwoningen in Nederland?",
    questionEn: "What are the conditions for social housing in the Netherlands?",
    answerAr: "تعتمد الشروط على الدخل السنوي (يجب أن يكون أقل من حد معين) ومدة التسجيل في مواقع مثل WoningNet.",
    answerNl: "De voorwaarden hangen af van het jaarinkomen (moet onder een bepaalde grens liggen) en de inschrijfduur op websites zoals WoningNet.",
    answerEn: "The conditions depend on annual income (must be below a certain limit) and registration time on websites like WoningNet.",
    category: "employment",
    tags: "سكن,سكن اجتماعي,WoningNet",
  },
  {
    questionAr: "كيف يتم تقييم الشهادات السورية في هولندا؟",
    questionNl: "Hoe worden Syrische diploma's gewaardeerd in Nederland?",
    questionEn: "How are Syrian degrees evaluated in the Netherlands?",
    answerAr: "يتم تقييم الشهادات عبر مؤسسة IDW (Internationale Diplomawaardering) لمقارنتها بالنظام التعليمي الهولندي.",
    answerNl: "Diploma's worden gewaardeerd via de IDW (Internationale Diplomawaardering) om ze te vergelijken met het Nederlandse onderwijssysteem.",
    answerEn: "Degrees are evaluated through the IDW (Internationale Diplomawaardering) to compare them with the Dutch educational system.",
    category: "integration",
    tags: "شهادات,تعليم,IDW,تعديل",
  },
  {
    questionAr: "كم تستغرق إجراءات لم الشمل عادةً؟",
    questionNl: "Hoe lang duurt de procedure voor gezinshereniging gewoonlijk?",
    questionEn: "How long does the family reunification procedure usually take?",
    answerAr: "تتراوح المدة عادة بين 6 إلى 15 شهراً، وتعتمد على ضغط العمل لدى الـ IND واكتمال المستندات.",
    answerNl: "De duur varieert meestal tussen 6 en 15 maanden, afhankelijk van de werkdruk bij de IND en de volledigheid van de documenten.",
    answerEn: "The duration usually ranges between 6 to 15 months, depending on the workload at the IND and the completeness of the documents.",
    category: "legal",
    tags: "لم شمل,IND,لجوء",
  }
];

async function main() {
  console.log("🌱 بدء بذر الأسئلة الشائعة (FAQs)...");

  for (const faq of INITIAL_FAQS) {
    await prisma.fAQ.upsert({
      where: {
        // Simple heuristic: unique by Arabic question
        id: faq.questionAr.substring(0, 10), // This is risky but since we don't have unique constraint on question yet
      },
      update: faq,
      create: faq,
    }).catch(async () => {
      // Fallback if ID exists or other error
      await prisma.fAQ.create({ data: faq });
    });
  }

  console.log(`✅ تم إضافة/تحديث ${INITIAL_FAQS.length} سؤال شائع.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
