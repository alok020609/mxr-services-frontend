<template>
  <header class="bg-slate-800 shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-xl font-bold text-white">Ecommerce</span>
        </router-link>

        <!-- Nav (Desktop) -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/" class="text-slate-200 hover:text-white transition-colors font-medium">Home</router-link>
          <router-link to="/products" class="text-slate-200 hover:text-white transition-colors font-medium">Products</router-link>
          <router-link to="/services" class="text-slate-200 hover:text-white transition-colors font-medium">Services</router-link>
          <router-link to="/portfolio" class="text-slate-200 hover:text-white transition-colors font-medium">Portfolio</router-link>
          <router-link to="/contact" class="text-slate-200 hover:text-white transition-colors font-medium">Contact</router-link>
        </nav>

        <!-- Right: Cart, User, CTA -->
        <div class="flex items-center space-x-3">
          <router-link
            to="/cart"
            class="relative p-2 text-slate-200 hover:text-white transition-colors"
            aria-label="Cart"
          >
            <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 bg-emerald-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <div v-if="isAuthenticated" class="relative user-menu-container hidden md:block">
            <button
              @click.stop="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-1.5 rounded-lg text-slate-200 hover:text-white hover:bg-slate-700"
            >
              <div class="h-7 w-7 rounded-full bg-slate-600 flex items-center justify-center text-white text-sm">
                {{ userInitials }}
              </div>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            <div
              v-if="showUserMenu"
              @click.stop
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 border border-slate-200"
            >
              <router-link to="/profile" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Profile</router-link>
              <router-link to="/orders" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Orders</router-link>
              <router-link to="/wishlist" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Wishlist</router-link>
              <router-link v-if="isAdmin" to="/admin" class="block px-4 py-2 text-gray-700 hover:bg-gray-100" @click="showUserMenu = false">Admin Panel</router-link>
              <hr class="my-2 border-gray-200" />
              <button @click="handleLogout" class="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">Logout</button>
            </div>
          </div>
          <router-link v-else to="/login" class="hidden md:block text-slate-200 hover:text-white text-sm font-medium">Login</router-link>

          <!-- Green CTA (Desktop) -->
          <router-link
            to="/contact"
            class="hidden md:inline-flex items-center px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-colors"
          >
            Get started
          </router-link>

          <!-- Mobile menu toggle -->
          <button
            @click="mobileMenuOpen = !mobileMenuOpen"
            class="md:hidden p-2 text-slate-200 hover:text-white"
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
        class="md:hidden border-t border-slate-700 py-4"
      >
        <nav class="flex flex-col space-y-1">
          <router-link to="/" class="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-white rounded" @click="mobileMenuOpen = false">Home</router-link>
          <router-link to="/products" class="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-white rounded" @click="mobileMenuOpen = false">Products</router-link>
          <router-link to="/services" class="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-white rounded" @click="mobileMenuOpen = false">Services</router-link>
          <router-link to="/portfolio" class="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-white rounded" @click="mobileMenuOpen = false">Portfolio</router-link>
          <router-link to="/contact" class="px-4 py-2 text-slate-200 hover:bg-slate-700 hover:text-white rounded" @click="mobileMenuOpen = false">Contact</router-link>
          <router-link
            to="/contact"
            class="mx-4 mt-4 inline-flex justify-center items-center py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            @click="mobileMenuOpen = false"
          >
            Get started
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

const authStore = useAuthStore()
const cartStore = useCartStore()

const mobileMenuOpen = ref(false)
const showUserMenu = ref(false)

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
