import apiClient from './api-client';
import type { Child, ChildrenResponse } from '@/types/child';

export class ChildService {
  private static readonly BASE_PATH = '/children';

  /**
   * 자녀 목록 조회
   */
  static async getChildren(): Promise<ChildrenResponse> {
    return await apiClient.get<ChildrenResponse>(this.BASE_PATH);
  }
}

export const getChildren = ChildService.getChildren;
