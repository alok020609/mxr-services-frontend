<template>
  <div class="order-state-manager">
    <h3 class="text-lg font-bold mb-4">Order State Management</h3>
    
    <div v-if="isLoading" class="flex justify-center py-4">
      <LoadingSpinner />
    </div>
    
    <div v-else class="space-y-4">
      <div v-if="currentState" class="card">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-600">Current State</p>
            <p class="text-lg font-semibold">{{ currentState }}</p>
          </div>
        </div>
      </div>
      
      <div v-if="availableTransitions.length > 0" class="card">
        <h4 class="font-semibold mb-3">Available Transitions</h4>
        <div class="space-y-2">
          <div
            v-for="transition in availableTransitions"
            :key="transition.transition"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div>
              <p class="font-medium">{{ transition.transition }}</p>
              <p class="text-sm text-gray-600">To: {{ transition.toState }}</p>
              <p v-if="transition.description" class="text-xs text-gray-500 mt-1">
                {{ transition.description }}
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              @click="showTransitionModal(transition)"
            >
              Transition
            </Button>
          </div>
        </div>
      </div>
      
      <div class="flex gap-2">
        <Button
          variant="danger"
          @click="showRollbackModal"
          :loading="isLoadingRollbackOptions"
        >
          Rollback State
        </Button>
      </div>
    </div>
    
    <!-- Rollback Modal -->
    <div
      v-if="showRollback"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="closeRollbackModal"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Rollback Order State</h4>
        <p class="mb-4 text-sm text-gray-600">
          Select the previous state to roll back to. Current state: <strong>{{ currentState }}</strong>
        </p>
        <div v-if="rollbackOptions.length === 0 && !isLoadingRollbackOptions" class="mb-4 text-sm text-amber-600">
          No previous state available from history.
        </div>
        <div v-else class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Roll back to state</label>
          <select
            v-model="selectedPreviousState"
            class="input w-full"
          >
            <option value="">Select state...</option>
            <option v-for="state in rollbackOptions" :key="state" :value="state">{{ state }}</option>
          </select>
        </div>
        <div class="flex gap-2 justify-end">
          <Button variant="secondary" @click="closeRollbackModal">Cancel</Button>
          <Button
            variant="danger"
            @click="executeRollback"
            :loading="isRollingBack"
            :disabled="!selectedPreviousState"
          >
            Rollback
          </Button>
        </div>
      </div>
    </div>
    
    <!-- Transition Modal -->
    <div
      v-if="selectedTransition"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      @click.self="selectedTransition = null"
    >
      <div class="bg-white rounded-lg max-w-md w-full p-6">
        <h4 class="text-lg font-bold mb-4">Confirm Transition</h4>
        <p class="mb-4">
          Transition from <strong>{{ currentState }}</strong> to <strong>{{ selectedTransition.toState }}</strong>
        </p>
        <div v-if="selectedTransition.requiresReason" class="mb-4">
          <label class="block text-sm font-medium text-gray-700 mb-1">Reason (Required)</label>
          <textarea
            v-model="transitionReason"
            rows="3"
            class="input w-full"
            placeholder="Enter reason for transition..."
            required
          ></textarea>
        </div>
        <div class="flex gap-2 justify-end">
          <Button variant="secondary" @click="selectedTransition = null">Cancel</Button>
          <Button
            variant="primary"
            @click="executeTransition"
            :loading="isTransitioning"
            :disabled="selectedTransition.requiresReason && !transitionReason.trim()"
          >
            Confirm
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { orderStateApi, type AvailableTransition, type OrderStateHistory } from '@/api/endpoints/order-state'
import { useUIStore } from '@/stores/ui'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Button from '@/components/common/Button.vue'

const props = defineProps<{
  orderId: string
  currentState?: string
}>()

const uiStore = useUIStore()
const isLoading = ref(false)
const isTransitioning = ref(false)
const isRollingBack = ref(false)
const currentState = ref(props.currentState || '')
const availableTransitions = ref<AvailableTransition[]>([])
const selectedTransition = ref<AvailableTransition | null>(null)
const transitionReason = ref('')
const showRollback = ref(false)
const rollbackOptions = ref<string[]>([])
const selectedPreviousState = ref('')
const isLoadingRollbackOptions = ref(false)

const loadTransitions = async () => {
  isLoading.value = true
  try {
    const response = await orderStateApi.getAvailableTransitions(props.orderId)
    if (response.success && response.data) {
      const data = response.data as { currentState?: string; availableTransitions?: string[] } | AvailableTransition[]
      if (Array.isArray(data)) {
        availableTransitions.value = data
      } else if (data && typeof data === 'object' && Array.isArray(data.availableTransitions)) {
        if (data.currentState) currentState.value = data.currentState.toLowerCase()
        availableTransitions.value = data.availableTransitions.map((t: string) => ({
          transition: t,
          toState: t
        }))
      } else {
        availableTransitions.value = []
      }
    }
  } catch (error: any) {
    uiStore.showNotification('error', 'Failed to load available transitions')
    availableTransitions.value = []
  } finally {
    isLoading.value = false
  }
}

const showTransitionModal = (transition: AvailableTransition) => {
  selectedTransition.value = transition
  transitionReason.value = ''
}

const executeTransition = async () => {
  if (!selectedTransition.value) return
  
  isTransitioning.value = true
  try {
    const response = await orderStateApi.transitionOrderState(
      props.orderId,
      selectedTransition.value.toState,
      transitionReason.value || undefined
    )
    if (response.success) {
      uiStore.showNotification('success', 'Order state transitioned successfully')
      selectedTransition.value = null
      await loadTransitions()
      // Emit event to refresh order data
      emit('state-changed')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to transition order state')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to transition order state')
  } finally {
    isTransitioning.value = false
  }
}

const showRollbackModal = async () => {
  showRollback.value = true
  rollbackOptions.value = []
  selectedPreviousState.value = ''
  isLoadingRollbackOptions.value = true
  try {
    const response = await orderStateApi.getOrderStateHistory(props.orderId)
    if (response.success && Array.isArray(response.data)) {
      const history = response.data as OrderStateHistory[]
      const fromStates = [...new Set(history.map(h => h.fromState).filter(Boolean))]
      rollbackOptions.value = fromStates
      if (fromStates.length === 1) selectedPreviousState.value = fromStates[0]
    }
  } catch {
    uiStore.showNotification('error', 'Failed to load state history')
  } finally {
    isLoadingRollbackOptions.value = false
  }
}

const closeRollbackModal = () => {
  showRollback.value = false
  selectedPreviousState.value = ''
  rollbackOptions.value = []
}

const executeRollback = async () => {
  if (!selectedPreviousState.value) return
  
  isRollingBack.value = true
  try {
    const response = await orderStateApi.rollbackOrderState(props.orderId, selectedPreviousState.value)
    if (response.success) {
      uiStore.showNotification('success', 'Order state rolled back successfully')
      closeRollbackModal()
      await loadTransitions()
      emit('state-changed')
    } else {
      uiStore.showNotification('error', response.error || 'Failed to rollback order state')
    }
  } catch (error: any) {
    uiStore.showNotification('error', error.message || 'Failed to rollback order state')
  } finally {
    isRollingBack.value = false
  }
}

const emit = defineEmits<{
  (e: 'state-changed'): void
}>()

onMounted(() => {
  loadTransitions()
})
</script>

