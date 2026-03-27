# Integration: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## External Dependencies

### [Service Name]
- **What it provides:** [capability we depend on]
- **Connection method:** [REST API / SDK / webhook / etc.]
- **Auth:** [API key / OAuth / etc.]
- **Documentation:** [link]
- **Rate limits:** [if known]

### [Service Name]
- **What it provides:**
- **Connection method:**
- **Auth:**
- **Documentation:**
- **Rate limits:**

## Data Contracts

### [Service Name] → Our System

**We receive:**
```json
{
  "field": "type — description"
}
```

**Triggered by:** [webhook / polling / on-demand request]

### Our System → [Service Name]

**We send:**
```json
{
  "field": "type — description"
}
```

**Triggered by:** [user action / scheduled / event-driven]

## Failure Modes

| Dependency | Failure | Impact | Graceful Degradation |
|-----------|---------|--------|---------------------|
| [service] | Timeout (>Xs) | [what breaks] | [what we do instead] |
| [service] | 500 error | [what breaks] | [retry strategy] |
| [service] | Down entirely | [what breaks] | [fallback behaviour] |
| [service] | Returns unexpected data | [what breaks] | [validation + error handling] |
