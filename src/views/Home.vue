<template>
  <div>
    <Header />
    <main>
      <!-- Hero -->
      <section class="relative min-h-[440px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-security-900 via-security-800 to-security-950">
        <div class="absolute inset-0 bg-security-950/50" />
        <div class="relative container mx-auto px-4 text-center text-white py-20">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Protect What Matters Most</h1>
          <p class="text-lg md:text-xl text-security-200 mb-2">Trusted CCTV Installation Experts in Delhi NCR for 20+ Years</p>
          <p class="text-security-300 text-sm md:text-base mb-10">Because Every Home Deserves to Feel Safe</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-colors shadow-lg"
            >
              Get Free Site Visit
            </router-link>
            <router-link
              to="/products"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/90 text-white hover:bg-white hover:text-security-900 font-semibold transition-colors"
            >
              View CCTV Packages
            </router-link>
          </div>
        </div>
      </section>

      <!-- Trust / experience strip -->
      <section class="py-5 bg-security-800 border-b border-security-700">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-white text-sm md:text-base font-medium">
            <span class="inline-flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-accent/90 text-white shadow-sm">20+ Years Experience</span>
            </span>
            <span class="text-security-200">Serving Delhi NCR</span>
            <span class="text-security-200">2-Year Support Promise</span>
          </div>
        </div>
      </section>

      <!-- Core positioning line -->
      <section class="py-7 bg-security-50 border-b border-security-200">
        <div class="container mx-auto px-4 text-center">
          <p class="text-security-900 font-semibold text-lg">20+ Years of Trusted CCTV Installation Experience in Delhi NCR</p>
        </div>
      </section>

      <!-- CCTV Packages (Home / Shop / Office) -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-security-900 mb-6">CCTV Packages</h2>
          <div class="flex flex-wrap gap-2 mb-8">
            <button
              v-for="tab in packageTabs"
              :key="tab.id"
              type="button"
              class="px-5 py-2.5 rounded-lg font-medium transition-colors"
              :class="packageTab === tab.id ? 'bg-security-800 text-white shadow-md' : 'bg-security-50 text-security-700 hover:bg-security-100 border border-security-200'"
              @click="packageTab = tab.id"
            >
              {{ tab.label }}
            </button>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div v-for="pkg in currentPackages" :key="pkg.id" class="rounded-xl border border-security-200 overflow-hidden bg-white shadow-sm hover:shadow-lg hover:border-security-300 transition-all">
              <div class="aspect-video bg-security-100 relative">
                <img
                  :src="pkg.image"
                  :alt="pkg.name"
                  class="w-full h-full object-cover absolute inset-0"
                  @error="(e) => { (e.target as HTMLImageElement).style.display = 'none'; (e.target as HTMLImageElement).nextElementSibling?.classList.remove('hidden') }"
                />
                <div class="hidden absolute inset-0 bg-security-200 flex items-center justify-center text-security-600 text-sm">Placeholder</div>
              </div>
              <div class="p-4">
                <h3 class="font-semibold text-security-900">{{ pkg.name }}</h3>
                <p class="text-sm text-security-600 mt-1 line-clamp-2">{{ pkg.description }}</p>
                <div class="mt-4 flex gap-2">
                  <router-link :to="'/products'" class="flex-1 text-center py-2.5 rounded-lg bg-accent hover:bg-accent-hover text-white text-sm font-medium transition-colors">Get Free Site Visit</router-link>
                  <router-link :to="'/products'" class="flex-1 text-center py-2.5 rounded-lg border border-security-300 text-security-700 hover:bg-security-50 text-sm font-medium transition-colors">View</router-link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Installation process -->
      <section class="py-16 bg-security-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-security-900 mb-10">Our Installation Process</h2>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div v-for="(step, i) in installationSteps" :key="i" class="text-center p-4 rounded-xl bg-white border border-security-200 shadow-sm">
              <div class="w-14 h-14 rounded-full bg-security-800 text-white flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-md">{{ i + 1 }}</div>
              <h3 class="font-semibold text-security-900">{{ step.title }}</h3>
              <p class="text-sm text-security-600 mt-2">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4 max-w-3xl">
          <h2 class="text-2xl md:text-3xl font-bold text-security-900 mb-6">Why MXRServices</h2>
          <p class="text-security-700 leading-relaxed">
            At MXRServices, our mission is to provide reliable, affordable, and advanced CCTV security solutions to homes and businesses across Delhi NCR. With over 20 years of hands-on experience, we focus on quality installation, honest service, and long-term customer support.
          </p>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-16 bg-security-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-security-900 mb-8">What Our Customers Say</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(t, i) in testimonials" :key="i" class="rounded-xl border border-security-200 bg-white p-6 shadow-sm">
              <p class="text-security-700 italic">"{{ t.quote }}"</p>
              <p class="mt-4 font-semibold text-security-900">{{ t.name }}</p>
              <p class="text-sm text-security-500">{{ t.location }}</p>
            </div>
          </div>
          <p class="mt-6 text-center text-sm text-security-500">Google Reviews – Replace with real testimonials</p>
        </div>
      </section>

      <!-- Service areas -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-security-900 mb-8">Serving Delhi NCR</h2>
          <p class="text-security-600 mb-6">We provide CCTV installation and support across the following areas:</p>
          <div class="flex flex-wrap gap-3">
            <span v-for="area in serviceAreas" :key="area" class="px-4 py-2.5 rounded-lg bg-security-50 border border-security-200 text-security-800 font-medium">{{ area }}</span>
          </div>
        </div>
      </section>

      <!-- Trust signals (images + logos) -->
      <section class="py-16 bg-security-50">
        <div class="container mx-auto px-4">
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 class="text-2xl font-bold text-security-900 mb-6">Trust Signals</h2>
              <div class="grid grid-cols-2 gap-4">
                <div v-for="i in 4" :key="i" class="aspect-video bg-security-200 rounded-xl overflow-hidden border border-security-200">
                  <img :src="placeholderImageUrl" :alt="'Installation ' + i" class="w-full h-full object-cover" @error="handlePlaceholderError" />
                </div>
              </div>
              <p class="text-sm text-security-500 mt-2">Add real installation photos</p>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-security-900 mb-6">Partners & Certifications</h2>
              <div class="flex flex-wrap gap-6 items-center">
                <div v-for="i in 5" :key="i" class="w-24 h-12 bg-security-200 rounded-lg flex items-center justify-center text-security-500 text-xs">Logo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="py-20 bg-gradient-to-br from-security-900 via-security-800 to-security-950 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Ready to Secure Your Space?</h2>
          <p class="text-security-200 mb-10">Get a free site visit and quote. Call or message us on WhatsApp.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-accent hover:bg-accent-hover text-white font-semibold transition-colors shadow-lg">Get Free Site Visit</router-link>
            <a v-if="contactPhone" :href="'tel:' + contactPhone" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-white/90 text-white hover:bg-white hover:text-security-900 font-semibold transition-colors">Call {{ contactPhone }}</a>
            <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-accent/90 hover:bg-accent text-white font-semibold transition-colors shadow-lg">WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
    <Footer />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { env } from '@/config/env'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'
