/**
 * Data normalization utilities for admin panel
 * Handles differences between backend response format and frontend expectations
 */

import type { User, Order, Product } from '@/api/types'
import { normalizeImageUrls } from './formatters'

/**
 * Normalize user data from backend
 * Handles firstName/lastName → name, uppercase role → lowercase
 * Preserves additional fields like _count, phone, tenantId
 */
export function normalizeUser(user: any): User {
  return {
    id: user.id,
    email: user.email,
    name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
    role: (user.role || 'user').toLowerCase() as 'user' | 'admin' | 'vendor',
    isVerified: user.emailVerified !== undefined ? user.emailVerified : (user.isVerified || false),
    isActive: user.isActive !== undefined ? user.isActive : true,
    createdAt: user.createdAt || new Date().toISOString(),
    updatedAt: user.updatedAt || new Date().toISOString(),
    // Preserve additional fields from backend
    firstName: user.firstName,
    lastName: user.lastName,
    phone: user.phone,
    emailVerified: user.emailVerified,
    tenantId: user.tenantId,
    _count: user._count
  }
}

/**
 * Normalize array of users
 */
export function normalizeUsers(users: any[]): User[] {
  return users.map(normalizeUser)
}

/**
 * Normalize order data from backend.
 * Payment method is not on the order root in API responses; it comes from data.payments[] (gateway, paymentMethod).
 * Status is taken from order.status; some backends expose state-machine value as state/currentState, so we use those as fallbacks so the summary "Status" and "Current State" stay in sync.
 */
export function normalizeOrder(order: any): Order {
  const firstPayment = order.payments?.[0]
  const paymentMethod =
    order.paymentMethod ||
    order.payment_method ||
    firstPayment?.paymentMethod ||
    firstPayment?.gateway ||
    ''
  const paymentStatusFromPayments =
    Array.isArray(order.payments) &&
    order.payments.some((p: any) => (p.status || '').toUpperCase() === 'SUCCEEDED')
      ? 'paid'
      : null
  const paymentStatus =
    order.paymentStatus ||
    paymentStatusFromPayments ||
    'pending'

  const rawStatus = order.status ?? order.state ?? order.currentState ?? 'pending'
  const status = (typeof rawStatus === 'string' ? rawStatus : 'pending').toLowerCase()
  const finalPaymentStatus =
    (status === 'paid' || status === 'completed') && paymentStatus === 'pending'
      ? 'paid'
      : paymentStatus

  return {
    id: order.id,
    userId: order.userId || order.user?.id || '',
    orderNumber: order.orderNumber || order.id,
    items: order.items || [],
    subtotal: order.subtotal || 0,
    tax: order.tax || 0,
    shipping: order.shipping || 0,
    discount: order.discount || 0,
    total: order.total || 0,
    status,
    shippingAddress: order.shippingAddress,
    billingAddress: order.billingAddress,
    paymentMethod,
    paymentStatus: finalPaymentStatus === 'paid' ? 'paid' : (finalPaymentStatus === 'refunded' ? 'refunded' : finalPaymentStatus === 'failed' ? 'failed' : 'pending'),
    createdAt: order.createdAt || new Date().toISOString(),
    updatedAt: order.updatedAt || new Date().toISOString(),
    stateHistory: order.stateHistory ?? [],
  }
}

/**
 * Normalize array of orders
 */
export function normalizeOrders(orders: any[]): Order[] {
  return orders.map(normalizeOrder)
}

/**
 * Normalize product data from backend
 */
export function normalizeProduct(product: any): Product {
  return {
    id: product.id,
    name: product.name || '',
    description: product.description || '',
    price: product.price || 0,
    compareAtPrice: product.compareAtPrice,
    sku: product.sku || '',
    stock: product.stock || 0,
    images: normalizeImageUrls(product.images || []),
    categoryId: product.categoryId || '',
    status: product.status || 'active',
    createdAt: product.createdAt || new Date().toISOString(),
    updatedAt: product.updatedAt || new Date().toISOString(),
  }
}

/**
 * Normalize array of products
 */
export function normalizeProducts(products: any[]): Product[] {
  return products.map(normalizeProduct)
}

/**
 * Normalize dashboard data from backend
 * Handles both /admin/dashboard and /admin/stats endpoints
 */
