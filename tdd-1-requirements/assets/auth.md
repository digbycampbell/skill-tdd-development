# Auth: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## Identity

<!-- How users are identified and where identity is verified in the request lifecycle. -->

- **Mechanism:** [JWT / session cookie / API key / OAuth2]
- **Token location:** [Authorization header / cookie / query param]
- **Token lifetime:** [duration]
- **Refresh strategy:** [how expired tokens are renewed]

## Roles & Permissions

### Roles

| Role | Description |
|------|-------------|
| [role] | [what this role represents] |

### Permission Matrix

| Action | [role1] | [role2] | [role3] | Unauthenticated |
|--------|---------|---------|---------|-----------------|
| [action] | yes | yes | no | no |
| [action] | yes | no | no | no |

### Permission Checks

<!-- Where and how permissions are enforced. -->

- **Middleware level:** [what's checked before reaching the handler]
- **Handler level:** [what's checked within the handler, e.g. resource ownership]

## Security Considerations

- **Input validation:** [approach to sanitising user input]
- **Rate limiting:** [rules, e.g. 100 requests/minute per IP]
- **CSRF protection:** [mechanism]
- **XSS prevention:** [approach]
- **Sensitive data:** [what's considered sensitive and how it's handled]
- **Logging:** [what auth events are logged, what's excluded from logs]
