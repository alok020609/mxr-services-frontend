<template>
  <header class="sticky top-0 z-50 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-sgBgDark/90 backdrop-blur-md px-4 sm:px-6 lg:px-10 py-3">
    <div class="flex items-center justify-between gap-4">
      <div class="flex items-center gap-8">
        <router-link to="/" class="flex items-center gap-2 text-slate-900 dark:text-white">
          <div class="size-8 bg-sgPrimary rounded-lg flex items-center justify-center text-white">
            <span class="material-symbols-outlined text-xl">shield</span>
          </div>
          <span class="text-lg font-bold leading-tight tracking-tight">MXR Services</span>
        </router-link>
        <nav class="hidden md:flex items-center gap-6">
          <router-link
            to="/"
            :class="navClass('/', true)"
          >
            Home
          </router-link>
          <router-link
            to="/packages"
            :class="navClass('/packages')"
          >
            Packages
          </router-link>
          <router-link
            to="/products"
            :class="navClass('/products')"
          >
            Products
          </router-link>
          <router-link to="/orders" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sgPrimary transition-colors">
            My Orders
          </router-link>
          <router-link to="/#support" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sgPrimary transition-colors">
            Support
          </router-link>
          <router-link to="/contact" class="text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sgPrimary transition-colors">
            Contact
          </router-link>
        </nav>
      </div>
      <div class="flex flex-1 justify-end items-center gap-4">
        <div v-if="showSearch" class="hidden lg:flex min-w-[160px] max-w-[256px] flex-1 items-stretch rounded-lg h-10 overflow-hidden bg-slate-100 dark:bg-slate-800">
          <span class="material-symbols-outlined text-slate-500 flex items-center justify-center pl-3 text-xl">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search"
            class="flex-1 min-w-0 bg-transparent border-none px-3 text-slate-900 dark:text-white placeholder:text-slate-500 text-sm focus:outline-none focus:ring-0"
          />
        </div>
        <router-link
          to="/contact"
          class="flex min-w-[120px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-sgPrimary text-white text-sm font-bold hover:opacity-90 transition-opacity"
        >
          Get a Quote
        </router-link>
        <router-link to="/cart" class="relative rounded-lg p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
          <span class="material-symbols-outlined text-slate-700 dark:text-slate-300">shopping_cart</span>
          <span v-if="cartCount > 0" class="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-sgPrimary text-[10px] text-white font-bold">{{ cartCount }}</span>
        </router-link>
        <template v-if="!isAuthenticated">
          <router-link to="/login" class="rounded-full size-10 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden">
            <span class="material-symbols-outlined text-slate-600 dark:text-slate-400">person</span>
          </router-link>
        </template>
        <div v-else class="relative user-menu-container hidden md:block">
          <button
            type="button"
            class="rounded-full size-10 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="User menu"
            @click.stop="showUserMenu = !showUserMenu"
          >
            <span class="material-symbols-outlined text-slate-600 dark:text-slate-400" v-if="!userInitials">person</span>
            <span v-else>{{ userInitials }}</span>
          </button>
          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-2 w-48 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg py-2 z-50"
            @click.stop
          >
            <router-link to="/profile" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="showUserMenu = false">Profile</router-link>
            <router-link to="/orders" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="showUserMenu = false">Orders</router-link>
            <router-link to="/wishlist" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="showUserMenu = false">Wishlist</router-link>
            <router-link v-if="isAdmin" to="/admin" class="block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700" @click="showUserMenu = false">Admin Panel</router-link>
            <hr class="my-2 border-slate-200 dark:border-slate-700" />
            <button type="button" class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-700" @click="handleLogout">Logout</button>
          </div>
        </div>
        <button
          type="button"
          class="md:hidden p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Menu"
          @click="mobileOpen = !mobileOpen"
        >
          <span class="material-symbols-outlined">{{ mobileOpen ? 'close' : 'menu' }}</span>
        </button>
      </div>
    </div>
    <div v-show="mobileOpen" class="md:hidden border-t border-slate-200 dark:border-slate-800 pt-4 pb-2">
      <nav class="flex flex-col gap-1">
        <router-link to="/" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Home</router-link>
        <router-link to="/packages" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Packages</router-link>
        <router-link to="/products" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Products</router-link>
        <router-link to="/orders" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">My Orders</router-link>
        <router-link to="/#support" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Support</router-link>
        <router-link to="/contact" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Contact</router-link>
        <template v-if="isAuthenticated">
          <router-link to="/profile" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Profile</router-link>
          <router-link to="/wishlist" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Wishlist</router-link>
          <router-link v-if="isAdmin" to="/admin" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Admin Panel</router-link>
          <button type="button" class="px-3 py-2 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800" @click="handleLogout">Logout</button>
        </template>
        <router-link v-else to="/login" class="px-3 py-2 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800" @click="mobileOpen = false">Login</router-link>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCartStore } from '@/stores/cart'
import { cartApi } from '@/api/endpoints/cart'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const authStore = useAuthStore()
const cartStore = useCartStore()
const mobileOpen = ref(false)
const showUserMenu = ref(false)
const searchQuery = ref('')

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
const userInitials = computed(() => {
  if (!user.value?.name) return ''
  return user.value.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
})

const showSearch = computed(() => route.path === '/products')

function navClass(path: string, exact?: boolean): string {
  const active = exact
    ? route.path === path
    : route.path.startsWith(path)
  return active
    ? 'text-sm font-medium text-sgPrimary'
    : 'text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-sgPrimary transition-colors'
}

const cartCount = computed(() => {
  return (cartStore.cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
})

function handleLogout() {
  authStore.logout()
  showUserMenu.value = false
  mobileOpen.value = false
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

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
