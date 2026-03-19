<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark">
    <HeaderTemp4 />
    <main class="container mx-auto px-4 py-8 flex-1">
      <h1 class="text-3xl font-bold mb-8">Checkout</h1>
      
      <div v-if="isLoading" class="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
      
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div
          v-if="authStore.user && !authStore.user.isVerified"
          class="lg:col-span-3 p-4 rounded-lg bg-amber-50 border border-amber-200"
        >
          <p class="text-amber-800 font-medium">You must verify your email before placing an order.</p>
          <p class="text-amber-700 text-sm mt-1">
            <router-link
              :to="{ path: '/check-email', query: { email: authStore.user?.email || '' } }"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Resend verification email
            </router-link>
            or
            <router-link to="/profile" class="font-medium text-primary-600 hover:text-primary-500">
              go to Profile
            </router-link>.
          </p>
        </div>
        <div class="lg:col-span-2">
          <div class="card mb-6">
            <h2 class="text-xl font-bold mb-4">Shipping Address</h2>
            <div v-if="addressesLoading" class="flex justify-center py-4">
              <LoadingSpinner size="md" />
            </div>
            <template v-else>
              <div v-if="addresses.length === 0 && !showAddressForm" class="text-gray-600 mb-4">
                No saved addresses. Add one below.
              </div>
              <div v-else-if="!showAddressForm" class="space-y-3 mb-4">
                <label
                  v-for="addr in addresses"
                  :key="addr.id"
                  class="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  :class="{ 'border-primary-600 bg-primary-50': selectedShippingAddressId === addr.id }"
                >
                  <input
                    v-model="selectedShippingAddressId"
                    type="radio"
                    :value="addr.id"
                    name="shipping-address"
                    class="mt-1 w-4 h-4 text-primary-600"
                  />
                  <div class="flex-1">
                    <p class="font-medium">{{ addr.firstName }} {{ addr.lastName }}</p>
                    <p class="text-gray-600 text-sm">{{ addr.street }}</p>
                    <p class="text-gray-600 text-sm">{{ addr.city }}, {{ addr.state }} {{ addr.zipCode }}, {{ addr.country }}</p>
                    <p v-if="addr.phone" class="text-gray-600 text-sm">{{ addr.phone }}</p>
                  </div>
                </label>
              </div>
              <div v-if="showAddressForm" class="border rounded-lg p-4 mb-4 bg-gray-50 space-y-3">
                <h3 class="font-semibold">New address</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    v-model="newAddress.firstName"
                    type="text"
                    placeholder="First name"
                    class="border rounded px-3 py-2"
                    required
                  />
                  <input
                    v-model="newAddress.lastName"
                    type="text"
                    placeholder="Last name"
                    class="border rounded px-3 py-2"
                    required
                  />
                </div>
                <input
                  v-model="newAddress.street"
                  type="text"
                  placeholder="Street address"
                  class="border rounded px-3 py-2 w-full"
                  required
                />
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    v-model="newAddress.city"
                    type="text"
                    placeholder="City"
                    class="border rounded px-3 py-2"
                    required
                  />
                  <input
                    v-model="newAddress.state"
                    type="text"
                    placeholder="State"
                    class="border rounded px-3 py-2"
                  />
                  <input
                    v-model="newAddress.zipCode"
                    type="text"
                    placeholder="ZIP / Postal code"
                    class="border rounded px-3 py-2"
                    required
                  />
                </div>
                <input
                  v-model="newAddress.country"
                  type="text"
                  placeholder="Country"
                  class="border rounded px-3 py-2 w-full"
                  required
                />
                <input
                  v-model="newAddress.phone"
                  type="tel"
                  placeholder="Phone (optional)"
                  class="border rounded px-3 py-2 w-full"
                />
                <div class="flex gap-2">
                  <Button variant="primary" size="sm" :disabled="savingAddress" @click="handleSaveNewAddress">
                    {{ savingAddress ? 'Saving...' : 'Save address' }}
                  </Button>
                  <Button variant="secondary" size="sm" :disabled="savingAddress" @click="showAddressForm = false">
                    Cancel
                  </Button>
                </div>
              </div>
              <Button
                v-if="!showAddressForm"
                variant="outline"
                size="sm"
                @click="showAddressForm = true"
              >
                + Add new address
              </Button>
            </template>
          </div>
          
          <div class="card mb-6">
            <h2 class="text-xl font-bold mb-4">Payment Method</h2>
            <div class="space-y-3">
              <label
                v-for="method in paymentMethods"
                :key="method.value"
                class="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                :class="{ 'border-primary-600 bg-primary-50': paymentMethod === method.value }"
              >
                <input
                  v-model="paymentMethod"
                  type="radio"
                  :value="method.value"
                  name="payment-method"
                  class="w-4 h-4 text-primary-600"
                />
                <span class="font-medium">{{ method.label }}</span>
              </label>
            </div>
          </div>
        </div>
        
        <div class="lg:col-span-1">
          <div class="card">
            <h2 class="text-xl font-bold mb-4">Order Summary</h2>
            
            <!-- Coupon Input -->
            <div class="mb-4 pb-4 border-b">
              <h3 class="text-sm font-medium text-gray-700 mb-2">Have a coupon code?</h3>
              <CouponInput
                v-model="appliedCoupon"
                :cart-total="cart?.subtotal || 0"
                @applied="handleCouponApplied"
                @removed="handleCouponRemoved"
              />
            </div>
            
            <div v-if="cart" class="space-y-2">
              <div v-if="cart.items?.length" class="mb-3 pb-3 border-b space-y-1 max-h-32 overflow-y-auto">
                <div
                  v-for="item in cart.items"
                  :key="item.id"
                  class="flex justify-between text-sm"
                >
                  <span class="truncate">{{ item.product?.name ?? (item.service ? item.service.name + (item.service.category ? ` (${item.service.category.name})` : '') : 'Item') }} × {{ item.quantity }}</span>
                  <span class="flex-shrink-0 ml-2">{{ formatPrice(item.subtotal) }}</span>
                </div>
              </div>
              <p v-if="hasServiceItems" class="text-xs text-gray-600 mb-2">Service quantity is based on the related product/category in your order; total value = price × that quantity.</p>
              <div class="flex justify-between">
                <span>Subtotal</span>
                <span>{{ formatPrice(cart.subtotal) }}</span>
              </div>
              <div v-if="couponDiscount > 0" class="flex justify-between text-green-600">
                <span>Coupon Discount</span>
                <span>-{{ formatPrice(couponDiscount) }}</span>
              </div>
              <div class="flex justify-between font-bold text-lg pt-4 border-t">
                <span>Total</span>
                <span>{{ formatPrice(cart.total - couponDiscount) }}</span>
              </div>
            </div>
            <p v-if="showOnlinePaymentUnavailable" class="mt-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
              Online payment is not available yet. Select <strong>Cash on Delivery</strong> to place your order. Payment will be collected on delivery.
            </p>
            <Button
              variant="primary"
              class="w-full mt-4"
              :loading="isProcessing"
              :disabled="!canPlaceOrderWithPayment || !isEmailVerified"
              @click="handleCheckout"
            >
              Place Order
            </Button>
          </div>
        </div>
      </div>
    </main>

    <FooterTemp4 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/api/endpoints/auth'
