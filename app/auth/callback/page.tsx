'use client'

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import AuthService from '@/services/auth-service';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL에서 파라미터 추출
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const provider = searchParams.get('provider') as 'google' | 'kakao' | 'naver';

        // 에러가 있는 경우
        if (error) {
          throw new Error(decodeURIComponent(error));
        }

        // 필수 파라미터 확인
        if (!code || !provider) {
          throw new Error('인증 정보가 없습니다.');
        }

        // 소셜 로그인 콜백 처리
        const response = await AuthService.handleSocialCallback(provider, code, state || undefined);

        if (response.success) {
          // 토큰 저장 (소셜 로그인은 기본적으로 기억하기로 설정)
          AuthService.saveToken(response.data.token, true);
          
          // 소셜 로그인 제공자 정보 저장
          AuthService.saveProvider(provider);

          toast({
            title: '로그인 성공',
            description: `환영합니다, ${response.data.user.name}님!`,
          });

          // 메인 페이지로 리다이렉트
          router.push('/');
        } else {
          throw new Error('로그인 처리에 실패했습니다.');
        }
      } catch (error) {
        console.error('소셜 로그인 콜백 처리 오류:', error);
        
        toast({
          title: '로그인 실패',
          description: error instanceof Error ? error.message : '소셜 로그인 중 오류가 발생했습니다.',
          variant: 'destructive',
        });

        // 로그인 페이지로 리다이렉트
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [router, searchParams]);

  if (isProcessing) {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">로그인 처리 중...</h2>
            <p className="text-muted-foreground">
              잠시만 기다려주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
