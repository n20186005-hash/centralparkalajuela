'use client';

import { useLocale } from 'next-intl';
import LanguageToggle from './LanguageToggle';

export default function TopicTopBar() {
  const locale = useLocale();
  return (
    <header
      className="sticky top-0 z-50"
      style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <a
          href={`/${locale}`}
          className="font-display text-lg font-semibold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          Central Park Alajuela
        </a>
        <LanguageToggle />
      </div>
    </header>
  );
}
