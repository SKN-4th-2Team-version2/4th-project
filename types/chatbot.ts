// AI 상담(ChatBot) 관련 타입 정의

import { MapaderApiResponse, PaginatedResponse } from './index';

// 메시지 역할
export type MessageRole = 'user' | 'assistant';

// 채팅 세션 상태
export type SessionStatus = 'active' | 'completed' | 'expired';

// 상담 카테고리
export type ChatCategory = 'general' | 'development' | 'health' | 'behavior' | 'sleep' | 'feeding';

// 웹소켓 이벤트 타입
export type WebSocketEventType = 'connection' | 'message' | 'typing' | 'error' | 'disconnect';

// 채팅 메시지
export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  tokens: number;
  createdAt: string;
}

// 채팅 세션
export interface ChatSession {
  id: string;
  title: string;
  category: ChatCategory;
  status: SessionStatus;
  totalTokens: number;
  messageCount?: number;
  durationMinutes?: number;
  lastMessageAt?: string;
  createdAt: string;
}

// 채팅 세션 상세 (메시지 포함)
export interface ChatSessionDetail extends ChatSession {
  messages: ChatMessage[];
}

// 채팅 세션 생성 요청
export interface CreateSessionRequest {
  title: string;
  category: ChatCategory;
}

// 메시지 전송 요청 (REST API용)
export interface SendMessageRequest {
  content: string;
}

// 메시지 전송 응답
export interface SendMessageResponse {
  userMessage: ChatMessage;
  assistantMessage: ChatMessage;
}

// 상담 통계
export interface ChatStats {
  totalSessions: number;
  totalTokensUsed: number;
  byCategory: Record<ChatCategory, number>;
  byStatus: Record<SessionStatus, number>;
  averageSessionDuration: number;
  recentActivity: {
    lastSessionDate: string;
    sessionsThisMonth: number;
  };
}

// 웹소켓 메시지 (클라이언트 → 서버)
export interface WebSocketClientMessage {
  type: 'message' | 'typing';
  data: {
    content?: string;
    isTyping?: boolean;
  };
}

// 웹소켓 메시지 (서버 → 클라이언트)
export interface WebSocketServerMessage {
  type: WebSocketEventType;
  data: ChatMessage | { isTyping: boolean } | { error: string } | null;
}

// 타이핑 상태
export interface TypingStatus {
  isTyping: boolean;
}

// 채팅 세션 목록 조회 파라미터
export interface ChatSessionsParams {
  page?: number;
  limit?: number;
  category?: ChatCategory;
  status?: SessionStatus;
}

// API 응답 타입들
export type CreateSessionResponse = MapaderApiResponse<ChatSession>;
export type ChatSessionsResponse = PaginatedResponse<ChatSession>;
export type ChatSessionDetailResponse = MapaderApiResponse<ChatSessionDetail>;
export type SendMessageApiResponse = MapaderApiResponse<SendMessageResponse>;
export type UpdateSessionResponse = MapaderApiResponse<ChatSession>;
export type ChatStatsResponse = MapaderApiResponse<ChatStats>;

// 상담 카테고리 한글 매핑
export const CHAT_CATEGORY_LABELS: Record<ChatCategory, string> = {
  general: '일반 상담',
  development: '발달 상담',
  health: '건강 상담',
  behavior: '행동 상담',
  sleep: '수면 상담',
  feeding: '수유/이유식'
};

// 세션 상태 한글 매핑
export const SESSION_STATUS_LABELS: Record<SessionStatus, string> = {
  active: '진행중',
  completed: '완료',
  expired: '만료'
};

// 웹소켓 연결 옵션
export interface WebSocketOptions {
  sessionId: string;
  token: string;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

// 웹소켓 연결 상태
export type WebSocketConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';
