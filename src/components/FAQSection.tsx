import { useTranslations, useMessages } from 'next-intl';

/**
 * Visible FAQ block + FAQPage structured data.
 * Questions/answers are fully localized and rendered on the page so the
 * FAQPage schema (Featured Snippet / AI Overview target) matches visible text.
 */
export default function FAQSection() {
  const t = useTranslations('faq');
  const messages = useMessages() as any;
  const items = (messages?.faq?.items || []) as Array<{ q: string; a: string }>;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section id="faq" className="section-padding" style={{ background: 'var(--bg-primary)' }}>
        <div className="max-w-4xl mx-auto">
          <h2
            className="font-display text-3xl sm:text-4xl font-semibold mb-6"
            style={{ color: 'var(--text-primary)' }}
          >
            {t('title')}
          </h2>
          <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

          <p className="text-lg leading-relaxed mb-10" style={{ color: 'var(--text-secondary)' }}>
            {t('intro')}
          </p>

          <div className="space-y-4">
            {items.map((item, i) => (
              <details
                key={i}
                className="rounded-xl overflow-hidden"
                style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
                open={i === 0}
              >
                <summary
                  className="cursor-pointer list-none flex items-start gap-3 px-5 sm:px-6 py-4 font-display font-semibold text-base sm:text-lg"
                  style={{ color: 'var(--text-primary)' }}
                >
                  <span
                    className="mt-1 flex-shrink-0 w-1.5 h-1.5 rounded-full"
                    style={{ background: 'var(--accent)' }}
                  />
                  <span>{item.q}</span>
                </summary>
                <div className="px-5 sm:px-6 pb-5 pl-[38px]">
                  <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                    {item.a}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
