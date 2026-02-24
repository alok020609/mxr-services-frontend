// Utility functions for formatting data
import { env } from '@/config/env'

/**
 * Format currency amount. When currency is omitted, uses 'USD'.
 * Callers should pass currency from currency store (e.g. usePriceFormatter).
 * Supports proper locale formatting (e.g., en-IN for INR)
 */
export const formatCurrency = (amount: number, currency?: string): string => {
  const currencyCode = currency || 'USD'
  
  // Determine locale based on currency
  let locale = 'en-US'
  if (currencyCode === 'INR') {
    locale = 'en-IN' // Indian locale for proper INR formatting
  } else if (currencyCode === 'EUR') {
    locale = 'en-EU'
  } else if (currencyCode === 'GBP') {
    locale = 'en-GB'
  }
  
  const rounded = Math.round(amount * 100) / 100
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(rounded)
}

export const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

export const formatDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Format number using locale-aware formatting (en-US)
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-US').format(num)
}

export const truncate = (text: string, length: number): string => {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}

export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

/**
 * Normalize image URLs to use relative paths for CORS compatibility
 * Converts absolute URLs like http://localhost:3000/uploads/... to /uploads/...
 * This allows images to be served through the Vite proxy in development
 */
export const normalizeImageUrl = (url: string | undefined | null): string => {
  if (!url) return ''
  
  // If already a relative URL, return as-is
  if (url.startsWith('/')) {
    return url
  }
  
  // If it's a full URL with localhost:3000, convert to relative
  const localhostPattern = /^https?:\/\/localhost:3000(\/.*)$/
  const match = url.match(localhostPattern)
  if (match) {
    return match[1] // Return the path part
  }
  
  // If it's a full URL with the API base URL, extract the path
  const apiBaseUrl = env.apiBaseUrl.replace('/api/v1', '')
  if (url.startsWith(apiBaseUrl)) {
    return url.replace(apiBaseUrl, '')
  }
  
  // For other absolute URLs (external), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  
  // For relative URLs without leading slash, add it
  if (!url.startsWith('/') && !url.startsWith('http')) {
    return '/' + url
  }
  
  return url
}

/**
 * Normalize an array of image URLs
 */
export const normalizeImageUrls = (urls: (string | undefined | null)[]): string[] => {
  return urls.map(normalizeImageUrl).filter(url => url.length > 0)
}

