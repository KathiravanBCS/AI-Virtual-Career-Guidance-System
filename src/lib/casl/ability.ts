/**
 * CASL Ability Instance
 * Creates and manages user permissions using CASL
 */

import { createMongoAbility } from '@casl/ability';

import type { CASLRule } from './types';

export type AppAbility = ReturnType<typeof createMongoAbility>;

/**
 * Create a new ability instance with optional rules
 */
export const createAppAbility = (rules: any[] = []): AppAbility => {
  return createMongoAbility(rules);
};

// Global ability instance
export const ability = createAppAbility();

/**
 * Update ability rules
 */
export const updateAbility = (rules: any[]): void => {
  ability.update(rules as any);
};

/**
 * Reset ability to empty rules
 */
export const resetAbility = (): void => {
  ability.update([]);
};

/**
 * Check if user can perform action on subject
 */
export const can = (action: string, subject: string): boolean => {
  return ability.can(action, subject);
};

/**
 * Check if user cannot perform action on subject
 */
export const cannot = (action: string, subject: string): boolean => {
  return ability.cannot(action, subject);
};
