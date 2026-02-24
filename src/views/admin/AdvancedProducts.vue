<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Advanced Products</h1>
    
    <!-- Tabs -->
    <div class="border-b mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- Digital Products Tab -->
    <div v-if="activeTab === 'digital'">
      <DigitalProducts />
    </div>
    
    <!-- Subscriptions Tab -->
    <div v-if="activeTab === 'subscriptions'">
      <Subscriptions />
    </div>
    
    <!-- Pre-orders Tab -->
    <div v-if="activeTab === 'pre-orders'">
      <PreOrders />
    </div>
    
    <!-- Gift Cards Tab -->
    <div v-if="activeTab === 'gift-cards'">
      <GiftCards />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import DigitalProducts from '@/components/products/DigitalProducts.vue'
import Subscriptions from '@/components/products/Subscriptions.vue'
import PreOrders from '@/components/products/PreOrders.vue'
import GiftCards from '@/components/products/GiftCards.vue'

const activeTab = ref<'digital' | 'subscriptions' | 'pre-orders' | 'gift-cards'>('digital')

const tabs = [
  { id: 'digital', label: 'Digital Products' },
  { id: 'subscriptions', label: 'Subscriptions' },
  { id: 'pre-orders', label: 'Pre-orders' },
  { id: 'gift-cards', label: 'Gift Cards' }
]
</script>

