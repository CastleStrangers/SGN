import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jobs' });
  return {
    metadataBase: new URL("https://sgn-indol.vercel.app"),
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function JobsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'jobs' });

  const jobs = await prisma.job.findMany({
    where: {
      published: true,
      OR: [
        { expiresAt: null },
        { expiresAt: { gt: new Date() } },
      ],
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
      _count: {
        select: { applications: true },
      },
    },
    orderBy: [
      { featured: 'desc' },
      { createdAt: 'desc' },
    ],
    take: 20,
  });

  const categories = [
    { id: 'technology', label: t('categories.technology'), icon: '💻' },
    { id: 'healthcare', label: t('categories.healthcare'), icon: '🏥' },
    { id: 'education', label: t('categories.education'), icon: '🎓' },
    { id: 'construction', label: t('categories.construction'), icon: '🏗️' },
    { id: 'retail', label: t('categories.retail'), icon: '🏪' },
    { id: 'hospitality', label: t('categories.hospitality'), icon: '🍽️' },
    { id: 'general', label: t('categories.general'), icon: '📋' },
  ];

  const jobTypes = [
    { id: 'full-time', label: t('types.fullTime') },
    { id: 'part-time', label: t('types.partTime') },
    { id: 'contract', label: t('types.contract') },
    { id: 'internship', label: t('types.internship') },
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
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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

        {/* Job Types */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('types.title')}</h2>
          <div className="flex flex-wrap gap-2">
            {jobTypes.map((type) => (
              <button
                key={type.id}
                className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-emerald-500 transition-colors text-sm font-medium text-gray-700"
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Jobs */}
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-4">{t('allJobs')}</h2>
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">{t('noJobs')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
                        {job.title}
                      </h3>
                      {job.featured && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-semibold ml-2">
                          {t('featured')}
                        </span>
                      )}
                    </div>
                    {job.company && (
                      <p className="text-emerald-600 font-semibold mb-2">{job.company}</p>
                    )}
                    {job.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {job.description}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.city && (
                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                          📍 {job.city}
                        </span>
                      )}
                      {job.type && (
                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                          {job.type}
                        </span>
                      )}
                      {job.remote && (
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                          🏠 {t('remote')}
                        </span>
                      )}
                    </div>
                    {job.salary && (
                      <p className="text-gray-700 font-semibold mb-4">
                        💰 {job.salary}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">
                        {job._count.applications} {t('applications')}
                      </span>
                      <button
                        className="bg-[#1a5632] hover:bg-[#0f3d23] text-white px-4 py-2 rounded-xl font-semibold transition-colors text-sm"
                      >
                        {t('apply')}
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
