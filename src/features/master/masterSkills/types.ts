// Create Skill Request
export interface CreateSkillRequest {
  skill_name: string;
  category: string;
  difficulty_level: string;
  description: string;
  status: 'active' | 'inactive';
}

// Skill in List Response
export interface SkillListItem {
  id: number;
  skill_name: string;
  category: string;
  difficulty_level: string;
  status: string;
  created_at: string;
}

// Skill Detail Response (Get by ID)
export interface SkillDetail {
  id: number;
  skill_name: string;
  category: string;
  difficulty_level: string;
  description: string;
  status: 'active' | 'inactive';
  created_at: string;
  created_by: number;
  updated_by: number;
}

// Update Skill Request
export interface UpdateSkillRequest {
  id: number;
  skill_name: string;
  category: string;
  difficulty_level: string;
  description: string;
  status: 'active' | 'inactive';
}

// Get All Skills Response
export type GetAllSkillsResponse = SkillListItem[];
