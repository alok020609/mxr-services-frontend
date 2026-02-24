<template>
  <div v-if="selectedItems.length > 0" class="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 z-40">
    <div class="container mx-auto flex items-center justify-between">
      <span class="text-gray-700">{{ selectedItems.length }} item(s) selected</span>
      <div class="flex space-x-4">
        <Button variant="secondary" @click="$emit('clear-selection')">Clear</Button>
        <Button
          v-for="action in actions"
          :key="action.id"
          :variant="action.variant || 'primary'"
          @click="$emit('bulk-action', action.id, selectedItems)"
        >
          {{ action.label }}
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/common/Button.vue'

defineProps<{
  selectedItems: any[]
  actions: Array<{ id: string; label: string; variant?: string }>
}>()

defineEmits<{
  'bulk-action': [actionId: string, items: any[]]
  'clear-selection': []
}>()
</script>

