import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Link from 'next/link';
import { FeaturedQuestions } from '@/components/featured-questions';

export default function CommunityPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">부모 커뮤니티</h1>
          <p className="text-muted-foreground">
            초보 엄마 아빠들이 서로의 경험과 지식을 나누며 함께 성장하는
            공간입니다.
          </p>
        </div>
        <Button asChild>
          <Link href="/community/questions/new">질문하기</Link>
        </Button>
      </div>

      <Tabs defaultValue="questions" className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex">
          <TabsTrigger value="questions">질문 게시판</TabsTrigger>
          <TabsTrigger value="stories">육아 이야기</TabsTrigger>
          <TabsTrigger value="tips">육아 팁</TabsTrigger>
        </TabsList>
        <TabsContent value="questions" className="mt-6">
          <FeaturedQuestions />
        </TabsContent>
        <TabsContent value="stories" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">육아 이야기 게시판</h3>
            <p className="text-muted-foreground mb-4">
              부모님들의 다양한 육아 경험담을 공유하는 공간입니다.
            </p>
            <Button asChild>
              <Link href="/community/stories">이야기 보러가기</Link>
            </Button>
          </div>
        </TabsContent>
        <TabsContent value="tips" className="mt-6">
          <div className="text-center py-12">
            <h3 className="text-xl font-medium mb-2">육아 팁 게시판</h3>
            <p className="text-muted-foreground mb-4">
              유용한 육아 팁과 노하우를 공유하는 공간입니다.
            </p>
            <Button asChild>
              <Link href="/community/tips">팁 보러가기</Link>
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
