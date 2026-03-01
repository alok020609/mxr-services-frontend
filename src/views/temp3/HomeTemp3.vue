<template>
  <div>
    <HeaderTemp3 />
    <main>
      <!-- Hero -->
      <section class="relative min-h-[440px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-cyber-950 via-cyber-900 to-cyber-950">
        <div class="absolute inset-0 bg-cyber-950/60" />
        <div class="relative container mx-auto px-4 text-center text-white py-20">
          <h1 class="text-4xl md:text-6xl font-bold mb-4 tracking-tight">Smart Security Systems for Modern Protection</h1>
          <p class="text-lg md:text-xl text-cyber-200 mb-2">CCTV Surveillance, Smart Door Locks, and Advanced Access Control Installed by Experts with 20+ Years Experience in Delhi NCR.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <router-link
              to="/contact"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-neon hover:bg-neon-hover text-cyber-950 font-semibold transition-colors shadow-lg"
            >
              Get Free Security Consultation
            </router-link>
            <router-link
              to="/products"
              class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-cyber-400 text-cyber-200 hover:bg-cyber-800 hover:text-white font-semibold transition-colors"
            >
              View Smart Security Products
            </router-link>
          </div>
        </div>
      </section>

      <!-- Trust strip -->
      <section class="py-5 bg-cyber-800 border-b border-cyber-700">
        <div class="container mx-auto px-4">
          <div class="flex flex-wrap justify-center items-center gap-8 md:gap-14 text-white text-sm md:text-base font-medium">
            <span class="inline-flex items-center gap-2">
              <span class="px-3 py-1 rounded-full bg-neon text-cyber-950 shadow-sm font-semibold">20+ Years Experience</span>
            </span>
            <span class="text-cyber-200">Serving Delhi NCR</span>
            <span class="text-cyber-200">2-Year Support Promise</span>
          </div>
        </div>
      </section>

      <!-- Positioning statement -->
      <section class="py-10 bg-cyber-100 border-b border-cyber-200">
        <div class="container mx-auto px-4 max-w-4xl text-center">
          <p class="text-cyber-900 font-semibold text-lg leading-relaxed">
            We provide end-to-end electronic security solutions including CCTV surveillance, smart door locks, video door phones, biometric access control, and alarm systems with professional installation across Delhi NCR.
          </p>
        </div>
      </section>

      <!-- Product categories (expanded) -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-cyber-900 mb-2 text-center">Complete Security Solutions</h2>
          <p class="text-cyber-600 text-center mb-10">CCTV • Smart Locks • Access Control — Total Security Under One Roof</p>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div class="rounded-xl border border-cyber-200 bg-cyber-50 p-6 hover:border-neon hover:shadow-md transition-all">
              <h3 class="text-lg font-semibold text-cyber-900 mb-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-neon/20 flex items-center justify-center text-neon">&#128268;</span>
                Surveillance Systems
              </h3>
              <ul class="space-y-1.5 text-sm text-cyber-700">
                <li>CCTV Cameras (Dome / Bullet / PTZ)</li>
                <li>Wireless Cameras</li>
                <li>Night Vision Cameras</li>
                <li>Cloud Recording Cameras</li>
              </ul>
              <router-link to="/products" class="mt-4 inline-block text-neon hover:text-neon-hover font-medium text-sm">View products</router-link>
            </div>
            <div class="rounded-xl border border-cyber-200 bg-cyber-50 p-6 hover:border-neon hover:shadow-md transition-all">
              <h3 class="text-lg font-semibold text-cyber-900 mb-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-neon/20 flex items-center justify-center text-neon">&#128274;</span>
                Smart Access & Locking
              </h3>
              <ul class="space-y-1.5 text-sm text-cyber-700">
                <li>Remote Control Smart Locks</li>
                <li>Biometric Door Locks</li>
                <li>Video Door Phones</li>
                <li>RFID Access Systems</li>
              </ul>
              <router-link to="/products" class="mt-4 inline-block text-neon hover:text-neon-hover font-medium text-sm">View products</router-link>
            </div>
            <div class="rounded-xl border border-cyber-200 bg-cyber-50 p-6 hover:border-neon hover:shadow-md transition-all">
              <h3 class="text-lg font-semibold text-cyber-900 mb-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-neon/20 flex items-center justify-center text-neon">&#128680;</span>
                Intrusion & Safety
              </h3>
              <ul class="space-y-1.5 text-sm text-cyber-700">
                <li>Burglar Alarm Systems</li>
                <li>Motion Sensors</li>
                <li>Fire & Smoke Detectors</li>
                <li>Glass Break Sensors</li>
              </ul>
              <router-link to="/products" class="mt-4 inline-block text-neon hover:text-neon-hover font-medium text-sm">View products</router-link>
            </div>
            <div class="rounded-xl border border-cyber-200 bg-cyber-50 p-6 hover:border-neon hover:shadow-md transition-all">
              <h3 class="text-lg font-semibold text-cyber-900 mb-3 flex items-center gap-2">
                <span class="w-8 h-8 rounded-lg bg-neon/20 flex items-center justify-center text-neon">&#127970;</span>
                Commercial Security
              </h3>
              <ul class="space-y-1.5 text-sm text-cyber-700">
                <li>Office Access Control</li>
                <li>Attendance Biometric Systems</li>
                <li>Multi-door Control Panels</li>
                <li>Intercom Security Systems</li>
              </ul>
              <router-link to="/products" class="mt-4 inline-block text-neon hover:text-neon-hover font-medium text-sm">View products</router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Mission -->
      <section class="py-16 bg-cyber-50">
        <div class="container mx-auto px-4 max-w-3xl">
          <h2 class="text-2xl md:text-3xl font-bold text-cyber-900 mb-6">Our Mission</h2>
          <p class="text-cyber-700 leading-relaxed">
            Our motive is to deliver complete electronic security solutions that protect homes, offices, and commercial spaces using advanced surveillance systems, smart locks, and access control technologies backed by reliable installation and long-term service support.
          </p>
        </div>
      </section>

      <!-- Installation process -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-cyber-900 mb-10">Our Installation Process</h2>
          <div class="grid grid-cols-1 md:grid-cols-5 gap-8">
            <div v-for="(step, i) in installationSteps" :key="i" class="text-center p-4 rounded-xl bg-cyber-50 border border-cyber-200 shadow-sm">
              <div class="w-14 h-14 rounded-full bg-cyber-900 text-neon flex items-center justify-center font-bold text-xl mx-auto mb-4 shadow-md">{{ i + 1 }}</div>
              <h3 class="font-semibold text-cyber-900">{{ step.title }}</h3>
              <p class="text-sm text-cyber-600 mt-2">{{ step.desc }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Testimonials -->
      <section class="py-16 bg-cyber-50">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-cyber-900 mb-8">What Our Customers Say</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(t, i) in testimonials" :key="i" class="rounded-xl border border-cyber-200 bg-white p-6 shadow-sm">
              <p class="text-cyber-700 italic">"{{ t.quote }}"</p>
              <p class="mt-4 font-semibold text-cyber-900">{{ t.name }}</p>
              <p class="text-sm text-cyber-500">{{ t.location }}</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Service areas -->
      <section class="py-16 bg-white">
        <div class="container mx-auto px-4">
          <h2 class="text-2xl md:text-3xl font-bold text-cyber-900 mb-8">Serving Delhi NCR</h2>
          <p class="text-cyber-600 mb-6">We provide security installation and support across the following areas:</p>
          <div class="flex flex-wrap gap-3">
            <span v-for="area in serviceAreas" :key="area" class="px-4 py-2.5 rounded-lg bg-cyber-50 border border-cyber-200 text-cyber-800 font-medium">{{ area }}</span>
          </div>
        </div>
      </section>

      <!-- Final CTA -->
      <section class="py-20 bg-gradient-to-br from-cyber-950 via-cyber-900 to-cyber-950 text-white">
        <div class="container mx-auto px-4 text-center">
          <h2 class="text-2xl md:text-3xl font-bold mb-4">Ready to Secure Your Space?</h2>
          <p class="text-cyber-200 mb-10">Get a free security consultation and quote. Call or message us on WhatsApp.</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link to="/contact" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-neon hover:bg-neon-hover text-cyber-950 font-semibold transition-colors shadow-lg">Get Free Security Consultation</router-link>
            <a v-if="contactPhone" :href="'tel:' + contactPhone" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg border-2 border-cyber-400 text-cyber-200 hover:bg-cyber-800 font-semibold transition-colors">Call {{ contactPhone }}</a>
            <a v-if="whatsappHref" :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-8 py-3.5 rounded-lg bg-neon/90 hover:bg-neon text-cyber-950 font-semibold transition-colors shadow-lg">WhatsApp</a>
          </div>
        </div>
      </section>
    </main>
    <FooterTemp3 />
    <Toast />
  </div>
</template>

<script setup lang="ts">
import { env } from '@/config/env'
import HeaderTemp3 from '@/components/layout/temp3/HeaderTemp3.vue'
import FooterTemp3 from '@/components/layout/temp3/FooterTemp3.vue'
import Toast from '@/components/common/Toast.vue'

const contactPhone = env.contactPhone
const whatsappHref = env.whatsappNumber ? `https://wa.me/${env.whatsappNumber}` : ''

const installationSteps = [
  { title: 'Free consultation', desc: 'We assess your premises and security needs.' },
  { title: 'Custom plan & quote', desc: 'Tailored solutions and transparent pricing.' },
  { title: 'Professional installation', desc: 'Expert setup and integration.' },
  { title: 'Training & handover', desc: 'You learn to use the system.' },
  { title: 'After-sales support', desc: 'Warranty and ongoing support.' }
]

const testimonials = [
  { quote: 'Professional team and very satisfied with the installation. Highly recommend for home security.', name: 'Customer 1', location: 'Delhi NCR' },
  { quote: 'Got our office covered with access control and CCTV. Service was on time and the system works great.', name: 'Customer 2', location: 'Noida' },
  { quote: '20+ years of experience shows. They know what they are doing and gave honest advice.', name: 'Customer 3', location: 'Gurgaon' }
]

const serviceAreas = ['Delhi', 'Noida', 'Gurgaon', 'Faridabad', 'Ghaziabad', 'Greater Noida', 'Meerut', 'Sonipat']
</script>
