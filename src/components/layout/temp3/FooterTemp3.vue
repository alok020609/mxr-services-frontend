<template>
  <footer class="bg-cyber-900 text-cyber-200 mt-auto border-t border-cyber-800">
    <div class="container mx-auto px-4 py-12">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
        <!-- About -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-1">MXRServices</h3>
          <p class="text-neon text-sm font-medium mb-3">Complete Security Solutions</p>
          <p class="text-sm">CCTV Surveillance, Smart Locks, Access Control & Alarm Systems — Professional installation across Delhi NCR.</p>
        </div>

        <!-- Quick Links -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Quick Links</h3>
          <ul class="space-y-2 text-sm">
            <li><router-link to="/" class="hover:text-neon transition-colors">Home</router-link></li>
            <li><router-link to="/products" class="hover:text-neon transition-colors">Smart Security Products</router-link></li>
            <li><router-link to="/services" class="hover:text-neon transition-colors">Services</router-link></li>
            <li><router-link to="/portfolio" class="hover:text-neon transition-colors">Portfolio</router-link></li>
            <li><router-link to="/contact" class="hover:text-neon transition-colors">Contact</router-link></li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Contact</h3>
          <ul class="space-y-2 text-sm">
            <li v-if="contactPhone">
              <a :href="'tel:' + contactPhone" class="hover:text-neon transition-colors">{{ contactPhone }}</a>
            </li>
            <li v-if="whatsappHref">
              <a :href="whatsappHref" target="_blank" rel="noopener noreferrer" class="hover:text-neon transition-colors font-medium">WhatsApp</a>
            </li>
            <li>Email: support@mxrservices.com</li>
          </ul>
        </div>

        <!-- Why Us -->
        <div>
          <h3 class="text-white text-lg font-semibold mb-4">Why Us</h3>
          <p class="text-sm">20+ years in Delhi NCR. End-to-end security solutions with professional installation and long-term support.</p>
        </div>
      </div>

      <div class="border-t border-cyber-800 mt-8 pt-8 text-center text-sm text-cyber-400">
        <p>&copy; {{ currentYear }} MXRServices. All rights reserved. Complete Security Solutions in Delhi NCR.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { env } from '@/config/env'

const contactPhone = env.contactPhone
const whatsappHref = env.whatsappNumber ? `https://wa.me/${env.whatsappNumber}` : ''
const currentYear = computed(() => new Date().getFullYear())
</script>
