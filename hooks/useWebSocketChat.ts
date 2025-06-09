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
  // FastAPI 서버용 필드
  response?: string;
  category?: string;
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
    specialChatUrl = process.env.NEXT_PUBLIC_SPECIAL_CHAT_URL ||
      'http://127.0.0.1:8080',
  } = options;

  // 카테고리에 따른 엔드포인트 결정
  const isSpecialCategory = category === 'sleep' || category === 'development';
  const currentBackendUrl = isSpecialCategory ? specialChatUrl : backendUrl;

  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<
    'disconnected' | 'connecting' | 'connected' | 'error'
  >('disconnected');

  const websocketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const isInitializingRef = useRef(false);
  const connectionIdRef = useRef<string>('');

  // 연결 완전 정리 함수
  const cleanupConnection = useCallback(() => {
    console.log('웹소켓 연결 완전 정리 시작');

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (websocketRef.current) {
      const currentState = websocketRef.current.readyState;
      console.log('현재 웹소켓 상태:', currentState);

      if (
        currentState === WebSocket.OPEN ||
        currentState === WebSocket.CONNECTING
      ) {
        websocketRef.current.close(1000, 'Manual cleanup');
      }
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
      console.log(
        `세션 생성 중: category=${category}, sessionType=${sessionType}, endpoint=${currentBackendUrl}`,
      );

      // 특수 카테고리의 경우 다른 엔드포인트 사용
      if (isSpecialCategory) {
        // FastAPI 서버는 웹소켓에서 직접 세션 생성
        const sessionId = `special_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        return {
          success: true,
          session_id: sessionId,
          websocket_url: '/chatbot/api/session', // FastAPI 웹소켓 경로
          category: category,
        };
      }

      // 기본 카테고리의 경우 Django API 사용
      const response = await fetch(`${currentBackendUrl}/chatbot/api/websocket/session/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest', // CSRF 토큰 문제 해결
        },
        credentials: 'include', // 쿠키 포함
        body: JSON.stringify({
          type: sessionType,
          category: category,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('HTTP 오류:', response.status, errorText);
        throw new Error(`서버 오류: ${response.status} - Django 서버가 실행 중인지 확인해 주세요.`);
      }

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
  const handleWebSocketMessage = useCallback(
    (data: WebSocketMessage) => {
      console.log('메시지 수신:', data);

      switch (data.type) {
        case 'connection_established':
          console.log('연결 확립됨:', data.message);
          if (data.message) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: data.message!,
                createdAt: new Date(),
              },
            ]);
          } else if (isSpecialCategory) {
            // 특수 카테고리의 경우 기본 메시지
            const categoryNames = {
              sleep: '수면',
              development: '발달',
            };
            const categoryName =
              categoryNames[category as 'sleep' | 'development'] || category;
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: `안녕하세요! ${categoryName} 전문 AI 상담사입니다. 무엇을 도와드릴까요? ✨`,
                createdAt: new Date(),
              },
            ]);
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
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: data.message!,
                createdAt: new Date(),
                sources: data.sources || [],
              },
            ]);
          }
          setIsLoading(false);
          break;

        // FastAPI 서버 응답 처리
        case 'fastapi_response':
        default:
          // FastAPI 서버에서 온 응답 처리
          if (data.response) {
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: data.response!,
                createdAt: new Date(),
              },
            ]);
            setIsLoading(false);
          } else if (data.session_id && data.response) {
            // FastAPI 서버의 표준 응답
            setMessages((prev) => [
              ...prev,
              {
                role: 'assistant',
                content: data.response!,
                createdAt: new Date(),
              },
            ]);
            setIsLoading(false);
          }
          break;

        case 'stream_start':
          setIsLoading(true);
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: '',
              createdAt: new Date(),
              isTyping: true,
            },
          ]);
          break;

        case 'stream_chunk':
          setMessages((prev) => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.role === 'assistant') {
              lastMessage.content += data.chunk || '';
            }
            return newMessages;
          });
          break;

        case 'stream_complete':
          setMessages((prev) => {
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
            setMessages([
              {
                role: 'assistant',
                content: data.message,
                createdAt: new Date(),
              },
            ]);
          }
          break;

        case 'chat_history':
          if (data.history) {
            const historyMessages: Message[] = data.history.map((msg) => ({
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
      }
    },
    [isSpecialCategory, category],
  );

  // 웹소켓 연결
  const connectWebSocket = useCallback(
    (websocketUrl: string, newSessionId: string) => {
      // 현재 연결의 고유 ID 생성
      const connectionId = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      connectionIdRef.current = connectionId;

      if (isInitializingRef.current) {
        console.log('이미 초기화 중입니다. 중복 연결 시도를 무시합니다.');
        return;
      }

      isInitializingRef.current = true;

      // 기존 연결 강제 정리
      if (websocketRef.current) {
        console.log('기존 웹소켓 연결을 강제로 정리합니다.');
        const oldSocket = websocketRef.current;
        websocketRef.current = null;

        if (
          oldSocket.readyState === WebSocket.OPEN ||
          oldSocket.readyState === WebSocket.CONNECTING
        ) {
          oldSocket.close(1000, 'Category changed');
        }
      }

      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
        reconnectTimeoutRef.current = null;
      }

      setConnectionStatus('connecting');
      setError(null);

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsHost = currentBackendUrl
        .replace('http://', '')
        .replace('https://', '');
      const wsUrl = `${protocol}//${wsHost}${websocketUrl}`;

      console.log(
        `웹소켓 연결 시도: ${wsUrl} (category: ${category}, connectionId: ${connectionId})`,
      );

      const newSocket = new WebSocket(wsUrl);
      websocketRef.current = newSocket;

      newSocket.onopen = () => {
        // 연결 ID가 변경되었으면 이 연결은 무시
        if (connectionIdRef.current !== connectionId) {
          console.log('연결 ID가 변경되어 이전 연결을 무시합니다.');
          newSocket.close();
          return;
        }

        console.log('웹소켓 연결됨');
        setIsConnected(true);
        setConnectionStatus('connected');
        setError(null);
        reconnectAttempts.current = 0;
        isInitializingRef.current = false;

        // 특수 카테고리의 경우 환영 메시지 자동 추가
        if (isSpecialCategory) {
          const categoryNames = {
            sleep: '수면',
            development: '발달',
          };
          const categoryName =
            categoryNames[category as 'sleep' | 'development'] || category;
          setMessages((prev) => [
            ...prev,
            {
              role: 'assistant',
              content: `안녕하세요! ${categoryName} 전문 AI 상담사입니다. 무엇을 도와드릴까요? ✨`,
              createdAt: new Date(),
            },
          ]);
        }
      };

      newSocket.onmessage = (event) => {
        // 연결 ID가 변경되었으면 이 메시지는 무시
        if (connectionIdRef.current !== connectionId) {
          console.log('연결 ID가 변경되어 메시지를 무시합니다.');
          return;
        }

        try {
          // 특수 카테고리의 경우 FastAPI 서버 응답 처리
          if (isSpecialCategory) {
            try {
              // JSON 파싱 시도
              const data: WebSocketMessage = JSON.parse(event.data);
              console.log('FastAPI JSON 응답:', data);

              // FastAPI 서버 응답 형태에 맞게 처리
              if (data.session_id && data.response) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: data.response!,
                    createdAt: new Date(),
                  },
                ]);
                setIsLoading(false);
              } else {
                handleWebSocketMessage(data);
              }
            } catch (jsonError) {
              // JSON이 아니면 일반 텍스트로 처리
              const textMessage = event.data;
              console.log('FastAPI 텍스트 응답:', textMessage);
              if (textMessage && textMessage.trim()) {
                setMessages((prev) => [
                  ...prev,
                  {
                    role: 'assistant',
                    content: textMessage,
                    createdAt: new Date(),
                  },
                ]);
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
          setIsLoading(false);
        }
      };

      newSocket.onclose = (event) => {
        // 연결 ID가 변경되었으면 이 이벤트는 무시
        if (connectionIdRef.current !== connectionId) {
          console.log('연결 ID가 변경되어 close 이벤트를 무시합니다.');
          return;
        }

        console.log('웹소켓 연결 종료:', event.code, event.reason);
        setIsConnected(false);
        setConnectionStatus('disconnected');
        websocketRef.current = null;
        isInitializingRef.current = false;

        // 사용자가 의도적으로 종료한 경우는 재연결 시도하지 않음
        if (
          event.code === 1000 &&
          (event.reason === 'Category changed' ||
            event.reason === 'Manual cleanup')
        ) {
          console.log('의도적 연결 종료:', event.reason);
          return;
        }

        // 카테고리 비허용으로 인한 연결 종료 처리 (기본 카테고리만)
        if (event.code === 4001 && !isSpecialCategory) {
          setError(
            '해당 카테고리에서는 웹소켓 챗봇을 사용할 수 없습니다. 영양, 행동, 심리, 교육 카테고리만 지원됩니다.',
          );
          return;
        }

        // 특수 카테고리의 연결 오류 처리
        if (
          isSpecialCategory &&
          (event.code === 1006 || event.code === 1011 || event.code === 1002)
        ) {
          setError(
            '전문 AI 서버에 연결할 수 없습니다. 서버가 127.0.0.1:8080에서 실행 중인지 확인해 주세요.',
          );
          setConnectionStatus('error');
          return;
        }

        // 자동 재연결 시도
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current++;
          console.log(
            `재연결 시도 ${reconnectAttempts.current}/${maxReconnectAttempts}`,
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            if (connectionIdRef.current === connectionId) {
              connectWebSocket(websocketUrl, newSessionId);
            }
          }, 3000);
        } else {
          setError('웹소켓 연결에 실패했습니다. 페이지를 새로고침해 주세요.');
          setConnectionStatus('error');
        }
      };

      newSocket.onerror = (error) => {
        // 연결 ID가 변경되었으면 이 이벤트는 무시
        if (connectionIdRef.current !== connectionId) {
          console.log('연결 ID가 변경되어 error 이벤트를 무시합니다.');
          return;
        }

        console.error('웹소켓 오류:', error);
        setError(
          `웹소켓 연결 오류가 발생했습니다. ${isSpecialCategory ? '(특수 카테고리 서버 확인 필요)' : ''}`,
        );
        setConnectionStatus('error');
        isInitializingRef.current = false;
      };

      setSessionId(newSessionId);
    },
    [currentBackendUrl, category, handleWebSocketMessage, isSpecialCategory],
  );

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

        console.log(
          `새로운 웹소켓 세션 생성: category=${category}, sessionType=${sessionType}`,
        );

        // 약간의 지연으로 정리 완료 대기
        await new Promise((resolve) => setTimeout(resolve, 100));

        const sessionData = await createSession();

        if (!mounted) {
          console.log('컴포넌트가 언마운트되어 연결을 중단합니다.');
          return;
        }

        connectWebSocket(sessionData.websocket_url, sessionData.session_id);
      } catch (error) {
        if (!mounted) return;

        console.error('초기 연결 실패:', error);
        setError(
          error instanceof Error ? error.message : '연결에 실패했습니다.',
        );
        setConnectionStatus('error');
        isInitializingRef.current = false;
      }
    };

    initializeConnection();

    return () => {
      mounted = false;
      cleanupConnection();
    };
  }, [
    category,
    sessionType,
    createSession,
    connectWebSocket,
    cleanupConnection,
  ]);

  // 메시지 전송
  const sendMessage = useCallback(
    (content: string) => {
      if (
        !isConnected ||
        !websocketRef.current ||
        websocketRef.current.readyState !== WebSocket.OPEN
      ) {
        setError('웹소켓이 연결되지 않았습니다.');
        return;
      }

      // 사용자 메시지를 UI에 즉시 추가
      const userMessage: Message = {
        role: 'user',
        content,
        createdAt: new Date(),
      };
      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      // 웹소켓으로 메시지 전송
      if (isSpecialCategory) {
        // 특수 카테고리의 경우 FastAPI 서버 형태로 전송
        websocketRef.current.send(
          JSON.stringify({
            message: content,
          }),
        );
      } else {
        // 기본 카테고리의 경우 Django 서버 형태로 전송
        websocketRef.current.send(
          JSON.stringify({
            type: 'chat',
            message: content,
          }),
        );
      }
    },
    [isConnected, isSpecialCategory],
  );

  // 히스토리 초기화
  const clearHistory = useCallback(() => {
    if (isSpecialCategory) {
      // 특수 카테고리의 경우 로컬에서만 초기화
      setMessages([]);
      // 환영 메시지 다시 추가
      const categoryNames = {
        sleep: '수면',
        development: '발달',
      };
      const categoryName =
        categoryNames[category as 'sleep' | 'development'] || category;
      setTimeout(() => {
        setMessages([
          {
            role: 'assistant',
            content: `안녕하세요! ${categoryName} 전문 AI 상담사입니다. 무엇을 도와드릴까요? ✨`,
            createdAt: new Date(),
          },
        ]);
      }, 100);
      return;
    }

    if (
      !isConnected ||
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    websocketRef.current.send(
      JSON.stringify({
        type: 'clear_history',
      }),
    );
  }, [isConnected, isSpecialCategory, category]);

  // 히스토리 조회
  const getHistory = useCallback(() => {
    if (isSpecialCategory) {
      // 특수 카테고리에서는 히스토리 조회 지원하지 않음
      return;
    }

    if (
      !isConnected ||
      !websocketRef.current ||
      websocketRef.current.readyState !== WebSocket.OPEN
    ) {
      setError('웹소켓이 연결되지 않았습니다.');
      return;
    }

    websocketRef.current.send(
      JSON.stringify({
        type: 'get_history',
      }),
    );
  }, [isConnected, isSpecialCategory]);

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
