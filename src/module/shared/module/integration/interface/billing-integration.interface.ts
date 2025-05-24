export interface BillingSubscriptionStatusApi {
  isUserSubscriptionActive(userId: string): Promise<boolean>
}

export const BillingSubscriptionStatusApi = Symbol(
  'BillingSubscriptionStatusApi'
)
