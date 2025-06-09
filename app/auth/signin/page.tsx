'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect } from 'react';

export default function SignIn() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/';

  useEffect(() => {
    // 이미 로그인된 경우 리다이렉트
    if (status === 'authenticated' && session?.djangoAccessToken) {
      router.push(callbackUrl);
    }
  }, [status, session, callbackUrl, router]);

  useEffect(() => {
    // 에러 메시지가 있는 경우 처리
    const error = searchParams.get('error');
    if (error) {
      console.error('로그인 에러:', error);
    }
  }, [searchParams]);

  const handleSocialLogin = async (provider: string) => {
    try {
      const result = await signIn(provider, {
        callbackUrl,
        redirect: false,
      });

      if (result?.error) {
        console.error('로그인 실패:', result.error);
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>로딩 중...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>로그인</CardTitle>
          <CardDescription>
            소셜 계정으로 간편하게 로그인하세요
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            className="w-full"
            onClick={() => handleSocialLogin('google')}
            variant="outline"
          >
            Google로 로그인
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSocialLogin('kakao')}
            variant="outline"
          >
            카카오로 로그인
          </Button>
          <Button
            className="w-full"
            onClick={() => handleSocialLogin('naver')}
            variant="outline"
          >
            네이버로 로그인
          </Button>
        </CardContent>
      </Card>
    </div>
  );
} 