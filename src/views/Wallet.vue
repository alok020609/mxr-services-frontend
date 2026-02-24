<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Wallet</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-1">
          <WalletBalance />
        </div>
        
        <div class="lg:col-span-2">
          <AddFunds />
        </div>
      </div>
      
      <div class="mt-6">
        <StoreCredits />
      </div>
      
      <div class="mt-6">
        <Invoices />
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
import WalletBalance from '@/components/wallet/WalletBalance.vue'
import AddFunds from '@/components/wallet/AddFunds.vue'
import StoreCredits from '@/components/wallet/StoreCredits.vue'
import Invoices from '@/components/wallet/Invoices.vue'

const sidebarOpen = ref(false)
</script>

