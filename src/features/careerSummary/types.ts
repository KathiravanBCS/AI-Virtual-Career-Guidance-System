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
