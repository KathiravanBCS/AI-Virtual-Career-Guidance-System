/**
 * useNavigation Hook
 * Provides filtered navigation items based on user permissions
 */

import { useMemo } from 'react';

import { filterNavByPermissions, navData } from '@/components/Navigation/NavData';
import { usePermission } from '@/lib/casl/usePermission';

export function useNavigation() {
  const { can } = usePermission();

  // Filter nav items based on user permissions
  const filteredNav = useMemo(() => {
    return filterNavByPermissions(navData, (action, subject) => can(action, subject));
  }, [can]);

  return {
    // All navigation items (unfiltered)
    allNav: navData,

    // Filtered navigation items based on permissions
    filteredNav,

    // Check if a specific item is visible
    isItemVisible: (itemLabel: string) => {
      return filteredNav.some((item) => item.label === itemLabel);
    },

    // Get a specific item by label
    getItem: (itemLabel: string) => {
      return filteredNav.find((item) => item.label === itemLabel);
    },

    // Get visible submenu items for a parent
    getVisibleLinks: (parentLabel: string) => {
      const parent = filteredNav.find((item) => item.label === parentLabel);
      return parent?.links || [];
    },
  };
}
