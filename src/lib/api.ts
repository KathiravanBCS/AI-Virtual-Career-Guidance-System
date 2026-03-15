import type { LoginRequest, LoginResponse, UserFormData } from '@/features/auth/types';
import type {
  ChatMessage,
  ChatMessagesListResponse,
  ChatSession,
  ChatSessionsListResponse,
  CreateChatMessageRequest,
  CreateChatSessionRequest,
  UpdateChatMessageRequest,
  UpdateChatSessionRequest,
} from '@/features/chat/types';
import type {
  CreateFlashcardItemRequest,
  CreateFlashcardRequest,
  Flashcard,
  FlashcardItem,
  FlashcardItemsListResponse,
  FlashcardsListResponse,
} from '@/features/flashcards/types';
import type {
  CreateLearningGuidanceRequest,
  GuidanceWithLearningModule,
  GuidanceWithLearningModules,
  LearningGuidance,
  LearningGuidanceListResponse,
  LearningGuidanceResponse,
  UpdateLearningGuidanceRequest,
} from '@/features/guidance/types';
import type {
  CreateLearningModuleRequest,
  GetAllLearningModulesResponse,
  GetLearningModuleByIdResponse,
  LearningModule,
  UpdateLearningModuleRequest,
} from '@/features/learningModules/types';
import type {
  CreatePermissionRequest,
  GetAllPermissionsResponse,
  GetPermissionByIdResponse,
  Permission,
  UpdatePermissionRequest,
} from '@/features/master/masterPermissions/types';
import type {
  CreateRoleRequest,
  GetAllRolesResponse,
  GetRoleByIdResponse,
  Role,
  UpdateRoleRequest,
} from '@/features/master/masterRoles/types';
import type {
  CreateSkillRequest,
  GetAllSkillsResponse,
  SkillDetail,
  SkillListItem,
  UpdateSkillRequest,
} from '@/features/master/masterSkills/types';
import type {
  CreateRolePermissionRequest,
  GetAllRolePermissionsResponse,
  GetRolePermissionByIdResponse,
  RolePermission,
  UpdateRolePermissionRequest,
} from '@/features/master/rolePermissions/types';
import type {
  CreateQuizQuestionRequest,
  CreateQuizRequest,
  Quiz,
  QuizQuestion,
  QuizQuestionsListResponse,
  QuizzesListResponse,
} from '@/features/quiz/types';
import type { DocumentConversionResponse } from '@/features/resumeBuilder/types';
import type {
  CreateSkillGapRequest,
  CreateUserProfileRequest,
  CreateUserRequest,
  CreateUserSkillRequest,
  CreateWorkExperienceRequest,
  GetAllSkillGapsResponse,
  GetAllUserProfilesResponse,
  GetAllUserSkillsResponse,
  GetAllUsersResponse,
  GetAllWorkExperienceResponse,
  GetSkillGapByIdResponse,
  GetUserByIdResponse,
  GetUserProfileByIdResponse,
  GetUserSkillByIdResponse,
  GetWorkExperienceByIdResponse,
  SkillGap,
  UpdateSkillGapRequest,
  UpdateUserProfileRequest,
  UpdateUserRequest,
  UpdateUserSkillRequest,
  UpdateWorkExperienceRequest,
  User,
  UserProfile,
  UserSkill,
  WorkExperience,
} from '@/features/users/types';
import type {
  Career,
  CareerSkill,
  CareerCompany,
  InDemandSkill,
  Recommendation,
  JobMarketTrend,
  CareerExplorationLog,
  CareerGuidance,
  CreateCareerRequest,
  UpdateCareerRequest,
  CreateCareerSkillRequest,
  UpdateCareerSkillRequest,
  CreateCareerCompanyRequest,
  UpdateCareerCompanyRequest,
  CreateInDemandSkillRequest,
  UpdateInDemandSkillRequest,
  CreateRecommendationRequest,
  UpdateRecommendationRequest,
  CreateJobMarketTrendRequest,
  UpdateJobMarketTrendRequest,
  JobMarketTrendListResponse,
  JobMarketTrendResponse,
  CreateCareerExplorationLogRequest,
  UpdateCareerExplorationLogRequest,
  CreateCareerGuidanceRequest,
  UpdateCareerGuidanceRequest,
  CareerGuidanceListResponse,
  CareerGuidanceResponse,
  RecommendationWithCareer,
} from '@/features/careers/types';
import type {
  UserPoints,
  UserStats,
  StreakInfo,
  LeaderboardResponse,
  LeaderboardPeriod,
  ActivityLog,
  LogActivityRequest,
  LogActivityResponse,
  ActivityLogListResponse,
  GamificationDashboard,
} from '@/features/gamification/types';
import type { PermissionsResponse } from '@/lib/casl/types';
import { mockUserService } from '@/services/mock/implementations/UserService';

import { apiClient } from './api-clients';
import { API_ENDPOINTS } from './api-endpoints';
import { getConfig } from './utils/configLoader';

