// Mock Chat Service
import { mockAssistantResponses, mockChatMessages, mockChatSuggestions } from '../data/chat';
import type { ChatMessage } from '../data/chat';
import { delay } from '../utils';

export class ChatService {
  private conversationHistory: ChatMessage[] = JSON.parse(JSON.stringify(mockChatMessages));

  /**
   * Get chat history
   */
  async getChatHistory(): Promise<ChatMessage[]> {
    await delay(300);
    return JSON.parse(JSON.stringify(this.conversationHistory));
  }

  /**
   * Send message and get response
   */
  async sendMessage(userMessage: string): Promise<ChatMessage> {
    await delay(600);

    // Add user message
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: userMessage,
      timestamp: new Date().toISOString(),
    };
    this.conversationHistory.push(userMsg);

    // Generate assistant response
    const assistantResponse = await this.generateResponse(userMessage);
    const assistantMsg: ChatMessage = {
      id: `msg-${Date.now() + 1}`,
      sender: 'assistant',
      content: assistantResponse,
      timestamp: new Date().toISOString(),
    };
    this.conversationHistory.push(assistantMsg);

    return assistantMsg;
  }

  /**
   * Generate AI response (mock)
   */
  private async generateResponse(userMessage: string): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();

    // Simple keyword matching
    if (lowerMessage.includes('javascript')) {
      return mockAssistantResponses.javascript_basics;
    }
    if (lowerMessage.includes('react') || lowerMessage.includes('hooks')) {
      return mockAssistantResponses.react_hooks;
    }
    if (lowerMessage.includes('typescript')) {
      return mockAssistantResponses.typescript_intro;
    }
    if (lowerMessage.includes('css') || lowerMessage.includes('flexbox')) {
      return mockAssistantResponses.css_flexbox;
    }
    if (lowerMessage.includes('node') || lowerMessage.includes('backend')) {
      return mockAssistantResponses.nodejs_basics;
    }

    // Default response
    return "That's a great question! I'd be happy to help. Could you provide more details about what you'd like to know?";
  }

  /**
   * Get chat suggestions
   */
  async getChatSuggestions(): Promise<string[]> {
    await delay(200);
    return JSON.parse(JSON.stringify(mockChatSuggestions));
  }

  /**
   * Clear chat history
   */
  async clearHistory(): Promise<void> {
    await delay(300);
    this.conversationHistory = [];
  }

  /**
   * Get response for specific topic
   */
  async getTopicResponse(topic: string): Promise<string> {
    await delay(400);
    const key = topic.toLowerCase().replace(/\\s+/g, '_');
    return (
      mockAssistantResponses[key as keyof typeof mockAssistantResponses] ||
      "I'm not sure about that topic. Can you ask differently?"
    );
  }

  /**
   * Rate response
   */
  async rateResponse(messageId: string, rating: number): Promise<void> {
    await delay(300);
    // In a real app, this would save the rating
    console.log(`Message ${messageId} rated: ${rating}`);
  }
}

export const mockChatService = new ChatService();
