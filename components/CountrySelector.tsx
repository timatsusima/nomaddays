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
        className="w-full h-10 px-3 text-left bg-white border border-gray-200 rounded-sm hover:border-blue-400 focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors text-sm overflow-hidden"
      >
        {selectedCountry ? (
          <div className="flex items-center space-x-2">
            <span className="text-base leading-none">{selectedCountry.flag}</span>
            <span className="text-gray-900 font-medium flex-1 truncate leading-none">{selectedCountry.name}</span>
            <span className="text-gray-500 text-xs leading-none">({selectedCountry.code})</span>
          </div>
        ) : (
          <span className="text-gray-500 leading-none">Выберите страну</span>
        )}
        <svg
          className={`ml-auto h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-sm shadow-lg max-h-56 overflow-hidden">
          <div className="sticky top-0 p-2 border-b border-gray-100 bg-gray-50">
            <input
              type="text"
              placeholder="Поиск страны..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-2 py-1.5 border border-gray-200 rounded-sm focus:outline-none focus:ring-1 focus:ring-blue-400 focus:border-blue-400 text-sm"
              autoFocus
            />
          </div>
          
          <div className="max-h-40 overflow-y-auto">
            {filteredCountries.length === 0 ? (
              <div className="p-3 text-center text-gray-500 text-sm">
                Страна не найдена
              </div>
            ) : (
              filteredCountries.map((country) => (
                <button
                  key={country.code}
                  type="button"
                  onClick={() => handleSelect(country)}
                  className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none transition-colors border-b border-gray-100 last:border-b-0 text-sm rounded-none"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-base leading-none">{country.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="font-medium text-gray-900 leading-tight">{country.name}</div>
                      <div className="text-xs text-gray-500">({country.code})</div>
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
