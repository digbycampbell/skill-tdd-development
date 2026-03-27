# Changelog

All skills in this pipeline are versioned together. Each release applies to
all five phases. Use git tags (e.g., `v1.1.0`) to pin a specific version in
your project's submodule.

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
