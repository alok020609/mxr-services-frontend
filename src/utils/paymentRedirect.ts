/**
 * Build a form with redirectUrl and formData, append to document body, and submit.
 * Used for PayU and similar gateways that require POST redirect to their checkout.
 */
export function submitPaymentRedirectForm(redirectUrl: string, formData: Record<string, string>): void {
  const form = document.createElement('form')
  form.method = 'POST'
  form.action = redirectUrl
  for (const [name, value] of Object.entries(formData)) {
    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = name
    input.value = value
    form.appendChild(input)
  }
  document.body.appendChild(form)
  form.submit()
}
