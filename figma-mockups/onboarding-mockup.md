# Onboarding Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "Добро пожаловать в n0mad_days" (Center, 24px, var(--text), Bold)
- **Subtitle**: "Настройте ваш профиль номада" (Center, 16px, var(--text-secondary))

### Citizenship Section (60px - 180px)
**Card: Citizenship Selection**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Гражданство" (18px, var(--text), Bold)
- **Country Selector**:
  - Dropdown with Flags
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px
  - Placeholder: "Выберите страну"

### Residence Country Section (180px - 300px)
**Card: Residence Country**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Страна резиденции" (18px, var(--text), Bold)
- **Country Selector**:
  - Dropdown with Flags
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px
  - Placeholder: "Выберите страну"
- **Outside RK Button**:
  - Background: var(--surface)
  - Text: "Вне РК" (16px, var(--text), Medium)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px
  - Width: 100px

### Residence Permit Section (300px - 450px)
**Card: Permit Details**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Детали резиденции" (18px, var(--text), Bold)
- **Permit Type**:
  - Label: "Тип документа" (16px, var(--text), Medium)
  - Dropdown: ["РВП", "ВНЖ", "ПМЖ"]
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

- **Start Date**:
  - Label: "Дата начала действия" (16px, var(--text), Medium)
  - Input: Date Picker
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

- **End Date**:
  - Label: "Дата окончания действия" (16px, var(--text), Medium)
  - Input: Date Picker
  - Background: var(--surface)
  - Border: 1px var(--border)
  - Border Radius: 12px
  - Height: 44px

### Previous Trips Section (450px - 600px)
**Card: Trip History**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Предыдущие поездки" (18px, var(--text), Bold)
- **Add Trip Button**:
  - Background: var(--brand)
  - Text: "+ Добавить поездку" (16px, white, Medium)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

- **Trip Items** (if any):
  - Flag + Country + Dates + Days
  - Delete button for each

### Action Buttons Section (600px - 720px)
**Card: Actions**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Complete Button**:
  - Background: var(--brand)
  - Text: "Завершить настройку" (16px, white, Bold)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

- **Skip Button**:
  - Background: var(--surface)
  - Text: "Пропустить" (16px, var(--text-secondary), Medium)
  - Border: 1px var(--border)
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
