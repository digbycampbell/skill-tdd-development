---
name: tdd-5-evaluate
description: "Phase 5 of a TDD development pipeline. Use this skill to evaluate the current state of the codebase against its specifications. Invoke when the user says \"evaluate\", \"phase 5\", \"review\", \"assess\", \"how are we doing\", or wants to check whether the implementation fully satisfies the requirements before starting a new cycle. This skill identifies coverage gaps, spec drift, and recommends what to tackle next."
license: MIT
metadata:
  author: user
  pipeline-version: "1.3.0"
  pipeline-phase: "5"
---

# TDD Phase 5 — Evaluate

You are acting as a QA lead and technical reviewer. Your job is to step back from the code
and assess the overall state of the project: does what we've built actually satisfy what
we set out to build? What's missing? What's next?

This is the decision point in the TDD cycle. After evaluation, the user either ships
(everything's covered) or starts a new cycle from the appropriate phase.

## Before You Start

1. **Run the traceability checker.** The Phase 2 skill bundles a script that automates
   the spec-to-test coverage check. Run it first to get a baseline:
   ```bash
   node .claude/skills/tdd-2-test-design/scripts/traceability.mjs .
   ```
   (Adjust the path if the skills submodule is installed elsewhere.)
   This produces a coverage report at `docs/specs/traceability-report.json` and prints a
   summary to stdout. It tracks acceptance criteria, API endpoints, data model entities,
   state transitions, and UI flows. Use this as the starting point for your evaluation —
   it catches the mechanical gaps so you can focus on the qualitative ones.

2. Read everything:

   a. **All spec documents in `docs/specs/`** — this is what was promised
   b. **All test files** — this is what's verified
   c. **All implementation code** — this is what exists
   d. **Test results** — run the full suite and capture the output

## Evaluation Dimensions

Work through each dimension and produce a clear assessment.

### 1. Spec Traceability — "Is everything specified actually tested?"

Go through each spec document and check every testable claim against the test suite.

For `docs/specs/requirements.md`:
- Each acceptance criterion → does a test exist that directly verifies it?
- Each user story → is the user flow covered end-to-end?

For `docs/specs/api.md`:
- Each endpoint → are success, error, and auth cases all tested?

For `docs/specs/data-model.md`:
- Each entity → are creation, validation, and edge cases tested?
- Each state transition → are valid and invalid transitions tested?

For `docs/specs/auth.md`:
- Each permission rule → is there a test that verifies both grant and deny?

For `docs/specs/ui.md`:
- Each user flow → is there an e2e test?
- Each UI state (loading, empty, error) → is it tested?

Produce a checklist:
```
## Spec Traceability

### requirements.md
- [x] AC-1: User can create an account — tested in auth.test.ts:14
- [x] AC-2: User receives confirmation email — tested in email.test.ts:31
- [ ] AC-3: User can reset password — NO TEST EXISTS
- [x] AC-4: Login rate limiting — tested in auth.test.ts:55

### api.md
- [x] POST /api/users — success, validation, conflict tested
- [ ] DELETE /api/users/:id — NO TESTS (endpoint not yet implemented)
```

### 2. Test Quality — "Are the tests actually testing what they claim?"

Review the test suite for:

- **False passes** — tests that pass but don't actually verify meaningful behaviour
  (e.g., asserting that a function returns "something" rather than the right thing)
- **Missing edge cases** — obvious inputs that aren't covered (null, empty, boundary)
- **Brittleness** — tests coupled to implementation details that will break on
  any refactor (testing internal method calls rather than external behaviour)
- **Missing error path tests** — happy path only, no failure cases
- **Test isolation** — tests that depend on execution order or shared mutable state

### 3. Spec Drift — "Have the specs become outdated?"

During implementation, the user may have made decisions that deviated from the original
spec. Check for:

- Implemented behaviour that contradicts a spec document
- Spec documents that describe things differently from how they were actually built
- New concepts or entities that appeared during implementation but aren't in any spec
- Endpoints, fields, or flows that exist in code but not in specs (or vice versa)

If drift exists, note each instance and whether the spec or the code should be updated.

### 4. Code Health — "Is the codebase in good shape?"

A structural review that specifically verifies Phase 4's dead code removal was thorough,
then checks broader code health.

#### 4a. Dead Code Verification

Phase 4's Pass 0 should have aggressively removed dead code. Your job is to verify it
actually did. Perform an independent sweep for dead code survivors:

- **Unused exports** — functions, classes, constants exported but never imported elsewhere
- **Unused imports** — imports that nothing in the file references
- **Commented-out code** — code-in-comments that should have been deleted
- **Unreachable branches** — code behind impossible conditions or after early returns
- **Vestigial files** — files with no inbound imports or references
- **Obsolete types** — interfaces, type aliases, or enums that are defined but never used
- **Dead API routes** — registered endpoints with no tests, no callers, no docs
- **Stale config** — unused env vars, dead package.json scripts, orphaned build targets

If Phase 4 produced a "Dead Code Removal Report," review it:
- Were the deletions justified?
- Did it miss anything you can find?
- Review the "Uncertain" items and make a definitive call on each one — either confirm
  it's alive (with evidence: where it's used) or flag it for deletion.

**If dead code survivors are found:** This is a significant finding. Recommend sending
the codebase back to Phase 4 for another Pass 0 before proceeding with Phase 5's other
recommendations. Dead code should not survive two passes through the Phase 4 → Phase 5
loop without being either deleted or explicitly justified with evidence that it's alive.

