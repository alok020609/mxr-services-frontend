// Environment configuration helper
// Centralized access to all environment variables

export const env = {
  // API Configuration
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1',
  
  // Application Configuration
  appName: import.meta.env.VITE_APP_NAME || 'Ecommerce Store',
  appVersion: import.meta.env.VITE_APP_VERSION || '1.0.0',
  
  // Feature Flags
  enableFeatures: import.meta.env.VITE_ENABLE_FEATURES || 'all',
  
  // Default Settings (currency comes from GET /currencies/default, not env)
  defaultLanguage: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
  
  // Build Configuration
  buildMode: import.meta.env.VITE_BUILD_MODE || import.meta.env.MODE || 'development',
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  
  // Optional: Analytics
  analyticsId: import.meta.env.VITE_ANALYTICS_ID,
  googleTagManagerId: import.meta.env.VITE_GOOGLE_TAG_MANAGER_ID,
  
  // Optional: Payment Gateways
  stripePublicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY,
  paypalClientId: import.meta.env.VITE_PAYPAL_CLIENT_ID,
  
  // Optional: Image Upload
  imageUploadUrl: import.meta.env.VITE_IMAGE_UPLOAD_URL,
  imageUploadKey: import.meta.env.VITE_IMAGE_UPLOAD_KEY,
  
  // Optional: CDN
  cdnUrl: import.meta.env.VITE_CDN_URL,
  
  // Optional: Error Tracking
  sentryDsn: import.meta.env.VITE_SENTRY_DSN,
  
  // Optional: Feature Flags Service
  featureFlagsUrl: import.meta.env.VITE_FEATURE_FLAGS_URL,
  
  // API Logging Configuration
  enableApiLogging: import.meta.env.VITE_ENABLE_API_LOGGING !== 'false' && (import.meta.env.DEV || import.meta.env.VITE_ENABLE_API_LOGGING === 'true'),
  apiLogLevel: (import.meta.env.VITE_API_LOG_LEVEL || (import.meta.env.DEV ? 'all' : 'errors')) as 'none' | 'errors' | 'all',
  
  // Debug flag for verbose logging
  debugApiLogging: import.meta.env.DEV || import.meta.env.VITE_DEBUG_API_LOGGING === 'true',
} as const

// Validate required environment variables
export const validateEnv = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = []
  
  if (!env.apiBaseUrl) {
    errors.push('VITE_API_BASE_URL is required')
  }
  
  if (!env.appName) {
    errors.push('VITE_APP_NAME is required')
  }
  
  // Validate API URL format
  try {
    new URL(env.apiBaseUrl)
  } catch {
    errors.push('VITE_API_BASE_URL must be a valid URL')
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}

// Get feature flags from environment
export const getEnabledFeatures = (): string[] => {
  if (env.enableFeatures === 'all') {
    return ['all']
  }
  return env.enableFeatures.split(',').map(f => f.trim()).filter(Boolean)
}

// Check if feature is enabled
export const isFeatureEnabled = (featureKey: string): boolean => {
  const enabledFeatures = getEnabledFeatures()
  return enabledFeatures.includes('all') || enabledFeatures.includes(featureKey)
}

