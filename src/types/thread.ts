/**
 * Thread and Message types for career guidance system
 */

export interface IMessage {
  id: string;
  threadId: string;
  role: 'user' | 'assistant' | 'tool' | 'system';
  content: string;
  timestamp: string;
  metadata?: Record<string, any>;
  toolCalls?: IToolCall[];
  toolResults?: IToolResult[];
}

export interface IToolCall {
  id: string;
  name: string;
  args: Record<string, any>;
  status: 'pending' | 'executing' | 'completed' | 'failed';
  result?: IToolResult;
  error?: string;
}

export interface IToolResult {
  toolCallId: string;
  name: string;
  result: any;
  error?: string;
}

export interface IThread {
  id: string;
  userId: string;
  title: string;
  description?: string;
  messages: IMessage[];
  createdAt: string;
  updatedAt: string;
  metadata?: {
    topic?: string;
    tags?: string[];
    career?: string;
    skills?: string[];
  };
}

export interface IStreamingMessage {
  type: 'text' | 'tool_call' | 'tool_result' | 'metadata' | 'error';
  id: string;
  content?: string;
  delta?: string; // For streaming text content
  toolCall?: IToolCall;
  toolResult?: IToolResult;
  metadata?: Record<string, any>;
  error?: string;
  timestamp: string;
}

export interface IAgentState {
  threadId: string;
  currentStep?: string;
  status: 'idle' | 'thinking' | 'executing' | 'waiting_for_input';
  activeTools?: string[];
  context?: Record<string, any>;
}

export interface ICareerGuidanceContext {
  userBackground?: {
    currentRole?: string;
    experience?: number;
    skills?: string[];
    education?: string[];
  };
  careerGoals?: {
    targetRole?: string;
    timeline?: string;
    industries?: string[];
  };
  analysisResults?: {
    skillGaps?: string[];
    recommendations?: IRecommendation[];
    learningPath?: ILearningPath;
  };
}

export interface IRecommendation {
  id: string;
  type: 'skill' | 'course' | 'role' | 'resource';
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  reasoning: string;
  metadata?: Record<string, any>;
}

export interface ILearningPath {
  id: string;
  title: string;
  description: string;
  stages: ILearningStage[];
  estimatedDuration: string;
  skills: string[];
}

export interface ILearningStage {
  order: number;
  title: string;
  description: string;
  duration: string;
  resources: IResource[];
  objectives: string[];
}

export interface IResource {
  id: string;
  title: string;
  type: 'course' | 'article' | 'video' | 'book' | 'project';
  url?: string;
  provider?: string;
  duration?: string;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}
