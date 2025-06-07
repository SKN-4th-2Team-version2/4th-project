// 발달 모니터링 관련 타입 정의

import { MapaderApiResponse, PaginatedResponse } from './index';

// 발달 영역 타입
export type DevelopmentArea = 'physical' | 'cognitive' | 'language' | 'social' | 'emotional' | 'self_care';

// 연령 그룹 타입
export type AgeGroup = 
  | '0-3months' 
  | '3-6months' 
  | '6-9months' 
  | '9-12months' 
  | '12-18months' 
  | '18-24months' 
  | '24-36months';

// 기록 유형 타입
export type RecordType = 'development_record' | 'milestone_achievement' | 'observation' | 'concern';

// 자녀 정보 (발달 기록에서 사용)
export interface ChildInfo {
  id: string;
  name: string;
}

// 발달 기록 타입
export interface DevelopmentRecord {
  id: string;
  child: ChildInfo;
  date: string; // YYYY-MM-DD 형식
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  recordType: RecordType;
  images: string[];
  createdAt: string;
}

// 발달 기록 생성 요청
export interface CreateDevelopmentRecordRequest {
  childId: string;
  date: string; // YYYY-MM-DD 형식
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  recordType: RecordType;
  images?: string[];
}

// 발달 기록 수정 요청
export interface UpdateDevelopmentRecordRequest {
  date?: string;
  ageGroup?: AgeGroup;
  developmentArea?: DevelopmentArea;
  title?: string;
  description?: string;
  recordType?: RecordType;
  images?: string[];
}

// 발달 이정표 타입
export interface Milestone {
  id: string;
  ageGroup: AgeGroup;
  developmentArea: DevelopmentArea;
  title: string;
  description: string;
  order: number;
  isActive: boolean;
}

// 자녀별 달성 이정표 타입
export interface ChildMilestone {
  id: string;
  milestone: {
    id: string;
    title: string;
    ageGroup: AgeGroup;
    developmentArea: DevelopmentArea;
  };
  achievedDate: string; // YYYY-MM-DD 형식
  notes?: string;
  createdAt: string;
}

// 이정표 달성 기록 요청
export interface CreateChildMilestoneRequest {
  childId: string;
  milestoneId: string;
  achievedDate: string; // YYYY-MM-DD 형식
  notes?: string;
}

// 발달 통계 타입
export interface DevelopmentStats {
  totalRecords: number;
  recordsByArea: Record<DevelopmentArea, number>;
  recordsByType: Record<RecordType, number>;
  recentActivity: {
    recordsThisWeek: number;
    recordsThisMonth: number;
  };
  milestoneProgress: {
    achieved: number;
    total: number;
    percentage: number;
  };
}

// 발달 기록 목록 조회 파라미터
export interface DevelopmentRecordsParams {
  page?: number;
  limit?: number;
  childId?: string;
  developmentArea?: DevelopmentArea;
  ageGroup?: AgeGroup;
  recordType?: RecordType;
}

// 발달 이정표 목록 조회 파라미터
export interface MilestonesParams {
  ageGroup?: AgeGroup;
  developmentArea?: DevelopmentArea;
}

// 자녀별 달성 이정표 조회 파라미터
export interface ChildMilestonesParams {
  childId: string;
}

// 발달 통계 조회 파라미터
export interface DevelopmentStatsParams {
  childId?: string;
  period?: 'week' | 'month' | 'year' | 'all';
}

// API 응답 타입들
export type DevelopmentRecordsResponse = PaginatedResponse<DevelopmentRecord>;
export type DevelopmentRecordResponse = MapaderApiResponse<DevelopmentRecord>;
export type MilestonesResponse = MapaderApiResponse<Milestone[]>;
export type ChildMilestonesResponse = MapaderApiResponse<ChildMilestone[]>;
export type CreateChildMilestoneResponse = MapaderApiResponse<ChildMilestone>;
export type DevelopmentStatsResponse = MapaderApiResponse<DevelopmentStats>;

// 발달 영역 한글 매핑
export const DEVELOPMENT_AREA_LABELS: Record<DevelopmentArea, string> = {
  physical: '신체 발달',
  cognitive: '인지 발달', 
  language: '언어 발달',
  social: '사회성 발달',
  emotional: '정서 발달',
  self_care: '자조 능력'
};

// 연령 그룹 한글 매핑
export const AGE_GROUP_LABELS: Record<AgeGroup, string> = {
  '0-3months': '0-3개월',
  '3-6months': '3-6개월',
  '6-9months': '6-9개월',
  '9-12months': '9-12개월',
  '12-18months': '12-18개월',
  '18-24months': '18-24개월',
  '24-36months': '24-36개월'
};

// 기록 유형 한글 매핑
export const RECORD_TYPE_LABELS: Record<RecordType, string> = {
  development_record: '발달 기록',
  milestone_achievement: '이정표 달성',
  observation: '관찰 기록',
  concern: '우려사항'
};
