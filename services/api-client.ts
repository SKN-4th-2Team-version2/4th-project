import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(
  process.env.NEXT_PUBLIC_API_TIMEOUT || '30000',
  10,
);
const TOKEN_STORAGE_KEY =
  process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY ||
  '1bb247a99a0f51d506109711452f30b12e274cf882fa46ab6f917fe16e203147';

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
      (config) => {
        // 브라우저 환경에서만 localStorage, sessionStorage 사용
        if (typeof window !== 'undefined') {
          // 로컬 스토리지 또는 세션 스토리지에서 토큰 가져오기
          const localToken = localStorage.getItem(TOKEN_STORAGE_KEY);
          const sessionToken = sessionStorage.getItem(TOKEN_STORAGE_KEY);
          const token = localToken || sessionToken;

          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    // 응답 인터셉터 설정
    this.client.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        if (error.response?.status === 401) {
          // 브라우저 환경에서만 localStorage 및 location 사용
          if (typeof window !== 'undefined') {
            localStorage.removeItem(TOKEN_STORAGE_KEY);
            window.location.href = '/login';
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
