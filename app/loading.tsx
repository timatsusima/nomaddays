'use client';

import { useEffect, useState } from 'react';

export default function Loading() {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    // Показываем контент через небольшую задержку для плавности
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)] relative overflow-hidden">
      {/* Анимированный фон */}
      <div className="absolute inset-0">
        {/* Плавающие круги */}
        <div className="absolute top-20 left-20 w-4 h-4 bg-[var(--brand)] rounded-full animate-pulse opacity-30"></div>
        <div className="absolute top-40 right-32 w-3 h-3 bg-[var(--green)] rounded-full animate-pulse opacity-40 [animation-delay:1s]"></div>
        <div className="absolute bottom-32 left-32 w-5 h-5 bg-[var(--red)] rounded-full animate-pulse opacity-25 [animation-delay:2s]"></div>
        <div className="absolute bottom-20 right-20 w-2 h-2 bg-[var(--brand)] rounded-full animate-pulse opacity-50 [animation-delay:0.5s]"></div>
      </div>

      {/* Основной контент */}
      <div className={`text-center transition-all duration-1000 ${showContent ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
        {/* Анимированный логотип */}
        <div className="relative w-48 h-48 mb-8">
          {/* Центральная ракета */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-9xl animate-bounce">🚀</div>
          </div>
          
          {/* Вращающиеся орбиты */}
          <div className="absolute inset-0 border-2 border-[var(--brand)] rounded-full opacity-20 animate-spin"></div>
          <div className="absolute inset-4 border border-[var(--green)] rounded-full opacity-30 animate-spin [animation-direction:reverse] [animation-duration:3s]"></div>
          <div className="absolute inset-8 border border-[var(--red)] rounded-full opacity-25 animate-spin [animation-duration:4s]"></div>
          
          {/* Плавающие элементы */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-[var(--brand)] rounded-full animate-bounce"></div>
          </div>
          <div className="absolute top-1/4 right-0">
            <div className="w-3 h-3 bg-[var(--green)] rounded-full animate-bounce [animation-delay:0.3s]"></div>
          </div>
          <div className="absolute bottom-1/4 left-0">
            <div className="w-3 h-3 bg-[var(--red)] rounded-full animate-bounce [animation-delay:0.6s]"></div>
          </div>
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="w-4 h-4 bg-[var(--brand)] rounded-full animate-bounce [animation-delay:0.9s]"></div>
          </div>
        </div>
        
        {/* Название приложения */}
        <div className="mb-4">
          <div className="text-4xl font-bold tracking-wider text-[var(--brand)] animate-pulse">
            n0mad_days
          </div>
        </div>
        
        {/* Подзаголовок */}
        <div className="mb-8">
          <div className="text-lg text-[var(--text-secondary)] animate-fade-in">
            AI-помощник для digital-номадов
          </div>
        </div>
        
        {/* Индикатор загрузки */}
        <div className="flex items-center justify-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[var(--brand)] animate-bounce [animation-delay:0s]"></div>
          <div className="w-3 h-3 rounded-full bg-[var(--green)] animate-bounce [animation-delay:0.2s]"></div>
          <div className="w-3 h-3 rounded-full bg-[var(--red)] animate-bounce [animation-delay:0.4s]"></div>
        </div>
      </div>
      
      {/* Версия */}
      <div className="absolute bottom-4 right-4 text-xs text-[var(--text-secondary)]">
        v3.2
      </div>
    </div>
  );
}


