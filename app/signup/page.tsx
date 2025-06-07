'use client';

import { useState } from 'react';
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
import { Loader2 } from 'lucide-react';
import { TermsOfService } from '@/components/terms-of-service';
import { PrivacyPolicy } from '@/components/privacy-policy';
import { useAuth } from '@/hooks/use-auth';
import AuthService from '@/services/auth-service';

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const { redirectIfAuthenticated } = useAuth();

  // 이미 로그인된 사용자는 메인 페이지로 리다이렉트
  redirectIfAuthenticated();

  // 소셜 회원가입 핸들러
  const handleSocialSignup = (provider: 'google' | 'kakao' | 'naver') => {
    setIsLoading(provider);
    const socialLoginUrl = AuthService.getSocialLoginUrl(provider);
    window.location.href = socialLoginUrl;
  };

  return (
    <div className="container flex h-screen items-center justify-center">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-2xl font-bold">마파덜 시작하기</CardTitle>
            <CardDescription>
              소셜 계정으로 간편하게 회원가입하고<br />
              안전하고 편리한 육아 정보를 경험해보세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignup('google')}
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
                Google로 시작하기
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignup('kakao')}
                disabled={!!isLoading}
              >
                {isLoading === 'kakao' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <div className="mr-2 h-5 w-5 bg-yellow-400 rounded-sm flex items-center justify-center">
                    <span className="text-sm font-bold text-black">K</span>
                  </div>
                )}
                카카오로 시작하기
              </Button>

              <Button
                variant="outline"
                className="w-full h-12"
                onClick={() => handleSocialSignup('naver')}
                disabled={!!isLoading}
              >
                {isLoading === 'naver' ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <div className="mr-2 h-5 w-5 bg-green-500 rounded-sm flex items-center justify-center">
                    <span className="text-sm font-bold text-white">N</span>
                  </div>
                )}
                네이버로 시작하기
              </Button>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  왜 소셜 로그인만 제공할까요?
                </span>
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <h4 className="text-sm font-medium">🔐 더 안전한 계정 관리</h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• 비밀번호 분실 걱정 없음</li>
                <li>• 대형 플랫폼의 보안 시스템 활용</li>
                <li>• 2단계 인증 자동 적용</li>
                <li>• 개인정보 최소 수집</li>
              </ul>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-xs text-muted-foreground text-center leading-relaxed">
              회원가입을 진행하면 마파덜의 <TermsOfService /> 과{' '}
              <PrivacyPolicy /> 에 동의하게 됩니다.
            </div>
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
