<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 font-display">
    <HeaderTemp4 />
    <main class="flex-1 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-10">
      <div class="layout-content-container flex flex-col max-w-[1200px] w-full">
        <!-- Page Header -->
        <div class="flex flex-col gap-4 mb-10 text-center md:text-left">
          <h1 class="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Security Packages & Pricing
          </h1>
          <p class="text-slate-500 dark:text-slate-400 text-lg font-normal leading-normal max-w-2xl">
            Protect what matters most with our professional security solutions. Flexible plans designed for every scale of operation.
          </p>
        </div>

        <!-- Segmented Control -->
        <div class="flex mb-10 w-full max-w-md self-center md:self-start">
          <div class="flex h-12 flex-1 rounded-xl bg-slate-200 dark:bg-slate-800 p-1.5 shadow-inner">
            <label
              v-for="opt in segmentOptions"
              :key="opt.value"
              class="flex cursor-pointer h-full grow items-center justify-center overflow-hidden rounded-lg px-2 text-sm font-semibold transition-all"
              :class="selectedSegment === opt.value
                ? 'bg-white dark:bg-slate-700 shadow-sm text-sgPrimary'
                : 'text-slate-600 dark:text-slate-400'"
            >
              <span class="truncate">{{ opt.label }}</span>
              <input
                v-model="selectedSegment"
                type="radio"
                :value="opt.value"
                name="category"
                class="hidden"
              />
            </label>
          </div>
        </div>

        <!-- Pricing Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div
            v-for="plan in plans"
            :key="plan.name"
            class="flex flex-col gap-6 rounded-xl border bg-white dark:bg-slate-900 p-8 shadow-sm transition-shadow hover:shadow-md"
            :class="plan.isPopular
              ? 'border-2 border-sgPrimary shadow-lg relative transform scale-105 z-10'
              : 'border-slate-200 dark:border-slate-800'"
          >
            <div v-if="plan.isPopular" class="absolute -top-3 left-1/2 -translate-x-1/2 bg-sgPrimary text-white text-[10px] font-bold uppercase tracking-widest px-4 py-1 rounded-full">
              Most Popular
            </div>
            <div class="flex flex-col gap-2">
              <div class="flex flex-col gap-1">
                <h3 class="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider">{{ plan.category }}</h3>
                <h2 class="text-slate-900 dark:text-white text-xl font-bold leading-tight">{{ plan.name }}</h2>
              </div>
              <p class="flex items-baseline gap-1 text-slate-900 dark:text-white mt-4">
                <span class="text-4xl font-black tracking-tight">${{ plan.price }}</span>
                <span class="text-slate-500 dark:text-slate-400 text-sm font-medium">one-time</span>
              </p>
            </div>
            <router-link
              :to="plan.isPopular ? '/contact' : '/contact'"
              class="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 px-4 text-sm font-bold transition-all"
              :class="plan.isPopular
                ? 'bg-sgPrimary text-white hover:opacity-90'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-sgPrimary hover:text-white'"
            >
              Select Plan
            </router-link>
            <div class="flex flex-col gap-4 border-t border-slate-100 dark:border-slate-800 pt-6">
              <div
                v-for="(feature, i) in plan.features"
                :key="i"
                class="text-sm font-medium flex gap-3 items-center"
              >
                <span class="material-symbols-outlined text-sgPrimary text-[20px]">check_circle</span>
                {{ feature }}
              </div>
            </div>
          </div>
        </div>

        <!-- Custom CTA -->
        <div class="w-full p-1 bg-gradient-to-r from-sgPrimary/40 to-sgPrimary/10 rounded-2xl">
          <div class="flex flex-col md:flex-row items-center justify-between gap-8 rounded-xl bg-white dark:bg-slate-900 p-8 md:p-12 shadow-sm">
            <div class="flex flex-col gap-4 max-w-2xl">
              <div class="flex items-center gap-3">
                <div class="size-10 bg-sgPrimary/10 rounded-lg flex items-center justify-center text-sgPrimary">
                  <span class="material-symbols-outlined">architecture</span>
                </div>
                <h2 class="text-slate-900 dark:text-white text-2xl font-bold leading-tight">Custom Configuration</h2>
              </div>
              <p class="text-slate-500 dark:text-slate-400 text-lg font-normal leading-relaxed">
                Need a more specific setup? Design a security system tailored exactly to your property's layout, high-risk areas, and specific monitoring requirements. Our experts will help you scale without limits.
              </p>
            </div>
            <div class="flex flex-col gap-3 min-w-[200px]">
              <router-link
                to="/contact"
                class="flex items-center justify-center rounded-xl h-14 px-8 bg-sgPrimary text-white text-lg font-bold hover:opacity-90 shadow-lg shadow-sgPrimary/20 transition-all"
              >
                Build Your Own
              </router-link>
              <p class="text-center text-xs text-slate-400">Free consultation included</p>
            </div>
          </div>
        </div>
      </div>
    </main>
    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'

const selectedSegment = ref<'Home' | 'Office' | 'Industrial'>('Home')

const segmentOptions = [
  { value: 'Home' as const, label: 'Home' },
  { value: 'Office' as const, label: 'Office' },
  { value: 'Industrial' as const, label: 'Industrial' },
]

const plans = [
  {
    category: 'Small Homes',
    name: 'Starter Setup',
    price: '499',
    isPopular: false,
    features: ['2x 4K UHD Cameras', '1TB DVR Storage', 'Mobile App Access', 'Pro Installation'],
  },
  {
    category: 'Medium Homes',
    name: 'Standard Kit',
    price: '899',
    isPopular: true,
    features: ['4x 4K UHD Cameras', '2TB NVR Storage', 'Smart AI Detection', 'Pro Installation'],
  },
  {
    category: 'Large Property',
    name: 'Advanced Plus',
    price: '1,299',
    isPopular: false,
    features: ['6x 4K UHD Cameras', '4TB NVR Storage', 'Night Vision Pro', 'Pro Installation'],
  },
  {
    category: 'Estate/Commercial',
    name: 'Elite Guard',
    price: '1,699',
    isPopular: false,
    features: ['8x 4K UHD Cameras', '8TB NVR Storage', 'Cloud Backup (1 Yr)', 'Priority Support'],
  },
]
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