// API Service Layer
const createServices = () => {
  const config = getConfig();
  const useMockData = config.features.enableMockData;

  if (useMockData) {
    console.log('[API] Using mock data service');
    return {
      // Auth services
      auth: {
        login: (data: LoginRequest) => Promise.resolve({} as LoginResponse),
        register: (data: UserFormData) => Promise.resolve({} as any),
        getPermissions: () =>
          Promise.resolve({
            user_id: 1,
            role: 'admin',
            rules: [
              { action: 'read', subject: 'all' },
              { action: 'create', subject: 'all' },
              { action: 'update', subject: 'all' },
              { action: 'delete', subject: 'all' },
              { action: 'manage', subject: 'all' },
            ],
          } as PermissionsResponse),
      },

      // User services
      users: {
        getAll: () => mockUserService.getAll(),
        getById: (userId: number) => mockUserService.getById(userId),
        create: (data: CreateUserRequest) => mockUserService.create(data),
        update: (userId: number, data: Partial<UpdateUserRequest>) => mockUserService.update(userId, data),
        delete: (userId: number) => mockUserService.delete(userId),
      },

      // User Profile services
      userProfiles: {
        getAll: () => Promise.resolve({} as GetAllUserProfilesResponse),
        getById: (profileId: number) => Promise.resolve({} as GetUserProfileByIdResponse),
        create: (data: CreateUserProfileRequest) => Promise.resolve({} as UserProfile),
        update: (profileId: number, data: Partial<UpdateUserProfileRequest>) => Promise.resolve({} as UserProfile),
        delete: (profileId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as GetUserProfileByIdResponse),
      },

      // Work Experience services
      workExperience: {
        getAll: () => Promise.resolve({} as GetAllWorkExperienceResponse),
        getById: (experienceId: number) => Promise.resolve({} as GetWorkExperienceByIdResponse),
        create: (data: CreateWorkExperienceRequest) => Promise.resolve({} as WorkExperience),
        update: (experienceId: number, data: Partial<UpdateWorkExperienceRequest>) =>
          Promise.resolve({} as WorkExperience),
        delete: (experienceId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as GetAllWorkExperienceResponse),
      },

      // User Skills services
      userSkills: {
        getAll: () => Promise.resolve({} as GetAllUserSkillsResponse),
        getById: (skillId: number) => Promise.resolve({} as GetUserSkillByIdResponse),
        create: (data: CreateUserSkillRequest) => Promise.resolve({} as UserSkill),
        update: (skillId: number, data: Partial<UpdateUserSkillRequest>) => Promise.resolve({} as UserSkill),
        delete: (skillId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as GetAllUserSkillsResponse),
      },

      // Skill Gaps services
      skillGaps: {
        getAll: () => Promise.resolve({} as GetAllSkillGapsResponse),
        getById: (gapId: number) => Promise.resolve({} as GetSkillGapByIdResponse),
        create: (data: CreateSkillGapRequest) => Promise.resolve({} as SkillGap),
        update: (gapId: number, data: Partial<UpdateSkillGapRequest>) => Promise.resolve({} as SkillGap),
        delete: (gapId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as GetAllSkillGapsResponse),
        getByUserAndCareer: (userId: number, careerId: number) => Promise.resolve({} as GetAllSkillGapsResponse),
      },

      // Learning Guidance services
      learningGuidance: {
        getAll: () => Promise.resolve({} as LearningGuidanceListResponse),
        getById: (guidanceId: number) => Promise.resolve({} as LearningGuidanceResponse),
        create: (data: CreateLearningGuidanceRequest) => Promise.resolve({} as LearningGuidanceResponse),
        update: (guidanceId: number, data: Partial<UpdateLearningGuidanceRequest>) =>
          Promise.resolve({} as LearningGuidanceResponse),
        delete: (guidanceId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as LearningGuidanceListResponse),
        getByStatus: (statusFilter: string) => Promise.resolve({} as LearningGuidanceListResponse),
        getWithModulesAll: () => Promise.resolve({} as GuidanceWithLearningModules),
        getWithModulesById: (guidanceId: number) => Promise.resolve({} as GuidanceWithLearningModule),
      },

      // Learning Modules services
      learningModules: {
        getAll: () => Promise.resolve({} as GetAllLearningModulesResponse),
        getById: (moduleId: number) => Promise.resolve({} as GetLearningModuleByIdResponse),
        create: (data: CreateLearningModuleRequest) => Promise.resolve({} as LearningModule),
        update: (moduleId: number, data: Partial<UpdateLearningModuleRequest>) => Promise.resolve({} as LearningModule),
        delete: (moduleId: number) => Promise.resolve({}),
      },

      // Flashcards services
      flashcards: {
        getAll: () => Promise.resolve({} as FlashcardsListResponse),
        getById: (flashcardId: number) => Promise.resolve({} as Flashcard),
        create: (data: CreateFlashcardRequest) => Promise.resolve({} as Flashcard),
        update: (flashcardId: number, data: Partial<CreateFlashcardRequest>) => Promise.resolve({} as Flashcard),
        delete: (flashcardId: number) => Promise.resolve({}),
        getByModule: (moduleId: number) => Promise.resolve({} as FlashcardsListResponse),
        items: {
          getAll: (flashcardId: number) => Promise.resolve({} as FlashcardItemsListResponse),
          getById: (flashcardId: number, itemId: number) => Promise.resolve({} as FlashcardItem),
          create: (flashcardId: number, data: CreateFlashcardItemRequest) => Promise.resolve({} as FlashcardItem),
          update: (flashcardId: number, itemId: number, data: Partial<CreateFlashcardItemRequest>) =>
            Promise.resolve({} as FlashcardItem),
          delete: (flashcardId: number, itemId: number) => Promise.resolve({}),
        },
      },

      // Quizzes services
      quizzes: {
        getAll: () => Promise.resolve({} as QuizzesListResponse),
        getById: (quizId: number) => Promise.resolve({} as Quiz),
        create: (data: CreateQuizRequest) => Promise.resolve({} as Quiz),
        update: (quizId: number, data: Partial<CreateQuizRequest>) => Promise.resolve({} as Quiz),
        delete: (quizId: number) => Promise.resolve({}),
        getByModule: (moduleId: number) => Promise.resolve({} as QuizzesListResponse),
        questions: {
          getAll: (quizId: number) => Promise.resolve({} as QuizQuestionsListResponse),
          getById: (quizId: number, questionId: number) => Promise.resolve({} as QuizQuestion),
          create: (quizId: number, data: CreateQuizQuestionRequest) => Promise.resolve({} as QuizQuestion),
          update: (quizId: number, questionId: number, data: Partial<CreateQuizQuestionRequest>) =>
            Promise.resolve({} as QuizQuestion),
          delete: (quizId: number, questionId: number) => Promise.resolve({}),
        },
      },

      // Skills services
      skills: {
        getAll: () => Promise.resolve({} as GetAllSkillsResponse),
        getById: (skillId: string) => Promise.resolve({} as SkillDetail),
        create: (data: CreateSkillRequest) => Promise.resolve({} as SkillDetail),
        update: (skillId: string, data: Partial<UpdateSkillRequest>) => Promise.resolve({} as SkillDetail),
        delete: (skillId: string) => Promise.resolve({}),
      },

      // Roles services
      roles: {
        getAll: () => Promise.resolve({} as GetAllRolesResponse),
        getById: (roleId: number) => Promise.resolve({} as GetRoleByIdResponse),
        create: (data: CreateRoleRequest) => Promise.resolve({} as Role),
        update: (roleId: number, data: Partial<UpdateRoleRequest>) => Promise.resolve({} as Role),
        delete: (roleId: number) => Promise.resolve({}),
      },

      // Permissions services
      permissions: {
        getAll: () => Promise.resolve({} as GetAllPermissionsResponse),
        getById: (permissionId: number) => Promise.resolve({} as GetPermissionByIdResponse),
        create: (data: CreatePermissionRequest) => Promise.resolve({} as Permission),
        update: (permissionId: number, data: Partial<UpdatePermissionRequest>) => Promise.resolve({} as Permission),
        delete: (permissionId: number) => Promise.resolve({}),
      },

      // Role Permissions services
      rolePermissions: {
        getAll: () => Promise.resolve({} as GetAllRolePermissionsResponse),
        getById: (rolePermissionId: number) => Promise.resolve({} as GetRolePermissionByIdResponse),
        create: (data: CreateRolePermissionRequest) => Promise.resolve({} as RolePermission),
        update: (rolePermissionId: number, data: Partial<UpdateRolePermissionRequest>) =>
          Promise.resolve({} as RolePermission),
        delete: (rolePermissionId: number) => Promise.resolve({}),
      },

      // Documents services
      documents: {
        convertToText: (file: File) => Promise.resolve({} as DocumentConversionResponse),
        getSupportedFormats: () => Promise.resolve({ formats: [] } as any),
      },

      // Careers services
      careers: {
        getAll: () => Promise.resolve({} as Career[]),
        getById: (careerId: number) => Promise.resolve({} as Career),
        create: (data: CreateCareerRequest) => Promise.resolve({} as Career),
        update: (careerId: number, data: Partial<UpdateCareerRequest>) => Promise.resolve({} as Career),
        delete: (careerId: number) => Promise.resolve({}),
      },

      // Career Skills services
      careerSkills: {
        getAll: () => Promise.resolve({} as CareerSkill[]),
        getById: (skillId: number) => Promise.resolve({} as CareerSkill),
        create: (data: CreateCareerSkillRequest) => Promise.resolve({} as CareerSkill),
        update: (skillId: number, data: Partial<UpdateCareerSkillRequest>) => Promise.resolve({} as CareerSkill),
        delete: (skillId: number) => Promise.resolve({}),
      },

      // Career Companies services
      careerCompanies: {
        getAll: () => Promise.resolve({} as CareerCompany[]),
        getById: (companyId: number) => Promise.resolve({} as CareerCompany),
        create: (data: CreateCareerCompanyRequest) => Promise.resolve({} as CareerCompany),
        update: (companyId: number, data: Partial<UpdateCareerCompanyRequest>) => Promise.resolve({} as CareerCompany),
        delete: (companyId: number) => Promise.resolve({}),
      },

      // In Demand Skills services
      inDemandSkills: {
        getAll: () => Promise.resolve({} as InDemandSkill[]),
        getById: (skillId: number) => Promise.resolve({} as InDemandSkill),
        create: (data: CreateInDemandSkillRequest) => Promise.resolve({} as InDemandSkill),
        update: (skillId: number, data: Partial<UpdateInDemandSkillRequest>) => Promise.resolve({} as InDemandSkill),
        delete: (skillId: number) => Promise.resolve({}),
      },

      // Recommendations services
      recommendations: {
        getAll: () => Promise.resolve({} as Recommendation[]),
        getById: (recommendationId: number) => Promise.resolve({} as RecommendationWithCareer),
        create: (data: CreateRecommendationRequest) => Promise.resolve({} as Recommendation),
        update: (recommendationId: number, data: Partial<UpdateRecommendationRequest>) =>
          Promise.resolve({} as Recommendation),
        delete: (recommendationId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as Recommendation[]),
      },

      // Job Market Trends services
      jobMarketTrends: {
        getAll: () => Promise.resolve({} as JobMarketTrendListResponse),
        getById: (trendId: number) => Promise.resolve({} as JobMarketTrendResponse),
        create: (data: CreateJobMarketTrendRequest) => Promise.resolve({} as JobMarketTrendResponse),
        update: (trendId: number, data: Partial<UpdateJobMarketTrendRequest>) =>
          Promise.resolve({} as JobMarketTrendResponse),
        delete: (trendId: number) => Promise.resolve({}),
        getByCareer: (careerId: number) => Promise.resolve({} as JobMarketTrendListResponse),
      },

      // Career Exploration Logs services
      careerExplorationLogs: {
        getAll: () => Promise.resolve({} as CareerExplorationLog[]),
        getById: (logId: number) => Promise.resolve({} as CareerExplorationLog),
        create: (data: CreateCareerExplorationLogRequest) => Promise.resolve({} as CareerExplorationLog),
        update: (logId: number, data: Partial<UpdateCareerExplorationLogRequest>) =>
          Promise.resolve({} as CareerExplorationLog),
        delete: (logId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as CareerExplorationLog[]),
      },

      // Career Guidance services
      careerGuidance: {
        getAll: () => Promise.resolve({} as CareerGuidanceListResponse),
        getById: (guidanceId: number) => Promise.resolve({} as CareerGuidanceResponse),
        create: (data: CreateCareerGuidanceRequest) => Promise.resolve({} as CareerGuidanceResponse),
        update: (guidanceId: number, data: Partial<UpdateCareerGuidanceRequest>) =>
          Promise.resolve({} as CareerGuidanceResponse),
        delete: (guidanceId: number) => Promise.resolve({}),
        getByUser: (userId: number) => Promise.resolve({} as CareerGuidanceListResponse),
      },

      // Gamification services
      gamification: {
        points: {
          get: (userId: number) =>
            Promise.resolve({
              user_id: userId,
              total_points: 0,
              current_streak: 0,
            } as UserPoints),
        },
        userStats: {
          get: (userId: number, days?: number) =>
            Promise.resolve({
              user_id: userId,
              total_points: 0,
              current_rank: 0,
              total_users: 0,
              weekly_points: 0,
              monthly_points: 0,
              yearly_points: 0,
              current_streak: 0,
              longest_streak: 0,
              badge_count: 0,
            } as UserStats),
        },
        streak: {
          get: (userId: number) =>
            Promise.resolve({
              user_id: userId,
              current_streak: 0,
              longest_streak: 0,
              last_activity_date: new Date().toISOString(),
            } as StreakInfo),
        },
        leaderboard: {
          get: (period: LeaderboardPeriod) =>
            Promise.resolve({
              period,
              entries: [],
              total_users: 0,
            } as LeaderboardResponse),
        },
        activities: {
          log: (data: LogActivityRequest) =>
            Promise.resolve({
              id: 0,
              user_id: 0,
              activity_type: data.activity_type,
              points_earned: 0,
              new_total_points: 0,
            } as LogActivityResponse),
          list: (userId: number) =>
            Promise.resolve({
              data: [],
              total: 0,
              page: 1,
              per_page: 10,
            } as ActivityLogListResponse),
          get: (activityId: number) =>
            Promise.resolve({
              id: activityId,
              user_id: 0,
              activity_type: 'module_complete',
              reference_id: 0,
              reference_type: 'learning_module',
              points_earned: 0,
            } as ActivityLog),
        },
      },

      // Chat services
      chat: {
        sessions: {
          getAll: () => Promise.resolve({} as ChatSessionsListResponse),
          getById: (sessionId: string) => Promise.resolve({} as ChatSession),
          create: (data: CreateChatSessionRequest) => Promise.resolve({} as ChatSession),
          update: (sessionId: string, data: Partial<UpdateChatSessionRequest>) => Promise.resolve({} as ChatSession),
          delete: (sessionId: string) => Promise.resolve({}),
          messages: {
            getAll: (sessionId: string) => Promise.resolve({} as ChatMessagesListResponse),
            create: (sessionId: string, data: CreateChatMessageRequest) => Promise.resolve({} as ChatMessage),
          },
        },
        messages: {
          getById: (messageId: string) => Promise.resolve({} as ChatMessage),
          update: (messageId: string, data: Partial<UpdateChatMessageRequest>) => Promise.resolve({} as ChatMessage),
          delete: (messageId: string) => Promise.resolve({}),
        },
      },

      // Health check
      health: {
        check: () => Promise.resolve({ status: 'ok' }),
      },
    };
  }

  // Real API services
  return {
    // Auth services
    auth: {
      login: (data: LoginRequest) => apiClient.post<LoginResponse>(API_ENDPOINTS.auth.login, data),
      register: (data: UserFormData) => apiClient.post<any>(API_ENDPOINTS.auth.register, data),
      getPermissions: () => apiClient.get<PermissionsResponse>(API_ENDPOINTS.auth.getPermissions),
    },

    // User services
    users: {
      getAll: () => apiClient.get<GetAllUsersResponse>(API_ENDPOINTS.users.list),
      getById: (userId: number) => apiClient.get<GetUserByIdResponse>(API_ENDPOINTS.users.get(userId)),
      create: (data: CreateUserRequest) => apiClient.post<User>(API_ENDPOINTS.users.create, data),
      update: (userId: number, data: Partial<UpdateUserRequest>) =>
        apiClient.put<User>(API_ENDPOINTS.users.update(userId), data),
      delete: (userId: number) => apiClient.delete(API_ENDPOINTS.users.delete(userId)),
    },

    // User Profile services
    userProfiles: {
      getAll: () => apiClient.get<GetAllUserProfilesResponse>(API_ENDPOINTS.userProfiles.list),
      getById: (profileId: number) =>
        apiClient.get<GetUserProfileByIdResponse>(API_ENDPOINTS.userProfiles.get(profileId)),
      create: (data: CreateUserProfileRequest) => apiClient.post<UserProfile>(API_ENDPOINTS.userProfiles.create, data),
      update: (profileId: number, data: Partial<UpdateUserProfileRequest>) =>
        apiClient.put<UserProfile>(API_ENDPOINTS.userProfiles.update(profileId), data),
      delete: (profileId: number) => apiClient.delete(API_ENDPOINTS.userProfiles.delete(profileId)),
      getByUser: (userId: number) =>
        apiClient.get<GetUserProfileByIdResponse>(API_ENDPOINTS.userProfiles.getByUser(userId)),
    },

    // Work Experience services
    workExperience: {
      getAll: () => apiClient.get<GetAllWorkExperienceResponse>(API_ENDPOINTS.workExperience.list),
      getById: (experienceId: number) =>
        apiClient.get<GetWorkExperienceByIdResponse>(API_ENDPOINTS.workExperience.get(experienceId)),
      create: (data: CreateWorkExperienceRequest) =>
        apiClient.post<WorkExperience>(API_ENDPOINTS.workExperience.create, data),
      update: (experienceId: number, data: Partial<UpdateWorkExperienceRequest>) =>
        apiClient.put<WorkExperience>(API_ENDPOINTS.workExperience.update(experienceId), data),
      delete: (experienceId: number) => apiClient.delete(API_ENDPOINTS.workExperience.delete(experienceId)),
      getByUser: (userId: number) =>
        apiClient.get<GetAllWorkExperienceResponse>(API_ENDPOINTS.workExperience.getByUser(userId)),
    },

    // User Skills services
    userSkills: {
      getAll: () => apiClient.get<GetAllUserSkillsResponse>(API_ENDPOINTS.userSkills.list),
      getById: (skillId: number) => apiClient.get<GetUserSkillByIdResponse>(API_ENDPOINTS.userSkills.get(skillId)),
      create: (data: CreateUserSkillRequest) => apiClient.post<UserSkill>(API_ENDPOINTS.userSkills.create, data),
      update: (skillId: number, data: Partial<UpdateUserSkillRequest>) =>
        apiClient.put<UserSkill>(API_ENDPOINTS.userSkills.update(skillId), data),
      delete: (skillId: number) => apiClient.delete(API_ENDPOINTS.userSkills.delete(skillId)),
      getByUser: (userId: number) =>
        apiClient.get<GetAllUserSkillsResponse>(API_ENDPOINTS.userSkills.getByUser(userId)),
    },

    // Skill Gaps services
    skillGaps: {
      getAll: () => apiClient.get<GetAllSkillGapsResponse>(API_ENDPOINTS.skillGaps.list),
      getById: (gapId: number) => apiClient.get<GetSkillGapByIdResponse>(API_ENDPOINTS.skillGaps.get(gapId)),
      create: (data: CreateSkillGapRequest) => apiClient.post<SkillGap>(API_ENDPOINTS.skillGaps.create, data),
      update: (gapId: number, data: Partial<UpdateSkillGapRequest>) =>
        apiClient.put<SkillGap>(API_ENDPOINTS.skillGaps.update(gapId), data),
      delete: (gapId: number) => apiClient.delete(API_ENDPOINTS.skillGaps.delete(gapId)),
      getByUser: (userId: number) => apiClient.get<GetAllSkillGapsResponse>(API_ENDPOINTS.skillGaps.getByUser(userId)),
      getByUserAndCareer: (userId: number, careerId: number) =>
        apiClient.get<GetAllSkillGapsResponse>(API_ENDPOINTS.skillGaps.getByUserAndCareer(userId, careerId)),
    },

    // Learning Guidance services
    learningGuidance: {
      getAll: () => apiClient.get<LearningGuidanceListResponse>(API_ENDPOINTS.learningGuidance.list),
      getById: (guidanceId: number) =>
        apiClient.get<LearningGuidanceResponse>(API_ENDPOINTS.learningGuidance.get(guidanceId)),
      create: (data: CreateLearningGuidanceRequest) =>
        apiClient.post<LearningGuidanceResponse>(API_ENDPOINTS.learningGuidance.create, data),
      update: (guidanceId: number, data: Partial<UpdateLearningGuidanceRequest>) =>
        apiClient.put<LearningGuidanceResponse>(API_ENDPOINTS.learningGuidance.update(guidanceId), data),
      delete: (guidanceId: number) => apiClient.delete(API_ENDPOINTS.learningGuidance.delete(guidanceId)),
      getByUser: (userId: number) =>
        apiClient.get<LearningGuidanceListResponse>(API_ENDPOINTS.learningGuidance.getByUser(userId)),
      getByStatus: (statusFilter: string) =>
        apiClient.get<LearningGuidanceListResponse>(API_ENDPOINTS.learningGuidance.getByStatus(statusFilter)),
      getWithModulesAll: () =>
        apiClient.get<GuidanceWithLearningModules>(API_ENDPOINTS.learningGuidance.getWithModulesAll),
      getWithModulesById: (guidanceId: number) =>
        apiClient.get<GuidanceWithLearningModule>(API_ENDPOINTS.learningGuidance.getWithModulesById(guidanceId)),
    },

    // Learning Modules services
    learningModules: {
      getAll: () => apiClient.get<GetAllLearningModulesResponse>(API_ENDPOINTS.learningModules.list),
      getById: (moduleId: number) =>
        apiClient.get<GetLearningModuleByIdResponse>(API_ENDPOINTS.learningModules.get(moduleId)),
      create: (data: CreateLearningModuleRequest) =>
        apiClient.post<LearningModule>(API_ENDPOINTS.learningModules.create, data),
      update: (moduleId: number, data: Partial<UpdateLearningModuleRequest>) =>
        apiClient.put<LearningModule>(API_ENDPOINTS.learningModules.update(moduleId), data),
      delete: (moduleId: number) => apiClient.delete(API_ENDPOINTS.learningModules.delete(moduleId)),
    },

    // Flashcards services
    flashcards: {
      getAll: () => apiClient.get<FlashcardsListResponse>(API_ENDPOINTS.flashcards.list),
      getById: (flashcardId: number) => apiClient.get<Flashcard>(API_ENDPOINTS.flashcards.get(flashcardId)),
      create: (data: CreateFlashcardRequest) => apiClient.post<Flashcard>(API_ENDPOINTS.flashcards.create, data),
      update: (flashcardId: number, data: Partial<CreateFlashcardRequest>) =>
        apiClient.put<Flashcard>(API_ENDPOINTS.flashcards.update(flashcardId), data),
      delete: (flashcardId: number) => apiClient.delete(API_ENDPOINTS.flashcards.delete(flashcardId)),
      getByModule: (moduleId: number) =>
        apiClient.get<FlashcardsListResponse>(API_ENDPOINTS.flashcards.getByModule(moduleId)),
      items: {
        getAll: (flashcardId: number) =>
          apiClient.get<FlashcardItemsListResponse>(API_ENDPOINTS.flashcards.items.list(flashcardId)),
        getById: (flashcardId: number, itemId: number) =>
          apiClient.get<FlashcardItem>(API_ENDPOINTS.flashcards.items.get(flashcardId, itemId)),
        create: (flashcardId: number, data: CreateFlashcardItemRequest) =>
          apiClient.post<FlashcardItem>(API_ENDPOINTS.flashcards.items.create(flashcardId), data),
        update: (flashcardId: number, itemId: number, data: Partial<CreateFlashcardItemRequest>) =>
          apiClient.put<FlashcardItem>(API_ENDPOINTS.flashcards.items.update(flashcardId, itemId), data),
        delete: (flashcardId: number, itemId: number) =>
          apiClient.delete(API_ENDPOINTS.flashcards.items.delete(flashcardId, itemId)),
      },
    },

    // Quizzes services
    quizzes: {
      getAll: () => apiClient.get<QuizzesListResponse>(API_ENDPOINTS.quizzes.list),
      getById: (quizId: number) => apiClient.get<Quiz>(API_ENDPOINTS.quizzes.get(quizId)),
      create: (data: CreateQuizRequest) => apiClient.post<Quiz>(API_ENDPOINTS.quizzes.create, data),
      update: (quizId: number, data: Partial<CreateQuizRequest>) =>
        apiClient.put<Quiz>(API_ENDPOINTS.quizzes.update(quizId), data),
      delete: (quizId: number) => apiClient.delete(API_ENDPOINTS.quizzes.delete(quizId)),
      getByModule: (moduleId: number) =>
        apiClient.get<QuizzesListResponse>(API_ENDPOINTS.quizzes.getByModule(moduleId)),
      questions: {
        getAll: (quizId: number) =>
          apiClient.get<QuizQuestionsListResponse>(API_ENDPOINTS.quizzes.questions.list(quizId)),
        getById: (quizId: number, questionId: number) =>
          apiClient.get<QuizQuestion>(API_ENDPOINTS.quizzes.questions.get(quizId, questionId)),
        create: (quizId: number, data: CreateQuizQuestionRequest) =>
          apiClient.post<QuizQuestion>(API_ENDPOINTS.quizzes.questions.create(quizId), data),
        update: (quizId: number, questionId: number, data: Partial<CreateQuizQuestionRequest>) =>
          apiClient.put<QuizQuestion>(API_ENDPOINTS.quizzes.questions.update(quizId, questionId), data),
        delete: (quizId: number, questionId: number) =>
          apiClient.delete(API_ENDPOINTS.quizzes.questions.delete(quizId, questionId)),
      },
    },

    // Skills services
    skills: {
      getAll: () => apiClient.get<GetAllSkillsResponse>(API_ENDPOINTS.skills.list),
      getById: (skillId: string) => apiClient.get<SkillDetail>(API_ENDPOINTS.skills.get(skillId)),
      create: (data: CreateSkillRequest) => apiClient.post<SkillDetail>(API_ENDPOINTS.skills.create, data),
      update: (skillId: string, data: Partial<UpdateSkillRequest>) =>
        apiClient.put<SkillDetail>(API_ENDPOINTS.skills.update(skillId), data),
      delete: (skillId: string) => apiClient.delete(API_ENDPOINTS.skills.delete(skillId)),
    },

    // Roles services
    roles: {
      getAll: () => apiClient.get<GetAllRolesResponse>(API_ENDPOINTS.roles.list),
      getById: (roleId: number) => apiClient.get<GetRoleByIdResponse>(API_ENDPOINTS.roles.get(roleId)),
      create: (data: CreateRoleRequest) => apiClient.post<Role>(API_ENDPOINTS.roles.create, data),
      update: (roleId: number, data: Partial<UpdateRoleRequest>) =>
        apiClient.put<Role>(API_ENDPOINTS.roles.update(roleId), data),
      delete: (roleId: number) => apiClient.delete(API_ENDPOINTS.roles.delete(roleId)),
    },

    // Permissions services
    permissions: {
      getAll: () => apiClient.get<GetAllPermissionsResponse>(API_ENDPOINTS.permissions.list),
      getById: (permissionId: number) =>
        apiClient.get<GetPermissionByIdResponse>(API_ENDPOINTS.permissions.get(permissionId)),
      create: (data: CreatePermissionRequest) => apiClient.post<Permission>(API_ENDPOINTS.permissions.create, data),
      update: (permissionId: number, data: Partial<UpdatePermissionRequest>) =>
        apiClient.put<Permission>(API_ENDPOINTS.permissions.update(permissionId), data),
      delete: (permissionId: number) => apiClient.delete(API_ENDPOINTS.permissions.delete(permissionId)),
    },

    // Role Permissions services
    rolePermissions: {
      getAll: () => apiClient.get<GetAllRolePermissionsResponse>(API_ENDPOINTS.rolePermissions.list),
      getById: (rolePermissionId: number) =>
        apiClient.get<GetRolePermissionByIdResponse>(API_ENDPOINTS.rolePermissions.get(rolePermissionId)),
      create: (data: CreateRolePermissionRequest) =>
        apiClient.post<RolePermission>(API_ENDPOINTS.rolePermissions.create, data),
      update: (rolePermissionId: number, data: Partial<UpdateRolePermissionRequest>) =>
        apiClient.put<RolePermission>(API_ENDPOINTS.rolePermissions.update(rolePermissionId), data),
      delete: (rolePermissionId: number) => apiClient.delete(API_ENDPOINTS.rolePermissions.delete(rolePermissionId)),
    },

    // Documents services
    documents: {
      convertToText: (file: File) => {
        const formData = new FormData();
        formData.append('file', file);
        return apiClient.upload<DocumentConversionResponse>(API_ENDPOINTS.documents.convertToText, formData);
      },
      getSupportedFormats: () => apiClient.get<{ formats: string[] }>(API_ENDPOINTS.documents.supportedFormats),
    },

    // Careers services
    careers: {
      getAll: () => apiClient.get<Career[]>(API_ENDPOINTS.careers.list),
      getById: (careerId: number) => apiClient.get<Career>(API_ENDPOINTS.careers.get(careerId)),
      create: (data: CreateCareerRequest) =>
        apiClient.post<Career>(API_ENDPOINTS.careers.create, data),
      update: (careerId: number, data: Partial<UpdateCareerRequest>) =>
        apiClient.put<Career>(API_ENDPOINTS.careers.update(careerId), data),
      delete: (careerId: number) => apiClient.delete(API_ENDPOINTS.careers.delete(careerId)),
    },

    // Career Skills services
    careerSkills: {
      getAll: () => apiClient.get<CareerSkill[]>(API_ENDPOINTS.careerSkills.list),
      getById: (skillId: number) =>
        apiClient.get<CareerSkill>(API_ENDPOINTS.careerSkills.get(skillId)),
      create: (data: CreateCareerSkillRequest) =>
        apiClient.post<CareerSkill>(API_ENDPOINTS.careerSkills.create, data),
      update: (skillId: number, data: Partial<UpdateCareerSkillRequest>) =>
        apiClient.put<CareerSkill>(API_ENDPOINTS.careerSkills.update(skillId), data),
      delete: (skillId: number) =>
        apiClient.delete(API_ENDPOINTS.careerSkills.delete(skillId)),
    },

    // Career Companies services
    careerCompanies: {
      getAll: () => apiClient.get<CareerCompany[]>(API_ENDPOINTS.careerCompanies.list),
      getById: (companyId: number) =>
        apiClient.get<CareerCompany>(API_ENDPOINTS.careerCompanies.get(companyId)),
      create: (data: CreateCareerCompanyRequest) =>
        apiClient.post<CareerCompany>(API_ENDPOINTS.careerCompanies.create, data),
      update: (companyId: number, data: Partial<UpdateCareerCompanyRequest>) =>
        apiClient.put<CareerCompany>(API_ENDPOINTS.careerCompanies.update(companyId), data),
      delete: (companyId: number) =>
        apiClient.delete(API_ENDPOINTS.careerCompanies.delete(companyId)),
    },

    // In Demand Skills services
    inDemandSkills: {
      getAll: () => apiClient.get<InDemandSkill[]>(API_ENDPOINTS.inDemandSkills.list),
      getById: (skillId: number) =>
        apiClient.get<InDemandSkill>(API_ENDPOINTS.inDemandSkills.get(skillId)),
      create: (data: CreateInDemandSkillRequest) =>
        apiClient.post<InDemandSkill>(API_ENDPOINTS.inDemandSkills.create, data),
      update: (skillId: number, data: Partial<UpdateInDemandSkillRequest>) =>
        apiClient.put<InDemandSkill>(API_ENDPOINTS.inDemandSkills.update(skillId), data),
      delete: (skillId: number) =>
        apiClient.delete(API_ENDPOINTS.inDemandSkills.delete(skillId)),
    },

    // Recommendations services
    recommendations: {
      getAll: () => apiClient.get<Recommendation[]>(API_ENDPOINTS.recommendations.list),
      getById: (recommendationId: number) =>
        apiClient.get<RecommendationWithCareer>(
          API_ENDPOINTS.recommendations.get(recommendationId)
        ),
      create: (data: CreateRecommendationRequest) =>
        apiClient.post<Recommendation>(API_ENDPOINTS.recommendations.create, data),
      update: (recommendationId: number, data: Partial<UpdateRecommendationRequest>) =>
        apiClient.put<Recommendation>(
          API_ENDPOINTS.recommendations.update(recommendationId),
          data
        ),
      delete: (recommendationId: number) =>
        apiClient.delete(API_ENDPOINTS.recommendations.delete(recommendationId)),
      getByUser: (userId: number) =>
        apiClient.get<Recommendation[]>(API_ENDPOINTS.recommendations.getByUser(userId)),
    },

    // Job Market Trends services
    jobMarketTrends: {
      getAll: () => apiClient.get<JobMarketTrendListResponse>(API_ENDPOINTS.jobMarketTrends.list),
      getById: (trendId: number) =>
        apiClient.get<JobMarketTrendResponse>(API_ENDPOINTS.jobMarketTrends.get(trendId)),
      create: (data: CreateJobMarketTrendRequest) =>
        apiClient.post<JobMarketTrendResponse>(API_ENDPOINTS.jobMarketTrends.create, data),
      update: (trendId: number, data: Partial<UpdateJobMarketTrendRequest>) =>
        apiClient.put<JobMarketTrendResponse>(
          API_ENDPOINTS.jobMarketTrends.update(trendId),
          data
        ),
      delete: (trendId: number) =>
        apiClient.delete(API_ENDPOINTS.jobMarketTrends.delete(trendId)),
      getByCareer: (careerId: number) =>
        apiClient.get<JobMarketTrendListResponse>(
          API_ENDPOINTS.jobMarketTrends.getByCareer(careerId)
        ),
    },

    // Career Exploration Logs services
    careerExplorationLogs: {
      getAll: () =>
        apiClient.get<CareerExplorationLog[]>(API_ENDPOINTS.careerExplorationLogs.list),
      getById: (logId: number) =>
        apiClient.get<CareerExplorationLog>(API_ENDPOINTS.careerExplorationLogs.get(logId)),
      create: (data: CreateCareerExplorationLogRequest) =>
        apiClient.post<CareerExplorationLog>(
          API_ENDPOINTS.careerExplorationLogs.create,
          data
        ),
      update: (logId: number, data: Partial<UpdateCareerExplorationLogRequest>) =>
        apiClient.put<CareerExplorationLog>(
          API_ENDPOINTS.careerExplorationLogs.update(logId),
          data
        ),
      delete: (logId: number) =>
        apiClient.delete(API_ENDPOINTS.careerExplorationLogs.delete(logId)),
      getByUser: (userId: number) =>
        apiClient.get<CareerExplorationLog[]>(
          API_ENDPOINTS.careerExplorationLogs.getByUser(userId)
        ),
    },

    // Career Guidance services
    careerGuidance: {
      getAll: () =>
        apiClient.get<CareerGuidanceListResponse>(API_ENDPOINTS.careerGuidance.list),
      getById: (guidanceId: number) =>
        apiClient.get<CareerGuidanceResponse>(API_ENDPOINTS.careerGuidance.get(guidanceId)),
      create: (data: CreateCareerGuidanceRequest) =>
        apiClient.post<CareerGuidanceResponse>(API_ENDPOINTS.careerGuidance.create, data),
      update: (guidanceId: number, data: Partial<UpdateCareerGuidanceRequest>) =>
        apiClient.put<CareerGuidanceResponse>(
          API_ENDPOINTS.careerGuidance.update(guidanceId),
          data
        ),
      delete: (guidanceId: number) =>
        apiClient.delete(API_ENDPOINTS.careerGuidance.delete(guidanceId)),
      getByUser: (userId: number) =>
        apiClient.get<CareerGuidanceListResponse>(
          API_ENDPOINTS.careerGuidance.getByUser(userId)
        ),
    },

    // Gamification services
    gamification: {
      points: {
        get: (userId: number) =>
          apiClient.get<UserPoints>(API_ENDPOINTS.gamification.points.get(userId)),
      },
      userStats: {
        get: (userId: number, days?: number) =>
          apiClient.get<UserStats>(API_ENDPOINTS.gamification.userStats.get(userId, days)),
      },
      streak: {
        get: (userId: number) =>
          apiClient.get<StreakInfo>(API_ENDPOINTS.gamification.streak.get(userId)),
      },
      leaderboard: {
        get: (period: LeaderboardPeriod) =>
          apiClient.get<LeaderboardResponse>(API_ENDPOINTS.gamification.leaderboard.get(period)),
      },
      activities: {
        log: (data: LogActivityRequest) =>
          apiClient.post<LogActivityResponse>(API_ENDPOINTS.gamification.activities.log, data),
        list: (userId: number) =>
          apiClient.get<ActivityLogListResponse>(API_ENDPOINTS.gamification.activities.list(userId)),
        get: (activityId: number) =>
          apiClient.get<ActivityLog>(API_ENDPOINTS.gamification.activities.get(activityId)),
      },
    },

    // Chat services
    chat: {
      sessions: {
        getAll: () => apiClient.get<ChatSessionsListResponse>(API_ENDPOINTS.chat.sessions.list),
        getById: (sessionId: string) => apiClient.get<ChatSession>(API_ENDPOINTS.chat.sessions.get(sessionId)),
        create: (data: CreateChatSessionRequest) =>
          apiClient.post<ChatSession>(API_ENDPOINTS.chat.sessions.create, data),
        update: (sessionId: string, data: Partial<UpdateChatSessionRequest>) =>
          apiClient.put<ChatSession>(API_ENDPOINTS.chat.sessions.update(sessionId), data),
        delete: (sessionId: string) => apiClient.delete(API_ENDPOINTS.chat.sessions.delete(sessionId)),
        messages: {
          getAll: (sessionId: string) =>
            apiClient.get<ChatMessagesListResponse>(API_ENDPOINTS.chat.sessions.messages.list(sessionId)),
          create: (sessionId: string, data: CreateChatMessageRequest) =>
            apiClient.post<ChatMessage>(API_ENDPOINTS.chat.sessions.messages.create(sessionId), data),
        },
      },
      messages: {
        getById: (messageId: string) => apiClient.get<ChatMessage>(API_ENDPOINTS.chat.messages.get(messageId)),
        update: (messageId: string, data: Partial<UpdateChatMessageRequest>) =>
          apiClient.put<ChatMessage>(API_ENDPOINTS.chat.messages.update(messageId), data),
        delete: (messageId: string) => apiClient.delete(API_ENDPOINTS.chat.messages.delete(messageId)),
      },
    },

    // Health check
    health: {
      check: () => apiClient.get<{ status: string }>(API_ENDPOINTS.health),
    },
  };
};

