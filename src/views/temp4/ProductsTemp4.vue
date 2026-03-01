<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 antialiased">
    <HeaderTemp4 />
    <main class="mx-auto flex w-full max-w-7xl flex-1 gap-8 p-4 sm:p-6 lg:px-10 lg:py-10">
      <!-- Sidebar -->
      <aside class="hidden w-64 shrink-0 flex-col gap-8 lg:flex">
        <div>
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Categories</h3>
          <div class="flex flex-col gap-1">
            <button
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-semibold transition-colors"
              :class="selectedCategory === 'all' ? 'bg-sgPrimary/10 text-sgPrimary' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'"
              @click="selectedCategory = 'all'"
            >
              <span class="material-symbols-outlined text-xl">grid_view</span>
              All Products
            </button>
            <button
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              :class="selectedCategory === 'cameras' ? 'bg-sgPrimary/10 text-sgPrimary' : 'text-slate-600 dark:text-slate-400'"
              @click="selectedCategory = 'cameras'"
            >
              <span class="material-symbols-outlined text-xl">videocam</span>
              CCTV Cameras
            </button>
            <button
              class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-800"
              :class="selectedCategory === 'locks' ? 'bg-sgPrimary/10 text-sgPrimary' : 'text-slate-600 dark:text-slate-400'"
              @click="selectedCategory = 'locks'"
            >
              <span class="material-symbols-outlined text-xl">lock_open</span>
              Smart Locks
            </button>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Camera Resolution</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.resolution" type="checkbox" value="4k" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>4K Ultra HD (8MP)</span>
            </label>
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.resolution" type="checkbox" value="2k" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>2K QHD (4MP)</span>
            </label>
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.resolution" type="checkbox" value="1080p" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>1080p Full HD</span>
            </label>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Lock Type</h3>
          <div class="space-y-2">
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.lockType" type="checkbox" value="biometric" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>Biometric (Fingerprint)</span>
            </label>
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.lockType" type="checkbox" value="keypad" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>Keypad Entry</span>
            </label>
            <label class="flex items-center gap-3 text-sm cursor-pointer">
              <input v-model="filters.lockType" type="checkbox" value="app" class="rounded border-slate-300 text-sgPrimary focus:ring-sgPrimary" />
              <span>Mobile App Control</span>
            </label>
          </div>
        </div>
        <div class="border-t border-slate-200 dark:border-slate-800 pt-6">
          <h3 class="mb-4 text-sm font-bold uppercase tracking-wider text-slate-500">Price Range</h3>
          <input v-model.number="priceRange" type="range" min="50" max="2000" class="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-sgPrimary" />
          <div class="mt-2 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>$50</span>
            <span>$2,000+</span>
          </div>
        </div>
      </aside>

      <!-- Main -->
      <div class="flex-1">
        <div class="mb-8">
          <nav class="mb-4 flex gap-2 text-sm font-medium text-slate-500">
            <router-link to="/" class="hover:text-sgPrimary">Shop</router-link>
            <span>/</span>
            <span class="text-slate-900 dark:text-white">Security Hardware</span>
          </nav>
          <h1 class="text-4xl font-black tracking-tight text-slate-900 dark:text-white">Professional Security Hardware</h1>
          <p class="mt-2 text-slate-600 dark:text-slate-400">High-performance security solutions with optional certified installation services.</p>
        </div>

        <!-- Active Filters & Sort -->
        <div class="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in activeFilterTags"
              :key="tag"
              class="flex items-center gap-1 rounded-full bg-slate-200 dark:bg-slate-800 px-3 py-1 text-xs font-bold uppercase"
              @click="removeFilterTag(tag)"
            >
              {{ tag }}
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-sm font-medium text-slate-500">Sort by:</span>
            <select v-model="sortBy" class="rounded-lg border-0 bg-white dark:bg-slate-800 py-1 pl-3 pr-8 text-sm font-semibold focus:ring-sgPrimary shadow-sm">
              <option>Most Popular</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <!-- Product Grid -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <div
            v-for="product in products"
            :key="product.id"
            class="group flex flex-col overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm transition-all hover:shadow-lg"
          >
            <div class="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
              <img
                :src="product.image"
                :alt="product.name"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <span
                v-if="product.badge"
                class="absolute left-3 top-3 rounded-lg px-2 py-1 text-[10px] font-bold uppercase text-white"
                :class="product.badgeClass"
              >
                {{ product.badge }}
              </span>
            </div>
            <div class="flex flex-1 flex-col p-5">
              <div class="mb-1 flex items-center justify-between">
                <span class="text-xs font-bold uppercase tracking-wider text-sgPrimary">{{ product.series }}</span>
                <div class="flex items-center gap-1 text-yellow-500">
                  <span class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1">star</span>
                  <span class="text-xs font-bold text-slate-900 dark:text-white">{{ product.rating }}</span>
                </div>
              </div>
              <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ product.name }}</h3>
              <p class="mt-2 text-sm text-slate-500 line-clamp-2">{{ product.description }}</p>
              <div class="mt-4 flex items-baseline gap-2">
                <span class="text-2xl font-black text-slate-900 dark:text-white">${{ product.price }}</span>
                <span v-if="product.compareAt" class="text-sm text-slate-400 line-through">${{ product.compareAt }}</span>
              </div>
              <div class="mt-6 flex flex-col gap-2">
                <router-link
                  to="/products"
                  class="w-full rounded-lg bg-sgPrimary py-2.5 text-sm font-bold text-white hover:opacity-90 transition-opacity text-center"
                >
                  Buy Product Only
                </router-link>
                <router-link
                  to="/contact"
                  class="w-full rounded-lg border-2 border-sgPrimary/20 bg-sgPrimary/5 py-2.5 text-sm font-bold text-sgPrimary hover:bg-sgPrimary/10 transition-colors flex items-center justify-center gap-2"
                >
                  <span class="material-symbols-outlined text-lg">build</span>
                  Buy + Installation
                </router-link>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div class="mt-12 flex items-center justify-center gap-2">
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg bg-sgPrimary font-bold text-white">1</button>
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">2</button>
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">3</button>
          <button type="button" class="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>
    </main>

    <!-- Installation CTA -->
    <section class="bg-sgPrimary/10 py-16 px-4 sm:px-6 lg:px-10 mt-12">
      <div class="mx-auto max-w-7xl">
        <div class="flex flex-col md:flex-row items-center justify-between gap-12">
          <div class="flex-1">
            <h2 class="text-3xl font-black text-slate-900 dark:text-white">Need professional installation?</h2>
            <p class="mt-4 text-lg text-slate-600 dark:text-slate-400">Our certified technicians are available in 50+ cities to help you set up your security system safely and correctly.</p>
            <div class="mt-8 flex gap-4">
              <router-link to="/contact" class="rounded-lg bg-sgPrimary px-8 py-3 font-bold text-white shadow-lg shadow-sgPrimary/25 hover:scale-[1.02] active:scale-[0.98] transition-all">
                Schedule a Consult
              </router-link>
              <router-link to="/packages" class="rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-transparent px-8 py-3 font-bold hover:bg-white dark:hover:bg-slate-800 transition-colors">
                How it Works
              </router-link>
            </div>
          </div>
          <div class="flex-1 w-full max-w-sm">
            <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-8 shadow-xl">
              <span class="material-symbols-outlined text-5xl text-sgPrimary mb-4 block">verified_user</span>
              <h4 class="text-xl font-bold mb-2 text-slate-900 dark:text-white">Our Installation Promise</h4>
              <ul class="space-y-3">
                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                  <span>Same-day or next-day availability</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                  <span>24-month workmanship guarantee</span>
                </li>
                <li class="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span class="material-symbols-outlined text-green-500 text-lg">check_circle</span>
                  <span>In-person tutorial and app setup</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>

    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'

