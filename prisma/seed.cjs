const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@sy-nl.org" },
    update: {},
    create: {
      name: "الإدارة",
      email: "admin@sy-nl.org",
      password: adminPassword,
      role: "admin",
    },
  });

  const memberPassword = await bcrypt.hash("member123", 12);
  await prisma.user.upsert({
    where: { email: "member@sy-nl.org" },
    update: {},
    create: {
      name: "عضو الجالية",
      email: "member@sy-nl.org",
      password: memberPassword,
      role: "member",
    },
  });

  console.log("Users created: admin@sy-nl.org / admin123");

  // Delete existing posts
  await prisma.post.deleteMany();

  // Create sample news articles
  const posts = [
    {
      title: `اجتماع الجالية مع بلدية أمستردام: خطوات جديدة لدعم الاندماج`,
      slug: "social-amsterdam-2026",
      content: `عقد وفد من الجالية السورية في هولندا اجتماعاً موسعاً مع مسؤولي بلدية أمستردام، ناقش خلاله سبل تحسين خدمات الإسكان والإقامة لأبناء الجالية. 

إنشاء مكتب استشارات قانونية مجاني لأبناء الجالية.
توفير دورات لغة هولندية مكثفة.

وأكد رئيس الجالية على أهمية التعاون مع المؤسسات الهولندية لخدمة أبناء الجالية وتسهيل إجراءات لم شمل العائلات.`,
      excerpt: `ناقش وفد من الجالية السورية مع مسؤولي بلدية أمستردام سبل تحسين خدمات الإسكان والإقامة.`,
      image: "https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=800&h=450",
      category: "أخبار الجالية",
      tags: "أمستردام,اندماج,إقامة",
      source: "الجالية السورية في هولندا",
      featured: true,
      authorId: admin.id,
    },
    {
      title: "افتتاح معرض التراث السوري في روتردام بمشاركة واسعة",
      slug: "syrian-heritage-rotterdam",
      content: "شهد معرض التراث السوري في مدينة روتردام إقبالاً كبيراً من الزوار الهولنديين والعرب، حيث ضم أكثر من 200 قطعة تراثية تعكس تاريخ سوريا الحضاري.\n\nوتضمن المعرض أقساماً متعددة:\n- الحرف اليدوية التقليدية\n- الأزياء الشعبية السورية\n- المطبخ السوري التقليدي\n- الموسيقى والتراث الشفوي\n\nوأعرب المنظمون عن سعادتهم بالإقبال الكبير الذي يعكس اهتمام المجتمع الهولندي بالثقافة السورية.",
      excerpt: "شهد معرض التراث السوري في روتردام إقبالاً كبيراً من الزوار الهولنديين والعرب.",
      image: "https://images.unsplash.com/photo-1561214115-f2f134cc4912?auto=format&fit=crop&w=800&h=450",
      category: "ثقافة وفن",
      tags: "تراث,معرض,روتردام",
      source: "الجالية السورية في هولندا",
      featured: true,
      authorId: admin.id,
    },
    {
      title: "دورات اللغة الهولندية المجانية: فرصة ذهبية لأبناء الجالية",
      slug: "free-dutch-courses",
      content: "تطلق الجالية السورية بالتعاون مع مؤسسة تعليمية هولندية دورة جديدة لتعلم اللغة الهولندية. الدورة مجانية تماماً ومتاحة للجميع.\n\nمعلومات الدورة:\n- المدة: 3 أشهر\n- المستويات: مبتدئ إلى متوسط\n- أيام الدراسة: السبت والأحد\n- الموقع: أمستردام\n- التسجيل: متاح الآن\n\nللتسجيل يرجى التواصل عبر البريد الإلكتروني أو حضور مقر الجالية.",
      excerpt: "تطلق الجالية بالتعاون مع مؤسسة تعليمية هولندية دورة جديدة لتعلم اللغة الهولندية.",
      image: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=800&h=450",
      category: "خدمات",
      tags: "لغة هولندية,دورات مجانية,تعليم",
      source: "الجالية السورية في هولندا",
      featured: true,
      authorId: admin.id,
    },
    {
      title: "حملة تبرعات لإغاثة المتضررين من الزلزال في سوريا",
      slug: "earthquake-relief-campaign",
      content: "أطلقت الجالية السورية حملة تبرعات عاجلة لإرسال المساعدات الإنسانية إلى المناطق المتضررة من الزلزال في سوريا.\n\nطرق التبرع:\n- التحويل البنكي: رقم الحساب متاح على موقع الجالية\n- التبرع العيني: استقبال الملابس والبطانيات في مقر الجالية\n- التبرع عبر الإنترنت: من خلال صفحة الحملة\n\nنسأل الله أن يجزي كل من يساهم في تخفيف معاناة المتضررين خير الجزاء.",
      excerpt: "أطلقت الجالية حملة تبرعات عاجلة لإرسال المساعدات الإنسانية إلى المناطق المتضررة.",
      image: "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=800&h=450",
      category: "عمل إنساني",
      tags: "زلزال,إغاثة,تبرعات",
      source: "الجالية السورية في هولندا",
      featured: true,
      authorId: admin.id,
    },
    {
      title: "ندوة حول حقوق اللاجئين في القانون الهولندي",
      slug: "refugee-rights-seminar",
      content: "نظمت الجالية السورية ندوة قانونية حول حقوق اللاجئين في القانون الهولندي، قدمها نخبة من المحامين والمستشارين القانونيين.\n\nتناولت الندوة:\n- حقوق وواجبات اللاجئين\n- إجراءات التقديم على الإقامة الدائمة\n- حقوق العمال اللاجئين\n- كيفية الحصول على الجنسية الهولندية\n\nحضر الندوة أكثر من 150 شخصاً من أبناء الجالية.",
      excerpt: "ندوة قانونية حول حقوق اللاجئين في القانون الهولندي مع نخبة من المحامين.",
      image: "https://images.unsplash.com/photo-1577962917302-c3a32d0e0e12?auto=format&fit=crop&w=800&h=450",
      category: "أخبار الجالية",
      tags: "حقوق,لاجئين,قانون",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
    {
      title: "فريق الجالية لكرة القدم يحقق فوزاً في الدوري المحلي",
      slug: "football-team-wins",
      content: "حقق فريق الجالية السورية لكرة القدم فوزاً مهماً في الدوري المحلي للهواة بنتيجة 3-1.\n\nسجل أهداف الفريق:\n- محمد الحسن (هدفين)\n- عمر الخطيب (هدف)\n\nويضم الفريق نخبة من اللاعبين السوريين الموهوبين، ويسعى للمنافسة على لقب الدوري هذا الموسم.",
      excerpt: "فريق الجالية لكرة القدم يحقق فوزاً في الدوري المحلي.",
      image: "https://images.unsplash.com/photo-1517466787929-bc90951d0974?auto=format&fit=crop&w=800&h=450",
      category: "رياضة",
      tags: "كرة قدم,رياضة,دوري",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
    {
      title: "ورشة عمل لريادة الأعمال للشباب السوري",
      slug: "entrepreneurship-workshop",
      content: "أقامت الجالية السورية ورشة عمل مكثفة في ريادة الأعمال للشباب السوري الطموح.\n\nتضمنت الورشة:\n- أساسيات إنشاء المشاريع الصغيرة\n- كيفية كتابة خطة عمل\n- التمويل المتاح للاجئين\n- التجارة الإلكترونية والتسويق الرقمي\n\nقدم الورشة خبراء في مجال ريادة الأعمال من الجالية.",
      excerpt: "ورشة عمل لريادة الأعمال للشباب السوري مع خبراء في المجال.",
      image: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=800&h=450",
      category: "اقتصاد وأعمال",
      tags: "ريادة أعمال,شباب,تدريب",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
    {
      title: "الجالية تهنئ بمناسبة عيد الفطر المبارك",
      slug: "eid-al-fitr-greetings",
      content: "تتقدم الجالية السورية في هولندا بأحر التهاني والتبريكات بمناسبة عيد الفطر المبارك، سائلين المولى عز وجل أن يعيده على الجميع بالخير واليمن والبركات.\n\nوبهذه المناسبة السعيدة، تنظم الجالية احتفالية كبرى في مدينة لاهاي تشمل:\n- صلاة العيد\n- مأدبة إفطار جماعي\n- فعاليات ترفيهية للأطفال\n- عروض فنية وثقافية\n\nالدعوة عامة للجميع.",
      excerpt: "الجالية تهنئ بمناسبة عيد الفطر المبارك وتدعو للاحتفال.",
      image: "https://images.unsplash.com/photo-1582727657635-c771c0d2caaa?auto=format&fit=crop&w=800&h=450",
      category: "أخبار الجالية",
      tags: "عيد الفطر,احتفال,مناسبة",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
    {
      title: "دورة تدريبية في البرمجة للشباب السوري",
      slug: "coding-course-youth",
      content: "تعلن الجالية السورية عن تنظيم دورة تدريبية في أساسيات البرمجة وتطوير الويب للشباب السوري من عمر 15-25 سنة.\n\nمعلومات الدورة:\n- لغة البرمجة: JavaScript\n- المدة: 8 أسابيع\n- الشهادة: شهادة معتمدة بنهاية الدورة\n- الرسوم: مجانية بالكامل\n- المقاعد محدودة (20 متدرباً فقط)\n\nللتسجيل، يرجى ملء النموذج على موقع الجالية.",
      excerpt: "دورة تدريبية مجانية في البرمجة للشباب السوري مع شهادة معتمدة.",
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=800&h=450",
      category: "تكنولوجيا",
      tags: "برمجة,تدريب,شباب",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
    {
      title: "مبادرة زراعية: السوريون في هولندا يزرعون الأمل",
      slug: "agricultural-initiative",
      content: "أطلق مجموعة من شباب الجالية السورية مبادرة زراعية تهدف إلى استصلاح الأراضي الزراعية في المناطق الريفية الهولندية.\n\nالمبادرة تهدف إلى:\n- توفير فرص عمل لأبناء الجالية\n- تعزيز الاستدامة البيئية\n- إنتاج محاصيل سورية في هولندا\n- تبادل الخبرات الزراعية\n\nوتأتي هذه المبادرة ضمن جهود الجالية لتعزيز الاندماج الاقتصادي.",
      excerpt: "مبادرة زراعية لشباب الجالية السورية تهدف لاستصلاح الأراضي في هولندا.",
      image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&h=450",
      category: "أخبار هولندا",
      tags: "زراعة,بيئة,مبادرة",
      source: "الجالية السورية في هولندا",
      featured: false,
      authorId: admin.id,
    },
  ];

  for (const post of posts) {
    await prisma.post.create({ data: post });
  }

  console.log(`${posts.length} articles created`);

  await prisma.task.deleteMany();
  const tasks = [
    { title: "تنظيم فعالية عيد الفطر", description: "تجهيز القاعة والبرنامج", priority: "high", createdBy: admin.id },
    { title: "تحديث قاعدة بيانات الأعضاء", description: "مراجعة وتحديث معلومات الأعضاء", priority: "medium", createdBy: admin.id },
    { title: "التواصل مع بلدية أمستردام", description: "متابعة نتائج الاجتماع", priority: "high", createdBy: admin.id },
    { title: "إعداد التقرير الشهري", description: "تقرير أنشطة الجالية لشهر مايو", priority: "medium", createdBy: admin.id },
    { title: "تنظيف مقر الجالية", description: "حملة نظافة للمقر الرئيسي", priority: "low", createdBy: admin.id },
  ];
  for (const task of tasks) {
    await prisma.task.create({ data: task });
  }
  console.log(`${tasks.length} tasks created`);

  await prisma.contact.deleteMany();
  const contacts = [
    { name: "أحمد محمد", email: "ahmed@example.com", subject: "استفسار عن دورات اللغة", message: "السلام عليكم، أرغب في التسجيل بدورات اللغة الهولندية. هل هناك أماكن متاحة؟", read: false },
    { name: "سارة خالد", email: "sara@example.com", subject: "اقتراح فعالية", message: "أقترح تنظيم معرض للصور الفوتوغرافية عن سوريا. لدي مجموعة من الصور وأرغب في المشاركة.", read: false },
    { name: "خالد عمر", email: "khaled@example.com", subject: "طلب تطوع", message: "أرغب في التطوع مع الجالية. لدي خبرة في التنظيم وإدارة الفعاليات.", read: true },
  ];
  for (const contact of contacts) {
    await prisma.contact.create({ data: contact });
  }
  console.log(`${contacts.length} contact messages created`);

  // Seed default roles
  const roleDefaults = {
    admin: ["news.create","news.edit","news.delete","news.publish","news.feature","events.create","events.edit","events.delete","events.publish","tasks.create","tasks.edit","tasks.delete","tasks.assign","comments.approve","comments.delete","comments.manage","ads.create","ads.edit","ads.delete","surveys.create","surveys.edit","surveys.delete","surveys.view_results","media.upload","media.delete","pages.create","pages.edit","pages.delete","pages.publish","users.view","users.edit_role","users.delete","settings.view","settings.edit","roles.manage","volunteers.view","volunteers.manage","subscribers.view","subscribers.export","landing.create","landing.edit","landing.delete","landing.publish"],
    editor: ["news.create","news.edit","news.publish","news.feature","events.create","events.edit","events.publish","tasks.create","tasks.edit","tasks.assign","comments.approve","media.upload","media.delete","pages.create","pages.edit","pages.publish","volunteers.view","subscribers.view","landing.publish"],
    moderator: ["comments.approve","comments.delete","comments.manage","news.edit","events.edit","volunteers.view"],
    contributor: ["news.create","news.edit","events.create","events.edit"],
    member: [],
  };

  for (const [name, perms] of Object.entries(roleDefaults)) {
    await prisma.role.upsert({
      where: { name },
      update: { permissions: JSON.stringify(perms) },
      create: { name, description: getRoleDesc(name), permissions: JSON.stringify(perms), isSystem: true },
    });
  }
  console.log(`5 default roles seeded`);

  // Seed board members — 23 عضواً بالبيانات الحقيقية الكاملة
  await prisma.boardMember.deleteMany();
  await prisma.boardMember.createMany({
    data: [
      {
        nameAr: "عبد المنعم الشامان",
        nameEn: "Abdul Munim Al Chaman",
        image: "https://iyshpeyqzoec7ecx.public.blob.vercel-storage.com/board/uploaded/chairman.png",
        titleAr: "رئيس مجلس الإدارة",
        titleEn: "Chairman of the Board",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مجلس الإدارة", "لجنة الترخيص"]),
        bioPoints: JSON.stringify([
          "قنصل فخري سابق لسوريا في هولندا 1993 - 2014، يتمتع بخبرة واسعة في الدبلوماسية والأعمال والقيادة المجتمعية.",
          "مؤسس ورئيس تنفيذي لمجموعة مراقبة جودة الحلال (HQC) أكبر شركة إصدار الجودة والحلال في العالم، ومقيم في هولندا منذ 45 سنة.",
          "راعي ومساهم في العديد من المبادرات المجتمعية لأبناء الجالية السورية في هولندا وفي الداخل السوري."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "صالح المحمد حنايا",
        nameEn: "Saleh Al Mohamad",
        image: "/images/board/saleh.svg",
        titleAr: "نائب رئيس مجلس الإدارة",
        titleEn: "Vice Chairman of the Board",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مجلس الإدارة", "لجنة الترخيص"]),
        bioPoints: JSON.stringify([
          "كاتب وشاعر سوري مقيم في لاهاي، ناشط سياسي وثوري قام بتنظيم العديد من الفعاليات الثورية في أوروبا.",
          "عمل في المنظمات التطوعية التي تساعد اللاجئين في هولندا ولبنان والشمال السوري، وهو عضو مؤسس لمنظمة Saru لمساعدة النساء والأطفال.",
          "عمل في الصحافة الأدبية كرئيس تحرير مجلة الرافد السورية ثم مدير القسم الثقافي، وهو عضو اتحاد الكتاب الأحرار."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "خالد فيصل الطويل",
        nameEn: "Khaled Faisal Altawil",
        image: "https://iyshpeyqzoec7ecx.public.blob.vercel-storage.com/board/uploaded/secretary.png",
        titleAr: "الأمين العام للجالية",
        titleEn: "Secretary General",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["الأمانة العامة", "مكتب التنظيم", "المكتب المالي"]),
        bioPoints: JSON.stringify([
          "ناشط سياسي وثوري مقيم في هولندا منذ 2014، وانشق سابقاً عن عمله في وزارة الداخلية كرئيس قسم معلوماتية بعد استدعاءات أمنية متكررة.",
          "يحمل شهادة بكالوريوس في تكنولوجيا المعلومات BIT وكان مشروع تخرجه رائداً للحفاظ على اللغة الآرامية السريانية كتراث سوري أصيل.",
          "شاعر ومهتم باللغة العربية، وكان من الرواد في تأسيس أوائل مدارس اللغة العربية في هولندا للحفاظ على الهوية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "نهاد سويد",
        nameEn: "Nehad Sowid",
        image: "/images/board/nehad.svg",
        titleAr: "عضو مجلس إدارة (مسؤول شؤون العلاقات العامة)",
        titleEn: "Board Member (Public Relations Officer)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مكتب العلاقات العامة", "لجنة منظمات المجتمع المدني"]),
        bioPoints: JSON.stringify([
          "درس في كلية العلوم السياسية اختصاص علاقات دولية، وشغل سابقاً منصب مدير مكتب استشارات قانونية في مدينة حماة بسوريا.",
          "عمل مديراً لمكتب العلاقات في الجالية السورية، كما عمل في الشأن القانوني لطلبات لم الشمل ضمن منظمة VWN الهولندية.",
          "يشغل حالياً منصب رئيس مجلس إدارة جمعية المثقفين السوريين في سوريا ومقرها في مدينة حماة."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد مصطفى سمهاني",
        nameEn: "Mohammad Semhani",
        image: "/images/board/samhani.svg",
        titleAr: "عضو مجلس إدارة (مسؤول مشترك لشؤون العلاقات الدولية)",
        titleEn: "Board Member (Joint International Relations Officer)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مكتب العلاقات الدولية", "لجنة الجاليات"]),
        bioPoints: JSON.stringify([
          "ناشط سياسي وداعم للثورة السورية في الداخل وفي بلدان الاغتراب، وهو من أبناء جبل الأكراد بمحافظة اللاذقية.",
          "درس ثلاث سنوات في كلية الحقوق بجامعة حلب وتم اعتقاله وفصله من الجامعة بسبب نشاطه السياسي عام 2005.",
          "يعمل في مجال إدارة الأعمال وهو مستشار شركات في صناعة العطور في فرنسا، ومؤسس شركة Dutchperfume في لاهاي وحائز على أفضل رجل أعمال ناشئ في هولندا عام 2022."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "رائد دهموش المشهور",
        nameEn: "Raid Dahmoush",
        image: "/images/board/dahmoush.svg",
        titleAr: "عضو مجلس إدارة (مسؤول شؤون العلاقات الخارجية)",
        titleEn: "Board Member (Foreign Relations Officer)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["مكتب العلاقات الخارجية", "لجنة الارتباط بالوطن الأم"]),
        bioPoints: JSON.stringify([
          "مهندس مدني خريج جامعة حلب، حاصل على ماجستير في الإدارة الهندسية وماجستير في إدارة المشاريع الاحترافية باستخدام الذكاء الاصطناعي وشهادة PMP المعتمدة.",
          "يمتلك خبرة طويلة في قطاع التشييد والاتصالات والعقارات في السعودية والخليج وأوروبا حيث شغل مناصب تنفيذية في شركات كبرى.",
          "يقيم في هولندا منذ عام 2015 ويحمل جنسيتها، وهو مؤسس ورئيس منظمة دار الشرق في هولندا ومصنف كسياسي سوري وثوري وطني."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمود الناصر",
        nameEn: "Mahmoud AlNaser",
        image: "/images/board/naser.svg",
        titleAr: "عضو مجلس إدارة (مسؤول مشترك لشؤون العلاقات الدولية)",
        titleEn: "Board Member (Joint International Relations Officer)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["مكتب العلاقات الدولية", "لجنة الجاليات"]),
        bioPoints: JSON.stringify([
          "ناشط سياسي من محافظة الحسكة مقيم في مدينة لاهاي منذ سبع سنوات وهو طالب في جامعة لاهاي حالياً.",
          "عضو في لوبي الناشطين السياسيين الشباب الأجانب، وقائد الحملة الانتخابية لحزب العمل الهولندي (PvdA) في لاهاي، وعضو مجلس إدارة وطني سابق لدى الاشتراكيين الشباب في الحزب.",
          "ساهم في إيصال صوت الشعب السوري لسياسيين هولنديين وأوروبيين، وشارك في لقاء داخل البرلمان الأوروبي لحمل مطالب رفع العقوبات ودعم الاستقرار."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "هدى الحلاق",
        nameEn: "Huda Alhallak",
        image: "/images/board/huda.svg",
        titleAr: "عضو مجلس إدارة (مديرة المكتب الإعلامي)",
        titleEn: "Board Member (Director of Media Office)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["المكتب الإعلامي", "لجنة الموقع الإلكتروني وصفحات التواصل"]),
        bioPoints: JSON.stringify([
          "إعلامية وممثلة سورية تمتلك خبرة تتجاوز 15 عاماً في مجالي الإعلام والفن بين سوريا ومصر وهولندا وأوروبا كمحررة ومقدمة أخبار وبرامج.",
          "نشرت مقالات وتحقيقات باللغتين العربية والهولندية تناولت فيها قصص معتقلين وناجين وقضايا الاندماج والهوية في مجتمعات اللجوء.",
          "ممثلة ومديرة لمنظمة ثقافية سورية هولندية (Fada Theatre) قدمت أكثر من 120 عرضاً مسرحياً تناولت قضايا الاستبداد والاعتقال والتهجير."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد عمر النويلاتي",
        nameEn: "Omar Al Nwilati",
        image: "/images/board/omar.svg",
        titleAr: "عضو مجلس إدارة (مسؤول النشاطات)",
        titleEn: "Board Member (Director of Activities)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مكتب النشاطات العامة", "لجنة الأنشطة الفنية والثقافية"]),
        bioPoints: JSON.stringify([
          "من مواليد دمشق 1972، حاصل على دبلوم بالعمارة الداخلية من جامعة رودك البريطانية، وهو مغني وعازف جيتار ومدرب صوت.",
          "عمل في دبي كمدير بشركة تنظيم حفلات ومعارض بشركة Gravity Force Arts Production، ومدرس صوت في أكاديمية فوكس بدبي وفويسيز بالبحرين.",
          "محكم في لجنة التحكيم لجائزة التعليق والأداء الصوتي (Voice Arts Awards) التي تقام بنيويورك."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "حسن الحسن قطيني",
        nameEn: "Hasan Alhasan (Qutaini)",
        image: "/images/board/qutaini.svg",
        titleAr: "عضو مجلس إدارة (مسؤول شؤون رواد الأعمال)",
        titleEn: "Board Member (Director of Entrepreneurs Office)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مكتب رواد الأعمال", "لجنة التشغيل والتدريب المهني"]),
        bioPoints: JSON.stringify([
          "حاصل على بكالوريوس تجارة واقتصاد وماجستير إدارة أعمال وعلاقات دولية، ورخصة تحكيم دولي في النزاعات التجارية من جامعة القاهرة.",
          "مستثمر ورائد أعمال، رئيس مجلس إدارة ومالك مجموعة 'هولنديانا القابضة B.V'، ويمتلك مجموعة عيادات ومستودعات تجارية في هولندا.",
          "شغل منصب رئيس نادي الأعمال السوري في مصر عام 2013، وشارك في مشاريع مختلفة مع وزارتي الخارجية والشؤون الاجتماعية الهولندية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "رابعة الزريقات",
        nameEn: "Rabaa Al-Zreqat",
        image: "/images/board/rabaa.svg",
        titleAr: "عضو مجلس إدارة (مسؤول الشؤون القانونية)",
        titleEn: "Board Member (Legal Affairs Officer)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["مكتب الشؤون القانونية", "لجنة فض النزاعات"]),
        bioPoints: JSON.stringify([
          "تحمل إجازة في الحقوق من جامعة دمشق، ومارست المحاماة لـ 12 عاماً، ونجحت في المسار القضائي لتنضم إلى رابطة القاضيات الدوليات.",
          "شغلت عضوية مجلس إدارة المحامين الأحرار في الأردن، وشاركت في صياغة قوانين لمكافحة الجريمة المنظمة ما بعد الحروب وتأمين وثائق اللاجئين.",
          "من مؤسسي الشبكة السورية القانونية في هولندا المعنية بقضية المفقودين، وعضو الأمانة العامة في جمعية هارلم لتمكين السوريين."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد أكرم الجنيدي",
        nameEn: "Mohamad Akram Aljnidi",
        image: "/images/board/akram.svg",
        titleAr: "عضو مجلس إدارة (مسؤول شؤون الطلاب والتعليم)",
        titleEn: "Board Member (Student & Education Officer)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["مكتب التربية والتعليم", "لجنة الطلاب"]),
        bioPoints: JSON.stringify([
          "رئيس اتحاد طلبة سوريا في هولندا، ومشارك فاعل في الساحة الاجتماعية والسياسية الهولندية لتنظيم الفعاليات الثورية منذ 2021.",
          "حاصل على الثانوية الهولندية Havo، وطالب جامعي حالياً في قسم المحاسبة والرقابة المالية بهولندا.",
          "عمل كمحاسب في شركة تجارة جملة سورية، ويقوم حالياً بالتدرب والعمل في شركة عقارات هولندية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "نبيل حاج حسين",
        nameEn: "Nabil Haj Hussein",
        image: "/images/board/nabil.svg",
        titleAr: "عضو مجلس إدارة (مسؤول مشترك لشؤون الصحة والدعم النفسي)",
        titleEn: "Board Member (Joint Health & Support Officer)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["مكتب الصحة والدعم النفسي", "لجنة الخدمات الطبية"]),
        bioPoints: JSON.stringify([
          "طبيب أسنان سوري يحمل شهادة بكالوريوس في طب الأسنان وجراحتها، ولد في اللاذقية عام 1963 وعمل لسنوات في السعودية.",
          "شغل سابقاً منصب رئيس التجمع الثوري لأهل الساحل السوري، وعضو مؤتمر القوى الوطنية السورية في باريس.",
          "عضو مجلس إدارة الجمعية الطبية السورية الهولندية SNMM وعضو فعال في اللجان الإنسانية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "بلال الرفاعي",
        nameEn: "Belal Alrefai",
        image: "/images/board/belal.svg",
        titleAr: "عضو مجلس إدارة (مسؤول مشترك لشؤون الصحة والدعم النفسي / رئيس مكتب الإعلام تكليفاً)",
        titleEn: "Board Member (Joint Health Officer / Acting Media Head)",
        isFounder: false,
        isLicensing: false,
        committees: JSON.stringify(["مكتب الصحة والدعم النفسي", "المكتب الإعلامي"]),
        bioPoints: JSON.stringify([
          "طبيب اختصاصي جراحة عامة بخبرة تمتد لأكثر من 10 سنوات ويعمل حالياً داخل المنظومة الطبية والمستشفيات في هولندا.",
          "عمل في عدة مناطق حول العالم (أفريقيا وأوروبا) ضمن برامج إنسانية وطبية بالتعاون مع منظمة أطباء بلا حدود والصليب الأحمر.",
          "عمل لمدة سنتين في مؤسسة GGD الهولندية خلال أزمة كورونا لإدارة الحالات وتفعيل بروتوكولات الصحة العامة والتوعية الطبية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "فاتن رحال",
        nameEn: "Faten Rahhal",
        image: "/images/board/faten.svg",
        titleAr: "عضو مجلس إدارة (رئيسة مكتب شؤون المرأة والأسرة)",
        titleEn: "Board Member (Head of Women & Family Office)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مكتب شؤون المرأة والأسرة", "لجنة المرأة والمجتمع"]),
        bioPoints: JSON.stringify([
          "إعلامية سورية خريجة تجارة واقتصاد، وعملت في مجال العلاقات العامة، وحاصلة على شهادة في الدعم النفسي من ألمانيا.",
          "خرجت من سوريا إثر ملاحقات أمنية بعد المساهمة في النشاط الثوري والتنسيقيات، وساهمت في تأسيس منظمات مجتمع مدني بتركيا.",
          "شغلت منصب رئيسة المكتب السياسي للهيئة الوطنية السورية لدورتين، وعضو مجلس إدارة ومن مؤسسي تجمع الملتقى السوري."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "فراس هاني عابدين",
        nameEn: "Feras Abdin",
        image: "/images/board/feras.svg",
        titleAr: "عضو المجلس الاستشاري (رئيس المكتب القانوني)",
        titleEn: "Advisory Council Member (Head of Legal Office)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["المجلس الاستشاري", "لجنة الشؤون القانونية"]),
        bioPoints: JSON.stringify([
          "محامٍ سوري يحمل شهادة الحقوق من جامعة دمشق وماجستير في القانون الدولي من جامعة القاهرة، وحائز على شهادات تحكيم من ألمانيا واليونان.",
          "ناشط وطني ودولي في مجال حقوق الإنسان والعدالة الانتقالية، وعضو مؤسس في شبكة سوريا القانونية في هولندا لتوثيق جرائم الحرب.",
          "عضو مؤسس في منظمة 'بلا قيود' المسؤولة عن توثيق الانتهاكات بحق الناجين والناجيات من المعتقلات السورية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد رائد كعكة",
        nameEn: "Mohamad Raed Kaakeh",
        image: "/images/board/raed.svg",
        titleAr: "رئيس المكتب المالي وعضو المكتب الإعلامي",
        titleEn: "Head of Financial Office & Media Member",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["المكتب المالي", "المكتب الإعلامي"]),
        bioPoints: JSON.stringify([
          "حاصل على بكالوريوس إدارة أعمال من جامعة دبي عام 2005، وشغل مناصب محاسبية ومالية وإدارية في شركات صناعية وتجارية في دول عدة.",
          "صحفي وناشط حقوقي وعضو في جمعية الصحفيين الهولنديين (NVJ) والمنظمة الدولية للصحافة والإعلام في هولندا (IPMO).",
          "محرر أخبار في القسم العربي بموقع NL NEWS، ومترجم فوري وقانوني معتمد للغتين العربية والإنجليزية لدى كتاب العدل الهولنديين."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد ربيع الجنيدي",
        nameEn: "Mohammed Rabe Aljnidi",
        image: "/images/board/rabe.svg",
        titleAr: "عضو المجلس الاستشاري (رئيس لجنة فض النزاعات)",
        titleEn: "Advisory Council Member (Head of Dispute Resolution)",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["المجلس الاستشاري", "لجنة فض النزاعات"]),
        bioPoints: JSON.stringify([
          "حاصل على شهادة الدكتوراه في علوم التحقيق والشريعة الإسلامية، وعمل أستاذاً لفقه الأسرة في جامعة روتردام الإسلامية.",
          "مشرف القسم الأوروبي في كرسي الهدايات القرآنية في جامعة أم القرى بمكة المكرمة، وترأس فريق 'أحرار هولندا' وحتى اليوم.",
          "شغل منصب رئيس الجمعية السورية في مقاطعة فيستلاند بهولندا لمدة ثلاث سنوات في خدمة ومساعدة الإنسان السوري في الاغتراب."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "ماهره الطواشي",
        nameEn: "Mahera Al Tawashi",
        image: "/images/board/mahera.svg",
        titleAr: "عضو المجلس الاستشاري",
        titleEn: "Advisory Council Member",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["المجلس الاستشاري", "أمانة السر"]),
        bioPoints: JSON.stringify([
          "حاصلة على بكالوريوس في الإدارة العامة وإدارة المؤسسات الحكومية وتخصصت في إدارة الأزمات والكوارث من جامعة Avans بهولندا.",
          "تعمل كموظفة حكومية في إحدى المؤسسات الحكومية في هولندا، وتشغل دور الدعم الرئيسي في تأمين السلامة والأمان أثناء الأزمات.",
          "تمتلك خبرة واسعة في تقديم الدعم القانوني في إجراءات اللجوء لدى مصلحة الهجرة والتجنيس الهولندية (IND)."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "وسيم حسان",
        nameEn: "Wassim Hassan",
        image: "/images/board/wassim.svg",
        titleAr: "عضو المجلس الاستشاري",
        titleEn: "Advisory Council Member",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["المجلس الاستشاري", "مكتب العلاقات الخارجية"]),
        bioPoints: JSON.stringify([
          "مهندس استشاري من محافظة السويداء، وهو مدير منظمة دروب ومدير منتدى المواطنة في هولندا.",
          "عمل مستشاراً سياسياً لمؤسس حركة رجال الكرامة في جبل العرب، وهو ناشط في تيار مواطنة والتحالف السوري الديمقراطي.",
          "شارك في حملات المناصرة والمظاهرات المطالبة بالحرية والديمقراطية بالداخل السوري وفي أوروبا لطرح القضية السورية في المنابر."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "يوسف درويش",
        nameEn: "Youssef Darwesh",
        image: "/images/board/youssef.svg",
        titleAr: "عضو لجنة الرقابة الداخلية",
        titleEn: "Internal Audit Committee Member",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["لجنة الرقابة الداخلية", "مكتب شؤون الشباب والتطوع"]),
        bioPoints: JSON.stringify([
          "طالب هندسة طيران في جامعة أمستردام، وينحدر من مدينة حلب ومستقر في هولندا حيث ينشط بشكل واسع في دعم صوت الشباب واللاجئين.",
          "عضو فعّال في المجتمع الهولندي، ويشغل منصب عضو مجلس بلدية 'فيخن' ممثلاً عن حزب العمل الهولندي (PvdA) على المستوى المحلي والوطني.",
          "يشغل حالياً منصب رئيس فرع منظمة UOSSM الطبية في هولندا، وهي منظمة تُعنى بدعم وتطوير القطاع الصحي والإغاثي داخل سوريا."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "ريمه الحربات",
        nameEn: "Rima Alhrbat",
        image: "/images/board/rima.svg",
        titleAr: "عضو المجلس الاستشاري (رئيسة مكتب المرأة والأسرة تكليفاً)",
        titleEn: "Advisory Council Member (Acting Head of Women Office)",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["المجلس الاستشاري", "مكتب شؤون المرأة والأسرة"]),
        bioPoints: JSON.stringify([
          "باحثة أكاديمية تحمل شهادة الدكتوراه في التربية وعلم النفس، وماجستير التخطيط للتنمية، ودبلوم إدارة المنظمات غير الربحية NGOs.",
          "كانت عضو هيئة تعليمية بجامعة دمشق لـ 7 سنوات، وأستاذ مساعد بجامعة الإسراء والجامعة الأمريكية ولديها ثمانية أبحاث محكّمة.",
          "تعمل حالياً لدى المؤسسة الوطنية الهولندية لحماية الأطفال اللاجئين (NIDOS)، وهي شخصية ارتباط مع بلدية بارن ومنظمة VWN."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "أحمد الحرفي",
        nameEn: "Ahmad Alharfi",
        image: "/images/board/alharfi.svg",
        titleAr: "عضو مكتب الأمانة العامة (المسؤول التنظيمي وعضو مكتب الإعلام)",
        titleEn: "Organizational Officer - General Secretariat",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["الأمانة العامة", "مكتب التنظيم", "المكتب الإعلامي"]),
        bioPoints: JSON.stringify([
          "ممثل وصانع مسرح وسينما سوري يملك خبرة تتجاوز 20 عاماً، أسس عام 2016 فرقة (Fada Theatre) وقدمت أكثر من 120 عرضاً مسرحياً بأوروبا.",
          "حصد جوائز دولية كأفضل ممثل في بريطانيا (فيلم Ahmad & Maryam) وجائزة أفضل أداء في طوكيو (فيلم سجون غير مرئية) لمناهضة الاستبداد.",
          "يتقن اللغات العربية والهولندية والإنجليزية، وعمل كمدرب أداء دولي في دبي ولديه خبرة واسعة في إدارة العمليات الإدارية والتنظيمية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      }
    ]
  });
  console.log("تم إدخال بيانات 23 عضواً من أعضاء مجلس الإدارة بنجاح ✅");
}

function getRoleDesc(name) {
  const descs = {
    admin: "مدير النظام — صلاحية كاملة على جميع الوحدات",
    editor: "محرر — إدارة المحتوى والنشر",
    moderator: "مشرف — إدارة التعليقات والإشراف",
    contributor: "مساهم — إنشاء وتحرير المحتوى",
    member: "عضو — صلاحيات أساسية",
  };
  return descs[name] || "";
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());


