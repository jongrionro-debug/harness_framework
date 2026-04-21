# Stitch용 현재 UI 캡처 계획

## 목적

이 문서는 Stitch가 `현재 UI를 기준으로` 재디자인할 수 있도록, 어떤 화면을 어떤 상태로 캡처해야 하는지 정리한 계획서다.

핵심 원칙은 아래와 같다.

`한 화면당 1장만 보내지 말고, empty / filled / active 상태를 같이 보내야 현재 정보 구조를 Stitch가 읽을 수 있다.`

---

## 1. 필수 캡처 대상

### A. 인증 / 온보딩

1. `/login`
2. `/signup`
3. `/organization`
4. `/approval-pending`
5. `/organization/complete`

### B. 운영자 영역

6. `/dashboard`
7. `/settings`
8. `/users`
9. `/records`
10. `/records/[sessionId]`

### C. 강사 영역

11. `/sessions`
12. `/sessions/[sessionId]`

---

## 2. 화면별로 최소한 필요한 상태

아래 4종은 가능하면 같이 캡처한다.

- empty state
- filled state
- active or selected state
- validation or feedback state

가능하면 모바일 폭도 1장씩 추가한다.

---

## 3. 화면별 상세 촬영 계획

### 3.1 `/login`

필수 상태

- 기본 로그인 화면
- 입력 완료 상태
- 에러 메시지 상태

왜 필요한가

- 인증 화면 톤과 첫인상을 Stitch가 파악할 수 있다.
- 입력 필드, 버튼, 보조 링크의 밀도를 읽을 수 있다.

### 3.2 `/signup`

필수 상태

- 기본 회원가입 화면
- 입력 완료 상태
- 성공 또는 안내 메시지 상태

왜 필요한가

- 로그인과 회원가입이 같은 패턴인지, 차별화가 필요한지 판단할 수 있다.

### 3.3 `/organization`

필수 상태

- 새 기관 만들기 카드가 보이는 기본 상태
- 초대 토큰 입력 영역이 보이는 상태
- validation 메시지 상태

왜 필요한가

- 이 화면은 제품 첫 구조를 설명하는 역할이 커서, Stitch가 온보딩 UX를 재구성할 때 중요하다.

### 3.4 `/approval-pending`

필수 상태

- 현재 승인 대기 안내 화면

왜 필요한가

- 이 화면은 메시지 중심 화면이라, 제품 톤과 상태 커뮤니케이션 방식을 보여준다.

### 3.5 `/organization/complete`

필수 상태

- 생성 완료 후 다음 액션 안내 화면

왜 필요한가

- 온보딩에서 운영 화면으로 넘어가는 전환 톤을 Stitch가 읽을 수 있다.

### 3.6 `/dashboard`

필수 상태

- 데이터가 거의 없는 초기 상태
- 데이터가 채워진 상태
- 세션 생성 폼이 잘 보이는 상태
- 최근 제출/수정/미제출 카드가 보이는 상태

왜 필요한가

- 이번 redesign에서 가장 중요도가 높은 화면 중 하나다.
- "다음 액션"과 "운영 현황"이 현재 얼마나 잘 구분되는지 보여준다.

### 3.7 `/settings`

필수 상태

- 초기 empty 상태
- 마을/프로그램/수업/참여자가 채워진 상태
- 폼 입력 중 상태

왜 필요한가

- 데이터 밀도가 높고 반복 구조가 많아, Stitch가 정보 구조를 다시 설계하기 좋은 화면이다.

### 3.8 `/users`

필수 상태

- 멤버가 거의 없는 상태
- 멤버/초대/배정이 모두 채워진 상태
- 승인 대기 멤버가 보이는 상태

왜 필요한가

- 운영자 관리 화면의 섹션 구성과 우선순위를 Stitch가 판단할 수 있다.

### 3.9 `/records`

필수 상태

- 결과가 비어 있는 상태
- 레코드가 채워진 상태
- 필터가 적용된 상태

왜 필요한가

- 검색/필터/결과 리스트 관계를 Stitch가 재설계할 수 있다.

### 3.10 `/records/[sessionId]`

필수 상태

- 출석, 교육일지, 첨부가 모두 채워진 상태
- 제출/최근 수정 시간이 잘 보이는 상태

왜 필요한가

- 운영자용 상세 화면에서 정보의 읽기 흐름을 Stitch가 이해할 수 있다.

### 3.11 `/sessions`

필수 상태

- 세션이 없는 상태
- 제출 전/제출 완료 세션이 섞여 있는 상태

왜 필요한가

- 강사용 목록 화면의 밀도와 우선순위를 Stitch가 판단할 수 있다.

### 3.12 `/sessions/[sessionId]`

필수 상태

- 기본 입력 상태
- 출석 선택이 여러 개 바뀐 상태
- 첨부가 없는 상태
- 첨부가 있는 상태
- 제출 후 수정 상태

왜 필요한가

- 이번 redesign 핵심 대상이다.
- 출석, 교육일지, 첨부, CTA 버튼의 위계가 현재 어떻게 보이는지 Stitch가 봐야 한다.

---

## 4. 캡처 방법 권장안

### 데스크톱

- 브라우저 폭 1440px 또는 1280px 기준
- 한 화면 전체가 최대한 보이게 촬영
- 필요한 경우 스크롤 상단/중단/하단을 나눠서 보조 캡처

### 모바일

- 390px 전후 폭 기준
- 최소한 핵심 화면 3개는 모바일로도 캡처

권장 모바일 우선 화면

- `/organization`
- `/dashboard`
- `/sessions/[sessionId]`

---

## 5. 파일명 규칙 권장안

캡처 파일명은 아래처럼 정리하는 것이 좋다.

```txt
01-login-default.png
02-login-error.png
03-signup-default.png
04-organization-default.png
05-organization-validation.png
06-dashboard-empty.png
07-dashboard-filled.png
08-settings-filled.png
09-users-filled.png
10-records-filtered.png
11-record-detail-filled.png
12-teacher-sessions-empty.png
13-teacher-session-detail-default.png
14-teacher-session-detail-submitted.png
```

이렇게 해야 Stitch에 설명할 때도 화면을 정확히 가리키기 쉽다.

---

## 6. Stitch 전달용 묶음 예시

실제 전달 시에는 아래 순서로 첨부하면 된다.

1. `dashboard` 관련 캡처
2. `teacher session detail` 관련 캡처
3. `records` 관련 캡처
4. 나머지 supporting 화면

즉 중요 화면을 먼저 보여주고, 그 다음 주변 화면을 붙이는 구성이 좋다.

---

## 7. 이번 프로젝트 기준 추천 우선 캡처 순서

시간이 부족하면 아래 순서대로 먼저 찍는다.

1. `/dashboard` empty
2. `/dashboard` filled
3. `/sessions/[sessionId]` default
4. `/sessions/[sessionId]` submitted
5. `/records` filled
6. `/records/[sessionId]` filled
7. `/settings` filled
8. `/users` filled
9. `/organization`
10. `/login`

이 정도만 있어도 Stitch가 현재 제품의 핵심 구조는 파악할 수 있다.

---

## 8. 최종 점검

캡처를 다 모은 뒤 아래를 확인한다.

- 운영자 핵심 흐름이 보이는가
- 강사 핵심 흐름이 보이는가
- 데이터가 없는 상태와 있는 상태가 모두 있는가
- 상태 메시지와 CTA 버튼이 잘 보이는가
- 현재 UI의 약점이 드러나는 장면이 포함되어 있는가

이 조건이 충족되면 Stitch가 "현재 UI 개선" 관점으로 작업하기 쉬워진다.
