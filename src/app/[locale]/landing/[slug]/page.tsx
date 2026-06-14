import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const page = await prisma.landingPage.findUnique({ where: { slug: decodedSlug } });
  if (!page) return { title: "Not Found" };

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.subtitle || "",
    openGraph: {
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.subtitle || "",
      images: page.heroImage ? [{ url: page.heroImage }] : [],
    },
  };
}

export default async function LandingPageView({ params }: Props) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const t = useTranslations("landing");
  const page = await prisma.landingPage.findFirst({ where: { slug: decodedSlug, published: true } });
  if (!page) notFound();

  const features = page.features ? JSON.parse(page.features) : [];

  return (
    <div className="min-h-screen bg-white" style={{ "--theme": page.themeColor } as React.CSSProperties}>
      <nav className="absolute top-0 left-0 right-0 z-10 p-4">
        <Link href="/" className="inline-flex items-center gap-1 text-white/80 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" /> {t('backToHome')}
        </Link>
      </nav>

      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden" style={{ backgroundColor: page.themeColor }}>
        {page.heroImage && (
          <img src={page.heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-30" loading="lazy" />
        )}
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">{page.heroHeadline || page.title}</h1>
          {page.heroSubheadline && (
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-8">{page.heroSubheadline}</p>
          )}
          {page.ctaText && page.ctaLink && (
            <a href={page.ctaLink} className="inline-flex items-center gap-2 px-8 py-3.5 bg-white font-bold rounded-xl text-sm hover:bg-white/90 transition-all hover:shadow-lg" style={{ color: page.themeColor }}>
              {page.ctaText} <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>
      </section>

      {features.length > 0 && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {features.map((f: { title?: string; description?: string; icon?: string }, i: number) => (
              <div key={i} className="bg-white rounded-2xl p-8 border text-center hover:shadow-md transition-shadow">
                {f.icon && <div className="text-4xl mb-4">{f.icon}</div>}
                {f.title && <h3 className="text-lg font-bold mb-2 text-gray-900">{f.title}</h3>}
                {f.description && <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {page.content && (
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto prose prose-lg prose-gray" dangerouslySetInnerHTML={{ __html: page.content }} />
        </section>
      )}

      {page.ctaText && page.ctaLink && (
        <section className="py-20 px-4 text-center" style={{ backgroundColor: page.themeColor + "0a" }}>
          <div className="max-w-xl mx-auto">
            <a href={page.ctaLink} className="inline-flex items-center gap-2 px-10 py-4 font-bold rounded-xl text-white text-lg hover:shadow-lg transition-all" style={{ backgroundColor: page.themeColor }}>
              {page.ctaText} <ChevronRight className="w-5 h-5" />
            </a>
          </div>
        </section>
      )}

      <footer className="py-8 text-center text-sm text-gray-400 border-t">
        <p>{t('copyright')} &copy; {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
