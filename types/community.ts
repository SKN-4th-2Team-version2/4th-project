// 커뮤니티 관련 타입 정의

import { MapaderApiResponse, PaginatedResponse } from './index';

// 게시물 타입
export type PostType = 'question' | 'story' | 'tip';

// 게시물 상태
export type PostStatus = 'published' | 'draft' | 'hidden';

// 좋아요 대상 타입
export type LikeTargetType = 'post' | 'comment';

// 카테고리 타입
export interface Category {
  id: string;
  name: string;
  description: string;
  postType: PostType;
  color: string;
  icon: string;
  order: number;
  isActive: boolean;
}

// 작성자 정보
export interface Author {
  id: string;
  name: string;
  profileImage?: string;
}

// 이미지 정보
export interface PostImage {
  id: string;
  imageUrl: string;
  altText?: string;
  order: number;
}

// 댓글 타입
export interface Comment {
  id: string;
  content: string;
  author: Author;
  likeCount: number;
  isAnonymous: boolean;
  depth: number;
  parentId: string | null;
  replies: Comment[];
  createdAt: string;
}

// 게시물 타입
export interface Post {
  id: string;
  postType: PostType;
  title: string;
  content: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
  author: Author;
  status: PostStatus;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isAnonymous: boolean;
  isSolved?: boolean; // question 타입에만 적용
  isPinned: boolean;
  images: string[] | PostImage[]; // 목록에서는 string[], 상세에서는 PostImage[]
  createdAt: string;
  updatedAt: string;
}

// 게시물 상세 (댓글 포함)
export interface PostDetail extends Post {
  comments: Comment[];
  isLiked: boolean;
  images: PostImage[];
}

// 게시물 생성 요청
export interface CreatePostRequest {
  postType: PostType;
  categoryId: string;
  title: string;
  content: string;
  status: PostStatus;
  isAnonymous: boolean;
  images?: {
    imageUrl: string;
    altText?: string;
    order: number;
  }[];
}

// 게시물 수정 요청
export interface UpdatePostRequest {
  categoryId?: string;
  title?: string;
  content?: string;
  status?: PostStatus;
  isAnonymous?: boolean;
  images?: {
    imageUrl: string;
    altText?: string;
    order: number;
  }[];
}

// 게시물 해결 상태 변경 요청
export interface SolvePostRequest {
  isSolved: boolean;
}

// 댓글 생성 요청
export interface CreateCommentRequest {
  postId: string;
  content: string;
  parentId?: string;
  isAnonymous: boolean;
}

// 댓글 수정 요청
export interface UpdateCommentRequest {
  content: string;
}

// 좋아요 토글 요청
export interface ToggleLikeRequest {
  targetId: string;
  targetType: LikeTargetType;
}

// 좋아요 토글 응답
export interface ToggleLikeResponse {
  isLiked: boolean;
  likeCount: number;
}

// 커뮤니티 통계
export interface CommunityStats {
  totalPosts: {
    questions: number;
    stories: number;
    tips: number;
  };
  totalComments: number;
  popularCategories: {
    name: string;
    count: number;
    postType: PostType;
  }[];
  recentActivity: {
    postsThisWeek: number;
    commentsThisWeek: number;
  };
}

// 게시물 목록 조회 파라미터
export interface PostsParams {
  page?: number;
  limit?: number;
  postType?: PostType;
  categoryId?: string;
  status?: PostStatus;
  search?: string;
  isPinned?: boolean;
  isSolved?: boolean;
}

// 카테고리 목록 조회 파라미터
export interface CategoriesParams {
  postType?: PostType;
}

// API 응답 타입들
export type CategoriesResponse = MapaderApiResponse<Category[]>;
export type PostsResponse = PaginatedResponse<Post>;
export type PostDetailResponse = MapaderApiResponse<PostDetail>;
export type CreatePostResponse = MapaderApiResponse<Post>;
export type UpdatePostResponse = MapaderApiResponse<Post>;
export type CreateCommentResponse = MapaderApiResponse<Comment>;
export type UpdateCommentResponse = MapaderApiResponse<Comment>;
export type ToggleLikeApiResponse = MapaderApiResponse<ToggleLikeResponse>;
export type CommunityStatsResponse = MapaderApiResponse<CommunityStats>;

// 게시물 타입 한글 매핑
export const POST_TYPE_LABELS: Record<PostType, string> = {
  question: '질문',
  story: '이야기',
  tip: '팁'
};

// 게시물 상태 한글 매핑
export const POST_STATUS_LABELS: Record<PostStatus, string> = {
  published: '게시됨',
  draft: '임시저장',
  hidden: '숨김'
};
