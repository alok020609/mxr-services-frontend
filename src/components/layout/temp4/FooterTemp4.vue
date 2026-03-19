<template>
  <footer class="bg-sgNavy text-slate-400 pt-16 pb-12 mt-auto">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 pb-12 border-b border-slate-800">
        <div class="col-span-2 md:col-span-1">
          <div class="flex items-center gap-2 text-white mb-4">
            <div class="size-6 bg-sgPrimary rounded flex items-center justify-center text-white">
              <span class="material-symbols-outlined text-sm">shield</span>
            </div>
            <span class="font-bold text-white">MXR Services</span>
          </div>
          <p class="text-sm text-slate-400 leading-relaxed">
            Providing world-class security solutions for families and businesses since 2008.
          </p>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Products</h4>
          <ul class="flex flex-col gap-2 text-sm text-slate-400">
            <li><router-link to="/products" class="hover:text-sgPrimary transition-colors">Products</router-link></li>
            <li><router-link to="/packages" class="hover:text-sgPrimary transition-colors">Packages</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Company</h4>
          <ul class="flex flex-col gap-2 text-sm text-slate-400">
            <li><router-link to="/" class="hover:text-sgPrimary transition-colors">Home</router-link></li>
            <li><router-link to="/contact" class="hover:text-sgPrimary transition-colors">Contact</router-link></li>
            <li><router-link to="/privacy" class="hover:text-sgPrimary transition-colors">Privacy</router-link></li>
          </ul>
        </div>
        <div>
          <h4 class="font-bold text-white mb-4">Support</h4>
          <ul class="flex flex-col gap-2 text-sm text-slate-400">
            <li><router-link to="/support" class="hover:text-sgPrimary transition-colors">Support</router-link></li>
            <li><router-link to="/contact" class="hover:text-sgPrimary transition-colors">Contact</router-link></li>
          </ul>
        </div>
      </div>
      <div class="pt-8 text-center text-sm text-slate-500">
        © {{ currentYear }} MXR Services. All rights reserved.
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
