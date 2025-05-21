# 마파덜(Mapader) 데이터베이스 구조

## 1. 사용자 관련 테이블

### 1.1 Users (사용자)

| 필드             | 타입         | 설명                           | 제약 조건                             |
| ---------------- | ------------ | ------------------------------ | ------------------------------------- |
| id               | UUID         | 사용자 고유 ID                 | Primary Key                           |
| email            | VARCHAR(255) | 이메일 주소                    | Unique, Not Null                      |
| password         | VARCHAR(255) | 암호화된 비밀번호              | Not Null (소셜 로그인 시 기본값 사용) |
| name             | VARCHAR(100) | 사용자 이름                    | Not Null                              |
| profile_image    | VARCHAR(255) | 프로필 이미지 URL              | Nullable                              |
| auth_provider    | VARCHAR(20)  | 인증 제공자 (local, google 등) | Not Null, Default: 'local'            |
| auth_provider_id | VARCHAR(255) | 인증 제공자 ID                 | Nullable                              |
| created_at       | TIMESTAMP    | 생성 시간                      | Not Null, Default: CURRENT_TIMESTAMP  |
| updated_at       | TIMESTAMP    | 수정 시간                      | Not Null, Default: CURRENT_TIMESTAMP  |
| last_login       | TIMESTAMP    | 마지막 로그인 시간             | Nullable                              |
| is_active        | BOOLEAN      | 활성 상태                      | Not Null, Default: true               |
| is_admin         | BOOLEAN      | 관리자 여부                    | Not Null, Default: false              |

### 1.2 UserSettings (사용자 설정)

| 필드               | 타입        | 설명                          | 제약 조건                            |
| ------------------ | ----------- | ----------------------------- | ------------------------------------ |
| id                 | UUID        | 설정 고유 ID                  | Primary Key                          |
| user_id            | UUID        | 사용자 ID                     | Foreign Key (Users.id), Not Null     |
| notification_email | BOOLEAN     | 이메일 알림 수신 여부         | Not Null, Default: true              |
| notification_push  | BOOLEAN     | 푸시 알림 수신 여부           | Not Null, Default: true              |
| theme              | VARCHAR(20) | UI 테마 (light, dark, system) | Not Null, Default: 'system'          |
| language           | VARCHAR(10) | 언어 설정                     | Not Null, Default: 'ko'              |
| created_at         | TIMESTAMP   | 생성 시간                     | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at         | TIMESTAMP   | 수정 시간                     | Not Null, Default: CURRENT_TIMESTAMP |

### 1.3 UserChildren (사용자 자녀 정보)

| 필드       | 타입         | 설명              | 제약 조건                            |
| ---------- | ------------ | ----------------- | ------------------------------------ |
| id         | UUID         | 자녀 정보 고유 ID | Primary Key                          |
| user_id    | UUID         | 사용자 ID         | Foreign Key (Users.id), Not Null     |
| name       | VARCHAR(100) | 자녀 이름         | Not Null                             |
| birth_date | DATE         | 생년월일          | Not Null                             |
| gender     | VARCHAR(10)  | 성별              | Nullable                             |
| created_at | TIMESTAMP    | 생성 시간         | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | 수정 시간         | Not Null, Default: CURRENT_TIMESTAMP |

### 1.4 Sessions (세션)

| 필드        | 타입         | 설명         | 제약 조건                            |
| ----------- | ------------ | ------------ | ------------------------------------ |
| id          | UUID         | 세션 고유 ID | Primary Key                          |
| user_id     | UUID         | 사용자 ID    | Foreign Key (Users.id), Not Null     |
| token       | VARCHAR(255) | 세션 토큰    | Not Null                             |
| device_info | JSONB        | 기기 정보    | Nullable                             |
| ip_address  | VARCHAR(45)  | IP 주소      | Nullable                             |
| expires_at  | TIMESTAMP    | 만료 시간    | Not Null                             |
| created_at  | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP |

## 2. 발달 모니터링 관련 테이블

### 2.1 DevelopmentRecords (발달 기록)

| 필드             | 타입         | 설명         | 제약 조건                               |
| ---------------- | ------------ | ------------ | --------------------------------------- |
| id               | UUID         | 기록 고유 ID | Primary Key                             |
| user_id          | UUID         | 사용자 ID    | Foreign Key (Users.id), Not Null        |
| child_id         | UUID         | 자녀 ID      | Foreign Key (UserChildren.id), Not Null |
| date             | DATE         | 기록 날짜    | Not Null                                |
| age_group        | VARCHAR(50)  | 연령 그룹    | Not Null                                |
| development_area | VARCHAR(50)  | 발달 영역    | Nullable                                |
| title            | VARCHAR(200) | 제목         | Not Null                                |
| description      | TEXT         | 상세 내용    | Not Null                                |
| record_type      | VARCHAR(50)  | 기록 유형    | Not Null, Default: 'development_record' |
| created_at       | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP    |
| updated_at       | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP    |

