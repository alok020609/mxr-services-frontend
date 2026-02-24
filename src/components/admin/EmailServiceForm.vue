<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <div v-if="apiError" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <p class="text-red-700 font-medium">{{ apiError }}</p>
    </div>

    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
      <Input
        v-model="form.name"
        label="Service Name"
        placeholder="e.g. Gmail SMTP"
        :error="errors.name"
        required
      />
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.type"
          :disabled="!!service"
          class="input"
          :class="{ 'border-red-500': errors.type, 'bg-gray-100 cursor-not-allowed': service }"
          required
        >
          <option value="">Select type</option>
          <option value="SMTP">SMTP</option>
          <option value="SENDGRID">SendGrid</option>
          <option value="MAILGUN">Mailgun</option>
          <option value="AWS_SES">AWS SES</option>
        </select>
        <p v-if="errors.type" class="text-red-600 text-sm mt-1">{{ errors.type }}</p>
        <p v-if="service" class="text-gray-500 text-xs mt-1">Type cannot be changed when editing.</p>
      </div>
      <div class="flex items-center gap-6">
        <label class="flex items-center gap-2">
          <input v-model="form.isActive" type="checkbox" class="h-4 w-4 text-primary-600 rounded border-gray-300" />
          <span class="text-sm text-gray-700">Active</span>
        </label>
        <label class="flex items-center gap-2">
          <input v-model="form.isDefault" type="checkbox" class="h-4 w-4 text-primary-600 rounded border-gray-300" />
          <span class="text-sm text-gray-700">Default service</span>
        </label>
      </div>
    </div>

    <!-- SMTP -->
    <div v-if="form.type === 'SMTP'" class="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">SMTP Configuration</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          v-model="form.config.host"
          label="Host"
          placeholder="smtp.gmail.com"
          :error="errors['config.host']"
        />
        <Input
          v-model="form.config.port"
          label="Port"
          type="number"
          placeholder="587"
          :error="errors['config.port']"
        />
      </div>
      <div class="flex items-center gap-2">
        <input v-model="form.config.secure" type="checkbox" class="h-4 w-4 text-primary-600 rounded border-gray-300" />
        <span class="text-sm text-gray-700">Use TLS / secure connection</span>
      </div>
      <Input
        v-model="form.config.user"
        label="User"
        placeholder="your-email@gmail.com"
        :error="errors['config.user']"
      />
      <Input
        v-model="form.config.password"
        type="password"
        label="Password"
        :placeholder="isEdit ? 'Leave blank to keep existing' : 'Password'"
        :error="errors['config.password']"
      />
      <Input
        v-model="form.config.from"
        label="From address"
        placeholder="noreply@example.com"
        :error="errors['config.from']"
      />
    </div>

    <!-- SendGrid -->
    <div v-if="form.type === 'SENDGRID'" class="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">SendGrid Configuration</h3>
      <Input
        v-model="form.config.apiKey"
        type="password"
        label="API Key"
        :placeholder="isEdit ? 'Leave blank to keep existing' : 'SG.xxx'"
        :error="errors['config.apiKey']"
      />
      <Input
        v-model="form.config.from"
        label="From address"
        placeholder="noreply@example.com"
        :error="errors['config.from']"
      />
    </div>

    <!-- Mailgun -->
    <div v-if="form.type === 'MAILGUN'" class="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Mailgun Configuration</h3>
      <Input
        v-model="form.config.apiKey"
        type="password"
        label="API Key"
        :placeholder="isEdit ? 'Leave blank to keep existing' : 'key-xxx'"
        :error="errors['config.apiKey']"
      />
      <Input
        v-model="form.config.domain"
        label="Domain"
        placeholder="mg.example.com"
        :error="errors['config.domain']"
      />
      <Input
        v-model="form.config.from"
        label="From address"
        placeholder="noreply@example.com"
        :error="errors['config.from']"
      />
    </div>

    <!-- AWS SES -->
    <div v-if="form.type === 'AWS_SES'" class="space-y-4 bg-gray-50 p-4 rounded-lg">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">AWS SES Configuration</h3>
      <Input
        v-model="form.config.accessKeyId"
        label="Access Key ID"
        placeholder="AKIAxxx"
        :error="errors['config.accessKeyId']"
      />
      <Input
        v-model="form.config.secretAccessKey"
        type="password"
        label="Secret Access Key"
        :placeholder="isEdit ? 'Leave blank to keep existing' : 'Secret key'"
        :error="errors['config.secretAccessKey']"
      />
      <Input
        v-model="form.config.region"
        label="Region"
        placeholder="us-east-1"
        :error="errors['config.region']"
      />
      <Input
        v-model="form.config.from"
        label="From address"
        placeholder="noreply@example.com"
        :error="errors['config.from']"
      />
    </div>

    <div class="flex justify-end gap-4 pt-4 border-t">
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" variant="primary" :loading="isSubmitting">
        {{ service ? 'Update' : 'Create' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type {
  EmailService,
  EmailServiceType,
  EmailServiceCreatePayload,
  EmailServiceConfig
} from '@/api/types'

const props = defineProps<{
  service?: EmailService | null
}>()

const emit = defineEmits<{
  submit: [data: EmailServiceCreatePayload]
  cancel: []
}>()

const apiError = ref<string | null>(null)
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const isEdit = computed(() => !!props.service)

const form = ref<{
  name: string
  type: EmailServiceType | ''
  config: Record<string, unknown>
  isActive: boolean
  isDefault: boolean
}>({
  name: '',
  type: '',
  config: {},
  isActive: false,
  isDefault: false
})

function getDefaultConfigForType(type: EmailServiceType): Record<string, unknown> {
  switch (type) {
    case 'SMTP':
      return { host: '', port: 587, secure: false, user: '', password: '', from: '' }
    case 'SENDGRID':
      return { apiKey: '', from: '' }
    case 'MAILGUN':
      return { apiKey: '', domain: '', from: '' }
    case 'AWS_SES':
      return { accessKeyId: '', secretAccessKey: '', region: '', from: '' }
    default:
      return {}
  }
}

watch(
  () => props.service,
  (s) => {
    if (s) {
      const raw = typeof s.config === 'object' && s.config !== null ? (s.config as Record<string, unknown>) : {}
      form.value = {
        name: s.name || '',
        type: s.type,
        config: {
          ...raw,
          password: '', // never send existing password to client; leave blank to keep on update
          apiKey: raw.apiKey ? '' : '', // omit in form; leave blank to keep on update
          secretAccessKey: raw.secretAccessKey ? '' : ''
        },
        isActive: s.isActive ?? false,
        isDefault: s.isDefault ?? false
      }
    } else {
      form.value = {
        name: '',
        type: '',
        config: {},
        isActive: false,
        isDefault: false
      }
    }
    errors.value = {}
    apiError.value = null
  },
  { immediate: true }
)

watch(
  () => form.value.type,
  (type) => {
    if (type && !props.service) {
      form.value.config = getDefaultConfigForType(type as EmailServiceType)
    }
  }
)

function validate(): boolean {
  errors.value = {}
  if (!form.value.name?.trim()) errors.value.name = 'Name is required'
  if (!form.value.type) errors.value.type = 'Type is required'

  const c = form.value.config as Record<string, unknown>
  switch (form.value.type) {
    case 'SMTP':
      if (!String(c.host || '').trim()) errors.value['config.host'] = 'Host is required'
      if (c.port === undefined || c.port === null || String(c.port).trim() === '') errors.value['config.port'] = 'Port is required'
      if (!String(c.user || '').trim()) errors.value['config.user'] = 'User is required'
      if (!props.service && !String(c.password || '').trim()) errors.value['config.password'] = 'Password is required'
      if (!String(c.from || '').trim()) errors.value['config.from'] = 'From is required'
      break
    case 'SENDGRID':
      if (!props.service && !String(c.apiKey || '').trim()) errors.value['config.apiKey'] = 'API Key is required'
      if (!String(c.from || '').trim()) errors.value['config.from'] = 'From is required'
      break
    case 'MAILGUN':
      if (!props.service && !String(c.apiKey || '').trim()) errors.value['config.apiKey'] = 'API Key is required'
      if (!String(c.domain || '').trim()) errors.value['config.domain'] = 'Domain is required'
      if (!String(c.from || '').trim()) errors.value['config.from'] = 'From is required'
      break
    case 'AWS_SES':
      if (!String(c.accessKeyId || '').trim()) errors.value['config.accessKeyId'] = 'Access Key ID is required'
      if (!props.service && !String(c.secretAccessKey || '').trim()) errors.value['config.secretAccessKey'] = 'Secret is required'
      if (!String(c.region || '').trim()) errors.value['config.region'] = 'Region is required'
      if (!String(c.from || '').trim()) errors.value['config.from'] = 'From is required'
      break
  }
  return Object.keys(errors.value).length === 0
}

function buildConfig(): EmailServiceConfig {
  const c = form.value.config as Record<string, unknown>
  const out: Record<string, unknown> = {}
  const skipIfPlaceholder = (v: unknown) => v === '••••••••' || v === '' || v === undefined
  switch (form.value.type) {
    case 'SMTP':
      out.host = c.host
      out.port = Number(c.port) || 587
      out.secure = !!c.secure
      out.user = c.user
      if (!skipIfPlaceholder(c.password)) out.password = c.password
      out.from = c.from
      break
    case 'SENDGRID':
      if (!skipIfPlaceholder(c.apiKey)) out.apiKey = c.apiKey
      out.from = c.from
      break
    case 'MAILGUN':
      if (!skipIfPlaceholder(c.apiKey)) out.apiKey = c.apiKey
      out.domain = c.domain
      out.from = c.from
      break
    case 'AWS_SES':
      out.accessKeyId = c.accessKeyId
      if (!skipIfPlaceholder(c.secretAccessKey)) out.secretAccessKey = c.secretAccessKey
      out.region = c.region
      out.from = c.from
      break
    default:
      return c as EmailServiceConfig
  }
  return out as EmailServiceConfig
}

function handleSubmit() {
  apiError.value = null
  errors.value = {}
  if (!validate()) return
  isSubmitting.value = true
  const payload: EmailServiceCreatePayload = {
    name: form.value.name.trim(),
    type: form.value.type as EmailServiceType,
    config: buildConfig(),
    isActive: form.value.isActive,
    isDefault: form.value.isDefault
  }
  emit('submit', payload)
  isSubmitting.value = false
}
</script>
