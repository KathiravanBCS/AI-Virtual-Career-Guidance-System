export interface Module {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  progress: number;
}

export interface CareerPath {
  $id: string;
  careerName: string;
  description?: string;
  modules: Module[];
  completedModules: string[];
  progress: number;
  createdAt?: string;
}

export interface PathFilters {
  searchTerm: string;
  sortBy: 'progress' | 'name' | 'recent';
}
