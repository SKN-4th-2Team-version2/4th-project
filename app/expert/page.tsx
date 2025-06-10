'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpertChatWithCategories } from '@/components/expert-chat/expert-chat-with-categories-websocket';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History } from 'lucide-react';
import type { CategoryType } from '@/components/expert-chat/expert-chat-with-categories-websocket';

export default function ExpertPage() {
  const searchParams = useSearchParams();
  
  // URL 파라미터에서 상담 복원 정보 추출
  const continueFromId = searchParams.get('continue');
  const category = searchParams.get('category') as CategoryType | null;
  const sessionId = searchParams.get('sessionId');
  
  // 기본 카테고리 설정
  const initialCategory: CategoryType = category === 'specialized' ? 'specialized' : 'general';
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">AI 전문가 상담</h1>
            <p className="text-muted-foreground">
              일반 AI 상담과 전문 AI 상담으로 초보 부모님들의 육아 부담을 덜어드립니다.
            </p>
          </div>
          <Button variant="outline" asChild className="flex items-center gap-2">
            <Link href="/expert/history">
              <History className="h-4 w-4" />
              상담 히스토리
            </Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px] lg:h-[700px]">
        <div className="lg:col-span-2">
          <ExpertChatWithCategories 
            initialCategory={initialCategory}
            continueFromId={continueFromId || undefined}
            sessionId={sessionId || undefined}
          />
        </div>
        <div className="flex flex-col gap-6 h-full">
          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>AI 상담 특징</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto flex-1">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">검증된 정보</h3>
                  <p className="text-sm text-muted-foreground">
                    최신 연구와 과학적 근거에 기반한 정보를 제공합니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">24시간 상담</h3>
                  <p className="text-sm text-muted-foreground">
                    언제든지 질문하고 즉시 답변을 받을 수 있습니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">두 가지 AI 모델</h3>
                  <p className="text-sm text-muted-foreground">
                    일반 AI 상담(ChatGPT)과 전문 AI 상담(파인튜닝 모델)을 제공합니다.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full text-primary">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">자동 상담 기록</h3>
                  <p className="text-sm text-muted-foreground">
                    대화 내용이 자동으로 저장되어 언제든 다시 확인할 수 있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="flex-1 flex flex-col">
            <CardHeader className="flex-shrink-0">
              <CardTitle>자주 묻는 질문 예시</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 overflow-y-auto flex-1">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">일반 AI 상담</h3>
                <p className="text-xs text-muted-foreground">
                  "아이가 이유식을 거부해요. 어떻게 대처해야 할까요?"
                </p>
                <p className="text-xs text-muted-foreground">
                  "편식이 심한 아이, 영양 균형을 맞추는 방법이 있을까요?"
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">전문 AI 상담</h3>
                <p className="text-xs text-muted-foreground">
                  "8개월 아기가 밤에 자주 깨어요. 어떻게 해야 할까요?"
                </p>
                <p className="text-xs text-muted-foreground">
                  "12개월 아기가 아직 걷지 못해요. 걱정해야 할까요?"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
