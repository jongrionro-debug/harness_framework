# Step 1 — build-master-data-settings

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/UI_GUIDE.md`
- `phases/2-ops-setup/index.json`
- `phases/2-ops-setup/step0-output.json`

## Task
Build the operator settings experience for organization master data.

Implementation requirements:
- Implement `(ops)/settings` pages or subroutes for:
  - villages
  - programs
  - classes
  - participants
- Focus on local MVP CRUD flows with clear empty states and compact list/detail editing.
- Reuse the shared shell and visual language from the UI guide.
- Add organization-aware query and mutation services under the repo’s server/lib structure.
- Add tests for critical settings actions or service-layer rules.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the settings flow works when the organization starts with no master data.
- Confirm form validation errors are clear and local to the field or action.
- Confirm operators only see their own organization’s data.

## Forbidden Actions
- Do not add teacher-facing session UI here.
- Do not introduce a heavy dashboard before master data management works.
- Do not put API business logic outside the architecture-approved server/API layers.
