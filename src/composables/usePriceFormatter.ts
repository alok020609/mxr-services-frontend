import { useCurrencyStore } from '@/stores/currency'
import { formatCurrency } from '@/utils/formatters'

/**
 * Composable for currency-aware price display.
 * Converts amounts from the store base currency to the selected currency using
 * exchange rates from the rate exchanger / currency API, then formats (e.g. INR).
 */
export function usePriceFormatter() {
  const currencyStore = useCurrencyStore()

  function formatPrice(amount: number | string | undefined | null): string {
    const num =
      amount === undefined || amount === null
        ? 0
        : typeof amount === 'string'
          ? parseFloat(amount) || 0
          : amount
    const converted = currencyStore.convertToSelected(num)
    return formatCurrency(converted, currencyStore.selectedCurrency)
  }

  return { formatPrice }
}
