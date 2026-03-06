import type { AppConfig } from '@/lib/utils/configLoader';

export const devConfig: AppConfig = {
  apiBaseUrl: 'https://kvm-aicg.onrender.com',
  environment: 'development',
  auth: {
    clientId: 'firebase-dev',
    authority: 'https://gm-aicg-guidance-dev.firebaseapp.com',
    apiScope: 'firebase-dev',
  },
  features: {
    enableDebugMode: true,
    enableMockData: false,
  },
};