const selectedCategory = ref<'all' | 'cameras' | 'locks'>('all')
const sortBy = ref('Most Popular')
const priceRange = ref(1000)
const filters = ref<{ resolution: string[]; lockType: string[] }>({
  resolution: ['1080p'],
  lockType: [],
})

const activeFilterTags = ref(['Outdoor Rated', '4K Resolution'])

function removeFilterTag(tag: string) {
  activeFilterTags.value = activeFilterTags.value.filter((t) => t !== tag)
}

const products = [
  {
    id: '1',
    name: 'Guardian 4K Outdoor Cam',
    series: 'Pro Series',
    rating: '4.9',
    description: 'Night vision, two-way audio, and AI motion detection built-in.',
    price: '249',
    compareAt: '299',
    badge: 'Bestseller',
    badgeClass: 'bg-sgPrimary',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB8oRNRWEruZUAv5W9wdQDELrzy4vnnAKsd7h6RPPfYdGYTJrTII75L0iJMmp2poa3TRZ5JdCUEA26tAWiTBbuA-CI9wohPQbrC15zBO6tvZdDiXq9c58S-87fslQLtl6z0vWspXITndgAMRMFWLo-THV8asIAEliQ3qdAgDnF9CHClDL1QnEwX8lVtVy011FW-gCNQrnxYz819E4AUX14GgqS3v78KtEnl-BMdlH7W62JtRv_nNEm1VeYJxVVFw7dqk9ETR_C8Q0M',
  },
  {
    id: '2',
    name: 'Sentinel Pro Biometric',
    series: 'Smart Locks',
    rating: '4.8',
    description: 'Fingerprint scanner, backlit keypad, and emergency physical key access.',
    price: '189',
    compareAt: null,
    badge: 'Smart Choice',
    badgeClass: 'bg-slate-900',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDirJJ10Sdi9ITSCcdpZphC25x8ZXU7aOstypdiUIQPj8nIsCcUWrcfRJVxkxIQzOG2QQ0UkX_n_5npYgL-j1sJJpiIzrWetxE8AmfJa6NXAlleN71-YznECCbdI-L_V1fCPvgSgn9-pJbefwiUC4kBuaWHh8MX21VtcIhtH7h2dKEpRxN9-F5OpLRAsc81EO59e5LwZkQ83HXBWAGTzBKngEsnat704ItNRUmVO8BoJcVxMjV06RYwZshQycBDVJrTINElRS1Pr_U',
  },
  {
    id: '3',
    name: '360° Dome Vision Pro',
    series: 'Indoor',
    rating: '4.7',
    description: 'Full panoramic coverage with privacy shutter and 2K resolution.',
    price: '129',
    compareAt: null,
    badge: null,
    badgeClass: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDy2n5pv5kmPD4cVQdxrU6kp00cWge89NWDMHeQt5WeOpZZXKBoj7l5doyAB8OIK7HVw1fr6tTuD7RxpGDAaPtvxnw5FGFwcr39XrFXoX0NyFd51ZyDDXLDjb5mk9ygVr3lFk_ymtZNtyaytWvjWuwlRB5AZluGREKuiifr-5FTU2yQLAFB8Ixz7LZCtSIrHYsYDTzk16KGwG0YDUd8zk5psatab3SBOA8eV1YPFKrboPeaRBNoMlzwb4m9-U4--WHkqxrUVgYysVI',
  },
  {
    id: '4',
    name: 'TouchKey Stealth Lock',
    series: 'Smart Locks',
    rating: '4.9',
    description: 'Invisible from outside, sleek touchscreen inside. WiFi & Bluetooth enabled.',
    price: '215',
    compareAt: null,
    badge: null,
    badgeClass: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSR0ONIFXqdgrX7DHsxuFcvL2UQMhEBV9OXK431NAeQCwjDjXz3Xj3aDCXzc04B8PGYQjs6OLFZHCnxqHZfNOZo-Cq6qD9nmli9Fg-HIifvWsOM57NDthvHf1QARJIp_BQqHEWacMisElb1dFmiEgFSdzPap9dYSpiit5A0-os75JEP1veVU6IKBvQnzv8zgJ4utRbd4CjomPgk9PWkMJJsmXmSQSagHexV-ajLnpgMyYswCT4OnglL36kH39tSTINhY5RH9OJwLc',
  },
  {
    id: '5',
    name: 'Home Shield 4-Cam Kit',
    series: 'Full Kit',
    rating: '5.0',
    description: 'Complete system with 4 cameras, 1TB NVR, and all cables included.',
    price: '799',
    compareAt: '899',
    badge: 'Save $100',
    badgeClass: 'bg-red-600',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm0TD3T8wcLodwa_uREeaCMOE1QvCd_G6cN8oIlI0M34F-VAST0UfeYg0VnGXGoH-bMSRDgUnxgTBaGKvnBGu1k03gaO536kCxE6jHchyEpLtS9NSJINfTvkxwIOhYFnJjTago8BnyCrWg_jZQ1W1uk5FkqD0BZ3oV0xUwc8OQjhumwQSl5MCtVVg8a3tLShjEiZ99uka5ExMUrJeGIj6UQ6YdWE665uczmpnpeKR9jBwtlM2p4A7I-puKv5oF4xsn0LJdwjCXy10',
  },
  {
    id: '6',
    name: 'KeyPad Entry Elite',
    series: 'Budget Pro',
    rating: '4.6',
    description: 'Reliable weather-proof keypad entry with multiple user codes.',
    price: '95',
    compareAt: null,
    badge: null,
    badgeClass: '',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDLeLNM6LHZ2siXrmXUhoaH1q70h3HLWjAcf2QZl3ry2Qjk8Rg-IZKwG2r40JsQ-UCAKLxXSx-Lw_FPs9rmGlNwxxLBc2yZreysB2hCSY9iqnVcv99FMNjIaS0xvGMS5Rg2K1nWVl0wKsAZoVnU_Ix9fza_6ypDti1Gcz3C4BbJx7bT7BBvEyLY7oJ-JPjPJgb-06xwiS1p6Z6jAx-TuJUe6AWFKu6RiAbB-5vQK0vzggsFugx1sw1RtNeR7AdOlQC2lDT4AeRxs68',
  },
]
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
