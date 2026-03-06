import axios, { AxiosError } from 'axios';
import JSON5 from 'json5';
import { v4 as uuidv4 } from 'uuid';

// ==================== TYPES & INTERFACES ====================

// Chat History Types
export interface ChatMessage {
  id?: string;
  sender?: 'user' | 'bot';
  role?: 'user' | 'assistant' | 'system';
  message?: string;
  content?: string;
  timestamp?: Date;
  isLoading?: boolean;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  updatedAt: Date;
  tokenCount?: number;
}

// Groq API Types

interface DebugLogData {
  [key: string]: unknown;
}

interface RequestLog {
  timestamp: string;
  model: string;
  success: boolean;
  error: {
    message: string;
    status?: number;
    data?: unknown;
  } | null;
}

interface ApiRequestLog {
  timestamp: number;
  count: number;
  resetInterval: number;
  maxRequestsPerInterval: number;
}

interface ModelCapabilities {
  contextWindow: number;
  capability: 'high' | 'medium' | 'low';
  speed: 'very-fast' | 'fast' | 'medium' | 'slow';
  useCase: string[];
}

interface ModelCapabilitiesMap {
  [key: string]: ModelCapabilities;
}

interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

interface ModuleSection {
  title: string;
  content: string;
  keyPoints?: string[];
  codeExample?: CodeExample | null;
}

interface ModuleContent {
  title: string;
  type: 'technical' | 'general';
  sections: ModuleSection[];
}

interface Flashcard {
  id: number;
  frontHTML: string;
  backHTML: string;
}

interface QuizAnswer {
  [key: string]: string;
}

interface QuizQuestion {
  question: string;
  answers: string[];
  correctAnswer: string[];
  explanation: string;
  point: number;
  questionType: 'single' | 'multiple';
}

interface QuizData {
  topic: string;
  questions: QuizQuestion[];
}

interface SimpleQuizQuestion {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

interface SimpleQuizData {
  questions: SimpleQuizQuestion[];
}

interface LearningModule {
  title: string;
  description: string;
  estimatedTime?: string;
  content?: string;
}

interface CareerPathModule {
  title: string;
  description: string;
  estimatedHours: number;
  keySkills: string[];
}

interface CareerPath {
  pathName: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTimeToComplete: string;
  relevanceScore: number;
  modules: CareerPathModule[];
}

interface UserData {
  name?: string;
  age?: number;
  careerGoal?: string;
  skills?: string[];
  currentSkills?: string[];
  interests?: string[];
  quizAnswers?: { [key: string]: string };
  assessmentAnswers?: { [key: number]: string };
}

interface QuizAnalysis {
  technical: number;
  creative: number;
  business: number;
  performance: number;
  service: number;
}

interface AINudge {
  type: 'tip' | 'recommendation' | 'challenge';
  text: string;
  actionText?: string;
  icon: 'bulb' | 'rocket';
}

interface CareerPathData {
  careerName?: string;
  progress?: number;
  completedModules?: string[];
  modules?: CareerPathModule[];
  recommendedSkills?: string[];
}

interface Assessment {
  moduleName: string;
  score: number;
  feedback: string;
  accuracy?: number;
}

interface CareerSummaryParams {
  user: UserData;
  careerPath: CareerPathData;
  assessments: Assessment[];
}

interface ResponsiveContent extends ModuleContent {
  // Additional fields can be added for responsive display
}

interface ElaborationSection {
  title: string;
  content: string;
  keyPoints: string[];
  codeExample?: CodeExample | null;
}

interface ElaborationContent {
  title: string;
  sections: ElaborationSection[];
  modelUsed: string;
  theme?: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
    codeBackground: string;
  };
  display?: {
    showCodeExamples: boolean;
    collapsibleSections: boolean;
    animateEntrance: boolean;
  };
  error?: string;
}

interface EnhancedError extends Error {
  status?: number;
  originalError?: AxiosError;
  model?: string;
}

interface TestResult {
  success: boolean;
  message: string;
}

// Resume Extraction Types
export interface ExtractedResume {
  candidateName: string;
  email: string;
  phone?: string;
  location?: string;
  totalYearsExperience: number;
  topSkills: string[];
  summary?: string;
  workExperience: WorkExperienceEntry[];
  projects?: ProjectEntry[];
  education: EducationEntry[];
  certifications?: string[];
  linkedIn?: string;
  portfolio?: string;
}

export interface WorkExperienceEntry {
  jobTitle: string;
  company: string;
  duration: string;
  description: string;
  fullDescription?: string;
  keyResponsibilities?: string[];
  achievements?: string[];
}

export interface ProjectEntry {
  name: string;
  description: string;
  fullDescription?: string;
  technologies?: string[];
  links?: {
    github?: string;
    demo?: string;
    website?: string;
  };
  keyFeatures?: string[];
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  graduationYear?: string;
  cgpa?: string;
}

// ==================== CONFIGURATION ====================

const DEBUG_MODE = true;

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '[REDACTED:api-key]';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_BASE_URL = 'https://api.groq.com/openai/v1';
const MODEL = 'llama-3.1-8b-instant';

if (!GROQ_API_KEY || GROQ_API_KEY === '[REDACTED:api-key]') {
  console.error('GROQ_API_KEY is not set. Please add it to your .env file. Get it from https://console.groq.com');
}

// Helper function for consistent debug logging
const debugLog = (message: string, data: DebugLogData | null = null): void => {
  if (!DEBUG_MODE) return;

  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
};

// Log API requests for debugging
const logApiRequest = (model: string, success: boolean = true, error: AxiosError | null = null): void => {
  if (!DEBUG_MODE) return;

  const requestLog: RequestLog = {
    timestamp: new Date().toISOString(),
    model,
    success,
    error: error
      ? {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        }
      : null,
  };

  debugLog(`API Request: ${model} - ${success ? 'SUCCESS' : 'FAILED'}`, requestLog as unknown as DebugLogData);
};

// Updated list of GROQ models in order of preference with newer models
const GROQ_MODELS: string[] = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama-3.1-8b-instant',
  'llama3-8b-8192',
  'gemma2-9b-it',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'qwen-qwq-32b',
];

// Model capabilities and use cases
const MODEL_CAPABILITIES: ModelCapabilitiesMap = {
  'llama-3.3-70b-versatile': {
    contextWindow: 128000,
    capability: 'high',
    speed: 'fast',
    useCase: ['complex', 'technical', 'creative', 'detailed'],
  },
  'llama3-70b-8192': {
    contextWindow: 8192,
    capability: 'high',
    speed: 'medium',
    useCase: ['complex', 'technical', 'detailed'],
  },
  'llama-3.1-8b-instant': {
    contextWindow: 128000,
    capability: 'medium',
    speed: 'very-fast',
    useCase: ['simple', 'interactive', 'chat'],
  },
  'llama3-8b-8192': {
    contextWindow: 8192,
    capability: 'medium',
    speed: 'fast',
    useCase: ['general', 'simple'],
  },
  'gemma2-9b-it': {
    contextWindow: 8192,
    capability: 'medium',
    speed: 'fast',
    useCase: ['general', 'alternative'],
  },
  'meta-llama/llama-4-maverick-17b-128e-instruct': {
    contextWindow: 131072,
    capability: 'high',
    speed: 'medium',
    useCase: ['complex', 'long-context'],
  },
  'qwen-qwq-32b': {
    contextWindow: 128000,
    capability: 'high',
    speed: 'medium',
    useCase: ['alternative', 'fallback'],
  },
};

// Enhanced retry and backoff strategy
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 15000;
const RATE_LIMIT_STATUS_CODES: number[] = [429, 500, 502, 503, 504];

// Track API usage to prevent rate limit issues
let apiRequestLog: ApiRequestLog = {
  timestamp: Date.now(),
  count: 0,
  resetInterval: 60000,
  maxRequestsPerInterval: 25,
};

// ==================== UTILITY FUNCTIONS ====================

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Reset request counter periodically
setInterval(() => {
  apiRequestLog = {
    ...apiRequestLog,
    timestamp: Date.now(),
    count: 0,
  };
}, apiRequestLog.resetInterval);

// Check if we're approaching rate limits
const shouldThrottle = (): boolean => {
  const now = Date.now();
  const elapsed = now - apiRequestLog.timestamp;

  if (elapsed < apiRequestLog.resetInterval && apiRequestLog.count >= apiRequestLog.maxRequestsPerInterval * 0.9) {
    return true;
  }
  return false;
};

// Adaptive throttling based on current usage
const throttleIfNeeded = async (): Promise<void> => {
  if (shouldThrottle()) {
    const remainingTime = apiRequestLog.resetInterval - (Date.now() - apiRequestLog.timestamp);
    console.log(`Approaching rate limit, throttling for ${remainingTime}ms`);
    await sleep(remainingTime > 0 ? remainingTime : 1000);
  }
};

// ==================== VALIDATION & CLEANING ====================

const validateModuleContent = (content: unknown): content is ModuleContent => {
  const c = content as ModuleContent;
  if (!c?.title || !Array.isArray(c?.sections)) return false;
  if (c.sections.length === 0) return false;

  return c.sections.every(
    (section) => section.title && typeof section.content === 'string' && section.content.length > 50
  );
};

const cleanCodeExample = (codeExample: CodeExample): CodeExample | null => {
  if (!codeExample) return null;
  try {
    const cleanCode = codeExample.code
      ?.replace(/```[\w]*\n?/g, '')
      ?.replace(/```$/gm, '')
      ?.replace(/^\/\/ /gm, '')
      ?.trim();

    return {
      language: codeExample.language || 'javascript',
      code: cleanCode || '',
      explanation: codeExample.explanation || '',
    };
  } catch (error) {
    console.error('Code cleaning error:', error);
    return null;
  }
};

const sanitizeContent = (text: string): string => {
  try {
    return text
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .replace(/`/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\\\\/g, '\\')
      .trim();
  } catch (error) {
    console.error('Content sanitization error:', error);
    return text;
  }
};

const sanitizeJSON = (text: string): unknown => {
  try {
    let cleanedText = text.replace(/```(?:json)?/g, '').trim();

    const jsonMatch = cleanedText.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
    if (!jsonMatch) return text;

    let jsonText = jsonMatch[0]
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\\(?!["\\/bfnrtu])/g, '\\\\')
      .replace(/\\n/g, ' ')
      .replace(/\r?\n|\r/g, ' ')
      .replace(/,(\s*[}\]])/g, '$1')
      .replace(/([^\\])\\"/g, '$1\\\\"')
      .replace(/([^\\])\\/g, '$1\\\\')
      .replace(/"\s+"/g, '" "')
      .replace(/"\s*:\s*"/g, '":"')
      .trim();

    try {
      return JSON5.parse(jsonText);
    } catch (json5Error) {
      console.warn('JSON5 parse failed, trying fallback cleaning:', (json5Error as Error).message);

      jsonText = jsonText
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/\\"/g, '\\"')
        .replace(/\\\\/g, '\\')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*\]/g, ']');

      try {
        return JSON5.parse(jsonText);
      } catch (finalError) {
        console.error('Final JSON5 parse attempt failed:', finalError);

        if (text.includes('frontHTML') && text.includes('backHTML')) {
          const cards: Flashcard[] = [];
          const cardMatches = text.match(/\{\s*"id"\s*:\s*\d+[\s\S]*?(?=\}\s*,\s*\{|\}\s*\]|\}$)/g);

          if (cardMatches) {
            cardMatches.forEach((cardText, index) => {
              cards.push({
                id: index + 1,
                frontHTML: extractValue(cardText, 'frontHTML') || `Question ${index + 1}`,
                backHTML: extractValue(cardText, 'backHTML') || `Answer ${index + 1}`,
              });
            });

            if (cards.length > 0) {
              return cards;
            }
          }
        }

        return text;
      }
    }
  } catch (error) {
    console.error('JSON sanitization error', error);
    return text;
  }
};

