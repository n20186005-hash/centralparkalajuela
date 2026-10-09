import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/site';

const BASE_URL = SITE.url;

export function topicHreflang(locale: string, pagePath: string) {
  const urlFor = (l: string) => `${BASE_URL}/${l}${pagePath}`;
  const languages: Record<string, string> = {
    'x-default': urlFor(routing.defaultLocale),
  };
  routing.locales.forEach((l) => {
    languages[l] = urlFor(l);
  });
  return {
    canonical: urlFor(locale),
    languages,
  };
}

export function topicMetadata(locale: string, pagePath: string, title: string, description: string): Metadata {
  const { canonical, languages } = topicHreflang(locale, pagePath);
  const ogImage = `${BASE_URL}${SITE.heroImage}`;
  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      title,
      description,
      url: canonical,
      type: 'website',
      images: [{ url: ogImage, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

/** BreadcrumbList structured data for a topic page (Home → Topic). */
export function buildTopicBreadcrumb(pagePath: string, locale: string, topicName: string) {
  const home = `${BASE_URL}/${locale}`;
  const here = `${BASE_URL}/${locale}${pagePath}`;
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: SITE.attractionShortName,
        item: home,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: topicName,
        item: here,
      },
    ],
  };
}
