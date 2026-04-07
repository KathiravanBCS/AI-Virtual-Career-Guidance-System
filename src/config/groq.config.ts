import axios, { AxiosError } from 'axios';
import JSON5 from 'json5';
import { v4 as uuidv4 } from 'uuid';

// ==================== TYPES & INTERFACES ====================

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

interface DebugLogData {
  [key: string]: unknown;
}

interface RequestLog {
  timestamp: string;
  model: string;
  success: boolean;
  error: { message: string; status?: number; data?: unknown } | null;
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

interface ResponsiveContent extends ModuleContent {}

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

interface UserInterests {
  interests: string[];
  skills?: string[];
  experience?: string;
  goals?: string;
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
  links?: { github?: string; demo?: string; website?: string };
  keyFeatures?: string[];
}

export interface EducationEntry {
  degree: string;
  field: string;
  institution: string;
  graduationYear?: string;
  cgpa?: string;
}

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
    message: { role: string; content: string };
    finish_reason: string;
    index: number;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
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

// ==================== DEBUG & LOGGING ====================

const debugLog = (message: string, data: DebugLogData | null = null): void => {
  if (!DEBUG_MODE) return;
  const timestamp = new Date().toISOString();
  data
    ? console.log(`[${timestamp}] ${message}`, data)
    : console.log(`[${timestamp}] ${message}`);
};

const logApiRequest = (model: string, success = true, error: AxiosError | null = null): void => {
  if (!DEBUG_MODE) return;
  const requestLog: RequestLog = {
    timestamp: new Date().toISOString(),
    model,
    success,
    error: error
      ? { message: error.message, status: error.response?.status, data: error.response?.data }
      : null,
  };
  debugLog(`API Request: ${model} — ${success ? 'SUCCESS' : 'FAILED'}`, requestLog as unknown as DebugLogData);
};

// ==================== MODELS ====================

const GROQ_MODELS: string[] = [
  'llama-3.3-70b-versatile',
  'llama3-70b-8192',
  'llama-3.1-8b-instant',
  'llama3-8b-8192',
  'gemma2-9b-it',
  'meta-llama/llama-4-maverick-17b-128e-instruct',
  'qwen-qwq-32b',
];

const MODEL_CAPABILITIES: ModelCapabilitiesMap = {
  'llama-3.3-70b-versatile':                      { contextWindow: 128000, capability: 'high',   speed: 'fast',      useCase: ['complex', 'technical', 'creative', 'detailed'] },
  'llama3-70b-8192':                               { contextWindow: 8192,   capability: 'high',   speed: 'medium',    useCase: ['complex', 'technical', 'detailed'] },
  'llama-3.1-8b-instant':                          { contextWindow: 128000, capability: 'medium', speed: 'very-fast', useCase: ['simple', 'interactive', 'chat'] },
  'llama3-8b-8192':                                { contextWindow: 8192,   capability: 'medium', speed: 'fast',      useCase: ['general', 'simple'] },
  'gemma2-9b-it':                                  { contextWindow: 8192,   capability: 'medium', speed: 'fast',      useCase: ['general', 'alternative'] },
  'meta-llama/llama-4-maverick-17b-128e-instruct': { contextWindow: 131072, capability: 'high',   speed: 'medium',    useCase: ['complex', 'long-context'] },
  'qwen-qwq-32b':                                  { contextWindow: 128000, capability: 'high',   speed: 'medium',    useCase: ['alternative', 'fallback'] },
};

// ==================== RATE LIMITING ====================

const MAX_RETRIES = 5;
const BASE_RETRY_DELAY = 1000;
const MAX_RETRY_DELAY = 15000;
const RATE_LIMIT_STATUS_CODES: number[] = [429, 500, 502, 503, 504];

let apiRequestLog: ApiRequestLog = {
  timestamp: Date.now(),
  count: 0,
  resetInterval: 60000,
  maxRequestsPerInterval: 25,
};

setInterval(() => {
  apiRequestLog = { ...apiRequestLog, timestamp: Date.now(), count: 0 };
}, apiRequestLog.resetInterval);

const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

const shouldThrottle = (): boolean => {
  const elapsed = Date.now() - apiRequestLog.timestamp;
  return elapsed < apiRequestLog.resetInterval &&
    apiRequestLog.count >= apiRequestLog.maxRequestsPerInterval * 0.9;
};

const throttleIfNeeded = async (): Promise<void> => {
  if (!shouldThrottle()) return;
  const remainingTime = apiRequestLog.resetInterval - (Date.now() - apiRequestLog.timestamp);
  console.log(`Approaching rate limit, throttling for ${remainingTime}ms`);
  await sleep(remainingTime > 0 ? remainingTime : 1000);
};

// ==================== VALIDATION & SANITIZATION ====================

const validateModuleContent = (content: unknown): content is ModuleContent => {
  const c = content as ModuleContent;
  if (!c?.title || !Array.isArray(c?.sections) || c.sections.length === 0) return false;
  return c.sections.every(
    (s) => s.title && typeof s.content === 'string' && s.content.length > 50
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
  } catch {
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
  } catch {
    return text;
  }
};

const sanitizeJSON = (text: string): unknown => {
  try {
    let cleaned = text.replace(/```(?:json)?/g, '').trim();
    const jsonMatch = cleaned.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
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
    } catch {
      jsonText = jsonText
        .replace(/(['"])?([a-zA-Z0-9_]+)(['"])?\s*:/g, '"$2":')
        .replace(/'/g, '"')
        .replace(/\\"/g, '\\"')
        .replace(/\\\\/g, '\\')
        .replace(/,\s*}/g, '}')
        .replace(/,\s*\]/g, ']');

      try {
        return JSON5.parse(jsonText);
      } catch {
        // Fallback: manual flashcard extraction
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
            if (cards.length > 0) return cards;
          }
        }
        return text;
      }
    }
  } catch {
    return text;
  }
};

const extractValue = (text: string, key: string): string | null => {
  const regex = new RegExp(`"${key}"\\s*:\\s*"([^"]*(?:\\\\.[^"]*)*)"`);
  const match = text.match(regex);
  return match ? match[1].replace(/\\"/g, '"') : null;
};

// ==================== MODEL SELECTION ====================

const selectBestModel = (
  task: string,
  contentType: string,
  complexity: string = 'medium',
  isInteractive = false
): string => {
  if (isInteractive && complexity !== 'high') return 'llama-3.1-8b-instant';
  if (complexity === 'high' && (contentType === 'technical' || contentType === 'code')) return 'llama-3.3-70b-versatile';
  if (complexity === 'medium' && contentType !== 'technical') return 'llama3-8b-8192';
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
      { model, messages: [{ role: 'user', content: prompt }], temperature: 0.3, max_tokens: 4096, top_p: 0.95 },
      { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` }, timeout: 30000 }
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

const llmCompletion = async (prompt: string, preferredModel = 'llama-3.3-70b-versatile'): Promise<string> => {
  await throttleIfNeeded();
  apiRequestLog.count++;

  try {
    debugLog(`Initial attempt with preferred model: ${preferredModel}`);
    return await callGroqApi(prompt, preferredModel);
  } catch (initialError) {
    debugLog(`Preferred model ${preferredModel} failed, switching to fallbacks`, {
      message: (initialError as Error).message,
    });
  }

  const fallbacks = GROQ_MODELS.filter((m) => m !== preferredModel);
  let lastError: EnhancedError | null = null;

  for (const model of fallbacks) {
    try {
      debugLog(`Trying fallback model: ${model}`);
      const response = await callGroqApi(prompt, model);
      debugLog(`Successfully generated content with fallback model: ${model}`);
      return response;
    } catch (fallbackError) {
      lastError = fallbackError as EnhancedError;
      debugLog(`Fallback model ${model} failed`, { message: (fallbackError as Error).message });
    }
  }

  throw new Error(`All GROQ models failed: ${lastError?.message || 'Unknown error'}`);
};

const retry = async <T>(fn: () => Promise<T>, retries = MAX_RETRIES): Promise<T> => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      const backoffTime = calculateBackoff(retries);
      console.log(`Retrying... Attempts left: ${retries - 1}, waiting ${backoffTime}ms`);
      await sleep(backoffTime);
      return retry(fn, retries - 1);
    }
    throw error;
  }
};

// ==================== TOPIC ANALYSIS ====================

export const DOMAIN_KEYWORDS: Record<string, Record<string, string[]>> = {
  technology: {
    programming: ['programming', 'coding', 'software', 'developer', 'javascript', 'python', 'java', 'typescript', 'react', 'nodejs', 'api', 'backend', 'frontend', 'fullstack'],
    data_science: ['data science', 'machine learning', 'ai', 'artificial intelligence', 'deep learning', 'neural network', 'nlp', 'computer vision', 'analytics'],
    devops: ['devops', 'cloud', 'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'ci/cd', 'infrastructure', 'linux'],
    cybersecurity: ['cybersecurity', 'security', 'networking', 'ethical hacking', 'penetration testing', 'encryption'],
    design: ['ui', 'ux', 'user experience', 'interface', 'figma', 'product design', 'web design'],
  },
  business: {
    management: ['management', 'leadership', 'strategy', 'operations', 'project management', 'agile', 'scrum'],
    marketing: ['marketing', 'digital marketing', 'seo', 'social media', 'branding', 'content marketing', 'advertising'],
    entrepreneurship: ['entrepreneurship', 'startup', 'business development', 'venture', 'innovation'],
    hr: ['human resources', 'recruitment', 'talent management', 'training', 'organizational development'],
    sales: ['sales', 'business development', 'crm', 'negotiation', 'customer success'],
  },
  creative: {
    design: ['graphic design', 'visual design', 'illustration', 'photography', 'animation', 'video', 'visual arts', 'art direction'],
    writing: ['writing', 'content creation', 'copywriting', 'journalism', 'screenwriting', 'novel writing', 'blogging', 'technical writing'],
    music_audio: ['music', 'audio engineering', 'sound design', 'music production', 'recording', 'mixing', 'mastering'],
    performing_arts: ['acting', 'theater', 'dance', 'performance', 'stage design', 'directing'],
  },
  science: {
    general: ['science', 'research', 'academic', 'laboratory', 'experiment', 'hypothesis', 'analysis'],
    biology: ['biology', 'genetics', 'microbiology', 'biochemistry', 'botany', 'zoology', 'ecology', 'medicine', 'pharmacy', 'nursing'],
    chemistry: ['chemistry', 'organic chemistry', 'inorganic chemistry', 'physical chemistry', 'chemical engineering'],
    physics: ['physics', 'quantum mechanics', 'engineering', 'mechanical engineering', 'civil engineering', 'electrical engineering'],
    mathematics: ['mathematics', 'calculus', 'algebra', 'statistics', 'geometry', 'data analysis'],
  },
  healthcare: {
    medical: ['medicine', 'physician', 'doctor', 'surgery', 'diagnosis', 'treatment', 'patient care', 'clinical'],
    nursing: ['nursing', 'nurse practitioner', 'registered nurse', 'healthcare', 'patient support'],
    therapy: ['psychology', 'counseling', 'therapy', 'mental health', 'psychiatry', 'social work'],
    fitness: ['fitness', 'exercise science', 'personal training', 'nutrition', 'wellness', 'physical therapy'],
  },
  education: {
    teaching: ['teaching', 'education', 'instructor', 'trainer', 'curriculum', 'pedagogy', 'learning management'],
    subjects: ['mathematics', 'science', 'language arts', 'history', 'literature', 'geography', 'social studies'],
    elearning: ['elearning', 'online education', 'distance learning', 'course design', 'student engagement'],
  },
  trades: {
    mechanical: ['plumbing', 'electrical', 'hvac', 'carpentry', 'welding', 'mechanics', 'automotive', 'heavy equipment'],
    construction: ['construction', 'building', 'architecture', 'contractors', 'blueprint reading', 'safety'],
    crafts: ['woodworking', 'metalworking', 'textile', 'pottery', 'jewelry', 'craftsmanship'],
  },
  hospitality: {
    food: ['cooking', 'culinary', 'chef', 'food preparation', 'restaurant management', 'baking', 'pastry'],
    accommodation: ['hospitality', 'hotel management', 'tourism', 'travel', 'event planning'],
    service: ['customer service', 'guest relations', 'concierge'],
  },
  finance: {
    accounting: ['accounting', 'bookkeeping', 'tax', 'auditing', 'financial reporting', 'gaap', 'ifrs'],
    investment: ['investment', 'portfolio', 'stocks', 'bonds', 'trading', 'crypto', 'cryptocurrency'],
    banking: ['banking', 'loans', 'credit', 'mortgages', 'financial services'],
  },
  legal: {
    law: ['law', 'legal', 'attorney', 'compliance', 'regulation', 'contract', 'litigation'],
    specializations: ['corporate law', 'real estate', 'family law', 'criminal law', 'intellectual property'],
  },
  realestate: {
    general: ['real estate', 'property', 'real estate agent', 'broker', 'valuation', 'appraisal'],
    development: ['property development', 'architecture', 'construction', 'zoning', 'permits'],
  },
  environment: {
    agriculture: ['agriculture', 'farming', 'agronomy', 'crop management', 'animal husbandry', 'sustainability'],
    environmental: ['environmental science', 'ecology', 'conservation', 'climate', 'renewable energy'],
  },
  logistics: {
    general: ['logistics', 'supply chain', 'transportation', 'shipping', 'warehousing'],
    vehicles: ['driver', 'trucking', 'aviation', 'maritime', 'pilot', 'fleet management'],
  },
  gaming: {
    game_dev: ['game development', 'game design', 'unity', 'unreal engine', 'game programming'],
    entertainment: ['entertainment', 'film', 'television', 'production', 'streaming'],
  },
};

export const isCodeRelatedTopic = (topic: string): boolean => {
  const technicalDomains = ['technology', 'science', 'trades'];
  const lower = topic.toLowerCase();
  return technicalDomains.some((domain) =>
    Object.values(DOMAIN_KEYWORDS[domain]).some((keywords) =>
      keywords.some((kw) => lower.includes(kw))
    )
  );
};

export const detectDomain = (topic: string): string => {
  const lower = topic.toLowerCase();
  for (const [domain, categories] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const keywords of Object.values(categories)) {
      if (keywords.some((kw) => lower.includes(kw))) return domain;
    }
  }
  return 'general';
};

