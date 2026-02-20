
# Next.js Dashboard App

This project is a Next.js 16+ dashboard app using the App Router, TypeScript, Tailwind CSS, Drizzle ORM, and Better Auth for authentication. It is ready for local development and deployment with a PostgreSQL database (Neon or compatible).

## Getting Started

### 1. Install dependencies

```sh
pnpm install
```

### 2. Configure environment variables

Create a `.env` file in the project root with the following variables (see `.env` for a template):

```
DATABASE_URL=...           # Main Postgres connection string (pooled)
DATABASE_URL_UNPOOLED=...  # (Optional) Unpooled Postgres connection string
PGHOST=...
PGHOST_UNPOOLED=...
PGUSER=...
PGDATABASE=...
PGPASSWORD=...
POSTGRES_URL=...           # Used by Neon/Drizzle
POSTGRES_URL_NON_POOLING=...
POSTGRES_USER=...
POSTGRES_HOST=...
POSTGRES_PASSWORD=...
POSTGRES_DATABASE=...
POSTGRES_URL_NO_SSL=...
POSTGRES_PRISMA_URL=...
AUTH_SECRET=...            # Auth secret (openssl rand -base64 32)
AUTH_URL=...               # Auth endpoint, e.g. http://localhost:3000/api/auth
NEXT_PUBLIC_APP_URL=...    # (Optional) Public app URL for Better Auth client
```

> **Note:** You can use the provided `.env` as a reference for required variables. For Neon, you can copy connection strings from the Neon dashboard.

### 3. Database setup

Run the seed route to initialize tables and seed data:

```
GET /seed/route.ts (or visit /seed in your browser)
```

### 4. Run the development server

```sh
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

- `app/` — App Router pages, layouts, and features
- `app/ui/` — UI components (shared and feature-specific)
- `app/lib/` — Data utilities, types, and helpers
- `db/` — Drizzle ORM schema
- `drizzle.config.ts` — Drizzle ORM config
- `tailwind.config.ts` — Tailwind CSS config
- `auth.ts` — Better Auth server config

## Key Technologies

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- Drizzle ORM
- Neon Postgres (or compatible)
- Better Auth (with passkey and magic link plugins)

## Configuration Notes

- **Database:** Uses Neon or any Postgres-compatible database. Update all `DATABASE_URL` and `POSTGRES_URL` variables as needed.
- **Auth:** Uses Better Auth. Set `AUTH_SECRET` and `AUTH_URL` in your `.env`.
- **App URL:** For some auth flows, set `NEXT_PUBLIC_APP_URL` to your deployed/public URL.
- **Drizzle ORM:** Schema is in `db/auth-schema.ts`. Config in `drizzle.config.ts`.
- **SVG Support:** Uses `@svgr/webpack` (see `next.config.ts`).

## Scripts

- `pnpm dev` — Start dev server
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Lint code

## Troubleshooting

- Ensure all environment variables are set before running the app.
- If you change the database schema, update Drizzle and re-run the seed route.

---

For more information, see the [Next.js documentation](https://nextjs.org/docs) and [Better Auth documentation](https://docs.betterauth.dev/).
