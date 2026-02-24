<template>
  <div v-if="totalPages > 1" class="flex justify-center items-center gap-4 mt-8">
    <Button
      @click="$emit('page-change', currentPage - 1)"
      :disabled="currentPage <= 1"
      variant="secondary"
      size="sm"
    >
      Previous
    </Button>
    <div class="flex gap-2">
      <button
        v-for="page in visiblePages"
        :key="page"
        @click="$emit('page-change', page)"
        :class="[
          'px-3 py-1 rounded transition-colors',
          page === currentPage
            ? 'bg-primary-600 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        ]"
      >
        {{ page }}
      </button>
    </div>
    <Button
      @click="$emit('page-change', currentPage + 1)"
      :disabled="currentPage >= totalPages"
      variant="secondary"
      size="sm"
    >
      Next
    </Button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from '@/components/common/Button.vue'

const props = defineProps<{
  currentPage: number
  totalPages: number
}>()

defineEmits<{
  'page-change': [page: number]
}>()

const visiblePages = computed(() => {
  const pages: number[] = []
  const maxVisible = 5
  let start = Math.max(1, props.currentPage - Math.floor(maxVisible / 2))
  let end = Math.min(props.totalPages, start + maxVisible - 1)
  
  if (end - start < maxVisible - 1) {
    start = Math.max(1, end - maxVisible + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})
</script>
