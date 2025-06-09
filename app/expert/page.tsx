import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExpertChatWithCategories } from '@/components/expert-chat/expert-chat-with-categories-websocket';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { History } from 'lucide-react';

export default function ExpertPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">전문가 조언</h1>
            <p className="text-muted-foreground">
              초보 부모님들의 육아 부담을 덜어줄 AI 전문가 상담 서비스를
              이용해보세요.
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <ExpertChatWithCategories />
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI 상담 특징</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
                  <h3 className="font-medium">다양한 전문 분야</h3>
                  <p className="text-sm text-muted-foreground">
                    발달, 수면, 영양, 행동, 심리, 교육 등 다양한 분야의 전문
                    지식을 제공합니다.
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
                  <h3 className="font-medium">상담 내용 저장</h3>
                  <p className="text-sm text-muted-foreground">
                    상담 내용을 저장하고 나중에 다시 확인하거나 이어서 상담할 수
                    있습니다.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>자주 묻는 질문 예시</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <h3 className="text-sm font-medium">발달 분야</h3>
                <p className="text-xs text-muted-foreground">
                  "12개월 아기가 아직 걷지 못해요. 걱정해야 할까요?"
                </p>
                <p className="text-xs text-muted-foreground">
                  "아이가 또래보다 말이 늦는 것 같아요. 어떻게 도와줄 수
                  있을까요?"
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">수면 분야</h3>
                <p className="text-xs text-muted-foreground">
                  "8개월 아기가 밤에 자주 깨요. 어떻게 해야 할까요?"
                </p>
                <p className="text-xs text-muted-foreground">
                  "2살 아이의 적정 수면 시간은 얼마인가요?"
                </p>
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-medium">영양 분야</h3>
                <p className="text-xs text-muted-foreground">
                  "이유식을 거부하는 아기, 어떻게 대처해야 할까요?"
                </p>
                <p className="text-xs text-muted-foreground">
                  "편식이 심한 아이, 영양 균형을 맞추는 방법이 있을까요?"
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