import Toast from '@/components/common/Toast.vue'

const contactPhone = env.contactPhone
const whatsappHref = env.whatsappNumber ? `https://wa.me/${env.whatsappNumber}` : ''
const placeholderImageUrl = '/placeholder.png'

const packageTab = ref('home')
const packageTabs = [
  { id: 'home', label: 'Home' },
  { id: 'shop', label: 'Shop' },
  { id: 'office', label: 'Office' }
]

const homePackages = [
  { id: 'h1', name: 'Home Security 4-Cam', description: 'Complete home surveillance with 4 cameras and DVR.', image: placeholderImageUrl },
  { id: 'h2', name: 'Home Basic 2-Cam', description: 'Entry-level package for small homes.', image: placeholderImageUrl },
  { id: 'h3', name: 'Home Premium 8-Cam', description: 'Full coverage for large homes and gardens.', image: placeholderImageUrl },
  { id: 'h4', name: 'Smart Home Bundle', description: 'IP cameras with mobile app and cloud backup.', image: placeholderImageUrl }
]
const shopPackages = [
  { id: 's1', name: 'Shop Surveillance Kit', description: 'Ideal for retail shops and showrooms.', image: placeholderImageUrl },
  { id: 's2', name: 'Shop Pro 4-Cam', description: 'HD recording and night vision for shops.', image: placeholderImageUrl },
  { id: 's3', name: 'Shop Premium', description: 'Multi-angle coverage with remote viewing.', image: placeholderImageUrl },
  { id: 's4', name: 'POS + CCTV Combo', description: 'Camera integration with billing counter.', image: placeholderImageUrl }
]
const officePackages = [
  { id: 'o1', name: 'Office Standard', description: 'Reception and corridor coverage.', image: placeholderImageUrl },
  { id: 'o2', name: 'Office Premium', description: 'Full floor coverage with analytics.', image: placeholderImageUrl },
  { id: 'o3', name: 'Enterprise Pack', description: 'Multi-floor, centralised monitoring.', image: placeholderImageUrl },
  { id: 'o4', name: 'Office 4-Cam Starter', description: 'Small office or startup package.', image: placeholderImageUrl }
]

const currentPackages = computed(() => {
  if (packageTab.value === 'shop') return shopPackages
  if (packageTab.value === 'office') return officePackages
  return homePackages
})

const installationSteps = [
  { title: 'Free site visit', desc: 'We assess your premises and requirements.' },
  { title: 'Custom plan & quote', desc: 'Tailored package and transparent pricing.' },
  { title: 'Professional installation', desc: 'Expert setup and cabling.' },
  { title: 'Training & handover', desc: 'You learn to use the system.' },
  { title: 'After-sales support', desc: 'Warranty and ongoing support.' }
]

const testimonials = [
  { quote: 'Professional team and very satisfied with the installation. Highly recommend for home security.', name: 'Customer 1', location: 'Delhi NCR' },
  { quote: 'Got my shop covered with their package. Service was on time and the system works great.', name: 'Customer 2', location: 'Noida' },
  { quote: '20+ years of experience shows. They know what they are doing and gave honest advice.', name: 'Customer 3', location: 'Gurgaon' }
]

const serviceAreas = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Greater Noida', 'Meerut', 'Sonipat']

function handlePlaceholderError(e: Event) {
  const el = e.target as HTMLImageElement
  if (el) el.style.display = 'none'
}
</script>
