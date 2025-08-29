# Import Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Header Section (Top 60px)
- **Background**: var(--bg)
- **Title**: "Импорт данных" (Center, 24px, var(--text), Bold)

### CSV Import Section (60px - 300px)
**Card: CSV File Import**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Импорт из CSV файла" (18px, var(--text), Bold)
- **Description**: "Загрузите файл с данными о поездках" (14px, var(--text-secondary))
- **File Upload Area**:
  - Background: var(--surface)
  - Border: 2px dashed var(--border)
  - Border Radius: 12px
  - Height: 120px
  - Content: 
    - Icon: 📁 (48x48, var(--text-secondary))
    - Text: "Перетащите файл сюда или нажмите для выбора" (16px, var(--text-secondary), Center)
- **File Format Info**: "Поддерживаемые форматы: .csv" (12px, var(--text-secondary))

### CSV Template Section (300px - 450px)
**Card: Template Download**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Шаблон CSV файла" (18px, var(--text), Bold)
- **Description**: "Скачайте шаблон для правильного форматирования данных" (14px, var(--text-secondary))
- **Template Button**:
  - Background: var(--brand)
  - Text: "📥 Скачать шаблон" (16px, white, Medium)
  - Border Radius: 9999px
  - Height: 44px
  - Width: 100%

### CSV Format Section (450px - 600px)
**Card: Format Requirements**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Требования к формату" (18px, var(--text), Bold)
- **Format List**:
  - "Столбцы: country, start_date, end_date" (14px, var(--text))
  - "Даты: YYYY-MM-DD формат" (14px, var(--text))
  - "Страны: названия на английском языке" (14px, var(--text))
  - "Кодировка: UTF-8" (14px, var(--text))
  - "Разделитель: запятая (,)" (14px, var(--text))

### Import Options Section (600px - 720px)
**Card: Import Settings**
- **Background**: var(--surface)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Title**: "Настройки импорта" (18px, var(--text), Bold)
- **Options**:
  - **Overwrite Existing**:
    - Label: "Перезаписать существующие данные" (16px, var(--text), Medium)
    - Toggle: OFF (var(--text-secondary))
    - Description: "Удалить старые поездки" (14px, var(--text-secondary))
  
  - **Validate Data**:
    - Label: "Проверка данных" (16px, var(--text), Medium)
    - Toggle: ON (var(--green))
    - Description: "Автоматическая валидация" (14px, var(--text-secondary))

### Import Button Section (720px - 800px)
**Card: Import Action**
- **Background**: var(--bg)
- **Border**: 1px var(--border)
- **Border Radius**: 16px
- **Padding**: 16px
- **Margin**: 16px

**Content**:
- **Import Button**:
  - Background: var(--brand)
  - Text: "🚀 Начать импорт" (18px, white, Bold)
  - Border Radius: 9999px
  - Height: 48px
  - Width: 100%

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
  - 📥 Import (Active, var(--brand))

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
- **Border Radius**: 16px (cards), 12px (upload area), 9999px (buttons)
