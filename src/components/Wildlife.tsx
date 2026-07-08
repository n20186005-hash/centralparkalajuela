'use client';

import { useTranslations, useMessages } from 'next-intl';

export default function Wildlife() {
  const t = useTranslations('wildlife');
  const messages = useMessages() as any;
  const items: any[] = messages?.wildlife?.items || [];

  return (
    <section className="section-padding" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-4xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p
          className="text-lg leading-relaxed mb-12"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl p-6"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <h3
                className="font-display text-lg font-semibold mb-1"
                style={{ color: 'var(--text-primary)' }}
              >
                {item.name}
              </h3>
              <p className="text-sm italic mb-3" style={{ color: 'var(--accent)' }}>
                {item.sci}
              </p>
              <p className="leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                {item.text}
              </p>
              <div
                className="text-sm font-medium py-1 px-3 inline-block rounded-full"
                style={{ background: 'var(--bg-secondary)', color: 'var(--text-primary)' }}
              >
                🕒 {item.bestTime}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-8 rounded-xl p-6"
          style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
        >
          <p className="leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            {t('tip')}
          </p>
        </div>
      </div>
    </section>
  );
}
