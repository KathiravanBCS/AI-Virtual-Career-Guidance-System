# AI Virtual Career Guidance System — Algorithms & Concepts Deep-Dive

> **Project stack:** React 18 · TypeScript · Vite · Mantine · React Query · Zustand · CASL · Recharts · Framer Motion · Groq SDK · pdf.js · Axios

---

## Table of Contents
1. [System Architecture Overview](#1-system-architecture-overview)
2. [Authentication & Authorization](#2-authentication--authorization)
3. [AI / LLM Integration (Groq)](#3-ai--llm-integration-groq)
4. [Gamification Engine](#4-gamification-engine)
5. [Streak Tracking Algorithm](#5-streak-tracking-algorithm)
6. [Quiz Engine](#6-quiz-engine)
7. [Flashcard System](#7-flashcard-system)
8. [Resume Builder & AI Pipeline](#8-resume-builder--ai-pipeline)
9. [Learning Path & Guidance Engine](#9-learning-path--guidance-engine)
10. [Career Intelligence](#10-career-intelligence)
11. [State Management Patterns](#11-state-management-patterns)
12. [Data Fetching & Caching (React Query)](#12-data-fetching--caching-react-query)
13. [Routing & Navigation](#13-routing--navigation)
14. [Visualization & Charting Algorithms](#14-visualization--charting-algorithms)
15. [Theme System](#15-theme-system)
16. [API Client Architecture](#16-api-client-architecture)
17. [Key Design Patterns Summary](#17-key-design-patterns-summary)

---

## 1. System Architecture Overview

The project is a **Single-Page Application (SPA)** built with a feature-slice architecture.

```
src/
 ├── features/          ← self-contained "vertical slices" (quiz, chat, gamification …)
 ├── lib/               ← shared infra (api, casl, store, hooks, types)
 ├── components/        ← reusable UI atoms / molecules
 ├── pages/             ← route-level composition pages
 ├── config/            ← environment config + Groq LLM client
 └── utils/             ← pure utility functions (resume extractor, AI integration)
```

**Core architectural concepts adopted:**
| Concept | Implementation |
|---|---|
| Feature-Slice Design | Each domain (`quiz`, `chat`, `gamification` …) owns its own `api/`, `components/`, `pages/`, `types.ts` |
| Clean Layering | `pages` → `features` → `lib`; no upward imports |
| Barrel Exports | Every feature has `index.ts` to expose public API |
| DRY API Layer | Central `src/lib/api.ts` aggregates all REST calls; `src/lib/api-endpoints.ts` stores URL constants |

---

## 2. Authentication & Authorization

### 2.1 Authentication Flow
- **Firebase-backed or custom JWT** authentication (configured in `src/config/firebaseConfig.ts` / `authConfig.ts`).
- `AuthProvider` → React Context holds `{ user, isLoading }`.
- `AuthGuard` wraps protected routes: redirects unauthenticated users to `/home`.

```
Login → AuthProvider.login() → store JWT/session
→ AuthGuard checks context → renders children or <Navigate to="/home" />
```

### 2.2 Role-Based Access Control — CASL (Attribute-Based)
CASL (`@casl/ability`) implements **Attribute-Based Access Control (ABAC)**.

**Algorithm:**
1. After login, call `GET /api/v1/users/permissions/current` → returns `{ user_id, role, rules[] }`.
2. `loadPermissionsFromBackend()` (in `useCASLIntegration.ts`) calls `updateAbility(rules)` to hydrate the global `ability` instance.
3. Components use `ability.can(action, subject)` for UI-level gating (show/hide buttons, routes).
4. On logout, `resetAbility()` clears all rules.

**Data model:**
```ts
interface CASLRule { action: string; subject: string; conditions?: object }
// e.g. { action: 'manage', subject: 'all' }  // admin
// e.g. { action: 'read',   subject: 'Quiz' } // student
```

**Design Pattern:** `Singleton` — one global `ability` instance shared via `AbilityContext` (React Context).

---

## 3. AI / LLM Integration (Groq)

All LLM calls route through `src/config/groq.config.ts` using the **Groq** inference API.

### 3.1 Models Used
| Model | Speed | Use Case |
|---|---|---|
| `llama-3.1-8b-instant` | Very fast | Chat, quick Q&A |
| `llama-3.3-70b-versatile` | Medium | Quiz generation, module content |
| `llama-3.2-90b-vision-preview` | Slow | Complex analysis |

### 3.2 Rate-Limiting Algorithm
```
ApiRequestLog { timestamp, count, resetInterval, maxRequestsPerInterval }

Before each API call:
  if (now - lastReset > resetInterval) → reset count
  if (count >= maxRequestsPerInterval) → throw RateLimitError
  else → count++, proceed
```

### 3.3 Model Capability Scoring
Each model has a `ModelCapabilities` object:
```ts
{ contextWindow: number, capability: 'high'|'medium'|'low', speed: '...', useCase: string[] }
```
The config selects the cheapest model that meets the task's needs — a simple **greedy selection** heuristic.

### 3.4 JSON Parsing with JSON5
LLM responses are parsed with `JSON5.parse()` (tolerates trailing commas, comments) plus a regex-based extractor that strips markdown code fences:
```
1. Extract content between ```json ... ``` with regex
2. JSON5.parse(extracted)  — resilient to LLM formatting quirks
3. On parse failure → return structured error with partial content
```

### 3.5 Token Estimation
```ts
estimateTokens(text) ≈ text.length / 4   // ~4 chars per token heuristic
```
If `estimatedTokens > 10 000`, the system falls back to a regex-based simple extractor instead of sending to the LLM (cost/latency guard).

### 3.6 Prompt Engineering Patterns
| Pattern | Usage |
|---|---|
| System prompt injection | Chat sessions get `"You are a helpful AI career guidance assistant."` |
| Schema-constrained output | Prompts ask for JSON with exact field names, reducing hallucination |
| Module elaboration | Multi-section structured prompts for learning content generation |
| Career path scoring | Prompt includes user skills/interests → returns `{ relevanceScore: number, … }` |
| Video keyword extraction | Prompt extracts keywords from module → used in YouTube-like recommendation queries |

### 3.7 AI Nudges
Type-safe nudge objects (`{ type: 'tip'|'recommendation'|'challenge', text, icon }`) are generated by the LLM and rendered as contextual UI hints throughout the learning journey.

---

## 4. Gamification Engine

### 4.1 Points Accumulation
Activity → Event → Points:

```
Activity Types: module_complete | quiz_pass | quiz_attempt |
                flashcard_read | flashcard_set_complete |
                daily_login | assessment_complete

Flow:
  User action → useActivityLogger.logXxx()
              → POST /api/v1/gamification/activities/log
              → Backend awards points (server-side)
              → Response: { points_earned, total_points }
              → PointsNotification shown in UI
```

**Hook:** `useActivityLogger` — a callback-memoized custom hook that wraps every activity type in a type-safe method (`logModuleComplete`, `logQuizPass`, …).

### 4.2 Leaderboard Ranking
Leaderboard is computed server-side then displayed client-side, sorted by `total_points DESC`. Supported time windows:
- `all_time`, `weekly`, `monthly`, `yearly`

The `current_user_rank` is injected by the backend so the current user is always highlighted regardless of page.

### 4.3 Auto-Refresh Polling
`useGamification` hook accepts `{ enableAutoRefresh, refreshInterval }`:
```ts
useEffect(() => {
  if (!enableAutoRefresh) return;
  const id = setInterval(() => refreshAll(), refreshInterval); // default 30 s
  return () => clearInterval(id);
}, [enableAutoRefresh, refreshInterval]);
```
Pattern: **pub-sub polling** with cleanup to prevent memory leaks.

---

## 5. Streak Tracking Algorithm

**Concept:** GitHub-style activity calendar with consecutive-day streaks.

### 5.1 Calendar Cell Calculation (O(1) per cell)
```ts
// Generate 42 cells (6 weeks × 7 days) for any month
calendarCells = Array.from({ length: 42 }, (_, i) => {
  const dayNum   = i - firstDayOfWeek + 1;
  const inMonth  = dayNum > 0 && dayNum <= daysInMonth;
  const isToday  = inMonth && matches(today);
  return { dayNum, inMonth, isToday };
});
```
- `firstDay = new Date(year, month, 1).getDay()` — Sunday=0 offset.
- `daysInMo = new Date(year, month + 1, 0).getDate()` — last-day trick.
- Wrapped in `useMemo([month, year])` → only recomputes on navigation.

### 5.2 Streak State Machine
```
States: active | reset
Transitions:
  last_activity_date === yesterday → streak++ → active
  last_activity_date === today     → no change → active
  gap > 1 day                      → streak = 1 → reset
```
`current_streak` and `longest_streak` are maintained server-side; the frontend reads `StreakInfo` and renders.

---

## 6. Quiz Engine

### 6.1 AI Quiz Generation
```
User picks: Guidance → Module → Topic → #Questions
→ POST to Groq with structured prompt
→ Parse JSON5 response into QuizQuestion[]
→ POST /api/v1/quizzes (save set)
→ POST /api/v1/quiz-questions (save each question)
```

### 6.2 Answer Evaluation Algorithm
Supports **single-choice** and **multiple-choice** questions:
```ts
// Sort-based equality for multiple answers (order-independent)
isCorrect =
  JSON.stringify([...selectedAnswers].sort()) ===
  JSON.stringify([...correctAnswers].sort());
```

### 6.3 Score Calculation
```ts
accuracy (%) = (correct / total) * 100

getScoreConfig(accuracy):
  >= 80 → 'Excellent' (green)
  >= 60 → 'Good Job'  (blue)
  >= 40 → 'Keep Going'(yellow)
  < 40  → 'Needs Practice' (red)
```

### 6.4 Result Visualization
`Recharts` `PieChart` shows correct vs incorrect ratio. Cells colored with theme palette for accessibility.

---

## 7. Flashcard System

**Concept:** Spaced Repetition inspired UI (front/back flip cards).

- `FlashcardItem` stores `front_html` / `back_html` — **rich HTML content** allowing formatted text, code snippets.
- `item_order` enables deterministic sequencing.
- Activity logging (`logFlashcardRead`, `logFlashcardSetComplete`) triggers gamification rewards.

---

## 8. Resume Builder & AI Pipeline

### 8.1 Resume Processing Pipeline (Multi-stage)
```
File Upload
    │
    ▼
parseResumeFile(file)
    │  ├── PDF  → extractTextFromPDF()  [pdf.js, page-by-page]
    │  ├── TXT  → FileReader.readAsText()
    │  └── fallback → extractReadableTextFromRawPDF() [regex on raw bytes]
    │
    ▼
estimateTokens(text)  →  if > 10 000 → simpleExtraction (regex)
                      →  else        → analyzeResumeWithAI() [Groq LLM]
    │
    ▼
ExtractedResume {
  candidateName, email, phone, location,
  totalYearsExperience, topSkills,
  workExperience[], education[], certifications[],
  summary, linkedIn, portfolio
}
    │
    ▼
Map to Resume store → ResumePreview (PDF-quality rendering)
```

### 8.2 Batch Processing
```ts
processBatchResumes(files[], onProgress?)
  for each file:
    onProgress(current, total, fileName)  // progress callback
    processResumeFile(file)
```
**Concept:** Sequential iteration with a progress-callback pattern (not parallel, to avoid Groq rate limits).

### 8.3 PDF.js Integration
- Dynamic import (`import('pdfjs-dist')`) — code-split, loaded only when needed.
- Worker URL pinned to CDN version `3.11.174` for determinism.
- Page-by-page extraction with graceful skip on corrupted pages.

### 8.4 Resume Store (Zustand + persist)
```
useResumeStore  ←  Zustand create() + persist() middleware
useSettingsStore ←  persists: themeColor, fontSize, documentSize, formOrder, showBulletPoints
```
`formToShow` and `formsOrder` enable drag-to-reorder sections — **ordered list mutation** with `up`/`down` swap.

### 8.5 Document Conversion
`DocumentConversionResponse` suggests server-side DOCX/PDF export. Client sends the store JSON; backend renders the template.

---

## 9. Learning Path & Guidance Engine

### 9.1 Guidance Creation (AI-Assisted Assessment)
```
User fills: name, age, career_goal, current_skills[], interests[]
           + assessment_answers{ q_id → answer }
→ POST /api/v1/learning-guidance
→ Backend (AI) generates: LearningGuidance + LearningModules[]
→ Each module: title, content, estimated_time, module_order, completion_percentage
```

### 9.2 Module Content Structure
```ts
ModuleContent {
  title, type: 'technical'|'general',
  sections: [{
    title, content, keyPoints?,
    codeExample?: { language, code, explanation }
  }]
}
```
AI generates this JSON; frontend renders with syntax highlighting.

### 9.3 Progress Tracking
- `completion_percentage` stored per module (0–100).
- `LearningPath.progress` aggregates module completions.
- Progress bars use Mantine's `Progress` / `RingProgress` components with smooth animations.

### 9.4 Filtering & Sorting (Learning Paths)
```ts
PathFilters { searchTerm, sortBy: 'progress'|'name'|'recent' }
```
Client-side filter/sort on the fetched list — simple **Array.filter + Array.sort** composition.

---

## 10. Career Intelligence

### 10.1 Career Detail Visualization
`CareerGuidanceDetailsPage` uses multiple `Recharts` chart types:
- `BarChart` — salary ranges by industry.
- `RadarChart` — skill proficiency requirements (multi-axis spider graph).
- `RingProgress` — market demand score.

### 10.2 Skill Gap Analysis
```ts
SkillGap { user_id, career_id, skill_name, current_level, required_level, gap_score }
GET /api/v1/skill-gaps/user/:userId/career/:careerId
```
`gap_score = required_level − current_level` (computed server-side, displayed as priority queue).

### 10.3 Job Recommendations (External API)
```
GET /api/v1/jobs/search?query=...&page=1&num_pages=1&country=us&date_posted=all
```
Preset search terms are offered as quick-select chips. Client-side filter by `date_posted` and `country`.

### 10.4 Career Growth Path Scoring (`job_market_demand_score`, `growth_rate`)
Stored on `Career` entity; numerical values rendered as visual badges (`demand_level: high/medium/low`).

---

## 11. State Management Patterns

| Store | Library | Persistence | Purpose |
|---|---|---|---|
| `useResumeStore` | Zustand | `localStorage` (persist) | Resume form data |
| `useSettingsStore` | Zustand | `localStorage` (persist) | UI settings, theme |
| Auth state | React Context | Session (memory) | User / JWT |
| CASL ability | Singleton | Memory only | Permissions |
| Server state | TanStack Query | In-memory cache | All API data |

**Zustand `persist` middleware** serializes store to `localStorage` automatically. The `partialize` option lets you persist only specific slices.

---

## 12. Data Fetching & Caching (React Query)

All remote data is managed by **TanStack Query v5**:

```ts
// Typical pattern in every feature's api/ folder
export const useGetQuizzes = () =>
  useQuery({ queryKey: ['quiz', 'list'], queryFn: () => api.quiz.list() });

export const useCreateQuiz = () =>
  useMutation({ mutationFn: api.quiz.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['quiz', 'list'] }) });
```

**Concepts applied:**
- **Stale-While-Revalidate (SWR):** data served from cache, background refetch.
- **Optimistic Updates:** not explicit here, but mutation-then-invalidate achieves eventual consistency.
- **Query Key Arrays:** hierarchical keys `['quiz', 'list']` enable targeted invalidation.
- **Dependent Queries:** `useGetChatSessionMessages(sessionId)` — skips if `sessionId` is null.

---

## 13. Routing & Navigation

- **React Router v6** with `createHashRouter` (hash-based for static hosting compatibility).
- Nested routes: `/` → `<AuthGuard> → <Layout>` → feature children.
- Route-level code splitting is implicit through component-level dynamic imports.
- `useNavigate` + `location.state` pass context between pages (e.g., quiz generator pre-selects module from learning path navigation).

---

## 14. Visualization & Charting Algorithms

All charts use **Recharts** with a responsive wrapper.

| Chart | Feature | Data Algorithm |
|---|---|---|
| `AreaChart` | Points history | Cumulative sum series `points[i] += points[i-1]` |
| `PieChart` | Quiz results | `[correct, total-correct]` partition |
| `BarChart` | Career salaries | Raw min/max salary per career |
| `RadarChart` | Skill proficiency | Normalized 0–100 per axis |
| `RingProgress` | Demand score | `value = (score / 100) * 360` in Mantine |

**Custom Tooltip:** Every Recharts chart has a typed `CustomTooltip` component that reads from `payload[0].value` — rendering localized numbers (`toLocaleString()`).

**Delta calculation (PointsGraph):**
```ts
const totalPts = history.at(-1)?.cumulative_points ?? 0;
const prevPts  = history.at(-2)?.cumulative_points ?? 0;
const delta    = totalPts - prevPts; // shown as +/- badge
```

---

## 15. Theme System

### 15.1 Dynamic Theming
- Mantine's `MantineProvider` + custom `baseTheme.ts`.
- `colorScheme` toggled globally → React context propagation.
- Every component reads `useMantineColorScheme()` and `useMantineTheme()` for adaptive colors.

### 15.2 Design Tokens
```ts
// Pattern used throughout "dark-aware" components
const cardBg  = dark ? theme.colors.dark[7] : theme.white;
const border  = dark ? theme.colors.dark[5] : theme.colors.gray[2];
const subText = dark ? theme.colors.gray[4] : theme.colors.gray[6];
```

### 15.3 Motion
**Framer Motion** provides:
- `containerVariants` with `staggerChildren: 0.08` — cascading entrance animations.
- `itemVariants` with cubic-ease `[0.42, 0, 0.58, 1]` — standard ease-in-out.

---

## 16. API Client Architecture

```
src/lib/api-clients.ts   ← Axios instance (base URL, interceptors, JWT header)
src/lib/api-endpoints.ts ← URL constants (no duplication)
src/lib/api.ts           ← Typed wrapper functions grouped by domain
```

**Axios interceptors:**
- **Request interceptor:** injects `Authorization: Bearer <token>` from store.
- **Response interceptor:** normalizes error shapes → `{ message, status }`.

---

## 17. Key Design Patterns Summary

| Pattern | Where Used |
|---|---|
| **Feature-Slice Architecture** | Entire `src/features/` directory |
| **Custom Hooks** | `useGamification`, `useActivityLogger`, `useDebouncedValue`, `useNavigation` |
| **Singleton** | CASL `ability` instance |
| **Observer / Polling** | Auto-refresh in `useGamification` |
| **Strategy** | Token-count → AI vs. regex extraction in resume pipeline |
| **Pipeline / Chain** | Resume processing: extract → estimate → analyze → map |
| **Command** | Activity logger methods as encapsulated commands |
| **Context / Provider** | Auth, CASL Ability, Gamification Notifications |
| **Optimistic Rendering** | Local `localMessages` state updated before API confirm in chat |
| **Memoization** | `useMemo` for calendar cells, chart data, options lists |
| **Lazy Loading** | `pdf.js` via dynamic `import()` |
| **Debounce** | `useDebouncedValue` prevents excessive API calls on search inputs |
| **Stale-While-Revalidate** | TanStack Query default cache strategy |
| **RBAC / ABAC** | CASL rules from backend for fine-grained UI permissions |
| **Progressive Enhancement** | PDF→ fallback regex → manual text on extraction failure |

---

*Generated: April 2026 — AI Virtual Career Guidance System Frontend*
