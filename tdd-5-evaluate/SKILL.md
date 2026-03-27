---
name: tdd-5-evaluate
description: "Phase 5 of a TDD development pipeline. Use this skill to evaluate the current state of the codebase against its specifications. Invoke when the user says \"evaluate\", \"phase 5\", \"review\", \"assess\", \"how are we doing\", or wants to check whether the implementation fully satisfies the requirements before starting a new cycle. This skill identifies coverage gaps, spec drift, and recommends what to tackle next."
license: MIT
metadata:
  author: user
  version: "1.0"
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
   node ../tdd-2-test-design/scripts/traceability.mjs [project-root]
   ```
   This produces a coverage report at `docs/specs/traceability-report.json` and prints a
   summary to stdout. Use this as the starting point for your evaluation — it catches
   the mechanical gaps so you can focus on the qualitative ones.

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

A quick structural review (complementing Phase 4's detailed refactoring):

- Are there TODO/FIXME/HACK comments that need attention?
- Any dead code (unused functions, unreachable branches)?
- Are dependencies up to date and appropriate?
- Is the project structure consistent and navigable?
- Any security concerns visible at a glance?

### 5. What's Next — "Where do we go from here?"

Based on the above, recommend the next action. Be specific:

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

After making recommendations, update the project documentation:

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
