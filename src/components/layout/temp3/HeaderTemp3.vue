<template>
  <header class="bg-cyber-900 shadow-lg sticky top-0 z-50 border-b border-cyber-800">
    <div class="container mx-auto px-4 py-3">
      <div class="flex items-center justify-between gap-4 min-h-[2.5rem]">
        <!-- Logo: single line, short tagline on large screens only -->
        <router-link to="/" class="flex items-baseline gap-2 shrink-0">
          <span class="text-lg font-bold text-white whitespace-nowrap">MXRServices</span>
          <span class="hidden lg:inline text-[10px] text-neon font-medium uppercase tracking-wide">Security Solutions</span>
        </router-link>

        <!-- Nav (Desktop) -->
        <nav class="hidden md:flex items-center gap-5">
          <router-link to="/" class="text-cyber-200 hover:text-white transition-colors text-sm font-medium py-1">Home</router-link>
          <router-link to="/products" class="text-cyber-200 hover:text-white transition-colors text-sm font-medium py-1">Products</router-link>
          <router-link to="/services" class="text-cyber-200 hover:text-white transition-colors text-sm font-medium py-1">Services</router-link>
          <router-link to="/portfolio" class="text-cyber-200 hover:text-white transition-colors text-sm font-medium py-1">Portfolio</router-link>
          <router-link to="/contact" class="text-cyber-200 hover:text-white transition-colors text-sm font-medium py-1">Contact</router-link>
        </nav>

        <!-- Right: Phone, WhatsApp, Cart, User, CTA -->
        <div class="flex items-center gap-2 shrink-0">
          <a v-if="contactPhone" :href="'tel:' + contactPhone" class="hidden lg:flex items-center text-cyber-200 hover:text-white text-xs font-medium transition-colors whitespace-nowrap" title="Call us">
            {{ contactPhone }}
          </a>
          <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="hidden md:inline-flex items-center px-2.5 py-1.5 rounded-md bg-neon hover:bg-neon-hover text-cyber-950 text-xs font-medium transition-colors" title="WhatsApp">
            WhatsApp
          </a>
          <router-link
            to="/cart"
            class="relative p-1.5 text-cyber-200 hover:text-white transition-colors"
            aria-label="Cart"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 bg-neon text-cyber-950 text-[10px] rounded-full h-3.5 w-3.5 min-w-[0.875rem] flex items-center justify-center font-semibold"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <div v-if="isAuthenticated" class="relative user-menu-container hidden md:block">
            <button
              @click.stop="showUserMenu = !showUserMenu"
              class="flex items-center gap-1.5 p-1 rounded-md text-cyber-200 hover:text-white hover:bg-cyber-800 transition-colors"
            >
              <div class="h-6 w-6 rounded-full bg-cyber-700 flex items-center justify-center text-white text-xs">
                {{ userInitials }}
              </div>
              <svg class="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="showUserMenu"
              @click.stop
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-cyber-200"
            >
              <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Profile</router-link>
              <router-link to="/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Orders</router-link>
              <router-link to="/wishlist" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Wishlist</router-link>
              <router-link v-if="isAdmin" to="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Admin Panel</router-link>
              <hr class="my-2 border-gray-200" />
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          </div>
          <router-link v-else to="/login" class="hidden md:block text-cyber-200 hover:text-white text-sm font-medium transition-colors py-1">Login</router-link>

          <!-- CTA (Desktop) -->
          <router-link
            to="/contact"
            class="hidden md:inline-flex items-center px-3 py-1.5 rounded-md bg-neon hover:bg-neon-hover text-cyber-950 font-medium text-xs transition-colors whitespace-nowrap"
          >
            Free Consultation
          </router-link>

          <!-- Mobile menu toggle -->
          <button
            @click="onMobileMenuClick"
            class="md:hidden p-1.5 text-cyber-200 hover:text-white transition-colors"
            aria-label="Menu"
          >
            <svg v-if="!mobileMenuOpen" class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            <svg v-else class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu (slide-down) -->
      <div
        v-show="mobileMenuOpen"
        class="md:hidden border-t border-cyber-800 pt-3 pb-4 px-1"
      >
        <nav class="flex flex-col space-y-0.5">
          <a v-if="contactPhone" :href="'tel:' + contactPhone" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 rounded text-sm">{{ contactPhone }}</a>
          <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="px-3 py-2 text-neon hover:bg-cyber-800 rounded text-sm font-medium">WhatsApp</a>
          <router-link to="/" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded text-sm transition-colors" @click="mobileMenuOpen = false">Home</router-link>
          <router-link to="/products" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded text-sm transition-colors" @click="mobileMenuOpen = false">Products</router-link>
          <router-link to="/services" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded text-sm transition-colors" @click="mobileMenuOpen = false">Services</router-link>
          <router-link to="/portfolio" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded text-sm transition-colors" @click="mobileMenuOpen = false">Portfolio</router-link>
          <router-link to="/contact" class="px-3 py-2 text-cyber-200 hover:bg-cyber-800 hover:text-white rounded text-sm transition-colors" @click="mobileMenuOpen = false">Contact</router-link>
          <router-link
            to="/contact"
            class="mx-3 mt-3 inline-flex justify-center items-center py-2.5 rounded-md bg-neon hover:bg-neon-hover text-cyber-950 font-medium text-sm transition-colors"
            @click="mobileMenuOpen = false"
          >
            Free Consultation
          </router-link>
        </nav>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { cartApi } from '@/api/endpoints/cart'
import { env } from '@/config/env'

const contactPhone = env.contactPhone
const whatsappHref = env.whatsappNumber ? `https://wa.me/${env.whatsappNumber}` : ''
const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

const emit = defineEmits<{ 'toggle-sidebar': [] }>()

function onMobileMenuClick() {
  mobileMenuOpen.value = !mobileMenuOpen.value
  emit('toggle-sidebar')
}

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
const cartItemCount = computed(() => {
  return (cartStore.cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
})

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
})

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  mobileMenuOpen.value = false
  window.location.href = '/'
}

function handleClickOutside(event: Event) {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu-container')) showUserMenu.value = false
}

async function loadCartIfAuthenticated() {
  if (!authStore.isAuthenticated) return
  try {
    const res = await cartApi.getCart()
    if (res.success && res.data) cartStore.setCart(res.data)
  } catch {
    // ignore
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadCartIfAuthenticated()
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.user-menu-container {
  position: relative;
}
</style>
