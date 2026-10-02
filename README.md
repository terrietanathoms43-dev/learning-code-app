# CodeTrail

A gamified coding-learning app built around a visual learning path. The current foundation focuses on the first Python course, short interactive exercises, progress-ready data structures, and a Supabase-authenticated architecture.

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
- Initial Supabase migration with RLS, explicit Data API grants and Python seed content
- Signed-in exercise-attempt persistence through a server-only Supabase secret key
- Verified completion, one-time XP rewards, streak calculations and automatic path unlocking
- Progress dashboard and practice deck
- Full Python Foundations path through Conditions, Loops, Functions and the Mini Project
- AI Code Coach with hint / explain / similar-example modes
- Achievement badges including Python Pioneer
- Editable learner profile and daily XP goals
- Timezone-aware streaks and activity dates

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
- Sandboxed Python execution
- Automated tests for free-form code
- Project workspace and saved code

### Phase 5 — Growth features
- Admin course editor
- More languages
- Leaderboards
- Friend challenges and social learning

## Database

The first migration is in `supabase/migrations/20260930_initial_learning_schema.sql`.

Important security choices:
- Public learning content is read-only.
- User progress is protected with Row Level Security.
- Correct exercise answers live in the private schema rather than a public Data API table.
- XP events are readable by their owner but are not directly insertable from the browser.