const extractValue = (text: string, key: string): string | null => {
  const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`);
  const match = text.match(regex);
  return match ? match[1].replace(/\\"/g, '"') : null;
};

// ==================== TOPIC ANALYSIS ====================

// ==================== DOMAIN-SPECIFIC KEYWORDS ====================

const DOMAIN_KEYWORDS: Record<string, Record<string, string[]>> = {
  // Technology & Software Development
  technology: {
    programming: [
      'javascript',
      'python',
      'java',
      'coding',
      'programming',
      'typescript',
      'rust',
      'golang',
      'php',
      'ruby',
      'c++',
      'c#',
      '.net',
    ],
    web: [
      'html',
      'css',
      'react',
      'angular',
      'vue',
      'frontend',
      'backend',
      'fullstack',
      'nextjs',
      'express',
      'django',
      'flask',
    ],
    database: ['sql', 'database', 'mongodb', 'postgres', 'mysql', 'firebase', 'elasticsearch', 'redis', 'oracle'],
    software: [
      'api',
      'development',
      'software',
      'git',
      'devops',
      'algorithms',
      'data structures',
      'design patterns',
      'architecture',
    ],
    cloud: ['aws', 'azure', 'gcp', 'kubernetes', 'docker', 'cloud computing', 'serverless', 'microservices'],
    ai_ml: [
      'machine learning',
      'artificial intelligence',
      'deep learning',
      'neural networks',
      'nlp',
      'computer vision',
      'tensorflow',
      'pytorch',
    ],
  },

  // Business & Entrepreneurship
  business: {
    general: ['business', 'management', 'leadership', 'strategy', 'entrepreneurship', 'startup', 'enterprise'],
    finance: [
      'finance',
      'accounting',
      'budgeting',
      'investment',
      'financial planning',
      'taxation',
      'auditing',
      'bookkeeping',
    ],
    sales_marketing: [
      'sales',
      'marketing',
      'advertising',
      'branding',
      'customer acquisition',
      'conversion',
      'seo',
      'social media',
      'email marketing',
      'analytics',
    ],
    operations: ['operations', 'supply chain', 'logistics', 'procurement', 'vendor management', 'project management'],
    hr: [
      'human resources',
      'recruitment',
      'talent management',
      'employee relations',
      'payroll',
      'training',
      'compensation',
    ],
  },

  // Creative & Arts
  creative: {
    visual_arts: [
      'graphic design',
      'ui design',
      'ux design',
      'illustration',
      'photography',
      'animation',
      'video',
      'visual arts',
      'art direction',
    ],
    writing: [
      'writing',
      'content creation',
      'copywriting',
      'journalism',
      'screenwriting',
      'novel writing',
      'blogging',
      'technical writing',
    ],
    music_audio: ['music', 'audio engineering', 'sound design', 'music production', 'recording', 'mixing', 'mastering'],
    performing_arts: ['acting', 'theater', 'dance', 'performance', 'stage design', 'directing'],
  },

  // Science & Research
  science: {
    general: ['science', 'research', 'academic', 'laboratory', 'experiment', 'hypothesis', 'analysis'],
    biology: [
      'biology',
      'genetics',
      'microbiology',
      'biochemistry',
      'botany',
      'zoology',
      'ecology',
      'medicine',
      'pharmacy',
      'nursing',
    ],
    chemistry: ['chemistry', 'organic chemistry', 'inorganic chemistry', 'physical chemistry', 'chemical engineering'],
    physics: [
      'physics',
      'quantum mechanics',
      'engineering',
      'mechanical engineering',
      'civil engineering',
      'electrical engineering',
    ],
    mathematics: ['mathematics', 'calculus', 'algebra', 'statistics', 'geometry', 'data analysis'],
  },

  // Healthcare & Medical
  healthcare: {
    medical: ['medicine', 'physician', 'doctor', 'surgery', 'diagnosis', 'treatment', 'patient care', 'clinical'],
    nursing: ['nursing', 'nurse practitioner', 'registered nurse', 'healthcare', 'patient support'],
    therapy: ['psychology', 'counseling', 'therapy', 'mental health', 'psychiatry', 'social work'],
    fitness: ['fitness', 'exercise science', 'personal training', 'nutrition', 'wellness', 'physical therapy'],
  },

  // Education & Training
  education: {
    teaching: ['teaching', 'education', 'instructor', 'trainer', 'curriculum', 'pedagogy', 'learning management'],
    subjects: ['mathematics', 'science', 'language arts', 'history', 'literature', 'geography', 'social studies'],
    elearning: ['elearning', 'online education', 'distance learning', 'course design', 'student engagement'],
  },

  // Skilled Trades & Crafts
  trades: {
    mechanical: [
      'plumbing',
      'electrical',
      'hvac',
      'carpentry',
      'welding',
      'mechanics',
      'automotive',
      'heavy equipment',
    ],
    construction: ['construction', 'building', 'architecture', 'contractors', 'blueprint reading', 'safety'],
    crafts: ['woodworking', 'metalworking', 'textile', 'pottery', 'jewelry', 'craftsmanship'],
  },

  // Hospitality & Service
  hospitality: {
    food: ['cooking', 'culinary', 'chef', 'food preparation', 'restaurant management', 'baking', 'pastry'],
    accommodation: ['hospitality', 'hotel management', 'tourism', 'travel', 'event planning'],
    service: ['customer service', 'hospitality', 'guest relations', 'concierge'],
  },

  // Finance & Accounting
  finance: {
    accounting: ['accounting', 'bookkeeping', 'tax', 'auditing', 'financial reporting', 'gaap', 'ifrs'],
    investment: ['investment', 'portfolio', 'stocks', 'bonds', 'trading', 'crypto', 'cryptocurrency'],
    banking: ['banking', 'loans', 'credit', 'mortgages', 'financial services'],
  },

  // Legal & Compliance
  legal: {
    law: ['law', 'legal', 'attorney', 'compliance', 'regulation', 'contract', 'litigation'],
    specializations: ['corporate law', 'real estate', 'family law', 'criminal law', 'intellectual property'],
  },

  // Real Estate & Property
  realestate: {
    general: ['real estate', 'property', 'real estate agent', 'broker', 'valuation', 'appraisal'],
    development: ['property development', 'architecture', 'construction', 'zoning', 'permits'],
  },

  // Agriculture & Environment
  environment: {
    agriculture: ['agriculture', 'farming', 'agronomy', 'crop management', 'animal husbandry', 'sustainability'],
    environmental: ['environmental science', 'ecology', 'conservation', 'climate', 'renewable energy'],
  },

  // Transportation & Logistics
  logistics: {
    general: ['logistics', 'supply chain', 'transportation', 'shipping', 'warehousing'],
    vehicles: ['driver', 'trucking', 'aviation', 'maritime', 'pilot', 'fleet management'],
  },

  // Gaming & Entertainment
  gaming: {
    game_dev: ['game development', 'game design', 'unity', 'unreal engine', 'game programming'],
    entertainment: ['entertainment', 'film', 'television', 'production', 'streaming'],
  },
};

// Determine if topic is technical/specialized (requires detailed code examples)
const isCodeRelatedTopic = (topic: string): boolean => {
  const technicalDomains = ['technology', 'science', 'trades'];
  const lowerTopic = topic.toLowerCase();

  return technicalDomains.some((domain) =>
    Object.values(DOMAIN_KEYWORDS[domain]).some((category) => category.some((keyword) => lowerTopic.includes(keyword)))
  );
};

// Detect primary domain of a topic for better content routing
const detectDomain = (topic: string): string => {
  const lowerTopic = topic.toLowerCase();

  for (const [domain, categories] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const keywords of Object.values(categories)) {
      if (keywords.some((keyword) => lowerTopic.includes(keyword))) {
        return domain;
      }
    }
  }

  return 'general'; // Default domain
};

// Get appropriate complexity level based on domain
const getContentComplexity = (domain: string): 'low' | 'medium' | 'high' => {
  const complexityMap: Record<string, 'low' | 'medium' | 'high'> = {
    technology: 'high',
    science: 'high',
    healthcare: 'medium',
    finance: 'high',
    legal: 'high',
    business: 'medium',
    education: 'medium',
    creative: 'medium',
    trades: 'medium',
    hospitality: 'low',
    realestate: 'medium',
    environment: 'medium',
    logistics: 'medium',
    gaming: 'high',
  };

  return complexityMap[domain] || 'medium';
};

// Get domain-specific context for better prompts
const getDomainContext = (
  topic: string
): { domain: string; category: string; complexity: 'low' | 'medium' | 'high' } => {
  const lowerTopic = topic.toLowerCase();

  for (const [domain, categories] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((keyword) => lowerTopic.includes(keyword))) {
        return {
          domain,
          category,
          complexity: getContentComplexity(domain),
        };
      }
    }
  }

  return {
    domain: 'general',
    category: 'general',
    complexity: 'medium',
  };
};

// ==================== MODEL SELECTION ====================

const selectBestModel = (
  task: string,
  contentType: string,
  complexity: string = 'medium',
  isInteractive: boolean = false
): string => {
  if (isInteractive && complexity !== 'high') {
    return 'llama-3.1-8b-instant';
  }

  if (complexity === 'high' && (contentType === 'technical' || contentType === 'code')) {
    return 'llama-3.3-70b-versatile';
  }

  if (complexity === 'medium' && contentType !== 'technical') {
    return 'llama3-8b-8192';
  }

  return 'llama-3.3-70b-versatile';
};

const calculateBackoff = (attempt: number): number => {
  const exponentialDelay = BASE_RETRY_DELAY * Math.pow(2, attempt - 1);
  const jitter = Math.random() * BASE_RETRY_DELAY;
  return Math.min(exponentialDelay + jitter, MAX_RETRY_DELAY);
};

// ==================== API CALLS ====================

const callGroqApi = async (prompt: string, model: string): Promise<string> => {
  try {
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: model,
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 4096,
        top_p: 0.95,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${GROQ_API_KEY}`,
        },
        timeout: 30000,
      }
    );

    logApiRequest(model, true);
    return response.data.choices[0].message.content;
  } catch (error) {
    const axiosError = error as AxiosError;
    logApiRequest(model, false, axiosError);

    const enhancedError: EnhancedError = new Error(
      `GROQ API call failed with model ${model}: ${(error as Error).message}`
    );
    enhancedError.status = axiosError.response?.status;
    enhancedError.originalError = axiosError;
    enhancedError.model = model;

    throw enhancedError;
  }
};

const llmCompletion = async (prompt: string, preferredModel: string = 'llama-3.3-70b-versatile'): Promise<string> => {
  const modelsToTry = [preferredModel, ...GROQ_MODELS.filter((model) => model !== preferredModel)];

  let lastError: EnhancedError | null = null;

  await throttleIfNeeded();
  apiRequestLog.count++;

  try {
    debugLog(`Initial attempt with preferred model: ${preferredModel}`);
    const response = await callGroqApi(prompt, preferredModel);
    return response;
  } catch (initialError) {
    lastError = initialError as EnhancedError;
    debugLog(`Preferred model ${preferredModel} failed, switching to fallbacks`, {
      message: (initialError as Error).message,
    });
  }

  const remainingModels = modelsToTry.filter((model) => model !== preferredModel);

  for (const model of remainingModels) {
    try {
      debugLog(`Trying fallback model: ${model}`);
      const response = await callGroqApi(prompt, model);
      debugLog(`Successfully generated content with fallback model: ${model}`);
      return response;
    } catch (fallbackError) {
      lastError = fallbackError as EnhancedError;
      debugLog(`Fallback model ${model} failed`, {
        message: (fallbackError as Error).message,
      });
    }
  }

  const errorMessage = lastError?.message || 'Unknown error';
  debugLog(`All models failed after trying ${modelsToTry.length} models`, {
    errorMessage,
  });
  throw new Error(`All GROQ models failed: ${errorMessage}`);
};

// ==================== RETRY MECHANISM ====================

const retry = async <T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES,
  delay: number = BASE_RETRY_DELAY
): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      const backoffTime = calculateBackoff(retries);
      console.log(`Retrying... Attempts left: ${retries - 1}, waiting ${backoffTime}ms`);
      await sleep(backoffTime);
      return retry(fn, retries - 1, delay);
    }
    throw error;
  }
};

// ==================== HELPER FUNCTIONS ====================

// Get domain-specific quiz generation instructions
const getDomainQuizInstructions = (domain: string, category: string): string => {
  const domainGuides: Record<string, string> = {
    technology: `**Tech Quiz Requirements:**
    - Include conceptual understanding questions (40%)
    - Include practical application questions (40%)
    - Include problem-solving scenarios (20%)
    - For coding topics: focus on logic & implementation, not syntax memorization
    - Include real-world use cases and best practices`,

    science: `**Science Quiz Requirements:**
    - Include definition/terminology questions (20%)
    - Include mechanism/process questions (40%)
    - Include calculation/problem-solving questions (40%)
    - Ensure scientific accuracy and proper units
    - Test understanding of cause-and-effect relationships`,

    healthcare: `**Healthcare Quiz Requirements:**
    - Include medical knowledge questions (30%)
    - Include clinical scenario questions (40%)
    - Include critical thinking/decision-making (30%)
    - Ensure medical accuracy and use proper terminology
    - Emphasize patient safety and evidence-based practices`,

    business: `**Business Quiz Requirements:**
    - Include concept/theory questions (30%)
    - Include case study/scenario questions (50%)
    - Include strategic thinking questions (20%)
    - Use real business situations and frameworks
    - Test decision-making and analysis skills`,

    finance: `**Finance Quiz Requirements:**
    - Include definition/calculation questions (30%)
    - Include scenario/application questions (50%)
    - Include analysis/interpretation questions (20%)
    - Use realistic financial scenarios with numbers
    - Test practical understanding of financial principles`,

    creative: `**Creative Arts Quiz Requirements:**
    - Include technique/principle questions (30%)
    - Include analysis/critique questions (40%)
    - Include project/execution questions (30%)
    - Use examples from successful creative works
    - Test both theoretical and practical understanding`,

    education: `**Education Quiz Requirements:**
    - Include concept/knowledge questions (40%)
    - Include application/teaching scenario questions (40%)
    - Include assessment/evaluation questions (20%)
    - Use clear, grade-appropriate language
    - Test understanding of learning outcomes`,

    trades: `**Trades Quiz Requirements:**
    - Include knowledge questions (30%)
    - Include procedure/step-by-step questions (40%)
    - Include safety/compliance questions (20%)
    - Include troubleshooting scenarios (10%)
    - Emphasize safety and industry standards`,

    hospitality: `**Hospitality Quiz Requirements:**
    - Include service protocol questions (30%)
    - Include customer scenario questions (40%)
    - Include operations/management questions (30%)
    - Use realistic hospitality situations
    - Test both procedural and interpersonal skills`,

    legal: `**Legal Quiz Requirements:**
    - Include definition/statute questions (30%)
    - Include scenario/case application questions (50%)
    - Include analysis/interpretation questions (20%)
    - Use accurate legal terminology
    - Test understanding of legal principles and applications`,

    realestate: `**Real Estate Quiz Requirements:**
    - Include terminology/process questions (30%)
    - Include market/valuation questions (35%)
    - Include transaction/negotiation scenarios (35%)
    - Use realistic real estate situations
    - Test understanding of regulations and practices`,

    environment: `**Environmental Quiz Requirements:**
    - Include science/ecology questions (40%)
    - Include sustainability/conservation questions (30%)
    - Include real-world scenario questions (30%)
    - Ensure scientific accuracy
    - Test understanding of environmental systems`,

    logistics: `**Logistics Quiz Requirements:**
    - Include supply chain concept questions (30%)
    - Include optimization/problem-solving questions (40%)
    - Include operation/procedure questions (30%)
    - Use real logistics scenarios
    - Test understanding of efficiency and coordination`,

    gaming: `**Gaming Quiz Requirements:**
    - Include game design principle questions (30%)
    - Include mechanics/implementation questions (35%)
    - Include player psychology/engagement questions (35%)
    - Use real game examples
    - Test both design and development knowledge`,
  };

  return (
    domainGuides[domain] ||
    `**General Quiz Requirements:**
    - Mix different question types and difficulty levels
    - Focus on understanding, not just memorization
    - Include practical application questions
    - Test critical thinking and analysis`
  );
};

