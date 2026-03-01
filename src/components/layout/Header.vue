<template>
  <HeaderTemp4 @toggle-sidebar="$emit('toggle-sidebar')" />
</template>

<script setup lang="ts">
import HeaderTemp4 from './temp4/HeaderTemp4.vue'

defineEmits<{ 'toggle-sidebar': [] }>()
</script>
