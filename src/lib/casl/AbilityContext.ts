import { createContext } from 'react';

import type { MongoAbility } from '@casl/ability';

import type { AppAbility } from './ability';

export const AbilityContext = createContext<AppAbility | null>(null);

AbilityContext.displayName = 'AbilityContext';
