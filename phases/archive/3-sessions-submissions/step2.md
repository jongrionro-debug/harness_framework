# Step 2 — save-attendance-and-journal

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/3-sessions-submissions/index.json`
- `phases/3-sessions-submissions/step0-output.json`
- `phases/3-sessions-submissions/step1-output.json`

## Task
Implement the core teacher submission payload for attendance and lesson journal data.

Implementation requirements:
- Add schema and services for:
  - `attendance_records`
  - `lesson_journals`
- Let teachers record attendance against the session snapshot participants.
- Let teachers write and edit the lesson journal for the session.
- Support first submission and later edits while preserving the ADR rule:
  - `submitted_at` is set on first final submission
  - later edits update `updated_at` only
- Add tests for submission timestamp behavior and teacher authorization.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm records are tied to session snapshots, not to mutable global participants.
- Confirm the same teacher can reopen and edit a previously submitted record.
- Confirm the first submission time is not overwritten by later edits.

## Forbidden Actions
- Do not introduce draft-save behavior in this step.
- Do not add audit-history/version tables unless explicitly required later.
- Do not let operators bypass the domain rules by writing directly in UI components.
