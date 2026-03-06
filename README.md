# AI Virtual Career Guidance System

AI-powered career guidance platform built with React 19, TypeScript, and Vite.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linting
npm run lint
```

## Project Structure

```
src/
├── components/          # Shared UI components
│   ├── display/         # Display components (EmptyState, etc.)
│   ├── Layout/          # Layout components (Header, Sidebar)
│   ├── list-page/       # List page composition components
│   ├── Navigation/      # Navigation components and data
│   └── tables/          # Table-related components
├── config/              # Configuration files
│   ├── authConfig.ts    # Authentication config
│   └── environments/    # Environment-specific configs
├── contexts/            # React context providers
├── features/            # Business feature modules
│   ├── guidance/        # Guidance session management
│   ├── careers/         # Career exploration
│   ├── skills/          # Skills management
│   ├── assessments/     # Assessment tools
│   ├── recommendations/ # Career recommendations
│   ├── learning/        # Learning resources
│   └── contact/         # Contact management
├── lib/                 # Shared libraries and utilities
│   ├── api.ts           # Main API service layer
│   ├── api-clients.ts   # API client (fetch wrapper with auth)
│   ├── api-endpoints.ts # API endpoint definitions
│   ├── auth/            # Authentication utilities
│   ├── casl/            # Authorization (CASL)
│   ├── hooks/           # Shared custom hooks
│   └── utils/           # Utility functions
├── pages/               # Standalone pages (Dashboard, etc.)
├── theme/               # Theme configuration
├── App.tsx              # Application root
├── Router.tsx           # Route definitions
└── main.tsx             # Application entry point
```

## Features

- **AI-Powered Guidance Sessions**: Create and manage personalized career guidance sessions
- **Career Exploration**: Browse and discover career paths
- **Skills Assessment**: Evaluate and improve professional skills
- **Learning Resources**: Access curated learning materials and courses
- **Recommendations**: Get AI-generated career recommendations
- **Progress Tracking**: Monitor career development and learning progress
- **Role-Based Access**: Admin, Mentor, User, and Viewer roles

## Technology Stack

| Technology        | Purpose                 |
| ----------------- | ----------------------- |
| React 19          | UI Framework            |
| TypeScript        | Type Safety             |
| Vite              | Build Tool              |
| Mantine v8        | UI Library              |
| React Router v7   | Routing                 |
| TanStack Query v5 | Server State            |
| Firebase          | Authentication          |
| CASL              | Authorization           |
| Tabler Icons      | Icons                   |

## API Architecture

The application uses a centralized API service layer located in `src/lib/`.

### API Files

- `api.ts` — Main API service with all endpoint methods
- `api-clients.ts` — Fetch wrapper with authentication and error handling
- `api-endpoints.ts` — All API endpoint URL definitions

### Usage Example

```tsx
// In a TanStack Query hook
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';

export const useGetCareers = () => {
  return useQuery({
    queryKey: ['careers'],
    queryFn: () => api.careers.getAll(),
  });
};
```

### Adding New API Endpoints

1. Add endpoint URL in `src/lib/api-endpoints.ts`
2. Add service method in `src/lib/api.ts`
3. Create TanStack Query hook in `features/*/api/`

## Naming Conventions

### Folder Names

Use **lowercase** with **kebab-case** for multi-word folders.  
Examples: `guidance-session`, `learning-resource`

### File Names

- **Components**: PascalCase (e.g., `GuidanceSession.tsx`, `CareerCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useGetCareers.ts`)
- **Utilities**: camelCase (e.g., `configLoader.ts`)
- **Types**: camelCase for files (e.g., `types.ts`)

### Import Organization

```tsx
// 1. React imports
import { useEffect, useState } from 'react';
import { IconUser } from '@tabler/icons-react';

// 2. Third-party libraries
import { useQuery } from '@tanstack/react-query';

// 3. Internal absolute imports
import { ListTable } from '@/components/tables/ListTable';
import { api } from '@/lib/api';

// 4. Internal relative imports
import { GuidanceCard } from './components/GuidanceCard';
import type { GuidanceSession } from './types';
```

## Available Routes

| Route                      | Description                         |
| -------------------------- | ----------------------------------- |
| `/`                        | Dashboard                           |
| `/guidance`                | Guidance sessions list              |
| `/guidance/:id/view`       | View guidance session               |
| `/guidance/:id/edit`       | Edit guidance session               |
| `/guidance/new`            | Create new guidance session         |
| `/careers`                 | Career exploration                  |
| `/skills`                  | Skills management                   |
| `/assessments`             | Assessment tools                    |
| `/recommendations`         | Career recommendations              |
| `/learning`                | Learning resources                  |

## Authentication & Authorization

### Firebase Authentication

- Email/Password authentication
- Google Sign-in support
- GitHub Sign-in support
- JWT token-based API access

### Role-Based Authorization (CASL)

Permissions are managed through CASL with the following roles:

- **Admin**: Full system access
- **Mentor**: Can manage guidance sessions and provide recommendations
- **User**: Can create/manage own guidance sessions
- **Viewer**: Read-only access to all resources

See `src/lib/casl/ability.ts` for detailed permission definitions.

## Environment Configuration

Environment-specific configurations are located in `src/config/environments/`:

| File       | Environment             | API URL                                           |
| ---------- | ----------------------- | ------------------------------------------------- |
| `local.ts` | Local development       | http://localhost:8000                            |
| `dev.ts`   | Development environment | https://gm-aicg-guidance-dev-api.azurewebsites.net |
| `qa.ts`    | QA/Testing environment  | https://gm-aicg-guidance-qa-api.azurewebsites.net |
| `uat.ts`   | User acceptance testing | https://gm-aicg-guidance-uat-api.azurewebsites.net |
| `prod.ts`  | Production environment  | https://gm-aicg-guidance-prod-api.azurewebsites.net |

## Development Principles

### 1. Feature-Sliced Design

Each feature is self-contained with its own pages, components, API hooks, and types. Features should not import from other features. Shared code goes in `lib/` or `components/`.

### 2. No Barrel Exports

Import components directly from their files. Do not create `index.ts` files for re-exporting. This improves tree-shaking and build performance.

### 3. State Management

- **Server State**: TanStack Query for all API data
- **Local State**: React `useState` for component state
- **Authorization**: CASL for permission-based access control

## Best Practices

1. **Always run build before committing** — Ensure no TypeScript errors
2. **Follow naming conventions** — Consistent file and folder names
3. **Direct imports only** — No barrel exports in features
4. **Type everything** — Avoid `any` types
5. **Co-locate related code** — Keep feature code together
6. **Reuse shared components** — Don't duplicate UI components
7. **Check permissions** — Use CASL to guard sensitive actions

## Adding a New Feature

1. Create feature folder: `src/features/your-feature/`
2. Add subdirectories: `api/`, `components/`, `pages/`, `types.ts`
3. Create page components in `pages/`
4. Add route in `src/Router.tsx`
5. Create API hooks in the `api/` folder
6. Define permissions in `src/lib/casl/ability.ts` if needed

## Documentation

- [Firebase Setup Guide](./FIREBASE_SETUP.md) — Authentication and authorization setup
