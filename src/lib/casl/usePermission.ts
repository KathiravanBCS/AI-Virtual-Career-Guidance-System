/**
 * usePermission Composable
 * Helper hook for permission checks in components
 */

import { ability, can, cannot } from './ability';
import { Action, Subject } from './types';

export function usePermission() {
  return {
    // Raw ability for advanced usage
    ability,

    // Basic permission check
    can: (action: string, subject: string) => can(action, subject),
    cannot: (action: string, subject: string) => cannot(action, subject),

    // CRUD operation helpers
    canCreate: (subject: string) => can(Action.CREATE, subject),
    canRead: (subject: string) => can(Action.READ, subject),
    canUpdate: (subject: string) => can(Action.UPDATE, subject),
    canDelete: (subject: string) => can(Action.DELETE, subject),
    canExport: (subject: string) => can(Action.EXPORT, subject),
    canManage: (subject: string) => can(Action.MANAGE, subject),

    // Subject-specific helpers
    canViewDashboard: () => can(Action.READ, Subject.DASHBOARD),
    canManageAssessments: () => can(Action.CREATE, Subject.ASSESSMENT),
    canViewCareers: () => can(Action.READ, Subject.CAREER),
    canViewRecommendations: () => can(Action.READ, Subject.RECOMMENDATION),
    canViewLearningPaths: () => can(Action.READ, Subject.LEARNING_PATH),
    canManageUsers: () => can(Action.CREATE, Subject.USER),
    canManageRoles: () => can(Action.MANAGE, Subject.ROLE),
    canViewAnalytics: () => can(Action.READ, Subject.ANALYTICS),
    canViewFinancial: () => can(Action.READ, Subject.FINANCIAL),
    canViewPayroll: () => can(Action.READ, Subject.PAYROLL),
    canViewInvoices: () => can(Action.READ, Subject.INVOICE),
    canManageDocuments: () => can(Action.CREATE, Subject.DOCUMENT),
    canManageSkills: () => can(Action.CREATE, Subject.SKILL),
    canViewCertifications: () => can(Action.READ, Subject.CERTIFICATION),

    // Condition-based checks (for own records)
    canViewRecord: (subject: string, record?: any) => ability.can(Action.READ, subject, record),
    canUpdateRecord: (subject: string, record?: any) => ability.can(Action.UPDATE, subject, record),
    canDeleteRecord: (subject: string, record?: any) => ability.can(Action.DELETE, subject, record),
  };
}
