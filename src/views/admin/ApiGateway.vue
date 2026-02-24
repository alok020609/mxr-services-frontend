<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">API Gateway</h1>
    
    <!-- Tabs -->
    <div class="border-b mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-2 font-medium border-b-2 transition-colors',
          activeTab === tab.id
            ? 'border-primary-600 text-primary-600'
            : 'border-transparent text-gray-500 hover:text-gray-700'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>
    
    <!-- API Tiers Tab -->
    <div v-if="activeTab === 'tiers'">
      <ApiTiers />
    </div>
    
    <!-- API Usage Tab -->
    <div v-if="activeTab === 'usage'">
      <ApiUsage />
    </div>
    
    <!-- Version Management Tab -->
    <div v-if="activeTab === 'version-management'">
      <VersionManagement />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ApiTiers from '@/components/api/ApiTiers.vue'
import ApiUsage from '@/components/api/ApiUsage.vue'
import VersionManagement from '@/components/api/VersionManagement.vue'

const activeTab = ref<'tiers' | 'usage' | 'version-management'>('tiers')

const tabs = [
  { id: 'tiers', label: 'API Tiers' },
  { id: 'usage', label: 'API Usage' },
  { id: 'version-management', label: 'Version Management' }
]
</script>

