# Production Deployment Checklist

CodeTrail is designed for Vercel + Supabase.

## 1. Vercel project

Import the GitHub repository:

`terrietanathoms43-dev/learning-code-app`

Framework: Next.js  
Production branch: `main`

## 2. Production environment variables

Set these in Vercel for **Production** and **Preview** unless you intentionally want separate backends:

```
NEXT_PUBLIC_SUPABASE_URL=https://zwycratbvtxgfsofmqie.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<Supabase publishable key>
SUPABASE_URL=https://zwycratbvtxgfsofmqie.supabase.co
SUPABASE_SECRET_KEY=<Supabase secret key>
OPENAI_API_KEY=<OpenAI API key>
OPENAI_MODEL=gpt-6-luna
AI_COACH_DAILY_LIMIT=20
```

Never expose `SUPABASE_SECRET_KEY` or `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.

## 3. Supabase Auth URLs

After Vercel gives the production URL, configure Supabase Auth:

- **Site URL:** the production CodeTrail URL
- **Redirect URL:** `https://<production-domain>/auth/callback`
- Add the corresponding preview callback pattern only if preview authentication is required.

## Auth launch requirements

Before inviting real users:

- Set the Supabase **Site URL** to `https://learning-code-app.vercel.app`.
- Keep `https://learning-code-app.vercel.app/auth/callback` in the allowed redirect URLs.
- In **Authentication > Providers > Email**, set the minimum password length to at least **8** so the backend matches the CodeTrail UI.
- Configure a **custom SMTP provider** for reliable signup confirmation and password-recovery email delivery. Supabase's built-in mail service is rate-limited and is better suited to development/testing.
- Test both a new-account confirmation email and the full **Forgot password → recovery email → new password → sign in** flow.
- For a public signup form, enable Supabase Auth CAPTCHA and review the Auth rate limits before launch.
- Supabase's leaked-password protection is recommended when available. The current CodeTrail Supabase organization is on the Free plan; Supabase currently limits leaked-password protection to Pro and above.

## 4. Readiness check

After deployment, request:

`GET /api/health`

Expected production response:

```json
{
  "status": "ok",
  "database": "ok",
  "publishedLessons": 9,
  "aiCoach": "configured"
}
```

HTTP status should be **200**.

A 503 response means one or more required production services are not configured or reachable.

## 5. Release verification

Before considering a deployment production-ready:

1. Home page loads.
2. Learn path loads all nine Python nodes.
3. First lesson can be opened.
4. New account can sign in.
5. Profile row is created.
6. Completing a lesson saves progress and awards XP once.
7. Locked lessons cannot be completed out of order.
8. Daily goal and timezone settings persist.
9. AI Code Coach returns a hint for a signed-in learner.
10. `/api/health` returns 200.
11. Vercel runtime errors show no active production error cluster.
12. Supabase Security Advisor is clean.

## 6. Database migrations

The live Supabase project currently includes:

- `initial_learning_schema`
- `add_foreign_key_indexes`

For future schema changes, create a new migration rather than editing production state manually.
