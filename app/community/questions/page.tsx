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

export default function QuestionsPage() {
  // 질문 목록 데이터 (실제로는 API에서 가져올 것)
  const questions = [
    {
      id: 1,
      title: '12개월 아기가 아직 걷지 못해요. 걱정해야 할까요?',
      content:
        '우리 아기가 12개월인데 아직 걷지 못하고 있어요. 기어다니는 것은 잘하는데 일어서려고 하지 않아요. 또래 아이들은 대부분 걷기 시작했다고 하는데 걱정해야 할까요?',
      author: {
        name: '걱정많은엄마',
        image: '/abstract-profile.png',
      },
      category: '발달',
      tags: ['영아기', '운동발달', '걸음마'],
      replies: 8,
      views: 124,
      likes: 15,
      created: '2일 전',
    },
    {
      id: 2,
      title: '이유식 거부하는 10개월 아기, 어떻게 해야 할까요?',
      content:
        '10개월 된 아기가 갑자기 이유식을 거부하기 시작했어요. 전에는 잘 먹었는데 이제는 입을 꼭 다물고 고개를 돌려버려요. 어떻게 하면 다시 이유식을 먹게 할 수 있을까요?',
      author: {
        name: '초보맘',
        image: '/abstract-profile.png',
      },
      category: '식이',
      tags: ['영아기', '이유식', '식습관'],
      replies: 12,
      views: 187,
      likes: 23,
      created: '1일 전',
    },
    {
      id: 3,
      title: '아이가 유치원에서 친구를 때려요. 어떻게 대화해야 할까요?',
      content:
        '4살 아이가 유치원에서 친구를 자주 때린다는 선생님의 연락을 받았어요. 집에서는 그런 모습을 보이지 않아서 당황스럽네요. 아이와 어떻게 대화해야 할까요?',
      author: {
        name: '고민하는아빠',
        image: '/abstract-profile.png',
      },
      category: '행동',
      tags: ['유아기', '사회성', '문제행동'],
      replies: 15,
      views: 203,
      likes: 31,
      created: '3일 전',
    },
    {
      id: 4,
      title: '밤에 자주 깨는 2살 아이, 수면 훈련이 필요할까요?',
      content:
        '2살 아이가 밤에 2-3번씩 깨서 울어요. 다시 재우는 데 30분 이상 걸릴 때도 있고, 저희 부부가 너무 지쳐가고 있어요. 수면 훈련을 시도해볼지 고민 중인데 경험 있으신 분들 조언 부탁드려요.',
      author: {
        name: '잠못자는맘',
        image: '/abstract-profile.png',
      },
      category: '수면',
      tags: ['유아기', '수면문제', '수면훈련'],
      replies: 20,
      views: 245,
      likes: 42,
      created: '4일 전',
    },
    {
      id: 5,
      title: '5세 아이 언어발달 지연, 어떤 치료가 좋을까요?',
      content:
        '5세 아들이 또래보다 언어발달이 느린 것 같아요. 간단한 문장은 말하지만 복잡한 대화는 어려워하고 발음도 부정확해요. 언어치료를 고민 중인데, 어떤 방법이 효과적일까요?',
      author: {
        name: '언어발달맘',
        image: '/abstract-profile.png',
      },
      category: '발달',
      tags: ['학령전기', '언어발달', '치료'],
      replies: 7,
      views: 112,
      likes: 18,
      created: '5일 전',
    },
    {
      id: 6,
      title: '초등학교 입학 준비, 무엇부터 시작해야 할까요?',
      content:
        '내년에 아이가 초등학교에 입학해요. 학습적인 준비보다 생활 습관이나 사회성 등 어떤 부분을 미리 준비시켜야 할지 막막합니다. 선배 부모님들의 조언 부탁드려요.',
      author: {
        name: '예비초등맘',
        image: '/abstract-profile.png',
      },
      category: '교육',
      tags: ['학령기', '초등준비', '사회성'],
      replies: 14,
      views: 198,
      likes: 37,
      created: '6일 전',
    },
  ];

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'development', label: '발달' },
    { value: 'nutrition', label: '식이' },
    { value: 'sleep', label: '수면' },
    { value: 'behavior', label: '행동' },
    { value: 'education', label: '교육' },
    { value: 'health', label: '건강' },
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
    { value: 'replies', label: '답변 많은 순' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">질문 게시판</h1>
          <p className="text-muted-foreground">
            다른 부모님들에게 질문하고 경험을 나누세요.
          </p>
        </div>
        <Button asChild>
          <Link href="/community/questions/new">질문하기</Link>
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
            placeholder="질문 검색하기"
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

      <div className="space-y-4">
        {questions.map((question) => (
          <Card key={question.id} className="overflow-hidden">
            <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage
                    src={question.author.image || '/placeholder.svg'}
                    alt={question.author.name}
                  />
                  <AvatarFallback>
                    {question.author.name.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">{question.author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {question.created}
                  </p>
                </div>
              </div>
              <Badge variant="outline">{question.category}</Badge>
            </CardHeader>
            <CardContent>
              <Link
                href={`/community/questions/${question.id}`}
                className="hover:underline"
              >
                <h3 className="font-bold text-lg mb-2">{question.title}</h3>
              </Link>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {question.content}
              </p>
              <div className="flex flex-wrap gap-2">
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
                  {question.views}
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
                  {question.replies}
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
                  {question.likes}
                </span>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/community/questions/${question.id}`}>
                  자세히 보기
                </Link>
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
  );
}
