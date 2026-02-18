# GO-LIVE Frontend Documentation

## 1. Project Overview
GO-LIVE Frontend is an admin and player web application built with React + Vite + TypeScript.

It provides:
- Admin authentication and dashboard
- Event management (live and VOD)
- Admin user management
- Viewer analytics and reports
- Public player page with access control (free, email, password, paid)

## 2. Tech Stack
- React 19
- TypeScript
- Vite
- Tailwind CSS
- Redux Toolkit + RTK Query
- React Router
- Recharts
- Radix UI
- Stripe (`@stripe/react-stripe-js`)
- Sonner (toasts)

## 3. Run the Project
### Prerequisites
- Node.js 18+
- npm

### Install
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## 4. Environment Variables
Configured in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

## 5. Application Routes
Defined in `src/app/App.tsx`.

Public routes:
- `/login`
- `/forgot-password`
- `/new-password`
- `/player/:id`

Protected routes:
- `/` (Dashboard Overview)
- `/events`
- `/users`
- `/viewers`
- `/reports`

## 6. State Management
Store setup: `src/store/store.ts`

Redux slices:
- `auth`
- `eventForm`
- `eventView`

RTK Query APIs:
- `adminBaseApi` (admin-secured endpoints)
- `playerBaseApi` (player/public endpoints)

## 7. API Integration Pattern
- Service files are under `src/store/services/`
- Each domain has its own service (auth, events, users, viewers, reports, player, dashboard)
- Admin APIs include JWT auth header
- 401 responses trigger refresh flow in `adminBaseApi`

## 8. Key Pages
- `DashboardOverview.tsx`: summary widgets and overview metrics
- `EventManagement.tsx`: create/edit/list events
- `UserManagement.tsx`: admin list and status/actions
- `ViewersManagement.tsx`: viewer list, sorting, details modal
- `ReportsAnalytics.tsx`: analytics summary/charts/top events from reports API
- `PlayerPage.tsx`: event playback + access/paywall flows

## 9. Project Structure
```text
src/
  app/
  components/
  layout/
  pages/
  routes/
  store/
    services/
    slices/
  utils/
  assets/
docs/
public/
```

## 10. Notes
- Keep API contracts typed in service files for safer UI integration.
- Prefer shared UI components from `src/components/ui/`.
- Use RTK Query tags for cache invalidation consistency.
