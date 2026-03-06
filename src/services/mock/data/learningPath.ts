// Mock Learning Path Data
export interface CareerPath {
  $id: string;
  careerName: string;
  description: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: Module[];
  progress: number;
  completedModules: number;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  lessons: Lesson[];
  completed: boolean;
  progress: number;
}

export interface Lesson {
  id: string;
  title: string;
  description: string;
  videoUrl?: string;
  content: string;
  resources: Resource[];
  completed: boolean;
  duration: number;
}

export interface Resource {
  id: string;
  title: string;
  type: 'article' | 'video' | 'tutorial' | 'documentation';
  url: string;
}

export const mockCareerPaths: CareerPath[] = [
  {
    $id: 'path-001',
    careerName: 'Full Stack Developer',
    description: 'Master both frontend and backend development with modern technologies',
    duration: '6 months',
    level: 'Intermediate',
    modules: [
      {
        id: 'module-001',
        title: 'JavaScript Fundamentals',
        description: 'Learn the basics of JavaScript programming',
        estimatedHours: 20,
        lessons: [
          {
            id: 'lesson-001',
            title: 'Introduction to JavaScript',
            description: 'Get started with JavaScript basics',
            videoUrl: 'https://example.com/video1',
            content: 'JavaScript is a versatile programming language...',
            resources: [
              {
                id: 'res-001',
                title: 'MDN JavaScript Guide',
                type: 'documentation',
                url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript',
              },
            ],
            completed: true,
            duration: 45,
          },
        ],
        completed: true,
        progress: 100,
      },
      {
        id: 'module-002',
        title: 'React Basics',
        description: 'Learn React fundamentals and component lifecycle',
        estimatedHours: 25,
        lessons: [
          {
            id: 'lesson-002',
            title: 'React Components',
            description: 'Understanding React components',
            content: 'React components are reusable pieces of UI...',
            resources: [],
            completed: true,
            duration: 50,
          },
        ],
        completed: true,
        progress: 100,
      },
      {
        id: 'module-003',
        title: 'Node.js Essentials',
        description: 'Backend development with Node.js',
        estimatedHours: 30,
        lessons: [],
        completed: false,
        progress: 0,
      },
    ],
    progress: 67,
    completedModules: 2,
  },
  {
    $id: 'path-002',
    careerName: 'Frontend Developer',
    description: 'Specialize in creating beautiful and responsive user interfaces',
    duration: '4 months',
    level: 'Beginner',
    modules: [
      {
        id: 'module-004',
        title: 'HTML & CSS Fundamentals',
        description: 'Learn the building blocks of web development',
        estimatedHours: 15,
        lessons: [],
        completed: true,
        progress: 100,
      },
      {
        id: 'module-005',
        title: 'JavaScript for Web',
        description: 'Interactive web development with JavaScript',
        estimatedHours: 20,
        lessons: [],
        completed: true,
        progress: 100,
      },
      {
        id: 'module-006',
        title: 'React Advanced Patterns',
        description: 'Advanced React techniques and best practices',
        estimatedHours: 25,
        lessons: [],
        completed: false,
        progress: 40,
      },
    ],
    progress: 67,
    completedModules: 2,
  },
  {
    $id: 'path-003',
    careerName: 'Backend Developer',
    description: 'Build scalable and robust server-side applications',
    duration: '5 months',
    level: 'Intermediate',
    modules: [
      {
        id: 'module-007',
        title: 'Node.js Fundamentals',
        description: 'JavaScript runtime and backend basics',
        estimatedHours: 20,
        lessons: [],
        completed: false,
        progress: 0,
      },
      {
        id: 'module-008',
        title: 'Database Design',
        description: 'SQL and NoSQL databases',
        estimatedHours: 25,
        lessons: [],
        completed: false,
        progress: 0,
      },
    ],
    progress: 0,
    completedModules: 0,
  },
  {
    $id: 'path-004',
    careerName: 'DevOps Engineer',
    description: 'Learn deployment, infrastructure, and continuous integration',
    duration: '4 months',
    level: 'Advanced',
    modules: [
      {
        id: 'module-009',
        title: 'Docker & Containerization',
        description: 'Container technology and Docker',
        estimatedHours: 20,
        lessons: [],
        completed: false,
        progress: 0,
      },
    ],
    progress: 0,
    completedModules: 0,
  },
];

export const mockModuleDetails = {
  'module-001': {
    id: 'module-001',
    title: 'JavaScript Fundamentals',
    description: 'Master the core concepts of JavaScript',
    estimatedHours: 20,
    lessons: [
      {
        id: 'lesson-001',
        title: 'Introduction to JavaScript',
        description: 'Get started with JavaScript',
        videoUrl: 'https://example.com/video1',
        content: 'JavaScript is a programming language that enables interactive web pages...',
        resources: [
          {
            id: 'res-001',
            title: 'MDN JavaScript Basics',
            type: 'documentation' as const,
            url: 'https://developer.mozilla.org',
          },
        ],
        completed: true,
        duration: 45,
      },
      {
        id: 'lesson-002',
        title: 'Variables and Data Types',
        description: 'Understanding variables',
        content: 'Variables are containers for storing data values...',
        resources: [],
        completed: false,
        duration: 60,
      },
    ],
    completed: false,
    progress: 50,
  },
};
