/**
 * Single-attraction SEO entity binding config.
 *
 * Every value in this table maps 1:1 to a placeholder of the SEO template:
 *   {{DOMAIN_NAME}}, {{ATTRACTION_FULL_NAME}}, {{ATTRACTION_SHORT_NAME}} ...
 * Keep name / address / geo in sync with the official Google Maps profile
 * (NAP consistency) so Google can reliably associate the domain with the
 * physical attraction entity.
 */
export const SITE = {
  // {{DOMAIN_NAME}}
  domainName: 'centralparkalajuela.com',

  // Full site URL (HTTPS)
  url: 'https://centralparkalajuela.com',

  // {{ATTRACTION_FULL_NAME}} — official / Spanish full name
  attractionFullName: 'Parque Central de Alajuela',

  // {{ATTRACTION_SHORT_NAME}} — common name matching the domain
  attractionShortName: 'Central Park Alajuela',

  // {{CITY_NAME}}
  city: 'Alajuela',

  // {{STATE_PROVINCE}}
  province: 'Alajuela',

  // {{COUNTRY_NAME}}
  country: 'Costa Rica',

  // {{COUNTRY_CODE_2LETTER}}
  countryCode: 'CR',

  // {{POSTAL_CODE}}
  postalCode: '20101',

  // Google Maps Plus Code (official listing address)
  plusCode: '2Q8P+HFR',

  // {{LATITUDE}} / {{LONGITUDE}} — exact coordinates of the Maps listing
  latitude: 10.0164835,
  longitude: -84.213869,

  // {{MAPS_SHARE_URL}}
  mapsShareUrl: 'https://maps.app.goo.gl/GimLtykHVTQRwsi38',

  // {{MAPS_EMBED_SRC}} — src of the official Google Maps embed iframe
  mapsEmbedSrc:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d6983.191649948381!2d-84.213869!3d10.016483500000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0f9c458871b9f%3A0x57d47c454ef76378!2sCentral%20Park%20Alajuela!5e1!3m2!1szh-CN!2s!4v1788936716401!5m2!1szh-CN!2s',

  // Google review data shown on the page (synced with Google Maps listing)
  rating: '4.4',
  reviewCount: '5,934',
  // Date the rating snapshot was last verified against the official listing.
  ratingVerified: 'octubre 2026',

  // {{NEARBY_LANDMARK_1}} / {{NEARBY_LANDMARK_2}}
  landmark1: 'Alajuela Cathedral (Catedral de la Virgen del Pilar)',
  landmark2: 'Juan Santamaría Historical & Cultural Museum',

  // {{GOVT_TOURISM_URL}} — official tourism portals (.go.cr / national board)
  govtTourismUrl: 'https://www.visitcostarica.com/',
  municipalityUrl: 'https://www.munialajuela.go.cr/',

  // OG / schema image (absolute URL used in head; /gallery paths for <img>)
  heroImage: '/gallery/central-park-alajuela-1.jpg',
  heroImageAbsolute: 'https://centralparkalajuela.com/gallery/central-park-alajuela-1.jpg',

  // GA4 measurement id
  ga4Id: 'G-HXM22WWPKP',

  // PWA
  manifestPath: '/manifest.webmanifest',
  swPath: '/sw.js',
} as const;
