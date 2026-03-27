# Test Framework Reference

Quick reference for setting up and configuring test frameworks in JS/React projects.
Read the section relevant to the project's chosen framework.

## Table of Contents

1. [Vitest (Recommended for Vite projects)](#vitest)
2. [Jest (Recommended for Next.js / CRA projects)](#jest)
3. [Playwright (E2E tests)](#playwright)
4. [React Testing Library (Component tests)](#react-testing-library)
5. [Common Patterns](#common-patterns)

---

## Vitest

### Setup

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
    include: ['tests/**/*.test.{ts,tsx}', 'src/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

```typescript
// tests/setup.ts
import '@testing-library/jest-dom'
```

### Running

```bash
npx vitest              # watch mode
npx vitest run          # single run
npx vitest run --coverage  # with coverage report
```

---

## Jest

### Setup

```bash
npm install -D jest @types/jest ts-jest @testing-library/react @testing-library/jest-dom
```

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterSetup: ['<rootDir>/tests/setup.ts'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: ['src/**/*.{ts,tsx}', '!src/**/*.d.ts'],
}
```

### Running

```bash
npx jest                # single run
npx jest --watch        # watch mode
npx jest --coverage     # with coverage report
```

---

## Playwright

### Setup

```bash
npm install -D @playwright/test
npx playwright install
```

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

### Running

```bash
npx playwright test                 # headless
npx playwright test --ui            # with UI mode
npx playwright test --headed        # visible browser
npx playwright show-report          # view last report
```

---

## React Testing Library

Not a test runner — used alongside Vitest or Jest for component testing.

### Key Imports

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
```

### Query Priority (prefer top to bottom)

1. `getByRole` — accessible role (button, textbox, heading)
2. `getByLabelText` — form fields by label
3. `getByPlaceholderText` — form fields by placeholder
4. `getByText` — non-interactive elements by text content
5. `getByTestId` — last resort, requires data-testid attribute

### Async Patterns

```typescript
// Wait for element to appear
await screen.findByText('Success')

// Wait for condition
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument()
})

// User interaction (prefer userEvent over fireEvent)
const user = userEvent.setup()
await user.click(screen.getByRole('button', { name: 'Submit' }))
await user.type(screen.getByRole('textbox'), 'hello')
```

---

## Common Patterns

### Test File Structure

```typescript
/**
 * Tests for: [Feature Name]
 * Spec: specs/requirements.md — AC-1, AC-2
 * Spec: specs/api.md — POST /api/items
 */

describe('[Component/Module]', () => {
  // Shared setup
  beforeEach(() => {
    // Reset state, mocks, etc.
  })

  describe('[behaviour or method]', () => {
    it('should [expected outcome] when [condition]', () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
```

### Mocking API Calls

```typescript
// With msw (Mock Service Worker) — recommended
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
  http.get('/api/items', () => {
    return HttpResponse.json([{ id: '1', name: 'Item 1' }])
  }),
  http.post('/api/items', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: '2', ...body }, { status: 201 })
  })
)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
```

### Test Data Factories

```typescript
// tests/factories.ts
// Prefer realistic data over "foo" and "bar"

function buildUser(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    name: 'Jane Chen',
    email: 'jane.chen@example.com',
    role: 'member',
    createdAt: new Date().toISOString(),
    ...overrides,
  }
}

function buildItem(overrides = {}) {
  return {
    id: crypto.randomUUID(),
    title: 'Quarterly Review Slides',
    status: 'draft',
    ownerId: crypto.randomUUID(),
    ...overrides,
  }
}
```

### Testing Error States

```typescript
it('should display error message when API returns 500', async () => {
  // Override the default handler for this test
  server.use(
    http.get('/api/items', () => {
      return HttpResponse.json(
        { error: 'Internal Server Error' },
        { status: 500 }
      )
    })
  )

  render(<ItemList />)

  await screen.findByText(/something went wrong/i)
  expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument()
})
```
