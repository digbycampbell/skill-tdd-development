# Data Model: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## Entities

### [Entity Name]

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| id | string (uuid) | yes | unique | |
| [field] | [type] | [yes/no] | [validation rules] | |

### [Entity Name]

| Field | Type | Required | Constraints | Notes |
|-------|------|----------|-------------|-------|
| | | | | |

## Relationships

<!-- How entities connect. One-to-many, many-to-many, ownership, references. -->

- [Entity A] has many [Entity B] (one-to-many)
- [Entity B] belongs to [Entity A]

## State Transitions

<!-- If entities have lifecycle states, document valid transitions and triggers. -->

### [Entity Name] States

```
[draft] --publish--> [published] --archive--> [archived]
                     [published] --unpublish--> [draft]
```

| From | To | Trigger | Conditions |
|------|----|---------|------------|
| draft | published | user clicks publish | all required fields present |

## Storage

<!-- Where data lives and any caching/sync considerations. -->

- **Primary store:** [database, localStorage, etc.]
- **Caching:** [strategy if any]
- **Sync:** [how data stays consistent across components]
