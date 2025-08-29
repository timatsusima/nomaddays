# Dashboard Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "n0mad_days" (Left, 24px, var(--text), Bold)
- **About Link**: "О приложении" (Right, 16px, var(--brand), Underlined)

### Status Widgets Section (60px - 200px)
**Card 1: Days Until Permit End**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Content**: 
  - Icon: 📅 (24x24)
  - Title: "Дни до окончания РВП/ВНЖ" (16px, var(--text), Medium)
  - Value: "28 дней" (24px, var(--brand), Bold)
  - Status: "В порядке" (14px, var(--green))

**Card 2: Days in Residence Country**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Content**:
  - Icon: 🏠 (24x24)
  - Title: "Дни в РК за 12 месяцев" (16px, var(--text), Medium)
  - Value: "223 дня" (24px, var(--text), Bold)
  - Status: "Достаточно" (14px, var(--green))

**Card 3: Outside Days Left**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Content**:
  - Icon: ✈️ (24x24)
  - Title: "Остаток дней вне РК" (16px, var(--text), Medium)
  - Value: "28 дней" (24px, var(--text), Bold)
  - Status: "Внимание" (14px, var(--red))

### Country Days Chart Section (200px - 350px)
**Card: Monthly Country Days**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Title**: "Дни по странам" (18px, var(--text), Bold)
- **Chart**: Stacked Bar Chart
  - **Months**: Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
  - **Countries**: 
    - Kazakhstan (var(--brand))
    - Thailand (var(--green))
    - Russia (var(--red))
  - **Height**: 120px
  - **Width**: 100% (361px)

### Recent Trips Section (350px - 500px)
**Card: Latest Trips**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Title**: "Последние поездки" (18px, var(--text), Bold)
- **Trip Items**:
  - **Trip 1**: 🇹🇭 Thailand, 15-30 Jan 2025 (15px, var(--text))
  - **Trip 2**: 🇷🇺 Russia, 1-15 Feb 2025 (15px, var(--text))
  - **Trip 3**: 🇹🇭 Thailand, 1-30 Mar 2025 (15px, var(--text))

### AI Tips Section (500px - 600px)
**Card: AI Recommendations**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Title**: "🤖 AI Советы" (18px, var(--text), Bold)
- **Content**: "Рекомендуем планировать поездки с учетом минимального пребывания в РК" (14px, var(--text-secondary))

### Reset Profile Section (600px - 680px)
**Button: Reset Profile**
- **Background**: var(--red)
- **Text**: "Сбросить профиль" (16px, white, Medium)
- **Border Radius**: 9999px
- **Padding**: 12px 24px
- **Height**: 44px
- **Width**: 200px
- **Center Aligned**

### Navigation Section (Bottom 80px)
**Bottom Navigation Bar**
- **Background**: var(--bg)
- **Border**: 1px var(--border) (top)
- **Height**: 80px
- **Items**:
  - 🏠 Dashboard (Active, var(--brand))
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
- **Border Radius**: 16px (cards), 9999px (buttons)
