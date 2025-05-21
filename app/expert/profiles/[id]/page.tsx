import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ExpertProfilePage({
  params,
}: {
  params: { id: string };
}) {
  // 실제로는 params.id를 사용하여 API에서 데이터를 가져올 것
  const expert = {
    id: 1,
    name: '김수면 박사',
    title: '소아과 전문의',
    specialty: '영유아 수면',
    image: '/caring-doctor.png',
    bio: '서울대학교 의과대학 소아과 교수로, 영유아 수면 문제 전문가입니다. 20년 이상의 임상 경험을 바탕으로 아이들의 건강한 수면 습관 형성을 돕고 있습니다.',
    education: [
      '서울대학교 의과대학 의학박사',
      '서울대학교병원 소아과 전문의',
      '미국 스탠포드 대학교 수면의학 연수',
    ],
    experience: [
      '현) 서울대학교 의과대학 소아과 교수',
      '현) 대한수면의학회 이사',
      '전) 서울대학교병원 소아수면클리닉 책임의사',
      '전) 미국 스탠포드 수면의학센터 연구원',
    ],
    publications: [
      '「아이의 수면이 미래를 결정한다」 (2023)',
      '「영유아 수면 장애의 이해와 치료」 (2021)',
      '「건강한 수면 습관 만들기」 (2019)',
    ],
    articles: [
      {
        id: 1,
        title: '영유아기 수면 습관 형성의 중요성',
        excerpt:
          '생후 6개월부터 3세까지는 수면 습관이 형성되는 중요한 시기입니다. 이 시기에 올바른 수면 습관을 길러주는 방법과 수면 환경 조성에 대해 알아봅니다.',
        readTime: '5분',
        published: '2025.05.10',
        views: 1245,
      },
      {
        id: 7,
        title: '아이의 수면 문제, 연령별 해결 방법',
        excerpt:
          '신생아부터 학령기 아이까지 연령별로 달라지는 수면 문제와 그에 맞는 해결 방법을 알아봅니다. 각 발달 단계에 맞는 효과적인 대처법을 제시합니다.',
        readTime: '6분',
        published: '2025.04.15',
        views: 982,
      },
      {
        id: 8,
        title: '낮잠의 중요성과 효과적인 낮잠 습관 만들기',
        excerpt:
          '적절한 낮잠은 아이의 발달과 밤 수면의 질에 중요한 영향을 미칩니다. 연령별 적정 낮잠 시간과 효과적인 낮잠 습관을 만드는 방법을 알아봅니다.',
        readTime: '4분',
        published: '2025.03.22',
        views: 876,
      },
    ],
    upcomingLives: [
      {
        id: 1,
        title: '영유아 수면 문제 해결하기',
        date: '2025년 5월 20일',
        time: '오후 8:00',
        participants: 128,
      },
    ],
    consultationFee: '30분 50,000원',
    availableTime: '월, 수, 금 오후 2시-6시',
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
          <Link href="/expert/profiles" className="hover:text-primary">
            전문가 프로필
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
          <span>{expert.name}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-32 w-32 mb-4">
                  <AvatarImage
                    src={expert.image || '/placeholder.svg'}
                    alt={expert.name}
                  />
                  <AvatarFallback>{expert.name.slice(0, 2)}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold">{expert.name}</h1>
                <p className="text-muted-foreground mb-2">{expert.title}</p>
                <Badge className="mb-4">{expert.specialty}</Badge>
                <p className="text-sm text-muted-foreground">{expert.bio}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-2">
              <Button className="w-full" asChild>
                <Link href={`/expert/consultation/${expert.id}`}>
                  상담 예약하기
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/expert/ai">AI 상담 바로가기</Link>
              </Button>
            </CardFooter>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>상담 정보</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1">
                <p className="text-sm font-medium">상담 비용</p>
                <p className="text-sm text-muted-foreground">
                  {expert.consultationFee}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium">상담 가능 시간</p>
                <p className="text-sm text-muted-foreground">
                  {expert.availableTime}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-3">
          <Tabs defaultValue="about" className="w-full">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="about">소개</TabsTrigger>
              <TabsTrigger value="articles">전문가 조언</TabsTrigger>
              <TabsTrigger value="lives">라이브 세션</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>학력 및 경력</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="font-medium">학력</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {expert.education.map((edu, index) => (
                        <li key={index}>{edu}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">경력</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {expert.experience.map((exp, index) => (
                        <li key={index}>{exp}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-medium">저서</h3>
                    <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                      {expert.publications.map((pub, index) => (
                        <li key={index}>{pub}</li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="articles" className="mt-6">
              <div className="space-y-6">
                {expert.articles.map((article) => (
                  <Card key={article.id}>
                    <CardHeader>
                      <Link
                        href={`/expert/advice/${article.id}`}
                        className="hover:underline"
                      >
                        <CardTitle className="text-lg">
                          {article.title}
                        </CardTitle>
                      </Link>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {article.excerpt}
                      </p>
                    </CardContent>
                    <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                      <div className="flex space-x-4 text-xs text-muted-foreground">
                        <span>읽는 시간: {article.readTime}</span>
                        <span>발행일: {article.published}</span>
                        <span>조회수: {article.views}</span>
                      </div>
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/expert/advice/${article.id}`}>
                          자세히 보기
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
            <TabsContent value="lives" className="mt-6">
              {expert.upcomingLives.length > 0 ? (
                <div className="space-y-6">
                  {expert.upcomingLives.map((live) => (
                    <Card key={live.id}>
                      <CardHeader>
                        <CardTitle>{live.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex justify-between text-sm mb-2">
                          <span>일시</span>
                          <span>
                            {live.date} {live.time}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>참여 예정</span>
                          <span>{live.participants}명</span>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full" asChild>
                          <Link href={`/expert/live/${live.id}`}>
                            알림 신청하기
                          </Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="py-8 text-center">
                    <p className="text-muted-foreground mb-4">
                      현재 예정된 라이브 세션이 없습니다.
                    </p>
                    <Button variant="outline" asChild>
                      <Link href="/expert/live">
                        다른 전문가의 라이브 세션 보기
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
