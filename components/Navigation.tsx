'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const pathname = usePathname();

  const navItems = [
    { href: '/dashboard', label: 'Главная', icon: '🏠' },
    { href: '/trips', label: 'Поездки', icon: '📍' },
    { href: '/planner', label: 'Планировщик', icon: '🗓️' },
    { href: '/rules', label: 'Правила', icon: '⭐' },
    { href: '/import', label: 'Импорт', icon: '✉️' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--bg)] border-t border-[var(--border)] z-50">
      <div className="flex justify-around items-center py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text)]'
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
