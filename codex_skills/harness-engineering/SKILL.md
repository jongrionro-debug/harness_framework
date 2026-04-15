---
name: harness-engineering
description: Use when working in a repo that follows the Harness workflow with PRD, ARCHITECTURE, ADR, phase planning, and step-by-step execution through scripts/execute.py. Especially useful for turning product docs into implementation slices, creating phases/index.json and step files, and implementing work in small, self-contained steps.
---

# Harness Engineering

Use this skill when the repo follows a document-first workflow and implementation should be driven by:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `phases/`
- `scripts/execute.py`

This skill is optimized for repos like `harness_framework`, where work should move from product definition to implementation slices instead of jumping straight into large code changes.

## Core workflow

### 1. Explore first

Before planning or coding, read the product and system docs to understand intent.

Start with:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `agent.md` if present

If the repo already has `phases/`, also read the relevant task index and earlier completed steps before changing anything.

### 2. Discuss unresolved decisions

If implementation still depends on product or technical decisions, pause and ask the user.

Do not invent missing requirements when they materially affect:

- data model
- permissions
- workflow branching
- external integrations
- acceptance criteria

### 3. Plan in slices

When asked to create an implementation plan, break work into small self-contained steps.

Step design rules:

1. Keep scope narrow. One step should usually touch one layer or one module.
2. Make each step self-contained. Assume it may run in a fresh session.
3. List the files that must be read before work starts.
4. Specify interface-level expectations and non-negotiable rules, not over-detailed implementation.
5. Acceptance criteria must use real commands.
6. Warnings must be concrete: say what not to do and why.
7. Step names should use short kebab-case slugs.

### 4. Create Harness artifacts

When the user approves a plan, create:

- `phases/index.json`
- `phases/{phase-name}/index.json`
- `phases/{phase-name}/step{N}.md`

Keep statuses aligned with the executor contract:

- `pending`
- `completed`
- `error`
- `blocked`

For completed steps, summaries should help the next step understand what was produced.

### 5. Execute carefully

If the user wants execution through the harness, use:

```bash
python3 scripts/execute.py <phase-name>
```

or

```bash
python3 scripts/execute.py <phase-name> --push
```

Treat the executor as the source of truth for:

- branch creation
- step retries
- prompt guardrails
- timestamp updates
- metadata updates

## Step file expectations

A good step file should include:

- step title
- files to read first
- concrete task instructions
- acceptance criteria with executable commands
- verification procedure
- explicit forbidden actions

Avoid phrases like:

- "as discussed earlier"
- "continue from previous conversation"

Everything needed for the step should live inside the step file itself.

## Review mode

When the user asks for a review in a Harness repo, check changes against:

- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `agent.md` or `CLAUDE.md` if present

Focus on:

1. architecture compliance
2. technology choice compliance
3. tests for new behavior
4. repo-specific critical rules
5. buildability

## Repo-specific notes for harness_framework

In `harness_framework`, the intended flow is:

1. product docs first
2. architecture and ADR alignment
3. phase planning
4. step execution
5. implementation in small vertical slices

Prefer working from these documents before making structural changes:

- `docs/PRD.md`
- `docs/ARCHITECTURE.md`
- `docs/ADR.md`
- `docs/UI_GUIDE.md`
- `docs/ENV_SETUP.md`

If the repo is still at the document stage, do not skip directly to broad implementation. First convert requirements into execution slices.

## Do not

- Do not treat `.codex/settings.json` as skill registration.
- Do not assume a folder becomes a Codex skill just because it exists in the repo.
- Do not create large implementation plans that require many modules to change at once.
- Do not bypass unresolved product decisions when they affect system behavior.
