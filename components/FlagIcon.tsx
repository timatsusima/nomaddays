'use client';

interface FlagIconProps {
  code: string; // ISO Alpha-2
  size?: number;
}

// Lightweight inline SVG flags (subset); fallback to emoji
const SVG_FLAGS: Record<string, string> = {
  // Thailand
  TH: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#A51931"/><rect y="8" width="60" height="24" fill="#F4F5F8"/><rect y="14" width="60" height="12" fill="#2D2A4A"/></svg>',
  // Russia
  RU: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#D52B1E"/><rect y="0" width="60" height="26.6" fill="#0039A6"/><rect y="0" width="60" height="13.3" fill="#FFFFFF"/></svg>',
  // Belarus (approx.)
  BY: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#D22730"/><rect y="24" width="60" height="16" fill="#00A650"/><rect width="10" height="40" fill="#ffffff"/></svg>',
  // Italy
  IT: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="20" height="40" x="0" fill="#009246"/><rect width="20" height="40" x="20" fill="#FFFFFF"/><rect width="20" height="40" x="40" fill="#CE2B37"/></svg>',
  // Turkey (simple)
  TR: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#E30A17"/><circle cx="26" cy="20" r="9" fill="#fff"/><circle cx="29" cy="20" r="7" fill="#E30A17"/><polygon points="37,20 46,16 46,24" fill="#fff"/></svg>',
  // Georgia (very simplified)
  GE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#fff"/><rect x="26" width="8" height="40" fill="#E30A17"/><rect y="16" width="60" height="8" fill="#E30A17"/></svg>',
  // UAE (very simplified)
  AE: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#000"/><rect y="13.3" width="60" height="13.4" fill="#FFF"/><rect y="26.6" width="60" height="13.4" fill="#00732F"/><rect width="15" height="40" fill="#FF0000"/></svg>'
};

export default function FlagIcon({ code, size = 16 }: FlagIconProps) {
  const cc = (code || '').toUpperCase();
  const svg = SVG_FLAGS[cc];
  const height = (size * 2.66) / 4; // соотношение 3:2 приблизительно
  if (svg) {
    return (
      <span
        aria-hidden
        style={{ width: size * 1.6, height, display: 'inline-block', lineHeight: 0 }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    );
  }
  // Fallback emoji
  const OFFSET = 127397; // Regional Indicator Symbol Letter A
  const A = 65;
  const emoji = cc.length === 2
    ? String.fromCodePoint(cc.charCodeAt(0) - A + OFFSET) + String.fromCodePoint(cc.charCodeAt(1) - A + OFFSET)
    : '🏳️';
  return <span aria-hidden style={{ fontSize: size, lineHeight: `${height}px`, display: 'inline-block' }}>{emoji}</span>;
}


