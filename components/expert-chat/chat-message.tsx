import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

export interface Message {
  role: 'user' | 'assistant';
  content: string;
  createdAt?: Date;
}

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
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
            {message.content.split('\n').map((paragraph, i) => (
              <p
                key={i}
                className={
                  message.role === 'user' ? 'text-primary-foreground' : ''
                }
              >
                {paragraph}
              </p>
            ))}
          </div>
          {message.createdAt && (
            <div
              className={cn(
                'text-xs',
                message.role === 'assistant'
                  ? 'text-muted-foreground'
                  : 'text-primary-foreground/80',
              )}
            >
              {message.createdAt.toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
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
