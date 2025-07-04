import { SubscriptionStatus } from '@billingModule/core/enum/subscription-status.enum'
import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm'
import { Plan } from './plan.entity'

@Entity({ name: 'Subscription' })
export class Subscription extends DefaultEntity<Subscription> {
  @Column()
  userId: string

  @Column()
  planId: string

  @Column({
    type: 'enum',
    enum: SubscriptionStatus,
    default: SubscriptionStatus.Inactive
  })
  status: SubscriptionStatus

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  startDate: Date

  @Column({ type: 'timestamp', nullable: true })
  endDate: Date | null

  @Column({ default: true })
  autoRenew: boolean

  @ManyToOne(() => Plan, (plan) => plan.subscriptions)
  @JoinColumn({ name: 'planId' })
  plan: Plan
}
