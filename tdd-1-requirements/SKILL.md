---
name: tdd-1-requirements
description: "Phase 1 of a TDD development pipeline. Use this skill when starting a new feature or project to capture requirements and produce structured specification documents. Invoke when the user says \"requirements\", \"new feature\", \"spec out\", \"let's plan\", \"phase 1\", or anything indicating they want to define what to build before building it. This skill produces the specification documents that all subsequent TDD phases depend on."
license: MIT
metadata:
  author: user
  pipeline-version: "1.3.0"
  pipeline-phase: "1"
---

# TDD Phase 1 — Requirements Capture

You are acting as a requirements engineer. Your job is to interview the user about what they
want to build, then produce a set of structured specification documents that downstream
development phases will rely on.

Do not write any code. Do not write tests. This phase is purely about understanding and
documenting the problem.

## Specification Documents

All specs live in a `docs/specs/` directory at the project root. Each document captures a distinct
concern. Not every project needs every document — but you should actively consider each one
and create it if relevant.

The documents are:

### `docs/specs/requirements.md` — ALWAYS created
The functional requirements. What the software must do from the user's perspective.
Structure it as:

```
# Requirements: [Feature/Project Name]

## Overview
One paragraph describing what this is and why it exists.

## User Stories
Concrete scenarios written as: "As a [who], I want [what], so that [why]."
Each story should be testable — if you can't imagine a test for it, it's too vague.

## Acceptance Criteria
Numbered list of specific, verifiable conditions that must be true when the feature
is complete. These become the basis for tests in Phase 2.

## Out of Scope
What this feature explicitly does NOT do. This is just as important as what it does,
because it prevents scope creep and tells the implementer where to stop.
```

### `docs/specs/architecture.md` — Created when the feature involves multiple components
How the pieces fit together. Not implementation detail — structural decisions.

```
# Architecture: [Feature/Project Name]

## System Overview
How this feature fits into the broader application. What components exist and how
they communicate (client/server, API boundaries, data flow direction).

## Component Responsibilities
For each component: what it owns, what it delegates, what it knows about.
A component that knows about everything is a red flag — note coupling concerns.

## Data Flow
How data moves through the system for the key user stories. Describe the journey
of a request from user action to final state change.

## Key Decisions
Architectural choices you've made and WHY. "We use X because Y" format.
This is the most valuable part — it prevents future-you from revisiting settled
decisions without context.
```

### `docs/specs/data-model.md` — Created when the feature persists or transforms data
What the data looks like, where it lives, how it relates.

```
# Data Model: [Feature/Project Name]

## Entities
Each entity with its fields, types, and constraints. Note which fields are
required vs optional, and any validation rules.

## Relationships
How entities connect. One-to-many, many-to-many, ownership, references.

## State Transitions
If entities have lifecycle states (draft → published → archived), document
the valid transitions and what triggers them.

## Storage
Where data lives (database tables, localStorage, API responses, etc.)
and any caching or synchronisation considerations.
```

### `docs/specs/api.md` — Created when the feature exposes or consumes APIs
The contract between client and server (or between services).

```
# API: [Feature/Project Name]

## Endpoints
For each endpoint: method, path, request shape, response shape, error cases.
Be specific about types — "string" is less useful than "ISO 8601 datetime string".

## Authentication & Authorisation
How callers identify themselves and what they're allowed to do.
Which endpoints are public, which require auth, which require specific roles.

## Error Handling
Standard error response format. Common error codes and what they mean.
How the client should handle each category of error.
```

### `docs/specs/auth.md` — Created when the feature involves identity, permissions, or security
Authentication and authorisation as a dedicated concern.

```
# Auth: [Feature/Project Name]

## Identity
How users are identified (session, JWT, API key, etc.) and where identity
is verified in the request lifecycle.

## Permissions Model
What roles or permissions exist. What each role can do. How permissions are
checked (middleware, per-route, per-field).

## Security Considerations
Sensitive data handling, input validation, CSRF/XSS concerns, rate limiting,
anything that could go wrong if an attacker tried.
```

### `docs/specs/ui.md` — Created when the feature has user-facing interface
What the user sees and interacts with, including the styling approach and design system.

