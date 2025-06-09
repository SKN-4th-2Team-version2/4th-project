'use client';

import { useRef, useEffect } from 'react';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useWebSocketChat, type Message } from '@/hooks/useWebSocketChat';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Wifi, WifiOff, AlertCircle, Trash2, RefreshCw } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ExpertChatProps {
  category?: string;
  sessionType?: 'normal' | 'stream';
}

export function ExpertChat({ 
  category = 'behavior', 
  sessionType = 'normal' 
}: ExpertChatProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const {
    messages,
    isLoading,
    isConnected,
    sessionId,
    error,
    connectionStatus,
    sendMessage,
    clearHistory,
    disconnect,
  } = useWebSocketChat({
    category,
    sessionType
  });

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (!content.trim()) return;
    sendMessage(content);
  };

  const handleClearHistory = () => {
    if (window.confirm('대화 기록을 모두 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  const handleReconnect = () => {
    disconnect();
    // 페이지 새로고침으로 재연결
    window.location.reload();
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      nutrition: '영양',
      behavior: '행동',
      psychology: '심리',
      education: '교육',
    };
    return labels[cat] || '전문';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-500';
      case 'connecting':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  const getConnectionStatusIcon = () => {
    switch (connectionStatus) {
      case 'connected':
        return <Wifi className="h-4 w-4" />;
      case 'connecting':
        return <RefreshCw className="h-4 w-4 animate-spin" />;
      case 'error':
        return <WifiOff className="h-4 w-4" />;
      default:
        return <WifiOff className="h-4 w-4" />;
    }
  };

  return (
    <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>{getCategoryLabel(category)} 전문가 AI 상담</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>AI 기반</span>
            </Badge>
            <Badge 
              variant="outline" 
              className={`flex items-center gap-1 ${getConnectionStatusColor()}`}
            >
              {getConnectionStatusIcon()}
              <span className="text-xs">
                {connectionStatus === 'connected' && '연결됨'}
                {connectionStatus === 'connecting' && '연결 중'}
                {connectionStatus === 'error' && '오류'}
                {connectionStatus === 'disconnected' && '연결 끊김'}
              </span>
            </Badge>
          </div>
        </div>
        <CardDescription>
          {sessionType === 'stream' ? '실시간 스트리밍' : '일반'} 모드로 
          {getCategoryLabel(category)} 관련 질문에 전문적인 답변을 제공합니다. 
          의학적 진단이나 응급 상황은 전문의와 상담하세요.
        </CardDescription>
        
        {/* 세션 정보 및 컨트롤 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>세션: {sessionId ? sessionId.slice(0, 8) + '...' : '없음'}</span>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              disabled={!isConnected || messages.length === 0}
              className="h-6 px-2"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReconnect}
              disabled={connectionStatus === 'connecting'}
              className="h-6 px-2"
            >
              <RefreshCw className={`h-3 w-3 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* 오류 알림 */}
        {error && (
          <Alert variant="destructive" className="mt-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={{
                role: message.role,
                content: message.content,
                createdAt: message.createdAt,
                sources: message.sources,
                isTyping: message.isTyping,
              }} 
            />
          ))}
          
          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
              </div>
              <span>
                {sessionType === 'stream' ? '실시간으로 답변을 생성 중입니다...' : '전문가 AI가 답변을 작성 중입니다...'}
              </span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-0">
        <ChatInput 
          onSend={handleSendMessage} 
          isLoading={isLoading || !isConnected}
          disabled={!isConnected}
          placeholder={
            !isConnected 
              ? '연결을 기다리는 중...' 
              : `${getCategoryLabel(category)} 관련 질문을 입력하세요...`
          }
        />
      </CardFooter>
    </Card>
  );
}
