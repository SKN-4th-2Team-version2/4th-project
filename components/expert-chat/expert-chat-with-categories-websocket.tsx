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
  Save, 
  Sparkles, 
  Wifi, 
  WifiOff, 
  AlertCircle, 
  Trash2, 
  RefreshCw,
  Clock,
  ChevronDown
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/components/ui/use-toast';
import { saveChatHistory, getChatHistory } from '@/app/actions/chat-history';
import { useRouter } from 'next/navigation';

export type CategoryType =
  | 'nutrition'
  | 'behavior'
  | 'psychology'
  | 'education'
  | 'sleep'
  | 'development';

interface ExpertChatWithCategoriesProps {
  initialCategory?: CategoryType;
  sessionType?: 'normal' | 'stream';
  continueFromId?: string;
}

export function ExpertChatWithCategories({
  initialCategory = 'behavior',
  sessionType = 'normal',
  continueFromId,
}: ExpertChatWithCategoriesProps) {
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!continueFromId);
  const [isUserScrolled, setIsUserScrolled] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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
    forceDisconnect,
  } = useWebSocketChat({
    category,
    sessionType,
    specialChatUrl: process.env.NEXT_PUBLIC_SPECIAL_CHAT_URL
  });

  // 이전 상담 내용 불러오기
  useEffect(() => {
    if (continueFromId) {
      const loadHistory = async () => {
        try {
          setIsLoadingHistory(true);
          const history = await getChatHistory(continueFromId);
          if (history) {
            setCategory((history.category as CategoryType) || 'behavior');
            // 웹소켓 연결 후 히스토리를 서버에 복원하는 로직이 필요할 수 있음
          }
        } catch (error) {
          console.error('Failed to load chat history:', error);
          toast({
            title: '상담 내용을 불러오지 못했습니다',
            description: '이전 상담 내용을 불러오는 중 오류가 발생했습니다.',
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
      const isAtBottom = container.scrollTop + container.clientHeight >= container.scrollHeight - 50;
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
            behavior: 'smooth'
          });
        });
      };
      
      // 약간의 지연 후 스크롤 (메시지 렌더링 완료 대기)
      const timeoutId = setTimeout(scrollToBottom, 100);
      
      return () => clearTimeout(timeoutId);
    }
  }, [messages, isUserScrolled]);

  // 새 메시지 전송 시 자동 스크롤 활성화
  const handleSendMessage = useCallback((content: string) => {
    if (!content.trim()) return;
    setIsUserScrolled(false); // 새 메시지 전송 시 자동 스크롤 활성화
    sendMessage(content);
  }, [sendMessage]);

  // 아래로 스크롤 버튼 클릭
  const scrollToBottom = useCallback(() => {
    if (chatContainerRef.current) {
      setIsUserScrolled(false);
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, []);

  // 컴포너트 언마운트 시 웹소켓 연결 정리
  useEffect(() => {
    return () => {
      console.log('컴포너트 언마운트 시 웹소켓 연결 정리');
      if (forceDisconnect) {
        forceDisconnect();
      }
    };
  }, [forceDisconnect]);



  const handleClearHistory = () => {
    if (window.confirm('대화 기록을 모두 삭제하시겠습니까?')) {
      clearHistory();
    }
  };

  // 카테고리 변경 전 사용자 확인
  const handleCategoryChange = useCallback(async (newCategory: CategoryType) => {
    if (newCategory === category) return;
    
    // 연결 중이면 변경 방지
    if (connectionStatus === 'connecting') {
      console.log('연결 중에는 카테고리를 변경할 수 없습니다.');
      return;
    }
    
    if (messages.length > 0) {
      const shouldChange = window.confirm(
        `카테고리를 변경하면 현재 대화 내용이 초기화됩니다. 계속하시겠습니까?`
      );
      if (!shouldChange) return;
    }
    
    console.log(`카테고리 변경 시작: ${category} -> ${newCategory}`);
    
    // 카테고리 변경
    setCategory(newCategory);
  }, [category, connectionStatus, messages.length]);

  const handleReconnect = useCallback(() => {
    // 기존 연결을 명시적으로 종료하고 새로고침
    forceDisconnect();
    setTimeout(() => {
      window.location.reload();
    }, 100);
  }, [forceDisconnect]);

  const handleSaveChat = async () => {
    const hasUserMessage = messages.some((msg) => msg.role === 'user');
    const hasAssistantMessage = messages.some((msg) => msg.role === 'assistant');

    if (!hasUserMessage || !hasAssistantMessage) {
      toast({
        title: '저장할 내용이 없습니다',
        description: '상담 내용을 저장하려면 최소한 하나의 질문과 답변이 필요합니다.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setIsSaving(true);
      const historyId = await saveChatHistory(messages, category);

      if (historyId) {
        toast({
          title: '상담 내용이 저장되었습니다',
          description: '상담 히스토리 페이지에서 확인할 수 있습니다.',
        });

        const shouldNavigate = window.confirm(
          '상담 내용이 저장되었습니다. 상담 히스토리 페이지로 이동하시겠습니까?',
        );
        if (shouldNavigate) {
          router.push(`/expert/history/${historyId}`);
        }
      }
    } catch (error) {
      console.error('Failed to save chat history:', error);
      toast({
        title: '저장에 실패했습니다',
        description: '상담 내용을 저장하는 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryLabel = (cat: CategoryType) => {
    const labels: Record<CategoryType, string> = {
      nutrition: '영양',
      behavior: '행동',
      psychology: '심리',
      education: '교육',
      sleep: '수면',
      development: '발달',
    };
    return labels[cat];
  };

  // 카테고리 타입 확인 함수
  const isSpecialCategory = (cat: CategoryType) => {
    return cat === 'sleep' || cat === 'development';
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

  const categories = [
    { value: 'nutrition', label: '영양', type: 'normal' },
    { value: 'behavior', label: '행동', type: 'normal' },
    { value: 'psychology', label: '심리', type: 'normal' },
    { value: 'education', label: '교육', type: 'normal' },
    { value: 'sleep', label: '수면', type: 'special' },
    { value: 'development', label: '발달', type: 'special' },
  ] as const;

  if (isLoadingHistory) {
    return (
      <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
        <CardContent className="flex items-center justify-center h-full">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="text-muted-foreground">이전 상담 내용을 불러오는 중입니다...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>{getCategoryLabel(category)} 전문가 AI 상담</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveChat}
              disabled={isSaving || !isConnected}
            >
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? '저장 중...' : '저장'}
            </Button>
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>{sessionType === 'stream' ? '스트리밍' : 'AI 기반'}</span>
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
          {isSpecialCategory(category) && (
            <span className="block mt-1 text-purple-600 text-sm font-medium">
              ✨ 전문 AI 모델로 더욱 상세한 상담이 가능합니다.
            </span>
          )}
          <br />
          의학적 진단이나 응급 상황은 전문의와 상담하세요.
        </CardDescription>

        {/* 카테고리 선택 탭 */}
        <Tabs
          value={category}
          onValueChange={(value) => handleCategoryChange(value as CategoryType)}
          className="mt-4"
        >
          <TabsList className="grid w-full grid-cols-6">
            {categories.map((cat) => (
              <TabsTrigger
                key={cat.value}
                value={cat.value}
                disabled={connectionStatus === 'connecting' || isLoading || connectionStatus === 'disconnected'}
                className={`text-xs ${
                  cat.type === 'special' 
                    ? 'bg-gradient-to-r from-purple-500/10 to-blue-500/10 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-500 data-[state=active]:text-white' 
                    : ''
                }`}
              >
                {cat.label}
                {cat.type === 'special' && (
                  <span className="ml-1 text-xs opacity-75">✨</span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        {/* 세션 정보 및 컨트롤 */}
        <div className="flex items-center justify-between text-xs text-muted-foreground mt-2">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            <span>세션: {sessionId ? sessionId.slice(0, 8) + '...' : '없음'}</span>
            <span className="text-xs">
              ({getCategoryLabel(category)}
              {isSpecialCategory(category) && (
                <span className="text-purple-500 ml-1">특수</span>
              )})
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearHistory}
              disabled={!isConnected || messages.length === 0 || isSpecialCategory(category)}
              className="h-6 px-2"
              title={isSpecialCategory(category) ? '특수 카테고리에서는 히스토리 기능을 사용할 수 없습니다.' : '대화 기록 삭제'}
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

      <CardContent 
        ref={chatContainerRef} 
        className="flex-1 overflow-y-auto p-4 relative"
        onScroll={handleScroll}
      >
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage 
              key={index} 
              message={message} 
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
                {sessionType === 'stream' 
                  ? '실시간으로 답변을 생성 중입니다...' 
                  : `${getCategoryLabel(category)} 전문가 AI가 답변을 작성 중입니다...`
                }
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
              : `${getCategoryLabel(category)} 관련 질문을 입력하세요...`
          }
        />
      </CardFooter>
    </Card>
  );
}
