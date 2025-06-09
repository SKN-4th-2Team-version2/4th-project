'use client';

import { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Shield, Zap, Lock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function SignUpPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
    if (status === 'authenticated' && session?.djangoAccessToken) {
      router.push('/');
    }
  }, [status, session, router]);

  const handleSocialSignUp = async (provider: 'google' | 'kakao' | 'naver') => {
    try {
      setIsLoading(provider);
      const result = await signIn(provider, {
        callbackUrl: '/',
        redirect: false,
      });

      if (result?.error) {
        toast.error('회원가입에 실패했습니다. 다시 시도해주세요.');
        console.error('회원가입 실패:', result.error);
        return;
      }

      if (result?.ok) {
        router.push('/');
      }
    } catch (error) {
      toast.error('회원가입 중 오류가 발생했습니다.');
      console.error('회원가입 중 오류 발생:', error);
    } finally {
      setIsLoading(null);
    }
  };

  // 로딩 중이거나 이미 인증된 경우
  if (status === 'loading' || status === 'authenticated') {
    return (
      <div className="container flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">마파덜 회원가입</CardTitle>
            <CardDescription>
              소셜 계정으로 간편하게<br />
              마파덜 서비스를 시작해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignUp('google')}
                disabled={!!isLoading}
              >
                {isLoading === 'google' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    className="mr-2"
                  >
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                )}
                Google로 회원가입
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignUp('kakao')}
                disabled={!!isLoading}
              >
                {isLoading === 'kakao' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <div className="mr-2 h-5 w-5 bg-yellow-400 rounded-sm flex items-center justify-center">
                    <span className="text-sm font-bold text-black">K</span>
                  </div>
                )}
                카카오로 회원가입
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignUp('naver')}
                disabled={!!isLoading}
              >
                {isLoading === 'naver' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <div className="mr-2 h-5 w-5 bg-green-500 rounded-sm flex items-center justify-center">
                    <span className="text-sm font-bold text-white">N</span>
                  </div>
                )}
                네이버로 회원가입
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  소셜 회원가입의 장점
                </span>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="flex items-center space-x-2 text-sm">
                <Shield className="h-4 w-4 text-green-600" />
                <span className="text-muted-foreground">NextAuth.js로 안전한 OAuth</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="text-muted-foreground">간편한 회원가입</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Lock className="h-4 w-4 text-purple-600" />
                <span className="text-muted-foreground">JWT 토큰 기반 API 인증</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <div className="text-sm text-center">
              이미 계정이 있으신가요?{' '}
              <Link
                href="/login"
                className="underline underline-offset-4 hover:text-primary font-medium"
              >
                로그인
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
