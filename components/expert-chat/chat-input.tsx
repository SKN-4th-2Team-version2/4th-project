'use client';

import { useState, type FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { SendIcon } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, isLoading, disabled = false }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-background p-4">
      <div className="flex items-end gap-2">
        <Textarea
          placeholder={disabled ? '웹소켓 연결을 위해 잠시 기다려주세요...' : '전문가 AI에게 육아 관련 질문을 입력하세요...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="min-h-12 resize-none"
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button
          type="submit"
          size="icon"
          disabled={!input.trim() || isLoading || disabled}
          className="h-12 w-12"
        >
          <SendIcon className="h-5 w-5" />
          <span className="sr-only">전송</span>
        </Button>
      </div>
      {disabled && (
        <p className="text-xs text-muted-foreground mt-2">
          웹소켓 연결을 위해 잠시 기다려주세요.
        </p>
      )}
    </form>
  );
}
