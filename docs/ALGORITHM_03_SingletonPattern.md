# Algorithm 3: Singleton Pattern - CASL Permission Engine

## Overview
**Type:** Singleton Pattern (GoF - Gang of Four)  
**Real-world Usage:** Centralized permission/authorization system  
**Location in Code:** `src/lib/casl/ability.ts`, `src/lib/casl/useCASLIntegration.ts`  
**Time Complexity:** O(1) per permission check  
**Space Complexity:** O(r) where r = number of rules  

---

## Problem Statement

The system needs role-based and attribute-based access control (RBAC/ABAC) where:

```
Requirements:
├─ One global permission registry (state must be shared)
├─ Update permissions after user login
├─ Check permissions before rendering UI components
├─ Reset permissions on logout
├─ Avoid permission data duplication
└─ Prevent multiple permission sources (single source of truth)
```

**Anti-pattern (WRONG):**
```javascript
// Bad: Permission data scattered across components
function Dashboard() {
    const [canCreateQuiz, setCanCreateQuiz] = useState(false);
    useEffect(() => {
        api.getPermissions().then(p => setCanCreateQuiz(p.quiz.create));
    }, []);
    
    return canCreateQuiz ? <QuizButton /> : null;
}

function LearningPath() {
    const [canView, setCanView] = useState(false);
    useEffect(() => {
        api.getPermissions().then(p => setCanView(p.path.read));
    }, []);
    
    return canView ? <PathList /> : null;
}

// Problem: 
// - Multiple API calls for same data
// - Inconsistent state if one update fails
// - Hard to clear permissions globally
```

---

## Solution: Singleton Pattern

### Architecture Diagram
```
┌──────────────────────────────────────────────┐
│         Global Ability Instance (Singleton)  │
├──────────────────────────────────────────────┤
│  rules: CASL.Rule[] = []                     │
│  can(action, subject): boolean               │
│  cannot(action, subject): boolean            │
│  update(rules): void                         │
│  reset(): void                               │
└──────────────────────────────────────────────┘
           △
           │ (shared reference)
           │
    ┌──────┴──────┬─────────────┬──────────────┐
    │             │             │              │
Component1    Component2    Component3    AbilityContext
 checks        checks        checks       (React wrapper)
 ability       ability       ability
```

### Single Instance Guarantee
```typescript
// File: src/lib/casl/ability.ts

// Create once, never again
const ability = createMongoAbility();

// All imports reference THE SAME object
import { ability } from './ability';
```

---

## Permission Model: CASL Rules

### Rule Structure
```
interface Rule {
    action: string;        // 'create', 'read', 'update', 'delete', 'manage'
    subject: string;       // 'Quiz', 'LearningModule', 'User', 'all'
    conditions?: object;   // Optional: field-level restrictions
}

Examples:
[
    { action: 'manage', subject: 'all' }                    // Admin: full access
    { action: 'read', subject: 'Quiz' }                     // Student: read quizzes
    { action: 'create', subject: 'Quiz', conditions: {...}} // Teacher: create own quizzes
]
```

---

## Algorithm: Permission Checking

```
class AbilityEngine:
    static instance = null
    rules = []
    
    // Singleton pattern
    static getInstance():
        if not AbilityEngine.instance:
            AbilityEngine.instance = new AbilityEngine()
        return AbilityEngine.instance
    
    // Load permissions from backend
    update(newRules):
        this.rules = newRules
        log("Permissions updated: " + newRules.length + " rules loaded")
    
    // Check if action is allowed on subject
    can(action, subject):
        for rule in this.rules:
            if rule.action in ['manage', action]:
                if rule.subject in ['all', subject]:
                    if matchesConditions(rule.conditions):
                        return true
        return false
    
    // Inverse check
    cannot(action, subject):
        return not can(action, subject)
    
    // Clear all permissions (logout)
    reset():
        this.rules = []
        this.notify("Permissions cleared")

// Usage
const ability = AbilityEngine.getInstance()
ability.can('create', 'Quiz')  // O(r) where r = rule count
```

---

## Permission Tree Example

