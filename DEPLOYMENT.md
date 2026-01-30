# Deployment & Serverless Plan (Vercel + Supabase)

## What I will implement for you

- Frontend: deploy on Vercel (static build via Vite)
- Serverless endpoints (Vercel Functions):
  - `POST /api/submitClientForm` - accept public form submissions, validate, write to Supabase, send welcome email (via SMTP or SendGrid)
  - `GET /api/dashboard` - return aggregated client metrics (authorized)
  - `POST /api/stripe-webhook` - handle Stripe events and update subscription in Supabase
  - `POST /api/send-reminders` - send scheduled reminders (can be run by Vercel Cron or third-party scheduler)
  - `POST /api/manageTemplates` - CRUD templates protected by admin auth

- DB: Supabase (Postgres) tables for `clients`, `templates`, `tasks`, `transmissions`, `admins`
- Local dev: use `.env` for Supabase URL/KEY and Stripe keys

## What I need from you

1. Supabase project ready with a Service Role key (for server functions). Provide:
   - SUPABASE_URL
   - SUPABASE_SERVICE_ROLE_KEY (server only)
   - SUPABASE_ANON_KEY (client safe)
2. Stripe account and webhook secret (if you want billing):
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
3. Email provider credentials for transactional mail (SMTP or SendGrid API key)
4. Vercel team/project where I can deploy or you can add environment variables in project settings:
   - Add SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, STRIPE_SECRET_KEY, etc. as environment variables

## Minimal DB schema suggestions (Postgres)
- templates (id, title, description, tasks JSONB, created_by, created_at)
- clients (id, name, email, company, template_id, tasks JSONB, progress, status, slug, created_at)
- tasks (id, client_id, title, completed, deadline)
- transmissions (id, client_id, template_name, status, sent_at)
- admins (id, email, plan, stripe_customer_id)

## Deployment steps (high level)
- Add environment variables to Vercel project settings:
  - FIREBASE_PROJECT_ID
  - FIREBASE_CLIENT_EMAIL
  - FIREBASE_PRIVATE_KEY_BASE64 (base64-encoded private key)
  - FIREBASE_STORAGE_BUCKET
  - NOWPAYMENTS_API_KEY
  - NOWPAYMENTS_WEBHOOK_SECRET
  - SENDGRID_API_KEY (or SMTP creds)
  - EMAIL_FROM
  - PRICE_USD_PREMIUM
  - VITE_FIREBASE_* (client-side config)

Endpoints implemented:
- `POST /api/submit-client` — validate client data, write to Firestore, send Welcome email via SendGrid (requires `SENDGRID_API_KEY` and `EMAIL_FROM`).
- `POST /api/send-reminders` — scan clients and send reminder emails for incomplete tasks (cronable).
- `POST /api/create-payment`, `POST /api/nowpayments-webhook`, `POST /api/migrate-seed` — previously implemented.

- The `/api/create-payment` endpoint creates invoices via NowPayments and stores metadata in Firestore.
- The `/api/nowpayments-webhook` endpoint verifies webhook signatures and updates `subscriptions` and `clients` in Firestore when payments succeed.
- Use `/api/migrate-seed` (POST) to seed initial templates and example clients into Firestore for first-run setup.
2. Connect GitHub repo to Vercel and enable automatic deploys from `main` branch.
3. (Optional) create Vercel Cron to call `POST /api/send-reminders` daily.
4. Run DB migrations on Supabase (I can provide SQL migration files if you approve schema).- Add an image optimization build step (I added `npm run optimize:images` which uses `sharp` to emit AVIF/WEBP variants; I recommend running this in Vercel during build, this repo now runs it automatically before `vite build`).
- The `/api/analytics` endpoint will perform fast aggregations via Supabase with a short server-side cache (30s TTL). If SUPABASE env vars are not set the endpoint returns a fallback message.
## Next actions from me if you approve
- Implement serverless endpoints in `/api` (TypeScript), with Supabase integration.
- Add auth middleware for admin endpoints (JWT/session / Supabase magic link).
- Add migration SQL files and a small seed script for initial templates.
- Wire Stripe integration and test webhooks via Stripe CLI.

If you want, I can start scaffolding the `/api` endpoints now. Which endpoint should I implement first? (Recommended: `POST /api/submitClientForm` — captures public submissions and writes to Supabase.)
