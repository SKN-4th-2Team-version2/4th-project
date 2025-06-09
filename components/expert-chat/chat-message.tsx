import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { BookOpen, Clock } from 'lucide-react';

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

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    setFormattedTime(
      message.createdAt.toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    );
  }, [message.createdAt]);

  return (
    <div
      className={cn(
        'flex items-start gap-4 py-4',
        message.role === 'assistant' ? 'justify-start' : 'justify-end',
      )}
    >
      {message.role === 'assistant' && (
        <Avatar className="h-10 w-10">
          <AvatarImage src="/caring-doctor.png" alt="전문가 AI" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}

      <div
        className={cn(
          'rounded-lg px-4 py-3 max-w-[80%]',
          message.role === 'assistant'
            ? 'bg-muted text-foreground'
            : 'bg-primary text-primary-foreground',
        )}
      >
        <div className="space-y-2">
          <div className="prose prose-sm dark:prose-invert">
            {message.isTyping ? (
              <div className="flex items-center gap-2">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="h-2 w-2 rounded-full bg-current animate-bounce"></div>
                </div>
                <span className="text-sm opacity-70">답변 생성 중...</span>
              </div>
            ) : (
              message.content.split('\n').map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    message.role === 'user' ? 'text-primary-foreground' : ''
                  }
                >
                  {paragraph}
                </p>
              ))
            )}
          </div>
          
          {/* 소스 정보 표시 (AI 메시지이고 소스가 있을 때만) */}
          {message.role === 'assistant' && message.sources && message.sources.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <BookOpen className="h-3 w-3" />
                <span>참고 자료:</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {message.sources.map((source, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs px-2 py-1"
                    title={source.content_preview}
                  >
                    {source.category} - {source.section}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {message.createdAt && (
            <div
              className={cn(
                'text-xs flex items-center gap-1',
                message.role === 'assistant'
                  ? 'text-muted-foreground'
                  : 'text-primary-foreground/80',
              )}
            >
              <Clock className="h-3 w-3" />
              <span>{formattedTime}</span>
            </div>
          )}
        </div>
      </div>

      {message.role === 'user' && (
        <Avatar className="h-10 w-10">
          <AvatarImage src="/abstract-profile.png" alt="사용자" />
          <AvatarFallback>사용자</AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
