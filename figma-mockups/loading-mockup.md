# Loading/Splash Page Mockup - n0mad_days

## Frame: iPhone 15 Pro (393x852)

### Full Screen Background
- **Background**: var(--bg)
- **Dimensions**: 393x852 (Full screen)

### Center Content Section (Center of screen)
**Lottie Animation Container**
- **Position**: Center (196.5, 426)
- **Size**: 200x200
- **Background**: Transparent
- **Animation**: splash_screen.json (Lottie)

**App Title**
- **Text**: "n0mad_days"
- **Font**: 32px, Bold
- **Color**: var(--brand)
- **Position**: Below animation, Center aligned
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif

**Loading Indicator**
- **Type**: Spinner or Progress Bar
- **Color**: var(--brand)
- **Size**: 24x24 (spinner) or 200x4 (progress bar)
- **Position**: Below title, Center aligned

### Optional Elements
**Version Info**
- **Text**: "v3.2" (12px, var(--text-secondary))
- **Position**: Bottom right corner
- **Margin**: 16px from edges

**Loading Text**
- **Text**: "Загрузка..." (16px, var(--text-secondary))
- **Position**: Below loading indicator
- **Center aligned**

## Color Variables (Figma Variables)
- `--bg`: #ffffff (Light) / #1c1c1e (Dark)
- `--brand`: #2eaadc (Light) / #0a84ff (Dark)
- `--text`: #37352f (Light) / #ffffff (Dark)
- `--text-secondary`: #787774 (Light) / #a0a0a0 (Dark)

## Typography
- **Font Family**: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif
- **App Title**: 32px, Bold
- **Loading Text**: 16px, Regular
- **Version**: 12px, Regular

## Animation Notes
- **Lottie File**: splash_screen.json
- **Loop**: true
- **Autoplay**: true
- **Duration**: 3-5 seconds recommended
- **Smooth transitions** between frames

## Design Principles
- **Minimalist**: Clean, focused design
- **Brand-focused**: App name prominently displayed
- **Smooth**: Smooth animations and transitions
- **Responsive**: Scales appropriately for different screen sizes
- **Accessible**: High contrast and readable text