### 2.2 DevelopmentRecordImages (발달 기록 이미지)

| 필드       | 타입         | 설명           | 제약 조건                                     |
| ---------- | ------------ | -------------- | --------------------------------------------- |
| id         | UUID         | 이미지 고유 ID | Primary Key                                   |
| record_id  | UUID         | 발달 기록 ID   | Foreign Key (DevelopmentRecords.id), Not Null |
| image_url  | VARCHAR(255) | 이미지 URL     | Not Null                                      |
| order      | INTEGER      | 이미지 순서    | Not Null, Default: 0                          |
| created_at | TIMESTAMP    | 생성 시간      | Not Null, Default: CURRENT_TIMESTAMP          |

### 2.3 DevelopmentMilestones (발달 이정표)

| 필드             | 타입         | 설명           | 제약 조건                            |
| ---------------- | ------------ | -------------- | ------------------------------------ |
| id               | UUID         | 이정표 고유 ID | Primary Key                          |
| age_group        | VARCHAR(50)  | 연령 그룹      | Not Null                             |
| development_area | VARCHAR(50)  | 발달 영역      | Not Null                             |
| title            | VARCHAR(200) | 이정표 제목    | Not Null                             |
| description      | TEXT         | 이정표 설명    | Not Null                             |
| order            | INTEGER      | 표시 순서      | Not Null, Default: 0                 |
| created_at       | TIMESTAMP    | 생성 시간      | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at       | TIMESTAMP    | 수정 시간      | Not Null, Default: CURRENT_TIMESTAMP |

### 2.4 ChildMilestones (자녀별 이정표 달성)

| 필드          | 타입      | 설명         | 제약 조건                                        |
| ------------- | --------- | ------------ | ------------------------------------------------ |
| id            | UUID      | 달성 고유 ID | Primary Key                                      |
| child_id      | UUID      | 자녀 ID      | Foreign Key (UserChildren.id), Not Null          |
| milestone_id  | UUID      | 이정표 ID    | Foreign Key (DevelopmentMilestones.id), Not Null |
| achieved_date | DATE      | 달성 날짜    | Not Null                                         |
| notes         | TEXT      | 메모         | Nullable                                         |
| created_at    | TIMESTAMP | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP             |
| updated_at    | TIMESTAMP | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP             |

## 3. 커뮤니티 관련 테이블

### 3.1 Questions (질문)

| 필드         | 타입         | 설명         | 제약 조건                            |
| ------------ | ------------ | ------------ | ------------------------------------ |
| id           | UUID         | 질문 고유 ID | Primary Key                          |
| user_id      | UUID         | 작성자 ID    | Foreign Key (Users.id), Not Null     |
| title        | VARCHAR(200) | 제목         | Not Null                             |
| content      | TEXT         | 내용         | Not Null                             |
| category     | VARCHAR(50)  | 카테고리     | Not Null                             |
| view_count   | INTEGER      | 조회수       | Not Null, Default: 0                 |
| is_anonymous | BOOLEAN      | 익명 여부    | Not Null, Default: false             |
| is_solved    | BOOLEAN      | 해결 여부    | Not Null, Default: false             |
| created_at   | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at   | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP |

### 3.2 Stories (이야기)

| 필드         | 타입         | 설명           | 제약 조건                            |
| ------------ | ------------ | -------------- | ------------------------------------ |
| id           | UUID         | 이야기 고유 ID | Primary Key                          |
| user_id      | UUID         | 작성자 ID      | Foreign Key (Users.id), Not Null     |
| title        | VARCHAR(200) | 제목           | Not Null                             |
| content      | TEXT         | 내용           | Not Null                             |
| category     | VARCHAR(50)  | 카테고리       | Not Null                             |
| view_count   | INTEGER      | 조회수         | Not Null, Default: 0                 |
| is_anonymous | BOOLEAN      | 익명 여부      | Not Null, Default: false             |
| created_at   | TIMESTAMP    | 생성 시간      | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at   | TIMESTAMP    | 수정 시간      | Not Null, Default: CURRENT_TIMESTAMP |

### 3.3 Tips (팁)

