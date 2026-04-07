# Algorithm 5: Leaderboard Ranking & Scoring Algorithm

## Overview
**Type:** Comparative Sorting + Ranking Algorithm  
**Real-world Usage:** Multi-dimensional competitive ranking system  
**Location in Code:** `src/features/leaderboard/pages/LeaderboardPage.tsx`, `src/features/gamification/types.ts`  
**Time Complexity:** O(n log n) sort + O(n) ranking  
**Space Complexity:** O(n) for sorted array  

---

## Problem Statement

Competitive rankings need to:

```
Requirements:
├─ Rank users by total points (highest first)
├─ Break ties using streak count (secondary sort)
├─ Handle different time periods (weekly, monthly, all-time)
├─ Highlight current user's position
├─ Update efficiently as users earn points
├─ Show both absolute rank and position relative to current user
└─ Paginate for performance (top 100, not all users)
```

**Challenges:**
```
├─ User A: 1000 points, 5 streak   → Rank?
├─ User B: 1000 points, 10 streak  → Should rank higher (tiebreaker)
├─ User C: 900 points, 50 streak   → Ranks lower
├─ How to show "You're #42"?
└─ What if current user not in top 100?
```

---

## Solution: Multi-level Sorting Algorithm

### Data Model

```typescript
interface LeaderboardEntry {
    rank: number;              // Final computed rank (1, 2, 3, ...)
    user_id: number;           // User identifier
    user_name: string;         // Display name
    user_photo?: string;       // Avatar
    total_points: number;      // Primary sort: DESCENDING
    streak: number;            // Secondary sort: DESCENDING (tiebreaker)
    is_current_user?: boolean; // Highlight flag
    updated_at?: string;       // Last update timestamp
}

interface LeaderboardResponse {
    period: 'all_time' | 'weekly' | 'monthly' | 'yearly';
    entries: LeaderboardEntry[];
    current_user_rank?: number; // Always included
    total_users: number;
    updated_at?: string;
}
```

---

## Core Algorithm: Multi-level Sorting & Ranking

```
function computeLeaderboard(users[], period):
    
    // Step 1: Filter users by period
    filtered = filterByPeriod(users, period)
    
    // Step 2: Sort by multiple criteria (stable sort)
    sorted = filtered.sort((a, b) => {
        // Primary sort: Total points (descending)
        if (a.total_points !== b.total_points) {
            return b.total_points - a.total_points
        }
        
        // Tiebreaker 1: Streak count (descending)
        if (a.streak !== b.streak) {
            return b.streak - a.streak
        }
        
        // Tiebreaker 2: User ID (ascending, for stability)
        return a.user_id - b.user_id
    })
    
    // Step 3: Assign ranks
    ranked = []
    for i = 0 to sorted.length:
        entry = sorted[i]
        entry.rank = i + 1  // Ranks are 1-indexed
        ranked.append(entry)
    
    // Step 4: Find current user rank
    currentUserRank = findRank(ranked, currentUserId)
    
    // Step 5: Return paginated results
    paginated = ranked.slice(0, 100)  // Top 100 only
    
    return {
        period: period,
        entries: paginated,
        current_user_rank: currentUserRank,  // Even if user not in top 100
        total_users: sorted.length,
        updated_at: now()
    }
```

---

## Sorting Breakdown (Example Data)

### Input Data
```
[
    { id: 101, name: "Alice",   points: 1500, streak: 7  },
    { id: 102, name: "Bob",     points: 1500, streak: 3  },
    { id: 103, name: "Charlie", points: 1200, streak: 15 },
    { id: 104, name: "Diana",   points: 1500, streak: 7  },
    { id: 105, name: "Eve",     points: 2000, streak: 2  },
]
```

### Sorting Steps

**Step 1: Sort by points (descending)**
```
1. Eve     (2000 pts)
2. Alice   (1500 pts)
3. Bob     (1500 pts)  ← Tied with Alice
4. Diana   (1500 pts)  ← Tied with Alice
5. Charlie (1200 pts)
```

