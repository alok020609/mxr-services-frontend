export interface SetupStep {
  id: string
  title: string
  description: string
  component: string
  validate?: () => Promise<boolean> | boolean
}

export const setupSteps: SetupStep[] = [
  {
    id: 'api-connection',
    title: 'API Connection',
    description: 'Connect to your backend API',
    component: 'ApiConnection',
    validate: async () => {
      // Validate API connection
      return true
    }
  },
  {
    id: 'store-info',
    title: 'Store Information',
    description: 'Configure your store details',
    component: 'StoreInfo',
    validate: async () => {
      // Validate store info
      return true
    }
  },
  {
    id: 'payment',
    title: 'Payment Gateways',
    description: 'Set up payment methods',
    component: 'PaymentSetup',
    validate: async () => {
      // Validate payment setup
      return true
    }
  },
  {
    id: 'shipping',
    title: 'Shipping Methods',
    description: 'Configure shipping options',
    component: 'ShippingSetup',
    validate: async () => {
      // Validate shipping setup
      return true
    }
  },
  {
    id: 'features',
    title: 'Feature Selection',
    description: 'Enable or disable features',
    component: 'FeatureSelection',
    validate: async () => {
      // Always valid
      return true
    }
  },
  {
    id: 'admin',
    title: 'Admin Account',
    description: 'Create your admin account',
    component: 'AdminAccount',
    validate: async () => {
      // Validate admin account
      return true
    }
  }
]

export const getStepIndex = (stepId: string): number => {
  return setupSteps.findIndex(step => step.id === stepId)
}

export const getStepById = (stepId: string): SetupStep | undefined => {
  return setupSteps.find(step => step.id === stepId)
}

