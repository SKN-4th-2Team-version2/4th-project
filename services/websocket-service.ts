import {
  ChatSession,
  ChatMessage,
  ChatError,
  WebSocketMessage,
  ChatSessionType,
  ChatCategory,
  WebSocketResponse,
  SessionInitMessage,
  TypingStatus
} from '@/types/websocket';
import { getSession } from 'next-auth/react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const WS_BASE_URL = process.env.NEXT_PUBLIC_WS_BASE_URL || 'ws://localhost:8000';

class WebSocketService {
  private ws: WebSocket | null = null;
  private sessionId: string | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 3;
  private reconnectTimeout = 1000;
  private messageHandlers: ((message: WebSocketResponse) => void)[] = [];

  private async getAuthHeaders() {
    const session = await getSession();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.djangoAccessToken}`,
    };
  }

  async createSession(
    type: ChatSessionType,
    category: ChatCategory = 'general',
  ): Promise<ChatSession> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await fetch(`${API_BASE_URL}/chatbot/api/websocket/session/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ type, category }),
      });

      if (!response.ok) {
        throw new Error('세션 생성에 실패했습니다.');
      }

      const session = await response.json();
      this.sessionId = session.session_id;
      return session;
    } catch (error) {
      console.error('세션 생성 중 오류 발생:', error);
      throw error;
    }
  }

  connect(sessionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.ws) {
        this.ws.close();
      }

      this.ws = new WebSocket(`${WS_BASE_URL}/ws/chat/${sessionId}/`);

      this.ws.onopen = () => {
        console.log('WebSocket 연결됨');
        this.reconnectAttempts = 0;
        resolve();
      };

      this.ws.onclose = () => {
        console.log('WebSocket 연결 끊김');
        this.handleReconnect();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          this.messageHandlers.forEach(handler => handler(message));
        } catch (error) {
          console.error('메시지 파싱 오류:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket 에러:', error);
        reject(error);
      };
    });
  }

  sendMessage(message: string) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const wsMessage: WebSocketMessage = {
        type: 'chat',
        message: message
      };
      this.ws.send(JSON.stringify(wsMessage));
    } else {
      console.error('WebSocket이 연결되어 있지 않습니다.');
    }
  }

  addMessageHandler(handler: (message: WebSocketResponse) => void) {
    this.messageHandlers.push(handler);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== handler);
    };
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      setTimeout(() => {
        if (this.sessionId) {
          this.connect(this.sessionId);
        }
      }, this.reconnectTimeout * this.reconnectAttempts);
    }
  }

  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

export const websocketService = new WebSocketService();
