import { ref, shallowRef, onUnmounted } from 'vue'
import { PublicClientApplication } from '@azure/msal-browser'

/** Client ID from env (same value as backend MICROSOFT_CLIENT_ID). Not added to env.ts per plan. */
function getMicrosoftClientId(): string | undefined {
  return import.meta.env.VITE_MICROSOFT_CLIENT_ID as string | undefined
}

const DEFAULT_AUTHORITY = 'https://login.microsoftonline.com/common'
const SCOPES = ['openid', 'profile', 'email']

export function useMicrosoftSignIn() {
  const clientId = getMicrosoftClientId()
  const isAvailable = !!clientId
  const msalInstance = shallowRef<PublicClientApplication | null>(null)
  const initPromise = ref<Promise<void> | null>(null)

  async function ensureInitialized(): Promise<PublicClientApplication | null> {
    if (!clientId) return null
    if (msalInstance.value) return msalInstance.value
    if (!initPromise.value) {
      initPromise.value = (async () => {
        const instance = new PublicClientApplication({
          auth: {
            clientId,
            authority: DEFAULT_AUTHORITY,
            redirectUri: typeof window !== 'undefined' ? window.location.origin : undefined
          }
        })
        await instance.initialize()
        msalInstance.value = instance
      })()
    }
    await initPromise.value
    return msalInstance.value
  }

  async function signIn(): Promise<string | null> {
    const instance = await ensureInitialized()
    if (!instance) return null
    try {
      const response = await instance.loginPopup({ scopes: SCOPES })
      return response.idToken ?? null
    } catch {
      return null
    }
  }

  onUnmounted(() => {
    msalInstance.value = null
  })

  return {
    isAvailable,
    signIn
  }
}
