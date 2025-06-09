import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ArrowRight, BarChart3, Calendar, Clock } from 'lucide-react';

export default function DevelopmentPage() {
  const ageGroups = [
    { id: 1, name: '0-6개월', description: '신생아 및 초기 영아기' },
    { id: 2, name: '7-12개월', description: '후기 영아기' },
    { id: 3, name: '1-2세', description: '걸음마기' },
    { id: 4, name: '3-4세', description: '유아기' },
    { id: 5, name: '5-6세', description: '학령전기' },
    { id: 6, name: '7세 이상', description: '학령기' },
  ];

  const features = [
    {
      icon: <Calendar className="h-6 w-6 text-primary" />,
      title: '발달 기록',
      description:
        '아이의 성장과 발달 과정을 날짜별로 기록하고 특별한 순간을 사진과 함께 저장할 수 있습니다.',
      href: '/development/record',
    },
    {
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      title: '발달 추적',
      description:
        '아이의 발달 상황을 영역별로 추적하고 시각적으로 확인할 수 있습니다.',
      href: '/development/tracker',
    },
    {
      icon: <Clock className="h-6 w-6 text-primary" />,
      title: '발달 타임라인',
      description:
        '시간 순서대로 아이의 발달 과정을 타임라인으로 확인할 수 있습니다.',
      href: '/development/timeline',
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">발달 모니터링</h1>
        <p className="text-muted-foreground">
          초보 부모님들의 걱정을 덜어주는 아이의 발달 기록 및 추적 서비스입니다.
        </p>
      </div>

      <section className="mb-12">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg p-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              아이의 소중한 발달 과정을 기록하세요
            </h2>
            <p className="text-lg mb-6">
              마파덜의 발달 모니터링 서비스로 아이의 성장 과정을 체계적으로
              ��록하고 추적하여 초보 부모님의 불안과 부담을 덜어드립니다.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/development/record">발달 기록 시작하기</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">연령별 발달 모니터링</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {ageGroups.map((age) => (
            <Card key={age.id} className="text-center">
              <CardHeader className="pb-2">
                <CardTitle>{age.name}</CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-xs text-muted-foreground">
                  {age.description}
                </p>
              </CardContent>
              <div className="p-4 pt-0">
                <Button variant="ghost" className="w-full" size="sm" asChild>
                  <Link href={`/development/record?age=${age.id}`}>
                    기록하기
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">발달 모니터링 기능</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {feature.icon}
                  <CardTitle>{feature.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
              <div className="p-6 pt-0">
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center gap-2"
                  asChild
                >
                  <Link href={feature.href}>
                    바로가기
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="bg-blue-50 dark:bg-blue-950/20 rounded-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">
          내 아이의 발달 기록 시작하기
        </h2>
        <p className="mb-6 max-w-2xl mx-auto">
          아이의 발달 상황을 쉽게 기록하고 추적하여 초보 부모님의 불안과 부담을
          덜어드립니다. 지금 바로 아이의 소중한 순간을 기록해보세요.
        </p>
        <Button size="lg" asChild>
          <Link href="/development/record">발달 기록 시작하기</Link>
        </Button>
      </section>
    </div>
  );
}
