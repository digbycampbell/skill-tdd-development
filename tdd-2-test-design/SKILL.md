---
name: tdd-2-test-design
description: "Phase 2 of a TDD development pipeline. Use this skill to design and write tests BEFORE implementation. Invoke when the user says \"test design\", \"write tests\", \"phase 2\", \"red phase\", or wants to create tests based on existing specification documents. This skill reads docs/specs/ documents and produces a failing test suite. No implementation code is written — only tests."
license: MIT
compatibility: Requires Node.js for traceability script. Project should use Vitest, Jest, or Playwright.
metadata:
  author: user
  pipeline-version: "1.3.0"
  pipeline-phase: "2"
---

# TDD Phase 2 — Test Design (The "Red" Setup)

You are acting as a test engineer. Your job is to translate the specification documents
in `docs/specs/` into a concrete, runnable test suite that currently fails (because no
implementation exists yet).

Do not write implementation code. Do not make tests pass. Every test you write should
fail or error when run — that's the correct state at the end of this phase.

## Before You Start

1. **Read all documents in `docs/specs/`.** Every spec document is relevant context.
   Pay particular attention to:
   - `docs/specs/requirements.md` — the acceptance criteria are your primary input
   - `docs/specs/data-model.md` — tells you what shapes to assert against
   - `docs/specs/api.md` — tells you request/response contracts to verify
   - `docs/specs/ui.md` — tells you user flows to cover

2. **Check for an existing test setup.** Look for a test runner config (jest.config,
   vitest.config, playwright.config, etc.) and existing test files. Work within the
   existing setup. If none exists, ask the user what test framework they prefer before
   creating one. Consult `references/test-frameworks.md` bundled with this skill for
   setup instructions and common patterns for Vitest, Jest, Playwright, and React
   Testing Library.

3. **Read existing source code** if any exists. Understand the current codebase structure
   so your tests import from the right paths and use the right patterns.

## Test Categories

Organise tests by category. Not every feature needs every category — use judgment.

### Unit Tests (`tests/unit/` or `__tests__/`)
Test individual functions, components, or modules in isolation.

- One test file per source module (e.g., `utils.test.ts` tests `utils.ts`)
- Mock external dependencies — database calls, API requests, third-party services
- Test both the happy path and edge cases for each function
- Test input validation and error cases

### Integration Tests (`tests/integration/`)
Test how components work together. The boundaries between units.

- API endpoint tests: correct request → correct response, bad request → proper error
- Database interaction tests: create, read, update, delete cycles
- Service-to-service communication
- Authentication and authorisation flows (if `docs/specs/auth.md` exists)

### End-to-End Tests (`tests/e2e/`)
Test complete user flows from the UI layer through to the data layer.

- One test per user flow documented in `docs/specs/ui.md`
- Cover the happy path first, then critical error paths
- Test loading, empty, and error states

## Writing Good Tests

Each test should follow this structure:

```
describe('[Component/Feature being tested]', () => {
  describe('[Specific behaviour or method]', () => {
    it('should [expected outcome] when [condition]', () => {
      // Arrange — set up the preconditions
      // Act — perform the action being tested
      // Assert — verify the outcome
    });
  });
});
```

### Naming Conventions

Test names should read as sentences that describe behaviour, not implementation.

Good: `it('should return 401 when the session token is expired')`
Bad: `it('tests the auth middleware')`

Good: `it('should display an error message when the API returns 500')`
Bad: `it('error handling test')`

The test name is documentation. Someone reading just the test names should understand
what the feature does.

### What to Assert

Derive assertions directly from the spec documents:

- Each acceptance criterion in `requirements.md` → at least one test
- Each API endpoint in `api.md` → tests for success, validation error, auth error, not found
- Each state transition in `data-model.md` → tests for valid and invalid transitions
- Each user flow in `ui.md` → an e2e test covering the full path
- Each error case in `api.md` → a test confirming the correct error response

### Coverage Gaps to Watch For

These are commonly missed and frequently cause bugs:

- **Empty/null/undefined inputs** — what happens when a required field is missing?
- **Boundary values** — first item, last item, exactly-at-the-limit
- **Concurrent operations** — two users editing the same thing
- **Permissions** — can a regular user access admin-only endpoints?
- **State after error** — if an operation fails halfway, is the system in a consistent state?

## Your Process

1. **Read the specs.** Understand what's being built before writing any tests.