export function normalizeDashboard(data: any): any {
  // Handle nested stats structure (data.stats)
  const stats = data.stats || data
  
  return {
    totalRevenue: stats.totalRevenue || data.totalRevenue || stats.revenue || data.revenue || stats.total_revenue || data.total_revenue || 0,
    totalOrders: stats.totalOrders || data.totalOrders || stats.orders || data.orders || stats.total_orders || data.total_orders || 0,
    totalUsers: stats.totalUsers || data.totalUsers || stats.users || data.users || stats.total_users || data.total_users || 0,
    totalProducts: stats.totalProducts || data.totalProducts || stats.products || data.products || stats.total_products || data.total_products || 0,
    revenueGrowth: data.revenueGrowth || data.revenue_growth || data.revenueGrowthPercentage || stats.revenueGrowth || stats.revenue_growth || 0,
    ordersGrowth: data.ordersGrowth || data.orders_growth || data.ordersGrowthPercentage || stats.ordersGrowth || stats.orders_growth || 0,
    usersGrowth: data.usersGrowth || data.users_growth || data.usersGrowthPercentage || stats.usersGrowth || stats.users_growth || 0,
    topProducts: (data.topProducts || data.top_products || stats.topProducts || stats.top_products || []).map(normalizeProduct),
    recentOrders: (data.recentOrders || data.recent_orders || stats.recentOrders || stats.recent_orders || []).map(normalizeOrder),
    // Additional stats fields that might come from /admin/stats
    averageOrderValue: data.averageOrderValue || stats.averageOrderValue || data.average_order_value || stats.average_order_value || 0,
    conversionRate: data.conversionRate || stats.conversionRate || data.conversion_rate || stats.conversion_rate || 0,
    pendingOrders: data.pendingOrders || stats.pendingOrders || data.pending_orders || stats.pending_orders || 0,
    completedOrders: data.completedOrders || stats.completedOrders || data.completed_orders || stats.completed_orders || 0,
    activeUsers: data.activeUsers || stats.activeUsers || data.active_users || stats.active_users || 0,
    lowStockProducts: data.lowStockProducts || stats.lowStockProducts || data.low_stock_products || stats.low_stock_products || 0,
    totalCategories: data.totalCategories || stats.totalCategories || data.total_categories || stats.total_categories || 0,
    monthlyRevenue: data.monthlyRevenue || stats.monthlyRevenue || data.monthly_revenue || stats.monthly_revenue || [],
    orderStatusBreakdown: data.orderStatusBreakdown || stats.orderStatusBreakdown || data.order_status_breakdown || stats.order_status_breakdown || {},
    salesByCategory: data.salesByCategory || stats.salesByCategory || data.sales_by_category || stats.sales_by_category || [],
  }
}

/**
 * Merge dashboard and stats data
 * Combines data from both /admin/dashboard and /admin/stats endpoints
 */
export function mergeDashboardData(dashboardData: any, statsData: any): any {
  const normalizedDashboard = normalizeDashboard(dashboardData)
  const normalizedStats = normalizeDashboard(statsData)
  
  // Merge with stats taking precedence for detailed fields
  return {
    ...normalizedDashboard,
    // Override with stats data if available
    averageOrderValue: normalizedStats.averageOrderValue || normalizedDashboard.averageOrderValue,
    conversionRate: normalizedStats.conversionRate || normalizedDashboard.conversionRate,
    pendingOrders: normalizedStats.pendingOrders || normalizedDashboard.pendingOrders,
    completedOrders: normalizedStats.completedOrders || normalizedDashboard.completedOrders,
    activeUsers: normalizedStats.activeUsers || normalizedDashboard.activeUsers,
    lowStockProducts: normalizedStats.lowStockProducts || normalizedDashboard.lowStockProducts,
    totalCategories: normalizedStats.totalCategories || normalizedDashboard.totalCategories,
    monthlyRevenue: normalizedStats.monthlyRevenue || normalizedDashboard.monthlyRevenue,
    orderStatusBreakdown: normalizedStats.orderStatusBreakdown || normalizedDashboard.orderStatusBreakdown,
    salesByCategory: normalizedStats.salesByCategory || normalizedDashboard.salesByCategory,
  }
}

/**
 * Extract data from API response
 * Handles both direct data and nested data.data formats
 */
export function extractDataFromResponse<T>(response: any): T | null {
  if (!response) return null
  
  if (response.success === false) {
    return null
  }
  
  // Handle direct data
  if (response.data !== undefined) {
    // If data is an array, return it directly
    if (Array.isArray(response.data)) {
      return response.data as T
    }
    // If data has a nested data property, check that
    if (response.data.data !== undefined) {
      return response.data.data as T
    }
    // Otherwise return data directly
    return response.data as T
  }
  
  // If no data property, return the response itself
  return response as T
}

/**
 * Extract paginated data from API response
 */
export function extractPaginatedData<T>(response: any): { data: T[]; pagination?: any } {
  const extracted = extractDataFromResponse<any>(response)
  
  if (!extracted) {
    return { data: [] }
  }
  
  // If it's already an array
  if (Array.isArray(extracted)) {
    return { 
      data: extracted as T[],
      pagination: response.pagination || response.data?.pagination
    }
  }
  
  // If it has a data property
  if (extracted.data && Array.isArray(extracted.data)) {
    return {
      data: extracted.data as T[],
      pagination: extracted.pagination || response.pagination
    }
  }
  
  return { data: [] }
}

