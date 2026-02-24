<template>
  <div class="flex items-center gap-4">
    <label class="text-sm font-medium text-gray-700">Sort by:</label>
    <select
      :value="sortBy"
      @change="$emit('sort-change', { sortBy: ($event.target as HTMLSelectElement).value, sortOrder })"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    >
      <option value="createdAt">Newest</option>
      <option value="price">Price</option>
      <option value="name">Name</option>
      <option value="rating">Rating</option>
    </select>
    <select
      :value="sortOrder"
      @change="$emit('sort-change', { sortBy, sortOrder: ($event.target as HTMLSelectElement).value })"
      class="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
    >
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  sortBy: string
  sortOrder: 'asc' | 'desc'
}>()

defineEmits<{
  'sort-change': [value: { sortBy: string; sortOrder: 'asc' | 'desc' }]
}>()
</script>
