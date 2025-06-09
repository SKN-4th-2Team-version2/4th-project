'use client';

import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case 'Configuration':
        return '서버 설정에 문제가 있습니다. 관리자에게 문의하세요.';
      case 'AccessDenied':
        return '액세스가 거부되었습니다. 권한을 확인해주세요.';
      case 'Verification':
        return '이메일 인증에 실패했습니다.';
      case 'OAuthCallback':
        return 'OAuth 콜백 처리 중 오류가 발생했습니다. 다시 시도해주세요.';
      case 'OAuthSignin':
        return 'OAuth 로그인 중 오류가 발생했습니다.';
      case 'EmailSignin':
        return '이메일 로그인 중 오류가 발생했습니다.';
      case 'CredentialsSignin':
        return '로그인 정보가 올바르지 않습니다.';
      case 'SessionRequired':
        return '로그인이 필요한 페이지입니다.';
      default:
        return '알 수 없는 오류가 발생했습니다. 다시 시도해주세요.';
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="text-red-600">로그인 오류</CardTitle>
          <CardDescription>
            로그인 처리 중 문제가 발생했습니다.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-800">
              {getErrorMessage(error)}
            </div>
            {error && (
              <div className="mt-2 text-xs text-red-600">
                오류 코드: {error}
              </div>
            )}
          </div>
          <div className="flex space-x-2">
            <Button asChild className="flex-1">
              <Link href="/auth/signin">다시 로그인</Link>
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link href="/">홈으로</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
