<template>
  <form @submit.prevent="handleSubmit" novalidate class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Input
        v-model="form.firstName"
        label="First Name"
        :error="errors.firstName"
        placeholder="Enter first name"
      />
      <Input
        v-model="form.lastName"
        label="Last Name"
        :error="errors.lastName"
        placeholder="Enter last name"
      />
    </div>
    
    <Input
      v-model="form.email"
      type="email"
      label="Email Address"
      :error="errors.email"
      placeholder="user@example.com"
    />
    
    <Input
      v-model="form.phone"
      type="tel"
      label="Phone Number"
      :error="errors.phone"
      placeholder="+1234567890"
    />
    
    <Input
      v-if="!isEdit"
      v-model="form.password"
      type="password"
      label="Password"
      :error="errors.password"
      placeholder="Enter password"
    />
    
    <div v-if="isEdit" class="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <p class="text-sm text-blue-800">
        <svg class="h-4 w-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
        </svg>
        Leave password blank to keep current password
      </p>
    </div>
    
    <Input
      v-if="isEdit"
      v-model="form.password"
      type="password"
      label="New Password (optional)"
      :error="errors.password"
      placeholder="Leave blank to keep current password"
    />
    
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-2">Role</label>
      <select v-model="form.role" class="input" :class="{ 'border-red-500': errors.role }">
        <option value="user">User</option>
        <option value="admin">Admin</option>
        <option value="vendor">Vendor</option>
      </select>
      <p v-if="errors.role" class="text-red-500 text-sm mt-1">{{ errors.role }}</p>
    </div>
    
    <div v-if="isEdit" class="grid grid-cols-2 gap-4">
      <div>
        <label class="flex items-center space-x-2">
          <input
            v-model="form.isVerified"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="text-sm font-medium text-gray-700">Email Verified</span>
        </label>
      </div>
      <div>
        <label class="flex items-center space-x-2">
          <input
            v-model="form.isActive"
            type="checkbox"
            class="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
          />
          <span class="text-sm font-medium text-gray-700">Active</span>
        </label>
      </div>
    </div>
    
    <div class="flex justify-end space-x-4 pt-4 border-t">
      <Button type="button" variant="secondary" @click="$emit('cancel')">Cancel</Button>
      <Button type="submit" variant="primary" :loading="isLoading">
        {{ isEdit ? 'Update User' : 'Create User' }}
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import Input from '@/components/common/Input.vue'
import Button from '@/components/common/Button.vue'
import type { User } from '@/api/types'

const props = defineProps<{
  user?: User
}>()

const emit = defineEmits<{
  submit: [user: any]
  cancel: []
}>()

const isEdit = computed(() => !!props.user)
const isLoading = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  password: '',
  role: 'user' as 'user' | 'admin' | 'vendor',
  isVerified: false,
  isActive: true
})

// Extract firstName and lastName from name if available
const extractName = (name: string) => {
  if (!name) return { firstName: '', lastName: '' }
  const parts = name.trim().split(' ')
  return {
    firstName: parts[0] || '',
    lastName: parts.slice(1).join(' ') || ''
  }
}

onMounted(() => {
  if (props.user) {
    const nameParts = extractName(props.user.name)
    form.value = {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: props.user.email,
      phone: (props.user as any).phone || '',
      password: '',
      role: props.user.role,
      // Backend uses emailVerified, but we normalize to isVerified in frontend
      isVerified: props.user.isVerified || (props.user as any).emailVerified || false,
      isActive: props.user.isActive
    }
  }
})

watch(() => props.user, (newUser) => {
  if (newUser) {
    const nameParts = extractName(newUser.name)
    form.value = {
      firstName: nameParts.firstName,
      lastName: nameParts.lastName,
      email: newUser.email,
      phone: (newUser as any).phone || '',
      password: '',
      role: newUser.role,
      // Backend uses emailVerified, but we normalize to isVerified in frontend
      isVerified: newUser.isVerified || (newUser as any).emailVerified || false,
      isActive: newUser.isActive
    }
  } else {
    form.value = {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      role: 'user',
      isVerified: false,
      isActive: true
    }
  }
}, { immediate: true })

const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

const handleSubmit = () => {
  errors.value = {}
  
  // Validation
  if (!form.value.firstName?.trim()) {
    errors.value.firstName = 'First name is required'
  }
  
  if (!form.value.lastName?.trim()) {
    errors.value.lastName = 'Last name is required'
  }
  
  if (!form.value.email?.trim()) {
    errors.value.email = 'Email is required'
  } else if (!validateEmail(form.value.email)) {
    errors.value.email = 'Please enter a valid email address'
  }
  
  if (!isEdit.value && !form.value.password) {
    errors.value.password = 'Password is required for new users'
  }
  
  if (form.value.password && form.value.password.length < 6) {
    errors.value.password = 'Password must be at least 6 characters'
  }
  
  if (Object.keys(errors.value).length > 0) {
    return
  }
  
  // Prepare submit data
  const submitData: any = {
    firstName: form.value.firstName.trim(),
    lastName: form.value.lastName.trim(),
    email: form.value.email.trim(),
    role: form.value.role.toUpperCase() // Backend expects uppercase (ADMIN, USER, VENDOR)
  }
  
  if (form.value.phone) {
    submitData.phone = form.value.phone.trim()
  }
  
  if (form.value.password) {
    submitData.password = form.value.password
  }
  
  if (isEdit.value) {
    // Backend uses emailVerified (not isVerified) for updates
    submitData.emailVerified = form.value.isVerified
    submitData.isActive = form.value.isActive
    // Ensure isVerified is not sent (backend expects emailVerified)
    if ('isVerified' in submitData) {
      delete submitData.isVerified
    }
  }
  
  emit('submit', submitData)
}
</script>
