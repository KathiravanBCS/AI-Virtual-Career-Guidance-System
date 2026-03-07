# Theme Color Updates for Guidance Components

## Quick Summary
All guidance components need to be updated to use dynamic theme colors instead of hardcoded blue/green colors.

## File-by-File Updates Needed

### 1. ModernAssessmentStep.tsx ✅ (In Progress)
**Already Updated:**
- Import: Added `useMantineTheme`
- Component: Added theme color variables
- Header: Updated card background and icon color
- Progress: Updated progress bar colors

**Still Need To Update:**
- Option border colors: `'border-blue-500'` → `primaryColor`
- Option background: `'bg-blue-50'` → `${accentColor}30`
- Option hover: `'hover:border-blue-300'` → dynamically calculated
- Radio circle: `'#3b82f6'` → `primaryColor`
- Checkmark color: `'#3b82f6'` → `primaryColor`
- Tip card background: Amber-50 → theme-based
- Buttons: `'from-blue-600 to-indigo-600'` → gradient from theme

### 2. PersonalInfoStep.tsx
**Changes Needed:**
```tsx
// Add import
import { useMantineTheme } from '@mantine/core';

// In component
const theme = useMantineTheme();

// Replace colors:
- Icon color: green → theme.primaryColor
- Input labels: keep semantic
- Alert box: green-50 → theme accent light
- Button: Next button to use theme primary
```

### 3. CareerGoalStep.tsx
**Changes Needed:**
```tsx
// Add theme hook
const theme = useMantineTheme();

// Replace:
- Title color: any hardcoded → theme.primaryColor
- Icon color: green/teal → theme.primaryColor
- Alert backgrounds → theme-based
- Button styling → theme primary
```

### 4. SkillsAndInterestsStep.tsx
**Changes Needed:**
```tsx
// Add theme hook
const theme = useMantineTheme();

// Replace:
- Badge colors → theme primary/secondary
- Add/Remove button colors → theme primary
- Input focus colors → theme primary
- Alert styling → theme-based
- Hover effects → theme secondary
```

### 5. GuidanceForm.tsx
**Changes Needed:**
```tsx
// Add theme hook
const theme = useMantineTheme();

// Replace:
- Alert box colors → theme-based
- Stepper colors → theme primary
- Step indicator colors → theme
- Button colors → theme primary/gradient
- Error alert color → keep red or use theme warning
- Loading spinner color → theme primary
- Text colors for titles → theme primary
```

## Implementation Pattern

### For Each Component:

```tsx
import { useMantineTheme } from '@mantine/core';

export function MyComponent() {
  const theme = useMantineTheme();
  
  // Get color references
  const primaryColor = theme.colors[theme.primaryColor][6];
  const secondaryColor = theme.colors[theme.primaryColor][4];
  const accentColor = theme.colors[theme.primaryColor][2];
  
  return (
    <>
      {/* For Mantine components - use color prop */}
      <Button color={theme.primaryColor}>Click</Button>
      <Text c={theme.primaryColor}>Title</Text>
      
      {/* For inline styles */}
      <div style={{ borderColor: primaryColor, backgroundColor: `${accentColor}30` }}>
        Content
      </div>
    </>
  );
}
```

## Color Usage Guide

### By Element Type:
- **Primary Text/Icons**: `theme.primaryColor`
- **Secondary Text**: `theme.colors[theme.primaryColor][4]`
- **Borders**: `theme.colors[theme.primaryColor][5]`
- **Light Backgrounds**: `${accentColor}15` or `${accentColor}20`
- **Hover States**: `theme.colors[theme.primaryColor][3]`
- **Gradients**: Use CSS variables: `var(--gradient-primary)`, `var(--gradient-secondary)`

## Testing After Updates

1. Go to Settings page
2. Change theme from Forest to Ocean/Sunset/Default
3. Navigate to Guidance Form
4. Verify all colors update dynamically
5. Check that text remains readable in all themes
6. Ensure hover states work correctly

## Tools & Resources

- **Current Theme**: Check `localStorage.getItem('vstn-theme')`
- **Theme Colors**: See `src/theme/themes/[theme-name].ts`
- **Mantine Docs**: https://mantine.dev/guides/theme/

## Status Tracking

- [ ] ModernAssessmentStep - complete option colors  
- [ ] PersonalInfoStep - add theme colors
- [ ] CareerGoalStep - add theme colors
- [ ] SkillsAndInterestsStep - add theme colors
- [ ] GuidanceForm - add theme colors
- [ ] Test all themes work correctly
- [ ] Test readability in all themes
- [ ] Test accessibility (contrast ratios)
