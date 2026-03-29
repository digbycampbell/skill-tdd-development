---
name: tdd-4-refactor
description: "Phase 4 of a TDD development pipeline. Use this skill to refactor implementation code while keeping all tests passing. Invoke when the user says \"refactor\", \"phase 4\", \"clean up\", \"improve code quality\", or wants to restructure code after tests are green. This skill identifies code smells, removes duplication, and improves structure without changing behaviour."
license: MIT
metadata:
  author: user
  pipeline-version: "1.2.0"
  pipeline-phase: "4"
---

# TDD Phase 4 — Refactor (The "Clean" Phase)

You are acting as a senior developer doing a code review and cleanup. All tests are passing.
Your job is to improve the code's structure, readability, and maintainability without changing
its behaviour. After every change you make, the tests must still pass.

This is the phase where you pay back the "minimum code" shortcuts taken in Phase 3. But
the discipline is: improve structure, not behaviour. If you find yourself wanting to add
a feature, stop — that belongs in a new cycle (back to Phase 1 or 2).

## Before You Start

1. **Run the full test suite.** Confirm everything is green. If anything is failing, stop —
   go back to Phase 3. You cannot refactor against a failing test suite.

2. **Read the specs.** Refresh your understanding of intent so you can evaluate whether
   the code structure serves that intent well.

3. **Read all implementation code end-to-end.** Don't start changing things until you have
   the full picture. Take notes on what bothers you.

## What to Look For

Work through these categories in order. Each one is a pass through the codebase.
Pass 0 runs first and is deliberately aggressive — the philosophy is "delete it, the
tests will tell you if you were wrong, and git will remember it if you need it back."

### Pass 0: Dead Code Removal

Before improving structure, remove everything that isn't earning its keep. Dead code
is not harmless — it misleads readers, creates false dependencies, and slows down every
future refactoring. Be aggressive. If you aren't sure something is used, delete it and
run the tests. If they pass, it was dead.

Sweep the entire codebase for each of these categories:

- **Unused exports** — functions, classes, constants, or components that are exported but
  never imported anywhere else in the codebase. Search all import statements; if nothing
  references it, delete it.
- **Unused imports** — imports at the top of a file that nothing in the file actually uses.
  Your editor or linter may flag these, but verify manually too.
- **Unreachable code** — code after early returns, inside conditions that can never be true,
  in branches guarded by constants, or behind feature flags that are permanently off.
- **Commented-out code** — code in comments is not documentation, it's clutter. If it was
  important, it's in git history. Delete it. (Genuine explanatory comments are fine — the
  target is code-in-comments like `// const oldHandler = ...` or `/* TODO: re-enable
  this block */`.)
- **Unused variables and parameters** — declared but never read. For function parameters
  that are part of a required interface signature (e.g., Express middleware `(req, res, next)`),
  prefix with underscore rather than removing.
- **Vestigial files** — files that are no longer imported or referenced by any other file,
  route, config, or build step. Check thoroughly before deleting: search for the filename
  (without extension) across the codebase, including dynamic imports, lazy routes, and
  config files.
- **Stale configuration** — environment variables referenced in config but never read by
  code, build targets that are never invoked, scripts in `package.json` that no longer
  work or are never run.
- **Obsolete types** — TypeScript interfaces, type aliases, or enums that are defined but
  never used as a type annotation, generic parameter, or runtime value anywhere.
- **Dead API routes** — endpoints that are registered in the router but have no
  corresponding tests, no client code that calls them, and no documentation. If a route
  exists only because "it might be useful later," it's dead.

**The rhythm for Pass 0:**

1. Identify a candidate for removal.
2. Delete it.
3. Run the tests.
4. If tests pass → it was dead. Move on.
5. If tests fail → undo the deletion. It's alive. Move on.

**Removal Report:**

At the end of Pass 0, produce a removal report listing every deletion with a
one-line justification. Group by category:

```
## Dead Code Removal Report

### Unused Exports
- `src/utils/formatCurrency.ts` → `formatCurrency()` — exported but never imported
- `src/hooks/useDebounce.ts` → entire file — no imports found anywhere

### Commented-Out Code
- `src/api/routes/users.ts:45-62` — commented-out legacy validation block

### Unused Variables
- `src/services/auth.ts:12` → `const DEFAULT_TIMEOUT` — declared, never read

### Vestigial Files
- `src/components/OldDashboard.tsx` — no imports, not in any route config

### Uncertain (kept, flagged for Phase 5 review)
- `src/utils/retry.ts` — no static imports, but may be used via dynamic import;
  couldn't confirm. Kept for now.
```

Items you cannot definitively confirm as dead (e.g., dynamically referenced, used by
external consumers, or referenced only in ways that are hard to trace statically) should
be listed in the "Uncertain" section rather than deleted. Phase 5 will make the final call
on these.

After Pass 0 is complete and the removal report is written, proceed to the structural
refactoring passes below.

### Pass 1: Duplication

The most common Phase 3 artifact. Look for:

- Copy-pasted functions or blocks that differ by only a value or two → extract a shared
  function with parameters
- Repeated validation logic → centralise in a validation module
- Identical error handling patterns → extract a shared error handler or middleware
- Similar component structures → extract a shared base component

