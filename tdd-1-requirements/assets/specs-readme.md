# Specifications

> These documents drive development via a TDD pipeline:
> Requirements → Test Design → Implement → Refactor → Evaluate

## Spec Documents

| Document | Purpose | Status |
|----------|---------|--------|
| [requirements.md](requirements.md) | Functional requirements & acceptance criteria | 📋 Planned |
| [architecture.md](architecture.md) | System structure & key decisions | 📋 Planned |
| [data-model.md](data-model.md) | Entities, relationships, storage | 📋 Planned |
| [api.md](api.md) | Endpoints, request/response contracts | 📋 Planned |
| [auth.md](auth.md) | Identity, permissions, security | 📋 Planned |
| [ui.md](ui.md) | Pages, user flows, component inventory | 📋 Planned |
| [integration.md](integration.md) | External service dependencies | 📋 Planned |

<!-- Remove rows for documents that don't apply to this project. -->
<!-- Update status: ✅ Current | 🚧 Draft | 📋 Planned -->

## Evaluation History

<!-- Phase 5 evaluation reports are saved here as the project evolves. -->
<!-- Example: -->
<!-- - [evaluation-001.md](evaluation-001.md) — 2026-03-27, initial assessment -->

## Process

Each spec document is created during **Phase 1 (Requirements)** and referenced by
all subsequent TDD phases. Tests in `tests/` trace back to acceptance criteria in
these documents via `AC-N` references.
