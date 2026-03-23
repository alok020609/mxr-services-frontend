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
          <p class="text-slate-500 dark:text-slate-400 text-sm font-medium italic">
            Note: Final pricing may vary based on site inspection, cabling, and specific requirements.
          </p>
        </div>

        <div v-if="selectionSuccess" class="w-full rounded-2xl border border-green-200 bg-green-50 p-5 text-green-900 mb-6">
          <p class="font-bold mb-1">Request received</p>
          <p class="text-sm">{{ selectionSuccess }}</p>
        </div>
        <div v-else-if="selectionError" class="w-full rounded-2xl border border-red-200 bg-red-50 p-5 text-red-900 mb-6">
          <p class="font-bold mb-1">Could not submit your selection</p>
          <p class="text-sm">{{ selectionError }}</p>
        </div>

        <div v-if="showPackages" class="contents">
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
                  <span class="text-2xl font-black tracking-tight">Rs. {{ plan.price }}</span>
                  <span class="text-slate-500 dark:text-slate-400 text-sm font-medium">one-time</span>
                </p>
              </div>
              <button
                type="button"
                class="w-full flex cursor-pointer items-center justify-center rounded-lg h-11 px-4 text-sm font-bold transition-all"
                :class="plan.isPopular
                  ? 'bg-sgPrimary text-white hover:opacity-90'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-sgPrimary hover:text-white'"
                :disabled="selectionSubmitting[plan.name] === true"
                @click="handleSelectPlan(plan)"
              >
                {{ selectionSubmitting[plan.name] ? 'Submitting...' : 'Select Plan' }}
              </button>
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
        </div>

        <div
          v-else
          v-if="!selectionSuccess && !selectionError"
          class="w-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 mb-12 text-center"
        >
          <div class="mx-auto size-12 rounded-xl bg-sgPrimary/10 flex items-center justify-center text-sgPrimary mb-3">
            <span class="material-symbols-outlined">construction</span>
          </div>
          <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Packages are temporarily unavailable</h2>
          <p class="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            We’re updating our package pricing flow. For now, please use “Build Your Own” or contact us so our team can assist you.
          </p>
        </div>

        <!-- Custom CTA -->
        <!--
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
        -->
      </div>
    </main>
    <FooterTemp4 />
  </div>

  <Modal
    :is-open="confirmOpen"
    title="Confirm package selection"
    @close="closeConfirm"
    @confirm="confirmSelection"
    :show-footer="true"
  >
    <div class="space-y-3">
      <p class="text-sm text-slate-700 dark:text-slate-200">
        Are you sure you want to submit the selection for
        <span class="font-semibold">{{ pendingPlan?.name }}</span>?
      </p>
      <p class="text-xs text-slate-500 dark:text-slate-400">
        You will receive a confirmation email and a team member will connect with you shortly.
      </p>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
import { packagesApi } from '@/api/endpoints/packages'
import { useAuthStore } from '@/stores/auth'
import { useUIStore } from '@/stores/ui'
import Modal from '@/components/common/Modal.vue'
import type { AxiosError } from 'axios'
import { extractErrorMessage } from '@/utils/errorHandler'

type Segment = 'Home' | 'Office' | 'Industrial'

interface Plan {
  category: string
  name: string
  price: string
  isPopular: boolean
  features: string[]
}

const selectedSegment = ref<Segment>('Home')

const segmentOptions = [
  { value: 'Home' as const, label: 'Home' },
  { value: 'Office' as const, label: 'Office' },
  { value: 'Industrial' as const, label: 'Industrial' },
]

// Hide packages only after a successful selection submission.
const showPackages = ref(true)

