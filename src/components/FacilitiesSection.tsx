import { useTranslations, useMessages } from 'next-intl';

interface Facility {
  id: string;
  title: string;
  body: string;
  tags: string[];
}

const glyphProps = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function FacilityIcon({ id }: { id: string }) {
  if (id === 'restrooms' || id === 'parking') {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden>
        <text
          x="12"
          y="16.5"
          textAnchor="middle"
          fontSize="12"
          fontWeight="700"
          stroke="none"
          fill="currentColor"
          fontFamily="ui-sans-serif, system-ui, sans-serif"
        >
          {id === 'restrooms' ? 'WC' : 'P'}
        </text>
      </svg>
    );
  }
  switch (id) {
    case 'dining':
      return (
        <svg {...glyphProps}>
          <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
          <path d="M7 2v20" />
          <path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
        </svg>
      );
    case 'hotels':
      return (
        <svg {...glyphProps}>
          <path d="M2 4v16" />
          <path d="M2 8h18a2 2 0 0 1 2 2v10" />
          <path d="M2 17h20" />
          <path d="M6 8v9" />
        </svg>
      );
    case 'shopping':
      return (
        <svg {...glyphProps}>
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      );
    case 'fuel':
    default:
      return (
        <svg {...glyphProps}>
          <line x1="3" y1="22" x2="15" y2="22" />
          <line x1="4" y1="9" x2="14" y2="9" />
          <path d="M14 22V4a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v18" />
          <path d="M14 13h2a2 2 0 0 1 2 2v2a2 2 0 0 0 4 0V9.83a2 2 0 0 0-.59-1.42L18 5" />
        </svg>
      );
  }
}

/**
 * Neutral, category-based overview of everyday services around the park.
 * This is a non-profit, science-and-education site: we never recommend
 * specific businesses, only the types of services that are typically available.
 */
export default function FacilitiesSection() {
  const t = useTranslations('facilities');
  const messages = useMessages() as any;
  const items: Facility[] = messages?.facilities?.items || [];

  return (
    <section id="facilities" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-6"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <div className="w-12 h-0.5 mb-8" style={{ background: 'var(--accent)' }} />

        <p
          className="text-lg leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          {t('intro')}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item, i) => (
            <div
              key={item.id || i}
              className="rounded-xl p-5 flex flex-col gap-3"
              style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
            >
              <div
                className="w-11 h-11 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--bg-secondary)', color: 'var(--accent)' }}
              >
                <FacilityIcon id={item.id} />
              </div>
              <h3 className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                {item.body}
              </p>
              <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
                {item.tags?.map((tag, ti) => (
                  <span
                    key={ti}
                    className="text-xs px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--tag-bg)', color: 'var(--tag-text)' }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div
          className="mt-6 rounded-xl p-5 flex items-start gap-3"
          style={{ background: 'var(--bg-tertiary)', border: '1px dashed var(--accent)' }}
        >
          <span
            className="mt-0.5 flex-shrink-0 w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
          />
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
              {t('tipTitle')}：
            </span>
            {t('tip')}
          </p>
        </div>
      </div>
    </section>
  );
}
