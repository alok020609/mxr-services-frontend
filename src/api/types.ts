// Common API Response Types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface ApiError {
  success: false
  error: string
  message?: string
  details?: any
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// User Types
export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'admin' | 'vendor'
  isVerified: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
  // Optional fields from backend
  firstName?: string
  lastName?: string
  phone?: string
  emailVerified?: boolean
  tenantId?: string | null
  _count?: {
    orders?: number
    reviews?: number
    addresses?: number
    wishlist?: number
  }
}

export interface Address {
  id: string
  userId: string
  type: 'billing' | 'shipping'
  firstName: string
  lastName: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  phone?: string
  isDefault: boolean
}

// Product Types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  compareAtPrice?: number
  originalPrice?: number
  sku: string
  slug?: string
  stock: number
  images: string[]
  categoryId: string
  category?: Category
  rating?: number
  reviewCount?: number
  status: 'active' | 'inactive' | 'draft'
  tags?: string[]
  badges?: string[]
  specifications?: any
  certifications?: string[]
  warrantyInfo?: string
  returnPolicy?: any
  refundPolicy?: any
  shippingPolicy?: any
  exchangePolicy?: any
  cancellationPolicy?: any
  careInstructions?: string
  countryOfOrigin?: string
  manufacturerInfo?: any
  brand?: string
  modelNumber?: string
  weightDimensions?: any
  minOrderQuantity?: number
  maxOrderQuantity?: number
  createdAt: string
  updatedAt: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  parentId?: string
  image?: string
  createdAt: string
  updatedAt: string
}

// Service Types (catalog: CONSULTING, REPAIR, INSTALLATION)
export type ServiceType = 'CONSULTING' | 'REPAIR' | 'INSTALLATION'

export interface Service {
  id: string
  name: string
  slug: string
  description?: string
  price: string
  type: ServiceType
  productId?: string | null
  categoryId?: string | null
  durationMinutes?: number
  isActive: boolean
  image?: string | null
  product?: { id: string; name: string; slug: string } | null
  category?: { id: string; name: string; slug: string } | null
  metadata?: Record<string, unknown> | null
  createdAt?: string
  updatedAt?: string
}

// Cart Types
export interface CartItem {
  id: string
  productId?: string
  variantId?: string
  serviceId?: string
  product?: Product
  variant?: { id?: string; price?: number; [key: string]: unknown }
  service?: Service
  quantity: number
  price: number
  subtotal: number
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  updatedAt: string
}

// Order Types
export interface OrderStateHistoryEntry {
  id?: string
  orderId?: string
  fromState?: string
  toState?: string
  reason?: string
  userId?: string
  createdAt?: string
  user?: { id?: string; firstName?: string; lastName?: string; email?: string }
}

export interface Order {
  id: string
  userId: string
  orderNumber: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  items: OrderItem[]
  subtotal: number
  tax: number
  shipping: number
  discount: number
  total: number
  shippingAddress: Address
  billingAddress: Address
  paymentMethod: string
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded'
  createdAt: string
  updatedAt: string
  stateHistory?: OrderStateHistoryEntry[]
}

export interface OrderItem {
  id: string
  productId?: string | null
  variantId?: string | null
  serviceId?: string | null
  product?: Product | null
  variant?: { id?: string; price?: number; [key: string]: unknown } | null
  service?: Service | null
  quantity: number
  price: number
  subtotal: number
  total?: number
}

// Payment Types
export type PaymentGatewayType = 
  | 'STRIPE' 
  | 'PAYU' 
  | 'PAYPAL' 
  | 'UPI' 
  | 'RAZORPAY' 
  | 'CRYPTO' 
  | 'BANK_TRANSFER' 
  | 'COD' 
  | 'PHONEPE' 
  | 'GPAY' 
  | 'PAYTM'

export interface PaymentGateway {
  id: string
  name: string
  type: PaymentGatewayType
  isActive: boolean
  config?: Record<string, any>
  webhookSecret?: string
  supportedCurrencies?: string[]
  supportedMethods?: string[]
  integrationStatus?: 'available' | 'coming_soon'
  createdAt?: string
  updatedAt?: string
}

// Gateway-specific configuration types
export interface PhonePeConfig {
  merchantId: string
  merchantKey: string
  apiKey: string
  environment: 'sandbox' | 'production'
  saltKey: string
  saltIndex: string
}

export interface GPayConfig {
  merchantId: string
  merchantKey: string
  apiKey: string
  environment: 'sandbox' | 'production'
}

export interface PaytmConfig {
  merchantId: string
  merchantKey: string
  environment: 'sandbox' | 'production'
  website: string
  industryType: string
  channelId: string
}

export interface StripeConfig {
  secretKey: string
  publishableKey: string
  environment: 'sandbox' | 'production'
}

export interface RazorpayConfig {
  keyId: string
  keySecret: string
  environment: 'sandbox' | 'production'
}

export interface PayUConfig {
  key: string
  salt: string
  environment: 'sandbox' | 'production'
  successRedirectUrl?: string
  failureRedirectUrl?: string
}

export interface PaymentGatewayConfig {
  name: string
  type: PaymentGatewayType
  config: PhonePeConfig | GPayConfig | PaytmConfig | StripeConfig | RazorpayConfig | PayUConfig | Record<string, any>
  webhookSecret?: string
  supportedCurrencies?: string[]
  supportedMethods?: string[]
  isActive?: boolean
}

export interface PaymentGatewayConfigSchemaField {
  name: string
  type: 'string' | 'number' | 'enum'
  required: boolean
  label?: string
  description?: string
  enum?: string[]
}

export interface PaymentGatewayConfigSchema {
  type: string
  fields: PaymentGatewayConfigSchemaField[]
}

