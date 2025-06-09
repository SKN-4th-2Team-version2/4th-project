'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // NextAuth의 세션 상태 확인
        if (status === 'loading') {
          return; // 아직 로딩 중
        }

        if (status === 'authenticated' && session?.djangoAccessToken) {
          // 성공적으로 로그인됨
          toast.success(`${session.user?.name || '사용자'}님, 환영합니다!`);
          router.push('/');
          return;
        }

        // NextAuth 에러 처리
        const error = searchParams.get('error');
        if (error) {
          console.error('NextAuth 에러:', error);
          toast.error('로그인 처리 중 오류가 발생했습니다.');
          router.push('/auth/signin?error=' + error);
          return;
        }

        // 세션이 없는 경우 로그인 페이지로 이동
        if (status === 'unauthenticated') {
          router.push('/auth/signin');
          return;
        }

      } catch (error) {
        console.error('Auth callback error:', error);
        toast.error('로그인 처리 중 오류가 발생했습니다.');
        router.push('/auth/signin');
      } finally {
        setIsProcessing(false);
      }
    };

    handleAuthCallback();
  }, [status, session, searchParams, router]);

  if (isProcessing || status === 'loading') {
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
