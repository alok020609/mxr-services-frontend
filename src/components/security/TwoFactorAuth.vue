<template>
  <div class="two-factor-auth">
    <h3 class="text-lg font-bold mb-4">Two-Factor Authentication</h3>
    
    <div v-if="is2FAEnabled" class="card">
      <div class="flex items-center justify-between">
        <div>
          <p class="font-semibold text-green-600">2FA is enabled</p>
          <p class="text-sm text-gray-600 mt-1">Your account is protected with two-factor authentication</p>
        </div>
        <Button variant="danger" @click="disable2FA" :loading="isDisabling">
          Disable 2FA
        </Button>
      </div>
    </div>
    
    <div v-else class="card">
      <p class="mb-4">Add an extra layer of security to your account</p>
      <Button variant="primary" @click="setup2FA" :loading="isSettingUp">
        Setup 2FA
      </Button>
      
      <div v-if="setupData" class="mt-6 p-4 bg-gray-50 rounded-lg">
        <p class="font-semibold mb-2">Scan this QR code with your authenticator app:</p>
        <img :src="setupData.qrCode" alt="2FA QR Code" class="mx-auto mb-4" />
        <p class="text-sm text-gray-600 mb-2">Or enter this code manually:</p>
        <code class="block text-center font-mono bg-white p-2 rounded mb-4">{{ setupData.secret }}</code>
        <div class="space-y-2">
          <Input
            v-model="verificationToken"
            label="Enter verification code"
            placeholder="000000"
            maxlength="6"
          />
          <Button variant="primary" @click="verify2FA" :loading="isVerifying">
            Verify & Enable
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { securityApi, type TwoFactorSetup } from '@/api/endpoints/security'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const is2FAEnabled = ref(false)
const isSettingUp = ref(false)
const isVerifying = ref(false)
const isDisabling = ref(false)
const setupData = ref<TwoFactorSetup | null>(null)
const verificationToken = ref('')

const setup2FA = async () => {
  isSettingUp.value = true
  try {
    const response = await securityApi.setup2FA()
    if (response.success && response.data) {
      setupData.value = response.data
    } else {
      uiStore.showNotification('error', response.error || 'Failed to setup 2FA')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to setup 2FA')
  } finally {
    isSettingUp.value = false
  }
}

const verify2FA = async () => {
  if (!verificationToken.value.trim()) return
  
  isVerifying.value = true
  try {
    const response = await securityApi.verify2FASetup(verificationToken.value)
    if (response.success) {
      uiStore.showNotification('success', '2FA enabled successfully')
      is2FAEnabled.value = true
      setupData.value = null
      verificationToken.value = ''
    } else {
      uiStore.showNotification('error', response.error || 'Invalid verification code')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to verify 2FA')
  } finally {
    isVerifying.value = false
  }
}

const disable2FA = async () => {
  if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) return
  
  isDisabling.value = true
  try {
    const response = await securityApi.disable2FA()
    if (response.success) {
      uiStore.showNotification('success', '2FA disabled successfully')
      is2FAEnabled.value = false
    } else {
      uiStore.showNotification('error', response.error || 'Failed to disable 2FA')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to disable 2FA')
  } finally {
    isDisabling.value = false
  }
}
</script>

