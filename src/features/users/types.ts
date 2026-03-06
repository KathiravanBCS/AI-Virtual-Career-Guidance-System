// User response types
export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  profile_picture_url: string;
  user_code: string;
  role_id: number;
  status: string;
  is_active: boolean;
  created_at: string;
  last_login: string;
}

// Get all users response
export type GetAllUsersResponse = User[];

// Get user by ID response
export type GetUserByIdResponse = User;

// Create user request
export interface CreateUserRequest {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  profile_picture_url?: string;
  password: string;
  role_id: number;
}

// Update user request
export interface UpdateUserRequest {
  first_name?: string;
  last_name?: string;
  phone?: string;
  location?: string;
  profile_picture_url?: string;
}

// User filter/query options
export interface UserFilterOptions {
  email?: string;
  first_name?: string;
  last_name?: string;
  role_id?: number;
  is_active?: boolean;
  status?: string;
  page?: number;
  limit?: number;
}

// User Profile types
export interface UserProfile {
  id: number;
  user_id: number;
  degree: string;
  stream: string;
  gpa: number;
  college_name: string;
  graduation_year: number;
  years_of_experience: number;
  bio: string;
  resume_url: string;
  personality_type: string;
  personality_score: number;
  career_goal: string;
}

// Get all user profiles response
export type GetAllUserProfilesResponse = UserProfile[];

// Get user profile by ID response
export type GetUserProfileByIdResponse = UserProfile;

// Create user profile request
export interface CreateUserProfileRequest {
  user_id: number;
  degree: string;
  stream: string;
  gpa: number;
  college_name: string;
  graduation_year: number;
  years_of_experience: number;
  bio: string;
  resume_url: string;
  personality_type: string;
  personality_score: number;
  career_goal: string;
}

// Update user profile request
export interface UpdateUserProfileRequest {
  degree?: string;
  stream?: string;
  gpa?: number;
  college_name?: string;
  graduation_year?: number;
  years_of_experience?: number;
  bio?: string;
  resume_url?: string;
  personality_type?: string;
  personality_score?: number;
  career_goal?: string;
}

// Work Experience types
export interface WorkExperience {
  id: number;
  user_id: number;
  job_title: string;
  company_name: string;
  industry: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  status: string;
}

// Get all work experiences response
export type GetAllWorkExperienceResponse = WorkExperience[];

// Get work experience by ID response
export type GetWorkExperienceByIdResponse = WorkExperience;

// Create work experience request
export interface CreateWorkExperienceRequest {
  user_id: number;
  job_title: string;
  company_name: string;
  industry: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  description: string;
  status: string;
}

// Update work experience request
export interface UpdateWorkExperienceRequest {
  job_title?: string;
  company_name?: string;
  industry?: string;
  start_date?: string;
  end_date?: string;
  is_current?: boolean;
  description?: string;
  status?: string;
}

// User Skills types
export interface UserSkill {
  id: number;
  user_id: number;
  skill_id: number;
  proficiency_level: string;
  years_of_experience: number;
  endorsement_count: number;
}

// Get all user skills response
export type GetAllUserSkillsResponse = UserSkill[];

// Get user skill by ID response
export type GetUserSkillByIdResponse = UserSkill;

// Create user skill request
export interface CreateUserSkillRequest {
  user_id: number;
  skill_id: number;
  proficiency_level: string;
  years_of_experience: number;
  endorsement_count: number;
}

// Update user skill request
export interface UpdateUserSkillRequest {
  proficiency_level?: string;
  years_of_experience?: number;
  endorsement_count?: number;
}

// Skill Gap types
export interface SkillGap {
  id: number;
  user_id: number;
  career_id: number;
  skill_id: number;
  user_proficiency: string;
  required_proficiency: string;
  gap_level: string;
}

// Get all skill gaps response
export type GetAllSkillGapsResponse = SkillGap[];

// Get skill gap by ID response
export type GetSkillGapByIdResponse = SkillGap;

// Create skill gap request
export interface CreateSkillGapRequest {
  user_id: number;
  career_id: number;
  skill_id: number;
  user_proficiency: string;
  required_proficiency: string;
  gap_level: string;
}

// Update skill gap request
export interface UpdateSkillGapRequest {
  user_proficiency?: string;
  required_proficiency?: string;
  gap_level?: string;
}
