import { useTranslations } from 'next-intl';
import type { WeatherData } from '@/lib/weather';
import WeatherLive from './WeatherLive';

/**
 * Weather block. The initial data snapshot is fetched server-side (see the
 * home page) and baked into the HTML; <WeatherLive /> then keeps the numbers
 * live in the visitor's browser.
 */
export default function WeatherSection({ initial }: { initial: WeatherData | null }) {
  const t = useTranslations('weather');

  return (
    <section id="weather" className="section-padding">
      <div className="max-w-5xl mx-auto">
        <h2
          className="font-display text-3xl sm:text-4xl font-semibold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          {t('title')}
        </h2>
        <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
          {t('subtitle')}
        </p>
        <div className="w-12 h-0.5 mb-10" style={{ background: 'var(--accent)' }} />

        <WeatherLive initial={initial} />
      </div>
    </section>
  );
}
