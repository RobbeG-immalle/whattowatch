# WhatToWatch 🎬

> AI-powered movie recommendation app — describe what you want to watch and get personalized recommendations with posters, ratings, and descriptions.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/RobbeG-immalle/whattowatch)

---

## Features

- 🤖 **AI Movie Search** — type a natural language prompt, get 6-8 tailored movie recommendations
- 🎬 **Rich Movie Cards** — TMDB-powered posters, genre tags, descriptions, and ratings
- 🔐 **Authentication** — sign in with Google, GitHub, or email/password (NextAuth.js)
- ⚡ **Credits System** — 3 free credits on sign-up; buy more via Stripe
- 📋 **Watchlist** — save movies to "Want to Watch" or mark as "Already Watched"
- 🌙 **Dark Cinematic UI** — responsive, mobile-first design with gold/amber accents

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Prisma ORM |
| Auth | NextAuth.js (Google, GitHub, Credentials) |
| AI | OpenAI GPT-3.5 |
| Movie Data | TMDB API |
| Payments | Stripe Checkout |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/RobbeG-immalle/whattowatch.git
cd whattowatch
npm install
```

### 2. Set Up a Database

Create a free PostgreSQL database on [Neon](https://neon.tech) or [Supabase](https://supabase.com) and copy the connection string.

### 3. Configure Environment Variables

```bash
cp .env.example .env
```

Fill in `.env`:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | [Neon](https://neon.tech) or [Supabase](https://supabase.com) |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | [Google Cloud Console](https://console.cloud.google.com) |
| `GITHUB_ID` / `GITHUB_SECRET` | [GitHub Developer Settings](https://github.com/settings/developers) |
| `OPENAI_API_KEY` | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `TMDB_API_KEY` | [TMDB](https://www.themoviedb.org/settings/api) (free) |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` | [Stripe Dashboard](https://dashboard.stripe.com/apikeys) |
| `STRIPE_WEBHOOK_SECRET` | [Stripe Webhooks](https://dashboard.stripe.com/webhooks) |

### 4. Initialize the Database

```bash
npx prisma db push
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Stripe Webhooks (Local Development)

Install the [Stripe CLI](https://stripe.com/docs/stripe-cli) and run:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the webhook signing secret printed by the CLI and set it as `STRIPE_WEBHOOK_SECRET` in your `.env`.

---

## Deploying to Vercel

1. Click the **Deploy with Vercel** button above, or push to GitHub and import the repo in [Vercel](https://vercel.com).
2. Add all environment variables from `.env.example` in the Vercel dashboard.
3. Set `NEXTAUTH_URL` to your production URL (e.g. `https://whattowatch.vercel.app`).
4. Add a Stripe webhook pointing to `https://your-app.vercel.app/api/stripe/webhook`.

---

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes (auth, search, watchlist, credits, stripe)
│   ├── dashboard/     # Main search page
│   ├── watchlist/     # Watchlist management
│   ├── credits/       # Credit purchase page
│   ├── profile/       # User profile
│   ├── login/         # Sign in
│   └── register/      # Sign up
├── components/        # Reusable UI components
├── lib/               # Prisma, NextAuth, OpenAI, TMDB, Stripe clients
├── providers/         # React context providers
└── types/             # TypeScript type definitions
prisma/
└── schema.prisma      # Database schema
```

---

## License

MIT
