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


