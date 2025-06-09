import axios, { AxiosError } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export class AllauthService {
  /**
   * 소셜 로그인 URL들 가져오기
   */
  static async getSocialLoginUrls() {
    try {
      const response = await api.get('/auth/social/urls/');
      return response.data;
    } catch (error) {
      console.error('Failed to get social login URLs:', error);
      throw error;
    }
  }

  /**
   * NextAuth.js 토큰을 Django JWT 토큰으로 교환
   */
  static async exchangeToken(provider: string, accessToken: string, userInfo: any) {
    try {
      const response = await api.post('/auth/social/exchange/', {
        provider,
        access_token: accessToken,
        user_info: userInfo,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to exchange token:', error);
      throw error;
    }
  }

  /**
   * Django JWT 토큰 갱신
   */
  static async refreshDjangoToken(refreshToken: string) {
    try {
      const response = await api.post('/auth/social/refresh/', {
        refresh_token: refreshToken,
      });
      return response.data;
    } catch (error) {
      console.error('Failed to refresh Django token:', error);
      throw error;
    }
  }

  /**
   * Django 백엔드 로그아웃
   */
  static async djangoLogout(djangoAccessToken: string, refreshToken?: string) {
    try {
      await api.post('/auth/social/logout/', 
        { refresh_token: refreshToken },
        {
          headers: {
            Authorization: `Bearer ${djangoAccessToken}`,
          },
        }
      );
    } catch (error) {
      console.error('Failed to logout from Django:', error);
      // 로그아웃 실패는 무시 (이미 만료된 토큰일 수 있음)
    }
  }

  /**
   * Django 사용자 프로필 조회
   */
  static async getDjangoUserProfile(djangoAccessToken: string) {
    try {
      const response = await api.get('/auth/social/profile/', {
        headers: {
          Authorization: `Bearer ${djangoAccessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get Django user profile:', error);
      throw error;
    }
  }

  /**
   * 소셜 계정 연결 정보 조회
   */
  static async getSocialConnections(djangoAccessToken: string) {
    try {
      const response = await api.get('/auth/social/connections/', {
        headers: {
          Authorization: `Bearer ${djangoAccessToken}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Failed to get social connections:', error);
      throw error;
    }
  }

  /**
   * Django API 호출용 인증 헤더 설정
   */
  static setAuthHeader(djangoAccessToken: string) {
    api.defaults.headers.common['Authorization'] = `Bearer ${djangoAccessToken}`;
  }

  /**
   * 인증 헤더 제거
   */
  static clearAuthHeader() {
    delete api.defaults.headers.common['Authorization'];
  }
}

export default api;
