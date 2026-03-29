---
name: tdd-3-implement
description: "Phase 3 of a TDD development pipeline. Use this skill to write implementation code that makes failing tests pass. Invoke when the user says \"implement\", \"phase 3\", \"green phase\", \"make tests pass\", or wants to write the actual feature code. This skill reads docs/specs/ documents and existing tests, then writes the minimum code needed to make tests pass."
license: MIT
metadata:
  author: user
  pipeline-version: "1.3.0"
  pipeline-phase: "3"
---

# TDD Phase 3 — Implementation (The "Green" Phase)

You are acting as a developer. Your job is to make the failing tests from Phase 2 pass by
writing implementation code. The discipline here is: write the simplest code that makes
the tests green. Nothing more.

This is not the phase for clever abstractions, performance optimisation, or beautiful code.
That's Phase 4. Right now, the only question is: do the tests pass?

## Before You Start

1. **Read the specs.** Read all documents in `docs/specs/`. These are your source of truth for
   intended behaviour.

2. **Read every test file.** Understand what's being tested and what the expected behaviour
   is. The tests are your immediate target — but the specs are the authority if there's
   a conflict.

3. **Run the test suite.** See what fails, note the error messages. This tells you what
   needs to be built and in what order.

4. **Check the existing codebase.** Understand the project structure, existing patterns,
   and conventions. Your new code should look like it belongs in this codebase.

## Implementation Strategy

### Work in small increments

Don't try to make all tests pass at once. Follow this rhythm:

1. Pick one test (or a small related group)
2. Write the minimum code to make it pass
3. Run that test — confirm it's green
4. Run the full suite — confirm you haven't broken anything else
5. Repeat

This prevents the situation where you write 200 lines of code and then spend an hour
figuring out why 15 tests still fail.

### Order of implementation

Start with the foundations and work upward:

1. **Data models / types** — define the shapes first (guided by `docs/specs/data-model.md`)
2. **Core logic / utilities** — pure functions, validation, transformation
3. **Data access layer** — database queries, API clients
4. **Business logic / services** — orchestration of core logic + data access
5. **API routes / handlers** — HTTP layer on top of services
6. **UI components** — presentation layer (if applicable)

This order means each layer can depend on the ones below it, and the unit tests for
lower layers pass before you build on top of them.

### What "minimum code" means

This is the hardest discipline to maintain. Examples:

- If a test checks that a function returns a sorted list, use the built-in sort. Don't
  write a custom sort algorithm. Don't pre-optimise for large datasets.
- If a test checks that an API returns a 200 with the right shape, hardcode the response
  shape in the handler. Don't build a generic response formatter.
- If only 3 tests need a database query, write 3 specific queries. Don't build a generic
  query builder.

The temptation to generalise is strong. Resist it. Duplication and simplicity are fine
at this stage. Phase 4 is specifically for cleaning up.

The one exception: if the specs explicitly call for a particular architecture or pattern
(e.g., `docs/specs/architecture.md` specifies a service layer), follow that structure even
if a simpler approach would make the tests pass. The specs represent deliberate design
decisions.

## When Tests and Specs Disagree

Sometimes you'll find that making a test pass would require behaviour that contradicts
a spec, or vice versa. When this happens:

1. **Flag the conflict to the user.** Quote the specific spec line and the specific test
   assertion that contradict each other.
2. **Don't silently pick one.** The user needs to decide which is correct.
3. **Update whichever is wrong.** If the spec is wrong, note that it needs a Phase 1
   revision. If the test is wrong, fix the test.

## Running Tests

After each meaningful chunk of implementation:

1. Run the specific tests related to what you just wrote
2. Run the full test suite
3. Report the results: how many pass, how many fail, how many remain

Format:
```
## Test Results After [what you just implemented]
- Passing: X / Y
- Failing: Z (list which ones and why)
- Next: [what you'll implement next to address remaining failures]
```

## When You're Done

All tests pass. At this point:

1. Run the full test suite one final time and report the results
2. List any concerns — things that work but feel fragile, places where you made
   assumptions, code that you know needs cleanup
3. Note any spec conflicts or ambiguities you discovered during implementation
4. Confirm the codebase is ready for Phase 4 (Refactor)

## Important Behaviours

- Do not modify tests to make them pass. If a test seems wrong, flag it — don't "fix" it
  by changing the expectation to match your implementation.

- Do not add features that aren't covered by tests. If you think something is missing,
  note it, but don't build it. Untested code is unverified code.

- Do not refactor during implementation. If you see duplicate code, leave it. If you see
  an ugly pattern, leave it. Write a comment like `// TODO: Phase 4 — extract common
  logic` and move on. The test suite is your safety net for refactoring, and it only
  works if the tests are all green first.

- Follow existing code conventions. If the project uses single quotes, you use single
  quotes. If it uses a specific import style, match it. Consistency matters more than
  your personal preference.

- If you get stuck on a failing test and the fix isn't obvious, say so. Describe what
  the test expects, what's actually happening, and what you've tried. Don't spin in
  circles.

- Commit-sized chunks are ideal. After each group of related tests goes green, that's
  a natural commit point. Mention this to the user — they may want to commit.

## Unplanned Changes — No Unspec'd Work

If during implementation you discover a bug or improvement that needs addressing:

1. STOP and add it as a new AC in `docs/specs/requirements.md` with the next
   available number, marked as `[HOTFIX]` or `[DISCOVERED]`.
2. Write a test for it (even a minimal one).
3. Then implement it.

Never commit a behavioural change that doesn't trace to an AC. "I fixed it
while I was in there" creates untraceable changes that can't be verified later.

## File Placement

Follow the project's existing directory structure. If this is a new project, follow
the structure implied by the test file locations (since tests were written first in
Phase 2, they establish the expected source file paths via their imports).

## Branch and Commit Strategy

Each TDD cycle (Phases 1–5) should happen on a single feature branch. You should be on
the same branch that was created during Phase 1 (e.g., `feature/user-auth`).

Commit after each meaningful group of related tests goes green — these are natural
commit points. Mention them to the user. Don't commit without asking.

## Phase Interrupts

If you discover during implementation that a spec or test is wrong, follow this protocol:

1. **Stop and flag it.** Quote the specific spec line and/or test assertion that's
   problematic. Describe what you expected vs what you found.
2. **Do not silently fix upstream artifacts.** A spec fix belongs in Phase 1. A test fix
   belongs in Phase 2. Never rewrite a spec or test to match your implementation.
3. **Get user confirmation** on how to proceed. Options:
   - Return to Phase 1 to fix the spec (then re-validate tests in Phase 2)
   - Return to Phase 2 to fix the test (if the spec is correct but the test misinterprets it)
   - Proceed with a documented assumption (if the user wants to defer the fix)
4. **Commit your WIP** before switching phases, with a message like
   `WIP: pausing Phase 3 — spec conflict in [document]`
5. **Resume where you left off** after the upstream fix is resolved.
