/**
 * Types for Careers Module
 * All data structures for careers-related features
 */

// ============= CAREER TYPES =============

export interface Career {
  id: number;
  career_guidance_id?: number;
  career_code?: string;
  career_title: string;
  description: string;
  job_responsibilities: string;
  career_growth_path: string;
  industry: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  demand_level: string;
  job_market_demand_score: number;
  growth_rate: number;
  status: 'active' | 'inactive' | 'deprecated';
  created_at?: string;
  updated_at?: string;
}

export interface CreateCareerRequest {
  career_guidance_id?: number;
  career_code?: string;
  career_title: string;
  description: string;
  job_responsibilities: string;
  career_growth_path: string;
  industry: string;
  salary_min: number;
  salary_max: number;
  salary_currency: string;
  demand_level: string;
  job_market_demand_score: number;
  growth_rate: number;
  status: 'active' | 'inactive' | 'deprecated';
}

export interface UpdateCareerRequest extends Partial<CreateCareerRequest> {}

// ============= CAREER SKILLS TYPES =============

export interface CareerSkill {
  id: number;
  career_id: number;
  skill_name: string;
  importance_level: string;
  proficiency_required: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCareerSkillRequest {
  career_guidance_id?: number;
  career_id?: number;
  skill_name: string;
  importance_level: string;
  proficiency_required: string;
  learning_path?: string;
}

export interface UpdateCareerSkillRequest extends Partial<CreateCareerSkillRequest> {}

// ============= CAREER COMPANIES TYPES =============

export interface CareerCompany {
  id: number;
  career_id: number;
  company_name: string;
  industry: string;
  hiring_level: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCareerCompanyRequest {
  career_guidance_id?: number;
  career_id?: number;
  career_title?: string;
  company_name: string;
  industry: string;
  hiring_level: string;
  job_market_opportunity?: string;
}

export interface UpdateCareerCompanyRequest extends Partial<CreateCareerCompanyRequest> {}

// ============= IN DEMAND SKILLS TYPES =============

export interface InDemandSkill {
  id: number;
  skill_id: number;
  demand_level: string;
  market_demand_score: number;
  trend: string;
  growth_rate: number;
  market_salaries_min: number;
  market_salaries_max: number;
  created_at?: string;
  updated_at?: string;
}

export interface CreateInDemandSkillRequest {
  skill_id: number;
  demand_level: string;
  market_demand_score: number;
  trend: string;
  growth_rate: number;
  market_salaries_min: number;
  market_salaries_max: number;
}

export interface UpdateInDemandSkillRequest extends Partial<CreateInDemandSkillRequest> {}

// ============= RECOMMENDATIONS TYPES =============

export interface Recommendation {
  id: number;
  user_id: number;
  career_id: number;
  match_score: number;
  personality_alignment: number;
  skill_alignment: number;
  interest_alignment: number;
  rank: number;
  reasoning: string;
  status: 'active' | 'inactive' | 'archived';
  created_at?: string;
  updated_at?: string;
}

export interface CreateRecommendationRequest {
  career_guidance_id?: number;
  user_id: number;
  career_id?: number;
  career_title?: string;
  match_score: number;
  personality_alignment: number;
  skill_alignment: number;
  interest_alignment: number;
  rank: number;
  reasoning: string;
  next_steps?: string[];
  status: 'active' | 'inactive' | 'archived';
}

export interface UpdateRecommendationRequest extends Partial<CreateRecommendationRequest> {}

// Extended recommendation with career details
export interface RecommendationWithCareer extends Recommendation {
  career?: Career;
  skills?: CareerSkill[];
  companies?: CareerCompany[];
}

// ============= JOB MARKET TRENDS TYPES =============

export interface JobMarketTrend {
  id: number;
  market_trend_code?: string;
  career_id: number;
  trend_name: string;
  trend_description: string;
  impact_level: string;
  trend_data: Record<string, any>;
  data_source: string;
  trend_date: string;
  forecast_data: Record<string, any>;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
}

export interface CreateJobMarketTrendRequest {
  career_guidance_id?: number;
  career_id?: number;
  career_title?: string;
  trend_name: string;
  trend_description: string;
  impact_level: string;
  current_data?: Record<string, any>;
  trend_data?: Record<string, any>;
  data_source?: string;
  trend_date?: string;
  forecast?: Record<string, any>;
  forecast_data?: Record<string, any>;
  growth_potential?: number;
  in_demand_skills?: string[];
}

export interface UpdateJobMarketTrendRequest extends Partial<CreateJobMarketTrendRequest> {}

export interface JobMarketTrendListResponse {
  success: boolean;
  data: JobMarketTrend[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface JobMarketTrendResponse {
  success: boolean;
  data: JobMarketTrend;
}

// ============= CAREER EXPLORATION LOGS TYPES =============

export interface CareerExplorationLog {
  id: number;
  user_id: number;
  career_id: number;
  action: string;
  details: string;
  interaction_data: Record<string, any>;
  created_at?: string;
  updated_at?: string;
}

export interface CreateCareerExplorationLogRequest {
  user_id: number;
  career_id: number;
  action: string;
  details: string;
  interaction_data: Record<string, any>;
}

export interface UpdateCareerExplorationLogRequest extends Partial<CreateCareerExplorationLogRequest> {}

// ============= FILTER TYPES =============

export interface CareerFilters {
  industry?: string[];
  minDemandScore?: number;
  minGrowthRate?: number;
  salaryRange?: { min: number; max: number };
  demandLevel?: string[];
  status?: 'active' | 'inactive' | 'deprecated';
  sortBy?: 'salary_max' | 'growth_rate' | 'demand_level' | 'match_score';
  sortOrder?: 'asc' | 'desc';
}

// ============= API RESPONSE TYPES =============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data: T[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
}

// ============= AI GUIDANCE TYPES =============

export interface UserInterests {
  interests: string[];
  skills?: string[];
  experience?: string;
  goals?: string;
}

export interface AICareerGuidance {
  userInterests: UserInterests;
  recommendedCareers: CareerRecommendation[];
  skills: AIGeneratedSkill[];
  companies: AIGeneratedCompany[];
  recommendations: AIRecommendation[];
  marketTrends: AIJobMarketTrend[];
  guidance: string;
  summary: string;
}

export interface CareerRecommendation {
  careerTitle: string;
  description: string;
  jobResponsibilities?: string;
  careerGrowthPath?: string;
  industry?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  demandLevel?: string;
  jobMarketDemandScore?: number;
  growthRate?: number;
  matchScore: number;
  reasoningAlignment: string;
}

export interface AIGeneratedSkill {
  skillName: string;
  careerTitle: string;
  importanceLevel: 'critical' | 'high' | 'medium' | 'low';
  proficiencyRequired: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learningPath: string;
}

export interface AIGeneratedCompany {
  companyName: string;
  careerTitle: string;
  industry: string;
  hiringLevel: 'entry-level' | 'mid-level' | 'senior' | 'management';
  jobMarketOpportunity: string;
}

export interface AIRecommendation {
  careerId?: number;
  careerTitle: string;
  matchScore: number;
  personalityAlignment: number;
  skillAlignment: number;
  interestAlignment: number;
  reasoning: string;
  nextSteps: string[];
}

export interface AIJobMarketTrend {
  trendName: string;
  careerTitle: string;
  trendDescription: string;
  impactLevel: 'high' | 'medium' | 'low';
  currentData: Record<string, any>;
  forecast: Record<string, any>;
  growthPotential: number;
  inDemandSkills?: string[];
}

// ============= CAREER GUIDANCE TYPES =============

export interface CareerGuidance {
  id: number;
  career_guidance_code?: string;
  user_id: number;
  current_skills: string[];
  interests: string[];
  experience: string;
  career_goals: string;
  guidance: string;
  summary: string;
  status: 'active' | 'inactive' | 'archived';
  is_active?: boolean;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number | null;
}

export interface CreateCareerGuidanceRequest {
  user_id: number;
  current_skills: string[];
  interests: string[];
  experience: string;
  career_goals: string;
  guidance: string;
  summary: string;
  status: 'active' | 'inactive' | 'archived';
}

export interface UpdateCareerGuidanceRequest extends Partial<CreateCareerGuidanceRequest> {}

export interface CareerGuidanceListResponse {
  success: boolean;
  data: CareerGuidance[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface CareerGuidanceResponse {
  success: boolean;
  data: CareerGuidance;
}

// ============= DETAILED CAREER GUIDANCE TYPES =============

export interface CareerGuidanceDetail extends CareerGuidance {
  careers: Career[];
  career_skills: CareerSkillDetail[];
  career_companies: CareerCompanyDetail[];
  recommendations: RecommendationDetail[];
  market_trends: MarketTrendDetail[];
}

export interface CareerSkillDetail {
  id: number;
  career_guidance_id: number;
  skill_name: string;
  career_title: string | null;
  importance_level: 'critical' | 'high' | 'medium' | 'low';
  proficiency_required: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  learning_path: string;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number | null;
}

export interface CareerCompanyDetail {
  id: number;
  career_guidance_id: number;
  company_name: string;
  career_title: string | null;
  industry: string;
  hiring_level: 'entry-level' | 'mid-level' | 'senior' | 'management';
  job_market_opportunity: string;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number | null;
}

export interface RecommendationDetail {
  id: number;
  career_guidance_id: number;
  recommendation_code: string;
  user_id: number;
  career_title: string;
  match_score: string | number;
  personality_alignment: string | number;
  skill_alignment: string | number;
  interest_alignment: string | number;
  rank: number;
  reasoning: string;
  next_steps: string[];
  status: 'active' | 'inactive' | 'archived';
  generated_at?: string;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number | null;
}

export interface MarketTrendDetail {
  id: number;
  market_trend_code: string;
  career_guidance_id: number;
  trend_name: string;
  career_title: string;
  trend_description: string;
  impact_level: 'high' | 'medium' | 'low';
  current_data: Record<string, any>;
  forecast: Record<string, any>;
  growth_potential: number;
  in_demand_skills?: string[];
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number | null;
}

export interface CareerGuidanceDetailResponse {
  success: boolean;
  data: CareerGuidanceDetail;
}
