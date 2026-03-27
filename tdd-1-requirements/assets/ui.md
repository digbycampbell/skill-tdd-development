# UI: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## Pages / Views

### [Page Name]
- **Route:** `/path`
- **Purpose:** [what the user does here]
- **Key elements:** [what's visible on the page]
- **Actions available:** [what the user can do]

### [Page Name]
- **Route:** `/path`
- **Purpose:**
- **Key elements:**
- **Actions available:**

## User Flows

### [Flow Name] (maps to User Story #N)

1. User [action] on [page]
2. System [response]
3. User sees [result]
4. User [next action]
5. System [response]

### [Flow Name]

1. ...

## UI States

<!-- Every view has multiple states. These are easy to forget and painful to retrofit. -->

### [Page/Component Name]

| State | Condition | What's shown |
|-------|-----------|-------------|
| Loading | Data is being fetched | [skeleton / spinner / placeholder] |
| Empty | No data exists yet | [empty state message + CTA] |
| Populated | Data exists | [the normal view] |
| Error | Fetch or action failed | [error message + retry option] |
| Unauthorized | User lacks permission | [access denied message] |

## Component Inventory

<!-- Reusable UI components this feature needs. -->

### Existing (already in codebase)
- [ComponentName] — [where it lives, what it does]

### New (needs to be created)
- [ComponentName] — [what it does, where it'll be used]

### Modified (exists but needs changes)
- [ComponentName] — [what change is needed and why]
