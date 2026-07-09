import { getTranslations } from "next-intl/server";
import { prisma } from "@/lib/db";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'liveStreams' });
  return {
    metadataBase: new URL("https://sgn-indol.vercel.app"),
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function LiveStreamsPage({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'liveStreams' });

  const liveStreams = await prisma.liveStream.findMany({
    where: {
      status: { in: ['live', 'scheduled'] },
    },
    include: {
      author: {
        select: { name: true, image: true },
      },
    },
    orderBy: [
      { status: 'desc' }, // live first
      { scheduledAt: 'asc' },
    ],
    take: 20,
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('title')}</h1>
          <p className="text-gray-600">{t('subtitle')}</p>
        </div>

        {liveStreams.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">{t('noStreams')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {liveStreams.map((stream) => (
              <div
                key={stream.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100"
              >
                <div className="relative">
                  {stream.thumbnail ? (
                    <img
                      src={stream.thumbnail}
                      alt={stream.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center">
                      <span className="text-white text-4xl">📺</span>
                    </div>
                  )}
                  {stream.status === 'live' && (
                    <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                      {t('live')}
                    </div>
                  )}
                  {stream.status === 'scheduled' && stream.scheduledAt && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {new Date(stream.scheduledAt).toLocaleDateString('ar-EG')}
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                    {stream.title}
                  </h3>
                  {stream.description && (
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {stream.description}
                    </p>
                  )}
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      {stream.author.image && (
                        <img
                          src={stream.author.image}
                          alt={stream.author.name || ''}
                          className="w-6 h-6 rounded-full"
                        />
                      )}
                      <span>{stream.author.name || t('anonymous')}</span>
                    </div>
                    {stream.viewerCount > 0 && (
                      <div className="flex items-center gap-1">
                        <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                        <span>{stream.viewerCount}</span>
                      </div>
                    )}
                  </div>
                  {stream.status === 'live' && (
                    <button
                      className="w-full mt-4 bg-[#1a5632] hover:bg-[#0f3d23] text-white py-2.5 rounded-xl font-semibold transition-colors"
                    >
                      {t('watchNow')}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
