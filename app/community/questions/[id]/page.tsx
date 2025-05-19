import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

export default function QuestionDetailPage({ params }: { params: { id: string } }) {
  // 실제로는 params.id를 사용하여 API에서 데이터를 가져올 것
  const question = {
    id: 1,
    title: "12개월 아기가 아직 걷지 못해요. 걱정해야 할까요?",
    content:
      "우리 아기가 12개월인데 아직 걷지 못하고 있어요. 기어다니는 것은 잘하는데 일어서려고 하지 않아요. 또래 아이들은 대부분 걷기 시작했다고 하는데 걱정해야 할까요?\n\n아기가 잡고 서는 것은 가능하지만 혼자 서려고 하지 않고, 손을 잡아도 걸음을 떼려고 하지 않아요. 발달 지연이 있는 건지 걱정됩니다. 비슷한 경험이 있으신 부모님들 조언 부탁드려요.",
    author: {
      name: "걱정많은엄마",
      image: "/abstract-profile.png",
      level: "열심 부모",
      posts: 15,
    },
    category: "발달",
    tags: ["영아기", "운동발달", "걸음마"],
    replies: 8,
    views: 124,
    likes: 15,
    created: "2023년 5월 14일",
    isBookmarked: false,
  }

  const answers = [
    {
      id: 1,
      content:
        "안녕하세요! 저희 아이도 13개월까지 걷지 않았어요. 기어다니는 것만 열심히 하더니 갑자기 어느 날 일어나서 걷기 시작했답니다. 아이마다 발달 속도가 다르니 너무 걱정하지 마세요. 15개월까지는 정상 범위라고 알고 있어요.",
      author: {
        name: "경험자맘",
        image: "/abstract-profile.png",
        level: "슈퍼 부모",
        posts: 87,
      },
      created: "2023년 5월 14일",
      likes: 23,
      isExpert: false,
      isBestAnswer: true,
    },
    {
      id: 2,
      content:
        "아이들마다 발달 속도는 정말 다양해요. 제 첫째는 10개월에 걸었는데, 둘째는 14개월이 되어서야 걸었어요. 지금은 둘 다 건강하게 잘 뛰어다니고 있답니다. 기어다니는 것을 잘한다면 대근육 발달에는 문제가 없는 것 같으니 조금만 더 기다려보세요.",
      author: {
        name: "두아이맘",
        image: "/abstract-profile.png",
        level: "열심 부모",
        posts: 42,
      },
      created: "2023년 5월 14일",
      likes: 15,
      isExpert: false,
      isBestAnswer: false,
    },
    {
      id: 3,
      content:
        "소아과 의사입니다. 일반적으로 아이들은 9-15개월 사이에 걷기 시작하는데, 이 범위 내에서는 모두 정상 발달로 봅니다. 12개월에 걷지 못한다고 해서 발달 지연이라고 볼 수는 없어요. 중요한 것은 다른 발달 지표들도 함께 살펴보는 것입니다. 기어다니기, 잡고 서기 등을 잘 한다면 큰 걱정은 하지 않으셔도 됩니다. 18개월까지 걷지 못한다면 소아과 의사와 상담해보시는 것이 좋겠습니다.",
      author: {
        name: "김소아과의사",
        image: "/caring-doctor.png",
        level: "전문가",
        posts: 156,
      },
      created: "2023년 5월 15일",
      likes: 42,
      isExpert: true,
      isBestAnswer: false,
    },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/community" className="hover:text-primary">
            커뮤니티
          </Link>
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
            className="h-3 w-3"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <Link href="/community/questions" className="hover:text-primary">
            질문 게시판
          </Link>
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
            className="h-3 w-3"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
          <span>질문 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{question.title}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
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
                className="mr-1"
              >
                <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
              </svg>
              북마크
            </Button>
            <Button variant="outline" size="sm">
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
                className="mr-1"
              >
                <path d="M7 10v12" />
                <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
              </svg>
              추천
            </Button>
          </div>
        </div>
      </div>

      <Card className="mb-8">
        <CardHeader className="flex flex-row items-start justify-between space-y-0">
          <div className="flex items-start space-x-4">
            <Avatar className="h-10 w-10">
              <AvatarImage src={question.author.image || "/placeholder.svg"} alt={question.author.name} />
              <AvatarFallback>{question.author.name.slice(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium">{question.author.name}</p>
                <Badge variant="outline" className="text-xs">
                  {question.author.level}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">작성일: {question.created}</p>
            </div>
          </div>
          <Badge>{question.category}</Badge>
        </CardHeader>
        <CardContent>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {question.content.split("\n\n").map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {question.tags.map((tag, index) => (
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
              조회 {question.views}
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
              답변 {question.replies}
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
              추천 {question.likes}
            </span>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/community/questions/new">질문하기</Link>
          </Button>
        </CardFooter>
      </Card>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">답변 {answers.length}개</h2>
        <div className="space-y-4">
          {answers.map((answer) => (
            <Card key={answer.id} className={answer.isBestAnswer ? "border-primary" : ""}>
              {answer.isBestAnswer && (
                <div className="bg-primary text-primary-foreground px-4 py-1 text-sm font-medium">베스트 답변</div>
              )}
              <CardHeader className="flex flex-row items-start justify-between space-y-0">
                <div className="flex items-start space-x-4">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={answer.author.image || "/placeholder.svg"} alt={answer.author.name} />
                    <AvatarFallback>{answer.author.name.slice(0, 2)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{answer.author.name}</p>
                      {answer.isExpert ? (
                        <Badge className="bg-blue-500 hover:bg-blue-600">{answer.author.level}</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs">
                          {answer.author.level}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">작성일: {answer.created}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <p>{answer.content}</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
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
                    className="mr-1"
                  >
                    <path d="M7 10v12" />
                    <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2h0a3.13 3.13 0 0 1 3 3.88Z" />
                  </svg>
                  추천 {answer.likes}
                </Button>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    신고
                  </Button>
                  <Button variant="ghost" size="sm">
                    답글
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">답변 작성하기</h2>
        <Card>
          <CardContent className="pt-6">
            <Textarea placeholder="답변을 작성해주세요." rows={5} />
          </CardContent>
          <CardFooter className="flex justify-between border-t px-6 py-3">
            <p className="text-xs text-muted-foreground">
              답변 작성 시{" "}
              <Link href="/terms" className="text-primary hover:underline">
                커뮤니티 이용규칙
              </Link>
              을 지켜주세요.
            </p>
            <Button>답변 등록</Button>
          </CardFooter>
        </Card>
      </div>

      <div className="flex justify-between">
        <Button variant="outline" asChild>
          <Link href="/community/questions">목록으로</Link>
        </Button>
        <div className="flex gap-2">
          <Button variant="outline">수정</Button>
          <Button variant="destructive">삭제</Button>
        </div>
      </div>
    </div>
  )
}
