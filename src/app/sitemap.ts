import { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://centralparkalajuela.com';
  const locales = ['es', 'en', 'zh', 'fr'];
  const routes = [
    '',
    '/horario-como-llegar',
    '/que-hacer-cerca',
    '/fotos',
    '/privacy-policy',
    '/terms-of-service',
    '/cookie-settings',
  ];

  const sitemap: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const route of routes) {
      sitemap.push({
        url: `${baseUrl}/${locale}${route}`,
        lastModified: new Date(),
        changeFrequency: route === '' ? 'weekly' : 'monthly',
        priority: route === '' ? 1 : 0.5,
      });
    }
  }

  return sitemap;
}