// Admin Email Service types
export type EmailServiceType = 'SMTP' | 'SENDGRID' | 'MAILGUN' | 'AWS_SES'

export interface EmailServiceSmtpConfig {
  host: string
  port: number
  secure: boolean
  user: string
  password: string
  from: string
}

export interface EmailServiceSendGridConfig {
  apiKey: string
  from: string
}

export interface EmailServiceMailgunConfig {
  apiKey: string
  domain: string
  from: string
}

export interface EmailServiceAwsSesConfig {
  accessKeyId: string
  secretAccessKey: string
  region: string
  from: string
}

export type EmailServiceConfig =
  | EmailServiceSmtpConfig
  | EmailServiceSendGridConfig
  | EmailServiceMailgunConfig
  | EmailServiceAwsSesConfig
  | Record<string, unknown>

export interface EmailService {
  id: string
  name: string
  type: EmailServiceType
  isActive: boolean
  isDefault: boolean
  config: EmailServiceConfig
  createdAt?: string
  updatedAt?: string
}

export interface EmailServiceCreatePayload {
  name: string
  type: EmailServiceType
  config: EmailServiceConfig
  isActive?: boolean
  isDefault?: boolean
}

export interface PaymentIntent {
  id: string
  clientSecret: string
  amount: number
  currency: string
  status: string
}

/** Create-intent response: PayU returns redirectUrl/formData; others return paymentId/clientSecret. */
export interface PaymentIntentCreateResult {
  paymentId?: string
  clientSecret?: string
  redirectUrl?: string
  formData?: Record<string, string>
  message?: string
}

// Advanced Payment Types
export interface PaymentLink {
  id: string
  link: string
  orderId?: string
  amount: number
  description?: string
  expiresAt?: string
  status: 'active' | 'expired' | 'used'
  createdAt: string
}

export interface SavedPaymentMethod {
  id: string
  type: string
  last4?: string
  brand?: string
  expiryMonth?: number
  expiryYear?: number
  isDefault: boolean
  createdAt: string
}

export interface PaymentRoute {
  paymentId: string
  processor: string
  status: string
  routedAt: string
}

export interface PaymentRetry {
  paymentId: string
  status: string
  retryCount: number
  lastAttempt?: string
  nextRetry?: string
}

export interface SplitPaymentRecipient {
  recipient: string
  amount: number
  percentage?: number
}

export interface SplitPayment {
  paymentId: string
  splits: SplitPaymentRecipient[]
  totalAmount: number
  status: string
  createdAt: string
}

export interface ReconciliationItem {
  paymentId: string
  orderId: string
  amount: number
  status: string
  processor: string
  transactionId?: string
  createdAt: string
  reconciledAt?: string
}

export interface ReconciliationReport {
  items: ReconciliationItem[]
  summary: {
    totalAmount: number
    reconciledAmount: number
    pendingAmount: number
    discrepancies: number
  }
}

export interface Chargeback {
  id: string
  paymentId: string
  reason: string
  amount?: number
  status: string
  notes?: string
  createdAt: string
}

// Review Types
export interface Review {
  id: string
  productId: string
  userId: string
  user?: User
  rating: number
  title?: string
  comment: string
  helpfulCount: number
  isVerified: boolean
  createdAt: string
  updatedAt: string
}

// Wishlist Types
export interface WishlistItem {
  id: string
  userId: string
  productId: string
  product?: Product
  createdAt: string
}

// Coupon Types
export interface Coupon {
  id: string
  code: string
  type: 'percentage' | 'fixed'
  value: number
  minPurchase?: number
  maxDiscount?: number
  validFrom: string
  validTo: string
  usageLimit?: number
  usageCount: number
  isActive: boolean
  description?: string
  discountType?: 'percentage' | 'fixed'
  discount?: number
  minimumPurchase?: number
  maximumDiscount?: number
  validUntil?: string
  usageLimitPerUser?: number
  status?: 'active' | 'inactive' | 'expired'
}

export interface CouponValidation {
  valid: boolean
  discount: number
  message?: string
}

// Notification Types
export interface Notification {
  id: string
  userId: string
  type: string
  title: string
  message: string
  isRead: boolean
  link?: string
  createdAt: string
}

// Analytics Types
export interface AnalyticsDashboard {
  totalRevenue: number
  totalOrders: number
  totalUsers: number
  totalProducts: number
  revenueGrowth: number
  ordersGrowth: number
  usersGrowth: number
  topProducts: Product[]
  recentOrders: Order[]
}

// Advanced Analytics Types
export interface ChurnPrediction {
  userId: string
  churnProbability: number
  daysSinceLastOrder: number
  totalOrders: number
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH'
}

export interface ProductAffinity {
  userId: string
  productId: string
  affinityScore: number
  recommendation: 'WEAK' | 'MODERATE' | 'STRONG'
}

export interface AttributionData {
  firstTouch: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    [key: string]: any
  }
  lastTouch: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    [key: string]: any
  }
  touchpoints: AttributionTouchpoint[]
}

export interface AttributionTouchpoint {
  eventType: 'PAGE_VIEW' | 'PRODUCT_VIEW' | 'CART_ADD' | 'ORDER_PLACED'
  timestamp: string
  metadata: {
    utm_source?: string
    utm_medium?: string
    utm_campaign?: string
    utm_term?: string
    utm_content?: string
    [key: string]: any
  }
}

export interface RealtimeDashboard {
  lastHour: {
    orders: number
    revenue: number
    activeUsers: number
  }
  last24Hours: {
    orders: number
    revenue: number
  }
  timestamp: string
}

export interface LiveOrder {
  id: string
  orderNumber: string
  status: 'PAID' | 'PACKED' | 'SHIPPED'
  total: string
  user: {
    id: string
    name: string | null
    email: string
  }
  items: Array<{
    id: string
    productId: string
    quantity: number
    price: string
    product: {
      id: string
      name: string
    }
  }>
  updatedAt: string
}

