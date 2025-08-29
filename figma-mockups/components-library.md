# Figma Components Library - n0mad_days

## Обзор компонентов

Эта библиотека содержит все необходимые компоненты для создания макетов приложения n0mad_days. Все компоненты используют единую дизайн-систему и оптимизированы для переиспользования.

## Базовые компоненты

### 1. Navigation Bar
**Описание**: Нижняя навигация приложения
**Размеры**: 393x80px
**Стили**:
- Background: var(--bg)
- Border: 1px var(--border) (top)
- Border Radius: 0

**Элементы**:
- 🏠 Dashboard (Icon + Text)
- 📅 Planner (Icon + Text)
- ✈️ Trips (Icon + Text)
- ⚙️ Rules (Icon + Text)
- 📥 Import (Icon + Text)

**Состояния**:
- Active: var(--brand) color
- Inactive: var(--text-secondary) color

**Auto Layout**: Horizontal, Space Between, Center Align

### 2. Card
**Описание**: Базовая карточка для контента
**Размеры**: Auto (361xAuto)
**Стили**:
- Background: var(--bg)
- Border: 1px var(--border)
- Border Radius: 16px
- Padding: 16px
- Margin: 16px

**Варианты**:
- Default: var(--bg) background
- Surface: var(--surface) background
- Hover: var(--hover) background

**Auto Layout**: Vertical, 16px spacing

### 3. Button
**Описание**: Кнопки разных типов
**Размеры**: Auto x 44px (стандарт), Auto x 48px (большие)

**Варианты**:
- **Primary**:
  - Background: var(--brand)
  - Text: white
  - Border Radius: 9999px
  - Hover: var(--brand-hover)

- **Secondary**:
  - Background: var(--surface)
  - Text: var(--text)
  - Border: 1px var(--border)
  - Border Radius: 9999px
  - Hover: var(--hover)

- **Outline**:
  - Background: transparent
  - Text: var(--brand)
  - Border: 1px var(--brand)
  - Border Radius: 9999px
  - Hover: var(--brand) background

- **Danger**:
  - Background: var(--red)
  - Text: white
  - Border Radius: 9999px

**Auto Layout**: Horizontal, Center, 12px-24px padding

### 4. Form Input
**Описание**: Поля ввода форм
**Размеры**: 100% x 44px
**Стили**:
- Background: var(--surface)
- Border: 1px var(--border)
- Border Radius: 12px
- Padding: 12px 16px
- Font: 16px, var(--text)

**Состояния**:
- Default: var(--border)
- Focus: var(--brand) border + 2px var(--brand) shadow
- Error: var(--red) border

**Варианты**:
- Text Input
- Date Picker
- Select Dropdown
- Textarea

### 5. Header
**Описание**: Заголовок страницы
**Размеры**: 393x60px
**Стили**:
- Background: var(--bg)
- Height: 60px
- Padding: 16px

**Элементы**:
- Back Button (Left, 24px, var(--brand))
- Title (Center, 24px, var(--text), Bold)
- Action Button (Right, var(--brand))

**Auto Layout**: Horizontal, Space Between, Center Align

## Специфические компоненты

### 6. Status Widget
**Описание**: Виджет с иконкой, заголовком и значением
**Размеры**: Auto x Auto
**Стили**:
- Background: var(--surface)
- Border: 1px var(--border)
- Border Radius: 16px
- Padding: 16px

**Структура**:
- Icon (24x24, emoji или SVG)
- Title (16px, var(--text), Medium)
- Value (24px, var(--brand), Bold)
- Status (14px, var(--green/red/orange))

**Auto Layout**: Vertical, 8px spacing, Center align

### 7. Country Selector
**Описание**: Селектор страны с флагом
**Размеры**: 100% x 44px
**Стили**:
- Background: var(--surface)
- Border: 1px var(--border)
- Border Radius: 12px
- Padding: 12px 16px

**Структура**:
- Flag (24x24, emoji)
- Country Name (16px, var(--text))
- Dropdown Arrow (16x16, var(--text-secondary))

