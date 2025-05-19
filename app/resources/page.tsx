import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ResourcesPage() {
  const categories = [
    { id: "tips", name: "육아 팁", icon: "lightbulb" },
    { id: "guides", name: "가이드", icon: "book-open" },
    { id: "emergency", name: "응급 상황", icon: "alert-circle" },
    { id: "nutrition", name: "영양 및 식이", icon: "utensils" },
    { id: "sleep", name: "수면", icon: "moon" },
    { id: "education", name: "교육", icon: "graduation-cap" },
    { id: "health", name: "건강", icon: "heart" },
    { id: "policy", name: "정책 및 제도", icon: "landmark" },
  ]

  const resources = {
    tips: [
      {
        id: 1,
        title: "아이와의 효과적인 대화법",
        description: "아이의 말에 귀 기울이고 효과적으로 소통하는 방법",
        category: "의사소통",
        readTime: "5분",
      },
      {
        id: 2,
        title: "영유아 수면 문제 해결하기",
        description: "아이의 수면 패턴을 개선하고 숙면을 돕는 방법",
        category: "수면",
        readTime: "7분",
      },
      {
        id: 3,
        title: "편식하는 아이 식습관 개선하기",
        description: "까다로운 식성을 가진 아이의 식습관을 개선하는 전략",
        category: "식이",
        readTime: "6분",
      },
    ],
    guides: [
      {
        id: 1,
        title: "연령별 발달 가이드",
        description: "0세부터 7세까지 연령별 발달 특성과 부모의 역할",
        category: "발달",
        readTime: "10분",
      },
      {
        id: 2,
        title: "아이 감정 코칭 가이드",
        description: "아이의 감정을 인정하고 조절할 수 있도록 돕는 방법",
        category: "심리",
        readTime: "8분",
      },
      {
        id: 3,
        title: "놀이를 통한 학습 가이드",
        description: "놀이를 통해 아이의 인지 발달과 학습을 촉진하는 방법",
        category: "교육",
        readTime: "9분",
      },
    ],
    emergency: [
      {
        id: 1,
        title: "영유아 응급처치 기본",
        description: "부모가 알아야 할 기본적인 응급처치 방법",
        category: "응급",
        readTime: "6분",
      },
      {
        id: 2,
        title: "아이가 열이 날 때 대처법",
        description: "발열 시 증상 확인과 적절한 대처 방법",
        category: "건강",
        readTime: "5분",
      },
      {
        id: 3,
        title: "이물질 삼킴 사고 대처법",
        description: "아이가 이물질을 삼켰을 때 응급 대응 방법",
        category: "응급",
        readTime: "4분",
      },
    ],
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">육아 자료실</h1>
        <p className="text-muted-foreground">초보 엄마 아빠의 육아 부담을 덜어줄 다양한 정보와 자료를 찾아보세요.</p>
      </div>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">카테고리</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="text-center hover:bg-accent/50 transition-colors">
              <Link href={`/resources/${category.id}`} className="block p-4">
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-primary"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="m12 16 4-4" />
                      <path d="m12 16-4-4" />
                      <path d="M12 8v8" />
                    </svg>
                  </div>
                  <span className="font-medium">{category.name}</span>
                </div>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">추천 자료</h2>
        <Tabs defaultValue="tips" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="tips">육아 팁</TabsTrigger>
            <TabsTrigger value="guides">가이드</TabsTrigger>
            <TabsTrigger value="emergency">응급 상황</TabsTrigger>
          </TabsList>
          <TabsContent value="tips" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.tips.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-xs text-muted-foreground">읽는 시간: {resource.readTime}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/resources/tips/${resource.id}`}>자세히 보기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="guides" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.guides.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-xs text-muted-foreground">읽는 시간: {resource.readTime}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/resources/guides/${resource.id}`}>자세히 보기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="emergency" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {resources.emergency.map((resource) => (
                <Card key={resource.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline">{resource.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">{resource.description}</p>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <span className="text-xs text-muted-foreground">읽는 시간: {resource.readTime}</span>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/resources/emergency/${resource.id}`}>자세히 보기</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>

      <section className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold mb-2">자료를 찾지 못하셨나요?</h2>
            <p className="text-muted-foreground">
              찾으시는 정보가 없다면 커뮤니티에 질문하거나 전문가에게 문의하여 육아 부담을 덜어보세요.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" asChild>
              <Link href="/community/questions/new">커뮤니티에 질문하기</Link>
            </Button>
            <Button asChild>
              <Link href="/expert/qa/new">전문가에게 문의하기</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
