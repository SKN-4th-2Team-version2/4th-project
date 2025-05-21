import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { getChatHistory } from '@/app/actions/chat-history';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DeleteHistoryButton } from '@/components/expert-chat/delete-history-button';

export default async function ChatHistoryDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const history = await getChatHistory(params.id);

  if (!history) {
    notFound();
  }

  // 카테고리 한글 이름 매핑
  const categoryNames: Record<string, string> = {
    all: '전체',
    development: '발달',
    sleep: '수면',
    nutrition: '영양',
    behavior: '행동',
    psychology: '심리',
    education: '교육',
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/expert" className="hover:text-primary">
            전문가 조언
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
          <Link href="/expert/history" className="hover:text-primary">
            상담 히스토리
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
          <span>상담 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">{history.title}</h1>
            <div className="flex items-center gap-2 mt-2">
              <Badge>
                {categoryNames[history.category] || history.category}
              </Badge>
              <p className="text-sm text-muted-foreground">
                {format(new Date(history.createdAt), 'yyyy년 MM월 dd일 HH:mm', {
                  locale: ko,
                })}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/expert/ai?continue=${history.id}`}>
                이어서 상담하기
              </Link>
            </Button>
            <DeleteHistoryButton id={history.id} />
          </div>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {history.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${message.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/caring-doctor.png" alt="전문가 AI" />
                    <AvatarFallback>AI</AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="prose prose-sm dark:prose-invert">
                      {message.content.split('\n').map((paragraph, i) => (
                        <p
                          key={i}
                          className={
                            message.role === 'user'
                              ? 'text-primary-foreground'
                              : ''
                          }
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <div
                      className={`text-xs ${
                        message.role === 'assistant'
                          ? 'text-muted-foreground'
                          : 'text-primary-foreground/80'
                      }`}
                    >
                      {format(new Date(message.createdAt), 'HH:mm', {
                        locale: ko,
                      })}
                    </div>
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="/abstract-profile.png" alt="사용자" />
                    <AvatarFallback>사용자</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t pt-4">
          <Button variant="outline" asChild>
            <Link href="/expert/history">목록으로</Link>
          </Button>
          <Button asChild>
            <Link href="/expert/ai">새 상담 시작하기</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
