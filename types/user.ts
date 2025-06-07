// 사용자 관련 타입 정의

import { MapaderApiResponse } from './index';

// 자녀 정보 타입
export interface Child {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender: 'male' | 'female';
  ageMonths: number;
  createdAt: string;
}

// 자녀 정보 생성 요청
export interface CreateChildRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender: 'male' | 'female';
}

// 자녀 정보 수정 요청
export interface UpdateChildRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender: 'male' | 'female';
}

// 프로필 업데이트 요청
export interface UpdateProfileRequest {
  name: string;
  profileImage?: string;
}

// 사용자 프로필 응답 (인증에서 정의된 User와 동일하지만 확장 가능)
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  authProvider: 'local' | 'google' | 'kakao' | 'naver';
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

// API 응답 타입들
export type UserProfileResponse = MapaderApiResponse<UserProfile>;
export type UpdateProfileResponse = MapaderApiResponse<{
  id: string;
  email: string;
  name: string;
  profileImage?: string;
  updatedAt: string;
}>;
export type ChildrenListResponse = MapaderApiResponse<Child[]>;
export type ChildResponse = MapaderApiResponse<Child>;
export type DeleteChildResponse = MapaderApiResponse<{
  message: string;
}>;
