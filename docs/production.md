# Production Deployment Checklist

CodeTrail is designed for Vercel + Supabase.

## 1. Vercel project

Repository: `terrietanathoms43-dev/learning-code-app`

- Framework: Next.js
- Production branch: `main`
- Production URL: `https://learning-code-app.vercel.app`

## 2. Production environment variables

Set these in Vercel for Production, and for Preview only if preview deployments should use live services:

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

## 3. Current production content

As of October 9, 2026, the live database contains:

- 3 published courses / learning worlds
- 19 published lessons
- 69 published exercises
- Python Foundations
- Web Foundations
- JavaScript Foundations
- Saved Projects workspace
- Secure Python/JavaScript sandbox execution
- HTML/CSS/Web App browser previews
- AI Code Coach with Hint, Explain, Example, and free-form Ask modes

## 4. Supabase Auth URLs

Configure:

- Site URL: `https://learning-code-app.vercel.app`
- Redirect URL: `https://learning-code-app.vercel.app/auth/callback`

Add preview callback URLs only when preview authentication is intentionally required.

## 5. Auth launch requirements

Before inviting real users:

- Keep the Supabase minimum password length at 8 or greater.
- Configure a custom SMTP provider for reliable signup confirmation and password-recovery email delivery.
- Test: signup → confirmation email → sign in.
- Test: forgot password → recovery email → new password → sign in.
- Enable Supabase Auth CAPTCHA before broad public signup.
- Review Supabase Auth rate limits.
- Leaked-password protection is recommended when available. The current Supabase organization is on the Free plan, where this protection is not currently available.

## 6. Readiness endpoint

Request:

`GET /api/health`

Expected production behavior:

- HTTP 200
- `status: "ok"`
- `database: "ok"`
- `publishedLessons: 19` at the current release
- `persistence: "configured"`
- `aiCoach: "configured"`

A 503 means one or more required production services are unavailable or not configured.

## 7. Release acceptance test

Before declaring a release production-ready, verify all of the following on the production domain.

### Public and navigation

1. Home page loads on phone and desktop.
2. Python Foundations loads.
3. Web Foundations loads.
4. JavaScript Foundations loads.
5. First lesson in each world opens for a guest.
6. Locked lessons cannot be opened out of sequence for signed-in learners.
7. Mobile world switcher and top navigation remain usable without horizontal overflow.

### Accounts

8. New account can sign up and confirm by email.
9. Sign-in returns the learner to the safe `next` destination when one was supplied.
10. Profile row is created.
11. Username availability and save flow work.
12. Daily goal and timezone settings persist.
13. Sign-out works.
14. Password-recovery flow works end to end.

### Learning progress

15. Correct and incorrect exercise feedback works for choice, text, code, order and debug challenges.
16. Completing a lesson saves progress.
17. XP is awarded once only.
18. The next lesson in the same world unlocks.
19. Replaying a completed lesson does not duplicate completion XP.
20. Progress page reports each world separately while sharing account XP/streak totals.

### AI Code Coach

21. Give me a better hint returns exercise-specific guidance.
22. Explain the concept works.
23. Similar example works.
24. Ask the Coach accepts a typed coding question.
25. The Coach does not reveal the exact current exercise solution.
26. Failed upstream AI requests do not consume the daily quota.
27. Built-in guidance appears if the live AI service is unavailable.
28. Moderation failures degrade safely.

### Projects and runner

29. Create, rename, duplicate and delete a saved project.
30. Autosave survives switching between projects and navigating away.
31. Python project runs in the isolated sandbox.
32. JavaScript project runs in the isolated sandbox.
33. Infinite/slow code is stopped by the execution timeout.
34. Network access from sandboxed code is blocked.
35. HTML/CSS/Web App preview is sandboxed.
36. Run quota is enforced.
37. Runtime errors are shown without crashing the page.

### Operations

38. `/api/health` returns 200.
39. GitHub CI passes audit, lint, tests, build and production-server smoke tests.
40. Vercel shows no active production runtime-error cluster.
41. Supabase Security Advisor has no actionable application-level warnings.
42. Supabase Performance Advisor has no critical production issue.

## 8. Database migrations

All production schema changes must be represented by a new file under `supabase/migrations/`.

Do not edit an already-applied production migration to represent a new change.

When a database change is made directly during development, record the exact matching migration in the repository before calling the feature complete.

## 9. Release blockers that require dashboard/account configuration

These cannot be fully completed from application code alone:

- Custom SMTP setup and deliverability verification
- CAPTCHA provider configuration in Supabase Auth
- Leaked-password protection if/when the Supabase plan supports it
- Final real-device signed-in acceptance test
