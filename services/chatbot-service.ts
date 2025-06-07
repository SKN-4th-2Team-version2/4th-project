import apiClient from './api-client';
import {
  ChatSession,
  ChatSessionDetail,
  ChatMessage,
  ChatStats,
  CreateSessionRequest,
  SendMessageRequest,
  ChatSessionsParams,
  CreateSessionResponse,
  ChatSessionsResponse,
  ChatSessionDetailResponse,
  SendMessageApiResponse,
  UpdateSessionResponse,
  ChatStatsResponse,
  WebSocketOptions,
  WebSocketClientMessage,
  WebSocketServerMessage,
  WebSocketConnectionStatus,
  ChatCategory,
  SessionStatus,
  CHAT_CATEGORY_LABELS,
  SESSION_STATUS_LABELS
} from '../types/chatbot';
import { MapaderApiResponse } from '../types/index';
import AuthService from './auth-service';

/**
 * AI 상담(ChatBot) 관련 API 서비스
 */
export class ChatBotService {
  private static readonly BASE_PATH = '/chatbot';
  private static readonly WS_BASE_PATH = '/ws/chat';

  // ========== REST API 메서드들 ==========

  /**
   * 채팅 세션 생성
   */
  static async createSession(sessionData: CreateSessionRequest): Promise<CreateSessionResponse> {
    return await apiClient.post<CreateSessionResponse>(
      `${this.BASE_PATH}/sessions`,
      sessionData
    );
  }

