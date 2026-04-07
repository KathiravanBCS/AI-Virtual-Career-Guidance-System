export { default as DashboardPage } from './pages/DashboardPage';
export { useGetDashboardData } from './api/useGetDashboardData';
export { useGetDashboardSummaryMe } from './api/useGetDashboardSummaryMe';
export type { UserStats, QuizScore, RecentActivity, LearningPath, AINudge, QuickAction, DashboardCard } from './types';
export type {
	DashboardSummaryResponse,
	DashboardSummaryUser,
	DashboardKpis,
	DashboardInsights,
	DashboardQuickAction,
	DashboardActivity,
} from './types';
