import { ReactNode } from 'react';

import { Alert } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

import type { Actions, Subject } from '@/lib/casl/ability';
import { useAbility } from '@/lib/casl/useAbility';

interface ProtectedActionProps {
  action: Actions;
  subject: Subject;
  children: ReactNode;
  fallback?: ReactNode;
}

export function ProtectedAction({ action, subject, children, fallback }: ProtectedActionProps) {
  const ability = useAbility();

  // If user doesn't have permission, show fallback or nothing
  if (!ability.can(action, subject)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <Alert icon={<IconAlertCircle size={16} />} color="yellow">
        You don't have permission to {action} {subject}
      </Alert>
    );
  }

  // Return children directly if user has permission
  return <>{children}</>;
}

/**
 * Example Usage:
 *
 * <ProtectedAction action="delete" subject="GuidanceSession">
 *   <Button color="red">Delete Session</Button>
 * </ProtectedAction>
 *
 * // With fallback
 * <ProtectedAction
 *   action="manage"
 *   subject="Settings"
 *   fallback={<Text c="dimmed">Admin access required</Text>}
 * >
 *   <Button>Open Settings</Button>
 * </ProtectedAction>
 */
