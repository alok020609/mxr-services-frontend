<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">Loyalty Program</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <PointsBalance />
        </div>
        
        <div class="lg:col-span-2">
          <TierDisplay />
        </div>
      </div>
      
      <div class="mt-6">
        <RewardsCatalog />
      </div>
      
      <div class="mt-6">
        <ReferralProgram />
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import PointsBalance from '@/components/loyalty/PointsBalance.vue'
import TierDisplay from '@/components/loyalty/TierDisplay.vue'
import RewardsCatalog from '@/components/loyalty/RewardsCatalog.vue'
import ReferralProgram from '@/components/loyalty/ReferralProgram.vue'

const sidebarOpen = ref(false)
</script>

