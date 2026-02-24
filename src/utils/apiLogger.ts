import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { env } from '@/config/env'

/**
 * Send log message to terminal via Vite dev server
 */
export function sendToTerminal(level: 'log' | 'error' | 'warn', ...args: any[]): void {
  try {
    const message = args.map(arg => {
      if (typeof arg === 'object') {
        try {
          return JSON.stringify(arg, null, 2)
        } catch {
          return String(arg)
        }
      }
      return String(arg)
    }).join(' ')
    
    // Send to Vite dev server terminal logger endpoint
    fetch('/__terminal-log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ level, message, data: args.length > 1 ? args : args[0] })
    }).catch(() => {
      // Ignore errors if server is not available (e.g., in production)
    })
  } catch (e) {
    // Ignore errors
  }
}

// Request tracking for correlation
const requestTimers = new Map<string, number>()
let requestCounter = 0

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
  requestCounter++
  return `req-${Date.now()}-${requestCounter}`
}

/**
 * Format timestamp
 */
function formatTimestamp(): string {
  const now = new Date()
  return now.toISOString().replace('T', ' ').substring(0, 23)
}

/**
 * Format duration in milliseconds
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`
  return `${(ms / 1000).toFixed(2)}s`
}

/**
 * Estimate size of data in bytes (rough estimate)
 */
