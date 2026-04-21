# Stitch 전달 체크리스트

## 목적

이 문서는 `harness_framework`의 UI를 Stitch로 다시 설계하거나 개선 요청할 때, 무엇을 어떤 순서로 넘겨야 하는지 빠르게 점검하기 위한 체크리스트다.

핵심 원칙은 아래 한 줄로 정리된다.

`문서만 보내지 말고, 현재 화면 증거와 바꾸고 싶은 이유를 함께 보낸다.`

---

## 1. 반드시 보내야 하는 것

### A. 현재 UI 스크린샷

Stitch는 현재 화면을 보지 못하면 "개선"이 아니라 "새 상상 기반 재디자인"을 하게 된다.

아래 화면은 최소한 보내야 한다.

- `/login`
- `/signup`
- `/organization`
- `/approval-pending`
- `/dashboard`
- `/settings`
- `/users`
- `/sessions`
- `/sessions/[sessionId]`
- `/records`
- `/records/[sessionId]`

가능하면 각 화면마다 아래 상태도 함께 보낸다.

- empty state
- data-filled state
- selected or active state
- validation or error state
- mobile width state

### B. 시스템 설명 문서

아래 문서는 Stitch가 제품 구조를 이해하는 데 필요하다.

- [SYSTEM_REPORT.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/SYSTEM_REPORT.md)
- [PRD.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/PRD.md)
- [UI_GUIDE.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/UI_GUIDE.md)

각 문서의 역할은 아래와 같다.

- `SYSTEM_REPORT.md`: 현재 시스템 구조, 역할별 화면 흐름, 실제 구현 범위 설명
- `PRD.md`: 어떤 사용자가 어떤 문제를 해결하는 제품인지 설명
- `UI_GUIDE.md`: 시각적 톤, 금지 패턴, 색상/형태 언어 설명

### C. 변경 의도

반드시 한두 문장이라도 함께 적는다.

예:

- 현재 운영자 대시보드가 한눈에 스캔되기보다 카드가 분산되어 보인다.
- 강사 세션 상세는 더 짧고 빠른 입력 흐름으로 다시 정리하고 싶다.
- 현재 구조는 유지하되 정보 우선순위와 시각 밀도만 재정리하고 싶다.

---

## 2. 있으면 훨씬 좋아지는 것

### A. 화면 우선순위

Stitch에 아래처럼 우선순위를 적어 주면 결과가 좋아진다.

- 1순위: `/dashboard`
- 2순위: `/sessions/[sessionId]`
- 3순위: `/records`

### B. 유지할 것 / 바꿀 것

아래 형식으로 짧게 주는 게 좋다.

유지할 것

- 운영자와 강사의 화면 구조 분리
- 메신저형, 따뜻한 운영툴 톤
- 노란 accent 기반 브랜드 방향

바꿀 것

- 정보 계층 재정리
- 상태 표현의 선명도
- 리스트와 상세 패널의 밀도

### C. 제약사항

현재 프로젝트 제약도 알려주는 게 좋다.

- Next.js + Tailwind 기반 구현 유지
- 과한 글래스모피즘 금지
- 전형적인 보라색 SaaS 대시보드 금지
- 운영 화면은 데스크톱 우선이지만 모바일도 깨지지 않아야 함

---

## 3. Stitch에 보낼 순서

권장 순서는 아래다.

1. 제품 요약 3~5문장
2. 현재 UI 스크린샷 묶음
3. `SYSTEM_REPORT.md`
4. `PRD.md` 핵심 범위
5. `UI_GUIDE.md`
6. 바꾸고 싶은 이유
7. 우선 redesign 대상 화면 2~3개

---

## 4. 최소 전달 패키지

시간이 없으면 아래만 보내도 된다.

- 현재 화면 스크린샷 10장 내외
- [SYSTEM_REPORT.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/SYSTEM_REPORT.md)
- [UI_GUIDE.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/UI_GUIDE.md)
- 아래 한 문단

```txt
이 프로젝트는 지역 교육 프로그램 운영 시스템입니다. 운영자와 강사가 같은 인증 시스템을 쓰지만 화면 역할은 분리되어 있습니다. 운영자는 기관 생성, 기본정보 설정, 사용자 관리, 세션 생성, 기록 조회를 담당하고, 강사는 배정된 세션의 출석/교육일지/첨부를 제출합니다. 현재 UI를 첨부한 스크린샷 기준으로 개선하고 싶고, 정보 우선순위와 시각 밀도를 재정리하되 따뜻한 메신저형 운영툴 톤은 유지해 주세요.
```

---

## 5. 보내면 안 좋은 것

아래는 보통 Stitch에 직접 보내지 않아도 된다.

- `scripts/execute.py` 같은 실행 스크립트
- 전체 테스트 파일
- DB 마이그레이션 SQL 전문
- 구현 세부 로직 전체
- 중요도 낮은 내부 메모

이 정보들은 UI 재설계에 직접 필요하지 않다.

---

## 6. 최종 점검

아래 질문에 모두 `예`면 Stitch에 보낼 준비가 된 상태다.

- 현재 UI 스크린샷이 있는가
- 운영자와 강사 플로우가 설명되어 있는가
- 현재 제품이 무엇을 하는지 5문장 안으로 설명 가능한가
- 어떤 톤으로 디자인해야 하는지 전달했는가
- 무엇을 유지하고 무엇을 바꾸고 싶은지 적었는가
- 우선 redesign할 화면이 정해졌는가

---

## 7. 권장 파일 묶음

Stitch 전달용 폴더를 따로 만든다면 아래 구성이 가장 깔끔하다.

```txt
stitch-handoff/
  01-product-summary.md
  02-current-ui-screens/
  03-system-report.md
  04-prd-excerpt.md
  05-ui-guide.md
  06-redesign-goals.md
```

이 저장소 안에서는 아래 문서를 그대로 활용하면 된다.

- [SYSTEM_REPORT.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/SYSTEM_REPORT.md)
- [PRD.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/PRD.md)
- [UI_GUIDE.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/UI_GUIDE.md)
- [STITCH_PROMPT.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/STITCH_PROMPT.md)
- [STITCH_SCREENSHOT_PLAN.md](/Users/nojonghyeon/Documents/GitHub/harness_framework/docs/STITCH_SCREENSHOT_PLAN.md)
