# Algorithm 4: Observer Pattern - Auto-Refresh Polling

## Overview
**Type:** Observer Pattern (GoF - Gang of Four) / Pub-Sub  
**Real-world Usage:** Real-time dashboard updates without page refresh  
**Location in Code:** `src/hooks/useGamification.ts`  
**Time Complexity:** O(1) per event notification  
**Space Complexity:** O(1) constant overhead  

---

## Problem Statement

The gamification dashboard needs to stay current with:

```
Data Updates Needed:
├─ Current points (user earns points from activities)
├─ Leaderboard ranking (other users might surpass you)
├─ Streak status (changes daily)
├─ Recent activity feed
└─ Badge progress

Challenges:
├─ Can't block user interaction (no page reload)
├─ Need silent background updates
├─ Should refresh every 30 seconds
├─ Must clean up interval on unmount (memory leak risk)
├─ Multiple components may need this (dashboard, sidebar, etc)
└─ Should be optional/configurable
```

**Naive Approach (WRONG):**
```javascript
// Problem: No cleanup, creates resource leak
function Dashboard() {
    useEffect(() => {
        setInterval(() => {
            fetchPoints();
            fetchStreak();
            fetchLeaderboard();
        }, 30000);
    }, []);
    
    return <div>...</div>;
}

// Issues:
// 1. setInterval never stops → keeps running after component unmounts
// 2. Multiple listeners can stack up (30s × n = n requests)
// 3. No way to stop refreshing if user navigates away
// 4. Hard to test
```

---

## Solution: Observer Pattern (Pub-Sub)

### Architecture Diagram
```
┌─────────────────────────────────────────────┐
│      useGamification() Hook (Subject)       │
├─────────────────────────────────────────────┤
│  subscriptions: Component[] = []             │
│  notifyObservers(data)                      │
│  subscribe(observer)                        │
│  unsubscribe(observer)                      │
└─────────────────────────────────────────────┘
           │
      dispatch           ←─ notify
           │
    ┌──────┴──────┬──────────────┬──────────────┐
    │             │              │              │
Observer1    Observer2      Observer3      Observer4
Dashboard   Sidebar    GamificationCard  Leaderboard
watches:    watches:     watches:        watches:
• points    • streak     • badges        • ranking
• rank      • activity   • progress      • points
```

---

## Observer Pattern Algorithm

```
class Subject:
    observers = []
    
    subscribe(observer):
        // Observer subscribes to updates
        observers.append(observer)
        log("Observer subscribed: " + observer.name)
    
    unsubscribe(observer):
        // Observer unsubscribes
        observers.remove(observer)
        log("Observer unsubscribed: " + observer.name)
    
    notifyObservers(data):
        // When state changes, notify all observers
        for observer in observers:
            observer.update(data)
            log("Notified: " + observer.name)

    setState(newData):
        // Update internal state
        this.state = newData
        // Automatically notify all observers
        notifyObservers(newData)

// Usage:
subject = new Subject()

// Multiple observers subscribe
dashboard.subscribe(subject)
sidebar.subscribe(subject)
leaderboard.subscribe(subject)

// When data updates, all get notified
subject.setState(newGamificationData)
// → dashboard.update(data)
// → sidebar.update(data)
// → leaderboard.update(data)
```

---

## Polling Interval Pattern (Time-based Observer)

### Key Components
```typescript
// The polling mechanism
setInterval(
    callback,           // Run this function
    interval_ms         // Every N milliseconds
)

// Why it's observer-like:
// The callback "observes" the clock ticking
// Every 30 seconds, the clock "notifies" the callback
// The callback fetches fresh data and updates UI
```

### Algorithm: Auto-refresh with Cleanup
```
function useGamification({
    enableAutoRefresh = false,
    refreshInterval = 30000  // 30 seconds
}):
    
    // State for data
    points = null
    stats = null
    streak = null
    leaderboard = null
    
    // Effect: Set up polling
    useEffect(() => {
        if (!enableAutoRefresh) {
            return  // Early exit: no polling
        }
        
        // Create interval observer
        const intervalId = setInterval(() => {
            log("Polling tick #" + tick++)
            
            // Fetch all data
            fetchPoints()
            fetchStats()
            fetchStreak()
            fetchLeaderboard()
            
            // Update state (notifies all observers/components)
        }, refreshInterval)
        
        // CRITICAL: Cleanup on unmount
        return () => {
            clearInterval(intervalId)
            log("Interval stopped, cleanup done")
        }
    }, [enableAutoRefresh, refreshInterval])
    
    // Return data to consumers (they observe these values)
    return {
        points, stats, streak, leaderboard,
        fetchPoints, fetchStats, ...
    }

// Timing:
// T=0s     | Effect runs → setInterval starts
// T=30s    | Callback fires → fetchPoints(), fetchStats(), ...
// T=60s    | Callback fires again
// T=90s    | Callback fires again
// T=unmount| Cleanup runs → clearInterval() stops it all
```

---

## React Hook Integration

