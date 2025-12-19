# Backend-Frontend Integration Steps

## Epic: GO-LIVE
## Story: GL-34 - Document backend–frontend integration steps

This document outlines the integration flows for authentication, entitlement/payment, and analytics in the GO-LIVE platform, including detailed backend API documentation.

## 1. Authentication Flow

### Admin Authentication
Admins use JWT-based authentication for managing the platform.

#### POST /admin/register
- **Description**: Register a new admin.
- **Request Body**: `{ email: string, password: string, name: string }`
- **Response**: `{ success: boolean, message: string, user?: { id: string, name: string, email: string } }`

#### POST /admin/login
- **Description**: Admin login.
- **Request Body**: `{ email: string, password: string }`
- **Response**: `{ success: boolean, token: string, user: { id: string, name: string, email: string } }`
- **Frontend**: Token stored in localStorage and Redux (`authSlice.setCredentials`).

#### GET /admin/profile
- **Description**: Get current admin profile.
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success: boolean, user: { id: string, name: string, email: string } }`

#### POST /admin/logout
- **Description**: Logout admin.
- **Headers**: `Authorization: Bearer {token}`
- **Response**: `{ success: boolean, message: string }`
- **Frontend**: Clears localStorage and Redux.

### Viewer Authentication
Viewers receive temporary `viewerToken` for content access, not full authentication.

- Tokens obtained during registration/verification process.
- Used for playback and analytics APIs.

## 2. Entitlement and Payment Flow

Entitlement controls access to events based on accessMode. Payment integrates with Stripe for paid events.

### GET /playback/event/{eventId}/access
- **Description**: Get event access configuration.
- **Response**: `{ success: boolean, accessMode: string, requiresForm: boolean, requiresPassword: boolean, registrationFields: any[] }`
- **Frontend**: Determines UI flow (free, email, password, paid).

### POST /playback/event/{eventId}/register
- **Description**: Register viewer for event access.
- **Request Body**: `{ clientViewerId: string, formData?: any, name?: string, email?: string, deviceInfo?: any }`
- **Response**: `{ success: boolean, viewerToken: string, accessVerified: boolean }`
- **Notes**: For paid events, may return payment intent details.

### POST /playback/event/{eventId}/verify-password
- **Description**: Verify password for password-protected events.
- **Request Body**: `{ clientViewerId: string, password: string }`
- **Response**: `{ success: boolean, accessVerified: boolean }`

### Payment Processing (Paid Access Only)
- For paid events, display `PaymentAccessOverlay` with amount/currency.
- On payment click, process via Stripe (handled in `PlayerPage` or backend).
- Frontend uses `@stripe/react-stripe-js` for UI.
- After successful payment, `registerViewer` called again or access granted directly.

### GET /playback/event/{eventId}/stream
- **Description**: Get stream URL for entitled viewers.
- **Headers**: `Authorization: Bearer {viewerToken}`
- **Response**: `{ success: boolean, streamUrl: string, playbackType: "live" | "vod", eventType: string }`
- **Frontend**: Loads video player with `streamUrl`.

## 3. Analytics Flow

Tracks viewer sessions for admin insights.

### POST /analytics/{eventId}/session/start
- **Description**: Start a viewer session on playback.
- **Request Body**: `{ playbackType?: "live" | "vod", deviceInfo?: Record<string, any>, location?: Record<string, any> }`
- **Headers**: `Authorization: Bearer {viewerToken}`
- **Response**: `{ success: boolean, sessionId: string }`

### POST /analytics/session/heartbeat
- **Description**: Send periodic heartbeat to track watch time.
- **Request Body**: `{ sessionId: string, seconds: number }`
- **Headers**: `Authorization: Bearer {viewerToken}`
- **Response**: `{ success: boolean }`

### POST /analytics/session/end
- **Description**: End viewer session.
- **Request Body**: `{ sessionId: string, duration: number }`
- **Headers**: `Authorization: Bearer {viewerToken}`
- **Response**: `{ success: boolean }`

### GET /analytics/{eventId}/summary
- **Description**: Get event analytics summary.
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, eventId: string, summary: { totalSessions: number, totalWatchTime: number, avgWatchTime: number } }`

### GET /analytics/{eventId}/sessions
- **Description**: Get recent sessions for event.
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, eventId: string, sessions: any[] }`

## 4. End-to-End Test Scenarios

### Scenario 1: Free Access Event
- Admin creates event with `accessMode: "freeAccess"`.
- Viewer loads player page.
- `getAccessConfig` → no form/password required.
- `registerViewer` → receives `viewerToken`.
- `getStream` → receives `streamUrl`.
- Playback starts → `startSession`.
- Heartbeats sent every X seconds.
- Playback ends → `endSession`.

### Scenario 2: Email Access Event
- Similar to free, but `registrationFields` include email.
- `registerViewer` with `formData: { email }`.
- Proceeds to stream access.

### Scenario 3: Password Access Event
- `getAccessConfig` → `requiresPassword: true`.
- `registerViewer` (for form if any).
- Display password overlay.
- `verifyPassword` with user input.
- If success, `getStream`.

### Scenario 4: Paid Access Event
- `getAccessConfig` → `accessMode: "paidAccess"`.
- `registerViewer` → `accessVerified: false`, shows payment overlay.
- User enters payment details, Stripe processes.
- On success, `registerViewer` again or direct access.
- Then `getStream` and playback.

### Scenario 5: Admin Dashboard
- Admin logs in → receives token.
- Navigates to event management.
- Selects event → fetches `getEventSummary` and `getRecentSessions`.
- Displays analytics charts/data.

## 4. Event Management APIs

### GET /events
- **Description**: List events with optional search and filters.
- **Query Params**: `limit?, lastKey?, q?, type?`
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, events: any[], lastKey?: string }`

### GET /events/{eventId}
- **Description**: Get event details.
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, event: any }`

### POST /events
- **Description**: Create new event.
- **Request Body**: Event data (title, description, eventType, etc.)
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, eventId: string }`

### PUT /events/{eventId}
- **Description**: Update event.
- **Request Body**: Partial event data.
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, message: string }`
- **Validation**: startTime must be future for scheduled events, eventType cannot change.

### DELETE /events/{eventId}
- **Description**: Delete event.
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, message: string }`

### GET /events/vod/presign
- **Description**: Get presigned URL for VOD upload.
- **Query Params**: `filename, contentType?`
- **Headers**: `Authorization: Bearer {adminToken}`
- **Response**: `{ success: boolean, uploadUrl: string, fileKey: string }`

## Notes
- All API calls use RTK Query for caching/invalidation.
- Errors handled via try/catch, user notifications.
- Timezones: Frontend uses Luxon for local display, sends ISO to backend.
- Security: Tokens validated on backend, CORS configured.