import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TipsPage() {
  // 육아 팁 목록 데이터 (실제로는 API에서 가져올 것)
  const tips = [
    {
      id: 1,
      title: "아이와의 효과적인 대화법 5가지",
      content:
        "아이와 효과적으로 대화하는 방법을 알려드립니다. 아이의 말에 귀 기울이고, 아이의 감정을 인정해주며, 열린 질문을 하는 등 부모와 아이 사이의 소통을 돕는 실질적인 팁들을 소개합니다.",
      author: {
        name: "소통맘",
        image: "/abstract-profile.png",
      },
      category: "의사소통",
      tags: ["대화법", "감정코칭", "경청"],
      comments: 15,
      views: 320,
      likes: 42,
      created: "2일 전",
    },
    {
      id: 2,
      title: "영유아 수면 문제 해결하기",
      content:
        "아이의 수면 패턴을 개선하고 숙면을 돕는 방법을 알려드립니다. 수면 루틴 만들기, 수면 환경 조성하기, 자주 깨는 아이 재우기 등 실제로 효과 있는 수면 팁을 공유합니다.",
      author: {
        name: "수면전문가맘",
        image: "/abstract-profile.png",
      },
      category: "수면",
      tags: ["숙면", "수면루틴", "밤중수유"],
      comments: 23,
      views: 415,
      likes: 56,
      created: "3일 전",
    },
    {
      id: 3,
      title: "편식하는 아이 식습관 개선하기",
      content:
        "까다로운 식성을 가진 아이의 식습관을 개선하는 전략을 소개합니다. 음식에 대한 긍정적인 경험 만들기, 다양한 식재료 소개하기, 아이가 참여하는 요리 활동 등 실용적인 방법들을 알려드립니다.",
      author: {
        name: "영양사맘",
        image: "/abstract-profile.png",
      },
      category: "식이",
      tags: ["편식", "식습관", "영양"],
      comments: 18,
      views: 380,
      likes: 47,
      created: "5일 전",
    },
    {
      id: 4,
      title: "형제간 다툼 중재하는 방법",
      content:
        "형제자매 간의 다툼을 효과적으로 중재하고 해결하는 방법을 알려드립니다. 공평하게 대하기, 감정 표현 돕기, 문제 해결 능력 키우기 등 형제간 건강한 관계 형성을 위한 팁을 공유합니다.",
      author: {
        name: "두아이맘",
        image: "/abstract-profile.png",
      },
      category: "관계",
      tags: ["형제", "다툼", "중재"],
      comments: 20,
      views: 350,
      likes: 38,
      created: "1주일 전",
    },
    {
      id: 5,
      title: "아이 짜증 다루는 10가지 방법",
      content:
        "아이의 짜증과 떼쓰기에 대처하는 효과적인 방법을 소개합니다. 감정 인정하기, 명확한 경계 설정하기, 주의 전환하기 등 실제 상황에서 활용할 수 있는 구체적인 전략들을 알려드립니다.",
      author: {
        name: "심리상담사맘",
        image: "/abstract-profile.png",
      },
      category: "행동",
      tags: ["짜증", "감정조절", "훈육"],
      comments: 25,
      views: 430,
      likes: 52,
      created: "2주일 전",
    },
    {
      id: 6,
      title: "집에서 할 수 있는 창의력 놀이 활동",
      content:
        "특별한 준비물 없이 집에서 쉽게 할 수 있는 창의력 개발 놀이 활동을 소개합니다. 연령별로 적합한 다양한 놀이 아이디어와 교육적 효과를 함께 설명해드립니다.",
      author: {
        name: "놀이지도사",
        image: "/abstract-profile.png",
      },
      category: "놀이",
      tags: ["창의력", "실내놀이", "교구없는놀이"],
      comments: 16,
      views: 310,
      likes: 45,
      created: "3주일 전",
    },
  ]

  const categories = [
    { value: "all", label: "전체" },
    { value: "communication", label: "의사소통" },
    { value: "sleep", label: "수면" },
    { value: "nutrition", label: "식이" },
    { value: "relationship", label: "관계" },
    { value: "behavior", label: "행동" },
    { value: "play", label: "놀이" },
  ]

  const ageGroups = [
    { value: "all", label: "전체 연령" },
    { value: "newborn", label: "신생아 (0-3개월)" },
    { value: "infant", label: "영아기 (4-12개월)" },
    { value: "toddler", label: "걸음마기 (1-2세)" },
    { value: "preschool", label: "유아기 (3-5세)" },
    { value: "school", label: "학령기 (6세 이상)" },
  ]

  const sortOptions = [
    { value: "recent", label: "최신순" },
    { value: "popular", label: "인기순" },
    { value: "views", label: "조회순" },
    { value: "comments", label: "댓글 많은 순" },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">육아 팁</h1>
          <p className="text-muted-foreground">유용한 육아 팁과 노하우를 공유하는 공간입니다.</p>
        </div>
        <Button asChild>
          <Link href="/community/tips/new">팁 작성하기</Link>
        </Button>
      </div>

      <div className="mb-8">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full max-w-full overflow-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.value} value={category.value}>
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <Input type="search" placeholder="팁 검색하기" className="w-full pl-8" />
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="연령대 선택" />
            </SelectTrigger>
            <SelectContent>
              {ageGroups.map((age) => (
                <SelectItem key={age.value} value={age.value}>
                  {age.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select defaultValue="recent">
            <SelectTrigger className="w-full sm:w-[150px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tips.map((tip) => (
          <Card key={tip.id} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={tip.author.image || "/placeholder.svg"} alt={tip.author.name} />
                  <AvatarFallback>{tip.author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{tip.author.name}</p>
                  <p className="text-xs text-muted-foreground">{tip.created}</p>
                </div>
              </div>
              <Badge variant="outline">{tip.category}</Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <Link href={`/community/tips/${tip.id}`} className="hover:underline">
                <h3 className="font-bold text-lg mb-2">{tip.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">{tip.content}</p>
              <div className="flex flex-wrap gap-2">
                {tip.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <div className="flex space-x-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  {tip.views}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                  {tip.comments}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  {tip.likes}
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/community/tips/${tip.id}`}>자세히 보기</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <nav className="flex items-center space-x-2">
          <Button variant="outline" size="icon" disabled>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
            <span className="sr-only">이전 페이지</span>
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8" aria-current="page">
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            2
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            3
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            4
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            5
          </Button>
          <Button variant="outline" size="icon">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
            <span className="sr-only">다음 페이지</span>
          </Button>
        </nav>
      </div>
    </div>
  )
}
