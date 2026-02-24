<template>
  <header class="bg-white shadow-md sticky top-0 z-50">
    <div class="container mx-auto px-4">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <router-link to="/" class="flex items-center space-x-2">
          <span class="text-2xl font-bold text-primary-600">Ecommerce</span>
        </router-link>

        <!-- Nav: Products, Services (Desktop) -->
        <nav class="hidden md:flex items-center space-x-6">
          <router-link to="/products" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Products
          </router-link>
          <router-link to="/services" class="text-gray-700 hover:text-primary-600 transition-colors font-medium">
            Services
          </router-link>
        </nav>

        <!-- Search Bar (Desktop) -->
        <div class="hidden md:flex flex-1 max-w-lg mx-8">
          <div class="relative w-full">
            <input
              type="text"
              v-model="searchQuery"
              @keyup.enter="handleSearch"
              placeholder="Search products..."
              class="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <svg
              class="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        <!-- Right Side Actions -->
        <div class="flex items-center space-x-4">
          <!-- Currency Selector -->
          <div class="hidden md:block">
            <CurrencySelector />
          </div>
          
          <!-- Notifications -->
          <NotificationBell v-if="isAuthenticated" />
          
          <!-- Cart Icon -->
          <router-link
            to="/cart"
            class="relative p-2 text-gray-700 hover:text-primary-600 transition-colors"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span
              v-if="cartItemCount > 0"
              class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
            >
              {{ cartItemCount }}
            </span>
          </router-link>

          <!-- User Menu -->
          <div v-if="isAuthenticated" class="relative user-menu-container">
            <button
              @click.stop="showUserMenu = !showUserMenu"
              class="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
            >
              <div class="h-8 w-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                {{ userInitials }}
              </div>
              <span class="hidden md:block">{{ user?.name }}</span>
              <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              @click.stop
              class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50"
            >
              <router-link
                to="/profile"
                class="block px-4 py-2 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Profile
              </router-link>
              <router-link
                to="/orders"
                class="block px-4 py-2 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Orders
              </router-link>
              <router-link
                to="/wishlist"
                class="block px-4 py-2 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Wishlist
              </router-link>
              <router-link
                v-if="isAdmin"
                to="/admin"
                class="block px-4 py-2 hover:bg-gray-100"
                @click="showUserMenu = false"
              >
                Admin Panel
              </router-link>
              <hr class="my-2" />
              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
              >
                Logout
              </button>
            </div>
          </div>

          <!-- Login Button -->
          <router-link
            v-else
            to="/login"
            class="btn btn-primary"
          >
            Login
          </router-link>

          <!-- Mobile Menu Toggle -->
          <button
            @click="$emit('toggle-sidebar')"
            class="md:hidden p-2 text-gray-700"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useCartStore } from '@/stores/cart'
import { cartApi } from '@/api/endpoints/cart'
import CurrencySelector from '@/components/currency/CurrencySelector.vue'
import NotificationBell from '@/components/notifications/NotificationBell.vue'

const router = useRouter()
const authStore = useAuthStore()
const cartStore = useCartStore()

const searchQuery = ref('')
const showUserMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const isAdmin = computed(() => authStore.isAdmin)
const user = computed(() => authStore.user)
const cartItemCount = computed(() => {
  return (cartStore.cart?.items ?? []).reduce((sum, item) => sum + item.quantity, 0)
})

const userInitials = computed(() => {
  if (!user.value?.name) return 'U'
  return user.value.name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'Search', query: { q: searchQuery.value } })
  }
}

const handleLogout = () => {
  authStore.logout()
  showUserMenu.value = false
  router.push({ name: 'Home' })
}

const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.user-menu-container')) {
    showUserMenu.value = false
  }
}

async function loadCartIfAuthenticated() {
  if (!authStore.isAuthenticated) return
  try {
    const res = await cartApi.getCart()
    if (res.success && res.data) cartStore.setCart(res.data)
  } catch {
    // Ignore; cart will load when user visits cart or adds item
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  loadCartIfAuthenticated()
})

watch(isAuthenticated, (authenticated) => {
  if (authenticated) loadCartIfAuthenticated()
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

