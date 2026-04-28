# Step 1 — build-teacher-session-workspace

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_GUIDE.md`
- `phases/3-sessions-submissions/index.json`
- `phases/3-sessions-submissions/step0-output.json`

## Task
Build the teacher-facing session workspace.

Implementation requirements:
- Add `(teacher)/sessions` and any supporting detail route needed for a teacher to:
  - view assigned sessions
  - open a session detail workspace
  - see current submission state
- Ensure teachers only see sessions assigned to them.
- Present the UI in a compact, friendly, messenger-like style rather than as a generic admin table.
- Add tests for teacher permission and assignment filtering rules.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm unassigned teachers cannot access other teachers’ sessions by URL manipulation.
- Confirm the workspace shows session identity clearly before data entry begins.
- Confirm empty states explain the next expected operator action when no sessions exist.

## Forbidden Actions
- Do not expose organization-wide records in the teacher area.
- Do not merge teacher and operator navigation into one ambiguous roleless shell.
- Do not skip access control checks because the UI hides links.
