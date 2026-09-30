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
OPENAI_API_KEY=
```

The OpenAI variable is reserved for the AI Code Coach phase. Do not expose it through a `NEXT_PUBLIC_` variable.

## Build order

### Phase 1 — Current foundation
- Visual identity and responsive shell
- Python trail
- Lesson engine
- Supabase-ready auth
- Core database schema

### Phase 2 — Persistence
- Load courses/units/lessons from Supabase
- Store lesson progress and attempts
- Unlock the next path node from real completion state
- XP ledger, daily goals and streak calculations

### Phase 3 — AI Code Coach
- Server-only OpenAI route
- Hint / explain / similar-example modes
- Context from the current lesson and student attempts
- Guardrails so the coach teaches before revealing solutions

### Phase 4 — Rich coding practice
- Sandboxed code execution
- Automated tests for Python challenges
- Project nodes and checkpoints
- Achievement engine

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
