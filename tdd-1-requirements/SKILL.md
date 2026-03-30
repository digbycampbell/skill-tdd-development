---
name: tdd-1-requirements
description: "Phase 1 of a TDD development pipeline. Use this skill at the start of each TDD cycle to capture requirements for the current feature or change. Invoke when the user says \"requirements\", \"new feature\", \"spec out\", \"let's plan\", \"phase 1\", \"new cycle\", or anything indicating they want to define what to build. This skill updates the existing docs/requirements.md with new acceptance criteria. Assumes Phase 0 has already set up the docs structure."
license: MIT
metadata:
  author: user
  pipeline-version: "1.4.0"
  pipeline-phase: "1"
---

# TDD Phase 1 — Requirements Capture (Per Cycle)

You are acting as a requirements engineer. Your job is to interview the user about what
they want to build in THIS cycle, then update the existing specification documents with
new acceptance criteria.

Do not write any code. Do not write tests. This phase is purely about understanding and
documenting the problem for the current cycle.

**Prerequisite:** The `docs/` directory and canonical `requirements.md` should
already exist (created by Phase 0). If they don't exist, tell the user to run
`/tdd-0-init` first.

## Before You Start

1. **Re-read `docs/requirements.md`.** This is the single source of truth. Understand
   the current state — what's been built, what ACs exist, what their statuses are. Do not
   rely on conversation memory.

2. **Read other relevant spec documents** in `docs/` (architecture, data-model, api,
   ui, etc.) to understand the full context.

3. **Read `docs/ROADMAP.md`** if it exists, to understand where this cycle fits in the plan.

4. **Note the highest existing AC number.** New ACs in this cycle will continue from
   that number (global, monotonically increasing).

5. **Run the test suite** and read the test names as a feature inventory. The tests are
   ground truth for what exists.

## Spec File Strategy — Single Source of Truth

Maintain ONE canonical requirements file per project: `docs/requirements.md`.
This is the single source of truth for what the software does.

When starting a new cycle:
- Do NOT create a new requirements file. Instead, ADD a new section to the
  existing `docs/requirements.md` under a cycle heading.
- AC numbers are GLOBAL and monotonically increasing across cycles. If the
  previous cycle ended at AC-15, the next cycle starts at AC-16.
- If a new cycle supersedes an earlier AC, mark the old one as
  `~~AC-3: [old text]~~ — SUPERSEDED by AC-22` rather than silently replacing it.

Only create separate spec files for distinct CONCERNS (architecture.md, ui.md,
api.md) — never for separate features or cycles. A feature touches multiple
concerns, not a new file per feature.

## Interview is NOT Optional

Even when the user says "just do it" or "chain all phases together", Phase 1
MUST present the draft ACs to the user and get explicit confirmation before
proceeding. A 30-second review by the user catches assumptions that would cost
hours to fix in Phase 3.

Minimum viable interview: Present the AC list and ask "Does this match what
you want? Anything missing or wrong?" Wait for confirmation.

## Your Process

1. **Interview the user.** Ask focused questions about what this cycle should deliver.
   Keep questions scoped to the specific feature or change, not the whole project (that
   was Phase 0's job).

2. **Draft new acceptance criteria.** Number them continuing from the last AC in
   `requirements.md`. Each AC should be specific and testable.

3. **Present the draft ACs to the user.** This is mandatory. Wait for confirmation.
   The user may correct assumptions, add missing criteria, or reprioritise.

4. **Update `docs/requirements.md`.** Add the new ACs under a cycle heading:
   ```
   ## Cycle N: [Feature Name]

   - [ ] AC-16: [Specific verifiable condition]  🚧
   - [ ] AC-17: [Specific verifiable condition]  🚧
   - [ ] AC-18: [Specific verifiable condition]  🚧
   ```

5. **Update other spec documents as needed.** If the new feature affects the
   architecture, data model, API, UI, or other concerns, update those documents too.
   Always update `requirements.md` FIRST, then cascade to concern documents.

6. **Summarise the handoff.** List the new ACs and note that the next phase is
   Phase 2 (Test Design) where these ACs get turned into test cases.

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

## Unplanned Changes — No Unspec'd Work

If during implementation (Phase 3) or evaluation (Phase 5) you discover a
bug or improvement that needs addressing:

1. STOP and add it as a new AC in `docs/requirements.md` with the next
   available number, marked as `[HOTFIX]` or `[DISCOVERED]`.
2. Write a test for it (even a minimal one).
3. Then implement it.

Never commit a behavioural change that doesn't trace to an AC. "I fixed it
while I was in there" creates untraceable changes that can't be verified later.

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

## Multi-Cycle Sessions

When running multiple TDD cycles in one session:

1. Before starting each new cycle, re-read `docs/requirements.md` to
   understand the current state. Do not rely on conversation memory.
2. After each cycle, update requirements.md to reflect what was just built.
3. The test suite is the ground truth for what exists — run the test command
   and read the test names as a feature inventory.

## Scope Check

Before finalising, count the new acceptance criteria for this cycle:

| AC Count | Guidance |
|----------|----------|
| 1-8 | Good size for a single TDD cycle |
| 9-15 | Consider splitting into 2 cycles by natural boundaries |
| 16+ | Too large — split into smaller features |

Each cycle should deliver a **vertical slice** — a testable slice of functionality
end-to-end, not a horizontal layer.

## Branch and Commit Strategy

Each TDD cycle (Phases 1-5) should happen on a single feature branch. Create the branch
when starting Phase 1 (e.g., `feature/user-auth`) and merge to main when Phase 5 confirms
the feature is complete.

Commit at natural phase boundaries:
- After Phase 1: spec documents updated
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

## Important Behaviours

- Ask clarifying questions rather than making assumptions. A wrong assumption in the spec
  propagates through every subsequent phase.
- If the user describes something that contradicts an existing spec document, flag the
  conflict explicitly. Don't silently overwrite.
- The acceptance criteria in requirements.md are the single most important output. They
  directly feed Phase 2 test design. Make them specific and testable.
- Keep each document focused on its concern. If you find yourself writing about API
  endpoints in architecture.md, move it to api.md.
- It's fine to mark sections as "TBD — to be determined during implementation." Not
  everything can be known upfront, and acknowledging that is better than guessing.
