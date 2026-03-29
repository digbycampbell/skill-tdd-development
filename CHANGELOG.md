# Changelog

All skills in this pipeline are versioned together. Each release applies to
all six phases. Use git tags (e.g., `v1.1.0`) to pin a specific version in
your project's submodule.

## v1.3.0 — 2026-03-29

### Added
- **Phase 0 (tdd-0-init):** New project initialisation skill. Runs once per project to create the `docs/specs/` directory, canonical spec documents, READMEs, and roadmap. Templates and assets moved here from Phase 1.
- Phase 1: "Single Source of Truth" rule — one `requirements.md` per project, global monotonically increasing AC numbers, no file-per-feature or file-per-cycle.
- Phase 1: "No Unspec'd Work" rule — bugs and improvements discovered during implementation must get an AC (tagged `[HOTFIX]` or `[DISCOVERED]`) and a test before being implemented.
- Phase 1: "Supersession Protocol" — strike through old ACs when requirements change, reference replacements, keep all spec files consistent.
- Phase 1: "Living Documents" pattern — after each cycle, update specs to reflect current state, move completed ACs to History section, use status indicators.
- Phase 1: "Interview is NOT Optional" — draft ACs must be presented and confirmed even when chaining phases.
- Phase 1: "Multi-Cycle Sessions" — re-read requirements.md before each cycle, use test suite as feature inventory.
- Phase 3: "No Unspec'd Work" rule cross-referenced from Phase 1.
- Phase 5: "Living Document Update" evaluation dimension — verify specs reflect current state after each cycle.

### Changed
- Phase 1 is now a focused per-cycle requirements skill. Project initialisation, templates, doc structure setup, and infrastructure interview checklist moved to Phase 0.
- Phase 1 no longer carries template assets — templates live in `tdd-0-init/assets/`.
- Pipeline is now 6 phases (0-5) instead of 5 (1-5).
- README updated to reflect 6-phase pipeline and new usage flow.
- All SKILL.md frontmatter: pipeline-version bumped to 1.3.0.

## v1.2.0 — 2026-03-29

### Added
- Phase 4: New Pass 0 (Dead Code Removal) runs before all other refactoring passes. Aggressively removes unused exports, unused imports, unreachable code, commented-out code, unused variables, vestigial files, stale config, obsolete types, and dead API routes. Requires a removal report listing every deletion with justification.
- Phase 5: Dead Code Verification (section 4a) independently sweeps for dead code survivors that Phase 4 missed. Reviews Phase 4's "Uncertain" items and makes definitive calls.
- Phase 5: Dead code loop-back — if survivors are found, recommends returning to Phase 4 for another Pass 0 before proceeding.

### Changed
- Phase 4: Refactoring passes renumbered (existing Pass 1–5 unchanged, new Pass 0 added before them)
- Phase 5: Code Health section split into 4a (Dead Code Verification) and 4b (General Code Health)
- Phase 5: "What's Next" now prioritises dead code loop-back as highest-priority recommendation
- All SKILL.md frontmatter: pipeline-version bumped to 1.2.0

## v1.1.0 — 2026-03-27

### Added
- Phase 1: Scope check heuristic (AC count guidance and vertical slice rule)
- Phase 1: Roadmap template (`assets/roadmap.md`) and root README template (`assets/root-readme.md`)
- Phase 2: Persistent test plan artifact (`docs/specs/test-plan.md`)
- All phases: Branch and commit strategy guidance (one feature branch per TDD cycle)
- All phases: Phase interrupt protocol with mandatory user confirmation before modifying upstream artifacts
- Traceability script: Now tracks API endpoints, data model entities, state transitions, and UI flows (not just acceptance criteria)
- Specs README template: Cross-reference to roadmap and docs index

### Changed
- README: Clarified JS/TS web application scope
- Test frameworks reference: Updated header to explicitly state JS/TS webapp focus
- Phase 5: Fixed traceability script path to use standard submodule location
- All SKILL.md frontmatter: Changed `version` to `pipeline-version` for unified versioning

## v1.0.0

Initial release. Five-phase TDD pipeline: Requirements, Test Design, Implement,
Refactor, Evaluate.
