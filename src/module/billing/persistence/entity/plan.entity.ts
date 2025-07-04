import { PlanInterval } from '@billingModule/core/enum/plan-interval.enum'
import { Subscription } from '@billingModule/persistence/entity/subscription.entity'
import { DefaultEntity } from '@sharedModules/persistence/typeorm/entity/default.entity'
import { Column, Entity, OneToMany } from 'typeorm'

export class ColumnNumericTransformer {
  to(data: number): number {
    return data
  }
  from(data: string): number {
    return parseFloat(data)
  }
}

@Entity({ name: 'Plan' })
export class Plan extends DefaultEntity<Plan> {
  @Column({ length: 100 })
  name: string

  @Column({ length: 255, nullable: true })
  description: string

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    transformer: new ColumnNumericTransformer()
  })
  amount: number

  @Column({ length: 3 })
  currency: string

  @Column({ type: 'enum', enum: PlanInterval })
  interval: PlanInterval

  @Column({ nullable: true })
  trialPeriod: number

  @OneToMany(() => Subscription, (subscription) => subscription.plan)
  subscriptions: Subscription[]
}
