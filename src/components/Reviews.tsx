import { useTranslations, useMessages, useLocale } from 'next-intl';
import { SITE } from '@/lib/site';

export default function Reviews() {
  const t = useTranslations('reviews');
  const locale = useLocale();
  const messages = useMessages() as any;
  const mapsUrl = SITE.mapsShareUrl;
  const reviewTotal = new Intl.NumberFormat(locale, { useGrouping: true }).format(
    parseInt(SITE.reviewCount.replace(/[^\d]/g, ''), 10) || 0
  );
  const verifiedNote = t('verifiedNote');

  return (
    <section id="reviews" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p
          className="text-sm leading-relaxed mb-10 max-w-2xl"
          style={{ color: 'var(--text-muted)' }}
        >
          {t('declaration')}
        </p>

        <div className="mb-10 flex justify-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-2xl px-5 py-3 transition-shadow hover:shadow-md"
            style={{
              background: 'var(--card-bg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--card-shadow)',
            }}
          >
            <span
              className="font-display text-2xl font-semibold leading-none"
              style={{ color: 'var(--text-primary)' }}
            >
              {SITE.rating}
            </span>
            <span
              aria-hidden
              className="leading-none"
              style={{ color: '#f0b429', fontSize: '1.05rem', letterSpacing: '2px' }}
            >
              ★★★★<span style={{ opacity: 0.45 }}>★</span>
            </span>
            <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
              {t('ratingLabel')}
            </span>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {reviewTotal} {t('ratingCountUnit')} ↗
            </span>
          </a>
        </div>

        <p
          className="text-xs text-center mb-8"
          style={{ color: 'var(--text-muted)' }}
        >
          {verifiedNote}
        </p>

        {/* More reviews link — arrow only */}
        <div className="flex justify-center">
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all"
            style={{
              color: 'var(--accent)',
              border: '1px solid var(--accent)',
            }}
          >
            <span>{t('moreReviews')}</span>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="group-hover:translate-x-1 transition-transform"
            >
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
