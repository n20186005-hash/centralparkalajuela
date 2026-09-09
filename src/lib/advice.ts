/**
 * Weather → visitor advice engine (today only).
 *
 * Rules live here as pure data logic; the translated copy lives in the
 * `weather.advice` message namespace and is looked up by `key` in the UI.
 *
 * Context: Central Park Alajuela is an urban city park. Copy was therefore
 * localized for walking / benches / shade / nearby indoor spots, and weather
 * risk is derived from local observations (storm, heavy rain, strong wind).
 * Open-Meteo alerts (METEOALARM / NWS) do not cover Costa Rica, so no fake
 * official "weather alert" is ever emitted.
 */

import { weatherCategory } from './weather';
import type { WeatherData } from './weather';

export type AdviceGroup = 'risk' | 'plan' | 'outfit' | 'gear';

export interface AdviceItem {
  group: AdviceGroup;
  key: string;
}

// WMO codes by intensity
const CODE_LIGHT = new Set([51, 53, 55, 56, 57, 61, 80]); // drizzle + light rain
const CODE_MODERATE = new Set([63, 81]); // moderate rain / showers
const CODE_HEAVY = new Set([65, 82]); // heavy rain / violent showers

export function weatherAdvice(data: WeatherData): AdviceItem[] {
  const items: AdviceItem[] = [];
  const add = (group: AdviceGroup, key: string) => items.push({ group, key });

  const code = data.code;
  const day = data.days?.[0];
  const precip = day?.precip ?? null;
  const tmax = day?.tmax ?? data.temp;
  const tmin = day?.tmin ?? data.temp;
  const uvMax = day?.uv ?? data.uv ?? null;
  const uv = data.uv ?? uvMax;
  const wind = data.wind;
  const cat = weatherCategory(code);

  const isStorm = cat === 'storm';
  const isHeavy = CODE_HEAVY.has(code as number);
  const isModerate = CODE_MODERATE.has(code as number);
  const isLight = CODE_LIGHT.has(code as number);
  const raining = isStorm || isHeavy || isModerate || isLight;
  const wind5to6 = wind !== null && wind >= 29 && wind < 50; // Beaufort 5–6
  const windRisk = wind !== null && wind >= 50; // Beaufort ≥ 7
  const strongSun = uv !== null && uv >= 6 && data.isDay;

  // ── Risk (top priority, shown first in a highlighted block) ────────────────
  if (isStorm) add('risk', 'riskStorm');
  if (isHeavy) add('risk', 'riskHeavyRain');
  if (windRisk) add('risk', 'riskWind');

  // ── Rain & precipitation ───────────────────────────────────────────────────
  if (!raining) {
    if (precip !== null && precip >= 60) {
      add('plan', 'planRainProb');
      add('gear', 'gearUmbrella');
    } else if (precip !== null && precip >= 40) {
      add('plan', 'planLightRain');
      add('gear', 'gearUmbrella');
    }
  } else if (isLight) {
    add('plan', 'planLightRain');
    add('gear', 'gearUmbrella');
  } else if (isModerate || isHeavy) {
    add('plan', 'planIndoorRain');
    add('gear', 'gearRaincoat');
  }

  // ── Heat ────────────────────────────────────────────────────────────────────
  if (tmax !== null && tmax >= 32) {
    add('outfit', 'outfitWarm');
    add('plan', 'planAvoidMidday');
    add('gear', 'gearHydrate');
  }

  // ── Strong sun ──────────────────────────────────────────────────────────────
  if (strongSun) add('gear', 'gearSun');

  // ── Day / night swing ───────────────────────────────────────────────────────
  if (tmax !== null && tmin !== null && tmax - tmin >= 8) {
    add('outfit', 'outfitLayers');
  }

  // ── Wind (only hats when 5–6; ≥7 already risk) ─────────────────────────────
  if (wind5to6) add('gear', 'gearWindHat');

  // ── Fog ─────────────────────────────────────────────────────────────────────
  if (cat === 'fog') add('plan', 'planFog');

  // ── Pleasant fallback: only when no weather needs an asterisk ──────────────
  const hasAdvice =
    items.some((i) => i.group === 'risk' || i.group === 'plan') || raining || cat === 'fog';
  const mildRain =
    (precip !== null && precip >= 40) || windRisk || (tmax !== null && tmax >= 32);
  if (!hasAdvice && !mildRain) add('plan', 'planNiceDay');

  return items;
}
