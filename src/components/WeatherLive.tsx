'use client';

import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { fetchWeather, weatherCategory } from '@/lib/weather';
import type { WeatherCategory, WeatherData, WeatherDay } from '@/lib/weather';
import { weatherAdvice } from '@/lib/advice';
import type { AdviceGroup } from '@/lib/advice';

const iconProps = {
  width: 22,
  height: 22,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

type WeatherIcons = Record<WeatherCategory, ReactNode>;

const icons: WeatherIcons = {
  clear: (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2" />
      <path d="M12 20v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="m17.66 17.66 1.41 1.41" />
      <path d="M2 12h2" />
      <path d="M20 12h2" />
      <path d="m6.34 17.66-1.41 1.41" />
      <path d="m19.07 4.93-1.41 1.41" />
    </svg>
  ),
  partly: (
    <svg {...iconProps}>
      <path d="M12 2v2" />
      <path d="m4.93 4.93 1.41 1.41" />
      <path d="M20 12h2" />
      <path d="m19.07 4.93-1.41 1.41" />
      <path d="M15.9 12.8a4 4 0 0 0-6.1-4.2" />
      <path d="M13 22H7a5 5 0 1 1 4.9-6H13a3 3 0 0 1 0 6Z" />
    </svg>
  ),
  cloudy: (
    <svg {...iconProps}>
      <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
    </svg>
  ),
  fog: (
    <svg {...iconProps}>
      <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="M16 17H7" />
      <path d="M17 21H9" />
    </svg>
  ),
  drizzle: (
    <svg {...iconProps}>
      <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="M8 19v2" />
      <path d="M16 19v2" />
      <path d="M12 19v2" />
    </svg>
  ),
  rain: (
    <svg {...iconProps}>
      <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="M16 14v6" />
      <path d="M8 14v6" />
      <path d="M12 16v6" />
    </svg>
  ),
  snow: (
    <svg {...iconProps}>
      <path d="M4 14.9A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="M8 15h.01" />
      <path d="M8 19h.01" />
      <path d="M12 17h.01" />
      <path d="M12 21h.01" />
      <path d="M16 15h.01" />
      <path d="M16 19h.01" />
    </svg>
  ),
  storm: (
    <svg {...iconProps}>
      <path d="M6 16.3A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.24" />
      <path d="m13 12-3 5h4l-3 5" />
    </svg>
  ),
};

function Temp({ value, className = '' }: { value: number | null; className?: string }) {
  return (
    <span className={className}>
      {value === null || value === undefined ? '--' : Math.round(value)}°
    </span>
  );
}

export default function WeatherLive({ initial }: { initial: WeatherData | null }) {
  const t = useTranslations('weather');
  const locale = useLocale();
  const [data, setData] = useState<WeatherData | null>(initial);
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function refresh() {
      const d = await fetchWeather();
      if (!cancelled && d) {
        setData(d);
        setUpdatedAt(
          new Date().toLocaleTimeString(locale === 'zh' ? 'zh-CN' : locale, {
            hour: '2-digit',
            minute: '2-digit',
          })
        );
      }
    }
    refresh();
    const timer = window.setInterval(refresh, 30 * 60 * 1000);
    const onVisible = () => {
      if (document.visibilityState === 'visible') refresh();
    };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [locale]);

  if (!data) {
    return (
      <div
        className="rounded-xl px-6 py-10 text-center"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
      >
        <p style={{ color: 'var(--text-secondary)' }}>{t('unavailable')}</p>
      </div>
    );
  }

  const cat: WeatherCategory = weatherCategory(data.code);
  const today: WeatherDay | undefined = data.days?.[0];
  const adviceItems = weatherAdvice(data);
  const weekdayFmt = new Intl.DateTimeFormat(locale === 'zh' ? 'zh-CN' : locale, {
    weekday: 'short',
  });

  const labelDay = (d: WeatherDay, i: number) => {
    if (i === 0) return t('today');
    const dt = new Date(d.date + 'T12:00:00');
    return `${weekdayFmt.format(dt)}`;
  };

  const metric = (label: string, value: string | null) => (
    <div className="flex flex-col items-center gap-0.5">
      <span className="text-[11px] uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <span className="text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
        {value ?? '--'}
      </span>
    </div>
  );

  const groupStyle: Record<
    AdviceGroup,
    { color: string; bg: string; border: string; labelKey: string }
  > = {
    risk: {
      color: '#b91c1c',
      bg: 'rgba(185, 28, 28, 0.07)',
      border: 'rgba(185, 28, 28, 0.3)',
      labelKey: 'tagRisk',
    },
    plan: {
      color: '#0f766e',
      bg: 'rgba(15, 118, 110, 0.06)',
      border: 'rgba(15, 118, 110, 0.22)',
      labelKey: 'tagPlan',
    },
    outfit: {
      color: '#b45309',
      bg: 'rgba(180, 83, 9, 0.06)',
      border: 'rgba(180, 83, 9, 0.22)',
      labelKey: 'tagOutfit',
    },
    gear: {
      color: '#1d4ed8',
      bg: 'rgba(29, 78, 216, 0.06)',
      border: 'rgba(29, 78, 216, 0.22)',
      labelKey: 'tagGear',
    },
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(300px,340px)_1fr] gap-6">
      {/* Current conditions */}
      <div
        className="rounded-xl p-6 flex flex-col items-center justify-center text-center"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
      >
        <div className="mb-3" style={{ color: 'var(--accent)' }}>
          {icons[cat]}
        </div>
        <p className="font-display text-5xl font-semibold" style={{ color: 'var(--text-primary)' }}>
          <Temp value={data.temp} />
        </p>
        <p className="mt-1 font-medium" style={{ color: 'var(--text-primary)' }}>
          {t(`conditions.${cat}`)}
        </p>
        <p className="mt-3 flex gap-4 items-center justify-center">
          <span style={{ color: 'var(--text-secondary)' }}>
            <Temp value={today?.tmax} /> {t('high')}
          </span>
          <span style={{ color: 'var(--text-muted)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)' }}>
            <Temp value={today?.tmin} /> {t('low')}
          </span>
        </p>
        <div className="mt-5 w-full pt-4 grid grid-cols-2 sm:grid-cols-4 gap-2" style={{ borderTop: '1px solid var(--border-color)' }}>
          {metric(t('feelsLike'), data.feels === null ? null : `${Math.round(data.feels)}°`)}
          {metric(
            t('rainShort'),
            today?.precip === null || today?.precip === undefined
              ? null
              : `${Math.round(today.precip)}%`
          )}
          {metric(t('wind'), data.wind === null ? null : `${Math.round(data.wind)} km/h`)}
          {metric(
            t('uv'),
            today?.uv === null || today?.uv === undefined ? null : `${Math.round(today.uv)}`
          )}
        </div>
        {updatedAt && (
          <p className="mt-4 text-xs" style={{ color: 'var(--text-muted)' }}>
            {t('updated')} {updatedAt}
          </p>
        )}
      </div>

      {/* Multi-day forecast */}
      <div
        className="rounded-xl p-5 sm:p-6"
        style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)' }}
      >
        <h3 className="font-display text-lg font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          {t('forecastTitle')}
        </h3>
        <div className="grid grid-cols-4 sm:grid-cols-4 md:grid-cols-7 gap-2">
          {(data.days || []).map((d, i) => {
            const isToday = i === 0;
            const p = d.precip;
            return (
              <div
                key={d.date}
                className="rounded-lg px-1.5 py-3 flex flex-col items-center gap-1.5 text-center"
                style={{
                  background: isToday ? 'var(--bg-secondary)' : 'var(--bg-primary)',
                  border: isToday ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                }}
              >
                <span
                  className="text-xs font-medium truncate max-w-full"
                  style={{ color: isToday ? 'var(--accent)' : 'var(--text-secondary)' }}
                >
                  {labelDay(d, i)}
                </span>
                <span style={{ color: 'var(--accent)' }}>{icons[weatherCategory(d.code)]}</span>
                <span className="flex items-center gap-1">
                  <Temp value={d.tmax} className="text-sm font-semibold" />
                  <span style={{ color: 'var(--text-muted)' }}>/</span>
                  <Temp value={d.tmin} className="text-sm" />
                </span>
                {p !== null && p !== undefined ? (
                  <span className="text-[11px]" style={{ color: p >= 40 ? '#4a90d9' : 'var(--text-muted)' }}>
                    {t('rainShort')} {Math.round(p)}%
                  </span>
                ) : (
                  <span className="text-[11px]" style={{ color: 'var(--text-muted)' }}>--</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Condition-based advice panel (only groups with triggers are shown) */}
        {adviceItems.length > 0 && (
          <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--border-color)' }}>
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 mb-4">
              <h4
                className="font-display text-lg font-semibold"
                style={{ color: 'var(--text-primary)' }}
              >
                {t('advice.heading')}
              </h4>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {t('advice.auto')}
              </span>
            </div>

            {(['risk', 'plan', 'outfit', 'gear'] as AdviceGroup[]).map((group) => {
              const inGroup = adviceItems.filter((a) => a.group === group);
              if (inGroup.length === 0) return null;
              const s = groupStyle[group];
              return (
                <div
                  key={group}
                  className="mb-2.5 rounded-lg px-4 py-3 last:mb-0"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <p
                    className="text-[11px] font-bold uppercase tracking-wider mb-1.5"
                    style={{ color: s.color }}
                  >
                    {t(`advice.${s.labelKey}`)}
                  </p>
                  <ul className="space-y-1.5">
                    {inGroup.map((a) => (
                      <li key={a.key} className="flex items-start gap-2">
                        <span
                          aria-hidden
                          className="mt-[7px] inline-block h-1.5 w-1.5 flex-none rounded-full"
                          style={{ background: s.color }}
                        />
                        <span
                          className="text-sm leading-relaxed"
                          style={{ color: 'var(--text-primary)' }}
                        >
                          {t(`advice.${a.key}`)}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}

            <p className="mt-4 text-xs leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {t('mountainNote')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
