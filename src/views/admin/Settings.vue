<template>
  <AdminLayout>
    <div>
      <h1 class="text-3xl font-bold mb-8">Store Settings</h1>
      
      <div v-if="isLoading" class="mb-4 flex items-center text-gray-600">
        <LoadingSpinner size="sm" />
        <span class="ml-2">Loading settings...</span>
      </div>
      
      <div class="max-w-4xl space-y-6">
        <!-- General Settings -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">General Settings</h2>
          <form @submit.prevent="handleSave">
            <div class="space-y-4">
              <Input
                v-model="settings.storeName"
                label="Store Name"
                required
              />
              <Input
                v-model="settings.storeEmail"
                type="email"
                label="Store Email"
                required
              />
              <Input
                v-model="settings.storePhone"
                label="Store Phone"
              />
              <Input
                v-model="settings.storeAddress"
                label="Store Address"
              />
              <Input
                v-model="settings.storeCity"
                label="City"
              />
              <Input
                v-model="settings.storeState"
                label="State/Province"
              />
              <Input
                v-model="settings.storeZip"
                label="ZIP/Postal Code"
              />
              <Input
                v-model="settings.storeCountry"
                label="Country"
              />
            </div>
            <Button type="submit" variant="primary" class="mt-4" :loading="isSaving">
              Save Settings
            </Button>
          </form>
        </div>
        
        <!-- Payment Settings -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Payment Settings</h2>
          <form @submit.prevent="handleSave">
            <div class="space-y-4">
              <Input
                v-model="settings.stripePublicKey"
                label="Stripe Public Key"
                placeholder="pk_..."
              />
              <Input
                v-model="settings.stripeSecretKey"
                type="password"
                label="Stripe Secret Key"
                placeholder="sk_..."
              />
              <Input
                v-model="settings.paypalClientId"
                label="PayPal Client ID"
              />
            </div>
            <Button type="submit" variant="primary" class="mt-4" :loading="isSaving">
              Save Payment Settings
            </Button>
          </form>
        </div>
        
        <!-- Shipping Settings -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Shipping Settings</h2>
          <form @submit.prevent="handleSave">
            <div class="space-y-4">
              <Input
                v-model.number="settings.defaultShippingCost"
                type="number"
                label="Default Shipping Cost"
                step="0.01"
              />
              <Input
                v-model.number="settings.freeShippingThreshold"
                type="number"
                label="Free Shipping Threshold"
                step="0.01"
              />
            </div>
            <Button type="submit" variant="primary" class="mt-4" :loading="isSaving">
              Save Shipping Settings
            </Button>
          </form>
        </div>
        
        <!-- Tax Settings -->
        <div class="card">
          <h2 class="text-xl font-bold mb-4">Tax Settings</h2>
          <form @submit.prevent="handleSave">
            <div class="space-y-4">
              <Input
                v-model.number="settings.defaultTaxRate"
                type="number"
                label="Default Tax Rate (%)"
                step="0.01"
              />
              <div>
                <label class="block text-sm font-medium mb-2">Tax Calculation Method</label>
                <select v-model="settings.taxCalculationMethod" class="input">
                  <option value="inclusive">Inclusive</option>
                  <option value="exclusive">Exclusive</option>
                </select>
              </div>
            </div>
            <Button type="submit" variant="primary" class="mt-4" :loading="isSaving">
              Save Tax Settings
            </Button>
          </form>
        </div>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { adminApi } from '@/api/endpoints/admin'
import { useConfigStore } from '@/config/store'
import { useUIStore } from '@/stores/ui'
import { sendToTerminal } from '@/utils/apiLogger'
import AdminLayout from './AdminLayout.vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'

const configStore = useConfigStore()
const uiStore = useUIStore()
const isLoading = ref(false)
const isSaving = ref(false)

const settings = ref({
  storeName: configStore.config.appName || '',
  storeEmail: '',
  storePhone: '',
  storeAddress: '',
  storeCity: '',
  storeState: '',
  storeZip: '',
  storeCountry: '',
  stripePublicKey: '',
  stripeSecretKey: '',
  paypalClientId: '',
  defaultShippingCost: 0,
  freeShippingThreshold: 0,
  defaultTaxRate: 0,
  taxCalculationMethod: 'exclusive'
})

const loadSettings = async () => {
  isLoading.value = true
  try {
    const response = await adminApi.getSettings()
    sendToTerminal('log', '[Settings] API Response:', response)
    
    if (response.success && response.data) {
      const data = response.data
      settings.value = {
        storeName: data.storeName || data.name || configStore.config.appName || '',
        storeEmail: data.storeEmail || data.email || '',
        storePhone: data.storePhone || data.phone || '',
        storeAddress: data.storeAddress || data.address || '',
        storeCity: data.storeCity || data.city || '',
        storeState: data.storeState || data.state || '',
        storeZip: data.storeZip || data.zip || data.postalCode || '',
        storeCountry: data.storeCountry || data.country || '',
        stripePublicKey: data.stripePublicKey || data.stripe?.publicKey || '',
        stripeSecretKey: data.stripeSecretKey || data.stripe?.secretKey || '',
        paypalClientId: data.paypalClientId || data.paypal?.clientId || '',
        defaultShippingCost: data.defaultShippingCost || data.shipping?.defaultCost || 0,
        freeShippingThreshold: data.freeShippingThreshold || data.shipping?.freeThreshold || 0,
        defaultTaxRate: data.defaultTaxRate || data.tax?.defaultRate || 0,
        taxCalculationMethod: data.taxCalculationMethod || data.tax?.method || 'exclusive'
      }
      sendToTerminal('log', '[Settings] Loaded settings:', settings.value)
    } else {
      sendToTerminal('warn', '[Settings] Unexpected response format:', response)
    }
  } catch (error) {
    uiStore.showNotification('error', 'Failed to load settings')
    sendToTerminal('error', '[Settings] Error loading settings:', error)
  } finally {
    isLoading.value = false
  }
}

const handleSave = async () => {
  isSaving.value = true
  try {
    const response = await adminApi.updateSettings(settings.value)
    sendToTerminal('log', '[Settings] Save response:', response)
    
    if (response.success) {
      // Update local config store
      if (settings.value.storeName) {
        configStore.setAppName(settings.value.storeName)
      }
      uiStore.showNotification('success', 'Settings saved successfully!')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to save settings')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to save settings')
    sendToTerminal('error', '[Settings] Error saving settings:', error)
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>

