import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const SITE_URL = 'https://centralparkalajuela.com';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const messages = (await import(`@/messages/${locale}.json`)).default;
  const baseUrl = SITE_URL;

  const zhUrl = `${baseUrl}/zh`;
  const enUrl = `${baseUrl}/en`;
  const esUrl = `${baseUrl}/es`;

  let selfUrl = zhUrl;
  if (locale === 'en') selfUrl = enUrl;
  else if (locale === 'es') selfUrl = esUrl;

  const localeMap: Record<string, string> = {
    'zh': 'zh_CN',
    'en': 'en_US',
    'es': 'es_MX',
  };

  return {
    title: messages.meta.title,
    description: messages.meta.description,
    alternates: {
      canonical: selfUrl,
      languages: {
        'zh': zhUrl,
        'en': enUrl,
        'es': esUrl,
        'x-default': zhUrl,
      } as Record<string, string>,
    },
    openGraph: {
      title: messages.meta.title,
      description: messages.meta.description,
      url: selfUrl,
      siteName: "Parque Central de Alajuela",
      locale: localeMap[locale] || 'zh_CN',
      type: 'website',
    },
  };
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'TouristAttraction',
  name: 'Parque Central de Alajuela (Central Park Alajuela)',
  alternateName: ['Central Park Alajuela', 'Parque Central', '阿拉胡埃拉中央公园', 'Ciudad de los Mangos'],
  description: 'A free, 24-hour urban park in the heart of Alajuela, Costa Rica — the "City of Mangoes" (Ciudad de los Mangos) — known for its century-old mango trees, the central octagonal kiosk, and abundant urban wildlife including sloths, green iguanas and red-fronted parakeets.',
  url: SITE_URL,
  image: `${SITE_URL}/gallery/central-park-alajuela-1.jpg`,
  isAccessibleForFree: true,
  publicAccess: true,
  smokingAllowed: false,
  openingHours: '24/7',
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  ],
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 10.0158,
    longitude: -84.211,
  },
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Parque Central',
    addressLocality: 'Alajuela',
    addressRegion: 'Alajuela',
    postalCode: '20101',
    addressCountry: 'CR',
  },
  touristType: ['Families', 'Nature lovers', 'Transit passengers', 'Backpackers'],
  additionalProperty: {
    '@type': 'PropertyValue',
    name: 'Airport proximity',
    value: 'Only 5-10 minutes by car from Juan Santamaría International Airport (SJO)',
  },
  containsPlace: {
    '@type': 'TouristAttraction',
    name: 'Central Kiosk (Quiosco)',
    description: 'The iconic octagonal domed kiosk at the center of the park, built during the late-19th-century urban beautification of Alajuela.',
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

  const langMap: Record<string, string> = {
    'zh': 'zh-CN',
    'en': 'en',
    'es': 'es',
  };

  return (
    <html lang={langMap[locale] || 'zh-CN'} suppressHydrationWarning>
      <head>
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX" crossOrigin="anonymous" />
        <meta name="google-adsense-account" content="ca-pub-XXXXXXXXXX" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
      </head>
      <body className="min-h-screen">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