import { ordersApi } from '@/api/endpoints/orders'
import { paymentsApi } from '@/api/endpoints/payments'
import { useUIStore } from '@/stores/ui'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import Toast from '@/components/common/Toast.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import CouponInput from '@/components/coupons/CouponInput.vue'
import type { Address, Coupon, PaymentGateway } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import { extractErrorMessage } from '@/utils/errorHandler'
import { submitPaymentRedirectForm } from '@/utils/paymentRedirect'

const { formatPrice } = usePriceFormatter()
const router = useRouter()
const cartStore = useCartStore()
const authStore = useAuthStore()
const uiStore = useUIStore()

const isEmailVerified = computed(() => !!authStore.user?.isVerified || !!authStore.user?.emailVerified)
const isLoading = ref(false)
const isProcessing = ref(false)
const addressesLoading = ref(false)
const addresses = ref<Address[]>([])
const selectedShippingAddressId = ref('')
const showAddressForm = ref(false)
const savingAddress = ref(false)
const appliedCoupon = ref<Coupon | null>(null)
const couponDiscount = ref(0)

const newAddress = ref({
  firstName: '',
  lastName: '',
  street: '',
  city: '',
  state: '',
  zipCode: '',
  country: '',
  phone: ''
})

const paymentMethod = ref('cod')
const availableGateways = ref<PaymentGateway[]>([])
const gatewaysLoading = ref(true)

