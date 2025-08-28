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
    <nav className="fixed bottom-0 left-0 right-0 bg-nomad-bg dark:bg-nomad-dark-bg border-t border-nomad-border dark:border-nomad-dark-border z-50 pb-safe-bottom">
      <div className="flex justify-around items-center py-2 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center p-2 rounded-lg transition-colors min-h-touch ${
                isActive
                  ? 'bg-nomad-brand/10 dark:bg-nomad-dark-brand/10 text-nomad-brand dark:text-nomad-dark-brand'
                  : 'text-nomad-text-secondary dark:text-nomad-dark-text-secondary hover:text-nomad-text dark:hover:text-nomad-dark-text'
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