The test: if a business rule changes, how many files do you need to edit? If the answer
is more than one, there's duplication that should be extracted.

### Pass 2: Naming and Clarity

Code is read far more often than it's written. Look for:

- Variables or functions with vague names (`data`, `result`, `handle`, `process`)
  → rename to describe what they actually contain or do
- Boolean variables that don't read as questions → rename to `isX`, `hasY`, `canZ`
- Functions that do more than their name suggests → either rename or split
- "Magic" values (hardcoded numbers, strings) → extract to named constants with
  a comment explaining what they mean

### Pass 3: Function and Module Structure

Each function should do one thing. Each module should own one concern. Look for:

- Functions longer than ~30 lines → break into smaller functions
- Functions with more than 3-4 parameters → group related params into an object
- Modules that import from too many other modules → may be doing too much
- Circular or tangled dependencies → restructure to have clear dependency direction

Check against `docs/specs/architecture.md` if it exists — the code structure should reflect
the architectural decisions documented there.

### Pass 4: Error Handling

Phase 3 often leaves error handling minimal. Look for:

- Functions that can fail but don't handle the failure case
- Generic catch blocks that swallow errors without logging or re-throwing
- User-facing error messages that expose internal details
- Missing validation at system boundaries (API inputs, form data, external API responses)

Refer to `docs/specs/api.md` for the expected error response format if applicable.

### Pass 5: Type Safety and Contracts

For TypeScript/Flow projects:

- `any` types that can be narrowed to specific types
- Missing return types on functions
- Loose object types where a defined interface would be clearer
- Type assertions (`as X`) that could be replaced with proper type guards

For JavaScript projects:

- JSDoc comments on functions that take or return complex shapes
- Validation functions at module boundaries

## The Refactor Rhythm

For each change:

1. **Describe what you're about to change and why** — one sentence is enough
2. **Make the change** — one refactoring at a time, not batched
3. **Run the tests** — confirm everything still passes
4. **If a test fails**, undo the change. The test is right; your refactoring broke
   something. Understand why before trying again.

Never skip step 3. "Obviously this won't break anything" is the prelude to broken code.

## What NOT to Do

- **Don't add new functionality.** If you discover a missing feature, note it for the
  user but don't implement it. New features need new tests first (Phase 2).

- **Don't change test files** (unless fixing a test that was poorly structured but
  correctly asserting — and even then, be cautious. The test is the contract).

- **Don't optimise for performance** unless the code is obviously wasteful (like
  making the same database query in a loop). Performance optimisation changes behaviour
  in subtle ways and needs its own test cycle.

- **Don't rewrite from scratch.** Refactoring is incremental improvement, not replacement.
  If you feel the urge to rewrite a module, that's a signal to break the refactoring into
  smaller steps.

- **Don't refactor code you don't have tests for.** That's not refactoring — that's
  gambling. If you find untested code that needs cleanup, note it and suggest adding
  tests in Phase 5.

## When You're Done

1. Run the full test suite one final time — all green.
2. Summarise the refactoring you did, organised by category (duplication, naming,
   structure, error handling, types).
3. List any concerns or suggestions that are outside the scope of refactoring:
   - Missing test coverage you noticed
   - Features implied by the specs but not yet implemented
   - Architectural concerns that can't be fixed by refactoring alone
   - Performance considerations that need dedicated attention
4. Confirm the codebase is ready for Phase 5 (Evaluate).

## Important Behaviours

- Refactoring should make the code easier to understand and modify. If a refactoring
  makes the code more abstract but not clearer, it's not an improvement.

- Prefer simple, obvious code over clever, compact code. A junior developer should be
  able to read the code and understand what it does.

- Respect the existing project conventions even if you disagree with them. If the
  project uses callbacks, don't convert to promises unless the user asks for it.
  Consistency across the codebase matters more than local perfection.

- Small, focused commits are ideal. Each refactoring category (or even each individual
  refactoring) is a natural commit point. Mention this to the user.

- If you find something that's technically not broken but feels wrong, and you can't
  articulate why, note it as a "smell" rather than trying to fix it. Trust the instinct
  but explain it so the user can decide.

## Branch and Commit Strategy

Each TDD cycle (Phases 1–5) should happen on a single feature branch. You should be on
the same branch that was created during Phase 1 (e.g., `feature/user-auth`).

Small, focused commits are ideal during refactoring. Each refactoring category (or even
each individual refactoring) is a natural commit point. Mention them to the user.
Don't commit without asking.

## Phase Interrupts

If you discover during refactoring that a spec, test, or implementation issue exists
that can't be addressed by refactoring alone, follow this protocol:

1. **Stop and flag it.** Describe what you found and why refactoring can't fix it.
2. **Do not add new functionality or change behaviour.** If a feature is missing, that
   needs new tests first (Phase 2). If a spec is wrong, that's Phase 1.
3. **Get user confirmation** on how to proceed. Common scenarios:
   - Missing test coverage for code you want to refactor → note it, suggest a Phase 2
     pass before refactoring that area
   - Untested code that needs cleanup → flag it but don't touch it. Refactoring untested
     code is gambling, not engineering.
4. **Document findings** in your end-of-phase summary so they feed into Phase 5.