const services = createServices();

// API Interface type
interface ApiInterface {
  auth: typeof services.auth;
  users: typeof services.users;
  userProfiles: typeof services.userProfiles;
  workExperience: typeof services.workExperience;
  userSkills: typeof services.userSkills;
  skillGaps: typeof services.skillGaps;
  learningGuidance: typeof services.learningGuidance;
  learningModules: typeof services.learningModules;
  flashcards: typeof services.flashcards;
  quizzes: typeof services.quizzes;
  skills: typeof services.skills;
  roles: typeof services.roles;
  permissions: typeof services.permissions;
  rolePermissions: typeof services.rolePermissions;
  documents: typeof services.documents;
  careers: typeof services.careers;
  careerSkills: typeof services.careerSkills;
  careerCompanies: typeof services.careerCompanies;
  inDemandSkills: typeof services.inDemandSkills;
  recommendations: typeof services.recommendations;
  jobMarketTrends: typeof services.jobMarketTrends;
  careerExplorationLogs: typeof services.careerExplorationLogs;
  careerGuidance: typeof services.careerGuidance;
  gamification: typeof services.gamification;
  chat: typeof services.chat;
  health: typeof services.health;
}

// Export the API service
export const api: ApiInterface = services;

// Re-export for backward compatibility
export { apiClient };
