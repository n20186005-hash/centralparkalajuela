import { setRequestLocale } from 'next-intl/server';
import type { Metadata } from 'next';
import CookieSettingsClient from './CookieSettingsClient';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/site';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const baseUrl = SITE.url;
  const pagePath = '/cookie-settings';
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

export default async function CookiePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <CookieSettingsClient />;
}