const cart = computed(() => cartStore.cart)

const hasServiceItems = computed(
  () => (cart.value?.items ?? []).some((item) => item.serviceId != null || item.service != null)
)

/** Gateways that are available for payment (backend: integrationStatus === 'available'). */
const availableGatewaysOnly = computed(() =>
  availableGateways.value.filter((g) => g.integrationStatus === 'available')
)

/** Payment options: COD plus one per available gateway; value = backend paymentMethod (e.g. payu, cod). */
const paymentMethods = computed(() => {
  const options = [{ value: 'cod', label: 'Cash on Delivery' }]
  for (const g of availableGatewaysOnly.value) {
    options.push({ value: g.type.toLowerCase(), label: g.name })
  }
  return options
})

/** Selected gateway object (for create-intent gateway type); null when COD. */
const selectedGateway = computed(() => {
  if (paymentMethod.value === 'cod') return null
  return availableGatewaysOnly.value.find((g) => g.type.toLowerCase() === paymentMethod.value) ?? null
})

/** COD always allowed; online allowed when selected gateway is available. */
const canPlaceOrderWithPayment = computed(
  () => paymentMethod.value === 'cod' || selectedGateway.value != null
)

/** Show "online payment not available" when user chose online but no available gateways (and done loading). */
const showOnlinePaymentUnavailable = computed(
  () =>
    !gatewaysLoading.value &&
    paymentMethod.value !== 'cod' &&
    availableGatewaysOnly.value.length === 0
)

async function loadGateways() {
  gatewaysLoading.value = true
  try {
    const response = await paymentsApi.getGateways()
    availableGateways.value = Array.isArray(response.data) ? (response.data as PaymentGateway[]) : []
  } catch {
    availableGateways.value = []
  } finally {
    gatewaysLoading.value = false
  }
}

async function loadAddresses() {
  addressesLoading.value = true
  try {
    const [listRes, defaultRes] = await Promise.all([
      authApi.getAddresses(),
      authApi.getDefaultAddress().catch(() => ({ success: false, data: null }))
    ])
    if (listRes.success && listRes.data) {
      addresses.value = listRes.data
      if (defaultRes.success && defaultRes.data) {
        selectedShippingAddressId.value = defaultRes.data.id
      } else if (addresses.value.length > 0 && !selectedShippingAddressId.value) {
        const defaultAddr = addresses.value.find((a) => a.isDefault) ?? addresses.value[0]
        selectedShippingAddressId.value = defaultAddr.id
      }
    }
  } finally {
    addressesLoading.value = false
  }
}

async function handleSaveNewAddress() {
  const a = newAddress.value
  if (!a.firstName?.trim() || !a.lastName?.trim() || !a.street?.trim() || !a.city?.trim() || !a.zipCode?.trim() || !a.country?.trim()) {
    uiStore.showNotification('warning', 'Please fill required fields: name, street, city, ZIP, country')
    return
  }
  savingAddress.value = true
  try {
    const res = await authApi.createAddress({
      type: 'shipping',
      firstName: a.firstName.trim(),
      lastName: a.lastName.trim(),
      street: a.street.trim(),
      city: a.city.trim(),
      state: a.state?.trim() ?? '',
      zipCode: a.zipCode.trim(),
      country: a.country.trim(),
      phone: a.phone?.trim(),
      isDefault: false
    })
    if (res.success && res.data) {
      addresses.value.push(res.data)
      selectedShippingAddressId.value = res.data.id
      showAddressForm.value = false
      newAddress.value = { firstName: '', lastName: '', street: '', city: '', state: '', zipCode: '', country: '', phone: '' }
      uiStore.showNotification('success', 'Address added')
    } else {
      uiStore.showNotification('error', res.error || 'Failed to add address')
    }
  } catch {
    uiStore.showNotification('error', 'Failed to add address')
  } finally {
    savingAddress.value = false
  }
}

