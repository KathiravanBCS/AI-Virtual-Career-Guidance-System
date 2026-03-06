import type { AppConfig } from '@/lib/utils/configLoader';

export const uatConfig: AppConfig = {
  apiBaseUrl: 'https://gm-aicg-guidance-uat-api.azurewebsites.net',
  environment: 'uat',
  auth: {
    clientId: 'firebase-uat',
    authority: 'https://gm-aicg-guidance-uat.firebaseapp.com',
    apiScope: 'firebase-uat',
  },
  features: {
    enableDebugMode: false,
    enableMockData: false,
  },
};
