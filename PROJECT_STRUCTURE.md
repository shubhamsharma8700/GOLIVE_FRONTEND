# GoLive Frontend - Project Structure

This document describes the complete frontend structure for the GoLive streaming platform, based on the design specifications.

## 📁 Directory Structure

```
src/
├── components/
│   ├── player/              # User-facing player components
│   │   ├── VideoPlayerNew.tsx      # Main Video.js player component
│   │   ├── AccessValidator.tsx     # Handles access control (open/email/password/payment)
│   │   ├── RegistrationForm.tsx    # Registration form for events
│   │   ├── PaymentForm.tsx         # Stripe payment integration
│   │   └── EventConfigLoader.tsx   # Event configuration loader hook
│   ├── admin/               # Admin dashboard components
│   │   ├── EventList.tsx           # List and manage events
│   │   ├── CreateEvent.tsx         # Create new events
│   │   ├── AnalyticsView.tsx       # Analytics dashboard with charts
│   │   └── VodLibrary.tsx          # VOD content library
│   └── ui/                  # Shared UI components (shadcn/ui)
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       └── ... (other UI components)
├── pages/
│   ├── player/
│   │   └── PlayerPage.tsx   # Main player page (iframe embeddable)
│   └── admin/
│       ├── LoginPage.tsx    # Admin authentication
│       └── AdminDashboard.tsx  # Main admin dashboard
├── utils/
│   ├── api.ts              # API client and endpoints
│   ├── auth.ts             # Authentication utilities
│   └── analytics.ts        # Analytics tracking utilities
├── context/
│   └── UserContext.tsx     # User authentication context
├── routes/
│   └── AppRouter.tsx       # Route configuration
└── App.tsx                 # Main app component

```

## 🎯 Key Features

### 1. Iframe Player App (User-Facing)
- **Route**: `/event/:eventId` or `/player/:eventId`
- **Components**: 
  - `AccessValidator` - Handles 4 access modes:
    - Open Access (no login required)
    - Email Access (email verification)
    - Password Access (shared password)
    - Payment Access (Stripe integration)
  - `VideoPlayer` - Video.js player with HLS/DASH support
  - `RegistrationForm` - Collects user information
  - `PaymentForm` - Stripe Elements payment form

### 2. Admin Dashboard (Operator-Facing)
- **Routes**: 
  - `/admin/login` - Admin authentication
  - `/admin/dashboard` - Main dashboard (protected)
- **Features**:
  - Event Management (Create, Edit, Delete, List)
  - Live Controls (Start/Stop MediaLive channels)
  - Analytics Dashboard (Viewer metrics, charts)
  - VOD Library (Past events and playback)

## 🔧 API Integration

### API Base URL
Configure via environment variable: `VITE_API_BASE_URL`

### Key API Modules:
- `eventApi` - Event CRUD operations
- `userApi` - User access and registration
- `analyticsApi` - Analytics tracking
- `adminApi` - Admin operations
- `paymentApi` - Stripe payment processing

## 🔐 Authentication

- **JWT-based** authentication
- Tokens stored in `localStorage`
- Protected routes via `ProtectedRoute` component
- Event-specific access tokens

## 📊 Analytics Tracking

- Real-time viewer activity tracking
- Playback metrics (play, pause, seek, completion)
- Device and browser information
- Buffering events
- Automatic periodic flush to backend (30s intervals)

## 💳 Payment Integration

- **Stripe Elements** for secure card payments
- Payment intent creation and confirmation
- Registration flow integrated with payment

## 🚀 Getting Started

1. Install dependencies:
```bash
npm install --legacy-peer-deps
```

2. Configure environment variables:
```bash
VITE_API_BASE_URL=https://api.golive.com
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Start development server:
```bash
npm run dev
```

## 📝 Routes

- `/` - Redirects to `/admin/login`
- `/event/:eventId` - Player page for event
- `/player/:eventId` - Alternative player route
- `/admin/login` - Admin login page
- `/admin/dashboard` - Admin dashboard (protected)
- `/admin` - Redirects to dashboard

## 🎨 UI Components

Built with:
- **shadcn/ui** (Radix UI + Tailwind CSS)
- **Lucide React** icons
- **Recharts** for analytics visualization
- **Video.js** for video playback

## 🔄 State Management

- **React Context** for user authentication
- **Local Storage** for access tokens and event access
- Component-level state for UI interactions

## 📦 Dependencies

Key dependencies:
- `react` & `react-dom`
- `react-router-dom` - Routing
- `video.js` - Video player
- `@stripe/react-stripe-js` & `@stripe/stripe-js` - Payments
- `recharts` - Analytics charts
- `axios` - HTTP client
- `lucide-react` - Icons

## 🔒 Security

- JWT token validation
- Secure token storage
- HTTPS enforced
- CloudFront signed URLs for streams (backend)
- WAF protection (backend)

## 📱 Responsive Design

- Mobile-first approach
- Responsive video player
- Adaptive layouts for admin dashboard
- Touch-friendly controls