List every survivor with its location and why it should be removed:
```
## Dead Code Survivors
- `src/utils/legacyFormat.ts` → `legacyFormat()` — exported, zero imports found
- `src/components/DeprecatedBanner.tsx` — entire file, no route or import references
- `src/api/middleware/oldAuth.ts:23-41` — commented-out token refresh block
```

#### 4b. General Code Health

Beyond dead code, check:

- Are there TODO/FIXME/HACK comments that need attention?
- Are dependencies up to date and appropriate?
- Is the project structure consistent and navigable?
- Any security concerns visible at a glance?

### 5. What's Next — "Where do we go from here?"

Based on the above, recommend the next action. Be specific:

- **If dead code survivors were found** → recommend returning to Phase 4 for another
  Pass 0 before any other work. Dead code removal is the highest-priority loop-back
  because dead code actively misleads all other evaluation dimensions.
- **If coverage gaps exist** → list exactly which specs need tests, recommend returning
  to Phase 2 for those specific items
- **If spec drift exists** → recommend returning to Phase 1 to update the specs, then
  Phase 2 to update tests if needed
- **If test quality issues exist** → recommend addressing them in a Phase 2 pass
  before adding new features
- **If everything checks out** → the feature is complete and ready for integration,
  deployment, or the user's next feature cycle
- **If there's a natural next feature** that builds on this one → note it as a
  candidate for a new Phase 1 cycle

### 6. Living Document Update — "Are the specs current?"

After evaluation, update the canonical specs to reflect the CURRENT state of the software:

- `requirements.md` should read as "what the software does NOW", not as a
  history of what was built when.
- Move completed ACs to a `## History` section at the bottom.
- Mark each AC with its status: ✅ Implemented and tested, 🚧 In progress, 📋 Planned.
- If any behavioural changes were made without a corresponding AC, flag them as
  spec drift and recommend adding retroactive ACs in Phase 1.

Then update the project documentation:

**`docs/ROADMAP.md`** — if it exists:
- Mark the current cycle's item as 🟢 Complete and move it to the Completed table
- Link the evaluation report in the Completed table
- Update "Current Cycle" to reflect the recommended next step
- Add any newly discovered work items to Future / Backlog
- Update sequencing notes if priorities have changed based on findings

**`docs/specs/README.md`** — update the status column for each spec document:
- Specs that are fully covered by passing tests → ✅ Current
- Specs with drift or incomplete coverage → 🚧 Needs update
- Add a row for the new evaluation report

**`docs/README.md`** and **root `README.md`** — generally don't need updating
per cycle, but flag if anything in them has become inaccurate.

## Output Format

Produce a structured evaluation report:

```
# Evaluation Report: [Feature Name]
Date: [today]

## Summary
[2-3 sentences: overall status, biggest concern, recommended next step]

## Test Results
- Total: X tests
- Passing: Y
- Failing: Z
- Skipped: W

## Spec Traceability
[the checklist from dimension 1]

## Gaps and Concerns
[findings from dimensions 2-4, prioritised by severity]

## Recommended Next Step
[specific recommendation with reasoning]
```

Save this report to `docs/specs/evaluation-[date or iteration number].md` so there's a
history of evaluations over time.

## Templates

This skill bundles a report template at `assets/evaluation-report.md`. Copy it
into the project and fill it in rather than constructing the report from scratch:

```bash
cp assets/evaluation-report.md docs/specs/evaluation-[N].md
```

The template includes structured tables for traceability, test quality, spec drift,
and prioritised next steps — producing a consistent format across evaluation cycles.

## Important Behaviours

- Be honest. If coverage is incomplete, say so clearly. The point of evaluation is to
  catch problems before they reach users, not to validate that everything is fine.

- Prioritise your findings. Not all gaps are equal — a missing test for the main user
  flow is more urgent than a missing edge case test for an admin-only feature.

- Don't fix things during evaluation. Your job is to assess and recommend. Fixes happen
  in the appropriate phase (1 for specs, 2 for tests, 3 for implementation, 4 for
  refactoring).

- If the evaluation reveals that the specs were fundamentally incomplete or wrong, don't
  bury this in the details. Lead with it. A spec problem means everything downstream
  may be built on a wrong assumption.

- Consider the user's context. If they mentioned this is a prototype or MVP, weight your
  recommendations toward "what's essential" rather than "what's ideal." If they're
  building production infrastructure, hold to a higher standard.

- Keep the evaluation actionable. "Test coverage could be improved" is useless. "AC-3
  (password reset) has no tests — recommend returning to Phase 2 to add unit tests for
  the reset token generation and an integration test for the full reset flow" is useful.

## Branch and Commit Strategy

Each TDD cycle (Phases 1–5) should happen on a single feature branch. You should be on
the same branch that was created during Phase 1 (e.g., `feature/user-auth`).

Commit the evaluation report and any documentation updates at the end of this phase.
If the evaluation confirms the feature is complete, this is the final commit before
merging to main. Mention the merge to the user — don't merge without asking.

If the evaluation recommends returning to an earlier phase, stay on the same branch
and continue the cycle.

## Phase Interrupts

If the evaluation reveals that specs are fundamentally wrong or incomplete:

1. **Lead with it.** Don't bury spec problems in the details — a wrong spec means
   everything downstream may be built on a wrong assumption.
2. **Get user confirmation** before recommending a course of action. Present the options:
   - Return to Phase 1 to revise specs, then cascade through Phases 2–4 as needed
   - Accept the drift and update specs to match what was actually built (user must approve)
   - Defer the fix to a future cycle and document it in the roadmap
3. **Never update specs yourself during evaluation.** Your job is to assess and recommend.
   Spec changes belong in Phase 1, with user approval.
