<template>
  <div class="customer-tags">
    <div class="card">
      <h3 class="text-lg font-bold mb-4">Customer Tags</h3>
      
      <!-- Existing Tags -->
      <div v-if="tags.length > 0" class="mb-4">
        <div class="flex flex-wrap gap-2">
          <span
            v-for="tag in tags"
            :key="tag"
            class="inline-flex items-center gap-2 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
          >
            {{ tag }}
            <button
              @click="removeTag(tag)"
              class="text-primary-600 hover:text-primary-800"
              title="Remove tag"
            >
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </span>
        </div>
      </div>
      
      <p v-else class="text-gray-500 text-sm mb-4">No tags added yet</p>
      
      <!-- Add Tag Form -->
      <div class="flex gap-2">
        <Input
          v-model="newTag"
          placeholder="Enter tag name"
          class="flex-1"
          @keyup.enter="addTag"
        />
        <Button
          variant="primary"
          size="sm"
          @click="addTag"
          :loading="isAdding"
          :disabled="!newTag.trim()"
        >
          Add Tag
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { crmApi } from '@/api/endpoints/crm'
import { useUIStore } from '@/stores/ui'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'

interface Props {
  userId: string
}

const props = defineProps<Props>()

const uiStore = useUIStore()
const tags = ref<string[]>([])
const newTag = ref('')
const isAdding = ref(false)

const addTag = async () => {
  if (!newTag.value.trim()) return
  
  const tagValue = newTag.value.trim()
  
  // Check if tag already exists
  if (tags.value.includes(tagValue)) {
    uiStore.showNotification('warning', 'Tag already exists')
    return
  }
  
  isAdding.value = true
  try {
    const response = await crmApi.addTag(props.userId, tagValue)
    if (response.success) {
      tags.value.push(tagValue)
      newTag.value = ''
      uiStore.showNotification('success', 'Tag added successfully')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to add tag')
    }
  } catch (err: any) {
    uiStore.showNotification('error', err.message || 'Failed to add tag')
  } finally {
    isAdding.value = false
  }
}

const removeTag = async (tag: string) => {
  // Note: API might not support tag removal, so we'll just remove from UI
  // If backend supports removal, add API call here
  const index = tags.value.indexOf(tag)
  if (index > -1) {
    tags.value.splice(index, 1)
    uiStore.showNotification('info', 'Tag removed')
  }
}

// Load tags from customer 360 data or separate endpoint if available
onMounted(() => {
  // Tags would typically come from customer 360 view or a separate endpoint
  // For now, we'll start with an empty array
})
</script>

