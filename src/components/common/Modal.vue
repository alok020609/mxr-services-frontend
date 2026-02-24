<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50"
        @click.self="$emit('close')"
      >
        <div class="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div v-if="$slots.header || title" class="flex items-center justify-between p-6 border-b">
            <slot name="header">
              <h3 class="text-xl font-semibold">{{ title }}</h3>
            </slot>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600"
            >
              <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div class="p-6">
            <slot name="body">
              <slot />
            </slot>
          </div>
          <div v-if="$slots.footer || showFooter" class="flex justify-end space-x-4 p-6 border-t">
            <slot name="footer">
              <Button variant="secondary" @click="$emit('close')">Cancel</Button>
              <Button variant="primary" @click="$emit('confirm')">Confirm</Button>
            </slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import Button from './Button.vue'

defineProps<{
  isOpen: boolean
  title?: string
  showFooter?: boolean
}>()

defineEmits<{
  close: []
  confirm: []
}>()
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
