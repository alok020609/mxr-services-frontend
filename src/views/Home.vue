<template>
  <div>
    <Header />
    <main>
      <!-- Hero -->
      <section class="relative min-h-[420px] flex items-center justify-center overflow-hidden bg-slate-700">
        <!-- Add your hero image as public/hero-placeholder.jpg and use: <img src="/hero-placeholder.jpg" class="absolute inset-0 w-full h-full object-cover opacity-90" alt="" /> -->
        <div class="absolute inset-0 bg-black/50" />
        <div class="relative container mx-auto px-4 text-center text-white py-16">
          <h1 class="text-4xl md:text-5xl font-bold mb-4">YOUR SAFETY, OUR PRIORITY</h1>
          <p class="text-lg md:text-xl text-slate-200 mb-8">Professional solutions & expert installation</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/products"
              class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Shop cameras
            </router-link>
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold transition-colors"
            >
              Book installation
            </router-link>
          </div>
        </div>
      </section>

      <!-- I NEED EQUIPMENT -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl md:text-3xl font-bold text-slate-800">I NEED EQUIPMENT</h2>
            <div class="flex items-center gap-2">
              <span class="text-sm text-slate-600">Equipment</span>
              <button
                type="button"
                role="switch"
                aria-checked="equipmentMode"
                class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full bg-slate-700 transition-colors"
                :class="equipmentMode ? 'bg-emerald-600' : ''"
                @click="equipmentMode = !equipmentMode"
              >
                <span class="sr-only">Toggle</span>
                <span
                  class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition translate-x-1"
                  :class="equipmentMode ? 'translate-x-6' : 'translate-x-1'"
                />
              </button>
              <span class="text-sm text-slate-600">Services</span>
            </div>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <!-- Left: I need equipment card -->
            <div class="lg:col-span-2">
              <div class="rounded-xl bg-slate-800 text-white p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                <div class="w-14 h-14 rounded-full bg-slate-700 flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  </svg>
                </div>
                <h3 class="font-semibold text-lg">I need equipment</h3>
              </div>
            </div>
            <!-- Middle: 4 product cards -->
            <div class="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div v-for="item in equipmentProducts" :key="item.id" class="rounded-xl border border-slate-200 overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow">
                <div class="aspect-square bg-slate-200 relative">
                  <img
                    :src="item.image"
                    :alt="item.name"
                    class="w-full h-full object-cover absolute inset-0"
                    @error="(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }"
                  />
                  <div class="hidden absolute inset-0 bg-slate-300 flex items-center justify-center text-slate-500 text-sm">Placeholder</div>
                </div>
                <div class="p-4">
                  <h3 class="font-semibold text-slate-800">{{ item.name }}</h3>
                  <p class="text-sm text-slate-500 mt-1 line-clamp-2">{{ item.description }}</p>
                  <p class="text-slate-800 font-bold mt-2">{{ item.price }}</p>
                  <router-link :to="'/products' + (item.slug ? '/' + item.slug : '')" class="mt-3 inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
                    Go to shop
                  </router-link>
                </div>
              </div>
            </div>
            <!-- Right: I need a pro -->
            <div class="lg:col-span-2">
              <div class="rounded-xl bg-slate-100 border border-slate-200 p-6 h-full flex flex-col items-center justify-center text-center min-h-[200px]">
                <div class="w-14 h-14 rounded-full bg-slate-300 flex items-center justify-center mb-4">
                  <svg class="w-8 h-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <h3 class="font-semibold text-slate-800">I need a pro</h3>
                <p class="text-sm text-slate-600 mt-2">Expert consultation & installation</p>
                <router-link to="/services" class="mt-4 inline-block px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-800 text-white text-sm font-medium">View services</router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FIND YOUR CALCULATOR -->
      <section class="py-16 bg-slate-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-slate-800 mb-8">FIND YOUR CALCULATOR</h2>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Tabs + input -->
            <div class="space-y-4">
              <div class="flex flex-col gap-2">
                <button
                  v-for="tab in calculatorTabs"
                  :key="tab.id"
                  type="button"
                  class="px-4 py-3 rounded-lg text-left font-medium transition-colors"
                  :class="calculatorTab === tab.id ? 'bg-slate-800 text-white' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'"
                  @click="calculatorTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-1">Number of rooms</label>
                <input
                  v-model.number="calculatorRooms"
                  type="number"
                  min="1"
                  class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500 focus:border-slate-500"
                />
              </div>
            </div>
            <!-- Middle: Recommended bundle -->
            <div class="rounded-xl border border-slate-200 bg-white overflow-hidden shadow-sm">
              <div class="aspect-video bg-slate-200 flex items-center justify-center">
                <img
                  :src="placeholderImageUrl"
                  alt="Recommended bundle"
                  class="w-full h-full object-cover"
                  @error="handlePlaceholderError"
                />
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-slate-800">Recommended Bundle: 4-Camera Pre-kit</h3>
                <router-link to="/products" class="mt-3 inline-block px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium">
                  Customize & buy
                </router-link>
              </div>
            </div>
            <!-- Right: Installation packages form -->
            <div class="rounded-xl border border-slate-200 bg-white p-6">
              <h3 class="font-semibold text-slate-800 mb-4">Installation packages</h3>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Devices</label>
                  <input
                    v-model="installDevices"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-slate-700 mb-1">Number of rooms</label>
                  <input
                    v-model="installRooms"
                    type="number"
                    min="0"
                    class="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-500"
                  />
                </div>
                <router-link
                  to="/contact"
                  class="inline-flex items-center justify-center w-full py-3 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-medium"
                >
                  Get quote
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- TRUST SIGNALS -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6">TRUST SIGNALS</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="aspect-video bg-slate-200 rounded-lg flex items-center justify-center">
                  <img
                    :src="placeholderImageUrl"
                    :alt="'Trust image ' + i"
                    class="w-full h-full object-cover rounded-lg"
                    @error="handlePlaceholderError"
                  />
                </div>
              </div>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-slate-800 mb-6">TRUST SIGNALS</h2>
              <div class="flex flex-wrap gap-6 items-center">
                <div v-for="i in 5" :key="i" class="w-24 h-12 bg-slate-200 rounded flex items-center justify-center text-slate-500 text-xs">
                  Logo
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/common/Toast.vue'

const equipmentMode = ref(true)
const calculatorTab = ref('home')
const calculatorRooms = ref(4)
const installDevices = ref<number | ''>('')
const installRooms = ref<number | ''>('')
const calculatorTabs = [
  { id: 'home', label: 'Home' },
  { id: 'office', label: 'Office' },
  { id: 'warehouse', label: 'Warehouse' }
]

// Use a variable so Vite does not try to resolve the path at build time (file may not exist yet)
const placeholderImageUrl = '/placeholder.jpg'

const equipmentProducts = ref([
  { id: '1', name: 'Camera Kit A', description: 'Professional security camera with night vision.', price: '$508', image: placeholderImageUrl, slug: '' },
  { id: '2', name: 'Camera Kit B', description: 'Indoor/outdoor durable design.', price: '$368', image: placeholderImageUrl, slug: '' },
  { id: '3', name: 'Camera Kit C', description: '4K resolution with wide angle.', price: '$589', image: placeholderImageUrl, slug: '' },
  { id: '4', name: 'Camera Kit D', description: 'Wireless with cloud storage option.', price: '$500', image: placeholderImageUrl, slug: '' }
])

function handlePlaceholderError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el) el.style.display = 'none'
}
</script>