// Get domain-specific flashcard generation instructions
const getDomainFlashcardInstructions = (domain: string, category: string): string => {
  const domainGuides: Record<string, string> = {
    technology: `**Tech-Specific Guidance:**
    - Questions should test understanding of concepts, not just memorization
    - Include practical applications and real-world use cases
    - For programming topics: explain the "why" and "when to use" it
    - Use code snippets or pseudocode examples in answers when relevant`,

    science: `**Science-Specific Guidance:**
    - Include definitions, formulas, and mechanisms
    - Connect concepts to broader scientific principles
    - Use accurate terminology and proper units
    - Include cause-and-effect relationships`,

    healthcare: `**Healthcare-Specific Guidance:**
    - Ensure medical accuracy and use proper terminology
    - Include practical clinical applications
    - Cover symptoms, diagnosis, and treatment aspects
    - Emphasize patient safety and evidence-based practices`,

    business: `**Business-Specific Guidance:**
    - Focus on strategic thinking and decision-making frameworks
    - Include real-world business scenarios and case studies
    - Test understanding of concepts, not just definitions
    - Connect theory to practical business applications`,

    finance: `**Finance-Specific Guidance:**
    - Use accurate financial terminology and calculations
    - Include realistic examples with numbers
    - Explain relationships between financial concepts
    - Test practical understanding of financial principles`,

    creative: `**Creative-Specific Guidance:**
    - Include examples of successful creative works
    - Test understanding of principles and techniques
    - Connect theory to practical creative execution
    - Include industry standards and best practices`,

    education: `**Education-Specific Guidance:**
    - Use clear, accessible language appropriate for learners
    - Include learning objectives and practical applications
    - Test comprehension at multiple levels
    - Provide context and real-world examples`,

    trades: `**Trades-Specific Guidance:**
    - Include practical safety considerations
    - Use industry-standard terminology
    - Include step-by-step procedures where relevant
    - Test both knowledge and practical skills understanding`,

    hospitality: `**Hospitality-Specific Guidance:**
    - Include customer service scenarios and best practices
    - Focus on practical operational knowledge
    - Include standards and regulations
    - Test both procedural and interpersonal skills`,

    legal: `**Legal-Specific Guidance:**
    - Use accurate legal terminology and definitions
    - Include relevant statutes, regulations, or precedents
    - Test understanding of legal principles and applications
    - Include practical scenarios`,

    realestate: `**Real Estate-Specific Guidance:**
    - Include market terms and property types
    - Connect theory to practical real estate scenarios
    - Include regulations and compliance requirements
    - Test understanding of valuation and transactions`,

    environment: `**Environmental-Specific Guidance:**
    - Include scientific accuracy and proper terminology
    - Connect local and global environmental concepts
    - Include sustainability and conservation practices
    - Test understanding of ecological relationships`,

    logistics: `**Logistics-Specific Guidance:**
    - Include supply chain concepts and optimization
    - Use industry standards and terminology
    - Include practical problem-solving scenarios
    - Test understanding of efficiency and coordination`,

    gaming: `**Gaming-Specific Guidance:**
    - Include game design principles and mechanics
    - Test understanding of player psychology
    - Include industry tools and best practices
    - Connect theory to practical game development`,
  };

  return (
    domainGuides[domain] ||
    `**General Guidance:**
    - Focus on core concepts and practical applications
    - Use clear, accessible language
    - Include real-world examples and scenarios
    - Test understanding, not just memorization`
  );
};

// ==================== COMPREHENSIVE LANGUAGE MAPPING ====================

const LANGUAGE_MAP: Record<string, Record<string, string[]>> = {
  // Web & Frontend Development
  web_frontend: {
    javascript: ['javascript', 'js', 'node', 'express', 'npm', 'webpack', 'babel', 'ecmascript', 'es6'],
    typescript: ['typescript', 'ts', 'type-safe', 'interfaces', 'generics'],
    react: ['react', 'jsx', 'nextjs', 'next.js', 'react native', 'hooks'],
    vue: ['vue', 'vue.js', 'nuxt', 'composition api'],
    angular: ['angular', 'angularjs'],
    html: ['html', 'html5', 'markup', 'semantic html'],
    css: ['css', 'css3', 'styling', 'scss', 'sass', 'less', 'tailwind', 'bootstrap', 'css-in-js'],
    php: ['php', 'laravel', 'symfony', 'wordpress', 'server-side'],
  },

  // Backend & Server Development
  backend: {
    python: ['python', 'django', 'flask', 'fastapi', 'uwsgi', 'gunicorn', 'pip'],
    java: ['java', 'spring', 'spring boot', 'maven', 'gradle', 'jvm'],
    csharp: ['c#', '.net', 'dotnet', 'asp.net', 'entity framework'],
    go: ['go', 'golang', 'gin', 'chi router'],
    rust: ['rust', 'cargo', 'tokio', 'actix'],
    ruby: ['ruby', 'rails', 'sinatra', 'rack'],
    php: ['php', 'laravel', 'symfony', 'composer'],
    nodejs: ['node.js', 'nodejs', 'npm', 'yarn', 'express'],
  },

  // Database & Query Languages
  database: {
    sql: ['sql', 'mysql', 'postgresql', 'postgres', 'oracle', 't-sql', 'plsql', 'stored procedure'],
    nosql: ['mongodb', 'nosql', 'document database', 'firestore', 'dynamodb'],
    graphql: ['graphql', 'apollo'],
    redis: ['redis', 'caching', 'in-memory'],
  },

  // Systems & Low-Level Programming
  systems: {
    cpp: ['c++', 'cpp', 'cplusplus', 'stl', 'boost'],
    c: ['c programming', 'ansi c', 'posix'],
    csharp: ['c#', '.net', 'dotnet'],
    rust: ['rust', 'memory safety', 'ownership'],
    assembly: ['assembly', 'x86', 'arm', 'machine code'],
  },

  // Data Science & Scripting
  datascience: {
    python: ['python', 'pandas', 'numpy', 'scikit-learn', 'matplotlib', 'jupyter'],
    r: ['r programming', 'ggplot2', 'dplyr', 'r-lang'],
    julia: ['julia', 'julialang'],
    matlab: ['matlab', 'octave'],
  },

  // AI & Machine Learning
  aiml: {
    python: ['machine learning', 'deep learning', 'tensorflow', 'pytorch', 'keras', 'scikit-learn'],
    cuda: ['cuda', 'gpu computing', 'parallel processing'],
  },

  // Mobile Development
  mobile: {
    swift: ['swift', 'ios development', 'xcode'],
    kotlin: ['kotlin', 'android', 'jetpack'],
    java: ['android', 'java mobile'],
    objectivec: ['objective-c', 'ios', 'xcode'],
    dart: ['dart', 'flutter'],
    reactnative: ['react native', 'mobile app'],
  },

  // Configuration & Infrastructure
  infrastructure: {
    yaml: ['yaml', 'configuration', 'ansible', 'kubernetes config'],
    json: ['json', 'api response', 'data format'],
    dockerfile: ['dockerfile', 'docker', 'containerization'],
    bash: ['bash', 'shell', 'shellscript', 'linux', 'terminal', 'command line'],
    powershell: ['powershell', 'windows script'],
    terraform: ['terraform', 'infrastructure as code'],
  },

  // Query & Templating
  templating: {
    html: ['html', 'markup', 'template'],
    jsx: ['jsx', 'react', 'templating'],
    ejs: ['ejs', 'embedded javascript'],
    jinja: ['jinja', 'jinja2', 'templating'],
  },

  // Markup & Documentation
  markup: {
    markdown: ['markdown', 'md', 'documentation'],
    xml: ['xml', 'data interchange'],
    json: ['json', 'api', 'data format'],
    yaml: ['yaml', 'config', 'configuration'],
  },

  // Domain-Specific Languages
  specialized: {
    solidity: ['solidity', 'ethereum', 'smart contract', 'blockchain'],
    verilog: ['verilog', 'hdl', 'hardware'],
    vhdl: ['vhdl', 'hardware design'],
    matlab: ['matlab', 'scientific computing'],
    r: ['r programming', 'statistical analysis'],
  },

  // Non-Technical/Pseudocode Domains
  pseudocode: {
    pseudocode: [
      'business logic',
      'process workflow',
      'algorithm explanation',
      'procedure',
      'step-by-step',
      'flowchart',
      'business process',
      'management',
      'hospitality',
      'cooking',
      'culinary',
      'medical',
      'healthcare',
      'legal',
      'real estate',
      'agriculture',
      'trades',
      'crafts',
      'art',
      'creative',
      'design',
      'writing',
      'education',
      'training',
      'finance',
      'accounting',
      'marketing',
      'sales',
      'hr',
      'logistics',
      'transportation',
    ],
  },
};

const getAppropriateLanguage = (topic: string): string => {
  const topicLower = topic.toLowerCase();

  // Search through all language categories
  for (const categoryLanguages of Object.values(LANGUAGE_MAP)) {
    for (const [language, keywords] of Object.entries(categoryLanguages)) {
      if (keywords.some((keyword) => topicLower.includes(keyword))) {
        return language;
      }
    }
  }

  // Fallback based on domain detection
  const domain = detectDomain(topic);
  const domainLanguageDefaults: Record<string, string> = {
    technology: 'javascript',
    science: 'python',
    trades: 'pseudocode',
    hospitality: 'pseudocode',
    creative: 'pseudocode',
    business: 'pseudocode',
    healthcare: 'pseudocode',
    finance: 'sql',
    legal: 'pseudocode',
    realestate: 'pseudocode',
    environment: 'python',
    logistics: 'pseudocode',
    gaming: 'cpp',
    education: 'pseudocode',
  };

  return domainLanguageDefaults[domain] || 'pseudocode';
};

const analyzeQuizAnswers = (quizAnswers: QuizAnswer): QuizAnalysis | null => {
  if (!quizAnswers || Object.keys(quizAnswers).length === 0) {
    return null;
  }

  const interests: Record<string, number> = {
    technical: 0,
    creative: 0,
    business: 0,
    performance: 0,
    service: 0,
  };

  Object.values(quizAnswers).forEach((answer) => {
    if (answer === 'A') interests.technical++;
    else if (answer === 'B') interests.creative++;
    else if (answer === 'C') interests.business++;
    else if (answer === 'D') interests.performance++;
    else if (answer === 'E') interests.service++;
  });

  const totalAnswers = Object.keys(quizAnswers).length;

  return {
    technical: Math.round((interests.technical / totalAnswers) * 100),
    creative: Math.round((interests.creative / totalAnswers) * 100),
    business: Math.round((interests.business / totalAnswers) * 100),
    performance: Math.round((interests.performance / totalAnswers) * 100),
    service: Math.round((interests.service / totalAnswers) * 100),
  };
};

const generateDefaultModules = (pathName: string, count: number): CareerPathModule[] => {
  return Array.from({ length: count }, (_, index) => {
    const level = index === 0 ? 'basic' : index === count - 1 ? 'advanced' : 'intermediate';
    return {
      title: `Module ${index + 1}: ${level.charAt(0).toUpperCase() + level.slice(1)} ${pathName}`,
      description: `Learn ${level} concepts and skills related to ${pathName}`,
      estimatedHours: 8 + index,
      keySkills: [`${level} understanding`, `${level} application`, `${level} skills`],
    };
  });
};

const themeElaborationContent = (content: ElaborationContent): ElaborationContent => {
  const themedContent = { ...content };

  themedContent.theme = {
    primary: '#ff9d54',
    secondary: '#3a3a3a',
    background: '#2a2a2a',
    text: '#ffffff',
    accent: '#ff8a30',
    codeBackground: '#1e1e1e',
  };

  themedContent.display = {
    showCodeExamples: true,
    collapsibleSections: true,
    animateEntrance: true,
  };

  return themedContent;
};

// ==================== EXPORTED FUNCTIONS ====================

