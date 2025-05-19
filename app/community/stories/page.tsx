import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function StoriesPage() {
  // 육아 이야기 목록 데이터 (실제로는 API에서 가져올 것)
  const stories = [
    {
      id: 1,
      title: "첫 걸음마의 감동, 그 순간을 기록합니다",
      content:
        "우리 아이가 드디어 첫 걸음마를 떼었어요. 그동안 기다림의 시간과 첫 걸음마의 감동적인 순간, 그리고 그 이후 아이의 변화에 대한 이야기를 나누고 싶어요.",
      author: {
        name: "행복한맘",
        image: "/abstract-profile.png",
      },
      category: "성장일기",
      tags: ["첫걸음마", "성장기록", "감동순간"],
      comments: 12,
      views: 245,
      likes: 38,
      created: "3일 전",
      thumbnail: "/placeholder.svg?key=hmch8",
    },
    {
      id: 2,
      title: "육아 번아웃을 극복한 나만의 방법",
      content:
        "24시간이 모자랄 정도로 바쁜 육아 생활에 지쳐 번아웃을 경험했어요. 그 시간을 어떻게 극복했는지, 그리고 지금은 어떻게 나만의 시간을 만들어 가고 있는지 공유합니다.",
      author: {
        name: "회복중인맘",
        image: "/abstract-profile.png",
      },
      category: "일상공유",
      tags: ["번아웃", "자기관리", "육아스트레스"],
      comments: 24,
      views: 412,
      likes: 67,
      created: "1주일 전",
      thumbnail: "/placeholder.svg?key=9xya8",
    },
    {
      id: 3,
      title: "쌍둥이 육아 1년차, 웃픈 에피소드 모음",
      content:
        "쌍둥이를 키우며 겪은 다양한 에피소드들을 공유합니다. 힘들지만 웃음이 나는 순간들, 두 배로 커지는 사랑과 두 배로 커지는 고민까지, 쌍둥이 부모만 알 수 있는 특별한 이야기들입니다.",
      author: {
        name: "쌍둥이아빠",
        image: "/abstract-profile.png",
      },
      category: "일상공유",
      tags: ["쌍둥이", "육아에피소드", "육아웃픔"],
      comments: 18,
      views: 356,
      likes: 45,
      created: "2주일 전",
      thumbnail: "/placeholder.svg?key=imuoe",
    },
    {
      id: 4,
      title: "아이와 함께한 제주도 여행 후기",
      content:
        "5살 아이와 함께 다녀온 제주도 여행 이야기를 공유합니다. 아이와 함께하기 좋은 숙소, 맛집, 관광지 정보와 여행 팁, 그리고 여행을 통해 아이가 얼마나 성장했는지에 대한 이야기입니다.",
      author: {
        name: "여행좋아맘",
        image: "/abstract-profile.png",
      },
      category: "여행",
      tags: ["가족여행", "제주도", "아이동반여행"],
      comments: 15,
      views: 289,
      likes: 42,
      created: "3주일 전",
      thumbnail: "/placeholder.svg?key=tiuyu",
    },
    {
      id: 5,
      title: "아빠의 육아 참여가 가져온 변화들",
      content:
        "육아에 적극적으로 참여하게 된 아빠의 시점에서 바라본 가족의 변화와 아이와의 관계 발전에 대한 이야기입니다. 처음에는 어색했지만 지금은 없어서는 안 될 소중한 시간이 된 육아 참여 경험을 나눕니다.",
      author: {
        name: "육아대디",
        image: "/abstract-profile.png",
      },
      category: "아빠육아",
      tags: ["아빠육아", "공동육아", "육아참여"],
      comments: 22,
      views: 378,
      likes: 56,
      created: "1개월 전",
      thumbnail: "/placeholder.svg?key=iwd0f",
    },
    {
      id: 6,
      title: "아이의 첫 유치원 적응기",
      content:
        "처음으로 유치원에 입학한 우리 아이의 적응 과정과 그 과정에서 부모로서 느낀 감정들, 그리고 아이의 성장을 지켜본 이야기를 공유합니다. 분리불안을 겪는 아이와 부모가 함께 성장한 시간입니다.",
      author: {
        name: "유치원맘",
        image: "/abstract-profile.png",
      },
      category: "교육",
      tags: ["유치원적응", "분리불안", "성장이야기"],
      comments: 16,
      views: 267,
      likes: 39,
      created: "1개월 전",
      thumbnail: "/placeholder-vvk3b.png",
    },
  ]

  const categories = [
    { value: "all", label: "전체" },
    { value: "daily", label: "일상공유" },
    { value: "growth", label: "성장일기" },
    { value: "travel", label: "여행" },
    { value: "education", label: "교육" },
    { value: "dad", label: "아빠육아" },
    { value: "mom", label: "엄마육아" },
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
          <h1 className="text-3xl font-bold mb-2">육아 이야기</h1>
          <p className="text-muted-foreground">부모님들의 다양한 육아 경험담을 공유하는 공간입니다.</p>
        </div>
        <Button asChild>
          <Link href="/community/stories/new">글쓰기</Link>
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
          <Input type="search" placeholder="검색어를 입력하세요" className="w-full pl-8" />
        </div>
        <Select defaultValue="recent">
          <SelectTrigger className="w-full md:w-[150px]">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stories.map((story) => (
          <Card key={story.id} className="overflow-hidden flex flex-col">
            <div className="aspect-video w-full overflow-hidden">
              <img
                src={story.thumbnail || "/placeholder.svg"}
                alt={story.title}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
            </div>
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={story.author.image || "/placeholder.svg"} alt={story.author.name} />
                  <AvatarFallback>{story.author.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{story.author.name}</p>
                  <p className="text-xs text-muted-foreground">{story.created}</p>
                </div>
              </div>
              <Badge variant="outline">{story.category}</Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <Link href={`/community/stories/${story.id}`} className="hover:underline">
                <h3 className="font-bold text-lg mb-2">{story.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{story.content}</p>
              <div className="flex flex-wrap gap-2">
                {story.tags.map((tag, index) => (
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
                  {story.views}
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
                  {story.comments}
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
                  {story.likes}
                </span>
              </div>
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
