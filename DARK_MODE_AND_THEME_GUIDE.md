# Dark Mode & Theme-Based Components with Mantine

Complete guide to writing components that support dark mode and custom themes.

---

## Table of Contents

1. [Core Concepts](#core-concepts)
2. [Hooks & Imports](#hooks--imports)
3. [Color System](#color-system)
4. [Styling Patterns](#styling-patterns)
5. [Component Examples](#component-examples)
6. [Best Practices](#best-practices)
7. [Common Patterns](#common-patterns)

---

## Core Concepts

### Two-Layer System

Your app has two independent systems:

1. **Color Scheme** (Light/Dark Mode)
   - Controlled by `useMantineColorScheme()`
   - Sets baseline colors (backgrounds, text)
   - User toggles in Settings

2. **Theme** (Color Palette)
   - Controlled by `useTheme()` (custom hook)
   - Selects specific color palette (Default, Ocean, Forest, Sunset)
   - Defines primary color and color variants

---

## Hooks & Imports

### Required Imports

```tsx
import { 
  useMantineTheme,           // Access theme config
  useMantineColorScheme,     // Access light/dark mode
  Box, Button, Text, Group   // Mantine components
} from "@mantine/core";
```

### Using the Hooks

```tsx
export function MyComponent() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // colorScheme === 'light' | 'dark'
  // theme = full theme object with colors, primaryColor, etc.
}
```

---

## Color System

### Available Colors in Theme

```tsx
const theme = useMantineTheme();

// Accessing colors (each has 10 shades: 0-9)
theme.colors.gray[0]           // Lightest gray
theme.colors.gray[5]           // Mid gray
theme.colors.gray[9]           // Darkest gray

// Primary color (changes based on selected theme)
theme.primaryColor             // 'grape', 'indigo', etc.
theme.colors[theme.primaryColor][5]  // Primary color mid-shade

// Dark/Light mode specific colors
theme.colors.dark[6]           // Dark background (dark mode)
theme.colors.dark[7]           // Darker background (dark mode)
theme.white                    // White color
```

### Color Shades (0-9)

- **0**: Lightest (almost white)
- **1-4**: Light variants
- **5**: Medium (most used)
- **6-8**: Dark variants
- **9**: Darkest

---

## Styling Patterns

### Pattern 1: Background Colors

**For Container/Card Backgrounds:**

```tsx
<Box
  style={{
    backgroundColor: colorScheme === 'dark' 
      ? theme.colors.dark[7]  // Dark mode background
      : theme.white            // Light mode background
  }}
>
  Content
</Box>
```

**For Subtle Sections:**

```tsx
<Box
  style={{
    backgroundColor: colorScheme === 'dark'
      ? theme.colors.dark[6]   // Dark mode subtle
      : theme.colors.gray[0]   // Light mode subtle
  }}
>
  Content
</Box>
```

### Pattern 2: Border Colors

```tsx
<Box
  style={{
    border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
    borderRadius: '8px'
  }}
>
  Content
</Box>
```

**Logic:**
- Dark mode: Use `gray[7]` (lighter gray, visible on dark bg)
- Light mode: Use `gray[3]` (darker gray, visible on light bg)

### Pattern 3: Text Colors

**Primary Text:**

```tsx
<Text c={colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}>
  Main heading text
</Text>
```

**Dimmed/Secondary Text:**

```tsx
<Text c="dimmed" size="sm">
  Secondary text (auto-adapts to dark mode)
</Text>
```

**Themed/Accent Text:**

```tsx
<Text c={theme.colors[theme.primaryColor][5]}>
  Accent text (uses selected theme color)
</Text>
```

### Pattern 4: Button Colors

**Using Theme Primary Color:**

```tsx
<Button 
  color={theme.primaryColor}  // Uses selected theme color
  variant="light"             // Light variant (adapts to dark mode)
>
  Click Me
</Button>
```

**Variant Options:**
- `variant="light"` - Light background, colored text
- `variant="outline"` - Bordered, no fill
- `variant="filled"` - Solid color fill
- `variant="subtle"` - Minimal, adapts to dark mode

### Pattern 5: Icon Colors

```tsx
<IconBriefcase 
  size={24} 
  color={theme.colors[theme.primaryColor][5]}
/>
```

---

## Component Examples

### Example 1: Simple Card with Theme Support

```tsx
import { Box, Card, Text, useMantineTheme, useMantineColorScheme } from '@mantine/core';

export function ThemedCard() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Card
      withBorder
      padding="lg"
      style={{
        backgroundColor: colorScheme === 'dark' 
          ? theme.colors.dark[7] 
          : theme.white,
        borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 3]
      }}
    >
      <Text fw={600} c={colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}>
        Themed Card Title
      </Text>
      <Text size="sm" c="dimmed" mt="xs">
        Secondary text adapts automatically
      </Text>
    </Card>
  );
}
```

### Example 2: Form with All Elements

```tsx
import { 
  TextInput, Button, Box, Group, Stack, 
  useMantineTheme, useMantineColorScheme 
} from '@mantine/core';

export function ThemedForm() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Box
      style={{
        backgroundColor: colorScheme === 'dark' 
          ? theme.colors.dark[6] 
          : theme.colors.gray[0],
        padding: '1.5rem',
        borderRadius: '8px',
        border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`
      }}
    >
      <Stack gap="md">
        <TextInput
          label="Name"
          placeholder="Enter your name"
          // TextInput auto-adapts to dark mode
        />
        <TextInput
          label="Email"
          placeholder="Enter your email"
        />
        
        <Group justify="flex-end" gap="xs">
          <Button variant="light" color={theme.primaryColor}>
            Submit
          </Button>
          <Button variant="outline">
            Cancel
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
```

### Example 3: Section with Multiple Subsections

```tsx
import { Box, Stack, Group, Text, Card, Button, useMantineTheme, useMantineColorScheme } from '@mantine/core';

export function ThemedSection() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Stack gap="lg">
      {/* Section Header */}
      <Box
        style={{
          borderBottom: `2px solid ${theme.colors[theme.primaryColor][5]}`,
          paddingBottom: '0.5rem'
        }}
      >
        <Text fw={600} size="lg" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}>
          Section Title
        </Text>
      </Box>

      {/* Multiple Cards */}
      {[1, 2, 3].map((item) => (
        <Card
          key={item}
          withBorder
          style={{
            backgroundColor: colorScheme === 'dark' 
              ? theme.colors.dark[6] 
              : theme.colors.gray[0],
            borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2]
          }}
        >
          <Group justify="space-between">
            <Text>Item {item}</Text>
            <Button size="xs" color={theme.primaryColor} variant="light">
              Edit
            </Button>
          </Group>
        </Card>
      ))}
    </Stack>
  );
}
```

---

## Best Practices

### 1. Always Use Both Hooks Together

```tsx
// ✅ CORRECT
const theme = useMantineTheme();
const { colorScheme } = useMantineColorScheme();

// ❌ WRONG - Missing colorScheme
const theme = useMantineTheme();
```

### 2. Use Conditional Logic for Dark/Light

```tsx
// ✅ CORRECT - Clear intent
backgroundColor: colorScheme === 'dark' 
  ? theme.colors.dark[7]
  : theme.white,

// ❌ WRONG - Confusing
backgroundColor: colorScheme ? theme.colors.dark[7] : theme.white
```

### 3. Leverage Mantine's Built-in Props

```tsx
// ✅ CORRECT - Uses Mantine's dark mode support
<Text c="dimmed">Automatically adapts to dark mode</Text>

// ✅ CORRECT - Let Mantine handle it
<Button variant="light">Auto-adapts</Button>

// ❌ AVOID - Unnecessary manual styling
<Text style={{ color: colorScheme === 'dark' ? '#aaa' : '#333' }}>
  Manually managing colors
</Text>
```

### 4. Create Reusable Color Constants

```tsx
// In a hook or utility file
export function useThemedColors() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return {
    bg: {
      primary: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      secondary: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
    },
    border: theme.colors.gray[colorScheme === 'dark' ? 7 : 3],
    text: {
      primary: colorScheme === 'dark' ? theme.colors.gray[0] : 'black',
      secondary: 'dimmed',
      accent: theme.colors[theme.primaryColor][5],
    }
  };
}
```

### 5. Organize Styles in a Single Location

```tsx
// ❌ AVOID - Scattered inline styles
return (
  <Box style={{ bg: colorScheme === 'dark' ? ... : ... }}>
    <Card style={{ border: ... }}>
      <Text style={{ color: ... }} />
    </Card>
  </Box>
);

