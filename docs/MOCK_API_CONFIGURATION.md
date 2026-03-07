# Mock API Configuration Guide

## Environment Configuration

### `.env` File Setup

```env
# ============================================
# API Configuration (CRITICAL)
# ============================================
VITE_USE_MOCK_API=true      # Enable/Disable mock API
VITE_API_BASE_URL=http://localhost:3000/api

# ============================================
# Firebase Configuration
# ============================================
VITE_FIREBASE_API_KEY=AIzaSyD_example_key_here
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123def456

# ============================================
# Environment
# ============================================
VITE_ENVIRONMENT=development
```

---

## API Configuration Options

### `VITE_USE_MOCK_API` Flag

| Value | Behavior | Use Case |
|-------|----------|----------|
| `true` | Uses MockServices | Development, Testing, Demos |
| `false` | Uses RealServices (HTTP) | Production, Staging |
| Not Set | Defaults to `true` | Safe fallback |

### Examples

```env
# Development with Mock API
VITE_USE_MOCK_API=true
VITE_ENVIRONMENT=development

# Production with Real API
VITE_USE_MOCK_API=false
VITE_ENVIRONMENT=production
VITE_API_BASE_URL=https://api.production.com
```

---

## Mock Services Structure

### Directory Layout

```
src/services/mock/
├── index.ts                          # Main export - aggregates all services
├── utils.ts                          # Utility functions for data generation
├── BaseService.ts                    # Abstract base class for all mock services
│
├── data/                             # Static mock data (seeds)
│   ├── users.ts                      # User data & generation functions
│   └── [feature].ts                  # Add more data files per feature
│
└── implementations/                  # Service implementations
    ├── UserService.ts                # User CRUD operations
    └── [Feature]Service.ts           # Add more services per feature
```

---

## Available Mock Utilities

### Data Generation Functions

```typescript
// ID Generation
generateId()                          // Sequential ID starting from 1000

// Name & Company
generatePersonName()                  // Random Indian person name
generateCompanyName()                 // Random company name
generateEmail(name?, domain?)         // Realistic email address
generatePhoneNumber()                 // +91 Indian phone number

// Financial
generateAmount(min, max)              // Random amount between range
generatePercentage(min, max)          // Random percentage value

// Indian Compliance
generatePAN()                         // PAN number (e.g., ABCDE1234F)
generateGSTIN()                       // 13-digit GSTIN
generateTAN()                         // Tax Accounting Number
generateIFSC()                        // Bank IFSC code
generateBankAccount()                 // Bank account number

// Dates
generateDateBetween(start, end)       // Random date in range
generatePastDate(daysAgo)             // Date in the past
generateFutureDate(daysAhead)         // Date in the future

// Utilities
selectRandom(items)                   // Pick random from array
selectMultipleRandom(items, count)    // Pick multiple random items
generateAddress()                     // Random Indian address

// Network Simulation
delay(ms)                             // Simulate API delay (default 300ms)
```

---

## Mock Service Implementation

### Base Service Pattern

All mock services extend `BaseMockService`:

```typescript
import { BaseMockService } from '../BaseService';
import { mockUsers } from '../data/users';
import { User, CreateUserRequest, UpdateUserRequest } from '@/features/users/types';

export class MockUserService extends BaseMockService<
  User,
  CreateUserRequest,
  UpdateUserRequest
> {
  constructor() {
    super(mockUsers, 1000, 300);
  }

  // Add custom methods as needed
  async getByDepartment(department: string): Promise<User[]> {
    const users = await this.getAll();
    return users.filter(u => u.department === department);
  }
}

export const mockUserService = new MockUserService();
```

### Base Service Methods

```typescript
// CRUD Operations
await service.getAll()                // Get all items
await service.getById(id)             // Get item by ID
await service.create(data)            // Create new item
await service.update(id, data)        // Update item
await service.delete(id)              // Delete item

// Utility Methods
await service.count()                 // Get count of items
await service.exists(id)              // Check if exists
service.reset(data)                   // Reset data (for testing)
```

---

## Using Mock Services

### In React Components

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '@/lib/api';

// Get all users
function UsersList() {
  const { data: users, isLoading } = useQuery({
    queryKey: ['users'],
    queryFn: () => api.users.getAll(),
  });

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {users?.map(user => <div key={user.id}>{user.name}</div>)}
    </div>
  );
}

// Create user
function CreateUserForm() {
  const { mutate: createUser } = useMutation({
    mutationFn: (data: CreateUserRequest) => api.users.create(data),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });

  const handleSubmit = (formData: CreateUserRequest) => {
    createUser(formData);
  };

  return <form onSubmit={() => handleSubmit({} as any)}>...</form>;
}
```

### Directly Using Mock Service

```typescript
import { mockUserService } from '@/services/mock';

// Get user by ID
const user = await mockUserService.getById(1000);

// Create user
const newUser = await mockUserService.create({
  name: 'John Doe',
  email: 'john@example.com',
  // ... other fields
});

// Update user
const updated = await mockUserService.update(1000, {
  department: 'Engineering',
});

// Delete user
await mockUserService.delete(1000);

// Custom methods
const engineers = await mockUserService.getByDepartment('Engineering');
```

---

## Adding New Mock Features

### Step 1: Create Mock Data File

```typescript
// src/services/mock/data/skills.ts
import { Skill } from '@/features/skills/types';
import { generateId } from '../utils';