**Step 2: Apply streak tiebreaker**
```
For Alice, Bob, Diana (all 1500 points):
  Alice:  streak = 7  → Rank 2
  Bob:    streak = 3  → Rank 4 
  Diana:  streak = 7  → Rank 3 (higher user_id, stable sort)
```

**Step 3: Final ranking**
```
Rank 1: Eve     (2000 pts, streak: 2)
Rank 2: Alice   (1500 pts, streak: 7)
Rank 3: Diana   (1500 pts, streak: 7)
Rank 4: Bob     (1500 pts, streak: 3)
Rank 5: Charlie (1200 pts, streak: 15)
```

### Output
```json
{
    "period": "all_time",
    "entries": [
        { "rank": 1, "user_name": "Eve",     "total_points": 2000, "streak": 2  },
        { "rank": 2, "user_name": "Alice",   "total_points": 1500, "streak": 7  },
        { "rank": 3, "user_name": "Diana",   "total_points": 1500, "streak": 7  },
        { "rank": 4, "user_name": "Bob",     "total_points": 1500, "streak": 3  },
        { "rank": 5, "user_name": "Charlie", "total_points": 1200, "streak": 15 }
    ],
    "current_user_rank": 2,    // If Alice is logged in
    "total_users": 5,
    "updated_at": "2026-04-06T10:30:00Z"
}
```

---

## Time Period Variants

### Period-based Scoring
```
Period: 'all_time'
├─ Uses: total_points (all earned points, ever)
├─ Update frequency: When activity logged
└─ Use case: Hall of fame

Period: 'weekly'
├─ Uses: points earned in last 7 days
├─ Update frequency: Every 24 hours (cache, not real-time)
├─ Reset: Every Sunday
└─ Use case: Weekly challenges

Period: 'monthly'
├─ Uses: points earned in current calendar month
├─ Update frequency: Every 24 hours
├─ Reset: Every 1st of month
└─ Use case: Monthly competitions

Period: 'yearly'
├─ Uses: points earned in current calendar year
├─ Update frequency: Weekly cache
├─ Reset: Every January 1st
└─ Use case: Annual awards
```

### Period Filtering Algorithm
```
function filterByPeriod(users, period):
    
    now = currentTime()
    
    switch(period):
        case 'weekly':
            weekStart = now - 7 days
            return users.filter(u => u.last_activity >= weekStart)
        
        case 'monthly':
            monthStart = new Date(now.year, now.month, 1)
            return users.filter(u => u.last_activity >= monthStart)
        
        case 'yearly':
            yearStart = new Date(now.year, 0, 1)
            return users.filter(u => u.last_activity >= yearStart)
        
        case 'all_time':
            return users
```

---

## Database-Side Ranking (Optimized)

```sql
-- Efficient leaderboard query (backend would use similar)
SELECT 
    ROW_NUMBER() OVER (ORDER BY total_points DESC, streak DESC) AS rank,
    user_id,
    user_name,
    user_photo,
    total_points,
    streak,
    updated_at
FROM user_gamification_stats
WHERE updated_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)  -- Weekly
ORDER BY total_points DESC, streak DESC
LIMIT 100;

-- Find specific user rank
SELECT 
    (SELECT COUNT(*) FROM user_gamification_stats 
     WHERE total_points > u.total_points 
     OR (total_points = u.total_points AND streak > u.streak)) + 1 AS rank
FROM user_gamification_stats u
WHERE u.user_id = ?;
```

---

## Real-world Example: User Progression

