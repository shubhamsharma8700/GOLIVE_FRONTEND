# Mock Data Configuration

The application uses mock API data when the backend is not configured. This allows you to test the full application flow without a backend.

## How It Works

The mock API is automatically enabled when:
- `VITE_API_BASE_URL` is not set in environment variables
- `VITE_API_BASE_URL` is set to `"mock"`
- `VITE_API_BASE_URL` contains `"localhost"`

## Mock Credentials

### Admin Login
- **Email**: `admin@golive.com`
- **Password**: `admin123`

## Mock Events

The application comes with 3 pre-configured mock events:

### 1. Tech Conference 2024 (Payment Required)
- **Event ID**: `event-1`
- **Access Mode**: Payment
- **Amount**: $29.99
- **Status**: Scheduled
- **Stream URL**: Sample video (Big Buck Bunny)

### 2. Free Webinar: Introduction to React (Open Access)
- **Event ID**: `event-2`
- **Access Mode**: Open (no login required)
- **Status**: Live
- **Stream URL**: Sample video (Elephant's Dream)

### 3. Private Training Session (Password Protected)
- **Event ID**: `event-3`
- **Access Mode**: Password
- **Password**: `training123`
- **Status**: Ended
- **Stream URL**: Sample video (Sintel)

## Testing the Flow

### Admin Dashboard Flow
1. Navigate to `/admin/login`
2. Login with `admin@golive.com` / `admin123`
3. View events in the Events tab
4. Create a new event in the Create Event tab
5. View analytics in the Analytics tab
6. View VOD library in the VOD Library tab

### Player Flow - Open Access
1. Navigate to `/event/event-2`
2. Player should load directly (no access required)

### Player Flow - Password Access
1. Navigate to `/event/event-3`
2. Enter password: `training123`
3. Player should load after authentication

### Player Flow - Payment Access
1. Navigate to `/event/event-1`
2. Complete registration form
3. Complete payment form (use any test card data)
4. Player should load after successful payment

## Mock Payment Cards

Since we're using mock API, you can use any card details for testing:
- **Card Number**: Any 16-digit number (e.g., `4242 4242 4242 4242`)
- **Expiry**: Any future date (e.g., `12/25`)
- **CVV**: Any 3-digit number (e.g., `123`)

All payments will succeed in mock mode.

## Switching to Real Backend

When your backend is ready:

1. Set the environment variable:
```bash
VITE_API_BASE_URL=https://api.yourdomain.com
```

2. The application will automatically switch to real API calls
3. All mock data will be ignored

## Mock Data Storage

Mock data is stored in memory and resets on page refresh. To persist mock data:
- Modify `src/utils/mockApi.ts`
- Add localStorage persistence
- Or use a more sophisticated mock data library

