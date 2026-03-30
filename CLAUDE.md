# HVAC BidPro — AI Bid Calculator for HVAC Contractors

## What This Is
A SaaS tool that helps HVAC contractors create professional job estimates and bids in minutes. Enter job details, get a formatted bid with material costs, labor estimates, and profit margins. Competitors charge $50-200/mo — we charge $19/mo.

## Stack
- Next.js 16 + React 19 + Tailwind CSS 4
- Supabase (auth + database)
- Vercel deployment
- TypeScript strict mode

## Architecture
- `/` — Landing page
- `/signup`, `/login` — Auth flows (Supabase)
- `/dashboard` — User's bids/estimates
- `/bid/new` — Create new bid wizard
- `/bid/[id]` — View/edit/PDF export bid
- `/pricing` — Plans (Free: 3 bids/mo, Pro: $19/mo unlimited)

## Coding Standards
- Clean Code (Uncle Bob): DRY, SRP, SOC
- Mobile-first responsive
- Error boundaries everywhere
- Loading states on all async ops

## Commands
- `bun dev` — local dev
- `bun run build` — production build

## What Needs Doing
1. Connect to real Supabase (share with scrapechat: yxpxfmsyyhcnllqcpicp)
2. Build the bid creation wizard with AI-powered cost estimation
3. PDF export for bids
4. Material/labor cost database (built-in)
5. Playwright e2e tests
6. Polish UI — professional, trust-building design
7. Deploy to Vercel
8. Production-ready
