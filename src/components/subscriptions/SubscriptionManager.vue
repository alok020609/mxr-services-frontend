<template>
  <div class="subscription-manager">
    <div class="flex items-center justify-between mb-4">
      <div>
        <h3 class="font-semibold">{{ subscription.product?.name || 'Subscription' }}</h3>
        <p class="text-sm text-gray-600">Next delivery: {{ formatDate(subscription.nextDelivery) }}</p>
      </div>
      <span :class="[
        'px-3 py-1 rounded-full text-sm',
        subscription.status === 'active' ? 'bg-green-100 text-green-800' :
        subscription.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
        'bg-gray-100 text-gray-800'
      ]">
        {{ subscription.status }}
      </span>
    </div>
    
    <SubscriptionActions :subscription-id="subscription.id" />
  </div>
</template>

<script setup lang="ts">
import type { Subscription } from '@/api/types'
import SubscriptionActions from './SubscriptionActions.vue'

const props = defineProps<{
  subscription: Subscription
}>()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
</script>

