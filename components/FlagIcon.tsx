'use client';

interface FlagIconProps {
  code: string; // ISO Alpha-2
  size?: number;
}

// Lightweight inline SVG flags (subset); fallback to emoji
const SVG_FLAGS: Record<string, string> = {
  TH: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#A51931"/><rect y="8" width="60" height="24" fill="#F4F5F8"/><rect y="14" width="60" height="12" fill="#2D2A4A"/></svg>',
  RU: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 60 40"><rect width="60" height="40" fill="#D52B1E"/><rect y="0" width="60" height="26.6" fill="#0039A6"/><rect y="0" width="60" height="13.3" fill="#FFFFFF"/></svg>'
};

export default function FlagIcon({ code, size = 16 }: FlagIconProps) {
  const cc = (code || '').toUpperCase();
  const svg = SVG_FLAGS[cc];
  if (svg) {
    return (
      <span
        aria-hidden
        style={{ width: size, height: (size * 2.66) / 4, display: 'inline-block' }}
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
  return <span aria-hidden style={{ fontSize: size, lineHeight: 1 }}> {emoji} </span>;
}