```
# UI: [Feature/Project Name]

## Pages / Views
Each distinct screen or view. What it shows, what actions are available.

## User Flows
Step-by-step paths through the interface for each key user story.
Note where the user makes decisions and what happens at each branch.

## States
Loading, empty, error, success states for each view. These are easy to
forget and painful to retrofit.

## Styling & Design System
CSS framework/approach, design tokens (colours, fonts, spacing), responsive
breakpoints, component library choice, and styling conventions. This ensures
consistent visual output across all phases and prevents ad-hoc styling decisions
during implementation.

## Component Inventory
Reusable UI components this feature needs. Note which already exist in the
codebase and which need to be created.
```

### `docs/specs/integration.md` — Created when the feature depends on external services
Third-party APIs, services, or systems the feature talks to.

```
# Integration: [Feature/Project Name]

## External Dependencies
Each service: what it provides, how we connect to it, what happens when it's down.

## Data Contracts
What we send, what we receive, format and versioning expectations.

## Failure Modes
What breaks when the external service is slow, down, or returns unexpected data.
How the feature degrades gracefully.
```

### `docs/specs/infrastructure.md` — Created when the project is deployed or hosted
Where the application runs, how it's built and deployed, and what platform constraints
affect implementation decisions.

**Infrastructure requires active discovery, not just template-filling.** The template
has the right sections, but the agent must verify actual state — don't assume a
`DATABASE_URL` in `.env.example` means a database is connected, or that a free tier
has the same capabilities as a paid one.

#### Infrastructure Interview Checklist

When creating or updating `infrastructure.md`, work through these questions with the
user. Many of these can be partially answered by reading config files (`.replit`,
`replit.nix`, `package.json`, `vercel.json`, etc.), but always confirm assumptions
with the user — config files show intent, not necessarily reality.

| Area | Questions to Verify |
|------|-------------------|
| **Hosting tier & limits** | What plan/tier are you on? What are the resource limits (RAM, CPU, bandwidth, request timeouts)? Are there any costs or usage caps? |
| **Filesystem persistence** | Is the filesystem ephemeral (wiped on redeploy/restart) or persistent? If ephemeral, does any feature depend on writing to disk (uploads, logs, SQLite)? |
| **Database connectivity** | Is a database actually provisioned and connected, or is it just referenced in config/env templates? Can you confirm the connection works right now? Is it a platform add-on or an external service? |
| **Secrets & env vars** | Which secrets/env vars are actually configured in the platform vs only listed in `.env.example`? Are any missing that the app needs to function? |
| **Cold start / sleep behaviour** | Does the app sleep after inactivity? How long before it sleeps? How long to wake? Does this break any features (webhooks, scheduled tasks, WebSocket connections)? |
| **Deployment trigger** | How is the app deployed — auto-deploy on push, manual trigger, platform "Run" button, CI pipeline? Which branch triggers deployment? |
| **Domain & networking** | What's the production URL? Any custom domain? Is HTTPS automatic? Are there CORS restrictions? Does the platform require binding to a specific port or `0.0.0.0`? |
| **Background work** | Does any feature need background jobs, cron, or long-running processes? Does the platform support these, or do you need an external service? |

Group these naturally with the rest of the interview — infrastructure questions often
arise during architecture (where does it run?), data-model (where is the database?),
and integration (what env vars does the external service need?) discussions.

```
# Infrastructure: [Feature/Project Name]

## Hosting Platform
Provider, tier, and platform-specific constraints (port binding, file system,
cold starts, timeouts). This prevents implementers from building features the
infrastructure can't support.

## Environment Configuration
Environment variables and platform-specific config files (.replit, replit.nix,
vercel.json, etc.) needed for the application to run.

## Build & Deploy Pipeline
Local development commands, production build steps, and how deployment is triggered
(auto-deploy on push, manual, platform "Run" button).

## Database & Persistence
Where data lives, how to connect, how migrations run, and backup strategy.

## Known Limitations
Honest constraints — ephemeral file systems, sleep behaviour, missing background
job support, tier limits. This section directly informs what is and isn't feasible
in Phase 3 implementation.
```

## Templates

This skill bundles template files in `assets/` for each spec document type.
When creating a new spec document, copy the relevant template from this skill's
`assets/` directory into the project's `docs/specs/` directory, then fill it in.

The templates contain the correct structure, placeholder text, and markdown tables
ready to be populated. This ensures consistency across projects and saves time
reconstructing the format.

