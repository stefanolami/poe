# POE - E-Mobility Platform Copilot Instructions

## Project Overview

POE is a Next.js 15 e-mobility platform with role-based access control, built with TypeScript, Supabase auth, Tailwind CSS, and shadcn/ui components. The platform manages consultants, clients, grants, and tender processes across different geographies.

## Key Architecture Patterns

### Authentication & Authorization

- **Role-based system**: `super-admin`, `admin`, `supervisor`, `consultant`, `client`
- User roles stored in Supabase `user.app_metadata.user_role`
- Auth state managed via Zustand store (`src/store/auth-store.ts`)
- Global auth sync via `AuthProvider` and `useSyncAuthState` hook
- Server/client auth split: use `createClient()` from `@/supabase/server` for server components, `@/supabase/client` for client components

### Route Protection

- Middleware protects `/admin/*` routes (see `src/middleware.ts` and `src/supabase/middleware.ts`)
- Permission helpers in `src/lib/permissions.ts` (e.g., `canEditUser`, `canSendAlert`)
- Home page (`/`) is public; most other routes require authentication

### Data Layer

- **Server Actions**: All database operations in `src/actions/*` files marked with `'use server'`
- **Validation**: Zod schemas in `src/lib/zod-schemas.ts` for form validation
- **State Management**: Zustand stores for client state (`src/store/`)
- **Types**: Generated Supabase types in `src/supabase/types.ts`

### Database Schema

Core entities in the e-mobility platform:

- **clients**: E-mobility companies with vehicle/charging station requirements and geographic focus
- **consultants**: Platform consultants who manage client relationships
- **grants**: Funding opportunities with geographic/sector targeting and client matching
- **alerts**: Notifications for grants/tenders/investments with client matching
- **users**: Platform users with role-based access (`clients` array for consultant assignments)

Key patterns:

- Geography-based filtering throughout (arrays of geo codes)
- Client-consultant many-to-many relationships via `users.clients[]` and `consultants.clients[]`
- Grant-client matching system with `matched_clients[]` arrays
- Future entities: Procurement Tenders and Investment Financing (coming soon)

### Component Organization

- **shadcn/ui**: Base components in `src/components/ui/`
- **Feature components**: Organized by domain (`auth/`, `admin/`, `account/`, `e-mobility/`)
- **Layout structure**: App routes use `(app)` group with shared header/footer layout
- **Loading patterns**: Use `<Suspense>` with `<Loading>` component, `<RenderMounted>` for hydration

### Development Patterns

- **Client components**: Use `'use client'` directive, import from `@/supabase/client`
- **Server components**: Default, import from `@/supabase/server`, use Server Actions
- **Forms**: React Hook Form + Zod resolvers pattern throughout
- **Styling**: Tailwind with custom font variables (`jose`, `unna` from `src/app/fonts.ts`)

## Key Commands

```bash
npm run dev --turbopack    # Development with Turbopack
npm run build             # Production build
npm run lint              # ESLint
```

## Email System

- Separate React Email workspace in `react-email-starter/`
- Email templates use `@react-email/components`
- Server actions handle email sending via MailerSend/Resend

## Deployment

- Vercel deployment (seamless, no special configuration needed)

## Critical Files to Reference

- `src/supabase/middleware.ts` - Route protection logic
- `src/lib/permissions.ts` - Role permission helpers
- `src/store/auth-store.ts` - Auth state management
- `src/lib/zod-schemas.ts` - Form validation schemas
- `src/components/auth/auth-provider.tsx` - Global auth setup

## Common Patterns

- Import paths use `@/` alias for `src/`
- Server Actions follow naming pattern: `src/actions/{domain}.ts`
- Component files often co-located with feature-specific types
- Geography selection is a key domain concept (see `geography-selector.tsx`)
- Role-based UI rendering using auth store state
