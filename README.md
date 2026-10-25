# Meridian Journeys

Meridian Journeys is a travel agency website for discovering and exploring curated trip destinations. Visitors can browse packages, search and filter destinations, view details for each trip, and contact the agency to start planning. Users can create an account and save destinations to their account for later.

## Features

- Responsive travel homepage with destination cards and agency information
- Search destinations and filter by category, price, duration, or saved trips
- Destination detail pages with package information
- Account registration, sign-in, and sign-out using Better Auth
- Save and remove destinations using the signed-in user’s account and PostgreSQL database
- Express API for destination data, saved trips, and authentication

## Project structure

```text
client/   React, Vite, Tailwind CSS, and React Router frontend
server/   Express API, Better Auth, Drizzle ORM, and PostgreSQL
```

## Requirements

- Node.js 24 for the server
- npm
- A PostgreSQL database

## Run locally

### 1. Configure the server

Create `server/.env` with your local PostgreSQL connection and authentication settings:

```env
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
PORT=3000
```

Use your own database connection string and secret. Do not commit `.env` files or share their values.

Install the server dependencies and prepare the database:

```powershell
cd server
npm install
npm run db:push
npm run db:seed
```

Start the backend in this terminal:

```powershell
npm run dev
```

The API health endpoint is available at `http://localhost:3000/api/health`.

### 2. Start the frontend

Open a second terminal from the project root:

```powershell
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, typically `http://localhost:5173`. The Vite development server proxies `/api` requests to the local Express server.

## Useful commands

Run these from the corresponding `client` or `server` directory:

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Build the client for production (`client` only) |
| `npm run lint` | Check the client with ESLint (`client` only) |
| `npm run db:push` | Apply the Drizzle schema to the configured PostgreSQL database (`server` only) |
| `npm run db:seed` | Insert the sample destination records (`server` only) |

## Deployment

The frontend is designed to deploy as a Vite app, and the Express backend runs as a separate service. Configure production environment variables in the hosting dashboards rather than committing secrets. Set the backend’s `CLIENT_URL` to the deployed frontend origin and `BETTER_AUTH_URL` to the public backend URL. The Vercel rewrites in `client/vercel.json` forward frontend `/api` requests to the configured Render backend.
