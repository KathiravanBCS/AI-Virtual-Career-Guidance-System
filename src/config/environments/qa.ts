import type { AppConfig } from '@/lib/utils/configLoader';

export const qaConfig: AppConfig = {
  apiBaseUrl: 'https://gm-aicg-guidance-qa-api.azurewebsites.net',
  environment: 'qa',
  auth: {
    clientId: 'firebase-qa',
    authority: 'https://gm-aicg-guidance-qa.firebaseapp.com',
    apiScope: 'firebase-qa',
  },
  features: {
    enableDebugMode: false,
    enableMockData: false,
  },
};
