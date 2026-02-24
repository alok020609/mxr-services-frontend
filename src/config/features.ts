// Feature flags configuration
// Features can be enabled/disabled via backend API or environment variables

export interface FeatureFlag {
  key: string
  name: string
  description: string
  enabled: boolean
  category: string
}

export const defaultFeatures: Record<string, FeatureFlag> = {
  // Core Features
  products: {
    key: 'products',
    name: 'Products',
    description: 'Product catalog and management',
    enabled: true,
    category: 'core'
  },
  cart: {
    key: 'cart',
    name: 'Shopping Cart',
    description: 'Shopping cart functionality',
    enabled: true,
    category: 'core'
  },
  orders: {
    key: 'orders',
    name: 'Orders',
    description: 'Order management',
    enabled: true,
    category: 'core'
  },
  payments: {
    key: 'payments',
    name: 'Payments',
    description: 'Payment processing',
    enabled: true,
    category: 'core'
  },
  
  // Enhanced Features
  reviews: {
    key: 'reviews',
    name: 'Reviews & Ratings',
    description: 'Product reviews and ratings',
    enabled: true,
    category: 'enhanced'
  },
  wishlist: {
    key: 'wishlist',
    name: 'Wishlist',
    description: 'Wishlist functionality',
    enabled: true,
    category: 'enhanced'
  },
  coupons: {
    key: 'coupons',
    name: 'Coupons & Discounts',
    description: 'Coupon and discount codes',
    enabled: true,
    category: 'enhanced'
  },
  notifications: {
    key: 'notifications',
    name: 'Notifications',
    description: 'User notifications',
    enabled: true,
    category: 'enhanced'
  },
  
  // Advanced Features
  analytics: {
    key: 'analytics',
    name: 'Analytics',
    description: 'Analytics and reporting',
    enabled: true,
    category: 'advanced'
  },
  loyalty: {
    key: 'loyalty',
    name: 'Loyalty Program',
    description: 'Loyalty points and rewards',
    enabled: false,
    category: 'advanced'
  },
  marketing: {
    key: 'marketing',
    name: 'Marketing',
    description: 'Marketing campaigns and promotions',
    enabled: true,
    category: 'advanced'
  },
  wallet: {
    key: 'wallet',
    name: 'Wallet',
    description: 'Digital wallet functionality',
    enabled: false,
    category: 'advanced'
  },
  vendor: {
    key: 'vendor',
    name: 'Vendor/Marketplace',
    description: 'Multi-vendor marketplace',
    enabled: false,
    category: 'advanced'
  },
  gifts: {
    key: 'gifts',
    name: 'Gift Features',
    description: 'Gift cards and gift wrapping',
    enabled: false,
    category: 'advanced'
  },
  
  // Enterprise Features
  cms: {
    key: 'cms',
    name: 'CMS',
    description: 'Content management system',
    enabled: true,
    category: 'enterprise'
  },
  multiTenant: {
    key: 'multiTenant',
    name: 'Multi-Tenant',
    description: 'Multi-tenant support',
    enabled: false,
    category: 'enterprise'
  },
  subscriptions: {
    key: 'subscriptions',
    name: 'Subscriptions',
    description: 'Subscription management',
    enabled: false,
    category: 'enterprise'
  },
  compliance: {
    key: 'compliance',
    name: 'Compliance',
    description: 'GDPR and compliance features',
    enabled: true,
    category: 'enterprise'
  }
}

// Check if feature is enabled
export const isFeatureEnabled = (featureKey: string): boolean => {
  // First check environment variables
  const envFeatures = import.meta.env.VITE_ENABLE_FEATURES
  if (envFeatures === 'all') return true
  if (envFeatures) {
    const enabledFeatures = envFeatures.split(',').map(f => f.trim())
    if (enabledFeatures.includes('all')) return true
    if (enabledFeatures.includes(featureKey)) return true
  }
  
  // Then check default features
  return defaultFeatures[featureKey]?.enabled ?? false
}

// Get feature flag
export const getFeature = (featureKey: string): FeatureFlag | undefined => {
  return defaultFeatures[featureKey]
}

// Get all features
export const getAllFeatures = (): Record<string, FeatureFlag> => {
  return defaultFeatures
}

// Get features by category
export const getFeaturesByCategory = (category: string): FeatureFlag[] => {
  return Object.values(defaultFeatures).filter(f => f.category === category)
}

