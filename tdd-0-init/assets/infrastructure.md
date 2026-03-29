# Infrastructure: [Feature/Project Name]

> Spec created by TDD Phase 1 — Requirements Capture
> Last updated: [date]

## Discovery Checklist

<!-- Verify each item before finalising this document. Check the box when confirmed
     with the user or verified by inspecting the running platform. Don't assume —
     config files show intent, not necessarily reality. -->

- [ ] Hosting tier/plan and its resource limits confirmed
- [ ] Filesystem persistence model verified (ephemeral vs persistent)
- [ ] Database is actually provisioned and connection tested (not just in .env.example)
- [ ] All required secrets/env vars are configured in the platform (not just templated)
- [ ] Cold start / sleep behaviour documented with impact on features
- [ ] Deployment trigger and branch identified
- [ ] Domain, SSL, and port binding constraints captured
- [ ] Background job / cron support assessed (or lack thereof noted)

## Hosting Platform

- **Provider:** [Replit / Vercel / Netlify / AWS / Railway / etc.]
- **Plan/Tier:** [free / starter / pro — note any limits]
- **Dashboard URL:** [link to project on hosting platform]

### Platform Constraints
<!-- Every hosting platform has opinions. Document them here so they don't surprise you during implementation. -->

| Constraint | Detail |
|-----------|--------|
| Runtime | [Node.js version, language restrictions] |
| File system | [ephemeral / persistent / read-only] |
| Build command | [e.g., `npm run build`] |
| Start command | [e.g., `npm run start`] |
| Port binding | [e.g., must listen on `0.0.0.0:3000` or `$PORT`] |
| Max request timeout | [e.g., 30s for free tier] |
| Persistent storage | [database add-on, external service, or none] |
| Sleep/cold start | [does the app sleep after inactivity? how long to wake?] |

## Environment Configuration

### Environment Variables

| Variable | Purpose | Where Set | Example |
|----------|---------|-----------|---------|
| `DATABASE_URL` | [Database connection string] | [Replit Secrets / .env] | `postgresql://...` |
| `NODE_ENV` | [Runtime environment] | [Platform config] | `production` |
| [VAR_NAME] | [purpose] | [where set] | [example value] |

### Platform-Specific Config Files

<!-- List any config files required by the hosting platform. -->

- **`.replit`** — [Replit run/build config: language, entrypoint, modules]
- **`replit.nix`** — [Nix packages for the Replit environment]
- **`[other config]`** — [purpose]

## Build & Deploy Pipeline

### Local Development
```bash
npm install        # install dependencies
npm run dev        # start dev server
```

### Production Build
```bash
npm run build      # compile/bundle for production
npm run start      # serve production build
```

### Deployment Trigger
- **Method:** [auto-deploy on push / manual deploy / Replit "Run" button / etc.]
- **Branch:** [which branch triggers deploy — e.g., `main`]
- **Build steps:** [what the platform runs on deploy]

### Preview / Staging
- **Available:** [yes/no]
- **URL pattern:** [e.g., `*.repl.co`, `preview--*.netlify.app`]

## Domain & Networking

- **Production URL:** [e.g., `https://project-name.repl.co` or custom domain]
- **Custom domain:** [if applicable — domain, DNS provider, config needed]
- **HTTPS:** [automatic / manual / not available]
- **CORS policy:** [what origins are allowed]

## Database & Persistence

- **Database type:** [PostgreSQL / SQLite / Replit DB / external service / none]
- **Provider:** [platform built-in / external service name]
- **Connection method:** [connection string / SDK / file path]
- **Migrations:** [how schema changes are applied — e.g., Prisma / Drizzle / manual SQL]
- **Backups:** [automatic / manual / none — note any limitations]

## Monitoring & Logs

- **Application logs:** [where to find them — platform console, external service]
- **Error tracking:** [Sentry / built-in / console only]
- **Uptime monitoring:** [if any]

## Known Limitations

<!-- Be honest about what the hosting setup can and can't handle. This prevents Phase 3 implementers from building features the infrastructure can't support. -->

- [e.g., Replit free tier sleeps after 30 min inactivity — not suitable for webhooks that need instant response]
- [e.g., File system is ephemeral — uploaded files are lost on redeploy]
- [e.g., No background job runner — use external cron service or polling]

## Cost & Scaling

| Resource | Current Limit | What Happens at Limit | Upgrade Path |
|----------|--------------|----------------------|-------------|
| [Requests/month] | [limit] | [throttled / error / upgrade prompt] | [next tier] |
| [Storage] | [limit] | [writes fail / oldest data purged] | [next tier] |
| [Compute] | [limit] | [slower response / cold starts] | [next tier] |