```typescript
// Call site
function GamificationDashboard() {
    // Subscribe to updates
    const {
        points,        // Observed value
        stats,         // Observed value
        streak,        // Observed value
        leaderboard,   // Observed value
        loadingPoints,
        loadingStats
    } = useGamification({
        userId: currentUserId,
        enableAutoRefresh: true,    // Turn on polling
        refreshInterval: 30000      // Every 30 seconds
    });
    
    // When hook's internal state changes,
    // component re-renders and shows new data
    
    return (
        <div>
            <PointsCard points={points} />           {/* Re-renders on update */}
            <StreakCard streak={streak} />           {/* Re-renders on update */}
            <LeaderboardList leaderboard={...} />    {/* Re-renders on update */}
        </div>
    );
}

// Data flow:
// 1. useGamification hook subscribes to API with interval
// 2. Every 30s, interval fires → data fetched
// 3. setState() in hook → component re-renders
// 4. Child components see new points/streak values
// 5. On unmount: cleanup stops the interval
```

---

## Real-world Execution Timeline

```
T=0s
└─ User opens Dashboard
   └─ useGamification() hook mounts
   └─ useEffect runs → setInterval(refreshAll, 30s) starts
   └─ First fetch: fetchPoints(), fetchStats(), fetchStreak()
   └─ UI renders with initial data
   └─ Interval ID: 1234 (stored)

T=30s
└─ Interval fires
   └─ Callback executes
   └─ fetch /api/v1/gamification/points
   └─ fetch /api/v1/gamification/stats
   └─ fetch /api/v1/gamification/streak
   └─ All finish
   └─ setState({points: newPoints, stats: newStats, ...})
   └─ Dashboard re-renders → shows latest data
   └─ User sees "+15 points" increase

T=50s
└─ Other user earns points, goes #1 on leaderboard
   └─ (Not visible yet, waiting for next poll)

T=60s
└─ Second interval fires
   └─ Leaderboard fetched → currentUser now #2
   └─ leaderboard state updated
   └─ Component re-renders → user sees they dropped rank
   └─ UI updates without page reload

T=85s
└─ User navigates away (unmounts component)
   └─ useEffect cleanup runs
   └─ clearInterval(1234) is called
   └─ Interval stops running
   └─ No more network requests

T=100s
└─ Interval callback would have fired (but can't, stopped)
   └─ Component already destroyed
   └─ No memory leak ✓
```

---

## Why Observer Pattern?

| Benefit | Why |
|---------|-----|
| **Decoupling** | Components don't know about each other's refresh logic |
| **Single interval** | Not one interval per component, one shared interval |
| **Automatic cleanup** | `return () => clearInterval()` prevents leaks |
| **Configurable** | Easy on/off; can change interval at runtime |
| **Scalable** | Adding new components doesn't create new intervals |
| **Testable** | Can mock the interval with `jest.useFakeTimers()` |

---

## Performance Optimization: Selective Refresh

```typescript
// Advanced: Stop polling when not needed
function DashboardWithAuto() {
    const [isVisible, setIsVisible] = useState(true);
    
    // Only poll when dashboard is visible
    const data = useGamification({
        userId,
        enableAutoRefresh: isVisible,  //← Key optimization
        refreshInterval: 30000
    });
    
    return (
        <div onBlur={() => setIsVisible(false)}
             onFocus={() => setIsVisible(true)}>
            {/* Dashboard content */}
        </div>
    );
}

// Benefit:
// - Poling stops when user switches tabs
// - Resumes when they come back
// - Saves API quota
```

---

## Application in Career Guidance System

**Use Cases:**

| Component | Observes | Refresh Interval |
|-----------|----------|------------------|
| Points Badge | Current points earned | 30s |
| Streak Calendar | Longest streak, current days | 60s |
| Leaderboard | User ranking, top 10 | 45s |
| Activity Feed | Recent quiz passes, completions | 30s |
| Notifications | Gamification alerts | 20s |

**Benefits:**
- ✅ Live rankings without page reload
- ✅ Real-time feedback on activities
- ✅ Competitive engagement (see others' progress)
- ✅ No server push (simpler architecture)
- ✅ Works offline-first (graceful degradation)

---

## Memory Leak Prevention Checklist

```
❌ Bad:
setInterval(callback, 1000)
// No cleanup → runs forever even after unmount

✓ Good:
useEffect(() => {
    const id = setInterval(callback, 1000);
    return () => clearInterval(id);  // Cleanup!
}, []);

✓ Better:
const { enableAutoRefresh } = config;
useEffect(() => {
    if (!enableAutoRefresh) return;  // Conditional
    const id = setInterval(callback, 1000);
    return () => clearInterval(id);
}, [enableAutoRefresh]);
```

---

## Design Pattern Classification
✅ **Observer Pattern (GoF)**  
✅ **Behavioral Pattern**  
✅ **Publish-Subscribe variant**  

---

*Perfect for: Live dashboards, real-time feeds, multiplayer synchronization*
