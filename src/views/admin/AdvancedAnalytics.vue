<template>
  <div>
    <h1 class="text-3xl font-bold mb-8">Advanced Analytics</h1>
    
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
    
    <!-- Real-time Dashboard Tab -->
    <div v-if="activeTab === 'realtime'">
      <RealtimeDashboard />
    </div>
    
    <!-- Live Orders Tab -->
    <div v-if="activeTab === 'live-orders'">
      <LiveOrders />
    </div>
    
    <!-- Conversion Funnel Tab -->
    <div v-if="activeTab === 'funnel'">
      <ConversionFunnel />
    </div>
    
    <!-- UTM Tracking Tab -->
    <div v-if="activeTab === 'utm'">
      <UTMTracking />
    </div>
    
    <!-- User Insights Tab -->
    <div v-if="activeTab === 'insights'">
      <div class="space-y-6">
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-xl font-bold mb-4">User Insights</h2>
          <p class="text-gray-600 mb-6">Analyze user behavior, predict churn, and get product recommendations.</p>
          
          <!-- Sub-tabs for user insights -->
          <div class="border-b mb-6">
            <button
              v-for="insightTab in insightTabs"
              :key="insightTab.id"
              @click="activeInsightTab = insightTab.id"
              :class="[
                'px-4 py-2 font-medium border-b-2 transition-colors mr-4',
                activeInsightTab === insightTab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              ]"
            >
              {{ insightTab.label }}
            </button>
          </div>
          
          <!-- Churn Prediction -->
          <div v-if="activeInsightTab === 'churn'">
            <UserChurnPrediction />
          </div>
          
          <!-- Product Affinity -->
          <div v-if="activeInsightTab === 'affinity'">
            <ProductAffinity />
          </div>
          
          <!-- Next Product Recommendation -->
          <div v-if="activeInsightTab === 'next-product'">
            <NextProductRecommendation />
          </div>
          
          <!-- Multi-touch Attribution -->
          <div v-if="activeInsightTab === 'attribution'">
            <MultiTouchAttribution />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RealtimeDashboard from '@/components/analytics/RealtimeDashboard.vue'
import LiveOrders from '@/components/analytics/LiveOrders.vue'
import ConversionFunnel from '@/components/analytics/ConversionFunnel.vue'
import UTMTracking from '@/components/analytics/UTMTracking.vue'
import UserChurnPrediction from '@/components/analytics/UserChurnPrediction.vue'
import ProductAffinity from '@/components/analytics/ProductAffinity.vue'
import NextProductRecommendation from '@/components/analytics/NextProductRecommendation.vue'
import MultiTouchAttribution from '@/components/analytics/MultiTouchAttribution.vue'

const activeTab = ref<'realtime' | 'live-orders' | 'funnel' | 'utm' | 'insights'>('realtime')
const activeInsightTab = ref<'churn' | 'affinity' | 'next-product' | 'attribution'>('churn')

const tabs = [
  { id: 'realtime', label: 'Real-time Dashboard' },
  { id: 'live-orders', label: 'Live Orders' },
  { id: 'funnel', label: 'Conversion Funnel' },
  { id: 'utm', label: 'UTM Tracking' },
  { id: 'insights', label: 'User Insights' }
]

const insightTabs = [
  { id: 'churn', label: 'Churn Prediction' },
  { id: 'affinity', label: 'Product Affinity' },
  { id: 'next-product', label: 'Next Product' },
  { id: 'attribution', label: 'Attribution' }
]
</script>

