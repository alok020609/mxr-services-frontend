/**
 * API Registry
 * 
 * Type-safe registry of all API clients for centralized access and autocomplete support.
 * This provides a structured way to access all APIs with full TypeScript support.
 */

import { authApi } from './endpoints/auth'
import { productsApi } from './endpoints/products'
import { cartApi } from './endpoints/cart'
import { ordersApi } from './endpoints/orders'
import { paymentsApi } from './endpoints/payments'
import { reviewsApi } from './endpoints/reviews'
import { wishlistApi } from './endpoints/wishlist'
import { couponsApi } from './endpoints/coupons'
import { notificationsApi } from './endpoints/notifications'
import { loyaltyApi } from './endpoints/loyalty'
import { orderEnhancementsApi } from './endpoints/order-enhancements'
import { orderStateApi } from './endpoints/order-state'
import { paymentsAdvancedApi } from './endpoints/payments-advanced'
import { productManagementApi } from './endpoints/product-management'
import { advancedProductsApi } from './endpoints/advanced-products'
import { searchApi } from './endpoints/search'
import { searchIndexApi } from './endpoints/search-index'
import { shippingApi } from './endpoints/shipping'
import { shippingCarriersApi } from './endpoints/shipping-carriers'
import { taxApi } from './endpoints/tax'
import { securityApi } from './endpoints/security'
import { socialApi } from './endpoints/social'
import { subscriptionsApi } from './endpoints/subscriptions'
import { supportApi } from './endpoints/support'
import { vendorApi } from './endpoints/vendor'
import { walletApi } from './endpoints/wallet'
import { webhooksApi } from './endpoints/webhooks'
import { adminApi } from './endpoints/admin'
import { analyticsApi } from './endpoints/analytics'
import { advancedAnalyticsApi } from './endpoints/advanced-analytics'
import { inventoryApi } from './endpoints/inventory'
import { inventoryAdvancedApi } from './endpoints/inventory-advanced'
import { paymentGatewaysApi } from './endpoints/payment-gateways'
import { emailServicesApi } from './endpoints/email-services'
import { disasterRecoveryApi } from './endpoints/disaster-recovery'
import { featureFlagsApi } from './endpoints/feature-flags'
import { jobsApi } from './endpoints/jobs'
import { migrationsApi } from './endpoints/migrations'
import { monitoringApi } from './endpoints/monitoring'
import { observabilityApi } from './endpoints/observability'
import { cmsApi } from './endpoints/cms'
import { mediaApi } from './endpoints/media'
import { complianceApi } from './endpoints/compliance'
import { customerServiceEnhancedApi } from './endpoints/customer-service-enhanced'
import { experienceApi } from './endpoints/experience'
import { crmApi } from './endpoints/crm'
import { currenciesApi } from './endpoints/currencies'
import { giftsApi } from './endpoints/gifts'
import { i18nApi } from './endpoints/i18n'
import { integrationsApi } from './endpoints/integrations'
import { languagesApi } from './endpoints/languages'
import { marketingApi } from './endpoints/marketing'
import { mobileApi } from './endpoints/mobile'
import { tenantsApi } from './endpoints/tenants'
import { operationalApi } from './endpoints/operational'
import { batchApi } from './endpoints/batch'
import { apiDeprecationApi } from './endpoints/api-deprecation'
import { apiGatewayApi } from './endpoints/api-gateway'
import { logisticsProvidersApi } from './endpoints/logistics-providers'
import { logisticsApi } from './endpoints/logistics'

/**
 * API Registry Interface
 * Provides type-safe access to all API clients
 */
export interface ApiRegistry {
  // Core APIs
  auth: typeof authApi
  products: typeof productsApi
  cart: typeof cartApi
  orders: typeof ordersApi
  payments: typeof paymentsApi
  
  // User Features
  reviews: typeof reviewsApi
  wishlist: typeof wishlistApi
  coupons: typeof couponsApi
  notifications: typeof notificationsApi
  loyalty: typeof loyaltyApi
  
  // Order & Payment Enhancements
  orderEnhancements: typeof orderEnhancementsApi
  orderState: typeof orderStateApi
  paymentsAdvanced: typeof paymentsAdvancedApi
  
  // Product Management
  productManagement: typeof productManagementApi
  advancedProducts: typeof advancedProductsApi
  
  // Search & Discovery
  search: typeof searchApi
  searchIndex: typeof searchIndexApi
  
  // Shipping & Tax
  shipping: typeof shippingApi
  shippingCarriers: typeof shippingCarriersApi
  tax: typeof taxApi
  
  // Security
  security: typeof securityApi
  
  // Social & Commerce
  social: typeof socialApi
  
  // Subscriptions
  subscriptions: typeof subscriptionsApi
  
  // Support
  support: typeof supportApi
  
  // Vendor
  vendor: typeof vendorApi
  
  // Wallet
  wallet: typeof walletApi
  
  // Webhooks
  webhooks: typeof webhooksApi
  
