# Planner Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "Планировщик поездок" (Center, 24px, var(--text), Bold)
- **Back Button**: ← (Left, 24px, var(--brand))

### Trip Planning Form Section (60px - 300px)
**Card: New Trip Form**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Form Fields**:
- **Country Selection**:
  - Label: "Страна назначения" (16px, var(--text), Medium)
  - Dropdown: Country Selector with Flags
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

- **Start Date**:
  - Label: "Дата начала" (16px, var(--text), Medium)
  - Input: Date Picker
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

- **End Date**:
  - Label: "Дата окончания" (16px, var(--text), Medium)
  - Input: Date Picker
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

- **Calculate Button**:
  - Background: var(--brand)
  - Text: "Рассчитать" (16px, white, Medium)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

### Forecast Results Section (300px - 500px)
**Card: Trip Forecast**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Результат проверки" (18px, var(--text), Bold)
- **Status Indicator**: 
  - Icon: ✅ (24x24)
  - Text: "Поездка возможна" (16px, var(--green), Medium)
- **Details**:
  - "Дней в поездке: 92" (14px, var(--text))
  - "Остаток дней вне РК: 28" (14px, var(--text))
  - "Риск: Низкий" (14px, var(--green))

### AI Recommendations Section (500px - 650px)
**Card: AI Analysis**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "🤖 AI Анализ" (18px, var(--text), Bold)
- **Recommendation**: "Поездка на 92 дня возможна, но рекомендуется сократить до 28 дней для безопасности" (14px, var(--text-secondary))
- **Risk Level**: "Уровень риска: Средний" (14px, var(--red))

### Navigation Section (Bottom 80px)
**Bottom Navigation Bar**
- **Background**: var(--bg)
- **Border**: 1px var(--border) (top)
- **Height**: 80px
- **Items**:
  - 🏠 Dashboard (var(--text-secondary))
  - 📅 Planner (Active, var(--brand))
  - ✈️ Trips (var(--text-secondary))
  - ⚙️ Rules (var(--text-secondary))
  - 📥 Import (var(--text-secondary))

## Color Variables (Figma Variables)
- `--bg`: #ffffff (Light) / #1c1c1e (Dark)
- `--surface`: #f7f6f3 (Light) / #2c2c2e (Dark)
- `--text`: #37352f (Light) / #ffffff (Dark)
- `--text-secondary`: #787774 (Light) / #a0a0a0 (Dark)
- `--border`: #e9e8e6 (Light) / #3a3a3c (Dark)
- `--brand`: #2eaadc (Light) / #0a84ff (Dark)
- `--red`: #ef5350 (Light) / #ff453a (Dark)
- `--green`: #4caf50 (Light) / #30d158 (Dark)

## Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **Title**: 24px, Bold
- **Subtitle**: 18px, Bold
- **Body**: 16px, Medium
- **Small**: 14px, Regular
- **Caption**: 12px, Regular

## Spacing
- **Base Unit**: 4px
- **Padding**: 16px
- **Margins**: 16px between sections
- **Border Radius**: 16px (cards), 12px (inputs), 9999px (buttons)
