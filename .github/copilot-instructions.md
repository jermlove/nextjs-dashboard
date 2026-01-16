# Copilot Instructions for nextjs-dashboard

## Project Overview
This is a Next.js 14+ app using the App Router, TypeScript, and Tailwind CSS. The project is structured for modularity and clarity, with feature-based folders under `app/` and reusable UI components in `app/ui/`.

## Architecture & Data Flow
- **App Router**: Pages and layouts are organized under `app/`, with nested routes for features (e.g., `dashboard`, `customers`, `invoices`).
- **UI Components**: Shared and feature-specific components are in `app/ui/`, grouped by domain.
- **Data Layer**: Data utilities and definitions are in `app/lib/`. Use these for mock data, types, and helpers.
- **API Routes**: Server actions and API endpoints are in `app/query/` and `app/seed/`.
- **Styling**: Tailwind CSS is configured in `tailwind.config.ts` and used throughout components. Global styles are in `app/ui/global.css`.

## Developer Workflows
- **Install dependencies**: `pnpm i`
- **Run dev server**: `pnpm dev`
- **Build for production**: `pnpm build`
- **Lint**: `pnpm lint`
- **Format**: `pnpm format`
- **No test suite detected**: There are no test scripts or test folders present.

## Project-Specific Patterns
- **Layouts**: Use `layout.tsx` for persistent UI across routes (see `app/layout.tsx`, `app/dashboard/layout.tsx`).
- **Page Components**: Each route has a `page.tsx` for its main content.
- **Feature Folders**: Domain logic and UI are grouped (e.g., `app/dashboard/`, `app/ui/dashboard/`).
- **Type Definitions**: Centralized in `app/lib/definitions.ts`.
- **Data Utilities**: Use `app/lib/data.ts` and `app/lib/placeholder-data.ts` for data access and mock data.
- **Custom Server Actions**: See `app/query/route.ts` and `app/seed/route.ts` for examples.

## Integration Points
- **External Libraries**: Tailwind CSS, Next.js, TypeScript, PostCSS.
- **No custom backend detected**: All data is local or mock.
- **No authentication or API integration detected**: Add these in new feature folders if needed.

## Conventions
- **TypeScript everywhere**: All code is typed.
- **Feature-first structure**: Organize new features by domain, not by type.
- **Component Reuse**: Place shared UI in `app/ui/` and domain-specific UI in subfolders.
- **Use Tailwind for styling**: Avoid custom CSS except for global styles.

## Key Files & Directories
- `app/layout.tsx`, `app/page.tsx`: Root layout and page
- `app/dashboard/`, `app/ui/dashboard/`: Dashboard feature and UI
- `app/lib/`: Data, types, and utilities
- `tailwind.config.ts`, `postcss.config.js`: Styling config
- `package.json`: Scripts and dependencies

---

**For new features:**
- Create a new folder under `app/` for the domain
- Add UI components in `app/ui/[domain]/`
- Use TypeScript and Tailwind conventions
- Reference data utilities and type definitions from `app/lib/`

---

_If any section is unclear or missing, please provide feedback to improve these instructions._
