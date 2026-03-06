/**
 * API request/response types
 */

import { ICareerGuidanceContext, IMessage, IStreamingMessage, IThread } from './thread';

export interface ICreateThreadRequest {
  title: string;
  description?: string;
  metadata?: Record<string, any>;
}

export interface ICreateThreadResponse {
  thread: IThread;
}

export interface ISendMessageRequest {
  content: string;
  metadata?: Record<string, any>;
}

export interface ISendMessageResponse {
  message: IMessage;
  threadId: string;
}

export interface IGetThreadResponse {
  thread: IThread;
}

export interface IGetMessagesResponse {
  messages: IMessage[];
  threadId: string;
  total: number;
}

export interface IGetGuidanceRequest {
  threadId: string;
  topic?: string;
  context?: ICareerGuidanceContext;
}

export interface IGetGuidanceResponse {
  guidance: {
    recommendations: any[];
    learningPath?: any;
    analysis?: any;
  };
  metadata?: Record<string, any>;
}

export interface IStreamResponse {
  event: string;
  data: IStreamingMessage;
}

export interface IErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}
