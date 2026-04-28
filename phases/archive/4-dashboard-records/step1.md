# Step 1 — implement-dashboard-ui

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/UI_GUIDE.md`
- `phases/4-dashboard-records/index.json`
- `phases/4-dashboard-records/step0-output.json`

## Task
Implement the operator dashboard UI using the newly added query layer.

Implementation requirements:
- Build `(ops)/dashboard` with clear sections for:
  - next actions / setup gaps
  - recent submissions
  - recent updates
  - submission status overview
- Follow the compact messenger-like design language from the UI guide.
- Use chips, grouped panels, and list/detail style composition instead of a wall of identical cards.
- Add tests for any non-trivial formatting or empty-state logic you introduce.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm empty states still help a newly onboarded organization that has little or no data.
- Confirm the most important operator action is obvious above decorative styling.
- Confirm the dashboard remains legible on both desktop and narrow widths.

## Forbidden Actions
- Do not use purple SaaS styling or glassmorphism.
- Do not bury recent updates inside generic metric cards.
- Do not add charts that are unsupported by the available data.
