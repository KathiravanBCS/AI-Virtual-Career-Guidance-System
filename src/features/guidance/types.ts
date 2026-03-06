export interface GuidanceSession {
  id: string;
  name?: string;
  topic?: string;
  user_email?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'draft';
  scheduled_at?: string;
  created_at: string;
  updated_at: string;
}

// Learning Guidance API Types
export interface CreateLearningGuidanceRequest {
  name: string;
  age: number;
  career_goal: string;
  current_skills: string[];
  interests: string[];
  assessment_answers: Record<string, string>;
  user_id: number;
}

export interface UpdateLearningGuidanceRequest {
  name?: string;
  age?: number;
  career_goal?: string;
  current_skills?: string[];
  interests?: string[];
  assessment_answers?: Record<string, string>;
  status?: string;
  completion_percentage?: number;
}

export interface LearningGuidance {
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
  created_at?: string;
  updated_at?: string;
}

export interface LearningGuidanceResponse extends LearningGuidance {
  message?: string;
}

export interface LearningGuidanceListResponse {
  data: LearningGuidance[];
  total?: number;
  message?: string;
}

// Learning Guidance with Learning Modules

export interface LearningModuleInfo {
  id: number;
  title: string;
  description: string;
  estimated_time: string;
  content: Record<string, unknown>;
  module_order: number;
  completion_percentage: number;
  learning_module_code: string;
  learning_guidance_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
}

export interface GuidanceWithLearningModules extends LearningGuidance {
  learning_modules: LearningModuleInfo[];
  total?: number;
  message?: string;
}

export interface GuidanceWithLearningModule {
  data: GuidanceWithLearningModules[];
  message?: string;
}
