<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="[
      'btn',
      variantClasses,
      sizeClasses,
      disabled || loading ? 'opacity-50 cursor-not-allowed' : '',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      focusRingClasses
    ]"
    @click="$emit('click', $event)"
  >
    <LoadingSpinner v-if="loading" size="sm" class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LoadingSpinner from './LoadingSpinner.vue'

const props = withDefaults(defineProps<{
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'danger' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
}>(), {
  type: 'button',
  variant: 'primary',
  size: 'md',
  disabled: false,
  loading: false
})

defineEmits<{
  click: [event: MouseEvent]
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'btn-primary'
    case 'secondary':
      return 'btn-secondary'
    case 'danger':
      return 'btn-danger'
    case 'outline':
      return 'border-2 border-neon text-neon hover:bg-neon/10'
    default:
      return 'btn-primary'
  }
})

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'px-3 py-1.5 text-sm'
    case 'lg':
      return 'px-6 py-3 text-lg'
    default:
      return 'px-4 py-2'
  }
})

const focusRingClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'focus:ring-neon'
    case 'secondary':
      return 'focus:ring-gray-500'
    case 'danger':
      return 'focus:ring-red-500'
    default:
      return 'focus:ring-neon'
  }
})
</script>

