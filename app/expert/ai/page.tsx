import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ExpertChatWithCategories } from "@/components/expert-chat/expert-chat-with-categories"
import type { CategoryType } from "@/components/expert-chat/expert-chat-with-categories"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { History } from "lucide-react"

export default function ExpertAIPage({ searchParams }: { searchParams: { category?: string; continue?: string } }) {
  // URL 쿼리 파라미터에서 카테고리와 이어서 할 상담 ID 가져오기
  const category = (searchParams.category || "all") as CategoryType
  const continueFromId = searchParams.continue

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">전문가 AI 상담</h1>
            <p className="text-muted-foreground">
              육아 관련 질문에 AI가 전문적인 답변을 제공합니다. 24시간 언제든지 질문하세요.
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
          <ExpertChatWithCategories initialCategory={category} continueFromId={continueFromId} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>이용 안내</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">AI 상담 특징</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>과학적 근거와 최신 연구에 기반한 정보 제공</li>
                  <li>24시간 즉시 응답</li>
                  <li>다양한 전문 분야의 지식 통합</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">카테고리 안내</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>발달</strong>: 신체, 인지, 언어, 사회성 발달
                  </li>
                  <li>
                    <strong>수면</strong>: 수면 습관, 수면 문제, 낮잠
                  </li>
                  <li>
                    <strong>영양</strong>: 이유식, 식습관, 영양 균형
                  </li>
                  <li>
                    <strong>행동</strong>: 훈육, 문제 행동, 습관 형성
                  </li>
                  <li>
                    <strong>심리</strong>: 정서 발달, 애착, 자존감
                  </li>
                  <li>
                    <strong>교육</strong>: 학습 활동, 독서, 학습 환경
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">상담 저장 기능</h3>
                <p className="text-sm text-muted-foreground">
                  상담 내용은 '상담 저장' 버튼을 클릭하여 저장할 수 있습니다. 저장된 상담 내용은 '상담 히스토리'
                  페이지에서 확인하고 이어서 상담할 수 있습니다.
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">주의사항</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>AI 상담은 전문가의 직접적인 상담을 대체할 수 없습니다</li>
                  <li>의학적 진단이나 처방은 제공하지 않습니다</li>
                  <li>응급 상황은 즉시 의료 전문가에게 상담하세요</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
