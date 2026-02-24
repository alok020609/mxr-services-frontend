import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Product, Category, ProductFilters } from '@/api/types'

const defaultFilters: ProductFilters = {
  page: 1,
  limit: 20,
  sortBy: 'createdAt',
  sortOrder: 'desc',
}

export const useProductsStore = defineStore('products', () => {
  // State
  const products = ref<Product[]>([])
  const categories = ref<Category[]>([])
  const selectedProduct = ref<Product | null>(null)
  const filters = ref<ProductFilters>({ ...defaultFilters })
  const isLoading = ref<boolean>(false)
  const total = ref<number>(0)
  const page = ref<number>(1)

  // Actions
  function setProducts(productsData: Product[], totalCount: number) {
    products.value = productsData
    total.value = totalCount
  }

  function setCategories(categoriesData: Category[]) {
    categories.value = categoriesData
  }

  function setSelectedProduct(product: Product | null) {
    selectedProduct.value = product
  }

  function setFilters(newFilters: Partial<ProductFilters>) {
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
    products,
    categories,
    selectedProduct,
    filters,
    isLoading,
    total,
    page,
    // Actions
    setProducts,
    setCategories,
    setSelectedProduct,
    setFilters,
    setPage,
    setLoading,
    resetFilters,
  }
})