export interface ConversionFunnel {
  visitors: number
  productViews: number
  cartAdds: number
  checkouts: number
  orders: number
  conversionRates: {
    visitorToView: number
    viewToCart: number
    cartToCheckout: number
    checkoutToOrder: number
    overall: number
  }
}

// Admin Types
export interface AdminSettings {
  storeName?: string
  storeEmail?: string
  storePhone?: string
  storeAddress?: string
  storeCity?: string
  storeState?: string
  storeZip?: string
  storeCountry?: string
  stripePublicKey?: string
  stripeSecretKey?: string
  paypalClientId?: string
  defaultShippingCost?: number
  freeShippingThreshold?: number
  defaultTaxRate?: number
  taxCalculationMethod?: 'inclusive' | 'exclusive'
}

export interface CMSPage {
  id?: string
  title: string
  slug: string
  content: string
  status?: 'published' | 'draft'
  createdAt?: string
  updatedAt?: string
}

export interface BlogPost {
  id?: string
  title: string
  slug: string
  excerpt?: string
  content: string
  author?: string
  status?: 'published' | 'draft'
  createdAt?: string
  updatedAt?: string
}

export interface Banner {
  id: string
  title: string
  imageUrl: string
  linkUrl?: string
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

// Compliance Types
export interface LegalDocument {
  id?: string
  type: 'terms' | 'privacy' | 'cookie' | 'refund' | 'shipping'
  title: string
  content: string
  version: string
  status: 'active' | 'draft' | 'archived'
  createdAt?: string
  updatedAt?: string
}

export interface DocumentAcceptance {
  id?: string
  userId: string
  documentType: string
  version: string
  accepted: boolean
  acceptedAt?: string
}

export interface PCIComplianceStatus {
  compliant: boolean
  level?: '1' | '2' | '3' | '4'
  score?: number
  lastAssessment?: string
  checklist?: {
    item: string
    status: 'pass' | 'fail' | 'warning'
  }[]
  updatedAt?: string
}

export interface TaxCalculationRequest {
  amount: number
  fromAddress?: {
    country: string
    state?: string
    city?: string
    zip?: string
  }
  toAddress: {
    country: string
    state?: string
    city?: string
    zip?: string
  }
  shipping?: number
  lineItems?: Array<{
    id?: string
    quantity: number
    unitPrice: number
    taxCode?: string
  }>
}

export interface TaxCalculationResponse {
  amount: number
  taxAmount: number
  total: number
  breakdown?: {
    state?: number
    county?: number
    city?: number
    special?: number
  }
  rate?: number
  jurisdiction?: string
}

export interface NexusLocation {
  id?: string
  country: string
  state?: string
  city?: string
  zip?: string
  status: 'active' | 'inactive'
  effectiveDate?: string
  createdAt?: string
  updatedAt?: string
}

// CRM Types
export interface Customer360 {
  customer: {
    id: string
    name: string
    email: string
    phone?: string
    createdAt: string
  }
  orders: {
    total: number
    totalValue: number
    averageOrderValue: number
    lastOrderDate?: string
    recentOrders: Array<{
      id: string
      total: number
      status: string
      createdAt: string
    }>
  }
  lifetimeValue: number
  averageOrderValue: number
  favoriteCategories?: string[]
  recentActivity?: Array<{
    type: string
    description: string
    date: string
  }>
}

export interface RFMAnalysis {
  recency: {
    score: number
    daysSinceLastOrder: number
    interpretation: string
  }
  frequency: {
    score: number
    totalOrders: number
    interpretation: string
  }
  monetary: {
    score: number
    totalSpent: number
    interpretation: string
  }
  segment: string
  recommendations?: string[]
}

export interface CustomerTag {
  id?: string
  tag: string
  createdAt?: string
  createdBy?: string
}

export interface CustomerNote {
  id?: string
  note: string
  createdAt?: string
  createdBy?: string
  author?: string
}

export interface CustomerSegment {
  id: string
  name: string
  description?: string
  criteria: Record<string, any>
  customerCount: number
  createdAt?: string
  updatedAt?: string
}

// Currency Types (aligned with backend: id, code, name, symbol, exchangeRate, isActive, isDefault, updatedAt)
export interface Currency {
  id?: string
  code: string
  name: string
  symbol: string
  exchangeRate?: number
  /** @deprecated Use exchangeRate. Kept for backward compat during migration. */
  rate?: number
  isActive?: boolean
  isDefault?: boolean
  updatedAt?: string
}

export interface CurrencyConversion {
  amount: number
  rate: number
  fromCurrency: string
  toCurrency: string
  convertedAmount: number
}

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  updatedAt?: string
}

// Customer Experience Types
export interface ProductQuestion {
  id: string
  productId: string
  question: string
  answer?: string
  askedBy?: string
  answeredBy?: string
  answeredAt?: string
  createdAt: string
  helpful?: number
}

export interface SizeGuide {
  productId: string
  guideType: 'table' | 'chart' | 'text'
  data: any // Can be table data, chart config, or text content
  measurements?: string[] // e.g., ['Chest', 'Waist', 'Hip']
  sizes?: string[] // e.g., ['S', 'M', 'L', 'XL']
  table?: Array<Record<string, string | number>> // For table format
  description?: string
}

export interface ProductVideo {
  id: string
  productId: string
  title?: string
  url: string
  thumbnail?: string
  type: 'youtube' | 'vimeo' | 'direct'
  duration?: number
  order?: number
}

export interface SocialProof {
  productId: string
  recentPurchases?: Array<{
    location?: string
    timeAgo?: string
    anonymized?: boolean
  }>
  viewsCount?: number
  purchasesCount?: number
  reviewsCount?: number
  averageRating?: number
  lastPurchasedAt?: string
}

