# Local Smoke Test

이 문서는 현재 레포에 구현된 local-first MVP 흐름을 빠르게 검증하기 위한 체크리스트다.

## 1. 환경 준비

1. `.env.example`를 참고해 `.env.local`을 채운다.
2. 최소 필수값:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
```

3. 첨부 업로드까지 실제로 확인하려면 선택적으로 아래도 넣는다.

```env
SUPABASE_ATTACHMENTS_BUCKET=
```

`SUPABASE_ATTACHMENTS_BUCKET`가 없으면 첨부 업로드는 조용히 실패하지 않고, 화면에 명시적 blocked 메시지를 보여준다. 현재 로컬 MVP에서는 이것도 정상 경로다.

## 2. 앱 실행

```bash
npm install
npm run db:up
npm run db:migrate
npm run dev
```

`npm run db:migrate`는 선택이 아니라, 스키마 변경이 있는 브랜치를 받았을 때 먼저 실행해야 하는 기본 단계로 취급한다. 특히 `organization_memberships.approved_at`처럼 로그인 경로에 쓰이는 컬럼이 추가되면, 앱 코드만 먼저 실행할 경우 인증 조회가 즉시 깨질 수 있다.

원하면 아래처럼 한 번에 실행해도 된다.

```bash
npm run dev:local
```

추가 검증:

```bash
npm run db:migrate
npm run test
npm run lint
npm run build
```

## 3. 인증과 기관 온보딩

1. `/signup`에서 계정을 만든다.
2. 로그인 후 membership가 없으면 `/organization`으로 이동하는지 확인한다.
3. 기관 이름과 첫 마을 이름을 입력해 기관을 생성한다.
4. 완료 화면에서 `/dashboard` 링크가 보이는지 확인한다.

기대 결과:

- `organization`
- `villages`
- `organization_memberships`
- `users`

관련 데이터가 같은 기관 범위 안에서 생성된다.

## 4. 운영 기본정보 설정

1. `/settings`에서 프로그램을 1개 이상 만든다.
2. 수업을 1개 이상 만들고 프로그램/마을을 연결한다.
3. 참여자를 최소 1명 이상 추가한다.

기대 결과:

- 비어 있는 상태에서도 첫 프로그램/첫 수업/첫 참여자 흐름이 막히지 않는다.
- 수업에 프로그램과 마을이 연결되지 않으면 이후 세션 생성에서 명확한 오류를 준다.

## 5. 사용자와 강사 배정

1. `/users`에서 초대 토큰을 만든다.
2. 같은 기관의 멤버 중 최소 1명을 `teacher` 역할로 둔다.
3. `teacher` 역할 사용자를 수업에 배정한다.

기대 결과:

- `teacher`가 아닌 사용자는 수업에 배정되지 않는다.
- 배정 정보는 기관 범위 안에서만 저장된다.

## 6. 세션 생성

1. `/dashboard`에서 날짜, 마을, 프로그램, 수업, 배정된 강사를 선택한다.
2. 세션 생성 후 최근 생성 세션에 바로 보이는지 확인한다.

기대 결과:

- `sessions` row가 생성된다.
- 세션 생성 시점의 참여자 명단이 `session_participant_snapshots`로 복사된다.
- 이후 원본 참여자 정보를 바꿔도 기존 세션 스냅샷은 그대로 유지된다.

## 7. 강사 제출 흐름

1. `teacher` 계정으로 로그인한다.
2. `/sessions`에서 자기에게 배정된 세션만 보이는지 확인한다.
3. `/sessions/[sessionId]`에서 출석과 교육일지를 입력하고 제출한다.
4. 같은 화면에서 다시 수정 저장한다.

기대 결과:

- 다른 강사의 세션 URL 직접 접근은 차단된다.
- 첫 제출에서만 `submitted_at`이 설정된다.
- 이후 수정은 `updated_at`만 바뀌고 `submitted_at`은 유지된다.

## 8. 첨부 문서 확인

1. 세션 상세 화면에서 파일을 선택해 업로드를 시도한다.

기대 결과:

- `SUPABASE_ATTACHMENTS_BUCKET`가 설정된 경우: 업로드 후 첨부 목록에 메타데이터가 보인다.
- 설정되지 않은 경우: `SUPABASE_ATTACHMENTS_BUCKET 설정이 없어 첨부 업로드를 시작할 수 없습니다.` 메시지가 보인다.

## 9. 운영자 대시보드와 레코드 검증

1. `organization_admin` 계정으로 `/dashboard`를 연다.
2. 다음 영역이 구분되어 보이는지 확인한다.
   - 다음 액션
   - 제출 상태 요약
   - 최근 제출
   - 최근 수정
   - 미제출 세션
3. `/records`에서 검색/상태/프로그램/강사 필터를 바꿔 특정 세션을 찾는다.
4. `/records/[sessionId]`에서 출석, 교육일지, 첨부 문서를 함께 확인한다.

기대 결과:

- “최근 제출”과 “최근 수정”은 같은 목록이 아니다.
- 제출 후 수정된 세션은 최근 수정에 보이지만 새 제출처럼 집계되지 않는다.
- records 상세는 편집이 아니라 검토 중심으로 보인다.

## 10. 현재 구현 범위 메모

현재 smoke path는 아래 범위까지를 기준으로 한다.

- 회원가입 / 로그인
- 기관 생성 온보딩
- settings CRUD
- 강사 역할 및 수업 배정
- 세션 생성과 명단 스냅샷
- 강사 출석 / 교육일지 제출 및 재수정
- 첨부 업로드 또는 명시적 blocked 처리
- 운영자 dashboard / records 조회

현재 문서에 없는 숨은 전제:

- 실제 이메일 발송은 아직 local-first 토큰 생성 단계다.
- 첨부 업로드 실동작은 `SUPABASE_ATTACHMENTS_BUCKET` 설정 여부에 따라 갈린다.
