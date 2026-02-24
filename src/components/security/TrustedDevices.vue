<template>
  <div class="trusted-devices">
    <h3 class="text-lg font-bold mb-4">Trusted Devices</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="devices.length === 0" class="text-center py-8 text-gray-500">
      <p>No trusted devices</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="device in devices"
        :key="device.id"
        class="card flex items-center justify-between"
      >
        <div>
          <p class="font-semibold">{{ device.deviceName }}</p>
          <p class="text-sm text-gray-600">{{ device.deviceType }}</p>
          <p class="text-xs text-gray-500 mt-1">
            Last used: {{ formatDate(device.lastUsed) }}
          </p>
        </div>
        <Button
          variant="danger"
          size="sm"
          @click="removeDevice(device.id)"
          :loading="removingDeviceId === device.id"
        >
          Remove
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { securityApi, type TrustedDevice } from '@/api/endpoints/security'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const uiStore = useUIStore()
const isLoading = ref(false)
const devices = ref<TrustedDevice[]>([])
const removingDeviceId = ref<string | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadDevices = async () => {
  isLoading.value = true
  try {
    const response = await securityApi.getTrustedDevices()
    if (response.success && response.data) {
      devices.value = Array.isArray(response.data) ? response.data : []
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load trusted devices')
  } finally {
    isLoading.value = false
  }
}

const removeDevice = async (deviceId: string) => {
  removingDeviceId.value = deviceId
  try {
    const response = await securityApi.removeTrustedDevice(deviceId)
    if (response.success) {
      uiStore.showNotification('success', 'Device removed successfully')
      await loadDevices()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to remove device')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to remove device')
  } finally {
    removingDeviceId.value = null
  }
}

onMounted(() => {
  loadDevices()
})
</script>

