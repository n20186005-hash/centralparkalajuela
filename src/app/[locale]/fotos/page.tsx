import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { Metadata } from 'next';
import TopicTopBar from '@/components/TopicTopBar';
import Footer from '@/components/Footer';
import Gallery from '@/components/Gallery';
import { topicMetadata, buildTopicBreadcrumb } from '@/lib/topic-seo';

const PATH = '/fotos';
const KEY = 'fotos';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'topics' });
  return topicMetadata(locale, PATH, t(`${KEY}.title`), t(`${KEY}.intro`));
}

export default async function FotosPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'topics' });
  const ht = await getTranslations({ locale, namespace: 'header' });
  const breadcrumb = buildTopicBreadcrumb(PATH, locale, t(`${KEY}.crumb`));

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <TopicTopBar />
      <main>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-6" style={{ background: 'var(--bg-primary)' }}>
          <a
            href={`/${locale}`}
            className="inline-flex items-center gap-2 text-sm font-medium mb-6 transition-colors"
            style={{ color: 'var(--accent)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            {ht('backToHome')}
          </a>
          <h1
            className="font-display text-3xl sm:text-4xl font-bold mb-3"
            style={{ color: 'var(--text-primary)' }}
          >
            {t(`${KEY}.title`)}
          </h1>
          <p className="text-sm sm:text-base leading-relaxed max-w-2xl" style={{ color: 'var(--text-muted)' }}>
            {t(`${KEY}.intro`)}
          </p>
        </div>

        <Gallery />
      </main>
      <Footer />
    </>
  );
}
