export interface SetupStep {
  id: string
  title: string
  description: string
  validate?: () => Promise<boolean> | boolean
}

export const setupSteps: SetupStep[] = [
  { id: 'welcome', title: 'Welcome', description: 'Configure your store basics.' },
  { id: 'api', title: 'API & Backend', description: 'Connect your backend API URL.' },
  { id: 'complete', title: 'Complete', description: 'You are all set!' }
]
