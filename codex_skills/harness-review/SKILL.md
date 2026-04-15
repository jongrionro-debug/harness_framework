---
name: harness-review
description: Use when reviewing changes in a Harness-style repo against PRD-adjacent architecture rules and ADR technology decisions. Especially useful when the repo has docs like ARCHITECTURE.md and ADR.md and the user wants a structured implementation review.
---

# Harness Review

Use this skill when the user asks for a review of changes in a repo that follows the Harness workflow.

Typical triggers:

- "리뷰해줘"
- "변경사항 검토해줘"
- "ARCHITECTURE/ADR 기준으로 봐줘"
- "이 구현이 문서에 맞는지 확인해줘"

## What to read first

Start with:

- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `agent.md` or `CLAUDE.md` if present

Then inspect the changed files and compare them against those documents.

## Review checklist

Focus on these five checks:

1. Architecture compliance
2. Technology choice compliance
3. Test coverage for new behavior
4. Repo-specific critical rules
5. Buildability

### 1. Architecture compliance

Check whether the implementation follows the directory structure, layering, and boundaries described in `docs/ARCHITECTURE.md`.

### 2. Technology choice compliance

Check whether the change stays within the choices recorded in `docs/ADR.md`.

### 3. Test coverage

Check whether new functionality includes tests or whether a clear testing gap remains.

### 4. Critical rules

Check repo-specific critical rules from `agent.md` or `CLAUDE.md`.

### 5. Buildability

Check whether the code looks buildable and whether the expected build/test commands are present or runnable.

## Output style

Prefer a compact table when the user wants a structured review:

| 항목 | 결과 | 비고 |
|------|------|------|
| 아키텍처 준수 | ✅/❌ | 상세 |
| 기술 스택 준수 | ✅/❌ | 상세 |
| 테스트 존재 | ✅/❌ | 상세 |
| CRITICAL 규칙 | ✅/❌ | 상세 |
| 빌드 가능 | ✅/❌ | 상세 |

If you find issues, describe the fix concretely.

## Review priorities

In review mode, prioritize:

1. bugs
2. behavioral regressions
3. missing tests
4. architecture drift
5. rule violations

Keep summaries short. Findings come first.

## Do not

- Do not turn the review into a generic summary of the codebase.
- Do not ignore `docs/ARCHITECTURE.md` and `docs/ADR.md`.
- Do not focus mainly on style nits when there are correctness or architecture issues.