export interface WaitlistItem {
  id: string
  productId: string
  product?: Product
  userId: string
  status: 'waiting' | 'notified' | 'purchased' | 'removed'
  createdAt: string
  notifiedAt?: string
}

export interface ProductAlert {
  id: string
  productId: string
  product?: Product
  userId: string
  type: 'price_drop' | 'back_in_stock' | 'new_variant' | 'custom'
  threshold?: number // For price drop alerts
  currentPrice?: number
  targetPrice?: number
  status: 'active' | 'triggered' | 'cancelled'
  createdAt: string
  triggeredAt?: string
}

// Customer Service Enhanced Types
export interface OrderTracking {
  orderNumber: string
  status: string
  currentLocation?: string
  estimatedDelivery?: string
  trackingEvents?: Array<{
    date: string
    location: string
    status: string
    description: string
  }>
}

export interface KnowledgeBaseArticle {
  id: string
  title: string
  content: string
  category?: string
  tags?: string[]
  views?: number
  helpful?: number
  createdAt: string
  updatedAt?: string
}

export interface TroubleshootingGuide {
  id: string
  title: string
  description: string
  steps: Array<{
    step: number
    title: string
    description: string
    image?: string
  }>
  category?: string
  tags?: string[]
  createdAt: string
}

export interface VideoTutorial {
  id: string
  title: string
  description?: string
  url: string
  thumbnail?: string
  duration?: number
  category?: string
  views?: number
  createdAt: string
}

export interface CallbackRequest {
  name: string
  phone: string
  email?: string
  preferredTime?: string
  reason?: string
  orderNumber?: string
}

// Disaster Recovery Types
export interface RPORTO {
  rpo: {
    value: number
    unit: 'minutes' | 'hours' | 'days'
    description: string
  }
  rto: {
    value: number
    unit: 'minutes' | 'hours' | 'days'
    description: string
  }
  services: Array<{
    service: string
    rpo: number
    rto: number
  }>
}

export interface DisasterRecoveryPlan {
  id: string
  name: string
  description: string
  steps: Array<{
    step: number
    title: string
    description: string
    estimatedTime: number
  }>
  lastTested?: string
  lastUpdated: string
}

export interface Backup {
  id: string
  type: 'full' | 'incremental' | 'differential'
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  size?: number
  createdAt: string
  completedAt?: string
  location?: string
}

export interface BackupSchedule {
  enabled: boolean
  frequency: 'daily' | 'weekly' | 'monthly'
  time: string
  type: 'full' | 'incremental'
  retentionDays: number
}

export interface RestoreDrill {
  id: string
  backupId: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  startedAt: string
  completedAt?: string
  results?: any
}

// Feature Flags Types
export interface FeatureFlag {
  key: string
  name: string
  description?: string
  enabled: boolean
  type: 'boolean' | 'string' | 'number' | 'json'
  defaultValue?: any
  rules?: FeatureFlagRule[]
  overrides?: FeatureFlagOverride[]
  createdAt: string
  updatedAt?: string
}

export interface FeatureFlagRule {
  id: string
  condition: string
  value: any
  priority: number
}

export interface FeatureFlagOverride {
  id: string
  userId?: string
  context?: Record<string, any>
  value: any
}

export interface FeatureFlagStats {
  flagKey: string
  totalEvaluations: number
  enabledCount: number
  disabledCount: number
  byRule?: Record<string, number>
}

// Gifts Types
export interface GiftRegistry {
  id: string
  name: string
  description?: string
  eventDate?: string
  eventType?: string
  userId: string
  items: GiftRegistryItem[]
  isPublic: boolean
  createdAt: string
  updatedAt?: string
}

export interface GiftRegistryItem {
  id: string
  registryId: string
  productId: string
  product?: Product
  quantity: number
  purchased: number
  priority?: 'high' | 'medium' | 'low'
  notes?: string
}

export interface GiftOrder {
  id: string
  orderId: string
  recipientName: string
  recipientEmail?: string
  message?: string
  giftWrap?: boolean
  scheduledDelivery?: string
  trackingNumber?: string
}

export interface GiftTracking {
  trackingNumber: string
  status: string
  currentLocation?: string
  estimatedDelivery?: string
  events?: Array<{
    date: string
    location: string
    status: string
  }>
}

// Internationalization Types
export interface RegionalPrice {
  productId: string
  region: string
  currency: string
  price: number
  compareAtPrice?: number
  taxIncluded?: boolean
}

export interface RegionalAvailability {
  productId: string
  region: string
  available: boolean
  stock?: number
  shippingAvailable?: boolean
  estimatedDelivery?: string
}

export interface RegionalPaymentMethod {
  id: string
  region: string
  method: string
  name: string
  enabled: boolean
  config?: any
}

export interface RegionalShippingCarrier {
  id: string
  region: string
  carrier: string
  name: string
  enabled: boolean
  estimatedDays?: number
}

export interface RegionalCompliance {
  region: string
  gdpr?: boolean
  dataResidency?: string
  taxRules?: any
  legalRequirements?: string[]
}

export interface Store {
  id: string
  name: string
  address: {
    street: string
    city: string
    state?: string
    zip: string
    country: string
  }
  coordinates?: {
    lat: number
    lng: number
  }
  phone?: string
  email?: string
  hours?: Record<string, string>
  isActive: boolean
  region?: string
}

// Job Queue Types
export interface JobStats {
  total: number
  pending: number
  active: number
  completed: number
  failed: number
  byQueue: Record<string, {
    total: number
    pending: number
    active: number
    completed: number
    failed: number
  }>
}

