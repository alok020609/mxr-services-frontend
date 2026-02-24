<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">API Deprecation</h1>
    
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
    
    <!-- Versioning Strategy Tab -->
    <div v-if="activeTab === 'versioning-strategy'">
      <VersioningStrategy />
    </div>
    
    <!-- Deprecation Policy Tab -->
    <div v-if="activeTab === 'deprecation-policy'">
      <DeprecationPolicy />
    </div>
    
    <!-- Deprecation Notices Tab -->
    <div v-if="activeTab === 'deprecation-notices'">
      <DeprecationNotices />
    </div>
    
    <!-- Version Lifecycle Tab -->
    <div v-if="activeTab === 'version-lifecycle'">
      <VersionLifecycle />
    </div>
    
    <!-- Compatibility Guarantees Tab -->
    <div v-if="activeTab === 'compatibility-guarantees'">
      <CompatibilityGuarantees />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import VersioningStrategy from '@/components/api/VersioningStrategy.vue'
import DeprecationPolicy from '@/components/api/DeprecationPolicy.vue'
import DeprecationNotices from '@/components/api/DeprecationNotices.vue'
import VersionLifecycle from '@/components/api/VersionLifecycle.vue'
import CompatibilityGuarantees from '@/components/api/CompatibilityGuarantees.vue'

const activeTab = ref<'versioning-strategy' | 'deprecation-policy' | 'deprecation-notices' | 'version-lifecycle' | 'compatibility-guarantees'>('versioning-strategy')

const tabs = [
  { id: 'versioning-strategy', label: 'Versioning Strategy' },
  { id: 'deprecation-policy', label: 'Deprecation Policy' },
  { id: 'deprecation-notices', label: 'Deprecation Notices' },
  { id: 'version-lifecycle', label: 'Version Lifecycle' },
  { id: 'compatibility-guarantees', label: 'Compatibility Guarantees' }
]
</script>

