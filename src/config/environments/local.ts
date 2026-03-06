import type { AppConfig } from '@/lib/utils/configLoader';

export const localConfig: AppConfig = {
  apiBaseUrl: 'http://localhost:8000',
  environment: 'development',
  auth: {
    clientId: 'firebase-local',
    authority: 'https://localhost:8000',
    apiScope: 'local',
  },
  features: {
    enableDebugMode: true,
    enableMockData: false,
  },
};
