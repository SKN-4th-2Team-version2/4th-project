'use client';

import { useState, useEffect, useCallback } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useAuth } from '@/hooks/use-auth';
import { toast } from '@/hooks/use-toast';
import CommunityService from '@/services/community-service';
import type { Post, Category, PostsParams, PostsResponse } from '@/types/community';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Eye, 
  MessageCircle, 
  ThumbsUp, 
  PenTool,
  Filter,
  CheckCircle,
  Clock,
  TrendingUp,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function QuestionsPage() {
  const { isAuthenticated } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('recent');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // 게시물 로드 함수
  const loadPosts = useCallback(async (params: PostsParams = {}) => {
    setIsLoading(true);

    try {
      const response = await CommunityService.getPosts({
        postType: 'question',
        page: params.page || 1,
        limit: 10,
        categoryId: params.categoryId !== 'all' ? params.categoryId : undefined,
        search: params.search || undefined,
        ...params
      }) as PostsResponse;

      if (response.success) {
        let newPosts = response.data;
        
        // 클라이언트 사이드 정렬 (서버에서 지원하지 않는 경우)
        if (sortBy === 'popular') {
          newPosts = CommunityService.sortPostsByPopularity(newPosts);
        } else if (sortBy === 'views') {
          newPosts = [...newPosts].sort((a, b) => b.view_count - a.view_count);
        } else if (sortBy === 'replies') {
          newPosts = [...newPosts].sort((a, b) => b.comment_count - a.comment_count);
        }
        
        setPosts(newPosts);
        setTotalPages(response.pagination.total_pages);
        setTotal(response.pagination.count);
      }
    } catch (error) {
      console.error('게시물 로드 실패:', error);
      toast({
        title: '게시물 로드 실패',
        description: '게시물을 불러오는데 실패했습니다.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  }, [sortBy]);

  // 카테고리 로드
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await CommunityService.getCategories({ postType: 'question' });
        if (response.success) {
          setCategories([
            { id: 'all', name: '전체', description: '', postType: 'question', color: '', icon: '', order: 0, isActive: true },
            ...response.data
          ]);
        }
      } catch (error) {
        console.error('카테고리 로드 실패:', error);
      }
    };

    loadCategories();
  }, []);

  // 게시물 로드
  useEffect(() => {
    const params: PostsParams = {
      page: currentPage,
      categoryId: selectedCategory,
      search: searchQuery || undefined,
    };

    loadPosts(params);
  }, [selectedCategory, searchQuery, sortBy, currentPage, loadPosts]);

  // 검색 핸들러
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // 상대 시간 계산
  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return date.toLocaleDateString();
  };

  // 사용자 이름 첫 글자
  const getUserInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  // 페이지네이션 컴포넌트
  const Pagination = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        
        {pageNumbers.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => handlePageChange(page)}
            className="w-8 h-8"
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    );
  };

  if (isLoading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">질문 게시판</h1>
          <p className="text-muted-foreground">
            다른 부모님들에게 질문하고 경험을 나누세요. (총 {total}개)
          </p>
        </div>
        {isAuthenticated && (
          <Button asChild>
            <Link href="/community/questions/new">
              <PenTool className="mr-2 h-4 w-4" />
              질문하기
            </Link>
          </Button>
        )}
      </div>

      {/* 카테고리 탭 */}
      <div className="mb-6">
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
          <TabsList className="w-full max-w-full overflow-auto">
            {categories.map((category) => (
              <TabsTrigger key={category.id} value={category.id}>
                {category.name}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      {/* 검색 및 필터 */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <form onSubmit={handleSearch} className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="질문 검색하기..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </form>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="정렬 기준" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  최신순
                </div>
              </SelectItem>
              <SelectItem value="popular">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  인기순
                </div>
              </SelectItem>
              <SelectItem value="views">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  조회순
                </div>
              </SelectItem>
              <SelectItem value="replies">
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  답변 많은 순
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 게시물 목록 */}
      <div className="space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={post.user.profile_image}
                      alt={post.user.name}
                    />
                    <AvatarFallback>
                      {getUserInitial(post.user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">
                      {post.is_anonymous ? '익명' : post.user.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {getRelativeTime(post.created_at)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{post.category.name}</Badge>
                  {post.is_solved && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      해결됨
                    </Badge>
                  )}
                  {post.is_pinned && (
                    <Badge variant="secondary">📌 고정</Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <Link
                  href={`/community/questions/${post.id}`}
                  className="hover:underline"
                >
                  <h3 className="font-bold text-lg mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.content}
                </p>
              </CardContent>
              
              <CardFooter className="flex justify-between border-t bg-muted/50 px-6 py-3">
                <div className="flex space-x-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    {post.view_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    {post.comment_count}
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {post.like_count}
                  </span>
                </div>
                <Button variant="ghost" size="sm" asChild>
                  <Link href={`/community/questions/${post.id}`}>
                    자세히 보기
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">
              {searchQuery ? '검색 결과가 없습니다' : '아직 질문이 없습니다'}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery 
                ? '다른 검색어로 시도해보세요.' 
                : '첫 번째 질문을 올려보세요!'
              }
            </p>
            {isAuthenticated && !searchQuery && (
              <Button asChild>
                <Link href="/community/questions/new">질문하기</Link>
              </Button>
            )}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination />
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isLoading && posts.length > 0 && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-background p-4 rounded-lg shadow-lg">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span>로딩 중...</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
