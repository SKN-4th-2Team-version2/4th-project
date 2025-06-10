'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  chatHistoryApi, 
  type ChatHistory 
} from '@/services/chat-history-api';
import { 
  ArrowLeft,
  Play,
  Trash2,
  RefreshCw,
  AlertCircle,
  MessageSquare,
  Clock,
  Bot,
  User
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface ChatHistoryDetailPageProps {
  params: { id: string };
}

export default function ChatHistoryDetailPage({ params }: ChatHistoryDetailPageProps) {
  const router = useRouter();
  const [history, setHistory] = useState<ChatHistory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // 카테고리 한글 이름 매핑
  const categoryNames: Record<string, string> = {
    general: '일반 AI 상담',
    specialized: '전문 AI 상담',
    development: '발달',
    sleep: '수면',
    nutrition: '영양',
    behavior: '행동',
    psychology: '심리',
    education: '교육',
  };

  // 히스토리 상세 정보 로드
  const loadHistory = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await chatHistoryApi.getChatHistory(params.id);

      if (!response.success) {
        setError(response.error || '상담 내역을 불러오는데 실패했습니다.');
        return;
      }

      setHistory(response.data!);
    } catch (err) {
      console.error('히스토리 로드 실패:', err);
      setError('네트워크 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 로드
  useEffect(() => {
    loadHistory();
  }, [params.id]);

  // 히스토리 삭제
  const handleDelete = async () => {
    if (!history || !confirm('이 상담 내역을 삭제하시겠습니까?')) {
      return;
    }

    setDeleting(true);

    try {
      const response = await chatHistoryApi.deleteChatHistory(history.id);
      
      if (response.success) {
        toast({
          title: '삭제 완료',
          description: '상담 내역이 삭제되었습니다.',
        });
        router.push('/expert/history');
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
      setDeleting(false);
    }
  };

  // 이어서 상담하기
  const handleContinueChat = async () => {
    if (!history) return;

    try {
      toast({
        title: '세션 복원 중...',
        description: '이전 상담 내용을 불러오고 있습니다.',
      });

      const response = await chatHistoryApi.restoreSession(history.id);
      
      if (response.success) {
        const params = new URLSearchParams({
          continue: history.id,
          category: history.category,
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

  // 로딩 상태
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Skeleton className="h-4 w-64 mb-4" />
          <Skeleton className="h-8 w-96 mb-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-20 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 에러 상태
  if (error || !history) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {error || '상담 내역을 찾을 수 없습니다.'}
            <div className="flex gap-2 mt-3">
              <Button variant="outline" size="sm" onClick={loadHistory}>
                다시 시도
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href="/expert/history">목록으로 돌아가기</Link>
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 브레드크럼 네비게이션 */}
      <div className="mb-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Link href="/expert" className="hover:text-primary flex items-center gap-1">
            <ArrowLeft className="h-3 w-3" />
            전문가 조언
          </Link>
          <span>/</span>
          <Link href="/expert/history" className="hover:text-primary">
            상담 히스토리
          </Link>
          <span>/</span>
          <span>상담 상세</span>
        </div>

        {/* 헤더 */}
        <div className="flex justify-between items-start gap-4 flex-wrap">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold mb-2 break-words">
              {history.title}
            </h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge variant={history.category === 'specialized' ? 'secondary' : 'default'}>
                {categoryNames[history.category] || history.category}
                {history.category === 'specialized' && ' ✨'}
              </Badge>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-3 w-3" />
                {format(new Date(history.createdAt), 'yyyy년 MM월 dd일 HH:mm', {
                  locale: ko,
                })}
              </div>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MessageSquare className="h-3 w-3" />
                {history.messageCount}개 메시지
              </div>
              {history.isActive && (
                <Badge variant="outline" className="text-xs">
                  활성 세션
                </Badge>
              )}
            </div>
          </div>
          
          {/* 액션 버튼 */}
          <div className="flex gap-2 flex-shrink-0">
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleContinueChat}
              disabled={deleting}
            >
              <Play className="h-3 w-3 mr-1" />
              이어서 상담하기
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={deleting}
              className="text-destructive hover:text-destructive"
            >
              {deleting ? (
                <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
              ) : (
                <Trash2 className="h-3 w-3 mr-1" />
              )}
              삭제
            </Button>
          </div>
        </div>
      </div>

      {/* 메시지 내용 */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-6">
            {history.messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.role === 'assistant' ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.role === 'assistant' && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-blue-100 dark:bg-blue-900">
                      <Bot className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </AvatarFallback>
                  </Avatar>
                )}

                <div
                  className={`rounded-lg px-4 py-3 max-w-[80%] ${
                    message.role === 'assistant'
                      ? 'bg-muted text-foreground'
                      : 'bg-primary text-primary-foreground ml-auto'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="text-sm leading-relaxed">
                      {message.content.split('\n').map((paragraph, i) => (
                        <p key={i} className="mb-2 last:mb-0">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    
                    {/* 소스 정보 (있는 경우) */}
                    {message.sources && message.sources.length > 0 && (
                      <div className="pt-2 border-t border-border/50">
                        <p className="text-xs font-medium mb-1 opacity-75">참고 자료:</p>
                        <div className="space-y-1">
                          {message.sources.map((source, sourceIndex) => (
                            <div key={sourceIndex} className="text-xs opacity-75">
                              <span className="font-medium">{source.category}</span>
                              {source.section && (
                                <span className="text-muted-foreground"> - {source.section}</span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div
                      className={`text-xs flex items-center gap-1 ${
                        message.role === 'assistant'
                          ? 'text-muted-foreground'
                          : 'text-primary-foreground/80'
                      }`}
                    >
                      <Clock className="h-3 w-3" />
                      {format(new Date(message.createdAt), 'HH:mm', {
                        locale: ko,
                      })}
                    </div>
                  </div>
                </div>

                {message.role === 'user' && (
                  <Avatar className="h-10 w-10 flex-shrink-0">
                    <AvatarFallback className="bg-green-100 dark:bg-green-900">
                      <User className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t pt-4 gap-4">
          <Button variant="outline" asChild>
            <Link href="/expert/history">
              <ArrowLeft className="h-4 w-4 mr-2" />
              목록으로
            </Link>
          </Button>
          <Button asChild>
            <Link href="/expert">
              새 상담 시작하기
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
