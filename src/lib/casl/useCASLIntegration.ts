/**
 * CASL Integration Hook
 * Handles permission fetching and ability updates
 */

import { api } from '@/lib/api';

import { resetAbility, updateAbility } from './ability';
import type { CASLRule, PermissionsResponse } from './types';

/**
 * Fetch permissions from backend and update ability
 */
export async function loadPermissionsFromBackend(): Promise<PermissionsResponse | null> {
  try {
    console.log('[CASL] Starting to load permissions from backend...');
    const response = await api.auth.getPermissions();
    console.log('[CASL] Permission response received:', response);

    if (!response || !response.rules) {
      console.warn('[CASL] No permissions received from backend', response);
      return null;
    }

    // Update ability with rules from backend
    console.log('[CASL] Updating ability with rules:', response.rules);
    updateAbility(response.rules);

    console.log('[CASL] Permissions loaded successfully:', {
      user_id: response.user_id,
      role: response.role,
      rules_count: response.rules.length,
    });

    return response;
  } catch (error) {
    console.error('[CASL] Failed to load permissions:', error);
    // Use empty rules on error
    resetAbility();
    return null;
  }
}

/**
 * Hook for CASL permission management
 */
export function useCASLIntegration() {
  return {
    /**
     * Load and apply permissions
     */
    loadPermissions: async () => {
      return await loadPermissionsFromBackend();
    },

    /**
     * Clear permissions
     */
    clearPermissions: () => {
      resetAbility();
    },

    /**
     * Reload permissions
     */
    reloadPermissions: async () => {
      console.log('[CASL] Reloading permissions...');
      return await loadPermissionsFromBackend();
    },
  };
}
