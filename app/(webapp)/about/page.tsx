'use client';

import Link from 'next/link';
import Navigation from '@/components/Navigation';
import dynamic from 'next/dynamic';
import { useEffect, useMemo, useRef, useState } from 'react';

const Lottie: any = dynamic(() => import('lottie-react').then(m => m.default), { ssr: false });

const TG_BOT = process.env.NEXT_PUBLIC_TG_BOT || 'nomaddays_support_bot';

export default function AboutPage() {
  const [animationData, setAnimationData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState<false | 'issue' | 'improve'>(false);
  const [message, setMessage] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [toast, setToast] = useState<{ title: string; message: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    let ignore = false;
    fetch('/animations/splash_screen.json')
      .then((res) => res.json())
      .then((data) => { if (!ignore) setAnimationData(data); })
      .catch(() => { /* fallback оставим пустым */ });
    return () => { ignore = true; };
  }, []);

  const releaseNotes = useMemo(() => [
    {
      version: '1.0.0',
      date: '2025‑08‑30',
      items: [
        'Страница «О приложении» в iOS‑стиле',
        'Новый сплеш‑экран (Lottie) и full‑bleed баннер',
        'Удалён пункт «Импорт», стабильная нижняя навигация',
        'Синхронизация дизайн‑токенов (цвета, шрифты SF Pro)'
      ]
    }
  ], []);

  const getTelegramUser = () => {
    try {
      const wa = (window as any).Telegram?.WebApp;
      const u = wa?.initDataUnsafe?.user;
      if (!u) return null;
      return { id: u.id, firstName: u.first_name, lastName: u.last_name, username: u.username };
    } catch { return null; }
  };

  const handleOpenChat = (preset: 'issue' | 'improve') => {
    setIsModalOpen(preset);
  };

  const submitFeedback = async () => {
    if (!message.trim() && !file) return;
    try {
      setSending(true);

      if (file) {
        const fd = new FormData();
        fd.append('type', isModalOpen === 'issue' ? 'issue' : 'improve');
        fd.append('message', message);
        fd.append('url', typeof window !== 'undefined' ? window.location.href : '');
        fd.append('ua', typeof navigator !== 'undefined' ? navigator.userAgent : '');
        const user = getTelegramUser();
        if (user) fd.append('user', JSON.stringify(user));
        fd.append('file', file);
        const res = await fetch('/api/support/send', { method: 'POST', body: fd });
        if (res.ok) {
          setSent(true); setMessage(''); setFile(null);
          setIsModalOpen(false);
          setToast({ title: 'Сообщение отправлено', message: 'Спасибо! Мы свяжемся с вами при необходимости.' });
          return;
        }
      }

      // Без файла — JSON
      const res = await fetch('/api/support/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: isModalOpen === 'issue' ? 'issue' : 'improve',
          message,
          user: getTelegramUser() || undefined,
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          ua: typeof navigator !== 'undefined' ? navigator.userAgent : undefined
        })
      });
      if (res.ok) {
        setSent(true); setMessage('');
        setIsModalOpen(false);
        setToast({ title: 'Сообщение отправлено', message: 'Спасибо! Мы свяжемся с вами при необходимости.' });
      }
    } finally {
      setSending(false);
    }
  };

  const openGallery = () => fileInputRef.current?.click();
  const openCamera = () => cameraInputRef.current?.click();

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

        {/* Последние улучшения */}
        <section className="card mb-4">
          <h2 className="card-title">Последние улучшения</h2>
          <div className="space-y-4">
            {releaseNotes.map((rel) => (
              <div key={rel.version} className="rounded-lg border border-[var(--border)] p-3 bg-[var(--bg)]">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">v{rel.version}</div>
                  <div className="text-xs text-[var(--text-secondary)]">{rel.date}</div>
                </div>
                <ul className="list-disc pl-5 text-sm text-[var(--text-secondary)] space-y-1">
                  {rel.items.map((i, idx) => <li key={idx}>{i}</li>)}
                </ul>
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
            <button onClick={() => handleOpenChat('issue')} className="btn w-full text-center">Сообщить об ошибке</button>
            <button onClick={() => handleOpenChat('improve')} className="btn-secondary w-full text-center rounded-full py-3">Предложить улучшение</button>
          </div>
        </section>

        {/* Footer note */}
        <div className="text-center text-[var(--text-secondary)] text-sm mb-6">
          Сделано с <span className="text-[var(--red)]">❤</span> для digital-номадов
        </div>
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/50 flex items-end sm:items-center sm:justify-center">
          <div className="w-full sm:w-[520px] bg-[var(--bg)] rounded-t-2xl sm:rounded-2xl p-4 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-3">
              <div className="text-base font-semibold">{isModalOpen === 'issue' ? 'Сообщить об ошибке' : 'Предложить улучшение'}</div>
              <button onClick={() => { setIsModalOpen(false); setSent(false); }} className="w-9 h-9 rounded-full hover:bg-[var(--hover)]">✕</button>
            </div>
            {sent ? (
              <div className="text-sm text-[var(--text-secondary)]">
                Спасибо! Ваше сообщение отправлено. Мы свяжемся с вами при необходимости.
              </div>
            ) : (
              <>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Опишите проблему или идею..."
                  className="w-full h-28 p-3 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] mb-3"
                />

                {/* Attach actions */}
                <div className="flex items-center gap-2 mb-3">
                  <button type="button" onClick={openGallery} className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)] text-sm">📎 Из галереи</button>
                  <button type="button" onClick={openCamera} className="px-3 py-2 rounded-full border border-[var(--border)] bg-[var(--bg)] text-sm">📷 Камера</button>
                  {file && (
                    <div className="ml-auto text-xs text-[var(--text-secondary)] flex items-center gap-2">
                      <span className="truncate max-w-[140px]">{file.name}</span>
                      <button onClick={() => setFile(null)} className="px-2 py-1 rounded-full border border-[var(--border)]">×</button>
                    </div>
                  )}
                </div>

                {/* Hidden inputs */}
                <input ref={fileInputRef} type="file" accept="image/*,video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />
                <input ref={cameraInputRef} type="file" accept="image/*,video/*" capture="environment" onChange={(e) => setFile(e.target.files?.[0] || null)} className="hidden" />

                <button onClick={submitFeedback} disabled={sending || (!message.trim() && !file)} className="btn w-full">
                  {sending ? 'Отправка...' : 'Отправить'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Toast banner above nav */}
      {toast && (
        <div className="fixed left-4 right-4 bottom-24 sm:bottom-24 z-[60]">
          <div className="bg-[var(--bg)] border border-[var(--border)] rounded-2xl shadow-md p-4 flex items-start gap-3">
            <div className="flex-1">
              <div className="font-semibold text-[var(--text)] mb-1">{toast.title}</div>
              <div className="text-sm text-[var(--text-secondary)]">{toast.message}</div>
            </div>
            <button onClick={() => setToast(null)} className="btn-secondary px-4 py-2 rounded-full">Ок</button>
          </div>
        </div>
      )}

      <Navigation />
    </div>
  );
}


