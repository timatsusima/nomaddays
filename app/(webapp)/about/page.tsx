'use client';

import Navigation from '@/components/Navigation';

export default function AboutPage() {
  return (
    <div className="tg-webapp">
      <div className="card mb-4">
        <div className="card-title">NomadDays — как это работает</div>
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>Приложение помогает цифровым кочевникам следить за днями по странам и соблюдать правила резиденции.</p>
          <p>• Локальные данные: гражданство, страна ВНЖ/РВП, поездки — хранятся на вашем устройстве.</p>
          <p>• Расчёты: при наличии серверного ключа OpenAI — прогноз делает ИИ, иначе — локальный движок правил.</p>
          <p>• Примеры правил: Шенген 90/180, минимум 183 дня в стране резиденции за 12 месяцев и др.</p>
        </div>
      </div>

      <div className="card mb-4">
        <div className="card-title">Подсказки</div>
        <div className="text-sm text-[var(--text-secondary)] space-y-2">
          <p>• Добавьте поездки за последние 12 месяцев — расчёты будут точнее.</p>
          <p>• Планировщик использует текущие поездки и выбранные даты, чтобы подсказать риски.</p>
          <p>• Можно сбросить профиль и пройти онбординг заново внизу главной страницы.</p>
        </div>
      </div>

      <Navigation />
    </div>
  );
}


