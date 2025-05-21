# 마파덜(Mapader) API 구현 가이드

## 1. 개요

이 문서는 마파덜 프로젝트의 API 구현에 대한 가이드라인을 제공합니다. API 구현 시 일관된 패턴과 모범 사례를 따르기 위한 참고 자료로 활용하세요.

## 2. 기술 스택

- **프레임워크**: Next.js (App Router)
- **API 구현 방식**: Next.js API Routes 또는 Server Actions
- **데이터베이스**: PostgreSQL (Prisma ORM 사용)
- **인증**: NextAuth.js
- **실시간 통신**: WebSocket (Socket.io)
- **파일 저장소**: Vercel Blob Storage

## 3. API 구현 패턴

### 3.1 디렉토리 구조

\`\`\`
app/
api/
[그룹명]/
[엔드포인트]/
route.ts
\`\`\`

예시:
\`\`\`
app/
api/
auth/
login/
route.ts
register/
route.ts
development/
records/
route.ts
[id]/
route.ts
\`\`\`

### 3.2 기본 API 핸들러 구조

\`\`\`typescript
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { validateRequest } from '@/lib/auth';
import { ApiResponse } from '@/lib/api-types';

export async function GET(
request: Request,
{ params }: { params: { id: string } }
) {
try {
// 1. 인증 검증 (필요한 경우)
const { user, error } = await validateRequest(request);
if (error) {
return NextResponse.json<ApiResponse>({
success: false,
error: {
code: 'AUTH_REQUIRED',
message: '인증이 필요합니다.'
}
}, { status: 401 });
}

    // 2. 요청 파라미터 검증
    const { id } = params;
    if (!id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'ID가 필요합니다.'
        }
      }, { status: 400 });
    }

    // 3. 데이터베이스 조회
    const data = await db.someTable.findUnique({
      where: { id }
    });

    // 4. 결과 없음 처리
    if (!data) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: '요청한 리소스를 찾을 수 없습니다.'
        }
      }, { status: 404 });
    }

    // 5. 성공 응답 반환
    return NextResponse.json<ApiResponse>({
      success: true,
      data
    });

} catch (error) {
// 6. 오류 처리
console.error('API Error:', error);
return NextResponse.json<ApiResponse>({
success: false,
error: {
code: 'SERVER_ERROR',
message: '서버 내부 오류가 발생했습니다.'
}
}, { status: 500 });
}
}
\`\`\`

### 3.3 서버 액션 구현 구조

\`\`\`typescript
'use server'

import { db } from '@/lib/db';
import { validateSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createRecord(formData: FormData) {
try {
// 1. 인증 검증
const { user, error } = await validateSession();
if (error) {
return {
success: false,
error: {
code: 'AUTH_REQUIRED',
message: '인증이 필요합니다.'
}
};
}

    // 2. 입력 데이터 검증
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    if (!title || !content) {
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '제목과 내용은 필수 입력 항목입니다.'
        }
      };
    }

    // 3. 데이터베이스 작업
    const record = await db.someTable.create({
      data: {
        title,
        content,
        userId: user.id
      }
    });

    // 4. 캐시 무효화 (필요한 경우)
    revalidatePath('/some-path');

    // 5. 성공 응답 반환
    return {
      success: true,
      data: record
    };

} catch (error) {
// 6. 오류 처리
console.error('Server Action Error:', error);
return {
success: false,
error: {
code: 'SERVER_ERROR',
message: '서버 내부 오류가 발생했습니다.'
}
};
}
}
\`\`\`

## 4. 인증 및 권한 관리

### 4.1 인증 미들웨어

\`\`\`typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
// API 경로에 대한 인증 검사
if (request.nextUrl.pathname.startsWith('/api/')) {
// 인증이 필요하지 않은 API 경로 제외
if (
request.nextUrl.pathname.startsWith('/api/auth/') ||
request.nextUrl.pathname === '/api/webhook'
) {
return NextResponse.next();
}

    const token = await getToken({ req: request });

    // 인증되지 않은 요청 처리
    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'AUTH_REQUIRED',
            message: '인증이 필요합니다.'
          }
        },
        { status: 401 }
      );
    }

}

return NextResponse.next();
}

export const config = {
matcher: ['/api/:path*']
};
\`\`\`

### 4.2 권한 검사 유틸리티

\`\`\`typescript
// lib/permissions.ts
import { db } from './db';

export async function canAccessResource(
userId: string,
resourceId: string,
resourceType: 'question' | 'story' | 'tip' | 'comment' | 'development_record'
) {
try {
let resource;

    switch (resourceType) {
      case 'question':
        resource = await db.question.findUnique({
          where: { id: resourceId },
          select: { userId: true }
        });
        break;
      case 'story':
        resource = await db.story.findUnique({
          where: { id: resourceId },
          select: { userId: true }
        });
        break;
      // ... 다른 리소스 타입에 대한 처리
    }

    if (!resource) {
      return false;
    }

    // 리소스 소유자 또는 관리자인지 확인
    return resource.userId === userId || await isAdmin(userId);

} catch (error) {
console.error('Permission check error:', error);
return false;
}
}

export async function isAdmin(userId: string) {
try {
const user = await db.user.findUnique({
where: { id: userId },
select: { isAdmin: true }
});

    return user?.isAdmin === true;

} catch (error) {
console.error('Admin check error:', error);
return false;
}
}
\`\`\`

## 5. 오류 처리

### 5.1 오류 코드 및 메시지

\`\`\`typescript
// lib/errors.ts
export const ErrorCodes = {
AUTH_REQUIRED: '인증이 필요합니다.',
INVALID_CREDENTIALS: '잘못된 인증 정보입니다.',
PERMISSION_DENIED: '권한이 없습니다.',
RESOURCE_NOT_FOUND: '요청한 리소스를 찾을 수 없습니다.',
VALIDATION_ERROR: '요청 데이터가 유효하지 않습니다.',
DUPLICATE_ENTRY: '중복된 데이터가 존재합니다.',
SERVER_ERROR: '서버 내부 오류가 발생했습니다.',
RATE_LIMIT_EXCEEDED: '요청 한도를 초과했습니다.'
};

export class ApiError extends Error {
code: keyof typeof ErrorCodes;
status: number;

constructor(code: keyof typeof ErrorCodes, status: number = 500) {
super(ErrorCodes[code]);
this.code = code;
this.status = status;
this.name = 'ApiError';
}
}

export function handleApiError(error: unknown) {
console.error('API Error:', error);

if (error instanceof ApiError) {
return {
success: false,
error: {
code: error.code,
message: error.message
}
};
}

return {
success: false,
error: {
code: 'SERVER_ERROR',
message: ErrorCodes.SERVER_ERROR
}
};
}
\`\`\`

## 6. 데이터 검증

### 6.1 Zod를 사용한 스키마 검증

\`\`\`typescript
// lib/validations/development-record.ts
import { z } from 'zod';

export const developmentRecordSchema = z.object({
date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '날짜 형식은 YYYY-MM-DD여야 합니다.'),
ageGroup: z.string().min(1, '연령 그룹은 필수 입력 항목입니다.'),
developmentArea: z.string().optional(),
title: z.string().min(1, '제목은 필수 입력 항목입니다.').max(200, '제목은 200자를 초과할 수 없습니다.'),
description: z.string().min(1, '상세 내용은 필수 입력 항목입니다.'),
recordType: z.string().default('development_record'),
images: z.array(z.string().url('유효한 이미지 URL이어야 합니다.')).optional()
});

export type DevelopmentRecordInput = z.infer<typeof developmentRecordSchema>;

export function validateDevelopmentRecord(data: unknown) {
try {
return {
data: developmentRecordSchema.parse(data),
error: null
};
} catch (error) {
if (error instanceof z.ZodError) {
return {
data: null,
error: {
code: 'VALIDATION_ERROR',
message: '입력 데이터가 유효하지 않습니다.',
details: error.errors
}
};
}

    return {
      data: null,
      error: {
        code: 'VALIDATION_ERROR',
        message: '입력 데이터 검증 중 오류가 발생했습니다.'
      }
    };

}
}
\`\`\`

## 7. 캐싱 및 재검증

### 7.1 API 응답 캐싱

\`\`\`typescript
// lib/api-cache.ts
import { NextResponse } from 'next/server';
import { ApiResponse } from './api-types';

export function cachedResponse<T>(
data: T,
options: {
maxAge?: number; // 초 단위
staleWhileRevalidate?: number; // 초 단위
} = {}
) {
const { maxAge = 60, staleWhileRevalidate = 600 } = options;

const response = NextResponse.json<ApiResponse>({
success: true,
data
});

response.headers.set(
'Cache-Control',
`public, max-age=${maxAge}, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`
);

return response;
}
\`\`\`

### 7.2 데이터 재검증

\`\`\`typescript
// app/api/development/records/route.ts
import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';

// GET 요청 처리 (캐시 태그 사용)
export async function GET(request: Request) {
const data = await fetchDataWithTags(['development-records']);

return NextResponse.json({
success: true,
data
});
}

// POST 요청 처리 (캐시 무효화)
export async function POST(request: Request) {
// ... 데이터 생성 로직

// 관련 캐시 태그 무효화
revalidateTag('development-records');

return NextResponse.json({
success: true,
data: newRecord
});
}

// 캐시 태그를 사용한 데이터 가져오기
async function fetchDataWithTags(tags: string[]) {
const response = await fetch('https://api.example.com/data', {
next: {
tags
}
});

return response.json();
}
\`\`\`

## 8. WebSocket 구현

### 8.1 WebSocket 서버 설정

\`\`\`typescript
// lib/websocket-server.ts
import { Server } from 'socket.io';
import { getToken } from 'next-auth/jwt';
import type { NextApiRequest } from 'next';
import type { Server as HTTPServer } from 'http';

export function initWebSocketServer(httpServer: HTTPServer) {
const io = new Server(httpServer, {
path: '/api/ws',
cors: {
origin: process.env.NEXT_PUBLIC_APP_URL,
methods: ['GET', 'POST']
}
});

// 인증 미들웨어
io.use(async (socket, next) => {
try {
const req = socket.request as NextApiRequest;
const token = await getToken({ req });

      if (!token) {
        return next(new Error('인증이 필요합니다.'));
      }

      // 소켓에 사용자 정보 저장
      socket.data.user = {
        id: token.sub,
        name: token.name
      };

      next();
    } catch (error) {
      next(new Error('인증 처리 중 오류가 발생했습니다.'));
    }

});

// 연결 이벤트 처리
io.on('connection', (socket) => {
console.log(`User connected: ${socket.data.user.id}`);

    // 사용자별 룸 조인
    socket.join(`user:${socket.data.user.id}`);

    // 메시지 이벤트 처리
    socket.on('message', async (data) => {
      try {
        // 메시지 처리 로직
        const response = await processMessage(data, socket.data.user);

        // 응답 전송
        socket.emit('message', response);
      } catch (error) {
        socket.emit('error', {
          message: '메시지 처리 중 오류가 발생했습니다.'
        });
      }
    });

    // 타이핑 이벤트 처리
    socket.on('typing', (data) => {
      // 타이핑 상태 브로드캐스트
    });

    // 연결 종료 이벤트 처리
    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.data.user.id}`);
    });

});

