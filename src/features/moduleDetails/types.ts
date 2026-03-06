export interface Lesson {
  id: string;
  title: string;
  content: string;
  order: number;
  completed: boolean;
  videoUrl?: string;
  resources?: { title: string; url: string }[];
}

export interface ModuleDetail {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  completed: boolean;
  pathId: string;
  pathName?: string;
}

export interface LessonContent {
  text: string;
  videoUrl?: string;
  codeSnippets?: { language: string; code: string }[];
}
