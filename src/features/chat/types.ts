// Chat Message Types
export interface ChatMessage {
  id?: number;
  session_id: string;
  user_id: number;
  role: string;
  content: string;
  sequence_number: number;
  ai_model_used: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_time_ms: number;
  groq_request_id: string;
  finish_reason: string;
  is_helpful: boolean;
  feedback_note: string | null;
  created_at: string;
}

// Chat Session Types
export interface ChatSession {
  id: number;
  title: string;
  chat_session_code: string;
  user_id: number;
  session_id: string;
  ai_model: string;
  system_prompt: string;
  total_messages: number;
  session_status: string;
  started_at: string;
  ended_at: string | null;
  created_at: string;
  messages?: ChatMessage[];
}

// Request Types
export interface CreateChatSessionRequest {
  title: string;
  ai_model: string;
  system_prompt: string;
}

export interface UpdateChatSessionRequest {
  title?: string;
  ai_model?: string;
  system_prompt?: string;
  session_status?: string;
}

export interface CreateChatMessageRequest {
  role: string;
  content: string;
  ai_model_used: string;
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  response_time_ms: number;
  groq_request_id: string;
  finish_reason: string;
}

export interface UpdateChatMessageRequest {
  role?: string;
  content?: string;
  ai_model_used?: string;
  prompt_tokens?: number;
  completion_tokens?: number;
  total_tokens?: number;
  response_time_ms?: number;
  groq_request_id?: string;
  finish_reason?: string;
  is_helpful?: boolean;
  feedback_note?: string;
}

// UI Display Types
export interface ChatMessageDisplay {
  id: string;
  sender: 'user' | 'bot';
  message: string;
  timestamp: Date;
  isLoading?: boolean;
}

// Response Types
export interface ChatSessionsListResponse {
  data: ChatSession[];
  total: number;
  page: number;
  limit: number;
}

export interface ChatMessagesListResponse {
  data: ChatMessage[];
  total: number;
  page: number;
  limit: number;
}
