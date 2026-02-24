# Ecommerce Frontend

Complete Vue.js ecommerce frontend implementing all 355 API endpoints from the backend API document.

## Features

- ✅ All 355 API endpoints integrated
- ✅ Highly configurable with feature flags
- ✅ Quick setup wizard
- ✅ Comprehensive admin panel
- ✅ Docker support for easy deployment
- ✅ Ready for Netlify, Vercel, and any Docker-compatible hosting

## Tech Stack

- Vue 3 with Composition API
- TypeScript
- Tailwind CSS
- Zustand for state management
- Vue Router
- Axios for API communication

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn

### Installation

#### Quick Setup (Recommended)

Run the automated setup script that handles everything:

```bash
npm run setup
```

Or run directly:
```bash
node scripts/setup.js
```

**Cross-platform support:** The setup script works on macOS, Linux, and Windows.

This script will:
- ✅ Check prerequisites (Node.js, npm)
- ✅ Install all dependencies
- ✅ Set up environment variables (interactive)
- ✅ Run type checking
- ✅ Optionally start the development server

#### Manual Setup

If you prefer to set up manually:

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
# Option A: Use the setup script (interactive)
npm run setup:env

# Option B: Manually copy and edit
cp .env.example .env
# Then edit .env with your backend API URL and other settings

# 3. Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

### Development

```bash
docker-compose up
```

### Production

```bash
# Set environment variables in .env file or export them
export VITE_API_BASE_URL=https://api.yourdomain.com/api/v1

# Build and run
docker-compose -f docker-compose.prod.yml up -d --build
```

**Note**: For production Docker builds, environment variables must be passed as build arguments since Vite bakes them into the build at build time. You can either:
1. Set them in a `.env` file (docker-compose will read them)
2. Export them as environment variables before running docker-compose
3. Pass them directly in the docker-compose command

### Build Docker Image

```bash
docker build -t ecommerce-frontend .
docker run -p 80:80 -e VITE_API_BASE_URL=https://api.example.com ecommerce-frontend
```

## Environment Variables

The project includes environment configuration files:

- `.env` - Default environment variables (created automatically, not in git)
- `.env.example` - Template with all available variables
- `.env.development` - Development-specific variables
- `.env.production` - Production-specific variables

### Required Variables

Create a `.env` file in the root directory:

```env
# Required: Backend API URL
VITE_API_BASE_URL=http://localhost:3000/api/v1

# Application Configuration
VITE_APP_NAME=Ecommerce Store
VITE_APP_VERSION=1.0.0

# Feature Flags (comma-separated or 'all')
VITE_ENABLE_FEATURES=all

# Default Settings
VITE_DEFAULT_CURRENCY=USD
VITE_DEFAULT_LANGUAGE=en
```

### Optional Variables

```env
# Analytics
VITE_ANALYTICS_ID=your-analytics-id
VITE_GOOGLE_TAG_MANAGER_ID=your-gtm-id

# Payment Gateways
VITE_STRIPE_PUBLIC_KEY=your-stripe-public-key
VITE_PAYPAL_CLIENT_ID=your-paypal-client-id

# Image Upload
VITE_IMAGE_UPLOAD_URL=your-image-upload-url
VITE_IMAGE_UPLOAD_KEY=your-image-upload-key

# CDN
VITE_CDN_URL=your-cdn-url

# Error Tracking
VITE_SENTRY_DSN=your-sentry-dsn
```

**Important**: The `.env` file is gitignored. Copy `.env.example` to `.env` and update with your values.

## Deployment

### Netlify

1. Connect your Git repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variables
5. Deploy

### Vercel

1. Import Git repository
2. Framework preset: Vue.js
3. Add environment variables
4. Deploy

### Docker (Any Server)

```bash
docker pull your-registry/ecommerce-frontend:latest
docker run -d -p 80:80 -e VITE_API_BASE_URL=https://api.example.com your-registry/ecommerce-frontend
```

## Project Structure

```
src/
├── api/              # API client and endpoints
├── components/       # Reusable components
├── config/           # Configuration and feature flags
├── stores/           # Zustand stores
├── views/            # Page components
├── router/           # Vue Router configuration
└── utils/            # Utility functions
```

## License

MIT
