export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/api/v1/users/login',
    register: '/api/v1/users',
  },

  // Users
  users: {
    list: '/api/v1/users/',
    get: (userId: number) => `/api/v1/users/${userId}`,
    create: '/api/v1/users/',
    update: (userId: number) => `/api/v1/users/${userId}`,
    delete: (userId: number) => `/api/v1/users/${userId}`,
  },

  // User Profiles
  userProfiles: {
    list: '/api/v1/user-profiles/',
    create: '/api/v1/user-profiles/',
    getByUser: (userId: number) => `/api/v1/user-profiles/user/${userId}`,
    get: (profileId: number) => `/api/v1/user-profiles/${profileId}`,
    update: (profileId: number) => `/api/v1/user-profiles/${profileId}`,
    delete: (profileId: number) => `/api/v1/user-profiles/${profileId}`,
  },

  // Work Experience
  workExperience: {
    list: '/api/v1/work-experience/',
    create: '/api/v1/work-experience/',
    getByUser: (userId: number) => `/api/v1/work-experience/user/${userId}`,
    get: (experienceId: number) => `/api/v1/work-experience/${experienceId}`,
    update: (experienceId: number) => `/api/v1/work-experience/${experienceId}`,
    delete: (experienceId: number) => `/api/v1/work-experience/${experienceId}`,
  },

  // User Skills
  userSkills: {
    list: '/api/v1/user-skills/',
    create: '/api/v1/user-skills/',
    getByUser: (userId: number) => `/api/v1/user-skills/user/${userId}`,
    get: (skillId: number) => `/api/v1/user-skills/${skillId}`,
    update: (skillId: number) => `/api/v1/user-skills/${skillId}`,
    delete: (skillId: number) => `/api/v1/user-skills/${skillId}`,
  },

  // Skill Gaps
  skillGaps: {
    list: '/api/v1/skill-gaps/',
    create: '/api/v1/skill-gaps/',
    getByUser: (userId: number) => `/api/v1/skill-gaps/user/${userId}`,
    getByUserAndCareer: (userId: number, careerId: number) => `/api/v1/skill-gaps/user/${userId}/career/${careerId}`,
    get: (gapId: number) => `/api/v1/skill-gaps/${gapId}`,
    update: (gapId: number) => `/api/v1/skill-gaps/${gapId}`,
    delete: (gapId: number) => `/api/v1/skill-gaps/${gapId}`,
  },

  // Careers
  careers: {
    list: '/api/v1/careers/',
    get: (careerId: string) => `/api/v1/careers/${careerId}`,
  },

  // Skills
  skills: {
    list: '/api/v1/skills/',
    create: '/api/v1/skills/',
    get: (skillId: string) => `/api/v1/skills/${skillId}`,
    update: (skillId: string) => `/api/v1/skills/${skillId}`,
    delete: (skillId: string) => `/api/v1/skills/${skillId}`,
  },

  // Assessments
  assessments: {
    list: '/api/v1/assessments/',
    get: (assessmentId: string) => `/api/v1/assessments/${assessmentId}`,
  },

  // Recommendations
  recommendations: {
    list: '/api/v1/recommendations/',
    get: (recommendationId: string) => `/api/v1/recommendations/${recommendationId}`,
  },

  // Learning Resources
  learning: {
    resources: {
      list: '/api/v1/learning/resources',
      get: (resourceId: string) => `/api/v1/learning/resources/${resourceId}`,
    },
    paths: {
      list: '/api/v1/learning/paths',
    },
  },

  // Learning Guidance
  learningGuidance: {
    create: '/api/v1/learning-guidance',
    list: '/api/v1/learning-guidance',
    get: (guidanceId: number) => `/api/v1/learning-guidance/${guidanceId}`,
    update: (guidanceId: number) => `/api/v1/learning-guidance/${guidanceId}`,
    delete: (guidanceId: number) => `/api/v1/learning-guidance/${guidanceId}`,
    getByUser: (userId: number) => `/api/v1/learning-guidance/user/${userId}`,
    getByStatus: (statusFilter: string) => `/api/v1/learning-guidance/status/${statusFilter}`,
    // Learning Guidance with Learning Modules
    getWithModulesAll: '/api/v1/learning-guidance/guidance/learning-modules/all',
    getWithModulesById: (guidanceId: number) => `/api/v1/learning-guidance/guidance/learning-modules/${guidanceId}`,
  },

  // Learning Modules
  learningModules: {
    list: '/api/v1/learning-modules',
    create: '/api/v1/learning-modules',
    get: (moduleId: number) => `/api/v1/learning-modules/${moduleId}`,
    update: (moduleId: number) => `/api/v1/learning-modules/${moduleId}`,
    delete: (moduleId: number) => `/api/v1/learning-modules/${moduleId}`,
  },

  // Health Check
  health: '/health',
};
