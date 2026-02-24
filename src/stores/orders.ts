import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Order, OrderFilters } from '@/api/types'

const defaultFilters: OrderFilters = {
  page: 1,
  limit: 20,
}

export const useOrdersStore = defineStore('orders', () => {
  // State
  const orders = ref<Order[]>([])
  const selectedOrder = ref<Order | null>(null)
  const filters = ref<OrderFilters>({ ...defaultFilters })
  const isLoading = ref<boolean>(false)
  const total = ref<number>(0)
  const page = ref<number>(1)

  // Actions
  function setOrders(ordersData: Order[], totalCount: number) {
    orders.value = ordersData
    total.value = totalCount
  }

  function setSelectedOrder(order: Order | null) {
    selectedOrder.value = order
  }

  function addOrder(order: Order) {
    orders.value = [order, ...orders.value]
    total.value = total.value + 1
  }

  function updateOrder(orderId: string, updates: Partial<Order>) {
    orders.value = orders.value.map((order) =>
      order.id === orderId ? { ...order, ...updates } : order
    )
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value = { ...selectedOrder.value, ...updates }
    }
  }

  function setFilters(newFilters: Partial<OrderFilters>) {
    filters.value = { ...filters.value, ...newFilters }
    if (newFilters.page !== undefined) {
      page.value = newFilters.page
    }
  }

  function setPage(pageNumber: number) {
    page.value = pageNumber
  }

  function setLoading(loading: boolean) {
    isLoading.value = loading
  }

  function resetFilters() {
    filters.value = { ...defaultFilters }
    page.value = 1
  }

  return {
    // State
    orders,
    selectedOrder,
    filters,
    isLoading,
    total,
    page,
    // Actions
    setOrders,
    setSelectedOrder,
    addOrder,
    updateOrder,
    setFilters,
    setPage,
    setLoading,
    resetFilters,
  }
})