export const generateModuleContent = async (
  moduleName: string,
  options: { detailed?: boolean } = { detailed: false }
): Promise<ModuleContent> => {
  if (!moduleName || typeof moduleName !== 'string') {
    throw new Error('Invalid module name provided');
  }

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const isTechTopic = isCodeRelatedTopic(moduleName);
      const contentComplexity = options.detailed ? 'high' : 'medium';

      const prompt = `Generate factual educational content about: "${moduleName}"

      IMPORTANT CONSTRAINTS:
      - ONLY include FACTUAL content that you are CERTAIN about
      - If you don't know something, provide general, established information instead of specifics
      - Do NOT include any subjective opinions or unverified information
      - Focus only on core concepts that are well-established in this field
      - AVOID mentioning specific products, companies, or people unless absolutely central to the topic
      - DO NOT reference ANY current events, trends, or statistics
      - DO NOT reference your capabilities or limitations

      CONTENT TYPE: ${isTechTopic ? 'Technical/Programming' : 'General Education'}
      LEVEL: ${options.detailed ? 'Advanced' : 'Basic'}
      
      CONTENT STRUCTURE:
      - Begin with fundamental concepts that have remained stable for years
      - Use factual, precise language without speculation
      - Focus on explaining core principles and concepts
      - Include practical examples that illustrate key points
      - For code examples, use standard syntax and common patterns
      ${isTechTopic ? '- Include code that follows standard conventions and works correctly' : ''}
      
      FORMAT:
      Return a JSON object with this EXACT structure:
      {
        "title": "Clear title for ${moduleName}",
        "type": "${isTechTopic ? 'technical' : 'general'}",
        "sections": [
          {
            "title": "Core Concept Name",
            "content": "Factual explanation with concrete examples",
            "keyPoints": ["Key point 1", "Key point 2", "Key point 3"],
            ${
              isTechTopic
                ? `"codeExample": {
              "language": "${getAppropriateLanguage(moduleName)}",
              "code": "// Standard, executable code example\\nfunction example() {\\n  // implementation\\n}",
              "explanation": "Explanation of how the code works"
            }`
                : '"codeExample": null'
            }
          }
        ]
      }
      
      Create ${options.detailed ? '4' : '3'} focused sections that cover essential aspects of the topic.
      Keep all content factual and verifiable.
      
      ONLY RETURN VALID JSON WITHOUT ANY EXPLANATION OR INTRODUCTION.`;

      const preferredModel = selectBestModel(
        'content-generation',
        isTechTopic ? 'technical' : 'general',
        contentComplexity
      );

      const text = await llmCompletion(prompt, preferredModel);
      const result = sanitizeJSON(text);
      const content = typeof result === 'string' ? JSON5.parse(result) : (result as ModuleContent);

      if (!validateModuleContent(content)) {
        throw new Error('Invalid content structure from LLM');
      }

      content.sections = content.sections.map((section) => ({
        ...section,
        content: sanitizeContent(section.content),
        codeExample: section.codeExample ? cleanCodeExample(section.codeExample) : null,
      }));

      return content;
    } catch (error) {
      lastError = error as Error;
      console.error(`Module content generation attempt ${attempt} failed:`, (error as Error).message);

      if (attempt < MAX_RETRIES) {
        const backoffTime = calculateBackoff(attempt);
        await sleep(backoffTime);
      }
    }
  }

  throw lastError || new Error('Failed to generate content after multiple attempts');
};

export const generateFlashcards = async (
  topic: string,
  numCards: number = 5,
  options: { domainSpecific?: boolean } = { domainSpecific: true }
): Promise<Flashcard[]> => {
  if (!topic || typeof topic !== 'string') {
    throw new Error('Invalid topic provided');
  }

  try {
    // Detect domain for context-aware flashcard generation
    const { domain, category, complexity } = getDomainContext(topic);
    const isTechTopic = isCodeRelatedTopic(topic);

    // Build domain-specific instructions
    const domainInstructions = options.domainSpecific
      ? getDomainFlashcardInstructions(domain, category)
      : '**General Guidance:** Focus on core concepts and practical applications';

    const prompt = `Generate ${numCards} educational flashcards on "${topic}" with increasing difficulty.
    
    **Domain Context:**
    - Learning Domain: ${domain}
    - Category: ${category}
    - Complexity Level: ${complexity}
    
    **Core Requirements:**
    - The **front side (question)** must be **short, clear, and memorable**.
    - The **back side (answer)** must be **detailed (3-4 sentences) and informative**.
    - Ensure **difficulty increases progressively**:
      - Flashcard 1: Basic concept introduction
      - Flashcards 2-${Math.ceil(numCards / 2)}: Intermediate details and applications
      - Flashcards ${Math.ceil(numCards / 2) + 1}-${numCards}: Advanced understanding and synthesis
    
    ${domainInstructions}

    **Output Format:**
    Return ONLY the JSON array with exactly ${numCards} flashcards:
    [
      { "id": 1, "frontHTML": "Basic question?", "backHTML": "Detailed easy explanation." },
      { "id": 2, "frontHTML": "Intermediate question?", "backHTML": "Detailed intermediate explanation." },
      { "id": ${numCards}, "frontHTML": "Advanced question?", "backHTML": "Detailed advanced explanation." }
    ]`;

    // Select model based on domain complexity
    const selectedModel = selectBestModel(
      'flashcards',
      isTechTopic ? 'technical' : 'educational',
      complexity,
      true // interactive
    );
    const text = await llmCompletion(prompt, selectedModel);

    try {
      const result = sanitizeJSON(text);
      const flashcards = typeof result === 'string' ? JSON5.parse(result) : (result as Flashcard[]);

      if (!Array.isArray(flashcards) || flashcards.length === 0) {
        throw new Error('Invalid flashcard format');
      }

      const normalizedFlashcards = flashcards.slice(0, numCards);
      while (normalizedFlashcards.length < numCards) {
        normalizedFlashcards.push({
          id: normalizedFlashcards.length + 1,
          frontHTML: `Question about ${topic} ${normalizedFlashcards.length + 1}?`,
          backHTML: `Answer about ${topic} ${normalizedFlashcards.length + 1}.`,
        });
      }

      return normalizedFlashcards;
    } catch (error) {
      console.error('Flashcard parsing error:', error);
      return Array.from({ length: numCards }, (_, i) => ({
        id: i + 1,
        frontHTML: `Basic to advanced ${topic} question ${i + 1}?`,
        backHTML: `Detailed answer explaining ${topic} at difficulty level ${i + 1}.`,
      }));
    }
  } catch (error) {
    throw new Error(`Failed to generate flashcards: ${(error as Error).message}`);
  }
};

export const generateQuizData = async (
  topic: string,
  numQuestions: number,
  moduleContent: string = ''
): Promise<QuizData> => {
  try {
    const hasContent = moduleContent && moduleContent.trim().length > 50;
    let cleanTopic = topic;

    if (topic.includes(':')) {
      cleanTopic = topic.split(':')[1].trim();
    } else if (topic.match(/Module\s+\d+/i)) {
      if (hasContent) {
        const firstLine = moduleContent.split('\n')[0];
        if (firstLine && firstLine.includes(':')) {
          cleanTopic = firstLine.split(':')[1].trim();
        }
      }
    }

    // Detect domain for context-aware quiz generation
    const { domain, category, complexity } = getDomainContext(cleanTopic);
    const isTechTopic = isCodeRelatedTopic(cleanTopic);

    // Build domain-specific instructions
    const domainInstructions = getDomainQuizInstructions(domain, category);

    const prompt = `
      Create a quiz about "${cleanTopic}" with exactly ${numQuestions} questions.
      
      **Domain Context:**
      - Learning Domain: ${domain}
      - Category: ${category}
      - Complexity Level: ${complexity}
      
      ${
        hasContent ? 'Use the following content to create relevant questions:\n' + moduleContent.substring(0, 5000) : ''
      }
      
      Each question should be directly relevant to the topic "${cleanTopic}" and ${
        hasContent ? 'based on the provided content.' : 'a typical course on this subject.'
      }
      
      ${domainInstructions}
      
      **Question Requirements:**
      - A clear and challenging question appropriate for this domain
      - 4 answer options (A, B, C, D) with varying difficulty
      - The correct answer(s)
      - A brief explanation of why the answer is correct
      - A point value (10 points by default, can vary by difficulty)
      - A question type (either "single" for single-choice or "multiple" for multiple-choice)

      **Output Format:**
      Return ONLY the JSON object in this exact format:
      {
        "topic": "${cleanTopic}",
        "questions": [
          {
            "question": "Question text goes here?",
            "answers": ["Answer A", "Answer B", "Answer C", "Answer D"],
            "correctAnswer": ["Answer A"], 
            "explanation": "Explanation of correct answer",
            "point": 10,
            "questionType": "single"
          },
          ...more questions...
        ]
      }
      
      **Critical Requirements:**
      - Exactly ${numQuestions} questions, no more, no less
      - For multiple-choice questions: "correctAnswer": ["Answer A", "Answer C"]
      - Set questionType to "multiple" for multi-answer questions
      - All JSON must be valid
      - Questions must be factually accurate and verifiable
      - Vary difficulty levels across questions`;

    const selectedModel = selectBestModel('quiz-generation', isTechTopic ? 'technical' : 'educational', complexity);

    const resultText = await llmCompletion(prompt, selectedModel);
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('Invalid response format');
    }

    const result = sanitizeJSON(jsonMatch[0]);
    const quizData = typeof result === 'string' ? JSON5.parse(result) : (result as QuizData);

    if (!quizData.topic) {
      quizData.topic = topic;
    }

    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);

    return {
      topic: topic,
      questions: Array.from({ length: numQuestions }, (_, i) => ({
        question: `Question ${i + 1} about ${topic}?`,
        answers: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: ['Option A'],
        explanation: `This is the correct answer for question ${i + 1} about ${topic}.`,
        point: 10,
        questionType: 'single',
      })),
    };
  }
};

export const generateChatResponse = async (message: string, context: Record<string, string>): Promise<string> => {
  try {
    const contextPrompt = `
      Context:
      Topic: ${context['What topic would you like to discuss today?'] || 'General'}
      Level: ${
        context["What's your current knowledge level in this topic? (Beginner/Intermediate/Advanced)"] || 'Intermediate'
      }
      Focus: ${context['What specific aspects would you like to focus on?'] || 'General understanding'}
      
      Be concise and helpful. Answer the following: ${message}
    `;

    const selectedModel = selectBestModel('chat', 'general', 'medium', true);
    return await llmCompletion(contextPrompt, selectedModel);
  } catch (error) {
    console.error('Chat generation error:', error);
    throw new Error('Failed to generate response');
  }
};

export const generateQuiz = async (moduleName: string, numQuestions: number): Promise<SimpleQuizData> => {
  if (!moduleName || typeof moduleName !== 'string') {
    throw new Error('Invalid module name provided');
  }

  try {
    const prompt = `Generate a ${numQuestions} quiz for the topic: "${moduleName}" with 4 options each and the correct answer marked.
    
    **Requirements:**
    - Each question should test understanding of ${moduleName} concepts
    - Include a mix of difficulty levels (basic to advanced)
    - Provide 4 answer options for each question (a, b, c, d format)
    - Clearly mark the correct answer
    - Format as a JSON object:

    {
      "questions": [
        {
          "question": "Question text here?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctIndex": 0,
          "explanation": "Brief explanation of why this is correct"
        }
      ]
    }`;

    const isTechTopic = isCodeRelatedTopic(moduleName);
    const selectedModel = selectBestModel('quiz-generation', isTechTopic ? 'technical' : 'educational', 'medium');

    const text = await llmCompletion(prompt, selectedModel);

    try {
      const result = sanitizeJSON(text);
      const quizData = typeof result === 'string' ? JSON5.parse(result) : (result as SimpleQuizData);

      if (!quizData.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
        throw new Error('Invalid quiz format');
      }

      return quizData;
    } catch (error) {
      console.error('Quiz parsing error:', error);
      return {
        questions: [
          {
            question: `What is the main focus of ${moduleName}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 0,
            explanation: 'This is the correct answer based on the module content.',
          },
          {
            question: `Which of these is NOT related to ${moduleName}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 1,
            explanation: 'This option is unrelated to the topic.',
          },
          {
            question: `What is a key principle in ${moduleName}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 2,
            explanation: 'This principle is fundamental to understanding the topic.',
          },
          {
            question: `How does ${moduleName} apply to real-world scenarios?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 3,
            explanation: 'This reflects the practical application of the concept.',
          },
          {
            question: `What advanced technique is associated with ${moduleName}?`,
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 0,
            explanation: 'This is an advanced technique in this field.',
          },
        ],
      };
    }
  } catch (error) {
    throw new Error(`Failed to generate quiz: ${(error as Error).message}`);
  }
};

