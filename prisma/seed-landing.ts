import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const pages = [
  {
    title: "حملة التبرعات لشتاء 2026",
    slug: "winter-aid-2026",
    subtitle: "ساهم في تدفئة آلاف العائلات السورية هذا الشتاء",
    heroHeadline: "شتاء دافئ لأهلنا",
    heroSubheadline: "حملة التبرعات الشتوية للعائلات المحتاجة في سوريا ولبنان",
    heroImage: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&h=600",
    content: "<h2>عن الحملة</h2><p>نطلق حملتنا السنوية لجمع التبرعات لتوفير المدافئ والبطانيات والملابس الشتوية للعائلات المحتاجة في المخيمات والتجمعات السورية.</p><h2>أين تذهب تبرعاتك</h2><p>جميع التبرعات تذهب مباشرة لشراء المساعدات العينية وتوزيعها عبر فرقنا الميدانية في سوريا ولبنان.</p>",
    ctaText: "تبرع الآن",
    ctaLink: "/contact",
    features: JSON.stringify([
      { title: "شفافية كاملة", description: "تقرير مفصل بجميع التبرعات والمشتريات", icon: "📋" },
      { title: "توزيع ميداني", description: "فرق متطوعة توزع المساعدات مباشرة", icon: "🤝" },
      { title: "تأثير مباشر", description: "كل تبرع يصل إلى مستحقيه دون وسيط", icon: "❤️" },
    ]),
    themeColor: "#dc2626",
    metaTitle: "حملة التبرعات الشتوية 2026 - الجالية السورية في هولندا",
    metaDescription: "شارك في حملة التبرعات الشتوية للجالية السورية، تبرعك يدفئ عائلة هذا الشتاء",
    published: true,
  },
  {
    title: "التسجيل في دورات اللغة الهولندية",
    slug: "dutch-courses",
    subtitle: "دورات مجانية عبر الإنترنت لأبناء الجالية",
    heroHeadline: "تعلّم الهولندية مجاناً",
    heroSubheadline: "دورات معتمدة للمبتدئين والمتقدمين مع مدرسين متخصصين",
    content: "<h2>عن الدورة</h2><p>نقدم دورة شاملة للغة الهولندية من المستوى A1 إلى B2، مع تركيز على المحادثة اليومية والاندماج في المجتمع الهولندي.</p><h2>مميزات الدورة</h2><ul><li>مدرسون معتمدون</li><li>شهادة حضور معتمدة</li><li>جلسات تفاعلية</li><li>مواد دراسية مجانية</li></ul>",
    ctaText: "سجّل الآن",
    ctaLink: "/volunteer",
    features: JSON.stringify([
      { title: "مدرسون متخصصون", description: "خبراء في تدريس الهولندية كلغة ثانية", icon: "👨‍🏫" },
      { title: "مرونة في المواعيد", description: "دورات صباحية ومسائية تناسب الجميع", icon: "⏰" },
      { title: "مجانية بالكامل", description: "جميع المواد والدروس مجانية لأبناء الجالية", icon: "🎓" },
    ]),
    themeColor: "#2563eb",
    metaTitle: "دورات لغة هولندية مجانية - الجالية السورية",
    metaDescription: "دورات لغة هولندية مجانية عبر الإنترنت لأبناء الجالية السورية في هولندا",
    published: true,
  },
  {
    title: "مبادرة الإرشاد الوظيفي",
    slug: "career-mentorship",
    subtitle: "مساعدة السوريين في هولندا لبناء مسيرتهم المهنية",
    heroHeadline: "نبني مستقبلك معاً",
    heroSubheadline: "إرشاد مهني مجاني للباحثين عن عمل من أبناء الجالية",
    content: "<h2>نبذة عن المبادرة</h2><p>مبادرة تهدف إلى ربط الباحثين عن عمل مع مرشدين مهنيين من ذوي الخبرة في مختلف المجالات لتقديم النصح والإرشاد.</p><h2>كيف تعمل</h2><p>نسجّلك مع مرشد مهني حسب مجالك، وتلتقي به افتراضياً مرة أسبوعياً لمدة شهر.</p>",
    ctaText: "سجّل كمتدرب",
    ctaLink: "/volunteer",
    features: JSON.stringify([
      { title: "مرشدون بخبرة", description: "محترفون في مختلف المجالات", icon: "💼" },
      { title: "جلسات فردية", description: "متابعة شخصية أسبوعية", icon: "🎯" },
      { title: "بناء شبكة علاقات", description: "فرصة للتواصل مع محترفين", icon: "🤝" },
    ]),
    themeColor: "#059669",
    metaTitle: "الإرشاد الوظيفي للجالية السورية",
    metaDescription: "مبادرة إرشاد مهني مجانية لأبناء الجالية السورية في هولندا",
    published: true,
  },
];

async function main() {
  for (const page of pages) {
    const existing = await prisma.landingPage.findUnique({ where: { slug: page.slug } });
    if (!existing) {
      await prisma.landingPage.create({ data: page });
      console.log(`✓ Created: ${page.title}`);
    } else {
      console.log(`- Exists: ${page.title}`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
