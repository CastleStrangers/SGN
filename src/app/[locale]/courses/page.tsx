import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'courses' });
  return {
    metadataBase: new URL("https://sgn-indol.vercel.app"),
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function CoursesPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'courses' });

  const courses = await prisma.course.findMany({
    where: {
      published: true,
    },
    include: {
      instructor: {
        select: { name: true, image: true },
      },
      _count: {
        select: { lessons: true, enrollments: true },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 20,
  });

  const categories = [
    { id: 'language', label: t('categories.language'), icon: '📚' },
    { id: 'integration', label: t('categories.integration'), icon: '🏛️' },
    { id: 'employment', label: t('categories.employment'), icon: '💼' },
    { id: 'health', label: t('categories.health'), icon: '🏥' },
    { id: 'culture', label: t('categories.culture'), icon: '🎨' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('categories.title')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                className="bg-white rounded-xl p-4 border border-gray-200 hover:border-emerald-500 transition-colors text-center"
              >
                <span className="text-3xl mb-2 block">{category.icon}</span>
                <span className="text-sm font-medium text-gray-700">{category.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Courses */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('allCourses')}</h2>
          {courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noCourses')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="relative">
                    {course.thumbnail ? (
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                        <span className="text-white text-4xl">📖</span>
                      </div>
                    )}
                    {course.featured && (
                      <div className="absolute top-3 left-3 bg-amber-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {t('featured')}
                      </div>
                    )}
                    {course.price === 0 && (
                      <div className="absolute top-3 right-3 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        {t('free')}
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>
                    {course.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-2">
                        {course.instructor.image && (
                          <img
                            src={course.instructor.image}
                            alt={course.instructor.name || ''}
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <span>{course.instructor.name || t('instructor')}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>{course._count.lessons}</span>
                        <span>{t('lessons')}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-emerald-600 font-bold">
                        {course.price === 0 ? t('free') : `€${course.price}`}
                      </span>
                      <button
                        className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
                      >
                        {t('enroll')}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
