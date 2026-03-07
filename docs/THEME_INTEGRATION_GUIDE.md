# Theme Integration Guide - Career Guidance Components

## Theme System Overview

The app uses a **theme provider system** with multiple pre-configured themes:
- **Default**: Blue/Purple theme
- **Ocean**: Blue/Cyan theme
- **Forest**: Green theme (selected in your screenshot)
- **Sunset**: Orange/Red theme

## How Themes Work

### 1. Theme Storage
- Themes are defined in `src/theme/themes/`
- User selection is stored in `localStorage` with key `vstn-theme`
- Default theme: `default`

### 2. Theme Provider
Located in `src/theme/ThemeProvider.tsx`:
```tsx
export function useTheme() {
  const context = useContext(ThemeContext);
  return context; // { themeName, setThemeName }
}
```

### 3. Available Hooks
```tsx
import { useTheme } from '@/theme/ThemeProvider';
import { useMantineTheme } from '@mantine/core';

// Get current theme name
const { themeName } = useTheme(); // 'forest', 'ocean', etc.

// Get Mantine theme config
const mantineTheme = useMantineTheme();
const primaryColor = mantineTheme.primaryColor; // 'green' for forest
```

## Color Mapping by Theme

### Forest Theme (Green)
- Primary: `#31b96f` (green-600)
- Secondary: `#7cb305` (lime-600)
- Accent: `#52c987` (green-400)
- Gradient: `linear-gradient(135deg, #31b96f 0%, #7cb305 100%)`

### Ocean Theme (Blue/Cyan)
- Primary: Sky blue (`#0284c7`)
- Secondary: Cyan (`#0891b2`)
- Accent: Light cyan (`#06b6d4`)

### Sunset Theme (Orange/Red)
- Primary: Orange (`#ff8a30`)
- Secondary: Red-orange (`#ff7a45`)
- Accent: Light orange (`#ffb86c`)

### Default Theme (Blue/Purple)
- Primary: Blue (`#5d52d9`)
- Secondary: Purple (`#9575fa`)
- Accent: Light purple (`#c79bff`)

## Using Theme Colors in Components

### Method 1: Using Mantine Theme Hook (Recommended)
```tsx
import { useMantineTheme } from '@mantine/core';

export function MyComponent() {
  const theme = useMantineTheme();
  
  return (
    <div style={{ color: theme.colors[theme.primaryColor][6] }}>
      Text with theme color
    </div>
  );
}
```

### Method 2: Using Theme Props in Mantine Components
```tsx
import { Button, Text, Card } from '@mantine/core';

export function MyComponent() {
  return (
    <>
      {/* Automatically uses primary color */}
      <Button color="blue">Primary Button</Button>
      
      {/* Text with theme color */}
      <Text c="blue" fw={700}>Bold Blue Text</Text>
      
      {/* Card with gradient */}
      <Card style={{ backgroundImage: 'var(--gradient-primary)' }}>
        Content
      </Card>
    </>
  );
}
```

### Method 3: Using CSS Variables (Set Automatically)
```tsx
// Available CSS variables set by ThemeProvider:
// --gradient-primary
// --gradient-secondary
// --gradient-accent

export function MyComponent() {
  return (
    <div style={{ 
      background: 'var(--gradient-primary)',
      color: 'white'
    }}>
      Gradient background
    </div>
  );
}
```

## Implementation Strategy for Guidance Components

### Components to Update:
1. `GuidanceForm.tsx` - Main form
2. `ModernAssessmentStep.tsx` - Assessment questions
3. `PersonalInfoStep.tsx` - Personal info
4. `CareerGoalStep.tsx` - Career goals
5. `SkillsAndInterestsStep.tsx` - Skills section

### Color Replacements by Element:
- **Headers & Titles**: Use primary color gradient
- **Buttons**: Use theme primary color
- **Progress indicators**: Use secondary color
- **Checkmarks & icons**: Use accent color
- **Card backgrounds**: Use gradient for emphasis
- **Text colors**: Use theme primary for headings, secondary for descriptions

## Best Practices

1. **Use Mantine props instead of inline styles**:
   ```tsx
   // Good
   <Text c="blue" fw={700}>Title</Text>
   
   // Avoid
   <div style={{ color: '#31b96f' }}>Title</div>
   ```

2. **Reference colors dynamically**:
   ```tsx
   const theme = useMantineTheme();
   const primaryColor = theme.colors[theme.primaryColor][6];
   ```

3. **Use gradient CSS variables**:
   ```tsx
   className="bg-gradient-to-r"
   style={{ backgroundImage: 'var(--gradient-primary)' }}
   ```

4. **Avoid hardcoded color values** - Always use theme system

## Testing Theme Changes

1. Navigate to **Settings** page
2. Select different theme (Forest, Ocean, Sunset, Default)
3. Colors should automatically update across all components
4. Theme preference is saved in localStorage

## Future Enhancements

- Add custom color picker in settings
- Support light/dark mode toggle
- Add more theme presets
- Allow per-component theme overrides
