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
import { Bot, Sparkles } from 'lucide-react';

const INITIAL_MESSAGES: Message[] = [
  {
    role: 'assistant',
    content:
      '안녕하세요! 마파덜의 육아 전문가 AI입니다. 아이의 발달, 수면, 식이, 행동 등 육아와 관련된 어떤 질문이든 편하게 물어보세요. 초보 부모님의 육아 부담을 덜어드리기 위해 최선을 다해 답변해 드리겠습니다.',
    createdAt: new Date(),
  },
];

export function ExpertChat() {
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      // AI 응답 생성
      const aiResponse = await generateExpertResponse(content);
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

  return (
    <Card className="w-full h-[700px] max-h-[80vh] flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bot className="h-5 w-5 text-primary" />
            <CardTitle>전문가 AI 상담</CardTitle>
          </div>
          <Badge variant="outline" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>AI 기반</span>
          </Badge>
        </div>
        <CardDescription>
          육아 관련 질문에 전문적인 답변을 제공합니다. 의학적 진단이나 응급
          상황은 전문의와 상담하세요.
        </CardDescription>
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
