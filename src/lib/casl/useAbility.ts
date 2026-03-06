import { useContext } from 'react';

import { AbilityContext } from './AbilityContext';

export function useAbility() {
  const context = useContext(AbilityContext);
  if (!context) {
    throw new Error('useAbility must be used within AbilityContext provider');
  }
  return context;
}
