<template>
  <div class="customer-360">
    <div v-if="isLoading" class="flex justify-center py-12">
      <LoadingSpinner size="lg" />
    </div>
    
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <Button @click="loadData" variant="primary">Retry</Button>
    </div>
    
    <div v-else-if="data" class="space-y-6">
      <!-- Customer Profile Summary -->
      <div class="card">
        <h3 class="text-lg font-bold mb-4">Customer Profile</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-sm text-gray-600">Name</label>
            <p class="font-semibold">{{ data.customer.name }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Email</label>
            <p class="font-semibold">{{ data.customer.email }}</p>
          </div>
          <div v-if="data.customer.phone">
            <label class="text-sm text-gray-600">Phone</label>
            <p class="font-semibold">{{ data.customer.phone }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Member Since</label>
            <p class="font-semibold">{{ formatDate(data.customer.createdAt) }}</p>
          </div>
        </div>
      </div>
      
      <!-- Key Metrics -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-1">Lifetime Value</p>
          <p class="text-2xl font-bold text-primary-600">{{ formatPrice(data.lifetimeValue) }}</p>
        </div>
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-1">Total Orders</p>
          <p class="text-2xl font-bold text-primary-600">{{ data.orders.total }}</p>
        </div>
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-1">Avg. Order Value</p>
          <p class="text-2xl font-bold text-primary-600">{{ formatPrice(data.averageOrderValue) }}</p>
        </div>
        <div class="card text-center">
          <p class="text-sm text-gray-600 mb-1">Total Spent</p>
          <p class="text-2xl font-bold text-primary-600">{{ formatPrice(data.orders.totalValue) }}</p>
        </div>
      </div>
      
      <!-- Recent Orders -->
      <div class="card">
        <h3 class="text-lg font-bold mb-4">Recent Orders</h3>
        <div v-if="data.orders.recentOrders && data.orders.recentOrders.length > 0" class="space-y-3">
          <div
            v-for="order in data.orders.recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-semibold">Order #{{ order.id }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(order.createdAt) }}</p>
            </div>
            <div class="text-right">
              <p class="font-semibold">{{ formatPrice(order.total) }}</p>
              <span :class="getStatusClass(order.status)" class="text-xs px-2 py-1 rounded">
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
        <p v-else class="text-gray-500 text-center py-4">No recent orders</p>
      </div>
      
      <!-- Favorite Categories -->
      <div v-if="data.favoriteCategories && data.favoriteCategories.length > 0" class="card">
        <h3 class="text-lg font-bold mb-4">Favorite Categories</h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="category in data.favoriteCategories"
            :key="category"
            class="px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
          >
            {{ category }}
          </span>
        </div>
      </div>
      
      <!-- Recent Activity -->
      <div v-if="data.recentActivity && data.recentActivity.length > 0" class="card">
        <h3 class="text-lg font-bold mb-4">Recent Activity</h3>
        <div class="space-y-2">
          <div
            v-for="(activity, index) in data.recentActivity"
            :key="index"
            class="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <div class="flex-1">
              <p class="font-medium">{{ activity.description }}</p>
              <p class="text-sm text-gray-600">{{ formatDate(activity.date) }}</p>
            </div>
            <span class="text-xs px-2 py-1 bg-gray-200 rounded">{{ activity.type }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { crmApi } from '@/api/endpoints/crm'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'
import type { Customer360 } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

interface Props {
  userId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const isLoading = ref(false)
const error = ref('')
const data = ref<Customer360 | null>(null)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getStatusClass = (status: string) => {
  const classes: Record<string, string> = {
    'completed': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'cancelled': 'bg-red-100 text-red-800',
    'processing': 'bg-blue-100 text-blue-800'
  }
  return classes[status.toLowerCase()] || 'bg-gray-100 text-gray-800'
}

const loadData = async () => {
  isLoading.value = true
  error.value = ''
  
  try {
    const response = await crmApi.getCustomer360(props.userId)
    if (response.success && response.data) {
      data.value = response.data
    } else {
      error.value = response.error || 'Failed to load customer data'
    }
  } catch (err: any) {
    error.value = err.message || 'An error occurred while loading customer data'
    uiStore.showNotification('error', error.value)
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

