<template>
  <div class="card overflow-x-auto">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th v-if="selectable" class="px-6 py-3 text-left">
            <input
              type="checkbox"
              :checked="allSelected"
              @change="toggleSelectAll"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </th>
          <th
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
            @click="column.sortable && handleSort(column.key)"
          >
            <div class="flex items-center space-x-1">
              <span>{{ column.label }}</span>
              <svg v-if="column.sortable" class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </div>
          </th>
          <th v-if="actions" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <!-- Empty state -->
        <tr v-if="!data || !Array.isArray(data) || data.length === 0">
          <td :colspan="columns.length + (selectable ? 1 : 0) + (actions ? 1 : 0)" class="px-6 py-4 text-center text-gray-500">
              <p>No data available</p>
          </td>
        </tr>
        <!-- Data rows -->
        <tr v-for="(row, index) in (data || [])" :key="getRowKey(row)" class="hover:bg-gray-50">
          <td v-if="selectable" class="px-6 py-4 whitespace-nowrap">
            <input
              type="checkbox"
              :checked="isSelected(row)"
              @change="toggleSelect(row)"
              class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
          </td>
          <td
            v-for="column in columns"
            :key="column.key"
            class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
          >
            <slot :name="`cell-${column.key}`" :row="row" :value="getValue(row, column.key)">
              {{ getValue(row, column.key) }}
            </slot>
          </td>
          <td v-if="actions" class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
            <slot name="actions" :row="row">
              <!-- Default actions -->
            </slot>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps<{
  columns: Array<{ key: string; label: string; sortable?: boolean }>
  data: any[]
  actions?: boolean
  rowKey?: string | ((row: any) => string)
  showDebugInfo?: boolean
  selectable?: boolean
}>()

const showDebugInfo = computed(() => props.showDebugInfo || import.meta.env.DEV)

// Watch for data changes (for debugging if needed)
watch(() => props.data, (newData) => {
  if (import.meta.env.DEV && newData?.length > 0) {
    console.log('[DataTable] Data updated, rows:', newData.length)
  }
}, { immediate: false })

const sortKey = ref<string | null>(null)
const sortOrder = ref<'asc' | 'desc'>('asc')

const getRowKey = (row: any): string => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey(row)
  }
  return props.rowKey ? row[props.rowKey] : JSON.stringify(row)
}

const getValue = (row: any, key: string): any => {
  return key.split('.').reduce((obj, k) => obj?.[k], row)
}

const handleSort = (key: string) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortKey.value = key
    sortOrder.value = 'asc'
  }
  emit('sort', { key, order: sortOrder.value })
}

const selectedRows = ref<Set<string>>(new Set())

const allSelected = computed(() => {
  if (!props.selectable || !props.data || props.data.length === 0) return false
  return props.data.every(row => selectedRows.value.has(getRowKey(row)))
})

const isSelected = (row: any) => {
  return selectedRows.value.has(getRowKey(row))
}

const toggleSelect = (row: any) => {
  const key = getRowKey(row)
  if (selectedRows.value.has(key)) {
    selectedRows.value.delete(key)
  } else {
    selectedRows.value.add(key)
  }
  emitSelectionChange()
}

const toggleSelectAll = () => {
  if (allSelected.value) {
    selectedRows.value.clear()
  } else {
    props.data?.forEach(row => {
      selectedRows.value.add(getRowKey(row))
    })
  }
  emitSelectionChange()
}

const emitSelectionChange = () => {
  const selected = Array.from(selectedRows.value)
  emit('selection-change', selected)
}

watch(() => props.data, () => {
  // Clear selection when data changes
  selectedRows.value.clear()
}, { deep: true })

const emit = defineEmits<{
  sort: [{ key: string; order: 'asc' | 'desc' }]
  'selection-change': [selected: string[]]
}>()
</script>