export const generateLearningPath = async (
  goal: string,
  options: { type?: string; detailed?: boolean; userData?: UserData } = { type: 'topic', detailed: false }
): Promise<LearningModule[] | string[]> => {
  if (!goal || typeof goal !== 'string') {
    throw new Error('Invalid goal/topic provided');
  }

  const isCareerPath = options.type === 'career';

  try {
    let prompt: string;

    if (isCareerPath) {
      const userContext = options.userData
        ? `
      **User Profile:**
      - Name: ${options.userData.name || 'Not provided'}
      - Age: ${options.userData.age || 'Not provided'}
      - Career Goal: "${options.userData.careerGoal || goal}"
      - Current Skills: ${options.userData.currentSkills && options.userData.currentSkills.length > 0 ? options.userData.currentSkills.join(', ') : 'None specified'}
      - Interests: ${options.userData.interests && options.userData.interests.length > 0 ? options.userData.interests.join(', ') : 'None specified'}
      - Assessment Results: ${options.userData.assessmentAnswers ? JSON.stringify(options.userData.assessmentAnswers) : 'Not completed'}
      `
        : '';

      prompt = `Create a personalized structured learning path for someone who wants to learn about "${goal}".
      ${userContext}
      
      Design a series of modules (between 5-7) that progressively build knowledge from basics to advanced concepts.
      
      Take into account:
      1. The learner's current skills and what they already know
      2. Their interests and learning preferences (from assessment)
      3. Their age and experience level
      4. Their ultimate career goal
      5. Skills they want to develop
      
      Each module should:
      - Build progressively from basics to advanced concepts
      - Be relevant to their specific goal and interests
      - Account for their current skill level
      - Include practical applications
      - Estimate realistic time for completion
      
      Return the result as a JSON array with this structure:
      [
        {
          "title": "Module title",
          "description": "Brief description of what will be covered in this module",
          "estimatedTime": "Estimated time to complete (e.g., '2-3 hours')",
          "content": "Detailed content overview with key points to learn"
        }
      ]
      
      Make sure the content is comprehensive, accurate, and follows a logical progression from fundamentals to more complex topics.`;
    } else {
      prompt = `Generate a comprehensive learning path for: "${goal}"
      Requirements:
      - Create exactly 5 progressive modules
      - Each module should build upon previous knowledge
      - Focus on practical, hands-on learning
      - Include both theoretical and practical aspects
      
      Return ONLY a JSON array with exactly 5 strings in this format:
      ["Module 1: [Clear Title]", "Module 2: [Clear Title]", "Module 3: [Clear Title]", "Module 4: [Clear Title]", "Module 5: [Clear Title]"]
      `;
    }

    const complexity = isCareerPath ? 'high' : 'medium';
    const isTechTopic = isCodeRelatedTopic(goal);

    const selectedModel = selectBestModel('learning-path', isTechTopic ? 'technical' : 'educational', complexity);

    const text = await retry(() => llmCompletion(prompt, selectedModel));

    try {
      if (isCareerPath) {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const jsonString = jsonMatch[0];
          const result = sanitizeJSON(jsonString);
          const modulesData = typeof result === 'string' ? JSON5.parse(result) : (result as LearningModule[]);

          const cleanedModules = (modulesData as LearningModule[]).map((module: LearningModule) => ({
            title: module.title || `Learning ${goal}`,
            description: module.description || `Learn about ${goal}`,
            estimatedTime: module.estimatedTime || '1-2 hours',
            content: module.content || `This module will teach you about ${goal}`,
          }));

          return cleanedModules;
        } else {
          throw new Error('Failed to parse learning path JSON');
        }
      } else {
        const result = sanitizeJSON(text);
        const modules = typeof result === 'string' ? JSON5.parse(result) : result;
        if (!Array.isArray(modules) || modules.length !== 5) {
          throw new Error('Invalid response format');
        }
        return modules as string[];
      }
    } catch (error) {
      console.error('Parsing error:', error);

      if (isCareerPath) {
        return [
          {
            title: `Introduction to ${goal}`,
            description: `Learn the fundamentals of ${goal}`,
            estimatedTime: '1-2 hours',
            content: `This module introduces the basic concepts of ${goal}.`,
          },
          {
            title: `${goal} Fundamentals`,
            description: `Understand the core principles of ${goal}`,
            estimatedTime: '2-3 hours',
            content: `Build a solid foundation in ${goal} by mastering the essential concepts.`,
          },
          {
            title: `Practical ${goal}`,
            description: `Apply your knowledge through practical exercises`,
            estimatedTime: '3-4 hours',
            content: `Practice makes perfect. In this module, you'll apply your theoretical knowledge.`,
          },
          {
            title: `Advanced ${goal}`,
            description: `Dive deeper into advanced concepts`,
            estimatedTime: '3-4 hours',
            content: `Take your skills to the next level with advanced techniques and methodologies.`,
          },
          {
            title: `${goal} in the Real World`,
            description: `Learn how to apply your skills in real-world scenarios`,
            estimatedTime: '2-3 hours',
            content: `Discover how professionals use these skills in industry settings.`,
          },
        ];
      } else {
        return [
          `Module 1: Introduction to ${goal}`,
          `Module 2: Core Concepts of ${goal}`,
          `Module 3: Intermediate ${goal} Techniques`,
          `Module 4: Advanced ${goal} Applications`,
          `Module 5: Real-world ${goal} Projects`,
        ];
      }
    }
  } catch (error) {
    console.error('Error generating learning path:', error);

    if (isCareerPath) {
      return [
        {
          title: `Introduction to ${goal}`,
          description: `Learn the fundamentals of ${goal}`,
          estimatedTime: '1-2 hours',
          content: `This module introduces the basic concepts of ${goal}.`,
        },
        {
          title: `${goal} Fundamentals`,
          description: `Understand the core principles of ${goal}`,
          estimatedTime: '2-3 hours',
          content: `Build a solid foundation in ${goal} by mastering the essential concepts.`,
        },
        {
          title: `Practical ${goal}`,
          description: `Apply your knowledge through practical exercises`,
          estimatedTime: '3-4 hours',
          content: `Practice makes perfect. In this module, you'll apply your theoretical knowledge.`,
        },
        {
          title: `Advanced ${goal}`,
          description: `Dive deeper into advanced concepts`,
          estimatedTime: '3-4 hours',
          content: `Take your skills to the next level with advanced techniques and methodologies.`,
        },
        {
          title: `${goal} in the Real World`,
          description: `Learn how to apply your skills in real-world scenarios`,
          estimatedTime: '2-3 hours',
          content: `Discover how professionals use these skills in industry settings.`,
        },
      ];
    } else {
      return [
        `Module 1: Introduction to ${goal}`,
        `Module 2: Core Concepts of ${goal}`,
        `Module 3: Intermediate ${goal} Techniques`,
        `Module 4: Advanced ${goal} Applications`,
        `Module 5: Real-world ${goal} Projects`,
      ];
    }
  }
};

export const generatePersonalizedCareerPaths = async (userData: UserData): Promise<CareerPath[]> => {
  if (!userData || typeof userData !== 'object') {
    throw new Error('Invalid user data provided');
  }

  try {
    const quizAnalysis = analyzeQuizAnswers(userData.quizAnswers || {});

    const prompt = `
    Create 4 highly personalized career/learning paths for a user with the following profile:
    
    Name: ${userData.name || 'Anonymous'}
    Age: ${userData.age || 'Unknown'}
    Career Goal: "${userData.careerGoal || 'Improve technical skills'}"
    Current Skills: ${JSON.stringify(userData.skills || [])}
    Interests: ${JSON.stringify(userData.interests || [])}
    
    --- Quiz Analysis ---
    ${
      quizAnalysis
        ? `Career Interest Areas:
    Technical Interest: ${quizAnalysis.technical}%
    Creative Interest: ${quizAnalysis.creative}%
    Business Interest: ${quizAnalysis.business}%
    Performance Interest: ${quizAnalysis.performance}%
    Service Interest: ${quizAnalysis.service}%`
        : 'No quiz data provided'
    }
    -------------------
    
    For each career path:
    1. Give it a specific, personalized name that aligns with their career goal, interests, and quiz results
    2. Create exactly 5 focused modules for each path
    3. Make each module build logically on the previous ones
    4. Tailor the content to leverage their existing skills and knowledge
    5. Each career path should have a clear end goal that helps them progress toward their stated career objective
    
    Return EXACTLY 4 career paths in this JSON format:
    [
      {
        "pathName": "Personalized path name based on their profile",
        "description": "A brief description of this career path and how it helps them achieve their goal",
        "difficulty": "beginner|intermediate|advanced",
        "estimatedTimeToComplete": "X months",
        "relevanceScore": 95,
        "modules": [
          {
            "title": "Module 1: Module Title",
            "description": "Brief description of what this module covers",
            "estimatedHours": 8,
            "keySkills": ["skill1", "skill2"]
          }
        ]
      }
    ]`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 45000)
    );

    const selectedModel = 'llama-3.3-70b-versatile';
    const resultPromise = retry(() => llmCompletion(prompt, selectedModel));
    const text = await Promise.race([resultPromise, timeoutPromise]);

    try {
      const result = sanitizeJSON(text);
      const careerPaths = typeof result === 'string' ? JSON5.parse(result) : (result as CareerPath[]);

      if (!Array.isArray(careerPaths) || careerPaths.length === 0) {
        throw new Error('Invalid career paths format');
      }

      const normalizedPaths = careerPaths.slice(0, 4);
      while (normalizedPaths.length < 4) {
        const basePath = { ...normalizedPaths[0] };
        basePath.pathName = `Alternative ${basePath.pathName}`;
        basePath.relevanceScore = Math.max(1, (basePath.relevanceScore || 80) - 10);
        normalizedPaths.push(basePath);
      }

      return normalizedPaths.map((path) => ({
        pathName: path.pathName || 'Career Path',
        description: path.description || `A learning path toward ${userData.careerGoal}`,
        difficulty: ['beginner', 'intermediate', 'advanced'].includes(path.difficulty)
          ? (path.difficulty as 'beginner' | 'intermediate' | 'advanced')
          : 'intermediate',
        estimatedTimeToComplete: path.estimatedTimeToComplete || '3 months',
        relevanceScore: typeof path.relevanceScore === 'number' ? Math.max(0, Math.min(100, path.relevanceScore)) : 85,
        modules: Array.isArray(path.modules)
          ? (path.modules as CareerPathModule[]).slice(0, 5).map((module: CareerPathModule, idx: number) => ({
              title: module.title || `Module ${idx + 1}`,
              description: module.description || 'Learn important skills in this area',
              estimatedHours: typeof module.estimatedHours === 'number' ? module.estimatedHours : 8,
              keySkills: Array.isArray(module.keySkills) ? module.keySkills : [],
            }))
          : generateDefaultModules(path.pathName || 'Career Path', 5),
      }));
    } catch (error) {
      console.error('Career path parsing error:', error);
      return simpleFallbackCareerPaths(userData);
    }
  } catch (error) {
    console.error('Error generating personalized career paths:', error);
    return simpleFallbackCareerPaths(userData);
  }
};

const simpleFallbackCareerPaths = (userData: UserData): CareerPath[] => {
  const goal = userData.careerGoal || 'Career Development';

  return [
    {
      pathName: `Getting Started with ${goal}`,
      description: `Fundamental path to begin your journey in ${goal}`,
      difficulty: 'beginner',
      estimatedTimeToComplete: '2 months',
      relevanceScore: 95,
      modules: [
        {
          title: 'Module 1: Understanding the Basics',
          description: 'Learn core concepts and terminology',
          estimatedHours: 6,
          keySkills: ['Fundamentals', 'Terminology'],
        },
        {
          title: 'Module 2: Essential Skills Development',
          description: 'Build the must-have skills for this field',
          estimatedHours: 8,
          keySkills: ['Core skills', 'Practical basics'],
        },
        {
          title: 'Module 3: Your First Project',
          description: "Apply what you've learned in a simple project",
          estimatedHours: 10,
          keySkills: ['Project work', 'Application'],
        },
        {
          title: 'Module 4: Problem-Solving Techniques',
          description: 'Learn to overcome common challenges',
          estimatedHours: 8,
          keySkills: ['Problem solving', 'Troubleshooting'],
        },
        {
          title: 'Module 5: Next Steps and Growth',
          description: 'Plan your continued learning journey',
          estimatedHours: 6,
          keySkills: ['Career planning', 'Continuous learning'],
        },
      ],
    },
    {
      pathName: `Intermediate ${goal}`,
      description: `Build on your existing knowledge to advance in ${goal}`,
      difficulty: 'intermediate',
      estimatedTimeToComplete: '3 months',
      relevanceScore: 85,
      modules: generateDefaultModules('Intermediate Path', 5),
    },
    {
      pathName: `${goal} Specialization`,
      description: `Focus on specialized areas within ${goal}`,
      difficulty: 'advanced',
      estimatedTimeToComplete: '4 months',
      relevanceScore: 80,
      modules: generateDefaultModules('Specialization', 5),
    },
    {
      pathName: `Practical ${goal} Applications`,
      description: `Apply your knowledge in real-world scenarios`,
      difficulty: 'intermediate',
      estimatedTimeToComplete: '3 months',
      relevanceScore: 75,
      modules: generateDefaultModules('Practical Applications', 5),
    },
  ];
};

export const generateAINudges = async (
  userData: UserData | null,
  assessmentData: Assessment[] = [],
  pathData: CareerPathData | null = null
): Promise<AINudge[]> => {
  if (!userData) {
    return [];
  }

  try {
    const prompt = `Generate 3 personalized learning nudges for a student with the following profile:
    
    Career Path: ${pathData?.careerName || 'Learning journey'}
    Progress: ${pathData?.progress || 0}%
    Recent Assessments: ${
      assessmentData?.map((a) => `Score: ${a.score}, Accuracy: ${a.accuracy || 0}%`).join('; ') ||
      'No recent assessments'
    }
    Completed Modules: ${pathData?.completedModules?.length || 0}
    
    Return exactly 3 nudges as a JSON array with this structure:
    [
      {
        "type": "tip" | "recommendation" | "challenge",
        "text": "The motivational/insightful message",
        "actionText": "Optional call to action button text", 
        "icon": "bulb" | "rocket"
      }
    ]
    
    Make nudges specific to their progress and performance.
    Keep texts concise (max 150 characters).
    One nudge should be a "challenge" type.`;

    const selectedModel = selectBestModel('nudges', 'educational', 'low', true);
    const response = await llmCompletion(prompt, selectedModel);
    const result = sanitizeJSON(response);

    return typeof result === 'string' ? JSON5.parse(result) : (result as AINudge[]);
  } catch (error) {
    console.error('Error generating nudges:', error);
    return [
      {
        type: 'tip',
        text: 'Keep learning consistently to maintain your progress!',
        icon: 'bulb',
      },
      {
        type: 'recommendation',
        text: 'Review previous modules to reinforce your knowledge.',
        icon: 'bulb',
      },
      {
        type: 'challenge',
        text: 'Try completing a quiz with 100% accuracy as your next goal.',
        icon: 'rocket',
      },
    ];
  }
};

