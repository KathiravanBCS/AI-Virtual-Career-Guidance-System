// Mock Chat Data
export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  type?: 'text' | 'suggestion';
}

export const mockChatMessages: ChatMessage[] = [
  {
    id: 'msg-001',
    sender: 'user',
    content: 'Hello! How can I start learning web development?',
    timestamp: '2024-02-20T10:00:00Z',
  },
  {
    id: 'msg-002',
    sender: 'assistant',
    content:
      'Great question! To start learning web development, I recommend beginning with the fundamentals: HTML, CSS, and JavaScript. These form the foundation for all web development. We have a comprehensive learning path called "Frontend Developer" that covers all these topics and more!',
    timestamp: '2024-02-20T10:01:00Z',
  },
  {
    id: 'msg-003',
    sender: 'user',
    content: 'What should I learn after JavaScript?',
    timestamp: '2024-02-20T10:02:00Z',
  },
  {
    id: 'msg-004',
    sender: 'assistant',
    content:
      'After mastering JavaScript, you have several options:\n\n1. **Frontend Frameworks**: Learn React, Vue, or Angular\n2. **Backend Development**: Node.js, Express, and databases\n3. **Full Stack**: Combine frontend and backend skills\n4. **Specialized Areas**: Mobile development, DevOps, or data science\n\nBased on your progress, I recommend exploring React next since you have a strong JavaScript foundation!',
    timestamp: '2024-02-20T10:03:00Z',
  },
  {
    id: 'msg-005',
    sender: 'user',
    content: 'How long does it typically take to become a Full Stack Developer?',
    timestamp: '2024-02-20T10:04:00Z',
  },
  {
    id: 'msg-006',
    sender: 'assistant',
    content:
      "The timeline varies based on your learning pace, but here's a general estimate:\n\n- **JavaScript Fundamentals**: 3-4 weeks\n- **Frontend Technologies** (React, CSS, etc.): 6-8 weeks\n- **Backend Development**: 6-8 weeks\n- **Databases & DevOps**: 4-6 weeks\n- **Project Practice**: 4-8 weeks\n\n**Total: 6-12 months** of consistent learning (20+ hours per week).\n\nYour current progress suggests you're on track to achieve this goal in about 3-4 months at your current learning pace!",
    timestamp: '2024-02-20T10:05:00Z',
  },
];

export const mockChatSuggestions = [
  "Show me the 'Full Stack Developer' learning path",
  'What projects should I build?',
  'How can I improve my quiz scores?',
  'Explain React hooks in detail',
];

export const mockAssistantResponses: Record<string, string> = {
  javascript_basics:
    "JavaScript is the foundation of web development. It's used to add interactivity to websites and can also be used for backend development with Node.js.",
  react_hooks:
    'React Hooks are functions that let you use state and other React features in functional components. The most commonly used hooks are useState, useEffect, useContext, and useReducer.',
  typescript_intro:
    'TypeScript adds static typing to JavaScript, which helps catch errors during development and improves code quality. It compiles to regular JavaScript.',
  css_flexbox:
    'CSS Flexbox is a layout module that makes it easier to design flexible responsive layout structure. Use display: flex on the container to activate flexbox.',
  nodejs_basics:
    'Node.js is a JavaScript runtime that allows you to run JavaScript outside the browser, primarily for server-side development.',
};
