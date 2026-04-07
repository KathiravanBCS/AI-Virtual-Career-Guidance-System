# Algorithm 1: Streak State Machine (FSM Pattern)

## Overview
**Type:** Finite State Machine (FSM) / State Pattern  
**Real-world Usage:** User engagement tracking - consecutive learning days  
**Location in Code:** `src/features/gamification/components/StreakCalendar.tsx`  
**Time Complexity:** O(1) per state transition  
**Space Complexity:** O(1) constant state storage  

---

## Problem Statement
Track user learning streaks across consecutive days without breaking the chain. Need to handle:
- ✅ User active today → maintain streak
- ✅ User active yesterday → increment streak  
- ❌ Gap detected (≥2 days) → reset streak
- 📊 Track longest streak ever achieved

---

## Solution: State Machine with Explicit Transitions

### States
```
┌─────────────────────────────────────────────┐
│              STREAK STATES                  │
├─────────────────────────────────────────────┤
│ ACTIVE    → User maintaining streak         │
│ RESET     → Streak was broken by gap        │
│ PAUSED    → No activity for extended time   │
└─────────────────────────────────────────────┘
```

### State Transition Logic
```
Current State: ACTIVE
├─ Event: Activity Today      → next state: ACTIVE (no change)
├─ Event: Activity Yesterday  → next state: ACTIVE (increment streak +1)
└─ Event: Gap > 1 day         → next state: RESET (streak = 1)

Current State: RESET
├─ Event: Activity Today      → next state: ACTIVE (streak = 1)
└─ Event: Activity Yesterday  → next state: ACTIVE (streak = 1)

Current State: PAUSED
└─ Event: Any Activity        → next state: ACTIVE (streak = 1)
```

---

## Algorithm Pseudocode

```
class StreakStateMachine:
    state = PAUSED
    current_streak = 0
    longest_streak = 0
    last_activity_date = today

    function processActivity(event):
        switch(state):
            case ACTIVE:
                if event == ACTIVITY_TODAY:
                    state = ACTIVE
                    // no change
                else if event == ACTIVITY_YESTERDAY:
                    state = ACTIVE
                    current_streak += 1
                else:  // gap detected
                    state = RESET
                    current_streak = 1
                    
            case RESET:
                if event == ACTIVITY_TODAY or ACTIVITY_YESTERDAY:
                    state = ACTIVE
                    current_streak = 1
                    
            case PAUSED:
                if event == ACTIVITY_TODAY or ACTIVITY_YESTERDAY:
                    state = ACTIVE
                    current_streak = 1

        // Update longest streak tracker
        if current_streak > longest_streak:
            longest_streak = current_streak

        return updated_state
```

---

## Why This Pattern?

| Benefit | Reason |
|---------|--------|
| **Clear behavior** | Each state has explicit transitions |
| **Maintainable** | Adding new states doesn't break existing logic |
| **Testable** | Each transition can be unit tested independently |
| **Scalable** | Can add complex rules (e.g., weekend streaks count double) |
| **Visualizable** | Easy to draw state diagrams for documentation |

---

## Real-world Example Flow

```
Day 1: User completes module
  → Event: ACTIVITY_TODAY
  → State: PAUSED → ACTIVE
  → Streak: 0 → 1

Day 2: User completes quiz  
  → Event: ACTIVITY_YESTERDAY (1 day gap is OK)
  → State: ACTIVE → ACTIVE
  → Streak: 1 → 2

Day 3: User skips (no activity)
  (no event)

Day 4: User comes back
  → Event: ACTIVITY_OLD (2+ day gap)
  → State: ACTIVE → RESET
  → Streak: 2 → 1 (reset!)

Day 5: User continues
  → Event: ACTIVITY_YESTERDAY (from reset point)
  → State: RESET → ACTIVE  
  → Streak: 1 → 2

Final Stats:
├─ Current Streak: 2
├─ Longest Streak: 2 (before break)
└─ Total Breaks: 1
```

---

## Key Implementation Details

### Day Difference Calculation
```
getDaysDifference(date1, date2):
    milliseconds = |date1_ms - date2_ms|
    days = floor(milliseconds / (1000 × 60 × 60 × 24))
    return days
```

### Event Detection
```
getEventFromDate(lastActivityDate):
    daysSince = getDaysDifference(today, lastActivityDate)
    
    if daysSince == 0:
        return ACTIVITY_TODAY
    else if daysSince == 1:
        return ACTIVITY_YESTERDAY
    else if daysSince > 1:
        return ACTIVITY_OLD
    else:
        return NO_ACTIVITY
```

---

## Application in Career Guidance System

**Gamification Hook:** `useGamification()` fetches `StreakInfo` from backend  
**Frontend Display:** Calendar grid shows active (colored) vs inactive (gray) days  
**User Motivation:** Visible streak count encourages daily return visits  
**Notifications:** "Keep your 15-day streak alive!" prompts sent at end of day

---

## Design Pattern Classification
✅ **Finite State Machine (FSM)**  
✅ **State Pattern (GoF)**  
✅ **Behavioral Pattern**  

---

*Perfect for: Habit tracking, onboarding workflows, game mechanics*
