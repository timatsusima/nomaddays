// Navigation v3.0 - FORCE REFRESH
// Build: 2024-08-27 21:00
// Cache: NO-CACHE-HEADERS

'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Главная', icon: '🏠' },
    { href: '/trips', label: 'Поездки', icon: '📍' },
    { href: '/planner', label: 'Планировщик', icon: '📅' },
    { href: '/rules', label: 'Правила', icon: '⭐' },
    { href: '/import', label: 'Импорт', icon: '📥' },
  ];

  return (
    <nav className="nav-bar">
      <div className="flex justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-item flex flex-col items-center p-3 min-w-[60px] ${
                isActive ? 'active' : ''
              }`}
            >
              <span className="text-xl mb-1">{item.icon}</span>
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
