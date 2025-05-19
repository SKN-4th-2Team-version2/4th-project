import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { ArrowLeft, Calendar, ImageIcon, PenLine } from "lucide-react"
import { redirect } from "next/navigation"

export default function DevelopmentJournalPage() {
  const journals = [
    {
      id: 1,
      title: "첫 번째 생일",
      date: "2023년 12월 20일",
      excerpt:
        "오늘은 우리 아이의 첫 번째 생일이에요. 지난 1년 동안 아이가 얼마나 많이 성장했는지 돌아보는 시간을 가졌습니다.",
      hasImage: true,
      category: "special-day",
    },
    {
      id: 2,
      title: "첫 단어와 걸음마",
      date: "2023년 12월 10일",
      excerpt: "이번 주에 아이가 첫 단어를 말하고 첫 걸음마를 떼었어요. 발달이 빠르게 진행되고 있어 기쁩니다.",
      hasImage: true,
      category: "milestone",
    },
    {
      id: 3,
      title: "소아과 정기 검진",
      date: "2023년 11월 25일",
      excerpt: "오늘 12개월 정기 검진을 받았어요. 의사 선생님께서 아이의 발달이 정상적으로 진행되고 있다고 하셨습니다.",
      hasImage: false,
      category: "health",
    },
    {
      id: 4,
      title: "이유식 시작",
      date: "2023년 6월 15일",
      excerpt: "오늘부터 이유식을 시작했어요. 처음에는 쌀미음으로 시작했는데, 아이가 잘 먹어서 다행입니다.",
      hasImage: true,
      category: "nutrition",
    },
  ]

  const getCategoryName = (category: string) => {
    switch (category) {
      case "milestone":
        return "발달 이정표"
      case "health":
        return "건강"
      case "nutrition":
        return "영양"
      case "special-day":
        return "특별한 날"
      default:
        return category
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "milestone":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "health":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "nutrition":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100"
      case "special-day":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100"
    }
  }

  // Redirect to the new journal page
  redirect("/development/record")

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
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold mb-2">발달 일지</h1>
            <p className="text-muted-foreground">아이의 특별한 순간과 발달 과정을 일지 형태로 기록하세요.</p>
          </div>
          <Button asChild>
            <Link href="/development/journal/new">
              <PenLine className="mr-2 h-4 w-4" />새 일지 작성
            </Link>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full mb-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="milestone">발달 이정표</TabsTrigger>
          <TabsTrigger value="health">건강</TabsTrigger>
          <TabsTrigger value="nutrition">영양</TabsTrigger>
          <TabsTrigger value="special-day">특별한 날</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {journals.map((journal) => (
          <Card key={journal.id} className="overflow-hidden">
            {journal.hasImage && (
              <div className="aspect-video w-full overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <ImageIcon className="h-12 w-12 text-gray-400" />
              </div>
            )}
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle>{journal.title}</CardTitle>
                <Badge className={cn("ml-2", getCategoryColor(journal.category))}>
                  {getCategoryName(journal.category)}
                </Badge>
              </div>
              <CardDescription className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {journal.date}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{journal.excerpt}</p>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" className="w-full" asChild>
                <Link href={`/development/journal/${journal.id}`}>자세히 보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-muted-foreground mb-4">아이의 발달 상황을 더 자세히 기록하고 싶으신가요?</p>
        <Button asChild>
          <Link href="/development/record">발달 기록하기</Link>
        </Button>
      </div>
    </div>
  )
}
