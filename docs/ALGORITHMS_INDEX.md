# 5 Real-World OOP Algorithms — AI Virtual Career Guidance System

## 📊 Quick Reference Table

| # | Algorithm | Pattern | Complexity | Use Case |
|---|-----------|---------|-----------|----------|
| **1** | Streak State Machine | FSM / State Pattern | O(1) | User engagement tracking |
| **2** | Resume Extraction Strategy | Strategy Pattern | O(n) | Smart file format handling |
| **3** | Permission Engine | Singleton Pattern | O(r) | Centralized RBAC/ABAC |
| **4** | Auto-refresh Polling | Observer Pattern | O(1) per tick | Real-time dashboard updates |
| **5** | Leaderboard Ranking | Sorting + Ranking | O(n log n) | Competitive scoring |

---

## 🎯 Algorithm Overview by Category

### 1️⃣ **Behavioral Patterns** (How objects interact)

#### Algorithm 1: Streak State Machine (FSM)
```
Problem:  Track consecutive learning days without breaking chains
Pattern:  Finite State Machine (5 states, explicit transitions)
Why:      Prevents user discouragement from sudden resets

Example flow:
Day 1: PAUSED → ACTIVE (streak: 0→1)
Day 2: ACTIVE (streak: 1→2)  
Gap:   ACTIVE → RESET (streak: 2→1)
```
**File:** `docs/ALGORITHM_01_StreakStateMachine.md`

---

#### Algorithm 4: Auto-refresh Polling (Observer)
```
Problem:  Keep dashboard live without page reload
Pattern:  Observer/Pub-Sub with setInterval + cleanup
Why:      Decouples components; prevents memory leaks

Example:
Every 30s → fetch points/streak/leaderboard
        → notify all observers (components)
        → components re-render with fresh data
On unmount → clearInterval() stops polling
```
**File:** `docs/ALGORITHM_04_ObserverPattern.md`

---

### 2️⃣ **Structural Patterns** (How objects are organized)

#### Algorithm 3: Permission Engine (Singleton)
```
Problem:  Share one global permission registry across whole app
Pattern:  Singleton + CASL rules engine
Why:      Single source of truth; avoid duplicating permission checks

Example:
Login → load rules from API → ability.update(rules)
Various components → ability.can('create', 'Quiz')
Logout → ability.reset()
```
**File:** `docs/ALGORITHM_03_SingletonPattern.md`

---

### 3️⃣ **Creational Patterns** (How objects are created)

#### Algorithm 2: Resume Extraction (Strategy)
```
Problem:  Different file types/sizes need different extraction methods
Pattern:  Strategy pattern - swap algorithms at runtime
Why:      Open/closed principle; easy to add new strategies

Priority order:
1. PDF.js extraction (accurate)
2. AI extraction (slow but best)
3. Regex extraction (fast fallback)
```
**File:** `docs/ALGORITHM_02_StrategyPattern.md`

---

### 4️⃣ **Algorithmic Patterns** (Core CS algorithms)

#### Algorithm 5: Leaderboard Ranking
```
Problem:  Sort users by points + streak, assign ranks
Algorithm: Multi-level sort + ranking assignment
Why:      Fair competition; tie-breaking prevents gaming

Complexity: O(n log n) sort + O(n) ranking
Best practice: Cache results for different time periods
```
**File:** `docs/ALGORITHM_05_LeaderboardRanking.md`

---

## 💡 Educational Purpose

### Why These 5?

| Algorithm | Teaches |
|-----------|---------|
| **1. Streak FSM** | State machines, finite automata, day-based logic |
| **2. Resume Strategy** | Polymorphism, open/closed principle, cost optimization |
| **3. Permission Singleton** | Global state, single responsibility, RBAC/ABAC |
| **4. Polling Observer** | Event-driven programming, memory management, cleanup patterns |
| **5. Leaderboard Ranking** | Sorting, stability, multi-key comparison, DB optimization |

### Best For

✅ **Interview preparation** — Real production code patterns  
✅ **System design** — How components interact at scale  
✅ **Code reviews** — Recognizing good/bad patterns  
✅ **Architecture** — Building maintainable systems  
✅ **PowerPoint decks** — Visual storytelling of algorithms  

---

## 🔍 Implementation Locations

### In Codebase

**Algorithm 1 (Streak):**
```
src/features/gamification/components/StreakCalendar.tsx   ← UI component
src/features/gamification/types.ts                        ← StreakInfo interface
```

**Algorithm 2 (Strategy):**
```
src/utils/resumeExtractor.ts                              ← Strategy implementations
src/utils/resumeAIIntegration.ts                          ← Context/orchestration
```

**Algorithm 3 (Singleton):**
```
src/lib/casl/ability.ts                                   ← Singleton instance
src/lib/casl/useCASLIntegration.ts                        ← Usage & updates
```

**Algorithm 4 (Observer):**
```
src/hooks/useGamification.ts                              ← Hook with setInterval
src/features/gamification/pages/GamificationDashboard.tsx ← Consumer component
```

**Algorithm 5 (Ranking):**
```
src/features/leaderboard/pages/LeaderboardPage.tsx        ← Display
src/features/gamification/types.ts                        ← LeaderboardEntry interface
```

---

## 📈 Complexity Analysis Summary

### Time Complexity

| Algorithm | Per Operation | Scale |
|-----------|---------------|-------|
| Streak FSM | O(1) | Single user, instant |
| Resume Strategy | O(file_size) | 1-100MB files |
| Permission Check | O(r) | r = rules (usually < 50) |
| Polling | O(1) per tick | Triggers every 30s |
| Leaderboard Sort | O(n log n) | n = active users (< 100K) |

