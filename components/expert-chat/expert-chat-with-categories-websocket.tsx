'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { ChatMessage, type Message } from './chat-message';
import { ChatInput } from './chat-input';
import { useWebSocketChat } from '@/hooks/useWebSocketChat';
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
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Bot,
  Sparkles,
  Wifi,
  WifiOff,
  Trash2,
  RefreshCw,
  Clock,
  ChevronDown,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { chatHistoryApi } from '@/services/chat-history-api';
import { ServerDiagnostic } from '@/components/server-diagnostic';
import { useAutoSaveHistory } from '@/hooks/useAutoSaveHistory';

export type CategoryType = 'general' | 'specialized';

interface ExpertChatWithCategoriesProps {
  initialCategory?: CategoryType;
  sessionType?: 'normal' | 'stream';
  continueFromId?: string;
  initialSessionId?: string;
}

export function ExpertChatWithCategories({
  initialCategory = 'general',
  sessionType = 'normal',
  continueFromId,
  initialSessionId,
}: ExpertChatWithCategoriesProps) {
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!continueFromId);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // 자동 히스토리 저장 훅
  const { saveHistory } = useAutoSaveHistory();

  const {
    messages,
    isLoading,
    isConnected,
    wsSessionId,
    error,
    connectionStatus,
    sendMessage,
    clearHistory,
    disconnect,
    forceDisconnect,
  } = useWebSocketChat({
    category,
    sessionType,
    specialChatUrl: process.env.NEXT_PUBLIC_SPECIAL_CHAT_URL,
    continueFromId,
    initialSessionId,
  });

  // 이전 상담 내용 불러오기 (세션 복원)
  useEffect(() => {
    if (continueFromId) {
      const loadHistory = async () => {
        try {
          setIsLoadingHistory(true);

          toast({
            title: '상담 내용 복원 중...',
            description: '이전 상담 내용을 불러오고 있습니다.',
          });

          const response = await chatHistoryApi.getChatHistory(continueFromId);

          if (response.success && response.data) {
            const history = response.data;
            setCategory(history.category);

            toast({
              title: '상담 내용 복원 완료',
              description: '이전 상담을 이어서 진행할 수 있습니다.',
            });
          } else {
            throw new Error(
              response.error || '상담 내용을 불러올 수 없습니다.',
            );
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
          toast({
            title: '상담 내용 복원 실패',
            description:
              error instanceof Error
                ? error.message
                : '이전 상담 내용을 불러오는 중 오류가 발생했습니다.',
            variant: 'destructive',
          });
        } finally {
          setIsLoadingHistory(false);
        }
      };
      loadHistory();
    }
  }, [continueFromId]);

  // 사용자 스크롤 감지
  const handleScroll = useCallback(() => {
    if (chatContainerRef.current) {
      const container = chatContainerRef.current;
      const isAtBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 50;
      setIsUserScrolled(!isAtBottom);
    }
  }, []);

  // 새 메시지가 추가될 때마다 채팅 컸테이너 내에서만 스크롤
  useEffect(() => {
    if (chatContainerRef.current && !isUserScrolled) {
      const container = chatContainerRef.current;

      // 지연을 주어 DOM 업데이트 후 스크롤
      const scrollToBottom = () => {
        requestAnimationFrame(() => {
          container.scrollTo({
            top: container.scrollHeight,
            behavior: 'smooth',
          });
        });
      };

      // 약간의 지연 후 스크롤 (메시지 렌더링 완료 대기)
      const timeoutId = setTimeout(scrollToBottom, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [messages, isUserScrolled]);

  // 새 메시지 전송 시 자동 스크롤 활성화
  const handleSendMessage = useCallback(
    (content: string) => {
      if (!content.trim()) return;
      setIsUserScrolled(false); // 새 메시지 전송 시 자동 스크롤 활성화
      sendMessage(content);
    },
    [sendMessage],
  );

  // 아래로 스크롤 버튼 클릭
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      setIsUserScrolled(false);
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, []);

  // 컴포너트 언마운트 시 웹소켓 연결 정리 및 히스토리 저장
  useEffect(() => {
    return () => {
      console.log('컴포너트 언마운트 시 웹소켓 연결 정리');

      // 히스토리 자동 저장 (새 세션인 경우에만)
      if (!continueFromId && wsSessionId && messages.length >= 2) {
        const historyMessages = messages.map((msg) => ({
          role: msg.role,
          content: msg.content,
          createdAt: msg.createdAt,
        }));

        saveHistory(wsSessionId, historyMessages, category)
          .then((historyId) => {
            if (historyId) {
              console.log('히스토리 자동 저장 완료:', historyId);
            }
          })
          .catch((error) => {
            console.error('히스토리 자동 저장 실패:', error);
          });
      }

      if (forceDisconnect) {
        forceDisconnect();
      }
    };
  }, [
    forceDisconnect,
    continueFromId,
    wsSessionId,
    messages,
    category,
    saveHistory,
  ]);

  const handleClearHistory = () => {
    if (window.confirm('대화 기록을 모두 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  // 카테고리 변경 전 사용자 확인
  const handleCategoryChange = useCallback(
    async (newCategory: CategoryType) => {
      if (newCategory === category) return;

      // 연결 중이면 변경 방지
      if (connectionStatus === 'connecting') {
        console.log('연결 중에는 카테고리를 변경할 수 없습니다.');
        return;
      }

      if (messages.length > 0) {
        const shouldChange = window.confirm(
          `카테고리를 변경하면 현재 대화 내용이 초기화됩니다. 계속하시겠습니까?`,
        );
        if (!shouldChange) return;
      }

      console.log(`카테고리 변경 시작: ${category} -> ${newCategory}`);

      // 카테고리 변경
      setCategory(newCategory);
    },
    [category, connectionStatus, messages.length],
  );

  const handleReconnect = useCallback(() => {
    // 기존 연결을 명시적으로 종료하고 새로고침
    forceDisconnect();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [forceDisconnect]);

  const getCategoryLabel = (cat: CategoryType) => {
    const labels: Record<CategoryType, string> = {
      general: '일반 AI 상담',
      specialized: '전문 AI 상담',
    };
    return labels[cat];
  };

  const getCategoryDescription = (cat: CategoryType) => {
    const descriptions: Record<CategoryType, string> = {
      general: '영양, 행동, 심리, 교육 관련 상담',
      specialized: '수면, 발달 전문 상담',
    };
    return descriptions[cat];
  };

  // 카테고리 타입 확인 함수
  const isSpecialCategory = (cat: CategoryType) => {
    return cat === 'specialized';
  };

  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return isSpecialCategory(category)
          ? 'text-purple-500'
          : 'text-green-500';
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

  const categories = [
    {
      value: 'general',
      label: '일반 AI 상담',
      type: 'normal',
      description: '영양 · 행동 · 심리 · 교육',
    },
    {
      value: 'specialized',
      label: '전문 AI 상담',
      type: 'special',
      description: '수면 · 발달 전문',
    },
  ] as const;

  if (isLoadingHistory) {
    return (
      <Card className="w-full h-full max-h-[80vh] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">
              이전 상담 내용을 불러오는 중입니다...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-full flex flex-col">
      {/* 카테고리 선택 탭 - 최상단으로 이동 */}
      <div className="p-4 pb-2 border-b">
        <Tabs
          value={category}
          onValueChange={(value) => handleCategoryChange(value as CategoryType)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2 h-auto p-1">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                disabled={
                  connectionStatus === 'connecting' ||
                  isLoading ||
                  connectionStatus === 'disconnected'
                }
                className={`text-sm flex flex-col items-center justify-center py-3 px-2 h-auto min-h-[70px] rounded-md transition-all ${
                  cat.type === 'special'
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white'
                    : ''
                }`}
              >
                <span className="font-medium text-center leading-tight text-sm">
                  {cat.label}
                  {cat.type === 'special' && (
                    <span className="ml-1 text-xs opacity-75">✨</span>
                  )}
                </span>
                <span className="text-xs opacity-75 mt-1 text-center leading-tight max-w-full">
                  {cat.description}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <CardHeader className="pb-2 px-4 sm:px-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <Bot className="h-5 w-5 text-primary flex-shrink-0" />
            <div className="min-w-0">
              <CardTitle className="text-lg sm:text-xl truncate">
                상담 채팅
              </CardTitle>
              <CardDescription className="text-sm">
                {isSpecialCategory(category) && (
                  <span className="text-purple-600 font-medium">
                    ✨ 수면과 발달 전문 AI 모델로 더욱 상세한 상담이 가능합니다.
                  </span>
                )}
                {!isSpecialCategory(category) && (
                  <span>영양, 행동, 심리, 교육 관련 상담을 제공합니다.</span>
                )}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <Badge
              variant="outline"
              className="flex items-center gap-1 text-xs"
            >
              <Sparkles className="h-3 w-3" />
              <span className="hidden sm:inline">
                {sessionType === 'stream' ? '스트리밍' : 'AI 기반'}
              </span>
              <span className="sm:hidden">
                {sessionType === 'stream' ? '스트리밍' : 'AI'}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className={`flex items-center gap-1 text-xs ${getConnectionStatusColor()}`}
            >
              {getConnectionStatusIcon()}
              <span className="text-xs hidden sm:inline">
                {connectionStatus === 'connected' &&
                  `연결됨${isSpecialCategory(category) ? ' (FastAPI)' : ' (Django)'}`}
                {connectionStatus === 'connecting' &&
                  `연결 중${isSpecialCategory(category) ? ' (FastAPI)' : ' (Django)'}`}
                {connectionStatus === 'error' &&
                  `오류${isSpecialCategory(category) ? ' (FastAPI)' : ' (Django)'}`}
                {connectionStatus === 'disconnected' && '연결 끊김'}
              </span>
            </Badge>
          </div>
        </div>

        {/* 세션 정보 및 컨트롤 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Clock className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              세션: {wsSessionId ? wsSessionId.slice(0, 8) + '...' : '없음'}
            </span>
          </div>
          <div className="flex gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              disabled={
                !isConnected ||
                messages.length === 0 ||
                isSpecialCategory(category)
              }
              className="h-6 px-2"
              title={
                isSpecialCategory(category)
                  ? '전문 카테고리에서는 히스토리 기능을 사용할 수 없습니다.'
                  : '대화 기록 삭제'
              }
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
              <RefreshCw
                className={`h-3 w-3 ${connectionStatus === 'connecting' ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </div>

        {/* 오류 알림 */}
        {error && (
          <ServerDiagnostic
            error={error}
            category={category}
            onReconnect={handleReconnect}
          />
        )}
      </CardHeader>

      <CardContent
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 relative"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}

          {/* 로딩 인디케이터 */}
          {isLoading && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground p-4">
              <div className="flex space-x-1 flex-shrink-0 mt-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
              </div>
              <span className="leading-relaxed">
                {sessionType === 'stream'
                  ? '실시간으로 답변을 생성 중입니다...'
                  : `${getCategoryLabel(category)} AI가 답변을 작성 중입니다...`}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 아래로 스크롤 버튼 */}
        {isUserScrolled && (
          <Button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 rounded-full w-10 h-10 p-0 shadow-lg"
            size="sm"
            variant="secondary"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </CardContent>

      <CardFooter className="p-0">
        <ChatInput
          onSend={handleSendMessage}
          isLoading={isLoading || !isConnected}
          disabled={!isConnected}
          placeholder={
            !isConnected
              ? '연결을 기다리는 중...'
              : `${getCategoryDescription(category)} 질문을 입력하세요...`
          }
        />
      </CardFooter>
    </Card>
  );
}
