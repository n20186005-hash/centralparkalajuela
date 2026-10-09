import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata, Viewport } from 'next';
import { SITE } from '@/lib/site';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = SITE.url;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = SITE_URL;

  // Per-locale absolute URLs for hreflang / canonical (kept in sync with routing).
  const urlFor = (l: string) => `${baseUrl}/${l}`;
  const selfUrl = urlFor(locale);
  const languages: Record<string, string> = {
    'x-default': urlFor(routing.defaultLocale),
  };
  routing.locales.forEach((l) => {
    languages[l] = urlFor(l);
  });

  const localeMap: Record<string, string> = {
    zh: 'zh_CN',
    en: 'en_US',
    es: 'es_CR',
    fr: 'fr_FR',
  };

  const title = messages.meta?.title;
  const description = messages.meta?.description;
  const keywords = messages.meta?.keywords;
  const ogTitle = messages.meta?.ogTitle || title;
  const ogDescription = messages.meta?.ogDescription || description;
  const ogImageAlt = messages.meta?.ogImageAlt || title;
  const heroImageAbsolute = `${baseUrl}${SITE.heroImage}`;

  return {
    metadataBase: new URL(baseUrl),
    title,
    description,
    keywords,
    alternates: {
      canonical: selfUrl,
      languages,
    },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      url: selfUrl,
      siteName: `${SITE.attractionShortName} | ${SITE.attractionFullName}`,
      locale: localeMap[locale] || 'zh_CN',
      type: 'website',
      images: [
        {
          url: heroImageAbsolute,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: [heroImageAbsolute],
    },
    icons: {
      icon: '/icons/icon-192.png',
      apple: '/icons/icon-192.png',
    },
    manifest: SITE.manifestPath,
    appleWebApp: {
      capable: true,
      title: SITE.attractionShortName,
      statusBarStyle: 'default',
    },
    formatDetection: {
      telephone: false,
    },
  };
}

export const viewport: Viewport = {
  themeColor: '#2d6375',
  width: 'device-width',
  initialScale: 1,
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  '@id': `${SITE.url}/#attraction`,
  name: `${SITE.attractionShortName} (${SITE.attractionFullName})`,
  alternateName: [
    SITE.attractionFullName,
    SITE.attractionShortName,
    'Parque Central',
    'Parque de los Mangos',
    'Plaza del Benemérito General Guardia',
    'Parc Central d\'Alajuela',
    '阿拉胡埃拉中央公园',
    'Ciudad de los Mangos',
  ],
  description:
    'A free, 24-hour urban park in the heart of Alajuela, Costa Rica — the "City of Mangoes" (Ciudad de los Mangos) — known for its century-old mango trees, the central octagonal kiosk, and abundant urban wildlife including sloths, green iguanas and red-fronted parakeets.',
  url: SITE.url,
  image: [`${SITE.url}${SITE.heroImage}`],
  isAccessibleForFree: true,
  publicAccess: true,
  smokingAllowed: false,
  hasMap: SITE.mapsShareUrl,
  sameAs: [SITE.mapsShareUrl, SITE.govtTourismUrl, SITE.municipalityUrl],
  openingHours: '24/7',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: SITE.latitude,
    longitude: SITE.longitude,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: SITE.attractionFullName,
    addressLocality: SITE.city,
    addressRegion: SITE.province,
    postalCode: SITE.postalCode,
    addressCountry: SITE.countryCode,
  },
  touristType: ['Families', 'Nature lovers', 'Transit passengers', 'Backpackers'],
  additionalProperty: [
    {
      '@type': 'PropertyValue',
      name: 'Airport proximity',
      value: 'Only 5-10 minutes by car from Juan Santamaría International Airport (SJO)',
    },
    {
      '@type': 'PropertyValue',
      name: 'Google Maps Plus Code',
      value: SITE.plusCode,
    },
  ],
  containsPlace: {
    '@type': 'TouristAttraction',
    name: 'Central Kiosk (Quiosco)',
    description:
      'The iconic octagonal domed kiosk at the center of the park, built during the late-19th-century urban beautification of Alajuela.',
  },
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // Localized FAQPage structured data (mirrors the visible FAQ section).
  const rawMessages = messages as any;
  const faqItems: Array<{ q: string; a: string }> = Array.isArray(rawMessages?.faq?.items)
    ? rawMessages.faq.items.filter(
        (it: any) => it && typeof it.q === 'string' && typeof it.a === 'string'
      )
    : [];
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((it) => ({
      '@type': 'Question',
      name: it.q,
      acceptedAnswer: { '@type': 'Answer', text: it.a },
    })),
  };

  const langMap: Record<string, string> = {
    zh: 'zh-CN',
    en: 'en',
    es: 'es',
    fr: 'fr',
  };

  return (
    <html lang={langMap[locale] || 'zh-CN'} suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />

        {/* GA4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${SITE.ga4Id}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.dataLayer = window.dataLayer || []; function gtag(){dataLayer.push(arguments);} gtag('js', new Date()); gtag('config', '${SITE.ga4Id}', { anonymize_ip: true });`,
          }}
        />

        {/* PWA registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if ('serviceWorker' in navigator) { window.addEventListener('load', function () { navigator.serviceWorker.register('${SITE.swPath}').catch(function () {}); }); }`,
          }}
        />

        {/* Theme bootstrap (no-flash) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch(e) {}
              })();
            `,
          }}
        />

        {/* Structured data: TouristAttraction entity */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Structured data: localized FAQPage (rich results) */}
        {faqLd.mainEntity.length > 0 && (
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
          />
        )}
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