const plansHome: Plan[] = [
  {
    category: 'Small Homes',
    name: 'Starter Setup',
    price: '12,999',
    isPopular: false,
    features: ['2x 2.4 MP HD Cameras', '500 GB Hard Disk Storage', '1 Four-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Medium Homes',
    name: 'Standard Kit',
    price: '16,999',
    isPopular: true,
    features: ['4x 2.4 MP HD Cameras with Mic', '1 TB Hard Disk Storage', '1 Four-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Large Property',
    name: 'Advanced Plus',
    price: '24,999',
    isPopular: false,
    features: ['6x 5 MP HD Cameras with Mic', '1 TB Hard Disk Storage', '1 Eight-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Estate/Commercial',
    name: 'Elite Guard',
    price: '42,999',
    isPopular: false,
    features: ['8x IP Cameras', '1 TB Hard Disk Storage', '1 Eight-Channel NVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
]

// Office: same structure as Home for now, with Office-oriented category labels
const plansOffice: Plan[] = [
  {
    category: 'Small Office',
    name: 'Starter Setup',
    price: '12,999',
    isPopular: false,
    features: ['2x 2.4 MP HD Cameras with Mics', '500 GB Hard Disk Storage', '1 Four-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Medium Office',
    name: 'Standard Kit',
    price: '18,999',
    isPopular: true,
    features: ['4x 5 MP HD Cameras with Mic', '1 TB Hard Disk Storage', '1 Four-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Large Office',
    name: 'Advanced Plus',
    price: '36,599',
    isPopular: false,
    features: ['6x IP Cameras', '1 TB Hard Disk Storage', '1 Eight-Channel NVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Enterprise',
    name: 'Elite Guard',
    price: '42,999',
    isPopular: false,
    features: ['8x IP Cameras', '1 TB Hard Disk Storage', '1 Eight-Channel NVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  }
]

// Industrial: same structure as Home for now, with Industrial-oriented category labels
const plansIndustrial: Plan[] = [
  {
    category: 'Small Site',
    name: 'Starter Setup',
    price: '15,999',
    isPopular: false,
    features: ['4x 2.4 MP HD Cameras with Mics', '500 GB Hard Disk Storage', '1 Four-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Medium Site',
    name: 'Standard Kit',
    price: '29,999',
    isPopular: true,
    features: ['8x 5 MP HD Cameras with Mic', '1 TB Hard Disk Storage', '1 Eight-Channel DVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Large Site',
    name: 'Advanced Plus',
    price: '60,599',
    isPopular: false,
    features: ['12x IP Cameras', '1 TB Hard Disk Storage', '2 Eight-Channel NVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
  {
    category: 'Industrial/Heavy',
    name: 'Elite Guard',
    price: '70,999',
    isPopular: false,
    features: ['16x IP Cameras', '1 TB Hard Disk Storage', '2 Eight-Channel NVR', 'Mobile App Remote Viewing (Android/iOS)', 'Professional Installation Included', '1 Year Service Support'],
  },
]

const plansBySegment: Record<Segment, Plan[]> = {
  Home: plansHome,
  Office: plansOffice,
  Industrial: plansIndustrial,
}

const plans = computed(() => plansBySegment[selectedSegment.value])

const router = useRouter()
const authStore = useAuthStore()
const uiStore = useUIStore()

const selectionSubmitting = ref<Record<string, boolean>>({})
const selectionSuccess = ref<string | null>(null)
const selectionError = ref<string | null>(null)

const confirmOpen = ref(false)
const pendingPlan = ref<Plan | null>(null)

async function handleSelectPlan(plan: Plan) {
  selectionError.value = null
  selectionSuccess.value = null

  if (!authStore.isAuthenticated) {
    uiStore.showNotification('info', 'Please log in to submit your package selection.')
    router.push({ name: 'Login', query: { redirect: router.currentRoute.value.fullPath } })
    return
  }

  pendingPlan.value = plan
  confirmOpen.value = true
}

function closeConfirm() {
  confirmOpen.value = false
  pendingPlan.value = null
}

async function confirmSelection() {
  if (!pendingPlan.value) return
  const plan = pendingPlan.value
  confirmOpen.value = false

  selectionSubmitting.value = { ...selectionSubmitting.value, [plan.name]: true }
  try {
    const payload = {
      category: plan.category,
      name: plan.name,
      price: plan.price,
      isPopular: plan.isPopular,
      features: plan.features
    }

    const res = await packagesApi.selectPackage(payload)

    if (res.success) {
      selectionSuccess.value = 'Confirmation email sent. One of our team members will connect with you shortly.'
      showPackages.value = false
    } else {
      selectionError.value = res.error || res.message || 'Could not submit your request.'
    }
  } catch (err: unknown) {
    const axiosError = err as AxiosError
    selectionError.value = extractErrorMessage(axiosError)
  } finally {
    selectionSubmitting.value = { ...selectionSubmitting.value, [plan.name]: false }
    pendingPlan.value = null
  }
}
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
