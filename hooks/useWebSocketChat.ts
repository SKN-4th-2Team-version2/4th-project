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
}

export function useWebSocketChat(options: UseWebSocketChatOptions = {}) {
  const {
    category = 'behavior',
    sessionType = 'normal',
    backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000'
  } = options;

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

  // 웹소켓 세션 생성
  const createSession = useCallback(async () => {
    try {
      const response = await fetch(`${backendUrl}/chatbot/api/websocket/session/`, {
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

      return data;
    } catch (error) {
      console.error('세션 생성 실패:', error);
      throw error;
    }
  }, [backendUrl, sessionType, category]);

  // 웹소켓 연결
  const connectWebSocket = useCallback((websocketUrl: string, newSessionId: string) => {
    if (websocketRef.current) {
      websocketRef.current.close();
    }

    setConnectionStatus('connecting');
    
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = backendUrl.replace('http://', '').replace('https://', '');
    const wsUrl = `${protocol}//${wsHost}${websocketUrl}`;

    console.log('웹소켓 연결 시도:', wsUrl);

    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log('웹소켓 연결됨');
      setIsConnected(true);
      setConnectionStatus('connected');
      setError(null);
      reconnectAttempts.current = 0;
    };

    websocketRef.current.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        handleWebSocketMessage(data);
      } catch (error) {
        console.error('메시지 파싱 오류:', error);
        setError('메시지 파싱에 실패했습니다.');
      }
    };

    websocketRef.current.onclose = (event) => {
      console.log('웹소켓 연결 종료:', event);
      setIsConnected(false);
      setConnectionStatus('disconnected');

      // 카테고리 비허용으로 인한 연결 종료 처리
      if (event.code === 4001) {
        setError('해당 카테고리에서는 웹소켓 챗봇을 사용할 수 없습니다. 영양, 행동, 심리, 교육 카테고리만 지원됩니다.');
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
    };

    setSessionId(newSessionId);
  }, [backendUrl]);

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

      case 'stream_start':
        setIsLoading(true);
        // 스트리밍 시작 시 빈 메시지 추가
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: '',
          createdAt: new Date(),
          isTyping: true,
        }]);
        break;

      case 'stream_chunk':
        // 스트리밍 청크 추가
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
        // 스트리밍 완료
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

  // 초기 연결
  useEffect(() => {
    const initializeConnection = async () => {
      try {
        const sessionData = await createSession();
        connectWebSocket(sessionData.websocket_url, sessionData.session_id);
      } catch (error) {
        console.error('초기 연결 실패:', error);
        setError(error instanceof Error ? error.message : '연결에 실패했습니다.');
        setConnectionStatus('error');
      }
    };

    initializeConnection();

    return () => {
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, [createSession, connectWebSocket]);

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
    websocketRef.current.send(JSON.stringify({
      type: 'chat',
      message: content,
    }));
  }, [isConnected]);

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    if (!isConnected || !websocketRef.current || websocketRef.current.readyState !== WebSocket.OPEN) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    websocketRef.current.send(JSON.stringify({
      type: 'clear_history',
    }));
  }, [isConnected]);

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
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
    }
    if (websocketRef.current) {
      websocketRef.current.close();
    }
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setSessionId(null);
  }, []);

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
  };
}
