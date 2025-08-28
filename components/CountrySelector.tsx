// CountrySelector v3.1 - COMPLETE REDESIGN
// Build: 2024-08-27 21:10
// Cache: NO-CACHE-HEADERS

'use client';

import React, { useState, useRef, useEffect } from 'react';

export interface Country {
  code: string;
  name: string;
  flag: string;
}

export interface CountrySelectorProps {
  value: string;
  onChange: (countryCode: string) => void;
  placeholder?: string;
}

const COUNTRIES: Country[] = [
  { code: 'DE', name: 'Германия', flag: '🇩🇪' },
  { code: 'FR', name: 'Франция', flag: '🇫🇷' },
  { code: 'IT', name: 'Италия', flag: '🇮🇹' },
  { code: 'ES', name: 'Испания', flag: '🇪🇸' },
  { code: 'NL', name: 'Нидерланды', flag: '🇳🇱' },
  { code: 'BE', name: 'Бельгия', flag: '🇧🇪' },
  { code: 'AT', name: 'Австрия', flag: '🇦🇹' },
  { code: 'CH', name: 'Швейцария', flag: '🇨🇭' },
  { code: 'PL', name: 'Польша', flag: '🇵🇱' },
  { code: 'CZ', name: 'Чехия', flag: '🇨🇿' },
  { code: 'HU', name: 'Венгрия', flag: '🇭🇺' },
  { code: 'SK', name: 'Словакия', flag: '🇸🇰' },
  { code: 'SI', name: 'Словения', flag: '🇸🇮' },
  { code: 'HR', name: 'Хорватия', flag: '🇭🇷' },
  { code: 'BG', name: 'Болгария', flag: '🇧🇬' },
  { code: 'RO', name: 'Румыния', flag: '🇷🇴' },
  { code: 'GR', name: 'Греция', flag: '🇬🇷' },
  { code: 'PT', name: 'Португалия', flag: '🇵🇹' },
  { code: 'IE', name: 'Ирландия', flag: '🇮🇪' },
  { code: 'FI', name: 'Финляндия', flag: '🇫🇮' },
  { code: 'SE', name: 'Швеция', flag: '🇸🇪' },
  { code: 'DK', name: 'Дания', flag: '🇩🇰' },
  { code: 'NO', name: 'Норвегия', flag: '🇳🇴' },
  { code: 'IS', name: 'Исландия', flag: '🇮🇸' },
  { code: 'EE', name: 'Эстония', flag: '🇪🇪' },
  { code: 'LV', name: 'Латвия', flag: '🇱🇻' },
  { code: 'LT', name: 'Литва', flag: '🇱🇹' },
  { code: 'LU', name: 'Люксембург', flag: '🇱🇺' },
  { code: 'MT', name: 'Мальта', flag: '🇲🇹' },
  { code: 'CY', name: 'Кипр', flag: '🇨🇾' },
  { code: 'US', name: 'США', flag: '🇺🇸' },
  { code: 'CA', name: 'Канада', flag: '🇨🇦' },
  { code: 'GB', name: 'Великобритания', flag: '🇬🇧' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷' },
  { code: 'IL', name: 'Израиль', flag: '🇮🇱' },
  { code: 'AE', name: 'ОАЭ', flag: '🇦🇪' },
  { code: 'TH', name: 'Таиланд', flag: '🇹🇭' },
  { code: 'VN', name: 'Вьетнам', flag: '🇻🇳' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵' },
  { code: 'KR', name: 'Южная Корея', flag: '🇰🇷' },
  { code: 'SG', name: 'Сингапур', flag: '🇸🇬' },
  { code: 'AU', name: 'Австралия', flag: '🇦🇺' },
  { code: 'NZ', name: 'Новая Зеландия', flag: '🇳🇿' },
];

export function CountrySelector({ value, onChange, placeholder = 'Выберите страну' }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = COUNTRIES.find(country => country.code === value);
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (country: Country) => {
    onChange(country.code);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 text-left bg-[var(--bg)] border border-[var(--border)] rounded-xl hover:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] transition-all duration-200 text-[15px] overflow-hidden"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-3">
            <span className="text-xl leading-none">{selectedCountry.flag}</span>
            <span className="text-[var(--text)] font-semibold flex-1 truncate leading-none">{selectedCountry.name}</span>
            <span className="text-[var(--text-secondary)] text-sm leading-none">({selectedCountry.code})</span>
          </div>
        ) : (
          <span className="text-[var(--text-secondary)] leading-none">{placeholder}</span>
        )}
        <svg
          className={`w-5 h-5 text-[var(--text-secondary)] transition-transform duration-200 ml-auto ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
          <div className="sticky top-0 p-3 border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-3 bg-[var(--bg)] border border-[var(--border)] rounded-full px-4 h-12">
              <svg className="w-5 h-5 text-[var(--text-secondary)] flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
              <input
                type="text"
                placeholder="Поиск страны / региона"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-[15px] text-[var(--text)] placeholder-[var(--text-secondary)]"
                autoFocus
              />
            </div>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-6 text-center text-[var(--text-secondary)] text-sm">Ничего не найдено</div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-4 text-left hover:bg-[var(--hover)] focus:bg-[var(--hover)] focus:outline-none transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div className="flex items-center gap-4">
                    <span className="text-2xl flex-shrink-0">{country.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-[var(--text)] text-[16px] leading-tight">{country.name}</div>
                      <div className="text-[13px] text-[var(--text-secondary)] leading-tight mt-1">{country.code}</div>
                    </div>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
