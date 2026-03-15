/**
 * Careers API Hooks Index
 * Export all React Query hooks for the careers module
 */

// Careers hooks
export {
  useGetCareers,
  useGetCareer,
  useCreateCareer,
  useUpdateCareer,
  useDeleteCareer,
} from './useCareers';

// Career Skills hooks
export {
  useGetCareerSkills,
  useGetCareerSkill,
  useCreateCareerSkill,
  useUpdateCareerSkill,
  useDeleteCareerSkill,
} from './useCareerSkills';

// Career Companies hooks
export {
  useGetCareerCompanies,
  useGetCareerCompany,
  useCreateCareerCompany,
  useUpdateCareerCompany,
  useDeleteCareerCompany,
} from './useCareerCompanies';

// In Demand Skills hooks
export {
  useGetInDemandSkills,
  useGetInDemandSkill,
  useCreateInDemandSkill,
  useUpdateInDemandSkill,
  useDeleteInDemandSkill,
} from './useInDemandSkills';

// Recommendations hooks
export {
  useGetRecommendations,
  useGetRecommendation,
  useGetRecommendationsByUser,
  useCreateRecommendation,
  useUpdateRecommendation,
  useDeleteRecommendation,
} from './useRecommendations';

// Job Market Trends hooks
export {
  useGetJobMarketTrends,
  useGetJobMarketTrend,
  useGetTrendsByCareer,
  useCreateJobMarketTrend,
  useUpdateJobMarketTrend,
  useDeleteJobMarketTrend,
} from './useJobMarketTrends';

// Career Exploration Logs hooks
export {
  useGetCareerExplorationLogs,
  useGetCareerExplorationLog,
  useGetLogsByUser,
  useCreateCareerExplorationLog,
  useUpdateCareerExplorationLog,
  useDeleteCareerExplorationLog,
} from './useCareerExplorationLogs';

// Career Guidance hooks
export {
  useGetCareerGuidances,
  useGetCareerGuidance,
  useGetCareerGuidanceByUser,
  useCreateCareerGuidance,
  useUpdateCareerGuidance,
  useDeleteCareerGuidance,
} from './useCareerGuidance';

// AI Career Guidance hooks
export {
  useGenerateAICareerGuidance,
  useGenerateCareerSkills,
  useGenerateCompanyRecommendations,
  useGenerateCareerRecommendations,
  useGenerateJobMarketTrends,
} from './useAICareerGuidance';

// Job Recommendations hooks
export {
  useJobRecommendations,
  type Job,
  type JobSearchResponse,
  type JobApplyOption,
  type JobHighlights,
} from './useJobRecommendations';
