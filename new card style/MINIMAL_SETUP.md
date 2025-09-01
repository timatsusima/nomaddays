# Минимальный перенос карточек поездок

Для переноса только стилей карточек поездок в ваш существующий проект, вам понадобится скопировать несколько ключевых файлов:

## Обязательные файлы

### 1. Основные компоненты карточек
Скопируйте эти файлы в папку `components/`:
- `SwipeableTripItem.tsx` - интерактивная карточка с жестами
- `TripListItem.tsx` - базовая карточка поездки  
- `CustomCard.tsx` - кастомный компонент карточки

### 2. UI компоненты (если их нет)
Скопируйте из папки `components/ui/`:
- `card.tsx` - базовый компонент карточки
- `badge.tsx` - компонент бейджа для статусов
- `utils.ts` - утилиты для стилей

### 3. Стили в globals.css
Добавьте или обновите следующие CSS переменные в `styles/globals.css`:

```css
:root {
  /* n0mad_days цвета для светлой темы */
  --bg: #FFFFFF;
  --surface: #F8F9FA;
  --hover: #F1F3F4;
  --border: #E8EAED;
  --text: #202124;
  --text-secondary: #5F6368;
  --brand: #4FD1C5;
  --green: #22C55E;
  --red: #EF4444;
  --yellow: #F59E0B;
  
  /* Маппинг на существующие переменные */
  --background: var(--bg);
  --foreground: var(--text);
  --card: var(--surface);
  --card-foreground: var(--text);
  --primary: var(--brand);
  --muted-foreground: var(--text-secondary);
}

.dark {
  /* n0mad_days цвета для тёмной темы */
  --bg: #0D0E11;
  --surface: #17181C;
  --hover: #1F2126;
  --border: #2A2C31;
  --text: #ECEFF4;
  --text-secondary: #9BA0A8;
  --brand: #4FD1C5;
  --green: #22C55E;
  --red: #EF4444;
  --yellow: #F59E0B;
}

@theme inline {
  /* Токены для Tailwind */
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-hover: var(--hover);
  --color-border: var(--border);
  --color-text: var(--text);
  --color-text-secondary: var(--text-secondary);
  --color-brand: var(--brand);
  --color-green: var(--green);
  --color-red: var(--red);
  --color-yellow: var(--yellow);
  
  /* Стандартный маппинг */
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-muted-foreground: var(--muted-foreground);
}
```

## Зависимости

Убедитесь, что установлены пакеты:
```bash
npm install lucide-react
```

## Использование

### SwipeableTripItem (с жестами)
```tsx
import { SwipeableTripItem } from './components/SwipeableTripItem';

const trip = {
  id: "1",
  country: "Таиланд",
  countryCode: "TH", 
  flag: "🇹🇭",
  entryDate: "15.07.2024",
  exitDate: "20.08.2024",
  duration: 36,
  status: "completed",
  notes: "Отличная поездка"
};

<SwipeableTripItem
  trip={trip}
  onEdit={(trip) => console.log('Edit:', trip)}
  onDelete={(trip) => console.log('Delete:', trip)}
/>
```

### TripListItem (базовая карточка)
```tsx
import { TripListItem } from './components/TripListItem';

<TripListItem
  trip={trip}
  onClick={(trip) => console.log('Click:', trip)}
/>
```

## Интерактивность карточек

### SwipeableTripItem жесты:
- **Свайп вправо** → вызывает `onEdit(trip)`
- **Свайп влево** → вызывает `onDelete(trip)` 
- **Визуальные подсказки** при свайпе
- **Touch и Mouse поддержка**

### Статусы поездок:
- `"completed"` → зелёный бейдж "Завершена"
- `"ongoing"` → бирюзовый бейдж "В процессе"  
- `"planned"` → жёлтый бейдж "Запланирована"

## Кастомизация

### Изменить цвета статусов
Отредактируйте переменные в `statusColors` внутри компонентов:
```tsx
const statusColors = {
  completed: "bg-green/10 text-green border-green/20",
  ongoing: "bg-brand/10 text-brand border-brand/20",  
  planned: "bg-yellow/10 text-yellow border-yellow/20"
};
```

### Изменить пороги свайпа
В `SwipeableTripItem.tsx` измените:
```tsx
const threshold = 80; // пикселей для срабатывания
const maxSwipe = 120; // максимальное расстояние свайпа
```

## Файловая структура

После переноса у вас должна быть примерно такая структура:
```
components/
├── SwipeableTripItem.tsx
├── TripListItem.tsx  
├── CustomCard.tsx
└── ui/
    ├── card.tsx
    ├── badge.tsx
    └── utils.ts
styles/
└── globals.css (обновлённый)
```

Этого минимального набора достаточно для полнофункциональных карточек поездок с iOS-дизайном и интерактивными жестами!