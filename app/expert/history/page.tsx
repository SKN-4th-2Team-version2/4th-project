import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { getChatHistories } from "@/app/actions/chat-history"
import { formatDistanceToNow } from "date-fns"
import { ko } from "date-fns/locale"

export default async function ChatHistoryPage() {
  const histories = await getChatHistories()

  // 카테고리 한글 이름 매핑
  const categoryNames: Record<string, string> = {
    all: "전체",
    development: "발달",
    sleep: "수면",
    nutrition: "영양",
    behavior: "행동",
    psychology: "심리",
    education: "교육",
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">상담 히스토리</h1>
        <p className="text-muted-foreground">이전에 진행한 AI 상담 내용을 확인할 수 있습니다.</p>
      </div>

      {histories.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground mb-4">아직 저장된 상담 내역이 없습니다.</p>
            <Button asChild>
              <Link href="/expert">새 상담 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {histories.map((history) => (
            <Card key={history.id} className="flex flex-col">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg line-clamp-1">{history.title}</CardTitle>
                  <Badge>{categoryNames[history.category] || history.category}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(history.createdAt), { addSuffix: true, locale: ko })}
                </p>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {history.messages[0]?.content || "상담 내용 없음"}
                </p>
              </CardContent>
              <CardFooter className="flex justify-between border-t pt-4">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/expert/history/${history.id}`}>상세 보기</Link>
                </Button>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/expert/ai?continue=${history.id}`}>이어서 상담하기</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button asChild>
          <Link href="/expert">새 상담 시작하기</Link>
        </Button>
      </div>
    </div>
  )
}