  // Admin APIs
  admin: typeof adminApi
  analytics: typeof analyticsApi
  advancedAnalytics: typeof advancedAnalyticsApi
  inventory: typeof inventoryApi
  inventoryAdvanced: typeof inventoryAdvancedApi
  paymentGateways: typeof paymentGatewaysApi
  emailServices: typeof emailServicesApi
  
  // Advanced Admin Features
  disasterRecovery: typeof disasterRecoveryApi
  featureFlags: typeof featureFlagsApi
  jobs: typeof jobsApi
  migrations: typeof migrationsApi
  monitoring: typeof monitoringApi
  observability: typeof observabilityApi
  
  // Content & Media
  cms: typeof cmsApi
  media: typeof mediaApi
  
  // Compliance
  compliance: typeof complianceApi
  
  // Customer Experience
  customerServiceEnhanced: typeof customerServiceEnhancedApi
  experience: typeof experienceApi
  
  // CRM
  crm: typeof crmApi
  
  // Currency
  currencies: typeof currenciesApi
  
  // Gifts
  gifts: typeof giftsApi
  
  // Internationalization
  i18n: typeof i18nApi
  
  // Integrations
  integrations: typeof integrationsApi
  
  // Languages
  languages: typeof languagesApi
  
  // Marketing
  marketing: typeof marketingApi
  
  // Mobile
  mobile: typeof mobileApi
  
  // Multi-Tenant
  tenants: typeof tenantsApi
  
  // Operations
  operational: typeof operationalApi
  batch: typeof batchApi
  
  // API Management
  apiDeprecation: typeof apiDeprecationApi
  apiGateway: typeof apiGatewayApi
  
  // Logistics
  logisticsProviders: typeof logisticsProvidersApi
  logistics: typeof logisticsApi
}

/**
 * API Registry Instance
 * Centralized access to all API clients
 */
export const apiRegistry: ApiRegistry = {
  // Core APIs
  auth: authApi,
  products: productsApi,
  cart: cartApi,
  orders: ordersApi,
  payments: paymentsApi,
  
  // User Features
  reviews: reviewsApi,
  wishlist: wishlistApi,
  coupons: couponsApi,
  notifications: notificationsApi,
  loyalty: loyaltyApi,
  
  // Order & Payment Enhancements
  orderEnhancements: orderEnhancementsApi,
  orderState: orderStateApi,
  paymentsAdvanced: paymentsAdvancedApi,
  
  // Product Management
  productManagement: productManagementApi,
  advancedProducts: advancedProductsApi,
  
  // Search & Discovery
  search: searchApi,
  searchIndex: searchIndexApi,
  
  // Shipping & Tax
  shipping: shippingApi,
  shippingCarriers: shippingCarriersApi,
  tax: taxApi,
  
  // Security
  security: securityApi,
  
  // Social & Commerce
  social: socialApi,
  
  // Subscriptions
  subscriptions: subscriptionsApi,
  
  // Support
  support: supportApi,
  
  // Vendor
  vendor: vendorApi,
  
  // Wallet
  wallet: walletApi,
  
  // Webhooks
  webhooks: webhooksApi,
  
  // Admin APIs
  admin: adminApi,
  analytics: analyticsApi,
  advancedAnalytics: advancedAnalyticsApi,
  inventory: inventoryApi,
  inventoryAdvanced: inventoryAdvancedApi,
  paymentGateways: paymentGatewaysApi,
  emailServices: emailServicesApi,
  
  // Advanced Admin Features
  disasterRecovery: disasterRecoveryApi,
  featureFlags: featureFlagsApi,
  jobs: jobsApi,
  migrations: migrationsApi,
  monitoring: monitoringApi,
  observability: observabilityApi,
  
  // Content & Media
  cms: cmsApi,
  media: mediaApi,
  
  // Compliance
  compliance: complianceApi,
  
  // Customer Experience
  customerServiceEnhanced: customerServiceEnhancedApi,
  experience: experienceApi,
  
  // CRM
  crm: crmApi,
  
  // Currency
  currencies: currenciesApi,
  
  // Gifts
  gifts: giftsApi,
  
  // Internationalization
  i18n: i18nApi,
  
  // Integrations
  integrations: integrationsApi,
  
  // Languages
  languages: languagesApi,
  
  // Marketing
  marketing: marketingApi,
  
  // Mobile
  mobile: mobileApi,
  
  // Multi-Tenant
  tenants: tenantsApi,
  
  // Operations
  operational: operationalApi,
  batch: batchApi,
  
  // API Management
  apiDeprecation: apiDeprecationApi,
  apiGateway: apiGatewayApi,
  
  // Logistics
  logisticsProviders: logisticsProvidersApi,
  logistics: logisticsApi
}

/**
 * Helper function to get API by name
 */
export function getApi<K extends keyof ApiRegistry>(name: K): ApiRegistry[K] {
  return apiRegistry[name]
}