export interface Job {
  id: string
  queue: string
  name: string
  status: 'pending' | 'active' | 'completed' | 'failed' | 'delayed'
  data?: any
  progress?: number
  attempts: number
  maxAttempts: number
  createdAt: string
  startedAt?: string
  completedAt?: string
  failedAt?: string
  error?: string
}

// Language Types
export interface Language {
  code: string
  name: string
  nativeName: string
  isRTL: boolean
  isDefault?: boolean
  isActive: boolean
}

export interface Translation {
  id: string
  key: string
  locale: string
  value: string
  namespace?: string
  createdAt: string
  updatedAt?: string
}

// Loyalty Types (enhance existing)
export interface LoyaltyPoints {
  points: number
  tier: string
  tierName?: string
  pointsToNextTier?: number
  lifetimePoints?: number
}

export interface LoyaltyTier {
  id: string
  name: string
  minPoints: number
  maxPoints?: number
  benefits?: string[]
  discount?: number
}

export interface LoyaltyReward {
  id: string
  name: string
  description: string
  pointsRequired: number
  category?: string
  image?: string
  available: boolean
}

export interface ReferralCode {
  code: string
  userId: string
  uses: number
  maxUses?: number
  reward?: number
  expiresAt?: string
}

// Marketing Types
export interface FlashSale {
  id: string
  name: string
  description?: string
  startTime: string
  endTime: string
  products: Array<{
    productId: string
    product?: Product
    discount: number
    discountType: 'percentage' | 'fixed'
  }>
  isActive: boolean
}

export interface Deal {
  id: string
  title: string
  description?: string
  discount: number
  discountType: 'percentage' | 'fixed'
  minPurchase?: number
  validFrom: string
  validUntil: string
  applicableProducts?: string[]
  isActive: boolean
}

export interface ProductBundle {
  id: string
  name: string
  description?: string
  products: Array<{
    productId: string
    product?: Product
    quantity: number
  }>
  price: number
  savings?: number
  isActive: boolean
}

export interface AbandonedCart {
  id: string
  userId: string
  items: Array<{
    productId: string
    product?: Product
    quantity: number
    price: number
  }>
  total: number
  abandonedAt: string
  lastReminderAt?: string
}

// Media Types
export interface MediaUpload {
  uploadId: string
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'failed'
  progress: number
  file?: {
    name: string
    size: number
    type: string
  }
}

export interface MediaImage {
  id: string
  url: string
  thumbnail?: string
  filename: string
  size: number
  width?: number
  height?: number
  mimeType: string
  uploadedBy?: string
  createdAt: string
  variants?: ImageVariant[]
}

export interface ImageVariant {
  size: string
  url: string
  width: number
  height: number
}

// Migration Types
export interface Migration {
  id: string
  name: string
  description?: string
  status: 'pending' | 'running' | 'completed' | 'failed' | 'rolled_back'
  startedAt?: string
  completedAt?: string
  rolledBackAt?: string
  error?: string
}

export interface CompatibilityCheck {
  migrationName: string
  compatible: boolean
  issues?: string[]
  warnings?: string[]
}

// Mobile Types
export interface AppVersion {
  version: string
  buildNumber: string
  platform: 'ios' | 'android'
  minVersion?: string
  updateRequired: boolean
  releaseNotes?: string
  downloadUrl?: string
}

export interface DeviceRegistration {
  deviceId: string
  platform: 'ios' | 'android'
  token: string
  appVersion: string
}

export interface DeepLink {
  id: string
  target: string
  url: string
  expiresAt?: string
  clicks?: number
}

export interface MobilePayment {
  orderId: string
  amount: number
  currency: string
  paymentMethod: string
  token?: string
}

export interface PushNotification {
  id?: string
  title: string
  body: string
  data?: any
  userId?: string
  deviceId?: string
  scheduledAt?: string
}

// Monitoring Types
export interface SystemHealth {
  status: 'healthy' | 'degraded' | 'unhealthy'
  services: Array<{
    name: string
    status: 'up' | 'down' | 'degraded'
    responseTime?: number
    lastCheck: string
  }>
  database: {
    status: 'up' | 'down'
    responseTime?: number
  }
  cache: {
    status: 'up' | 'down'
    responseTime?: number
  }
  timestamp: string
}

export interface SystemMetrics {
  cpu: {
    usage: number
    cores: number
  }
  memory: {
    used: number
    total: number
    percentage: number
  }
  disk: {
    used: number
    total: number
    percentage: number
  }
  requests: {
    total: number
    perSecond: number
    errors: number
  }
  timestamp: string
}

// Tenant Types
export interface Tenant {
  id: string
  name: string
  domain?: string
  subdomain?: string
  status: 'active' | 'inactive' | 'suspended'
  plan?: string
  settings?: Record<string, any>
  createdAt: string
  updatedAt?: string
}

export interface TenantStats {
  tenantId: string
  users: number
  products: number
  orders: number
  revenue: number
  period: string
}

// Notification Preferences
export interface NotificationPreferences {
  email: {
    orders: boolean
    promotions: boolean
    account: boolean
    marketing: boolean
  }
  push: {
    orders: boolean
    promotions: boolean
    account: boolean
  }
  sms: {
    orders: boolean
    account: boolean
  }
}

// Observability Types
export interface SLADefinition {
  service: string
  sla: number // percentage (e.g., 99.9)
  measurement: 'uptime' | 'response_time' | 'error_rate'
  period: string
}

export interface SLODefinition {
  service: string
  slo: number // percentage
  measurement: 'uptime' | 'response_time' | 'error_rate'
  window: string
}

export interface SLOStatus {
  service: string
  current: number
  target: number
  status: 'meeting' | 'at_risk' | 'breached'
  trend?: 'improving' | 'stable' | 'degrading'
}

