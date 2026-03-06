import type { AppConfig } from '@/lib/utils/configLoader';

export const prodConfig: AppConfig = {
  apiBaseUrl: 'https://gm-aicg-guidance-prod-api.azurewebsites.net',
  environment: 'prod',
  auth: {
    clientId: 'firebase-prod',
    authority: 'https://gm-aicg-guidance-prod.firebaseapp.com',
    apiScope: 'firebase-prod',
  },
  features: {
    enableDebugMode: false,
    enableMockData: false,
  },
};
