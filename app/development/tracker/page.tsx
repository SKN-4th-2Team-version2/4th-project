import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function DevelopmentTrackerPage() {
  const developmentAreas = [
    {
      id: "physical",
      name: "신체 발달",
      color: "bg-blue-500",
      milestones: [
        { name: "머리 가누기", progress: 100, age: "3-4개월" },
        { name: "뒤집기", progress: 100, age: "4-6개월" },
        { name: "앉기", progress: 80, age: "6-8개월" },
        { name: "기어다니기", progress: 60, age: "8-10개월" },
        { name: "서기", progress: 40, age: "9-12개월" },
        { name: "걷기", progress: 20, age: "12-18개월" },
      ],
    },
    {
      id: "cognitive",
      name: "인지 발달",
      color: "bg-green-500",
      milestones: [
        { name: "사물 인식", progress: 100, age: "2-3개월" },
        { name: "사물 추적", progress: 90, age: "3-5개월" },
        { name: "까꿍 놀이 반응", progress: 75, age: "6-8개월" },
        { name: "간단한 지시 이해", progress: 60, age: "9-12개월" },
        { name: "물건 숨기기/찾기", progress: 40, age: "12-15개월" },
        { name: "상징 놀이", progress: 20, age: "18-24개월" },
      ],
    },
    {
      id: "language",
      name: "언어 발달",
      color: "bg-purple-500",
      milestones: [
        { name: "옹알이", progress: 100, age: "2-3개월" },
        { name: "다양한 소리 내기", progress: 85, age: "4-6개월" },
        { name: "의미 있는 소리 내기", progress: 70, age: "7-9개월" },
        { name: "첫 단어", progress: 50, age: "10-14개월" },
        { name: "단어 조합", progress: 30, age: "18-24개월" },
        { name: "짧은 문장", progress: 10, age: "24-36개월" },
      ],
    },
    {
      id: "social",
      name: "사회성 발달",
      color: "bg-amber-500",
      milestones: [
        { name: "미소 짓기", progress: 100, age: "1-2개월" },
        { name: "사회적 미소", progress: 90, age: "2-3개월" },
        { name: "낯가림", progress: 80, age: "6-8개월" },
        { name: "애착 형성", progress: 70, age: "8-12개월" },
        { name: "또래 인식", progress: 50, age: "12-18개월" },
        { name: "간단한 협동 놀이", progress: 30, age: "24-36개월" },
      ],
    },
  ]

  const overallProgress = {
    physical: 67,
    cognitive: 64,
    language: 58,
    social: 70,
  }

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
        <h1 className="text-3xl font-bold mb-2">발달 추적</h1>
        <p className="text-muted-foreground">아이의 발달 상황을 영역별로 추적하고 시각화하여 확인할 수 있습니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        {Object.entries(overallProgress).map(([area, progress]) => {
          const areaInfo = developmentAreas.find((a) => a.id === area)
          return (
            <Card key={area}>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{areaInfo?.name}</CardTitle>
                <CardDescription>전체 진행 상황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className={`h-2 ${areaInfo?.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="physical" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          {developmentAreas.map((area) => (
            <TabsTrigger key={area.id} value={area.id}>
              {area.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {developmentAreas.map((area) => (
          <TabsContent key={area.id} value={area.id} className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>{area.name} 이정표</CardTitle>
                <CardDescription>아이의 {area.name} 이정표 달성 현황</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {area.milestones.map((milestone, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{milestone.name}</div>
                          <div className="text-sm text-muted-foreground">일반적 달성 시기: {milestone.age}</div>
                        </div>
                        <span className="text-sm font-medium">{milestone.progress}%</span>
                      </div>
                      <Progress value={milestone.progress} className={`h-2 ${area.color}`} />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">아이의 발달 상황을 더 자세히 기록하고 싶으신가요?</p>
        <Button asChild>
          <Link href="/development/record">발달 기록하기</Link>
        </Button>
      </div>
    </div>
  )
}