```
User: Student / Role ID: 2
├─ Action: read
│  ├─ Subject: Quiz         ✓ Allowed
│  ├─ Subject: LearningModule ✓ Allowed
│  └─ Subject: User (self)  ✓ Allowed
│
├─ Action: create
│  ├─ Subject: Quiz         ✗ Denied
│  ├─ Subject: ChatSession  ✓ Allowed
│  └─ Subject: Assessment   ✗ Denied
│
└─ Action: update
   ├─ Subject: UserProfile (own) ✓ Allowed
   └─ Subject: Quiz (any)        ✗ Denied

User: Teacher / Role ID: 3
├─ Action: manage
│  ├─ Subject: Quiz (in own course) ✓ Allowed
│  ├─ Subject: LearningModule       ✓ Allowed
│  └─ Subject: User (students only) ✓ Allowed (limited)
│
└─ Action: create
   ├─ Subject: Assessment              ✓ Allowed
   └─ Subject: LearningGuidance        ✓ Allowed

User: Admin / Role ID: 1
└─ Action: manage
   └─ Subject: all                     ✓ Always Allowed
```

---

## Loading Permissions (System Flow)

```
1. User Login Success
   └─ AuthProvider.setUser(userData)
   
2. AuthProvider calls:
   └─ useCASLIntegration().loadPermissions()
   
3. Fetch from backend:
   └─ GET /api/v1/users/permissions/current
   └─ Response: { user_id: 42, role: 'teacher', rules: [...] }
   
4. Update global singleton:
   └─ ability.update(response.rules)
   
5. All components can now check:
   └─ if (ability.can('create', 'Quiz')) { ... }
   
6. On Logout:
   └─ useCASLIntegration().clearPermissions()
   └─ ability.reset()  // rules = []
   └─ All checks now return false
```

---

## Real-world UI Gating Example

```
Component: QuizGeneratorButton

function QuizButton() {
    const ability = useAbility();  // Gets singleton instance
    
    if (!ability.can('create', 'Quiz')) {
        return <Tooltip label="No permission to create quizzes" />;
    }
    
    return <Button onClick={generateQuiz}>Create Quiz</Button>;
}

// Behavior:
├─ Student logs in
│  └─ ability.can('create', 'Quiz') = false
│  └─ Button is disabled
│
├─ Teacher logs in
│  └─ ability.can('create', 'Quiz') = true (in own course)
│  └─ Button is enabled
│
└─ Admin logs in
   └─ ability.can('create', 'Quiz') = true (manage all)
   └─ Button is enabled
```

---

## Singleton Guarantees

```
Property 1: Single Instance
├─ Only ONE ability object exists in memory
├─ All imports reference the same object
└─ Memory efficient

Property 2: Global Access
├─ Can be accessed from any component
├─ No prop drilling needed
├─ One source of truth

Property 3: Initialize Once
├─ First access: create instance
├─ Subsequent access: return existing
├─ Thread-safe (in single-threaded JS)

Property 4: Stateful
├─ Remembers rules between calls
├─ State persists until explicitly reset
└─ No need to refetch permissions per check
```

---

## Why Singleton for CASL?

| Reason | Benefit |
|--------|---------|
| **Single source of truth** | One global permission registry |
| **Avoid duplication** | Don't fetch permissions 100 times |
| **Thread-safe updates** | All components immediately see new rules |
| **Simple API** | `ability.can(action, subject)` anywhere |
| **Cost-efficient** | One API call per login, not per component |
| **Easy logout** | `ability.reset()` affects everything |

---

## Implementation Pattern (JavaScript/TypeScript)

```typescript
// Lazy singleton with getter
let instance = null;

export const createAppAbility = (rules = []) => {
    return createMongoAbility(rules);
};

// Global instance
export const ability = createAppAbility();

// The singleton guarantee
export const getAbility = () => {
    if (!instance) {
        instance = createAppAbility();
    }
    return instance;
};

// Update function
export const updateAbility = (rules) => {
    ability.update(rules);
};

// Reset function
export const resetAbility = () => {
    ability.update([]);
};
```

---

## Application in Career Guidance System

**Login Flow:**
1. User authenticates (Firebase / JWT)
2. System fetches user roles and permissions
3. CASL ability instance is populated
4. UI reflects allowed actions based on role

**Role Examples:**
- **Student:** Can read modules, take quizzes, view leaderboard
- **Teacher:** Can create quizzes, view student progress
- **Admin:** Full system access; manage users, roles, content

**Enforcement:**
- Backend: REST API checks permissions before returning data
- Frontend: UI buttons/routes hidden if permission is denied

---

## Design Pattern Classification
✅ **Singleton Pattern (GoF)**  
✅ **Creational Pattern**  
✅ **Object-oriented pattern**  

---

*Perfect for: Global state, configuration managers, resource pools, caching*
