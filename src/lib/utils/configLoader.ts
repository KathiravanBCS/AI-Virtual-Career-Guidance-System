import { devConfig } from '@/config/environments/dev';
import { localConfig } from '@/config/environments/local';
import { prodConfig } from '@/config/environments/prod';
import { qaConfig } from '@/config/environments/qa';
import { uatConfig } from '@/config/environments/uat';

export interface AppConfig {
  apiBaseUrl: string;
  environment: 'development' | 'qa' | 'uat' | 'prod';
  auth: {
    clientId: string;
    authority: string;
    apiScope: string;
  };
  features: {
    enableDebugMode: boolean;
    enableMockData: boolean;
  };
}
// Config mapping
const CONFIG_MAP: Record<string, AppConfig> = {
  local: localConfig,
  dev: devConfig,
  qa: qaConfig,
  uat: uatConfig,
  prod: prodConfig,
};

// URL to environment mapping
const URL_ENVIRONMENT_MAP: Record<string, string> = {
  'guidance-dev.gm-aicg.com': 'dev',
  'guidance-qa.gm-aicg.com': 'qa',
  'guidance-uat.gm-aicg.com': 'uat',
  'guidance.gm-aicg.com': 'prod',
  'nice-hill-08199a400.2.azurestaticapps.net': 'qa',
  'lemon-sky-0d46da900.1.azurestaticapps.net': 'prod',
  localhost: 'local',
  '127.0.0.1': 'local',
};
/**
 * Determines the environment based on the current URL
 */
function getEnvironmentFromUrl(): string {
  const hostname = window.location.hostname;

  // Check exact matches first
  if (URL_ENVIRONMENT_MAP[hostname]) {
    return URL_ENVIRONMENT_MAP[hostname];
  }

  // Check for partial matches (useful for subdomains)
  for (const [pattern, env] of Object.entries(URL_ENVIRONMENT_MAP)) {
    if (hostname.includes(pattern)) {
      return env;
    }
  }

  // Default to dev if no match found
  console.warn(`No environment mapping found for hostname: ${hostname}, defaulting to dev`);
  return 'dev';
}
// Cache for loaded config
let cachedConfig: AppConfig | null = null;
/**
 * Loads the configuration based on the current environment
 */
export function loadConfig(): AppConfig {
  // Return cached config if already loaded
  if (cachedConfig) {
    return cachedConfig;
  }

  const environment = getEnvironmentFromUrl();

  console.log(`[Config] Loading configuration for environment: ${environment}`);

  const config = CONFIG_MAP[environment];

  if (!config) {
    console.error(`[Config] No configuration found for environment: ${environment}`);
    // Fallback to dev config
    cachedConfig = devConfig;
    return cachedConfig;
  }

  cachedConfig = config;
  console.log(`[Config] Successfully loaded ${environment} configuration:`, config);

  return config;
}
/**
 * Gets the current configuration (loads if not already loaded)
 */
export function getConfig(): AppConfig {
  if (!cachedConfig) {
    return loadConfig();
  }
  return cachedConfig;
}
