<template>
  <form @submit.prevent="handleSubmit" class="space-y-6">
    <div>
      <h3 class="text-lg font-semibold mb-4">Store Information</h3>
      <div class="space-y-4">
        <Input v-model="settings.storeName" label="Store Name" required />
        <Input v-model="settings.storeEmail" type="email" label="Store Email" required />
        <Input v-model="settings.storePhone" label="Store Phone" />
      </div>
    </div>
    
    <div>
      <h3 class="text-lg font-semibold mb-4">Regional Settings</h3>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium mb-2">Default Currency</label>
          <select v-model="settings.defaultCurrency" class="input">
            <option
              v-for="c in currencyOptions"
              :key="c.code"
              :value="c.code"
            >
              {{ c.code }} - {{ c.name }}
            </option>
          </select>
        </div>
        <div>
          <label class="block text-sm font-medium mb-2">Default Language</label>
          <select v-model="settings.defaultLanguage" class="input">
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
          </select>
        </div>
      </div>
    </div>
    
    <Button type="submit" variant="primary" :loading="isSaving">
      Save Settings
    </Button>
  </form>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/config/store'
import { useUIStore } from '@/stores/ui'
import { currenciesApi } from '@/api/endpoints/currencies'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { Currency } from '@/api/types'

const configStore = useConfigStore()
const uiStore = useUIStore()
const isSaving = ref(false)
const currencyOptions = ref<Currency[]>([])

const settings = ref({
  storeName: configStore.config.appName,
  storeEmail: '',
  storePhone: '',
  defaultCurrency: configStore.config.defaultCurrency,
  defaultLanguage: configStore.config.defaultLanguage
})

onMounted(async () => {
  try {
    const res = await currenciesApi.getCurrencies()
    if (res.success && res.data?.length) {
      currencyOptions.value = res.data
    } else {
      currencyOptions.value = [
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' },
        { code: 'GBP', name: 'British Pound', symbol: '£' }
      ]
    }
  } catch {
    currencyOptions.value = [
      { code: 'USD', name: 'US Dollar', symbol: '$' },
      { code: 'EUR', name: 'Euro', symbol: '€' },
      { code: 'GBP', name: 'British Pound', symbol: '£' }
    ]
  }
})

const handleSubmit = async () => {
  isSaving.value = true
  try {
    configStore.setAppName(settings.value.storeName)
    configStore.setDefaultCurrency(settings.value.defaultCurrency)
    configStore.setDefaultLanguage(settings.value.defaultLanguage)
    uiStore.showNotification('success', 'Settings saved successfully!')
  } catch (error) {
    uiStore.showNotification('error', 'Failed to save settings')
  } finally {
    isSaving.value = false
  }
}
</script>

