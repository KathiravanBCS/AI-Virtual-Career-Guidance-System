export const API_ENDPOINTS = {
  // Auth
  auth: {
    login: '/api/v1/users/login',
    register: '/api/v1/users',
    getPermissions: '/api/v1/users/permissions/current',
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

  // // Careers
  // careers: {
  //   list: '/api/v1/careers/',
  //   get: (careerId: string) => `/api/v1/careers/${careerId}`,
  // },

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

  // // Recommendations
  // recommendations: {
  //   list: '/api/v1/recommendations/',
  //   get: (recommendationId: string) => `/api/v1/recommendations/${recommendationId}`,
  // },

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

  // Flashcards
  flashcards: {
    list: '/api/v1/flashcards',
    create: '/api/v1/flashcards',
    get: (flashcardId: number) => `/api/v1/flashcards/${flashcardId}`,
    update: (flashcardId: number) => `/api/v1/flashcards/${flashcardId}`,
    delete: (flashcardId: number) => `/api/v1/flashcards/${flashcardId}`,
    getByModule: (moduleId: number) => `/api/v1/flashcards/module/${moduleId}`,
    items: {
      list: (flashcardId: number) => `/api/v1/flashcards/${flashcardId}/items`,
      create: (flashcardId: number) => `/api/v1/flashcards/${flashcardId}/items`,
      get: (flashcardId: number, itemId: number) => `/api/v1/flashcards/${flashcardId}/items/${itemId}`,
      update: (flashcardId: number, itemId: number) => `/api/v1/flashcards/${flashcardId}/items/${itemId}`,
      delete: (flashcardId: number, itemId: number) => `/api/v1/flashcards/${flashcardId}/items/${itemId}`,
    },
  },

  // Quizzes
  quizzes: {
    list: '/api/v1/quizzes',
    create: '/api/v1/quizzes',
    get: (quizId: number) => `/api/v1/quizzes/${quizId}`,
    update: (quizId: number) => `/api/v1/quizzes/${quizId}`,
    delete: (quizId: number) => `/api/v1/quizzes/${quizId}`,
    getByModule: (moduleId: number) => `/api/v1/quizzes/module/${moduleId}`,
    questions: {
      list: (quizId: number) => `/api/v1/quizzes/${quizId}/questions`,
      create: (quizId: number) => `/api/v1/quizzes/${quizId}/questions`,
      get: (quizId: number, questionId: number) => `/api/v1/quizzes/${quizId}/questions/${questionId}`,
      update: (quizId: number, questionId: number) => `/api/v1/quizzes/${quizId}/questions/${questionId}`,
      delete: (quizId: number, questionId: number) => `/api/v1/quizzes/${quizId}/questions/${questionId}`,
    },
  },

  // Master Roles
  roles: {
    list: '/api/v1/roles/',
    create: '/api/v1/roles/',
    get: (roleId: number) => `/api/v1/roles/${roleId}`,
    update: (roleId: number) => `/api/v1/roles/${roleId}`,
    delete: (roleId: number) => `/api/v1/roles/${roleId}`,
  },

  // Master Permissions
  permissions: {
    list: '/api/v1/permissions/',
    create: '/api/v1/permissions/',
    get: (permissionId: number) => `/api/v1/permissions/${permissionId}`,
    update: (permissionId: number) => `/api/v1/permissions/${permissionId}`,
    delete: (permissionId: number) => `/api/v1/permissions/${permissionId}`,
  },

  // Role Permissions
  rolePermissions: {
    list: '/api/v1/role-permissions/',
    create: '/api/v1/role-permissions/',
    get: (rolePermissionId: number) => `/api/v1/role-permissions/${rolePermissionId}`,
    update: (rolePermissionId: number) => `/api/v1/role-permissions/${rolePermissionId}`,
    delete: (rolePermissionId: number) => `/api/v1/role-permissions/${rolePermissionId}`,
  },

  // Documents
  documents: {
    convertToText: '/api/v1/documents/convert-to-text',
    supportedFormats: '/api/v1/documents/supported-formats',
  },

  // Chat
  chat: {
    sessions: {
      list: '/api/v1/chat/sessions',
      create: '/api/v1/chat/sessions',
      get: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}`,
      update: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}`,
      delete: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}`,
      messages: {
        list: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}/messages`,
        create: (sessionId: string) => `/api/v1/chat/sessions/${sessionId}/messages`,
      },
    },
    messages: {
      get: (messageId: string) => `/api/v1/chat/messages/${messageId}`,
      update: (messageId: string) => `/api/v1/chat/messages/${messageId}`,
      delete: (messageId: string) => `/api/v1/chat/messages/${messageId}`,
    },
  },

  // Careers
  careers: {
    list: '/api/v1/careers',
    get: (careerId: number) => `/api/v1/careers/${careerId}`,
    create: '/api/v1/careers',
    update: (careerId: number) => `/api/v1/careers/${careerId}`,
    delete: (careerId: number) => `/api/v1/careers/${careerId}`,
  },

  // Career Skills
  careerSkills: {
    list: '/api/v1/career-skills',
    get: (skillId: number) => `/api/v1/career-skills/${skillId}`,
    create: '/api/v1/career-skills',
    update: (skillId: number) => `/api/v1/career-skills/${skillId}`,
    delete: (skillId: number) => `/api/v1/career-skills/${skillId}`,
  },

  // Career Companies
  careerCompanies: {
    list: '/api/v1/career-companies',
    get: (companyId: number) => `/api/v1/career-companies/${companyId}`,
    create: '/api/v1/career-companies',
    update: (companyId: number) => `/api/v1/career-companies/${companyId}`,
    delete: (companyId: number) => `/api/v1/career-companies/${companyId}`,
  },

  // In Demand Skills
  inDemandSkills: {
    list: '/api/v1/in-demand-skills',
    get: (skillId: number) => `/api/v1/in-demand-skills/${skillId}`,
    create: '/api/v1/in-demand-skills',
    update: (skillId: number) => `/api/v1/in-demand-skills/${skillId}`,
    delete: (skillId: number) => `/api/v1/in-demand-skills/${skillId}`,
  },

  // Recommendations
  recommendations: {
    list: '/api/v1/recommendations',
    get: (recommendationId: number) => `/api/v1/recommendations/${recommendationId}`,
    getByUser: (userId: number) => `/api/v1/recommendations/user/${userId}`,
    create: '/api/v1/recommendations',
    update: (recommendationId: number) => `/api/v1/recommendations/${recommendationId}`,
    delete: (recommendationId: number) => `/api/v1/recommendations/${recommendationId}`,
  },

  // Job Market Trends
  jobMarketTrends: {
    list: '/api/v1/job-market-trends',
    get: (trendId: number) => `/api/v1/job-market-trends/${trendId}`,
    getByCareer: (careerId: number) => `/api/v1/job-market-trends/career/${careerId}`,
    create: '/api/v1/job-market-trends',
    update: (trendId: number) => `/api/v1/job-market-trends/${trendId}`,
    delete: (trendId: number) => `/api/v1/job-market-trends/${trendId}`,
  },

  // Career Exploration Logs
  careerExplorationLogs: {
    list: '/api/v1/career-exploration-logs',
    get: (logId: number) => `/api/v1/career-exploration-logs/${logId}`,
    getByUser: (userId: number) => `/api/v1/career-exploration-logs/user/${userId}`,
    create: '/api/v1/career-exploration-logs',
    update: (logId: number) => `/api/v1/career-exploration-logs/${logId}`,
    delete: (logId: number) => `/api/v1/career-exploration-logs/${logId}`,
  },

  // Career Guidance
  careerGuidance: {
    list: '/api/v1/career-guidance',
    create: '/api/v1/career-guidance',
    get: (guidanceId: number) => `/api/v1/career-guidance/${guidanceId}`,
    update: (guidanceId: number) => `/api/v1/career-guidance/${guidanceId}`,
    delete: (guidanceId: number) => `/api/v1/career-guidance/${guidanceId}`,
    getByUser: (userId: number) => `/api/v1/career-guidance/user/${userId}`,
  },

  // Gamification
  gamification: {
    // User points and stats
    points: {
      get: (userId: number) => `/api/v1/gamification/points/${userId}`,
    },
    userStats: {
      get: (userId: number, days?: number) =>
        `/api/v1/gamification/user-stats/${userId}${days ? `?days=${days}` : ''}`,
    },
    // Streak tracking
    streak: {
      get: (userId: number) => `/api/v1/gamification/streak/${userId}`,
    },
    // Leaderboard
    leaderboard: {
      get: (period: string) => `/api/v1/gamification/leaderboard/${period}`,
    },
    // Activity logging
    activities: {
      log: '/api/v1/gamification/activities/log',
      list: (userId: number) => `/api/v1/gamification/activities/${userId}`,
      get: (activityId: number) => `/api/v1/gamification/activities/${activityId}`,
    },
  },

  // Dashboard
  dashboard: {
    summaryMe: '/api/v1/dashboard/summary/me',
  },

  // Health Check
  health: '/health',
};
