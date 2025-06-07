import apiClient from './api-client';
import {
  AuthResponse,
  LogoutResponse,
  SocialProvider
} from '../types/auth';

/**
 * 인증 관련 API 서비스 (소셜 로그인 전용)
 */
export class AuthService {
  private static readonly BASE_PATH = '/auth';

  /**
   * 로그아웃
   */
  static async logout(): Promise<LogoutResponse> {
    return await apiClient.post<LogoutResponse>(`${this.BASE_PATH}/logout`);
  }

  /**
   * 소셜 로그인 (Google/Kakao/Naver)
   * @param provider - 소셜 로그인 제공자
   * @returns 소셜 로그인 URL
   */
  static getSocialLoginUrl(provider: SocialProvider): string {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
    return `${baseUrl}${this.BASE_PATH}/${provider}`;
  }

  /**
   * 소셜 로그인 콜백 처리
   * 이 메서드는 브라우저에서 콜백 URL에서 토큰을 추출할 때 사용됩니다.
   * @param provider - 소셜 로그인 제공자
   * @param code - 인증 코드 (URL 파라미터에서 추출)
   * @param state - 상태값 (URL 파라미터에서 추출)
   */
  static async handleSocialCallback(
    provider: SocialProvider,
    code: string,
    state?: string
  ): Promise<AuthResponse> {
    const params = new URLSearchParams();
    params.append('code', code);
    if (state) {
      params.append('state', state);
    }

    return await apiClient.get<AuthResponse>(
      `${this.BASE_PATH}/${provider}/callback?${params.toString()}`
    );
  }

  /**
   * 토큰 저장 (브라우저 환경에서만)
   * @param token - JWT 토큰
   * @param remember - 기억하기 여부 (true면 localStorage, false면 sessionStorage)
   */
  static saveToken(token: string, remember: boolean = true): void {
    if (typeof window !== 'undefined') {
      const storage = remember ? localStorage : sessionStorage;
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 
        '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';
      storage.setItem(storageKey, token);
    }
  }

  /**
   * 토큰 제거 (브라우저 환경에서만)
   */
  static removeToken(): void {
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 
        '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';
      localStorage.removeItem(storageKey);
      sessionStorage.removeItem(storageKey);
    }
  }

  /**
   * 저장된 토큰 가져오기 (브라우저 환경에서만)
   */
  static getToken(): string | null {
    if (typeof window !== 'undefined') {
      const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 
        '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';
      return localStorage.getItem(storageKey) || sessionStorage.getItem(storageKey);
    }
    return null;
  }

  /**
   * 로그인 상태 확인
   */
  static isAuthenticated(): boolean {
    return !!this.getToken();
  }

  /**
   * 소셜 로그인 제공자별 브랜딩 정보
   */
  static getSocialProviderInfo(provider: SocialProvider) {
    const providerInfo = {
      google: {
        name: 'Google',
        color: '#4285f4',
        bgColor: '#ffffff',
        textColor: '#000000'
      },
      kakao: {
        name: '카카오',
        color: '#fee500',
        bgColor: '#fee500',
        textColor: '#000000'
      },
      naver: {
        name: '네이버',
        color: '#03c75a',
        bgColor: '#03c75a',
        textColor: '#ffffff'
      }
    };

    return providerInfo[provider];
  }

  /**
   * 현재 사용자의 로그인 제공자 확인 (토큰에서 추출)
   * 실제로는 백엔드에서 사용자 정보를 가져와야 하지만,
   * 간단한 구현을 위해 토큰에 제공자 정보가 포함되어 있다고 가정
   */
  static getCurrentProvider(): SocialProvider | null {
    // 실제 구현에서는 사용자 정보 API를 호출하여 확인
    // 여기서는 예시로 localStorage에서 확인
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_provider') as SocialProvider || null;
    }
    return null;
  }

  /**
   * 소셜 로그인 제공자 정보 저장 (로그인 성공 시 사용)
   */
  static saveProvider(provider: SocialProvider): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_provider', provider);
    }
  }

  /**
   * 소셜 로그인 제공자 정보 제거 (로그아웃 시 사용)
   */
  static removeProvider(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_provider');
    }
  }

  /**
   * 토큰 유효성 검사 (간단한 만료 시간 체크)
   * 실제로는 백엔드에서 토큰 검증을 해야 함
   */
  static isTokenValid(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      // JWT 토큰의 payload 부분을 디코딩하여 만료 시간 확인
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      
      return payload.exp > currentTime;
    } catch (error) {
      console.error('토큰 유효성 검사 오류:', error);
      return false;
    }
  }

  /**
   * 토큰 자동 갱신 (필요한 경우)
   */
  static async refreshTokenIfNeeded(): Promise<boolean> {
    if (!this.isTokenValid()) {
      // 토큰이 만료된 경우 로그아웃 처리
      this.removeToken();
      this.removeProvider();
      return false;
    }
    return true;
  }
}

export default AuthService;
