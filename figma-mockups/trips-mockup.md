# Trips Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "Поездки" (Center, 24px, var(--text), Bold)
- **Add Button**: "+" (Right, 24px, var(--brand))

### Add Trip Form Section (60px - 350px)
**Card: New Trip Form**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Form Fields**:
- **Country Selection**:
  - Label: "Страна" (16px, var(--text), Medium)
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

- **Add Trip Button**:
  - Background: var(--brand)
  - Text: "Добавить поездку" (16px, white, Medium)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

### Trips List Section (350px - 700px)
**Card: Trips Table**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "История поездок" (18px, var(--text), Bold)
- **Trip Items**:
  - **Trip 1**:
    - Flag: 🇹🇭 (24x24)
    - Country: "Thailand" (16px, var(--text), Medium)
    - Dates: "15 Jan - 30 Jan 2025" (14px, var(--text-secondary))
    - Days: "15 дней" (14px, var(--brand))
    - Delete: 🗑️ (20x20, var(--red))
  
  - **Trip 2**:
    - Flag: 🇷🇺 (24x24)
    - Country: "Russia" (16px, var(--text), Medium)
    - Dates: "1 Feb - 15 Feb 2025" (14px, var(--text-secondary))
    - Days: "14 дней" (14px, var(--brand))
    - Delete: 🗑️ (20x20, var(--red))
  
  - **Trip 3**:
    - Flag: 🇹🇭 (24x24)
    - Country: "Thailand" (16px, var(--text), Medium)
    - Dates: "1 Mar - 30 Mar 2025" (14px, var(--text-secondary))
    - Days: "30 дней" (14px, var(--brand))
    - Delete: 🗑️ (20x20, var(--red))

### Summary Section (700px - 780px)
**Card: Trip Summary**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Total Trips**: "Всего поездок: 3" (16px, var(--text), Medium)
- **Total Days**: "Общее количество дней: 59" (16px, var(--text), Medium)
- **Countries Visited**: "Страны: Thailand, Russia" (14px, var(--text-secondary))

### Navigation Section (Bottom 80px)
**Bottom Navigation Bar**
- **Background**: var(--bg)
- **Border**: 1px var(--border) (top)
- **Height**: 80px
- **Items**:
  - 🏠 Dashboard (var(--text-secondary))
  - 📅 Planner (var(--text-secondary))
  - ✈️ Trips (Active, var(--brand))
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
