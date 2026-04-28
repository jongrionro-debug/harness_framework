# Step 0 — implement-session-creation

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/3-sessions-submissions/index.json`
- `phases/2-ops-setup/index.json`
- `phases/2-ops-setup/step2-output.json`

## Task
Implement operator-driven session creation and participant snapshot persistence.

Implementation requirements:
- Add schema and services for:
  - `sessions`
  - `session_participant_snapshots`
- Build the operator flow to create a session by selecting:
  - date
  - village
  - program
  - class
  - assigned teacher
- When creating a session, copy the relevant participant list into session snapshots.
- Add tests covering snapshot behavior and organization scoping.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm later participant edits do not retroactively mutate past session snapshots.
- Confirm only organization admins can create sessions.
- Confirm session creation fails clearly when required master data is missing.

## Forbidden Actions
- Do not let sessions read directly from live participant lists at render time instead of snapshots.
- Do not add analytics summaries here.
- Do not weaken organization scoping checks for convenience.