| 필드         | 타입         | 설명       | 제약 조건                            |
| ------------ | ------------ | ---------- | ------------------------------------ |
| id           | UUID         | 팁 고유 ID | Primary Key                          |
| user_id      | UUID         | 작성자 ID  | Foreign Key (Users.id), Not Null     |
| title        | VARCHAR(200) | 제목       | Not Null                             |
| content      | TEXT         | 내용       | Not Null                             |
| category     | VARCHAR(50)  | 카테고리   | Not Null                             |
| view_count   | INTEGER      | 조회수     | Not Null, Default: 0                 |
| is_anonymous | BOOLEAN      | 익명 여부  | Not Null, Default: false             |
| created_at   | TIMESTAMP    | 생성 시간  | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at   | TIMESTAMP    | 수정 시간  | Not Null, Default: CURRENT_TIMESTAMP |

### 3.4 Comments (댓글)

| 필드         | 타입        | 설명                               | 제약 조건                            |
| ------------ | ----------- | ---------------------------------- | ------------------------------------ |
| id           | UUID        | 댓글 고유 ID                       | Primary Key                          |
| user_id      | UUID        | 작성자 ID                          | Foreign Key (Users.id), Not Null     |
| post_id      | UUID        | 게시물 ID                          | Not Null                             |
| post_type    | VARCHAR(20) | 게시물 유형 (question, story, tip) | Not Null                             |
| content      | TEXT        | 내용                               | Not Null                             |
| is_anonymous | BOOLEAN     | 익명 여부                          | Not Null, Default: false             |
| parent_id    | UUID        | 부모 댓글 ID (대댓글용)            | Foreign Key (Comments.id), Nullable  |
| created_at   | TIMESTAMP   | 생성 시간                          | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at   | TIMESTAMP   | 수정 시간                          | Not Null, Default: CURRENT_TIMESTAMP |

### 3.5 PostImages (게시물 이미지)

| 필드       | 타입         | 설명                               | 제약 조건                            |
| ---------- | ------------ | ---------------------------------- | ------------------------------------ |
| id         | UUID         | 이미지 고유 ID                     | Primary Key                          |
| post_id    | UUID         | 게시물 ID                          | Not Null                             |
| post_type  | VARCHAR(20)  | 게시물 유형 (question, story, tip) | Not Null                             |
| image_url  | VARCHAR(255) | 이미지 URL                         | Not Null                             |
| order      | INTEGER      | 이미지 순서                        | Not Null, Default: 0                 |
| created_at | TIMESTAMP    | 생성 시간                          | Not Null, Default: CURRENT_TIMESTAMP |

### 3.6 Likes (좋아요)

| 필드        | 타입        | 설명                                      | 제약 조건                            |
| ----------- | ----------- | ----------------------------------------- | ------------------------------------ |
| id          | UUID        | 좋아요 고유 ID                            | Primary Key                          |
| user_id     | UUID        | 사용자 ID                                 | Foreign Key (Users.id), Not Null     |
| target_id   | UUID        | 대상 ID                                   | Not Null                             |
| target_type | VARCHAR(20) | 대상 유형 (question, story, tip, comment) | Not Null                             |
| created_at  | TIMESTAMP   | 생성 시간                                 | Not Null, Default: CURRENT_TIMESTAMP |

## 4. 전문가 조언 관련 테이블

### 4.1 ConsultationHistory (상담 히스토리)

| 필드       | 타입         | 설명         | 제약 조건                            |
| ---------- | ------------ | ------------ | ------------------------------------ |
| id         | UUID         | 상담 고유 ID | Primary Key                          |
| user_id    | UUID         | 사용자 ID    | Foreign Key (Users.id), Not Null     |
| title      | VARCHAR(200) | 제목         | Not Null                             |
| category   | VARCHAR(50)  | 카테고리     | Not Null                             |
| created_at | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP |

### 4.2 ConsultationMessages (상담 메시지)

| 필드            | 타입        | 설명                   | 제약 조건                                      |
| --------------- | ----------- | ---------------------- | ---------------------------------------------- |
| id              | UUID        | 메시지 고유 ID         | Primary Key                                    |
| consultation_id | UUID        | 상담 ID                | Foreign Key (ConsultationHistory.id), Not Null |
| role            | VARCHAR(20) | 역할 (user, assistant) | Not Null                                       |
| content         | TEXT        | 내용                   | Not Null                                       |
| created_at      | TIMESTAMP   | 생성 시간              | Not Null, Default: CURRENT_TIMESTAMP           |

