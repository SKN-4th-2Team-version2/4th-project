# 마파덜(Mapader) API 명세서

## 기본 정보

- 기본 URL: `https://api.mapader.com/v1` 또는 `/api`
- 모든 요청과 응답은 JSON 형식입니다.
- 인증이 필요한 엔드포인트는 요청 헤더에 `Authorization: Bearer {token}` 형식으로 JWT 토큰을 포함해야 합니다.
- 모든 API 응답은 다음 형식을 따릅니다:
  \`\`\`json
  {
    "success": true/false,
    "data": { ... } 또는 [ ... ],
    "error": { "code": "ERROR_CODE", "message": "오류 메시지" } (오류 발생 시)
  }
  \`\`\`

## 1. 인증 API

### 1.1 로그인

- **URL**: `/auth/login`
- **Method**: `POST`
- **인증 필요**: 아니오
- **요청 본문**:
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "사용자 이름",
        "profileImage": "프로필 이미지 URL"
      }
    }
  }
  \`\`\`

### 1.2 회원가입

- **URL**: `/auth/register`
- **Method**: `POST`
- **인증 필요**: 아니오
- **요청 본문**:
  \`\`\`json
  {
    "email": "user@example.com",
    "password": "password123",
    "name": "사용자 이름",
    "agreeToTerms": true
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "token": "JWT_TOKEN",
      "user": {
        "id": "user_id",
        "email": "user@example.com",
        "name": "사용자 이름"
      }
    }
  }
  \`\`\`

### 1.3 로그아웃

- **URL**: `/auth/logout`
- **Method**: `POST`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "로그아웃 되었습니다."
    }
  }
  \`\`\`

### 1.4 소셜 로그인 (Google)

- **URL**: `/auth/google`
- **Method**: `GET`
- **인증 필요**: 아니오
- **응답**: Google OAuth 인증 페이지로 리디렉션

### 1.5 소셜 로그인 콜백

- **URL**: `/auth/google/callback`
- **Method**: `GET`
- **인증 필요**: 아니오
- **응답**: 인증 성공 시 JWT 토큰과 함께 앱으로 리디렉션

## 2. 사용자 API

### 2.1 현재 사용자 프로필 조회

- **URL**: `/users/profile`
- **Method**: `GET`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "사용자 이름",
      "profileImage": "프로필 이미지 URL",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 2.2 사용자 프로필 업데이트

- **URL**: `/users/profile`
- **Method**: `PUT`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "name": "새 이름",
    "profileImage": "새 프로필 이미지 URL"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "email": "user@example.com",
      "name": "새 이름",
      "profileImage": "새 프로필 이미지 URL",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 2.3 특정 사용자 정보 조회

- **URL**: `/users/{id}`
- **Method**: `GET`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "user_id",
      "name": "사용자 이름",
      "profileImage": "프로필 이미지 URL"
    }
  }
  \`\`\`

## 3. 발달 모니터링 API

### 3.1 발달 기록 목록 조회

- **URL**: `/development/records`
- **Method**: `GET`
- **인증 필요**: 예
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `developmentArea`: 발달 영역 필터 (선택 사항)
  - `ageGroup`: 연령 그룹 필터 (선택 사항)
  - `recordType`: 기록 유형 필터 (선택 사항)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "records": [
        {
          "id": "record_id",
          "date": "2023-01-01",
          "ageGroup": "0-12개월",
          "developmentArea": "신체",
          "title": "첫 걸음마",
          "description": "오늘 아이가 처음으로 혼자 걸었어요!",
          "images": ["이미지URL1", "이미지URL2"],
          "recordType": "발달 기록",
          "createdAt": "2023-01-01T00:00:00Z"
        },
        // ... 추가 기록
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      }
    }
  }
  \`\`\`

### 3.2 발달 기록 상세 조회

- **URL**: `/development/records/{id}`
- **Method**: `GET`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "record_id",
      "date": "2023-01-01",
      "ageGroup": "0-12개월",
      "developmentArea": "신체",
      "title": "첫 걸음마",
      "description": "오늘 아이가 처음으로 혼자 걸었어요!",
      "images": ["이미지URL1", "이미지URL2"],
      "recordType": "발달 기록",
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 3.3 발달 기록 생성

- **URL**: `/development/records`
- **Method**: `POST`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "date": "2023-01-01",
    "ageGroup": "0-12개월",
    "developmentArea": "신체",
    "title": "첫 걸음마",
    "description": "오늘 아이가 처음으로 혼자 걸었어요!",
    "images": ["이미지URL1", "이미지URL2"],
    "recordType": "발달 기록"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "record_id",
      "date": "2023-01-01",
      "ageGroup": "0-12개월",
      "developmentArea": "신체",
      "title": "첫 걸음마",
      "description": "오늘 아이가 처음으로 혼자 걸었어요!",
      "images": ["이미지URL1", "이미지URL2"],
      "recordType": "발달 기록",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 3.4 발달 기록 수정

- **URL**: `/development/records/{id}`
- **Method**: `PUT`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "date": "2023-01-01",
    "ageGroup": "0-12개월",
    "developmentArea": "신체",
    "title": "첫 걸음마 (수정됨)",
    "description": "오늘 아이가 처음으로 혼자 걸었어요! 추가 내용...",
    "images": ["이미지URL1", "이미지URL2", "새이미지URL3"],
    "recordType": "발달 기록"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "record_id",
      "date": "2023-01-01",
      "ageGroup": "0-12개월",
      "developmentArea": "신체",
      "title": "첫 걸음마 (수정됨)",
      "description": "오늘 아이가 처음으로 혼자 걸었어요! 추가 내용...",
      "images": ["이미지URL1", "이미지URL2", "새이미지URL3"],
      "recordType": "발달 기록",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  }
  \`\`\`

### 3.5 발달 기록 삭제

- **URL**: `/development/records/{id}`
- **Method**: `DELETE`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "발달 기록이 삭제되었습니다."
    }
  }
  \`\`\`

### 3.6 발달 통계 조회

- **URL**: `/development/stats`
- **Method**: `GET`
- **인증 필요**: 예
- **쿼리 파라미터**:
  - `period`: 기간 (week, month, year, all - 기본값: month)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "totalRecords": 25,
      "byDevelopmentArea": {
        "신체": 8,
        "인지": 6,
        "언어": 7,
        "사회성": 4
      },
      "byRecordType": {
        "발달 기록": 15,
        "발달 이정표": 5,
        "특별한 날": 3,
        "건강 기록": 2
      },
      "recentActivity": {
        "lastRecordDate": "2023-01-15",
        "recordsThisMonth": 5
      }
    }
  }
  \`\`\`

### 3.7 발달 타임라인 조회

- **URL**: `/development/timeline`
- **Method**: `GET`
- **인증 필요**: 예
- **쿼리 파라미터**:
  - `startDate`: 시작 날짜 (YYYY-MM-DD 형식, 선택 사항)
  - `endDate`: 종료 날짜 (YYYY-MM-DD 형식, 선택 사항)
  - `developmentArea`: 발달 영역 필터 (선택 사항)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "timeline": [
        {
          "date": "2023-01-15",
          "events": [
            {
              "id": "record_id1",
              "title": "첫 걸음마",
              "developmentArea": "신체",
              "recordType": "발달 이정표"
            }
          ]
        },
        {
          "date": "2023-01-10",
          "events": [
            {
              "id": "record_id2",
              "title": "첫 단어",
              "developmentArea": "언어",
              "recordType": "발달 이정표"
            },
            {
              "id": "record_id3",
              "title": "병원 검진",
              "recordType": "건강 기록"
            }
          ]
        }
        // ... 추가 날짜
      ]
    }
  }
  \`\`\`

## 4. 커뮤니티 API

### 4.1 질문 목록 조회

- **URL**: `/community/questions`
- **Method**: `GET`
- **인증 필요**: 아니오 (인증 시 추가 정보 제공)
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `category`: 카테고리 필터 (선택 사항)
  - `search`: 검색어 (선택 사항)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "questions": [
        {
          "id": "question_id",
          "title": "아이가 밤에 자주 깨요",
          "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
          "category": "수면",
          "author": {
            "id": "user_id",
            "name": "사용자 이름",
            "profileImage": "프로필 이미지 URL"
          },
          "commentsCount": 5,
          "createdAt": "2023-01-01T00:00:00Z"
        },
        // ... 추가 질문
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      }
    }
  }
  \`\`\`

### 4.2 질문 상세 조회

- **URL**: `/community/questions/{id}`
- **Method**: `GET`
- **인증 필요**: 아니오 (인증 시 추가 정보 제공)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "question_id",
      "title": "아이가 밤에 자주 깨요",
      "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
      "category": "수면",
      "author": {
        "id": "user_id",
        "name": "사용자 이름",
        "profileImage": "프로필 이미지 URL"
      },
      "comments": [
        {
          "id": "comment_id",
          "content": "우리 아이도 그랬어요. 이렇게 해보세요...",
          "author": {
            "id": "user_id2",
            "name": "다른 사용자",
            "profileImage": "프로필 이미지 URL"
          },
          "createdAt": "2023-01-01T12:00:00Z"
        }
        // ... 추가 댓글
      ],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 4.3 질문 작성

- **URL**: `/community/questions`
- **Method**: `POST`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "title": "아이가 밤에 자주 깨요",
    "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
    "category": "수면"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "question_id",
      "title": "아이가 밤에 자주 깨요",
      "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
      "category": "수면",
      "author": {
        "id": "user_id",
        "name": "사용자 이름"
      },
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 4.4 질문 수정

- **URL**: `/community/questions/{id}`
- **Method**: `PUT`
- **인증 필요**: 예 (작성자만 가능)
- **요청 본문**:
  \`\`\`json
  {
    "title": "아이가 밤에 자주 깨요 (수정)",
    "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요? 추가 내용...",
    "category": "수면"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "question_id",
      "title": "아이가 밤에 자주 깨요 (수정)",
      "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요? 추가 내용...",
      "category": "수면",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  }
  \`\`\`

### 4.5 질문 삭제

- **URL**: `/community/questions/{id}`
- **Method**: `DELETE`
- **인증 필요**: 예 (작성자 또는 관리자만 가능)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "질문이 삭제되었습니다."
    }
  }
  \`\`\`

### 4.6 댓글 작성

- **URL**: `/community/comments`
- **Method**: `POST`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "postId": "question_id",
    "postType": "question", // "question", "story", "tip" 중 하나
    "content": "우리 아이도 그랬어요. 이렇게 해보세요..."
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "comment_id",
      "postId": "question_id",
      "postType": "question",
      "content": "우리 아이도 그랬어요. 이렇게 해보세요...",
      "author": {
        "id": "user_id",
        "name": "사용자 이름"
      },
      "createdAt": "2023-01-01T12:00:00Z"
    }
  }
  \`\`\`

### 4.7 댓글 수정

- **URL**: `/community/comments/{id}`
- **Method**: `PUT`
- **인증 필요**: 예 (작성자만 가능)
- **요청 본문**:
  \`\`\`json
  {
    "content": "우리 아이도 그랬어요. 이렇게 해보세요... (수정됨)"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "comment_id",
      "content": "우리 아이도 그랬어요. 이렇게 해보세요... (수정됨)",
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  }
  \`\`\`

### 4.8 댓글 삭제

- **URL**: `/community/comments/{id}`
- **Method**: `DELETE`
- **인증 필요**: 예 (작성자 또는 관리자만 가능)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "댓글이 삭제되었습니다."
    }
  }
  \`\`\`

### 4.9 커뮤니티 통계 조회

- **URL**: `/community/stats`
- **Method**: `GET`
- **인증 필요**: 아니오
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "totalQuestions": 120,
      "totalStories": 85,
      "totalTips": 65,
      "totalComments": 450,
      "popularCategories": [
        { "name": "수면", "count": 35 },
        { "name": "식사", "count": 28 },
        { "name": "발달", "count": 22 }
      ],
      "recentActivity": {
        "questions": 12,
        "stories": 8,
        "tips": 5,
        "comments": 45
      }
    }
  }
  \`\`\`

## 5. 전문가 조언 API

### 5.1 AI 상담 생성

- **URL**: `/expert/generate`
- **Method**: `POST`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "message": "8개월 아기가 밤에 자주 깨요. 어떻게 해야 할까요?",
    "category": "sleep"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "response": "8개월 아기의 밤중 각성은 흔한 현상입니다. 이 시기에는 분리 불안이 시작되고, 발달 도약기를 겪으면서 수면 패턴이 방해받을 수 있습니다. 일관된 취침 루틴을 만들고, 아기가 스스로 다시 잠들 수 있는 능력을 기르도록 도와주세요. 밤중 수유가 습관이 되었다면 점진적으로 줄여나가는 것도 도움이 됩니다."
    }
  }
  \`\`\`

### 5.2 AI 상담 히스토리 목록 조회

- **URL**: `/expert/history`
- **Method**: `GET`
- **인증 필요**: 예
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `category`: 카테고리 필터 (선택 사항)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "histories": [
        {
          "id": "history_id",
          "title": "아이 수면 문제에 관한 상담",
          "category": "sleep",
          "createdAt": "2023-01-01T00:00:00Z",
          "updatedAt": "2023-01-01T00:00:00Z"
        },
        // ... 추가 히스토리
      ],
      "pagination": {
        "total": 15,
        "page": 1,
        "limit": 10,
        "pages": 2
      }
    }
  }
  \`\`\`

### 5.3 AI 상담 히스토리 상세 조회

- **URL**: `/expert/history/{id}`
- **Method**: `GET`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "history_id",
      "title": "아이 수면 문제에 관한 상담",
      "category": "sleep",
      "messages": [
        {
          "role": "user",
          "content": "8개월 아기가 밤에 자주 깨요. 어떻게 해야 할까요?",
          "createdAt": "2023-01-01T00:00:00Z"
        },
        {
          "role": "assistant",
          "content": "8개월 아기의 밤중 각성은 흔한 현상입니다. 이 시기에는 분리 불안이 시작되고, 발달 도약기를 겪으면서 수면 패턴이 방해받을 수 있습니다. 일관된 취침 루틴을 만들고, 아기가 스스로 다시 잠들 수 있는 능력을 기르도록 도와주세요. 밤중 수유가 습관이 되었다면 점진적으로 줄여나가는 것도 도움이 됩니다.",
          "createdAt": "2023-01-01T00:00:10Z"
        },
        {
          "role": "user",
          "content": "취침 루틴을 어떻게 만들어야 할까요?",
          "createdAt": "2023-01-01T00:01:00Z"
        },
        {
          "role": "assistant",
          "content": "효과적인 취침 루틴은 매일 같은 시간에 비슷한 활동을 반복하는 것입니다. 예를 들어, 목욕 → 마사지 → 편안한 옷 입히기 → 조용한 방에서 책 읽기 → 자장가 → 잠자리에 눕히기 순서로 진행할 수 있습니다. 루틴은 20-30분 정도로 유지하고, 취침 시간 30분 전부터는 밝은 빛과 활발한 놀이를 피하세요. 일관성이 가장 중요합니다.",
          "createdAt": "2023-01-01T00:01:10Z"
        }
      ],
      "createdAt": "2023-01-01T00:00:00Z",
      "updatedAt": "2023-01-01T00:01:10Z"
    }
  }
  \`\`\`

### 5.4 AI 상담 히스토리 저장

- **URL**: `/expert/history`
- **Method**: `POST`
- **인증 필요**: 예
- **요청 본문**:
  \`\`\`json
  {
    "messages": [
      {
        "role": "user",
        "content": "8개월 아기가 밤에 자주 깨요. 어떻게 해야 할까요?",
        "createdAt": "2023-01-01T00:00:00Z"
      },
      {
        "role": "assistant",
        "content": "8개월 아기의 밤중 각성은 흔한 현상입니다...",
        "createdAt": "2023-01-01T00:00:10Z"
      }
    ],
    "category": "sleep"
  }
  \`\`\`
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "history_id",
      "title": "아이 수면 문제에 관한 상담",
      "category": "sleep",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 5.5 AI 상담 히스토리 삭제

- **URL**: `/expert/history/{id}`
- **Method**: `DELETE`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "상담 히스토리가 삭제되었습니다."
    }
  }
  \`\`\`

### 5.6 전문가 조언 통계 조회

- **URL**: `/expert/stats`
- **Method**: `GET`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "totalConsultations": 45,
      "byCategory": {
        "sleep": 15,
        "nutrition": 12,
        "development": 10,
        "behavior": 8
      },
      "recentActivity": {
        "lastConsultationDate": "2023-01-15",
        "consultationsThisMonth": 8
      }
    }
  }
  \`\`\`

## 6. 파일 업로드 API

### 6.1 이미지 업로드

- **URL**: `/upload`
- **Method**: `POST`
- **인증 필요**: 예
- **요청**: 멀티파트 폼 데이터 (`image` 필드에 파일 첨부)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "url": "https://storage.mapader.com/images/user_id/filename.jpg",
      "filename": "filename.jpg",
      "size": 1024000,
      "mimeType": "image/jpeg"
    }
  }
  \`\`\`

## 7. 검색 API

### 7.1 통합 검색

- **URL**: `/search`
- **Method**: `GET`
- **인증 필요**: 아니오
- **쿼리 파라미터**:
  - `query`: 검색어 (필수)
  - `type`: 검색 유형 (all, development, community, expert - 기본값: all)
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "results": {
        "development": [
          {
            "id": "record_id",
            "type": "development_record",
            "title": "첫 걸음마",
            "description": "오늘 아이가 처음으로 혼자 걸었어요!",
            "date": "2023-01-01"
          }
          // ... 추가 결과
        ],
        "community": [
          {
            "id": "question_id",
            "type": "question",
            "title": "아이가 밤에 자주 깨요",
            "content": "8개월 아기가 밤에 자주 깨는데 어떻게 해야 할까요?",
            "date": "2023-01-01"
          }
          // ... 추가 결과
        ],
        "expert": [
          {
            "id": "history_id",
            "type": "consultation",
            "title": "아이 수면 문제에 관한 상담",
            "date": "2023-01-01"
          }
          // ... 추가 결과
        ]
      },
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      }
    }
  }
  \`\`\`

## 8. 알림 API

### 8.1 알림 목록 조회

- **URL**: `/notifications`
- **Method**: `GET`
- **인증 필요**: 예
- **쿼리 파라미터**:
  - `page`: 페이지 번호 (기본값: 1)
  - `limit`: 페이지당 항목 수 (기본값: 10)
  - `read`: 읽음 상태 필터 (all, read, unread - 기본값: all)
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "notifications": [
        {
          "id": "notification_id",
          "type": "comment",
          "title": "새 댓글",
          "message": "회원님의 질문에 새 댓글이 달렸습니다.",
          "data": {
            "postId": "question_id",
            "postType": "question",
            "commentId": "comment_id"
          },
          "read": false,
          "createdAt": "2023-01-01T00:00:00Z"
        },
        // ... 추가 알림
      ],
      "pagination": {
        "total": 25,
        "page": 1,
        "limit": 10,
        "pages": 3
      },
      "unreadCount": 5
    }
  }
  \`\`\`

### 8.2 알림 읽음 표시

- **URL**: `/notifications/{id}/read`
- **Method**: `PUT`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "id": "notification_id",
      "read": true,
      "updatedAt": "2023-01-02T00:00:00Z"
    }
  }
  \`\`\`

### 8.3 모든 알림 읽음 표시

- **URL**: `/notifications/read-all`
- **Method**: `PUT`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "모든 알림이 읽음 처리되었습니다.",
      "count": 5
    }
  }
  \`\`\`

### 8.4 알림 삭제

- **URL**: `/notifications/{id}`
- **Method**: `DELETE`
- **인증 필요**: 예
- **응답**:
  \`\`\`json
  {
    "success": true,
    "data": {
      "message": "알림이 삭제되었습니다."
    }
  }
  \`\`\`

## 9. WebSocket API

### 9.1 WebSocket 연결

- **URL**: `/ws`
- **Protocol**: `WebSocket`
- **인증 필요**: 예 (쿼리 파라미터로 토큰 전달: `/ws?token=JWT_TOKEN`)
- **이벤트 유형**:
  - `connection`: 연결 성공 시
  - `message`: 새 메시지 수신 시
  - `notification`: 새 알림 수신 시
  - `typing`: 상대방 타이핑 중 알림
  - `read`: 메시지 읽음 상태 업데이트
  - `error`: 오류 발생 시
  - `disconnect`: 연결 종료 시

### 9.2 메시지 전송 (클라이언트 → 서버)

- **형식**:
  \`\`\`json
  {
    "type": "message",
    "data": {
      "content": "메시지 내용",
      "category": "sleep"
    }
  }
  \`\`\`

### 9.3 타이핑 상태 전송 (클라이언트 → 서버)

- **형식**:
  \`\`\`json
  {
    "type": "typing",
    "data": {
      "isTyping": true
    }
  }
  \`\`\`

### 9.4 메시지 읽음 상태 전송 (클라이언트 → 서버)

- **형식**:
  \`\`\`json
  {
    "type": "read",
    "data": {
      "messageId": "message_id"
    }
  }
  \`\`\`

### 9.5 메시지 수신 (서버 → 클라이언트)

- **형식**:
  \`\`\`json
  {
    "type": "message",
    "data": {
      "id": "message_id",
      "role": "assistant",
      "content": "메시지 내용",
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

### 9.6 알림 수신 (서버 → 클라이언트)

- **형식**:
  \`\`\`json
  {
    "type": "notification",
    "data": {
      "id": "notification_id",
      "type": "comment",
      "title": "새 댓글",
      "message": "회원님의 질문에 새 댓글이 달렸습니다.",
      "data": {
        "postId": "question_id",
        "postType": "question",
        "commentId": "comment_id"
      },
      "createdAt": "2023-01-01T00:00:00Z"
    }
  }
  \`\`\`

## 10. 오류 코드

- `AUTH_REQUIRED`: 인증이 필요합니다.
- `INVALID_CREDENTIALS`: 잘못된 인증 정보입니다.
- `PERMISSION_DENIED`: 권한이 없습니다.
- `RESOURCE_NOT_FOUND`: 요청한 리소스를 찾을 수 없습니다.
- `VALIDATION_ERROR`: 요청 데이터가 유효하지 않습니다.
- `DUPLICATE_ENTRY`: 중복된 데이터가 존재합니다.
- `SERVER_ERROR`: 서버 내부 오류가 발생했습니다.
- `RATE_LIMIT_EXCEEDED`: 요청 한도를 초과했습니다.