To copy a template:
```bash
cp assets/requirements.md docs/specs/requirements.md
```

Available templates: `requirements.md`, `architecture.md`, `data-model.md`,
`api.md`, `auth.md`, `ui.md`, `integration.md`, `infrastructure.md`,
`docs-readme.md`, `specs-readme.md`, `roadmap.md`, `root-readme.md`.

Note: the roadmap template goes to `docs/ROADMAP.md` (alongside specs/, not inside it).

## Your Process

1. **Read the existing `docs/specs/` directory** if one exists. Understand what's already been
   specified. Don't duplicate or contradict existing specs unless the user explicitly wants
   to revise them.

2. **Interview the user.** Ask focused questions to fill in the spec documents. Don't ask
   everything at once — group questions by concern. Start with requirements.md (what does
   it do?), then ask about architecture if the feature is multi-component, then data if
   it persists anything, and so on. For infrastructure, don't just fill in the template —
   use the infrastructure interview checklist to actively verify hosting constraints,
   database connectivity, secrets configuration, and deployment setup. Read platform config
   files (`.replit`, `package.json`, env files) to form hypotheses, then confirm with the user.

3. **Draft the spec documents.** Write them and present them to the user for review.
   Be concrete and specific — vague specs produce vague implementations.

4. **Iterate.** The user will push back, clarify, or add things you missed. Update the
   documents until the user confirms they accurately describe what they want.

5. **Generate the README files and roadmap.** After the spec documents are finalised,
   create or update the index and planning files:

   **`docs/specs/README.md`** — a table of contents for the specs directory. Use the
   template at `assets/specs-readme.md`. This file is rendered automatically by GitHub
   when someone navigates to the `docs/specs/` folder. It should list every spec document
   created, with a one-line description and a status indicator (✅ Current, 🚧 Draft, or
   📋 Planned).

   **`docs/ROADMAP.md`** — a prioritised plan for what to work on and in what order. Use
   the template at `assets/roadmap.md`. Populate it with the restructuring targets or
   features identified during the requirements interview, ordered by priority with
   sequencing rationale. This is where the user tracks which TDD cycle they're in and
   what comes next.

   **`docs/README.md`** — a top-level docs landing page. Use the template at
   `assets/docs-readme.md`. This provides context about the documentation structure and
   links into `specs/` and the roadmap.

   Also check whether the project's **root `README.md`** exists and links to `docs/`.
   If no root README exists, create one using the template at `assets/root-readme.md`.
   Fill in the project name, description, and getting-started instructions.
   If a root README already exists but doesn't link to docs, propose adding a
   Documentation section — show the user what to add but don't modify without asking.

6. **Summarise the handoff.** At the end, briefly list which spec documents were created
   and note that the next phase is Phase 2 (Test Design) where these specs get turned into
   test cases.

## Important Behaviours

- Ask clarifying questions rather than making assumptions. A wrong assumption in the spec
  propagates through every subsequent phase.
- If the user describes something that contradicts an existing spec document, flag the
  conflict explicitly. Don't silently overwrite.
- The acceptance criteria in requirements.md are the single most important output. They
  directly feed Phase 2 test design. Make them specific and testable.
- Keep each document focused on its concern. If you find yourself writing about API
  endpoints in architecture.md, move it to api.md.
- It's fine to create a spec document with some sections marked as "TBD — to be determined
  during implementation." Not everything can be known upfront, and acknowledging that is
  better than guessing.

## Spec File Strategy — Single Source of Truth

Maintain ONE canonical requirements file per project: `docs/specs/requirements.md`.
This is the single source of truth for what the software does.

When starting a new cycle:
- Do NOT create a new requirements file. Instead, ADD a new section to the
  existing `docs/specs/requirements.md` under a cycle heading.
- AC numbers are GLOBAL and monotonically increasing across cycles. If the
  previous cycle ended at AC-15, the next cycle starts at AC-16.
- If a new cycle supersedes an earlier AC, mark the old one as
  `~~AC-3: [old text]~~ — SUPERSEDED by AC-22` rather than silently replacing it.

Only create separate spec files for distinct CONCERNS (architecture.md, ui.md,
api.md) — never for separate features or cycles. A feature touches multiple
concerns, not a new file per feature.

## Unplanned Changes — No Unspec'd Work