function estimateSize(data: any): string {
  if (!data) return '0 B'
  const str = typeof data === 'string' ? data : JSON.stringify(data)
  const bytes = new Blob([str]).size
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Mask sensitive data in headers
 */
function maskHeaders(headers: any): any {
  if (!headers) return {}
  const masked = { ...headers }
  if (masked.Authorization) {
    masked.Authorization = masked.Authorization.replace(/Bearer .+/, 'Bearer ***')
  }
  if (masked.authorization) {
    masked.authorization = masked.authorization.replace(/Bearer .+/, 'Bearer ***')
  }
  return masked
}

/**
 * Check if logging should be enabled
 */
function shouldLog(level: 'none' | 'errors' | 'all' = 'all'): boolean {
  // Always log in development if not explicitly disabled
  if (env.isDevelopment && import.meta.env.VITE_ENABLE_API_LOGGING !== 'false') {
    return true
  }
  
  // Check explicit settings
  if (import.meta.env.VITE_ENABLE_API_LOGGING === 'false') {
    return false
  }
  
  if (!env.enableApiLogging) return false
  if (env.apiLogLevel === 'none') return false
  if (env.apiLogLevel === 'errors' && level !== 'errors') return false
  return true
}

/**
 * Log API request
 */
export function logApiRequest(config: AxiosRequestConfig & { requestId?: string }): string {
  // Always generate request ID for tracking
  const requestId = config.requestId || generateRequestId()
  config.requestId = requestId
  requestTimers.set(requestId, Date.now())
  
  const method = (config.method || 'GET').toUpperCase()
  const url = config.url || ''
  const fullUrl = config.baseURL ? `${config.baseURL}${url}` : url
  
  // Send logs to terminal (not browser console)
  if (env.isDevelopment) {
    sendToTerminal('log', `🚀 [API REQUEST] ${method} ${url}`)
    if (config.params) {
      sendToTerminal('log', `   📋 Params:`, config.params)
    }
    if (config.data) {
      sendToTerminal('log', `   📦 Body:`, config.data)
    }
  }
  
  // Check if we should log formatted version
  if (!shouldLog('all')) {
    return requestId
  }

  const timestamp = formatTimestamp()

  // Build log message
  const maxWidth = 65
  const formatLine = (text: string) => {
    const padding = maxWidth - text.length - 1
    return `│ ${text}${' '.repeat(Math.max(0, padding))}│`
  }
  
  const parts = [
    `┌${'─'.repeat(maxWidth - 2)}┐`,
    formatLine(`[API Request] ${method} ${fullUrl.substring(0, 45)}`),
    formatLine(`Time: ${timestamp}`),
    formatLine(`Request ID: ${requestId}`),
  ]

  // Always show params (for GET requests, etc.)
  if (config.params && Object.keys(config.params).length > 0) {
    parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
    parts.push(formatLine('Query Params:'))
    const paramsStr = JSON.stringify(config.params, null, 2)
    paramsStr.split('\n').forEach(line => {
      const truncated = line.substring(0, maxWidth - 6)
      parts.push(formatLine(`  ${truncated}`))
    })
  } else if (config.url && config.url.includes('?')) {
    // Extract params from URL if not in config.params
    const urlParams = new URLSearchParams(config.url.split('?')[1])
    if (urlParams.toString()) {
      parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
      parts.push(formatLine('Query Params (from URL):'))
      const params: Record<string, string> = {}
      urlParams.forEach((value, key) => {
        params[key] = value
      })
      const paramsStr = JSON.stringify(params, null, 2)
      paramsStr.split('\n').forEach(line => {
        const truncated = line.substring(0, maxWidth - 6)
        parts.push(formatLine(`  ${truncated}`))
      })
    }
  }

  // Always show body if present (for POST, PUT, PATCH requests)
  if (config.data !== undefined && config.data !== null) {
    parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
    parts.push(formatLine('Request Body:'))
    let bodyStr = ''
    if (config.data instanceof FormData) {
      bodyStr = '[FormData]'
      // Try to show FormData entries
      const entries: string[] = []
      config.data.forEach((value, key) => {
        entries.push(`${key}: ${value instanceof File ? value.name : value}`)
      })
      if (entries.length > 0) {
        bodyStr = `FormData with ${entries.length} entries:\n${entries.join('\n')}`
      }
    } else if (typeof config.data === 'string') {
      bodyStr = config.data
    } else {
      try {
        bodyStr = JSON.stringify(config.data, null, 2)
      } catch {
        bodyStr = String(config.data)
      }
    }
    
    if (bodyStr) {
      const lines = bodyStr.split('\n')
      const maxLines = 15
      lines.slice(0, maxLines).forEach(line => {
        const truncated = line.substring(0, maxWidth - 6)
        parts.push(formatLine(`  ${truncated}`))
      })
      if (lines.length > maxLines) {
        parts.push(formatLine(`  ... (${lines.length - maxLines} more lines)`))
      }
      parts.push(formatLine(`Size: ${estimateSize(bodyStr)}`))
    } else {
      parts.push(formatLine('  (empty)'))
    }
  }

  // Add headers (masked)
  if (config.headers) {
    const maskedHeaders = maskHeaders(config.headers)
    if (Object.keys(maskedHeaders).length > 0) {
      parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
      parts.push(formatLine('Headers:'))
      Object.entries(maskedHeaders).slice(0, 5).forEach(([key, value]) => {
        const headerLine = `${key}: ${value}`
        const truncated = headerLine.substring(0, maxWidth - 6)
        parts.push(formatLine(`  ${truncated}`))
      })
      if (Object.keys(maskedHeaders).length > 5) {
        parts.push(formatLine(`  ... (${Object.keys(maskedHeaders).length - 5} more headers)`))
      }
    }
  }

  parts.push(`└${'─'.repeat(maxWidth - 2)}┘`)

  // Send formatted log to terminal
  sendToTerminal('log', parts.join('\n'))
  
  return requestId
}

/**
 * Log API response
 */
export function logApiResponse(response: AxiosResponse & { config: AxiosRequestConfig & { requestId?: string } }): void {
  const requestId = response.config.requestId || 'unknown'
  const startTime = requestTimers.get(requestId) || Date.now()
  const duration = Date.now() - startTime
  requestTimers.delete(requestId)
  
  const method = (response.config.method || 'GET').toUpperCase()
  const url = response.config.url || ''
  const fullUrl = response.config.baseURL ? `${response.config.baseURL}${url}` : url
  
  // Send logs to terminal (not browser console)
  if (env.isDevelopment) {
    const statusColor = response.status >= 200 && response.status < 300 ? '✅' : '❌'
    sendToTerminal('log', `${statusColor} [API RESPONSE] ${method} ${url}`)
    sendToTerminal('log', `   📊 Status: ${response.status} ${response.statusText}`)
    sendToTerminal('log', `   ⏱️  Duration: ${duration}ms`)
    sendToTerminal('log', `   📥 Response:`, response.data)
  }
  
  // Check if we should log formatted version
  if (!shouldLog('all')) {
    return
  }

  const timestamp = formatTimestamp()
  const status = response.status
  const statusText = response.statusText

  // Build log message
  const maxWidth = 65
  const formatLine = (text: string) => {
    const padding = maxWidth - text.length - 1
    return `│ ${text}${' '.repeat(Math.max(0, padding))}│`
  }
  
  const parts = [
    `┌${'─'.repeat(maxWidth - 2)}┐`,
    formatLine(`[API Response] ${method} ${fullUrl.substring(0, 40)}`),
    formatLine(`Time: ${timestamp}`),
    formatLine(`Request ID: ${requestId}`),
    formatLine(`Duration: ${formatDuration(duration)}`),
    `├${'─'.repeat(maxWidth - 2)}┤`,
    formatLine(`Status: ${status} ${statusText}`),
  ]

  // Always show response data
  parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
  parts.push(formatLine('Response Data:'))
  
  if (response.data !== undefined && response.data !== null) {
    let dataStr = ''
    try {
      if (typeof response.data === 'string') {
        dataStr = response.data
      } else if (response.data instanceof Blob) {
        dataStr = `[Blob: ${response.data.size} bytes, type: ${response.data.type}]`
      } else if (response.data instanceof ArrayBuffer) {
        dataStr = `[ArrayBuffer: ${response.data.byteLength} bytes]`
      } else {
        dataStr = JSON.stringify(response.data, null, 2)
      }
    } catch (e) {
      dataStr = `[Unable to stringify: ${String(e)}] ${String(response.data)}`
    }
    
    if (dataStr) {
      // Truncate very long responses but show more lines
      const maxLines = 30
      const lines = dataStr.split('\n')
      if (lines.length > maxLines) {
        lines.slice(0, maxLines).forEach(line => {
          const truncated = line.substring(0, maxWidth - 6)
          parts.push(formatLine(`  ${truncated}`))
        })
        parts.push(formatLine(`  ... (${lines.length - maxLines} more lines, total: ${lines.length} lines)`))
      } else {
        lines.forEach(line => {
          const truncated = line.substring(0, maxWidth - 6)
          parts.push(formatLine(`  ${truncated}`))
        })
      }
      parts.push(formatLine(`Size: ${estimateSize(dataStr)}`))
    } else {
      parts.push(formatLine('  (empty response)'))
    }
  } else {
    parts.push(formatLine('  (no data)'))
  }

  parts.push(`└${'─'.repeat(maxWidth - 2)}┘`)

  // Send formatted log to terminal
  const logOutput = parts.join('\n')
  const logLevel = status >= 200 && status < 300 ? 'log' : status >= 300 && status < 400 ? 'warn' : 'error'
  sendToTerminal(logLevel, logOutput)
  
  // Also send raw response data
  sendToTerminal('log', '📥 Response Data:', response.data)
}

/**
 * Log API error
 */
export function logApiError(error: AxiosError & { config?: AxiosRequestConfig & { requestId?: string } }): void {
  if (!shouldLog('errors')) return

  const requestId = error.config?.requestId || 'unknown'
  const startTime = requestTimers.get(requestId) || Date.now()
  const duration = Date.now() - startTime
  requestTimers.delete(requestId)

  const method = (error.config?.method || 'GET').toUpperCase()
  const url = error.config?.url || ''
  const fullUrl = error.config?.baseURL ? `${error.config.baseURL}${url}` : url
  const timestamp = formatTimestamp()
  const status = error.response?.status || 0
  const statusText = error.response?.statusText || error.message || 'Unknown Error'

  // Build log message
  const maxWidth = 65
  const formatLine = (text: string) => {
    const padding = maxWidth - text.length - 1
    return `│ ${text}${' '.repeat(Math.max(0, padding))}│`
  }
  
  const parts = [
    `┌${'─'.repeat(maxWidth - 2)}┐`,
    formatLine(`[API Error] ${method} ${fullUrl.substring(0, 40)}`),
    formatLine(`Time: ${timestamp}`),
    formatLine(`Request ID: ${requestId}`),
    formatLine(`Duration: ${formatDuration(duration)}`),
    `├${'─'.repeat(maxWidth - 2)}┤`,
    formatLine(`Status: ${status || 'N/A'} ${statusText}`),
  ]

  // Add error message
  if (error.response?.data) {
    const errorData = error.response.data as any
    const errorMessage = errorData.error || errorData.message || error.message || 'Unknown error'
    parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
    parts.push(formatLine(`Error: ${errorMessage.substring(0, 50)}`))
    
    // Add full error response if available
    if (errorData) {
      parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
      parts.push(formatLine('Response:'))
      let errorStr = ''
      try {
        errorStr = JSON.stringify(errorData, null, 2)
      } catch {
        errorStr = String(errorData)
      }
      errorStr.split('\n').slice(0, 10).forEach(line => {
        const truncated = line.substring(0, maxWidth - 6)
        parts.push(formatLine(`  ${truncated}`))
      })
      if (errorStr.split('\n').length > 10) {
        parts.push(formatLine(`  ... (${errorStr.split('\n').length - 10} more lines)`))
      }
    }
  } else if (error.message) {
    parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
    parts.push(formatLine(`Error: ${error.message.substring(0, 50)}`))
    if (error.code) {
      parts.push(formatLine(`Code: ${error.code}`))
    }
  }

  // Add request data if available
  if (error.config?.data) {
    parts.push(`├${'─'.repeat(maxWidth - 2)}┤`)
    parts.push(formatLine('Request Data:'))
    let requestDataStr = ''
    try {
      requestDataStr = JSON.stringify(error.config.data, null, 2)
    } catch {
      requestDataStr = String(error.config.data)
    }
    requestDataStr.split('\n').slice(0, 5).forEach(line => {
      const truncated = line.substring(0, maxWidth - 6)
      parts.push(formatLine(`  ${truncated}`))
    })
  }

  parts.push(`└${'─'.repeat(maxWidth - 2)}┘`)

  // Send formatted error log to terminal
  sendToTerminal('error', parts.join('\n'))
}

/**
 * Log summary statistics (optional, can be called periodically)
 */
export function logApiSummary(): void {
  if (!shouldLog('all')) return
  
  sendToTerminal('log', '📊 API Call Summary:', {
    totalRequests: requestCounter,
    activeRequests: requestTimers.size,
  })
}