export const getContentComplexity = (domain: string): 'low' | 'medium' | 'high' => {
  const map: Record<string, 'low' | 'medium' | 'high'> = {
    technology: 'high', science: 'high', finance: 'high', legal: 'high', gaming: 'high',
    healthcare: 'medium', business: 'medium', education: 'medium', creative: 'medium',
    trades: 'medium', realestate: 'medium', environment: 'medium', logistics: 'medium',
    hospitality: 'low',
  };
  return map[domain] ?? 'medium';
};

export const getDomainContext = (topic: string): { domain: string; category: string; complexity: 'low' | 'medium' | 'high' } => {
  const lower = topic.toLowerCase();
  for (const [domain, categories] of Object.entries(DOMAIN_KEYWORDS)) {
    for (const [category, keywords] of Object.entries(categories)) {
      if (keywords.some((kw) => lower.includes(kw))) {
        return { domain, category, complexity: getContentComplexity(domain) };
      }
    }
  }
  return { domain: 'general', category: 'general', complexity: 'medium' };
};

// ==================== LANGUAGE HELPERS ====================

export const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript', typescript: 'typescript', python: 'python', java: 'java',
  'c++': 'cpp', 'c#': 'csharp', go: 'go', rust: 'rust', sql: 'sql',
  html: 'html', css: 'css', bash: 'bash', swift: 'swift', kotlin: 'kotlin',
};

export const getAppropriateLanguage = (topic: string): string => {
  const lower = topic.toLowerCase();
  for (const [keyword, lang] of Object.entries(LANGUAGE_MAP)) {
    if (lower.includes(keyword)) return lang;
  }
  return 'javascript';
};

// ==================== DOMAIN-SPECIFIC PROMPT HELPERS ====================

export const getDomainQuizInstructions = (domain: string, _category: string): string => {
  const guides: Record<string, string> = {
    technology: `Quiz distribution: 40% conceptual understanding, 40% practical application, 20% problem-solving scenarios.
For coding topics: test logic and implementation over syntax. Include real-world use cases and best practices.`,

    science: `Quiz distribution: 20% definitions/terminology, 40% mechanisms/processes, 40% calculations/problem-solving.
Ensure scientific accuracy with proper units. Test cause-and-effect relationships.`,

    healthcare: `Quiz distribution: 30% medical knowledge, 40% clinical scenarios, 30% critical decision-making.
Prioritize patient safety and evidence-based practices. Use proper medical terminology.`,

    business: `Quiz distribution: 30% concepts/theory, 50% case studies/scenarios, 20% strategic thinking.
Use real business frameworks and decision-making situations.`,

    finance: `Quiz distribution: 30% definitions/calculations, 50% scenario application, 20% analysis/interpretation.
Use realistic financial scenarios with numbers. Test practical financial principles.`,

    creative: `Quiz distribution: 30% technique/principles, 40% analysis/critique, 30% project/execution.
Use examples from successful creative works. Test both theoretical and practical understanding.`,

    education: `Quiz distribution: 40% concepts/knowledge, 40% teaching scenarios, 20% assessment/evaluation.
Use clear, grade-appropriate language. Test understanding of learning outcomes.`,

    trades: `Quiz distribution: 30% knowledge, 40% procedures/steps, 20% safety/compliance, 10% troubleshooting.
Emphasize safety standards and industry compliance.`,

    hospitality: `Quiz distribution: 30% service protocols, 40% customer scenarios, 30% operations/management.
Use realistic hospitality situations. Test procedural and interpersonal skills.`,

    legal: `Quiz distribution: 30% definitions/statutes, 50% scenario/case application, 20% analysis.
Use accurate legal terminology. Test understanding of legal principles and applications.`,

    realestate: `Quiz distribution: 30% terminology/process, 35% market/valuation, 35% transaction/negotiation.
Use realistic real estate situations. Test regulations and practices.`,

    environment: `Quiz distribution: 40% science/ecology, 30% sustainability/conservation, 30% real-world scenarios.
Ensure scientific accuracy. Test understanding of environmental systems.`,

    logistics: `Quiz distribution: 30% supply chain concepts, 40% optimization/problem-solving, 30% operations.
Use real logistics scenarios. Test efficiency and coordination.`,

    gaming: `Quiz distribution: 30% design principles, 35% mechanics/implementation, 35% player psychology.
Use real game examples. Test both design and development knowledge.`,
  };

  return guides[domain] ?? `Mix different question types and difficulty levels. Focus on understanding over memorization. Include practical application and critical thinking questions.`;
};

export const getDomainFlashcardInstructions = (domain: string, _category: string): string => {
  const guides: Record<string, string> = {
    technology: `Test conceptual understanding over memorization. Include practical applications, real-world use cases, and the "why" behind each concept. For programming topics: add code snippets or pseudocode in answers where relevant.`,
    science: `Include definitions, formulas, and mechanisms. Connect concepts to broader scientific principles. Use accurate terminology with proper units. Highlight cause-and-effect relationships.`,
    healthcare: `Ensure medical accuracy throughout. Use proper clinical terminology. Connect theory to patient care scenarios. Include safety considerations and evidence-based practices.`,
    finance: `Include formulas, ratios, and calculations. Connect concepts to real market scenarios. Use numeric examples. Explain both definition and practical application.`,
    legal: `Use precise legal terminology. Include jurisdiction context where relevant. Connect principles to case examples. Clarify common misconceptions.`,
    business: `Focus on frameworks and strategic thinking. Include real-world business applications. Test both theory and implementation. Connect to measurable outcomes.`,
    creative: `Include technique details and creative rationale. Reference notable examples from the field. Connect technical skills to creative expression. Test critique and execution.`,
    education: `Focus on pedagogical principles and classroom application. Use clear, accessible language. Connect theory to teaching practice. Include student-centered approaches.`,
    trades: `Include procedural steps and safety protocols. Add tool/material specifications. Emphasize compliance and best practices. Use practical, hands-on examples.`,
    hospitality: `Focus on service standards and guest experience. Include real hospitality scenarios. Test both procedural knowledge and interpersonal skills. Emphasize professionalism.`,
    general: `Focus on core concepts and practical applications. Include clear explanations with concrete examples. Progress from foundational to applied knowledge.`,
  };

  return guides[domain] ?? guides.general;
};

// ==================== HELPER FUNCTIONS ====================

const analyzeQuizAnswers = (quizAnswers: { [key: string]: string }): QuizAnalysis => {
  const analysis: QuizAnalysis = { technical: 0, creative: 0, business: 0, performance: 0, service: 0 };
  const keys = Object.keys(quizAnswers);
  if (keys.length === 0) return analysis;

  keys.forEach((key) => {
    const answer = quizAnswers[key]?.toLowerCase() || '';
    if (answer.includes('tech') || answer.includes('code') || answer.includes('data')) analysis.technical += 20;
    if (answer.includes('design') || answer.includes('art') || answer.includes('creat')) analysis.creative += 20;
    if (answer.includes('business') || answer.includes('manage') || answer.includes('market')) analysis.business += 20;
    if (answer.includes('perform') || answer.includes('lead') || answer.includes('speak')) analysis.performance += 20;
    if (answer.includes('help') || answer.includes('care') || answer.includes('service')) analysis.service += 20;
  });

  return analysis;
};

const generateDefaultModules = (pathName: string, count: number): CareerPathModule[] => {
  const levels = ['Fundamentals', 'Core Concepts', 'Intermediate Skills', 'Advanced Techniques', 'Real-World Application'];
  return Array.from({ length: count }, (_, i) => ({
    title: `Module ${i + 1}: ${levels[i] || `${pathName} Part ${i + 1}`}`,
    description: `Build ${levels[i]?.toLowerCase() ?? 'skills'} in ${pathName}`,
    estimatedHours: 6 + i * 2,
    keySkills: [`${pathName} basics`, `${pathName} application`, `${pathName} best practices`],
  }));
};

