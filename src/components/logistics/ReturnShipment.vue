<template>
  <div class="card p-6">
    <h2 class="text-xl font-bold mb-4">Create Return Shipment</h2>

    <form @submit.prevent="createReturn" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Order ID *</label>
        <Input
          v-model="formData.orderId"
          type="text"
          placeholder="order_123"
          required
        />
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Pickup Address (Customer) -->
        <div class="space-y-4">
          <h3 class="font-semibold">Pickup Address (Customer)</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input v-model="formData.pickup.name" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <Input v-model="formData.pickup.address" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input v-model="formData.pickup.city" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <Input v-model="formData.pickup.state" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input v-model="formData.pickup.pincode" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input v-model="formData.pickup.phone" type="tel" required />
          </div>
        </div>

        <!-- Delivery Address (Warehouse) -->
        <div class="space-y-4">
          <h3 class="font-semibold">Delivery Address (Warehouse)</h3>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input v-model="formData.delivery.name" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Address *</label>
            <Input v-model="formData.delivery.address" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">City *</label>
            <Input v-model="formData.delivery.city" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">State *</label>
            <Input v-model="formData.delivery.state" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
            <Input v-model="formData.delivery.pincode" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
            <Input v-model="formData.delivery.phone" type="tel" required />
          </div>
        </div>
      </div>

      <div>
        <h3 class="font-semibold mb-2">Return Items</h3>
        <div
          v-for="(item, index) in formData.items"
          :key="index"
          class="grid grid-cols-4 gap-4 mb-4 p-4 border rounded-lg"
        >
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <Input v-model="item.name" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
            <Input v-model="item.sku" type="text" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
            <Input v-model.number="item.quantity" type="number" min="1" required />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Price *</label>
            <Input v-model.number="item.price" type="number" min="0" step="0.01" required />
          </div>
        </div>
        <Button type="button" variant="secondary" @click="addItem" size="sm">
          Add Item
        </Button>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Total Amount *</label>
        <Input
          v-model.number="formData.total"
          type="number"
          step="0.01"
          min="0"
          required
        />
      </div>

      <div class="flex justify-end space-x-4">
        <Button type="button" variant="secondary" @click="resetForm">Reset</Button>
        <Button type="submit" variant="primary" :loading="isSubmitting">
          Create Return
        </Button>
      </div>
    </form>

    <div v-if="createdReturn" class="mt-6 p-4 bg-green-50 rounded-lg">
      <h3 class="font-semibold text-green-800 mb-2">Return Shipment Created Successfully!</h3>
      <div class="space-y-1 text-sm text-green-700">
        <p><strong>Tracking Number:</strong> {{ createdReturn.trackingNumber }}</p>
        <p><strong>AWB Number:</strong> {{ createdReturn.awbNumber }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { logisticsApi } from '@/api/endpoints/logistics'
import { useUIStore } from '@/stores/ui'
import Button from '@/components/common/Button.vue'
import Input from '@/components/common/Input.vue'
import type { CreateReturnRequest } from '@/api/types'

const uiStore = useUIStore()
const isSubmitting = ref(false)
const createdReturn = ref<{ id: string; awbNumber: string; trackingNumber: string } | null>(null)

const formData = ref<CreateReturnRequest>({
  orderId: '',
  pickup: {
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  },
  delivery: {
    name: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    phone: ''
  },
  items: [
    {
      name: '',
      sku: '',
      quantity: 1,
      price: 0
    }
  ],
  total: 0
})

const addItem = () => {
  formData.value.items.push({
    name: '',
    sku: '',
    quantity: 1,
    price: 0
  })
}

const createReturn = async () => {
  isSubmitting.value = true
  createdReturn.value = null

  try {
    const response = await logisticsApi.createReturn(formData.value)
    if (response.success && response.data) {
      createdReturn.value = response.data
      uiStore.showNotification('success', 'Return shipment created successfully')
      resetForm()
    } else {
      uiStore.showNotification('error', response.error || 'Failed to create return shipment')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to create return shipment')
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  formData.value = {
    orderId: '',
    pickup: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    delivery: {
      name: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      phone: ''
    },
    items: [
      {
        name: '',
        sku: '',
        quantity: 1,
        price: 0
      }
    ],
    total: 0
  }
  createdReturn.value = null
}
</script>