### 4.3 ConsultationFeedback (상담 피드백)

| 필드            | 타입      | 설명           | 제약 조건                                      |
| --------------- | --------- | -------------- | ---------------------------------------------- |
| id              | UUID      | 피드백 고유 ID | Primary Key                                    |
| consultation_id | UUID      | 상담 ID        | Foreign Key (ConsultationHistory.id), Not Null |
| rating          | INTEGER   | 평점 (1-5)     | Not Null                                       |
| feedback        | TEXT      | 피드백 내용    | Nullable                                       |
| created_at      | TIMESTAMP | 생성 시간      | Not Null, Default: CURRENT_TIMESTAMP           |
| updated_at      | TIMESTAMP | 수정 시간      | Not Null, Default: CURRENT_TIMESTAMP           |

## 5. 알림 관련 테이블

### 5.1 Notifications (알림)

| 필드       | 타입         | 설명         | 제약 조건                            |
| ---------- | ------------ | ------------ | ------------------------------------ |
| id         | UUID         | 알림 고유 ID | Primary Key                          |
| user_id    | UUID         | 수신자 ID    | Foreign Key (Users.id), Not Null     |
| type       | VARCHAR(50)  | 알림 유형    | Not Null                             |
| title      | VARCHAR(200) | 제목         | Not Null                             |
| message    | TEXT         | 내용         | Not Null                             |
| data       | JSONB        | 추가 데이터  | Nullable                             |
| read       | BOOLEAN      | 읽음 여부    | Not Null, Default: false             |
| created_at | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP |

## 6. 파일 관련 테이블

### 6.1 Files (파일)

| 필드              | 타입         | 설명               | 제약 조건                            |
| ----------------- | ------------ | ------------------ | ------------------------------------ |
| id                | UUID         | 파일 고유 ID       | Primary Key                          |
| user_id           | UUID         | 업로더 ID          | Foreign Key (Users.id), Not Null     |
| filename          | VARCHAR(255) | 파일명             | Not Null                             |
| original_filename | VARCHAR(255) | 원본 파일명        | Not Null                             |
| url               | VARCHAR(255) | 파일 URL           | Not Null                             |
| mime_type         | VARCHAR(100) | MIME 타입          | Not Null                             |
| size              | BIGINT       | 파일 크기 (바이트) | Not Null                             |
| created_at        | TIMESTAMP    | 생성 시간          | Not Null, Default: CURRENT_TIMESTAMP |

## 7. 검색 관련 테이블

### 7.1 SearchLogs (검색 로그)

| 필드          | 타입         | 설명         | 제약 조건                            |
| ------------- | ------------ | ------------ | ------------------------------------ |
| id            | UUID         | 로그 고유 ID | Primary Key                          |
| user_id       | UUID         | 사용자 ID    | Foreign Key (Users.id), Nullable     |
| query         | VARCHAR(255) | 검색어       | Not Null                             |
| type          | VARCHAR(50)  | 검색 유형    | Not Null, Default: 'all'             |
| results_count | INTEGER      | 결과 수      | Not Null, Default: 0                 |
| created_at    | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |

## 8. 시스템 관련 테이블

### 8.1 SystemSettings (시스템 설정)

| 필드        | 타입         | 설명         | 제약 조건                            |
| ----------- | ------------ | ------------ | ------------------------------------ |
| id          | UUID         | 설정 고유 ID | Primary Key                          |
| key         | VARCHAR(100) | 설정 키      | Not Null, Unique                     |
| value       | TEXT         | 설정 값      | Not Null                             |
| description | TEXT         | 설명         | Nullable                             |
| created_at  | TIMESTAMP    | 생성 시간    | Not Null, Default: CURRENT_TIMESTAMP |
| updated_at  | TIMESTAMP    | 수정 시간    | Not Null, Default: CURRENT_TIMESTAMP |

### 8.2 ApiLogs (API 로그)

| 필드          | 타입         | 설명           | 제약 조건                            |
| ------------- | ------------ | -------------- | ------------------------------------ |
| id            | UUID         | 로그 고유 ID   | Primary Key                          |
| user_id       | UUID         | 사용자 ID      | Foreign Key (Users.id), Nullable     |
| endpoint      | VARCHAR(255) | API 엔드포인트 | Not Null                             |
| method        | VARCHAR(10)  | HTTP 메서드    | Not Null                             |
| status_code   | INTEGER      | 상태 코드      | Not Null                             |
| response_time | INTEGER      | 응답 시간 (ms) | Not Null                             |
| ip_address    | VARCHAR(45)  | IP 주소        | Nullable                             |
| user_agent    | TEXT         | User-Agent     | Nullable                             |
| created_at    | TIMESTAMP    | 생성 시간      | Not Null, Default: CURRENT_TIMESTAMP |

