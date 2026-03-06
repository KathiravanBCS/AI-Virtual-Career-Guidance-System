// Mock Flashcard Data
export interface Flashcard {
  id: string;
  front: string;
  back: string;
  moduleId: string;
  moduleName: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
}

export const mockFlashcards: Flashcard[] = [
  // JavaScript Fundamentals
  {
    id: 'fc-001',
    front: 'What is JavaScript?',
    back: 'JavaScript is a versatile programming language commonly used for web development. It runs in browsers and can also be used on servers with Node.js.',
    moduleId: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    difficulty: 'easy',
    lastReviewed: '2024-02-20',
  },
  {
    id: 'fc-002',
    front: 'What is the difference between var, let, and const?',
    back: 'var is function-scoped, let and const are block-scoped. const cannot be reassigned after initialization, while var and let can.',
    moduleId: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    difficulty: 'medium',
  },
  {
    id: 'fc-003',
    front: 'What is closure in JavaScript?',
    back: 'A closure is a function that has access to variables from its outer scope, even after the outer function has returned.',
    moduleId: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    difficulty: 'hard',
  },
  {
    id: 'fc-004',
    front: 'Explain the event loop in JavaScript',
    back: 'The event loop continuously checks if there are any tasks in the queue and executes them. It handles asynchronous operations like timers and promises.',
    moduleId: 'module-001',
    moduleName: 'JavaScript Fundamentals',
    difficulty: 'hard',
  },

  // React Basics
  {
    id: 'fc-005',
    front: 'What is React?',
    back: 'React is a JavaScript library for building user interfaces with reusable components. It uses a virtual DOM to efficiently update the actual DOM.',
    moduleId: 'module-002',
    moduleName: 'React Basics',
    difficulty: 'easy',
  },
  {
    id: 'fc-006',
    front: 'What is JSX?',
    back: 'JSX is a syntax extension that allows you to write HTML-like code in JavaScript. It gets transpiled to JavaScript function calls.',
    moduleId: 'module-002',
    moduleName: 'React Basics',
    difficulty: 'easy',
  },
  {
    id: 'fc-007',
    front: 'What are React Hooks?',
    back: 'Hooks are functions that let you use state and other React features in functional components. Common hooks are useState, useEffect, and useContext.',
    moduleId: 'module-002',
    moduleName: 'React Basics',
    difficulty: 'medium',
  },
  {
    id: 'fc-008',
    front: 'What is the virtual DOM?',
    back: 'The virtual DOM is a lightweight JavaScript representation of the real DOM. React uses it to determine which parts of the DOM need to be updated.',
    moduleId: 'module-002',
    moduleName: 'React Basics',
    difficulty: 'medium',
  },

  // TypeScript
  {
    id: 'fc-009',
    front: 'What is TypeScript?',
    back: 'TypeScript is a superset of JavaScript that adds static typing. It compiles to regular JavaScript and helps catch errors during development.',
    moduleId: 'module-003',
    moduleName: 'TypeScript Advanced',
    difficulty: 'easy',
  },
  {
    id: 'fc-010',
    front: 'What is an interface in TypeScript?',
    back: 'An interface defines a contract for the structure of objects. It specifies what properties and methods an object must have.',
    moduleId: 'module-003',
    moduleName: 'TypeScript Advanced',
    difficulty: 'medium',
  },
  {
    id: 'fc-011',
    front: 'What are generics in TypeScript?',
    back: 'Generics allow you to create reusable components that work with multiple types. They are defined using angle brackets like <T>.',
    moduleId: 'module-003',
    moduleName: 'TypeScript Advanced',
    difficulty: 'hard',
  },
];

export const mockFlashcardsByModule: Record<string, Flashcard[]> = {
  'module-001': mockFlashcards.filter((fc) => fc.moduleId === 'module-001'),
  'module-002': mockFlashcards.filter((fc) => fc.moduleId === 'module-002'),
  'module-003': mockFlashcards.filter((fc) => fc.moduleId === 'module-003'),
};