export const generateCareerSummary = async ({
  user,
  careerPath,
  assessments,
}: CareerSummaryParams): Promise<string> => {
  try {
    const prompt = `You are SkillCompass – an AI career coach and motivational mentor for students on their learning journey.
    
    Generate a detailed, emotionally supportive, and strategic career summary report for the following user based on their current learning progress, completed modules, quiz feedback, career goal, and interests.
    
    ### Instructions:
    Write the output as a **personalized narrative**, not a list. Your tone should be **friendly, supportive, and motivating** – like a personal coach who believes in the student and wants them to grow.
    
    🔹 The report must include:
    
    1. A warm and uplifting **introduction** using the user's name
    2. A recap of their **progress so far** – modules completed, percentage progress, etc.
    3. A reflection on their **performance** – quiz scores and strengths you've noticed
    4. Clear guidance on **areas to improve or skills to focus on next**
    5. A **vision of their future** – if they keep working at this pace, what can they achieve? What should their next big goal be?
    6. Your **evaluation of job/internship readiness** – are they ready to apply? What roles suit them now?
    7. Recommended **next steps or strategies** to speed up progress – projects, certifications, habits, resources
    8. A strong **motivational message** affirming that they're on the right track and can achieve even more
    9. End with **3 AI-powered nudges** (short, sharp, practical tips for immediate action)
    
    ### User Profile:
    - Name: ${user.name}
    - Career Goal: ${careerPath.careerName}
    - Interests: ${user.interests?.join(', ') || 'Not specified'}
    - Skills: ${user.skills?.join(', ') || 'Not specified'}
    
    ### Learning Journey:
    - Total Modules: ${careerPath.modules?.length || 0}
    - Completed Modules: ${careerPath.completedModules?.length || 0}
    - Overall Progress: ${careerPath.progress}%
    - Recommended Skills: ${careerPath.recommendedSkills?.join(', ') || 'None listed'}
    
    ### Quiz Assessments:
    ${assessments.map((a) => `- ${a.moduleName}: Scored ${a.score}/10 – ${a.feedback}`).join('\n')}
    
    ---
    
    Generate the report as if you're speaking directly to the user.
    
    Avoid bullet points in the final report. Make it natural, inspiring, and rich in value.`;

    const selectedModel = 'llama-3.3-70b-versatile';
    return await llmCompletion(prompt, selectedModel);
  } catch (error) {
    console.error('❌ Career Summary Generation Error:', error);
    throw error;
  }
};

export const getResponsiveContent = (
  content: ModuleContent | null,
  deviceType: string = 'desktop'
): ResponsiveContent | null => {
  if (!content) return null;

  let responsiveContent: ResponsiveContent = { ...content };

  if (deviceType === 'mobile') {
    if (responsiveContent.sections) {
      responsiveContent.sections = responsiveContent.sections.map((section) => {
        let mobileContent = section.content;
        if (section.content && section.content.length > 500) {
          mobileContent = section.content.substring(0, 500) + '...';
        }

        return {
          ...section,
          content: mobileContent,
          codeExample: section.codeExample
            ? {
                ...section.codeExample,
                code:
                  section.codeExample.code.length > 300
                    ? section.codeExample.code.substring(0, 300) + '\n// ... more code ...'
                    : section.codeExample.code,
              }
            : null,
        };
      });
    }
  } else if (deviceType === 'tablet') {
    if (responsiveContent.sections) {
      responsiveContent.sections = responsiveContent.sections.map((section) => {
        let tabletContent = section.content;
        if (section.content && section.content.length > 1000) {
          tabletContent = section.content.substring(0, 1000) + '...';
        }

        return {
          ...section,
          content: tabletContent,
          codeExample: section.codeExample
            ? {
                ...section.codeExample,
                code:
                  section.codeExample.code.length > 500
                    ? section.codeExample.code.substring(0, 500) + '\n// ... more code ...'
                    : section.codeExample.code,
              }
            : null,
        };
      });
    }
  }

  return responsiveContent;
};

export const detectDeviceType = (userAgent: string, screenWidth: number = 1920): string => {
  const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  if (isMobileDevice) {
    if (/iPad|Tablet/i.test(userAgent)) {
      return 'tablet';
    }
    return 'mobile';
  }

  if (screenWidth < 768) {
    return 'mobile';
  } else if (screenWidth < 1024) {
    return 'tablet';
  }

  return 'desktop';
};

export const canUseAdvancedModels = async (): Promise<boolean> => {
  try {
    const startTime = Date.now();
    const response = await fetch('https://api.groq.com/openai/v1/models', {
      method: 'HEAD',
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
    });
    const endTime = Date.now();
    const latency = endTime - startTime;

    return response.ok && latency < 300;
  } catch (error) {
    console.warn('Connection check failed, defaulting to moderate models', error);
    return false;
  }
};

export const generateTopicElaboration = async (
  topic: string,
  moduleName: string = '',
  options: Record<string, unknown> = {}
): Promise<ElaborationContent> => {
  if (!topic || typeof topic !== 'string') {
    throw new Error('Invalid topic provided');
  }

  const fullTopic = moduleName ? `${moduleName}: ${topic}` : topic;

  try {
    const elaborationOptions = {
      detailed: true,
      includeExamples: true,
      constrainToFacts: true,
      preventHallucination: true,
      ...options,
    };

    const isTechTopic = isCodeRelatedTopic(fullTopic);
    const isKeyPoints = fullTopic.toLowerCase().includes('key points');

    const preferredModel = 'llama-3.1-8b-instant';
    const fallbackModels = ['llama3-70b-8192', 'llama-3.3-70b-versatile', 'gemma2-9b-it'];

    const prompt = `
    Provide a detailed, educational elaboration on the topic: "${fullTopic}"
    
    Requirements:
    - Be factual, precise, and educational
    - Keep the tone academic but engaging
    - Focus on clarifying complex concepts
    - Include practical examples ${isTechTopic ? 'and code samples' : ''}
    - Highlight key insights that aren't obvious
    - Match the visual theme: dark background with amber/orange highlight colors
    
    ${isKeyPoints ? 'This topic is asking for key points, so organize content as concise, actionable insights' : ''}
    ${isTechTopic ? 'Since this is a technical topic, include relevant code examples with explanations' : ''}
    
    Return your response in this exact JSON format:
    {
      "title": "Concise title for this elaboration",
      "sections": [
        {
          "title": "Section Heading",
          "content": "Detailed explanation with examples and clarifications",
          "keyPoints": ["Key insight 1", "Key insight 2", "Key insight 3"],
          ${
            isTechTopic
              ? `
          "codeExample": {
            "language": "appropriate language",
            "code": "// Code sample\\nfunction example() {\\n  // Implementation\\n}",
            "explanation": "How this code works"
          }`
              : '"codeExample": null'
          }
        }
      ],
      "modelUsed": "${preferredModel}"
    }`;

    let elaborationContent: ElaborationContent | null = null;
    let success = false;

    try {
      console.log(`Generating elaboration using ${preferredModel}`);
      const text = await llmCompletion(prompt, preferredModel);
      const result = sanitizeJSON(text);
      elaborationContent = typeof result === 'string' ? JSON5.parse(result) : (result as ElaborationContent);

      if (elaborationContent && !elaborationContent.modelUsed) {
        elaborationContent.modelUsed = preferredModel;
      }

      success = true;
      console.log(`Successfully generated content with ${preferredModel}`);
    } catch (primaryError) {
      console.warn(`Primary model ${preferredModel} failed: ${(primaryError as Error).message}`);

      for (const fallbackModel of fallbackModels) {
        if (success) break;

        try {
          debugLog(`Trying fallback model: ${fallbackModel}`);

          const fallbackPrompt = prompt.replace(`"modelUsed": "${preferredModel}"`, `"modelUsed": "${fallbackModel}"`);

          const text = await llmCompletion(fallbackPrompt, fallbackModel);
          const result = sanitizeJSON(text);
          elaborationContent = typeof result === 'string' ? JSON5.parse(result) : (result as ElaborationContent);

          if (!elaborationContent || !elaborationContent.sections || elaborationContent.sections.length === 0) {
            throw new Error('Invalid content structure from fallback model');
          }

          if (!elaborationContent.modelUsed) {
            elaborationContent.modelUsed = fallbackModel;
          }

          success = true;
          debugLog(`Successfully generated content with fallback model ${fallbackModel}`);
        } catch (fallbackError) {
          console.warn(`Fallback model ${fallbackModel} failed: ${(fallbackError as Error).message}`);
        }
      }

      if (!success) {
        console.error('All models failed to generate elaboration');
        throw new Error('All models failed to generate elaboration');
      }
    }

    if (elaborationContent) {
      elaborationContent = themeElaborationContent(elaborationContent);
    }

    return elaborationContent as ElaborationContent;
  } catch (error) {
    console.error('Elaboration generation error:', error);

    return {
      title: topic,
      modelUsed: 'Fallback Content',
      error: "We couldn't generate the elaboration. Please try again.",
      sections: [
        {
          title: 'Unable to Elaborate',
          content: `We're having trouble generating detailed content for "${topic}". This might be due to temporary issues with our AI service.`,
          keyPoints: [
            'Try again in a few moments',
            'Try a more specific topic',
            'Explore other sections of the module',
          ],
        },
      ],
    };
  }
};

export const testModelFallback = async (): Promise<TestResult> => {
  debugLog('Testing model fallback mechanism...');

  try {
    const result = await llmCompletion('Generate a simple greeting', 'invalid-model-name');
    debugLog('Test completed with result', {
      preview: result.substring(0, 50) + '...',
    });
    return { success: true, message: 'Fallback mechanism working correctly' };
  } catch (error) {
    debugLog('Fallback test failed', { error: (error as Error).message });
    return { success: false, message: (error as Error).message };
  }
};

// ==================== GROQ SERVICE FUNCTIONS ====================

export interface CountTokensResponse {
  totalTokens: number;
}

export interface GenerateContentRequest {
  messages: ChatMessage[];
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
}

export interface GenerateContentResponse {
  choices: Array<{
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

/**
 * Count tokens for a given list of messages
 * Note: Groq doesn't have a dedicated token counting API, so we estimate based on usage
 */
export async function countTokens(messages: ChatMessage[]): Promise<CountTokensResponse> {
  try {
    // Since Groq doesn't have a dedicated token counting endpoint,
    // we'll return an estimate based on character count (rough approximation)
    let totalCharacters = 0;
    messages.forEach((msg) => {
      totalCharacters += (msg.content || msg.message || '').length;
    });
    // Rough estimate: ~4 characters per token
    return { totalTokens: Math.ceil(totalCharacters / 4) };
  } catch (error) {
    console.error('Error counting tokens:', error);
    throw error;
  }
}

/**
 * Generate content using Groq API
 */
export async function generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: request.messages,
        temperature: request.temperature || 0.7,
        max_tokens: request.max_tokens || 2048,
        top_p: request.top_p || 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // Handle specific error cases
      if (response.status === 429) {
        const errorMessage = (errorData as any).error?.message || 'API quota exceeded';
        throw new Error(`Rate limit exceeded: ${errorMessage}. Please try again later.`);
      }

      if (response.status === 400) {
        throw new Error(`Invalid request: ${(errorData as any).error?.message || 'Bad request format'}`);
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error('Authentication failed. Please check your API key.');
      }

      throw new Error(
        `Groq API error (${response.status}): ${(errorData as any).error?.message || response.statusText}`
      );
    }

    return await response.json();
  } catch (error) {
    console.error('Error generating content:', error);
    throw error;
  }
}

/**
 * Send a chat message and get response
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  generationConfig?: Partial<GenerateContentRequest>
): Promise<string> {
  try {
    const response = await generateContent({
      messages: messages,
      temperature: generationConfig?.temperature || 0.7,
      max_tokens: generationConfig?.max_tokens || 2048,
      top_p: generationConfig?.top_p || 0.95,
    });

    if (response.choices && response.choices.length > 0) {
      return response.choices[0].message.content;
    }

    throw new Error('No response from Groq API');
  } catch (error) {
    console.error('Error in sendChatMessage:', error);
    throw error;
  }
}

/**
 * Create a system message for career guidance
 */
