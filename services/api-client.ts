import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { getSession } from 'next-auth/react';

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
  10,
);

// 세션 캐시
interface SessionCache {
  djangoAccessToken: string;
  djangoRefreshToken: string;
  user: any;
  lastUpdated: number;
}

let sessionCache: SessionCache | null = null;
const CACHE_DURATION = 30 * 60 * 1000; // 30분

/**
 * 기본 API 클라이언트 클래스
 * 모든 API 요청에 공통적으로 필요한 설정을 관리
 */
class ApiClient {
  private client: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];
  private sessionPromise: Promise<any> | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 설정
    this.client.interceptors.request.use(
      async (config) => {
        const now = Date.now();

        // CSRF 토큰을 가져옵니다
        const csrfToken = document.cookie
          .split('; ')
          .find((row) => row.startsWith('csrftoken='))
          ?.split('=')[1];

        if (csrfToken) {
          config.headers['X-CSRFToken'] = csrfToken;
        }

        // 캐시된 토큰이 있고 유효한 경우 사용
        if (
          sessionCache?.djangoAccessToken &&
          now - sessionCache.lastUpdated < CACHE_DURATION
        ) {
          config.headers.Authorization = `Bearer ${sessionCache.djangoAccessToken}`;
          return config;
        }

        // 이미 진행 중인 세션 요청이 있으면 그것을 재사용
        if (this.sessionPromise) {
          const session = await this.sessionPromise;
          if (session?.djangoAccessToken) {
            config.headers.Authorization = `Bearer ${session.djangoAccessToken}`;
          }
          return config;
        }

        // 새로운 세션 요청
        this.sessionPromise = getSession();
        try {
          const session = await this.sessionPromise;
          if (session?.djangoAccessToken) {
            sessionCache = {
              djangoAccessToken: session.djangoAccessToken,
              djangoRefreshToken: session.djangoRefreshToken || '',
              user: session.user,
              lastUpdated: now,
            };
            config.headers.Authorization = `Bearer ${session.djangoAccessToken}`;
          }
        } finally {
          this.sessionPromise = null;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 설정
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 토큰 만료로 인한 401 에러 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            // 이미 토큰 갱신 중이면 대기
            return new Promise((resolve) => {
              this.refreshSubscribers.push((token: string) => {
                originalRequest.headers.Authorization = `Bearer ${token}`;
                resolve(this.client(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            const session = await getSession();
            if (!session?.djangoRefreshToken) {
              throw new Error('리프레시 토큰이 없습니다');
            }

            // 리프레시 토큰으로 새로운 액세스 토큰 발급
            const response = await axios.post(
              `${API_BASE_URL}/auth/token/refresh/`,
              {
                refresh_token: session.djangoRefreshToken,
              },
            );

            const { access } = response.data;

            // 세션 캐시 업데이트
            if (sessionCache) {
              sessionCache.djangoAccessToken = access;
              sessionCache.lastUpdated = Date.now();
            }

            // 대기 중인 요청들 처리
            this.refreshSubscribers.forEach((callback) => callback(access));
            this.refreshSubscribers = [];

            // 새로운 액세스 토큰으로 원래 요청 재시도
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            // 리프레시 토큰도 만료된 경우 로그아웃 처리
            sessionCache = null;
            if (typeof window !== 'undefined') {
              window.location.href = '/auth/signin';
            }
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      },
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.get<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.post<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.put<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    try {
      const response = await this.client.delete<T>(url, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async patch<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> {
    try {
      const response = await this.client.patch<T>(url, data, config);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  private handleError(error: any): Error {
    if (error.response) {
      // 서버에서 응답이 왔지만 에러 상태 코드인 경우
      const message =
        error.response.data?.message ||
        error.response.data?.detail ||
        '서버 오류가 발생했습니다.';
      return new Error(message);
    }
    if (error.request) {
      // 요청은 보냈지만 응답이 없는 경우
      return new Error('서버에 연결할 수 없습니다.');
    }
    // 요청 설정 중 오류가 발생한 경우
    return new Error(error.message || '요청 중 오류가 발생했습니다.');
  }
}

// API 클라이언트 인스턴스 생성 및 내보내기
const apiClient = new ApiClient();
export default apiClient;
