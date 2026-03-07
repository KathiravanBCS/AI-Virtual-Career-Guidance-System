# groq AI Integration Setup

## Configuration

Add the following environment variable to your `.env` file:

```
VITE_GROQ_API_KEY=groq api key
```

## API Details

- **API Key**: groq api key
- **API Base URL**: https://api.groq.com/openai/v1
- **Model**: llama-3.1-8b-instant

## Documentation

- [Gemini API Docs](https://ai.google.dev/gemini-api/docs/langgraph-example)
- [Token Counting](https://ai.google.dev/gemini-api/docs/tokens)
- [Get API Key](https://ai.google.dev)

## Features Implemented

### Chat Management
- ✅ Real-time chat with Gemini AI
- ✅ Chat history persistence (localStorage)
- ✅ Multiple chat sessions
- ✅ Session switching and management
- ✅ Auto-generate session titles from first message
- ✅ Token counting for all messages
- ✅ Delete chat sessions

### Career Guidance
- ✅ Career-focused system prompt
- ✅ Domain expertise in:
  - Career paths and professional development
  - Industry trends and job market insights
  - Resume and portfolio optimization
  - Interview preparation strategies
  - Salary negotiation and compensation
  - Work-life balance and career satisfaction
  - Leadership and management skills
  - Networking and professional relationships
  - Upskilling and continuous learning

### Safety
- ✅ Safety settings configured for Gemini API
- ✅ Harmful content filtering
- ✅ Error handling and user feedback
- ✅ Token limit tracking

### UI Components
- ✅ Chat history drawer
- ✅ Session management (new, switch, delete)
- ✅ Message history display
- ✅ Token count display
- ✅ Error alerts with user-friendly messages
- ✅ Loading states
- ✅ Responsive design

## API Endpoints Used

### Generate Content
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={API_KEY}
```

### Count Tokens
```
POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:countTokens?key={API_KEY}
```

## Request Format

### Generate Content Request
```json
{
  "contents": [
    {
      "role": "user|model",
      "parts": [{"text": "message"}]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  },
  "safetySettings": [...]
}
```

### Count Tokens Request
```json
{
  "contents": [
    {
      "role": "user|model",
      "parts": [{"text": "message"}]
    }
  ]
}
```

## Storage

Chat sessions are stored in browser localStorage with the following key:
- `career_guidance_chat_sessions`: Array of chat sessions
- `career_guidance_current_session`: Current session ID

Maximum of 50 sessions are kept (older ones are removed).

## Error Handling

- API errors are caught and displayed to the user
- Token counting errors are logged but don't break chat
- Network errors show user-friendly messages
- Retry logic can be implemented for failed requests

## Usage

1. Set up your `.env` file with the API key
2. Chat interface will automatically:
   - Create a new session on first load
   - Save all messages to localStorage
   - Track tokens used
   - Switch between sessions
   - Maintain chat history

## Limitations

- Browser localStorage limit (~5-10MB depending on browser)
- API rate limits apply per project
- Free tier has usage quotas
- Maximum output tokens: 2048
- Context limited to conversation history

## Future Enhancements

- Export chat history (PDF, markdown)
- Search across chat history
- Tags and categorization
- Cloud sync with backend
- Chat analytics
- Custom system prompts
- Model selection
- Temperature/parameter tuning