export interface AlertThreshold {
  service: string
  metric: string
  threshold: number
  operator: 'gt' | 'lt' | 'eq'
  severity: 'low' | 'medium' | 'high' | 'critical'
}

export interface SLOReport {
  service: string
  period: string
  slo: number
  actual: number
  status: 'meeting' | 'breached'
  incidents?: number
  details?: any
}

// Integration Types
export interface Integration {
  id: string
  name: string
  type: string
  status: 'active' | 'inactive' | 'error'
  config?: Record<string, any>
  lastSync?: string
  error?: string
}

export interface InventoryItem {
  productId: string
  productName?: string
  stock: number
  reserved: number
  available: number
  lowStockThreshold?: number
}

export interface InventoryMovement {
  id: string
  productId: string
  type: 'in' | 'out' | 'adjustment'
  quantity: number
  reason?: string
  createdAt: string
}

// Advanced Inventory Types
export interface ReorderPointResult {
  productId: string
  currentStock: number
  reorderPoint: number
  recommendedOrderQuantity?: number
  leadTime?: number
  averageDailyDemand?: number
  safetyStock?: number
}

export interface StockTransfer {
  id?: string
  productId: string
  fromLocation: string
  toLocation: string
  quantity: number
  reason?: string
  status?: string
  createdAt?: string
}

export interface CycleCount {
  id?: string
  productId: string
  countedQuantity: number
  systemQuantity?: number
  variance?: number
  location?: string
  notes?: string
  createdAt?: string
}

export interface AgingReportItem {
  productId: string
  productName: string
  currentStock: number
  ageInDays: number
  category?: string
  lastSoldDate?: string
  value: number
}

export interface AgingReport {
  items: AgingReportItem[]
  summary?: {
    totalValue: number
    itemsByAgeRange?: {
      '0-30': number
      '31-60': number
      '61-90': number
      '90+': number
    }
  }
}

export interface ShrinkageRecord {
  id?: string
  productId: string
  quantity: number
  reason: string
  notes?: string
  createdAt?: string
}

// Advanced Products Types
export interface DigitalProduct extends Product {
  fileSize?: number
  fileType?: string
  downloadCount?: number
  downloadUrl?: string
  maxDownloads?: number
  expiryDate?: string
}

export interface Subscription {
  id: string
  productId: string
  product?: Product
  userId: string
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily'
  status: 'active' | 'cancelled' | 'expired' | 'paused'
  startDate: string
  nextBillingDate?: string
  endDate?: string
  amount: number
  createdAt: string
  updatedAt?: string
}

export interface CreateSubscriptionRequest {
  productId: string
  billingCycle: 'monthly' | 'yearly' | 'weekly' | 'daily'
  startDate?: string
}

export interface PreOrder {
  id: string
  productId: string
  product?: Product
  userId: string
  quantity: number
  expectedDate?: string
  status: 'pending' | 'confirmed' | 'cancelled' | 'fulfilled'
  createdAt: string
  updatedAt?: string
}

export interface CreatePreOrderRequest {
  productId: string
  quantity: number
}

export interface GiftCard {
  id: string
  code: string
  amount: number
  balance: number
  status: 'active' | 'redeemed' | 'expired' | 'cancelled'
  recipientEmail?: string
  recipientName?: string
  message?: string
  expiryDate?: string
  redeemedAt?: string
  redeemedBy?: string
  createdAt: string
  updatedAt?: string
}

export interface PurchaseGiftCardRequest {
  amount: number
  recipientEmail: string
  message?: string
}

export interface RedeemGiftCardRequest {
  code: string
}

// API Deprecation Types
export interface VersioningStrategy {
  strategy: string
  currentVersions?: string[]
  approach?: 'semantic' | 'date-based' | 'custom'
  description?: string
}

export interface DeprecationPolicy {
  policy: string
  deprecationPeriod?: number // in days
  supportPeriod?: number // in days
  noticePeriod?: number // in days
  guidelines?: string[]
}

export interface DeprecationNotice {
  id?: string
  version: string
  affectedEndpoints?: string[]
  deprecationDate: string
  removalDate?: string
  migrationGuide?: string
  notice: string
  status?: 'active' | 'upcoming' | 'completed'
  createdAt?: string
  updatedAt?: string
}

export interface CreateDeprecationNoticeRequest {
  version: string
  affectedEndpoints?: string[]
  deprecationDate: string
  removalDate?: string
  migrationGuide?: string
  notice: string
}

export interface VersionLifecycle {
  version: string
  status: 'active' | 'deprecated' | 'sunset'
  releaseDate?: string
  deprecationDate?: string
  sunsetDate?: string
  lifecycleStages?: Array<{
    stage: string
    date: string
    description?: string
  }>
}

export interface CompatibilityGuarantees {
  guarantees: string
  backwardCompatibility?: {
    policy: string
    duration?: string
  }
  breakingChanges?: {
    policy: string
    noticePeriod?: string
  }
  versionSupport?: {
    current: string[]
    supported: string[]
    deprecated: string[]
  }
}

// API Gateway Types
export interface ApiTier {
  tier: 'free' | 'basic' | 'premium' | 'enterprise'
  rateLimit?: {
    requestsPerMinute?: number
    requestsPerHour?: number
    requestsPerDay?: number
  }
  features?: string[]
  userId?: string
}

export interface ApiUsage {
  userId?: string
  period?: {
    start: string
    end: string
  }
  totalRequests?: number
  requestsByEndpoint?: Array<{
    endpoint: string
    count: number
  }>
  rateLimitUsage?: {
    used: number
    limit: number
    percentage: number
  }
  timeSeries?: Array<{
    date: string
    requests: number
  }>
}

export interface ApiVersionInfo {
  version: string
  status: 'active' | 'deprecated' | 'sunset'
  releaseDate?: string
  deprecationDate?: string
  removalDate?: string
  endpoints?: string[]
  changelog?: string
}

