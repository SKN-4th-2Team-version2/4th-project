// 인증 관련 타입 정의 (소셜 로그인 전용)

// 사용자 정보
export interface User {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  authProvider: SocialProvider;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

// 소셜 로그인 응답
export interface AuthResponse {
  success: boolean;
  data: {
    token: string;
    user: User;
  };
}

// 로그아웃 응답
export interface LogoutResponse {
  success: boolean;
  data: {
    message: string;
  };
}

// 소셜 로그인 제공자
export type SocialProvider = 'google' | 'kakao' | 'naver';

// 소셜 로그인 제공자별 브랜딩 정보
export interface SocialProviderInfo {
  name: string;
  color: string;
  bgColor: string;
  textColor: string;
}

// 소셜 로그인 콜백 파라미터
export interface SocialCallbackParams {
  code: string;
  state?: string;
  error?: string;
  provider: SocialProvider;
}

// 토큰 정보
export interface TokenInfo {
  token: string;
  expiresAt: number;
  provider: SocialProvider;
}

// 인증 상태
export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  provider: SocialProvider | null;
  isLoading: boolean;
}

// 소셜 로그인 에러
export interface SocialLoginError {
  code: string;
  message: string;
  provider: SocialProvider;
}

// 소셜 로그인 성공 데이터
export interface SocialLoginSuccess {
  user: User;
  token: string;
  provider: SocialProvider;
  isNewUser: boolean; // 신규 가입 여부
}
