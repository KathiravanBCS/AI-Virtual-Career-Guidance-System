export interface Module {
  id: string;
  title: string;
  description: string;
  content?: string;
  completed: boolean;
  progress: number;
  lessonCount?: number;
  estimatedTime?: string;
}

export interface PathDetails {
  $id: string;
  careerName: string;
  description?: string;
  modules: Module[];
  completedModules: string[];
  progress: number;
  createdAt?: string;
  totalEstimatedHours?: number;
}
