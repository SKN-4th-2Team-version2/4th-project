'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const success = searchParams.get('success');
        const tokenAvailable = searchParams.get('token_available');

        if (success === 'true' && tokenAvailable === 'true') {
          // Django에서 JWT 토큰 가져오기
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/tokens/`, {
            method: 'GET',
            credentials: 'include', // 쿠키 포함
          });

          if (response.ok) {
            const data = await response.json();
            
            // NextAuth.js 세션에 Django 토큰 저장
            const result = await signIn('credentials', {
              djangoAccessToken: data.tokens.access_token,
              djangoRefreshToken: data.tokens.refresh_token,
              userData: JSON.stringify(data.user),
              redirect: false,
            });

            if (result?.ok) {
              toast.success(`${data.user.name}님, 환영합니다!`);
              router.push('/');
            } else {
              throw new Error('NextAuth session creation failed');
            }
          } else {
            throw new Error('Failed to get tokens from Django');
          }
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('로그인 처리 중 오류가 발생했습니다.');
        router.push('/login');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [searchParams, router]);

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold mb-2">로그인 처리 중...</h2>
          <p className="text-gray-600">잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">인증 완료</h2>
        <p className="text-gray-600">메인 페이지로 이동 중...</p>
      </div>
    </div>
  );
}
