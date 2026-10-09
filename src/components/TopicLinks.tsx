'use client';

import { useLocale, useTranslations } from 'next-intl';

const ICONS: Record<string, string> = {
  horarioComoLlegar: '🕒',
  queHacerCerca: '🚶',
  fotos: '📷',
};

export default function TopicLinks() {
  const locale = useLocale();
  const t = useTranslations('topics');

  const cards = [
    { key: 'horarioComoLlegar', href: `/${locale}/horario-como-llegar` },
    { key: 'queHacerCerca', href: `/${locale}/que-hacer-cerca` },
    { key: 'fotos', href: `/${locale}/fotos` },
  ] as const;

  return (
    <section id="guides" className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('sectionTitle')}
        </h2>
        <p className="mb-8 max-w-2xl" style={{ color: 'var(--text-muted)' }}>
          {t('sectionSubtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <div className="grid sm:grid-cols-3 gap-5">
          {cards.map((card) => (
            <a
              key={card.key}
              href={card.href}
              className="group rounded-2xl p-6 transition-shadow hover:shadow-md flex flex-col gap-3"
              style={{ background: 'var(--card-bg)', border: '1px solid var(--border-color)' }}
            >
              <span className="text-2xl" aria-hidden>
                {ICONS[card.key]}
              </span>
              <span
                className="font-display text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {t(`${card.key}.crumb`)}
              </span>
              <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                {t(`${card.key}.title`)}
              </span>
              <span
                className="mt-2 inline-flex items-center gap-1 text-sm font-medium transition-transform group-hover:translate-x-1"
                style={{ color: 'var(--accent)' }}
              >
                →
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
