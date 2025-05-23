'use client';

import { useRef, useState, useEffect } from 'react';
import { ChatMessage, type Message } from './chat-message';
import { ChatInput } from './chat-input';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { generateExpertResponse } from '@/app/actions/expert-ai';
import { Badge } from '@/components/ui/badge';
import { Bot, Save, Sparkles } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { saveChatHistory, getChatHistory } from '@/app/actions/chat-history';
import { useRouter } from 'next/navigation';
import { toast } from '@/components/ui/use-toast';

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      '안녕하세요! 마파덜의 육아 전문가 AI입니다. 아이의 발달, 수면, 식이, 행동 등 육아와 관련된 어떤 질문이든 편하게 물어보세요. 초보 부모님의 육아 부담을 덜어드리기 위해 최선을 다해 답변해 드리겠습니다.',
    createdAt: new Date(),
  },
];

export type CategoryType =
  | 'all'
  | 'development'
  | 'sleep'
  | 'nutrition'
  | 'behavior'
  | 'psychology'
  | 'education';

interface ExpertChatWithCategoriesProps {
  initialCategory?: CategoryType;
  continueFromId?: string;
}

export function ExpertChatWithCategories({
  initialCategory = 'all',
  continueFromId,
}: ExpertChatWithCategoriesProps) {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const [category, setCategory] = useState<CategoryType>(initialCategory);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(!!continueFromId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // 이전 상담 내용 불러오기
  useEffect(() => {
    if (continueFromId) {
      const loadHistory = async () => {
        try {
          setIsLoadingHistory(true);
          const history = await getChatHistory(continueFromId);
          if (history) {
            // 카테고리 설정
            setCategory((history.category as CategoryType) || 'all');

            // 메시지 설정 (날짜 객체로 변환)
            const loadedMessages = history.messages.map((msg) => ({
              ...msg,
              createdAt: new Date(msg.createdAt),
            })) as Message[];

            setMessages(loadedMessages);
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

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // 카테고리가 변경될 때 카테고리별 초기 메시지 설정 (이전 상담을 불러오는 경우는 제외)
  useEffect(() => {
    if (isLoadingHistory || continueFromId) return;

    let welcomeMessage =
      '안녕하세요! 마파덜의 육아 전문가 AI입니다. 어떤 질문이든 편하게 물어보세요.';

    switch (category) {
      case 'development':
        welcomeMessage =
          '안녕하세요! 아이의 신체, 인지, 언어, 사회성 발달에 관한 질문을 해주세요. 연령별 발달 이정표와 발달을 촉진하는 활동에 대해 알려드릴 수 있습니다.';
        break;
      case 'sleep':
        welcomeMessage =
          '안녕하세요! 아이의 수면 문제에 관한 질문을 해주세요. 수면 습관 형성, 밤중 깨는 문제, 낮잠 관리 등에 대해 알려드릴 수 있습니다.';
        break;
      case 'nutrition':
        welcomeMessage =
          '안녕하세요! 아이의 영양과 식습관에 관한 질문을 해주세요. 이유식 시작, 편식 문제, 균형 잡힌 식단 등에 대해 알려드릴 수 있습니다.';
        break;
      case 'behavior':
        welcomeMessage =
          '안녕하세요! 아이의 행동과 훈육에 관한 질문을 해주세요. 떼쓰기, 분노 조절, 긍정적 훈육 방법 등에 대해 알려드릴 수 있습니다.';
        break;
      case 'psychology':
        welcomeMessage =
          '안녕하세요! 아이의 심리와 정서 발달에 관한 질문을 해주세요. 애착 형성, 감정 표현, 자존감 발달 등에 대해 알려드릴 수 있습니다.';
        break;
      case 'education':
        welcomeMessage =
          '안녕하세요! 아이의 교육과 학습에 관한 질문을 해주세요. 연령별 적합한 학습 활동, 독서 지도, 학습 환경 조성 등에 대해 알려드릴 수 있습니다.';
        break;
    }

    setMessages([
      {
        role: 'assistant',
        content: welcomeMessage,
        createdAt: new Date(),
      },
    ]);
  }, [category, isLoadingHistory, continueFromId]);

  const handleSendMessage = async (content: string) => {
    // 사용자 메시지 추가
    const userMessage: Message = {
      role: 'user',
      content,
      createdAt: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // 카테고리 정보를 포함하여 AI 응답 생성
      const aiResponse = await generateExpertResponse(content, category);
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error generating response:', error);
      // 오류 메시지 추가
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content:
            '죄송합니다. 응답을 생성하는 중에 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
          createdAt: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveChat = async () => {
    // 최소한 하나의 질문과 답변이 있는지 확인
    const hasUserMessage = messages.some((msg) => msg.role === 'user');
    const hasAssistantMessage = messages.some(
      (msg) => msg.role === 'assistant',
    );

    if (!hasUserMessage || !hasAssistantMessage) {
      toast({
        title: '저장할 내용이 없습니다',
        description:
          '상담 내용을 저장하려면 최소한 하나의 질문과 답변이 필요합니다.',
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

        // 저장 후 히스토리 페이지로 이동할지 물어보기
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

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'development', label: '발달' },
    { value: 'sleep', label: '수면' },
    { value: 'nutrition', label: '영양' },
    { value: 'behavior', label: '행동' },
    { value: 'psychology', label: '심리' },
    { value: 'education', label: '교육' },
  ];

  if (isLoadingHistory) {
    return (
      <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
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
    <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>전문가 AI 상담</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSaveChat}
              disabled={isSaving || messages.length < 2}
              className="flex items-center gap-1"
            >
              <Save className="h-4 w-4" />
              {isSaving ? '저장 중...' : '상담 저장'}
            </Button>
            <Badge variant="outline" className="flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              <span>AI 기반</span>
            </Badge>
          </div>
        </div>
        <CardDescription>
          육아 관련 질문에 전문적인 답변을 제공합니다. 의학적 진단이나 응급
          상황은 전문의와 상담하세요.
        </CardDescription>
        <div className="mt-2">
          <Tabs
            value={category}
            onValueChange={(value) => setCategory(value as CategoryType)}
            className="w-full"
          >
            <TabsList className="w-full max-w-full overflow-auto">
              {categories.map((cat) => (
                <TabsTrigger key={cat.value} value={cat.value}>
                  {cat.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <ChatMessage key={index} message={message} />
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground p-4">
              <div className="flex space-x-1">
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]"></div>
                <div className="h-2 w-2 rounded-full bg-primary animate-bounce"></div>
              </div>
              <span>전문가 AI가 답변을 작성 중입니다...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>
      <CardFooter className="p-0">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
      </CardFooter>
    </Card>
  );
}
