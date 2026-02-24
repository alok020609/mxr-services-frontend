<template>
  <div class="card hover:shadow-lg transition-all duration-200 border border-gray-100">
    <div class="flex items-center justify-between">
      <div class="flex-1">
        <p class="text-sm font-medium text-gray-600 mb-2">{{ title }}</p>
        <p class="text-3xl font-bold text-gray-900 mb-2">{{ value }}</p>
        <div v-if="change !== undefined && change !== null && change !== 0" class="flex items-center">
          <span :class="changeType === 'increase' ? 'text-green-600' : 'text-red-600'" class="text-sm font-semibold flex items-center">
            <svg v-if="changeType === 'increase'" class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clip-rule="evenodd" />
            </svg>
            <svg v-else class="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clip-rule="evenodd" />
            </svg>
            {{ Math.abs(change) }}%
          </span>
          <span class="text-xs text-gray-500 ml-2">vs last period</span>
        </div>
        <p v-else class="text-xs text-gray-400">No change data</p>
      </div>
      <div v-if="$slots.icon" :class="iconBgClass || 'bg-gradient-to-br from-primary-500 to-primary-600'" class="p-4 rounded-xl shadow-sm">
        <slot name="icon" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  title: string
  value: string | number
  change?: number
  icon?: any
  iconBgClass?: string
}>()

const changeType = computed(() => {
  if (!props.change) return null
  return props.change > 0 ? 'increase' : 'decrease'
})
</script>

