# Feature-Based Architecture Structure

## Overview
All pages from Gokul Mohan AI Career Guidance System are being refactored into separate features with Mantine UI styling.

## Features Structure

Each feature follows this pattern:
```
featureName/
├── api/
│   └── useGetFeatureData.ts       # API hooks using React Query
├── components/
│   ├── ComponentOne.tsx           # Reusable components
│   ├── ComponentTwo.tsx
│   └── index.ts                   # Export all components
├── pages/
│   └── FeatureNamePage.tsx        # Main page component
├── types.ts                       # TypeScript interfaces
└── index.ts                       # Public API
```

## Mapping of Gokul Mohan AI Career Guidance System Pages to Features

| Gokul Mohan AI Career Guidance System Page | Feature Name | Path |
|---|---|---|
| Dashboard.jsx | dashboard | src/features/dashboard |
| CareerSummary.jsx | careerSummary | src/features/careerSummary |
| Chat.jsx | chat | src/features/chat |
| Flashcards.jsx | flashcards | src/features/flashcards |
| Home.jsx | home | src/features/home |
| Leaderboard.jsx | leaderboard | src/features/leaderboard |
| LearningPath.jsx | learningPath | src/features/learningPath |
| LearningPathDetails.jsx | learningPathDetails | src/features/learningPathDetails |
| Login.jsx | auth/login | src/features/auth |
| ModuleDetails.jsx | moduleDetails | src/features/moduleDetails |
| ProfileForm.jsx | profile | src/features/profile |
| Progress.jsx | progress | src/features/progress |
| Quiz.jsx | quiz | src/features/quiz |
| ResetPassword.jsx | auth/resetPassword | src/features/auth |
| Settings.jsx | settings | src/features/settings |
| Signup.jsx | auth/signup | src/features/auth |
| Streak.jsx | streak | src/features/streak |

## Key Guidelines

### 1. Components
- Use Mantine UI components only
- Keep components small and focused
- Export all from `components/index.ts`
- Props should be fully typed

### 2. API Hooks
- Use React Query (`useQuery`, `useMutation`)
- Keep API logic separate from UI
- Handle loading/error states in hooks
- Type response data

### 3. Types
- Define all interfaces in `types.ts`
- Use consistent naming: `FeatureName` + `Noun`
- Export from index.ts

### 4. Pages
- Orchestrate components and hooks
- Handle data fetching
- Manage page-level state
- Use Container/Grid for layout

### 5. Styling
- Use Mantine's styling system (sx, styles props)
- Use Mantine theme colors
- No Tailwind CSS
- Dark theme: #1c1b1b (bg), #2a2a2a (cards), #3a3a3a (borders), #ff9d54 (accent)

## Color Palette
- Primary: #ff9d54, #ff8a30 (orange gradient)
- Background: #1c1b1b (dark)
- Cards: #2a2a2a
- Borders: #3a3a3a
- Text: white, #ffffff
- Dimmed: #a0a0a0, gray colors

## Usage Example
```tsx
import { DashboardPage } from '@/features/dashboard';

function App() {
  return <Route path="/dashboard" element={<DashboardPage />} />;
}
```
