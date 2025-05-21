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
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';

export default function ExpertProfilesPage() {
  const experts = [
    {
      id: 1,
      name: '김수면 박사',
      title: '소아과 전문의',
      specialty: '영유아 수면',
      image: '/caring-doctor.png',
      bio: '서울대학교 의과대학 소아과 교수로, 영유아 수면 문제 전문가입니다. 20년 이상의 임상 경험을 바탕으로 아이들의 건강한 수면 습관 형성을 돕고 있습니다.',
      articles: 12,
      consultations: 324,
      rating: 4.9,
    },
    {
      id: 2,
      name: '이감정 교수',
      title: '아동심리학자',
      specialty: '정서 발달',
      image: '/psychologist.png',
      bio: '연세대학교 아동심리학과 교수로, 아동 정서 발달 및 부모-자녀 관계 전문가입니다. 감정 코칭과 긍정 훈육에 관한 다수의 저서를 출간했습니다.',
      articles: 18,
      consultations: 256,
      rating: 4.8,
    },
    {
      id: 3,
      name: '박놀이 선생님',
      title: '아동발달 전문가',
      specialty: '놀이 교육',
      image: '/diverse-classroom-teacher.png',
      bio: '20년 경력의 몬테소리 교육 전문가로, 연령별 발달에 적합한 놀이 활동을 연구하고 있습니다. 놀이를 통한 아동 발달 촉진 방법을 부모님들에게 알려드립니다.',
      articles: 15,
      consultations: 198,
      rating: 4.7,
    },
    {
      id: 4,
      name: '최영양 영양사',
      title: '아동영양 전문가',
      specialty: '영유아 식이',
      image: '/abstract-profile.png',
      bio: '영유아 영양 및 식습관 형성 전문가로, 이유식부터 유아식까지 건강한 식습관을 형성하는 방법을 연구합니다. 까다로운 식성과 편식 문제 해결에 특화되어 있습니다.',
      articles: 10,
      consultations: 176,
      rating: 4.8,
    },
    {
      id: 5,
      name: '정가족 상담사',
      title: '가족관계 전문가',
      specialty: '형제 관계',
      image: '/abstract-profile.png',
      bio: '가족 시스템과 형제 관계 전문가로, 건강한 가족 관계 형성과 형제간 갈등 해결 방법을 연구합니다. 부모 교육 프로그램을 다수 개발했습니다.',
      articles: 8,
      consultations: 145,
      rating: 4.6,
    },
    {
      id: 6,
      name: '한발달 교수',
      title: '발달심리학자',
      specialty: '인지 발달',
      image: '/abstract-profile.png',
      bio: '아동의 인지 발달과 학습 과정을 연구하는 발달심리학자입니다. 연령별 인지 발달 특성과 이를 촉진하는 환경 조성 방법에 대한 전문가입니다.',
      articles: 14,
      consultations: 167,
      rating: 4.7,
    },
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'pediatrics', label: '소아과' },
    { value: 'psychology', label: '심리학' },
    { value: 'development', label: '발달' },
    { value: 'nutrition', label: '영양' },
    { value: 'education', label: '교육' },
    { value: 'family', label: '가족관계' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">전문가 프로필</h1>
          <p className="text-muted-foreground">
            다양한 분야의 육아 전문가들을 만나보세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/expert/ai">AI 상담 바로가기</Link>
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

      <div className="mb-8">
        <div className="relative">
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
          <Input
            type="search"
            placeholder="전문가 검색하기"
            className="w-full pl-8"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <Card key={expert.id} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage
                  src={expert.image || '/placeholder.svg'}
                  alt={expert.name}
                />
                <AvatarFallback>{expert.name.slice(0, 2)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle>{expert.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{expert.title}</p>
                <Badge variant="outline" className="mt-1">
                  {expert.specialty}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                {expert.bio}
              </p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-muted rounded-md p-2">
                  <p className="text-lg font-bold">{expert.articles}</p>
                  <p className="text-xs text-muted-foreground">조언</p>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <p className="text-lg font-bold">{expert.consultations}</p>
                  <p className="text-xs text-muted-foreground">상담</p>
                </div>
                <div className="bg-muted rounded-md p-2">
                  <p className="text-lg font-bold">{expert.rating}</p>
                  <p className="text-xs text-muted-foreground">평점</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href={`/expert/profiles/${expert.id}`}>
                    프로필 보기
                  </Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href={`/expert/consultation/${expert.id}`}>
                    상담 예약
                  </Link>
                </Button>
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
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8"
            aria-current="page"
          >
            1
          </Button>
          <Button variant="outline" size="sm" className="h-8 w-8">
            2
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
  );
}
