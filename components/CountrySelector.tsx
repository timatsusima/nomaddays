'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/Button';

interface Country {
  code: string;
  name: string;
  flag: string;
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
  { code: 'AU', name: 'Австралия', flag: '🇦🇺' },
  { code: 'NZ', name: 'Новая Зеландия', flag: '🇳🇿' },
  { code: 'JP', name: 'Япония', flag: '🇯🇵' },
  { code: 'KR', name: 'Южная Корея', flag: '🇰🇷' },
  { code: 'SG', name: 'Сингапур', flag: '🇸🇬' },
  { code: 'TH', name: 'Таиланд', flag: '🇹🇭' },
  { code: 'VN', name: 'Вьетнам', flag: '🇻🇳' },
  { code: 'MY', name: 'Малайзия', flag: '🇲🇾' },
  { code: 'ID', name: 'Индонезия', flag: '🇮🇩' },
  { code: 'PH', name: 'Филиппины', flag: '🇵🇭' },
  { code: 'IN', name: 'Индия', flag: '🇮🇳' },
  { code: 'BR', name: 'Бразилия', flag: '🇧🇷' },
  { code: 'AR', name: 'Аргентина', flag: '🇦🇷' },
  { code: 'MX', name: 'Мексика', flag: '🇲🇽' },
  { code: 'CL', name: 'Чили', flag: '🇨🇱' },
  { code: 'CO', name: 'Колумбия', flag: '🇨🇴' },
  { code: 'PE', name: 'Перу', flag: '🇵🇪' },
  { code: 'UY', name: 'Уругвай', flag: '🇺🇾' },
  { code: 'ZA', name: 'ЮАР', flag: '🇿🇦' },
  { code: 'EG', name: 'Египет', flag: '🇪🇬' },
  { code: 'MA', name: 'Марокко', flag: '🇲🇦' },
  { code: 'TR', name: 'Турция', flag: '🇹🇷' },
  { code: 'IL', name: 'Израиль', flag: '🇮🇱' },
  { code: 'AE', name: 'ОАЭ', flag: '🇦🇪' },
  { code: 'SA', name: 'Саудовская Аравия', flag: '🇸🇦' },
  { code: 'QA', name: 'Катар', flag: '🇶🇦' },
  { code: 'KW', name: 'Кувейт', flag: '🇰🇼' },
  { code: 'BH', name: 'Бахрейн', flag: '🇧🇭' },
  { code: 'OM', name: 'Оман', flag: '🇴🇲' },
  { code: 'JO', name: 'Иордания', flag: '🇯🇴' },
  { code: 'LB', name: 'Ливан', flag: '🇱🇧' },
  { code: 'SY', name: 'Сирия', flag: '🇸🇾' },
  { code: 'IQ', name: 'Ирак', flag: '🇮🇶' },
  { code: 'IR', name: 'Иран', flag: '🇮🇷' },
  { code: 'AF', name: 'Афганистан', flag: '🇦🇫' },
  { code: 'PK', name: 'Пакистан', flag: '🇵🇰' },
  { code: 'BD', name: 'Бангладеш', flag: '🇧🇩' },
  { code: 'LK', name: 'Шри-Ланка', flag: '🇱🇰' },
  { code: 'NP', name: 'Непал', flag: '🇳🇵' },
  { code: 'BT', name: 'Бутан', flag: '🇧🇹' },
  { code: 'MM', name: 'Мьянма', flag: '🇲🇲' },
  { code: 'LA', name: 'Лаос', flag: '🇱🇦' },
  { code: 'KH', name: 'Камбоджа', flag: '🇰🇭' },
  { code: 'MN', name: 'Монголия', flag: '🇲🇳' },
  { code: 'KZ', name: 'Казахстан', flag: '🇰🇿' },
  { code: 'UZ', name: 'Узбекистан', flag: '🇺🇿' },
  { code: 'KG', name: 'Кыргызстан', flag: '🇰🇬' },
  { code: 'TJ', name: 'Таджикистан', flag: '🇹🇯' },
  { code: 'TM', name: 'Туркменистан', flag: '🇹🇲' },
  { code: 'AZ', name: 'Азербайджан', flag: '🇦🇿' },
  { code: 'GE', name: 'Грузия', flag: '🇬🇪' },
  { code: 'AM', name: 'Армения', flag: '🇦🇲' },
  { code: 'RU', name: 'Россия', flag: '🇷🇺' },
  { code: 'BY', name: 'Беларусь', flag: '🇧🇾' },
  { code: 'UA', name: 'Украина', flag: '🇺🇦' },
  { code: 'MD', name: 'Молдова', flag: '🇲🇩' },
  { code: 'RS', name: 'Сербия', flag: '🇷🇸' },
  { code: 'ME', name: 'Черногория', flag: '🇲🇪' },
  { code: 'BA', name: 'Босния и Герцеговина', flag: '🇧🇦' },
  { code: 'MK', name: 'Северная Македония', flag: '🇲🇰' },
  { code: 'AL', name: 'Албания', flag: '🇦🇱' },
  { code: 'XK', name: 'Косово', flag: '🇽🇰' },
  { code: 'AD', name: 'Андорра', flag: '🇦🇩' },
  { code: 'LI', name: 'Лихтенштейн', flag: '🇱🇮' },
  { code: 'MC', name: 'Монако', flag: '🇲🇨' },
  { code: 'SM', name: 'Сан-Марино', flag: '🇸🇲' },
  { code: 'VA', name: 'Ватикан', flag: '🇻🇦' },
  { code: 'OUTSIDE', name: 'Вне РК', flag: '🌍' }
];

interface CountrySelectorProps {
  value?: string;
  onChange: (countryCode: string) => void;
  placeholder?: string;
}

export function CountrySelector({ value, onChange, placeholder = 'Выберите страну' }: CountrySelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selectedCountry = COUNTRIES.find(c => c.code === value);
  
  const filteredCountries = COUNTRIES.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    country.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        className="w-full h-11 px-4 text-left bg-[var(--bg)] border border-[var(--border)] rounded-lg hover:border-[var(--brand)] focus:outline-none focus:ring-2 focus:ring-[var(--brand)] transition-colors text-[15px] overflow-hidden"
      >
        {selectedCountry ? (
          <div className="flex items-center gap-3">
            <span className="text-lg leading-none">{selectedCountry.flag}</span>
            <span className="text-[var(--text)] font-semibold flex-1 truncate leading-none">{selectedCountry.name}</span>
            <span className="text-[var(--text-secondary)] text-sm leading-none">({selectedCountry.code})</span>
          </div>
        ) : (
          <span className="text-[var(--text-secondary)] leading-none">Выберите страну</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden">
          <div className="sticky top-0 p-2 border-b border-[var(--border)] bg-[var(--surface)]">
            <div className="flex items-center gap-2 bg-[var(--bg)] border border-[var(--border)] rounded-full px-3 h-11">
              <svg className="w-5 h-5 text-[var(--text-secondary)]" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"/></svg>
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
          
          <div className="max-h-72 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
                Ничего не найдено
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-4 py-3 text-left hover:bg-[var(--hover)] focus:bg-[var(--hover)] focus:outline-none transition-colors border-b border-[var(--border)] last:border-b-0"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{country.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-[var(--text)] text-[16px]">{country.name}</div>
                      <div className="text-[13px] text-[var(--text-secondary)]">{country.code}</div>
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
