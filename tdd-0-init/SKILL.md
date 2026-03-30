---
name: tdd-0-init
description: "Phase 0 of a TDD development pipeline. Use this skill to initialise a new project's documentation structure or add new concern documents to an existing project. Invoke when the user says \"init\", \"initialise\", \"set up docs\", \"new project\", \"phase 0\", or when starting a project that has no docs/ directory yet. This skill creates the canonical spec documents, READMEs, and roadmap. Run once per project, or re-run to add new concern documents."
license: MIT
metadata:
  author: user
  pipeline-version: "1.4.0"
  pipeline-phase: "0"
---

# TDD Phase 0 — Project Initialisation

You are acting as a project architect. Your job is to interview the user about their
project, then create the foundational documentation structure that all TDD cycles will
build on.

This phase runs ONCE per project (or re-runs to add new concern documents). It creates
the `docs/` directory, the canonical `requirements.md`, any relevant concern
documents, the roadmap, and the README scaffolding.

Do not write any code. Do not write tests. This phase is purely about establishing the
documentation foundation.

## When to Run This Phase

- **New project:** No `docs/` directory exists yet.
- **Adding a new concern:** The project has specs but needs a new concern document
  (e.g., adding `auth.md` to a project that didn't originally need it).
- **Major pivot:** The project's scope has changed so fundamentally that the existing
  docs structure needs rethinking.

If `docs/requirements.md` already exists and you just need to add ACs for a new
cycle, skip this phase and go straight to Phase 1 (Requirements).

## Specification Documents

All specs live in a `docs/` directory at the project root. Each document captures a
distinct concern. Not every project needs every document — but you should actively consider
each one and create it if relevant.

The documents are:

### `docs/requirements.md` — ALWAYS created
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

### `docs/architecture.md` — Created when the feature involves multiple components
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

### `docs/data-model.md` — Created when the feature persists or transforms data
What the data looks like, where it lives, how it relates.

```
# Data Model: [Feature/Project Name]

## Entities
Each entity with its fields, types, and constraints. Note which fields are
required vs optional, and any validation rules.

## Relationships
How entities connect. One-to-many, many-to-many, ownership, references.

## State Transitions
If entities have lifecycle states (draft -> published -> archived), document
the valid transitions and what triggers them.

## Storage
Where data lives (database tables, localStorage, API responses, etc.)
and any caching or synchronisation considerations.
```

### `docs/api.md` — Created when the feature exposes or consumes APIs
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

### `docs/auth.md` — Created when the feature involves identity, permissions, or security
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

### `docs/ui.md` — Created when the feature has user-facing interface
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

### `docs/integration.md` — Created when the feature depends on external services
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

### `docs/infrastructure.md` — Created when the project is deployed or hosted
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
`assets/` directory into the project's `docs/` directory, then fill it in.

The templates contain the correct structure, placeholder text, and markdown tables
ready to be populated. This ensures consistency across projects and saves time
reconstructing the format.

To copy a template:
```bash
cp assets/requirements.md docs/requirements.md
```

Available templates: `requirements.md`, `architecture.md`, `data-model.md`,
`api.md`, `auth.md`, `ui.md`, `integration.md`, `infrastructure.md`,
`docs-readme.md`, `roadmap.md`, `root-readme.md`.

## Your Process

1. **Check for existing `docs/` directory.** If one exists and has content,
   this project may have already been initialised. Ask the user if they want to
   add a new concern document or re-initialise. Do not overwrite existing docs
   without explicit confirmation.

2. **Interview the user about the project.** Ask focused questions to understand the
   project's scope and which concern documents are needed. Start broad:
   - What is this project? What problem does it solve?
   - What are the main components? (determines architecture.md)
   - Does it persist data? (determines data-model.md)
   - Does it have APIs? (determines api.md)
   - Does it have auth? (determines auth.md)
   - Does it have a UI? (determines ui.md)
   - Does it depend on external services? (determines integration.md)
   - Where will it be deployed? (determines infrastructure.md)

   For infrastructure, don't just fill in the template — use the infrastructure
   interview checklist to actively verify hosting constraints, database connectivity,
   secrets configuration, and deployment setup. Read platform config files (`.replit`,
   `package.json`, env files) to form hypotheses, then confirm with the user.

3. **Draft the initial requirements.md.** This is the most important output. Write
   the overview, initial user stories, and the first set of acceptance criteria.
   AC numbering starts at AC-1 and will be extended in future Phase 1 cycles.

4. **Draft any relevant concern documents.** Architecture, data model, API, auth, UI,
   integration, infrastructure — only the ones the project actually needs.

5. **Present everything to the user for review.** Iterate until confirmed.

6. **Generate the README files and roadmap.** After the spec documents are finalised:

   **`docs/README.md`** — a documentation index listing every spec document with a
   one-line description and status indicator (✅ Current, 🚧 Draft, or 📋 Planned).
   Use the template at `assets/docs-readme.md`.

   **`docs/ROADMAP.md`** — a prioritised plan for what to work on and in what order.
   Use the template at `assets/roadmap.md`. Populate it with the features identified
   during the interview, ordered by priority with sequencing rationale.

   Also check whether the project's **root `README.md`** exists and links to `docs/`.
   If no root README exists, create one using the template at `assets/root-readme.md`.
   If a root README already exists but doesn't link to docs, propose adding a
   Documentation section — show the user what to add but don't modify without asking.

7. **Summarise the handoff.** List which documents were created, the initial AC count,
   and note that the next step is Phase 1 (Requirements) to add cycle-specific ACs,
   or Phase 2 (Test Design) if the initial ACs are sufficient for the first cycle.

## Idempotent Re-runs

This phase should be safe to re-run. When re-running on a project that already has docs:

- Do NOT overwrite existing spec documents. Instead, identify what's missing.
- Ask the user which new concern documents to add.
- Extend the roadmap rather than replacing it.
- Update README indexes to include new documents.
- Preserve all existing AC numbers — new ACs continue from the last number used.

## Important Behaviours

- Ask clarifying questions rather than making assumptions. A wrong assumption in the
  spec propagates through every subsequent phase.
- If the user describes something that contradicts an existing spec document, flag the
  conflict explicitly. Don't silently overwrite.
- The acceptance criteria in requirements.md are the single most important output. They
  directly feed Phase 2 test design. Make them specific and testable.
- Keep each document focused on its concern. If you find yourself writing about API
  endpoints in architecture.md, move it to api.md.
- It's fine to create a spec document with some sections marked as "TBD — to be determined
  during implementation." Not everything can be known upfront, and acknowledging that is
  better than guessing.

## Scope Check

Before finalising the spec documents, count your acceptance criteria. Use this as a rough
guide:

| AC Count | Guidance |
|----------|----------|
| 1-8 | Good size for a single TDD cycle |
| 9-15 | Consider splitting into 2 cycles by natural boundaries (e.g., read vs write operations, public vs admin features) |
| 16+ | Too large — split into smaller features. Each cycle should be completable in a focused session. |

If you're speccing an entire application, start with the roadmap (`docs/ROADMAP.md`) to
break it into prioritised features, then run one TDD cycle per feature.

Also consider the **vertical slice** rule: each cycle should deliver a testable slice of
functionality end-to-end, not a horizontal layer. "All database models" is a bad cycle;
"user can register and log in" is a good one.

## Branch and Commit Strategy

Phase 0 work can be committed to `main` directly (it's documentation scaffolding, not
feature code) or to a setup branch if the team prefers.

Commit after the documentation structure is created and the user has confirmed it.
Don't commit without asking.
