/**
 * Payment service abstraction.
 * Never put secret keys in frontend code.
 * Integration points for Stripe, WayForPay, LiqPay, etc.
 */

export type PaymentProvider = "stripe" | "wayforpay" | "liqpay" | null

export interface PaymentConfig {
  provider: PaymentProvider
  publicKey?: string
  isConfigured: boolean
}

export function getPaymentConfig(): PaymentConfig {
  // In production these would come from env / backend
  const provider = (import.meta.env.VITE_PAYMENT_PROVIDER as PaymentProvider) || null
  return {
    provider,
    publicKey: import.meta.env.VITE_PAYMENT_PUBLIC_KEY || undefined,
    isConfigured: Boolean(provider && import.meta.env.VITE_PAYMENT_PUBLIC_KEY),
  }
}

export async function createCheckoutSession(_productId: string): Promise<{ url?: string; error?: string }> {
  const config = getPaymentConfig()
  if (!config.isConfigured) {
    return { error: "Payment integration coming soon" }
  }
  // Future: call backend endpoint that creates session with secret key
  return { error: "Backend payment endpoint not configured" }
}
