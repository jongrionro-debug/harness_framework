# Step 3 — add-attachments-and-submit-rules

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ENV_SETUP.md`
- `phases/3-sessions-submissions/index.json`
- `phases/3-sessions-submissions/step2-output.json`

## Task
Add attachment handling and finish the final submission workflow.

Implementation requirements:
- Add schema and services for `attachments`.
- Implement file upload support appropriate for the local MVP path.
- If live storage configuration is unavailable, provide a blocked-or-mocked path that preserves the executor contract rather than inventing fake production behavior.
- Ensure the final submission action validates attendance, journal content, and attachment metadata consistently.
- Add tests for attachment metadata validation and submit-rule enforcement.

## Acceptance Criteria
- `npm run test`
- `npm run lint`
- `npm run build`

## Verification
- Confirm file metadata remains organization and session scoped.
- Confirm missing storage configuration is handled explicitly rather than failing silently.
- Confirm the session record can still be edited after final submission without resetting `submitted_at`.

## Forbidden Actions
- Do not hardcode storage buckets, secrets, or fake public URLs in source.
- Do not skip validation because files are “optional.”
- Do not claim real email or webhook integrations are supported here.
