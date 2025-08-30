'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const Lottie: any = dynamic(() => import('lottie-react').then(m => m.default), { ssr: false });

export default function AboutPage() {
  const [animationData, setAnimationData] = useState<any>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/animations/splash_screen.json')
      .then((res) => res.json())
      .then((data) => { if (!ignore) setAnimationData(data); })
      .catch(() => { /* fallback оставим пустым */ });
    return () => { ignore = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--surface)] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-[var(--bg)]/80 backdrop-blur border-b border-[var(--border)]">
        <div className="px-4 h-14 flex items-center gap-3">
          <Link
            href="/dashboard"
            className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-[var(--hover)]"
            aria-label="Назад"
          >
            <span className="text-xl">←</span>
          </Link>
          <h1 className="text-lg font-semibold text-[var(--text)]">О приложении</h1>
        </div>
      </header>

      <main className="px-4 pt-6">
        {/* Hero: full-bleed Lottie */}
        <div className="text-center mb-6">
          <div
            className="mx-auto mb-3"
            style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', marginRight: 'calc(-50vw + 50%)', height: '220px' }}
          >
            {animationData ? (
              <Lottie animationData={animationData} loop autoplay style={{ width: '100%', height: '100%' }} />
            ) : (
              <div className="text-6xl">🚀</div>
            )}
          </div>
          {/* Убрали название n0mad_days под анимацией */}
          <div className="mt-2 text-[var(--text-secondary)]">AI-помощник для digital-номадов</div>
          <div className="mt-3 inline-flex items-center px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg)] text-xs text-[var(--text-secondary)]">
            Версия 1.0.0
          </div>
        </div>

        {/* Что делает приложение */}
        <section className="card mb-4">
          <h2 className="card-title">Что делает приложение</h2>
          <div className="space-y-4 text-[var(--text)]">
            <p className="text-[var(--text-secondary)]">
              n0mad_days помогает digital-номадам отслеживать время пребывания в разных странах
              и соблюдать визовые и резидентские требования.
            </p>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <span className="text-lg">📍</span>
                <div>
                  <div className="font-medium">Учёт поездок</div>
                  <div className="text-[var(--text-secondary)]">Автоматический подсчёт дней пребывания в каждой стране</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">⚖️</span>
                <div>
                  <div className="font-medium">Соблюдение правил</div>
                  <div className="text-[var(--text-secondary)]">Отслеживание визовых ограничений и требований резидентства</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">🤖</span>
                <div>
                  <div className="font-medium">ИИ-подсказки</div>
                  <div className="text-[var(--text-secondary)]">Персонализированные рекомендации и предупреждения</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-lg">📊</span>
                <div>
                  <div className="font-medium">Планирование</div>
                  <div className="text-[var(--text-secondary)]">Проверка будущих поездок на соответствие требованиям</div>
                </div>
              </li>
            </ul>
          </div>
        </section>

        {/* Приватность и безопасность */}
        <section className="card mb-4 border-[var(--green)]/30">
          <h2 className="card-title">Приватность и безопасность</h2>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <span className="text-[var(--green)]">🗂️</span>
              <div>
                <div className="font-medium">Локальное хранение</div>
                <div className="text-[var(--text-secondary)]">Все ваши данные хранятся только на вашем устройстве и никуда не передаются</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--green)]">🛡️</span>
              <div>
                <div className="font-medium">Без регистрации</div>
                <div className="text-[var(--text-secondary)]">Не требуется создавать аккаунт или предоставлять личную информацию</div>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[var(--green)]">📶</span>
              <div>
                <div className="font-medium">Автономная работа</div>
                <div className="text-[var(--text-secondary)]">Приложение работает офлайн, интернет нужен только для получения актуальной информации</div>
              </div>
            </li>
          </ul>
        </section>

        {/* Основные возможности */}
        <section className="card mb-4">
          <h2 className="card-title">Основные возможности</h2>
          <div className="grid grid-cols-2 gap-y-3 text-sm">
            {['Учёт поездок','Планировщик','Визовые правила','Уведомления','ИИ-анализ','Статистика'].map((item) => (
              <div key={item} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[var(--brand)]"></span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Поддержка */}
        <section className="card mb-6">
          <h2 className="card-title">Поддержка и обратная связь</h2>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Нашли ошибку или есть предложения по улучшению? Мы будем рады вашей обратной связи!
          </p>
          <div className="flex flex-col gap-3">
            <Link href="#" className="btn w-full text-center">Сообщить об ошибке</Link>
            <Link href="#" className="btn-secondary w-full text-center rounded-full py-3">Предложить улучшение</Link>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center text-[var(--text-secondary)] text-sm mb-6">
          Сделано с <span className="text-[var(--red)]">❤</span> для digital-номадов
        </div>
      </main>

      <Navigation />
    </div>
  );
}


