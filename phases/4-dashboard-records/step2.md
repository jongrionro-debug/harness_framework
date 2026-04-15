# Step 2 — implement-records-browser

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_GUIDE.md`
- `phases/4-dashboard-records/index.json`
- `phases/4-dashboard-records/step0-output.json`
- `phases/4-dashboard-records/step1-output.json`

## Task
Implement the operator records browser and detail view.

Implementation requirements:
- Build `(ops)/records` so operators can:
  - browse session records
  - filter/search by relevant session dimensions
  - open a detailed record view
  - inspect attendance, journal, and attachments together
- Keep records queries organization-scoped and optimized for operator review.
- Add tests for filter/query behavior where the logic is non-trivial.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm operators can find a specific submitted record without needing dashboard-only shortcuts.
- Confirm record detail uses the same submission timestamp semantics as the dashboard.
- Confirm the records browser still works with sparse or partially configured data.

## Forbidden Actions
- Do not expose edit controls that violate teacher/operator role boundaries unless explicitly designed.
- Do not fetch cross-organization data for convenience.
- Do not collapse the records view into a single unfilterable list.
