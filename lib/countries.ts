export const COUNTRY_MAP: Record<string, string> = {
  KZ: 'Казахстан',
  RU: 'Россия',
  UA: 'Украина',
  BY: 'Беларусь',
  TR: 'Турция',
  IL: 'Израиль',
  AE: 'ОАЭ',
  TH: 'Таиланд',
  VN: 'Вьетнам',
  JP: 'Япония',
  KR: 'Южная Корея',
  SG: 'Сингапур',
  AU: 'Австралия',
  NZ: 'Новая Зеландия',
  DE: 'Германия',
  FR: 'Франция',
  IT: 'Италия',
  ES: 'Испания',
  NL: 'Нидерланды',
  BE: 'Бельгия',
  AT: 'Австрия',
  CH: 'Швейцария',
  PL: 'Польша',
  CZ: 'Чехия',
  HU: 'Венгрия',
  SK: 'Словакия',
  PT: 'Португалия',
  IE: 'Ирландия',
  FI: 'Финляндия',
  SE: 'Швеция',
  DK: 'Дания',
  NO: 'Норвегия',
  US: 'США',
  CA: 'Канада',
  GB: 'Великобритания'
};

export function resolveCountryName(code: string): string {
  const normalized = String(code).toUpperCase();
  return COUNTRY_MAP[normalized] ?? normalized;
}

export function countryFlag(code: string): string {
  const cc = String(code || '').toUpperCase();
  if (cc.length !== 2) return '🏳️';
  const A = 65; // 'A'
  const OFFSET = 127397; // regional indicator offset
  const chars = cc.split('').map((c) => String.fromCodePoint(c.charCodeAt(0) - A + OFFSET));
  return chars.join('');
}

export function countryColor(code: string): string {
  // Deterministic, higher-contrast color per country (works on dark bg)
  const cc = String(code || '').toUpperCase();
  let hash = 0;
  for (let i = 0; i < cc.length; i++) hash = (hash * 31 + cc.charCodeAt(i)) >>> 0;
  const hue = hash % 360;
  const saturation = 85;
  const lightness = 60;
  return `hsl(${hue} ${saturation}% ${lightness}%)`;
}


