# Step 0 — scaffold-next-app

## Read First
- `agent.md`
- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`
- `phases/0-bootstrap-foundation/index.json`

## Task
Initialize the application as a `Next.js 15 App Router + TypeScript + Tailwind CSS` project in the repo root.

Implementation requirements:
- Use a `src/` layout.
- Keep the app monolithic and local-first.
- Create the minimum viable app structure needed for later slices:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/globals.css`
  - `src/components/`
  - `src/lib/`
  - `src/server/`
  - `src/types/`
- Set up package scripts for at least `dev`, `build`, `lint`, and `test`.
- The landing page can be a simple local MVP placeholder, but it should already reflect the warm messenger-like visual direction from `docs/UI_GUIDE.md`.

## Acceptance Criteria
- `test -f package.json`
- `test -f tsconfig.json`
- `test -f src/app/layout.tsx`
- `test -f src/app/page.tsx`
- `test -f src/app/globals.css`
- `npm run lint`
- `npm run build`

## Verification
- Confirm the generated project uses the App Router, not the Pages Router.
- Confirm the default page content is customized for this product rather than left as framework boilerplate.
- Confirm there is no deployment-only setup blocking local implementation.

## Forbidden Actions
- Do not add OAuth, Resend, Vercel-specific workflows, or external CI work in this step.
- Do not introduce a separate frontend/backend repo split.
- Do not add product features beyond the initial app scaffold.
