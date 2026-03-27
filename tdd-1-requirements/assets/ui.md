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

## Styling & Design System

<!-- Document the styling approach upfront so all contributors and AI agents build consistently. -->

### CSS Framework / Approach
- **Framework:** [Tailwind CSS / CSS Modules / styled-components / vanilla CSS / etc.]
- **Config file:** [e.g., `tailwind.config.js`, `theme.ts`]
- **Utility vs custom:** [primarily utility classes / primarily custom CSS / mix]

### Design Tokens / Theme

| Token | Value | Usage |
|-------|-------|-------|
| Primary colour | [e.g., `#3B82F6`] | [buttons, links, active states] |
| Secondary colour | [e.g., `#10B981`] | [success states, accents] |
| Error colour | [e.g., `#EF4444`] | [error messages, destructive actions] |
| Background | [e.g., `#FFFFFF` / `#1A1A2E`] | [page background] |
| Font family | [e.g., `Inter, sans-serif`] | [body text] |
| Font heading | [e.g., `inherit` or `Poppins`] | [headings] |
| Border radius | [e.g., `0.5rem`] | [cards, buttons, inputs] |
| Spacing scale | [e.g., `4px base` / Tailwind default] | [margins, padding] |

### Responsive Breakpoints

| Name | Width | Behaviour |
|------|-------|-----------|
| Mobile | `< 640px` | [single column, stacked layout] |
| Tablet | `640px – 1024px` | [adjusted grid, collapsible nav] |
| Desktop | `> 1024px` | [full layout] |

### Component Library
- **Library:** [shadcn/ui / Radix / Headless UI / MUI / custom / none]
- **Icon set:** [Lucide / Heroicons / Font Awesome / etc.]
- **Dark mode:** [supported / not supported / planned]

### Conventions
- [e.g., All colours via CSS variables — never hardcode hex in components]
- [e.g., Spacing only via Tailwind classes — no arbitrary pixel values]
- [e.g., Component files co-locate styles: `Button.tsx` + `Button.module.css`]

## Component Inventory

<!-- Reusable UI components this feature needs. -->

### Existing (already in codebase)
- [ComponentName] — [where it lives, what it does]

### New (needs to be created)
- [ComponentName] — [what it does, where it'll be used]

### Modified (exists but needs changes)
- [ComponentName] — [what change is needed and why]
