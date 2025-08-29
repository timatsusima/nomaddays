# Rules Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "Правила и настройки" (Center, 24px, var(--text), Bold)

### Rule Profiles Section (60px - 300px)
**Card: Active Rule Profiles**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Активные профили правил" (18px, var(--text), Bold)
- **Rule Items**:
  - **Schengen Rule**:
    - Toggle: ON (var(--green))
    - Name: "Schengen 90/180" (16px, var(--text), Medium)
    - Description: "Максимум 90 дней в течение 180 дней" (14px, var(--text-secondary))
    - Status: "Активно" (12px, var(--green))
  
  - **Kazakhstan Residency**:
    - Toggle: ON (var(--green))
    - Name: "РВП/ВНЖ РК" (16px, var(--text), Medium)
    - Description: "Минимум 183 дня в РК в год" (14px, var(--text-secondary))
    - Status: "Активно" (12px, var(--green))
  
  - **Tourist Stay**:
    - Toggle: OFF (var(--text-secondary))
    - Name: "Туристическое пребывание" (16px, var(--text), Medium)
    - Description: "Лимиты по странам" (14px, var(--text-secondary))
    - Status: "Неактивно" (12px, var(--text-secondary))

### Rule Configuration Section (300px - 500px)
**Card: Rule Settings**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Настройки правил" (18px, var(--text), Bold)
- **Settings**:
  - **Rolling Period**:
    - Label: "Скользящий период" (16px, var(--text), Medium)
    - Toggle: ON (var(--green))
    - Description: "Расчет за последние 12 месяцев" (14px, var(--text-secondary))
  
  - **Notifications**:
    - Label: "Уведомления" (16px, var(--text), Medium)
    - Toggle: ON (var(--green))
    - Description: "Предупреждения о рисках" (14px, var(--text-secondary))
  
  - **AI Analysis**:
    - Label: "AI анализ" (16px, var(--text), Medium)
    - Toggle: ON (var(--green))
    - Description: "Использовать OpenAI для расчетов" (14px, var(--text-secondary))

### Custom Rules Section (500px - 650px)
**Card: Custom Rules**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Пользовательские правила" (18px, var(--text), Bold)
- **Add Rule Button**:
  - Background: var(--brand)
  - Text: "+ Добавить правило" (16px, white, Medium)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

- **Custom Rule Example**:
  - Name: "Особые требования" (16px, var(--text), Medium)
  - Description: "Дополнительные ограничения" (14px, var(--text-secondary))
  - Edit Button: ✏️ (20x20, var(--brand))
  - Delete Button: 🗑️ (20x20, var(--red))

### Export/Import Section (650px - 750px)
**Card: Data Management**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Управление данными" (18px, var(--text), Bold)
- **Actions**:
  - **Export Button**:
    - Background: var(--surface)
    - Text: "Экспорт настроек" (16px, var(--text), Medium)
    - Border: 1px var(--border)
    - Border Radius: 9999px
    - Height: 44px
    - Width: 100%
  
  - **Import Button**:
    - Background: var(--brand)
    - Text: "Импорт настроек" (16px, white, Medium)
    - Border Radius: 9999px
    - Height: 44px
    - Width: 100%
    - Margin-top: 12px

### Navigation Section (Bottom 80px)
**Bottom Navigation Bar**
- **Background**: var(--bg)
- **Border**: 1px var(--border) (top)
- **Height**: 80px
- **Items**:
  - 🏠 Dashboard (var(--text-secondary))
  - 📅 Planner (var(--text-secondary))
  - ✈️ Trips (var(--text-secondary))
  - ⚙️ Rules (Active, var(--brand))
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
- **Border Radius**: 16px (cards), 9999px (buttons)