const themeElaborationContent = (content: ElaborationContent): ElaborationContent => ({
  ...content,
  theme: {
    primary: '#ff9d54',
    secondary: '#3a3a3a',
    background: '#2a2a2a',
    text: '#ffffff',
    accent: '#ff8a30',
    codeBackground: '#1e1e1e',
  },
  display: {
    showCodeExamples: true,
    collapsibleSections: true,
    animateEntrance: true,
  },
});

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
      const sectionCount = options.detailed ? 4 : 3;
      const level = options.detailed ? 'Advanced' : 'Foundational';
      const contentType = isTechTopic ? 'Technical/Programming' : 'General Education';
      const language = getAppropriateLanguage(moduleName);

      const codeExampleBlock = isTechTopic
        ? `"codeExample": {
              "language": "${language}",
              "code": "// Concise, runnable example\\nfunction example() {\\n  // implementation\\n}",
              "explanation": "What this code demonstrates and why it matters"
            }`
        : `"codeExample": null`;

      const prompt = `You are an expert educator. Generate accurate, structured learning content for the topic: "${moduleName}".

CONTENT REQUIREMENTS:
- Only include well-established, verifiable facts
- Avoid speculation, opinions, or unverified claims
- Do not reference current events, statistics, or trends
- Do not mention specific products or companies unless central to the topic
- Do not reference your own capabilities or limitations

CONTENT PROFILE:
- Type: ${contentType}
- Level: ${level}
- Sections: ${sectionCount}

WRITING GUIDELINES:
- Lead with foundational concepts before building to complexity
- Use precise, domain-appropriate language
- Each section should teach one clear idea
- Include a concrete example or analogy per section
${isTechTopic ? '- Code examples must be syntactically correct and follow standard conventions' : ''}

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "title": "Clear, descriptive title for ${moduleName}",
  "type": "${isTechTopic ? 'technical' : 'general'}",
  "sections": [
    {
      "title": "Section Name",
      "content": "Clear, factual explanation with examples (minimum 100 words)",
      "keyPoints": ["Insight 1", "Insight 2", "Insight 3"],
      ${codeExampleBlock}
    }
  ]
}`;

      const preferredModel = selectBestModel(
        'content-generation',
        isTechTopic ? 'technical' : 'general',
        contentComplexity
      );

      const text = await llmCompletion(prompt, preferredModel);
      const result = sanitizeJSON(text);
      const content = typeof result === 'string' ? JSON5.parse(result) : (result as ModuleContent);

      if (!validateModuleContent(content)) throw new Error('Invalid content structure from LLM');

      content.sections = content.sections.map((section) => ({
        ...section,
        content: sanitizeContent(section.content),
        codeExample: section.codeExample ? cleanCodeExample(section.codeExample) : null,
      }));

      return content;
    } catch (error) {
      lastError = error as Error;
      console.error(`Module content generation attempt ${attempt} failed:`, (error as Error).message);
      if (attempt < MAX_RETRIES) await sleep(calculateBackoff(attempt));
    }
  }

  throw lastError || new Error('Failed to generate content after multiple attempts');
};

export const generateFlashcards = async (
  topic: string,
  numCards = 5,
  options: { domainSpecific?: boolean } = { domainSpecific: true }
): Promise<Flashcard[]> => {
  if (!topic || typeof topic !== 'string') throw new Error('Invalid topic provided');

  try {
    const { domain, category, complexity } = getDomainContext(topic);
    const isTechTopic = isCodeRelatedTopic(topic);
    const domainInstructions = options.domainSpecific
      ? getDomainFlashcardInstructions(domain, category)
      : 'Focus on core concepts and practical applications with clear, memorable explanations.';

    const midPoint = Math.ceil(numCards / 2);

    const prompt = `You are an expert educator. Generate exactly ${numCards} flashcards on the topic: "${topic}".

DOMAIN CONTEXT:
- Learning domain: ${domain}
- Category: ${category}
- Complexity: ${complexity}

FLASHCARD STRUCTURE:
- Front (question): Short, focused, and memorable — one concept per card
- Back (answer): Thorough explanation in 3–4 sentences with context and examples

DIFFICULTY PROGRESSION:
- Cards 1: Foundational concept — definitions and basic understanding
- Cards 2–${midPoint}: Intermediate — mechanisms, relationships, applications
- Cards ${midPoint + 1}–${numCards}: Advanced — synthesis, edge cases, real-world nuance

DOMAIN GUIDANCE:
${domainInstructions}

OUTPUT FORMAT — Return ONLY a valid JSON array, no preamble:
[
  { "id": 1, "frontHTML": "What is...?", "backHTML": "Detailed explanation..." },
  { "id": ${numCards}, "frontHTML": "Advanced question?", "backHTML": "Expert-level explanation..." }
]`;

    const selectedModel = selectBestModel('flashcards', isTechTopic ? 'technical' : 'educational', complexity, true);
    const text = await llmCompletion(prompt, selectedModel);

    try {
      const result = sanitizeJSON(text);
      const flashcards = typeof result === 'string' ? JSON5.parse(result) : (result as Flashcard[]);

      if (!Array.isArray(flashcards) || flashcards.length === 0) throw new Error('Invalid flashcard format');

      const normalized = flashcards.slice(0, numCards);
      while (normalized.length < numCards) {
        normalized.push({
          id: normalized.length + 1,
          frontHTML: `What is a key concept in ${topic}?`,
          backHTML: `This concept is a fundamental part of understanding ${topic} at an intermediate level.`,
        });
      }
      return normalized;
    } catch {
      return Array.from({ length: numCards }, (_, i) => ({
        id: i + 1,
        frontHTML: `${topic} — concept ${i + 1}?`,
        backHTML: `Explanation of ${topic} at difficulty level ${i + 1}.`,
      }));
    }
  } catch (error) {
    throw new Error(`Failed to generate flashcards: ${(error as Error).message}`);
  }
};

export const generateQuizData = async (
  topic: string,
  numQuestions: number,
  moduleContent = ''
): Promise<QuizData> => {
  try {
    let cleanTopic = topic;
    if (topic.includes(':')) {
      cleanTopic = topic.split(':')[1].trim();
    } else if (topic.match(/Module\s+\d+/i) && moduleContent) {
      const firstLine = moduleContent.split('\n')[0];
      if (firstLine?.includes(':')) cleanTopic = firstLine.split(':')[1].trim();
    }

    const { domain, category, complexity } = getDomainContext(cleanTopic);
    const isTechTopic = isCodeRelatedTopic(cleanTopic);
    const domainInstructions = getDomainQuizInstructions(domain, category);
    const hasContent = moduleContent.trim().length > 50;
    const contentSnippet = hasContent ? `\nREFERENCE CONTENT:\n${moduleContent.substring(0, 5000)}\n` : '';
    const contentInstruction = hasContent
      ? 'Base questions on the provided reference content.'
      : 'Base questions on what a standard course covering this topic would teach.';

    const prompt = `You are an expert quiz designer. Create exactly ${numQuestions} questions on the topic: "${cleanTopic}".

DOMAIN CONTEXT:
- Domain: ${domain}
- Category: ${category}
- Complexity: ${complexity}
${contentSnippet}
DOMAIN REQUIREMENTS:
${domainInstructions}

QUESTION REQUIREMENTS:
- ${contentInstruction}
- Each question must be factually accurate and directly relevant to "${cleanTopic}"
- Provide 4 answer options (A, B, C, D) with plausible distractors
- Vary difficulty across the question set (easy → hard)
- Include a clear, educational explanation for the correct answer
- Use "single" type by default; use "multiple" only when multiple answers are genuinely correct

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "topic": "${cleanTopic}",
  "questions": [
    {
      "question": "Clear question text?",
      "answers": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": ["Option A"],
      "explanation": "Why this answer is correct, and what it teaches.",
      "point": 10,
      "questionType": "single"
    }
  ]
}

CRITICAL: Return exactly ${numQuestions} questions. All JSON must be valid.`;

    const selectedModel = selectBestModel('quiz-generation', isTechTopic ? 'technical' : 'educational', complexity);
    const resultText = await llmCompletion(prompt, selectedModel);
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid response format');

    const result = sanitizeJSON(jsonMatch[0]);
    const quizData = typeof result === 'string' ? JSON5.parse(result) : (result as QuizData);
    if (!quizData.topic) quizData.topic = topic;
    return quizData;
  } catch (error) {
    console.error('Error generating quiz:', error);
    return {
      topic,
      questions: Array.from({ length: numQuestions }, (_, i) => ({
        question: `Question ${i + 1} about ${topic}?`,
        answers: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: ['Option A'],
        explanation: `This is the correct answer for question ${i + 1} about ${topic}.`,
        point: 10,
        questionType: 'single' as const,
      })),
    };
  }
};

export const generateChatResponse = async (message: string, context: Record<string, string>): Promise<string> => {
  try {
    const topic = context['What topic would you like to discuss today?'] || 'General';
    const level = context["What's your current knowledge level in this topic? (Beginner/Intermediate/Advanced)"] || 'Intermediate';
    const focus = context['What specific aspects would you like to focus on?'] || 'General understanding';

    const prompt = `You are a knowledgeable and concise learning assistant.

LEARNER CONTEXT:
- Topic: ${topic}
- Knowledge Level: ${level}
- Focus Area: ${focus}

RESPONSE GUIDELINES:
- Match the learner's level — avoid jargon for beginners, be precise for advanced learners
- Be direct and informative; avoid unnecessary filler
- Use a short example or analogy if it adds clarity
- Keep the response focused and actionable

USER QUESTION:
${message}`;

    const selectedModel = selectBestModel('chat', 'general', 'medium', true);
    return await llmCompletion(prompt, selectedModel);
  } catch (error) {
    console.error('Chat generation error:', error);
    throw new Error('Failed to generate response');
  }
};

