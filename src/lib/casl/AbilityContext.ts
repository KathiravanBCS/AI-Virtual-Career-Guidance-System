import { createContext } from 'react';

import type { MongoAbility } from '@casl/ability';

import type { Actions, Subject } from './ability';

export const AbilityContext = createContext<MongoAbility<[Actions, Subject]> | null>(null);

AbilityContext.displayName = 'AbilityContext';
