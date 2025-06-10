// 사용자 관련 타입 정의

import { MapaderApiResponse } from './index';

// 자녀 정보 타입
export interface Child {
  id: string;
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
  ageMonths: number;
  createdAt: string;
}

// 자녀 정보 생성 요청
export interface CreateChildRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
}

// 자녀 정보 수정 요청
export interface UpdateChildRequest {
  name: string;
  birthDate: string; // YYYY-MM-DD 형식
  gender?: 'male' | 'female';
}

// API 응답 타입들
export type ChildrenListResponse = MapaderApiResponse<Child[]>;
export type ChildResponse = MapaderApiResponse<Child>;
export type DeleteChildResponse = MapaderApiResponse<{
  message: string;
}>;
