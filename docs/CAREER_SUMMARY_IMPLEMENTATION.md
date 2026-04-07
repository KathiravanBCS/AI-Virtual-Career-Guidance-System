# Career Summary Generation - Implementation Guide

## Overview
This document describes the implementation of AI-powered career summary generation for the AI Virtual Career Guidance System.

## Feature Description

When users click on "Career Summary" in the navigation, they will now see:

1. **Learning Progress Overview Card**
   - User name and career goal
   - Overall progress percentage (visual progress bar)
   - Statistics on completed, active, and pending modules

2. **AI-Generated Career Summary**
   - Personalized narrative written by GROQ AI
   - Analyzes user's learning journey
   - Provides career guidance and recommendations
   - Download button for the full report

3. **Module Breakdown**
   - Complete list of all learning modules
   - Each module shows:
     - Title and description
     - Status (completed/active/pending)
     - Progress percentage
     - Estimated time

## Technical Architecture

### Components & Hooks

#### 1. **groq.config.ts** - AI Summary Generation
```typescript
export const generateCareerSummaryFromLearningGuidance = async (learningGuidanceData: {
  name: string;
  age?: number;
  career_goal: string;
  current_skills: string[];
  interests: string[];
  assessment_answers?: Record<string, string>;
  completion_percentage: number;
  learning_modules: Array<{ title, status, completion_percentage, ... }>;
}): Promise<string>
```

**What it does:**
- Takes learning guidance data
- Calculates module statistics
- Creates a comprehensive AI prompt
- Sends to GROQ Llama 3.3 70B model
- Returns a personalized career summary narrative

**Prompt Strategy:**
- Warm, professional tone
- Second-person narrative
- Includes recognition of achievements
- Provides specific next steps
- Offers motivation with specificity

### 2. **useCareerSummary.ts** - Data Fetching Hooks

#### `useGetLearningGuidanceData()`
```typescript
// Fetches from: /api/v1/learning-guidance/guidance/learning-modules/all
const { data: learningData, isLoading, error } = useGetLearningGuidanceData();
```

#### `useGenerateCareerSummaries(learningData)`
```typescript
// Generates summary using AI when learningData is available
const { data: summary, isLoading, error } = useGenerateCareerSummaries(learningData);
```

### 3. **CareerSummaryPage.tsx** - UI Component

**State Management:**
- Uses React Query for data fetching
- Handles loading, error, and success states
- Displays real-time progress updates

**Features:**
- Auto-loads data on mount
- Auto-generates summary when data is available
- Shows detailed progress visualization
- Provides download functionality
- Graceful error handling

## Data Flow Diagram

```
┌─────────────────────────────┐
│ Career Summary Page         │
│ (CareerSummaryPage.tsx)     │
└──────────────┬──────────────┘
               │
               ├─→ useGetLearningGuidanceData()
               │   └─→ API: /api/v1/learning-guidance/guidance/learning-modules/all
               │       └─→ Returns: LearningGuidanceData
               │
               └─→ useGenerateCareerSummaries(learningData)
                   └─→ generateCareerSummaryFromLearningGuidance()
                       └─→ GROQ API: Llama 3.3 70B
                           └─→ Returns: Personalized Summary Text
                               └─→ Rendered in UI with Progress Stats
```

## API Integration

### Endpoint
```
GET /api/v1/learning-guidance/guidance/learning-modules/all
```

### Request
No parameters required (uses logged-in user context)

### Response Format
```json
{
  "id": 7,
  "name": "Kathiravan V",
  "age": 23,
  "career_goal": "Backend Developer for Medical Devices",
  "current_skills": ["SQL", "Database Design"],
  "interests": ["Web Development", "DevOps", "Backend Development"],
  "assessment_answers": {
    "1": "Solving puzzles...",
    ...
  },
  "completion_percentage": 71,
  "learning_modules": [
    {
      "id": 24,
      "title": "Introduction to Backend Development",
      "description": "...",
      "status": "completed",
      "completion_percentage": 100,
      "estimated_time": "4-5 hours",
      "module_order": 0,
      "content": { ... }
    },
    ...
  ]
}
```

## Example AI-Generated Summary

The GROQ AI generates narratives like:

