# API Reference Documentation

Complete reference for all API functions available in the Ecommerce Frontend application.

**Last Updated**: February 2025

## Table of Contents

1. [Core APIs](#core-apis)
2. [User Features](#user-features)
3. [Order & Payment Enhancements](#order--payment-enhancements)
4. [Product Management](#product-management)
5. [Search & Discovery](#search--discovery)
6. [Shipping & Tax](#shipping--tax)
7. [Security](#security)
8. [Social & Commerce](#social--commerce)
9. [Subscriptions](#subscriptions)
10. [Support](#support)
11. [Vendor](#vendor)
12. [Wallet](#wallet)
13. [Webhooks](#webhooks)
14. [Admin APIs](#admin-apis)
15. [Advanced Admin Features](#advanced-admin-features)
16. [Content & Media](#content--media)
17. [Compliance](#compliance)
18. [Customer Experience](#customer-experience)
19. [CRM](#crm)
20. [Currency](#currency)
21. [Gifts](#gifts)
22. [Internationalization](#internationalization)
23. [Integrations](#integrations)
24. [Languages](#languages)
25. [Marketing](#marketing)
26. [Mobile](#mobile)
27. [Multi-Tenant](#multi-tenant)
28. [Operations](#operations)
29. [API Management](#api-management)
30. [Inventory](#inventory)
31. [System & Infrastructure](#system--infrastructure)
32. [Logistics](#logistics)

---

## Core APIs

### authApi

**File**: `src/api/endpoints/auth.ts`

#### Methods

##### `login(credentials: LoginRequest)`
- **Parameters**: 
  - `credentials: LoginRequest` - Login credentials (email, password)
- **Returns**: `Promise<ApiResponse<{ token: string; refreshToken: string; user: User }>>`
- **Description**: Authenticate user and get JWT token
- **Example**:
  ```typescript
  const response = await authApi.login({ email: 'user@example.com', password: 'password' })
  if (response.success) {
    // Handle success
  }
  ```

##### `register(userData: RegisterRequest)`
- **Parameters**: `userData: RegisterRequest` - User registration data
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Register a new user (Admin only)

##### `verifyEmail(token: string)`
- **Parameters**: `token: string` - Email verification token
- **Returns**: `Promise<ApiResponse>`
- **Description**: Verify user email address

##### `resendVerification(email: string)`
- **Parameters**: `email: string` - User email address
- **Returns**: `Promise<ApiResponse>`
- **Description**: Resend email verification

##### `forgotPassword(email: string)`
- **Parameters**: `email: string` - User email address
- **Returns**: `Promise<ApiResponse>`
- **Description**: Request password reset

##### `resetPassword(token: string, password: string)`
- **Parameters**: 
  - `token: string` - Password reset token
  - `password: string` - New password
- **Returns**: `Promise<ApiResponse>`
- **Description**: Reset user password

##### `refresh(refreshToken: string)`
- **Parameters**: `refreshToken: string` - Refresh token
- **Returns**: `Promise<ApiResponse<{ token: string; refreshToken: string }>>`
- **Description**: Refresh JWT token

##### `changePassword(currentPassword: string, newPassword: string)`
- **Parameters**: 
  - `currentPassword: string` - Current password
  - `newPassword: string` - New password
- **Returns**: `Promise<ApiResponse>`
- **Description**: Change user password

##### `getProfile()`
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Get current user profile

##### `updateProfile(userData: Partial<User>)`
- **Parameters**: `userData: Partial<User>` - User data to update
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Update user profile

##### `getAddresses()`
- **Returns**: `Promise<ApiResponse<Address[]>>`
- **Description**: Get user addresses

##### `createAddress(address: Omit<Address, 'id' | 'userId' | 'createdAt' | 'updatedAt'>)`
- **Parameters**: `address` - Address data
- **Returns**: `Promise<ApiResponse<Address>>`
- **Description**: Create new address

##### `getDefaultAddress()`
- **Returns**: `Promise<ApiResponse<Address>>`
- **Description**: Get default address

##### `getAddress(id: string)`
- **Parameters**: `id: string` - Address ID
- **Returns**: `Promise<ApiResponse<Address>>`
- **Description**: Get address by ID

##### `updateAddress(id: string, address: Partial<Address>)`
- **Parameters**: 
  - `id: string` - Address ID
  - `address: Partial<Address>` - Address data to update
- **Returns**: `Promise<ApiResponse<Address>>`
- **Description**: Update address

##### `deleteAddress(id: string)`
- **Parameters**: `id: string` - Address ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete address

##### `setDefaultAddress(id: string)`
- **Parameters**: `id: string` - Address ID
- **Returns**: `Promise<ApiResponse<Address>>`
- **Description**: Set address as default

---

### productsApi

**File**: `src/api/endpoints/products.ts`

#### Methods

##### `getProducts(filters?: ProductFilters)`
- **Parameters**: `filters?: ProductFilters` - Optional product filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Product>>>`
- **Description**: Get products list with pagination

##### `searchProducts(query: string, filters?: ProductFilters)`
- **Parameters**: 
  - `query: string` - Search query
  - `filters?: ProductFilters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Product>>>`
- **Description**: Search products

##### `getProduct(id: string)`
- **Parameters**: `id: string` - Product ID
- **Returns**: `Promise<ApiResponse<Product>>`
- **Description**: Get product by ID

##### `createProduct(product: CreateProductRequest)`
- **Parameters**: `product: CreateProductRequest` - Product data
- **Returns**: `Promise<ApiResponse<Product>>`
- **Description**: Create new product (Admin)

##### `updateProduct(id: string, product: Partial<CreateProductRequest>)`
- **Parameters**: 
  - `id: string` - Product ID
  - `product: Partial<CreateProductRequest>` - Product data to update
- **Returns**: `Promise<ApiResponse<Product>>`
- **Description**: Update product (Admin)

##### `deleteProduct(id: string)`
- **Parameters**: `id: string` - Product ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete product (Admin)

##### `getCategories()`
- **Returns**: `Promise<ApiResponse<Category[]>>`
- **Description**: Get all categories

##### `getCategory(id: string)`
- **Parameters**: `id: string` - Category ID
- **Returns**: `Promise<ApiResponse<Category>>`
- **Description**: Get category by ID

##### `createCategory(category: Omit<Category, 'id' | 'createdAt' | 'updatedAt'>)`
- **Parameters**: `category` - Category data
- **Returns**: `Promise<ApiResponse<Category>>`
- **Description**: Create category (Admin)

##### `updateCategory(id: string, category: Partial<Category>)`
- **Parameters**: 
  - `id: string` - Category ID
  - `category: Partial<Category>` - Category data to update
- **Returns**: `Promise<ApiResponse<Category>>`
- **Description**: Update category (Admin)

##### `deleteCategory(id: string)`
- **Parameters**: `id: string` - Category ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete category (Admin)

##### `uploadProductImages(productId: string, files: File[], setAsPrimary?: number)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `files: File[]` - Image files
  - `setAsPrimary?: number` - Index of primary image
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Upload product images

##### `reorderProductImages(productId: string, imageIds: string[])`
- **Parameters**: 
  - `productId: string` - Product ID
  - `imageIds: string[]` - Ordered image IDs
- **Returns**: `Promise<ApiResponse>`
- **Description**: Reorder product images

##### `setPrimaryImage(productId: string, imageId: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Set primary product image

##### `deleteProductImage(productId: string, imageId: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete product image

---

### cartApi

**File**: `src/api/endpoints/cart.ts`

#### Methods

##### `getCart()`
- **Returns**: `Promise<ApiResponse<Cart>>`
- **Description**: Get current user's cart

##### `addItem(item: AddToCartRequest)`
- **Parameters**: `item: AddToCartRequest` - Cart item data
- **Returns**: `Promise<ApiResponse<Cart>>`
- **Description**: Add item to cart

##### `updateItem(itemId: string, quantity: number)`
- **Parameters**: 
  - `itemId: string` - Cart item ID
  - `quantity: number` - New quantity
- **Returns**: `Promise<ApiResponse<Cart>>`
- **Description**: Update cart item quantity

##### `removeItem(itemId: string)`
- **Parameters**: `itemId: string` - Cart item ID
- **Returns**: `Promise<ApiResponse<Cart>>`
- **Description**: Remove item from cart

##### `clearCart()`
- **Returns**: `Promise<ApiResponse>`
- **Description**: Clear entire cart

##### `calculate()`
- **Returns**: `Promise<ApiResponse<Cart>>`
- **Description**: Calculate cart totals

---

### ordersApi

**File**: `src/api/endpoints/orders.ts`

#### Methods

##### `createOrder(orderData: CreateOrderRequest)`
- **Parameters**: `orderData: CreateOrderRequest` - Order data (shippingAddressId, billingAddressId required; paymentMethod optional, e.g. cod, stripe)
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Create order from cart

##### `getOrders(filters?: { page?: number; limit?: number; status?: string })`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Order>>>`
- **Description**: Get user's orders

##### `getOrder(id: string)`
- **Parameters**: `id: string` - Order ID
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Get order details

##### `cancelOrder(id: string)`
- **Parameters**: `id: string` - Order ID
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Cancel order

##### `returnOrder(id: string, payload: ReturnOrderRequest)`
- **Parameters**: 
  - `id: string` - Order ID
  - `payload: { reason: string; items?: string[] }` - Reason required; optional items (order item IDs) for partial return
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Request order return

##### `trackOrder(id: string)`
- **Parameters**: `id: string` - Order ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get order tracking information

---

### paymentsApi

**File**: `src/api/endpoints/payments.ts`

#### Methods

##### `getGateways()`
- **Returns**: `Promise<ApiResponse<PaymentGateway[]>>`
- **Description**: Get available payment gateways

##### `createIntent(orderId: string, amount: number, currency?: string)`
- **Parameters**: 
  - `orderId: string` - Order ID
  - `amount: number` - Payment amount
  - `currency?: string` - Currency code (default: 'USD')
- **Returns**: `Promise<ApiResponse<PaymentIntent>>`
- **Description**: Create payment intent

##### `confirmPayment(paymentIntentId: string, paymentMethod: any)`
- **Parameters**: 
  - `paymentIntentId: string` - Payment intent ID
  - `paymentMethod: any` - Payment method data
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Confirm payment

##### `getPayment(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get payment status for order

##### `getPaymentHistory(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<any[]>>`
- **Description**: Get payment history for order

---

## User Features

### reviewsApi

**File**: `src/api/endpoints/reviews.ts`

#### Methods

##### `getProductReviews(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Review>>>`
- **Description**: Get reviews for a product

##### `createReview(review: Omit<Review, 'id' | 'userId' | 'user' | 'createdAt' | 'updatedAt' | 'helpfulCount'>)`
- **Parameters**: `review` - Review data
- **Returns**: `Promise<ApiResponse<Review>>`
- **Description**: Create a new product review

##### `updateReview(id: string, review: Partial<Review>)`
- **Parameters**: 
  - `id: string` - Review ID
  - `review: Partial<Review>` - Review data to update
- **Returns**: `Promise<ApiResponse<Review>>`
- **Description**: Update existing review

##### `deleteReview(id: string)`
- **Parameters**: `id: string` - Review ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete review

##### `markHelpful(id: string)`
- **Parameters**: `id: string` - Review ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Mark review as helpful

##### `reportReview(id: string, reason: string)`
- **Parameters**: 
  - `id: string` - Review ID
  - `reason: string` - Report reason
- **Returns**: `Promise<ApiResponse>`
- **Description**: Report inappropriate review

---

### wishlistApi

**File**: `src/api/endpoints/wishlist.ts`

#### Methods

##### `getWishlist()`
- **Returns**: `Promise<ApiResponse<WishlistItem[]>>`
- **Description**: Get user's wishlist

##### `addToWishlist(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<WishlistItem>>`
- **Description**: Add product to wishlist

##### `removeFromWishlist(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Remove product from wishlist

##### `checkWishlist(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<{ inWishlist: boolean }>>`
- **Description**: Check if product is in wishlist

---

### couponsApi

**File**: `src/api/endpoints/coupons.ts`

#### Methods

##### `getCoupons()`
- **Returns**: `Promise<ApiResponse<Coupon[]>>`
- **Description**: Get all available coupons

##### `getCoupon(code: string)`
- **Parameters**: `code: string` - Coupon code
- **Returns**: `Promise<ApiResponse<Coupon>>`
- **Description**: Get coupon by code

##### `validateCoupon(code: string, amount: number)`
- **Parameters**: 
  - `code: string` - Coupon code
  - `amount: number` - Order amount
- **Returns**: `Promise<ApiResponse<{ valid: boolean; discount: number }>>`
- **Description**: Validate coupon and get discount amount

##### `getMyCoupons()`
- **Returns**: `Promise<ApiResponse<Coupon[]>>`
- **Description**: Get user's available coupons

##### `createCoupon(couponData: any)` (Admin)
- **Parameters**: `couponData` - Coupon data
- **Returns**: `Promise<ApiResponse<Coupon>>`
- **Description**: Create new coupon

##### `updateCoupon(code: string, couponData: Partial<Coupon>)` (Admin)
- **Parameters**: 
  - `code: string` - Coupon code
  - `couponData: Partial<Coupon>` - Coupon data to update
- **Returns**: `Promise<ApiResponse<Coupon>>`
- **Description**: Update coupon

##### `deleteCoupon(code: string)` (Admin)
- **Parameters**: `code: string` - Coupon code
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete coupon

---

### notificationsApi

**File**: `src/api/endpoints/notifications.ts`

#### Methods

##### `getNotifications(filters?: { page?: number; limit?: number; unreadOnly?: boolean })`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Notification>>>`
- **Description**: Get user notifications

##### `markAsRead(id: string)`
- **Parameters**: `id: string` - Notification ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Mark notification as read

##### `markAllAsRead()`
- **Returns**: `Promise<ApiResponse>`
- **Description**: Mark all notifications as read

##### `deleteNotification(id: string)`
- **Parameters**: `id: string` - Notification ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete notification

##### `getUnreadCount()`
- **Returns**: `Promise<ApiResponse<{ count: number }>>`
- **Description**: Get unread notification count

##### `updatePreferences(preferences: NotificationPreferences)`
- **Parameters**: `preferences: NotificationPreferences` - Notification preferences
- **Returns**: `Promise<ApiResponse>`
- **Description**: Update notification preferences

---

### loyaltyApi

**File**: `src/api/endpoints/loyalty.ts`

#### Methods

##### `getPoints()`
- **Returns**: `Promise<ApiResponse<{ points: number; tier: string }>>`
- **Description**: Get user's loyalty points and tier

##### `getTiers()`
- **Returns**: `Promise<ApiResponse<LoyaltyTier[]>>`
- **Description**: Get all loyalty tiers

##### `getRewards()`
- **Returns**: `Promise<ApiResponse<Reward[]>>`
- **Description**: Get available rewards

##### `redeemReward(rewardId: string)`
- **Parameters**: `rewardId: string` - Reward ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Redeem reward with points

##### `getReferral()`
- **Returns**: `Promise<ApiResponse<{ code: string; count: number }>>`
- **Description**: Get user's referral code and count

##### `applyReferral(code: string)`
- **Parameters**: `code: string` - Referral code
- **Returns**: `Promise<ApiResponse>`
- **Description**: Apply referral code

---

## Shipping & Tax

### shippingApi

**File**: `src/api/endpoints/shipping.ts`

#### Methods

##### `getShippingMethods()`
- **Returns**: `Promise<ApiResponse<ShippingMethod[]>>`
- **Description**: Get available shipping methods

##### `calculateShipping(request: { address: any; items: Array<{ weight: number; dimensions?: any }> })`
- **Parameters**: `request` - Shipping calculation request
- **Returns**: `Promise<ApiResponse<ShippingCalculation>>`
- **Description**: Calculate shipping costs

---

### taxApi

**File**: `src/api/endpoints/tax.ts`

#### Methods

##### `calculateTax(request: TaxCalculationRequest)`
- **Parameters**: `request: TaxCalculationRequest` - Tax calculation request
- **Returns**: `Promise<ApiResponse<TaxCalculationResponse>>`
- **Description**: Calculate tax for order

##### `getTaxRates(region?: string)`
- **Parameters**: `region?: string` - Optional region filter
- **Returns**: `Promise<ApiResponse<TaxRate[]>>`
- **Description**: Get tax rates by region

---

### shippingCarriersApi

**File**: `src/api/endpoints/shipping-carriers.ts`

#### Methods

##### `trackShipment(trackingNumber: string)`
- **Parameters**: `trackingNumber: string` - Shipment tracking number
- **Returns**: `Promise<ApiResponse<ShipmentTracking>>`
- **Description**: Track shipment by tracking number

##### `getCarrierRates(request: { from: any; to: any; weight: number; dimensions?: any })`
- **Parameters**: `request` - Rate request with origin, destination, weight, and optional dimensions
- **Returns**: `Promise<ApiResponse<CarrierRate[]>>`
- **Description**: Get shipping rates from multiple carriers

##### `createShippingLabel(request: { orderId: string; carrier: string; service: string; from: any; to: any })` (Admin)
- **Parameters**: `request` - Label creation request
- **Returns**: `Promise<ApiResponse<ShippingLabel>>`
- **Description**: Create shipping label for order

---

## Search & Discovery

### searchApi

**File**: `src/api/endpoints/search.ts`

#### Methods

##### `advancedSearch(filters: AdvancedSearchRequest)`
- **Parameters**: `filters: AdvancedSearchRequest` - Search filters
- **Returns**: `Promise<ApiResponse<AdvancedSearchResult>>`
- **Description**: Advanced product search with filters

##### `getRecommendations(productId?: string)`
- **Parameters**: `productId?: string` - Optional product ID
- **Returns**: `Promise<ApiResponse<ProductRecommendation[]>>`
- **Description**: Get product recommendations

##### `getRecentlyViewed()`
- **Returns**: `Promise<ApiResponse<Product[]>>`
- **Description**: Get recently viewed products

##### `saveSearch(search: Partial<SavedSearch>)`
- **Parameters**: `search: Partial<SavedSearch>` - Search to save
- **Returns**: `Promise<ApiResponse<SavedSearch>>`
- **Description**: Save search query

##### `getSavedSearches()`
- **Returns**: `Promise<ApiResponse<SavedSearch[]>>`
- **Description**: Get saved searches

##### `deleteSavedSearch(id: string)`
- **Parameters**: `id: string` - Saved search ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete saved search

---

### searchIndexApi

**File**: `src/api/endpoints/search-index.ts` (Admin)

#### Methods

##### `search(query: string, filters?: any)`
- **Parameters**: 
  - `query: string` - Search query
  - `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Product>>>`
- **Description**: Search products using search index

##### `indexProduct(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<IndexResult>>`
- **Description**: Index a single product

##### `batchIndexProducts(productIds: string[])`
- **Parameters**: `productIds: string[]` - Array of product IDs
- **Returns**: `Promise<ApiResponse<IndexResult>>`
- **Description**: Index multiple products

##### `reindexAll()`
- **Returns**: `Promise<ApiResponse<IndexResult>>`
- **Description**: Reindex all products

##### `reindexCategory(categoryId: string)`
- **Parameters**: `categoryId: string` - Category ID
- **Returns**: `Promise<ApiResponse<IndexResult>>`
- **Description**: Reindex all products in a category

---

## Order & Payment Enhancements

### orderEnhancementsApi

**File**: `src/api/endpoints/order-enhancements.ts`

#### Methods

##### `addOrderNote(note: Partial<OrderNote>)`
- **Parameters**: `note: Partial<OrderNote>` - Order note data
- **Returns**: `Promise<ApiResponse<OrderNote>>`
- **Description**: Add note to order

##### `getOrderNotes(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<OrderNote[]>>`
- **Description**: Get all notes for an order

##### `scheduleDelivery(request: ScheduledDelivery)`
- **Parameters**: `request: ScheduledDelivery` - Delivery scheduling data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Schedule order delivery

##### `getOrderSplits(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<OrderSplit[]>>`
- **Description**: Get order splits

---

### orderStateApi

**File**: `src/api/endpoints/order-state.ts` (Admin)

#### Methods

##### `transitionOrderState(orderId: string, newState: string, reason?: string)`
- **Parameters**: 
  - `orderId: string` - Order ID
  - `newState: string` - Target state (e.g. PAID, PACKED)
  - `reason?: string` - Optional reason (sent as metadata.reason)
- **Returns**: `Promise<ApiResponse>`
- **Description**: Transition order to new state (body: newState, metadata optional)

##### `rollbackOrderState(orderId: string, previousState: string)`
- **Parameters**: 
  - `orderId: string` - Order ID
  - `previousState: string` - State to roll back to (required)
- **Returns**: `Promise<ApiResponse>`
- **Description**: Rollback order to previous state (body: previousState)

##### `getOrderStateHistory(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<OrderStateHistory[]>>`
- **Description**: Get order state transition history

##### `getAvailableTransitions(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<AvailableTransition[]>>`
- **Description**: Get available state transitions for order

---

## Product Management

### advancedProductsApi

**File**: `src/api/endpoints/advanced-products.ts`

#### Methods

##### `getDigitalProduct(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<DigitalProduct>>`
- **Description**: Get digital product details

##### `downloadDigitalProduct(productId: string, orderId: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `orderId: string` - Order ID
- **Returns**: `Promise<Blob>`
- **Description**: Download digital product file

##### `getSubscriptions()`
- **Returns**: `Promise<ApiResponse<Subscription[]>>`
- **Description**: Get available subscription products

##### `createSubscription(subscription: CreateSubscriptionRequest)`
- **Parameters**: `subscription: CreateSubscriptionRequest` - Subscription data
- **Returns**: `Promise<ApiResponse<Subscription>>`
- **Description**: Create subscription product

##### `createPreOrder(preOrder: CreatePreOrderRequest)`
- **Parameters**: `preOrder: CreatePreOrderRequest` - Pre-order data
- **Returns**: `Promise<ApiResponse<PreOrder>>`
- **Description**: Create pre-order

##### `getPreOrders()`
- **Returns**: `Promise<ApiResponse<PreOrder[]>>`
- **Description**: Get user's pre-orders

##### `getGiftCards()`
- **Returns**: `Promise<ApiResponse<GiftCard[]>>`
- **Description**: Get available gift cards

##### `purchaseGiftCard(request: PurchaseGiftCardRequest)`
- **Parameters**: `request: PurchaseGiftCardRequest` - Gift card purchase data
- **Returns**: `Promise<ApiResponse<GiftCard>>`
- **Description**: Purchase gift card

##### `redeemGiftCard(request: RedeemGiftCardRequest)`
- **Parameters**: `request: RedeemGiftCardRequest` - Gift card redemption data
- **Returns**: `Promise<ApiResponse<{ amount: number; balance?: number }>>`
- **Description**: Redeem gift card

---

### productManagementApi

**File**: `src/api/endpoints/product-management.ts`

#### Methods

##### `getFeaturedProducts()`
- **Returns**: `Promise<ApiResponse<FeaturedProducts>>`
- **Description**: Get featured products

##### `setFeaturedProducts(productIds: string[])` (Admin)
- **Parameters**: `productIds: string[]` - Array of product IDs
- **Returns**: `Promise<ApiResponse<FeaturedProducts>>`
- **Description**: Set featured products

##### `getCollections()`
- **Returns**: `Promise<ApiResponse<ProductCollection[]>>`
- **Description**: Get product collections

##### `getProductSpecifications(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<ProductSpecification[]>>`
- **Description**: Get product specifications

##### `updateProductSpecifications(productId: string, specs: ProductSpecification[])` (Admin)
- **Parameters**: 
  - `productId: string` - Product ID
  - `specs: ProductSpecification[]` - Specifications array
- **Returns**: `Promise<ApiResponse<ProductSpecification[]>>`
- **Description**: Update product specifications

---

### productManagementAdvancedApi

**File**: `src/api/endpoints/product-management-advanced.ts` (Admin)

#### Methods

##### `getFeatured()`
- **Returns**: `Promise<ApiResponse<Product[]>>`
- **Description**: Get featured products

##### `getCollections()`
- **Returns**: `Promise<ApiResponse<any[]>>`
- **Description**: Get product collections

##### `getSpecifications(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get product specifications

##### `updateSpecifications(productId: string, specifications: any)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `specifications: any` - Specifications data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Update product specifications

##### `setFeatured(productIds: string[])`
- **Parameters**: `productIds: string[]` - Array of product IDs
- **Returns**: `Promise<ApiResponse>`
- **Description**: Set featured products

---

### paymentsAdvancedApi

**File**: `src/api/endpoints/payments-advanced.ts`

#### Methods

##### `createPaymentLink(data: { orderId?: string; amount: number; description?: string; expiresAt?: string })`
- **Parameters**: `data` - Payment link data
- **Returns**: `Promise<ApiResponse<PaymentLink>>`
- **Description**: Create payment link

##### `savePaymentMethod(data: { type: string; token: string; metadata?: any })`
- **Parameters**: `data` - Payment method data
- **Returns**: `Promise<ApiResponse<SavedPaymentMethod>>`
- **Description**: Save payment method for future use

##### `getSavedPaymentMethods()`
- **Returns**: `Promise<ApiResponse<SavedPaymentMethod[]>>`
- **Description**: Get user's saved payment methods

##### `routePayment(data: PaymentRoute)` (Admin)
- **Parameters**: `data: PaymentRoute` - Payment routing data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Route payment to specific gateway

##### `retryPayment(paymentId: string)` (Admin)
- **Parameters**: `paymentId: string` - Payment ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Retry failed payment

##### `splitPayment(data: SplitPayment)` (Admin)
- **Parameters**: `data: SplitPayment` - Split payment data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Split payment across multiple recipients

##### `reconcilePayments(filters?: any)` (Admin)
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<ReconciliationReport>>`
- **Description**: Reconcile payments

##### `recordChargeback(paymentId: string, data: Chargeback)` (Admin)
- **Parameters**: 
  - `paymentId: string` - Payment ID
  - `data: Chargeback` - Chargeback data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Record chargeback

---

## Security

### securityApi

**File**: `src/api/endpoints/security.ts`

#### Methods

##### `setup2FA()`
- **Returns**: `Promise<ApiResponse<TwoFactorSetup>>`
- **Description**: Setup two-factor authentication

##### `verify2FASetup(token: string, code: string)`
- **Parameters**: 
  - `token: string` - Setup token
  - `code: string` - Verification code
- **Returns**: `Promise<ApiResponse>`
- **Description**: Verify and enable 2FA

##### `disable2FA(password: string)`
- **Parameters**: `password: string` - User password
- **Returns**: `Promise<ApiResponse>`
- **Description**: Disable 2FA

##### `getTrustedDevices()`
- **Returns**: `Promise<ApiResponse<TrustedDevice[]>>`
- **Description**: Get trusted devices

##### `removeTrustedDevice(deviceId: string)`
- **Parameters**: `deviceId: string` - Device ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Remove trusted device

##### `getActiveSessions()`
- **Returns**: `Promise<ApiResponse<ActiveSession[]>>`
- **Description**: Get active sessions

##### `revokeAllSessions()`
- **Returns**: `Promise<ApiResponse>`
- **Description**: Revoke all sessions except current

##### `revokeSession(sessionId: string)`
- **Parameters**: `sessionId: string` - Session ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Revoke specific session

##### `getLoginAttempts()`
- **Returns**: `Promise<ApiResponse<LoginAttempt[]>>`
- **Description**: Get login attempt history

##### `getApiKeys()`
- **Returns**: `Promise<ApiResponse<ApiKey[]>>`
- **Description**: Get user's API keys

##### `createApiKey(name: string, expiresAt?: string)`
- **Parameters**: 
  - `name: string` - API key name
  - `expiresAt?: string` - Optional expiration date
- **Returns**: `Promise<ApiResponse<ApiKey>>`
- **Description**: Create new API key

##### `revokeApiKey(keyId: string)`
- **Parameters**: `keyId: string` - API key ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Revoke API key

---

## Social & Commerce

### socialApi

**File**: `src/api/endpoints/social.ts`

#### Methods

##### `getUGC(productId?: string)`
- **Parameters**: `productId?: string` - Optional product ID filter
- **Returns**: `Promise<ApiResponse<UserGeneratedContent[]>>`
- **Description**: Get user-generated content (reviews, photos, videos)

##### `submitUGC(content: Partial<UserGeneratedContent>)`
- **Parameters**: `content: Partial<UserGeneratedContent>` - UGC content data
- **Returns**: `Promise<ApiResponse<UserGeneratedContent>>`
- **Description**: Submit user-generated content

##### `socialLogin(provider: string, token: string)`
- **Parameters**: 
  - `provider: string` - Social provider (google, facebook, etc.)
  - `token: string` - Provider authentication token
- **Returns**: `Promise<ApiResponse<{ token: string; user: any }>>`
- **Description**: Login with social provider

##### `shareProduct(productId: string, platform: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `platform: string` - Social platform
- **Returns**: `Promise<ApiResponse<SocialShare>>`
- **Description**: Share product on social platform

##### `getInfluencers()`
- **Returns**: `Promise<ApiResponse<Influencer[]>>`
- **Description**: Get influencer list

---

## Subscriptions

### subscriptionsApi

**File**: `src/api/endpoints/subscriptions.ts`

#### Methods

##### `pauseSubscription(subscriptionId: string)`
- **Parameters**: `subscriptionId: string` - Subscription ID
- **Returns**: `Promise<ApiResponse<Subscription>>`
- **Description**: Pause subscription

##### `resumeSubscription(subscriptionId: string)`
- **Parameters**: `subscriptionId: string` - Subscription ID
- **Returns**: `Promise<ApiResponse<Subscription>>`
- **Description**: Resume paused subscription

##### `skipNextDelivery(subscriptionId: string)`
- **Parameters**: `subscriptionId: string` - Subscription ID
- **Returns**: `Promise<ApiResponse<Subscription>>`
- **Description**: Skip next scheduled delivery

##### `changeFrequency(subscriptionId: string, frequency: string)`
- **Parameters**: 
  - `subscriptionId: string` - Subscription ID
  - `frequency: string` - New frequency
- **Returns**: `Promise<ApiResponse<Subscription>>`
- **Description**: Change subscription frequency

##### `cancelSubscription(subscriptionId: string)`
- **Parameters**: `subscriptionId: string` - Subscription ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Cancel subscription

---

## Support

### supportApi

**File**: `src/api/endpoints/support.ts`

#### Methods

##### `getFAQs(category?: string)`
- **Parameters**: `category?: string` - Optional category filter
- **Returns**: `Promise<ApiResponse<FAQ[]>>`
- **Description**: Get frequently asked questions

##### `createTicket(ticket: Partial<SupportTicket>)`
- **Parameters**: `ticket: Partial<SupportTicket>` - Ticket data
- **Returns**: `Promise<ApiResponse<SupportTicket>>`
- **Description**: Create support ticket

##### `getTickets()`
- **Returns**: `Promise<ApiResponse<PaginatedResponse<SupportTicket>>>`
- **Description**: Get user's support tickets

##### `getTicket(id: string)`
- **Parameters**: `id: string` - Ticket ID
- **Returns**: `Promise<ApiResponse<SupportTicket>>`
- **Description**: Get ticket details

##### `addTicketMessage(ticketId: string, message: string, attachments?: File[])`
- **Parameters**: 
  - `ticketId: string` - Ticket ID
  - `message: string` - Message content
  - `attachments?: File[]` - Optional attachments
- **Returns**: `Promise<ApiResponse<TicketMessage>>`
- **Description**: Add message to ticket

##### `closeTicket(ticketId: string)`
- **Parameters**: `ticketId: string` - Ticket ID
- **Returns**: `Promise<ApiResponse<SupportTicket>>`
- **Description**: Close support ticket

---

### customerServiceEnhancedApi

**File**: `src/api/endpoints/customer-service-enhanced.ts`

#### Methods

##### `trackOrder(orderNumber: string, email?: string)`
- **Parameters**: 
  - `orderNumber: string` - Order number
  - `email?: string` - Optional email for guest tracking
- **Returns**: `Promise<ApiResponse<OrderTracking>>`
- **Description**: Track order without login (guest tracking)

##### `getKnowledgeBase(category?: string)`
- **Parameters**: `category?: string` - Optional category filter
- **Returns**: `Promise<ApiResponse<KnowledgeBaseArticle[]>>`
- **Description**: Get knowledge base articles

##### `getTroubleshootingGuides(category?: string)`
- **Parameters**: `category?: string` - Optional category filter
- **Returns**: `Promise<ApiResponse<TroubleshootingGuide[]>>`
- **Description**: Get troubleshooting guides

##### `getVideoTutorials(category?: string)`
- **Parameters**: `category?: string` - Optional category filter
- **Returns**: `Promise<ApiResponse<VideoTutorial[]>>`
- **Description**: Get video tutorials

##### `scheduleCallback(request: CallbackRequest)`
- **Parameters**: `request: CallbackRequest` - Callback scheduling data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Schedule customer service callback

---

## Wallet

### walletApi

**File**: `src/api/endpoints/wallet.ts`

#### Methods

##### `getWalletBalance()`
- **Returns**: `Promise<ApiResponse<WalletBalance>>`
- **Description**: Get wallet balance

##### `addFunds(amount: number, paymentMethod: string)`
- **Parameters**: 
  - `amount: number` - Amount to add
  - `paymentMethod: string` - Payment method ID
- **Returns**: `Promise<ApiResponse<WalletTransaction>>`
- **Description**: Add funds to wallet

##### `getStoreCredits()`
- **Returns**: `Promise<ApiResponse<StoreCredit[]>>`
- **Description**: Get store credits

##### `getInvoices()`
- **Returns**: `Promise<ApiResponse<Invoice[]>>`
- **Description**: Get user invoices

##### `getInvoice(id: string)`
- **Parameters**: `id: string` - Invoice ID
- **Returns**: `Promise<ApiResponse<Invoice>>`
- **Description**: Get invoice details

##### `downloadInvoice(id: string)`
- **Parameters**: `id: string` - Invoice ID
- **Returns**: `Promise<Blob>`
- **Description**: Download invoice PDF

---

## Vendor

### vendorApi

**File**: `src/api/endpoints/vendor.ts`

#### Methods

##### `registerAsVendor(data: any)`
- **Parameters**: `data` - Vendor registration data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Register as vendor

##### `getVendorDashboard()`
- **Returns**: `Promise<ApiResponse<VendorDashboard>>`
- **Description**: Get vendor dashboard stats

##### `getVendorProducts(filters?: any)`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Product>>>`
- **Description**: Get vendor's products

##### `addVendorProduct(product: Partial<Product>)`
- **Parameters**: `product: Partial<Product>` - Product data
- **Returns**: `Promise<ApiResponse<Product>>`
- **Description**: Add product as vendor

##### `getVendorPayouts()`
- **Returns**: `Promise<ApiResponse<VendorPayout[]>>`
- **Description**: Get vendor payouts

---

## Webhooks

### webhooksApi

**File**: `src/api/endpoints/webhooks.ts` (Admin)

#### Methods

##### `getWebhookEvents(filters?: any)`
- **Parameters**: `filters` - Optional filters (type, status, date range, etc.)
- **Returns**: `Promise<ApiResponse<WebhookEvent[]>>`
- **Description**: Get webhook events for monitoring and debugging

---

## Admin APIs

### adminApi

**File**: `src/api/endpoints/admin.ts`

#### Methods

##### `getDashboard()`
- **Returns**: `Promise<ApiResponse<AnalyticsDashboard>>`
- **Description**: Get admin dashboard data

##### `getStats()`
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get admin statistics

##### `getUsers(filters?: any)`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<User>>>`
- **Description**: Get users list

##### `getUser(id: string)`
- **Parameters**: `id: string` - User ID
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Get user details

##### `createUser(userData: any)`
- **Parameters**: `userData` - User data
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Create user

##### `updateUser(id: string, userData: Partial<User>)`
- **Parameters**: 
  - `id: string` - User ID
  - `userData: Partial<User>` - User data to update
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Update user

##### `deleteUser(id: string)`
- **Parameters**: `id: string` - User ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete user

##### `verifyUser(id: string)`
- **Parameters**: `id: string` - User ID
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Verify user email

##### `activateUser(id: string, active: boolean)`
- **Parameters**: 
  - `id: string` - User ID
  - `active: boolean` - Active status
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Activate/deactivate user

##### `changeUserRole(id: string, role: string)`
- **Parameters**: 
  - `id: string` - User ID
  - `role: string` - New role
- **Returns**: `Promise<ApiResponse<User>>`
- **Description**: Change user role

##### `resetUserPassword(id: string)`
- **Parameters**: `id: string` - User ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Reset user password

##### `getOrders(filters?: { page?: number; limit?: number; status?: string; userId?: string; search?: string; paymentStatus?: string })`
- **Parameters**: `filters` - Optional filters (page, limit, status, userId, search; paymentStatus supported)
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Order>>>`
- **Description**: Get orders list

##### `getOrder(id: string)`
- **Parameters**: `id: string` - Order ID
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Get order details

##### `updateOrderStatus(id: string, status: string)`
- **Parameters**: 
  - `id: string` - Order ID
  - `status: string` - New status
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Update order status

##### `cancelOrder(id: string, reason?: string)`
- **Parameters**: 
  - `id: string` - Order ID
  - `reason?: string` - Optional cancel reason (sent in body when provided)
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Cancel order

##### `refundOrder(id: string, amount: number, reason: string)`
- **Parameters**: 
  - `id: string` - Order ID
  - `amount: number` - Refund amount (use order total for full refund)
  - `reason: string` - Refund reason (required)
- **Returns**: `Promise<ApiResponse<Order>>`
- **Description**: Refund order

---

### adminServicesApi

**File**: `src/api/endpoints/admin-services.ts`

Admin-only CRUD for catalog services (CONSULTING, REPAIR, INSTALLATION). Auth: send `Authorization: Bearer <admin_jwt>` for all calls. Used by the admin "Services" page: list with filters, add/edit form (scope = Product, Category, or Standalone), delete with confirmation.

#### Methods

##### `list(params?: AdminServicesListParams)`
- **Parameters**: `params` - Optional: `page`, `limit` (defaults 1, 20), `type`, `productId`, `categoryId`, `isActive` (`"true"` | `"false"`)
- **Returns**: `Promise<ApiResponse<Service[]> & { pagination?: { page, limit, total, pages } }>`
- **Description**: List services. Backend: `GET /admin/services`. Each service may include `product` and/or `category` (id, name, slug) when scoped.

##### `get(id: string)`
- **Parameters**: `id: string` - Service ID
- **Returns**: `Promise<ApiResponse<Service>>`
- **Description**: Get one service (full product/category when linked). Backend: `GET /admin/services/:id`. Use to pre-fill the edit form.

##### `create(data: AdminServiceCreatePayload)`
- **Parameters**: `data` - Required: `name`, `price` (number ≥ 0), `type` (CONSULTING | REPAIR | INSTALLATION). Optional: `slug`, `description`, `productId`, `categoryId`, `durationMinutes`, `isActive` (default true), `metadata`. Send exactly one of `productId` or `categoryId` (or neither for standalone).
- **Returns**: `Promise<ApiResponse<Service>>`
- **Description**: Create service. Backend: `POST /admin/services`. 201 on success; 400 for validation or "Product not found" / "Category not found".

##### `update(id: string, data: Partial<AdminServiceCreatePayload>)`
- **Parameters**: `id: string`, `data` - Same fields as create; only send fields that change (e.g. `{ price: 30 }`, or `{ categoryId: "cat_xyz", productId: null }`).
- **Returns**: `Promise<ApiResponse<Service>>`
- **Description**: Update service. Backend: `PUT /admin/services/:id`. 200 on success; 400/404 on error.

##### `delete(id: string)`
- **Parameters**: `id: string` - Service ID
- **Returns**: `Promise<ApiResponse<{ message?: string }>>`
- **Description**: Delete service. Backend: `DELETE /admin/services/:id`. 200 with message on success; 404 if not found.

#### Admin UI flow

- **Services list**: Call `list(filters)` with optional type, categoryId, productId, isActive. Show table: name, type, price, scope (product name / category name / "Standalone"), isActive. Pagination via `page`/`limit`. Actions: Add service, Edit, Delete.
- **Add service**: Load categories (e.g. `productsApi.getCategories()`) and products (e.g. `productsApi.getProducts()`) for dropdowns. Form: name, price, type (required); optional description, slug, duration, isActive; scope = Product | Category | Standalone. Submit → `create(body)`; on 201 redirect or refresh list; on 400 show error.
- **Edit service**: Open form with `get(id)` to pre-fill. Same form; submit → `update(id, body)` with only changed fields; handle 200/400/404.
- **Delete**: Confirm; `delete(id)`; on 200 refresh list.

---

### analyticsApi

**File**: `src/api/endpoints/analytics.ts`

#### Methods

##### `getDashboard()`
- **Returns**: `Promise<ApiResponse<AnalyticsDashboard>>`
- **Description**: Get analytics dashboard

##### `getCLV(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get customer lifetime value

##### `getCohort()`
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get cohort analysis

##### `getFunnel()`
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get conversion funnel

##### `getSegments()`
- **Returns**: `Promise<ApiResponse<any[]>>`
- **Description**: Get user segments

---

## Content & Media

### cmsApi

**File**: `src/api/endpoints/cms.ts`

#### Methods

##### `getPages()`
- **Returns**: `Promise<ApiResponse<CMSPage[]>>`
- **Description**: Get all CMS pages

##### `getPage(slug: string)`
- **Parameters**: `slug: string` - Page slug
- **Returns**: `Promise<ApiResponse<CMSPage>>`
- **Description**: Get CMS page by slug

##### `getBlog()`
- **Returns**: `Promise<ApiResponse<BlogPost[]>>`
- **Description**: Get blog posts

##### `getBlogPost(slug: string)`
- **Parameters**: `slug: string` - Post slug
- **Returns**: `Promise<ApiResponse<BlogPost>>`
- **Description**: Get blog post by slug

##### `getBanners()`
- **Returns**: `Promise<ApiResponse<Banner[]>>`
- **Description**: Get active banners

##### `createPage(pageData: any)` (Admin)
- **Parameters**: `pageData` - Page data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Create CMS page

##### `updatePage(slug: string, pageData: any)` (Admin)
- **Parameters**: 
  - `slug: string` - Page slug
  - `pageData` - Page data to update
- **Returns**: `Promise<ApiResponse>`
- **Description**: Update CMS page

##### `deletePage(slug: string)` (Admin)
- **Parameters**: `slug: string` - Page slug
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete CMS page

---

### mediaApi

**File**: `src/api/endpoints/media.ts` (Admin)

#### Methods

##### `uploadImage(file: File)`
- **Parameters**: `file: File` - Image file to upload
- **Returns**: `Promise<ApiResponse<MediaImage>>`
- **Description**: Upload a single image

##### `uploadMultiple(files: File[])`
- **Parameters**: `files: File[]` - Array of image files
- **Returns**: `Promise<ApiResponse<MediaImage[]>>`
- **Description**: Upload multiple images

##### `uploadChunk(chunk: Blob, uploadId: string, chunkNumber: number)`
- **Parameters**: 
  - `chunk: Blob` - File chunk
  - `uploadId: string` - Upload session ID
  - `chunkNumber: number` - Chunk sequence number
- **Returns**: `Promise<ApiResponse>`
- **Description**: Upload file chunk for large file uploads

##### `getUploadStatus(uploadId: string)`
- **Parameters**: `uploadId: string` - Upload session ID
- **Returns**: `Promise<ApiResponse<MediaUpload>>`
- **Description**: Get upload status for chunked uploads

##### `getImage(imageId: string)`
- **Parameters**: `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse<MediaImage>>`
- **Description**: Get image details

##### `deleteImage(imageId: string)`
- **Parameters**: `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete image

##### `listImages(filters?: any)`
- **Parameters**: `filters` - Optional filters (pagination, search, etc.)
- **Returns**: `Promise<ApiResponse<PaginatedResponse<MediaImage>>>`
- **Description**: List all images with optional filters

##### `optimizeImage(imageId: string)`
- **Parameters**: `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse<MediaImage>>`
- **Description**: Optimize image for web delivery

##### `resizeImage(imageId: string, width: number, height: number)`
- **Parameters**: 
  - `imageId: string` - Image ID
  - `width: number` - Target width
  - `height: number` - Target height
- **Returns**: `Promise<ApiResponse<MediaImage>>`
- **Description**: Resize image to specified dimensions

##### `getImageVariants(imageId: string)`
- **Parameters**: `imageId: string` - Image ID
- **Returns**: `Promise<ApiResponse<ImageVariant[]>>`
- **Description**: Get all variants of an image (thumbnails, different sizes)

---

## Customer Experience

### experienceApi

**File**: `src/api/endpoints/experience.ts`

#### Methods

##### `getProductQuestions(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<ProductQuestion[]>>`
- **Description**: Get Q&A for a product

##### `getSizeGuide(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<SizeGuide>>`
- **Description**: Get size guide for a product

##### `getProductVideos(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<ProductVideo[]>>`
- **Description**: Get product videos

##### `getSocialProof(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<SocialProof>>`
- **Description**: Get social proof data (recent purchases, views, etc.)

##### `askQuestion(productId: string, question: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `question: string` - Question text
- **Returns**: `Promise<ApiResponse>`
- **Description**: Submit a product question

##### `getRecentlyViewed()`
- **Returns**: `Promise<ApiResponse<Product[]>>`
- **Description**: Get recently viewed products

##### `addToWaitlist(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Add product to waitlist

##### `getWaitlist()`
- **Returns**: `Promise<ApiResponse<WaitlistItem[]>>`
- **Description**: Get user's waitlist items

##### `createProductAlert(productId: string, type: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `type: string` - Alert type (e.g., 'price_drop', 'back_in_stock')
- **Returns**: `Promise<ApiResponse>`
- **Description**: Create product alert

##### `getProductAlerts()`
- **Returns**: `Promise<ApiResponse<ProductAlert[]>>`
- **Description**: Get user's product alerts

---

## Marketing

### marketingApi

**File**: `src/api/endpoints/marketing.ts`

#### Methods

##### `getFlashSales()`
- **Returns**: `Promise<ApiResponse<FlashSale[]>>`
- **Description**: Get active flash sales

##### `getDeals()`
- **Returns**: `Promise<ApiResponse<Deal[]>>`
- **Description**: Get available deals

##### `getBundles()`
- **Returns**: `Promise<ApiResponse<ProductBundle[]>>`
- **Description**: Get product bundles

##### `getRecommendations(productId?: string)`
- **Parameters**: `productId?: string` - Optional product ID for personalized recommendations
- **Returns**: `Promise<ApiResponse<Product[]>>`
- **Description**: Get product recommendations

##### `getAbandonedCarts()` (Admin)
- **Returns**: `Promise<ApiResponse<AbandonedCart[]>>`
- **Description**: Get abandoned carts for marketing campaigns

---

## Gifts

### giftsApi

**File**: `src/api/endpoints/gifts.ts`

#### Methods

##### `createRegistry(registry: Partial<GiftRegistry>)`
- **Parameters**: `registry: Partial<GiftRegistry>` - Gift registry data
- **Returns**: `Promise<ApiResponse<GiftRegistry>>`
- **Description**: Create a gift registry

##### `getRegistries()`
- **Returns**: `Promise<ApiResponse<GiftRegistry[]>>`
- **Description**: Get user's gift registries

##### `addRegistryItem(registryId: string, item: Partial<GiftRegistryItem>)`
- **Parameters**: 
  - `registryId: string` - Registry ID
  - `item: Partial<GiftRegistryItem>` - Item data
- **Returns**: `Promise<ApiResponse<GiftRegistryItem>>`
- **Description**: Add item to gift registry

##### `sendAsGift(orderId: string, giftData: any)`
- **Parameters**: 
  - `orderId: string` - Order ID
  - `giftData: any` - Gift data (recipient, message, etc.)
- **Returns**: `Promise<ApiResponse>`
- **Description**: Send order as gift

##### `scheduleGiftDelivery(giftId: string, schedule: any)`
- **Parameters**: 
  - `giftId: string` - Gift ID
  - `schedule: any` - Delivery schedule
- **Returns**: `Promise<ApiResponse>`
- **Description**: Schedule gift delivery

##### `trackGift(trackingNumber: string)`
- **Parameters**: `trackingNumber: string` - Gift tracking number
- **Returns**: `Promise<ApiResponse<GiftTracking>>`
- **Description**: Track gift delivery

---

## Compliance

### complianceApi

**File**: `src/api/endpoints/compliance.ts`

#### Methods

##### `getDocument(type: string)`
- **Parameters**: `type: string` - Document type
- **Returns**: `Promise<ApiResponse<LegalDocument>>`
- **Description**: Get legal document

##### `createDocument(documentData: Partial<LegalDocument>)` (Admin)
- **Parameters**: `documentData` - Document data
- **Returns**: `Promise<ApiResponse<LegalDocument>>`
- **Description**: Create legal document

##### `exportUserData(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<Blob>`
- **Description**: Export user data (GDPR)

##### `deleteUserData(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete user data (GDPR)

##### `recordAcceptance(documentType: string, version: string)`
- **Parameters**: 
  - `documentType: string` - Document type
  - `version: string` - Document version
- **Returns**: `Promise<ApiResponse>`
- **Description**: Record document acceptance

##### `checkAcceptance(documentType: string)`
- **Parameters**: `documentType: string` - Document type
- **Returns**: `Promise<ApiResponse<{ accepted: boolean; version: string }>>`
- **Description**: Check document acceptance status

##### `getPCIStatus()` (Admin)
- **Returns**: `Promise<ApiResponse<PCIComplianceStatus>>`
- **Description**: Get PCI compliance status

##### `calculateTaxAvalara(data: TaxCalculationRequest)` (Admin)
- **Parameters**: `data: TaxCalculationRequest` - Tax calculation data
- **Returns**: `Promise<ApiResponse<TaxCalculationResponse>>`
- **Description**: Calculate tax using Avalara

##### `calculateTaxTaxJar(data: TaxCalculationRequest)` (Admin)
- **Parameters**: `data: TaxCalculationRequest` - Tax calculation data
- **Returns**: `Promise<ApiResponse<TaxCalculationResponse>>`
- **Description**: Calculate tax using TaxJar

##### `calculateVATMOSS(data: TaxCalculationRequest)` (Admin)
- **Parameters**: `data: TaxCalculationRequest` - Tax calculation data
- **Returns**: `Promise<ApiResponse<TaxCalculationResponse>>`
- **Description**: Calculate VAT MOSS

##### `calculateGST(data: TaxCalculationRequest)` (Admin)
- **Parameters**: `data: TaxCalculationRequest` - Tax calculation data
- **Returns**: `Promise<ApiResponse<TaxCalculationResponse>>`
- **Description**: Calculate GST

##### `trackNexus(location: NexusLocation)` (Admin)
- **Parameters**: `location: NexusLocation` - Nexus location data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Track nexus location

---

## CRM

### crmApi

**File**: `src/api/endpoints/crm.ts` (Admin)

#### Methods

##### `getCustomer360(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse<Customer360>>`
- **Description**: Get customer 360 view

##### `getRFM(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse<RFMAnalysis>>`
- **Description**: Get RFM analysis

##### `addTag(userId: string, tag: string)`
- **Parameters**: 
  - `userId: string` - User ID
  - `tag: string` - Tag name
- **Returns**: `Promise<ApiResponse>`
- **Description**: Add tag to customer

##### `addNote(userId: string, note: string)`
- **Parameters**: 
  - `userId: string` - User ID
  - `note: string` - Note content
- **Returns**: `Promise<ApiResponse>`
- **Description**: Add note to customer

##### `getSegments()`
- **Returns**: `Promise<ApiResponse<CustomerSegment[]>>`
- **Description**: Get customer segments

---

## Currency

Storefront uses **GET /api/v1/currencies/** for the list and symbols, **GET /api/v1/currencies/default** for the store default. Admin panel uses **GET/POST/PUT/DELETE /api/v1/admin/currencies** for currency settings. Currency types and symbols are defined by the backend; see `backend_apis.md` for full API details.

### currenciesApi

**File**: `src/api/endpoints/currencies.ts`

Public and storefront currency endpoints. Responses are normalized to the frontend `Currency` type (`id`, `code`, `name`, `symbol`, `exchangeRate`, `isActive`, `isDefault`, `updatedAt`).

#### Methods

##### `getCurrencies()`
- **Returns**: `Promise<ApiResponse<Currency[]>>`
- **Description**: Get list of **active** currencies. Backend: `GET /api/v1/currencies/`. Use for the storefront currency selector and for display symbols (`data[].symbol`).

##### `getDefault()`
- **Returns**: `Promise<ApiResponse<Currency>>`
- **Description**: Get the store default currency (single object, same shape as list items). Backend: `GET /api/v1/currencies/default`. Use to set initial selected currency when the user has no saved preference.

##### `getCurrency(code: string)`
- **Parameters**: `code: string` - Currency code (e.g. USD, EUR, INR)
- **Returns**: `Promise<ApiResponse<Currency>>`
- **Description**: Get one currency by code. Backend: `GET /api/v1/currencies/:code`.

##### `convert(amount: number, from: string, to: string)`
- **Parameters**:
  - `amount: number` - Amount to convert
  - `from: string` - Source currency code
  - `to: string` - Target currency code
- **Returns**: `Promise<ApiResponse<CurrencyConversion>>`
- **Description**: Convert amount between currencies using stored exchange rates. Backend: `GET /api/v1/currencies/convert?from=&to=&amount=`. Response is normalized to `{ amount, rate, fromCurrency, toCurrency, convertedAmount }`.

##### `updateRates(rates: Record<string, number>)` (Admin)
- **Parameters**: `rates: Record<string, number>` - Map of currency code to exchange rate (positive number). Only codes that exist in the database are updated.
- **Returns**: `Promise<ApiResponse>`
- **Description**: Bulk-update exchange rates. Backend: `PUT /api/v1/currencies/rates`. Admin only (Bearer token required).

---

### adminCurrenciesApi

**File**: `src/api/endpoints/admin-currencies.ts`

Admin-only endpoints for managing which currencies are supported, their names, symbols, default, and active status. Use in the admin panel “Currencies” settings screen.

#### Methods

##### `list(activeOnly?: boolean)`
- **Parameters**: `activeOnly?: boolean` - If `true`, return only active currencies.
- **Returns**: `Promise<ApiResponse<Currency[]>>`
- **Description**: List all currencies including inactive. Backend: `GET /api/v1/admin/currencies` with optional `?activeOnly=true`.

##### `getByCode(code: string)`
- **Parameters**: `code: string` - Currency code (e.g. USD, INR).
- **Returns**: `Promise<ApiResponse<Currency>>`
- **Description**: Get one currency by code. Backend: `GET /api/v1/admin/currencies/:code`.

##### `create(body: CreateCurrencyBody)`
- **Parameters**: `body: CreateCurrencyBody` - `{ code, name, symbol, exchangeRate?, isDefault?, isActive? }`. If `isDefault` is true, any existing default is cleared.
- **Returns**: `Promise<ApiResponse<Currency>>`
- **Description**: Create a new currency. Backend: `POST /api/v1/admin/currencies`.

##### `update(code: string, body: UpdateCurrencyBody)`
- **Parameters**:
  - `code: string` - Currency code to update
  - `body: UpdateCurrencyBody` - Optional fields: `name`, `symbol`, `exchangeRate`, `isDefault`, `isActive`. If `isDefault` is set to true, other currencies are set to non-default.
- **Returns**: `Promise<ApiResponse<Currency>>`
- **Description**: Update currency. Backend: `PUT /api/v1/admin/currencies/:code`.

##### `deactivate(code: string)`
- **Parameters**: `code: string` - Currency code to deactivate.
- **Returns**: `Promise<ApiResponse<{ message?: string }>>`
- **Description**: Soft-deactivate by setting `isActive` to false. Backend: `DELETE /api/v1/admin/currencies/:code`. Cannot delete the default currency; set another as default first.

---

## Internationalization

### i18nApi

**File**: `src/api/endpoints/i18n.ts`

#### Methods

##### `getRegionalPrice(productId: string, region: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `region: string` - Region code
- **Returns**: `Promise<ApiResponse<RegionalPrice>>`
- **Description**: Get regional price for product

##### `getRegionalAvailability(productId: string, region: string)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `region: string` - Region code
- **Returns**: `Promise<ApiResponse<RegionalAvailability>>`
- **Description**: Get regional availability for product

##### `getRegionalPaymentMethods(region: string)`
- **Parameters**: `region: string` - Region code
- **Returns**: `Promise<ApiResponse<RegionalPaymentMethod[]>>`
- **Description**: Get available payment methods for region

##### `getRegionalShippingCarriers(region: string)`
- **Parameters**: `region: string` - Region code
- **Returns**: `Promise<ApiResponse<RegionalShippingCarrier[]>>`
- **Description**: Get available shipping carriers for region

##### `getRegionalCompliance(region: string)`
- **Parameters**: `region: string` - Region code
- **Returns**: `Promise<ApiResponse<RegionalCompliance>>`
- **Description**: Get regional compliance requirements

##### `getStores(region?: string)`
- **Parameters**: `region?: string` - Optional region filter
- **Returns**: `Promise<ApiResponse<Store[]>>`
- **Description**: Get stores by region

##### `createStore(store: Partial<Store>)` (Admin)
- **Parameters**: `store: Partial<Store>` - Store data
- **Returns**: `Promise<ApiResponse<Store>>`
- **Description**: Create new store

##### `getStore(storeId: string)`
- **Parameters**: `storeId: string` - Store ID
- **Returns**: `Promise<ApiResponse<Store>>`
- **Description**: Get store details

---

## Integrations

### integrationsApi

**File**: `src/api/endpoints/integrations.ts` (Admin)

#### Methods

##### `listIntegrations()`
- **Returns**: `Promise<ApiResponse<Integration[]>>`
- **Description**: List all integrations

##### `getIntegration(id: string)`
- **Parameters**: `id: string` - Integration ID
- **Returns**: `Promise<ApiResponse<Integration>>`
- **Description**: Get integration details

##### `createIntegration(integration: Partial<Integration>)`
- **Parameters**: `integration: Partial<Integration>` - Integration data
- **Returns**: `Promise<ApiResponse<Integration>>`
- **Description**: Create new integration

##### `updateIntegration(id: string, integration: Partial<Integration>)`
- **Parameters**: 
  - `id: string` - Integration ID
  - `integration: Partial<Integration>` - Integration data to update
- **Returns**: `Promise<ApiResponse<Integration>>`
- **Description**: Update integration

##### `deleteIntegration(id: string)`
- **Parameters**: `id: string` - Integration ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete integration

---

## Languages

### languagesApi

**File**: `src/api/endpoints/languages.ts` (Admin)

#### Methods

##### `getLanguages()`
- **Returns**: `Promise<ApiResponse<Language[]>>`
- **Description**: Get all supported languages

##### `getLanguage(code: string)`
- **Parameters**: `code: string` - Language code (e.g., 'en', 'es')
- **Returns**: `Promise<ApiResponse<Language>>`
- **Description**: Get language details

##### `getTranslations(locale?: string)`
- **Parameters**: `locale?: string` - Optional locale code
- **Returns**: `Promise<ApiResponse<Translation[]>>`
- **Description**: Get translations for locale

##### `createTranslation(translation: Partial<Translation>)`
- **Parameters**: `translation: Partial<Translation>` - Translation data
- **Returns**: `Promise<ApiResponse<Translation>>`
- **Description**: Create new translation

---

## Mobile

### mobileApi

**File**: `src/api/endpoints/mobile.ts`

#### Methods

##### `getAppVersion()`
- **Returns**: `Promise<ApiResponse<AppVersion>>`
- **Description**: Get mobile app version information

##### `registerDevice(deviceData: DeviceRegistration)`
- **Parameters**: `deviceData: DeviceRegistration` - Device registration data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Register mobile device

##### `createDeepLink(target: string)`
- **Parameters**: `target: string` - Target URL or route
- **Returns**: `Promise<ApiResponse<DeepLink>>`
- **Description**: Create deep link for mobile app

##### `processMobilePayment(payment: MobilePayment)`
- **Parameters**: `payment: MobilePayment` - Mobile payment data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Process mobile payment

##### `sendPushNotification(notification: PushNotification)`
- **Parameters**: `notification: PushNotification` - Push notification data
- **Returns**: `Promise<ApiResponse>`
- **Description**: Send push notification to mobile device

---

## Multi-Tenant

### tenantsApi

**File**: `src/api/endpoints/tenants.ts` (Admin)

#### Methods

##### `createTenant(tenant: Partial<Tenant>)`
- **Parameters**: `tenant: Partial<Tenant>` - Tenant data
- **Returns**: `Promise<ApiResponse<Tenant>>`
- **Description**: Create new tenant

##### `listTenants(filters?: any)`
- **Parameters**: `filters` - Optional filters (pagination, search, etc.)
- **Returns**: `Promise<ApiResponse<PaginatedResponse<Tenant>>>`
- **Description**: List all tenants

##### `getTenant(tenantId: string)`
- **Parameters**: `tenantId: string` - Tenant ID
- **Returns**: `Promise<ApiResponse<Tenant>>`
- **Description**: Get tenant details

##### `updateTenant(tenantId: string, tenant: Partial<Tenant>)`
- **Parameters**: 
  - `tenantId: string` - Tenant ID
  - `tenant: Partial<Tenant>` - Tenant data to update
- **Returns**: `Promise<ApiResponse<Tenant>>`
- **Description**: Update tenant

##### `getTenantStats(tenantId: string)`
- **Parameters**: `tenantId: string` - Tenant ID
- **Returns**: `Promise<ApiResponse<TenantStats>>`
- **Description**: Get tenant statistics

---

## Operations

### operationalApi

**File**: `src/api/endpoints/operational.ts` (Admin)

#### Methods

##### `bulkProducts(operation: string, data: any[])`
- **Parameters**: 
  - `operation: string` - Operation type
  - `data: any[]` - Product data array
- **Returns**: `Promise<ApiResponse>`
- **Description**: Bulk product operations

##### `bulkOrders(operation: string, data: any[])`
- **Parameters**: 
  - `operation: string` - Operation type
  - `data: any[]` - Order data array
- **Returns**: `Promise<ApiResponse>`
- **Description**: Bulk order operations

##### `importData(file: File, type: string, options?: { skipHeader?: boolean; validate?: boolean })`
- **Parameters**: 
  - `file: File` - Import file
  - `type: string` - Data type
  - `options` - Optional import options
- **Returns**: `Promise<ApiResponse>`
- **Description**: Import data from file

##### `getImportStatus(jobId?: string)`
- **Parameters**: `jobId?: string` - Optional job ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get import job status

##### `getImportResult(jobId: string)`
- **Parameters**: `jobId: string` - Job ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get import job result

##### `exportData(type: string, filters?: any)`
- **Parameters**: 
  - `type: string` - Data type
  - `filters` - Optional filters
- **Returns**: `Promise<Blob>`
- **Description**: Export data to file

##### `getExportStatus(jobId?: string)`
- **Parameters**: `jobId?: string` - Optional job ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get export job status

---

### batchApi

**File**: `src/api/endpoints/batch.ts` (Admin)

#### Methods

##### `executeBatch(requests: BatchRequest[])`
- **Parameters**: `requests: BatchRequest[]` - Array of batch requests (max 20)
- **Returns**: `Promise<ApiResponse<BatchResponse[]>>`
- **Description**: Execute multiple API requests in a single call

---

### jobsApi

**File**: `src/api/endpoints/jobs.ts` (Admin)

#### Methods

##### `getJobStats()`
- **Returns**: `Promise<ApiResponse<JobStats>>`
- **Description**: Get job queue statistics

##### `getJob(queueName: string, jobId: string)`
- **Parameters**: 
  - `queueName: string` - Queue name
  - `jobId: string` - Job ID
- **Returns**: `Promise<ApiResponse<Job>>`
- **Description**: Get job details

##### `removeJob(queueName: string, jobId: string)`
- **Parameters**: 
  - `queueName: string` - Queue name
  - `jobId: string` - Job ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Remove job from queue

##### `retryJob(queueName: string, jobId: string)`
- **Parameters**: 
  - `queueName: string` - Queue name
  - `jobId: string` - Job ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Retry failed job

---

## API Management

### apiDeprecationApi

**File**: `src/api/endpoints/api-deprecation.ts` (Admin)

#### Methods

##### `getVersioningStrategy()`
- **Returns**: `Promise<ApiResponse<VersioningStrategy>>`
- **Description**: Get API versioning strategy

##### `getDeprecationPolicy()`
- **Returns**: `Promise<ApiResponse<DeprecationPolicy>>`
- **Description**: Get deprecation policy

##### `getDeprecationNotices()`
- **Returns**: `Promise<ApiResponse<DeprecationNotice[]>>`
- **Description**: Get deprecation notices

##### `createDeprecationNotice(notice: CreateDeprecationNoticeRequest)`
- **Parameters**: `notice: CreateDeprecationNoticeRequest` - Notice data
- **Returns**: `Promise<ApiResponse<DeprecationNotice>>`
- **Description**: Create deprecation notice

##### `getVersionLifecycle(version: string)`
- **Parameters**: `version: string` - API version
- **Returns**: `Promise<ApiResponse<VersionLifecycle>>`
- **Description**: Get version lifecycle

##### `getCompatibilityGuarantees()`
- **Returns**: `Promise<ApiResponse<CompatibilityGuarantees>>`
- **Description**: Get compatibility guarantees

---

### apiGatewayApi

**File**: `src/api/endpoints/api-gateway.ts` (Admin)

#### Methods

##### `getUserTier()`
- **Returns**: `Promise<ApiResponse<ApiTier>>`
- **Description**: Get user API tier

##### `setUserTier(tier: ApiTier)`
- **Parameters**: `tier: ApiTier` - API tier
- **Returns**: `Promise<ApiResponse<ApiTier>>`
- **Description**: Set user API tier

##### `getApiUsage()`
- **Returns**: `Promise<ApiResponse<ApiUsage>>`
- **Description**: Get API usage statistics

##### `getApiVersionInfo(version: string)`
- **Parameters**: `version: string` - API version
- **Returns**: `Promise<ApiResponse<ApiVersionInfo>>`
- **Description**: Get API version information

##### `deprecateApiVersion(request: DeprecateVersionRequest)`
- **Parameters**: `request: DeprecateVersionRequest` - Deprecation request
- **Returns**: `Promise<ApiResponse<ApiVersionInfo>>`
- **Description**: Deprecate API version

---

## Inventory

### inventoryApi

**File**: `src/api/endpoints/inventory.ts` (Admin)

#### Methods

##### `getInventory(filters?: any)`
- **Parameters**: `filters` - Optional filters (productId, categoryId, lowStock, etc.)
- **Returns**: `Promise<ApiResponse<PaginatedResponse<InventoryItem>>>`
- **Description**: Get inventory list with pagination

##### `updateInventory(productId: string, stock: number)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `stock: number` - New stock quantity
- **Returns**: `Promise<ApiResponse<InventoryItem>>`
- **Description**: Update product inventory stock

##### `getInventoryMovements(productId: string)`
- **Parameters**: `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<InventoryMovement[]>>`
- **Description**: Get inventory movement history for a product

---

## Advanced Admin Features

### inventoryAdvancedApi

**File**: `src/api/endpoints/inventory-advanced.ts` (Admin)

#### Methods

##### `calculateReorderPoint(productId: string, params?: ReorderPointParams)`
- **Parameters**: 
  - `productId: string` - Product ID
  - `params?: ReorderPointParams` - Optional parameters
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Calculate reorder point

##### `transferStock(data: StockTransferData)`
- **Parameters**: `data: StockTransferData` - Transfer data
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Transfer stock between locations

##### `recordCycleCount(data: CycleCountData)`
- **Parameters**: `data: CycleCountData` - Cycle count data
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Record cycle count

##### `getAgingReport(filters?: { categoryId?: string; minAge?: number; maxAge?: number })`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get inventory aging report

##### `recordShrinkage(data: ShrinkageData)`
- **Parameters**: `data: ShrinkageData` - Shrinkage data
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Record inventory shrinkage

---

### advancedAnalyticsApi

**File**: `src/api/endpoints/advanced-analytics.ts` (Admin)

#### Methods

##### `trackUTM(orderId: string, utmParams: UTMParams)`
- **Parameters**: 
  - `orderId: string` - Order ID
  - `utmParams: UTMParams` - UTM parameters
- **Returns**: `Promise<ApiResponse>`
- **Description**: Track UTM parameters for order

##### `getUserChurn(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get user churn analysis

##### `getProductAffinity(userId: string, productId: string)`
- **Parameters**: 
  - `userId: string` - User ID
  - `productId: string` - Product ID
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get product affinity score

##### `getNextProduct(userId: string)`
- **Parameters**: `userId: string` - User ID
- **Returns**: `Promise<ApiResponse<any[]>>`
- **Description**: Get next product recommendations

##### `getAttribution(userId: string, startDate?: string, endDate?: string)`
- **Parameters**: 
  - `userId: string` - User ID
  - `startDate?: string` - Start date
  - `endDate?: string` - End date
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get attribution analysis

##### `getRealtimeDashboard()`
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get real-time analytics dashboard

##### `getLiveOrders()`
- **Returns**: `Promise<ApiResponse<any[]>>`
- **Description**: Get live orders

##### `getConversionFunnel(startDate?: string, endDate?: string)`
- **Parameters**: 
  - `startDate?: string` - Start date
  - `endDate?: string` - End date
- **Returns**: `Promise<ApiResponse<any>>`
- **Description**: Get conversion funnel analysis

---

### paymentGatewaysApi

**File**: `src/api/endpoints/payment-gateways.ts` (Admin)

#### Methods

##### `getPaymentGateways(filters?: { isActive?: boolean; type?: string; page?: number; limit?: number })`
- **Parameters**: `filters` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<PaymentGateway> | PaymentGateway[]>>`
- **Description**: Get payment gateways

##### `getPaymentGateway(id: string)`
- **Parameters**: `id: string` - Gateway ID
- **Returns**: `Promise<ApiResponse<PaymentGateway>>`
- **Description**: Get payment gateway by ID

##### `createPaymentGateway(data: PaymentGatewayConfig)`
- **Parameters**: `data: PaymentGatewayConfig` - Gateway configuration
- **Returns**: `Promise<ApiResponse<PaymentGateway>>`
- **Description**: Create payment gateway

##### `updatePaymentGateway(id: string, data: Partial<PaymentGatewayConfig>)`
- **Parameters**: 
  - `id: string` - Gateway ID
  - `data: Partial<PaymentGatewayConfig>` - Gateway configuration
- **Returns**: `Promise<ApiResponse<PaymentGateway>>`
- **Description**: Update payment gateway

##### `deletePaymentGateway(id: string)`
- **Parameters**: `id: string` - Gateway ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete payment gateway

##### `testPaymentGateway(id: string)`
- **Parameters**: `id: string` - Gateway ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Test payment gateway connection

---

### featureFlagsApi

**File**: `src/api/endpoints/feature-flags.ts` (Admin)

#### Methods

##### `evaluateFlag(flagKey: string)`
- **Parameters**: `flagKey: string` - Feature flag key
- **Returns**: `Promise<ApiResponse<{ enabled: boolean; value: any }>>`
- **Description**: Evaluate feature flag for current user/context

##### `getAllFlags()`
- **Returns**: `Promise<ApiResponse<FeatureFlag[]>>`
- **Description**: Get all feature flags

##### `createFlag(flag: Partial<FeatureFlag>)`
- **Parameters**: `flag: Partial<FeatureFlag>` - Feature flag data
- **Returns**: `Promise<ApiResponse<FeatureFlag>>`
- **Description**: Create new feature flag

##### `getFlag(flagKey: string)`
- **Parameters**: `flagKey: string` - Feature flag key
- **Returns**: `Promise<ApiResponse<FeatureFlag>>`
- **Description**: Get feature flag details

##### `updateFlag(flagKey: string, flag: Partial<FeatureFlag>)`
- **Parameters**: 
  - `flagKey: string` - Feature flag key
  - `flag: Partial<FeatureFlag>` - Feature flag data to update
- **Returns**: `Promise<ApiResponse<FeatureFlag>>`
- **Description**: Update feature flag

##### `getFlagStats(flagKey: string)`
- **Parameters**: `flagKey: string` - Feature flag key
- **Returns**: `Promise<ApiResponse<FeatureFlagStats>>`
- **Description**: Get feature flag usage statistics

##### `createRule(flagKey: string, rule: Partial<FeatureFlagRule>)`
- **Parameters**: 
  - `flagKey: string` - Feature flag key
  - `rule: Partial<FeatureFlagRule>` - Rule data
- **Returns**: `Promise<ApiResponse<FeatureFlagRule>>`
- **Description**: Create rule for feature flag

##### `createOverride(flagKey: string, override: Partial<FeatureFlagOverride>)`
- **Parameters**: 
  - `flagKey: string` - Feature flag key
  - `override: Partial<FeatureFlagOverride>` - Override data
- **Returns**: `Promise<ApiResponse<FeatureFlagOverride>>`
- **Description**: Create override for feature flag

---

## System & Infrastructure

### monitoringApi

**File**: `src/api/endpoints/monitoring.ts` (Admin)

#### Methods

##### `getSystemHealth()`
- **Returns**: `Promise<ApiResponse<SystemHealth>>`
- **Description**: Get system health status

##### `getSystemMetrics()`
- **Returns**: `Promise<ApiResponse<SystemMetrics>>`
- **Description**: Get system performance metrics

---

### disasterRecoveryApi

**File**: `src/api/endpoints/disaster-recovery.ts` (Admin)

#### Methods

##### `getRPORTO()`
- **Returns**: `Promise<ApiResponse<RPORTO>>`
- **Description**: Get Recovery Point Objective (RPO) and Recovery Time Objective (RTO)

##### `getDRPlan()`
- **Returns**: `Promise<ApiResponse<DisasterRecoveryPlan>>`
- **Description**: Get disaster recovery plan

##### `createBackup(type: string)`
- **Parameters**: `type: string` - Backup type (full, incremental, etc.)
- **Returns**: `Promise<ApiResponse<Backup>>`
- **Description**: Create system backup

##### `scheduleBackups(schedule: BackupSchedule)`
- **Parameters**: `schedule: BackupSchedule` - Backup schedule configuration
- **Returns**: `Promise<ApiResponse>`
- **Description**: Schedule automated backups

##### `restoreBackup(backupId: string)`
- **Parameters**: `backupId: string` - Backup ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Restore from backup

##### `performRestoreDrill()`
- **Returns**: `Promise<ApiResponse>`
- **Description**: Perform disaster recovery drill/test

##### `handleFailover(region: string)`
- **Parameters**: `region: string` - Target region for failover
- **Returns**: `Promise<ApiResponse>`
- **Description**: Handle failover to backup region

---

### migrationsApi

**File**: `src/api/endpoints/migrations.ts` (Admin)

#### Methods

##### `executeMigration(migrationName: string)`
- **Parameters**: `migrationName: string` - Migration name
- **Returns**: `Promise<ApiResponse<Migration>>`
- **Description**: Execute database migration

##### `executeZeroDowntimeMigration(migrationName: string)`
- **Parameters**: `migrationName: string` - Migration name
- **Returns**: `Promise<ApiResponse<Migration>>`
- **Description**: Execute zero-downtime migration

##### `rollbackMigration(migrationId: string)`
- **Parameters**: `migrationId: string` - Migration ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Rollback migration

##### `gradualRollout(migrationId: string, percentage: number)`
- **Parameters**: 
  - `migrationId: string` - Migration ID
  - `percentage: number` - Rollout percentage (0-100)
- **Returns**: `Promise<ApiResponse>`
- **Description**: Gradually rollout migration to percentage of traffic

##### `checkCompatibility(migrationName: string)`
- **Parameters**: `migrationName: string` - Migration name
- **Returns**: `Promise<ApiResponse<CompatibilityCheck>>`
- **Description**: Check migration compatibility

---

### observabilityApi

**File**: `src/api/endpoints/observability.ts` (Admin)

#### Methods

##### `getSLADefinitions()`
- **Returns**: `Promise<ApiResponse<SLADefinition[]>>`
- **Description**: Get SLA (Service Level Agreement) definitions

##### `getSLODefinitions()`
- **Returns**: `Promise<ApiResponse<SLODefinition[]>>`
- **Description**: Get SLO (Service Level Objective) definitions

##### `getSLOStatus(service: string)`
- **Parameters**: `service: string` - Service name
- **Returns**: `Promise<ApiResponse<SLOStatus>>`
- **Description**: Get current SLO status for a service

##### `getAlertThresholds()`
- **Returns**: `Promise<ApiResponse<AlertThreshold[]>>`
- **Description**: Get alert thresholds configuration

##### `checkAlertConditions(service: string)`
- **Parameters**: `service: string` - Service name
- **Returns**: `Promise<ApiResponse<{ triggered: boolean; alerts: any[] }>>`
- **Description**: Check if alert conditions are met

##### `generateSLOReport(service: string)`
- **Parameters**: `service: string` - Service name
- **Returns**: `Promise<ApiResponse<SLOReport>>`
- **Description**: Generate SLO compliance report

---

## Logistics

### logisticsProvidersApi

**File**: `src/api/endpoints/logistics-providers.ts`

**Permissions**: Admin only

#### Methods

##### `getProviders(filters?)`
- **Parameters**: 
  - `filters?: { isActive?: boolean; type?: string; page?: number; limit?: number }` - Optional filters
- **Returns**: `Promise<ApiResponse<PaginatedResponse<LogisticsProvider> | LogisticsProvider[]>>`
- **Description**: Get all logistics providers with optional filters
- **Example**:
  ```typescript
  const response = await logisticsProvidersApi.getProviders({ isActive: true })
  ```

##### `getProvider(id: string)`
- **Parameters**: `id: string` - Provider ID
- **Returns**: `Promise<ApiResponse<LogisticsProvider>>`
- **Description**: Get logistics provider by ID

##### `createProvider(data: Partial<LogisticsProvider>)`
- **Parameters**: `data: Partial<LogisticsProvider>` - Provider configuration
- **Returns**: `Promise<ApiResponse<LogisticsProvider>>`
- **Description**: Create a new logistics provider

##### `updateProvider(id: string, data: Partial<LogisticsProvider>)`
- **Parameters**: 
  - `id: string` - Provider ID
  - `data: Partial<LogisticsProvider>` - Updated provider configuration
- **Returns**: `Promise<ApiResponse<LogisticsProvider>>`
- **Description**: Update logistics provider configuration

##### `toggleProvider(id: string)`
- **Parameters**: `id: string` - Provider ID
- **Returns**: `Promise<ApiResponse<LogisticsProvider>>`
- **Description**: Toggle provider active status

##### `setDefaultProvider(id: string)`
- **Parameters**: `id: string` - Provider ID
- **Returns**: `Promise<ApiResponse<LogisticsProvider>>`
- **Description**: Set provider as default

##### `deleteProvider(id: string)`
- **Parameters**: `id: string` - Provider ID
- **Returns**: `Promise<ApiResponse>`
- **Description**: Delete logistics provider

---

### logisticsApi

**File**: `src/api/endpoints/logistics.ts`

#### Methods

##### `trackShipment(params: { orderId?: string; trackingNumber?: string; providerType?: string })`
- **Parameters**: 
  - `params: { orderId?: string; trackingNumber?: string; providerType?: string }` - Tracking parameters
- **Returns**: `Promise<ApiResponse<ShipmentTracking>>`
- **Description**: Track shipment by order ID or tracking number
- **Example**:
  ```typescript
  const response = await logisticsApi.trackShipment({ trackingNumber: 'AWB123456' })
  ```

##### `calculateRates(data, compareAll?, providerType?)`
- **Parameters**: 
  - `data: { pickup: {...}; delivery: {...}; weight: number; dimensions?: {...}; codAmount?: number }` - Rate calculation data
  - `compareAll?: boolean` - Compare rates from all providers
  - `providerType?: string` - Specific provider type
- **Returns**: `Promise<ApiResponse<ShippingRate[] | RateComparisonResponse>>`
- **Description**: Calculate shipping rates (single or compare all providers)

##### `createShipment(data: CreateShipmentRequest, providerId?)`
- **Parameters**: 
  - `data: CreateShipmentRequest` - Shipment data
  - `providerId?: string` - Specific provider ID
- **Returns**: `Promise<ApiResponse<LogisticsShipment>>`
- **Description**: Create a new shipment for an order (Admin/Vendor)

##### `getShipment(orderId: string)`
- **Parameters**: `orderId: string` - Order ID
- **Returns**: `Promise<ApiResponse<LogisticsShipment[]>>`
- **Description**: Get shipment status for an order

##### `generateLabel(shipmentId: string)`
- **Parameters**: `shipmentId: string` - Shipment ID
- **Returns**: `Promise<ApiResponse<{ labelUrl: string; awbNumber: string }>>`
- **Description**: Generate shipping label for a shipment (Admin/Vendor)

##### `schedulePickup(shipmentId: string, data: SchedulePickupRequest)`
- **Parameters**: 
  - `shipmentId: string` - Shipment ID
  - `data: SchedulePickupRequest` - Pickup schedule data
- **Returns**: `Promise<ApiResponse<{ success: boolean; pickupDate: string }>>`
- **Description**: Schedule a pickup for a shipment (Admin/Vendor)

##### `cancelShipment(shipmentId: string, data?: CancelShipmentRequest)`
- **Parameters**: 
  - `shipmentId: string` - Shipment ID
  - `data?: CancelShipmentRequest` - Cancellation reason
- **Returns**: `Promise<ApiResponse<LogisticsShipment>>`
- **Description**: Cancel a shipment (Admin/Vendor)

##### `createReturn(data: CreateReturnRequest)`
- **Parameters**: `data: CreateReturnRequest` - Return shipment data
- **Returns**: `Promise<ApiResponse<{ id: string; awbNumber: string; trackingNumber: string }>>`
- **Description**: Create a return shipment for an order

---

## Summary

This API reference documents all available API functions in the Ecommerce Frontend application. The APIs are organized by feature area and include:

- **Core APIs**: Authentication, Products, Cart, Orders, Payments
- **User Features**: Reviews, Wishlist, Coupons, Notifications, Loyalty
- **Order & Payment Enhancements**: Order notes, state management, advanced payments
- **Product Management**: Advanced products, featured products, collections, specifications, digital products, subscriptions, pre-orders, gift cards
- **Search & Discovery**: Advanced search, recommendations, recently viewed, saved searches, search index management
- **Shipping & Tax**: Shipping methods, shipping carriers, tax calculations, carrier rates, shipping labels
- **Security**: 2FA, trusted devices, sessions, API keys, login attempts
- **Social & Commerce**: User-generated content, social login, product sharing, influencers
- **Subscriptions**: Subscription management, pause, resume, skip, change frequency, cancel
- **Support**: FAQs, tickets, customer service enhanced (knowledge base, troubleshooting, video tutorials, callback scheduling)
- **Wallet**: Balance, funds, credits, invoices
- **Vendor**: Vendor dashboard and products
- **Webhooks**: Webhook event monitoring
- **Admin APIs**: User management, order management, analytics
- **Content & Media**: CMS pages, blog, banners, media library (upload, optimize, resize, variants)
- **Compliance**: GDPR, PCI, tax calculations, legal documents
- **Customer Experience**: Product Q&A, size guides, videos, social proof, recently viewed, waitlist, product alerts
- **CRM**: Customer 360, RFM analysis, segmentation, tags, notes
- **Currency**: Currency management, exchange rates, conversion
- **Gifts**: Gift registries, gift sending, gift tracking
- **Internationalization**: Regional pricing, availability, payment methods, shipping carriers, compliance, stores
- **Integrations**: Third-party integration management
- **Languages**: Language and translation management
- **Marketing**: Flash sales, deals, bundles, recommendations, abandoned carts
- **Mobile**: App version, device registration, deep links, mobile payments, push notifications
- **Multi-Tenant**: Tenant management and statistics
- **Operations**: Bulk operations, import/export, batch requests, job queue management
- **API Management**: Versioning, deprecation, gateway, rate limiting
- **Inventory**: Basic inventory management, stock updates, movement history
- **Advanced Admin Features**: Advanced inventory, advanced analytics, payment gateways, feature flags
- **System & Infrastructure**: Monitoring, disaster recovery, migrations, observability (SLA/SLO)
- **Logistics**: Multi-provider logistics management (Shiprocket, Delhivery, etc.), provider configuration, shipment tracking, rate calculation, shipment creation, label generation, pickup scheduling, returns

All API methods return a `Promise<ApiResponse<T>>` where `T` is the response data type. Methods marked as "(Admin)" require admin privileges.

For type definitions, see `src/api/types.ts`.

---

