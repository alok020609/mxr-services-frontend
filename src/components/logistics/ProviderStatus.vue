<template>
  <div class="flex items-center gap-2">
    <span
      :class="[
        'px-2 py-1 rounded-full text-xs font-semibold',
        provider.isActive
          ? 'bg-green-100 text-green-800'
          : 'bg-gray-100 text-gray-800'
      ]"
    >
      {{ provider.isActive ? 'Active' : 'Inactive' }}
    </span>
    <span
      v-if="provider.isDefault"
      class="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800"
    >
      Default
    </span>
  </div>
</template>

<script setup lang="ts">
import type { LogisticsProvider } from '@/api/types'

defineProps<{
  provider: LogisticsProvider
}>()
</script>
