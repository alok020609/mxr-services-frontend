/**
 * Centralized API Index
 * 
 * This file exports all API clients for easy import throughout the application.
 * Import APIs like: import { authApi, productsApi } from '@/api'
 */

// Core APIs
export { authApi } from './endpoints/auth'
export { productsApi } from './endpoints/products'
export { cartApi } from './endpoints/cart'
export { ordersApi } from './endpoints/orders'
export { servicesApi } from './endpoints/services'
export { paymentsApi } from './endpoints/payments'

// User Features
export { reviewsApi } from './endpoints/reviews'
export { wishlistApi } from './endpoints/wishlist'
export { couponsApi } from './endpoints/coupons'
export { notificationsApi } from './endpoints/notifications'
export { loyaltyApi } from './endpoints/loyalty'

// Order & Payment Enhancements
export { orderEnhancementsApi } from './endpoints/order-enhancements'
export { orderStateApi } from './endpoints/order-state'
export { paymentsAdvancedApi } from './endpoints/payments-advanced'

// Product Management
export { productManagementApi } from './endpoints/product-management'
export { advancedProductsApi } from './endpoints/advanced-products'

// Search & Discovery
export { searchApi } from './endpoints/search'
export { searchIndexApi } from './endpoints/search-index'

// Shipping & Tax
export { shippingApi } from './endpoints/shipping'
export { shippingCarriersApi } from './endpoints/shipping-carriers'
export { taxApi } from './endpoints/tax'

// Security
export { securityApi } from './endpoints/security'

// Social & Commerce
export { socialApi } from './endpoints/social'

// Subscriptions
export { subscriptionsApi } from './endpoints/subscriptions'

// Support
export { supportApi } from './endpoints/support'

// Vendor
export { vendorApi } from './endpoints/vendor'

// Wallet
export { walletApi } from './endpoints/wallet'

// Webhooks
export { webhooksApi } from './endpoints/webhooks'

// Admin APIs
export { adminApi } from './endpoints/admin'
export { analyticsApi } from './endpoints/analytics'
export { advancedAnalyticsApi } from './endpoints/advanced-analytics'
export { inventoryApi } from './endpoints/inventory'
export { inventoryAdvancedApi } from './endpoints/inventory-advanced'
export { paymentGatewaysApi } from './endpoints/payment-gateways'
export { emailServicesApi } from './endpoints/email-services'
export { adminContactApi } from './endpoints/admin-contact'
export { adminMailSettingsApi } from './endpoints/admin-mail-settings'

// Advanced Admin Features
export { disasterRecoveryApi } from './endpoints/disaster-recovery'
export { featureFlagsApi } from './endpoints/feature-flags'
export { jobsApi } from './endpoints/jobs'
export { migrationsApi } from './endpoints/migrations'
export { monitoringApi } from './endpoints/monitoring'
export { observabilityApi } from './endpoints/observability'

// Content & Media
export { cmsApi } from './endpoints/cms'
export { mediaApi } from './endpoints/media'

// Compliance
export { complianceApi } from './endpoints/compliance'

// Customer Experience
export { customerServiceEnhancedApi } from './endpoints/customer-service-enhanced'
export { experienceApi } from './endpoints/experience'

// CRM
export { crmApi } from './endpoints/crm'

// Currency
export { currenciesApi } from './endpoints/currencies'
export { adminCurrenciesApi } from './endpoints/admin-currencies'

// Gifts
export { giftsApi } from './endpoints/gifts'

// Internationalization
export { i18nApi } from './endpoints/i18n'

// Integrations
export { integrationsApi } from './endpoints/integrations'

// Languages
export { languagesApi } from './endpoints/languages'

// Marketing
export { marketingApi } from './endpoints/marketing'

// Mobile
export { mobileApi } from './endpoints/mobile'

// Multi-Tenant
export { tenantsApi } from './endpoints/tenants'

// Operations
export { operationalApi } from './endpoints/operational'
export { batchApi } from './endpoints/batch'

// API Management
export { apiDeprecationApi } from './endpoints/api-deprecation'
export { apiGatewayApi } from './endpoints/api-gateway'

// Logistics
export { logisticsProvidersApi } from './endpoints/logistics-providers'
export { logisticsApi } from './endpoints/logistics'