// Domain-specific system prompts for universal learning guidance
const DOMAIN_SYSTEM_PROMPTS: Record<string, string> = {
  technology: `You are an expert technology mentor with extensive knowledge of:
- Programming languages and frameworks
- Software development best practices
- Cloud computing and DevOps
- System architecture and design patterns
- Technology trends and emerging tools
- Code quality and optimization
- Debugging and problem-solving
- Technology career paths and roles
- Industry standards and certifications

Provide personalized, actionable technical guidance based on user's questions.
Be encouraging, practical, and specific with code examples when relevant.
Consider current tech trends and market demands.`,

  business: `You are an expert business advisor with extensive knowledge of:
- Business strategy and planning
- Market analysis and competitive landscape
- Leadership and management principles
- Financial planning and budgeting
- Project management methodologies
- Entrepreneurship and startups
- Organizational development
- Business communication and negotiation
- Industry trends and opportunities

Provide personalized, actionable business advice based on user's questions.
Be encouraging, practical, and strategic in your recommendations.
Consider current market conditions and emerging opportunities.`,

  science: `You are an expert science educator with extensive knowledge of:
- Scientific research methodologies
- Laboratory techniques and safety
- Data analysis and interpretation
- Academic publication and peer review
- Scientific communication and presentation
- Career paths in research
- Emerging scientific discoveries
- Ethics in scientific research
- Interdisciplinary applications

Provide clear, accurate scientific guidance based on user's questions.
Be encouraging, thorough, and evidence-based in your recommendations.
Consider cutting-edge developments in the field.`,

  healthcare: `You are an expert healthcare advisor with extensive knowledge of:
- Medical education and training
- Clinical best practices and patient care
- Healthcare technologies and innovations
- Professional development in healthcare
- Work-life balance in demanding fields
- Healthcare systems and administration
- Patient communication and empathy
- Continuing medical education
- Healthcare career advancement

Provide personalized, compassionate healthcare guidance based on user's questions.
Be encouraging, evidence-based, and patient-centered in your recommendations.
Consider current healthcare trends and innovations.`,

  creative: `You are an expert creative mentor with extensive knowledge of:
- Artistic techniques and creative processes
- Portfolio development and presentation
- Industry standards and best practices
- Creative problem-solving
- Design thinking and innovation
- Professional opportunities and networking
- Collaboration and feedback
- Technology tools for creators
- Building a creative brand

Provide personalized, inspiring creative guidance based on user's questions.
Be encouraging, practical, and supportive in your recommendations.
Consider current creative trends and market demands.`,

  education: `You are an expert educational advisor with extensive knowledge of:
- Teaching methodologies and pedagogy
- Curriculum design and development
- Student engagement and motivation
- Educational technologies and tools
- Assessment and evaluation
- Professional development for educators
- Educational leadership
- Learning sciences and cognitive psychology
- Educational trends and innovations

Provide clear, supportive educational guidance based on user's questions.
Be encouraging, practical, and evidence-based in your recommendations.
Consider current educational best practices and innovations.`,

  finance: `You are an expert financial advisor with extensive knowledge of:
- Investment strategies and portfolio management
- Financial planning and budgeting
- Risk management and insurance
- Tax optimization and compliance
- Retirement planning
- Banking and credit systems
- Market analysis and economic trends
- Financial literacy and education
- Wealth management

Provide personalized, practical financial guidance based on user's questions.
Be encouraging, comprehensive, and data-driven in your recommendations.
Consider current market conditions and regulatory environment.`,

  general: `You are an expert mentor and learning coach with extensive knowledge of:
- Learning strategies and effective study techniques
- Goal setting and achievement
- Problem-solving and critical thinking
- Communication and interpersonal skills
- Time management and productivity
- Personal development and growth
- Resilience and motivation
- Professional and academic excellence
- Industry insights and opportunities

Provide personalized, actionable guidance based on user's questions.
Be encouraging, practical, and supportive in your recommendations.
Consider the user's specific context and goals.`,
};

export function createDomainGuidanceSystemMessage(domain: string = 'general'): ChatMessage {
  return {
    role: 'system',
    content: DOMAIN_SYSTEM_PROMPTS[domain] || DOMAIN_SYSTEM_PROMPTS.general,
  };
}

export function createCareerGuidanceSystemMessage(): ChatMessage {
  return createDomainGuidanceSystemMessage('business');
}

/**
 * Format messages for Groq API
 */
export function formatMessagesForGroq(
  messages: Array<{
    id: string;
    sender: 'user' | 'bot';
    message: string;
    timestamp: Date;
  }>
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.message,
  }));
}

// ==================== VIDEO RECOMMENDATIONS ====================

interface VideoRecommendation {
  title: string;
  channel: string;
  duration?: string;
  link: string;
  imageUrl: string;
  keywords: string[];
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  relevanceScore: number;
  date?: string;
  snippet?: string;
}

interface VideoRecommendationsResponse {
  moduleName: string;
  topicSummary: string;
  videos: VideoRecommendation[];
}

/**
 * Generate video recommendations based on module content using Groq API
 * Analyzes content and provides real YouTube video links with thumbnails
 */
export const generateVideoRecommendations = async (
  moduleName: string,
  content: string,
  options: { limit?: number } = { limit: 6 }
): Promise<VideoRecommendationsResponse> => {
  if (!moduleName || typeof moduleName !== 'string') {
    throw new Error('Invalid module name provided');
  }

  try {
    console.log(`🎓 Generating video recommendations for: "${moduleName}"`);

    const isTechTopic = isCodeRelatedTopic(moduleName);
    const { domain, category } = getDomainContext(moduleName);
    const limit = options.limit || 6;

    // Step 1: Use AI to generate search keywords from content
    const keywordPrompt = `Analyze this educational content and generate 2-3 highly specific YouTube search queries for finding related tutorial videos. Focus on practical, searchable terms.

MODULE: "${moduleName}"
CATEGORY: ${category}

CONTENT SUMMARY:
${content.substring(0, 500)}

Return JSON with ONLY this format - no explanation:
{
  "searchQueries": [
    "specific youtube search query 1",
    "specific youtube search query 2",
    "specific youtube search query 3"
  ]
}`;

    const keywordModel = selectBestModel('content-analysis', domain, 'fast');
    const keywordText = await llmCompletion(keywordPrompt, keywordModel);
    const keywordResult = sanitizeJSON(keywordText);
    const queries = (typeof keywordResult === 'string' ? JSON5.parse(keywordResult) : keywordResult) as {
      searchQueries: string[];
    };

    const searchQuery = queries.searchQueries?.[0] || `${moduleName} tutorial course`;
    console.log(`🔎 Generated search query: "${searchQuery}"`);

    // Step 2: Search for videos using the SerpAPI integration (if available) or fallback
    const videos = await searchYouTubeVideos(searchQuery, limit);
    console.log(`📊 Found ${videos.length} videos from SerpAPI`);

    // Step 3: Analyze and rank videos using AI
    const rankingPrompt = `Rank these YouTube videos by relevance to the topic "${moduleName}". 
    Return a JSON array with only relevanceScore and difficulty fields for each video.
    Videos: ${JSON.stringify(videos.slice(0, 3))}
    
    Return JSON array: [{"index": 0, "relevanceScore": 0.95, "difficulty": "beginner"}, ...]`;

    const rankModel = selectBestModel('content-analysis', domain, 'fast');
    const rankText = await llmCompletion(rankingPrompt, rankModel);
    const ranking = sanitizeJSON(rankText);
    const scores = Array.isArray(ranking) ? ranking : [];

    // Merge video data with AI scores
    const enrichedVideos = videos.map((video, idx) => {
      const score = scores.find((s: any) => s.index === idx) || {};
      return {
        ...video,
        relevanceScore: score.relevanceScore || 0.8,
        difficulty: score.difficulty || 'beginner',
      };
    });

    const topicSummary = `Based on "${moduleName}", here are the best video tutorials to enhance your learning and understanding.`;

    return {
      moduleName,
      topicSummary,
      videos: enrichedVideos.slice(0, limit),
    };
  } catch (error) {
    console.error('Error generating video recommendations:', error);
    // Return empty videos array - user can still click to search
    return {
      moduleName,
      topicSummary: `Video tutorials for ${moduleName}`,
      videos: [],
    };
  }
};

/**
 * Search YouTube videos using google.serper.dev API
 */
async function searchYouTubeVideos(query: string, limit: number): Promise<VideoRecommendation[]> {
  try {
    const serperApiKey = import.meta.env.VITE_SERPER_API_KEY;

    if (!serperApiKey) {
      console.warn('⚠️ Serper API key not configured in .env');
      return [];
    }

    console.log('🔍 Fetching videos from Serper API:', query);

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': serperApiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        type: 'videos',
        num: limit,
      }),
    });

    if (!response.ok) {
      console.error(`❌ Serper API error: ${response.status} ${response.statusText}`);
      return [];
    }

    const data = await response.json();
    console.log('📹 Serper API response:', data);

    // Handle the response structure
    if (!data.videos || !Array.isArray(data.videos)) {
      console.warn('⚠️ No videos found in Serper API response');
      return [];
    }

    // Map Serper video format to our VideoRecommendation format
    const videos = data.videos.map((video: any, idx: number) => {
      // Extract video ID from YouTube link
      const videoId = video.link?.split('v=')[1]?.split('&')[0] || '';
      const thumbnailUrl = video.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : '');

      return {
        title: video.title || 'Untitled Video',
        channel: video.channel || 'YouTube Channel',
        duration: video.duration,
        link: video.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        imageUrl: thumbnailUrl,
        keywords: [query],
        relevanceScore: Math.max(0.7, 0.95 - idx * 0.08),
        date: video.date,
        snippet: video.snippet || '',
      };
    });

    console.log(`✅ Successfully retrieved ${videos.length} videos`);
    return videos;
  } catch (error) {
    console.error('❌ Serper API search error:', error);
    if (error instanceof Error) {
      console.error('Error details:', error.message);
    }
    return [];
  }
}

// ==================== CHAT HISTORY FUNCTIONS ====================

const STORAGE_KEY = 'career_guidance_chat_sessions';
const CURRENT_SESSION_KEY = 'career_guidance_current_session';

/**
 * Get all chat sessions from localStorage
 */
export function getAllChatSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];

    const sessions = JSON.parse(data);
    // Convert date strings back to Date objects
    return sessions.map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error('Error loading chat sessions:', error);
    return [];
  }
}

/**
 * Get a specific chat session by ID
 */
export function getChatSession(sessionId: string): ChatSession | null {
  const sessions = getAllChatSessions();
  return sessions.find((s) => s.id === sessionId) || null;
}

/**
 * Create a new chat session
 */
export function createChatSession(title?: string): ChatSession {
  const session: ChatSession = {
    id: uuidv4(),
    title: title || `Chat ${new Date().toLocaleDateString()}`,
    messages: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    tokenCount: 0,
  };

  saveChatSession(session);
  setCurrentSessionId(session.id);
  return session;
}

/**
 * Save a chat session
 */
export function saveChatSession(session: ChatSession): void {
  try {
    const sessions = getAllChatSessions();
    const index = sessions.findIndex((s) => s.id === session.id);

    if (index >= 0) {
      sessions[index] = session;
    } else {
      sessions.push(session);
    }

    // Keep only last 50 sessions
    const recentSessions = sessions.slice(-50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recentSessions));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
}

/**
 * Add message to a chat session
 */
export function addMessageToSession(sessionId: string, message: ChatMessage): ChatSession | null {
  const session = getChatSession(sessionId);
  if (!session) return null;

  session.messages.push(message);
  session.updatedAt = new Date();

  // Generate auto title if it's the first user message
  if (session.messages.length === 1 && message.sender === 'user' && session.title.includes('Chat ')) {
    session.title = (message.message || '').substring(0, 50) + ((message.message || '').length > 50 ? '...' : '');
  }

  saveChatSession(session);
  return session;
}

/**
 * Update message token count
 */
export function updateSessionTokenCount(sessionId: string, tokenCount: number): void {
  const session = getChatSession(sessionId);
  if (session) {
    session.tokenCount = tokenCount;
    session.updatedAt = new Date();
    saveChatSession(session);
  }
}

/**
 * Delete a chat session
 */
export function deleteChatSession(sessionId: string): void {
  try {
    const sessions = getAllChatSessions();
    const filtered = sessions.filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));

    // If deleted session is current, switch to most recent
    if (getCurrentSessionId() === sessionId) {
      const currentSession = filtered[filtered.length - 1];
      setCurrentSessionId(currentSession?.id || '');
    }
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
}

/**
 * Clear all messages from a session
 */
export function clearSessionMessages(sessionId: string): ChatSession | null {
  const session = getChatSession(sessionId);
  if (session) {
    session.messages = [];
    session.updatedAt = new Date();
    saveChatSession(session);
    return session;
  }
  return null;
}

/**
 * Get current session ID
 */
