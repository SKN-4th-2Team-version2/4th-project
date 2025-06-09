'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
  sources?: Array<{
    category: string;
    section: string;
    content_preview: string;
  }>;
  isTyping?: boolean;
}

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

interface UseWebSocketChatOptions {
  category?: string;
  sessionType?: 'normal' | 'stream';
  backendUrl?: string;
  specialChatUrl?: string;
}

export function useWebSocketChat(options: UseWebSocketChatOptions = {}) {
  const {
    category = 'behavior',
    sessionType = 'normal',
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000',
    specialChatUrl = process.env.NEXT_PUBLIC_SPECIAL_CHAT_URL || 'http://127.0.0.1:8080'
  } = options;

  // 카테고리에 따른 엔드포인트 결정
  const isSpecialCategory = category === 'sleep' || category === 'development';
  const currentBackendUrl = isSpecialCategory ? specialChatUrl : backendUrl;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'disconnected' | 'connecting' | 'connected' | 'error'>('disconnected');

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isInitializingRef = useRef(false);

  // 연결 완전 정리 함수
  const cleanupConnection = useCallback(() => {
    console.log('웹소켓 연결 완전 정리 시작');
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (websocketRef.current && websocketRef.current.readyState !== WebSocket.CLOSED) {
      websocketRef.current.close(1000, 'Manual cleanup');
      websocketRef.current = null;
    }
    
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setError(null);
    setIsLoading(false);
    reconnectAttempts.current = 0;
    isInitializingRef.current = false;
    
    console.log('웹소켓 연결 완전 정리 완료');
  }, []);

  // 웹소켓 세션 생성
  const createSession = useCallback(async () => {
    try {
      console.log(`세션 생성 중: category=${category}, sessionType=${sessionType}, endpoint=${currentBackendUrl}`);
      
      // 특수 카테고리의 경우 다른 엔드포인트 사용
      if (isSpecialCategory) {
        // 127.0.0.1:8080/chat 엔드포인트로 직접 웹소켓 연결
        const sessionId = `special_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          session_id: sessionId,
          websocket_url: '/chat', // 웹소켓 경로
          category: category
        };
      }
      
      // 기본 카테고리의 경우 기존 API 사용
      const response = await fetch(`${currentBackendUrl}/chatbot/api/websocket/session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: sessionType,
          category: category,
        }),
      });

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || '세션 생성에 실패했습니다.');
      }

      console.log('세션 생성 성공:', data.session_id);
      return data;
    } catch (error) {
      console.error('세션 생성 실패:', error);
      throw error;
    }
  }, [currentBackendUrl, sessionType, category, isSpecialCategory]);

  // 웹소켓 메시지 처리
  const handleWebSocketMessage = useCallback((data: WebSocketMessage) => {
    switch (data.type) {
      case 'connection_established':
        console.log('연결 확립됨:', data.message);
        if (data.message) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message!,
            createdAt: new Date(),
          }]);
        } else if (isSpecialCategory) {
          // 특수 카테고리의 경우 기본 메시지
          const categoryNames = {
            sleep: '수면',
            development: '발달'
          };
          const categoryName = categoryNames[category as 'sleep' | 'development'] || category;
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `안녕하세요! ${categoryName} 전문 AI 상담사입니다. 무엇을 도와드릴까요? ✨`,
            createdAt: new Date(),
          }]);
        }
        break;

      case 'user_message':
        // 사용자 메시지는 이미 UI에서 처리됨
        break;

      case 'typing':
        setIsLoading(data.is_typing || false);
        break;

      case 'ai_response':
        if (data.message) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message!,
            createdAt: new Date(),
            sources: data.sources || [],
          }]);
        }
        setIsLoading(false);
        break;

      // 특수 카테고리를 위한 일반 메시지 처리
      case 'message':
        if (data.message) {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.message!,
            createdAt: new Date(),
          }]);
        }
        setIsLoading(false);
        break;

      case 'stream_start':
        setIsLoading(true);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          isTyping: true,
        }]);
        break;

      case 'stream_chunk':
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.content += data.chunk || '';
          }
          return newMessages;
        });
        break;

      case 'stream_complete':
        setMessages(prev => {
          const newMessages = [...prev];
          const lastMessage = newMessages[newMessages.length - 1];
          if (lastMessage && lastMessage.role === 'assistant') {
            lastMessage.isTyping = false;
            lastMessage.sources = data.sources || [];
          }
          return newMessages;
        });
        setIsLoading(false);
        break;

      case 'history_cleared':
        setMessages([]);
        if (data.message) {
          setMessages([{
            role: 'assistant',
            content: data.message,
            createdAt: new Date(),
          }]);
        }
        break;

      case 'chat_history':
        if (data.history) {
          const historyMessages: Message[] = data.history.map(msg => ({
            role: msg.role,
            content: msg.content,
            createdAt: new Date(),
          }));
          setMessages(historyMessages);
        }
        break;

      case 'error':
        console.error('서버 오류:', data.error);
        setError(data.error || '서버에서 오류가 발생했습니다.');
        setIsLoading(false);
        break;

      default:
        console.warn('알 수 없는 메시지 타입:', data.type);
    }
  }, []);

  // 웹소켓 연결
  const connectWebSocket = useCallback((websocketUrl: string, newSessionId: string) => {
    if (isInitializingRef.current) {
      console.log('이미 초기화 중입니다. 중복 연결 시도를 무시합니다.');
      return;
    }

    isInitializingRef.current = true;

    // 기존 연결 정리
    if (websocketRef.current) {
      console.log('기존 웹소켓 연결을 정리합니다.');
      websocketRef.current.close(1000, 'Category changed');
      websocketRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    let wsUrl;
    
    if (isSpecialCategory) {
      // 특수 카테고리의 경우 127.0.0.1:8080/chat로 직접 연결
      const wsHost = currentBackendUrl.replace('http://', '').replace('https://', '');
      wsUrl = `${protocol}//${wsHost}${websocketUrl}`;
    } else {
      // 기본 카테고리의 경우 기존 방식
      const wsHost = currentBackendUrl.replace('http://', '').replace('https://', '');
      wsUrl = `${protocol}//${wsHost}${websocketUrl}`;
    }

    console.log(`웹소켓 연결 시도: ${wsUrl} (category: ${category})`);

    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log('웹소켓 연결됨');
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      reconnectAttempts.current = 0;
      isInitializingRef.current = false;
    };

    websocketRef.current.onmessage = (event) => {
      try {
        // 특수 카테고리의 경우 일반 텍스트도 처리
        if (isSpecialCategory) {
          try {
            // JSON 파싱 시도
            const data: WebSocketMessage = JSON.parse(event.data);
            handleWebSocketMessage(data);
          } catch (jsonError) {
            // JSON이 아니면 일반 텍스트로 처리
            const textMessage = event.data;
            if (textMessage && textMessage.trim()) {
              setMessages(prev => [...prev, {
                role: 'assistant',
                content: textMessage,
                createdAt: new Date(),
              }]);
              setIsLoading(false);
            }
          }
        } else {
          // 기본 카테고리의 경우 JSON만 처리
          const data: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(data);
        }
      } catch (error) {
        console.error('메시지 처리 오류:', error);
        setError('메시지 처리에 실패했습니다.');
      }
    };

    websocketRef.current.onclose = (event) => {
      console.log('웹소켓 연결 종료:', event.code, event.reason);
      setIsConnected(false);
      setConnectionStatus('disconnected');
      websocketRef.current = null;
      isInitializingRef.current = false;

      // 사용자가 의도적으로 종료한 경우는 재연결 시도하지 않음
      if (event.code === 1000 && (event.reason === 'Category changed' || event.reason === 'Manual cleanup')) {
        console.log('의도적 연결 종료:', event.reason);
        return;
      }

      // 카테고리 비허용으로 인한 연결 종료 처리 (기본 카테고리만)
      if (event.code === 4001 && !isSpecialCategory) {
        setError('해당 카테고리에서는 웹소켓 챗봇을 사용할 수 없습니다. 영양, 행동, 심리, 교육 카테고리만 지원됩니다.');
        return;
      }

      // 특수 카테고리의 연결 오류 처리
      if (isSpecialCategory && (event.code === 1006 || event.code === 1011)) {
        setError('전문 AI 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해 주세요.');
        return;
      }

      // 자동 재연결 시도
      if (reconnectAttempts.current < maxReconnectAttempts) {
        reconnectAttempts.current++;
        console.log(`재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`);
        
        reconnectTimeoutRef.current = setTimeout(() => {
          connectWebSocket(websocketUrl, newSessionId);
        }, 3000);
      } else {
        setError('웹소켓 연결에 실패했습니다. 페이지를 새로고침해 주세요.');
        setConnectionStatus('error');
      }
    };

    websocketRef.current.onerror = (error) => {
      console.error('웹소켓 오류:', error);
      setError('웹소켓 연결 오류가 발생했습니다.');
      setConnectionStatus('error');
      isInitializingRef.current = false;
    };

    setSessionId(newSessionId);
  }, [currentBackendUrl, category, handleWebSocketMessage, isSpecialCategory]);

  // 카테고리/세션 타입 변경 시 연결 관리
  useEffect(() => {
    let mounted = true;

    const initializeConnection = async () => {
      if (isInitializingRef.current) {
        console.log('이미 초기화 중입니다.');
        return;
      }

      try {
        // 기존 연결 정리
        cleanupConnection();
        
        // 메시지 초기화
        setMessages([]);
        
        console.log(`새로운 웹소켓 세션 생성: category=${category}, sessionType=${sessionType}`);
        
        const sessionData = await createSession();
        
        if (!mounted) {
          console.log('컴포넌트가 언마운트되어 연결을 중단합니다.');
          return;
        }
        
        connectWebSocket(sessionData.websocket_url, sessionData.session_id);
      } catch (error) {
        if (!mounted) return;
        
        console.error('초기 연결 실패:', error);
        setError(error instanceof Error ? error.message : '연결에 실패했습니다.');
        setConnectionStatus('error');
        isInitializingRef.current = false;
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      cleanupConnection();
    };
  }, [category, sessionType, createSession, connectWebSocket, cleanupConnection]);

  // 메시지 전송
  const sendMessage = useCallback((content: string) => {
    if (!isConnected || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    // 사용자 메시지를 UI에 즉시 추가
    const userMessage: Message = {
      role: 'user',
      content,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // 웹소켓으로 메시지 전송
    if (isSpecialCategory) {
      // 특수 카테고리의 경우 직접 메시지 전송
      websocketRef.current.send(content);
    } else {
      // 기본 카테고리의 경우 JSON 형태로 전송
      websocketRef.current.send(JSON.stringify({
        type: 'chat',
        message: content,
      }));
    }
  }, [isConnected, isSpecialCategory]);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    if (isSpecialCategory) {
      // 특수 카테고리의 경우 로컬에서만 초기화
      setMessages([]);
      return;
    }
    
    if (!isConnected || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    websocketRef.current.send(JSON.stringify({
      type: 'clear_history',
    }));
  }, [isConnected, isSpecialCategory]);

  // 히스토리 조회
  const getHistory = useCallback(() => {
    if (!isConnected || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    websocketRef.current.send(JSON.stringify({
      type: 'get_history',
    }));
  }, [isConnected]);

  // 연결 해제
  const disconnect = useCallback(() => {
    cleanupConnection();
    setSessionId(null);
    setMessages([]);
  }, [cleanupConnection]);

  // 강제 연결 해제 (카테고리 변경용)
  const forceDisconnect = useCallback(() => {
    console.log('강제 연결 해제 시작');
    cleanupConnection();
  }, [cleanupConnection]);

  return {
    messages,
    isLoading,
    isConnected,
    sessionId,
    error,
    connectionStatus,
    sendMessage,
    clearHistory,
    getHistory,
    disconnect,
    forceDisconnect,
  };
}
