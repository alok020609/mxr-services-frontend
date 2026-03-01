<template>
  <div class="min-h-screen flex flex-col bg-sgBgLight dark:bg-sgBgDark text-slate-900 dark:text-slate-100 font-display">
    <HeaderTemp4 />
    <main class="flex-1">
      <!-- Hero -->
      <section class="relative overflow-hidden bg-white dark:bg-sgBgDark pt-16 pb-24 lg:pt-32 lg:pb-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div class="grid lg:grid-cols-2 gap-12 items-center">
            <div class="max-w-2xl">
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sgPrimary/10 text-sgPrimary text-xs font-bold uppercase tracking-wider mb-6">
                <span class="relative flex h-2 w-2">
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-sgPrimary opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-sgPrimary"></span>
                </span>
                Now Serving Your Area
              </div>
              <h1 class="text-5xl lg:text-7xl font-black text-sgNavy dark:text-white leading-[1.1] tracking-tight mb-6">
                Your Safety, <br /><span class="text-sgPrimary">Our Priority.</span>
              </h1>
              <p class="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-lg">
                Professional CCTV and smart security solutions for homes and businesses. Expert installation, premium hardware, and 24/7 peace of mind.
              </p>
              <div class="flex flex-col sm:flex-row gap-4">
                <router-link
                  to="/contact"
                  class="flex items-center justify-center gap-2 bg-sgPrimary hover:opacity-90 text-white px-8 py-4 rounded-xl text-lg font-bold transition-all shadow-xl shadow-sgPrimary/20"
                >
                  Get a Free Quote
                  <span class="material-symbols-outlined">arrow_forward</span>
                </router-link>
                <router-link
                  to="/packages"
                  class="flex items-center justify-center gap-2 border-2 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-sgNavy dark:text-white px-8 py-4 rounded-xl text-lg font-bold transition-all"
                >
                  <span class="material-symbols-outlined">play_circle</span>
                  See How It Works
                </router-link>
              </div>
              <div class="mt-12 flex items-center gap-6 border-t border-slate-100 dark:border-slate-800 pt-8">
                <div class="flex -space-x-3">
                  <img alt="Client" class="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCLUbyJX6pPjdvo2Ey8d2hZc5Og6XC9u6I0ICWMwWARNl6gGOeQSe0X-rrC4QlK0LgOunEUorItP1NqERUMAKuM3S7t03k1G07jiC47RE-dpzQyAssBvaQ5Q9k7wlzF72Ip9j9sXNK2rgdjYlT7sbOBYM4AnVR6BmmMHs7HV1QlIMLesSTCs8ByifB7H2Dvw9bmM3Mj5G2ZmGtJEDFLfT-zZ-80nZ8Eg6ACXYHPyFD0OlsycafMri51xw8xN0nsoK3vvC6Z0BKPcnw" />
                  <img alt="Client" class="w-10 h-10 rounded-full border-2 border-white object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxcui3C1_LiVF3nA0cFHKO6QfTnzWqA3TMsNvCdwOCId9mDnZL-cpL1wH9LGkcbDO-fDA0sGIO-Tqc0xo4G9MwmXVKI3ZJc0r7px9aJFu5OHl4Mvp7GUTAEGVbv3PS5WKE5FeSRGRg0-NneaQBtMaqpeXtkqbeNC-bX_XqNW3VeJvD0xaW2haLNzP3uR-uh1LH-dPDt-KkeubW6ZwyKx1UMI-TDRt62ZYjqMFHvtp_0QIGKHg5KV5qgcCEVWCMoIUU77WipwnonaU" />
                  <div class="w-10 h-10 rounded-full border-2 border-white bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-600 dark:text-slate-400">+5k</div>
                </div>
                <p class="text-sm text-slate-500 font-medium">Trusted by over 5,000+ local homeowners and businesses</p>
              </div>
            </div>
            <div class="relative">
              <div class="absolute -inset-4 bg-sgPrimary/10 rounded-[2.5rem] blur-3xl"></div>
              <div class="relative bg-slate-200 dark:bg-slate-800 rounded-[2rem] overflow-hidden shadow-2xl aspect-[4/3]">
                <img
                  class="w-full h-full object-cover"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9gZ5SFmKNzTUscuAFEICKIOscUm94VUD5vZ2oigg2LAr48emnOY1THvdibrpG0PucXZ6bIjlD4Po-CQ_dM9DxJGuMQBUqwdmQ2S3uK2NFqSRyGY1_DgOMrm7E6ZvEnYqI84pWBdL4iLDFzOMY85DpsQPorufv12CPnAEoAY6ebn1nn7DEg-tYOyNEHHQIw1p1DBseg6UK_lY43WdLF16ElwIKesCtSWt8ZSqu_vfCvx9m2TOdnIEe6yE7XVXV9l8n2XGo7fbhpR0"
                  alt="Modern building with security camera"
                />
                <div class="absolute bottom-6 left-6 right-6 bg-white/90 dark:bg-sgNavy/90 backdrop-blur p-4 rounded-2xl border border-white/20 flex items-center gap-4">
                  <div class="bg-green-500 h-3 w-3 rounded-full animate-pulse"></div>
                  <div class="flex-1">
                    <p class="text-xs font-bold text-sgNavy dark:text-white uppercase tracking-tighter">Live Surveillance Active</p>
                    <p class="text-[10px] text-slate-500 uppercase tracking-widest">4K Resolution • Night Vision Enabled</p>
                  </div>
                  <span class="material-symbols-outlined text-sgPrimary">videocam</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Services -->
      <section id="services" class="py-24 bg-slate-50 dark:bg-slate-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="text-center max-w-3xl mx-auto mb-16">
            <h2 class="text-sgPrimary font-bold tracking-widest uppercase text-sm mb-4">Our Services</h2>
            <h3 class="text-4xl font-black text-sgNavy dark:text-white mb-6 leading-tight">Tailored Security Solutions for Every Need</h3>
            <p class="text-slate-600 dark:text-slate-400">From basic home monitoring to complex industrial surveillance networks, we provide end-to-end security installations that never sleep.</p>
          </div>
          <div class="grid md:grid-cols-3 gap-8">
            <div class="group bg-white dark:bg-sgBgDark p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-sgPrimary transition-all shadow-sm hover:shadow-xl">
              <div class="w-14 h-14 bg-sgPrimary/10 rounded-2xl flex items-center justify-center text-sgPrimary mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">home_max</span>
              </div>
              <h4 class="text-xl font-bold text-sgNavy dark:text-white mb-4">Residential Security</h4>
              <p class="text-slate-600 dark:text-slate-400 mb-6">Keep your family safe with high-definition cameras, smart doorbells, and interior motion sensors controlled from your phone.</p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> 4K Wireless Cameras</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Smart App Integration</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> 24/7 Mobile Alerts</li>
              </ul>
              <router-link to="/products" class="inline-flex items-center gap-2 text-sgPrimary font-bold hover:gap-3 transition-all">Learn More <span class="material-symbols-outlined">arrow_forward</span></router-link>
            </div>
            <div class="group bg-white dark:bg-sgBgDark p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-sgPrimary transition-all shadow-sm hover:shadow-xl">
              <div class="w-14 h-14 bg-sgPrimary/10 rounded-2xl flex items-center justify-center text-sgPrimary mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">corporate_fare</span>
              </div>
              <h4 class="text-xl font-bold text-sgNavy dark:text-white mb-4">Commercial Protection</h4>
              <p class="text-slate-600 dark:text-slate-400 mb-6">Scalable surveillance and biometric access control systems designed for businesses, warehouses, and office complexes.</p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Multi-site Management</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Biometric Access Control</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Cloud Storage Backup</li>
              </ul>
              <router-link to="/products" class="inline-flex items-center gap-2 text-sgPrimary font-bold hover:gap-3 transition-all">Learn More <span class="material-symbols-outlined">arrow_forward</span></router-link>
            </div>
            <div class="group bg-white dark:bg-sgBgDark p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 hover:border-sgPrimary transition-all shadow-sm hover:shadow-xl">
              <div class="w-14 h-14 bg-sgPrimary/10 rounded-2xl flex items-center justify-center text-sgPrimary mb-6 group-hover:scale-110 transition-transform">
                <span class="material-symbols-outlined text-3xl">hub</span>
              </div>
              <h4 class="text-xl font-bold text-sgNavy dark:text-white mb-4">Smart Integration</h4>
              <p class="text-slate-600 dark:text-slate-400 mb-6">Seamlessly connect your lighting, locks, and cameras into a unified ecosystem for total automated home control.</p>
              <ul class="space-y-3 mb-8">
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Voice Control Ready</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Automated Lighting Scenarios</li>
                <li class="flex items-center gap-3 text-sm text-slate-500"><span class="material-symbols-outlined text-sgPrimary text-lg">check_circle</span> Remote Gate Operations</li>
              </ul>
              <router-link to="/products" class="inline-flex items-center gap-2 text-sgPrimary font-bold hover:gap-3 transition-all">Learn More <span class="material-symbols-outlined">arrow_forward</span></router-link>
            </div>
          </div>
        </div>
      </section>

      <!-- Why Choose Us -->
      <section id="why-us" class="py-24 bg-white dark:bg-sgBgDark overflow-hidden">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="grid lg:grid-cols-2 gap-20 items-center">
            <div class="relative">
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-4">
                  <div class="h-64 rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBZW4vh3tVxEbyhCMXB-mYpFueh6nD5RdYftjfL1P9_ZwtMH2Ma1EESMfPzkhuQB7_W-2evhpZRm6G9ZVrzDI8ibrdKol0hL8Fvc86zoAQZnhGhE2fVMSXrocMl6_DxXP45aQ0JrKYWFekrevQ5zr6A56KRF3r3_DQWNXveUkThMCMPLIYNoJ2V9HqYpcGJaFpGbtEq4KP5PHccmgTZTV_7Vld0Dg2e2XuGyxdKP8rOwUUxI1o3rpxA9uroxUEUMHBkyrIpxTkdm4" alt="Technician installing camera" />
                  </div>
                  <div class="bg-sgNavy p-6 rounded-3xl text-white">
                    <p class="text-3xl font-black mb-1">15+</p>
                    <p class="text-xs uppercase tracking-widest opacity-60">Years of Expertise</p>
                  </div>
                </div>
                <div class="space-y-4 pt-8">
                  <div class="bg-sgPrimary p-6 rounded-3xl text-white">
                    <p class="text-3xl font-black mb-1">24/7</p>
                    <p class="text-xs uppercase tracking-widest opacity-80">Active Monitoring</p>
                  </div>
                  <div class="h-64 rounded-3xl overflow-hidden bg-slate-200 dark:bg-slate-800">
                    <img class="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAJIf74YBCywSHWJ1neCZUOp4kLBTGo4QuISbGLnx8gfYcU57YAynOTMqn6dYine5KboYJSwLNc7o2YfBU0Sq6aliRgjws7OcB2iSnMi9d_qHJerzRPvb7zeCTA0Pq-xSB8OEAYsckbY3Ow7J_gJqgUO6jBeCgxcB3IgkFZE5JhmifzkttAt_PNcfFeJ6yJxrRmV4H8v0LN0q5utabophqzp9_xM1WebXthcyRJNPJfEIUJrQyQgpjARqiFa1aeXMnmzaaCnovJ1OU" alt="Smart lock on door" />
                  </div>
                </div>
              </div>
              <div class="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-sgPrimary/5 blur-3xl rounded-full"></div>
            </div>
            <div>
              <h2 class="text-sgPrimary font-bold tracking-widest uppercase text-sm mb-4">Why MXR Services</h2>
              <h3 class="text-4xl font-black text-sgNavy dark:text-white mb-8 leading-tight">Elite Protection Powered by Next-Gen Technology</h3>
              <div class="space-y-8">
                <div class="flex gap-6">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sgPrimary">
                    <span class="material-symbols-outlined">engineering</span>
                  </div>
                  <div>
                    <h5 class="text-lg font-bold text-sgNavy dark:text-white mb-2">Expert Certified Installation</h5>
                    <p class="text-slate-600 dark:text-slate-400">Our team consists of licensed engineers who ensure every camera and sensor is positioned for maximum coverage with zero blind spots.</p>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sgPrimary">
                    <span class="material-symbols-outlined">security_update_good</span>
                  </div>
                  <div>
                    <h5 class="text-lg font-bold text-sgNavy dark:text-white mb-2">Advanced AI Technology</h5>
                    <p class="text-slate-600 dark:text-slate-400">We use AI-driven motion detection that can distinguish between a human intruder and a neighborhood pet, reducing false alarms by 99%.</p>
                  </div>
                </div>
                <div class="flex gap-6">
                  <div class="flex-shrink-0 w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-sgPrimary">
                    <span class="material-symbols-outlined">support_agent</span>
                  </div>
                  <div>
                    <h5 class="text-lg font-bold text-sgNavy dark:text-white mb-2">24/7 Professional Monitoring</h5>
                    <p class="text-slate-600 dark:text-slate-400">Rest easy knowing our rapid-response monitoring center is watching over your property even when you're thousands of miles away.</p>
                  </div>
                </div>
              </div>
              <div class="mt-12 flex items-center gap-8">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-green-500 font-bold">verified</span>
                  <span class="text-sm font-bold text-sgNavy dark:text-white">Fully Insured</span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-green-500 font-bold">verified</span>
                  <span class="text-sm font-bold text-sgNavy dark:text-white">5-Year Warranty</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-20 px-4">
        <div class="max-w-7xl mx-auto bg-sgPrimary rounded-[3rem] p-12 lg:p-24 relative overflow-hidden text-center">
          <div class="absolute top-0 right-0 -translate-y-1/2 translate-x-1/3 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl"></div>
          <div class="relative z-10 max-w-3xl mx-auto">
            <h2 class="text-4xl lg:text-6xl font-black text-white mb-8 tracking-tight">Ready to Secure Your Peace of Mind?</h2>
            <p class="text-xl text-white/80 mb-12">Book a free site survey today. No obligations, just expert advice on how to protect what matters most.</p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center">
              <router-link to="/contact" class="bg-white text-sgPrimary hover:bg-slate-100 px-10 py-5 rounded-2xl text-xl font-bold transition-all shadow-2xl inline-block">
                Request a Free Quote
              </router-link>
              <router-link to="/packages" class="bg-white/10 hover:bg-white/20 text-white backdrop-blur-md px-10 py-5 rounded-2xl text-xl font-bold transition-all inline-block">
                View Price Packages
              </router-link>
            </div>
          </div>
        </div>
      </section>
    </main>
    <FooterTemp4 />
  </div>
</template>

<script setup lang="ts">
import HeaderTemp4 from '@/components/layout/temp4/HeaderTemp4.vue'
import FooterTemp4 from '@/components/layout/temp4/FooterTemp4.vue'
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
