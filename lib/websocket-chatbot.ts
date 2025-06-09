export interface WebSocketMessage {
  type: string;
  message?: string;
  session_id?: string;
  sources?: Array<{
    category: string;
    section: string;
    content_preview: string;
  }>;
  is_parenting_related?: boolean;
  timestamp?: string;
  error?: string;
  is_typing?: boolean;
  chunk?: string;
  is_complete?: boolean;
  history?: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
}

export interface WebSocketSession {
  session_id: string;
  type: 'normal' | 'stream';
  category: string;
  websocket_url: string;
}

export type CategoryType = 'nutrition' | 'behavior' | 'psychology' | 'education';

class ChatbotWebSocket {
  private socket: WebSocket | null = null;
  private sessionId: string | null = null;
  private sessionType: 'normal' | 'stream';
  private category: CategoryType;
  private isConnected: boolean = false;

  // 이벤트 핸들러들
  public onConnectionEstablished?: (data: WebSocketMessage) => void;
  public onUserMessage?: (data: WebSocketMessage) => void;
  public onTyping?: (data: WebSocketMessage) => void;
  public onAIResponse?: (data: WebSocketMessage) => void;
  public onStreamStart?: (data: WebSocketMessage) => void;
  public onStreamChunk?: (data: WebSocketMessage) => void;
  public onStreamComplete?: (data: WebSocketMessage) => void;
  public onHistoryCleared?: (data: WebSocketMessage) => void;
  public onChatHistory?: (data: WebSocketMessage) => void;
  public onError?: (data: WebSocketMessage | Error) => void;
  public onConnectionOpen?: (event: Event) => void;
  public onConnectionClose?: (event: CloseEvent) => void;

  constructor(
    category: CategoryType,
    sessionType: 'normal' | 'stream' = 'normal'
  ) {
    this.category = category;
    this.sessionType = sessionType;
  }

  async createSession(): Promise<WebSocketSession> {
    try {
      const response = await fetch('/chatbot/api/websocket/session/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': this.getCSRFToken(),
        },
        body: JSON.stringify({
          type: this.sessionType,
          category: this.category,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '세션 생성에 실패했습니다.');
      }

      this.sessionId = data.session_id;
      this.connectWebSocket(data.websocket_url);
      return data;
    } catch (error) {
      console.error('세션 생성 실패:', error);
      throw error;
    }
  }

  private connectWebSocket(url: string): void {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}${url}`;

    this.socket = new WebSocket(wsUrl);

    this.socket.onopen = (event) => {
      console.log('웹소켓 연결됨:', event);
      this.isConnected = true;
      this.onConnectionOpen?.(event);
    };

    this.socket.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        this.handleMessage(data);
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
        this.onError?.(new Error('메시지 파싱에 실패했습니다.'));
      }
    };

    this.socket.onclose = (event) => {
      console.log('웹소켓 연결 종료:', event);
      this.isConnected = false;
      this.onConnectionClose?.(event);

      // 카테고리 비허용으로 인한 연결 종료 처리
      if (event.code === 4001) {
        this.onError?.({
          type: 'error',
          error: '해당 카테고리에서는 웹소켓 챗봇을 사용할 수 없습니다. 영양, 행동, 심리, 교육 카테고리만 지원됩니다.',
        });
      }
    };

    this.socket.onerror = (error) => {
      console.error('웹소켓 오류:', error);
      this.onError?.(new Error('웹소켓 연결 오류가 발생했습니다.'));
    };
  }

  private handleMessage(data: WebSocketMessage): void {
    switch (data.type) {
      case 'connection_established':
        this.onConnectionEstablished?.(data);
        break;
      case 'user_message':
        this.onUserMessage?.(data);
        break;
      case 'typing':
        this.onTyping?.(data);
        break;
      case 'ai_response':
        this.onAIResponse?.(data);
        break;
      case 'stream_start':
        this.onStreamStart?.(data);
        break;
      case 'stream_chunk':
        this.onStreamChunk?.(data);
        break;
      case 'stream_complete':
        this.onStreamComplete?.(data);
        break;
      case 'history_cleared':
        this.onHistoryCleared?.(data);
        break;
      case 'chat_history':
        this.onChatHistory?.(data);
        break;
      case 'error':
        this.onError?.(data);
        break;
      default:
        console.warn('알 수 없는 메시지 타입:', data.type);
    }
  }

  sendMessage(message: string): void {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('웹소켓이 연결되지 않았습니다.');
    }

    this.socket.send(
      JSON.stringify({
        type: 'chat',
        message: message,
      })
    );
  }

  clearHistory(): void {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('웹소켓이 연결되지 않았습니다.');
    }

    this.socket.send(
      JSON.stringify({
        type: 'clear_history',
      })
    );
  }

  getHistory(): void {
    if (!this.isConnected || !this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error('웹소켓이 연결되지 않았습니다.');
    }

    this.socket.send(
      JSON.stringify({
        type: 'get_history',
      })
    );
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.sessionId = null;
  }

  getSessionId(): string | null {
    return this.sessionId;
  }

  getIsConnected(): boolean {
    return this.isConnected;
  }

  private getCSRFToken(): string {
    const name = 'csrftoken';
    const cookies = document.cookie.split(';');
    for (let cookie of cookies) {
      const [key, value] = cookie.trim().split('=');
      if (key === name) {
        return decodeURIComponent(value);
      }
    }
    return '';
  }
}

export { ChatbotWebSocket };