export interface DeprecateVersionRequest {
  version: string
  deprecationDate?: string
  removalDate?: string
  notice?: string
}

// Batch Request Types
export interface BatchRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  path: string
  body?: any
}

export interface BatchResponse {
  status: number
  body: any
}

export interface BatchRequestPayload {
  requests: BatchRequest[]
}

export interface BatchResponseData {
  data: BatchResponse[]
}

export interface ActivityLog {
  id: string
  action: string
  user: string
  details?: any
  createdAt: string
}

export interface Notification {
  id: string
  title?: string
  message: string
  type?: 'info' | 'warning' | 'error' | 'success'
  read: boolean
  createdAt: string
}

export interface SavedFilter {
  id: string
  name: string
  type: string
  criteria: any
  createdAt: string
}

export interface CronJob {
  id: string
  name: string
  schedule: string
  enabled: boolean
  lastRun?: string
  nextRun?: string
}

export interface Webhook {
  id: string
  url: string
  event: string
  status: 'active' | 'inactive'
  createdAt: string
}

// Request Types
export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  isAdmin?: boolean
}

export interface CreateProductRequest {
  name: string
  description?: string
  price: number
  compareAtPrice?: number
  originalPrice?: number
  sku: string
  slug?: string
  stock?: number
  images?: string[]
  categoryId?: string
  status?: 'active' | 'inactive' | 'draft'
  tags?: string[]
  badges?: string[]
  specifications?: any
  certifications?: string[]
  warrantyInfo?: string
  returnPolicy?: any
  refundPolicy?: any
  shippingPolicy?: any
  exchangePolicy?: any
  cancellationPolicy?: any
  careInstructions?: string
  countryOfOrigin?: string
  manufacturerInfo?: any
  brand?: string
  modelNumber?: string
  weightDimensions?: any
  minOrderQuantity?: number
  maxOrderQuantity?: number
}

export interface AddToCartRequest {
  productId?: string
  variantId?: string
  quantity: number
  serviceId?: string
}

export interface CreateOrderRequest {
  shippingAddressId: string
  billingAddressId?: string
  paymentMethod?: string
  couponCode?: string
}

export interface ReturnOrderRequest {
  reason: string
  items?: string[]
}

// Filter and Query Types
export interface ProductFilters {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  rating?: number
  search?: string
  sortBy?: 'price' | 'rating' | 'name' | 'createdAt'
  sortOrder?: 'asc' | 'desc'
  page?: number
  limit?: number
}

export interface OrderFilters {
  status?: string
  dateFrom?: string
  dateTo?: string
  userId?: string
  page?: number
  limit?: number
}

// Advanced Admin Types
export interface OrderNote {
  id: string
  orderId: string
  note: string
  isInternal: boolean
  createdAt: string
  updatedAt?: string
  createdBy?: string
  createdByName?: string
}

export interface ScheduledDelivery {
  orderId: string
  scheduledDate: string
  timeSlot?: string
  deliveryInstructions?: string
  recipientName?: string
  recipientPhone?: string
}

export interface OrderSplit {
  id: string
  orderId: string
  splitType: 'payment' | 'shipment' | 'fulfillment'
  items: Array<{
    itemId: string
    quantity: number
  }>
  status: string
  createdAt: string
}

export interface OrderTask {
  id: string
  orderId: string
  assignedTo: string
  assignedToName?: string
  taskType: 'REVIEW' | 'FULFILLMENT' | 'CUSTOMER_SERVICE' | 'REFUND' | 'CUSTOM'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  status?: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  updatedAt?: string
  completedAt?: string
}

export interface Activity {
  id: string
  action: string
  user: string
  userName?: string
  resource: string
  resourceId?: string
  metadata?: any
  createdAt: string
}

export interface AdminNotification {
  id: string
  title?: string
  message: string
  type?: string
  read: boolean
  createdAt: string
  updatedAt?: string
}

export interface SavedFilter {
  id: string
  name: string
  resource: string
  filters: any
  createdAt: string
  updatedAt?: string
}

