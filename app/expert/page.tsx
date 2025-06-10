'use client';

import { ChatBot } from '@/components/chat/ChatBot';

export default function ExpertPage() {
  return (
    <div className="container mx-auto p-4">
      <div className="h-[calc(100vh-2rem)]">
        <ChatBot 
          sessionType="ai_expert"
          category="general"
          onError={(error) => console.error('채팅 에러:', error)}
        />
      </div>
    </div>
  );
}
