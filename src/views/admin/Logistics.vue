<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Logistics Operations</h1>

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

    <!-- Tracking Tab -->
    <div v-if="activeTab === 'tracking'">
      <ShipmentTracking />
    </div>

    <!-- Rates Tab -->
    <div v-if="activeTab === 'rates'">
      <RateCalculator />
    </div>

    <!-- Shipments Tab -->
    <div v-if="activeTab === 'shipments'">
      <ShipmentList />
    </div>

    <!-- Create Shipment Tab -->
    <div v-if="activeTab === 'create'">
      <CreateShipment />
    </div>

    <!-- Returns Tab -->
    <div v-if="activeTab === 'returns'">
      <ReturnShipment />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ShipmentTracking from '@/components/logistics/ShipmentTracking.vue'
import RateCalculator from '@/components/logistics/RateCalculator.vue'
import ShipmentList from '@/components/logistics/ShipmentList.vue'
import CreateShipment from '@/components/logistics/CreateShipment.vue'
import ReturnShipment from '@/components/logistics/ReturnShipment.vue'

const activeTab = ref('tracking')

const tabs = [
  { id: 'tracking', label: 'Tracking' },
  { id: 'rates', label: 'Rates' },
  { id: 'shipments', label: 'Shipments' },
  { id: 'create', label: 'Create Shipment' },
  { id: 'returns', label: 'Returns' }
]
</script>
