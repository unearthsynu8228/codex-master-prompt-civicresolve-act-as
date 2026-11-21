# CivicResolve 2.0

A responsive civic issue reporting app for Bengaluru. The browser demo works without external services and saves its sample data locally. When the API and PostgreSQL are available, backend sign-in, complaint listing/submission (including evidence images), endorsements, follows, status updates, profile updates, notifications, and AI analysis use the REST API; the app falls back to browser storage for demo use when the API is unavailable.

## Requirements

- Node.js 20 or newer and npm
- PostgreSQL 14 or newer for the API

## Quick start

1. Install Node.js, then run `npm install` in this folder.
2. Start the frontend demo with `npm run dev` and open the local URL Vite prints.
3. Use **Sign in or register** for demo login, citizen registration, simulated admin applications, and the password reset prototype. Use **Switch to admin demo** for quick judge access. The demo UI works without a database or external API key.

## Full stack setup

1. Copy `.env.example` to `.env` and set `DATABASE_URL` and a private `JWT_SECRET`.
2. Create the PostgreSQL database named `civicresolve` (or update the URL).
3. Run `npm run db:generate`, `npm run db:push`, and `npm run seed`.
4. Run `npm run server` in one terminal and `npm run dev` in another.

Demo accounts:

- Citizen: `citizen@civicresolve.demo` / `Citizen@123`
- Verified municipal admin: `admin@civicresolve.demo` / `Admin@123`

The frontend role switch is a judge-friendly demo shortcut and is not production authentication. The API uses bcrypt password hashes, JWT bearer tokens, role checks, verified-admin gating, request validation, unique per-account endorsements, and a masked verification ID. An admin application is simulated as Pending until reviewed by an authorized super-admin; entering an employee number alone never grants access. Demo SLA values are illustrative and are not government service commitments.

## Gemini

AI analysis runs server-side at `POST /api/ai/analyze-complaint`. Set `GEMINI_API_KEY` in the project-root `.env` to enable Gemini text and image analysis. The default model is `gemini-3.8-flash`; set `GEMINI_MODEL` to override it. The API key is sent in the server-side request header and never returned to the browser. If Gemini is unavailable, the app uses rule-based demo analysis and labels that fallback. Never place the key in frontend source. Image evidence is limited to 1 MB in browser demo storage and the AI is instructed to describe only directly visible details with uncertainty.

## What's included

- Citizen and admin dashboard views, responsive layout, charting, and an interactive Leaflet / OpenStreetMap map
- Ten seeded sample issue records, severity, urgency, status, department, endorsement counts, and timelines
- Issue reporting with AI preview, search/filter directory, details and timeline panel, endorsement, admin status updates, and CSV export
- REST endpoints for authentication, complaints, map, AI analysis, department assignment, status events, notifications, profile, and admin dashboard
- PostgreSQL Prisma models for users, roles, profiles, departments, officers, issues, images, timelines, endorsements, follows, notifications, simulated verification, and resolutions

The judge-friendly role switch and browser-created demo accounts are local prototypes. For database-backed behavior, sign in through the API-backed demo credentials after seeding; reports and actions from that session use PostgreSQL. If the API or database is unavailable, the UI remains usable in browser demo mode. The basemap loads OpenStreetMap tiles, so map tiles need an internet connection.
