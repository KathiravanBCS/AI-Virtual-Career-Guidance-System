# Firebase + CASL Setup Guide

AI Virtual Career Guidance System uses Firebase for authentication and CASL for authorization (permissions).

## Architecture Overview

- **Firebase Auth**: Handles login/signup and JWT tokens
- **CASL**: Manages permissions and what users can do
- **Firestore**: Stores user roles and guidance session data

## 1. Firebase Project Setup

### Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project
3. Enable Authentication (Email/Password, Google, GitHub)
4. Create a Firestore database
5. Copy your Firebase config

### Add Firebase Config

Create/update your `.env` file with Firebase credentials:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Your backend API
VITE_API_BASE_URL=https://your-backend-api.com
```

## 2. Firestore Database Setup

### Create Collections

Create the following collections in Firestore:

#### Users Collection

```
Collection: users
Documents: {uid}

Example document:
{
  uid: "user123",
  email: "user@example.com",
  displayName: "John Doe",
  role: "user",  // 'admin' | 'mentor' | 'user' | 'viewer'
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Guidance Sessions Collection

```
Collection: guidanceSessions
Documents: {sessionId}

Example document:
{
  id: "session123",
  userId: "user123",
  topic: "Career Transition Planning",
  description: "Guidance for transitioning to tech industry",
  status: "completed",  // 'draft' | 'scheduled' | 'in-progress' | 'completed'
  scheduledAt: timestamp,
  startedAt: timestamp,
  completedAt: timestamp,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### Assessments Collection

```
Collection: assessments
Documents: {assessmentId}

Example document:
{
  id: "assessment123",
  userId: "user123",
  type: "skills",  // 'skills' | 'interests' | 'aptitude'
  results: { /* assessment results */ },
  completedAt: timestamp,
  createdAt: timestamp
}
```

### Create Security Rules

Set these rules in Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read their own document
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId || isAdmin();
    }
    
    // Guidance Sessions
    match /guidanceSessions/{sessionId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner() || isMentor() || isAdmin();
      allow delete: if isOwner() || isAdmin();
    }
    
    // Assessments
    match /assessments/{assessmentId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated();
      allow update: if isOwner() || isAdmin();
      allow delete: if isOwner() || isAdmin();
    }
    
    // Learning Resources
    match /learningResources/{resourceId} {
      allow read: if isAuthenticated();
      allow write: if isAdmin();
    }
    
    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }
    
    function isAdmin() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    function isMentor() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'mentor';
    }
    
    function isOwner() {
      return request.auth.uid == resource.data.userId;
    }
  }
}
```

## 3. CASL Permissions

Roles and their permissions are defined in `src/lib/casl/ability.ts`:

### Admin
- Full system access (manage all resources)
- User and role management
- Content moderation

### Mentor
- Create and manage guidance sessions
- Provide recommendations
- Read assessments and learning resources
- View all user data (for mentoring)

### User
- Create guidance sessions
- Take assessments
- Access learning resources
- Read recommendations
- Manage own profile

### Viewer
- Read-only access to:
  - Guidance sessions (own only)
  - Assessments (own only)
  - Learning resources
  - Recommendations

## 4. Using Auth in Components

### Check if User is Authenticated

```typescript
import { useAuth } from '@/lib/auth/useAuth';

function MyComponent() {
  const { user, userRole } = useAuth();
  
  if (!user) {
    return <div>Not logged in</div>;
  }
  
  return <div>Welcome {user.email}</div>;
}
```

### Check Permissions with CASL

```typescript
import { useAbility } from '@/lib/casl/useAbility';
import { Can } from '@casl/react';

function DeleteButton() {
  const ability = useAbility();
  
  // Method 1: Using Can component
  return (
    <Can I="delete" a="GuidanceSession">
      <Button color="red">Delete Session</Button>
    </Can>
  );
  
  // Method 2: Using ability directly
  if (ability.can('delete', 'GuidanceSession')) {
    return <Button>Delete</Button>;
  }
  
  return null;
}
```

### Logout

```typescript
import { LogoutButton } from '@/lib/auth/LogoutButton';

export function Header() {
  return <LogoutButton />;
}
```

## 5. Backend Integration

### Verify Firebase Token

On your backend, verify the Firebase ID token:

```python
# Python with Flask example
from firebase_admin import auth, firestore

@app.route('/api/v1/guidance-sessions', methods=['POST'])
def create_guidance_session():
    token = request.headers.get('Authorization', '').split('Bearer ')[-1]
    
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token['uid']
        
        # Get user role from Firestore
        db = firestore.client()
        user_doc = db.collection('users').document(uid).get()
        role = user_doc.to_dict().get('role')
        
        # Validate permission
        if role not in ['admin', 'mentor', 'user']:
            return {'error': 'Forbidden'}, 403
        
        # Create guidance session...
        return {'success': True}, 201
    except Exception as e:
        return {'error': 'Unauthorized'}, 401
```

### Get Firebase Token from Frontend

```typescript
import { useAuth } from '@/lib/auth/useAuth';

async function fetchWithAuth(url, options = {}) {
  const { user } = useAuth();
  
  if (!user) {
    throw new Error('Not authenticated');
  }
  
  const token = await user.getIdToken();
  
  return fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      'Authorization': `Bearer ${token}`,
    },
  });
}
```

## 6. Common Tasks

### Add New User Role

Edit `src/lib/casl/ability.ts`:

```typescript
export type UserRole = 'admin' | 'mentor' | 'user' | 'viewer' | 'coordinator';

// In defineAbility function:
if (user.role === 'coordinator') {
  can('read', 'GuidanceSession');
  can('create', 'GuidanceSession');
  can('update', 'Assessment');
  // ... add more rules
}
```

### Update User Role

```typescript
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/config/firebaseConfig';

async function updateUserRole(userId: string, newRole: string) {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, { role: newRole });
}
```

### Create Guidance Session

```typescript
import { useAuth } from '@/lib/auth/useAuth';
import { api } from '@/lib/api';

async function createGuidanceSession() {
  const { user } = useAuth();
  
  if (!user) throw new Error('Not authenticated');
  
  const session = await api.guidanceSessions.create({
    userId: user.uid,
    topic: 'Career Change',
    description: 'Exploring career transition options',
    scheduledAt: new Date().toISOString(),
  });
  
  return session;
}
```

### Protect a Route by Permission

```typescript
import { Navigate } from 'react-router-dom';
import { useAbility } from '@/lib/casl/useAbility';

function AdminRoute({ children }) {
  const ability = useAbility();
  
  if (!ability.can('manage', 'All')) {
    return <Navigate to="/" />;
  }
  
  return children;
}
```

## 7. Environment Setup

### Development (Local)
- Firebase local emulator (optional)
- Firestore in development mode
- Debugging enabled

### QA/UAT
- Firebase staging project
- All auth methods enabled
- Security rules enforced

### Production
- Firebase production project
- Enhanced security rules
- Monitoring enabled

## Troubleshooting

### Firebase Config Not Loading
- Check `.env` file has all required VITE_ prefixed variables
- Verify VITE_ prefix (Vite requirement)
- Restart dev server after changing .env

### User Role Not Loading
- Check Firestore database exists
- Verify user document exists in users collection
- Check Firestore security rules allow reads
- Verify auth token is valid

### CASL Permissions Not Working
- Import `Can` from `@casl/react` for UI protection
- Backend must also verify tokens and apply CASL rules
- Refresh page after role changes
- Check ability definition in `src/lib/casl/ability.ts`

### Token Verification Failing
- Ensure Firebase Admin SDK is initialized on backend
- Verify token hasn't expired
- Check Authorization header format: `Bearer {token}`
- Validate token claim (uid, email, custom claims)

## Migration from Azure MSAL

The following MSAL dependencies have been removed:
- `@azure/msal-browser`
- `@azure/msal-react`

Replaced with:
- `firebase` - Modern auth platform
- `@casl/ability` + `@casl/react` - Fine-grained permissions

All auth logic moved to `src/lib/auth/` and permissions to `src/lib/casl/`.

## Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [CASL Documentation](https://casl.js.org)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)
