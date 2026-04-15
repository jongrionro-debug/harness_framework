# Step 0 — build-dashboard-query-layer

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/4-dashboard-records/index.json`
- `phases/3-sessions-submissions/index.json`
- `phases/3-sessions-submissions/step3-output.json`

## Task
Build the operator dashboard query and service layer.

Implementation requirements:
- Add the organization-scoped queries needed for:
  - recent submissions
  - recent updates
  - missing / pending submission status
  - high-level operator counts needed by the MVP
- Keep dashboard semantics aligned with the ADR distinction between recent submissions and recent modifications.
- Add tests for query-layer organization scoping and timestamp semantics.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm “recent submissions” and “recent updates” are not backed by the exact same query.
- Confirm teacher edits after first submission appear in recent updates without looking like new submissions.
- Confirm all queries are organization-scoped.

## Forbidden Actions
- Do not add speculative analytics beyond the MVP.
- Do not compute dashboard state in client-only code when the logic belongs in the server/query layer.
- Do not ignore timestamp edge cases.
