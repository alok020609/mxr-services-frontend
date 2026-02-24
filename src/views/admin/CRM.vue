<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Customer Relationship Management</h1>
    
    <div class="card">
      <h2 class="text-xl font-bold mb-4">Customer Segments</h2>
      <CustomerSegments />
    </div>
  </div>
</template>

<script setup lang="ts">
import CustomerSegments from '@/components/crm/CustomerSegments.vue'
</script>

