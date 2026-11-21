# CivicResolve 2.0

CivicResolve is a civic-tech prototype for reporting local infrastructure and public-space issues, coordinating municipal responses, and keeping residents informed. The demonstration uses Bengaluru, India, as its example city.

## Chosen vertical

**Civic technology / GovTech:** citizen-to-municipality issue reporting and resolution. The project focuses on everyday civic problems such as potholes, overflowing waste, damaged streetlights, water leaks, broken traffic signals, drainage issues, unsafe footpaths, and fallen trees.

## The problem and our approach

Residents may not know where to send a report or whether anyone is acting on it. Municipal teams need reports with enough context to triage and route work. CivicResolve brings those steps into one shared workflow:

1. A resident submits an issue with a title, description, category, location, coordinates, and optional image.
2. The server analyzes the report with Gemini when configured. Otherwise, a rule-based demo analyzer returns a clearly labeled recommendation.
3. The analysis proposes a category, severity, urgency score, department, explanation, action, and suggested response target. These are triage aids; municipal staff remain responsible for decisions.
4. The report receives a public complaint ID and appears in the issue directory and map.
5. Residents can search, filter, follow, and endorse community reports. Admin users can review assignments and update issue status.
6. Status changes are recorded in a timeline and can generate notifications for the reporter.

The application has two experiences: a citizen workspace for reporting and tracking issues, and a municipal workspace for reviewing reports, workload, and analytics. It is designed to remain demonstrable without a database or AI credentials by using browser-stored demo data.

## How the solution works

### Frontend

- React, JavaScript/JSX, Vite, and custom responsive CSS provide the application interface.
- React Router, Lucide icons, Recharts, and Leaflet/OpenStreetMap support navigation, visualizations, and the interactive map.
- `src/services/api.js` calls the REST API. When the API is unavailable, the browser demo uses local storage for the demonstration workflow.

### Backend and data

- An Express REST API is in `server/src/index.ts`.
- PostgreSQL persistence uses Prisma models in `server/prisma/schema.prisma`.
- The API includes registration and login, complaint submission and listing, map data, endorsements and follows, profile and notification operations, admin assignment and status changes, analytics, and simulated admin verification.
- Passwords are hashed with bcrypt. API access uses JWT bearer tokens; admin endpoints require an authorized and verified admin.

### AI analysis

`POST /api/ai/analyze-complaint` runs on the server. When `GEMINI_API_KEY` is configured, the server sends report text and an optional supported image to Gemini and validates key response fields. If the key is missing or the call fails, the server returns a rule-based recommendation labeled as demo analysis. Image interpretation is limited to directly visible evidence and should be treated as uncertain. AI output is not an emergency determination or a substitute for on-site assessment.

## Assumptions and prototype limits

- Bengaluru locations, departments, demo accounts, issue records, metrics, and activity are sample data; they are not a live feed from a municipal authority.
- Department recommendations and urgency scores are suggestions. Municipal staff should review them, especially for safety-sensitive reports.
- SLA targets are illustrative demo targets, not official service commitments.
- Admin identity verification is simulated. An application remains pending until an authorized super-admin review; entering an employee ID does not prove real-world identity.
- The quick role-switch and browser-created demo accounts are judge/demo conveniences, not production authentication. Do not use them as an access-control boundary for a public deployment.
- Browser demo records stay in that browser and do not synchronize to PostgreSQL. Database-backed actions require the API and database to be running and the user to sign in through the seeded demo account.
- OpenStreetMap tiles require an internet connection.
- Image evidence is optional and limited to 1 MB in the browser demo.

## Features

- Citizen and municipal demo workspaces
- Issue reporting with image preview, location coordinates, and AI analysis preview
- Complaint IDs, detail views, status timelines, and notifications
- Searchable/filterable public issue directory, endorsements, and follows
- Interactive map with Bengaluru demo issue markers
- Admin issue assignment and status updates
- Dashboard summaries, charts, department workload, and CSV export
- PostgreSQL/Prisma-backed API, with local browser demo fallback

## Requirements

- Node.js 20 or newer and npm
- PostgreSQL 14 or newer for database-backed use

## Run the browser demo

1. Open a terminal in the project folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the frontend:

   ```bash
   npm run dev
   ```

4. Open the local address printed by Vite, usually `http://localhost:5173`.
5. Sign in with one of the demo accounts below, or use the in-app demo role switch. The browser demo does not require PostgreSQL or a Gemini key.

### Demo accounts

- Citizen: `citizen@civicresolve.demo` / `Citizen@123`
- Verified municipal admin: `admin@civicresolve.demo` / `Admin@123`

These are public demo credentials. Do not reuse them or their passwords in a real deployment.

## Run the full stack

1. Copy `.env.example` to `.env` in the project root.
2. Set `DATABASE_URL` to your PostgreSQL connection string and replace `JWT_SECRET` with a long, private random value. Keep `.env` out of Git.
3. Create the database named `civicresolve`, or update the database name in `DATABASE_URL`.
4. Generate Prisma Client, create/update the schema, and seed sample data:

   ```bash
   npm run db:generate
   npm run db:push
   npm run seed
   ```

5. Start the API in one terminal:

   ```bash
   npm run server
   ```

6. Start the frontend in a second terminal:

   ```bash
   npm run dev
   ```

The Vite development server proxies `/api` requests to the local API on port 4000. Set `CLIENT_ORIGIN` if the frontend runs at a different origin.

## Configure Gemini (optional)

Add your Gemini key to the server environment in the project-root `.env`:

```env
GEMINI_API_KEY=your_private_key
GEMINI_MODEL=gemini-3.8-flash
```

The API key must stay server-side; do not add it to frontend variables or commit it. Without a key, CivicResolve uses its labeled demo analyzer.

## Useful commands

```bash
npm run dev          # Start Vite frontend
npm run server       # Start Express API
npm run build        # Build frontend for production
npm run typecheck    # Type-check the server and Prisma seed code
npm run db:generate  # Generate Prisma Client
npm run db:push      # Apply the Prisma schema to the configured database
npm run seed         # Add demo accounts, departments, and sample issues
```

## Project layout

```text
src/
  main.jsx             # React application and page flows
  style.css            # Responsive visual system
  services/api.js      # Frontend REST client and data mapping
server/
  src/index.ts         # Express API, auth, AI, and application routes
  prisma/schema.prisma # PostgreSQL data models and relationships
  prisma/seed.ts       # Demo accounts and sample Bengaluru issues
```

## Current prototype scope

CivicResolve demonstrates the reporting-to-resolution concept and its main citizen/admin flows. Production use would require deployment-specific security review, real government identity verification, operational integration with municipal departments, a managed upload service, monitoring, and end-to-end testing against the intended hosting and database setup.
