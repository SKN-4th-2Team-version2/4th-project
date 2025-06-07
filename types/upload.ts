// 파일 업로드 관련 타입 정의

import { MapaderApiResponse } from './index';

// 업로드 파일 타입
export type UploadFileType = 'image' | 'profile' | 'document';

// 이미지 파일 타입
export type ImageMimeType = 'image/jpeg' | 'image/jpg' | 'image/png' | 'image/gif' | 'image/webp';

// 업로드된 파일 정보
export interface UploadedFile {
  url: string;
  filename: string;
  originalName: string;
  size: number;
  mimeType: string;
  key: string; // S3 객체 키
}

// 이미지 업로드 응답
export interface ImageUploadResponse {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

// 프로필 이미지 업로드 응답
export interface ProfileImageUploadResponse extends ImageUploadResponse {
  thumbnailUrl?: string; // 썸네일 이미지 URL
}

// 파일 업로드 설정
export interface UploadConfig {
  maxFileSize: number; // 바이트 단위
  allowedMimeTypes: string[];
  uploadPath: string;
}

// 이미지 리사이즈 옵션
export interface ImageResizeOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

// S3 업로드 옵션
export interface S3UploadOptions {
  bucket: string;
  key: string;
  contentType: string;
  acl?: string;
  metadata?: Record<string, string>;
}

// 파일 업로드 에러
export interface FileUploadError {
  code: string;
  message: string;
  field?: string;
}

// 다중 파일 업로드 결과
export interface MultipleUploadResult {
  successful: UploadedFile[];
  failed: {
    filename: string;
    error: FileUploadError;
  }[];
}

// API 응답 타입들
export type ImageUploadApiResponse = MapaderApiResponse<ImageUploadResponse>;
export type ProfileImageUploadApiResponse = MapaderApiResponse<ProfileImageUploadResponse>;
export type MultipleUploadApiResponse = MapaderApiResponse<MultipleUploadResult>;

// 파일 업로드 설정 상수
export const UPLOAD_CONFIGS: Record<UploadFileType, UploadConfig> = {
  image: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
    uploadPath: 'images'
  },
  profile: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png'],
    uploadPath: 'profiles'
  },
  document: {
    maxFileSize: 20 * 1024 * 1024, // 20MB
    allowedMimeTypes: ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'],
    uploadPath: 'documents'
  }
};

// 에러 코드 상수
export const UPLOAD_ERROR_CODES = {
  FILE_TOO_LARGE: 'FILE_TOO_LARGE',
  INVALID_FILE_TYPE: 'INVALID_FILE_TYPE',
  UPLOAD_FAILED: 'UPLOAD_FAILED',
  NO_FILE_PROVIDED: 'NO_FILE_PROVIDED',
  S3_ERROR: 'S3_ERROR',
  RESIZE_ERROR: 'RESIZE_ERROR'
} as const;

// 에러 메시지 매핑
export const UPLOAD_ERROR_MESSAGES: Record<string, string> = {
  [UPLOAD_ERROR_CODES.FILE_TOO_LARGE]: '파일 크기가 너무 큽니다.',
  [UPLOAD_ERROR_CODES.INVALID_FILE_TYPE]: '지원하지 않는 파일 형식입니다.',
  [UPLOAD_ERROR_CODES.UPLOAD_FAILED]: '파일 업로드에 실패했습니다.',
  [UPLOAD_ERROR_CODES.NO_FILE_PROVIDED]: '업로드할 파일이 없습니다.',
  [UPLOAD_ERROR_CODES.S3_ERROR]: 'S3 업로드 중 오류가 발생했습니다.',
  [UPLOAD_ERROR_CODES.RESIZE_ERROR]: '이미지 리사이즈 중 오류가 발생했습니다.'
};
