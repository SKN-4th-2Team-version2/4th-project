import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function ExpertAdvicePage() {
  // 전문가 조언 목록 데이터 (실제로는 API에서 가져올 것)
  const adviceArticles = [
    {
      id: 1,
      title: '영유아기 수면 습관 형성의 중요성',
      excerpt:
        '생후 6개월부터 3세까지는 수면 습관이 형성되는 중요한 시기입니다. 이 시기에 올바른 수면 습관을 길러주는 방법과 수면 환경 조성에 대해 알아봅니다.',
      expert: {
        name: '김수면 박사',
        title: '소아과 전문의',
        image: '/caring-doctor.png',
      },
      category: '수면',
      readTime: '5분',
      published: '2025.05.10',
      views: 1245,
      likes: 87,
    },
    {
      id: 2,
      title: '아이의 감정 조절 능력을 키우는 대화법',
      excerpt:
        '유아기 감정 조절 능력은 평생 동안 영향을 미치는 중요한 능력입니다. 부모가 일상에서 실천할 수 있는 감정 코칭 대화법을 소개합니다.',
      expert: {
        name: '이감정 교수',
        title: '아동심리학자',
        image: '/psychologist.png',
      },
      category: '심리',
      readTime: '7분',
      published: '2025.05.12',
      views: 982,
      likes: 65,
    },
    {
      id: 3,
      title: '영유아 발달 단계별 적합한 놀이 활동',
      excerpt:
        '아이의 발달 단계에 맞는 놀이는 인지, 정서, 사회성 발달에 큰 영향을 미칩니다. 연령별로 적합한 놀이 활동과 그 효과에 대해 알아봅니다.',
      expert: {
        name: '박놀이 선생님',
        title: '아동발달 전문가',
        image: '/diverse-classroom-teacher.png',
      },
      category: '놀이',
      readTime: '6분',
      published: '2025.05.14',
      views: 876,
      likes: 59,
    },
    {
      id: 4,
      title: '이유식 거부하는 아이, 식습관 개선 전략',
      excerpt:
        '많은 부모님들이 아이의 편식과 이유식 거부로 고민합니다. 아이의 식습관을 건강하게 형성하는 방법과 거부 행동에 대처하는 전략을 알아봅니다.',
      expert: {
        name: '최영양 영양사',
        title: '아동영양 전문가',
        image: '/abstract-profile.png',
      },
      category: '식이',
      readTime: '8분',
      published: '2025.05.08',
      views: 1102,
      likes: 73,
    },
    {
      id: 5,
      title: '형제간 다툼, 효과적인 중재 방법',
      excerpt:
        '형제자매 간의 다툼은 자연스러운 현상이지만, 부모의 적절한 중재가 필요합니다. 형제간 갈등을 건강하게 해결하는 방법을 알아봅니다.',
      expert: {
        name: '정가족 상담사',
        title: '가족관계 전문가',
        image: '/abstract-profile.png',
      },
      category: '관계',
      readTime: '6분',
      published: '2025.05.05',
      views: 945,
      likes: 62,
    },
    {
      id: 6,
      title: '아이의 자존감을 높이는 양육 방법',
      excerpt:
        '건강한 자존감은 아이의 성장과 발달에 중요한 요소입니다. 일상에서 아이의 자존감을 높여주는 구체적인 양육 방법을 알아봅니다.',
      expert: {
        name: '이감정 교수',
        title: '아동심리학자',
        image: '/psychologist.png',
      },
      category: '심리',
      readTime: '7분',
      published: '2025.05.01',
      views: 1056,
      likes: 81,
    },
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'sleep', label: '수면' },
    { value: 'psychology', label: '심리' },
    { value: 'play', label: '놀이' },
    { value: 'nutrition', label: '식이' },
    { value: 'relationship', label: '관계' },
    { value: 'development', label: '발달' },
  ];

  const ageGroups = [
    { value: 'all', label: '전체 연령' },
    { value: 'newborn', label: '신생아 (0-3개월)' },
    { value: 'infant', label: '영아기 (4-12개월)' },
    { value: 'toddler', label: '걸음마기 (1-2세)' },
    { value: 'preschool', label: '유아기 (3-5세)' },
    { value: 'school', label: '학령기 (6세 이상)' },
  ];

  const sortOptions = [
    { value: 'recent', label: '최신순' },
    { value: 'popular', label: '인기순' },
    { value: 'views', label: '조회순' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">전문가 조언</h1>
          <p className="text-muted-foreground">
            검증된 전문가들의 육아 정보와 조언을 확인하세요.
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
          <Input
            type="search"
            placeholder="전문가 조언 검색하기"
            className="w-full pl-8"
          />
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
        {adviceArticles.map((article) => (
          <Card key={article.id} className="flex flex-col h-full">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={article.expert.image || '/placeholder.svg'}
                    alt={article.expert.name}
                  />
                  <AvatarFallback>
                    {article.expert.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{article.expert.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {article.expert.title}
                  </p>
                </div>
              </div>
              <Badge variant="secondary">{article.category}</Badge>
            </CardHeader>
            <CardContent className="flex-1">
              <Link
                href={`/expert/advice/${article.id}`}
                className="hover:underline"
              >
                <h3 className="font-bold text-lg mb-2">{article.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                {article.excerpt}
              </p>
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
                  {article.views}
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
                  {article.likes}
                </span>
                <span>{article.readTime} 소요</span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/expert/advice/${article.id}`}>자세히 보기</Link>
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
          <Button variant="outline" size="sm" className="h-8 w-8">
            3
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
