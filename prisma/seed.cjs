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

  // Seed board members
  await prisma.boardMember.deleteMany();
  await prisma.boardMember.createMany({
    data: [
      {
        nameAr: "عبد المنعم الشامان",
        nameEn: "Abdul Munim Al Chaman",
        image: "/images/board/abdulmunim.jpg",
        titleAr: "رئيس مجلس الإدارة",
        titleEn: "Chairman of the Board",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مجلس الإدارة", "لجنة الترخيص"]),
        bioPoints: JSON.stringify([
          "قنصل فخري سابق لسوريا في هولندا 1993 - 2014، ويتمتع بخبرة واسعة في الدبلوماسية والأعمال والقيادة المجتمعية.",
          "مؤسس ورئيس تنفيذي لمجموعة مراقبة جودة الحلال (HQC) أكبر شركة إصدار الجودة والحلال في العالم.",
          "راعي ومساهم في العديد من المبادرات المجتمعية لأبناء الجالية السورية في هولندا وفي الداخل السوري."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "خالد فيصل الطويل",
        nameEn: "Khaled Faisal Altawil",
        image: "/images/board/khaled.jpg",
        titleAr: "الأمين العام للجالية",
        titleEn: "Secretary General",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["الأمانة العامة", "مكتب التنظيم", "المكتب المالي"]),
        bioPoints: JSON.stringify([
          "ناشط سياسي وثوري مقيم في هولندا منذ 2014، انشق سابقاً عن عمله في وزارة الداخلية (رئيس قسم معلوماتية).",
          "يحمل شهادة بكالوريوس في تكنولوجيا المعلومات BIT وكان مشروع تخرجه رائداً للحفاظ على اللغة الآرامية السريانية.",
          "شاعر ومهتم باللغة العربية، ومن الرواد في تأسيس أوائل مدارس اللغة العربية في هولندا للحفاظ على الهوية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد سليم عزيزة",
        nameEn: "Mohammad Salim Aziza",
        image: "/images/board/mohammad.jpg",
        titleAr: "عضو مكتب الأمانة العامة - المسؤول التقني",
        titleEn: "Technical Director - General Secretariat",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["الأمانة العامة", "المكتب الإعلامي", "قسم تقنية المعلومات IT"]),
        bioPoints: JSON.stringify([
          "حاصل على دبلوم في علوم وبرمجة الحاسب من جامعة يرفان بأرمينيا عام 2006.",
          "مؤسس ومالك شركة عزيزة في سوريا، تركيا، وهولندا لتجارة أجهزة الكمبيوتر والموبايل والتطوير العقاري والخدمات اللوجستية.",
          "عضو جمعية الصحفيين الهولنديين (NVJ) وفي المنظمة الدولية للصحافة والإعلام في هولندا (IPMO).",
          "عمل مع عدة منظمات إنسانية في هولندا وآخرها منظمة 'لكل الناس' رئيسًا للقسم التقني."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "محمد سعيد كيوان",
        nameEn: "Mohammad Said Kaywan",
        image: "/images/board/said.jpg",
        titleAr: "أمين الصندوق",
        titleEn: "Treasurer",
        isFounder: true,
        isLicensing: true,
        committees: JSON.stringify(["مجلس الإدارة", "المكتب المالي", "لجنة الترخيص"]),
        bioPoints: JSON.stringify([
          "رجل أعمال سوري ناجح مقيم في هولندا منذ سنوات، يمتلك خبرة واسعة في الإدارة المالية وإدارة الأعمال.",
          "يتولى الإشراف على الشؤون المالية للجالية وضمان الشفافية في استخدام الموارد.",
          "مساهم فعّال في دعم مشاريع الجالية وتطوير خططها الاستراتيجية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "وائل عيسى",
        nameEn: "Wael Issa",
        image: "/images/board/wael.jpg",
        titleAr: "مسؤول العلاقات العامة والإعلام",
        titleEn: "Public Relations & Media Officer",
        isFounder: true,
        isLicensing: false,
        committees: JSON.stringify(["المكتب الإعلامي", "لجنة العلاقات العامة"]),
        bioPoints: JSON.stringify([
          "متخصص في مجال الإعلام والاتصال، ويعمل على تعزيز صورة الجالية السورية في الإعلام الهولندي.",
          "يدير العلاقات مع وسائل الإعلام المحلية والدولية وينسق التغطية الإعلامية لفعاليات الجالية.",
          "يسعى لبناء جسور التواصل بين الجالية السورية والمجتمع الهولندي عبر منصات التواصل الاجتماعي والإعلام."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "أيمن الحلاق",
        nameEn: "Ayman Al-Hallaq",
        image: "/images/board/ayman.jpg",
        titleAr: "مسؤول الشؤون الاجتماعية والإنسانية",
        titleEn: "Social & Humanitarian Affairs Officer",
        isFounder: false,
        isLicensing: false,
        committees: JSON.stringify(["لجنة الشؤون الاجتماعية", "لجنة العمل الإنساني"]),
        bioPoints: JSON.stringify([
          "ناشط اجتماعي وإنساني يعمل على تقديم الدعم والمساعدة لأبناء الجالية السورية في هولندا.",
          "ينسق مع المنظمات الإنسانية والجمعيات المحلية لتوفير الخدمات الاجتماعية للمحتاجين.",
          "يشرف على برامج الإغاثة والدعم النفسي والاجتماعي لأبناء الجالية."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      },
      {
        nameAr: "سمر قطيش",
        nameEn: "Samar Qatish",
        image: "/images/board/samar.jpg",
        titleAr: "مسؤولة شؤون المرأة والأسرة",
        titleEn: "Women & Family Affairs Officer",
        isFounder: false,
        isLicensing: false,
        committees: JSON.stringify(["لجنة شؤون المرأة والأسرة", "لجنة التعليم والثقافة"]),
        bioPoints: JSON.stringify([
          "ناشطة في مجال حقوق المرأة وتمكينها، وتعمل على دعم المرأة السورية في هولندا.",
          "تنظم برامج وورش عمل لدعم الأمهات والأسر السورية في التكيف مع الحياة في هولندا.",
          "تساهم في تطوير برامج تعليمية وثقافية للأطفال والشباب السوري."
        ]),
        website: "https://www.sy-nl.org/",
        kvkNumber: "96718943"
      }
    ]
  });
  console.log("7 board members seeded");
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
