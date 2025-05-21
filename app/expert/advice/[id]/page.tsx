import { CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

export default function AdviceDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // 실제로는 params.id를 사용하여 API에서 데이터를 가져올 것
  const article = {
    id: 1,
    title: '영유아기 수면 습관 형성의 중요성',
    content: `
      <h2>영유아기 수면 습관의 중요성</h2>
      <p>생후 6개월부터 3세까지는 아이의 수면 습관이 형성되는 매우 중요한 시기입니다. 이 시기에 형성된 수면 습관은 아이의 성장과 발달에 큰 영향을 미치며, 이후 성인기까지 지속될 수 있습니다. 건강한 수면 습관은 아이의 신체적, 정신적 발달에 필수적이며, 면역 체계 강화, 정서 조절, 인지 발달에도 중요한 역할을 합니다.</p>
      
      <h2>영유아의 적정 수면 시간</h2>
      <p>연령에 따른 권장 수면 시간은 다음과 같습니다:</p>
      <ul>
        <li>신생아(0-3개월): 14-17시간 (낮잠 포함)</li>
        <li>영아(4-11개월): 12-15시간 (낮잠 포함)</li>
        <li>유아(1-2세): 11-14시간 (낮잠 포함)</li>
        <li>유아(3-5세): 10-13시간 (낮잠 포함)</li>
      </ul>
      <p>물론 아이마다 개인차가 있으므로, 이는 참고 사항으로만 활용하시기 바랍니다.</p>
      
      <h2>건강한 수면 환경 조성하기</h2>
      <p>아이의 건강한 수면을 위해서는 적절한 수면 환경을 조성하는 것이 중요합니다:</p>
      <ul>
        <li><strong>일관된 취침 시간:</strong> 매일 같은 시간에 잠자리에 들도록 하는 것이 중요합니다. 이는 아이의 생체 시계를 안정화시키는 데 도움이 됩니다.</li>
        <li><strong>취침 전 루틴 만들기:</strong> 목욕, 책 읽기, 자장가 등 취침 전 일관된 루틴은 아이에게 잠자리에 들 시간이라는 신호를 줍니다.</li>
        <li><strong>편안한 수면 환경:</strong> 조용하고 어두우며 적절한 온도(18-21°C)를 유지하는 환경이 좋습니다.</li>
        <li><strong>안전한 수면 공간:</strong> 아기의 경우 단단한 매트리스와 최소한의 침구류만 사용하여 안전한 수면 환경을 조성해야 합니다.</li>
      </ul>
      
      <h2>흔한 수면 문제와 해결 방법</h2>
      <p>영유아기에 흔히 발생하는 수면 문제와 그 해결 방법에 대해 알아보겠습니다:</p>
      
      <h3>1. 잠들기 어려움</h3>
      <p>많은 아이들이 잠자리에 들기를 거부하거나 잠들기 어려워합니다. 이럴 때는:</p>
      <ul>
        <li>취침 시간 30분-1시간 전부터 차분한 활동으로 전환하세요.</li>
        <li>스크린 타임(TV, 태블릿 등)은 취침 최소 1시간 전에 중단하세요.</li>
        <li>일관된 취침 루틴을 만들고 지키세요.</li>
      </ul>
      
      <h3>2. 야간 각성</h3>
      <p>밤중에 자주 깨는 아이의 경우:</p>
      <ul>
        <li>자기 전에 충분히 배를 채우도록 하세요.</li>
        <li>아이가 스스로 다시 잠들 수 있는 능력을 기르도록 도와주세요.</li>
        <li>밤중에 깼을 때 최소한의 자극으로 대응하세요.</li>
      </ul>
      
      <h3>3. 악몽과 야경증</h3>
      <p>악몽이나 야경증을 경험하는 아이의 경우:</p>
      <ul>
        <li>안심시키고 안전함을 느끼게 해주세요.</li>
        <li>취침 전 무서운 내용의 이야기나 미디어 노출을 피하세요.</li>
        <li>야경증의 경우 대부분 아이가 기억하지 못하므로, 안전하게 보호하고 과도한 개입은 피하세요.</li>
      </ul>
      
      <h2>전문가의 도움이 필요한 경우</h2>
      <p>다음과 같은 경우에는 소아과 의사나 수면 전문가의 도움을 받는 것이 좋습니다:</p>
      <ul>
        <li>코골이, 수면 무호흡, 불규칙한 호흡 등의 증상이 있는 경우</li>
        <li>지속적인 수면 문제로 아이의 일상생활이나 발달에 영향을 미치는 경우</li>
        <li>극심한 불안이나 공포로 인한 수면 장애가 있는 경우</li>
      </ul>
      
      <h2>결론</h2>
      <p>건강한 수면 습관은 아이의 전반적인 발달과 웰빙에 중요한 역할을 합니다. 일관된 수면 루틴, 적절한 수면 환경, 그리고 부모의 인내와 지원을 통해 아이가 건강한 수면 습관을 형성할 수 있도록 도와주세요. 모든 아이는 다르므로, 자녀에게 가장 적합한 방법을 찾는 과정이 필요할 수 있습니다. 지속적인 수면 문제가 있다면 전문가의 도움을 받는 것을 주저하지 마세요.</p>
    `,
    expert: {
      name: '김수면 박사',
      title: '소아과 전문의',
      image: '/caring-doctor.png',
      bio: '서울대학교 의과대학 소아과 교수로, 영유아 수면 문제 전문가입니다. 20년 이상의 임상 경험을 바탕으로 아이들의 건강한 수면 습관 형성을 돕고 있습니다.',
    },
    category: '수면',
    tags: ['수면습관', '영유아', '수면환경', '수면문제'],
    readTime: '5분',
    published: '2025년 5월 10일',
    views: 1245,
    likes: 87,
    isLiked: false,
    isBookmarked: false,
    relatedArticles: [
      {
        id: 7,
        title: '아이의 수면 문제, 연령별 해결 방법',
        expert: '김수면 박사',
      },
      {
        id: 8,
        title: '낮잠의 중요성과 효과적인 낮잠 습관 만들기',
        expert: '김수면 박사',
      },
      {
        id: 9,
        title: '수면과 두뇌 발달의 관계',
        expert: '이감정 교수',
      },
    ],
  };

  // HTML 문자열을 안전하게 렌더링하기 위한 함수
  function createMarkup(html: string) {
    return { __html: html };
  }

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
          <Link href="/expert/advice" className="hover:text-primary">
            전문가 칼럼
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
          <span>칼럼 상세</span>
        </div>

        <div className="flex justify-between items-start gap-4 flex-wrap">
          <h1 className="text-2xl md:text-3xl font-bold">{article.title}</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="flex items-start space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage
                    src={article.expert.image || '/placeholder.svg'}
                    alt={article.expert.name}
                  />
                  <AvatarFallback>
                    {article.expert.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-base font-medium">
                      {article.expert.name}
                    </p>
                    <Badge variant="outline" className="text-xs">
                      {article.expert.title}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    발행일: {article.published}
                  </p>
                  <div className="flex space-x-4 text-xs text-muted-foreground mt-1">
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
                      조회 {article.views}
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
                      추천 {article.likes}
                    </span>
                    <span>읽는 시간: {article.readTime}</span>
                  </div>
                </div>
              </div>
              <Badge>{article.category}</Badge>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm md:prose-base dark:prose-invert max-w-none">
                <div dangerouslySetInnerHTML={createMarkup(article.content)} />
              </div>
              <div className="flex flex-wrap gap-2 mt-6">
                {article.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
              <Button variant="outline" asChild>
                <Link href="/expert/advice">목록으로</Link>
              </Button>
              <div className="flex gap-2">
                <Button variant="outline">
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
                  추천하기
                </Button>
                <Button variant="outline">
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
                    <path d="M19 21l-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z" />
                  </svg>
                  북마크
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>전문가 소개</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage
                    src={article.expert.image || '/placeholder.svg'}
                    alt={article.expert.name}
                  />
                  <AvatarFallback>
                    {article.expert.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="font-bold text-lg">{article.expert.name}</h3>
                <Badge variant="outline" className="mb-2">
                  {article.expert.title}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {article.expert.bio}
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <Link href={`/expert/profiles/${article.expert.name}`}>
                  전문가 프로필 보기
                </Link>
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>관련 조언</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {article.relatedArticles.map((related, index) => (
                <div key={index}>
                  {index > 0 && <Separator className="my-2" />}
                  <div className="space-y-1">
                    <Link
                      href={`/expert/advice/${related.id}`}
                      className="text-sm font-medium hover:underline"
                    >
                      {related.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {related.expert}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>AI에게 질문하기</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                이 주제에 대해 더 궁금한 점이 있으신가요? 전문가 AI에게
                질문해보세요.
              </p>
              <Button className="w-full" asChild>
                <Link href="/expert/ai">AI 상담 바로가기</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
