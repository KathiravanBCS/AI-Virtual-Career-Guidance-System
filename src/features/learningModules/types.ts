// Learning Module Types

export interface LearningModuleContent {
  [key: string]: unknown;
}

export interface LearningModule {
  id: number;
  title: string;
  description: string;
  estimated_time: string;
  content: LearningModuleContent;
  module_order: number;
  completion_percentage: number;
  learning_module_code: string;
  learning_guidance_id: number;
  status: string;
}

// Get all learning modules response
export type GetAllLearningModulesResponse = LearningModule[];

// Get learning module by ID response
export type GetLearningModuleByIdResponse = LearningModule;

// Create learning module request
export interface CreateLearningModuleRequest {
  title: string;
  description: string;
  estimated_time: string;
  content: LearningModuleContent;
  module_order: number;
  completion_percentage: number;
  learning_guidance_id: number;
}

// Update learning module request
export interface UpdateLearningModuleRequest {
  learning_module_id: number;
  title?: string;
  description?: string;
  estimated_time?: string;
  content?: LearningModuleContent;
  module_order?: number;
  completion_percentage?: number;
  status?: string;
}

// Delete learning module response
export interface DeleteLearningModuleResponse {
  success: boolean;
  message?: string;
}

// Learning module filter options
export interface LearningModuleFilterOptions {
  learning_guidance_id?: number;
  status?: string;
  module_order?: number;
  page?: number;
  limit?: number;
}
