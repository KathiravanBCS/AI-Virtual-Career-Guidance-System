import { AbilityBuilder, createMongoAbility } from '@casl/ability';

export type Subject =
  | 'GuidanceSession'
  | 'Assessment'
  | 'LearningResource'
  | 'Career'
  | 'Recommendation'
  | 'Settings'
  | 'All';

export type Actions = 'create' | 'read' | 'update' | 'delete' | 'manage';

export interface UserRole {
  role: 'admin' | 'mentor' | 'user' | 'viewer';
  uid: string;
  email?: string;
}

export function defineAbility(user: UserRole | null) {
  const { can, cannot, build } = new AbilityBuilder(createMongoAbility);

  if (!user) {
    // Guest user - no permissions
    return build();
  }

  if (user.role === 'admin') {
    // Admins can do everything
    can('manage', 'All');
  } else if (user.role === 'mentor') {
    // Mentors can manage guidance sessions and provide recommendations
    can('create', 'GuidanceSession');
    can('read', 'GuidanceSession');
    can('update', 'GuidanceSession');
    can('delete', 'GuidanceSession');

    can('create', 'Recommendation');
    can('read', 'Recommendation');
    can('update', 'Recommendation');
    can('delete', 'Recommendation');

    can('read', 'Assessment');
    can('read', 'LearningResource');
    can('read', 'Career');
    can('read', 'Settings');
  } else if (user.role === 'user') {
    // Regular users can create and manage their own guidance sessions
    can('create', 'GuidanceSession');
    can('read', 'GuidanceSession');
    can('update', 'GuidanceSession', { userId: user.uid });
    can('delete', 'GuidanceSession', { userId: user.uid });
    cannot('delete', 'GuidanceSession', { isCompleted: true });

    can('read', 'Assessment');
    can('read', 'LearningResource');
    can('read', 'Career');
    can('read', 'Recommendation');
  } else if (user.role === 'viewer') {
    // Viewers can only read
    can('read', 'GuidanceSession');
    can('read', 'Assessment');
    can('read', 'LearningResource');
    can('read', 'Career');
    can('read', 'Recommendation');
  }

  return build();
}