onMounted(async () => {
  if (!cart.value || cart.value.items.length === 0) {
    router.push({ name: 'Cart' })
    return
  }
  await Promise.all([
    loadAddresses(),
    loadGateways(),
    (async () => {
      const response = await authApi.getProfile()
      if (response.success && response.data) {
        const data = response.data
        authStore.updateUser({ ...data, isVerified: data.emailVerified ?? data.isVerified })
      }
    })()
  ])
})

const handleCheckout = async () => {
  if (!cart.value) return
  if (!isEmailVerified.value) {
    uiStore.showNotification('warning', 'Please verify your email to place an order.')
    router.push({ path: '/check-email', query: { email: authStore.user?.email || '' } })
    return
  }
  if (!selectedShippingAddressId.value) {
    uiStore.showNotification('warning', 'Please select or add a shipping address')
    return
  }
  if (!canPlaceOrderWithPayment.value) {
    uiStore.showNotification('warning', 'Please select Cash on Delivery. Online payment is not available yet.')
    return
  }
  isProcessing.value = true
  try {
    const response = await ordersApi.createOrder({
      shippingAddressId: selectedShippingAddressId.value,
      billingAddressId: selectedShippingAddressId.value,
      paymentMethod: paymentMethod.value || 'cod',
      couponCode: appliedCoupon.value?.code
    })
    if (!response.success || !response.data) {
      const errMsg = response.error || 'Failed to place order'
      const isEmailVerificationError = typeof errMsg === 'string' && /email must be verified|verified to place an order/i.test(errMsg)
      if (isEmailVerificationError) {
        uiStore.showNotification('warning', errMsg)
        router.push({ path: '/check-email', query: { email: authStore.user?.email || '' } })
      } else {
        uiStore.showNotification('error', errMsg)
      }
      return
    }
    const orderId = response.data.id
    cartStore.clearCart()
    uiStore.showNotification('success', 'Order placed successfully!')

    if (paymentMethod.value === 'cod') {
      router.push({ name: 'OrderDetail', params: { id: orderId } })
      return
    }

    const gateway = selectedGateway.value
    if (!gateway) {
      router.push({ name: 'OrderDetail', params: { id: orderId } })
      return
    }
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const intentRes = await paymentsApi.createIntent(orderId, gateway.type, {
      successRedirectUrl: `${origin}/order/success`,
      failureRedirectUrl: `${origin}/order/failure`
    })
    if (!intentRes.success || !intentRes.data) {
      uiStore.showNotification('error', intentRes.error || 'Could not start payment. You can complete payment from your order.')
      router.push({ name: 'OrderDetail', params: { id: orderId }, query: { payment: 'pending' } })
      return
    }
    const data = intentRes.data
    if (data.redirectUrl && data.formData && Object.keys(data.formData).length > 0) {
      submitPaymentRedirectForm(data.redirectUrl, data.formData)
      return
    }
    router.push({ name: 'OrderDetail', params: { id: orderId }, query: { payment: 'pending' } })
  } catch (error: unknown) {
    const err = error as { response?: { status?: number; data?: { error?: string } } }
    const status = err.response?.status
    const message = err.response?.data?.error ?? ''
    if (status === 403 && typeof message === 'string' && /email must be verified|verified to place an order/i.test(message)) {
      uiStore.showNotification('warning', message || 'Email must be verified to place an order.')
      router.push({ path: '/check-email', query: { email: authStore.user?.email || '' } })
    } else {
      uiStore.showNotification('error', extractErrorMessage(error as Error))
    }
  } finally {
    isProcessing.value = false
  }
}

const handleCouponApplied = (coupon: Coupon, discount: number) => {
  couponDiscount.value = discount
  uiStore.showNotification('success', `Coupon "${coupon.code}" applied successfully!`)
}

const handleCouponRemoved = () => {
  couponDiscount.value = 0
  uiStore.showNotification('info', 'Coupon removed')
}
</script>

