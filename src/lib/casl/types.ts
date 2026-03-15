/**
 * CASL Permission Types
 * Backend-compatible types for role-based access control
 */

export interface CASLRule {
  action: string | string[];
  subject: string;
  conditions?: Record<string, any>;
  fields?: string | string[];
  inverted?: boolean;
}

export interface PermissionsResponse {
  user_id: number;
  role: string;
  rules: CASLRule[];
}

export type AppAbility = ReturnType<typeof import('@casl/ability').createMongoAbility>;

// Role enum for type safety
export enum RoleType {
  SUPERADMIN = 'superadmin',
  ADMIN = 'admin',
  MANAGER = 'manager',
  CAREER_COUNSELOR = 'career_counselor',
  USER = 'user',
}

// Subject enum for common resources
export enum Subject {
  DASHBOARD = 'Dashboard',
  ASSESSMENT = 'Assessment',
  CAREER = 'Career',
  RECOMMENDATION = 'Recommendation',
  LEARNING_PATH = 'LearningPath',
  USER = 'User',
  ROLE = 'Role',
  ROLEPERMISSION = 'RolePermission',
  ANALYTICS = 'Analytics',
  FINANCIAL = 'Financial',
  PAYROLL = 'Payroll',
  INVOICE = 'Invoice',
  DOCUMENT = 'Document',
  SKILL = 'Skill',
  CERTIFICATION = 'Certification',
  CHAT = 'chat',
}

// Action enum for common operations
export enum Action {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXPORT = 'export',
  MANAGE = 'manage',
}