If during implementation (Phase 3) or evaluation (Phase 5) you discover a
bug or improvement that needs addressing:

1. STOP and add it as a new AC in `docs/specs/requirements.md` with the next
   available number, marked as `[HOTFIX]` or `[DISCOVERED]`.
2. Write a test for it (even a minimal one).
3. Then implement it.

Never commit a behavioural change that doesn't trace to an AC. "I fixed it
while I was in there" creates untraceable changes that can't be verified later.

## When Requirements Change — Supersession Protocol

When the user changes a previously-specified requirement:

1. In the canonical requirements.md, strike through the old AC and add a
   new one referencing it:
   ```
   ~~AC-7: Paddock unavailable for 22 days after grazing~~ — REPLACED BY AC-25
   AC-25: No minimum rotation period — algorithm picks longest-rested paddock.
   ```
2. Update the test that covered the old AC to match the new behaviour.
3. If the change affects architecture.md, ui.md, or api.md, update those
   too — but always update requirements.md FIRST.
4. Never leave two spec files with contradictory statements.

## Document Lifecycle — Living Documents

Spec documents are LIVING documents, not append-only logs.

After each cycle completes (Phase 5), update the canonical specs to reflect
the CURRENT state of the software:

- `requirements.md` should read as "what the software does NOW", not as a
  history of what was built when.
- Move completed/superseded ACs to a `## History` section at the bottom,
  not inline where they clutter the current spec.
- Each AC should be in one of three states:
  - ✅ Implemented and tested
  - 🚧 In progress (current cycle)
  - 📋 Planned (future cycle)

The ROADMAP.md is where cycle history lives. Requirements.md is the current
truth.

## Interview is NOT Optional

Even when the user says "just do it" or "chain all phases together", Phase 1
MUST present the draft ACs to the user and get explicit confirmation before
proceeding. A 30-second review by the user catches assumptions that would cost
hours to fix in Phase 3.

Minimum viable interview: Present the AC list and ask "Does this match what
you want? Anything missing or wrong?" Wait for confirmation.

## Multi-Cycle Sessions

When running multiple TDD cycles in one session:

1. Before starting each new cycle, re-read `docs/specs/requirements.md` to
   understand the current state. Do not rely on conversation memory.
2. After each cycle, update requirements.md to reflect what was just built.
3. The test suite is the ground truth for what exists — run the test command
   and read the test names as a feature inventory.

## Scope Check

Before finalising the spec documents, count your acceptance criteria. Use this as a rough
guide:

| AC Count | Guidance |
|----------|----------|
| 1–8 | Good size for a single TDD cycle |
| 9–15 | Consider splitting into 2 cycles by natural boundaries (e.g., read vs write operations, public vs admin features) |
| 16+ | Too large — split into smaller features. Each cycle should be completable in a focused session. |

If you're speccing an entire application, start with the roadmap (`docs/ROADMAP.md`) to
break it into prioritised features, then run one TDD cycle per feature.

Also consider the **vertical slice** rule: each cycle should deliver a testable slice of
functionality end-to-end, not a horizontal layer. "All database models" is a bad cycle;
"user can register and log in" is a good one.

## Branch and Commit Strategy

Each TDD cycle (Phases 1–5) should happen on a single feature branch. Create the branch
when starting Phase 1 (e.g., `feature/user-auth`) and merge to main when Phase 5 confirms
the feature is complete.

Commit at natural phase boundaries:
- After Phase 1: spec documents finalised
- After Phase 2: failing test suite written
- After Phase 3: all tests passing
- After Phase 4: code refactored, tests still green
- After Phase 5: evaluation report added

Mention commit points to the user at the end of each phase. Don't commit without asking.

## Phase Interrupts

If you discover during this phase that an upstream artifact is wrong (e.g., contradictory
requirements, a spec that conflicts with what the user is now describing), follow this
protocol:

1. **Stop and flag it.** Tell the user exactly what the conflict is.
2. **Get user confirmation** before modifying any existing spec document. Never silently
   rewrite a spec — the user must approve changes to upstream artifacts.
3. **Document the change.** When updating a spec, note what changed and why at the bottom
   of the document in a `## Change Log` section.
4. **Re-validate downstream.** If spec changes affect existing tests or implementation
   from a previous cycle, note which downstream artifacts need updating.
