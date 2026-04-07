export interface CareerPath {
  $id: string;
  careerName: string;
  modules: unknown[];
  completedModules: unknown[];
  progress: number;
  recommendedSkills?: unknown[];
}

export interface CareerSummary {
  ref: React.RefObject<HTMLDivElement | null>;
  data: {
    name: string;
    goal: string;
    progress: number;
    completed: number;
    total: number;
  };
  summaryText: string;
}

export interface Assessment {
  moduleID: string;
  moduleName: string;
  score: number;
  feedback?: string;
}

export interface UserData {
  name: string;
  careerGoal?: string;
  interests?: string[];
  skills?: string[];
}

// Learning Guidance Data from API
export interface LearningModule {
  id: number;
  title: string;
  description: string;
  estimated_time: string;
  content: {
    keyPoints: string[];
    practicalApplications: unknown[];
  };
  module_order: number;
  completion_percentage: number;
  status: 'active' | 'completed' | 'pending';
  learning_module_code: string;
  learning_guidance_id: number;
  created_at: string;
  updated_at: string;
}

export interface LearningGuidanceData {
  id: number;
  name: string;
  age: number;
  career_goal: string;
  current_skills: string[];
  interests: string[];
  assessment_answers: Record<string, string>;
  learning_guidance_code: string;
  user_id: number;
  status: string;
  completion_percentage: number;
  learning_modules: LearningModule[];
  created_at: string;
  updated_at: string;
}

export interface CareerSummaryResponse {
  careerPath: LearningModule | null;
  summaryText: string;
  generatedAt: string;
  modulesData: {
    total: number;
    completed: number;
    active: number;
    pending: number;
  };
}