  /**
   * 채팅 세션 목록 조회
   */
  static async getSessions(params: ChatSessionsParams = {}): Promise<ChatSessionsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.category) queryParams.append('category', params.category);
    if (params.status) queryParams.append('status', params.status);

    const url = `${this.BASE_PATH}/sessions${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<ChatSessionsResponse>(url);
  }

  /**
   * 채팅 세션 상세 조회
   */
  static async getSession(sessionId: string): Promise<ChatSessionDetailResponse> {
    return await apiClient.get<ChatSessionDetailResponse>(
      `${this.BASE_PATH}/sessions/${sessionId}`
    );
  }

  /**
   * 메시지 전송 (REST API - 웹소켓이 안될 경우 대안)
   */
  static async sendMessage(
    sessionId: string,
    messageData: SendMessageRequest
  ): Promise<SendMessageApiResponse> {
    return await apiClient.post<SendMessageApiResponse>(
      `${this.BASE_PATH}/sessions/${sessionId}/messages`,
      messageData
    );
  }

  /**
   * 채팅 세션 완료
   */
  static async completeSession(sessionId: string): Promise<UpdateSessionResponse> {
    return await apiClient.put<UpdateSessionResponse>(
      `${this.BASE_PATH}/sessions/${sessionId}/complete`
    );
  }

  /**
   * 채팅 세션 삭제
   */
  static async deleteSession(sessionId: string): Promise<MapaderApiResponse<{ message: string }>> {
    return await apiClient.delete<MapaderApiResponse<{ message: string }>>(
      `${this.BASE_PATH}/sessions/${sessionId}`
    );
  }

  /**
   * 상담 통계 조회
   */
  static async getStats(): Promise<ChatStatsResponse> {
    return await apiClient.get<ChatStatsResponse>(
      `${this.BASE_PATH}/stats`
    );
  }

  // ========== 웹소켓 관련 메서드들 ==========

  /**
   * 웹소켓 연결 URL 생성
   */
  static getWebSocketUrl(sessionId: string): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    const wsUrl = baseUrl.replace('http://', 'ws://').replace('https://', 'wss://');
    const token = AuthService.getToken();
    
    return `${wsUrl}${this.WS_BASE_PATH}/${sessionId}?token=${token}`;
  }

  /**
   * 웹소켓 연결 생성 및 관리 클래스
   */
  static createWebSocketConnection(options: WebSocketOptions): ChatWebSocketManager {
    return new ChatWebSocketManager(options);
  }

  // ========== 헬퍼 함수들 ==========

  /**
   * 상담 카테고리 한글 라벨 가져오기
   */
  static getCategoryLabel(category: ChatCategory): string {
    return CHAT_CATEGORY_LABELS[category];
  }

  /**
   * 세션 상태 한글 라벨 가져오기
   */
  static getStatusLabel(status: SessionStatus): string {
    return SESSION_STATUS_LABELS[status];
  }

  /**
   * 세션 제목 유효성 검사
   */
  static validateSessionTitle(title: string): boolean {
    return title.trim().length >= 1 && title.trim().length <= 100;
  }

  /**
   * 메시지 내용 유효성 검사
   */
  static validateMessageContent(content: string): boolean {
    return content.trim().length >= 1 && content.trim().length <= 2000;
  }

  /**
   * 세션 시간 계산 (분 단위)
   */
  static calculateSessionDuration(startTime: string, endTime?: string): number {
    const start = new Date(startTime);
    const end = endTime ? new Date(endTime) : new Date();
    
    return Math.floor((end.getTime() - start.getTime()) / (1000 * 60));
  }

  /**
   * 토큰 사용량을 기준으로 비용 계산 (예시)
   */
  static calculateTokenCost(tokens: number, ratePerToken: number = 0.001): number {
    return tokens * ratePerToken;
  }

  /**
   * 메시지를 시간대별로 그룹화
   */
  static groupMessagesByTime(messages: ChatMessage[]): Record<string, ChatMessage[]> {
    const grouped: Record<string, ChatMessage[]> = {};

    messages.forEach(message => {
      const date = new Date(message.createdAt);
      const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD 형식

      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(message);
    });

    return grouped;
  }

  /**
   * 세션을 카테고리별로 그룹화
   */
  static groupSessionsByCategory(sessions: ChatSession[]): Record<ChatCategory, ChatSession[]> {
    const grouped = {} as Record<ChatCategory, ChatSession[]>;

    // 모든 카테고리 초기화
    Object.keys(CHAT_CATEGORY_LABELS).forEach(category => {
      grouped[category as ChatCategory] = [];
    });

    sessions.forEach(session => {
      if (grouped[session.category]) {
        grouped[session.category].push(session);
      }
    });

    return grouped;
  }
}

/**
 * 웹소켓 연결 관리 클래스
 */
export class ChatWebSocketManager {
  private ws: WebSocket | null = null;
  private options: WebSocketOptions;
  private reconnectAttempts = 0;
  private reconnectTimer: NodeJS.Timeout | null = null;
  private connectionStatus: WebSocketConnectionStatus = 'disconnected';
  
  // 이벤트 리스너들
  private onMessageCallbacks: ((message: ChatMessage) => void)[] = [];
  private onTypingCallbacks: ((isTyping: boolean) => void)[] = [];
  private onConnectionStatusCallbacks: ((status: WebSocketConnectionStatus) => void)[] = [];
  private onErrorCallbacks: ((error: string) => void)[] = [];

  constructor(options: WebSocketOptions) {
    this.options = {
      reconnect: true,
      reconnectInterval: 3000,
      maxReconnectAttempts: 5,
      ...options
    };
  }

  /**
   * 웹소켓 연결
   */
  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    this.setConnectionStatus('connecting');
    
    const wsUrl = ChatBotService.getWebSocketUrl(this.options.sessionId);
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = this.handleOpen.bind(this);
    this.ws.onmessage = this.handleMessage.bind(this);
    this.ws.onclose = this.handleClose.bind(this);
    this.ws.onerror = this.handleError.bind(this);
  }

  /**
   * 웹소켓 연결 해제
   */
  disconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setConnectionStatus('disconnected');
  }

  /**
   * 메시지 전송
   */
  sendMessage(content: string): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      throw new Error('웹소켓이 연결되지 않았습니다.');
    }

    const message: WebSocketClientMessage = {
      type: 'message',
      data: { content }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * 타이핑 상태 전송
   */
  sendTypingStatus(isTyping: boolean): void {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      return;
    }

    const message: WebSocketClientMessage = {
      type: 'typing',
      data: { isTyping }
    };

    this.ws.send(JSON.stringify(message));
  }

  /**
   * 연결 상태 확인
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  /**
   * 현재 연결 상태 반환
   */
  getConnectionStatus(): WebSocketConnectionStatus {
    return this.connectionStatus;
  }

  // ========== 이벤트 리스너 등록 메서드들 ==========

  onMessage(callback: (message: ChatMessage) => void): void {
    this.onMessageCallbacks.push(callback);
  }

  onTyping(callback: (isTyping: boolean) => void): void {
    this.onTypingCallbacks.push(callback);
  }

  onConnectionStatusChange(callback: (status: WebSocketConnectionStatus) => void): void {
    this.onConnectionStatusCallbacks.push(callback);
  }

  onError(callback: (error: string) => void): void {
    this.onErrorCallbacks.push(callback);
  }

  // ========== 내부 이벤트 핸들러들 ==========

  private handleOpen(): void {
    this.reconnectAttempts = 0;
    this.setConnectionStatus('connected');
  }

  private handleMessage(event: MessageEvent): void {
    try {
      const serverMessage: WebSocketServerMessage = JSON.parse(event.data);

      switch (serverMessage.type) {
        case 'message':
          if (serverMessage.data && 'content' in serverMessage.data) {
            this.onMessageCallbacks.forEach(callback => 
              callback(serverMessage.data as ChatMessage)
            );
          }
          break;

        case 'typing':
          if (serverMessage.data && 'isTyping' in serverMessage.data) {
            this.onTypingCallbacks.forEach(callback => 
              callback((serverMessage.data as { isTyping: boolean }).isTyping)
            );
          }
          break;

        case 'error':
          if (serverMessage.data && 'error' in serverMessage.data) {
            this.onErrorCallbacks.forEach(callback => 
              callback((serverMessage.data as { error: string }).error)
            );
          }
          break;
      }
    } catch (error) {
      console.error('웹소켓 메시지 파싱 오류:', error);
    }
  }

  private handleClose(): void {
    this.setConnectionStatus('disconnected');

    if (this.options.reconnect && 
        this.reconnectAttempts < (this.options.maxReconnectAttempts || 5)) {
      
      this.reconnectAttempts++;
      
      this.reconnectTimer = setTimeout(() => {
        this.connect();
      }, this.options.reconnectInterval || 3000);
    }
  }

  private handleError(): void {
    this.setConnectionStatus('error');
    this.onErrorCallbacks.forEach(callback => 
      callback('웹소켓 연결 오류가 발생했습니다.')
    );
  }

  private setConnectionStatus(status: WebSocketConnectionStatus): void {
    this.connectionStatus = status;
    this.onConnectionStatusCallbacks.forEach(callback => callback(status));
  }
}

export default ChatBotService;
