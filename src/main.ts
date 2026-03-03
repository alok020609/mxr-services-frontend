import { createApp } from 'vue'
import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import './style.css'
import App from './App.vue'
import router from './router'
import { env, validateEnv } from './config/env'

// Validate environment variables on startup
const validation = validateEnv()
if (!validation.valid) {
  console.error('Environment validation failed:', validation.errors)
  if (env.isProduction) {
    // In production, we might want to show an error page
    console.error('Please check your environment variables configuration')
  } else {
    // In development, show warnings
    console.warn('Some environment variables are missing. Using defaults.')
  }
}

const app = createApp(App)
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Global error handler for debugging recursive updates
app.config.errorHandler = (err, instance, info) => {
  console.error('[Vue Global Error Handler]', {
    error: err,
    message: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    component: instance?.$?.type?.__name || instance?.$?.type?.name || 'Unknown',
    info: info,
    timestamp: new Date().toISOString()
  })
  
  // Specifically log recursive update errors
  if (err instanceof Error && err.message.includes('Maximum recursive updates')) {
    console.error('[Vue Recursive Update Debug]', {
      componentName: instance?.$?.type?.__name || instance?.$?.type?.name,
      props: instance?.$?.props,
      setupState: (instance?.$ as { setupState?: unknown })?.setupState,
      errorMessage: err.message,
      stack: err.stack
    })
  }
}

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('[Unhandled Promise Rejection]', {
    reason: event.reason,
    message: event.reason?.message || String(event.reason),
    stack: event.reason?.stack,
    timestamp: new Date().toISOString()
  })
  
  // Specifically log recursive update errors
  if (event.reason instanceof Error && event.reason.message.includes('Maximum recursive updates')) {
    console.error('[Promise Rejection - Recursive Update Debug]', {
      error: event.reason,
      message: event.reason.message,
      stack: event.reason.stack
    })
  }
})

app.use(pinia)
app.use(router)
app.mount('#app')