### Space Complexity

| Algorithm | Memory | Notes |
|-----------|--------|-------|
| Streak FSM | O(1) | Constant state |
| Resume Strategy | O(file_size) | Text buffer in RAM |
| Permission | O(rules) | Cached in memory |
| Polling | O(1) | Doesn't accumulate |
| Leaderboard | O(n) | One array of entries |

---

## 🎓 Key Takeaways

### For Each Algorithm

**1. Streak State Machine**
- ✅ Teaches: FSM design, state transitions, day arithmetic
- ✅ Real value: Prevents user streak from resetting unfairly
- ✅ Extension: Can add "weekends don't break streaks" rule

**2. Resume Extraction Strategy**
- ✅ Teaches: Polymorphism, runtime strategy selection
- ✅ Real value: Handles any file type automatically
- ✅ Extension: Add OCR, DocX readers, voice transcription

**3. Permission Engine Singleton**
- ✅ Teaches: Singleton pattern, ABAC, centralized state
- ✅ Real value: One source of truth for permissions
- ✅ Extension: Supports hierarchical roles, delegation

**4. Auto-refresh Polling Observer**
- ✅ Teaches: Observer pattern, memory cleanup, useEffect
- ✅ Real value: Live dashboard without page reload
- ✅ Extension: Switch to WebSockets for true real-time

**5. Leaderboard Ranking**
- ✅ Teaches: Multi-level sorting, tie-breaking, DB indexing
- ✅ Real value: Fair competitive rankings
- ✅ Extension: Seasonal resets, division tiers, handicaps

---

## 🚀 Quiz: Test Your Understanding

**Q1: Streak FSM**
> User has 5-day streak. Goes inactive for 2 days, then returns. What happens?
> A) Streak increases to 6  
> B) Streak resets to 1  
> C) Streak becomes 0  
> **Answer: B** (2-day gap triggers reset, then returns with 1-day activity)

**Q2: Resume Strategy**
> File size is 50MB. Which strategy is selected?
> A) PDF.js then AI  
> B) PDF.js then Regex  
> C) Regex only  
> **Answer: B** (Token estimate ~125K >> 10K limit, AI too expensive)

**Q3: Permission Singleton**
> Two components both check `ability.can('create', 'Quiz')`. How many ability instances exist?
> A) Two (one per component)  
> B) One (shared singleton)  
> C) One per user  
> **Answer: B** (Singleton guarantees one global instance)

**Q4: Polling Observer**
> What happens when component unmounts?
> A) Interval keeps running  
> B) Interval stops (cleanup)  
> C) Interval becomes unpredictable  
> **Answer: B** (`return () => clearInterval()` in useEffect)

**Q5: Leaderboard**
> User A: 1000 pts, 5-day streak vs User B: 1000 pts, 10-day streak
> A) User A ranks higher  
> B) User B ranks higher  
> C) Same rank (tie)  
> **Answer: B** (Secondary sort by streak = tiebreaker)

---

## 📚 Additional Resources

### For Further Learning

- **Design Patterns:** Gang of Four book sections on these patterns
- **Algorithms:** CLRS (Introduction to Algorithms) for sorting/ranking
- **React:** Official docs on useEffect cleanup patterns
- **System Design:** "Designing Data-Intensive Applications" chapter on rankings

### Visual Aids Suitable for PowerPoint

```
Slide 1: Title + Problem Statement
Slide 2: Architecture Diagram (boxes, arrows)
Slide 3: State Transition Diagram (circles, labeled edges)
Slide 4: Pseudocode or Algorithm Flow
Slide 5: Real-world Example (timeline)
Slide 6: Complexity Analysis (table)
Slide 7: Code Location (file paths + snippets)
Slide 8: Key Takeaways (bullet points)
```

---

## 📞 Questions for Discussion

1. **Hypothetical:** How would you modify Streak FSM to support "weekend pass" (gaps ≤2 days on weekends don't break streak)?

2. **Optimization:** What if you had 1M users on the leaderboard? How to keep ranking fast?

3. **Security:** Could a malicious user exploit the CASL permission system? How would you defend?

4. **Scalability:** Instead of polling every 30s, what if you used WebSockets for real-time updates?

5. **Testing:** How would you write unit tests for the Resume extraction strategy?

---

## 🎬 Conclusion

These 5 algorithms represent **real production patterns** used in the AI Virtual Career Guidance System:

✅ **Learner engagement** (Streak FSM)  
✅ **Smart resource handling** (Resume Strategy)  
✅ **Security & permissions** (Singleton CASL)  
✅ **Live user experience** (Observer Polling)  
✅ **Fair competition** (Leaderboard Ranking)  

**Each solves a real problem.** **Each teaches a real pattern.** **Each is interview-ready.**

---

### Document Index

| Document | Algorithm | Pattern |
|----------|-----------|---------|
| `ALGORITHM_01_StreakStateMachine.md` | Streak tracking | FSM |
| `ALGORITHM_02_StrategyPattern.md` | Resume extraction | Strategy |
| `ALGORITHM_03_SingletonPattern.md` | Permissions | Singleton |
| `ALGORITHM_04_ObserverPattern.md` | Real-time updates | Observer |
| `ALGORITHM_05_LeaderboardRanking.md` | Competitive ranking | Sorting |

---

**Generated:** April 2026  
**System:** AI Virtual Career Guidance System  
**Context:** Frontend Architecture & Algorithms  

*Ready for PowerPoint, interviews, and code reviews.*
