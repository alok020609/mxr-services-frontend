<template>
  <Modal :is-open="isOpen" :title="`Order #${order?.orderNumber || ''}`" @close="$emit('close')">
    <div v-if="order" class="space-y-4">
      <div>
        <h4 class="font-semibold mb-2">Order Items</h4>
        <div v-for="item in order.items" :key="item.id" class="flex justify-between items-center py-2 border-b gap-3">
          <img
            v-if="item.product"
            :src="item.product?.images?.[0] || '/placeholder.png'"
            :alt="item.product?.name"
            class="w-10 h-10 object-cover rounded flex-shrink-0"
            @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
          />
          <img
            v-else-if="item.service"
            :src="item.service?.image || '/placeholder.png'"
            :alt="item.service?.name"
            class="w-10 h-10 object-cover rounded flex-shrink-0"
            @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
          />
          <img
            v-else
            src="/placeholder.jpg"
            alt="Item"
            class="w-10 h-10 object-cover rounded flex-shrink-0"
            @error="($event.target as HTMLImageElement).src = '/placeholder.png'"
          />
          <span class="flex-1 min-w-0">{{ item.product?.name ?? item.service?.name ?? 'Item' }} x{{ item.quantity }}</span>
          <span class="flex-shrink-0">{{ formatPrice(item.subtotal) }}</span>
        </div>
      </div>
      <div class="pt-4 border-t">
        <div class="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>{{ formatPrice(order.total) }}</span>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from '@/components/common/Modal.vue'
import type { Order } from '@/api/types'
import { usePriceFormatter } from '@/composables/usePriceFormatter'

const { formatPrice } = usePriceFormatter()

defineProps<{
  isOpen: boolean
  order: Order | null
}>()

defineEmits<{
  close: []
}>()
</script>

