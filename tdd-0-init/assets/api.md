# API: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## Base URL

`/api/v1`

## Authentication

<!-- How callers identify themselves. JWT, session cookie, API key, etc. -->

[Describe auth mechanism. Reference auth.md if it exists for detailed auth rules.]

## Endpoints

### [Resource Name]

#### `POST /api/v1/[resource]` — Create

**Request:**
```json
{
  "field": "type — description"
}
```

**Response (201):**
```json
{
  "id": "string",
  "field": "type"
}
```

**Errors:**
| Status | Condition | Response body |
|--------|-----------|---------------|
| 400 | Validation failed | `{ "error": "message", "fields": {...} }` |
| 401 | Not authenticated | `{ "error": "Unauthorized" }` |
| 403 | Not authorised | `{ "error": "Forbidden" }` |

#### `GET /api/v1/[resource]` — List

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| page | number | 1 | Page number |
| limit | number | 20 | Items per page |

**Response (200):**
```json
{
  "data": [...],
  "pagination": { "page": 1, "limit": 20, "total": 100 }
}
```

#### `GET /api/v1/[resource]/:id` — Get one

**Response (200):** Single resource object
**Errors:** 404 if not found

#### `PUT /api/v1/[resource]/:id` — Update

**Request:** Partial resource object (only changed fields)
**Response (200):** Updated resource object
**Errors:** 400 validation, 404 not found

#### `DELETE /api/v1/[resource]/:id` — Delete

**Response (204):** No content
**Errors:** 404 not found

## Error Response Format

All errors follow this shape:

```json
{
  "error": "Human-readable message",
  "code": "MACHINE_READABLE_CODE",
  "fields": {
    "fieldName": "Validation message"
  }
}
```
