import { useTranslations, useMessages } from 'next-intl';

/**
 * Sources & references block (E-E-A-T).
 * Shows the official .go.cr / .org / Google Maps sources used to compile the
 * visitor guide, reinforcing entity credibility with authoritative outbound links.
 */
export default function SourcesSection() {
  const t = useTranslations('sources');
  const messages = useMessages() as any;
  const items = (messages?.sources?.items || []) as Array<{
    name: string;
    url: string;
    note: string;
  }>;

  return (
    <section className="section-padding" style={{ background: 'var(--bg-secondary)' }}>
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

        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {items.map((item, i) => (
            <li
              key={i}
              className="rounded-xl p-5 flex flex-col gap-1"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold hover:underline"
                style={{ color: 'var(--accent)' }}
              >
                {item.name}
              </a>
              {item.note ? (
                <span className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                  {item.note}
                </span>
              ) : null}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
