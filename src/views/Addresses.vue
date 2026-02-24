<template>
  <div>
    <Header @toggle-sidebar="sidebarOpen = true" />
    <Sidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />
    
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold mb-8">My Addresses</h1>
      
      <div class="max-w-2xl">
        <div class="card mb-4">
          <h2 class="text-xl font-bold mb-4">Saved Addresses</h2>
          <div v-if="addresses.length === 0" class="text-gray-600">
            No addresses saved yet
          </div>
          <div v-else class="space-y-4">
            <div v-for="address in addresses" :key="address.id" class="border rounded-lg p-4">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-semibold">{{ address.firstName }} {{ address.lastName }}</p>
                  <p class="text-gray-600">{{ address.street }}</p>
                  <p class="text-gray-600">{{ address.city }}, {{ address.state }} {{ address.zipCode }}</p>
                </div>
                <div class="flex gap-2">
                  <button class="text-primary-600">Edit</button>
                  <button class="text-red-600">Delete</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <Button variant="primary" @click="showAddForm = true">
          Add New Address
        </Button>
      </div>
    </main>

    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { authApi } from '@/api/endpoints/auth'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import Toast from '@/components/common/Toast.vue'
import Button from '@/components/common/Button.vue'
import type { Address } from '@/api/types'

const sidebarOpen = ref(false)
const addresses = ref<Address[]>([])
const showAddForm = ref(false)

onMounted(async () => {
  try {
    const response = await authApi.getAddresses()
    if (response.success && response.data) {
      addresses.value = response.data
    }
  } catch (error) {
    console.error('Failed to load addresses:', error)
  }
})
</script>

