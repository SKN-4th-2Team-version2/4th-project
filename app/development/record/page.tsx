import { DevelopmentRecordForm } from "@/components/development/development-record-form"
import { DevelopmentRecordList } from "@/components/development/development-record-list"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DevelopmentRecordPage({ searchParams }: { searchParams: { age?: string } }) {
  // URL 쿼리 파라미터에서 연령 그룹 가져오기
  const ageGroupId = searchParams.age ? Number.parseInt(searchParams.age) : undefined

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/development" className="flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              <span>발달 모니터링</span>
            </Link>
          </Button>
        </div>
        <h1 className="text-3xl font-bold mb-2">발달 기록</h1>
        <p className="text-muted-foreground">
          아이의 발달 과정을 기록하고 관리하세요. 발달 영역별로 아이의 성장을 추적할 수 있습니다.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Tabs defaultValue="record" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="record">새 기록 작성</TabsTrigger>
              <TabsTrigger value="history">기록 내역</TabsTrigger>
            </TabsList>
            <TabsContent value="record" className="mt-6">
              <DevelopmentRecordForm initialAgeGroup={ageGroupId} />
            </TabsContent>
            <TabsContent value="history" className="mt-6">
              <DevelopmentRecordList />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>발달 기록 가이드</CardTitle>
              <CardDescription>아이의 발달을 효과적으로 기록하는 방법</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="font-medium">기록 작성 팁</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>정기적으로 기록하는 습관을 들이세요 (주 1회 권장)</li>
                  <li>구체적인 행동이나 변화를 자세히 기록하세요</li>
                  <li>사진이나 동영상을 함께 기록하면 더 좋습니다</li>
                  <li>아이의 감정 상태나 반응도 함께 기록하세요</li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">발달 영역 안내</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>
                    <strong>신체 발달</strong>: 대근육, 소근육 발달, 신체 성장
                  </li>
                  <li>
                    <strong>인지 발달</strong>: 문제 해결 능력, 기억력, 주의력
                  </li>
                  <li>
                    <strong>언어 발달</strong>: 언어 이해력, 표현력, 의사소통 능력
                  </li>
                  <li>
                    <strong>사회성 발달</strong>: 대인 관계, 감정 표현, 사회적 규칙 이해
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h3 className="font-medium">기록 활용 방법</h3>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>정기 검진 시 의사와 상담할 때 참고자료로 활용하세요</li>
                  <li>시간에 따른 아이의 발달 과정을 비교해보세요</li>
                  <li>발달 추적 페이지에서 영역별 발달 상황을 확인하세요</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>발달 추적 바로가기</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full" asChild>
                <Link href="/development/tracker">발달 추적 보기</Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/development/timeline">발달 타임라인</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
