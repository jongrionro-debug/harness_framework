# 프로젝트: harness_framework

## 기술 스택
- 프레임워크: `Next.js 15 App Router`
- 언어: `TypeScript`
- 스타일링: `Tailwind CSS`
- 인증: `Supabase Auth`
- 데이터베이스: `PostgreSQL`
- 파일 저장소: `Supabase Storage`
- ORM / Query Builder: `Drizzle ORM`
- 검증: `Zod`
- 배포 대상: `Vercel` (단, 1차 구현 목표는 로컬 MVP)

## 로컬 MVP 우선 규칙
- CRITICAL: 1차 목표는 배포가 아니라 개발자 로컬 환경에서 실제로 동작하는 MVP 구현이다.
- CRITICAL: 초기 구현 범위는 회원가입/로그인, 기관 생성 온보딩, 운영 기본정보 설정, 세션 생성, 강사 기록 제출까지다.
- CRITICAL: Vercel 배포, 실제 이메일 발송, OAuth 로그인, 외부 운영 인프라 연결은 1차 로컬 MVP 범위에 포함하지 않는다.
- CRITICAL: 구현은 항상 가장 작은 동작 가능한 흐름부터 완성하고, 로컬에서 검증 가능한 상태를 우선한다.

## 아키텍처 규칙
- CRITICAL: 모든 API 로직은 app/api/에서만
- CRITICAL: API 키는 환경변수로, 코드에 하드코딩 금지
- CRITICAL: 새 기능은 테스트 먼저 (TDD)
- CRITICAL: 기관 소속 데이터는 반드시 `organization_id` 범위 안에서만 읽고 쓴다.
- CRITICAL: 인증, 기관 생성, 운영 기본정보 설정, 세션 생성, 강사 제출 흐름을 우선 구현한다.
- 일반 규칙: UI 컴포넌트는 `components/`, 공통 타입은 `types/`, DB/권한/검증 유틸은 `lib/`와 `server/` 아래에 분리한다.

## 개발 프로세스
- CRITICAL: 새 기능 구현 시 반드시 테스트를 먼저 작성하고, 테스트가 통과하는 구현을 작성할 것 (TDD)
- 커밋 메시지는 conventional commits 형식을 따를 것 (feat:, fix:, docs:, refactor:)

## 명령어
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드
npm run lint     # ESLint
npm run test     # 테스트
