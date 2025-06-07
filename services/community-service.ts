import apiClient from './api-client';
import {
  Category,
  Post,
  PostDetail,
  Comment,
  CommunityStats,
  CreatePostRequest,
  UpdatePostRequest,
  SolvePostRequest,
  CreateCommentRequest,
  UpdateCommentRequest,
  ToggleLikeRequest,
  ToggleLikeResponse,
  PostsParams,
  CategoriesParams,
  CategoriesResponse,
  PostsResponse,
  PostDetailResponse,
  CreatePostResponse,
  UpdatePostResponse,
  CreateCommentResponse,
  UpdateCommentResponse,
  ToggleLikeApiResponse,
  CommunityStatsResponse,
  PostType,
  PostStatus,
  LikeTargetType,
  POST_TYPE_LABELS,
  POST_STATUS_LABELS
} from '../types/community';
import { MapaderApiResponse } from '../types/index';

/**
 * 커뮤니티 관련 API 서비스
 */
export class CommunityService {
  private static readonly BASE_PATH = '/community';

  // ========== 카테고리 관련 ==========

  /**
   * 카테고리 목록 조회
   */
  static async getCategories(params: CategoriesParams = {}): Promise<CategoriesResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.postType) queryParams.append('postType', params.postType);

    const url = `${this.BASE_PATH}/categories${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<CategoriesResponse>(url);
  }

  // ========== 게시물 관련 ==========

  /**
   * 게시물 목록 조회 (통합)
   */
  static async getPosts(params: PostsParams = {}): Promise<PostsResponse> {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.postType) queryParams.append('postType', params.postType);
    if (params.categoryId) queryParams.append('categoryId', params.categoryId);
    if (params.status) queryParams.append('status', params.status);
    if (params.search) queryParams.append('search', params.search);
    if (params.isPinned !== undefined) queryParams.append('isPinned', params.isPinned.toString());
    if (params.isSolved !== undefined) queryParams.append('isSolved', params.isSolved.toString());

    const url = `${this.BASE_PATH}/posts${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return await apiClient.get<PostsResponse>(url);
  }

  /**
   * 게시물 상세 조회
   */
  static async getPost(postId: string): Promise<PostDetailResponse> {
    return await apiClient.get<PostDetailResponse>(
      `${this.BASE_PATH}/posts/${postId}`
    );
  }

  /**
   * 게시물 작성
   */
  static async createPost(postData: CreatePostRequest): Promise<CreatePostResponse> {
    return await apiClient.post<CreatePostResponse>(
      `${this.BASE_PATH}/posts`,
      postData
    );
  }

  /**
   * 게시물 수정
   */
  static async updatePost(
    postId: string,
    postData: UpdatePostRequest
  ): Promise<UpdatePostResponse> {
    return await apiClient.put<UpdatePostResponse>(
      `${this.BASE_PATH}/posts/${postId}`,
      postData
    );
  }

  /**
   * 게시물 삭제
   */
  static async deletePost(postId: string): Promise<MapaderApiResponse<{ message: string }>> {
    return await apiClient.delete<MapaderApiResponse<{ message: string }>>(
      `${this.BASE_PATH}/posts/${postId}`
    );
  }

  /**
   * 게시물 해결 상태 변경 (질문 타입만)
   */
  static async solvePost(
    postId: string,
    solveData: SolvePostRequest
  ): Promise<UpdatePostResponse> {
    return await apiClient.put<UpdatePostResponse>(
      `${this.BASE_PATH}/posts/${postId}/solve`,
      solveData
    );
  }

  // ========== 댓글 관련 ==========

  /**
   * 댓글 작성
   */
  static async createComment(commentData: CreateCommentRequest): Promise<CreateCommentResponse> {
    return await apiClient.post<CreateCommentResponse>(
      `${this.BASE_PATH}/comments`,
      commentData
    );
  }

  /**
   * 댓글 수정
   */
  static async updateComment(
    commentId: string,
    commentData: UpdateCommentRequest
  ): Promise<UpdateCommentResponse> {
    return await apiClient.put<UpdateCommentResponse>(
      `${this.BASE_PATH}/comments/${commentId}`,
      commentData
    );
  }

  /**
   * 댓글 삭제
   */
  static async deleteComment(commentId: string): Promise<MapaderApiResponse<{ message: string }>> {
    return await apiClient.delete<MapaderApiResponse<{ message: string }>>(
      `${this.BASE_PATH}/comments/${commentId}`
    );
  }

  // ========== 좋아요 관련 ==========

  /**
   * 좋아요 토글
   */
  static async toggleLike(likeData: ToggleLikeRequest): Promise<ToggleLikeApiResponse> {
    return await apiClient.post<ToggleLikeApiResponse>(
      `${this.BASE_PATH}/likes`,
      likeData
    );
  }

  // ========== 통계 관련 ==========

  /**
   * 커뮤니티 통계 조회
   */
  static async getStats(): Promise<CommunityStatsResponse> {
    return await apiClient.get<CommunityStatsResponse>(
      `${this.BASE_PATH}/stats`
    );
  }

  // ========== 헬퍼 함수들 ==========

  /**
   * 게시물 타입 한글 라벨 가져오기
   */
  static getPostTypeLabel(postType: PostType): string {
    return POST_TYPE_LABELS[postType];
  }

  /**
   * 게시물 상태 한글 라벨 가져오기
   */
  static getPostStatusLabel(status: PostStatus): string {
    return POST_STATUS_LABELS[status];
  }

  /**
   * 게시물 제목 유효성 검사
   */
  static validatePostTitle(title: string): boolean {
    return title.trim().length >= 1 && title.trim().length <= 200;
  }

  /**
   * 게시물 내용 유효성 검사
   */
  static validatePostContent(content: string): boolean {
    return content.trim().length >= 1 && content.trim().length <= 10000;
  }

  /**
   * 댓글 내용 유효성 검사
   */
  static validateCommentContent(content: string): boolean {
    return content.trim().length >= 1 && content.trim().length <= 1000;
  }

  /**
   * 댓글을 트리 구조로 정렬
   */
  static organizeCommentsToTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<string, Comment>();
    const rootComments: Comment[] = [];

    // 모든 댓글을 맵에 저장하고 replies 배열 초기화
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [] });
    });

    // 부모-자식 관계 설정
    comments.forEach(comment => {
      const commentWithReplies = commentMap.get(comment.id)!;
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId);
        if (parent) {
          parent.replies.push(commentWithReplies);
        }
      } else {
        rootComments.push(commentWithReplies);
      }
    });

    // 각 레벨에서 생성일자순 정렬
    const sortComments = (comments: Comment[]): Comment[] => {
      return comments
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
        .map(comment => ({
          ...comment,
          replies: sortComments(comment.replies)
        }));
    };

    return sortComments(rootComments);
  }

  /**
   * 게시물을 카테고리별로 그룹화
   */
  static groupPostsByCategory(posts: Post[]): Record<string, Post[]> {
    const grouped: Record<string, Post[]> = {};

    posts.forEach(post => {
      const categoryName = post.category.name;
      if (!grouped[categoryName]) {
        grouped[categoryName] = [];
      }
      grouped[categoryName].push(post);
    });

    return grouped;
  }

  /**
   * 게시물을 타입별로 그룹화
   */
  static groupPostsByType(posts: Post[]): Record<PostType, Post[]> {
    const grouped = {
      question: [],
      story: [],
      tip: []
    } as Record<PostType, Post[]>;

    posts.forEach(post => {
      grouped[post.postType].push(post);
    });

    return grouped;
  }

  /**
   * 게시물 목록을 최신순으로 정렬
   */
  static sortPostsByLatest(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }

  /**
   * 게시물 목록을 인기순으로 정렬 (조회수 + 좋아요 + 댓글 수 기준)
   */
  static sortPostsByPopularity(posts: Post[]): Post[] {
    return [...posts].sort((a, b) => {
      const scoreA = a.viewCount + (a.likeCount * 2) + (a.commentCount * 3);
      const scoreB = b.viewCount + (b.likeCount * 2) + (b.commentCount * 3);
      return scoreB - scoreA;
    });
  }

  /**
   * 핀된 게시물과 일반 게시물 분리
   */
  static separatePinnedPosts(posts: Post[]): { pinned: Post[]; normal: Post[] } {
    const pinned = posts.filter(post => post.isPinned);
    const normal = posts.filter(post => !post.isPinned);

    return { pinned, normal };
  }

  /**
   * 검색어로 게시물 필터링 (클라이언트 사이드)
   */
  static filterPostsBySearch(posts: Post[], searchTerm: string): Post[] {
    if (!searchTerm.trim()) return posts;

    const term = searchTerm.toLowerCase();
    return posts.filter(post => 
      post.title.toLowerCase().includes(term) ||
      post.content.toLowerCase().includes(term)
    );
  }

  /**
   * 해결된/미해결 질문 필터링
   */
  static filterQuestionsBySolved(posts: Post[], isSolved?: boolean): Post[] {
    if (isSolved === undefined) return posts;
    
    return posts.filter(post => 
      post.postType === 'question' && post.isSolved === isSolved
    );
  }
}

export default CommunityService;
