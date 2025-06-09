import { useEffect, useRef, useState, useCallback } from 'react';

interface WebSocketHook {
  isConnected: boolean;
  sendMessage: (message: string) => void;
  lastMessage: string | null;
  reconnect: () => void;
}

// 전역 WebSocket 인스턴스
let globalWebSocket: WebSocket | null = null;
let globalMessageHandlers: Set<(message: string) => void> = new Set();

export function useWebSocket(url: string): WebSocketHook {
  const [isConnected, setIsConnected] = useState(false);
  const [lastMessage, setLastMessage] = useState<string | null>(null);
  const messageHandlerRef = useRef<(message: string) => void>();

  // 메시지 핸들러 설정
  useEffect(() => {
    messageHandlerRef.current = (message: string) => {
      setLastMessage(message);
    };
    globalMessageHandlers.add(messageHandlerRef.current);

    return () => {
      if (messageHandlerRef.current) {
        globalMessageHandlers.delete(messageHandlerRef.current);
      }
    };
  }, []);

  // WebSocket 연결 관리
  useEffect(() => {
    if (!globalWebSocket) {
      globalWebSocket = new WebSocket(url);

      globalWebSocket.onopen = () => {
        setIsConnected(true);
      };

      globalWebSocket.onclose = () => {
        setIsConnected(false);
        globalWebSocket = null;
      };

      globalWebSocket.onmessage = (event) => {
        globalMessageHandlers.forEach((handler) => handler(event.data));
      };

      globalWebSocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        setIsConnected(false);
      };
    } else {
      setIsConnected(globalWebSocket.readyState === WebSocket.OPEN);
    }

    return () => {
      // 컴포넌트가 언마운트될 때 WebSocket을 닫지 않음
      // 대신 메시지 핸들러만 제거
    };
  }, [url]);

  const sendMessage = useCallback((message: string) => {
    if (globalWebSocket && globalWebSocket.readyState === WebSocket.OPEN) {
      globalWebSocket.send(message);
    }
  }, []);

  const reconnect = useCallback(() => {
    if (globalWebSocket) {
      globalWebSocket.close();
      globalWebSocket = null;
    }
    globalWebSocket = new WebSocket(url);
  }, [url]);

  return {
    isConnected,
    sendMessage,
    lastMessage,
    reconnect,
  };
}