export const generateQuiz = async (moduleName: string, numQuestions: number): Promise<SimpleQuizData> => {
  if (!moduleName || typeof moduleName !== 'string') throw new Error('Invalid module name provided');

  try {
    const isTechTopic = isCodeRelatedTopic(moduleName);

    const prompt = `You are an expert quiz designer. Generate exactly ${numQuestions} quiz questions for the topic: "${moduleName}".

REQUIREMENTS:
- Each question tests meaningful understanding of ${moduleName} — not trivial recall
- Include a range of difficulty: foundational to advanced
- Each question has exactly 4 answer options
- Provide a brief, educational explanation for the correct answer
- correctIndex is 0-based (0 = first option, 1 = second, etc.)
${isTechTopic ? '- For technical topics: test practical understanding, not syntax memorization' : ''}

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "questions": [
    {
      "question": "Clear, specific question about ${moduleName}?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this is correct and what it teaches the learner."
    }
  ]
}`;

    const selectedModel = selectBestModel('quiz-generation', isTechTopic ? 'technical' : 'educational', 'medium');
    const text = await llmCompletion(prompt, selectedModel);

    try {
      const result = sanitizeJSON(text);
      const quizData = typeof result === 'string' ? JSON5.parse(result) : (result as SimpleQuizData);
      if (!quizData.questions?.length) throw new Error('Invalid quiz format');
      return quizData;
    } catch {
      return {
        questions: [
          { question: `What is the core purpose of ${moduleName}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0, explanation: 'This is the fundamental goal of this topic.' },
          { question: `Which of the following is NOT related to ${moduleName}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 1, explanation: 'This option is unrelated to the topic.' },
          { question: `What is a key principle in ${moduleName}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 2, explanation: 'This principle is foundational to the topic.' },
          { question: `How is ${moduleName} applied in real-world contexts?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 3, explanation: 'This reflects a common practical use case.' },
          { question: `What advanced technique is associated with ${moduleName}?`, options: ['Option A', 'Option B', 'Option C', 'Option D'], correctIndex: 0, explanation: 'This is a recognized advanced technique in this field.' },
        ].slice(0, numQuestions),
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
  if (!goal || typeof goal !== 'string') throw new Error('Invalid goal/topic provided');

  const isCareerPath = options.type === 'career';

  try {
    let prompt: string;

    if (isCareerPath) {
      const u = options.userData;
      const userContext = u ? `
LEARNER PROFILE:
- Name: ${u.name || 'Not provided'}
- Age: ${u.age || 'Not provided'}
- Career Goal: "${u.careerGoal || goal}"
- Current Skills: ${u.currentSkills?.length ? u.currentSkills.join(', ') : 'None specified'}
- Interests: ${u.interests?.length ? u.interests.join(', ') : 'None specified'}
- Assessment Responses: ${u.assessmentAnswers ? JSON.stringify(u.assessmentAnswers) : 'Not completed'}
` : '';

      prompt = `You are an expert learning designer. Create a personalized, structured learning path for the goal: "${goal}".
${userContext}
PATH REQUIREMENTS:
- 5 to 7 modules that build progressively from basics to advanced
- Tailored to the learner's existing skills, interests, age, and career objective
- Each module should introduce new knowledge and practical skills
- Include realistic time estimates per module
- Each module must prepare the learner for the next

OUTPUT FORMAT — Return ONLY this JSON array, no preamble:
[
  {
    "title": "Module title",
    "description": "What this module covers and why it matters",
    "estimatedTime": "e.g., 2–3 hours",
    "content": "Key concepts, skills, and activities covered"
  }
]`;
    } else {
      prompt = `You are an expert curriculum designer. Generate a 5-module learning path for: "${goal}".

REQUIREMENTS:
- Each module title must be clear, specific, and action-oriented
- Progress logically from foundational to applied knowledge
- Titles should reflect real learning outcomes, not generic phases

OUTPUT FORMAT — Return ONLY a JSON array of exactly 5 strings, no preamble:
["Module 1: [Specific Title]", "Module 2: [Specific Title]", "Module 3: [Specific Title]", "Module 4: [Specific Title]", "Module 5: [Specific Title]"]`;
    }

    const selectedModel = selectBestModel(
      'learning-path',
      isCodeRelatedTopic(goal) ? 'technical' : 'educational',
      isCareerPath ? 'high' : 'medium'
    );

    const text = await retry(() => llmCompletion(prompt, selectedModel));

    try {
      if (isCareerPath) {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        if (!jsonMatch) throw new Error('Failed to parse learning path JSON');
        const result = sanitizeJSON(jsonMatch[0]);
        const modules = typeof result === 'string' ? JSON5.parse(result) : (result as LearningModule[]);
        return (modules as LearningModule[]).map((m) => ({
          title: m.title || `Learning ${goal}`,
          description: m.description || `Learn about ${goal}`,
          estimatedTime: m.estimatedTime || '1–2 hours',
          content: m.content || `Core concepts and skills in ${goal}`,
        }));
      } else {
        const result = sanitizeJSON(text);
        const modules = typeof result === 'string' ? JSON5.parse(result) : result;
        if (!Array.isArray(modules) || modules.length !== 5) throw new Error('Invalid response format');
        return modules as string[];
      }
    } catch {
      if (isCareerPath) {
        return [
          { title: `Introduction to ${goal}`, description: `Learn the fundamentals of ${goal}`, estimatedTime: '1–2 hours', content: `Core concepts and vocabulary of ${goal}.` },
          { title: `${goal} Fundamentals`, description: `Understand the core principles of ${goal}`, estimatedTime: '2–3 hours', content: `Build a solid foundation in ${goal}.` },
          { title: `Practical ${goal}`, description: `Apply your knowledge through exercises`, estimatedTime: '3–4 hours', content: `Hands-on practice applying what you've learned.` },
          { title: `Advanced ${goal}`, description: `Explore advanced techniques and concepts`, estimatedTime: '3–4 hours', content: `Advanced methodologies and real-world complexity.` },
          { title: `${goal} in Practice`, description: `Apply skills in real-world scenarios`, estimatedTime: '2–3 hours', content: `How professionals use these skills in industry.` },
        ];
      }
      return [
        `Module 1: Introduction to ${goal}`,
        `Module 2: Core Concepts of ${goal}`,
        `Module 3: Intermediate ${goal} Techniques`,
        `Module 4: Advanced ${goal} Applications`,
        `Module 5: Real-world ${goal} Projects`,
      ];
    }
  } catch (error) {
    console.error('Error generating learning path:', error);
    if (isCareerPath) {
      return [
        { title: `Introduction to ${goal}`, description: `Fundamentals of ${goal}`, estimatedTime: '1–2 hours', content: `Core concepts of ${goal}.` },
        { title: `${goal} Fundamentals`, description: `Core principles`, estimatedTime: '2–3 hours', content: `Essential knowledge and skills.` },
        { title: `Practical ${goal}`, description: `Hands-on application`, estimatedTime: '3–4 hours', content: `Practice and exercises.` },
        { title: `Advanced ${goal}`, description: `Advanced techniques`, estimatedTime: '3–4 hours', content: `Complex topics and edge cases.` },
        { title: `${goal} in the Real World`, description: `Industry application`, estimatedTime: '2–3 hours', content: `Professional use and career context.` },
      ];
    }
    return [
      `Module 1: Introduction to ${goal}`,
      `Module 2: Core Concepts of ${goal}`,
      `Module 3: Intermediate ${goal} Techniques`,
      `Module 4: Advanced ${goal} Applications`,
      `Module 5: Real-world ${goal} Projects`,
    ];
  }
};

export const generatePersonalizedCareerPaths = async (userData: UserData): Promise<CareerPath[]> => {
  if (!userData || typeof userData !== 'object') throw new Error('Invalid user data provided');

  try {
    const quizAnalysis = analyzeQuizAnswers(userData.quizAnswers || {});
    const quizSection = quizAnalysis
      ? `INTEREST PROFILE (from assessment):
- Technical: ${quizAnalysis.technical}%
- Creative: ${quizAnalysis.creative}%
- Business: ${quizAnalysis.business}%
- Performance: ${quizAnalysis.performance}%
- Service: ${quizAnalysis.service}%`
      : 'Assessment not completed.';

    const prompt = `You are an expert career advisor. Create 4 personalized career learning paths for the following user.

USER PROFILE:
- Name: ${userData.name || 'Learner'}
- Age: ${userData.age || 'Not provided'}
- Career Goal: "${userData.careerGoal || 'Career Development'}"
- Current Skills: ${JSON.stringify(userData.skills || [])}
- Interests: ${JSON.stringify(userData.interests || [])}

${quizSection}

PATH DESIGN REQUIREMENTS:
- Each path must align specifically with the user's career goal, interests, and quiz profile
- Each path must include exactly 5 logically ordered modules
- Modules should build on each other from foundations to advanced application
- Leverage the user's existing skills to accelerate early modules
- Each path should lead toward a clear, career-relevant outcome

OUTPUT FORMAT — Return ONLY a JSON array of exactly 4 paths, no preamble:
[
  {
    "pathName": "Specific, goal-aligned path name",
    "description": "How this path advances the user's career goal",
    "difficulty": "beginner | intermediate | advanced",
    "estimatedTimeToComplete": "X months",
    "relevanceScore": 90,
    "modules": [
      {
        "title": "Module 1: Specific Title",
        "description": "What this module teaches and why it matters",
        "estimatedHours": 8,
        "keySkills": ["skill1", "skill2", "skill3"]
      }
    ]
  }
]`;

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Request timed out')), 45000)
    );

    const text = await Promise.race([
      retry(() => llmCompletion(prompt, 'llama-3.3-70b-versatile')),
      timeoutPromise,
    ]);

    try {
      const result = sanitizeJSON(text);
      const careerPaths = typeof result === 'string' ? JSON5.parse(result) : (result as CareerPath[]);

      if (!Array.isArray(careerPaths) || careerPaths.length === 0) throw new Error('Invalid career paths format');

      const normalized = careerPaths.slice(0, 4);
      while (normalized.length < 4) {
        const base = { ...normalized[0] };
        base.pathName = `Alternative ${base.pathName}`;
        base.relevanceScore = Math.max(1, (base.relevanceScore || 80) - 10);
        normalized.push(base);
      }

      return normalized.map((path) => ({
        pathName: path.pathName || 'Career Path',
        description: path.description || `A learning path toward ${userData.careerGoal}`,
        difficulty: (['beginner', 'intermediate', 'advanced'] as const).includes(path.difficulty)
          ? path.difficulty
          : 'intermediate',
        estimatedTimeToComplete: path.estimatedTimeToComplete || '3 months',
        relevanceScore: typeof path.relevanceScore === 'number' ? Math.max(0, Math.min(100, path.relevanceScore)) : 85,
        modules: Array.isArray(path.modules)
          ? path.modules.slice(0, 5).map((m: CareerPathModule, idx: number) => ({
              title: m.title || `Module ${idx + 1}`,
              description: m.description || 'Build important skills in this area',
              estimatedHours: typeof m.estimatedHours === 'number' ? m.estimatedHours : 8,
              keySkills: Array.isArray(m.keySkills) ? m.keySkills : [],
            }))
          : generateDefaultModules(path.pathName || 'Career Path', 5),
      }));
    } catch {
      return simpleFallbackCareerPaths(userData);
    }
  } catch {
    return simpleFallbackCareerPaths(userData);
  }
};

const simpleFallbackCareerPaths = (userData: UserData): CareerPath[] => {
  const goal = userData.careerGoal || 'Career Development';
  return [
    {
      pathName: `Getting Started with ${goal}`,
      description: `Foundational path to begin your journey in ${goal}`,
      difficulty: 'beginner',
      estimatedTimeToComplete: '2 months',
      relevanceScore: 95,
      modules: [
        { title: 'Module 1: Core Concepts', description: 'Learn key terminology and foundational ideas', estimatedHours: 6, keySkills: ['Fundamentals', 'Terminology'] },
        { title: 'Module 2: Essential Skills', description: 'Build must-have skills for this field', estimatedHours: 8, keySkills: ['Core skills', 'Practical basics'] },
        { title: 'Module 3: First Project', description: "Apply what you've learned in a guided project", estimatedHours: 10, keySkills: ['Application', 'Project work'] },
        { title: 'Module 4: Problem Solving', description: 'Tackle common challenges in this field', estimatedHours: 8, keySkills: ['Problem solving', 'Debugging'] },
        { title: 'Module 5: Growth Planning', description: 'Plan your continued learning journey', estimatedHours: 6, keySkills: ['Career planning', 'Self-assessment'] },
      ],
    },
    { pathName: `Intermediate ${goal}`, description: `Build on your foundation to advance in ${goal}`, difficulty: 'intermediate', estimatedTimeToComplete: '3 months', relevanceScore: 85, modules: generateDefaultModules('Intermediate Path', 5) },
    { pathName: `${goal} Specialization`, description: `Focus on specialized areas within ${goal}`, difficulty: 'advanced', estimatedTimeToComplete: '4 months', relevanceScore: 80, modules: generateDefaultModules('Specialization', 5) },
    { pathName: `Practical ${goal} Applications`, description: `Apply your knowledge in real-world scenarios`, difficulty: 'intermediate', estimatedTimeToComplete: '3 months', relevanceScore: 75, modules: generateDefaultModules('Practical Applications', 5) },
  ];
};

export const generateAINudges = async (
  userData: UserData | null,
  assessmentData: Assessment[] = [],
  pathData: CareerPathData | null = null
): Promise<AINudge[]> => {
  if (!userData) return [];

  try {
    const assessmentSummary = assessmentData.length
      ? assessmentData.map((a) => `${a.moduleName}: ${a.score}/10 (${a.accuracy ?? 0}% accuracy)`).join(', ')
      : 'No recent assessments';

    const prompt = `You are a personalized learning coach. Generate 3 motivating, specific nudges for the following learner.

LEARNER SNAPSHOT:
- Career path: ${pathData?.careerName || 'Learning journey'}
- Overall progress: ${pathData?.progress ?? 0}%
- Modules completed: ${pathData?.completedModules?.length ?? 0}
- Recent performance: ${assessmentSummary}

NUDGE REQUIREMENTS:
- Each nudge must be directly relevant to the learner's current progress and performance
- Be specific — avoid generic motivational platitudes
- Keep each message under 150 characters
- Include exactly one nudge of type "challenge"
- Types: "tip" (learning advice), "recommendation" (next action), "challenge" (stretch goal)
- Icons: "bulb" for insight/advice, "rocket" for action/challenge

OUTPUT FORMAT — Return ONLY a JSON array of exactly 3 nudges, no preamble:
[
  {
    "type": "tip | recommendation | challenge",
    "text": "Specific, actionable nudge under 150 characters",
    "actionText": "Optional CTA button label",
    "icon": "bulb | rocket"
  }
]`;

    const selectedModel = selectBestModel('nudges', 'educational', 'low', true);
    const response = await llmCompletion(prompt, selectedModel);
    const result = sanitizeJSON(response);
    return typeof result === 'string' ? JSON5.parse(result) : (result as AINudge[]);
  } catch {
    return [
      { type: 'tip', text: 'Consistency beats intensity — even 20 minutes a day compounds over time.', icon: 'bulb' },
      { type: 'recommendation', text: 'Revisit your last module to reinforce key concepts before moving forward.', icon: 'bulb' },
      { type: 'challenge', text: 'Aim for a perfect score on your next quiz. You have what it takes.', icon: 'rocket' },
    ];
  }
};

export const generateCareerSummary = async ({
  user,
  careerPath,
  assessments,
}: CareerSummaryParams): Promise<string> => {
  try {
    const assessmentLines = assessments
      .map((a) => `- ${a.moduleName}: ${a.score}/10 — ${a.feedback}`)
      .join('\n');

    const prompt = `You are SkillCompass, an expert AI career coach. Write a comprehensive, deeply personal career summary report for ${user.name || 'this learner'}.

REPORT STYLE:
- Write as a narrative — no bullet points, no section headers
- Speak directly to the learner in second person ("you")
- Tone: warm, professional, encouraging, and honest
- Make every paragraph feel tailored — avoid generic statements

REPORT STRUCTURE (weave naturally, do not use headers):
1. Warm, personalized opening that acknowledges their journey and goals
2. Honest progress recap — what they've achieved so far (modules, percentage)
3. Performance reflection — quiz results, patterns of strength, where they excel
4. Clear improvement guidance — specific skills or areas to focus on next
5. Forward vision — where this trajectory leads if they stay consistent; realistic ambitions
6. Job/internship readiness assessment — which roles suit them now, what gaps remain
7. Concrete next steps — 2–3 specific actions (projects, certifications, habits, resources)
8. Motivational close — affirm their potential with specificity, not flattery
9. Three sharp, practical AI nudges as a closing paragraph (inline, not a list)

LEARNER PROFILE:
- Name: ${user.name}
- Career Goal: ${careerPath.careerName}
- Interests: ${user.interests?.join(', ') || 'Not specified'}
- Skills: ${user.skills?.join(', ') || 'Not specified'}

LEARNING JOURNEY:
- Total modules: ${careerPath.modules?.length ?? 0}
- Completed modules: ${careerPath.completedModules?.length ?? 0}
- Overall progress: ${careerPath.progress}%
- Recommended skills: ${careerPath.recommendedSkills?.join(', ') || 'None listed'}

ASSESSMENT RESULTS:
${assessmentLines || 'No assessments recorded yet.'}

Generate the full report now. Write only the report — no preamble or metadata.`;

    return await llmCompletion(prompt, 'llama-3.3-70b-versatile');
  } catch (error) {
    console.error('Career Summary Generation Error:', error);
    throw error;
  }
};

/**
 * Generates a comprehensive career summary from learning guidance data
 * Used to create personalized summaries for each career path with actual progress
 */
export const generateCareerSummaryFromLearningGuidance = async (learningGuidanceData: {
  name: string;
  age?: number;
  career_goal: string;
  current_skills: string[];
  interests: string[];
  assessment_answers?: Record<string, string>;
  completion_percentage: number;
  learning_modules: Array<{
    title: string;
    description: string;
    status: string;
    completion_percentage: number;
    estimated_time: string;
    module_order?: number;
  }>;
}): Promise<string> => {
  try {
    // Calculate module statistics
    const totalModules = learningGuidanceData.learning_modules.length;
    const completedModules = learningGuidanceData.learning_modules.filter(
      (m) => m.status === 'completed'
    ).length;
    const activeModules = learningGuidanceData.learning_modules.filter(
      (m) => m.status === 'active'
    ).length;
    const totalEstimatedHours = learningGuidanceData.learning_modules
      .reduce((acc, module) => {
        const match = module.estimated_time.match(/(\d+)/);
        return acc + (match ? parseInt(match[0]) : 0);
      }, 0);

    // Build module progress report
    const completedModulesList = learningGuidanceData.learning_modules
      .filter((m) => m.status === 'completed')
      .map((m) => `${m.title} (${m.completion_percentage}% complete)`)
      .join(', ');

    const inProgressModules = learningGuidanceData.learning_modules
      .filter((m) => m.status === 'active')
      .map((m) => `${m.title} (${m.completion_percentage}% in progress)`)
      .join(', ');

    // Create comprehensive prompt
    const prompt = `You are SkillCompass, an expert AI career coach specializing in personalized career guidance. Generate a comprehensive, deeply personal career summary report for this learner.

LEARNER PROFILE:
- Name: ${learningGuidanceData.name}
- Age: ${learningGuidanceData.age || 'Not specified'}
- Career Goal: ${learningGuidanceData.career_goal}
- Current Skills: ${learningGuidanceData.current_skills.join(', ')}
- Interests: ${learningGuidanceData.interests.join(', ')}

LEARNING PROGRESS:
- Overall Completion: ${learningGuidanceData.completion_percentage}%
- Total Modules: ${totalModules}
- Completed Modules: ${completedModules}
- Active Modules: ${activeModules}
- Completed: ${completedModulesList || 'None yet'}
- In Progress: ${inProgressModules || 'None'}
- Estimated Total Study Time: ${totalEstimatedHours} hours

CAREER PATH DETAILS:
${learningGuidanceData.learning_modules
  .sort((a, b) => (a.module_order ?? 0) - (b.module_order ?? 0))
  .map(
    (m, idx) => `${idx + 1}. ${m.title} (Status: ${m.status}, ${m.completion_percentage}% done, ${m.estimated_time})
   Description: ${m.description}`
  )
  .join('\n')}

REPORT REQUIREMENTS:
Write a detailed narrative (not bullet points) speaking directly to the learner in second person. Include:

1. **Warm Opening**: Acknowledge their journey, ${learningGuidanceData.career_goal}, and progress so far
2. **Progress Recognition**: Celebrate what they've completed (${completedModules}/${totalModules} modules, ${learningGuidanceData.completion_percentage}% overall)
3. **Strength Analysis**: Identify their strongest areas based on completed modules and interests
4. **Current Status**: Analyze active modules (${inProgressModules ? `currently working on: ${inProgressModules}` : 'none yet'})
5. **Skill Development**: Show how their current skills (${learningGuidanceData.current_skills.join(', ')}) are building toward their goal
6. **Immediate Next Steps**: Specific recommendations for the next 1-2 modules to focus on
7. **Career Trajectory**: How this path leads toward ${learningGuidanceData.career_goal}
8. **Realistic Timeline**: Based on ${totalEstimatedHours} estimated hours total
9. **Motivational Close**: Personalized encouragement with specific details from their journey

Write only the report narrative — no headers, no lists, no metadata. Make it feel personally written for this learner.`;

    const summary = await llmCompletion(prompt, 'llama-3.3-70b-versatile');
    return summary;
  } catch (error) {
    console.error('Career Summary Generation Error:', error);
    throw error;
  }
};

export const getResponsiveContent = (
  content: ModuleContent | null,
  deviceType = 'desktop'
): ResponsiveContent | null => {
  if (!content) return null;
  const responsiveContent: ResponsiveContent = { ...content };

  const contentLimit = deviceType === 'mobile' ? 500 : deviceType === 'tablet' ? 1000 : Infinity;
  const codeLimit    = deviceType === 'mobile' ? 300 : deviceType === 'tablet' ? 500  : Infinity;

  if (deviceType !== 'desktop') {
    responsiveContent.sections = responsiveContent.sections.map((section) => ({
      ...section,
      content: section.content.length > contentLimit
        ? section.content.substring(0, contentLimit) + '...'
        : section.content,
      codeExample: section.codeExample
        ? {
            ...section.codeExample,
            code: section.codeExample.code.length > codeLimit
              ? section.codeExample.code.substring(0, codeLimit) + '\n// ... more code ...'
              : section.codeExample.code,
          }
        : null,
    }));
  }

  return responsiveContent;
};

export const detectDeviceType = (userAgent: string, screenWidth = 1920): string => {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  if (isMobile) return /iPad|Tablet/i.test(userAgent) ? 'tablet' : 'mobile';
  if (screenWidth < 768) return 'mobile';
  if (screenWidth < 1024) return 'tablet';
  return 'desktop';
};

export const canUseAdvancedModels = async (): Promise<boolean> => {
  try {
    const start = Date.now();
    const response = await fetch(`${API_BASE_URL}/models`, {
      method: 'HEAD',
      headers: { Authorization: `Bearer ${GROQ_API_KEY}` },
    });
    return response.ok && Date.now() - start < 300;
  } catch {
    return false;
  }
};

export const generateTopicElaboration = async (
  topic: string,
  moduleName = '',
  options: Record<string, unknown> = {}
): Promise<ElaborationContent> => {
  if (!topic || typeof topic !== 'string') throw new Error('Invalid topic provided');

  const fullTopic = moduleName ? `${moduleName}: ${topic}` : topic;
  const isTechTopic = isCodeRelatedTopic(fullTopic);
  const isKeyPoints = fullTopic.toLowerCase().includes('key points');
  const preferredModel = 'llama-3.1-8b-instant';
  const fallbackModels = ['llama3-70b-8192', 'llama-3.3-70b-versatile', 'gemma2-9b-it'];

  const codeBlock = isTechTopic
    ? `"codeExample": {
            "language": "appropriate language",
            "code": "// Focused, runnable example\\nfunction example() {\\n  // implementation\\n}",
            "explanation": "What this code demonstrates and why it matters"
          }`
    : `"codeExample": null`;

  const prompt = `You are an expert educator. Provide a clear, detailed elaboration on the topic: "${fullTopic}".

REQUIREMENTS:
- Be factual, precise, and grounded in established knowledge
- Explain complex ideas with clarity and concrete examples
- Highlight non-obvious insights that add genuine value
- Maintain an engaging yet academic tone
${isKeyPoints ? '- This is a key-points request: organize content as concise, actionable insights' : ''}
${isTechTopic ? '- Include focused code examples with clear explanations of what they demonstrate' : ''}

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "title": "Clear, descriptive title for this elaboration",
  "sections": [
    {
      "title": "Section heading",
      "content": "Thorough explanation with examples and clarifications (100+ words)",
      "keyPoints": ["Key insight 1", "Key insight 2", "Key insight 3"],
      ${codeBlock}
    }
  ],
  "modelUsed": "${preferredModel}"
}`;

  let elaborationContent: ElaborationContent | null = null;

  try {
    const text = await llmCompletion(prompt, preferredModel);
    const result = sanitizeJSON(text);
    elaborationContent = typeof result === 'string' ? JSON5.parse(result) : (result as ElaborationContent);
    if (elaborationContent && !elaborationContent.modelUsed) elaborationContent.modelUsed = preferredModel;
  } catch {
    for (const fallbackModel of fallbackModels) {
      try {
        const fallbackPrompt = prompt.replace(`"modelUsed": "${preferredModel}"`, `"modelUsed": "${fallbackModel}"`);
        const text = await llmCompletion(fallbackPrompt, fallbackModel);
        const result = sanitizeJSON(text);
        elaborationContent = typeof result === 'string' ? JSON5.parse(result) : (result as ElaborationContent);
        if (!elaborationContent?.sections?.length) throw new Error('Invalid content structure');
        if (!elaborationContent.modelUsed) elaborationContent.modelUsed = fallbackModel;
        break;
      } catch {
        continue;
      }
    }
  }

  if (!elaborationContent) {
    return {
      title: topic,
      modelUsed: 'Fallback Content',
      error: "Unable to generate elaboration. Please try again.",
      sections: [{
        title: 'Temporarily Unavailable',
        content: `Detailed content for "${topic}" couldn't be generated right now. This is likely a temporary issue with the AI service.`,
        keyPoints: ['Try again in a moment', 'Try a more specific topic', 'Explore other sections of the module'],
      }],
    };
  }

  return themeElaborationContent(elaborationContent);
};

export const testModelFallback = async (): Promise<TestResult> => {
  try {
    const result = await llmCompletion('Say hello in one sentence.', 'invalid-model-name');
    return { success: true, message: 'Fallback mechanism working correctly' };
  } catch (error) {
    return { success: false, message: (error as Error).message };
  }
};

// ==================== GROQ SERVICE FUNCTIONS ====================

export async function countTokens(messages: ChatMessage[]): Promise<CountTokensResponse> {
  try {
    const totalCharacters = messages.reduce((sum, msg) => sum + (msg.content || msg.message || '').length, 0);
    return { totalTokens: Math.ceil(totalCharacters / 4) };
  } catch (error) {
    throw error;
  }
}

export async function generateContent(request: GenerateContentRequest): Promise<GenerateContentResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${GROQ_API_KEY}` },
      body: JSON.stringify({
        model: MODEL,
        messages: request.messages,
        temperature: request.temperature ?? 0.7,
        max_tokens: request.max_tokens ?? 2048,
        top_p: request.top_p ?? 0.95,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const msg = (errorData as any).error?.message;
      if (response.status === 429) throw new Error(`Rate limit exceeded: ${msg}. Please try again later.`);
      if (response.status === 400) throw new Error(`Invalid request: ${msg || 'Bad request format'}`);
      if (response.status === 401 || response.status === 403) throw new Error('Authentication failed. Please check your API key.');
      throw new Error(`Groq API error (${response.status}): ${msg || response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw error;
  }
}

export async function sendChatMessage(
  messages: ChatMessage[],
  generationConfig?: Partial<GenerateContentRequest>
): Promise<string> {
  try {
    const response = await generateContent({
      messages,
      temperature: generationConfig?.temperature ?? 0.7,
      max_tokens: generationConfig?.max_tokens ?? 2048,
      top_p: generationConfig?.top_p ?? 0.95,
    });

    if (response.choices?.length) return response.choices[0].message.content;
    throw new Error('No response from Groq API');
  } catch (error) {
    throw error;
  }
}

// ==================== SYSTEM MESSAGES ====================

const DOMAIN_SYSTEM_PROMPTS: Record<string, string> = {
  technology: `You are an expert technology mentor. Your expertise spans programming languages and frameworks, software architecture and design patterns, cloud computing and DevOps, cybersecurity, data engineering, and technology career paths.

Your approach: Be precise and practical. Tailor explanations to the learner's level. Include code examples when they add clarity. Ground advice in real industry standards and current market demands. Encourage sound engineering habits.`,

  business: `You are an expert business advisor. Your expertise spans business strategy and planning, leadership and management, market analysis, financial planning, entrepreneurship, project management, and organizational development.

Your approach: Think strategically and practically. Use real-world frameworks and business cases. Give actionable recommendations grounded in current market conditions. Balance ambition with pragmatism.`,

  science: `You are an expert science educator. Your expertise spans research methodology, data analysis, laboratory techniques, scientific communication, peer review, and academic career development.

Your approach: Be rigorous and evidence-based. Explain mechanisms clearly with appropriate analogies. Reference scientific consensus while acknowledging areas of active research. Encourage critical thinking and intellectual curiosity.`,

  healthcare: `You are an expert healthcare advisor. Your expertise spans medical education, clinical best practices, patient-centered care, healthcare technology, professional development, and healthcare systems.

Your approach: Be compassionate, evidence-based, and patient-centered. Emphasize safety, empathy, and continuous learning. Ground advice in established clinical guidelines and current healthcare innovations.`,

  creative: `You are an expert creative mentor. Your expertise spans artistic technique, portfolio development, design thinking, creative problem-solving, professional opportunities, and building a creative career.

Your approach: Be inspiring and constructively critical. Balance creative exploration with professional viability. Connect craft to industry standards. Help learners find their authentic voice while building marketable skills.`,

  education: `You are an expert educational advisor. Your expertise spans teaching methodology, curriculum design, student engagement, educational technology, assessment strategies, and learning science.

Your approach: Be clear, supportive, and evidence-based. Connect pedagogy to practical classroom realities. Prioritize student-centered approaches. Reference current educational research and best practices.`,

  finance: `You are an expert financial advisor. Your expertise spans investment strategy, financial planning, risk management, tax optimization, banking systems, and wealth management.

Your approach: Be data-driven and precise. Use concrete numbers and scenarios. Acknowledge risk honestly. Ground advice in regulatory context and current market conditions. Prioritize long-term financial health.`,

  general: `You are an expert learning coach and mentor. Your expertise spans learning strategies, goal setting, critical thinking, communication, time management, personal development, and professional growth.

Your approach: Be encouraging and practical. Help learners clarify their goals and build actionable plans. Draw connections between concepts and real-world application. Celebrate progress and reframe setbacks constructively.`,
};

export function createDomainGuidanceSystemMessage(domain = 'general'): ChatMessage {
  return { role: 'system', content: DOMAIN_SYSTEM_PROMPTS[domain] ?? DOMAIN_SYSTEM_PROMPTS.general };
}

export function createCareerGuidanceSystemMessage(): ChatMessage {
  return createDomainGuidanceSystemMessage('business');
}

export function formatMessagesForGroq(
  messages: Array<{ id: string; sender: 'user' | 'bot'; message: string; timestamp: Date }>
): ChatMessage[] {
  return messages.map((msg) => ({
    role: msg.sender === 'user' ? 'user' : 'assistant',
    content: msg.message,
  }));
}

// ==================== VIDEO RECOMMENDATIONS ====================

export const generateVideoRecommendations = async (
  moduleName: string,
  content: string,
  options: { limit?: number } = { limit: 6 }
): Promise<VideoRecommendationsResponse> => {
  if (!moduleName || typeof moduleName !== 'string') throw new Error('Invalid module name provided');

  try {
    const { domain, category } = getDomainContext(moduleName);
    const limit = options.limit ?? 6;

    const keywordPrompt = `You are a search expert. Analyze this educational content and generate 3 highly specific YouTube search queries to find the best tutorial videos.

MODULE: "${moduleName}"
CATEGORY: ${category}
CONTENT PREVIEW: ${content.substring(0, 500)}

REQUIREMENTS:
- Queries must be specific enough to surface high-quality tutorials
- Prioritize hands-on, practical content
- Think like a learner searching for help with this exact topic

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "searchQueries": [
    "specific search query 1",
    "specific search query 2",
    "specific search query 3"
  ]
}`;

    const keywordText = await llmCompletion(keywordPrompt, selectBestModel('content-analysis', domain, 'fast'));
    const keywordResult = sanitizeJSON(keywordText);
    const queries = (typeof keywordResult === 'string' ? JSON5.parse(keywordResult) : keywordResult) as { searchQueries: string[] };
    const searchQuery = queries.searchQueries?.[0] || `${moduleName} tutorial`;

    const videos = await searchYouTubeVideos(searchQuery, limit);

    const rankingPrompt = `Rank these YouTube videos by how useful they would be for a learner studying "${moduleName}".

VIDEOS: ${JSON.stringify(videos.slice(0, 3))}

Rate each by relevance and difficulty. Return ONLY a JSON array:
[{"index": 0, "relevanceScore": 0.95, "difficulty": "beginner"}, ...]`;

    const rankText = await llmCompletion(rankingPrompt, selectBestModel('content-analysis', domain, 'fast'));
    const ranking = sanitizeJSON(rankText);
    const scores = Array.isArray(ranking) ? ranking : [];

    const enrichedVideos = videos.map((video, idx) => {
      const score = scores.find((s: any) => s.index === idx) || {};
      return { ...video, relevanceScore: score.relevanceScore ?? 0.8, difficulty: score.difficulty ?? 'beginner' };
    });

    return {
      moduleName,
      topicSummary: `Top video tutorials for "${moduleName}" to support your learning.`,
      videos: enrichedVideos.slice(0, limit),
    };
  } catch {
    return { moduleName, topicSummary: `Video tutorials for ${moduleName}`, videos: [] };
  }
};

async function searchYouTubeVideos(query: string, limit: number): Promise<VideoRecommendation[]> {
  try {
    const serperApiKey = import.meta.env.VITE_SERPER_API_KEY;
    if (!serperApiKey) return [];

    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: { 'X-API-KEY': serperApiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({ q: query, type: 'videos', num: limit }),
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!data.videos || !Array.isArray(data.videos)) return [];

    return data.videos.map((video: any, idx: number) => {
      const videoId = video.link?.split('v=')[1]?.split('&')[0] || '';
      return {
        title: video.title || 'Untitled Video',
        channel: video.channel || 'YouTube Channel',
        duration: video.duration,
        link: video.link || `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
        imageUrl: video.thumbnail || (videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : ''),
        keywords: [query],
        relevanceScore: Math.max(0.7, 0.95 - idx * 0.08),
        date: video.date,
        snippet: video.snippet || '',
      };
    });
  } catch {
    return [];
  }
}

// ==================== CHAT HISTORY FUNCTIONS ====================

const STORAGE_KEY = 'career_guidance_chat_sessions';
const CURRENT_SESSION_KEY = 'career_guidance_current_session';

export function getAllChatSessions(): ChatSession[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    return JSON.parse(data).map((session: any) => ({
      ...session,
      createdAt: new Date(session.createdAt),
      updatedAt: new Date(session.updatedAt),
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch {
    return [];
  }
}

export function getChatSession(sessionId: string): ChatSession | null {
  return getAllChatSessions().find((s) => s.id === sessionId) ?? null;
}

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

export function saveChatSession(session: ChatSession): void {
  try {
    const sessions = getAllChatSessions();
    const index = sessions.findIndex((s) => s.id === session.id);
    if (index >= 0) sessions[index] = session;
    else sessions.push(session);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions.slice(-50)));
  } catch (error) {
    console.error('Error saving chat session:', error);
  }
}

export function addMessageToSession(sessionId: string, message: ChatMessage): ChatSession | null {
  const session = getChatSession(sessionId);
  if (!session) return null;
  session.messages.push(message);
  session.updatedAt = new Date();
  if (session.messages.length === 1 && message.sender === 'user' && session.title.includes('Chat ')) {
    const text = message.message || '';
    session.title = text.length > 50 ? text.substring(0, 50) + '...' : text;
  }
  saveChatSession(session);
  return session;
}

export function updateSessionTokenCount(sessionId: string, tokenCount: number): void {
  const session = getChatSession(sessionId);
  if (session) {
    session.tokenCount = tokenCount;
    session.updatedAt = new Date();
    saveChatSession(session);
  }
}

export function deleteChatSession(sessionId: string): void {
  try {
    const sessions = getAllChatSessions().filter((s) => s.id !== sessionId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    if (getCurrentSessionId() === sessionId) {
      setCurrentSessionId(sessions[sessions.length - 1]?.id || '');
    }
  } catch (error) {
    console.error('Error deleting chat session:', error);
  }
}

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

export function getCurrentSessionId(): string {
  try { return localStorage.getItem(CURRENT_SESSION_KEY) || ''; }
  catch { return ''; }
}

export function setCurrentSessionId(sessionId: string): void {
  try { localStorage.setItem(CURRENT_SESSION_KEY, sessionId); }
  catch (error) { console.error('Error setting current session:', error); }
}

export function getCurrentSession(): ChatSession | null {
  const id = getCurrentSessionId();
  return id ? getChatSession(id) : null;
}

export function exportSessionAsText(session: ChatSession): string {
  let text = `Career Guidance Chat — ${session.title}\n`;
  text += `Created: ${session.createdAt.toLocaleString()}\n\n${'='.repeat(50)}\n\n`;
  session.messages.forEach((msg) => {
    const sender = msg.sender === 'user' ? 'You' : 'Career Advisor';
    text += `${sender} (${msg.timestamp?.toLocaleTimeString()}):\n${msg.message || msg.content}\n\n`;
  });
  return text;
}

export function exportSessionAsJSON(session: ChatSession): string {
  return JSON.stringify(session, null, 2);
}

// ==================== DEMO MODE ====================

const demoResponses: Record<string, string> = {
  'market opportunities': `Here are key insights about current career market opportunities:

**High-Demand Sectors:**
- AI and machine learning engineers (35%+ YoY job growth)
- Cloud architects (AWS, Azure, GCP)
- Cybersecurity specialists
- Data engineers and analysts
- Healthcare technology professionals

**Emerging Opportunities:**
- FinTech and embedded finance
- Sustainable technology (green tech, ESG)
- Edge computing and IoT
- Healthcare AI and diagnostics

**Strategies to Stay Competitive:**
1. Build depth in one domain, breadth across adjacent skills
2. Earn a recognized certification (AWS, Google, PMI, etc.)
3. Contribute to open-source for visibility and portfolio
4. Network actively on LinkedIn and at industry events
5. Follow industry leaders and track salary benchmarks (Levels.fyi, Glassdoor)

Would you like specific recommendations for your skill set?`,

  'skills develop': `Here's a strategic skills development roadmap:

**Technical Skills to Prioritize:**
- Python and/or JavaScript/TypeScript
- Cloud platforms (AWS, Azure, or GCP)
- Data analysis and visualization
- API design (REST and GraphQL)
- SQL and NoSQL databases

**High-Value Soft Skills:**
- Clear written and verbal communication
- Project management (Agile, Scrum)
- Problem decomposition and critical thinking
- Stakeholder management
- Mentoring and knowledge sharing

**12-Month Learning Progression:**
1. **Months 1–2:** Master one core technical skill from scratch or deepen existing knowledge
2. **Months 3–4:** Build 2–3 portfolio projects that demonstrate real-world application
3. **Months 5–6:** Freelance, contribute to open-source, or take on a stretch project at work
4. **Month 7+:** Pursue specialization and target senior-level concepts

**Learning Resources:**
- Structured courses: Coursera, Pluralsight, Frontend Masters
- Practice: LeetCode, HackerRank, Exercism
- Community: Stack Overflow, Dev.to, GitHub Discussions

What specific skill area do you want to focus on?`,

  'career path': `Here's a framework for intentional career path planning:

**Stage 1 — Foundation (0–2 years):**
- Master core skills and build fundamental knowledge
- Work across diverse projects to discover your strengths
- Start building your professional network intentionally
- Create a portfolio that demonstrates real results

**Stage 2 — Specialization (2–5 years):**
- Develop deep expertise in a chosen area
- Begin mentoring others and owning larger projects
- Establish a professional reputation through contributions
- Build relationships with senior leaders in your field

**Stage 3 — Senior/Lead (5+ years):**
- Drive technical or strategic decisions
- Mentor junior colleagues consistently
- Choose your track: deep technical expertise or leadership path

**Career Tracks to Consider:**
1. **Individual Contributor:** Specialist → Senior → Principal → Staff/Distinguished
2. **Management:** Team Lead → Engineering Manager → Director → VP
3. **Hybrid/Entrepreneurial:** Consulting, fractional leadership, or founding

**Questions to Clarify Your Direction:**
- Do you prefer deep technical problem-solving or leading people?
- Which industries excite you long-term?
- Are you drawn to startups, scale-ups, or enterprises?
- Would you consider independent work or entrepreneurship?

Let's talk through which path fits your goals.`,

  'salary negotiate': `Salary negotiation is a skill that pays for itself repeatedly. Here's how to approach it:

**Preparation (Do This Before Any Conversation):**
1. Research your market value (Glassdoor, Levels.fyi, LinkedIn Salary, Payscale)
2. Quantify your impact with specific numbers and outcomes
3. Know your walk-away number and total compensation target
4. Get competing offers if possible — leverage dramatically improves outcomes

**During Negotiation:**
- Start with gratitude, then move quickly to your number
- Anchor high — you can always come down, rarely up
- Justify your ask with data: experience, market rates, your documented impact
- Negotiate total comp: base, bonus, equity, benefits, PTO, flexibility
- Get every commitment in writing

**Key Leverage Points:**
- Years of specialized experience
- Measurable results you've driven (revenue, cost savings, efficiency)
- Competing offers or market demand for your skills
- Unique certifications or hard-to-find expertise

**Practical Tips:**
1. Never accept on the spot — always ask for time to review
2. Negotiate every offer, even if it seems fair (15–25% increases are common)
3. Non-monetary benefits (remote work, learning budget, equity vesting) are negotiable too
4. Timing matters: negotiate during the offer phase or annual review cycle

What stage of negotiation are you in?`,

  default: `I'm your AI Career Guidance Assistant. Here's what I can help you with:

✓ Career path planning and progression strategy
✓ Skills development roadmaps tailored to your goals
✓ Interview preparation and mindset coaching
✓ Salary negotiation tactics and market benchmarking
✓ Work-life balance and sustainable performance habits
✓ Networking strategies that actually work
✓ Industry trend analysis and opportunity mapping
✓ Professional development planning

Ask me anything about your career journey — I'll give you practical, personalized guidance based on where you are and where you want to go.

What's on your mind?`,
};

export function getDemoResponse(userMessage: string): string {
  const lower = userMessage.toLowerCase();
  for (const [key, value] of Object.entries(demoResponses)) {
    if (key !== 'default' && lower.includes(key)) return value;
  }
  return demoResponses.default;
}

export function shouldUseDemoMode(): boolean {
  const demoMode = localStorage.getItem('use_demo_mode');
  return demoMode === 'true' || import.meta.env.VITE_DEMO_MODE === 'true';
}

export function setDemoMode(enabled: boolean): void {
  localStorage.setItem('use_demo_mode', enabled ? 'true' : 'false');
}

// ==================== RESUME EXTRACTION ====================

export const analyzeResumeWithAI = async (resumeText: string): Promise<ExtractedResume> => {
  if (!resumeText?.trim()) throw new Error('Resume text cannot be empty');

  try {
    const prompt = `You are an expert resume parser with years of experience reading technical and professional CVs. Extract all information from the resume below completely and accurately.

RESUME TEXT:
"""
${resumeText}
"""

EXTRACTION RULES:
1. Extract every skill mentioned — do not limit to a top-N list
2. Extract all work experience entries, including internships and part-time roles
3. Extract all projects, including side projects and open-source contributions
4. Calculate totalYearsExperience from date ranges (treat "current" or "present" as today)
5. Extract the full professional summary or profile statement
6. Capture all links: LinkedIn, GitHub, portfolio, personal website
7. Extract certifications, awards, and relevant extracurricular activities

OUTPUT FORMAT — Return ONLY valid JSON, no markdown or extra text:
{
  "candidateName": "Full name",
  "email": "email@example.com",
  "phone": "phone number or null",
  "location": "city, country or null",
  "summary": "Full professional summary text or null",
  "totalYearsExperience": 3,
  "topSkills": ["skill1", "skill2", "skill3"],
  "allSkills": ["complete", "list", "of", "every", "skill"],
  "workExperience": [
    {
      "jobTitle": "Job Title",
      "company": "Company Name",
      "duration": "Month Year – Month Year or current",
      "description": "One-line summary",
      "fullDescription": "Complete description exactly as written in the resume",
      "keyResponsibilities": ["Responsibility 1", "Responsibility 2"],
      "achievements": ["Measurable achievement 1", "Achievement 2"]
    }
  ],
  "projects": [
    {
      "name": "Project name",
      "description": "One-line summary",
      "fullDescription": "Complete description from resume",
      "technologies": ["tech1", "tech2"],
      "keyFeatures": ["Feature 1", "Feature 2"],
      "links": { "github": "url or null", "demo": "url or null", "website": "url or null" }
    }
  ],
  "education": [
    {
      "degree": "B.Tech / MBA / etc.",
      "field": "Field of Study",
      "institution": "University Name",
      "graduationYear": "2025 or null",
      "cgpa": "9.1 or null"
    }
  ],
  "certifications": ["Certification 1", "Certification 2"],
  "links": {
    "linkedin": "url or null",
    "github": "url or null",
    "portfolio": "url or null",
    "website": "url or null"
  }
}`;

    const selectedModel = selectBestModel('resume-analysis', 'technical', 'high');
    const response = await llmCompletion(prompt, selectedModel);

    const jsonMatch = response.trim().match(/\{[\s\S]*\}/);
    const jsonString = jsonMatch ? jsonMatch[0] : response.trim();
    const result = sanitizeJSON(jsonString);
    const parsed = typeof result === 'string' ? JSON5.parse(result) : result;

    const allSkills = Array.isArray(parsed.allSkills)
      ? parsed.allSkills
      : Array.isArray(parsed.topSkills)
        ? parsed.topSkills
        : [];

    const resumeData: ExtractedResume = {
      candidateName: parsed.candidateName || 'Unknown',
      email: parsed.email || '',
      phone: parsed.phone || undefined,
      location: parsed.location || undefined,
      totalYearsExperience: Number(parsed.totalYearsExperience) || 0,
      topSkills: allSkills.slice(0, 10),
      summary: parsed.summary || undefined,
      workExperience: Array.isArray(parsed.workExperience) ? parsed.workExperience : [],
      projects: Array.isArray(parsed.projects) ? parsed.projects : undefined,
      education: Array.isArray(parsed.education) ? parsed.education : [],
      certifications: Array.isArray(parsed.certifications) ? parsed.certifications : undefined,
      linkedIn: parsed.links?.linkedin || parsed.linkedIn || undefined,
      portfolio: parsed.links?.portfolio || parsed.links?.website || parsed.portfolio || undefined,
    };

    return resumeData;
  } catch (error) {
    throw new Error(`Resume analysis failed: ${(error as Error).message}`);
  }
};

export const extractResumeInformation = (resumeText: string): Partial<ExtractedResume> => {
  const extracted: Partial<ExtractedResume> = { topSkills: [], workExperience: [], education: [], certifications: [] };
  if (!resumeText) return extracted;

  const text = resumeText.toLowerCase();

  const emailMatch = resumeText.match(/([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/);
  if (emailMatch) extracted.email = emailMatch[1];

  const phoneMatch = resumeText.match(/(\+?1?\s*\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4})/);
  if (phoneMatch) extracted.phone = phoneMatch[1];

  const linkedInMatch = resumeText.match(/linkedin\.com\/in\/([a-zA-Z0-9-]+)/i);
  if (linkedInMatch) extracted.linkedIn = `https://linkedin.com/in/${linkedInMatch[1]}`;

  const yearsMatch = text.match(/(\d+)\+?\s*years?\s*of\s*experience/);
  if (yearsMatch) extracted.totalYearsExperience = parseInt(yearsMatch[1], 10);

  const commonSkills = [
    'JavaScript', 'TypeScript', 'React', 'Vue', 'Angular', 'Node.js', 'Python',
    'Java', 'C++', 'C#', 'SQL', 'MongoDB', 'PostgreSQL', 'Firebase', 'AWS',
    'Azure', 'Docker', 'Kubernetes', 'Git', 'HTML', 'CSS', 'REST API',
    'GraphQL', 'Machine Learning', 'Data Science', 'AI',
  ];

  extracted.topSkills = commonSkills
    .filter((skill) => text.includes(skill.toLowerCase()))
    .slice(0, 5);

  return extracted;
};

// ==================== AI CAREER GUIDANCE FUNCTIONS ====================

export const generatePersonalizedCareerGuidance = async (userInterests: UserInterests) => {
  const profileLines = [
    `User Interests: ${userInterests.interests.join(', ')}`,
    userInterests.skills ? `Current Skills: ${userInterests.skills.join(', ')}` : '',
    userInterests.experience ? `Experience Level: ${userInterests.experience}` : '',
    userInterests.goals ? `Career Goals: ${userInterests.goals}` : '',
  ].filter(Boolean).join('\n');

  const prompt = `You are an expert career advisor. Based on the following user profile, provide detailed personalized career guidance.

USER PROFILE:
${profileLines}

TASK: Recommend exactly 4 careers that genuinely match this person's interests, skills, and goals.

For each career, provide:
- A clear title and rich description of day-to-day reality
- Specific job responsibilities (not generic)
- A realistic career growth trajectory from entry-level to senior
- Accurate salary range and industry context
- Current job market demand and projected growth
- A concise explanation of why this career fits their specific profile

Also provide:
- Overall guidance: a cohesive message about their career direction
- Summary: a brief assessment of their career potential and recommended focus

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "recommendedCareers": [
    {
      "careerTitle": "Career Title",
      "description": "What this career actually involves day-to-day",
      "jobResponsibilities": "Key responsibilities and typical projects",
      "careerGrowthPath": "Entry → Mid → Senior → Lead progression",
      "industry": "Primary industry sector",
      "salaryMin": 55000,
      "salaryMax": 130000,
      "salaryCurrency": "USD",
      "demandLevel": "High | Medium | Low",
      "jobMarketDemandScore": 88,
      "growthRate": 7.2,
      "matchScore": 90,
      "reasoningAlignment": "Specific reasons why this matches their profile"
    }
  ],
  "guidance": "Personalized career direction message addressing their specific situation",
  "summary": "Brief, honest assessment of their career potential and where to focus"
}`;

  try {
    const selectedModel = selectBestModel('career-guidance', 'educational', 'high');
    const text = await retry(() => llmCompletion(prompt, selectedModel));
    const result = sanitizeJSON(text);
    return typeof result === 'string' ? JSON5.parse(result) : result;
  } catch {
    return { recommendedCareers: [], guidance: 'Unable to generate guidance at this time.', summary: 'Please try again later.' };
  }
};

export const generateCareerSkillsAnalysis = async (
  userInterests: UserInterests,
  recommendedCareers?: Array<{ careerTitle: string; description: string }>
) => {
  const careersBlock = recommendedCareers?.length
    ? `\nTARGET CAREERS:\n${recommendedCareers.map((c) => `- ${c.careerTitle}`).join('\n')}`
    : '';

  const prompt = `You are an expert skills strategist. Identify the most important skills for the following learner to develop.

USER PROFILE:
- Interests: ${userInterests.interests.join(', ')}
${userInterests.skills ? `- Current Skills: ${userInterests.skills.join(', ')}` : ''}
${careersBlock}

TASK: For each career, identify exactly 4–5 essential skills. Focus on what will make the biggest career impact.

For each skill, provide:
- Skill name and the career it supports
- Importance level (critical / high / medium / low)
- Required proficiency to be competitive (beginner / intermediate / advanced / expert)
- A concrete learning path: specific resources, projects, or steps to develop this skill

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "skills": [
    {
      "skillName": "Skill Name",
      "careerTitle": "Related Career",
      "importanceLevel": "critical",
      "proficiencyRequired": "advanced",
      "learningPath": "Specific steps, resources, and projects to develop this skill"
    }
  ]
}`;

  try {
    const selectedModel = selectBestModel('career-skills', 'technical', 'high');
    const text = await retry(() => llmCompletion(prompt, selectedModel));
    const result = sanitizeJSON(text);
    return typeof result === 'string' ? JSON5.parse(result) : result;
  } catch {
    return { skills: [] };
  }
};

export const generateCompanyRecommendations = async (
  userInterests: UserInterests,
  recommendedCareers?: Array<{ careerTitle: string; description: string }>
) => {
  const careersBlock = recommendedCareers?.length
    ? `\nTARGET CAREERS:\n${recommendedCareers.map((c) => `- ${c.careerTitle}`).join('\n')}`
    : '';

  const prompt = `You are an expert career placement advisor. Recommend specific companies for the following learner to target.

USER PROFILE:
- Interests: ${userInterests.interests.join(', ')}
${userInterests.goals ? `- Career Goals: ${userInterests.goals}` : ''}
${careersBlock}

TASK: For each career, recommend exactly 3–4 companies that actively hire for these roles and would be a strong match for this candidate.

For each company, provide:
- Company name and the career it relates to
- Industry type and company stage (startup / scale-up / enterprise)
- Typical hiring level for this candidate (entry-level / mid-level / senior / management)
- What makes this company a strong opportunity (culture, growth, mission, tech stack)

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "companies": [
    {
      "companyName": "Company Name",
      "careerTitle": "Related Career",
      "industry": "Industry Name",
      "hiringLevel": "entry-level | mid-level | senior | management",
      "jobMarketOpportunity": "Why this company is a strong opportunity for this candidate"
    }
  ]
}`;

  try {
    const selectedModel = selectBestModel('company-recommendations', 'general', 'high');
    const text = await retry(() => llmCompletion(prompt, selectedModel));
    const result = sanitizeJSON(text);
    return typeof result === 'string' ? JSON5.parse(result) : result;
  } catch {
    return { companies: [] };
  }
};

export const generateCareerRecommendations = async (
  userInterests: UserInterests,
  recommendedCareers?: Array<{ careerTitle: string; description: string }>
) => {
  const careersBlock = recommendedCareers?.length
    ? `\nCAREERS TO EVALUATE:\n${recommendedCareers.map((c) => `- ${c.careerTitle}`).join('\n')}`
    : '';

  const prompt = `You are an expert career matching advisor. Provide detailed fit assessments for the following learner.

USER PROFILE:
- Interests: ${userInterests.interests.join(', ')}
${userInterests.skills ? `- Current Skills: ${userInterests.skills.join(', ')}` : ''}
${userInterests.experience ? `- Experience Level: ${userInterests.experience}` : ''}
${careersBlock}

TASK: For each career, assess how well it fits this specific person and what concrete steps they should take to pursue it.

For each career, provide:
- Overall match score (0–100) with clear justification
- Separate alignment scores for personality, skill, and interest fit (0–100 each)
- Detailed reasoning that references the user's specific profile
- 3–4 prioritized next steps they should take to pursue this career today

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "recommendations": [
    {
      "careerTitle": "Career Title",
      "matchScore": 85,
      "personalityAlignment": 80,
      "skillAlignment": 75,
      "interestAlignment": 92,
      "reasoning": "Specific explanation referencing their interests, skills, and goals",
      "nextSteps": ["Concrete step 1", "Concrete step 2", "Concrete step 3"]
    }
  ]
}`;

  try {
    const selectedModel = selectBestModel('recommendations', 'educational', 'high');
    const text = await retry(() => llmCompletion(prompt, selectedModel));
    const result = sanitizeJSON(text);
    return typeof result === 'string' ? JSON5.parse(result) : result;
  } catch {
    return { recommendations: [] };
  }
};

export const generateJobMarketTrendAnalysis = async (
  userInterests: UserInterests,
  recommendedCareers?: Array<{ careerTitle: string; description: string }>
) => {
  const careersBlock = recommendedCareers?.length
    ? `\nCAREERS TO ANALYZE:\n${recommendedCareers.map((c) => `- ${c.careerTitle}`).join('\n')}`
    : '';

  const prompt = `You are an expert labor market analyst. Provide job market trend analysis for the following careers.

USER PROFILE:
- Interests: ${userInterests.interests.join(', ')}
${careersBlock}

TASK: For each career, identify exactly 2–3 significant market trends that will affect someone entering or growing in this field.

For each trend, provide:
- Trend name and the career it relates to
- Clear description of what's driving this trend
- Impact level on career prospects (high / medium / low)
- Current market data (employment numbers, recent growth rates)
- 5-year forecast (employment projections, salary trajectory)
- Growth potential score (0–100)

OUTPUT FORMAT — Return ONLY this JSON, no preamble:
{
  "trends": [
    {
      "trendName": "Trend Name",
      "careerTitle": "Related Career",
      "trendDescription": "What's driving this trend and why it matters",
      "impactLevel": "high | medium | low",
      "currentData": { "employment": 520000, "growth": "14% over last 3 years" },
      "forecast": { "employmentIn5Years": 680000, "salary": "3–5% annual increase expected" },
      "growthPotential": 88
    }
  ]
}`;

  try {
    const selectedModel = selectBestModel('market-trends', 'general', 'high');
    const text = await retry(() => llmCompletion(prompt, selectedModel));
    const result = sanitizeJSON(text);
    return typeof result === 'string' ? JSON5.parse(result) : result;
  } catch {
    return { trends: [] };
  }
};

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
  generatePersonalizedCareerGuidance,
  generateCareerSkillsAnalysis,
  generateCompanyRecommendations,
  generateCareerRecommendations,
  generateJobMarketTrendAnalysis,
  generateVideoRecommendations,
  generateCareerSummaryFromLearningGuidance,
};