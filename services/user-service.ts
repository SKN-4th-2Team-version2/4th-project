import apiClient from './api-client';
import {
  UserProfile,
  UpdateProfileRequest,
  Child,
  CreateChildRequest,
  UpdateChildRequest,
  UserProfileResponse,
  UpdateProfileResponse,
  ChildrenListResponse,
  ChildResponse,
  DeleteChildResponse
} from '../types/user';

/**
 * 사용자 관련 API 서비스
 */
export class UserService {
  private static readonly BASE_PATH = '/users';

  /**
   * 현재 사용자 프로필 조회
   */
  static async getProfile(): Promise<UserProfileResponse> {
    return await apiClient.get<UserProfileResponse>(
      `${this.BASE_PATH}/profile`
    );
  }

  /**
   * 사용자 프로필 업데이트
   */
  static async updateProfile(profileData: UpdateProfileRequest): Promise<UpdateProfileResponse> {
    return await apiClient.put<UpdateProfileResponse>(
      `${this.BASE_PATH}/profile`,
      profileData
    );
  }

  /**
   * 자녀 정보 목록 조회
   */
  static async getChildren(): Promise<ChildrenListResponse> {
    return await apiClient.get<ChildrenListResponse>(
      `${this.BASE_PATH}/children`
    );
  }

  /**
   * 자녀 정보 추가
   */
  static async createChild(childData: CreateChildRequest): Promise<ChildResponse> {
    return await apiClient.post<ChildResponse>(
      `${this.BASE_PATH}/children`,
      childData
    );
  }

  /**
   * 자녀 정보 수정
   */
  static async updateChild(
    childId: string, 
    childData: UpdateChildRequest
  ): Promise<ChildResponse> {
    return await apiClient.put<ChildResponse>(
      `${this.BASE_PATH}/children/${childId}`,
      childData
    );
  }

  /**
   * 자녀 정보 삭제
   */
  static async deleteChild(childId: string): Promise<DeleteChildResponse> {
    return await apiClient.delete<DeleteChildResponse>(
      `${this.BASE_PATH}/children/${childId}`
    );
  }

  /**
   * 자녀 나이(개월수) 계산 헬퍼 함수
   * @param birthDate - 생년월일 (YYYY-MM-DD 형식)
   * @returns 개월수
   */
  static calculateAgeMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    return yearDiff * 12 + monthDiff;
  }

  /**
   * 생년월일 유효성 검사 헬퍼 함수
   * @param birthDate - 생년월일 (YYYY-MM-DD 형식)
   * @returns 유효성 여부
   */
  static validateBirthDate(birthDate: string): boolean {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(birthDate)) {
      return false;
    }

    const date = new Date(birthDate);
    const now = new Date();
    
    // 유효한 날짜인지 확인
    if (isNaN(date.getTime())) {
      return false;
    }

    // 미래 날짜가 아닌지 확인
    if (date > now) {
      return false;
    }

    // 너무 과거 날짜가 아닌지 확인 (10년 전까지만 허용)
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(now.getFullYear() - 10);
    
    if (date < tenYearsAgo) {
      return false;
    }

    return true;
  }

  /**
   * 자녀 이름 유효성 검사 헬퍼 함수
   * @param name - 자녀 이름(별명)
   * @returns 유효성 여부
   */
  static validateChildName(name: string): boolean {
    // 1-20자 사이, 특수문자 제외
    const nameRegex = /^[가-힣a-zA-Z0-9\s]{1,20}$/;
    return nameRegex.test(name.trim());
  }

  /**
   * 사용자 이름 유효성 검사 헬퍼 함수
   * @param name - 사용자 이름
   * @returns 유효성 여부
   */
  static validateUserName(name: string): boolean {
    // 1-50자 사이, 특수문자 제외
    const nameRegex = /^[가-힣a-zA-Z0-9\s]{1,50}$/;
    return nameRegex.test(name.trim());
  }
}

export default UserService;
