/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_ENABLE_API_LOGGING?: string
  readonly VITE_API_LOG_LEVEL?: 'none' | 'errors' | 'all'
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_ENABLE_FEATURES: string
  readonly VITE_DEFAULT_LANGUAGE: string
  readonly VITE_BUILD_MODE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