### Week 1
```
User (ID 42) Points Activity:
├─ Mon: Complete module → +50 pts  (Total: 50)
├─ Tue: Pass quiz       → +100 pts (Total: 150)
├─ Wed: Read flashcards → +25 pts  (Total: 175)
├─ Thu: Skip (no activity)
├─ Fri: Complete module → +50 pts  (Total: 225)
├─ Sat: Pass quiz       → +100 pts (Total: 325)
└─ Sun: Daily login     → +10 pts  (Total: 335)

Weekly Leaderboard (refresh every 24h):
├─ Rank 3: Eve     (850 pts, streak: 2)
├─ Rank 2: Alice   (500 pts, streak: 7)
├─ Rank #: User 42 (335 pts, streak: 5)  ← Not in top 2 yet
```

### Week 2
```
Continued activity:
├─ More quizzes, modules
├─ Current week points: 480
├─ Total points: 335 + 480 = 815
├─ Streak: 7 (consecutive learning days)

Updated Leaderboard:
├─ Rank 1: Eve     (850 pts, streak: 2)
├─ Rank 2: User 42 (815 pts, streak: 7)  ← Streak helps!
├─ Rank 3: Alice   (500 pts, streak: 7)
└─ current_user_rank: 2  ✓
```

---

## Tie-breaking Philosophy

```
Primary: Total points
├─ Reason: Most important metric
├─ Reflects: Overall learning effort
└─ Goal: Fair primary comparison

Secondary: Streak
├─ Reason: Consistency > bursts
├─ Example: 
│   User A: 1500 pts, 20-day streak
│   User B: 1500 pts, 2-day streak
│   User A ranked higher (consistent learner)
└─ Goal: Encourage habit formation

Tertiary: User ID
├─ Reason: Deterministic (not random)
├─ Prevents: Rank volatility on ties
└─ Goal: Stable, reproducible results
```

---

## Performance Optimization

### Caching Strategy
```
Fresh data every period:
├─ All-time:  Updated in real-time (single query)
├─ Yearly:    Cached 1 hour
├─ Monthly:   Cached 30 minutes
└─ Weekly:    Cached 15 minutes

Rationale:
├─ All-time rarely changes (always increasing)
├─ Weekly changes hourly (high volatility)
└─ Cache prevents O(n log n) sort on every request
```

### Pagination
```
Leaderboard page returns:
├─ Top 100 (display on UI)
├─ Current user rank (always)
├─ Total users count (context)

User #500 logging in:
├─ Backend fetches: top 100 + user #500's rank
├─ Frontend shows: "You're #500 of 2,345"
└─ No need to fetch all 2,345
```

---

## UI Rendering Example

```typescript
function LeaderboardPage() {
    const [period, setPeriod] = useState('all_time');
    const { data: leaderboard } = useGetLeaderboard(period);
    
    return (
        <div>
            {/* Current user rank badge */}
            <UserRankBadge rank={leaderboard.current_user_rank} />
            
            {/* Entries */}
            {leaderboard.entries.map((entry) => (
                <LeaderboardRow 
                    key={entry.user_id}
                    rank={entry.rank}
                    name={entry.user_name}
                    points={entry.total_points}
                    streak={entry.streak}
                    isCurrentUser={entry.is_current_user}  // ← Highlight
                />
            ))}
            
            {/* Pagination note */}
            <Text>
                Showing top 100 of {leaderboard.total_users}
            </Text>
        </div>
    );
}
```

---

## Application in Career Guidance System

**Engagement Driver:**
- ✅ See your rank among peers
- ✅ Strive to improve position
- ✅ Friendly competition (not harsh)
- ✅ Visible rewards for consistency

**Features:**
- Weekly leaderboard resets (fresh start)
- All-time hall of fame (permanent)
- Nearby rankings (show ±3 around user)
- Achievement badges at milestones (#1, top 10, etc)

---

## Design Pattern Classification
✅ **Sorting Algorithm**  
✅ **Ranking Algorithm**  
✅ **Comparative Algorithm**  
✅ **Database query optimization**  

---

*Perfect for: Competitive games, sports rankings, performance metrics, employee standings*