// Export all types
export type {
  ApiResponse,
  ApiError,
  PaginatedResponse,
  User,
  Address,
  Product,
  Category,
  Service,
  ServiceType,
  CartItem,
  Cart,
  Order,
  OrderItem,
  PaymentGateway,
  PaymentIntent,
  Review,
  WishlistItem,
  Coupon,
  Notification,
  AnalyticsDashboard,
  LoginRequest,
  RegisterRequest,
  CreateProductRequest,
  AddToCartRequest,
  CreateOrderRequest,
  ReturnOrderRequest,
  ProductFilters,
  OrderFilters,
  OrderNote,
  OrderTask,
  Activity,
  AdminNotification,
  SavedFilter,
  DigitalProduct,
  Subscription,
  CreateSubscriptionRequest,
  PreOrder,
  CreatePreOrderRequest,
  GiftCard,
  PurchaseGiftCardRequest,
  RedeemGiftCardRequest,
  VersioningStrategy,
  DeprecationPolicy,
  DeprecationNotice,
  CreateDeprecationNoticeRequest,
  VersionLifecycle,
  CompatibilityGuarantees,
  ApiTier,
  ApiUsage,
  ApiVersionInfo,
  DeprecateVersionRequest,
  BatchRequest,
  BatchResponse,
  BatchRequestPayload,
  BatchResponseData,
  // Compliance Types
  LegalDocument,
  DocumentAcceptance,
  PCIComplianceStatus,
  TaxCalculationRequest,
  TaxCalculationResponse,
  NexusLocation,
  // Customer Experience Types
  ProductQuestion,
  SizeGuide,
  ProductVideo,
  SocialProof,
  WaitlistItem,
  ProductAlert,
  // Customer Service Enhanced Types
  OrderTracking,
  KnowledgeBaseArticle,
  TroubleshootingGuide,
  VideoTutorial,
  CallbackRequest,
  // Disaster Recovery Types
  RPORTO,
  DisasterRecoveryPlan,
  Backup,
  BackupSchedule,
  RestoreDrill,
  // Feature Flags Types
  FeatureFlag,
  FeatureFlagRule,
  FeatureFlagOverride,
  FeatureFlagStats,
  // Gifts Types
  GiftRegistry,
  GiftRegistryItem,
  GiftOrder,
  GiftTracking,
  // Internationalization Types
  RegionalPrice,
  RegionalAvailability,
  RegionalPaymentMethod,
  RegionalShippingCarrier,
  RegionalCompliance,
  Store,
  // Job Queue Types
  JobStats,
  Job,
  // Language Types
  Language,
  Translation,
  // Loyalty Types
  LoyaltyPoints,
  LoyaltyTier,
  LoyaltyReward,
  ReferralCode,
  // Marketing Types
  FlashSale,
  Deal,
  ProductBundle,
  AbandonedCart,
  // Media Types
  MediaUpload,
  MediaImage,
  ImageVariant,
  // Migration Types
  Migration,
  CompatibilityCheck,
  // Mobile Types
  AppVersion,
  DeviceRegistration,
  DeepLink,
  MobilePayment,
  PushNotification,
  // Monitoring Types
  SystemHealth,
  SystemMetrics,
  // Tenant Types
  Tenant,
  TenantStats,
  // Notification Preferences
  NotificationPreferences,
  // Observability Types
  SLADefinition,
  SLODefinition,
  SLOStatus,
  AlertThreshold,
  SLOReport,
  // Integration Types
  Integration,
  // Order Enhancement Types
  ScheduledDelivery,
  OrderSplit,
  // Export types from API endpoint files
  // Note: Some types are defined in endpoint files and should be imported directly
  // Product Management Types
  // (Using interfaces from product-management.ts)
  // Search Types
  // (Using interfaces from search.ts)
  // Security Types
  // (Using interfaces from security.ts)
  // Shipping Types
  // (Using interfaces from shipping-carriers.ts and shipping.ts)
  // Social Commerce Types
  // (Using interfaces from social.ts)
  // Support Types
  // (Using interfaces from support.ts)
  // Wallet Types
  // (Using interfaces from wallet.ts)
  // Vendor Types
  // (Using interfaces from vendor.ts)
}

// Logistics Types
export enum LogisticsProviderType {
  SHIPROCKET = 'SHIPROCKET',
  DELHIVERY = 'DELHIVERY',
  CLICKPOST = 'CLICKPOST',
  VAMASHIP = 'VAMASHIP',
  SHIPJEE = 'SHIPJEE',
  INDISPEED = 'INDISPEED',
  ULIP = 'ULIP'
}

export enum ShipmentStatus {
  CREATED = 'created',
  READY = 'ready',
  PICKED_UP = 'picked_up',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  RETURNED = 'returned'
}

export interface LogisticsProviderConfig {
  // Shiprocket
  email?: string
  password?: string
  apiKey?: string
  // Delhivery
  clientId?: string
  clientSecret?: string
  // ClickPost
  secretKey?: string
  // Common
  environment?: 'production' | 'sandbox'
  [key: string]: any // Allow additional provider-specific config
}

export interface LogisticsProvider {
  id: string
  name: string
  type: LogisticsProviderType
  config: LogisticsProviderConfig
  webhookUrl?: string
  webhookSecret?: string
  /** URL to paste in the provider's webhook settings (e.g. Shiprocket dashboard). Returned by API on GET. */
  incomingWebhookUrl?: string | null
  supportedRegions?: string[]
  supportedServices?: string[]
  isActive: boolean
  isDefault: boolean
  priority: number
  createdAt: string
  updatedAt: string
}

export interface LogisticsAddress {
  name: string
  address: string
  city: string
  state: string
  pincode: string
  phone: string
  country?: string
}

export interface ShipmentDimensions {
  length: number
  width: number
  height: number
}

export interface TrackingEvent {
  timestamp: string
  location: string
  status: string
  description: string
}

export interface ShipmentTracking {
  trackingNumber: string
  status: ShipmentStatus
  providerStatus: string
  events: TrackingEvent[]
  estimatedDelivery?: string
  currentLocation?: {
    city: string
    state: string
    pincode: string
  }
}

export interface ShippingRate {
  provider: LogisticsProviderType
  courierCompanyId?: number
  courierName: string
  rate: number
  estimatedDays: number
  codAvailable?: boolean
}

export interface RateComparison {
  provider: LogisticsProviderType
  providerName: string
  rates: ShippingRate[]
}

export interface RateComparisonResponse {
  comparisons: RateComparison[]
  errors: any[]
}

export interface LogisticsShipment {
  id: string
  orderId: string
  providerId: string
  providerShipmentId?: string
  awbNumber: string
  trackingNumber: string
  status: ShipmentStatus
  providerStatus: string
  rate: number
  labelUrl?: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}

export interface CreateShipmentRequest {
  orderId: string
  pickup: LogisticsAddress
  delivery: LogisticsAddress
  weight: number
  dimensions?: ShipmentDimensions
  codAmount?: number
  paymentMethod?: string
}

export interface CreateReturnRequest {
  orderId: string
  providerId?: string
  pickup: LogisticsAddress
  delivery: LogisticsAddress
  items: Array<{
    name: string
    sku: string
    quantity: number
    price: number
  }>
  total: number
}

export interface SchedulePickupRequest {
  pickupDate: string
  pickupTime?: string
}

export interface CancelShipmentRequest {
  reason?: string
}

