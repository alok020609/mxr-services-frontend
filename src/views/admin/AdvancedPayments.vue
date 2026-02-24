<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Advanced Payments</h1>
    
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
    
    <!-- Payment Routing Tab -->
    <div v-if="activeTab === 'routing'">
      <PaymentRouting />
    </div>
    
    <!-- Split Payment Tab -->
    <div v-if="activeTab === 'split'">
      <SplitPayment />
    </div>
    
    <!-- Reconciliation Tab -->
    <div v-if="activeTab === 'reconciliation'">
      <PaymentReconciliation />
    </div>
    
    <!-- Chargeback Tab -->
    <div v-if="activeTab === 'chargeback'">
      <ChargebackRecord />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import PaymentRouting from '@/components/payments/PaymentRouting.vue'
import SplitPayment from '@/components/payments/SplitPayment.vue'
import PaymentReconciliation from '@/components/payments/PaymentReconciliation.vue'
import ChargebackRecord from '@/components/payments/ChargebackRecord.vue'

const activeTab = ref<'routing' | 'split' | 'reconciliation' | 'chargeback'>('routing')

const tabs = [
  { id: 'routing', label: 'Payment Routing' },
  { id: 'split', label: 'Split Payment' },
  { id: 'reconciliation', label: 'Reconciliation' },
  { id: 'chargeback', label: 'Chargeback' }
]
</script>

