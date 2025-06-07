import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthService from '@/services/auth-service';

/**
 * 인증 상태를 관리하는 훅
 */
export function useAuth() {
  const router = useRouter();

  // 로그인 상태 확인
  const isAuthenticated = AuthService.isAuthenticated();

  // 로그인 필요 페이지에서 사용
  const requireAuth = () => {
    useEffect(() => {
      if (!isAuthenticated) {
        router.push('/login');
      }
    }, [isAuthenticated]);
  };

  // 로그인 상태에서 접근 불가 페이지에서 사용 (로그인, 회원가입 등)
  const redirectIfAuthenticated = (redirectTo: string = '/') => {
    useEffect(() => {
      if (isAuthenticated) {
        router.push(redirectTo);
      }
    }, [isAuthenticated, redirectTo]);
  };

  // 로그아웃
  const logout = async () => {
    try {
      await AuthService.logout();
    } catch (error) {
      console.error('로그아웃 API 호출 오류:', error);
    } finally {
      // API 호출 실패해도 로컬 토큰은 제거
      AuthService.removeToken();
      AuthService.removeProvider();
      router.push('/login');
    }
  };

  // 현재 소셜 로그인 제공자 확인
  const getCurrentProvider = () => {
    return AuthService.getCurrentProvider();
  };

  // 토큰 유효성 검사
  const checkTokenValidity = async () => {
    if (isAuthenticated) {
      const isValid = await AuthService.refreshTokenIfNeeded();
      if (!isValid) {
        // 토큰이 만료된 경우 로그아웃 처리
        await logout();
        return false;
      }
    }
    return true;
  };

  return {
    isAuthenticated,
    requireAuth,
    redirectIfAuthenticated,
    logout,
    getCurrentProvider,
    checkTokenValidity
  };
}

/**
 * 사용자 정보를 관리하는 훅
 */
export function useUser() {
  // 추후 사용자 정보 상태 관리 로직 추가 가능
  // 예: React Query, SWR, Zustand 등과 연동
  
  return {
    // user: null, // 사용자 정보
    // isLoading: false, // 로딩 상태
    // error: null, // 에러 상태
    // refetch: () => {}, // 재조회 함수
  };
}