**Auto Layout**: Horizontal, Space Between, Center align

### 8. Trip Item
**Описание**: Элемент списка поездок
**Размеры**: 100% x Auto
**Стили**:
- Background: transparent
- Padding: 12px 0
- Border: 1px var(--border) (bottom)

**Структура**:
- Flag (24x24, emoji)
- Country Name (16px, var(--text), Medium)
- Dates (14px, var(--text-secondary))
- Days (14px, var(--brand))
- Actions (Edit/Delete buttons)

**Auto Layout**: Horizontal, Space Between, Center align

### 9. Chart Container
**Описание**: Контейнер для диаграмм
**Размеры**: 361x140px
**Стили**:
- Background: transparent
- Border: none
- Padding: 0

**Структура**:
- Chart Area (361x120px)
- Month Labels (361x20px, 12px, var(--text-secondary))

**Auto Layout**: Vertical, 0px spacing

### 10. Toggle Switch
**Описание**: Переключатель включения/выключения
**Размеры**: 44x24px
**Стили**:
- Background: var(--border) (OFF) / var(--green) (ON)
- Border Radius: 12px
- Thumb: 20x20px, white, 2px margin

**Состояния**:
- OFF: var(--border) background
- ON: var(--green) background

## Компоненты для переиспользования

### 11. Icon Set
**Описание**: Набор иконок для приложения
**Размеры**: 24x24px, 48x48px
**Типы**:
- Emoji Icons: 🏠, ✈️, 📅, ⚙️, 📥, 🤖, ✅, ⚠️, 🗑️, ✏️
- SVG Icons: Flag icons for specific countries

**Стили**:
- Color: var(--text), var(--brand), var(--green), var(--red)
- Background: transparent

### 12. Spacing System
**Описание**: Система отступов
**Значения**:
- 4px (base unit)
- 8px (small)
- 12px (medium)
- 16px (standard)
- 20px (large)
- 24px (extra large)

**Применение**:
- Padding внутри компонентов
- Margin между компонентами
- Gap в Auto Layout

### 13. Typography Scale
**Описание**: Шкала типографики
**Размеры**:
- 12px (caption)
- 14px (small)
- 16px (body)
- 18px (subtitle)
- 20px (medium title)
- 24px (title)
- 32px (large title)

**Вес**:
- 400 (regular)
- 500 (medium)
- 700 (bold)

## Инструкции по созданию

### 1. Создание компонента
1. Создайте фрейм с нужными размерами
2. Примените стили согласно спецификации
3. Настройте Auto Layout
4. Создайте Component (Ctrl+Alt+K)

### 2. Настройка Auto Layout
1. Выберите элементы
2. Нажмите Shift+A для Auto Layout
3. Настройте направление (Horizontal/Vertical)
4. Установите spacing (8px, 16px)
5. Настройте alignment (Center, Start, End)

### 3. Применение цветовых переменных
1. Создайте Variables в Figma
2. Примените к fill, stroke, text
3. Настройте Light/Dark режимы
4. Используйте semantic naming

### 4. Создание вариантов
1. Дублируйте компонент
2. Измените нужные свойства
3. Создайте Component Set
4. Настройте свойства для изменения

## Рекомендации

### 1. Консистентность
- Используйте компоненты везде
- Следуйте единой системе отступов
- Применяйте цветовые переменные

### 2. Переиспользование
- Создавайте компоненты для повторяющихся элементов
- Используйте Component Sets для вариантов
- Минимизируйте количество уникальных стилей

### 3. Производительность
- Оптимизируйте SVG иконки
- Группируйте связанные компоненты
- Используйте Instance для изменений

### 4. Организация
- Группируйте компоненты по категориям
- Используйте понятные названия
- Добавляйте описания к компонентам

## Следующие шаги

1. **Создайте базовые компоненты** в Figma
2. **Настройте цветовые переменные** согласно спецификации
3. **Создайте Component Sets** для вариантов
4. **Примените компоненты** к макетам страниц
5. **Протестируйте** переиспользование