return io;
}

async function processMessage(data: any, user: any) {
// 메시지 처리 및 AI 응답 생성 로직
// ...

return {
id: 'message_id',
role: 'assistant',
content: 'AI 응답 내용',
createdAt: new Date().toISOString()
};
}
\`\`\`

### 8.2 WebSocket 클라이언트 구현

\`\`\`typescript
// hooks/use-websocket.ts
import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSession } from 'next-auth/react';

export function useWebSocket() {
const { data: session } = useSession();
const [isConnected, setIsConnected] = useState(false);
const [messages, setMessages] = useState<any[]>([]);
const socketRef = useRef<Socket | null>(null);

useEffect(() => {
if (!session) return;

    // 소켓 연결
    const socket = io({
      path: '/api/ws',
      autoConnect: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    socketRef.current = socket;

    // 이벤트 리스너 등록
    socket.on('connect', () => {
      console.log('WebSocket connected');
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
      setIsConnected(false);
    });

    socket.on('message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('error', (error) => {
      console.error('WebSocket error:', error);
    });

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      socket.disconnect();
    };

}, [session]);

// 메시지 전송 함수
const sendMessage = useCallback((content: string, category: string) => {
if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('message', {
      content,
      category
    });

    // 사용자 메시지를 로컬 상태에 추가
    setMessages((prev) => [
      ...prev,
      {
        id: `temp-${Date.now()}`,
        role: 'user',
        content,
        createdAt: new Date().toISOString()
      }
    ]);

}, [isConnected]);

// 타이핑 상태 전송 함수
const sendTypingStatus = useCallback((isTyping: boolean) => {
if (!socketRef.current || !isConnected) return;

    socketRef.current.emit('typing', { isTyping });

}, [isConnected]);

return {
isConnected,
messages,
sendMessage,
sendTypingStatus
};
}
\`\`\`

## 9. 파일 업로드 구현

### 9.1 Vercel Blob Storage 사용

\`\`\`typescript
// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { validateRequest } from '@/lib/auth';

export async function POST(request: Request) {
try {
// 인증 검증
const { user, error } = await validateRequest(request);
if (error) {
return NextResponse.json({
success: false,
error: {
code: 'AUTH_REQUIRED',
message: '인증이 필요합니다.'
}
}, { status: 401 });
}

    // 멀티파트 폼 데이터 파싱
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '파일이 필요합니다.'
        }
      }, { status: 400 });
    }

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '이미지 파일만 업로드할 수 있습니다.'
        }
      }, { status: 400 });
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '파일 크기는 5MB를 초과할 수 없습니다.'
        }
      }, { status: 400 });
    }

    // 파일명 생성
    const filename = `${user.id}/${Date.now()}-${file.name}`;

    // Blob Storage에 업로드
    const blob = await put(filename, file, {
      access: 'public',
      contentType: file.type
    });

    // 데이터베이스에 파일 정보 저장
    await db.file.create({
      data: {
        userId: user.id,
        filename: blob.url.split('/').pop() || '',
        originalFilename: file.name,
        url: blob.url,
        mimeType: file.type,
        size: file.size
      }
    });

    return NextResponse.json({
      success: true,
      data: {
        url: blob.url,
        filename: file.name,
        size: file.size,
        mimeType: file.type
      }
    });

} catch (error) {
console.error('Upload error:', error);
return NextResponse.json({
success: false,
error: {
code: 'SERVER_ERROR',
message: '파일 업로드 중 오류가 발생했습니다.'
}
}, { status: 500 });
}
}
\`\`\`

## 10. API 모니터링 및 로깅

### 10.1 API 로그 기록

\`\`\`typescript
// lib/api-logger.ts
import { db } from './db';

export async function logApiRequest(
endpoint: string,
method: string,
statusCode: number,
responseTime: number,
userId?: string,
ipAddress?: string,
userAgent?: string
) {
try {
await db.apiLog.create({
data: {
endpoint,
method,
statusCode,
responseTime,
userId,
ipAddress,
userAgent
}
});
} catch (error) {
console.error('API logging error:', error);
}
}

export function createApiLogger() {
return async (req: Request, res: Response, next: () => void) => {
const start = Date.now();
const url = new URL(req.url);

    // 응답 처리 후 로깅
    res.on('finish', () => {
      const responseTime = Date.now() - start;

      logApiRequest(
        url.pathname,
        req.method,
        res.statusCode,
        responseTime,
        req.user?.id,
        req.headers['x-forwarded-for'] as string || req.socket.remoteAddress,
        req.headers['user-agent']
      );
    });

    next();

};
}
\`\`\`

## 11. API 테스트

### 11.1 Jest를 사용한 API 테스트

\`\`\`typescript
// **tests**/api/development-records.test.ts
import { createMocks } from 'node-mocks-http';
import { GET, POST } from '@/app/api/development/records/route';
import { db } from '@/lib/db';
import { validateRequest } from '@/lib/auth';

// 모킹
jest.mock('@/lib/db');
jest.mock('@/lib/auth');

describe('Development Records API', () => {
beforeEach(() => {
jest.resetAllMocks();
});

describe('GET /api/development/records', () => {
it('인증된 사용자에게 발달 기록 목록을 반환해야 함', async () => {
// 모의 인증 설정
(validateRequest as jest.Mock).mockResolvedValue({
user: { id: 'user-id' },
error: null
});

      // 모의 데이터베이스 응답 설정
      (db.developmentRecord.findMany as jest.Mock).mockResolvedValue([
        {
          id: 'record-1',
          title: '첫 걸음마',
          date: '2023-01-01'
        }
      ]);

      // 요청 모킹
      const { req, res } = createMocks({
        method: 'GET'
      });

      // API 핸들러 호출
      await GET(req);

      // 응답 검증
      expect(res._getStatusCode()).toBe(200);
      expect(JSON.parse(res._getData())).toEqual({
        success: true,
        data: [
          {
            id: 'record-1',
            title: '첫 걸음마',
            date: '2023-01-01'
          }
        ]
      });
    });

    it('인증되지 않은 사용자에게 401 오류를 반환해야 함', async () => {
      // 모의 인증 오류 설정
      (validateRequest as jest.Mock).mockResolvedValue({
        user: null,
        error: {
          code: 'AUTH_REQUIRED',
          message: '인증이 필요합니다.'
        }
      });

      // 요청 모킹
      const { req, res } = createMocks({
        method: 'GET'
      });

      // API 핸들러 호출
      await GET(req);

      // 응답 검증
      expect(res._getStatusCode()).toBe(401);
      expect(JSON.parse(res._getData())).toEqual({
        success: false,
        error: {
          code: 'AUTH_REQUIRED',
          message: '인증이 필요합니다.'
        }
      });
    });

});

// POST 요청 테스트 등 추가 테스트 케이스
});
\`\`\`

## 12. API 문서화

### 12.1 Swagger/OpenAPI 문서 생성

\`\`\`typescript
// app/api-docs/page.tsx
import { getApiDocs } from '@/lib/api-docs';

export default async function ApiDocsPage() {
const apiDocs = await getApiDocs();

return (
<div>
<h1>마파덜 API 문서</h1>
<pre>{JSON.stringify(apiDocs, null, 2)}</pre>
</div>
);
}

// lib/api-docs.ts
export async function getApiDocs() {
return {
openapi: '3.0.0',
info: {
title: '마파덜 API',
version: '1.0.0',
description: '마파덜 서비스의 API 문서'
},
paths: {
'/api/development/records': {
get: {
summary: '발달 기록 목록 조회',
description: '사용자의 발달 기록 목록을 조회합니다.',
parameters: [
{
name: 'page',
in: 'query',
description: '페이지 번호',
schema: {
type: 'integer',
default: 1
}
},
// ... 추가 파라미터
],
responses: {
'200': {
description: '성공',
content: {
'application/json': {
schema: {
type: 'object',
properties: {
success: {
type: 'boolean',
example: true
},
data: {
type: 'object',
properties: {
records: {
type: 'array',
items: {
$ref: '#/components/schemas/DevelopmentRecord'
}
},
pagination: {
$ref: '#/components/schemas/Pagination'
}
}
}
}
}
}
}
},
'401': {
description: '인증 필요',
content: {
'application/json': {
schema: {
$ref: '#/components/schemas/Error'
}
}
}
}
// ... 추가 응답
}
},
// ... POST 메서드 등
},
// ... 추가 경로
},
components: {
schemas: {
DevelopmentRecord: {
type: 'object',
properties: {
id: {
type: 'string',
format: 'uuid'
},
date: {
type: 'string',
format: 'date'
},
// ... 추가 속성
}
},
Pagination: {
type: 'object',
properties: {
total: {
type: 'integer'
},
page: {
type: 'integer'
},
limit: {
type: 'integer'
},
pages: {
type: 'integer'
}
}
},
Error: {
type: 'object',
properties: {
success: {
type: 'boolean',
example: false
},
error: {
type: 'object',
properties: {
code: {
type: 'string'
},
message: {
type: 'string'
}
}
}
}
}
// ... 추가 스키마
},
securitySchemes: {
bearerAuth: {
type: 'http',
scheme: 'bearer',
bearerFormat: 'JWT'
}
}
}
};
}