export function getCurrentSessionId(): string {
  try {
    return localStorage.getItem(CURRENT_SESSION_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Set current session ID
 */
export function setCurrentSessionId(sessionId: string): void {
  try {
    localStorage.setItem(CURRENT_SESSION_KEY, sessionId);
  } catch (error) {
    console.error('Error setting current session:', error);
  }
}

/**
 * Get current session
 */
export function getCurrentSession(): ChatSession | null {
  const sessionId = getCurrentSessionId();
  return sessionId ? getChatSession(sessionId) : null;
}

/**
 * Export chat session as text
 */
export function exportSessionAsText(session: ChatSession): string {
  let text = `Career Guidance Chat - ${session.title}\n`;
  text += `Created: ${session.createdAt.toLocaleString()}\n`;
  text += `\n${'='.repeat(50)}\n\n`;

  session.messages.forEach((msg) => {
    const sender = msg.sender === 'user' ? 'You' : 'Career Advisor';
    text += `${sender} (${msg.timestamp?.toLocaleTimeString()}):\n`;
    text += `${msg.message || msg.content}\n\n`;
  });

  return text;
}

/**
 * Export chat session as JSON
 */
export function exportSessionAsJSON(session: ChatSession): string {
  return JSON.stringify(session, null, 2);
}

// ==================== DEMO RESPONSES ====================

const demoResponses: Record<string, string> = {
  'market opportunities': `Based on your interest in market opportunities, here are some key insights for your career:

**Current Market Trends:**
- Remote work continues to shape job markets globally
- AI and machine learning skills are in high demand
- Full-stack development remains competitive but well-compensated
- Data science and analytics roles are expanding rapidly

**Growth Sectors:**
- Cloud computing (AWS, Azure, GCP)
- Cybersecurity
- Healthcare technology
- Financial technology (FinTech)
- Sustainable technology (Green tech)

**Recommendations:**
1. Build expertise in emerging technologies relevant to your field
2. Network actively on platforms like LinkedIn
3. Consider certifications to validate your skills
4. Stay updated with industry trends through podcasts and blogs
5. Contribute to open-source projects for visibility

Would you like specific recommendations for your current skill set?`,

  'skills develop': `Great question about skill development! Here's a strategic approach:

**Technical Skills to Prioritize:**
- Programming languages (Python, JavaScript, TypeScript)
- Cloud platforms (AWS, Azure, GCP)
- Data analysis and visualization
- API design and REST/GraphQL
- Database management (SQL and NoSQL)

**Soft Skills (Equally Important):**
- Communication and presentation
- Project management
- Leadership and mentoring
- Problem-solving and critical thinking
- Time management

**Learning Path:**
1. **Month 1-2:** Master fundamentals of your chosen area
2. **Month 3-4:** Build 2-3 project portfolio pieces
3. **Month 5-6:** Contribute to open-source or freelance projects
4. **Month 7+:** Advanced topics and specialization

**Resources:**
- Online courses: Coursera, Udemy, Pluralsight
- Hands-on practice: HackerRank, LeetCode, GitHub
- Communities: Stack Overflow, Dev.to, GitHub Discussions

What specific area would you like to focus on?`,

  'career path': `Here's a comprehensive guide to career path planning:

**Career Development Stages:**

**Stage 1: Foundation (0-2 years)**
- Learn core skills and technologies
- Work on diverse projects
- Build your professional network
- Create a portfolio

**Stage 2: Specialization (2-5 years)**
- Develop expertise in your chosen area
- Take on more responsibility
- Build leadership experience
- Establish thought leadership

**Stage 3: Senior/Lead (5+ years)**
- Mentor junior team members
- Architectural decisions and strategy
- Cross-team collaboration
- Leadership and management path OR deep technical expertise

**Career Paths to Consider:**
1. **Individual Contributor Track:** Specialist → Senior Specialist → Principal Engineer
2. **Management Track:** Team Lead → Manager → Director
3. **Hybrid Track:** Combine technical and leadership growth

**Questions to Ask Yourself:**
- Do you prefer hands-on technical work or team leadership?
- What industries excite you?
- Are you interested in startups or established companies?
- Would you consider freelancing or entrepreneurship?

Let's discuss which path aligns with your goals!`,

  'salary negotiate': `Salary negotiation is a crucial skill. Here's how to approach it:

**Before Negotiations:**
1. Research market rates (Glassdoor, Payscale, Levels.fyi)
2. Document your achievements and impact
3. Get offers from multiple companies
4. Know your minimum acceptable salary
5. Understand total compensation (bonus, equity, benefits)

**During Negotiation:**
- Be confident but professional
- Justify your ask with data and achievements
- Don't accept the first offer
- Negotiate total compensation, not just base salary
- Get everything in writing

**Key Points to Emphasize:**
- Years of experience and expertise
- Successful projects you've led
- Impact and measurable results
- Unique skills and certifications
- Market rates for your position

**Negotiation Tips:**
1. Always negotiate (15-25% increase is normal)
2. Have a range, not a fixed number
3. Be willing to walk away
4. Consider non-monetary benefits
5. Time it right (during offer phase or annual reviews)

**Compensation Components:**
- Base salary
- Annual bonus (10-20%)
- Stock options/equity
- Sign-on bonus
- Health insurance
- Retirement plans
- PTO and flexible work

What stage are you at in your negotiation?`,

  default: `I'm your AI Career Guidance Assistant! I can help you with:

✓ Career path planning and strategy
✓ Skills development recommendations
✓ Interview preparation tips
✓ Salary negotiation guidance
✓ Work-life balance advice
✓ Networking strategies
✓ Industry trends and opportunities
✓ Professional development goals

Ask me anything about your career journey, and I'll provide personalized guidance based on best practices and market insights.

What would you like to explore first?`,
};

/**
 * Get a demo response based on the user's message
 */
export function getDemoResponse(userMessage: string): string {
  const lowerMessage = userMessage.toLowerCase();

  // Find matching response
  for (const [key, value] of Object.entries(demoResponses)) {
    if (key !== 'default' && lowerMessage.includes(key)) {
      return value;
    }
  }

  // Return default if no match
  return demoResponses.default;
}

/**
 * Check if we should use demo mode
 */
export function shouldUseDemoMode(): boolean {
  // Check if explicitly enabled via localStorage or environment
  const demoMode = localStorage.getItem('use_demo_mode');
  return demoMode === 'true' || import.meta.env.VITE_DEMO_MODE === 'true';
}

// ==================== RESUME EXTRACTION FUNCTIONS ====================

/**
 * Analyze resume text with AI and extract structured information
 */
export const analyzeResumeWithAI = async (resumeText: string): Promise<ExtractedResume> => {
  if (!resumeText || resumeText.trim().length === 0) {
    throw new Error('Resume text cannot be empty');
  }

  try {
    const prompt = `You are an expert resume parser. Extract ALL information from this resume carefully and completely.

RESUME TEXT:
"""
${resumeText}
"""

EXTRACTION RULES:
1. Extract EVERY skill mentioned (not just top 5)
2. Extract ALL work experience entries and projects
3. Calculate totalYearsExperience from dates (e.g., "Nov 2025 - current" = current year - 2025)
4. Extract full professional summary/profile
5. Include ALL links (LinkedIn, GitHub, Portfolio, Website)
6. For work experience: if no end date, assume "current"
7. Include certifications and any additional education

Return ONLY valid JSON (no markdown, no extra text):
{
  "candidateName": "Full name",
  "email": "email@example.com",
  "phone": "phone number or null",
  "location": "city, country",
  "summary": "Full professional summary/profile text",
  "totalYearsExperience": 0,
  "topSkills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7"],
  "allSkills": ["complete", "list", "of", "all", "skills"],
  "workExperience": [
    {
      "jobTitle": "Title",
      "company": "Company Name",
      "duration": "Month Year - Month Year or current",
      "description": "Brief description",
      "fullDescription": "FULL PARAGRAPH from resume with all details and achievements",
      "keyResponsibilities": ["responsibility1", "responsibility2", "responsibility3"],
      "achievements": ["achievement1", "achievement2"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "Brief description",
      "fullDescription": "FULL PARAGRAPH about the project with all features and details",
      "technologies": ["tech1", "tech2"],
      "keyFeatures": ["feature1", "feature2", "feature3"],
      "links": {"github": "url", "demo": "url", "website": "url"}
    }
  ],
  "education": [
    {
      "degree": "B.Tech/MBA/etc",
      "field": "Field of Study",
      "institution": "University Name",
      "graduationYear": "2027",
      "cgpa": "9.75 or null"
    }
  ],
  "certifications": ["cert1", "cert2"],
  "links": {
    "linkedin": "url or null",
    "github": "url or null",
    "portfolio": "url or null",
    "website": "url or null"
  }
}

IMPORTANT:
- Extract ALL skills, not just 5
- Include ALL projects and work experience
- Calculate years correctly from dates
- For current positions, use "current" as end date
- Include profile/summary text
- Don't include markdown, only JSON
- Use null for missing optional fields`;

    const selectedModel = selectBestModel('resume-analysis', 'technical', 'high');
    const response = await llmCompletion(prompt, selectedModel);

    try {
      const cleanedResponse = response.trim();
      const jsonMatch = cleanedResponse.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : cleanedResponse;

      const result = sanitizeJSON(jsonString);
      const parsedData = typeof result === 'string' ? JSON5.parse(result) : result;

      // Validate and normalize the response
      // Prefer allSkills if available, otherwise use topSkills
      const allSkillsFromResponse = Array.isArray(parsedData.allSkills)
        ? parsedData.allSkills
        : Array.isArray(parsedData.topSkills)
          ? parsedData.topSkills
          : [];

      // Extract LinkedIn/GitHub from links object or fallback to direct fields
      const linkedIn = parsedData.links?.linkedin || parsedData.linkedIn;
      const portfolio = parsedData.links?.portfolio || parsedData.links?.website || parsedData.portfolio;

      const resumeData: ExtractedResume = {
        candidateName: parsedData.candidateName || 'Unknown',
        email: parsedData.email || '',
        phone: parsedData.phone || undefined,
        location: parsedData.location || undefined,
        totalYearsExperience: Number(parsedData.totalYearsExperience) || 0,
        topSkills: allSkillsFromResponse.slice(0, 10), // Return all skills (up to 10)
        summary: parsedData.summary || undefined,
        workExperience: Array.isArray(parsedData.workExperience) ? parsedData.workExperience : [],
        projects: Array.isArray(parsedData.projects) ? parsedData.projects : undefined,
        education: Array.isArray(parsedData.education) ? parsedData.education : [],
        certifications: Array.isArray(parsedData.certifications) ? parsedData.certifications : undefined,
        linkedIn: linkedIn || undefined,
        portfolio: portfolio || undefined,
      };

      debugLog('Resume analysis successful', resumeData as unknown as DebugLogData);
      return resumeData;
    } catch (parseError) {
      console.error('JSON parsing error in resume analysis:', parseError);
      throw new Error(`Failed to parse resume analysis response: ${(parseError as Error).message}`);
    }
  } catch (error) {
    console.error('Resume analysis error:', error);
    throw new Error(`Resume analysis failed: ${(error as Error).message}`);
  }
};

/**
 * Extract information from resume text without AI (simple pattern matching)
 */
export const extractResumeInformation = (resumeText: string): Partial<ExtractedResume> => {
  const extractedInfo: Partial<ExtractedResume> = {
    topSkills: [],
    workExperience: [],
    education: [],
    certifications: [],
  };

  if (!resumeText) return extractedInfo;

  const text = resumeText.toLowerCase();

  // Extract email
  const emailMatch = resumeText.match(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) {
    extractedInfo.email = emailMatch[1];
  }

  // Extract phone
  const phoneMatch = resumeText.match(/(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/);
  if (phoneMatch) {
    extractedInfo.phone = phoneMatch[1];
  }

  // Extract LinkedIn
  const linkedInMatch = resumeText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedInMatch) {
    extractedInfo.linkedIn = `https://linkedin.com/in/${linkedInMatch[1]}`;
  }

  // Extract years of experience
  const yearsMatch = text.match(/(\d+)\+?\s*years?\s*of\s*experience/);
  if (yearsMatch) {
    extractedInfo.totalYearsExperience = parseInt(yearsMatch[1], 10);
  }

  // Extract common skills (simple matching)
  const commonSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Vue',
    'Angular',
    'Node.js',
    'Python',
    'Java',
    'C++',
    'C#',
    'SQL',
    'MongoDB',
    'PostgreSQL',
    'Firebase',
    'AWS',
    'Azure',
    'Docker',
    'Kubernetes',
    'Git',
    'HTML',
    'CSS',
    'REST API',
    'GraphQL',
    'Machine Learning',
    'Data Science',
    'AI',
  ];

  const foundSkills: string[] = [];
  commonSkills.forEach((skill) => {
    if (text.includes(skill.toLowerCase())) {
      foundSkills.push(skill);
    }
  });

  if (foundSkills.length > 0) {
    extractedInfo.topSkills = foundSkills.slice(0, 5);
  }

  return extractedInfo;
};

/**
 * Enable/disable demo mode
 */
export function setDemoMode(enabled: boolean): void {
  localStorage.setItem('use_demo_mode', enabled ? 'true' : 'false');
}

export default {
  generateModuleContent,
  generateFlashcards,
  generateQuizData,
  generateChatResponse,
  generateQuiz,
  generateLearningPath,
  generatePersonalizedCareerPaths,
  generateAINudges,
  generateCareerSummary,
  getResponsiveContent,
  analyzeResumeWithAI,
  extractResumeInformation,
  detectDeviceType,
  canUseAdvancedModels,
  generateTopicElaboration,
  testModelFallback,
  detectDomain,
  getDomainContext,
  isCodeRelatedTopic,
  getContentComplexity,
  getAppropriateLanguage,
  getDomainFlashcardInstructions,
  getDomainQuizInstructions,
  DOMAIN_KEYWORDS,
  LANGUAGE_MAP,
  getAllChatSessions,
  getChatSession,
  createChatSession,
  saveChatSession,
  addMessageToSession,
  updateSessionTokenCount,
  deleteChatSession,
  clearSessionMessages,
  getCurrentSessionId,
  setCurrentSessionId,
  getCurrentSession,
  exportSessionAsText,
  exportSessionAsJSON,
  getDemoResponse,
  shouldUseDemoMode,
  setDemoMode,
  countTokens,
  generateContent,
  sendChatMessage,
  createCareerGuidanceSystemMessage,
  formatMessagesForGroq,
};
