import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { FeatureFlag } from './features'
import { env } from './env'
import { isFeatureEnabled as checkFeatureEnabled } from './features'

interface AppConfig {
  apiBaseUrl: string
  appName: string
  defaultCurrency: string
  defaultLanguage: string
  features: Record<string, boolean>
  theme: 'light' | 'dark'
  initialized: boolean
}

const defaultConfig: AppConfig = {
  apiBaseUrl: env.apiBaseUrl,
  appName: env.appName,
  defaultCurrency: 'USD',
  defaultLanguage: env.defaultLanguage,
  features: {},
  theme: 'light',
  initialized: false
}

export const useConfigStore = defineStore('config', () => {
  // State
  const config = ref<AppConfig>({ ...defaultConfig })

  // Actions
  function setApiBaseUrl(url: string) {
    config.value = { ...config.value, apiBaseUrl: url }
  }

  function setAppName(name: string) {
    config.value = { ...config.value, appName: name }
  }

  function setDefaultCurrency(currency: string) {
    config.value = { ...config.value, defaultCurrency: currency }
  }

  function setDefaultLanguage(language: string) {
    config.value = { ...config.value, defaultLanguage: language }
  }

  function toggleFeature(featureKey: string, enabled: boolean) {
    config.value = {
      ...config.value,
      features: {
        ...config.value.features,
        [featureKey]: enabled
      }
    }
  }

  function setTheme(theme: 'light' | 'dark') {
    config.value = { ...config.value, theme }
  }

  function setInitialized(initialized: boolean) {
    config.value = { ...config.value, initialized }
  }

  function resetConfig() {
    config.value = { ...defaultConfig }
  }

  // Function (not a getter, but a method)
  function isFeatureEnabled(featureKey: string): boolean {
    // Check config store first
    if (featureKey in config.value.features) {
      return config.value.features[featureKey]
    }
    // Fall back to feature flags
    return checkFeatureEnabled(featureKey)
  }

  return {
    // State
    config,
    // Actions
    setApiBaseUrl,
    setAppName,
    setDefaultCurrency,
    setDefaultLanguage,
    toggleFeature,
    setTheme,
    setInitialized,
    resetConfig,
    isFeatureEnabled,
  }
}, {
  persist: {
    key: 'config-storage',
  },
})
