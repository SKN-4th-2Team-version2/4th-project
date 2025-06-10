'use server';

import DevelopmentService from '@/services/development-service';
import { 
  CreateDevelopmentRecordRequest,
  UpdateDevelopmentRecordRequest,
  DevelopmentRecord,
  DevelopmentRecordsParams 
} from '@/types/development';

/**
 * 발달 기록 저장
 */
export async function saveDevelopmentRecord(data: CreateDevelopmentRecordRequest): Promise<string> {
  try {
    const record = await DevelopmentService.createRecord(data);
    return record.id;
  } catch (error) {
    console.error('Error saving development record:', error);
    throw new Error('Failed to save development record');
  }
}

/**
 * 발달 기록 목록 조회
 */
export async function getDevelopmentRecords(params: DevelopmentRecordsParams = {}): Promise<DevelopmentRecord[]> {
  try {
    const response = await DevelopmentService.getRecords(params);
    return response.results;
  } catch (error) {
    console.error('Error getting development records:', error);
    throw new Error('Failed to get development records');
  }
}

/**
 * 발달 기록 상세 조회
 */
export async function getDevelopmentRecord(id: string): Promise<DevelopmentRecord | null> {
  try {
    return await DevelopmentService.getRecord(id);
  } catch (error) {
    console.error('Error getting development record:', error);
    return null;
  }
}

/**
 * 발달 기록 수정
 */
export async function updateDevelopmentRecord(
  id: string, 
  data: UpdateDevelopmentRecordRequest
): Promise<boolean> {
  try {
    await DevelopmentService.updateRecord(id, data);
    return true;
  } catch (error) {
    console.error('Error updating development record:', error);
    throw new Error('Failed to update development record');
  }
}

/**
 * 발달 기록 삭제
 */
export async function deleteDevelopmentRecord(id: string): Promise<boolean> {
  try {
    await DevelopmentService.deleteRecord(id);
    return true;
  } catch (error) {
    console.error('Error deleting development record:', error);
    throw new Error('Failed to delete development record');
  }
}

/**
 * 발달 기록 통계 조회
 */
export async function getDevelopmentStats(childId?: string) {
  try {
    return await DevelopmentService.getStats({ childId });
  } catch (error) {
    console.error('Error getting development stats:', error);
    throw new Error('Failed to get development stats');
  }
}

/**
 * 발달 정보 검색
 */
export async function searchDevelopmentInfo(query: string) {
  try {
    return await DevelopmentService.searchDevelopmentInfo(query);
  } catch (error) {
    console.error('Error searching development info:', error);
    throw new Error('Failed to search development info');
  }
}

/**
 * 발달 이정표 목록 조회
 */
export async function getDevelopmentMilestones(params: { ageGroup?: string; developmentArea?: string } = {}) {
  try {
    return await DevelopmentService.getMilestones(params);
  } catch (error) {
    console.error('Error getting development milestones:', error);
    throw new Error('Failed to get development milestones');
  }
}

/**
 * 자녀별 달성 이정표 조회
 */
export async function getChildMilestones(childId: string) {
  try {
    return await DevelopmentService.getChildMilestones({ childId });
  } catch (error) {
    console.error('Error getting child milestones:', error);
    throw new Error('Failed to get child milestones');
  }
}

/**
 * 자녀 이정표 달성 기록
 */
export async function createChildMilestone(data: {
  childId: string;
  milestoneId: string;
  achievedDate: string;
  notes?: string;
}) {
  try {
    return await DevelopmentService.createChildMilestone(data);
  } catch (error) {
    console.error('Error creating child milestone:', error);
    throw new Error('Failed to create child milestone');
  }
}

/**
 * 이정표 달성 진도 조회
 */
export async function getMilestoneProgress(childId?: string) {
  try {
    return await DevelopmentService.getMilestoneProgress(childId);
  } catch (error) {
    console.error('Error getting milestone progress:', error);
    throw new Error('Failed to get milestone progress');
  }
}