// ✅ CORRECT - Grouped styles
const styles = {
  container: {
    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    padding: '1.5rem',
  },
  card: {
    border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`
  },
  text: {
    color: colorScheme === 'dark' ? theme.colors.gray[0] : 'black'
  }
};

return (
  <Box style={styles.container}>
    <Card style={styles.card}>
      <Text style={styles.text} />
    </Card>
  </Box>
);
```

---

## Common Patterns

### Pattern: Input Fields

```tsx
<TextInput
  label="Label"
  placeholder="Placeholder"
  // Auto-adapts to dark mode - no manual styling needed
/>
```

### Pattern: Buttons with Theme

```tsx
<Group gap="xs">
  {/* Primary action - uses selected theme color */}
  <Button color={theme.primaryColor}>
    Primary Action
  </Button>

  {/* Secondary action - light variant */}
  <Button variant="light" color={theme.primaryColor}>
    Secondary Action
  </Button>

  {/* Tertiary action - outline */}
  <Button variant="outline">
    Cancel
  </Button>
</Group>
```

### Pattern: Header/Section Title

```tsx
<Box
  style={{
    borderBottom: `2px solid ${theme.colors[theme.primaryColor][5]}`,
    paddingBottom: '0.5rem',
    marginBottom: '1rem'
  }}
>
  <Text fw={600} size="lg">
    Section Title
  </Text>
</Box>
```

### Pattern: Disabled/Inactive State

```tsx
<Box
  style={{
    backgroundColor: theme.colors.gray[colorScheme === 'dark' ? 8 : 1],
    opacity: 0.6,
    cursor: 'not-allowed'
  }}
>
  Disabled content
</Box>
```

### Pattern: Hover Effects

```tsx
<Box
  style={{
    backgroundColor: colorScheme === 'dark' 
      ? theme.colors.dark[7]
      : theme.colors.gray[0],
    padding: '1rem',
    borderRadius: '6px',
    cursor: 'pointer',
    transition: 'all 150ms ease'
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.backgroundColor = theme.colors[theme.primaryColor][9];
    e.currentTarget.style.transform = 'translateY(-2px)';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.backgroundColor = colorScheme === 'dark'
      ? theme.colors.dark[7]
      : theme.colors.gray[0];
    e.currentTarget.style.transform = 'translateY(0)';
  }}
>
  Hoverable content
</Box>
```

---

## Quick Reference

### Import Template

```tsx
import { 
  Box, Button, Card, Stack, Group, Text, TextInput, Textarea,
  useMantineTheme, useMantineColorScheme 
} from "@mantine/core";

export function ComponentName() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Your component logic here
}
```

### Style Template

```tsx
const styles = {
  container: {
    backgroundColor: colorScheme === 'dark' 
      ? theme.colors.dark[7] 
      : theme.white,
    border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
    padding: '1.5rem',
    borderRadius: '8px'
  }
};

return (
  <Box style={styles.container}>
    {/* Content */}
  </Box>
);
```

### Color Reference

| Element | Light Mode | Dark Mode |
|---------|-----------|-----------|
| Primary Background | `theme.white` | `theme.colors.dark[7]` |
| Secondary Background | `theme.colors.gray[0]` | `theme.colors.dark[6]` |
| Primary Text | `'black'` | `theme.colors.gray[0]` |
| Secondary Text | `'dimmed'` | `'dimmed'` |
| Borders | `theme.colors.gray[3]` | `theme.colors.gray[7]` |
| Accent/Primary | `theme.colors[theme.primaryColor][5]` | (same) |

---

## Migration Checklist

When updating existing components:

- [ ] Import `useMantineColorScheme`
- [ ] Add `const { colorScheme } = useMantineColorScheme()`
- [ ] Replace hardcoded colors with theme colors
- [ ] Add conditional logic for dark mode backgrounds
- [ ] Update border colors based on `colorScheme`
- [ ] Replace text colors with theme-aware colors
- [ ] Update button colors to use `theme.primaryColor`
- [ ] Test in both light and dark modes
- [ ] Test with different themes (Ocean, Forest, etc.)

---

## Testing

### Test Checklist

1. **Light Mode Light Theme** - Base case
2. **Light Mode Dark Theme** - Theme changes work
3. **Dark Mode Light Theme** - Dark mode works
4. **Dark Mode Dark Theme** - Both systems together

Toggle in Settings:
- Dark/Light mode toggle
- Try each theme (Default, Ocean, Forest, Sunset)
- Component should adapt instantly

---

## Troubleshooting

### Issue: Colors not changing on dark mode toggle

**Solution:** Make sure you're using `useMantineColorScheme()` hook
```tsx
const { colorScheme } = useMantineColorScheme();  // Required
```

### Issue: Theme colors not applying

**Solution:** Check primaryColor is accessible
```tsx
// ✅ CORRECT
theme.colors[theme.primaryColor][5]

// ❌ WRONG
theme.colors.primaryColor
```

### Issue: Dark mode colors look wrong

**Solution:** Use correct shade numbers
- Dark backgrounds: `dark[6]` or `dark[7]`
- Borders in dark: `gray[7]` or `gray[8]`
- Text in dark: `gray[0]` or `gray[1]`

