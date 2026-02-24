<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-6">
    <!-- General error message -->
    <div v-if="apiError" class="p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
      <div class="flex items-center">
        <svg class="h-5 w-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
        </svg>
        <p class="text-red-700 font-medium">{{ apiError }}</p>
      </div>
    </div>

    <!-- Basic Information -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
      
      <Input
        v-model="form.name"
        label="Gateway Name"
        placeholder="e.g., Stripe Production"
        :error="errors.name"
        required
      />

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Gateway Type <span class="text-red-500">*</span>
        </label>
        <select
          v-model="form.type"
          @change="handleTypeChange"
          class="input"
          :class="{ 'border-red-500': errors.type }"
          required
        >
          <option value="">Select gateway type</option>
          <option value="STRIPE">Stripe</option>
          <option value="RAZORPAY">Razorpay</option>
          <option value="PAYPAL">PayPal</option>
          <option value="PHONEPE">PhonePe</option>
          <option value="GPAY">Google Pay</option>
          <option value="PAYTM">Paytm</option>
          <option value="PAYU">PayU</option>
          <option value="UPI">UPI</option>
          <option value="BANK_TRANSFER">Bank Transfer</option>
          <option value="COD">Cash on Delivery</option>
          <option value="CRYPTO">Cryptocurrency</option>
        </select>
        <p v-if="errors.type" class="text-red-600 text-sm mt-1">{{ errors.type }}</p>
      </div>

      <div class="flex items-center">
        <input
          v-model="form.isActive"
          type="checkbox"
          id="isActive"
          class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
        />
        <label for="isActive" class="ml-2 block text-sm text-gray-900">
          Active (Enable this payment gateway)
        </label>
      </div>
    </div>

    <!-- Gateway-Specific Configuration -->
    <div v-if="form.type" class="space-y-4">
      <div class="flex items-center justify-between border-b pb-2">
        <h3 class="text-lg font-semibold text-gray-900">Configuration</h3>
        <button
          type="button"
          @click="showHelp[form.type] = !showHelp[form.type]"
          class="text-sm text-primary-600 hover:text-primary-800 flex items-center"
        >
          <svg class="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {{ showHelp[form.type] ? 'Hide' : 'Show' }} Help
        </button>
      </div>

      <!-- Schema-driven Configuration (from backend config-schema API) -->
      <div v-if="form.type && (schemaLoading || configSchema?.fields?.length)" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="schemaLoading" class="text-sm text-gray-500">Loading configuration fields...</div>
        <template v-else-if="configSchema?.fields?.length">
          <div
            v-for="field in configSchema.fields"
            :key="field.name"
            class="space-y-1"
          >
            <label class="block text-sm font-medium text-gray-700">
              {{ field.label || field.name }}
              <span v-if="field.required" class="text-red-500">*</span>
            </label>
            <select
              v-if="field.type === 'enum' && field.enum?.length"
              v-model="form.config[field.name]"
              class="input"
              :class="{ 'border-red-500': errors['config.' + field.name] }"
            >
              <option value="">Select...</option>
              <option v-for="opt in field.enum" :key="opt" :value="opt">{{ opt }}</option>
            </select>
            <Input
              v-else
              v-model="form.config[field.name]"
              :type="isSensitiveConfigField(field.name) ? 'password' : 'text'"
              :placeholder="'Enter ' + (field.label || field.name)"
              :error="errors['config.' + field.name]"
              :required="field.required"
            />
            <p v-if="field.description" class="text-gray-500 text-xs mt-1">{{ field.description }}</p>
          </div>
        </template>
      </div>
      
      <!-- Stripe Configuration (fallback when no schema) -->
      <div v-if="form.type === 'STRIPE' && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="showHelp.STRIPE" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="text-sm text-blue-800 font-medium mb-2">How to get Stripe credentials:</p>
          <ol class="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Log in to your <a href="https://dashboard.stripe.com" target="_blank" class="underline">Stripe Dashboard</a></li>
            <li>Go to <strong>Developers → API keys</strong></li>
            <li>Copy your <strong>Publishable key</strong> (starts with pk_)</li>
            <li>Click "Reveal test key" or "Reveal live key" to get your <strong>Secret key</strong> (starts with sk_)</li>
            <li>Use <strong>Test keys</strong> for Sandbox and <strong>Live keys</strong> for Production</li>
          </ol>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Secret Key <span class="text-red-500">*</span>
            <span class="text-gray-500 font-normal text-xs ml-2">(starts with sk_live_ or sk_test_)</span>
          </label>
          <Input
            v-model="form.config.secretKey"
            type="password"
            placeholder="sk_live_51AbC..."
            :error="errors['config.secretKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Stripe secret key. Keep this secure and never share it publicly.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Publishable Key <span class="text-red-500">*</span>
            <span class="text-gray-500 font-normal text-xs ml-2">(starts with pk_live_ or pk_test_)</span>
          </label>
          <Input
            v-model="form.config.publishableKey"
            placeholder="pk_live_51AbC..."
            :error="errors['config.publishableKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Stripe publishable key. This can be safely used in frontend code.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select v-model="form.config.environment" class="input">
            <option value="sandbox">Sandbox (Test Mode)</option>
            <option value="production">Production (Live Mode)</option>
          </select>
          <p class="text-gray-500 text-xs mt-1">Use Sandbox for testing with test cards. Use Production for real payments.</p>
        </div>
      </div>

      <!-- Razorpay Configuration (fallback when no schema) -->
      <div v-if="form.type === 'RAZORPAY' && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="showHelp.RAZORPAY" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="text-sm text-blue-800 font-medium mb-2">How to get Razorpay credentials:</p>
          <ol class="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Log in to your <a href="https://dashboard.razorpay.com" target="_blank" class="underline">Razorpay Dashboard</a></li>
            <li>Go to <strong>Settings → API Keys</strong></li>
            <li>Click "Generate Test Key" or use existing keys</li>
            <li>Copy your <strong>Key ID</strong> (starts with rzp_test_ or rzp_live_)</li>
            <li>Copy your <strong>Key Secret</strong> (keep this secure)</li>
          </ol>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Key ID <span class="text-red-500">*</span>
            <span class="text-gray-500 font-normal text-xs ml-2">(starts with rzp_live_ or rzp_test_)</span>
          </label>
          <Input
            v-model="form.config.keyId"
            placeholder="rzp_live_AbC123..."
            :error="errors['config.keyId']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Razorpay Key ID from the dashboard.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Key Secret <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.keySecret"
            type="password"
            placeholder="Enter your key secret"
            :error="errors['config.keySecret']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Razorpay Key Secret. Keep this secure and never share it publicly.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select v-model="form.config.environment" class="input">
            <option value="sandbox">Sandbox (Test Mode)</option>
            <option value="production">Production (Live Mode)</option>
          </select>
          <p class="text-gray-500 text-xs mt-1">Use Sandbox for testing. Use Production for real payments.</p>
        </div>
      </div>

      <!-- PhonePe Configuration (fallback when no schema) -->
      <div v-if="form.type === 'PHONEPE' && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="showHelp.PHONEPE" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="text-sm text-blue-800 font-medium mb-2">How to get PhonePe credentials:</p>
          <ol class="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Log in to your <a href="https://merchant.phonepe.com" target="_blank" class="underline">PhonePe Merchant Dashboard</a></li>
            <li>Go to <strong>Settings → API Credentials</strong></li>
            <li>Copy your <strong>Merchant ID</strong></li>
            <li>Copy your <strong>Merchant Key</strong> (API Key)</li>
            <li>Copy your <strong>Salt Key</strong> and <strong>Salt Index</strong> from the API settings</li>
            <li>Use <strong>Sandbox</strong> credentials for testing and <strong>Production</strong> for live payments</li>
          </ol>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant ID <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantId"
            placeholder="MXXXXXXXXXX"
            :error="errors['config.merchantId']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your PhonePe Merchant ID from the dashboard.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantKey"
            type="password"
            placeholder="Enter merchant key"
            :error="errors['config.merchantKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your PhonePe Merchant Key (API Key). Keep this secure.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            API Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.apiKey"
            type="password"
            placeholder="Enter API key"
            :error="errors['config.apiKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your PhonePe API Key from the dashboard.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Salt Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.saltKey"
            type="password"
            placeholder="Enter salt key"
            :error="errors['config.saltKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your PhonePe Salt Key used for request signing.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Salt Index <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.saltIndex"
            placeholder="1"
            :error="errors['config.saltIndex']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">The Salt Index (usually 1) associated with your Salt Key.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select v-model="form.config.environment" class="input">
            <option value="sandbox">Sandbox (Test Mode)</option>
            <option value="production">Production (Live Mode)</option>
          </select>
          <p class="text-gray-500 text-xs mt-1">Use Sandbox for testing. Use Production for real payments.</p>
        </div>
      </div>

      <!-- GPay Configuration (fallback when no schema) -->
      <div v-if="form.type === 'GPAY' && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="showHelp.GPAY" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="text-sm text-blue-800 font-medium mb-2">How to get Google Pay credentials:</p>
          <ol class="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Log in to <a href="https://pay.google.com/business/console" target="_blank" class="underline">Google Pay Business Console</a></li>
            <li>Go to <strong>Settings → API Credentials</strong></li>
            <li>Copy your <strong>Merchant ID</strong></li>
            <li>Copy your <strong>Merchant Key</strong> and <strong>API Key</strong></li>
            <li>Use <strong>Sandbox</strong> credentials for testing and <strong>Production</strong> for live payments</li>
          </ol>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant ID <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantId"
            placeholder="Enter merchant ID"
            :error="errors['config.merchantId']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Google Pay Merchant ID from the business console.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantKey"
            type="password"
            placeholder="Enter merchant key"
            :error="errors['config.merchantKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Google Pay Merchant Key. Keep this secure.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            API Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.apiKey"
            type="password"
            placeholder="Enter API key"
            :error="errors['config.apiKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Google Pay API Key from the dashboard.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select v-model="form.config.environment" class="input">
            <option value="sandbox">Sandbox (Test Mode)</option>
            <option value="production">Production (Live Mode)</option>
          </select>
          <p class="text-gray-500 text-xs mt-1">Use Sandbox for testing. Use Production for real payments.</p>
        </div>
      </div>

      <!-- Paytm Configuration (fallback when no schema) -->
      <div v-if="form.type === 'PAYTM' && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div v-if="showHelp.PAYTM" class="mb-4 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
          <p class="text-sm text-blue-800 font-medium mb-2">How to get Paytm credentials:</p>
          <ol class="text-sm text-blue-700 list-decimal list-inside space-y-1">
            <li>Log in to your <a href="https://dashboard.paytm.com" target="_blank" class="underline">Paytm Dashboard</a></li>
            <li>Go to <strong>Settings → API Keys</strong></li>
            <li>Copy your <strong>Merchant ID</strong> and <strong>Merchant Key</strong></li>
            <li>Go to <strong>Settings → Website Details</strong> to get your <strong>Website</strong> name</li>
            <li>Set <strong>Industry Type</strong> (e.g., Retail, E-commerce)</li>
            <li>Set <strong>Channel ID</strong> (usually WEB or WAP)</li>
            <li>Use <strong>Sandbox</strong> credentials for testing and <strong>Production</strong> for live payments</li>
          </ol>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant ID <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantId"
            placeholder="Enter merchant ID"
            :error="errors['config.merchantId']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Paytm Merchant ID from the dashboard.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Merchant Key <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.merchantKey"
            type="password"
            placeholder="Enter merchant key"
            :error="errors['config.merchantKey']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your Paytm Merchant Key. Keep this secure.</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Website <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.website"
            placeholder="WEBSTAGING or DEFAULT"
            :error="errors['config.website']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your website name from Paytm dashboard (e.g., WEBSTAGING for test, DEFAULT for production).</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Industry Type <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.industryType"
            placeholder="Retail"
            :error="errors['config.industryType']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Your business industry type (e.g., Retail, E-commerce, Entertainment).</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Channel ID <span class="text-red-500">*</span>
          </label>
          <Input
            v-model="form.config.channelId"
            placeholder="WEB or WAP"
            :error="errors['config.channelId']"
            required
          />
          <p class="text-gray-500 text-xs mt-1">Channel ID (usually WEB for web payments, WAP for mobile).</p>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Environment</label>
          <select v-model="form.config.environment" class="input">
            <option value="sandbox">Sandbox (Test Mode)</option>
            <option value="production">Production (Live Mode)</option>
          </select>
          <p class="text-gray-500 text-xs mt-1">Use Sandbox for testing. Use Production for real payments.</p>
        </div>
      </div>

      <!-- Generic Configuration for other types (fallback when no schema) -->
      <div v-if="!['STRIPE', 'RAZORPAY', 'PHONEPE', 'GPAY', 'PAYTM'].includes(form.type) && !schemaLoading && !configSchema?.fields?.length" class="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Configuration (JSON)</label>
          <textarea
            v-model="configJson"
            @input="updateConfigFromJson"
            class="input font-mono text-sm"
            rows="6"
            placeholder='{"key": "value"}'
          ></textarea>
          <p class="text-gray-500 text-xs mt-1">Enter configuration as JSON object</p>
        </div>
      </div>
    </div>

    <!-- Additional Settings -->
    <div class="space-y-4">
      <h3 class="text-lg font-semibold text-gray-900 border-b pb-2">Additional Settings</h3>
      
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Webhook Secret (Optional)
        </label>
        <Input
          v-model="form.webhookSecret"
          type="password"
          placeholder="whsec_..."
        />
        <p class="text-gray-500 text-xs mt-1">
          Webhook secret for verifying payment webhooks from the gateway. 
          <span v-if="form.type === 'STRIPE'">Find this in Stripe Dashboard → Developers → Webhooks → Signing secret</span>
          <span v-else-if="form.type === 'RAZORPAY'">Find this in Razorpay Dashboard → Settings → Webhooks</span>
          <span v-else>Configure this in your gateway's webhook settings</span>
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Supported Currencies
        </label>
        <input
          v-model="currenciesInput"
          type="text"
          placeholder="USD, INR, EUR (comma-separated)"
          class="input"
          @input="updateCurrencies"
        />
        <p class="text-gray-500 text-xs mt-1">
          Enter currency codes (ISO 4217) separated by commas. 
          <span class="font-medium">Examples:</span> USD, INR, EUR, GBP, JPY
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Supported Payment Methods
        </label>
        <input
          v-model="methodsInput"
          type="text"
          placeholder="card, upi, wallet, netbanking (comma-separated)"
          class="input"
          @input="updateMethods"
        />
        <p class="text-gray-500 text-xs mt-1">
          Enter payment methods separated by commas. 
          <span class="font-medium">Common methods:</span> card, upi, wallet, netbanking, emi, cod
        </p>
      </div>
    </div>

    <!-- Form Actions -->
    <div class="flex justify-end space-x-4 pt-4 border-t">
      <Button type="button" variant="secondary" @click="$emit('cancel')">
        Cancel
      </Button>
      <Button type="submit" variant="primary" :loading="isSubmitting">
        {{ gateway ? 'Update Gateway' : 'Create Gateway' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import { paymentGatewaysApi } from '@/api/endpoints/payment-gateways'
import type { PaymentGateway, PaymentGatewayConfig, PaymentGatewayType, PaymentGatewayConfigSchema } from '@/api/types'

interface Props {
  gateway?: PaymentGateway | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: [data: PaymentGatewayConfig]
  cancel: []
}>()

const apiError = ref<string | null>(null)
const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref<PaymentGatewayConfig & { config: Record<string, any> }>({
  name: '',
  type: '' as PaymentGatewayType,
  config: {},
  webhookSecret: '',
  supportedCurrencies: [],
  supportedMethods: [],
  isActive: true
})

const configJson = ref('')
const currenciesInput = ref('')
const methodsInput = ref('')
const configSchema = ref<PaymentGatewayConfigSchema | null>(null)
const schemaLoading = ref(false)
const showHelp = ref<Record<string, boolean>>({
  STRIPE: false,
  RAZORPAY: false,
  PHONEPE: false,
  GPAY: false,
  PAYTM: false
})

function isSensitiveConfigField(name: string): boolean {
  return /key|salt|secret|password/i.test(name)
}

async function loadConfigSchema(type: string) {
  if (!type?.trim()) {
    configSchema.value = null
    return
  }
  schemaLoading.value = true
  configSchema.value = null
  try {
    const res = await paymentGatewaysApi.getConfigSchema(type)
    if (res.success && res.data?.fields?.length) {
      configSchema.value = res.data
      // Ensure form.config has keys for each field so v-model works
      const config = { ...form.value.config }
      for (const field of res.data.fields) {
        if (!(field.name in config) && config[field.name] === undefined) {
          config[field.name] = field.type === 'enum' && field.enum?.length ? '' : ''
        }
      }
      form.value.config = config
    }
  } catch {
    configSchema.value = null
  } finally {
    schemaLoading.value = false
  }
}

const gateway = computed(() => props.gateway)

// Define resetForm before it's used in watch
const resetForm = () => {
  form.value = {
    name: '',
    type: '' as PaymentGatewayType,
    config: {},
    webhookSecret: '',
    supportedCurrencies: [],
    supportedMethods: [],
    isActive: true
  }
  configJson.value = ''
  currenciesInput.value = ''
  methodsInput.value = ''
  configSchema.value = null
  errors.value = {}
  apiError.value = null
}

// Initialize form from gateway prop
watch(() => props.gateway, (newGateway) => {
  if (newGateway) {
    form.value = {
      name: newGateway.name || '',
      type: newGateway.type || '' as PaymentGatewayType,
      config: newGateway.config || {},
      webhookSecret: newGateway.webhookSecret || '',
      supportedCurrencies: newGateway.supportedCurrencies || [],
      supportedMethods: newGateway.supportedMethods || [],
      isActive: newGateway.isActive ?? true
    }
    
    // Mask sensitive fields in display
    if (form.value.config) {
      const maskedConfig = { ...form.value.config }
      if (maskedConfig.secretKey) maskedConfig.secretKey = '••••••••'
      if (maskedConfig.keySecret) maskedConfig.keySecret = '••••••••'
      if (maskedConfig.merchantKey) maskedConfig.merchantKey = '••••••••'
      if (maskedConfig.apiKey) maskedConfig.apiKey = '••••••••'
      if (maskedConfig.saltKey) maskedConfig.saltKey = '••••••••'
      configJson.value = JSON.stringify(maskedConfig, null, 2)
    }
    
    currenciesInput.value = (newGateway.supportedCurrencies || []).join(', ')
    methodsInput.value = (newGateway.supportedMethods || []).join(', ')
    if (newGateway.type) loadConfigSchema(newGateway.type)
  } else {
    resetForm()
    configSchema.value = null
  }
}, { immediate: true })

const handleTypeChange = () => {
  // Reset config when type changes
  form.value.config = {}
  configJson.value = ''
  configSchema.value = null

  if (form.value.type) {
    form.value.config.environment = 'sandbox'
    loadConfigSchema(form.value.type)
  }
}

const updateConfigFromJson = () => {
  try {
    if (configJson.value.trim()) {
      form.value.config = JSON.parse(configJson.value)
    }
  } catch (e) {
    // Invalid JSON, ignore
  }
}

const updateCurrencies = () => {
  form.value.supportedCurrencies = currenciesInput.value
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0)
}

const updateMethods = () => {
  form.value.supportedMethods = methodsInput.value
    .split(',')
    .map(m => m.trim())
    .filter(m => m.length > 0)
}

const validate = (): boolean => {
  errors.value = {}
  
  if (!form.value.name?.trim()) {
    errors.value.name = 'Gateway name is required'
  }
  
  if (!form.value.type) {
    errors.value.type = 'Gateway type is required'
  }
  
  // Validate schema-driven config when schema is present
  if (configSchema.value?.fields?.length) {
    for (const field of configSchema.value.fields) {
      if (field.required) {
        const val = form.value.config[field.name]
        if (val === undefined || val === null || String(val).trim() === '') {
          errors.value['config.' + field.name] = (field.label || field.name) + ' is required'
        }
      }
    }
  } else if (form.value.type === 'STRIPE') {
    if (!form.value.config.secretKey) errors.value['config.secretKey'] = 'Secret key is required'
    if (!form.value.config.publishableKey) errors.value['config.publishableKey'] = 'Publishable key is required'
  } else if (form.value.type === 'RAZORPAY') {
    if (!form.value.config.keyId) errors.value['config.keyId'] = 'Key ID is required'
    if (!form.value.config.keySecret) errors.value['config.keySecret'] = 'Key secret is required'
  } else if (form.value.type === 'PHONEPE') {
    if (!form.value.config.merchantId) errors.value['config.merchantId'] = 'Merchant ID is required'
    if (!form.value.config.merchantKey) errors.value['config.merchantKey'] = 'Merchant key is required'
    if (!form.value.config.apiKey) errors.value['config.apiKey'] = 'API key is required'
    if (!form.value.config.saltKey) errors.value['config.saltKey'] = 'Salt key is required'
    if (!form.value.config.saltIndex) errors.value['config.saltIndex'] = 'Salt index is required'
  } else if (form.value.type === 'GPAY') {
    if (!form.value.config.merchantId) errors.value['config.merchantId'] = 'Merchant ID is required'
    if (!form.value.config.merchantKey) errors.value['config.merchantKey'] = 'Merchant key is required'
    if (!form.value.config.apiKey) errors.value['config.apiKey'] = 'API key is required'
  } else if (form.value.type === 'PAYTM') {
    if (!form.value.config.merchantId) errors.value['config.merchantId'] = 'Merchant ID is required'
    if (!form.value.config.merchantKey) errors.value['config.merchantKey'] = 'Merchant key is required'
    if (!form.value.config.website) errors.value['config.website'] = 'Website is required'
    if (!form.value.config.industryType) errors.value['config.industryType'] = 'Industry type is required'
    if (!form.value.config.channelId) errors.value['config.channelId'] = 'Channel ID is required'
  }
  
  return Object.keys(errors.value).length === 0
}

const handleSubmit = () => {
  apiError.value = null
  errors.value = {}
  
  if (!validate()) {
    return
  }
  
  isSubmitting.value = true
  
  const submitData: PaymentGatewayConfig = {
    name: form.value.name,
    type: form.value.type,
    config: form.value.config,
    webhookSecret: form.value.webhookSecret || undefined,
    supportedCurrencies: form.value.supportedCurrencies.length > 0 ? form.value.supportedCurrencies : undefined,
    supportedMethods: form.value.supportedMethods.length > 0 ? form.value.supportedMethods : undefined,
    isActive: form.value.isActive
  }
  
  emit('submit', submitData)
  
  isSubmitting.value = false
}

onMounted(() => {
  if (props.gateway) {
    // Form will be initialized by watcher
  } else {
    resetForm()
  }
})
</script>

