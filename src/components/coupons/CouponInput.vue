<template>
  <div class="coupon-input">
    <div v-if="!appliedCoupon" class="space-y-2">
      <div class="flex gap-2">
        <Input
          v-model="couponCode"
          placeholder="Enter coupon code"
          class="flex-1"
          :error="error"
          @keyup.enter="validateCoupon"
        />
        <Button
          variant="primary"
          size="sm"
          @click="validateCoupon"
          :loading="isValidating"
          :disabled="!couponCode.trim()"
        >
          Apply
        </Button>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
    </div>
    
    <div v-else class="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
      <div class="flex items-center space-x-2">
        <svg class="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
        </svg>
        <div>
          <p class="text-sm font-medium text-green-800">Coupon Applied: {{ appliedCoupon.code }}</p>
          <p class="text-xs text-green-600">Discount: {{ formatDiscount(appliedCoupon) }}</p>
        </div>
      </div>
      <button
        @click="removeCoupon"
        class="text-red-600 hover:text-red-800 text-sm font-medium"
      >
        Remove
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { couponsApi } from '@/api/endpoints/coupons'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { Coupon, CouponValidation } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

interface Props {
  cartTotal: number
  modelValue?: Coupon | null
}

interface Emits {
  (e: 'update:modelValue', value: Coupon | null): void
  (e: 'applied', coupon: Coupon, discount: number): void
  (e: 'removed'): void
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null
})

const emit = defineEmits<Emits>()

const { formatPrice } = usePriceFormatter()
const uiStore = useUIStore()
const couponCode = ref('')
const isValidating = ref(false)
const error = ref('')
const successMessage = ref('')

const appliedCoupon = computed(() => props.modelValue)

const formatDiscount = (coupon: Coupon) => {
  if (coupon.type === 'percentage') {
    return `${coupon.value}% off`
  } else {
    return `${formatPrice(coupon.value)} off`
  }
}

const validateCoupon = async () => {
  if (!couponCode.value.trim()) {
    error.value = 'Please enter a coupon code'
    return
  }

  isValidating.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const response = await couponsApi.validateCoupon(couponCode.value, props.cartTotal)
    
    if (response.success && response.data) {
      const validation = response.data as CouponValidation
      
      if (validation.valid) {
        // Get full coupon details
        const couponResponse = await couponsApi.getCoupon(couponCode.value)
        
        if (couponResponse.success && couponResponse.data) {
          const coupon = couponResponse.data
          emit('update:modelValue', coupon)
          emit('applied', coupon, validation.discount)
          successMessage.value = `Coupon applied! You saved ${formatDiscount(coupon)}`
          couponCode.value = ''
        } else {
          error.value = couponResponse.error || 'Failed to get coupon details'
        }
      } else {
        error.value = validation.message || 'Invalid coupon code'
      }
    } else {
      error.value = response.error || 'Failed to validate coupon'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while validating the coupon'
    uiStore.showNotification('error', error.value)
  } finally {
    isValidating.value = false
  }
}

const removeCoupon = () => {
  emit('update:modelValue', null)
  emit('removed')
  couponCode.value = ''
  error.value = ''
  successMessage.value = ''
}
</script>

<style scoped>
.coupon-input {
  @apply w-full;
}
</style>

