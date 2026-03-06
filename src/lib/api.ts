import type { LoginRequest, LoginResponse, UserFormData } from '@/features/auth/types';
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
  CreateSkillRequest,
  GetAllSkillsResponse,
  SkillDetail,
  SkillListItem,
  UpdateSkillRequest,
} from '@/features/master/masterSkills/types';
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

      // Skills services
      skills: {
        getAll: () => Promise.resolve({} as GetAllSkillsResponse),
        getById: (skillId: string) => Promise.resolve({} as SkillDetail),
        create: (data: CreateSkillRequest) => Promise.resolve({} as SkillDetail),
        update: (skillId: string, data: Partial<UpdateSkillRequest>) => Promise.resolve({} as SkillDetail),
        delete: (skillId: string) => Promise.resolve({}),
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

    // Skills services
    skills: {
      getAll: () => apiClient.get<GetAllSkillsResponse>(API_ENDPOINTS.skills.list),
      getById: (skillId: string) => apiClient.get<SkillDetail>(API_ENDPOINTS.skills.get(skillId)),
      create: (data: CreateSkillRequest) => apiClient.post<SkillDetail>(API_ENDPOINTS.skills.create, data),
      update: (skillId: string, data: Partial<UpdateSkillRequest>) =>
        apiClient.put<SkillDetail>(API_ENDPOINTS.skills.update(skillId), data),
      delete: (skillId: string) => apiClient.delete(API_ENDPOINTS.skills.delete(skillId)),
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
  skills: typeof services.skills;
  health: typeof services.health;
}

// Export the API service
export const api: ApiInterface = services;

// Re-export for backward compatibility
export { apiClient };