## 9. 테이블 관계도

\`\`\`
Users 1 --- _ UserSettings
Users 1 --- _ UserChildren
Users 1 --- _ Sessions
Users 1 --- _ DevelopmentRecords
Users 1 --- _ Questions
Users 1 --- _ Stories
Users 1 --- _ Tips
Users 1 --- _ Comments
Users 1 --- _ ConsultationHistory
Users 1 --- _ Notifications
Users 1 --- _ Files
Users 1 --- _ Likes
Users 1 --- \* SearchLogs

UserChildren 1 --- _ DevelopmentRecords
UserChildren 1 --- _ ChildMilestones

DevelopmentRecords 1 --- \* DevelopmentRecordImages

Questions 1 --- _ Comments
Stories 1 --- _ Comments
Tips 1 --- \* Comments

ConsultationHistory 1 --- \* ConsultationMessages
ConsultationHistory 1 --- 1 ConsultationFeedback

Comments 1 --- \* Comments (self-referencing for replies)
\`\`\`

## 10. 인덱스 및 제약 조건

### 10.1 인덱스

- `Users`: email, auth_provider_id
- `UserChildren`: user_id, birth_date
- `DevelopmentRecords`: user_id, child_id, date, development_area, record_type
- `Questions`: user_id, category, created_at
- `Stories`: user_id, category, created_at
- `Tips`: user_id, category, created_at
- `Comments`: user_id, post_id, post_type, parent_id
- `ConsultationHistory`: user_id, category, created_at
- `ConsultationMessages`: consultation_id, role
- `Notifications`: user_id, read, created_at
- `SearchLogs`: query, created_at

### 10.2 외래 키 제약 조건

- `UserSettings.user_id` → `Users.id` (CASCADE DELETE)
- `UserChildren.user_id` → `Users.id` (CASCADE DELETE)
- `Sessions.user_id` → `Users.id` (CASCADE DELETE)
- `DevelopmentRecords.user_id` → `Users.id` (CASCADE DELETE)
- `DevelopmentRecords.child_id` → `UserChildren.id` (CASCADE DELETE)
- `DevelopmentRecordImages.record_id` → `DevelopmentRecords.id` (CASCADE DELETE)
- `ChildMilestones.child_id` → `UserChildren.id` (CASCADE DELETE)
- `ChildMilestones.milestone_id` → `DevelopmentMilestones.id` (RESTRICT)
- `Questions.user_id` → `Users.id` (SET NULL)
- `Stories.user_id` → `Users.id` (SET NULL)
- `Tips.user_id` → `Users.id` (SET NULL)
- `Comments.user_id` → `Users.id` (SET NULL)
- `Comments.parent_id` → `Comments.id` (SET NULL)
- `Likes.user_id` → `Users.id` (CASCADE DELETE)
- `ConsultationHistory.user_id` → `Users.id` (CASCADE DELETE)
- `ConsultationMessages.consultation_id` → `ConsultationHistory.id` (CASCADE DELETE)
- `ConsultationFeedback.consultation_id` → `ConsultationHistory.id` (CASCADE DELETE)
- `Notifications.user_id` → `Users.id` (CASCADE DELETE)
- `Files.user_id` → `Users.id` (SET NULL)

## 11. 데이터베이스 최적화 고려사항

### 11.1 파티셔닝

- `ConsultationMessages`: 상담 메시지가 많아질 경우 consultation_id 또는 created_at 기준으로 파티셔닝
- `Notifications`: 알림이 많아질 경우 user_id 또는 created_at 기준으로 파티셔닝
- `ApiLogs`: 로그가 많아질 경우 created_at 기준으로 파티셔닝

### 11.2 캐싱 전략

- 자주 조회되는 데이터 (최근 게시물, 인기 게시물, 사용자 프로필 등)는 Redis 등을 활용하여 캐싱
- 세션 정보는 Redis에 저장하여 빠른 접근 및 만료 처리
- API 응답 캐싱으로 반복 요청 최적화

### 11.3 성능 최적화

- 대용량 텍스트 필드(content 등)는 압축 고려
- 자주 사용되는 쿼리에 대한 복합 인덱스 생성
- 필요에 따라 읽기 전용 복제본 활용
- 대용량 테이블은 주기적인 아카이빙 전략 수립
