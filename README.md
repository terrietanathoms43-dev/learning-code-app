# CodeTrail

A gamified coding-learning app built around visual learning worlds. CodeTrail currently includes Python Foundations, Web Foundations and JavaScript Foundations, interactive exercises, saved coding projects, secure code execution, progress tracking, and a Supabase-authenticated architecture.

## What is already built

- Next.js 16 App Router foundation
- Responsive landing page and custom robot mascot
- Duolingo-inspired winding learning trail with completed/current/locked nodes
- Lesson, checkpoint and project node types
- Interactive lesson player with multiple choice, fill-in and code-entry exercises
- Server-side answer checking route so the answer key is not sent with lesson payloads
- Supabase SSR client/server/proxy utilities
- Email/password sign-up and sign-in screen
- Auth callback route
- Supabase migrations with RLS, explicit Data API grants, and Python, Web and JavaScript learning content
- Signed-in exercise-attempt persistence through a server-only Supabase secret key
- Verified completion, one-time XP rewards, streak calculations and automatic path unlocking
- Cross-world progress dashboard and practice deck
- Full Python Foundations path through Conditions, Loops, Functions and the Mini Project
- AI Code Coach with hint / explain / similar-example modes
- Cross-world achievement badges including Python Pioneer, Web Builder and Logic Lab Graduate
- Editable learner profile and daily XP goals
- Timezone-aware streaks and activity dates
- Web Foundations path covering HTML, CSS, JavaScript and a mini project
- JavaScript Foundations path covering variables, types, decisions, arrays, loops, functions and a score-tracker project
- Private saved-project workspace for Python, HTML, CSS, JavaScript and three-file web apps
- Sandboxed Python and JavaScript execution with network isolation and hourly quotas
- HTML/CSS and isolated multi-file web previews
- Lightweight syntax highlighting, line numbers, smart indentation, bracket pairing, reset/copy/run controls and runtime error jump-to-line support
- Username support and production health checks

## Run locally

1. Install Node.js 22 or newer.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Add the Supabase project URL and publishable key.
5. Run `npm run dev`.

## Environment variables

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_URL=
SUPABASE_SECRET_KEY=
OPENAI_API_KEY=
OPENAI_MODEL=gpt-6-luna
AI_COACH_DAILY_LIMIT=20
```

The Supabase secret key and OpenAI API key are server-only. Never expose either through a `NEXT_PUBLIC_` variable.

The AI Code Coach uses the Responses API, stores no model response history through the API request, and applies a configurable rolling request limit.

## Build order

### Phase 1 — Current foundation
- Visual identity and responsive shell
- Python trail
- Lesson engine
- Supabase-ready auth
- Core database schema

### Phase 2 — Persistence
- Store signed-in attempts by lesson session
- Verify completion server-side
- Award one-time XP and calculate timezone-aware streaks
- Unlock the next path node from saved completion state

### Phase 3 — AI Code Coach
- Server-only Responses API route
- Hint / explain / similar-example modes
- Per-user rolling usage limit
- Guardrails so the coach teaches before revealing solutions

### Phase 4 — Python Foundations completion
- Conditions, Loops and Functions lessons
- Final Mini Project
- Achievement engine
- Editable profile and daily XP goals

### Phase 5 — Rich coding practice
- Sandboxed Python and JavaScript execution
- Saved project workspace
- HTML/CSS previews
- Expanded exercise types including ordering and debugging

### Phase 6 — Multiple learning worlds
- Web Foundations
- JavaScript Foundations
- Cross-world progress and practice
- World-aware achievements and navigation

### Phase 7 — Growth features
- Admin course editor
- Additional learning worlds
- Richer project tooling
- Leaderboards, friend challenges and social learning

## Database

The first migration is in `supabase/migrations/20260930_initial_learning_schema.sql`.

Important security choices:
- Public learning content is read-only.
- User progress is protected with Row Level Security.
- Correct exercise answers live in the private schema rather than a public Data API table.
- XP events are readable by their owner but are not directly insertable from the browser.

## Browser E2E checks

CodeTrail includes a Playwright browser suite under `e2e/` and an opt-in GitHub Actions workflow named **Browser E2E**.

The public mobile flow always runs when the workflow is started. Authenticated checks require a dedicated non-personal test account configured as GitHub Actions secrets:

- `E2E_TEST_EMAIL`
- `E2E_TEST_PASSWORD`

The authenticated suite verifies sign-in return routing, the Projects workspace, multi-file Web App editing, autosave, the live JavaScript preview, HTML export, project deletion, Profile access, and sign-out. Keep these credentials limited to a test account; never use a real learner account in CI.

