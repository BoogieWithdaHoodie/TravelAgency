# Meridian Journeys

Meridian Journeys is a full-stack travel package website where visitors can discover destinations, explore trip details, create an account, save trips, and order travel packages through Stripe Checkout.

The React frontend provides a responsive travel agency experience, while the Express API manages authentication, destination data, saved trips, orders, order items, and payment processing. PostgreSQL stores application and purchase data through Drizzle ORM, with Better Auth handling account sessions.

## Features

### Travel discovery

- Responsive homepage with hero, destination, testimonial, about, and contact sections
- Destination cards with package name, country, category, duration, price, image, and description
- Search by destination, country, or category
- Filter trips by category
- Sort trips by price, duration, or featured order
- View a dedicated detail page for each destination
- Smooth navigation between page sections and destination pages

### Account and saved trips

- Account registration and sign-in with Better Auth
- Signed-in account identity shown in the navigation
- Sign-out support with authentication cookies
- Signed-in users can save or remove destinations
- Saved trips are scoped to the signed-in account and stored in PostgreSQL
- The saved-trips view displays only trips belonging to the current user

### Stripe payments

- Authenticated checkout protected by server-side session middleware
- Server-controlled destination prices retrieved from PostgreSQL
- Stripe Checkout sessions created with prices in USD minor units
- Pending order and order-item records created before payment
- Order and destination snapshots stored to preserve purchased package details
- Signature-verified Stripe webhooks handle completed checkout sessions
- The webhook is the only process allowed to change an order to `paid`
- Authenticated order lookup with an order ownership check
- Payment success page with polling while Stripe payment confirmation arrives
- Refresh-safe success-page order lookup

### Database and API

- PostgreSQL database managed with Drizzle ORM
- Database schema generation, migration pushing, and Drizzle Studio support
- Express routes for health checks, destinations, saved trips, checkout, webhooks, and orders
- Server-side errors logged without exposing implementation details to API clients

## Technology

| Area | Technology |
| --- | --- |
| Frontend | React 19, Vite, Tailwind CSS, React Router |
| Authentication | Better Auth |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL, Drizzle ORM, postgres.js |
| Payments | Stripe Checkout and Stripe webhooks |
| Deployment | Vercel frontend and Render backend |

## Project structure

```text
client/
  src/
    components/       Homepage, navigation, destination, account, and success views
    lib/              Authentication and formatting helpers
    App.jsx           Application routes
  vercel.json         Vercel API rewrite and SPA configuration

server/
  src/
    db/               Database connection, schema, seed data, and migrations support
    middleware/       Better Auth session middleware
    routes/           Destination, saved-trip, checkout, order, and webhook routes
    auth.js           Better Auth configuration
    index.js          Express application setup
  drizzle/            Generated SQL migrations and Drizzle metadata
```

## Requirements

- Node.js 24 for the server
- npm
- PostgreSQL database
- Stripe account with **Test mode** enabled
- Stripe CLI for local webhook testing

## Local setup

### 1. Install dependencies

From the project root:

```powershell
cd server
npm install

cd ..\client
npm install
```

### 2. Configure the server

Create `server/.env` for the local environment:

```env
DATABASE_URL=your_postgresql_connection_string
BETTER_AUTH_SECRET=your_long_random_secret
BETTER_AUTH_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
PORT=3000
STRIPE_SECRET_KEY=sk_test_your_test_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_local_webhook_secret
```

Do not commit `.env` files. Keep live secret keys private and use Stripe test keys while developing.

Prepare the database:

```powershell
cd ..\server
npm run db:push
npm run db:seed
```

### 3. Start the backend

```powershell
npm run dev
```

The Express API should listen on `http://localhost:3000`. Its health endpoint is:

```text
http://localhost:3000/api/health
```

### 4. Start the frontend

Open another terminal:

```powershell
cd client
npm run dev
```

Open the Vite URL, normally `http://localhost:5173`. Vite proxies `/api` requests to the local Express server.

### 5. Listen for Stripe webhooks locally

