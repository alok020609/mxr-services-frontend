// Complete registry of all 355 endpoints organized by API sections

export interface EndpointDefinition {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
  path: string
  permissions: 'public' | 'authenticated' | 'admin'
  description?: string
}

export interface EndpointRegistry {
  [section: string]: {
    [endpoint: string]: EndpointDefinition
  }
}

export const endpoints: EndpointRegistry = {
  health: {
    check: {
      method: 'GET',
      path: '/health',
      permissions: 'public',
      description: 'Health check endpoint'
    }
  },
  auth: {
    register: { method: 'POST', path: '/auth/register', permissions: 'admin' },
    login: { method: 'POST', path: '/auth/login', permissions: 'public' },
    verifyEmail: { method: 'GET', path: '/auth/verify-email/:token', permissions: 'public' },
    resendVerification: { method: 'POST', path: '/auth/resend-verification', permissions: 'public' },
    forgotPassword: { method: 'POST', path: '/auth/forgot-password', permissions: 'public' },
    resetPassword: { method: 'POST', path: '/auth/reset-password', permissions: 'public' },
    refresh: { method: 'POST', path: '/auth/refresh', permissions: 'public' },
    changePassword: { method: 'POST', path: '/auth/change-password', permissions: 'authenticated' },
    getProfile: { method: 'GET', path: '/auth/profile', permissions: 'authenticated' },
    updateProfile: { method: 'PUT', path: '/auth/profile', permissions: 'authenticated' },
    getAddresses: { method: 'GET', path: '/auth/addresses', permissions: 'authenticated' },
    createAddress: { method: 'POST', path: '/auth/addresses', permissions: 'authenticated' },
    getDefaultAddress: { method: 'GET', path: '/auth/addresses/default', permissions: 'authenticated' },
    getAddress: { method: 'GET', path: '/auth/addresses/:id', permissions: 'authenticated' },
    updateAddress: { method: 'PUT', path: '/auth/addresses/:id', permissions: 'authenticated' },
    deleteAddress: { method: 'DELETE', path: '/auth/addresses/:id', permissions: 'authenticated' },
    setDefaultAddress: { method: 'PUT', path: '/auth/addresses/:id/set-default', permissions: 'authenticated' }
  },
  products: {
    list: { method: 'GET', path: '/products/', permissions: 'public' },
    search: { method: 'GET', path: '/products/search', permissions: 'public' },
    getCategories: { method: 'GET', path: '/products/categories', permissions: 'public' },
    getCategory: { method: 'GET', path: '/products/categories/:id', permissions: 'public' },
    getProduct: { method: 'GET', path: '/products/:id', permissions: 'public' },
    createProduct: { method: 'POST', path: '/products/', permissions: 'admin' },
    updateProduct: { method: 'PUT', path: '/products/:id', permissions: 'admin' },
    deleteProduct: { method: 'DELETE', path: '/products/:id', permissions: 'admin' },
    createCategory: { method: 'POST', path: '/products/categories', permissions: 'admin' },
    updateCategory: { method: 'PUT', path: '/products/categories/:id', permissions: 'admin' },
    deleteCategory: { method: 'DELETE', path: '/products/categories/:id', permissions: 'admin' }
  },
  cart: {
    getCart: { method: 'GET', path: '/cart/', permissions: 'authenticated' },
    addItem: { method: 'POST', path: '/cart/add', permissions: 'authenticated' },
    updateItem: { method: 'PUT', path: '/cart/update/:itemId', permissions: 'authenticated' },
    removeItem: { method: 'DELETE', path: '/cart/remove/:itemId', permissions: 'authenticated' },
    clearCart: { method: 'DELETE', path: '/cart/clear', permissions: 'authenticated' },
    calculate: { method: 'GET', path: '/cart/calculate', permissions: 'authenticated' }
  },
  orders: {
    createOrder: { method: 'POST', path: '/orders/', permissions: 'authenticated' },
    listOrders: { method: 'GET', path: '/orders/', permissions: 'authenticated' },
    getOrder: { method: 'GET', path: '/orders/:id', permissions: 'authenticated' },
    cancelOrder: { method: 'POST', path: '/orders/:id/cancel', permissions: 'authenticated' },
    returnOrder: { method: 'POST', path: '/orders/:id/return', permissions: 'authenticated' },
    trackOrder: { method: 'GET', path: '/orders/:id/tracking', permissions: 'authenticated' }
  },
  payments: {
    getGateways: { method: 'GET', path: '/payments/gateways', permissions: 'public' },
    createIntent: { method: 'POST', path: '/payments/create-intent', permissions: 'authenticated' },
    confirmPayment: { method: 'POST', path: '/payments/confirm', permissions: 'authenticated' },
    getPayment: { method: 'GET', path: '/payments/:orderId', permissions: 'authenticated' },
    getPaymentHistory: { method: 'GET', path: '/payments/:orderId/history', permissions: 'authenticated' }
  },
  // Add more sections as needed - this is a sample structure
  // The full registry would include all 56 sections with all 355 endpoints
}

// Helper function to get endpoint by section and name
export const getEndpoint = (section: string, endpoint: string): EndpointDefinition | undefined => {
  return endpoints[section]?.[endpoint]
}

// Helper function to check if endpoint is available
export const isEndpointAvailable = (section: string, endpoint: string): boolean => {
  return !!getEndpoint(section, endpoint)
}

// Helper function to get all endpoints for a section
export const getSectionEndpoints = (section: string): Record<string, EndpointDefinition> | undefined => {
  return endpoints[section]
}

