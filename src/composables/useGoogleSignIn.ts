import { ref, onUnmounted } from 'vue'

const GIS_SCRIPT_URL = 'https://accounts.google.com/gsi/client'

/** Client ID from env (same value as backend GOOGLE_CLIENT_ID). Not added to env.ts per plan. */
function getGoogleClientId(): string | undefined {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
}

let scriptLoadPromise: Promise<void> | null = null

function loadGisScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve()
  if (scriptLoadPromise) return scriptLoadPromise
  if ((window as any).google?.accounts?.id) {
    scriptLoadPromise = Promise.resolve()
    return scriptLoadPromise
  }
  scriptLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_URL
    script.async = true
    script.defer = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Google Identity Services'))
    document.head.appendChild(script)
  })
  return scriptLoadPromise
}

export function useGoogleSignIn() {
  const clientId = getGoogleClientId()
  const isAvailable = !!clientId
  const credentialCallback = ref<((idToken: string) => void) | null>(null)
  let buttonRendered = false

  function handleCredential(response: { credential: string }) {
    const cb = credentialCallback.value
    if (cb) cb(response.credential)
  }

  async function renderButton(container: HTMLElement | null, onCredential: (idToken: string) => void) {
    if (!clientId || !container) return
    credentialCallback.value = onCredential
    try {
      await loadGisScript()
      const google = (window as any).google
      if (!google?.accounts?.id) return
      google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredential
      })
      if (!buttonRendered) {
        container.innerHTML = ''
        google.accounts.id.renderButton(container, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          width: container.offsetWidth || 320
        })
        buttonRendered = true
      }
    } catch {
      // Script load failed; button won't show
    }
  }

  onUnmounted(() => {
    credentialCallback.value = null
  })

  return {
    isAvailable,
    renderButton
  }
}
