import apiClient from './api-client';
import {
  DevelopmentRecord,
  CreateDevelopmentRecordRequest,
  UpdateDevelopmentRecordRequest,
  Milestone,
  ChildMilestone,
  CreateChildMilestoneRequest,
  DevelopmentStats,
  DevelopmentRecordsParams,
  MilestonesParams,
  ChildMilestonesParams,
  DevelopmentStatsParams,
  DevelopmentRecordsResponse,
  DevelopmentRecordResponse,
  MilestonesResponse,
  ChildMilestonesResponse,
  CreateChildMilestoneResponse,
  DevelopmentStatsResponse,
  DevelopmentArea,
  AgeGroup,
  RecordType,
  DEVELOPMENT_AREA_LABELS,
  AGE_GROUP_LABELS,
  RECORD_TYPE_LABELS
} from '../types/development';

/**
 * 발달 모니터링 관련 API 서비스
 */
export class DevelopmentService {
  private static readonly BASE_PATH = '/development';

  // ========== 발달 기록 관련 ==========

  /**
   * 발달 기록 목록 조회
   */
  static async getRecords(params: DevelopmentRecordsParams = {}): Promise<DevelopmentRecordsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.childId) queryParams.append('childId', params.childId);
    if (params.developmentArea) queryParams.append('developmentArea', params.developmentArea);
    if (params.ageGroup) queryParams.append('ageGroup', params.ageGroup);
    if (params.recordType) queryParams.append('recordType', params.recordType);

    const url = `${this.BASE_PATH}/records${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<DevelopmentRecordsResponse>(url);
  }

  /**
   * 발달 기록 상세 조회
   */
  static async getRecord(recordId: string): Promise<DevelopmentRecordResponse> {
    return await apiClient.get<DevelopmentRecordResponse>(
      `${this.BASE_PATH}/records/${recordId}`
    );
  }

  /**
   * 발달 기록 생성
   */
  static async createRecord(recordData: CreateDevelopmentRecordRequest): Promise<DevelopmentRecordResponse> {
    return await apiClient.post<DevelopmentRecordResponse>(
      `${this.BASE_PATH}/records`,
      recordData
    );
  }

  /**
   * 발달 기록 수정
   */
  static async updateRecord(
    recordId: string,
    recordData: UpdateDevelopmentRecordRequest
  ): Promise<DevelopmentRecordResponse> {
    return await apiClient.put<DevelopmentRecordResponse>(
      `${this.BASE_PATH}/records/${recordId}`,
      recordData
    );
  }

  /**
   * 발달 기록 삭제
   */
  static async deleteRecord(recordId: string): Promise<{ success: boolean }> {
    return await apiClient.delete<{ success: boolean }>(
      `${this.BASE_PATH}/records/${recordId}`
    );
  }

  // ========== 발달 이정표 관련 ==========

  /**
   * 발달 이정표 목록 조회
   */
  static async getMilestones(params: MilestonesParams = {}): Promise<MilestonesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.ageGroup) queryParams.append('ageGroup', params.ageGroup);
    if (params.developmentArea) queryParams.append('developmentArea', params.developmentArea);

    const url = `${this.BASE_PATH}/milestones${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<MilestonesResponse>(url);
  }

  /**
   * 자녀별 달성 이정표 조회
   */
  static async getChildMilestones(params: ChildMilestonesParams): Promise<ChildMilestonesResponse> {
    const queryParams = new URLSearchParams();
    queryParams.append('childId', params.childId);

    return await apiClient.get<ChildMilestonesResponse>(
      `${this.BASE_PATH}/child-milestones?${queryParams.toString()}`
    );
  }

  /**
   * 자녀 이정표 달성 기록
   */
  static async createChildMilestone(
    milestoneData: CreateChildMilestoneRequest
  ): Promise<CreateChildMilestoneResponse> {
    return await apiClient.post<CreateChildMilestoneResponse>(
      `${this.BASE_PATH}/child-milestones`,
      milestoneData
    );
  }

  // ========== 발달 통계 관련 ==========

  /**
   * 발달 통계 조회
   */
  static async getStats(params: DevelopmentStatsParams = {}): Promise<DevelopmentStatsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.childId) queryParams.append('childId', params.childId);
    if (params.period) queryParams.append('period', params.period);

    const url = `${this.BASE_PATH}/stats${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<DevelopmentStatsResponse>(url);
  }

  // ========== 헬퍼 함수들 ==========

  /**
   * 발달 영역 한글 라벨 가져오기
   */
  static getDevelopmentAreaLabel(area: DevelopmentArea): string {
    return DEVELOPMENT_AREA_LABELS[area];
  }

  /**
   * 연령 그룹 한글 라벨 가져오기
   */
  static getAgeGroupLabel(ageGroup: AgeGroup): string {
    return AGE_GROUP_LABELS[ageGroup];
  }

  /**
   * 기록 유형 한글 라벨 가져오기
   */
  static getRecordTypeLabel(recordType: RecordType): string {
    return RECORD_TYPE_LABELS[recordType];
  }

  /**
   * 생년월일을 기준으로 현재 연령 그룹 계산
   */
  static calculateCurrentAgeGroup(birthDate: string): AgeGroup | null {
    const birth = new Date(birthDate);
    const now = new Date();
    
    if (isNaN(birth.getTime())) {
      return null;
    }

    const ageMonths = this.calculateAgeInMonths(birthDate);
    
    if (ageMonths < 3) return '0-3months';
    if (ageMonths < 6) return '3-6months';
    if (ageMonths < 9) return '6-9months';
    if (ageMonths < 12) return '9-12months';
    if (ageMonths < 18) return '12-18months';
    if (ageMonths < 24) return '18-24months';
    if (ageMonths < 36) return '24-36months';
    
    return '24-36months'; // 36개월 이상도 마지막 그룹으로 처리
  }

  /**
   * 생년월일을 기준으로 개월수 계산
   */
  static calculateAgeInMonths(birthDate: string): number {
    const birth = new Date(birthDate);
    const now = new Date();
    
    const yearDiff = now.getFullYear() - birth.getFullYear();
    const monthDiff = now.getMonth() - birth.getMonth();
    
    return yearDiff * 12 + monthDiff;
  }

  /**
   * 발달 기록 제목 유효성 검사
   */
  static validateRecordTitle(title: string): boolean {
    return title.trim().length >= 1 && title.trim().length <= 100;
  }

  /**
   * 발달 기록 설명 유효성 검사
   */
  static validateRecordDescription(description: string): boolean {
    return description.trim().length >= 1 && description.trim().length <= 1000;
  }

  /**
   * 발달 기록을 연령 그룹별로 그룹화
   */
  static groupRecordsByAgeGroup(records: DevelopmentRecord[]): Record<AgeGroup, DevelopmentRecord[]> {
    const grouped = {} as Record<AgeGroup, DevelopmentRecord[]>;
    
    // 모든 연령 그룹 초기화
    Object.keys(AGE_GROUP_LABELS).forEach(ageGroup => {
      grouped[ageGroup as AgeGroup] = [];
    });

    records.forEach(record => {
      if (grouped[record.ageGroup]) {
        grouped[record.ageGroup].push(record);
      }
    });

    return grouped;
  }

  /**
   * 발달 기록을 발달 영역별로 그룹화
   */
  static groupRecordsByDevelopmentArea(records: DevelopmentRecord[]): Record<DevelopmentArea, DevelopmentRecord[]> {
    const grouped = {} as Record<DevelopmentArea, DevelopmentRecord[]>;
    
    // 모든 발달 영역 초기화
    Object.keys(DEVELOPMENT_AREA_LABELS).forEach(area => {
      grouped[area as DevelopmentArea] = [];
    });

    records.forEach(record => {
      if (grouped[record.developmentArea]) {
        grouped[record.developmentArea].push(record);
      }
    });

    return grouped;
  }

  /**
   * 타임라인용 발달 기록 정렬 (날짜순)
   */
  static sortRecordsForTimeline(records: DevelopmentRecord[]): DevelopmentRecord[] {
    return [...records].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
  }
}

export default DevelopmentService;