export const mockSkills: Skill[] = [
  {
    id: 1000,
    name: 'TypeScript',
    category: 'Programming',
    level: 'Advanced',
    endorsed: true,
  },
  // ... more mock data
];
```

### Step 2: Create Service Implementation

```typescript
// src/services/mock/implementations/SkillService.ts
import { BaseMockService } from '../BaseService';
import { mockSkills } from '../data/skills';
import { Skill, CreateSkillRequest, UpdateSkillRequest } from '@/features/skills/types';

export class MockSkillService extends BaseMockService<
  Skill,
  CreateSkillRequest,
  UpdateSkillRequest
> {
  constructor() {
    super(mockSkills, 1000, 300);
  }

  async getByCategory(category: string): Promise<Skill[]> {
    const skills = await this.getAll();
    return skills.filter(s => s.category === category);
  }
}

export const mockSkillService = new MockSkillService();
```

### Step 3: Export in MockServices

```typescript
// src/services/mock/index.ts
import { mockSkillService } from './implementations/SkillService';

export const MockServices = {
  users: mockUserService,
  skills: mockSkillService,  // Add new service
};
```

### Step 4: Update API Interface

```typescript
// src/lib/api.ts
export const api: ApiInterface = USE_MOCK ? MockServices : RealServices;

interface ApiInterface {
  users: typeof RealServices.users;
  skills: typeof RealServices.skills;  // Add to interface
}
```

---

## Switching Between Mock and Real API

### Option 1: Environment Variable

```env
# Development
VITE_USE_MOCK_API=true

# Production
VITE_USE_MOCK_API=false
```

### Option 2: Runtime Check

```typescript
import { useIsMockApi } from '@/lib/api';

function ApiStatus() {
  const isMock = useIsMockApi();
  return <div>{isMock ? '📊 Using Mock API' : '🌐 Using Real API'}</div>;
}
```

---

## Mock Data Characteristics

### In-Memory Storage
- Data stored in JavaScript memory only
- Lost on page refresh
- Per-browser-session data
- No persistence across tabs

### Automatic Delay Simulation
- Default 300ms delay per operation
- Simulates real network latency
- Helps test loading states
- Can be customized per service

### Data Mutations
- All CRUD operations modify internal state
- Changes persist during session
- Automatically tracked by TanStack Query
- Resets on page refresh

---

## Testing with Mock API

### Benefits

✅ Predictable - Same data every run  
✅ Fast - No network latency (just 300ms simulated)  
✅ Isolated - No external dependencies  
✅ Deterministic - No race conditions  
✅ Controllable - Reset data between tests  

### Example Test

```typescript
import { render, screen, waitFor } from '@testing-library/react';
import { mockUserService } from '@/services/mock';
import UsersList from './UsersList';

describe('UsersList', () => {
  beforeEach(() => {
    // Reset to default mock data
    mockUserService.reset(mockUsers);
  });

  test('displays users from mock service', async () => {
    render(<UsersList />);

    await waitFor(() => {
      expect(screen.getByText('Rajesh Kumar')).toBeInTheDocument();
    });
  });

  test('creates new user', async () => {
    const newUser = await mockUserService.create({
      name: 'Test User',
      email: 'test@example.com',
      // ... other fields
    });

    expect(newUser.id).toBeDefined();
    expect(newUser.name).toBe('Test User');
  });
});
```

---

## Debugging Mock API

### Enable Console Logging

```typescript
// src/services/mock/BaseService.ts - Add logging
async create(createData: CreateDTO): Promise<T> {
  console.log('[MOCK] Creating:', createData);
  const result = await super.create(createData);
  console.log('[MOCK] Created:', result);
  return result;
}
```

### Check Mock API Status

```typescript
import { useIsMockApi } from '@/lib/api';

function DebugInfo() {
  const isMock = useIsMockApi();
  return (
    <div>
      API Mode: <strong>{isMock ? 'MOCK' : 'REAL'}</strong>
    </div>
  );
}
```

---

## Common Issues & Solutions

### Issue: Data Lost on Refresh
**Expected Behavior** - Mock data is session-only  
**Solution** - Use localStorage if persistence needed

### Issue: Changes Not Appearing
**Possible Cause** - TanStack Query cache not invalidated  
**Solution** - Invalidate query key after mutations

```typescript
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['users'] });
}
```

### Issue: Mock API Running in Production
**Problem** - Accidentally left `VITE_USE_MOCK_API=true`  
**Solution** - Check `.env` files and build process

---

## Performance Tips

### Optimize Delay
```typescript
// Fast (100ms) for development
export class FastMockUserService extends MockUserService {
  constructor() {
    super();
    this.delayMs = 100;  // Set custom delay
  }
}

// No delay for unit tests
mockUserService.delayMs = 0;
```

### Large Datasets
```typescript
// Generate 1000 users for performance testing
const largeUserSet = generateMockUsers(1000);
mockUserService.reset(largeUserSet);
```

---

## Summary

✅ **Complete Mock Framework** - Full CRUD operations  
✅ **Zero Configuration** - Single environment variable  
✅ **Type-Safe** - Full TypeScript support  
✅ **Easy to Extend** - Base service pattern  
✅ **Realistic Data** - Indian compliance data generation  
✅ **Testing Ready** - Predictable, isolated data  
✅ **Seamless Switching** - Switch real/mock with env var  

---

## Next Steps

1. **Copy `.env` template** - Configure `VITE_USE_MOCK_API=true`
2. **Create mock data files** - Add seed data for your features
3. **Implement services** - Extend `BaseMockService`
4. **Update API interface** - Add to `src/lib/api.ts`
5. **Use in components** - Import from `api` object
6. **Test thoroughly** - Verify all CRUD operations
7. **Switch to real API** - Set `VITE_USE_MOCK_API=false` when ready
