'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatDistanceToNow } from 'date-fns';
import { ko } from 'date-fns/locale';
import { 
  chatHistoryApi, 
  type ChatHistory, 
  type ChatHistoryListResponse 
} from '@/services/chat-history-api';
import { 
  Clock, 
  MessageSquare, 
  Trash2, 
  Eye, 
  Play,
  RefreshCw,
  AlertCircle,
  Filter
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

type CategoryFilter = 'all' | 'general' | 'specialized';

export default function ChatHistoryPage() {
  const router = useRouter();
  const [histories, setHistories] = useState<ChatHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());

  const limit = 12;

  // 카테고리 한글 이름 매핑
  const categoryNames: Record<string, string> = {
    all: '전체',
    general: '일반 AI 상담',
    specialized: '전문 AI 상담',
    development: '발달',
    sleep: '수면',
    nutrition: '영양',
    behavior: '행동',
    psychology: '심리',
    education: '교육',
  };

  // 히스토리 목록 로드
  const loadHistories = async (pageNum: number = 1, category?: CategoryFilter, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const response = await chatHistoryApi.getChatHistories(
        pageNum,
        limit,
        category === 'all' ? undefined : category
      );

      if (!response.success) {
        setError(response.error || '히스토리를 불러오는데 실패했습니다.');
        return;
      }

      const data = response.data!;
      
      if (append) {
        setHistories(prev => [...prev, ...data.histories]);
      } else {
        setHistories(data.histories);
      }
      
      setTotal(data.total);
      setPage(pageNum);
      setHasMore(data.histories.length === limit);
      
    } catch (err) {
      console.error('히스토리 로드 실패:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadHistories(1, categoryFilter);
  }, [categoryFilter]);

  // 카테고리 필터 변경
  const handleCategoryChange = (category: CategoryFilter) => {
    setCategoryFilter(category);
    setPage(1);
    setHistories([]);
  };

  // 더 많은 히스토리 로드
  const loadMore = () => {
    if (hasMore && !loading) {
      loadHistories(page + 1, categoryFilter, true);
    }
  };

  // 새로고침
  const refresh = () => {
    setPage(1);
    setHistories([]);
    loadHistories(1, categoryFilter);
  };

  // 히스토리 삭제
  const handleDelete = async (id: string) => {
    if (!confirm('이 상담 내역을 삭제하시겠습니까?')) {
      return;
    }

    setDeletingIds(prev => new Set(prev).add(id));

    try {
      const response = await chatHistoryApi.deleteChatHistory(id);
      
      if (response.success) {
        setHistories(prev => prev.filter(h => h.id !== id));
        setTotal(prev => prev - 1);
        toast({
          title: '삭제 완료',
          description: '상담 내역이 삭제되었습니다.',
        });
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('삭제 실패:', err);
      toast({
        title: '삭제 실패',
        description: err instanceof Error ? err.message : '삭제 중 오류가 발생했습니다.',
        variant: 'destructive',
      });
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }
  };

  // 이어서 상담하기
  const handleContinueChat = async (historyId: string, category: 'general' | 'specialized') => {
    try {
      toast({
        title: '세션 복원 중...',
        description: '이전 상담 내용을 불러오고 있습니다.',
      });

      const response = await chatHistoryApi.restoreSession(historyId);
      
      if (response.success) {
        // 상담 페이지로 이동하면서 세션 정보 전달
        const params = new URLSearchParams({
          continue: historyId,
          category: category,
          sessionId: response.data!.sessionId,
        });
        
        router.push(`/expert?${params.toString()}`);
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      console.error('세션 복원 실패:', err);
      toast({
        title: '세션 복원 실패',
        description: err instanceof Error ? err.message : '이어서 상담하기에 실패했습니다.',
        variant: 'destructive',
      });
    }
  };

  // 카테고리별 배지 색상
  const getCategoryBadgeVariant = (category: string) => {
    switch (category) {
      case 'specialized':
        return 'secondary';
      case 'general':
        return 'default';
      default:
        return 'outline';
    }
  };

  // 로딩 스켈레톤
  const LoadingSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="flex flex-col">
          <CardHeader>
            <div className="flex justify-between items-start">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent className="flex-1">
            <Skeleton className="h-16 w-full" />
          </CardContent>
          <CardFooter className="flex justify-between border-t pt-4">
            <Skeleton className="h-8 w-20" />
            <Skeleton className="h-8 w-24" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 헤더 */}
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">상담 히스토리</h1>
            <p className="text-muted-foreground">
              이전에 진행한 AI 상담 내용을 확인하고 이어서 상담할 수 있습니다.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            새로고침
          </Button>
        </div>
      </div>

      {/* 필터 및 통계 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={categoryFilter} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="general">일반 AI 상담</SelectItem>
                <SelectItem value="specialized">전문 AI 상담</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {!loading && (
            <span className="text-sm text-muted-foreground">
              총 {total}개의 상담 내역
            </span>
          )}
        </div>
        
        <Button asChild>
          <Link href="/expert">새 상담 시작하기</Link>
        </Button>
      </div>

      {/* 에러 표시 */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error}
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refresh}
              className="ml-2 h-6"
            >
              다시 시도
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* 콘텐츠 */}
      {loading && histories.length === 0 ? (
        <LoadingSkeleton />
      ) : histories.length === 0 && !loading ? (
        <Card className="text-center py-12">
          <CardContent>
            <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">
              {categoryFilter === 'all' 
                ? '아직 저장된 상담 내역이 없습니다.'
                : `${categoryNames[categoryFilter]} 상담 내역이 없습니다.`
              }
            </p>
            <Button asChild>
              <Link href="/expert">새 상담 시작하기</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {histories.map((history) => (
              <Card key={history.id} className="flex flex-col hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start gap-2">
                    <CardTitle className="text-lg line-clamp-2 leading-tight">
                      {history.title}
                    </CardTitle>
                    <Badge variant={getCategoryBadgeVariant(history.category)}>
                      {categoryNames[history.category] || history.category}
                      {history.category === 'specialized' && ' ✨'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDistanceToNow(new Date(history.createdAt), {
                        addSuffix: true,
                        locale: ko,
                      })}
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-3 w-3" />
                      {history.messageCount}개 메시지
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {history.lastMessage || history.messages[0]?.content || '상담 내용 없음'}
                  </p>
                  {history.isActive && (
                    <Badge variant="outline" className="mt-2 text-xs">
                      활성 세션
                    </Badge>
                  )}
                </CardContent>
                
                <CardFooter className="flex justify-between border-t pt-4 gap-2">
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/expert/history/${history.id}`}>
                        <Eye className="h-3 w-3 mr-1" />
                        상세보기
                      </Link>
                    </Button>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleContinueChat(history.id, history.category)}
                      disabled={deletingIds.has(history.id)}
                    >
                      <Play className="h-3 w-3 mr-1" />
                      이어서 상담
                    </Button>
                  </div>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(history.id)}
                    disabled={deletingIds.has(history.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    {deletingIds.has(history.id) ? (
                      <RefreshCw className="h-3 w-3 animate-spin" />
                    ) : (
                      <Trash2 className="h-3 w-3" />
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>

          {/* 더 보기 버튼 */}
          {hasMore && (
            <div className="mt-8 text-center">
              <Button
                variant="outline"
                onClick={loadMore}
                disabled={loading}
              >
                {loading ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  '더 보기'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