```
Kathiravan, you're off to an excellent start on your path to becoming a Backend Developer 
for Medical Devices. With 71% completion and 4 modules already mastered, you're demonstrating 
the commitment and focus necessary for success in this specialized field.

Your foundation in SQL and Database Design is solid, which is crucial for medical device 
backend development where data integrity and security are paramount. The fact that you've 
completed 4 out of 7 modules shows consistent progress...

[Continues with personalized analysis and recommendations]
```

## Files Modified

### 1. src/config/groq.config.ts
- Added `generateCareerSummaryFromLearningGuidance()` function (~100 lines)
- Added to export default object

### 2. src/features/careerSummary/types.ts
- Added `LearningModule` interface
- Added `LearningGuidanceData` interface
- Added `CareerSummaryResponse` interface

### 3. src/features/careerSummary/api/useCareerSummary.ts
- Implemented `useGetLearningGuidanceData()` hook
- Implemented `useGenerateCareerSummaries()` hook
- Kept legacy `useGetCareerSummaryData()` for backward compatibility
- Added mock data fallback function

### 4. src/features/careerSummary/pages/CareerSummaryPage.tsx
- Completely redesigned component
- Integrated new data fetching hooks
- Added progress visualization with Mantine components
- Added download functionality
- Added loading and error states
- Added module breakdown display

## How to Use

### For End Users
1. Navigate to "Career Summary" page
2. Wait for learning guidance data and AI summary to load
3. Review the personalized career summary
4. Check module breakdowns
5. Download the summary as a text file if needed
6. Click "Refresh Summary" to regenerate

### For Developers

#### To customize the AI prompt:
Edit the prompt in `generateCareerSummaryFromLearningGuidance()`:
```typescript
const prompt = `Your custom prompt here...`;
```

#### To change the model:
Replace `'llama-3.3-70b-versatile'` with a different GROQ model:
```typescript
const summary = await llmCompletion(prompt, 'your-model-name');
```

#### To add new features:
- Modify the UI in `CareerSummaryPage.tsx`
- Add new hooks in `useCareerSummary.ts`
- Update types in `types.ts`

## Error Handling

The implementation includes comprehensive error handling:

1. **API Not Available**: Falls back to mock data
2. **AI Generation Fails**: Shows error alert to user
3. **Invalid Data**: Validates before processing
4. **Network Issues**: Automatic retry with error message

## Performance Considerations

1. **Query Caching**: React Query caches results for 5-10 minutes
2. **Memoization**: Components only re-render when data changes
3. **Lazy Loading**: Data fetched only when page is visited
4. **Background Generation**: AI summary generates after data loads

## Testing

### Mock Data
If the backend API is not available, the component uses mock data:
```typescript
{
  name: 'Kathiravan V',
  career_goal: 'Backend Developer for Medical Devices',
  completion_percentage: 71,
  ...
}
```

### Testing Steps
1. Navigate to Career Summary page
2. Verify loading spinner appears
3. Check that data loads successfully
4. Confirm summary text appears
5. Test download functionality
6. Verify error handling (disable API to test)

## Future Enhancements

### Suggested Features
- [ ] PDF export with formatting
- [ ] Email delivery of summaries
- [ ] Comparison between multiple career paths
- [ ] Historical summary tracking
- [ ] Progress trends visualization
- [ ] Skill gap analysis
- [ ] Job market alignment
- [ ] Certification recommendations
- [ ] Social media sharing
- [ ] Real-time notifications on progress

## Dependencies

- `@tanstack/react-query` - Data fetching and caching
- `@mantine/core` - UI components
- `@tabler/icons-react` - Icons
- `groq.config.ts` - AI generation

## API Keys Required

- `VITE_GROQ_API_KEY` - For GROQ API access (already configured)

## Related Files

- [Algorithm: Career Summary Generation](docs/ALGORITHM_*.md)
- [GROQ Setup Guide](docs/GROQ_SETUP.md)
- [Learning Path Documentation](docs/CASL_FRONTEND_INTEGRATION.md)

## Support

For issues or questions:
1. Check the error messages in browser console
2. Verify GROQ API key is configured
3. Check backend API is running on `http://localhost:8000`
4. Review mock data fallback is working

## Version History

- v1.0 (April 7, 2026): Initial implementation
  - AI-powered summary generation
  - Real-time data fetching
  - Progress visualization
  - Download functionality
