# Founder Revenue Co-Pilot — GTM System Reference

> Reference architecture from the outreach/GTM execution variant. Use when adding contacts, products, outreach, or accountability features.

## Overview
Internal AI-powered GTM execution system for founders. Tracks outreach, classifies replies, generates messaging, and enforces daily accountability to close first paying customers within 30 days.

## Architecture
- **Frontend**: React + Vite + TailwindCSS + shadcn/ui + wouter routing
- **Backend**: Express.js + Drizzle ORM + PostgreSQL
- **AI**: OpenAI via Replit AI Integrations (gpt-5-mini for agent tasks)
- **Charts**: Recharts for analytics dashboard

## Key Features (MVP)
1. **Dashboard** - Analytics overview with daily progress, pipeline metrics, charts
2. **Contacts** - CRUD for outreach targets with ICP scoring
3. **Products** - Product/offer management with AI Offer Clarity Agent
4. **Outreach** - AI-generated LinkedIn/email messages, mark as sent
5. **Reply Classification** - AI categorizes replies with suggested responses
6. **Accountability** - Daily message targets, increment tracking, weekly breakdown

## Data Models (shared/schema.ts)
- `contacts` - Outreach targets with ICP score, status, revenue value
- `products` - Product offers with AI-generated clarity fields
- `outreachMessages` - Generated/manual outreach linked to contacts/products
- `replies` - Incoming replies with AI classification and suggested responses
- `dailyProgress` - Daily outreach tracking with targets

## API Routes (server/routes.ts)
- `/api/contacts` - CRUD
- `/api/products` - CRUD + POST /:id/clarity (AI)
- `/api/outreach` - GET, POST /generate (AI), PATCH /:id/sent
- `/api/replies` - GET, POST, POST /:id/classify (AI)
- `/api/daily-progress` - GET /today, GET /week, PATCH /today, POST /today/increment

## File Structure
- `client/src/pages/` - Dashboard, Contacts, Products, Outreach, Replies, Accountability
- `client/src/components/` - AppSidebar, ThemeToggle
- `server/` - index.ts, routes.ts, storage.ts, db.ts, seed.ts
- `shared/schema.ts` - All Drizzle schemas and Zod validators
