# NomadDays - Telegram Mini App для Digital Nomads

Telegram Mini App для отслеживания дней по странам и планирования поездок с учётом правил резиденции.

## 🚀 Возможности

- **Учёт дней по странам**: Отслеживание фактических дней пребывания
- **Прогноз доступных дней**: Расчёт оставшихся дней по правилам (90/180, 183 дня и др.)
- **Планировщик поездок**: Проверка доступности планируемых поездок
- **Импорт/Экспорт**: CSV загрузка и выгрузка поездок
- **Локальная приватность**: Данные хранятся локально с опциональной синхронизацией

## 🏗️ Архитектура

- **Frontend**: Next.js 15 + App Router, React, TypeScript
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: SQLite (dev) / PostgreSQL (prod)
- **Telegram**: WebApp SDK, HMAC валидация initData
- **Rules Engine**: Модульная система расчёта правил резиденции

## 📁 Структура проекта

```
/app
  /(webapp)          # Страницы Mini App
  /api               # API эндпоинты
/core
  /rules             # Движок правил и расчётов
  /tests             # Unit тесты
/components          # React компоненты
/lib                 # Утилиты и конфигурация
/prisma              # Схема базы данных
/scripts             # Скрипты для БД
```

## 🛠️ Установка

### 1. Клонирование и зависимости

```bash
git clone <repository-url>
cd nomaddays
pnpm install
```

### 2. Настройка переменных окружения

```bash
cp env.example .env.local
```

Заполните `.env.local`:
```env
BOT_TOKEN=your_telegram_bot_token
WEBAPP_SECRET=your_webapp_secret
DATABASE_URL="file:./dev.db"
```

### 3. Настройка базы данных

```bash
# Генерация Prisma клиента
pnpm db:generate

# Создание и миграция БД
pnpm db:migrate

# Заполнение начальными данными
pnpm db:seed
```

### 4. Запуск

```bash
# Разработка
pnpm dev

# Сборка
pnpm build

# Продакшн
pnpm start
```

## 🤖 Настройка Telegram Bot

### 1. Создание бота

1. Напишите [@BotFather](https://t.me/botfather) в Telegram
2. Создайте нового бота: `/newbot`
3. Получите `BOT_TOKEN`

### 2. Настройка WebApp

1. Отправьте BotFather: `/setmenubutton`
2. Выберите вашего бота
3. Выберите "Configure Menu Button"
4. Введите URL: `https://your-domain.com/`
5. Введите текст кнопки: "NomadDays"

### 3. Получение WebApp Secret

1. Отправьте BotFather: `/mybots`
2. Выберите вашего бота
3. Bot Settings → API Token
4. Скопируйте `WEBAPP_SECRET`

## 🧪 Тестирование

```bash
# Запуск тестов
pnpm test

# Тесты в режиме watch
pnpm test:watch
```

## 📊 Правила резиденции

### Поддерживаемые типы

- **Скользящее окно**: N дней из M дней (например, 90/180)
- **Календарный год**: Максимум дней в году
- **Скользящие 12 месяцев**: 183 дня в любые 12 месяцев
- **Максимум вне страны**: Для тестов резиденции

### Настройка правил

Все лимиты настраиваются в `core/rules/presets.ts`:

```typescript
KZ_RESIDENCY_TEST: {
  name: 'Тест резиденции РК',
  maxDaysOutside: 183, // TODO: Уточнить актуальное значение
  calendarYear: true
}
```

⚠️ **Важно**: Все значения являются настраиваемыми параметрами. Измените их в соответствии с актуальными требованиями вашей юрисдикции.

## 🚀 Деплой

### Vercel (рекомендуется)

1. Подключите репозиторий к Vercel
2. Настройте переменные окружения:
   - `BOT_TOKEN`
   - `WEBAPP_SECRET`
   - `DATABASE_URL` (PostgreSQL)
3. Деплой автоматический при push в main

### Другие платформы

- **Railway**: Поддерживает PostgreSQL
- **Render**: Бесплатный PostgreSQL
- **DigitalOcean**: App Platform + Managed Database

## 📱 Использование

1. Откройте бота в Telegram
2. Нажмите кнопку "NomadDays"
3. Авторизуйтесь через Telegram
4. Добавьте поездки или импортируйте CSV
5. Настройте активные правила
6. Используйте планировщик для проверки доступности

## 🔒 Безопасность

- Валидация Telegram initData через HMAC-SHA256
- Проверка подписи на сервере
- Локальное хранение данных по умолчанию
- Опциональная облачная синхронизация

## 🤝 Разработка

### Команды

```bash
pnpm dev              # Запуск в режиме разработки
pnpm build            # Сборка проекта
pnpm start            # Запуск продакшн версии
pnpm lint             # Проверка ESLint
pnpm format           # Форматирование Prettier
pnpm test             # Запуск тестов
pnpm db:studio        # Prisma Studio
```

### Добавление новых правил

1. Создайте правило в `core/rules/presets.ts`
2. Добавьте логику в `core/rules/engine.ts`
3. Напишите тесты в `core/tests/rules.spec.ts`
4. Обновите типы в `core/rules/types.ts`

## 📄 Лицензия

MIT License

## 🆘 Поддержка

- Issues: GitHub Issues
- Документация: README.md
- Telegram: @your_username

---

**⚠️ Дисклеймер**: Данное приложение предназначено для информационных целей. Все правила и лимиты являются настраиваемыми параметрами. Проконсультируйтесь с юристом для получения правовых рекомендаций по вашей конкретной ситуации.
