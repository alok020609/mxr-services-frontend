# Backend API Setup

## Connection Error Troubleshooting

If you're seeing `ERR_CONNECTION_REFUSED` or "Network error - No response from server", it means your backend API server is not running or not accessible.

## Quick Fix

### 1. Check if Backend is Running

The frontend expects the backend API to be running at:
- **Development**: `http://localhost:3000/api/v1`
- **Production**: Configure via `VITE_API_BASE_URL` in `.env`

### 2. Start Your Backend Server

Make sure your backend API server is running on port 3000 (or the port specified in your `.env` file).

```bash
# Example: If your backend is a Node.js/Express app
cd /path/to/your/backend
npm start
# or
node server.js
```

### 3. Verify Backend is Accessible

Test if your backend is running:

```bash
# Test the backend directly
curl http://localhost:3000/api/v1/health
# or
curl http://localhost:3000/api/v1/products?limit=1
```

### 4. Update API URL if Needed

If your backend runs on a different port or URL, update `.env`:

```env
VITE_API_BASE_URL=http://localhost:YOUR_PORT/api/v1
```

Then restart the frontend dev server:

```bash
npm run dev
```

## How the Proxy Works

In development mode:
- Frontend runs on: `http://localhost:3001`
- API requests to `/api/v1/*` are proxied to your backend
- Backend should be at: `http://localhost:3000/api/v1`

The Vite proxy automatically forwards requests from the frontend to your backend.

## Common Issues

### Backend on Different Port
If your backend runs on port 5000, update `.env`:
```env
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

### Backend on Different Host
If your backend is on a different machine:
```env
VITE_API_BASE_URL=http://192.168.1.100:3000/api/v1
```

### CORS Issues
If you see CORS errors, make sure your backend allows requests from `http://localhost:3001`.

### Backend Not Started
Always start your backend server before starting the frontend.

## Production

In production, the frontend uses the full URL from `VITE_API_BASE_URL`. Make sure to:
1. Set the correct production API URL in `.env.production`
2. Build with production environment variables
3. Ensure CORS is configured on your backend for your production domain

