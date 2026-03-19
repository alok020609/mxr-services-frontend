import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Route definitions
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/temp4/HomeTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp1frontend',
    name: 'Temp1Frontend',
    component: () => import('@/views/temp1/HomeTemp1.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp2frontend',
    name: 'Temp2Frontend',
    component: () => import('@/views/Home.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp3frontend',
    name: 'Temp3Frontend',
    component: () => import('@/views/temp3/HomeTemp3.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp4frontend',
    name: 'Temp4Frontend',
    component: () => import('@/views/temp4/HomeTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/packages',
    name: 'Packages',
    component: () => import('@/views/temp4/PackagesTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp4frontend/packages',
    name: 'Temp4Packages',
    component: () => import('@/views/temp4/PackagesTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp4frontend/products',
    name: 'Temp4Products',
    component: () => import('@/views/temp4/ProductsTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/temp4frontend/cart',
    name: 'Temp4Cart',
    component: () => import('@/views/temp4/CartTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/temp4frontend/orders',
    name: 'Temp4Orders',
    component: () => import('@/views/temp4/OrdersTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/temp4frontend/orders/:id',
    name: 'Temp4OrderDetail',
    component: () => import('@/views/temp4/OrderDetailTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/views/auth/Register.vue'),
    meta: { requiresAuth: false, hideForAuth: true }
  },
  {
    path: '/check-email',
    name: 'CheckEmail',
    component: () => import('@/views/auth/CheckEmail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('@/views/auth/ForgotPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/reset-password',
    name: 'ResetPassword',
    component: () => import('@/views/auth/ResetPassword.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/verify-email/:token?',
    name: 'VerifyEmail',
    component: () => import('@/views/auth/VerifyEmail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/products',
    name: 'Products',
    component: () => import('@/views/temp4/ProductsTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/views/temp4/ProductDetailTemp4.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/services',
    name: 'Services',
    component: () => import('@/views/Services.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/services/:id',
    name: 'ServiceDetail',
    component: () => import('@/views/ServiceDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/portfolio',
    name: 'Portfolio',
    component: () => import('@/views/Portfolio.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/contact',
    name: 'Contact',
    component: () => import('@/views/Contact.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/search',
    name: 'Search',
    component: () => import('@/views/Search.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/cart',
    name: 'Cart',
    component: () => import('@/views/temp4/CartTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/checkout',
    name: 'Checkout',
    component: () => import('@/views/Checkout.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders',
    name: 'Orders',
    component: () => import('@/views/temp4/OrdersTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('@/views/temp4/OrderDetailTemp4.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/success',
    name: 'OrderPaymentSuccess',
    component: () => import('@/views/OrderPaymentSuccess.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/order/failure',
    name: 'OrderPaymentFailure',
    component: () => import('@/views/OrderPaymentFailure.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('@/views/Profile.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/addresses',
    name: 'Addresses',
    component: () => import('@/views/Addresses.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wishlist',
    name: 'Wishlist',
    component: () => import('@/views/Wishlist.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/my-coupons',
    name: 'MyCoupons',
    component: () => import('@/views/MyCoupons.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/waitlist',
    name: 'Waitlist',
    component: () => import('@/views/Waitlist.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/product-alerts',
    name: 'ProductAlerts',
    component: () => import('@/views/ProductAlerts.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/customer-service',
    name: 'CustomerService',
    component: () => import('@/views/CustomerService.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/loyalty',
    name: 'Loyalty',
    component: () => import('@/views/Loyalty.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/notifications',
    name: 'Notifications',
    component: () => import('@/views/Notifications.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gifts/registries',
    name: 'GiftRegistries',
    component: () => import('@/views/GiftRegistries.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/gifts/track/:trackingNumber',
    name: 'GiftTracking',
    component: () => import('@/views/GiftTracking.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/stores',
    name: 'Stores',
    component: () => import('@/views/Stores.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/deals',
    name: 'Deals',
    component: () => import('@/views/Deals.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/security',
    name: 'Security',
    component: () => import('@/views/Security.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/wallet',
    name: 'Wallet',
    component: () => import('@/views/Wallet.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/support',
    name: 'Support',
    component: () => import('@/views/Support.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/support/tickets/:id',
    name: 'TicketDetail',
    component: () => import('@/views/TicketDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/subscriptions',
    name: 'Subscriptions',
    component: () => import('@/views/Subscriptions.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/privacy',
    name: 'Privacy',
    component: () => import('@/views/Privacy.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/pages',
    name: 'CmsPages',
    component: () => import('@/views/CmsPages.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/pages/:slug',
    name: 'CmsPageDetail',
    component: () => import('@/views/CmsPageDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/blog',
    name: 'Blog',
    component: () => import('@/views/Blog.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/blog/:slug',
    name: 'BlogPostDetail',
    component: () => import('@/views/BlogPostDetail.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/legal/:type',
    name: 'LegalDocument',
    component: () => import('@/views/LegalDocument.vue'),
    meta: { requiresAuth: false },
    props: (route) => ({ documentType: route.params.type })
  },
  // Admin routes
  {
    path: '/admin',
    component: () => import('@/views/admin/AdminLayout.vue'),
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'AdminDashboard',
        component: () => import('@/views/admin/Dashboard.vue')
      },
      {
        path: 'users',
        name: 'AdminUsers',
        component: () => import('@/views/admin/Users.vue')
      },
      {
        path: 'users/:id',
        name: 'AdminUserDetail',
        component: () => import('@/views/admin/UserDetail.vue')
      },
      {
        path: 'products',
        name: 'AdminProducts',
        component: () => import('@/views/admin/Products.vue')
      },
      {
        path: 'products/import',
        name: 'AdminImportProducts',
        component: () => import('@/views/admin/ImportProducts.vue')
      },
      {
        path: 'products/advanced',
        name: 'AdminAdvancedProducts',
        component: () => import('@/views/admin/AdvancedProducts.vue')
      },
      {
        path: 'products/questions',
        name: 'AdminProductQuestions',
        component: () => import('@/views/admin/ProductQuestions.vue')
      },
      {
        path: 'categories',
        name: 'AdminCategories',
        component: () => import('@/views/admin/Categories.vue')
      },
      {
        path: 'orders',
        name: 'AdminOrders',
        component: () => import('@/views/admin/Orders.vue')
      },
      {
        path: 'orders/:id',
        name: 'AdminOrderDetail',
        component: () => import('@/views/admin/OrderDetail.vue')
      },
      {
        path: 'settings',
        name: 'AdminSettings',
        component: () => import('@/views/admin/Settings.vue')
      },
      {
        path: 'mail-settings',
        name: 'AdminMailSettings',
        component: () => import('@/views/admin/MailSettings.vue')
      },
      {
        path: 'payment-gateways',
        name: 'AdminPaymentGateways',
        component: () => import('@/views/admin/PaymentGateways.vue')
      },
      {
        path: 'email-services',
        name: 'AdminEmailServices',
        component: () => import('@/views/admin/EmailServices.vue')
      },
      {
        path: 'contact-submissions',
        name: 'AdminContactSubmissions',
        component: () => import('@/views/admin/ContactSubmissions.vue')
      },
      {
        path: 'contact-submissions/:id',
        name: 'AdminContactSubmissionDetail',
        component: () => import('@/views/admin/ContactSubmissionDetail.vue')
      },
      {
        path: 'services',
        name: 'AdminServices',
        component: () => import('@/views/admin/Services.vue')
      },
      {
        path: 'payments/advanced',
        name: 'AdminAdvancedPayments',
        component: () => import('@/views/admin/AdvancedPayments.vue')
      },
        {
          path: 'cms',
          name: 'AdminCMS',
          component: () => import('@/views/admin/CMS.vue')
        },
        {
          path: 'compliance',
          name: 'AdminCompliance',
          component: () => import('@/views/admin/Compliance.vue')
        },
      {
        path: 'coupons',
        name: 'AdminCoupons',
        component: () => import('@/views/admin/Coupons.vue')
      },
      {
        path: 'crm',
        name: 'AdminCRM',
        component: () => import('@/views/admin/CRM.vue')
      },
      {
        path: 'currencies',
        name: 'AdminCurrencies',
        component: () => import('@/views/admin/Currencies.vue')
      },
      {
        path: 'inventory',
        name: 'AdminInventory',
        component: () => import('@/views/admin/Inventory.vue')
      },
      {
        path: 'inventory/advanced',
        name: 'AdminAdvancedInventory',
        component: () => import('@/views/admin/AdvancedInventory.vue')
      },
      {
        path: 'analytics',
        name: 'AdminAnalytics',
        component: () => import('@/views/admin/Analytics.vue')
      },
      {
        path: 'analytics/advanced',
        name: 'AdminAdvancedAnalytics',
        component: () => import('@/views/admin/AdvancedAnalytics.vue')
      },
      {
        path: 'operations',
        name: 'AdminOperations',
        component: () => import('@/views/admin/Operations.vue')
      },
      {
        path: 'logistics-providers',
        name: 'AdminLogisticsProviders',
        component: () => import('@/views/admin/LogisticsProviders.vue')
      },
      {
        path: 'logistics',
        name: 'AdminLogistics',
        component: () => import('@/views/admin/Logistics.vue')
      },
      {
        path: 'tenants',
        name: 'AdminTenants',
        component: () => import('@/views/admin/Tenants.vue')
      },
      {
        path: 'advanced',
        name: 'AdminAdvanced',
        component: () => import('@/views/admin/Advanced.vue')
      },
      {
        path: 'api/deprecation',
        name: 'AdminApiDeprecation',
        component: () => import('@/views/admin/ApiDeprecation.vue')
      },
      {
        path: 'api/gateway',
        name: 'AdminApiGateway',
        component: () => import('@/views/admin/ApiGateway.vue')
      },
      {
        path: 'disaster-recovery',
        name: 'AdminDisasterRecovery',
        component: () => import('@/views/admin/DisasterRecovery.vue')
      },
      {
        path: 'feature-flags',
        name: 'AdminFeatureFlags',
        component: () => import('@/views/admin/FeatureFlags.vue')
      },
      {
        path: 'jobs',
        name: 'AdminJobQueue',
        component: () => import('@/views/admin/JobQueue.vue')
      },
      {
        path: 'migrations',
        name: 'AdminMigrations',
        component: () => import('@/views/admin/Migrations.vue')
      },
      {
        path: 'monitoring',
        name: 'AdminMonitoring',
        component: () => import('@/views/admin/Monitoring.vue')
      },
      {
        path: 'observability',
        name: 'AdminObservability',
        component: () => import('@/views/admin/Observability.vue')
      },
      {
        path: 'media',
        name: 'AdminMedia',
        component: () => import('@/views/admin/Media.vue')
      },
      {
        path: 'languages',
        name: 'AdminLanguages',
        component: () => import('@/views/admin/Languages.vue')
      },
      {
        path: 'marketing',
        name: 'AdminMarketing',
        component: () => import('@/views/admin/Marketing.vue')
      },
      {
        path: 'mobile',
        name: 'AdminMobile',
        component: () => import('@/views/admin/Mobile.vue')
      },
      {
        path: 'integrations',
        name: 'AdminIntegrations',
        component: () => import('@/views/admin/Integrations.vue')
      },
      {
        path: 'stores',
        name: 'AdminStores',
        component: () => import('@/views/admin/Stores.vue')
      },
      {
        path: 'search-index',
        name: 'AdminSearchIndex',
        component: () => import('@/views/admin/SearchIndex.vue')
      }
    ]
  },
  // Vendor routes
  {
    path: '/vendor',
    component: () => import('@/views/vendor/VendorLayout.vue'),
    meta: { requiresAuth: true, requiresVendor: true },
    children: [
      {
        path: '',
        name: 'VendorDashboard',
        component: () => import('@/views/vendor/Dashboard.vue')
      },
      {
        path: 'products',
        name: 'VendorProducts',
        component: () => import('@/views/vendor/Products.vue')
      },
      {
        path: 'products/import',
        name: 'VendorImportProducts',
        component: () => import('@/views/vendor/ImportProducts.vue')
      },
      {
        path: 'categories',
        name: 'VendorCategories',
        component: () => import('@/views/vendor/Categories.vue')
      },
      {
        path: 'payouts',
        name: 'VendorPayouts',
        component: () => import('@/views/vendor/Payouts.vue')
      }
    ]
  },
  // Setup wizard
  {
    path: '/setup',
    name: 'Setup',
    component: () => import('@/views/setup/SetupWizard.vue'),
    meta: { requiresAuth: false }
  },
  // 404 page
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/NotFound.vue'),
    meta: { requiresAuth: false }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const isAuthenticated = authStore.isAuthenticated
  const isAdmin = authStore.isAdmin
  const isVendor = authStore.isVendor
  const user = authStore.user
  
  // Debug logging in development
  if (import.meta.env.DEV && (to.meta.requiresAdmin || to.meta.requiresVendor)) {
    console.log('[Router Guard] Route check:', {
      path: to.path,
      isAuthenticated,
      isAdmin,
      isVendor,
      userRole: user?.role,
      user: user
    })
  }
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login', query: { redirect: to.fullPath } })
    return
  }
  
  // Check if route should be hidden when authenticated (e.g., login page)
  if (to.meta.hideForAuth && isAuthenticated) {
    // Redirect based on role after login
    if (isVendor) {
      next({ name: 'VendorDashboard' })
    } else if (isAdmin) {
      next({ name: 'AdminDashboard' })
    } else {
      next({ name: 'Home' })
    }
    return
  }
  
  // Check if route requires admin access
  if (to.meta.requiresAdmin) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (!isAdmin) {
      console.warn('[Router Guard] Admin access denied:', {
        userRole: user?.role,
        expected: 'admin',
        path: to.path
      })
      // Redirect vendors to vendor dashboard, others to home
      if (isVendor) {
        next({ name: 'VendorDashboard' })
      } else {
        next({ name: 'Home' })
      }
      return
    }
  }
  
  // Check if route requires vendor access
  if (to.meta.requiresVendor) {
    if (!isAuthenticated) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
      return
    }
    if (!isVendor) {
      console.warn('[Router Guard] Vendor access denied:', {
        userRole: user?.role,
        expected: 'vendor',
        path: to.path
      })
      // Redirect admins to admin dashboard, others to home
      if (isAdmin) {
        next({ name: 'AdminDashboard' })
      } else {
        next({ name: 'Home' })
      }
      return
    }
  }
  
  next()
})

export default router

