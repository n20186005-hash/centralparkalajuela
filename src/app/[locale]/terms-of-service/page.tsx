import { setRequestLocale } from 'next-intl/server';
import { useTranslations, useLocale, useMessages } from 'next-intl';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = SITE.url;
  const pagePath = '/terms-of-service';
  const urlFor = (l: string) => `${baseUrl}/${l}${pagePath}`;
  const languages: Record<string, string> = {
    'x-default': urlFor(routing.defaultLocale),
  };
  routing.locales.forEach((l) => {
    languages[l] = urlFor(l);
  });

  return {
    alternates: {
      canonical: urlFor(locale),
      languages,
    },
  };
}

function TermsContent() {
  const t = useTranslations('terms');
  const ht = useTranslations('header');
  const locale = useLocale();
  const messages = useMessages() as any;
  const homeHref = `/${locale}`;
  const sections = (messages?.terms?.sections || []) as Array<{ heading: string; content: string }>;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
        <a
          href={homeHref}
          className="inline-flex items-center gap-2 text-sm font-medium mb-10 transition-colors"
          style={{ color: 'var(--accent)' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {ht('backToHome')}
        </a>

        <h1 className="font-display text-3xl sm:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
          {t('title')}
        </h1>
        <p className="text-sm mb-10" style={{ color: 'var(--text-muted)' }}>{t('lastUpdated')}</p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="space-y-8">
          {sections.map((section, i) => (
            <div key={i}>
              <h2 className="font-display text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                {section.heading}
              </h2>
              <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {section.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <TermsContent />;
}
