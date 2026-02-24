<template>
  <aside
    :class="[
      'fixed left-0 top-0 bottom-0 w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white z-40 transform transition-transform duration-300 shadow-xl',
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    ]"
  >
    <div class="p-4 h-full flex flex-col">
      <div class="mb-6 pb-4 border-b border-gray-700">
        <h2 class="text-xl font-bold text-white">Vendor Panel</h2>
        <p class="text-sm text-gray-400 mt-1">Seller Dashboard</p>
      </div>
      <nav class="space-y-1 flex-1">
        <router-link
          to="/vendor"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/vendor', true) 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          Dashboard
        </router-link>
        <router-link
          to="/vendor/products"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/vendor/products') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Products
        </router-link>
        <router-link
          to="/vendor/categories"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/vendor/categories') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
          </svg>
          Categories
        </router-link>
        <router-link
          to="/vendor/payouts"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isActive('/vendor/payouts') 
              ? 'bg-primary-600 text-white shadow-lg' 
              : 'text-gray-300 hover:bg-gray-800 hover:text-white'
          ]"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Payouts
        </router-link>
      </nav>
      <div class="pt-4 border-t border-gray-700">
        <router-link
          to="/"
          class="flex items-center px-4 py-3 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white transition-all duration-200"
        >
          <svg class="h-5 w-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          View Store
        </router-link>
      </div>
    </div>
  </aside>
  
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
    @click="$emit('close')"
  ></div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

defineProps<{
  isOpen: boolean
}>()

defineEmits<{
  close: []
}>()

const route = useRoute()

const isActive = (path: string, exact: boolean = false) => {
  if (exact) {
    return route.path === path
  }
  return route.path.startsWith(path) && route.path !== '/vendor'
}
</script>

