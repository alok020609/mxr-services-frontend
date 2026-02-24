<template>
  <div class="referral-program card">
    <h3 class="text-lg font-bold mb-4">Referral Program</h3>
    
    <div v-if="referralCode" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Your Referral Code</label>
        <div class="flex items-center gap-2">
          <input
            :value="referralCode.code"
            readonly
            class="input flex-1 font-mono"
          />
          <Button
            variant="secondary"
            size="sm"
            @click="copyCode"
          >
            Copy
          </Button>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-4">
        <div class="p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">{{ referralCode.uses }}</div>
          <div class="text-sm text-gray-600">Referrals</div>
        </div>
        <div v-if="referralCode.reward" class="p-3 bg-gray-50 rounded-lg">
          <div class="text-2xl font-bold text-primary-600">{{ referralCode.reward }}</div>
          <div class="text-sm text-gray-600">Reward Points</div>
        </div>
      </div>
      
      <div v-if="referralCode.expiresAt" class="text-sm text-gray-500">
        Expires: {{ formatDate(referralCode.expiresAt) }}
      </div>
    </div>
    
    <div v-else class="text-center py-8">
      <p class="text-gray-500 mb-4">No referral code available</p>
      <Button variant="primary" @click="loadReferralCode">Get Referral Code</Button>
    </div>
    
    <!-- Apply Referral Code -->
    <div class="mt-6 pt-6 border-t">
      <h4 class="font-semibold mb-3">Apply Referral Code</h4>
      <div class="flex gap-2">
        <Input
          v-model="codeToApply"
          placeholder="Enter referral code"
          class="flex-1"
        />
        <Button
          variant="primary"
          @click="applyCode"
          :loading="isApplying"
          :disabled="!codeToApply.trim()"
        >
          Apply
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { loyaltyApi } from '@/api/endpoints/loyalty'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { ReferralCode } from '@/api/types'

const uiStore = useUIStore()
const referralCode = ref<ReferralCode | null>(null)
const codeToApply = ref('')
const isApplying = ref(false)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadReferralCode = async () => {
  try {
    const response = await loyaltyApi.getReferral()
    if (response.success && response.data) {
      referralCode.value = response.data
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load referral code')
  }
}

const copyCode = () => {
  if (referralCode.value) {
    navigator.clipboard.writeText(referralCode.value.code)
    uiStore.showNotification('success', 'Referral code copied!')
  }
}

const applyCode = async () => {
  if (!codeToApply.value.trim()) return
  
  isApplying.value = true
  try {
    const response = await loyaltyApi.applyReferral(codeToApply.value.trim())
    if (response.success) {
      uiStore.showNotification('success', 'Referral code applied successfully!')
      codeToApply.value = ''
      await loadReferralCode()
    } else {
      uiStore.showNotification('error', response.error || 'Invalid referral code')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to apply referral code')
  } finally {
    isApplying.value = false
  }
}

onMounted(() => {
  loadReferralCode()
})
</script>

