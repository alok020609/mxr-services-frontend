<template>
  <div class="card hover:shadow-lg transition-shadow">
    <router-link :to="`/products/${product.id}`">
      <img
        :src="product.images[0] || '/placeholder.jpg'"
        :alt="product.name"
        class="w-full h-48 object-cover rounded-lg mb-4"
      />
      <h3 class="font-semibold text-lg mb-2">{{ product.name }}</h3>
      <p class="text-primary-600 font-bold mb-2">{{ formatPrice(product.price) }}</p>
      <div v-if="product.rating" class="flex items-center mb-2">
        <span class="text-yellow-500 text-sm">{{ '★'.repeat(Math.round(product.rating)) }}</span>
        <span class="text-gray-500 text-sm ml-2">({{ product.reviewCount || 0 }})</span>
      </div>
      <div v-if="product.stock === 0" class="text-sm text-red-600">Out of Stock</div>
      <div v-else-if="product.stock < 10" class="text-sm text-orange-600">Only {{ product.stock }} left</div>
      <div v-else class="text-sm text-green-600">In Stock</div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { usePriceFormatter } from '@/composables/usePriceFormatter'
import type { Product } from '@/api/types'

const { formatPrice } = usePriceFormatter()

defineProps<{
  product: Product
}>()
</script>
