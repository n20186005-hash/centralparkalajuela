/**
 * Weather data layer (Open-Meteo). No API key required.
 *
 * NOTE: The site is statically exported, so the Server Component that calls
 * `fetchWeather()` fetches once at build time and bakes the result into the
 * HTML. The <WeatherLive /> client widget then re-fetches in the browser so
 * visitors always see fresh, real-time data. If the site is later hosted on a
 * Node server, the same Server Component fetch also works out of the box.
 */

export const WEATHER_PARK = {
  lat: 10.0164835,
  lon: -84.213869,
  timezone: 'America/Costa_Rica',
};

export type WeatherCategory =
  | 'clear'
  | 'partly'
  | 'cloudy'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'snow'
  | 'storm';

export interface WeatherDay {
  date: string; // YYYY-MM-DD
  code: number | null; // WMO weather code
  tmax: number | null;
  tmin: number | null;
  precip: number | null; // precipitation probability, percent
  uv: number | null; // daily max UV index
}

export interface WeatherData {
  temp: number | null;
  feels: number | null;
  humidity: number | null;
  wind: number | null; // km/h
  uv: number | null; // current UV index
  code: number | null;
  isDay: boolean;
  days: WeatherDay[];
}

export function weatherCategory(code: number | null | undefined): WeatherCategory {
  if (code === null || code === undefined) return 'cloudy';
  if (code === 0) return 'clear';
  if (code === 1 || code === 2) return 'partly';
  if (code === 3) return 'cloudy';
  if (code === 45 || code === 48) return 'fog';
  if (code === 51 || code === 53 || code === 55 || code === 56 || code === 57) return 'drizzle';
  if (
    code === 61 || code === 63 || code === 65 || code === 66 || code === 67 ||
    code === 80 || code === 81 || code === 82
  ) {
    return 'rain';
  }
  if (code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86) {
    return 'snow';
  }
  if (code === 95 || code === 96 || code === 99) return 'storm';
  return 'cloudy';
}

function buildUrl(): string {
  const p = new URLSearchParams({
    latitude: String(WEATHER_PARK.lat),
    longitude: String(WEATHER_PARK.lon),
    current:
      'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m,uv_index',
    daily:
      'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,uv_index_max',
    timezone: WEATHER_PARK.timezone,
    forecast_days: '7',
    wind_speed_unit: 'kmh',
  });
  return `https://api.open-meteo.com/v1/forecast?${p.toString()}`;
}

const num = (v: unknown): number | null => (typeof v === 'number' && isFinite(v) ? v : null);

export async function fetchWeather(timeoutMs = 8000): Promise<WeatherData | null> {
  try {
    const res = await fetch(buildUrl(), {
      cache: 'force-cache',
      signal: typeof AbortSignal.timeout === 'function' ? AbortSignal.timeout(timeoutMs) : undefined,
    });
    if (!res.ok) return null;
    const j = await res.json();
    const cur = j?.current ?? {};
    const daily = j?.daily ?? {};
    const times: unknown[] = daily.time ?? [];
    const days: WeatherDay[] = times.map((date, i) => ({
      date: String(date),
      code: num(daily.weather_code?.[i]),
      tmax: num(daily.temperature_2m_max?.[i]),
      tmin: num(daily.temperature_2m_min?.[i]),
      precip: num(daily.precipitation_probability_max?.[i]),
      uv: num(daily.uv_index_max?.[i]),
    }));
    return {
      temp: num(cur.temperature_2m),
      feels: num(cur.apparent_temperature),
      humidity: num(cur.relative_humidity_2m),
      wind: num(cur.wind_speed_10m),
      uv: num(cur.uv_index),
      code: num(cur.weather_code),
      isDay: cur.is_day === 1,
      days,
    };
  } catch {
    return null;
  }
}
