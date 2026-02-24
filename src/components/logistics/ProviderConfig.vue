<template>
  <div class="space-y-4">
    <div v-if="providerType === 'SHIPROCKET'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <Input
          v-model="config.email"
          type="email"
          placeholder="merchant@example.com"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <Input
          v-model="config.password"
          type="password"
          placeholder="Enter password"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <Input
          v-model="config.apiKey"
          type="text"
          placeholder="Enter API key"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
        <select
          v-model="config.environment"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="production">Production</option>
          <option value="sandbox">Sandbox</option>
        </select>
      </div>
    </div>

    <div v-else-if="providerType === 'DELHIVERY'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Client ID</label>
        <Input
          v-model="config.clientId"
          type="text"
          placeholder="Enter client ID"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Client Secret</label>
        <Input
          v-model="config.clientSecret"
          type="password"
          placeholder="Enter client secret"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <Input
          v-model="config.apiKey"
          type="text"
          placeholder="Enter API key"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
        <select
          v-model="config.environment"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="production">Production</option>
          <option value="sandbox">Sandbox</option>
        </select>
      </div>
    </div>

    <div v-else-if="providerType === 'CLICKPOST'" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">API Key</label>
        <Input
          v-model="config.apiKey"
          type="text"
          placeholder="Enter API key"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Secret Key</label>
        <Input
          v-model="config.secretKey"
          type="password"
          placeholder="Enter secret key"
          required
        />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Environment</label>
        <select
          v-model="config.environment"
          class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          required
        >
          <option value="production">Production</option>
          <option value="sandbox">Sandbox</option>
        </select>
      </div>
    </div>

    <div v-else class="text-gray-500 text-sm">
      Configuration for {{ providerType }} will be available when implemented.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import Input from '@/components/common/Input.vue'
import type { LogisticsProviderConfig, LogisticsProviderType } from '@/api/types'

const props = defineProps<{
  providerType: LogisticsProviderType | string
  modelValue: LogisticsProviderConfig
}>()

const emit = defineEmits<{
  'update:modelValue': [value: LogisticsProviderConfig]
}>()

const config = ref<LogisticsProviderConfig>({ ...props.modelValue })

watch(config, (newConfig) => {
  emit('update:modelValue', newConfig)
}, { deep: true })

watch(() => props.modelValue, (newValue) => {
  config.value = { ...newValue }
}, { deep: true })
</script>
