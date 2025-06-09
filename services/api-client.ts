import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getSession } from 'next-auth/react';

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
  10,
);

/**
 * 기본 API 클라이언트 클래스
 * 모든 API 요청에 공통적으로 필요한 설정을 관리
 */
class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: API_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // 요청 인터셉터 설정
    this.client.interceptors.request.use(
      async (config) => {
        const session = await getSession();
        if (session?.djangoAccessToken) {
          config.headers.Authorization = `Bearer ${session.djangoAccessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 응답 인터셉터 설정
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // 토큰 만료로 인한 401 에러 처리
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const session = await getSession();
            if (session?.djangoRefreshToken) {
              // 토큰 갱신 요청
              const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/token/refresh/`,
                {
                  refresh_token: session.djangoRefreshToken,
                }
              );

              if (response.data.success) {
                // 새로운 토큰으로 요청 재시도
                originalRequest.headers.Authorization = `Bearer ${response.data.data.access_token}`;
                
                // 토큰 저장
                if (typeof window !== 'undefined') {
                  const storageKey = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY || 
                    '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';
                  localStorage.setItem(storageKey, response.data.data.access_token);
                }
                
                return this.client(originalRequest);
              }
            }
          } catch (refreshError) {
            console.error('토큰 갱신 실패:', refreshError);
            // 토큰 갱신 실패 시 로그아웃 처리
            if (typeof window !== 'undefined') {
              window.location.href = '/login';
            }
          }
        }

        return Promise.reject(error);
      }
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
      const response: AxiosResponse<T> = await this.client.patch<T>(
        url,
        data,
        config,
      );
      return response.data;
    } catch (error) {
      console.error(`PATCH request to ${url} failed:`, error);
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