2. **Create a test plan.** Before writing test code, produce a brief list of what you're
   going to test, organised by category (unit / integration / e2e). Present this to the
   user. Format:
   ```
   ## Test Plan for [Feature]

   ### Unit Tests
   - [ ] [module]: [what behaviour is being tested]
   - [ ] [module]: [what behaviour is being tested]

   ### Integration Tests
   - [ ] [endpoint/flow]: [what's being verified]

   ### E2E Tests
   - [ ] [user story]: [the flow being tested]
   ```

3. **Get user approval on the plan** before writing code. They may know about edge cases
   you've missed, or may want to deprioritise certain test categories.

4. **Save the test plan.** Once approved, write the test plan to `docs/specs/test-plan.md`.
   This persists the plan as a handoff artifact so that Phase 3 (and anyone picking up
   the work in a different session) has full context on what was planned, what was
   prioritised, and what was deliberately deferred. Update this file as tests are written —
   check off items as their test files are created.

5. **Write the tests.** Follow the existing project conventions for file location, import
   style, and test utilities. If the project has test helpers or factories, use them.

6. **Run the tests.** They should all fail or error (since there's no implementation yet).
   If any test passes, it's either testing something that already exists (fine) or it's
   not actually testing anything (fix it).

7. **Report the result.** List the tests by category, confirm they all fail, and note that
   the project is ready for Phase 3 (Implementation).

## Important Behaviours

- Every acceptance criterion in the spec MUST have at least one corresponding test. If you
  find an acceptance criterion that you can't write a test for, flag it — it probably needs
  to be rewritten more specifically in the spec.

- Don't write tests for implementation details. Test *what* the code should do, not *how*
  it does it internally. Tests coupled to implementation break every time you refactor,
  which defeats the purpose of Phase 4.

- If the specs are ambiguous about expected behaviour, ask the user rather than guessing.
  A test based on a wrong assumption is worse than no test.

- Use `describe` blocks to create a clear hierarchy. Someone should be able to read the
  test file like a table of contents.

- Keep test data realistic. Don't use "foo" and "bar" — use data that looks like what
  the actual application will process. This catches format and validation bugs early.

- If writing tests reveals that a spec is incomplete (e.g., the API spec doesn't define
  what happens on a 404), note this and suggest updating the relevant spec document. But
  don't update specs yourself — that's Phase 1's job.

## Traceability

At the top of each test file, add a comment linking back to the spec:

```
/**
 * Tests for: [Feature Name]
 * Spec: docs/specs/requirements.md — Acceptance Criteria #3, #4, #7
 * Spec: docs/specs/api.md — POST /api/items, GET /api/items/:id
 */
```

This traceability is important. In Phase 5 (Evaluate), it allows checking whether every
spec item has test coverage and every test traces to a spec item.

## Traceability Checker

This skill bundles a traceability script at `scripts/traceability.mjs`. After writing
tests, run it to verify that every acceptance criterion has at least one test reference:

```bash
node scripts/traceability.mjs [project-root]
```

The script scans `docs/specs/` for `AC-N` patterns and test files for spec reference comments,
then reports which criteria are covered and which are missing tests. It also catches
"orphan" references — tests that reference AC numbers that don't exist in the specs,
which usually means a spec was updated without updating the tests.

## Branch and Commit Strategy

Each TDD cycle (Phases 1–5) should happen on a single feature branch. You should be on
the same branch that was created during Phase 1 (e.g., `feature/user-auth`).

Commit at the end of this phase once the failing test suite is complete and the test plan
has been saved to `docs/specs/test-plan.md`. This is a natural commit point — mention it
to the user. Don't commit without asking.

## Phase Interrupts

If you discover during test design that an upstream spec is incomplete, ambiguous, or
contradictory, follow this protocol:

1. **Stop and flag it.** Tell the user exactly what's missing or conflicting in the spec.
2. **Do not update spec documents yourself** — that's Phase 1's job. Ask the user whether
   they want to pause test design and return to Phase 1 to fix the spec, or whether they
   want to proceed with an assumption (which you should document in the test plan).
3. **Get user confirmation** before proceeding with any assumption about intended behaviour.
   Never guess at what a spec should say — the user must decide.
4. **Document any assumptions** in the test plan (`docs/specs/test-plan.md`) so they're
   visible when the spec is eventually updated.
