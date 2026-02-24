<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Advanced Inventory Management</h1>
    
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
    
    <!-- Reorder Point Tab -->
    <div v-if="activeTab === 'reorder-point'">
      <ReorderPointCalculator />
    </div>
    
    <!-- Stock Transfer Tab -->
    <div v-if="activeTab === 'transfer'">
      <StockTransfer />
    </div>
    
    <!-- Cycle Count Tab -->
    <div v-if="activeTab === 'cycle-count'">
      <CycleCount />
    </div>
    
    <!-- Aging Report Tab -->
    <div v-if="activeTab === 'aging-report'">
      <AgingReport />
    </div>
    
    <!-- Shrinkage Tab -->
    <div v-if="activeTab === 'shrinkage'">
      <ShrinkageRecord />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ReorderPointCalculator from '@/components/inventory/ReorderPointCalculator.vue'
import StockTransfer from '@/components/inventory/StockTransfer.vue'
import CycleCount from '@/components/inventory/CycleCount.vue'
import AgingReport from '@/components/inventory/AgingReport.vue'
import ShrinkageRecord from '@/components/inventory/ShrinkageRecord.vue'

const activeTab = ref<'reorder-point' | 'transfer' | 'cycle-count' | 'aging-report' | 'shrinkage'>('reorder-point')

const tabs = [
  { id: 'reorder-point', label: 'Reorder Point' },
  { id: 'transfer', label: 'Stock Transfer' },
  { id: 'cycle-count', label: 'Cycle Count' },
  { id: 'aging-report', label: 'Aging Report' },
  { id: 'shrinkage', label: 'Shrinkage' }
]
</script>