Install and authenticate the Stripe CLI, then run:

```powershell
stripe login
stripe listen --forward-to localhost:3000/api/webhooks/stripe --events checkout.session.completed
```

Copy the CLI signing secret starting with `whsec_` into `server/.env` as `STRIPE_WEBHOOK_SECRET`, then restart the backend.

## Testing payments locally

1. Start the backend, frontend, and Stripe CLI listener.
2. Sign in through the frontend.
3. Open a destination detail page.
4. Click **Order now**.
5. Complete Stripe Checkout using card `4242 4242 4242 4242`.
6. Use any future expiry date, three-digit CVC, and postal code.
7. Return to the success page and wait for webhook confirmation.
8. Check the `orders` and `order_items` records with Drizzle Studio:

```powershell
cd server
npm run db:studio
```

The test order should change from `pending` to `paid` only after Stripe delivers a verified `checkout.session.completed` event.

## API overview

| Method | Route | Purpose |
| --- | --- | --- |
| `GET` | `/api/health` | Check backend availability |
| `GET` | `/api/destinations` | List all destinations |
| `GET` | `/api/destinations/:id` | Get one destination |
| `GET` | `/api/saved-destinations` | List the signed-in user’s saved destination IDs |
| `POST` | `/api/saved-destinations` | Save a destination for the signed-in user |
| `DELETE` | `/api/saved-destinations/:destinationId` | Remove a saved destination |
| `POST` | `/api/checkout` | Create pending order records and a Stripe Checkout session |
| `POST` | `/api/webhooks/stripe` | Verify Stripe events and confirm completed payments |
| `GET` | `/api/orders/:orderId` | Get an order belonging to the signed-in user |

Protected routes require a valid Better Auth session. Checkout and order lookup also verify ownership or authentication before returning data.

## Database overview

### `destinations`

Stores package details used by the destination pages and server-side checkout price lookup.

### `saved_destinations`

Maps one signed-in user to one saved destination and prevents duplicate account saves.

### `orders`

Stores a purchase attempt or completed purchase, including:

- User and order IDs
- Order status
- Total price and currency
- Stripe Checkout Session ID
- Stripe Payment Intent ID
- Creation and update timestamps

New orders start as `pending`. A Stripe webhook changes them to `paid`; browser checkout success handling does not mark payment as complete.

### `order_items`

Stores each purchased item with:

- Parent order ID
- Destination ID
- Destination name snapshot
- Quantity
- Unit price snapshot

## Commands

Run these from the appropriate directory:

| Command | Directory | Purpose |
| --- | --- | --- |
| `npm run dev` | `client` | Start the Vite development server |
| `npm run build` | `client` | Create the production frontend build |
| `npm run lint` | `client` | Run ESLint |
| `npm run dev` | `server` | Start the Express server with file watching |
| `npm run start` | `server` | Start the production Express server |
| `npm run db:generate` | `server` | Generate a Drizzle migration |
| `npm run db:push` | `server` | Apply the schema to PostgreSQL |
| `npm run db:seed` | `server` | Insert starter destination records |
| `npm run db:studio` | `server` | Open Drizzle Studio |

## Deployment

The frontend can be deployed to Vercel and the Express API to Render as separate services.

Configure the backend environment on Render with:

- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL=https://your-render-service.onrender.com`
- `CLIENT_URL=https://your-vercel-site.vercel.app`
- `STRIPE_SECRET_KEY=sk_test_your_test_secret_key`
- `STRIPE_WEBHOOK_SECRET=your_dashboard_webhook_secret`

Create a Stripe webhook destination for the deployed backend:

```text
https://your-render-service.onrender.com/api/webhooks/stripe
```

Select `checkout.session.completed`, use the snapshot payload if prompted, and copy the destination signing secret into Render as `STRIPE_WEBHOOK_SECRET`. Redeploy the backend after changing the environment.

The `client/vercel.json` configuration forwards `/api` requests to the Render backend and sends React Router paths to the Vite application.
