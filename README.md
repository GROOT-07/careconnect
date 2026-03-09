# 🌿 CareConnect — Unified Care Platform

A full-stack Next.js 14 application for compassionate elder care management — with Memory Bloom AI at its heart.

## ✨ Features

- **Role-based Authentication** — Family, Caregiver, Patient, Admin
- **Family Portal** — Care logs, booking, memory gallery, messaging
- **Caregiver Dashboard** — Schedule, task management, activity logging, route overview
- **Memory Bloom (Patient)** — AI-powered memory companion powered by Claude
- **Admin Dashboard** — Platform analytics, client/caregiver management, booking oversight
- **Real Booking System** — Calendar-based slot booking with SQLite/PostgreSQL backend
- **AI Memory Chat** — Powered by Anthropic's Claude API

## 🚀 Quick Start (Local)

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment
```bash
cp .env.example .env
```
Edit `.env` and add your Anthropic API key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

### 3. Set up the database
```bash
npm run db:generate    # Generate Prisma client
npm run db:push        # Create database tables
npm run db:seed        # Seed with demo data
```

### 4. Start the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔑 Demo Credentials

| Role       | Email                       | Password      |
|------------|-----------------------------|---------------|
| Admin      | admin@careconnect.com        | admin123      |
| Family     | sarah@example.com            | family123     |
| Caregiver  | maria@careconnect.com        | caregiver123  |
| Patient    | eleanor@example.com          | patient123    |

## 🌐 Deploy to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial CareConnect deployment"
git remote add origin https://github.com/yourname/careconnect.git
git push -u origin main
```

### 2. Import to Vercel
- Go to [vercel.com](https://vercel.com) → New Project → Import your repo

### 3. Add Environment Variables in Vercel Dashboard
```
DATABASE_URL=postgresql://...  (from Vercel Postgres or Neon.tech)
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
NEXTAUTH_URL=https://your-app.vercel.app
ANTHROPIC_API_KEY=sk-ant-your-key
```

### 4. Set up Vercel Postgres
- In Vercel Dashboard → Storage → Create Postgres Database
- Copy the `DATABASE_URL` to your env vars
- Run migrations: `npx prisma db push` with the production DATABASE_URL

### 5. Deploy!
Vercel auto-deploys on every push to main.

## 📁 Project Structure

```
src/
├── app/
│   ├── api/           # API routes (auth, bookings, clients, memories, etc.)
│   ├── family/        # Family member dashboard
│   ├── caregiver/     # Caregiver dashboard  
│   ├── patient/       # Memory Bloom patient experience
│   ├── admin/         # Admin dashboard
│   └── page.tsx       # Landing page
├── components/
│   ├── ui/            # Button, Input, Modal, Toast, Badge
│   ├── layout/        # DashNav
│   ├── shared/        # StatCard, Timeline, AlertItem
│   ├── patient/       # MoodCheckin
│   └── landing/       # LandingPage
├── lib/
│   ├── auth.ts        # Session-based authentication
│   ├── db.ts          # Prisma client singleton
│   └── utils.ts       # Helpers
└── middleware.ts       # Route protection
prisma/
├── schema.prisma      # Database schema (SQLite/PostgreSQL)
└── seed.ts            # Demo data seeder
```

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Auth**: Custom session-based (bcrypt + cookies)
- **AI**: Anthropic Claude API (Memory Bloom)
- **Styling**: Tailwind CSS + custom design system
- **Fonts**: Fraunces (display) + DM Sans (body)

## 🔧 Environment Variables Reference

| Variable | Description |
|---|---|
| `DATABASE_URL` | SQLite file path or PostgreSQL connection string |
| `NEXTAUTH_SECRET` | 32-byte random secret for session signing |
| `NEXTAUTH_URL` | Your deployment URL |
| `ANTHROPIC_API_KEY` | From console.anthropic.com |

## 📞 Support

For questions or issues, check the Anthropic docs at docs.anthropic.com or open an issue on GitHub.
