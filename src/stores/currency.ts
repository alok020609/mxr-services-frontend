import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { currenciesApi } from '@/api/endpoints/currencies'
import type { Currency } from '@/api/types'

export const useCurrencyStore = defineStore('currency', () => {
  const selectedCurrency = ref<string>('USD')
  const baseCurrency = ref<string>('USD') // Store base (e.g. USD, rate 1); from API default
  const currencies = ref<Currency[]>([])
  const isLoading = ref(false)
  const exchangeRates = ref<Record<string, number>>({})

  const CODE_DEFAULT = 'USD'

  // Load currencies from localStorage on init; no env. When no saved preference, use code default until API default is loaded.
  const initCurrency = () => {
    const saved = localStorage.getItem('selectedCurrency')
    if (saved) {
      selectedCurrency.value = saved
    } else {
      selectedCurrency.value = CODE_DEFAULT
    }
  }

  // Load available currencies; when no saved preference, set initial currency from GET /currencies/default.
  const loadCurrencies = async () => {
    isLoading.value = true
    try {
      const response = await currenciesApi.getCurrencies()
      if (response.success && response.data) {
        const list = Array.isArray(response.data) ? response.data : []
        currencies.value = list

        // Build exchange rates map from rate exchanger / currency API (backend uses exchangeRate)
        exchangeRates.value = {}
        list.forEach(currency => {
          const rate = currency.exchangeRate ?? currency.rate
          if (rate != null) {
            exchangeRates.value[currency.code] = rate
          }
        })

        // Base currency is the one with isDefault (rates are relative to base, e.g. USD = 1)
        const defaultCurr = list.find(c => c.isDefault)
        baseCurrency.value = defaultCurr?.code ?? CODE_DEFAULT
      }

      // When user has no saved preference, set selectedCurrency from store default API
      if (!localStorage.getItem('selectedCurrency')) {
        try {
          const defaultRes = await currenciesApi.getDefault()
          if (defaultRes.success && defaultRes.data?.code) {
            selectedCurrency.value = defaultRes.data.code
            localStorage.setItem('selectedCurrency', defaultRes.data.code)
          }
        } catch {
          // Keep code default (e.g. USD); do not read from env
        }
      }

      // Fallback: when list is empty, ensure one entry so selector and formatAmount work
      if (currencies.value.length === 0) {
        const code = selectedCurrency.value
        currencies.value = [{
          code,
          name: code,
          symbol: getCurrencySymbol(code)
        }]
      }
    } catch (error) {
      console.error('Failed to load currencies:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Set selected currency
  const setCurrency = (code: string) => {
    selectedCurrency.value = code
    localStorage.setItem('selectedCurrency', code)
  }

  // Get current currency
  const currentCurrency = computed(() => {
    return currencies.value.find(c => c.code === selectedCurrency.value) || {
      code: selectedCurrency.value,
      name: selectedCurrency.value,
      symbol: getCurrencySymbol(selectedCurrency.value)
    }
  })

  // Synchronous conversion using exchange rates from API (for display, e.g. INR). Rounded to 2 decimals.
  const convertToSelected = (amount: number, fromCode?: string): number => {
    const from = fromCode ?? baseCurrency.value
    const to = selectedCurrency.value
    if (from === to) return Math.round(amount * 100) / 100
    const rateFrom = exchangeRates.value[from]
    const rateTo = exchangeRates.value[to]
    if (rateFrom != null && rateTo != null && rateFrom > 0) {
      const converted = amount * (rateTo / rateFrom)
      return Math.round(converted * 100) / 100
    }
    return Math.round(amount * 100) / 100
  }

  // Convert amount from base currency to selected currency (async, uses convert API or fallback)
  const convertAmount = async (amount: number, from: string, to: string): Promise<number> => {
    if (from === to) return amount
    
    try {
      const response = await currenciesApi.convert(amount, from, to)
      if (response.success && response.data) {
        return response.data.convertedAmount
      }
    } catch (error) {
      console.error('Failed to convert currency:', error)
    }
    
    // Fallback: use exchange rates if available
    if (exchangeRates.value[to] && exchangeRates.value[from]) {
      const rate = exchangeRates.value[to] / exchangeRates.value[from]
      return amount * rate
    }
    
    return amount
  }

  // Format amount with currency symbol
  const formatAmount = (amount: number, currencyCode?: string): string => {
    const code = currencyCode || selectedCurrency.value
    const currency = currencies.value.find(c => c.code === code) || {
      code,
      symbol: getCurrencySymbol(code)
    }
    
    return `${currency.symbol}${amount.toFixed(2)}`
  }

  // Get currency symbol
  const getCurrencySymbol = (code: string): string => {
    const symbols: Record<string, string> = {
      'USD': '$',
      'EUR': '€',
      'GBP': '£',
      'INR': '₹',
      'JPY': '¥',
      'CNY': '¥',
      'AUD': 'A$',
      'CAD': 'C$'
    }
    return symbols[code] || code
  }

  // Initialize on store creation
  initCurrency()

  return {
    selectedCurrency,
    baseCurrency,
    currencies,
    isLoading,
    exchangeRates,
    currentCurrency,
    loadCurrencies,
    setCurrency,
    convertToSelected,
    convertAmount,
    formatAmount,
    getCurrencySymbol
  }
})

