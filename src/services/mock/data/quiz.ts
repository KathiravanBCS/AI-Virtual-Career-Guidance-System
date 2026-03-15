// Mock Quiz Data
import type { DisplayQuestion, QuizData, QuizQuestion } from '@/features/quiz/types';

export const mockQuizQuestions: QuizQuestion[] = [
  {
    id: 1,
    quiz_id: 1,
    question_text: 'What is the correct syntax to declare a variable in JavaScript?',
    question_type: 'single',
    answers: ['var x = 5;', 'variable x = 5;', 'v x = 5;', 'int x = 5;'],
    correct_answer: '0',
    explanation: 'In JavaScript, you use var, let, or const to declare variables. var x = 5; is the correct syntax.',
    points: 1,
    question_order: 1,
  },
  {
    id: 2,
    quiz_id: 1,
    question_text: 'Which of the following are JavaScript data types? (Select all that apply)',
    question_type: 'multiple',
    answers: ['String', 'Boolean', 'Number', 'Integer', 'Float'],
    correct_answer: '0,1,2',
    explanation:
      'JavaScript has String, Boolean, and Number as primitive types. Integer and Float are not separate types in JavaScript.',
    points: 2,
    question_order: 2,
  },
  {
    id: 3,
    quiz_id: 1,
    question_text: 'What does the === operator do in JavaScript?',
    question_type: 'single',
    answers: [
      'Assigns a value',
      'Compares values and data types (strict equality)',
      'Compares only values (loose equality)',
      'Multiplies two values',
    ],
    correct_answer: '1',
    explanation: 'The === operator checks for both value and data type equality, known as strict equality comparison.',
    points: 1,
    question_order: 3,
  },
  {
    id: 4,
    quiz_id: 1,
    question_text: 'Which methods would you use to work with arrays? (Select all that apply)',
    question_type: 'multiple',
    answers: ['map()', 'filter()', 'reduce()', 'multiply()', 'split()'],
    correct_answer: '0,1,2',
    explanation:
      'map(), filter(), and reduce() are array methods. multiply() does not exist, and split() is a string method.',
    points: 2,
    question_order: 4,
  },
  {
    id: 5,
    quiz_id: 1,
    question_text: 'What is the purpose of async/await in JavaScript?',
    question_type: 'single',
    answers: [
      'To declare variables',
      'To handle asynchronous operations more elegantly than promises',
      'To create new arrays',
      'To style HTML elements',
    ],
    correct_answer: '1',
    explanation:
      'async/await is syntactic sugar for handling Promises, making asynchronous code look more like synchronous code.',
    points: 1,
    question_order: 5,
  },
];

export const mockQuizDataByModule: Record<string, QuizData> = {
  'module-001': {
    topic: 'JavaScript Fundamentals',
    questions: mockQuizQuestions as unknown as DisplayQuestion[],
  },
  'module-002': {
    topic: 'React Basics',
    questions: [
      {
        question: 'What is React?',
        answers: [
          'A JavaScript library for building user interfaces',
          'A database management system',
          'A CSS framework',
          'A backend framework',
        ],
        correctAnswer: 0,
        explanation: 'React is a JavaScript library developed by Facebook for building UI components.',
        point: 1,
        questionType: 'single',
      } as any,
      {
        question: 'What is JSX?',
        answers: [
          'A JavaScript syntax extension that looks like HTML',
          'A new programming language',
          'A CSS preprocessor',
          'A database query language',
        ],
        correctAnswer: 0,
        explanation: 'JSX is a syntax extension to JavaScript that allows you to write HTML-like code in JavaScript.',
        point: 1,
        questionType: 'single',
      } as any,
      {
        question: 'What are hooks in React? (Select all that apply)',
        answers: [
          'Functions that let you use state and other React features',
          'CSS rules',
          'Backend endpoints',
          'Functions that replace class components',
          'Methods for HTTP requests',
        ],
        correctAnswer: [0, 3],
        explanation:
          'Hooks are functions that let you "hook into" React features like state and lifecycle. They allow functional components to have state.',
        point: 2,
        questionType: 'multiple',
      } as any,
    ],
  },
  'module-003': {
    topic: 'TypeScript Advanced',
    questions: [
      {
        question: 'What is the purpose of TypeScript?',
        answers: [
          'To add static typing to JavaScript',
          'To replace JavaScript completely',
          'To style web pages',
          'To manage databases',
        ],
        correctAnswer: 0,
        explanation: 'TypeScript is a superset of JavaScript that adds static type checking and other features.',
        point: 1,
        questionType: 'single',
      } as any,
    ],
  },
};

export const mockLearningPathModules = {
  'path-001': ['module-001', 'module-002', 'module-003'],
  'path-002': ['module-004', 'module-005'],
};
